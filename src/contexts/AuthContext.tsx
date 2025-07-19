'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { auth, type AuthUser } from '@/lib/auth'
import { configureAmplify } from '@/lib/amplify'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (params: { email: string; password: string; firstName: string; lastName: string }) => Promise<any>
  signOut: () => Promise<any>
  confirmSignUp: (email: string, code: string) => Promise<any>
  resendConfirmationCode: (email: string) => Promise<any>
  resetPassword: (email: string) => Promise<any>
  confirmResetPassword: (email: string, code: string, newPassword: string) => Promise<any>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize Amplify and check for existing session
  useEffect(() => {
    configureAmplify()
    checkAuthState()
  }, [])

  const checkAuthState = async () => {
    try {
      setLoading(true)
      const currentUser = await auth.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Auth state check error:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const refreshUser = async () => {
    try {
      const currentUser = await auth.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Refresh user error:', error)
      setUser(null)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const result = await auth.signIn({ email, password })
      
      if (result.success && result.user) {
        setUser(result.user)
      }
      
      return result
    } catch (error) {
      console.error('Sign in error:', error)
      return { success: false, error: 'Failed to sign in' }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (params: { email: string; password: string; firstName: string; lastName: string }) => {
    try {
      setLoading(true)
      const result = await auth.signUp(params)
      return result
    } catch (error) {
      console.error('Sign up error:', error)
      return { success: false, error: 'Failed to sign up' }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const result = await auth.signOut()
      
      if (result.success) {
        setUser(null)
      }
      
      return result
    } catch (error) {
      console.error('Sign out error:', error)
      return { success: false, error: 'Failed to sign out' }
    } finally {
      setLoading(false)
    }
  }

  const confirmSignUp = async (email: string, code: string) => {
    try {
      const result = await auth.confirmSignUp(email, code)
      return result
    } catch (error) {
      console.error('Confirm sign up error:', error)
      return { success: false, error: 'Failed to confirm sign up' }
    }
  }

  const resendConfirmationCode = async (email: string) => {
    try {
      const result = await auth.resendConfirmationCode(email)
      return result
    } catch (error) {
      console.error('Resend confirmation code error:', error)
      return { success: false, error: 'Failed to resend confirmation code' }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const result = await auth.resetPassword(email)
      return result
    } catch (error) {
      console.error('Reset password error:', error)
      return { success: false, error: 'Failed to reset password' }
    }
  }

  const confirmResetPassword = async (email: string, code: string, newPassword: string) => {
    try {
      const result = await auth.confirmResetPassword(email, code, newPassword)
      return result
    } catch (error) {
      console.error('Confirm reset password error:', error)
      return { success: false, error: 'Failed to confirm reset password' }
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    confirmSignUp,
    resendConfirmationCode,
    resetPassword,
    confirmResetPassword,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Higher-order component for protected routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles?: string[]
) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth()

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      )
    }

    if (!user) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600">Please sign in to access this page.</p>
          </div>
        </div>
      )
    }

    if (requiredRoles && !requiredRoles.some(role => user.groups.includes(role))) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      )
    }

    return <Component {...props} />
  }
}

