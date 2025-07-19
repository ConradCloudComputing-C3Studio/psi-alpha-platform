import { 
  signIn, 
  signUp, 
  signOut, 
  getCurrentUser, 
  fetchAuthSession,
  confirmSignUp,
  resendSignUpCode,
  resetPassword,
  confirmResetPassword
} from 'aws-amplify/auth'
import type { User, UserRole } from '@/types'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  groups: string[]
  isAuthenticated: boolean
}

export interface SignUpParams {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface SignInParams {
  email: string
  password: string
}

// Authentication functions
export const auth = {
  // Sign up new user
  async signUp({ email, password, firstName, lastName }: SignUpParams) {
    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            given_name: firstName,
            family_name: lastName,
          }
        }
      })

      return {
        success: true,
        isSignUpComplete,
        userId,
        nextStep,
        message: 'Account created successfully. Please check your email for verification.'
      }
    } catch (error: any) {
      console.error('Sign up error:', error)
      return {
        success: false,
        error: error.message || 'Failed to create account'
      }
    }
  },

  // Confirm sign up with verification code
  async confirmSignUp(email: string, confirmationCode: string) {
    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username: email,
        confirmationCode
      })

      return {
        success: true,
        isSignUpComplete,
        nextStep,
        message: 'Email verified successfully'
      }
    } catch (error: any) {
      console.error('Confirm sign up error:', error)
      return {
        success: false,
        error: error.message || 'Failed to verify email'
      }
    }
  },

  // Resend verification code
  async resendConfirmationCode(email: string) {
    try {
      await resendSignUpCode({ username: email })
      return {
        success: true,
        message: 'Verification code sent to your email'
      }
    } catch (error: any) {
      console.error('Resend code error:', error)
      return {
        success: false,
        error: error.message || 'Failed to resend verification code'
      }
    }
  },

  // Sign in user
  async signIn({ email, password }: SignInParams) {
    try {
      const { isSignedIn, nextStep } = await signIn({
        username: email,
        password
      })

      if (isSignedIn) {
        const user = await this.getCurrentUser()
        return {
          success: true,
          user,
          message: 'Signed in successfully'
        }
      }

      return {
        success: false,
        nextStep,
        error: 'Additional steps required'
      }
    } catch (error: any) {
      console.error('Sign in error:', error)
      return {
        success: false,
        error: error.message || 'Failed to sign in'
      }
    }
  },

  // Sign out user
  async signOut() {
    try {
      await signOut()
      return {
        success: true,
        message: 'Signed out successfully'
      }
    } catch (error: any) {
      console.error('Sign out error:', error)
      return {
        success: false,
        error: error.message || 'Failed to sign out'
      }
    }
  },

  // Get current authenticated user
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const user = await getCurrentUser()
      const session = await fetchAuthSession()
      
      const groups = session.tokens?.accessToken?.payload['cognito:groups'] as string[] || []
      const role = this.determineUserRole(groups)

      return {
        id: user.userId,
        email: user.signInDetails?.loginId || '',
        role,
        groups,
        isAuthenticated: true
      }
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  },

  // Reset password
  async resetPassword(email: string) {
    try {
      const output = await resetPassword({ username: email })
      return {
        success: true,
        nextStep: output.nextStep,
        message: 'Password reset code sent to your email'
      }
    } catch (error: any) {
      console.error('Reset password error:', error)
      return {
        success: false,
        error: error.message || 'Failed to reset password'
      }
    }
  },

  // Confirm password reset
  async confirmResetPassword(email: string, confirmationCode: string, newPassword: string) {
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode,
        newPassword
      })
      return {
        success: true,
        message: 'Password reset successfully'
      }
    } catch (error: any) {
      console.error('Confirm reset password error:', error)
      return {
        success: false,
        error: error.message || 'Failed to reset password'
      }
    }
  },

  // Determine user role from Cognito groups
  determineUserRole(groups: string[]): UserRole {
    if (groups.includes('admin')) return 'admin'
    if (groups.includes('advisor')) return 'advisor'
    if (groups.includes('member')) return 'member'
    if (groups.includes('alumni')) return 'alumni'
    return 'prospect'
  },

  // Check if user has required role
  hasRole(userGroups: string[], requiredRole: UserRole): boolean {
    const roleHierarchy = {
      admin: ['admin'],
      advisor: ['admin', 'advisor'],
      member: ['admin', 'advisor', 'member'],
      alumni: ['admin', 'advisor', 'member', 'alumni'],
      prospect: ['admin', 'advisor', 'member', 'alumni', 'prospect']
    }

    const allowedGroups = roleHierarchy[requiredRole] || []
    return userGroups.some(group => allowedGroups.includes(group))
  },

  // Check if user has any of the required roles
  hasAnyRole(userGroups: string[], requiredRoles: UserRole[]): boolean {
    return requiredRoles.some(role => this.hasRole(userGroups, role))
  }
}

// Role-based access control utilities
export const rbac = {
  // Check if user can access admin features
  canAccessAdmin(user: AuthUser | null): boolean {
    return user?.groups.includes('admin') || false
  },

  // Check if user can manage chapters
  canManageChapters(user: AuthUser | null): boolean {
    return user?.groups.includes('admin') || user?.groups.includes('advisor') || false
  },

  // Check if user can manage members
  canManageMembers(user: AuthUser | null): boolean {
    return user?.groups.includes('admin') || user?.groups.includes('advisor') || false
  },

  // Check if user can create inductions
  canCreateInductions(user: AuthUser | null): boolean {
    return user?.groups.includes('admin') || user?.groups.includes('advisor') || false
  },

  // Check if user can view financial data
  canViewFinancials(user: AuthUser | null): boolean {
    return user?.groups.includes('admin') || false
  },

  // Check if user can manage content
  canManageContent(user: AuthUser | null): boolean {
    return user?.groups.includes('admin') || user?.groups.includes('advisor') || false
  }
}

