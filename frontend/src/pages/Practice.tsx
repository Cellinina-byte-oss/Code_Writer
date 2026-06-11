import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CodeEditor from '../components/CodeEditor'
import OutputPanel from '../components/OutputPanel'
import ProblemPanel from '../components/ProblemPanel'
import { problems, type Problem } from '../data/problems'
import { useFontSize } from '../hooks'
import { LANGUAGES, type LanguageValue } from '../constants/languages'
import { useThemeContext } from '../contexts/ThemeContext'
import './Practice.css'

const STORAGE_KEY = 'practice_mode_state'
const HISTORY_KEY = 'execution_history'

interface PracticeState {
  code: string
  language: LanguageValue
  problemId: string
}

export interface ExecutionRecord {
  id: string
  timestamp: number
  code: string
  language: LanguageValue
  problemId: string
  problemTitle: string
  status: 'success' | 'error' | 'running'
  output?: string
  executionTime?: number
}

export default function Practice() {
  const navigate = useNavigate()
  const { theme, availableThemes, setTheme } = useThemeContext()
  const { fontSize, increaseFontSize, decreaseFontSize } = useFontSize()

  const [problemPanelWidth, setProblemPanelWidth] = useState(350)
  const [editorHeight, setEditorHeight] = useState(400)
  const [isResizingHorizontal, setIsResizingHorizontal] = useState(false)
  const [isResizingVertical, setIsResizingVertical] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [executionHistory, setExecutionHistory] = useState<ExecutionRecord[]>([])

  const [code, setCode] = useState<string>('')
  const [language, setLanguage] = useState<LanguageValue>('python')
  const [currentProblem, setCurrentProblem] = useState<Problem>(problems[0])

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const state: PracticeState = JSON.parse(saved)
        if (state.code !== undefined) setCode(state.code)
        if (state.language) setLanguage(state.language)
        if (state.problemId) {
          const problem = problems.find(p => p.id === state.problemId)
          if (problem) setCurrentProblem(problem)
        }
      } catch {}
    }

    const savedHistory = localStorage.getItem(HISTORY_KEY)
    if (savedHistory) {
      try {
        setExecutionHistory(JSON.parse(savedHistory))
      } catch {}
    }
  }, [])

  useEffect(() => {
    const state: PracticeState = {
      code,
      language,
      problemId: currentProblem.id
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [code, language, currentProblem])

  useEffect(() => {
    if (executionHistory.length > 50) {
      const trimmed = executionHistory.slice(-50)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed))
    } else {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(executionHistory))
    }
  }, [executionHistory])

  const handleLanguageChange = useCallback((newLang: string) => {
    const lang = newLang as LanguageValue
    setLanguage(lang)
  }, [])

  const handleReset = useCallback(() => {
    setCode('')
  }, [])

  const handleAutoFix = useCallback((fixedCode: string) => {
    setCode(fixedCode)
  }, [])

  const handleProblemSelect = useCallback((problem: Problem) => {
    setCurrentProblem(problem)
    setCode('')
  }, [])

  const handleAddToHistory = useCallback((record: Omit<ExecutionRecord, 'id' | 'timestamp'>) => {
    const newRecord: ExecutionRecord = {
      ...record,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      timestamp: Date.now()
    }
    setExecutionHistory(prev => [...prev, newRecord])
  }, [])

  const handleLoadFromHistory = useCallback((record: ExecutionRecord) => {
    setCode(record.code)
    setLanguage(record.language)
    const problem = problems.find(p => p.id === record.problemId)
    if (problem) {
      setCurrentProblem(problem)
    }
    setShowHistory(false)
  }, [])

  const handleClearHistory = useCallback(() => {
    setExecutionHistory([])
    localStorage.removeItem(HISTORY_KEY)
  }, [])

  const handleHorizontalResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizingHorizontal(true)
  }, [])

  const handleVerticalResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizingVertical(true)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingHorizontal) {
        const containerRect = document.querySelector('.practice-main')?.getBoundingClientRect()
        if (containerRect) {
          const newWidth = containerRect.right - e.clientX
          setProblemPanelWidth(Math.max(250, Math.min(600, newWidth)))
        }
      }
      if (isResizingVertical) {
        const editorRect = document.querySelector('.practice-left')?.getBoundingClientRect()
        if (editorRect) {
          const newEditorHeight = e.clientY - editorRect.top
          setEditorHeight(Math.max(150, Math.min(800, newEditorHeight)))
        }
      }
    }

    const handleMouseUp = () => {
      setIsResizingHorizontal(false)
      setIsResizingVertical(false)
    }

    if (isResizingHorizontal || isResizingVertical) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = isResizingHorizontal ? 'col-resize' : 'row-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizingHorizontal, isResizingVertical])

  return (
    <div className="practice-container">
      <div className="practice-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← 返回
          </button>
          <h1 className="practice-title">题目模式</h1>
        </div>
        <div className="header-center">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="language-select"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        <div className="header-right">
          <select
            value={theme.id}
            onChange={(e) => setTheme(e.target.value)}
            className="theme-select"
          >
            {availableThemes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <div className="font-size-control">
            <button
              className="font-btn"
              onClick={decreaseFontSize}
              title="减小字体"
            >
              A-
            </button>
            <span className="font-size-display">{fontSize}px</span>
            <button
              className="font-btn"
              onClick={increaseFontSize}
              title="增大字体"
            >
              A+
            </button>
          </div>
          <button className="header-btn" onClick={handleReset}>
            🔄 重置
          </button>
          <button className="header-btn auto-fix-btn" onClick={() => {
            const editors = (window as any).monaco?.editor?.getEditors();
            if (editors && editors.length > 0) {
              const action = editors[0].getAction('auto-fix');
              if (action) {
                action.run();
              }
            }
          }}>
            ✨ 自动纠错
          </button>
          <button className="header-btn auto-fix-btn" onClick={() => setShowHistory(!showHistory)}>
            📋 历史 {executionHistory.length > 0 && `(${executionHistory.length})`}
          </button>
        </div>
      </div>

      <div className="practice-main">
        <div className="practice-left">
          <div className="editor-wrapper" style={{ height: editorHeight }}>
            <CodeEditor
              code={code}
              onChange={setCode}
              language={language}
              fontSize={fontSize}
              onAutoFix={handleAutoFix}
            />
          </div>

          <div
            className="resize-handle-vertical"
            onMouseDown={handleVerticalResizeStart}
          >
            <div className="resize-handle-bar" />
          </div>

          <div className="output-wrapper">
            <OutputPanel
              code={code}
              language={language}
              onExecutionComplete={(result) => {
                handleAddToHistory({
                  code,
                  language,
                  problemId: currentProblem.id,
                  problemTitle: currentProblem.title,
                  status: result.status,
                  executionTime: result.executionTime
                })
              }}
            />
          </div>
        </div>

        <div
          className="resize-handle-horizontal"
          onMouseDown={handleHorizontalResizeStart}
        >
          <div className="resize-handle-bar" />
        </div>

        <div className="practice-right" style={{ width: problemPanelWidth }}>
          <ProblemPanel
            onProblemSelect={handleProblemSelect}
            currentProblem={currentProblem}
            language={language}
          />
        </div>
      </div>

      {showHistory && (
        <div className="history-panel">
          <div className="history-header">
            <h3>📋 运行历史</h3>
            <div className="history-actions">
              <button className="history-btn" onClick={handleClearHistory}>
                🗑️ 清空
              </button>
              <button className="history-btn" onClick={() => setShowHistory(false)}>
                ✕ 关闭
              </button>
            </div>
          </div>
          <div className="history-list">
            {executionHistory.length === 0 ? (
              <div className="history-empty">暂无运行记录</div>
            ) : (
              executionHistory.slice().reverse().map((record) => (
                <div
                  key={record.id}
                  className="history-item"
                  onClick={() => handleLoadFromHistory(record)}
                >
                  <div className="history-item-header">
                    <span className={`history-status ${record.status}`}>
                      {record.status === 'success' ? '✅' : record.status === 'error' ? '❌' : '⏳'}
                    </span>
                    <span className="history-problem">{record.problemTitle}</span>
                    <span className="history-lang">{record.language}</span>
                  </div>
                  <div className="history-item-meta">
                    <span className="history-time">
                      {new Date(record.timestamp).toLocaleString('zh-CN')}
                    </span>
                    {record.executionTime && (
                      <span className="history-time">⏱️ {record.executionTime}ms</span>
                    )}
                  </div>
                  <div className="history-code-preview">
                    {record.code.slice(0, 100)}{record.code.length > 100 ? '...' : ''}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}