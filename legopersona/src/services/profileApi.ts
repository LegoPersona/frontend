import api from './api'
import type { ProfileResponse, UpdateProfileResponse } from '@/types/profile'

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
      user: {
        ...response.data.user,
        profileImageUrl: normalizeApiAssetUrl(response.data.user.profileImageUrl),
      },
      personas: response.data.personas.map((persona) => ({
        ...persona,
        originalImageUrl: normalizeApiAssetUrl(persona.originalImageUrl),
        legoImageUrl: normalizeApiAssetUrl(persona.legoImageUrl),
      })),
    }
  },

  async updateProfile(input: { username: string; profileImage?: File | null }): Promise<UpdateProfileResponse> {
    const formData = new FormData()
    formData.append('username', input.username)

    if (input.profileImage) {
      formData.append('profileImage', input.profileImage)
    }

    const response = await api.patch<UpdateProfileResponse>('/users/me/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return {
      user: {
        ...response.data.user,
        profileImageUrl: normalizeApiAssetUrl(response.data.user.profileImageUrl),
      },
    }
  },
}
