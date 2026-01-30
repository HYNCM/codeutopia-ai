import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { User } from '../types'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => boolean
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

import { MOCK_USERS } from '../services/mockData'

// Mock Users Data
// Moved to services/mockData.ts

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Restore user from local storage
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        console.error('Failed to parse user from local storage')
      }
    }
  }, [])

  const login = (email: string, password: string): boolean => {
    console.log('Login attempt for:', email)

    // Find user by email and password
    const user = Object.values(MOCK_USERS).find(
      (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    )

    if (user) {
      setUser(user as User)
      localStorage.setItem('currentUser', JSON.stringify(user))
      return true
    } else {
      console.error('Login failed: Invalid credentials')
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null
      const updatedUser = { ...prev, ...updates }
      localStorage.setItem('currentUser', JSON.stringify(updatedUser))
      return updatedUser
    })
  }

  return <AuthContext.Provider value={{ user, login, logout, updateUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
