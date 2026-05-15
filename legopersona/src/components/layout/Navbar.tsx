import { Link, useLocation } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { User, LogOut, Menu, X, Users } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import fullLogo from '@/assets/full-logo.png';

const Navbar = () => {
//   const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = location.pathname === '/' || location.pathname === '/auth';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={fullLogo}
              alt="Logo Persona"
              className="h-14 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/community">
              <Button variant="ghost" className="gap-2">
                <Users className="w-4 h-4" />
                Community
              </Button>
            </Link>
            {/* {isAuthenticated ? ( */}
              <>
                <Link to="/profile">
                  <Button variant="ghost" className="gap-2">
                    <User className="w-4 h-4" />
                    {/* {user?.name} */}
                    {'Ofek Morali'}
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={() => { /* logout(); */ }}>
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            {/* ) : (
              !isHome && (
                <Link to="/auth">
                  <Button variant="default">Login</Button>
                </Link>
              )
            )} */}
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card border-b border-border overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              <Link to="/community" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Users className="w-4 h-4" />
                  Community
                </Button>
              </Link>
              {/* {isAuthenticated ? ( */}
                <>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <User className="w-4 h-4" />
                      {/* {user?.name} */}
                    {'Ofek Morali'}
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={() => { /* logout(); */ setMobileMenuOpen(false); }}>
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </>
              {/* ) : (
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="default" className="w-full">Login</Button>
                </Link>
              )} */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
