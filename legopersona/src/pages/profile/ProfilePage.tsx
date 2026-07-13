import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import LegoBrick from '@/components/persona/LegoBrick'
import AchievementBadge from '@/components/community/AchievementBadge'
import BeforeAfterSlider from '@/pages/home/BeforeAfterSlider'
import { Plus, Calendar, Boxes, Trophy } from 'lucide-react'
import exampleOriginal from '@/assets/example-original.png'
import legoPersona from '@/assets/lego-persona.jpeg'
import { userAchievements } from '@/data/mockCommunityData'

interface MockPersona {
  id: string
  createdAt: string
  partsCount: number
  originalImageUrl: string
  legoImageUrl: string
}

const mockPersonas: MockPersona[] = [
  {
    id: '1',
    createdAt: '2026-07-01T10:00:00.000Z',
    partsCount: 24,
    originalImageUrl: exampleOriginal,
    legoImageUrl: legoPersona,
  },
  {
    id: '2',
    createdAt: '2026-07-05T14:30:00.000Z',
    partsCount: 31,
    originalImageUrl: exampleOriginal,
    legoImageUrl: legoPersona,
  },
]

const ProfilePage = () => {
  const { user } = useAuth()

  const personas = mockPersonas

  const unlockedCount = userAchievements.filter(
    (achievement) => achievement.isUnlocked,
  ).length

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
                {user?.username || 'LEGO Builder'}
              </h1>

              <p className="mt-1 text-muted-foreground">
                {user?.username || 'LEGO Builder'}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:justify-start">
                <div className="flex items-center gap-2 text-sm">
                  <Boxes className="h-4 w-4 text-primary" />

                  <span>
                    {personas.length} Personas Created
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Trophy className="h-4 w-4 text-secondary" />

                  <span>
                    {unlockedCount}/{userAchievements.length} Badges
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
                  <Card className="h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated">
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
            {userAchievements.map((achievement, index) => (
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