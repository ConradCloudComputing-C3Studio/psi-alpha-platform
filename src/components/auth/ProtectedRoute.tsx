'use client'

import React, { ReactNode } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { rbac } from '@/lib/auth'
import type { UserRole } from '@/types'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRoles?: UserRole[]
  fallback?: ReactNode
  loadingComponent?: ReactNode
}

export default function ProtectedRoute({ 
  children, 
  requiredRoles = [], 
  fallback,
  loadingComponent 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  // Show loading component while checking authentication
  if (loading) {
    return loadingComponent || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show fallback if user is not authenticated
  if (!user) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">Please sign in to access this page.</p>
          <a
            href="/auth/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Sign In
          </a>
        </div>
      </div>
    )
  }

  // Check role-based access if required roles are specified
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => {
      switch (role) {
        case 'admin':
          return rbac.canAccessAdmin(user)
        case 'advisor':
          return rbac.canManageChapters(user)
        case 'member':
          return user.groups.includes('member') || user.groups.includes('advisor') || user.groups.includes('admin')
        default:
          return user.groups.includes(role)
      }
    })

    if (!hasRequiredRole) {
      return fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">
              You don't have the required permissions to access this page.
            </p>
            <p className="text-sm text-gray-500">
              Required roles: {requiredRoles.join(', ')}
            </p>
          </div>
        </div>
      )
    }
  }

  return <>{children}</>
}

// Specific role-based components
export function AdminRoute({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={['admin']} fallback={fallback}>
      {children}
    </ProtectedRoute>
  )
}

export function AdvisorRoute({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={['admin', 'advisor']} fallback={fallback}>
      {children}
    </ProtectedRoute>
  )
}

export function MemberRoute({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={['admin', 'advisor', 'member']} fallback={fallback}>
      {children}
    </ProtectedRoute>
  )
}

