import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from 'react'

import { cancelGeneration, getGenerationStatus, uploadImage } from '@/services/personaApi'
import { useRateLimit } from '@/contexts/RateLimitContext'

const ACTIVE_JOB_KEY = 'activeGenerationJobId'

interface PersonaGenerationContextType {
  currentStep: 1 | 2 | 3
  selectedImage: string | null
  progress: number
  actionDescription: string | undefined
  resultPersonaId: string | null
  error: string | null
  isRunning: boolean
  isReady: boolean
  isFailed: boolean
  selectImage: (file: File, preview: string) => void
  clearImage: () => void
  startGeneration: () => Promise<void>
  retry: () => void
  reset: () => void
}

const PersonaGenerationContext = createContext<PersonaGenerationContextType | undefined>(undefined)

export const PersonaGenerationProvider = ({ children }: { children: ReactNode }) => {
  const { refresh: refreshRateLimit } = useRateLimit()
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [actionDescription, setActionDescription] = useState<string | undefined>(undefined)
  const [resultPersonaId, setResultPersonaId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // A jobId left in sessionStorage means the page was refreshed mid-run
  // (sessionStorage survives refresh but not tab close) — cancel the orphaned
  // backend job. The key is removed before the request so React StrictMode's
  // double-mount can't fire it twice.
  useEffect(() => {
    const orphanedJobId = sessionStorage.getItem(ACTIVE_JOB_KEY)
    if (!orphanedJobId) return
    sessionStorage.removeItem(ACTIVE_JOB_KEY)
    cancelGeneration(orphanedJobId).catch((err) => console.error('Failed to cancel orphaned generation:', err))
  }, [])

  useEffect(() => clearPolling, [clearPolling])

  const selectImage = useCallback((file: File, preview: string) => {
    setSelectedFile(file)
    setSelectedImage(preview)
  }, [])

  const clearImage = useCallback(() => {
    setSelectedFile(null)
    setSelectedImage(null)
  }, [])

  const retry = useCallback(() => {
    clearPolling()
    sessionStorage.removeItem(ACTIVE_JOB_KEY)
    setError(null)
    setProgress(0)
    setActionDescription(undefined)
    setCurrentStep(1)
  }, [clearPolling])

  const reset = useCallback(() => {
    clearPolling()
    sessionStorage.removeItem(ACTIVE_JOB_KEY)
    setCurrentStep(1)
    setSelectedFile(null)
    setSelectedImage(null)
    setProgress(0)
    setActionDescription(undefined)
    setResultPersonaId(null)
    setError(null)
  }, [clearPolling])

  const startGeneration = useCallback(async () => {
    if (!selectedFile) return

    try {
      setError(null)
      setProgress(0)
      setActionDescription(undefined)
      setCurrentStep(2)

      const uploadResponse = await uploadImage(selectedFile)
      const jobId: string = uploadResponse.jobId
      sessionStorage.setItem(ACTIVE_JOB_KEY, jobId)

      // The upload consumed a daily slot — update the navbar gauge.
      refreshRateLimit()

      intervalRef.current = setInterval(async () => {
        try {
          const status = await getGenerationStatus(jobId)

          setProgress(status.percentCompleteEstimate ?? 0)
          setActionDescription(status.actionDescription ?? undefined)

          if (status.status === 'COMPLETED') {
            clearPolling()
            sessionStorage.removeItem(ACTIVE_JOB_KEY)
            setResultPersonaId(status.resultPersonaId)
            setCurrentStep(3)
          }

          if (status.status === 'FAILED') {
            clearPolling()
            sessionStorage.removeItem(ACTIVE_JOB_KEY)
            console.error('Generation failed:', status.errorMessage)
            setError("We couldn't build your persona this time. Please try again later.")
          }

          if (status.status === 'CANCELLED') {
            // Defensive: normally the refreshed page is the one cancelling,
            // so this session never sees it. Quietly return to step 1.
            retry()
          }
        } catch (pollErr) {
          console.error(pollErr)
          clearPolling()
          sessionStorage.removeItem(ACTIVE_JOB_KEY)
          setError("We lost track of your persona's progress. Please try again.")
        }
      }, 2000)
    } catch (err: any) {
      console.error(err)
      if (err?.response?.status === 429) {
        setError("You've reached your daily persona creation limit. Please try again tomorrow.")
      } else {
        setError('Something went wrong while uploading your photo.')
      }
    }
  }, [selectedFile, refreshRateLimit, clearPolling, retry])

  const isRunning = currentStep === 2 && error === null
  const isFailed = currentStep === 2 && error !== null
  const isReady = currentStep === 3

  return (
    <PersonaGenerationContext.Provider
      value={{
        currentStep,
        selectedImage,
        progress,
        actionDescription,
        resultPersonaId,
        error,
        isRunning,
        isReady,
        isFailed,
        selectImage,
        clearImage,
        startGeneration,
        retry,
        reset,
      }}
    >
      {children}
    </PersonaGenerationContext.Provider>
  )
}

export const usePersonaGeneration = () => {
  const context = useContext(PersonaGenerationContext)
  if (!context) {
    throw new Error('usePersonaGeneration must be used within a PersonaGenerationProvider')
  }
  return context
}
