import { useState } from 'react'
import { problems, type Problem } from '../data/problems'

interface ProblemPanelProps {
  onProblemSelect: (problem: Problem) => void
  currentProblem: Problem | null
  language?: string
}

const difficultyLabels = {
  easy: { label: '简单', color: '#10b981' },
  medium: { label: '中等', color: '#f59e0b' },
  hard: { label: '困难', color: '#ef4444' }
}

const languageLabels: Record<string, string> = {
  python: 'Python',
  cpp: 'C++',
  c: 'C',
  java: 'Java'
}

export default function ProblemPanel({ onProblemSelect, currentProblem, language = 'python' }: ProblemPanelProps) {
  const [showProblemList, setShowProblemList] = useState(true)
  const [showAnswer, setShowAnswer] = useState(false)

  const getReferenceAnswer = () => {
    if (!currentProblem) return ''
    const langTemplate = currentProblem.template[language]
    if (langTemplate) return langTemplate
    if (currentProblem.referenceAnswer) return currentProblem.referenceAnswer
    return ''
  }

  return (
    <div className="problem-panel">
      <div className="problem-header">
        <button 
          className="toggle-btn"
          onClick={() => setShowProblemList(!showProblemList)}
        >
          {showProblemList ? '◀' : '▶'}
        </button>
        <span className="header-title">题目列表</span>
      </div>
      
      {showProblemList && (
        <div className="problem-list">
          {problems.map((problem) => (
            <div
              key={problem.id}
              className={`problem-item ${currentProblem?.id === problem.id ? 'active' : ''}`}
              onClick={() => onProblemSelect(problem)}
            >
              <div className="problem-info">
                <span className="problem-id">{problem.id}.</span>
                <span className="problem-title">{problem.title}</span>
              </div>
              <span 
                className="difficulty-tag"
                style={{ backgroundColor: difficultyLabels[problem.difficulty].color }}
              >
                {difficultyLabels[problem.difficulty].label}
              </span>
            </div>
          ))}
        </div>
      )}

      {currentProblem && (
        <div className="problem-content">
          <div className="problem-section">
            <div className="section-header">
              <h3>📝 题目名称</h3>
              <span 
                className="difficulty-badge"
                style={{ backgroundColor: difficultyLabels[currentProblem.difficulty].color }}
              >
                {difficultyLabels[currentProblem.difficulty].label}
              </span>
            </div>
            <p>{currentProblem.title}</p>
          </div>
          
          <div className="problem-section">
            <h3>📋 题目描述</h3>
            <p>{currentProblem.description}</p>
          </div>
          
          <div className="problem-section">
            <h3>🚀 输入格式</h3>
            <p>{currentProblem.inputFormat}</p>
          </div>
          
          <div className="problem-section">
            <h3>📤 输出格式</h3>
            <pre>{currentProblem.outputFormat}</pre>
          </div>

          {currentProblem.sampleInput && (
            <div className="problem-section">
              <h3>📊 输入示例</h3>
              <pre className="sample-input">{currentProblem.sampleInput}</pre>
            </div>
          )}

          {currentProblem.sampleOutput && (
            <div className="problem-section">
              <h3>📊 输出示例</h3>
              <pre className="sample-output">{currentProblem.sampleOutput}</pre>
            </div>
          )}

          {currentProblem.complexity && (
            <div className="problem-section">
              <h3>⚡ 复杂度分析</h3>
              <div className="complexity-info">
                <div className="complexity-item">
                  <span className="complexity-label">时间复杂度:</span>
                  <span className="complexity-value">{currentProblem.complexity.time}</span>
                </div>
                <div className="complexity-item">
                  <span className="complexity-label">空间复杂度:</span>
                  <span className="complexity-value">{currentProblem.complexity.space}</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="problem-section">
            <h3>💡 提示</h3>
            <ul className="hints-list">
              {currentProblem.hints.map((hint, index) => (
                <li key={index}>{hint}</li>
              ))}
            </ul>
          </div>
          
          <div className="problem-section">
            <button
              className="toggle-answer-btn"
              onClick={() => setShowAnswer(!showAnswer)}
            >
              {showAnswer ? '👇 收起参考答案' : `👆 ${languageLabels[language] || 'Python'} 参考答案`}
            </button>
            {showAnswer && (
              <pre className="reference-answer">{getReferenceAnswer()}</pre>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
