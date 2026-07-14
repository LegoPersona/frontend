import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Mode = 'login' | 'register'

function AuthPage() {
  const [mode, setMode] = useState<Mode>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login, register, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const googleButtonRef = useRef<HTMLDivElement>(null)
  const profileImageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) return

    const initGoogle = () => {
      if (!window.google || !googleButtonRef.current) return
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          try {
            await loginWithGoogle(response.credential)
            navigate('/')
          } catch (err) {
            console.error('Google sign-in failed:', err)
            setError('Google sign-in failed. Please try again.')
          }
        },
      })
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        width: 320,
      })
    }

    if (window.google) {
      initGoogle()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.onload = initGoogle
    script.onerror = () => console.error('Failed to load Google sign-in script')
    document.head.appendChild(script)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const clearProfileImage = () => {
    setProfileImage(null)
    setProfileImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    if (profileImageInputRef.current) {
      profileImageInputRef.current.value = ''
    }
  }

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setProfileImage(file)
    setProfileImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return file ? URL.createObjectURL(file) : null
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      if (mode === 'login') {
        await login(username, password)
      } else {
        await register(username, password, profileImage)
      }
      navigate('/')
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const switchMode = (next: Mode) => {
    setMode(next)
    setError('')
    setUsername('')
    setPassword('')
    clearProfileImage()
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm p-8 rounded-xl border border-border bg-card shadow-sm">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          {mode === 'login' ? 'Sign in' : 'Create account'}
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>
          {mode === 'register' && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="profileImage">Profile picture (optional)</Label>
              <input
                ref={profileImageInputRef}
                id="profileImage"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleProfileImageChange}
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => profileImageInputRef.current?.click()}
                  className={`flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-secondary transition-colors hover:border-primary ${
                    profileImagePreview ? 'border-border' : 'border-dashed border-border'
                  }`}
                >
                  {profileImagePreview ? (
                    <img
                      src={profileImagePreview}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Camera className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                <div className="flex flex-col items-start gap-0.5">
                  <button
                    type="button"
                    onClick={() => profileImageInputRef.current?.click()}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {profileImage ? 'Change photo' : 'Upload photo'}
                  </button>
                  {profileImage ? (
                    <button
                      type="button"
                      onClick={clearProfileImage}
                      className="text-xs text-muted-foreground transition-colors hover:text-destructive"
                    >
                      Remove
                    </button>
                  ) : (
                    <span className="text-xs text-muted-foreground">JPG, PNG or WEBP</span>
                  )}
                </div>
              </div>
            </div>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </Button>
        </form>
        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div ref={googleButtonRef} className="flex justify-center" />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            className="text-primary hover:underline"
            onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default AuthPage
