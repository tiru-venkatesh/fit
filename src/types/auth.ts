export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  joinedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  rememberMe: boolean;
  error: string | null;
}
