import api from './api'

interface AuthTokens {
  accessToken: string
  refreshToken: string
}

interface MeResponse {
  userId: string
  username: string
}

export const authApi = {
  register: (username: string, password: string) =>
    api.post<AuthTokens>('/auth/register', { username, password }),

  login: (username: string, password: string) =>
    api.post<AuthTokens>('/auth/login', { username, password }),

  refresh: (refreshToken: string) =>
    api.post<AuthTokens>('/auth/refresh', { refreshToken }),

  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }),

  getMe: () =>
    api.get<MeResponse>('/auth/me'),
}
