import api from './api';
import type { PersonaDocument } from '@/types/persona';

export type { PersonaDocument };

// Static assets (persona/original images) are served from the API *origin* at /personas/...,
// not under the API base path (e.g. /api/v1). Derive the bare origin, dropping any path.
const resolveAssetOrigin = (): string => {
  const base = import.meta.env.VITE_API_BASE_URL ?? '';
  try {
    return new URL(base).origin;
  } catch {
    // Relative base (e.g. "/api/v1"): assets share the current page origin.
    return typeof window !== 'undefined' ? window.location.origin : '';
  }
};

const ASSET_ORIGIN = resolveAssetOrigin();

/** Resolves a backend-relative asset path (e.g. /personas/x.png) to a URL usable in <img src>. */
const resolveAssetUrl = (path?: string | null): string | null => {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  return `${ASSET_ORIGIN}${path}`;
};

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post('/personas', formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export interface RateLimitStatus {
  unlimited: boolean;
  limit: number;
  used: number;
  remaining: number;
  resetsAt: string | null;
}

export const getRateLimitStatus = async (): Promise<RateLimitStatus> => {
  const response = await api.get('/personas/ratelimit');

  return response.data;
};

export const getGenerationStatus = async (jobId: string) => {
  const response = await api.get(`/personas/tasks/${jobId}/status`);

  return response.data;
};

export const getPersona = async (personaId: string): Promise<PersonaDocument> => {
  const response = await api.get<PersonaDocument>(`/personas/${personaId}`);
  const persona = response.data;
  return {
    ...persona,
    personaImage: resolveAssetUrl(persona.personaImage),
    originalImage: resolveAssetUrl(persona.originalImage),
  };
};

export const getPersonaInstructions = async (personaId: string): Promise<string> => {
  const response = await api.get(`/personas/${personaId}/instructions`, {
    responseType: 'blob',
    timeout: 300000, // 5 minutes — PDF generation can take a while
  });
  return URL.createObjectURL(response.data as Blob);
};

export const getPersonaLegoPartsJson = async (personaId: string): Promise<string> => {
  const response = await api.get(`/personas/${personaId}/legoPartsJson`, { responseType: 'blob' });
  return URL.createObjectURL(response.data as Blob);
};