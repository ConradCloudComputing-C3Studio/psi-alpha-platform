'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import SignUpForm from '@/components/auth/SignUpForm'

export default function SignUpPage() {
  const [showVerification, setShowVerification] = useState(false)
  const [email, setEmail] = useState('')
  const router = useRouter()

  const handleSignUpSuccess = (userEmail: string) => {
    setEmail(userEmail)
    setShowVerification(true)
  }

  if (showVerification) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">Psi Alpha</h1>
            <p className="text-gray-600">Member Management Platform</p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white shadow-lg rounded-lg px-8 py-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
              <p className="text-gray-600 mb-6">
                We've sent a verification code to <strong>{email}</strong>. 
                Please check your email and click the verification link to activate your account.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/auth/verify?email=${encodeURIComponent(email)}`)}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Enter Verification Code
                </button>
                <button
                  onClick={() => router.push('/auth/login')}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Psi Alpha</h1>
          <p className="text-gray-600">Member Management Platform</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <SignUpForm onSuccess={handleSignUpSuccess} />
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          © 2024 Psi Alpha. All rights reserved.
        </p>
      </div>
    </div>
  )
}

