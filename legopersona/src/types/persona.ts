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
}

export type HairColor =
  | "black" | "brown" | "blonde" | "red" | "gray" | "white" | "bald";

export type SkinTone = "light" | "medium" | "dark";

export interface PersonaAttributes {
  hairColor: HairColor;
  hasGlasses: boolean;
  hasBeard: boolean;
  beardColor: HairColor | null;
  skinTone: SkinTone;
}

export interface PersonaComment {
  _id: string;
  user_id: string;
  username: string;
  text: string;
  createdAt: string; // ISO string
}

export interface CommunityModule {
  likes: number;
  isLikedByUser: boolean;
  comments: PersonaComment[];
}

export interface PersonaPart {
  part: string;
  color: string;
  qty: number;
}

export interface FilterState {
  hairColors: HairColor[];
  hasGlasses: boolean | null;
  hasBeard: boolean | null;
  skinTones: SkinTone[];
}

export type SortOption = "newest" | "popularity" | "most-discussed";

export const initialFilters: FilterState = {
  hairColors: [],
  hasGlasses: null,
  hasBeard: null,
  skinTones: [],
};

export interface Persona {
  _id: string;
  user_id: string;
  username?: string; // מגיע מ-lookup עם קולקציית המשתמשים
  attributes: PersonaAttributes;
  modules: {
    community: CommunityModule;
    [key: string]: unknown;
  };
  image: string | null;
  partsJson: PersonaPart[];
  timeStamps: {
    createdAt: string;
    updatedAt: string;
  };
}