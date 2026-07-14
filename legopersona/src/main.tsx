import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import App from '@/App'
import { AuthProvider } from '@/contexts/AuthContext'
import { RateLimitProvider } from '@/contexts/RateLimitContext'
import { PersonaGenerationProvider } from '@/contexts/PersonaGenerationContext'
import '@/index.css'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <RateLimitProvider>
            <PersonaGenerationProvider>
              <App />
            </PersonaGenerationProvider>
          </RateLimitProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
