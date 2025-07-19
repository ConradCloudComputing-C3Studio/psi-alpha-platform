'use client'

import React from 'react'
import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Psi Alpha</h1>
          <p className="text-gray-600">Member Management Platform</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm />
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          © 2024 Psi Alpha. All rights reserved.
        </p>
      </div>
    </div>
  )
}

