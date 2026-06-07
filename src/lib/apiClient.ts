const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

const baseHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '1'
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

export const apiClient = {
  async post(endpoint: string, data: any) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: baseHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return response.json();
  },

  async get(endpoint: string) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: baseHeaders()
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return response.json();
  }
};
