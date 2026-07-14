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

  googleLogin: (credential: string) =>
    api.post<AuthTokens>('/auth/google', { credential }),

  refresh: (refreshToken: string) =>
    api.post<AuthTokens>('/auth/refresh', { refreshToken }),

  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }),

  getMe: () =>
    api.get<MeResponse>('/auth/me'),
}
