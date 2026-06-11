const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const os = require('os');
const fs = require('fs');
const path = require('path');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const executionRoutes = require('./routes/execution');

const app = express();
const PORT = process.env.PORT || 3001;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const allowedOrigins = [
  'http://202.119.45.130',
  'http://202.119.45.130:5173',
  'http://localhost:5173',
  'http://www.codewriter.asia',
  'https://www.codewriter.asia'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

const TEMP_DIR = path.join(__dirname, 'temp');
const USERS_DIR = path.join(__dirname, 'users');
const PROJECTS_DIR = path.join(__dirname, 'projects');

[TEMP_DIR, USERS_DIR, PROJECTS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api', executionRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const executionSessions = new Map();

const terminals = new Map();

const handleExecutionSession = (ws, sessionId) => {
  let childProcess = null;
  let code = null;
  let language = null;
  let isRunning = false;
  
  const getCommand = (code, lang) => {
    const isWindows = os.platform() === 'win32';
    const fileName = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
    const baseDir = TEMP_DIR;
    
    switch (lang) {
      case 'python':
        return {
          cmd: 'python',
          args: [path.join(baseDir, `${fileName}.py`)],
          files: [{ path: path.join(baseDir, `${fileName}.py`), content: code }]
        };
      case 'cpp':
        return {
          cmd: isWindows ? path.join(baseDir, `${fileName}.exe`) : `./${fileName}`,
          args: [],
          files: [{ path: path.join(baseDir, `${fileName}.cpp`), content: code }]
        };
      case 'c':
        return {
          cmd: isWindows ? path.join(baseDir, `${fileName}.exe`) : `./${fileName}`,
          args: [],
          files: [{ path: path.join(baseDir, `${fileName}.c`), content: code }]
        };
      case 'java':
        return {
          cmd: 'java',
          args: ['-cp', baseDir, 'Main'],
          files: [{ path: path.join(baseDir, 'Main.java'), content: code }]
        };
      default:
        return null;
    }
  };
  
  const cleanup = async () => {
    if (childProcess) {
      try { childProcess.kill(); } catch {}
      childProcess = null;
    }
  };
  
  const runCode = async (execCode, execLang) => {
    if (isRunning) {
      ws.send(JSON.stringify({ type: 'error', data: '已有代码正在执行' }));
      return;
    }
    
    isRunning = true;
    code = execCode;
    language = execLang;
    
    const cmdConfig = getCommand(code, language);
    if (!cmdConfig) {
      ws.send(JSON.stringify({ type: 'error', data: '不支持的语言' }));
      isRunning = false;
      return;
    }
    
    try {
      for (const file of cmdConfig.files) {
        await fs.promises.writeFile(file.path, file.content, 'utf-8');
      }
      
      if (language === 'cpp' || language === 'c') {
        const compiler = language === 'cpp' ? 'g++' : 'gcc';
        const sourceFile = cmdConfig.files[0].path;
        const exeFile = sourceFile.replace(/\.(cpp|c)$/, os.platform() === 'win32' ? '.exe' : '');

        const compileEnv = {
          ...process.env,
          PATH: `D:\\msys64\\ucrt64\\bin;${process.env.PATH}`,
          LANG: 'zh_CN.UTF-8',
          LC_ALL: 'zh_CN.UTF-8',
          PYTHONIOENCODING: 'utf-8'
        };

        await new Promise((resolve, reject) => {
          require('child_process').exec(
            `"${compiler}" -o "${exeFile}" "${sourceFile}"`,
            { timeout: 15000, env: compileEnv },
            (err, stdout, stderr) => {
              if (err) {
                const errorMsg = stderr || err.message;
                reject(new Error(`编译失败: ${errorMsg}`));
              } else {
                resolve();
              }
            }
          );
        });

        cmdConfig.cmd = exeFile;
        cmdConfig.args = [];
      }

      if (language === 'java') {
        const sourceFile = cmdConfig.files[0].path;

        const compileEnv = {
          ...process.env,
          PATH: `C:\\Program Files\\Common Files\\Oracle\\Java\\javapath;${process.env.PATH}`,
          LANG: 'zh_CN.UTF-8',
          LC_ALL: 'zh_CN.UTF-8',
          JAVA_TOOL_OPTIONS: '-Dfile.encoding=UTF-8'
        };

        await new Promise((resolve, reject) => {
          require('child_process').exec(
            `"javac" -encoding UTF-8 "${sourceFile}"`,
            { timeout: 15000, env: compileEnv, cwd: TEMP_DIR },
            (err, stdout, stderr) => {
              if (err) {
                const errorMsg = stderr || err.message;
                reject(new Error(`Java 编译失败: ${errorMsg}`));
              } else {
                resolve();
              }
            }
          );
        });
      }

      const startTime = Date.now();
      
      childProcess = require('child_process').spawn(cmdConfig.cmd, cmdConfig.args, {
        cwd: TEMP_DIR,
        env: {
          ...process.env,
          PATH: `${process.env.PATH};D:\\msys64\\ucrt64\\bin;C:\\Program Files\\Common Files\\Oracle\\Java\\javapath`,
          LANG: 'zh_CN.UTF-8',
          LC_ALL: 'zh_CN.UTF-8',
          PYTHONIOENCODING: 'utf-8',
          JAVA_TOOL_OPTIONS: '-Dfile.encoding=UTF-8'
        },
        windowsHide: true
      });
      
      executionSessions.set(sessionId, { childProcess, ws, language });
      
      childProcess.stdout.on('data', (data) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'output', data: data.toString() }));
        }
      });
      
      childProcess.stderr.on('data', (data) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'error', data: data.toString() }));
        }
      });
      
      childProcess.on('close', (code) => {
        const time = Date.now() - startTime;
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'exit', code, time }));
        }
        cleanup();
        isRunning = false;
      });
      
      childProcess.on('error', (err) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'error', data: err.message }));
        }
        cleanup();
        isRunning = false;
      });
      
      ws.send(JSON.stringify({ type: 'started' }));
      
    } catch (err) {
      ws.send(JSON.stringify({ type: 'error', data: err.message }));
      cleanup();
      isRunning = false;
    }
  };
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'run' && data.code && data.language) {
        console.log(`Received run command: language=${data.language}, code length=${data.code.length}`);
        runCode(data.code, data.language);
      } else if (data.type === 'input' && childProcess && isRunning) {
        if (childProcess.stdin) {
          childProcess.stdin.write(data.data);
        }
      } else if (data.type === 'stop' && childProcess) {
        cleanup();
        isRunning = false;
        ws.send(JSON.stringify({ type: 'stopped' }));
      }
    } catch (error) {
      console.error('Execution message error:', error);
    }
  });
  
  ws.on('close', () => {
    console.log(`Execution session disconnected: ${sessionId}`);
    cleanup();
    executionSessions.delete(sessionId);
  });
  
  ws.on('error', (error) => {
    console.error('Execution WebSocket error:', error);
    cleanup();
    executionSessions.delete(sessionId);
  });
};

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const sessionId = url.searchParams.get('sessionId');
  const isExecution = url.searchParams.get('execution') === 'true';
  
  if (isExecution) {
    console.log(`Execution session connected: ${sessionId}`);
    handleExecutionSession(ws, sessionId);
    return;
  }
  
  console.log(`Terminal session connected: ${sessionId}`);
  
  let shell = null;
  let currentDir = TEMP_DIR;
  
  const spawnShell = () => {
    const isWindows = os.platform() === 'win32';
    const shellCmd = isWindows ? 'powershell.exe' : process.env.SHELL || '/bin/bash';
    const shellArgs = isWindows ? ['-NoLogo'] : [];
    
    const child = require('child_process').spawn(shellCmd, shellArgs, {
      cwd: currentDir,
      env: {
        ...process.env,
        PATH: `${process.env.PATH};D:\\msys64\\ucrt64\\bin;C:\\Program Files\\Common Files\\Oracle\\Java\\javapath`,
        LANG: 'zh_CN.UTF-8',
        LC_ALL: 'zh_CN.UTF-8',
        PYTHONIOENCODING: 'utf-8',
        JAVA_TOOL_OPTIONS: '-Dfile.encoding=UTF-8'
      },
      windowsHide: true
    });
    
    child.stdout.on('data', (data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'output', data: data.toString() }));
      }
    });
    
    child.stderr.on('data', (data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'output', data: data.toString() }));
      }
    });
    
    child.on('exit', (code) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'output', data: `\r\n进程已退出，代码: ${code}\r\n` }));
      }
      terminals.delete(sessionId);
    });
    
    return child;
  };
  
  shell = spawnShell();
  terminals.set(sessionId, { shell, ws });
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'input' && shell) {
        shell.stdin.write(data.data);
      } else if (data.type === 'resize' && shell) {
        if (shell.resize) {
          shell.resize(data.cols, data.rows);
        }
      } else if (data.type === 'cd' && data.path) {
        currentDir = data.path;
        if (shell) {
          shell.kill();
        }
        shell = spawnShell();
        terminals.set(sessionId, { shell, ws });
      }
    } catch (error) {
      console.error('Terminal message error:', error);
    }
  });
  
  ws.on('close', () => {
    console.log(`Terminal session disconnected: ${sessionId}`);
    if (shell) {
      shell.kill();
    }
    terminals.delete(sessionId);
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    if (shell) {
      shell.kill();
    }
    terminals.delete(sessionId);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`服务器运行在 http://0.0.0.0:${PORT}`);
  console.log(`WebSocket 终端服务已启动`);
});
