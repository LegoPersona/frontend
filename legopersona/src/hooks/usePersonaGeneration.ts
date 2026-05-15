import { useCallback, useState } from 'react'

import {
  getGenerationResult,
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
  result: PersonaResult | null
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

      setState((prev) => ({
        ...prev,
        generationId: uploadResponse.generationId,
        status: 'processing',
        progress: 40,
      }))
      const statusResponse = await getGenerationStatus(uploadResponse.generationId)

      setState((prev) => ({
        ...prev,
        status: statusResponse.status,
        progress: Math.max(statusResponse.progress, 65),
      }))

      const resultResponse = await getGenerationResult(uploadResponse.generationId)

      setState((prev) => ({
        ...prev,
        status: 'completed',
        progress: 100,
        result: resultResponse,
        step: 'result',
      }))
    } catch {
      setState((prev) => ({
        ...prev,
        status: 'failed',
        error: 'Persona generation failed. Please try again.',
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
