import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi } from '@/services/authApi'
import { normalizeApiAssetUrl } from '@/services/profileApi'

interface User {
  userId: string
  username: string
  profileImageUrl?: string | null
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  loginWithGoogle: (credential: string) => Promise<void>
  register: (username: string, password: string, profileImage?: File | null) => Promise<void>
  logout: () => Promise<void>
  updateUser: (nextUser: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Turns a relative "/profiles/..." path into an absolute URL; Google URLs pass through unchanged.
const toUser = (data: { userId: string; username: string; profileImageUrl?: string | null }): User => ({
  userId: data.userId,
  username: data.username,
  profileImageUrl: normalizeApiAssetUrl(data.profileImageUrl ?? null),
})

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  // Only loading when a stored token needs to be validated against the API.
  const [isLoading, setIsLoading] = useState(() => !!localStorage.getItem('accessToken'))

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      return
    }
    authApi
      .getMe()
      .then(({ data }) => setUser(toUser(data)))
      .catch(() => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      })
      .finally(() => setIsLoading(false))
  }, [])

  const login = async (username: string, password: string) => {
    const { data } = await authApi.login(username, password)
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    const me = await authApi.getMe()
    setUser(toUser(me.data))
  }

  const loginWithGoogle = async (credential: string) => {
    const { data } = await authApi.googleLogin(credential)
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    const me = await authApi.getMe()
    setUser(toUser(me.data))
  }

  const register = async (username: string, password: string, profileImage?: File | null) => {
    const { data } = await authApi.register(username, password, profileImage)
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    const me = await authApi.getMe()
    setUser(toUser(me.data))
  }

  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    if (refreshToken) {
      await authApi.logout(refreshToken).catch(() => {})
    }
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setUser(null)
  }

  const updateUser = (nextUser: Partial<User>) => {
    setUser((previousUser) => {
      if (!previousUser) {
        return previousUser
      }

      return {
        ...previousUser,
        ...nextUser,
      }
    })
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, updateUser, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- context hook lives next to its provider
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
