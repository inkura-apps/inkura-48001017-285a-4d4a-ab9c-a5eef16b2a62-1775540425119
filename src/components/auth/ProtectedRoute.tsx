import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../../contexts/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
  redirectTo?: string
}

/**
 * Wrap any route element with <ProtectedRoute> to require authentication.
 * Shows a loading spinner while the initial session check is in flight,
 * preventing a flash of the login page for already-authenticated users.
 */
export function ProtectedRoute({ children, redirectTo = '/login' }: ProtectedRouteProps) {
  const { user, loading } = useAuthContext()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}
