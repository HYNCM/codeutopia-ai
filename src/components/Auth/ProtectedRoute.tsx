import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { UserRole } from '../../types'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    // Redirect to login page but save the attempted location
    return <Navigate to='/login' state={{ from: location }} replace />
  }

  if (allowedRoles && (!user.role || !allowedRoles.includes(user.role as UserRole))) {
    // User is authorized but doesn't have the correct role
    // Redirect to a dashboard based on their role, or a generic unauthorized page
    // For now, let's redirect to their primary dashboard or landing
    return <Navigate to='/' replace />
  }

  return <>{children}</>
}
