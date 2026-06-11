const express = require('express');
const { execFile, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const TEMP_DIR = path.join(__dirname, '..', 'temp');

const env = {
  ...process.env,
  PATH: `${process.env.PATH};D:\\msys64\\ucrt64\\bin;C:\\Program Files\\Common Files\\Oracle\\Java\\javapath`,
  LANG: 'zh_CN.UTF-8',
  LC_ALL: 'zh_CN.UTF-8',
  PYTHONIOENCODING: 'utf-8',
  JAVA_TOOL_OPTIONS: '-Dfile.encoding=UTF-8'
};

const generateRandomString = (length) => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const cleanupFiles = async (...files) => {
  for (const file of files) {
    if (file) {
      await fs.promises.unlink(file).catch(() => {});
    }
  }
};

const runPython = async (code) => {
  const fileName = `script_${generateRandomString(8)}.py`;
  const filePath = path.join(TEMP_DIR, fileName);
  
  await fs.promises.writeFile(filePath, code);
  
  return new Promise((resolve) => {
    const startTime = Date.now();
    execFile('python', [filePath], { timeout: 10000, env }, (error, stdout, stderr) => {
      const time = Date.now() - startTime;
      cleanupFiles(filePath);
      
      if (error) {
        resolve({
          output: '',
          error: stderr || error.message,
          time,
          memory: 0
        });
      } else {
        resolve({
          output: stdout,
          error: '',
          time,
          memory: 0
        });
      }
    });
  });
};

const runCpp = async (code) => {
  const fileName = `program_${generateRandomString(8)}`;
  const cppPath = path.join(TEMP_DIR, `${fileName}.cpp`);
  const exePath = path.join(TEMP_DIR, fileName);
  
  await fs.promises.writeFile(cppPath, code);
  
  return new Promise((resolve) => {
    exec(`g++ -o ${exePath} ${cppPath}`, { timeout: 15000, env }, (compileError) => {
      if (compileError) {
        cleanupFiles(cppPath);
        resolve({
          output: '',
          error: compileError.message,
          time: 0,
          memory: 0
        });
        return;
      }
      
      const startTime = Date.now();
      execFile(exePath, { timeout: 10000, env }, (runError, stdout, stderr) => {
        const time = Date.now() - startTime;
        cleanupFiles(cppPath, exePath);
        
        if (runError) {
          resolve({
            output: '',
            error: stderr || runError.message,
            time,
            memory: 0
          });
        } else {
          resolve({
            output: stdout,
            error: '',
            time,
            memory: 0
          });
        }
      });
    });
  });
};

const runC = async (code) => {
  const fileName = `program_${generateRandomString(8)}`;
  const cPath = path.join(TEMP_DIR, `${fileName}.c`);
  const exePath = path.join(TEMP_DIR, fileName);
  
  await fs.promises.writeFile(cPath, code);
  
  return new Promise((resolve) => {
    exec(`gcc -o ${exePath} ${cPath}`, { timeout: 15000, env }, (compileError) => {
      if (compileError) {
        cleanupFiles(cPath);
        resolve({
          output: '',
          error: compileError.message,
          time: 0,
          memory: 0
        });
        return;
      }
      
      const startTime = Date.now();
      execFile(exePath, { timeout: 10000, env }, (runError, stdout, stderr) => {
        const time = Date.now() - startTime;
        cleanupFiles(cPath, exePath);
        
        if (runError) {
          resolve({
            output: '',
            error: stderr || runError.message,
            time,
            memory: 0
          });
        } else {
          resolve({
            output: stdout,
            error: '',
            time,
            memory: 0
          });
        }
      });
    });
  });
};

const runJava = async (code) => {
  const className = 'Main';
  const javaPath = path.join(TEMP_DIR, `${className}.java`);
  
  await fs.promises.writeFile(javaPath, code);
  
  return new Promise((resolve) => {
    exec(`javac -encoding UTF-8 ${javaPath}`, { timeout: 15000, env }, (compileError) => {
      if (compileError) {
        cleanupFiles(javaPath);
        resolve({
          output: '',
          error: compileError.message,
          time: 0,
          memory: 0
        });
        return;
      }
      
      const startTime = Date.now();
      exec(`java -cp ${TEMP_DIR} -Dfile.encoding=UTF-8 ${className}`, { timeout: 10000, env }, (runError, stdout, stderr) => {
        const time = Date.now() - startTime;
        cleanupFiles(javaPath, path.join(TEMP_DIR, `${className}.class`));
        
        if (runError) {
          resolve({
            output: '',
            error: stderr || runError.message,
            time,
            memory: 0
          });
        } else {
          resolve({
            output: stdout,
            error: '',
            time,
            memory: 0
          });
        }
      });
    });
  });
};

router.post('/run', async (req, res) => {
  try {
    const { code, language } = req.body;
    
    if (!code || !language) {
      return res.status(400).json({ error: '缺少必要参数' });
    }
    
    let result;
    switch (language) {
      case 'python':
        result = await runPython(code);
        break;
      case 'cpp':
        result = await runCpp(code);
        break;
      case 'c':
        result = await runC(code);
        break;
      case 'java':
        result = await runJava(code);
        break;
      default:
        return res.status(400).json({ error: '不支持的语言' });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
