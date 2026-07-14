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
  'PartName': string;
  'Color': string;
  'Quantity': number;
  'PartID': string;
  'ColorCode': string;
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

export interface CommunityUser {
  id: string;
  username: string;
  profileImageUrl: string | null;
}

export interface PersonaComment {
  id: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string; // ISO string
}

export interface CommunityPersona {
  id: string;
  user: CommunityUser;
  createdAt: string; // ISO string
  legoImageUrl: string | null;
  originalImageUrl: string | null;
  tags: string[];
  likes: number;
  isLikedByUser: boolean;
  comments: PersonaComment[];
}

export interface FilterColorOption {
  legoColorId: number;
  name: string;
  hex: string;
}

export interface FilterOptions {
  hairColors: FilterColorOption[];
  skinTones: FilterColorOption[];
}

export interface FilterState {
  hairColors: number[]; // legoColorIds
  skinTones: number[]; // legoColorIds
  hasGlasses: boolean | null;
  hasBeard: boolean | null;
}

export type SortOption = "newest" | "popularity" | "most-discussed";

export const initialFilters: FilterState = {
  hairColors: [],
  skinTones: [],
  hasGlasses: null,
  hasBeard: null,
};
