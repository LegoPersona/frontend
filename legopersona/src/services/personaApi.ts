import api from './api';
import type { PersonaDocument } from '@/types/persona';
import type { Persona, FilterState, SortOption } from "@/types/persona";

export type { PersonaDocument };

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
};

export const getRateLimitStatus = async (): Promise<RateLimitStatus> => {
  const response = await api.get('/personas/ratelimit');

  return response.data;
};

export const getGenerationStatus = async (jobId: string) => {
  const response = await api.get(`/personas/tasks/${jobId}/status`);

  return response.data;
};

export const getPersona = async (personaId: string): Promise<PersonaDocument> => {
  const response = await api.get(`/personas/${personaId}`);
  return response.data;
};

export const getPersonaImage = async (personaId: string): Promise<string> => {
  const response = await api.get(`/personas/${personaId}/image`, { responseType: 'blob' });
  return URL.createObjectURL(response.data as Blob);
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

export interface GalleryQuery {
  filters: FilterState;
  sortBy: SortOption;
  skip: number;
  limit: number;
};

export interface GalleryResponse {
  personas: Persona[];
  total: number;
};

// GET /personas?sort=newest&skip=0&limit=8&hairColors=brown,black
export const getGallery = async (q: GalleryQuery): Promise<GalleryResponse> => {
  const response = await api.get('/personas', {
    params: {
      sort: q.sortBy,
      skip: q.skip,
      limit: q.limit,
      hairColors: q.filters.hairColors.length ? q.filters.hairColors.join(',') : undefined,
      skinTones: q.filters.skinTones.length ? q.filters.skinTones.join(',') : undefined,
      hasGlasses: q.filters.hasGlasses ?? undefined,
      hasBeard: q.filters.hasBeard ?? undefined,
    },
  });
  return response.data as GalleryResponse;
};

// POST /personas/:id/like
export const likePersona = async (personaId: string): Promise<void> => {
  await api.post(`/personas/${personaId}/like`);
};

// DELETE /personas/:id/like
export const unlikePersona = async (personaId: string): Promise<void> => {
  await api.delete(`/personas/${personaId}/like`);
};

// POST /personas/:id/comments
export const addComment = async (personaId: string, text: string): Promise<void> => {
  await api.post(`/personas/${personaId}/comments`, { text });
};

//DELETE /personas/:personaId
export const deletePersona = async (personaId: string): Promise<void> => {
  await api.delete(`/personas/${personaId}`);
};