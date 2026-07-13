import { BrowserRouter } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import ProfilePage from './ProfilePage'
import type { ProfileResponse } from '@/types/profile'
import type { Mock } from 'vitest'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { userId: 'user-1', username: 'auth-user' },
  }),
}))

vi.mock('@/services/profileApi', () => ({
  profileApi: {
    getProfile: vi.fn(),
  },
}))

vi.mock('@/services/personaApi', () => ({
  deletePersona: vi.fn(),
}))

vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
}))

const { profileApi } = await import('@/services/profileApi')
const { deletePersona } = await import('@/services/personaApi')
const { toast } = await import('@/components/ui/use-toast')

const renderProfilePage = () => {
  return render(
    <BrowserRouter>
      <ProfilePage />
    </BrowserRouter>,
  )
}

const createProfileResponse = (overrides?: Partial<ProfileResponse>): ProfileResponse => ({
  user: {
    id: 'user-1',
    username: 'ofek_morali',
    email: 'ofek@example.com',
  },
  stats: {
    personasCount: 2,
    unlockedAchievementsCount: 1,
    totalAchievementsCount: 6,
  },
  personas: [
    {
      id: 'persona-2',
      createdAt: '2026-07-05T14:30:00.000Z',
      partsCount: 31,
      originalImageUrl: 'https://cdn.example.com/original-2.png',
      legoImageUrl: 'https://cdn.example.com/lego-2.png',
    },
    {
      id: 'persona-1',
      createdAt: '2026-07-01T10:00:00.000Z',
      partsCount: 24,
      originalImageUrl: 'https://cdn.example.com/original-1.png',
      legoImageUrl: 'https://cdn.example.com/lego-1.png',
    },
  ],
  achievements: [
    {
      id: 'brick-starter',
      name: 'Brick Starter',
      description: 'Created your first LEGO Persona',
      isUnlocked: true,
      unlockedAt: '2026-07-01T10:00:00.000Z',
      progress: 1,
      target: 1,
    },
    {
      id: 'master-builder',
      name: 'Master Builder',
      description: 'Created your 10th LEGO Persona',
      isUnlocked: false,
      unlockedAt: null,
      progress: 2,
      target: 10,
    },
  ],
  ...overrides,
})

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state while profile is loading', async () => {
    ;(profileApi.getProfile as Mock).mockImplementation(
      () => new Promise(() => undefined),
    )

    renderProfilePage()

    expect(screen.getByTestId('profile-loading-state')).toBeInTheDocument()
  })

  it('renders profile user details from API', async () => {
    ;(profileApi.getProfile as Mock).mockResolvedValue(createProfileResponse())

    renderProfilePage()

    expect(await screen.findByText('ofek_morali')).toBeInTheDocument()
    expect(screen.getByText('ofek@example.com')).toBeInTheDocument()
  })

  it('renders persona count from API', async () => {
    ;(profileApi.getProfile as Mock).mockResolvedValue(createProfileResponse())

    renderProfilePage()

    expect(await screen.findByText('2 Personas Created')).toBeInTheDocument()
  })

  it('renders badge count from API', async () => {
    ;(profileApi.getProfile as Mock).mockResolvedValue(createProfileResponse())

    renderProfilePage()

    expect(await screen.findByText('1/6 Badges')).toBeInTheDocument()
  })

  it('renders personas from API', async () => {
    ;(profileApi.getProfile as Mock).mockResolvedValue(createProfileResponse())

    renderProfilePage()

    expect(await screen.findByText('31 pieces')).toBeInTheDocument()
    expect(screen.getByText('24 pieces')).toBeInTheDocument()
  })

  it('passes image URLs into BeforeAfterSlider output', async () => {
    ;(profileApi.getProfile as Mock).mockResolvedValue(createProfileResponse())

    renderProfilePage()

    const originalImages = await screen.findAllByAltText('Original uploaded photo')
    const legoImages = await screen.findAllByAltText('Generated LEGO Persona')

    expect(originalImages[0]).toHaveAttribute('src', 'https://cdn.example.com/original-2.png')
    expect(legoImages[0]).toHaveAttribute('src', 'https://cdn.example.com/lego-2.png')
  })

  it('renders achievements from API data', async () => {
    ;(profileApi.getProfile as Mock).mockResolvedValue(createProfileResponse())

    renderProfilePage()

    expect(await screen.findByText('Brick Starter')).toBeInTheDocument()
    expect(screen.getByText('Master Builder')).toBeInTheDocument()
  })

  it('renders empty persona state when user has no personas', async () => {
    ;(profileApi.getProfile as Mock).mockResolvedValue(
      createProfileResponse({
        personas: [],
        stats: {
          personasCount: 0,
          unlockedAchievementsCount: 0,
          totalAchievementsCount: 6,
        },
      }),
    )

    renderProfilePage()

    expect(await screen.findByText('No Personas Yet')).toBeInTheDocument()
  })

  it('shows error and retries successfully', async () => {
    ;(profileApi.getProfile as Mock)
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce(createProfileResponse())

    renderProfilePage()

    expect(
      await screen.findByText("We couldn't load your profile. Please try again."),
    ).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Retry' }))

    expect(await screen.findByText('ofek_morali')).toBeInTheDocument()
    expect(profileApi.getProfile).toHaveBeenCalledTimes(2)
  })

  it('deletes a persona and updates the UI', async () => {
    ;(profileApi.getProfile as Mock).mockResolvedValue(createProfileResponse())
    ;(deletePersona as Mock).mockResolvedValue(undefined)

    renderProfilePage()

    expect(await screen.findByText('2 Personas Created')).toBeInTheDocument()

    await userEvent.click(screen.getByLabelText('Delete persona persona-2'))
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

    await waitFor(() => {
      expect(screen.getByText('1 Personas Created')).toBeInTheDocument()
    })

    expect(screen.queryByText('31 pieces')).not.toBeInTheDocument()
    expect(toast).toHaveBeenCalled()
  })

  it('does not render old mock count values', async () => {
    ;(profileApi.getProfile as Mock).mockResolvedValue(
      createProfileResponse({
        stats: {
          personasCount: 1,
          unlockedAchievementsCount: 1,
          totalAchievementsCount: 2,
        },
        personas: [createProfileResponse().personas[0]],
      }),
    )

    renderProfilePage()

    expect(await screen.findByText('1 Personas Created')).toBeInTheDocument()
    expect(screen.queryByText('2 Personas Created')).not.toBeInTheDocument()
  })

  it('handles null image URLs without broken img sources', async () => {
    ;(profileApi.getProfile as Mock).mockResolvedValue(
      createProfileResponse({
        personas: [
          {
            id: 'persona-null-images',
            createdAt: '2026-07-06T10:00:00.000Z',
            partsCount: 5,
            originalImageUrl: null,
            legoImageUrl: null,
          },
        ],
        stats: {
          personasCount: 1,
          unlockedAchievementsCount: 1,
          totalAchievementsCount: 6,
        },
      }),
    )

    const { container } = renderProfilePage()

    expect(
      await screen.findByText('Images are not available for this persona yet.'),
    ).toBeInTheDocument()

    const brokenImage = container.querySelector('img[src="null"]')
    expect(brokenImage).not.toBeInTheDocument()
  })
})
