'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  AcademicCapIcon,
  UserIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

const registrationSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  
  // Address
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'ZIP code is required'),
  
  // Academic Information
  institution: z.string().min(2, 'Institution name is required'),
  major: z.string().min(2, 'Major is required'),
  graduationYear: z.number().min(2020, 'Graduation year must be valid'),
  gpa: z.number().min(0).max(4).optional(),
  
  // Emergency Contact
  emergencyName: z.string().min(2, 'Emergency contact name is required'),
  emergencyRelationship: z.string().min(2, 'Relationship is required'),
  emergencyPhone: z.string().min(10, 'Emergency contact phone is required'),
  
  // Essay/Statement
  personalStatement: z.string().min(100, 'Personal statement must be at least 100 characters'),
  whyJoin: z.string().min(50, 'Please explain why you want to join'),
  
  // References
  reference1Name: z.string().min(2, 'Reference name is required'),
  reference1Email: z.string().email('Valid email is required'),
  reference1Relationship: z.string().min(2, 'Relationship is required'),
  
  reference2Name: z.string().min(2, 'Reference name is required'),
  reference2Email: z.string().email('Valid email is required'),
  reference2Relationship: z.string().min(2, 'Relationship is required'),
  
  // Agreements
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
  agreeToBackground: z.boolean().refine(val => val === true, 'You must agree to background check')
})

type RegistrationFormData = z.infer<typeof registrationSchema>

interface InductionInfo {
  id: string
  title: string
  description: string
  inductionDate: string
  location: string
  chapter: string
  requirements?: string
  contactEmail?: string
}

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [inductionInfo, setInductionInfo] = useState<InductionInfo | null>(null)
  const [registrationCode, setRegistrationCode] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors }
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange'
  })

  useEffect(() => {
    const code = searchParams.get('code')
    if (code) {
      setRegistrationCode(code)
      fetchInductionInfo(code)
    }
  }, [searchParams])

  const fetchInductionInfo = async (code: string) => {
    try {
      // Mock API call - in real app, this would fetch from backend
      const mockInduction: InductionInfo = {
        id: '1',
        title: 'Fall 2024 Induction Ceremony',
        description: 'Join us for our annual fall induction ceremony welcoming new members to the Psi Alpha community.',
        inductionDate: '2024-11-15',
        location: 'University Auditorium',
        chapter: 'Alpha Beta Chapter',
        requirements: 'Minimum 3.0 GPA, completion of prerequisite courses, and two academic references.',
        contactEmail: 'induction@psialpha.org'
      }
      setInductionInfo(mockInduction)
    } catch (err) {
      setError('Invalid registration code. Please check and try again.')
    }
  }

  const totalSteps = 5
  const stepTitles = [
    'Personal Information',
    'Academic Information', 
    'Emergency Contact',
    'Essays & References',
    'Review & Submit'
  ]

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(step)
    const isValid = await trigger(fieldsToValidate)
    
    if (isValid && step < totalSteps) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const getFieldsForStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'address', 'city', 'state', 'zipCode'] as const
      case 2:
        return ['institution', 'major', 'graduationYear', 'gpa'] as const
      case 3:
        return ['emergencyName', 'emergencyRelationship', 'emergencyPhone'] as const
      case 4:
        return ['personalStatement', 'whyJoin', 'reference1Name', 'reference1Email', 'reference1Relationship', 'reference2Name', 'reference2Email', 'reference2Relationship'] as const
      default:
        return []
    }
  }

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      setIsLoading(true)
      setError('')

      // In a real app, this would submit to the backend
      console.log('Submitting registration:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setIsSubmitted(true)
    } catch (err) {
      setError('Failed to submit application. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!registrationCode) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">Psi Alpha</h1>
            <p className="text-gray-600">Induction Registration</p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h2 className="mt-4 text-xl font-medium text-gray-900">Registration Code Required</h2>
              <p className="mt-2 text-sm text-gray-600">
                Please enter your registration code to begin the application process.
              </p>
              <div className="mt-6">
                <input
                  type="text"
                  placeholder="Enter registration code"
                  value={registrationCode}
                  onChange={(e) => setRegistrationCode(e.target.value.toUpperCase())}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={() => fetchInductionInfo(registrationCode)}
                  disabled={!registrationCode}
                  className="mt-3 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
              <h2 className="mt-4 text-xl font-medium text-gray-900">Application Submitted!</h2>
              <p className="mt-2 text-sm text-gray-600">
                Thank you for your application. You will receive a confirmation email shortly.
              </p>
              <p className="mt-4 text-sm text-gray-500">
                Application ID: #{Math.random().toString(36).substring(2, 8).toUpperCase()}
              </p>
              <div className="mt-6">
                <button
                  onClick={() => router.push('/')}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Return to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Psi Alpha</h1>
          <p className="text-gray-600">Induction Registration</p>
        </div>

        {/* Induction Info */}
        {inductionInfo && (
          <div className="bg-white shadow rounded-lg mb-8 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{inductionInfo.title}</h2>
            <p className="text-gray-600 mb-4">{inductionInfo.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-gray-500">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {new Date(inductionInfo.inductionDate).toLocaleDateString()}
              </div>
              <div className="flex items-center text-gray-500">
                <MapPinIcon className="h-4 w-4 mr-2" />
                {inductionInfo.location}
              </div>
              <div className="flex items-center text-gray-500">
                <AcademicCapIcon className="h-4 w-4 mr-2" />
                {inductionInfo.chapter}
              </div>
              {inductionInfo.contactEmail && (
                <div className="flex items-center text-gray-500">
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  {inductionInfo.contactEmail}
                </div>
              )}
            </div>
            {inductionInfo.requirements && (
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <h4 className="text-sm font-medium text-blue-900 mb-1">Requirements:</h4>
                <p className="text-sm text-blue-700">{inductionInfo.requirements}</p>
              </div>
            )}
          </div>
        )}

        {/* Progress Bar */}
        <div className="bg-white shadow rounded-lg mb-8 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Application Progress</h3>
            <span className="text-sm text-gray-500">Step {step} of {totalSteps}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {stepTitles[step - 1]}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name *</label>
                    <input
                      {...register('firstName')}
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                    <input
                      {...register('lastName')}
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email *</label>
                    <input
                      {...register('email')}
                      type="email"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone *</label>
                    <input
                      {...register('phone')}
                      type="tel"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth *</label>
                    <input
                      {...register('dateOfBirth')}
                      type="date"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.dateOfBirth && (
                      <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900">Address</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Street Address *</label>
                    <input
                      {...register('address')}
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">City *</label>
                      <input
                        {...register('city')}
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">State *</label>
                      <input
                        {...register('state')}
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      {errors.state && (
                        <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">ZIP Code *</label>
                      <input
                        {...register('zipCode')}
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      {errors.zipCode && (
                        <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Academic Information */}
            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Information</h3>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Institution *</label>
                    <input
                      {...register('institution')}
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="University or College Name"
                    />
                    {errors.institution && (
                      <p className="mt-1 text-sm text-red-600">{errors.institution.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Major *</label>
                    <input
                      {...register('major')}
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your field of study"
                    />
                    {errors.major && (
                      <p className="mt-1 text-sm text-red-600">{errors.major.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Expected Graduation Year *</label>
                    <input
                      {...register('graduationYear', { valueAsNumber: true })}
                      type="number"
                      min="2020"
                      max="2030"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.graduationYear && (
                      <p className="mt-1 text-sm text-red-600">{errors.graduationYear.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">GPA (Optional)</label>
                    <input
                      {...register('gpa', { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      min="0"
                      max="4"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00 - 4.00"
                    />
                    {errors.gpa && (
                      <p className="mt-1 text-sm text-red-600">{errors.gpa.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Emergency Contact */}
            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Name *</label>
                    <input
                      {...register('emergencyName')}
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.emergencyName && (
                      <p className="mt-1 text-sm text-red-600">{errors.emergencyName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Relationship *</label>
                    <input
                      {...register('emergencyRelationship')}
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Parent, Spouse, Sibling"
                    />
                    {errors.emergencyRelationship && (
                      <p className="mt-1 text-sm text-red-600">{errors.emergencyRelationship.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                    <input
                      {...register('emergencyPhone')}
                      type="tel"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.emergencyPhone && (
                      <p className="mt-1 text-sm text-red-600">{errors.emergencyPhone.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Essays & References */}
            {step === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Essays & References</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Personal Statement *</label>
                    <p className="text-xs text-gray-500 mb-2">Tell us about yourself and your academic/professional goals (minimum 100 characters)</p>
                    <textarea
                      {...register('personalStatement')}
                      rows={4}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.personalStatement && (
                      <p className="mt-1 text-sm text-red-600">{errors.personalStatement.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Why do you want to join Psi Alpha? *</label>
                    <p className="text-xs text-gray-500 mb-2">Explain your motivation for joining our organization (minimum 50 characters)</p>
                    <textarea
                      {...register('whyJoin')}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.whyJoin && (
                      <p className="mt-1 text-sm text-red-600">{errors.whyJoin.message}</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-900">Academic References</h4>
                    <p className="text-sm text-gray-600">Please provide two academic references (professors, advisors, etc.)</p>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-4">
                        <h5 className="text-sm font-medium text-gray-700">Reference 1</h5>
                        <div>
                          <label className="block text-xs font-medium text-gray-700">Name *</label>
                          <input
                            {...register('reference1Name')}
                            type="text"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                          {errors.reference1Name && (
                            <p className="mt-1 text-xs text-red-600">{errors.reference1Name.message}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700">Email *</label>
                          <input
                            {...register('reference1Email')}
                            type="email"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                          {errors.reference1Email && (
                            <p className="mt-1 text-xs text-red-600">{errors.reference1Email.message}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700">Relationship *</label>
                          <input
                            {...register('reference1Relationship')}
                            type="text"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., Professor, Advisor"
                          />
                          {errors.reference1Relationship && (
                            <p className="mt-1 text-xs text-red-600">{errors.reference1Relationship.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h5 className="text-sm font-medium text-gray-700">Reference 2</h5>
                        <div>
                          <label className="block text-xs font-medium text-gray-700">Name *</label>
                          <input
                            {...register('reference2Name')}
                            type="text"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                          {errors.reference2Name && (
                            <p className="mt-1 text-xs text-red-600">{errors.reference2Name.message}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700">Email *</label>
                          <input
                            {...register('reference2Email')}
                            type="email"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                          {errors.reference2Email && (
                            <p className="mt-1 text-xs text-red-600">{errors.reference2Email.message}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700">Relationship *</label>
                          <input
                            {...register('reference2Relationship')}
                            type="text"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., Professor, Advisor"
                          />
                          {errors.reference2Relationship && (
                            <p className="mt-1 text-xs text-red-600">{errors.reference2Relationship.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review & Submit */}
            {step === 5 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Review & Submit</h3>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Personal Information</h4>
                    <p className="text-sm text-gray-600">
                      {watch('firstName')} {watch('lastName')} • {watch('email')} • {watch('phone')}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Academic Information</h4>
                    <p className="text-sm text-gray-600">
                      {watch('institution')} • {watch('major')} • Class of {watch('graduationYear')}
                      {watch('gpa') && ` • GPA: ${watch('gpa')}`}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Emergency Contact</h4>
                    <p className="text-sm text-gray-600">
                      {watch('emergencyName')} ({watch('emergencyRelationship')}) • {watch('emergencyPhone')}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      {...register('agreeToTerms')}
                      id="agreeToTerms"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
                      I agree to the <a href="/terms" className="text-blue-600 hover:text-blue-500">Terms and Conditions</a> *
                    </label>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="text-sm text-red-600">{errors.agreeToTerms.message}</p>
                  )}

                  <div className="flex items-center">
                    <input
                      {...register('agreeToBackground')}
                      id="agreeToBackground"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="agreeToBackground" className="ml-2 block text-sm text-gray-900">
                      I consent to a background check if required *
                    </label>
                  </div>
                  {errors.agreeToBackground && (
                    <p className="text-sm text-red-600">{errors.agreeToBackground.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 1}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

