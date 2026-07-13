import api from './api'
import type { ProfileResponse } from '@/types/profile'

const isAbsoluteUrl = (url: string): boolean => /^https?:\/\//i.test(url)

export const normalizeApiAssetUrl = (url: string | null): string | null => {
  if (!url) {
    return null
  }

  if (isAbsoluteUrl(url)) {
    return url
  }

  const baseUrl = api.defaults.baseURL
  if (!baseUrl) {
    return url
  }

  try {
    return new URL(url, baseUrl).toString()
  } catch {
    return url
  }
}

export const profileApi = {
  async getProfile(): Promise<ProfileResponse> {
    const response = await api.get<ProfileResponse>('/users/me/profile')

    return {
      ...response.data,
      personas: response.data.personas.map((persona) => ({
        ...persona,
        originalImageUrl: normalizeApiAssetUrl(persona.originalImageUrl),
        legoImageUrl: normalizeApiAssetUrl(persona.legoImageUrl),
      })),
    }
  },
}
