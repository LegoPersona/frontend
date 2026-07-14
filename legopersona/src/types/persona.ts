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

export interface PersonaPart {
  'Part Name': string;
  'Color': string;
  'Quantity': string;
  'Part ID': string;
  'Color Code': string;
}

export interface PersonaDocument {
  id: string;
  attributes: Record<string, string>;
  modules: Record<string, { file_name: string; color: number }>;
  partsJson?: PersonaPart[];
  createdAt: string;
  /** Absolute URL to the generated LEGO persona image (publicly served). Null if not available. */
  personaImage?: string | null;
  /** Absolute URL to the original uploaded image (publicly served). Null if not available. */
  originalImage?: string | null;
}
