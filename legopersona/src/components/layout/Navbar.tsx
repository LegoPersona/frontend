import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { usePersonaGeneration } from '@/contexts/PersonaGenerationContext'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { User, LogOut, Menu, X, Users, Sparkles, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import RateLimitGauge from '@/components/persona/RateLimitGauge'
import UserMenu from '@/components/layout/UserMenu'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import fullLogo from '@/assets/full-logo.png'

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isHome = location.pathname === '/' || location.pathname === '/auth'

  const { isRunning, isReady, isFailed, progress } = usePersonaGeneration()
  const onCreatePage = location.pathname === '/create'

  // Off the create page, the Create button doubles as a "back to pipeline"
  // button reflecting the run's live state.
  const createButtonContent = (() => {
    if (!onCreatePage && isRunning) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Generating… {progress}%
        </>
      )
    }
    if (!onCreatePage && isReady) {
      return (
        <>
          <CheckCircle2 className="w-4 h-4" />
          Persona ready!
        </>
      )
    }
    if (!onCreatePage && isFailed) {
      return (
        <>
          <AlertCircle className="w-4 h-4" />
          Generation failed
        </>
      )
    }
    return (
      <>
        <Sparkles className="w-4 h-4" />
        Create
      </>
    )
  })()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center transition-transform hover:scale-105">
            <img src={fullLogo} alt="Logo Persona" className="h-14 w-auto object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/community">
              <Button
                variant="ghost"
                className={cn('gap-2', location.pathname === '/community' && 'bg-muted')}
              >
                <Users className="w-4 h-4" />
                Community
              </Button>
            </Link>
            <Link to="/create">
              <Button className="gap-2 shadow-lego">
                {createButtonContent}
              </Button>
            </Link>
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              !isHome && (
                <Link to="/auth">
                  <Button variant="default">Login</Button>
                </Link>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* LEGO color stripe */}
      <div className="flex h-1">
        <div className="flex-1 bg-lego-red" />
        <div className="flex-1 bg-lego-yellow" />
        <div className="flex-1 bg-lego-blue" />
        <div className="flex-1 bg-lego-green" />
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card border-b border-border overflow-hidden"
          >
            <div className="container mx-auto px-6 py-5 flex flex-col gap-4">
              <Link to="/community" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Users className="w-4 h-4" />
                  Community
                </Button>
              </Link>
              <Link to="/create" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full justify-start gap-2 shadow-lego">
                  {createButtonContent}
                </Button>
              </Link>
              {isAuthenticated ? (
                <>
                  <Separator />
                  <div className="flex items-center gap-3 px-4">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 font-display font-bold text-primary">
                        {user?.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user?.username}</span>
                  </div>
                  <RateLimitGauge label="daily creations left" className="px-4" />
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <User className="w-4 h-4" />
                      Profile
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                    onClick={() => { logout(); setMobileMenuOpen(false) }}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="default" className="w-full">Login</Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
