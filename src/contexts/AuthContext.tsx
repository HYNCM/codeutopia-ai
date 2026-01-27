import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { User, UserRole } from '../types'

interface AuthContextType {
  user: User | null
  login: (role: UserRole) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock Users Data
const MOCK_USERS: Record<string, User> = {
  project_initiator: {
    id: '1',
    name: '張偉明',
    email: 'initiator@codeutopia.ai',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang',
    role: 'project_initiator',
    company: '創新科技有限公司',
    rating: 4.8,
    completedProjects: 12,
    balance: 45000,
    skills: ['項目管理', '產品設計'],
    verified: true,
    memberSince: '2024-03-15',
    location: '上海',
    timezone: 'Asia/Shanghai',
    bio: '專注於數位轉型的科技企業，尋找優質開發團隊合作',
  },
  contractor: {
    id: '2',
    name: 'Alex Chen',
    email: 'contractor@codeutopia.ai',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    role: 'contractor',
    rating: 4.9,
    completedProjects: 35,
    balance: 12400,
    skills: ['React', 'Node.js', 'Python', 'AWS'],
    verified: true,
    memberSince: '2023-11-20',
    location: '新加坡',
    timezone: 'Asia/Singapore',
    bio: '全棧開發工程師，擁有豐富的跨國項目交付經驗',
  },
  webadmin: {
    id: 'admin1',
    name: 'System Admin',
    email: 'webadmin@codeutopia.ai',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    role: 'webadmin',
    verified: true,
    memberSince: '2023-01-01',
    location: 'Global',
    timezone: 'UTC',
    rating: 0,
    completedProjects: 0,
    balance: 0,
    skills: [],
    bio: 'System Administrator',
  },
  regional_manager: {
    id: 'rm1',
    name: 'Sarah Lee',
    email: 'regional@codeutopia.ai',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    role: 'regional_manager',
    location: 'Tokyo',
    timezone: 'Asia/Tokyo',
    verified: true,
    memberSince: '2023-06-15',
    rating: 5.0,
    completedProjects: 0,
    balance: 0,
    skills: ['Regional Management', 'Dispute Resolution'],
    bio: 'Regional Manager for APAC',
  },
}

// Fallback for old roles
const LEGACY_MAPPING: Record<string, string> = {
  client: 'project_initiator',
  developer: 'contractor',
  admin: 'webadmin',
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Restore user from local storage
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        console.error('Failed to parse user from local storage')
      }
    }
  }, [])

  const login = (role: UserRole) => {
    console.log('Login attempt as:', role)
    const targetRole = LEGACY_MAPPING[role] || role
    const mockUser = MOCK_USERS[targetRole]

    if (mockUser) {
      setUser(mockUser)
      localStorage.setItem('currentUser', JSON.stringify(mockUser))
    } else {
      console.error('No mock user found for role:', role)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
