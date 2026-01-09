import { useUserStore } from '@/store/userStore';

class TokenService {
  private refreshTimer: NodeJS.Timeout | null = null;

  async refreshToken(): Promise<boolean> {
    const { token, logout } = useUserStore.getState();
    
    if (!token) return false;

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        useUserStore.getState().setToken(data.token);
        this.scheduleRefresh();
        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  }

  scheduleRefresh() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
    
    // Refresh token every 50 minutes (assuming 1-hour expiry)
    this.refreshTimer = setTimeout(() => {
      this.refreshToken();
    }, 50 * 60 * 1000);
  }

  clearRefresh() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  async validateToken(): Promise<boolean> {
    const { token } = useUserStore.getState();
    
    if (!token) return false;

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/validate`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const tokenService = new TokenService();