import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react'
import { User } from '../types'
import { api, getToken, setToken, removeToken } from '../lib/api'
import { MOCK_USERS } from '../services/mockData'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

interface LoginResponse {
  token: string
  user: User
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore user from localStorage on mount
  useEffect(() => {
    const restoreUser = async () => {
      const token = getToken()
      if (token) {
        try {
          // Try to validate token with API
          const userData = await api.get<User>('/api/auth/me')
          setUser(userData)
        } catch {
          // Token invalid or API unavailable, try localStorage
          const savedUser = localStorage.getItem('currentUser')
          if (savedUser) {
            try {
              setUser(JSON.parse(savedUser))
            } catch {
              removeToken()
            }
          }
        }
      } else {
        // No token, check localStorage (for mock users)
        const savedUser = localStorage.getItem('currentUser')
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser))
          } catch {
            console.error('Failed to parse user from local storage')
          }
        }
      }
      setIsLoading(false)
    }
    restoreUser()
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    console.log('Login attempt for:', email)

    try {
      // Try real API first
      const response = await api.post<LoginResponse>('/api/auth/login', { email, password })
      setToken(response.token)
      setUser(response.user)
      localStorage.setItem('currentUser', JSON.stringify(response.user))
      return true
    } catch (apiError) {
      console.warn('API login failed, trying local fallback:', apiError)

      // Fallback to local mock users (for offline development)
      const mockUser = Object.values(MOCK_USERS).find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
      )

      if (mockUser) {
        const { password: _, ...userWithoutPassword } = mockUser as any
        setUser(userWithoutPassword as User)
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword))
        return true
      }

      console.error('Login failed: Invalid credentials')
      return false
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    removeToken()
    localStorage.removeItem('currentUser')
  }, [])

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null
      const updatedUser = { ...prev, ...updates }
      localStorage.setItem('currentUser', JSON.stringify(updatedUser))
      return updatedUser
    })
  }, [])

  return <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
