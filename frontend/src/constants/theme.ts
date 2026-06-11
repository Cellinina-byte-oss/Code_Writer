export interface Theme {
  id: string;
  name: string;
  type: 'dark' | 'light';
  background: string;
  backgroundSecondary: string;
  backgroundCard: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  accent: string;
  accentHover: string;
}

export const themes: Theme[] = [
  {
    id: 'dark-deep-blue',
    name: '深空蓝',
    type: 'dark',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    backgroundSecondary: '#1e1e1e',
    backgroundCard: 'rgba(255, 255, 255, 0.05)',
    textPrimary: '#ffffff',
    textSecondary: '#c0c0c0',
    textMuted: '#888888',
    border: 'rgba(255, 255, 255, 0.1)',
    accent: '#667eea',
    accentHover: '#1177bb'
  },
  {
    id: 'dark-purple',
    name: '暗夜紫',
    type: 'dark',
    background: 'linear-gradient(135deg, #2d1b69 0%, #1a1a2e 50%, #0d0d1a 100%)',
    backgroundSecondary: '#1a1a2e',
    backgroundCard: 'rgba(255, 255, 255, 0.05)',
    textPrimary: '#ffffff',
    textSecondary: '#d4d4d4',
    textMuted: '#888888',
    border: 'rgba(255, 255, 255, 0.1)',
    accent: '#a78bfa',
    accentHover: '#8b5cf6'
  },
  {
    id: 'light-white',
    name: '明亮白',
    type: 'light',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)',
    backgroundSecondary: '#ffffff',
    backgroundCard: 'rgba(0, 0, 0, 0.02)',
    textPrimary: '#1e293b',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    border: 'rgba(0, 0, 0, 0.1)',
    accent: '#3b82f6',
    accentHover: '#2563eb'
  },
  {
    id: 'light-warm',
    name: '温暖米',
    type: 'light',
    background: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 50%, #fef08a 100%)',
    backgroundSecondary: '#fefdf9',
    backgroundCard: 'rgba(0, 0, 0, 0.02)',
    textPrimary: '#451a03',
    textSecondary: '#78350f',
    textMuted: '#a16207',
    border: 'rgba(0, 0, 0, 0.1)',
    accent: '#f59e0b',
    accentHover: '#d97706'
  }
];

export const STORAGE_KEYS = {
  THEME_ID: 'themeId',
  USER_TOKEN: 'userToken',
  USER_DATA: 'userData',
} as const;

export const getThemeById = (id: string): Theme => {
  return themes.find(t => t.id === id) || themes[0];
};

export const getDefaultTheme = (): Theme => themes[0];
