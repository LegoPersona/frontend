import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState, type ChangeEvent, type MouseEvent } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import LegoBrick from '@/components/persona/LegoBrick'
import PersonaDetailModal from '@/components/persona/PersonaDetailModal'
import AchievementBadge from '@/components/community/AchievementBadge'
import BeforeAfterSlider from '@/pages/home/BeforeAfterSlider'
import { Plus, Calendar, Boxes, Trophy, Trash2, Pencil, Camera, Save, X, Info, MoreVertical } from 'lucide-react'
import { profileApi } from '@/services/profileApi'
import { deletePersona } from '@/services/personaApi'
import { toast } from '@/components/ui/use-toast'
import type {
  ProfileAchievement,
  ProfilePersona,
  ProfileResponse,
} from '@/types/profile'
import type { Achievement } from '@/components/community/AchievementBadge'

const ACHIEVEMENT_REQUIREMENTS: Record<string, string> = {
  'brick-starter': 'Create 1 persona',
  'master-builder': 'Create 10 personas',
  'crowd-favorite': 'Get 50 likes on one post',
  'community-leader': 'Get 25 comments on one post',
  'social-butterfly': 'Comment on 20 different posts',
  trendsetter: 'Get featured on the homepage',
}

const mapAchievementToBadge = (
  achievement: ProfileAchievement,
): Achievement => ({
  id: achievement.id,
  name: achievement.name,
  description: achievement.description,
  requirement: ACHIEVEMENT_REQUIREMENTS[achievement.id],
  isUnlocked: achievement.isUnlocked,
  unlockedAt: achievement.unlockedAt,
  progress: achievement.progress,
  target: achievement.target,
})

const MAX_PROFILE_IMAGE_SIZE_BYTES = 5 * 1024 * 1024
const ALLOWED_PROFILE_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

const validateUsername = (value: string): string | null => {
  const trimmed = value.trim()

  if (!trimmed) {
    return 'Username is required.'
  }

  if (trimmed.length < 2) {
    return 'Username must be at least 2 characters.'
  }

  if (trimmed.length > 40) {
    return 'Username must be 40 characters or less.'
  }

  return null
}

const getUpdateProfileErrorMessage = (error: unknown): string => {
  const status = (error as { response?: { status?: number } })?.response?.status

  if (status === 400) {
    return 'Please check your username and image format, then try again.'
  }

  if (status === 401) {
    return 'Your session expired. Please sign in again.'
  }

  if (status === 404) {
    return 'Your user record was not found.'
  }

  if (status === 409) {
    return 'That username is already in use.'
  }

  return 'We could not save your profile right now. Please try again.'
}

const PersonaHistorySlider = ({ persona }: { persona: ProfilePersona }) => {
  // Images are publicly served static files, so the URLs can be used directly;
  // the backend sends null when an image is unavailable and BeforeAfterSlider
  // renders the appropriate fallback.
  return (
    <BeforeAfterSlider
      originalImage={persona.originalImageUrl}
      legoImage={persona.legoImageUrl}
      originalAlt="Original uploaded photo"
      legoAlt="Generated LEGO Persona"
      compact
    />
  )
}

const LoadingProfilePage = () => {
  return (
    <div className="min-h-screen bg-background px-4 pb-16 pt-36" data-testid="profile-loading-state">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-12 rounded-2xl bg-card p-6 shadow-card sm:p-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <Skeleton className="h-24 w-24 rounded-2xl" />

            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-56" />
              <Skeleton className="h-5 w-40" />
              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-5 w-28" />
              </div>
            </div>

            <Skeleton className="h-12 w-40" />
          </div>
        </div>

        <section className="mb-16">
          <div className="mb-6 flex flex-col justify-between gap-1 sm:flex-row sm:items-end">
            <div className="space-y-2">
              <Skeleton className="h-8 w-56" />
              <Skeleton className="h-5 w-96 max-w-full" />
            </div>

            <Skeleton className="h-5 w-16" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={`persona-skeleton-${index}`} className="overflow-hidden p-4">
                <Skeleton className="aspect-[4/3] w-full rounded-xl" />
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-t border-border/60 pt-12">
          <div className="mb-7 space-y-2">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-5 w-80 max-w-full" />
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={`achievement-skeleton-${index}`} className="p-4">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-16 w-16 rounded-2xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-52" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

const ProfilePage = () => {
  const { user, updateUser } = useAuth()
  const [profile, setProfile] = useState<ProfileResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUsername, setEditedUsername] = useState('')
  const [selectedProfileImage, setSelectedProfileImage] = useState<File | null>(null)
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  const [isHeaderProfileImageBroken, setIsHeaderProfileImageBroken] = useState(false)
  const [personaIdToDelete, setPersonaIdToDelete] = useState<string | null>(null)
  const [personaToView, setPersonaToView] = useState<ProfilePersona | null>(null)
  const [isDeletingPersona, setIsDeletingPersona] = useState(false)
  const isMountedRef = useRef(true)
  const profileImageInputRef = useRef<HTMLInputElement | null>(null)
  const savedProfileImageUrl = profile?.user.profileImageUrl ?? null

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (!profileImagePreview?.startsWith('blob:')) {
      return
    }

    return () => {
      URL.revokeObjectURL(profileImagePreview)
    }
  }, [profileImagePreview])

  const selectedLocalPreview =
    isEditing && selectedProfileImage
      ? profileImagePreview
      : null

  const resolvedHeaderProfileImage =
    selectedLocalPreview
    ?? savedProfileImageUrl
    ?? null

  // Reset the broken flag when the image URL changes, during render instead of
  // in an effect (https://react.dev/learn/you-might-not-need-an-effect).
  const [lastHeaderProfileImage, setLastHeaderProfileImage] = useState(resolvedHeaderProfileImage)

  if (lastHeaderProfileImage !== resolvedHeaderProfileImage) {
    setLastHeaderProfileImage(resolvedHeaderProfileImage)
    setIsHeaderProfileImageBroken(false)
  }

  // All setState calls live in promise callbacks: isLoading starts as true and
  // retryLoadProfile resets the flags before re-invoking, so the mount effect
  // never sets state synchronously.
  const loadProfile = useCallback(() => {
    profileApi
      .getProfile()
      .then((data) => {
        if (!isMountedRef.current) return

        setProfile(data)
        setEditedUsername(data.user.username)
        setProfileImagePreview(data.user.profileImageUrl)
      })
      .catch((loadError) => {
        console.error('Failed to load profile:', loadError)

        if (!isMountedRef.current) return

        setError("We couldn't load your profile. Please try again.")
      })
      .finally(() => {
        if (isMountedRef.current) {
          setIsLoading(false)
        }
      })
  }, [])

  const retryLoadProfile = useCallback(() => {
    setIsLoading(true)
    setError(null)
    loadProfile()
  }, [loadProfile])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  const handleDeletePersona = useCallback(async () => {
    if (!personaIdToDelete || !profile) return

    setIsDeletingPersona(true)

    try {
      await deletePersona(personaIdToDelete)

      if (!isMountedRef.current) return

      setProfile((previousProfile) => {
        if (!previousProfile) return previousProfile

        const nextPersonas = previousProfile.personas.filter(
          (persona) => persona.id !== personaIdToDelete,
        )

        return {
          ...previousProfile,
          personas: nextPersonas,
          stats: {
            ...previousProfile.stats,
            personasCount: nextPersonas.length,
          },
        }
      })

      toast({
        title: 'Persona deleted',
        description: 'The persona and its associated files were deleted.',
      })
    } catch (deleteError) {
      console.error('Failed to delete persona:', deleteError)

      toast({
        title: 'Delete failed',
        description: 'We could not delete this persona. Please try again.',
        variant: 'destructive',
      })
    } finally {
      if (isMountedRef.current) {
        setIsDeletingPersona(false)
        setPersonaIdToDelete(null)
      }
    }
  }, [personaIdToDelete, profile])

  const handleStartEditing = useCallback(() => {
    if (!profile) return

    setEditedUsername(profile.user.username)
    setProfileImagePreview(profile.user.profileImageUrl)
    setSelectedProfileImage(null)
    setEditError(null)
    setIsEditing(true)
  }, [profile])

  const handleCancelEditing = useCallback(() => {
    if (!profile) return

    setEditedUsername(profile.user.username)
    setProfileImagePreview(profile.user.profileImageUrl)
    setSelectedProfileImage(null)
    setEditError(null)
    setIsEditing(false)
  }, [profile])

  const handleProfileImageSelection = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!ALLOWED_PROFILE_IMAGE_TYPES.has(file.type)) {
      setEditError('Profile image must be JPG, PNG, or WebP.')
      event.target.value = ''
      return
    }

    if (file.size > MAX_PROFILE_IMAGE_SIZE_BYTES) {
      setEditError('Profile image must be 5 MB or smaller.')
      event.target.value = ''
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setSelectedProfileImage(file)
    setProfileImagePreview(objectUrl)
    setEditError(null)
    event.target.value = ''
  }, [])

  const handleSaveProfile = useCallback(async () => {
    if (!profile) return

    const trimmedUsername = editedUsername.trim()
    const usernameError = validateUsername(editedUsername)

    if (usernameError) {
      setEditError(usernameError)
      return
    }

    const usernameChanged = trimmedUsername !== profile.user.username
    const imageChanged = selectedProfileImage !== null

    if (!usernameChanged && !imageChanged) {
      return
    }

    setIsSaving(true)
    setEditError(null)

    try {
      const result = await profileApi.updateProfile({
        username: trimmedUsername,
        profileImage: selectedProfileImage,
      })

      if (!isMountedRef.current) return

      setProfile((previousProfile) => {
        if (!previousProfile) return previousProfile

        return {
          ...previousProfile,
          user: {
            ...previousProfile.user,
            ...result.user,
          },
        }
      })

      updateUser({ username: result.user.username, profileImageUrl: result.user.profileImageUrl })
      setEditedUsername(result.user.username)
      setProfileImagePreview(result.user.profileImageUrl)
      setSelectedProfileImage(null)
      setIsEditing(false)

      toast({
        title: 'Profile updated',
        description: 'Your profile was saved successfully.',
      })
    } catch (saveError) {
      console.error('Failed to save profile:', saveError)

      if (!isMountedRef.current) return

      setEditError(getUpdateProfileErrorMessage(saveError))
    } finally {
      if (isMountedRef.current) {
        setIsSaving(false)
      }
    }
  }, [editedUsername, profile, selectedProfileImage, updateUser])

  if (isLoading) {
    return <LoadingProfilePage />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background px-4 pb-16 pt-36" data-testid="profile-error-state">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-center">
          <Card className="w-full max-w-xl p-8 text-center">
            <h1 className="font-display text-2xl font-bold text-foreground">
              Profile unavailable
            </h1>

            <p className="mt-3 text-muted-foreground">{error}</p>

            <Button className="mt-6" onClick={retryLoadProfile}>
              Retry
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  const usernameValidationError = validateUsername(editedUsername)
  const trimmedUsername = editedUsername.trim()
  const hasUsernameChanged = trimmedUsername !== profile.user.username
  const hasImageChanged = selectedProfileImage !== null
  const hasChanges = hasUsernameChanged || hasImageChanged
  const isSaveDisabled = isSaving || !hasChanges || Boolean(usernameValidationError)

  const personas = profile.personas
  const achievements = profile.achievements.map(mapAchievementToBadge)

  return (
    <div className="min-h-screen bg-background px-4 pb-16 pt-36">
      <div className="mx-auto w-full max-w-7xl">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 rounded-2xl bg-card p-6 shadow-card sm:p-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <input
              ref={profileImageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleProfileImageSelection}
              disabled={!isEditing || isSaving}
            />

            <button
              type="button"
              className="relative mx-auto flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-secondary shadow-lego disabled:cursor-not-allowed lg:mx-0"
              onClick={() => {
                if (!isEditing || isSaving) {
                  return
                }

                profileImageInputRef.current?.click()
              }}
              disabled={!isEditing || isSaving}
              aria-label={isEditing ? 'Choose profile image' : 'Profile image'}
            >
              {resolvedHeaderProfileImage && !isHeaderProfileImageBroken ? (
                <img
                  src={resolvedHeaderProfileImage}
                  alt="Profile"
                  className="h-full w-full object-cover"
                  onError={() => {
                    setIsHeaderProfileImageBroken(true)
                  }}
                />
              ) : (
                <span className="text-4xl">🧱</span>
              )}

              {isEditing && (
                <span className="absolute bottom-1 right-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-foreground shadow">
                  <Camera className="h-4 w-4" />
                </span>
              )}
            </button>

            <div className="min-w-0 flex-1 text-center lg:text-left">
              {isEditing ? (
                <div>
                  <Input
                    value={editedUsername}
                    onChange={(event) => {
                      setEditedUsername(event.target.value)
                      setEditError(null)
                    }}
                    maxLength={40}
                    disabled={isSaving}
                    aria-label="Username"
                    className="mx-auto h-12 max-w-sm text-lg lg:mx-0"
                  />
                  {usernameValidationError && (
                    <p className="mt-2 text-sm text-destructive">{usernameValidationError}</p>
                  )}
                </div>
              ) : (
                <h1 className="font-display text-3xl font-bold text-foreground">
                  {profile.user.username || user?.username || 'LEGO Builder'}
                </h1>
              )}

              <p className="mt-1 text-muted-foreground">
                {profile.user.email || 'LEGO Builder'}
              </p>

              {editError && (
                <p className="mt-2 text-sm text-destructive">{editError}</p>
              )}

              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start">
                <div className="flex items-center gap-2 text-sm">
                  <Boxes className="h-4 w-4 text-primary" />

                  <span>
                    {profile.stats.personasCount} Personas Created
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Trophy className="h-4 w-4 text-secondary" />

                  <span>
                    {profile.stats.unlockedAchievementsCount}/{profile.stats.totalAchievementsCount} Badges
                  </span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center justify-center gap-3 lg:justify-end">
              {!isEditing ? (
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={handleStartEditing}
                  aria-label="Edit profile"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEditing}
                    disabled={isSaving}
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={() => void handleSaveProfile()}
                    disabled={isSaveDisabled}
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                </>
              )}

              <Link to="/create" className="w-full sm:w-auto">
                <Button variant="hero" size="lg" disabled={isSaving} className="w-full sm:w-auto">
                  <Plus className="h-5 w-5" />
                  New Persona
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Personas History */}
        <section className="mb-16">
          <div className="mb-6 flex flex-col justify-between gap-1 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-display text-2xl font-bold">
                Your LEGO Personas
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Drag the slider to compare the original photo with the
                generated LEGO Persona.
              </p>
            </div>

            <span className="text-sm text-muted-foreground">
              {personas.length} total
            </span>
          </div>

          {personas.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {personas.map((persona, index) => (
                <motion.div
                  key={persona.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="h-full"
                >
                  <Card className="relative h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated">
                    <PersonaHistorySlider persona={persona} />

                    <div className="flex items-end justify-between gap-4 p-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />

                          <span>
                            {new Date(
                              persona.createdAt,
                            ).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Boxes className="h-4 w-4 text-primary" />

                          <span>{persona.partsCount} pieces</span>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            aria-label={`Persona ${persona.id} actions`}
                            className="shrink-0"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onSelect={() => {
                              setTimeout(() => setPersonaToView(persona), 0)
                            }}
                          >
                            <Info className="mr-2 h-4 w-4" />
                            View details
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            disabled={isDeletingPersona}
                            onSelect={() => {
                              setTimeout(() => setPersonaIdToDelete(persona.id), 0)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl bg-muted/50 px-4 py-16 text-center"
            >
              <div className="mb-6 flex justify-center gap-2">
                <LegoBrick
                  color="red"
                  size="sm"
                  studs={2}
                  animate
                />

                <LegoBrick
                  color="yellow"
                  size="sm"
                  studs={2}
                  animate
                />

                <LegoBrick
                  color="blue"
                  size="sm"
                  studs={2}
                  animate
                />
              </div>

              <h3 className="font-display mb-2 text-xl font-bold">
                No Personas Yet
              </h3>

              <p className="mb-6 text-muted-foreground">
                Create your first LEGO Persona and see yourself as a
                minifigure!
              </p>

              <Link to="/create">
                <Button variant="hero" size="lg">
                  <Plus className="h-5 w-5" />
                  Create Your First Persona
                </Button>
              </Link>
            </motion.div>
          )}
        </section>

        {/* Achievements */}
        <section className="border-t border-border/60 pt-12">
          <div className="mb-7 flex items-center gap-3">
            <Trophy className="h-7 w-7 text-secondary" />

            <div>
              <h2 className="font-display text-2xl font-bold">
                My Achievements
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Track your progress and unlock new badges.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <AchievementBadge achievement={achievement} />
              </motion.div>
            ))}
          </div>
        </section>

        <AlertDialog
          open={personaIdToDelete !== null}
          onOpenChange={(open: boolean) => {
            if (!open) {
              setPersonaIdToDelete(null)
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this persona?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently remove the persona and related generated assets, including images, model, instructions and parts data.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeletingPersona}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(event: MouseEvent<HTMLButtonElement>) => {
                  event.preventDefault()
                  void handleDeletePersona()
                }}
                disabled={isDeletingPersona}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeletingPersona ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <PersonaDetailModal
          persona={personaToView}
          onClose={() => setPersonaToView(null)}
        />
      </div>
    </div>
  )
}

export default ProfilePage