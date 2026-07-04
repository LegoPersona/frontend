import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getRateLimitStatus, type RateLimitStatus } from '@/services/personaApi'

interface RateLimitContextType {
  status: RateLimitStatus | null
  refresh: () => Promise<void>
}

const RateLimitContext = createContext<RateLimitContextType | undefined>(undefined)

export const RateLimitProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth()
  const [status, setStatus] = useState<RateLimitStatus | null>(null)

  const refresh = useCallback(async () => {
    try {
      setStatus(await getRateLimitStatus())
    } catch {
      setStatus(null)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      refresh()
    } else {
      setStatus(null)
    }
  }, [isAuthenticated, refresh])

  return <RateLimitContext.Provider value={{ status, refresh }}>{children}</RateLimitContext.Provider>
}

export const useRateLimit = () => {
  const context = useContext(RateLimitContext)
  if (!context) {
    throw new Error('useRateLimit must be used within a RateLimitProvider')
  }
  return context
}
