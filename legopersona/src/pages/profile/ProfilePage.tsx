import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import LegoBrick from '@/components/persona/LegoBrick'
import AchievementBadge from '@/components/community/AchievementBadge'
import BeforeAfterSlider from '@/pages/home/BeforeAfterSlider'
import { Plus, Calendar, Boxes, Trophy, Trash2 } from 'lucide-react'
import { profileApi } from '@/services/profileApi'
import { deletePersona } from '@/services/personaApi'
import { toast } from '@/components/ui/use-toast'
import type {
  ProfileAchievement,
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
  const { user } = useAuth()
  const [profile, setProfile] = useState<ProfileResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [personaIdToDelete, setPersonaIdToDelete] = useState<string | null>(null)
  const [isDeletingPersona, setIsDeletingPersona] = useState(false)
  const isMountedRef = useRef(true)

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const loadProfile = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await profileApi.getProfile()

      if (!isMountedRef.current) return

      setProfile(data)
    } catch (loadError) {
      console.error('Failed to load profile:', loadError)

      if (!isMountedRef.current) return

      setError("We couldn't load your profile. Please try again.")
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    void loadProfile()
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

            <Button className="mt-6" onClick={() => void loadProfile()}>
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
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-secondary shadow-lego">
              <span className="text-4xl">🧱</span>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="font-display text-3xl font-bold text-foreground">
                {profile.user.username || user?.username || 'LEGO Builder'}
              </h1>

              <p className="mt-1 text-muted-foreground">
                {profile.user.email || 'LEGO Builder'}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:justify-start">
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

            <Link to="/create">
              <Button variant="hero" size="lg">
                <Plus className="h-5 w-5" />
                New Persona
              </Button>
            </Link>
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
                    {/* TODO: Add navigation to a persona details route when one exists in AppRoutes. */}
                    <div className="absolute right-3 top-3 z-30">
                      <AlertDialog
                        open={personaIdToDelete === persona.id}
                        onOpenChange={(open) => {
                          setPersonaIdToDelete(open ? persona.id : null)
                        }}
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            aria-label={`Delete persona ${persona.id}`}
                            onClick={(event) => {
                              event.stopPropagation()
                              setPersonaIdToDelete(persona.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>

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
                              onClick={(event) => {
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
                    </div>

                    <BeforeAfterSlider
                      originalImage={persona.originalImageUrl}
                      legoImage={persona.legoImageUrl}
                      originalAlt="Original uploaded photo"
                      legoAlt="Generated LEGO Persona"
                      compact
                    />

                    <div className="space-y-2 p-4">
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
      </div>
    </div>
  )
}

export default ProfilePage