export interface ProfileUser {
  id: string
  username: string
  email?: string | null
  profileImageUrl: string | null
}

export interface UpdateProfileResponse {
  user: ProfileUser
}

export interface ProfileStats {
  personasCount: number
  unlockedAchievementsCount: number
  totalAchievementsCount: number
}

export interface ProfilePersona {
  id: string
  createdAt: string
  partsCount: number
  originalImageUrl: string | null
  legoImageUrl: string | null
}

export interface ProfileAchievement {
  id: string
  name: string
  description: string
  isUnlocked: boolean
  unlockedAt: string | null
  progress: number
  target: number
}

export interface ProfileResponse {
  user: ProfileUser
  stats: ProfileStats
  personas: ProfilePersona[]
  achievements: ProfileAchievement[]
}
