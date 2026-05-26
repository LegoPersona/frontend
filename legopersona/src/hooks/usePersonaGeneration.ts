import { useCallback, useState } from 'react'

import {
  getGenerationStatus,
  uploadImage,
} from '@/services/personaApi'
import type {
  GenerationStep,
  PersonaGenerationStatus,
  PersonaResult,
} from '@/types/persona'

type PersonaGenerationState = {
  step: GenerationStep
  status: PersonaGenerationStatus
  progress: number
  generationId: string | null
  result: string | PersonaResult | null
  error: string | null
}

const initialState: PersonaGenerationState = {
  step: 'upload',
  status: 'idle',
  progress: 0,
  generationId: null,
  result: null,
  error: null,
}

export function usePersonaGeneration() {
  const [state, setState] = useState<PersonaGenerationState>(initialState)

  const resetFlow = useCallback(() => {
    setState(initialState)
  }, [])

  const startGeneration = useCallback(async (file: File) => {
    try {
      setState((prev) => ({
        ...prev,
        status: 'uploading',
        progress: 15,
        error: null,
        step: 'loading',
      }))
      
      const uploadResponse = await uploadImage(file)
      const currentJobId = uploadResponse.jobId

      setState((prev) => ({
        ...prev,
        generationId: currentJobId,
        status: 'processing',
        progress: 30,
      }))

      let isPolling = true;
      const POLLING_INTERVAL = 3000; 
      
      while (isPolling) {
        await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL));
        
        const statusResponse = await getGenerationStatus(currentJobId);

        if (statusResponse.status === 'COMPLETED') {
          setState((prev) => ({
            ...prev,
            status: 'completed',
            progress: 100,
            result: statusResponse.resultPersonaId || null,
            step: 'result',
          }))
          isPolling = false; 
          
        } else if (statusResponse.status === 'FAILED') {
          setState((prev) => ({
            ...prev,
            status: 'failed',
            error: statusResponse.errorMessage || 'Persona generation failed on server.',
            step: 'upload',
          }))
          isPolling = false; 
          
        } else {
          setState((prev) => ({
            ...prev,
            status: 'processing', 
            progress: statusResponse.progress ? Math.max(statusResponse.progress, prev.progress) : Math.min(prev.progress + 10, 90),
          }))
        }
      }

    } catch (error) {
      setState((prev) => ({
        ...prev,
        status: 'failed',
        error: 'Network or upload error occurred. Please try again.',
        step: 'upload',
      }))
    }
  }, [])

  return {
    currentStep: state.step,
    status: state.status,
    progress: state.progress,
    generationId: state.generationId,
    result: state.result,
    error: state.error,
    startGeneration,
    resetFlow,
  }
}