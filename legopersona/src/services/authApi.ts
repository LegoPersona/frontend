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
    api.post<AuthTokens>('/v1/auth/register', { username, password }),

  login: (username: string, password: string) =>
    api.post<AuthTokens>('/v1/auth/login', { username, password }),

  refresh: (refreshToken: string) =>
    api.post<AuthTokens>('/v1/auth/refresh', { refreshToken }),

  logout: (refreshToken: string) =>
    api.post('/v1/auth/logout', { refreshToken }),

  getMe: () =>
    api.get<MeResponse>('/v1/auth/me'),
}
