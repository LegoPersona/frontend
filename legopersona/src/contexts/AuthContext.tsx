import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'google' | 'facebook' | 'email' | 'guest';
}

interface LegoPersona {
  id: string;
  createdAt: Date;
  originalImage: string;
  legoImage: string;
  partsCount: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  personas: LegoPersona[];
  login: (provider: 'google' | 'facebook' | 'email', credentials?: { email: string; password: string }) => void;
  continueAsGuest: () => void;
  logout: () => void;
  addPersona: (persona: LegoPersona) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock personas for demo
const mockPersonas: LegoPersona[] = [
  {
    id: '1',
    createdAt: new Date('2024-01-15'),
    originalImage: '/placeholder.svg',
    legoImage: '/placeholder.svg',
    partsCount: 24,
  },
  {
    id: '2',
    createdAt: new Date('2024-02-20'),
    originalImage: '/placeholder.svg',
    legoImage: '/placeholder.svg',
    partsCount: 31,
  },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [personas, setPersonas] = useState<LegoPersona[]>([]);

  const login = (provider: 'google' | 'facebook' | 'email', credentials?: { email: string; password: string }) => {
    // Mock login
    const mockUser: User = {
      id: '1',
      name: provider === 'email' && credentials ? credentials.email.split('@')[0] : 'LEGO Fan',
      email: provider === 'email' && credentials ? credentials.email : `user@${provider}.com`,
      provider,
    };
    setUser(mockUser);
    setPersonas(mockPersonas);
  };

  const continueAsGuest = () => {
    const guestUser: User = {
      id: 'guest-' + Date.now(),
      name: 'Guest Builder',
      email: '',
      provider: 'guest',
    };
    setUser(guestUser);
    setPersonas([]);
  };

  const logout = () => {
    setUser(null);
    setPersonas([]);
  };

  const addPersona = (persona: LegoPersona) => {
    setPersonas((prev) => [persona, ...prev]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        personas,
        login,
        continueAsGuest,
        logout,
        addPersona,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
