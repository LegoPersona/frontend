import api from './api';
import type { PersonaDocument } from '@/types/persona';

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

export const deletePersona = async (personaId: string): Promise<void> => {
  await api.delete(`/personas/${personaId}`);
};