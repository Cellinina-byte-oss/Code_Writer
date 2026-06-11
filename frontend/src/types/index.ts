export interface User {
  id: string;
  username: string;
  email?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface ExecutionResult {
  output: string;
  error: string;
  time: number;
  memory: number;
}

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
}

export interface OpenFile {
  name: string;
  path: string;
  content: string;
  modified: boolean;
}

export interface ProjectInfo {
  name: string;
  updatedAt: string;
}
