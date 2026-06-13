import { User } from '../types/auth';

export const authService = {
  async verifyEmail(token: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return true;
  },

  async mockOAuthLogin(provider: 'google' | 'github'): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      id: 'usr-oauth-' + Math.random().toString(36).substr(2, 5),
      email: `user-from-${provider}@example.com`,
      fullName: `${provider.toUpperCase()} Global User`,
      avatarUrl: provider === 'google' 
        ? 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      joinedAt: new Date().toISOString(),
    };
  }
};
