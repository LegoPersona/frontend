export type GenerationStep = 'upload' | 'loading' | 'result'

export type PersonaGenerationStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'failed'

export interface PersonaGenerationResponse {
  generationId: string
}

export interface PersonaGenerationStatusResponse {
  generationId: string
  status: PersonaGenerationStatus
  progress: number
}

export interface PersonaResult {
  generationId: string
  personaName: string
  description: string
  imageUrl: string
  downloadUrl: string
}
