import { useEffect, useRef, useCallback, useState } from 'react'
import { Terminal } from 'xterm'
import { FitAddon } from '@xterm/addon-fit'
import { useThemeContext } from '../contexts/ThemeContext'
import 'xterm/css/xterm.css'
import './OutputPanel.css'

interface OutputPanelProps {
  code: string
  language: string
  onExecutionComplete?: (result: { status: 'success' | 'error'; output?: string; executionTime?: number }) => void
}

export default function OutputPanel({ code, language, onExecutionComplete }: OutputPanelProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const termRef = useRef<Terminal | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const inputBufferRef = useRef<string>('')
  const [isConnected, setIsConnected] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const { theme } = useThemeContext()

  const getXtermTheme = useCallback(() => {
    const isDark = theme.type === 'dark'
    return {
      background: theme.backgroundSecondary,
      foreground: theme.textPrimary,
      cursor: theme.accent,
      cursorAccent: theme.backgroundSecondary,
      black: isDark ? '#000000' : '#000000',
      red: isDark ? '#cd3131' : '#cd3131',
      green: isDark ? '#0dbc79' : '#0dbc79',
      yellow: isDark ? '#e5e510' : '#e5e510',
      blue: isDark ? '#2472c8' : '#2472c8',
      magenta: isDark ? '#bc3fbc' : '#bc3fbc',
      cyan: isDark ? '#11a8cd' : '#11a8cd',
      white: isDark ? '#e5e5e5' : '#e5e5e5',
      brightBlack: isDark ? '#666666' : '#666666',
      brightRed: isDark ? '#f14c4c' : '#f14c4c',
      brightGreen: isDark ? '#23d18b' : '#23d18b',
      brightYellow: isDark ? '#f5f543' : '#f5f543',
      brightBlue: isDark ? '#3b8eea' : '#3b8eea',
      brightMagenta: isDark ? '#d670d6' : '#d670d6',
      brightCyan: isDark ? '#29b8db' : '#29b8db',
      brightWhite: isDark ? '#e5e5e5' : '#e5e5e5',
      selectionBackground: isDark ? '#264F78' : '#ADD6FF',
    }
  }, [theme])

  const connectWebSocket = useCallback(() => {
    const sessionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//${window.location.host}/ws?sessionId=${sessionId}&execution=true`

    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      setIsConnected(true)
      termRef.current?.writeln('\x1b[32m✓ 已连接到执行服务\x1b[0m')
      termRef.current?.writeln('')
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        
        if (data.type === 'started') {
          setIsRunning(true)
          termRef.current?.write('\r\n\x1b[36m--- 代码执行中 ---\x1b[0m\r\n')
        } else if (data.type === 'output') {
          termRef.current?.write(data.data)
        } else if (data.type === 'error') {
          termRef.current?.writeln(`\x1b[31m${data.data}\x1b[0m`)
        } else if (data.type === 'exit') {
          setIsRunning(false)
          termRef.current?.writeln('\r\n\x1b[36m--- 执行结束 ---\x1b[0m')
          if (data.time) {
            termRef.current?.writeln(`\x1b[33m⏱️ 耗时: ${data.time}ms\x1b[0m`)
          }
          if (data.code !== 0) {
            termRef.current?.writeln(`\x1b[31m进程退出码: ${data.code}\x1b[0m`)
            onExecutionComplete?.({ status: 'error', executionTime: data.time })
          } else {
            onExecutionComplete?.({ status: 'success', executionTime: data.time })
          }
        } else if (data.type === 'stopped') {
          setIsRunning(false)
          termRef.current?.writeln('\r\n\x1b[33m--- 已停止 ---\x1b[0m')
        }
      } catch (err) {
        termRef.current?.write(event.data)
      }
    }

    ws.onclose = () => {
      setIsConnected(false)
      setIsRunning(false)
    }

    ws.onerror = () => {
      termRef.current?.writeln('\x1b[31mWebSocket 连接错误\x1b[0m')
      setIsConnected(false)
    }
  }, [])

  const handleInput = useCallback((data: string) => {
    const code = data.charCodeAt(0)
    
    if (code === 13) {
      termRef.current?.write('\r\n')
      const input = inputBufferRef.current
      inputBufferRef.current = ''
      
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'input', data: input + '\n' }))
      }
    } else if (code === 127) {
      if (inputBufferRef.current.length > 0) {
        inputBufferRef.current = inputBufferRef.current.slice(0, -1)
        termRef.current?.write('\b \b')
      }
    } else if (code >= 32) {
      inputBufferRef.current += data
      termRef.current?.write(data)
    }
  }, [])

  useEffect(() => {
    if (!terminalRef.current) return

    const term = new Terminal({
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      fontSize: 14,
      lineHeight: 1.2,
      cursorBlink: true,
      cursorStyle: 'bar',
      theme: getXtermTheme(),
      allowTransparency: true,
      scrollback: 5000,
    })

    const fitAddon = new FitAddon()
    termRef.current = term
    fitAddonRef.current = fitAddon

    term.loadAddon(fitAddon)
    term.open(terminalRef.current)
    fitAddon.fit()

    term.writeln('\x1b[36m=== Code Writer 执行面板 ===\x1b[0m')
    term.writeln('')

    term.onData(handleInput)

    const handleResize = () => {
      if (fitAddonRef.current) {
        fitAddonRef.current.fit()
      }
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(terminalRef.current)

    connectWebSocket()

    return () => {
      resizeObserver.disconnect()
      if (wsRef.current) {
        wsRef.current.close()
      }
      term.dispose()
    }
  }, [getXtermTheme, handleInput, connectWebSocket])

  useEffect(() => {
    if (termRef.current) {
      termRef.current.options.theme = getXtermTheme()
    }
  }, [theme, getXtermTheme])

  const handleRun = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && code) {
      termRef.current?.clear()
      termRef.current?.writeln('\x1b[36m=== Code Writer 执行面板 ===\x1b[0m')
      termRef.current?.writeln('')
      inputBufferRef.current = ''
      
      wsRef.current.send(JSON.stringify({
        type: 'run',
        code,
        language
      }))
    } else if (!code) {
      termRef.current?.writeln('\x1b[33m请先输入代码\x1b[0m')
    } else if (!isConnected) {
      termRef.current?.writeln('\x1b[31m未连接到服务器，请刷新页面\x1b[0m')
    }
  }

  const handleStop = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'stop' }))
    }
  }

  const handleClear = () => {
    if (termRef.current) {
      termRef.current.clear()
      termRef.current.writeln('\x1b[36m=== Code Writer 执行面板 ===\x1b[0m')
      termRef.current.writeln('')
    }
    inputBufferRef.current = ''
  }

  return (
    <div className="output-container">
      <div className="output-header">
        <span className="header-title">执行面板</span>
        <div className="output-actions">
          <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '🟢 已连接' : '🔴 未连接'}
          </span>
          <button 
            className="action-btn primary"
            onClick={handleRun}
            disabled={isRunning || !isConnected}
            title="运行代码"
          >
            ▶️ 运行
          </button>
          {isRunning && (
            <button 
              className="action-btn danger"
              onClick={handleStop}
              title="停止执行"
            >
              ⏹️ 停止
            </button>
          )}
          <button 
            className="action-btn"
            onClick={handleClear}
            title="清空输出"
          >
            🗑️ 清空
          </button>
        </div>
      </div>
      <div className="output-content" ref={terminalRef} />
    </div>
  )
}
