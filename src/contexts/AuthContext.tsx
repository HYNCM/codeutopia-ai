import { createContext, useContext, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Demo user for MVP
  const user: User = {
    id: '1',
    name: '張偉明',
    email: 'weiming@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang',
    role: 'client',
    company: '創新科技有限公司',
    rating: 4.8,
    completedProjects: 12,
    balance: 45000,
    skills: ['項目管理', '產品設計'],
    verified: true,
    memberSince: '2024-03-15',
    location: '台北',
    timezone: 'Asia/Taipei',
    bio: '專注於數位轉型的科技企業，尋找優質開發團隊合作',
  };

  const login = (role: UserRole) => {
    console.log('Login as:', role);
  };

  const logout = () => {
    console.log('Logout');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
