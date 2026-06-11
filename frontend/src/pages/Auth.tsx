import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../contexts/ThemeContext';
import './Auth.css';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
}

export default function Auth() {
  const navigate = useNavigate();
  const { theme, availableThemes, setTheme } = useThemeContext();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (!username || !password) {
        setError('请输入用户名和密码');
        return;
      }

      setLoading(true);
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || '登录失败');
        }

        const authState: AuthState = {
          token: data.token,
          user: data.user,
        };
        localStorage.setItem('auth', JSON.stringify(authState));
        navigate('/');
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      if (!username || !email || !password || !confirmPassword) {
        setError('请填写所有字段');
        return;
      }

      if (password !== confirmPassword) {
        setError('两次输入的密码不一致');
        return;
      }

      if (password.length < 6) {
        setError('密码长度至少为6位');
        return;
      }

      setLoading(true);
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || '注册失败');
        }

        const authState: AuthState = {
          token: data.token,
          user: data.user,
        };
        localStorage.setItem('auth', JSON.stringify(authState));
        navigate('/');
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="auth-container">
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

      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Code Writer</h1>
          <p className="auth-subtitle">{isLogin ? '欢迎回来' : '创建新账号'}</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="email">邮箱</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入邮箱"
                disabled={loading}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">用户名</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={isLogin ? '用户名或邮箱' : '请输入用户名'}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              disabled={loading}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">确认密码</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="请再次输入密码"
                disabled={loading}
              />
            </div>
          )}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? '处理中...' : (isLogin ? '登 录' : '注 册')}
          </button>
        </form>

        <div className="auth-switch">
          {isLogin ? '还没有账号？' : '已有账号？'}
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="switch-button">
            {isLogin ? '立即注册' : '立即登录'}
          </button>
        </div>
      </div>
    </div>
  );
}
