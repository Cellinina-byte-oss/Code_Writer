import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { useThemeContext } from '../contexts/ThemeContext';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthContext();
  const { theme, availableThemes, setTheme } = useThemeContext();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="home-container">
      <div className="theme-switcher">
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
      </div>

      <div className="home-header">
        <h1 className="home-title">Code Writer</h1>
        <p className="home-subtitle">在线代码编辑与开发平台</p>
        
        {isAuthenticated ? (
          <div className="user-info">
            <span className="welcome-text">欢迎, {user?.username}</span>
            <button className="logout-btn" onClick={handleLogout}>
              退出登录
            </button>
          </div>
        ) : (
          <div className="auth-links">
            <button className="auth-btn" onClick={() => navigate('/auth')}>
              登录 / 注册
            </button>
          </div>
        )}
      </div>
      
      <div className="mode-cards">
        <div className="mode-card" onClick={() => navigate('/practice')}>
          <div className="mode-icon practice-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" />
              <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" />
              <path d="M9 12L11 14L15 10" />
            </svg>
          </div>
          <h2 className="mode-title">题目模式</h2>
          <p className="mode-description">
            单文件编程练习与算法训练
          </p>
          <ul className="mode-features">
            <li>📋 题目描述面板</li>
            <li>🔄 多语言切换</li>
            <li>⚡ 快速运行测试</li>
            <li>📊 运行结果统计</li>
          </ul>
          <button className="mode-button">进入题目模式</button>
        </div>
      </div>

      <div className="home-footer">
        <p>支持 Python / C / C++ / Java 等多种编程语言</p>
      </div>
    </div>
  );
}
