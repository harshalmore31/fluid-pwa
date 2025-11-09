import { createContext, useContext, useMemo, useState } from 'react';
import { mockUsers } from '../data/mockData';

export type PerformanceBadge = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  rollNo: string;
  branch: string;
  year: number;
  bio?: string;
  profilePicture?: string;
  skills: string[];
  interests: string[];
  github?: string;
  linkedin?: string;
  portfolio?: string;
  performanceScore: number;
  totalHackathons: number;
  badge: PerformanceBadge;
  lookingForTeam: boolean;
  connections: string[];
  isAdmin?: boolean;
  onboarded: boolean;
}

interface AuthContextValue {
  user: UserProfile | null;
  login: (email: string) => string | null;
  logout: () => void;
  updateProfile: (changes: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const badgeForScore = (score: number): PerformanceBadge => {
  if (score > 200) return 'Expert';
  if (score >= 100) return 'Advanced';
  if (score >= 50) return 'Intermediate';
  return 'Beginner';
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  const login = (email: string) => {
    if (!email.endsWith('@vit.edu.in')) {
      return 'Please use your @vit.edu.in email to sign in.';
    }

    const existing = mockUsers.find((u) => u.email === email);
    if (existing) {
      setUser(existing);
      return null;
    }

    const newUser: UserProfile = {
      id: crypto.randomUUID(),
      email,
      name: '',
      rollNo: '',
      branch: '',
      year: new Date().getFullYear() - 2000,
      bio: '',
      skills: [],
      interests: [],
      performanceScore: 0,
      totalHackathons: 0,
      badge: 'Beginner',
      lookingForTeam: false,
      connections: [],
      onboarded: false
    };

    setUser(newUser);
    mockUsers.push(newUser);
    return null;
  };

  const logout = () => setUser(null);

  const updateProfile = (changes: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...changes };
      next.badge = badgeForScore(next.performanceScore);
      const index = mockUsers.findIndex((u) => u.id === next.id);
      if (index !== -1) {
        mockUsers[index] = next;
      }
      return next;
    });
  };

  const value = useMemo(() => ({ user, login, logout, updateProfile }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
