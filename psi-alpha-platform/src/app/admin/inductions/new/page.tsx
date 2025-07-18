'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/layout/AdminLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { generateId } from '@/lib/utils'

const inductionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  inductionDate: z.string().min(1, 'Induction date is required'),
  inductionTime: z.string().min(1, 'Induction time is required'),
  location: z.string().min(3, 'Location must be at least 3 characters'),
  capacity: z.number().min(1, 'Capacity must be at least 1').optional(),
  chapterId: z.string().min(1, 'Chapter is required'),
  registrationDeadline: z.string().optional(),
  requirements: z.string().optional(),
  contactEmail: z.string().email('Valid email is required').optional(),
  isActive: z.boolean().default(true)
})

type InductionFormData = z.infer<typeof inductionSchema>

export default function NewInductionPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<InductionFormData>({
    resolver: zodResolver(inductionSchema),
    defaultValues: {
      isActive: true
    }
  })

  // Mock chapters - in real app, this would come from API
  const chapters = [
    { id: '1', name: 'Alpha Beta', code: 'AB' },
    { id: '2', name: 'Gamma Delta', code: 'GD' },
    { id: '3', name: 'Epsilon Zeta', code: 'EZ' }
  ]

  const generateRegistrationCode = () => {
    const selectedChapter = chapters.find(c => c.id === watch('chapterId'))
    const date = new Date(watch('inductionDate'))
    const year = date.getFullYear()
    const season = getSeason(date.getMonth())
    
    if (selectedChapter) {
      const code = `${season.toUpperCase()}${year}-${selectedChapter.code}`
      setGeneratedCode(code)
      return code
    }
    return ''
  }

  const getSeason = (month: number) => {
    if (month >= 2 && month <= 4) return 'spring'
    if (month >= 5 && month <= 7) return 'summer'
    if (month >= 8 && month <= 10) return 'fall'
    return 'winter'
  }

  const onSubmit = async (data: InductionFormData) => {
    try {
      setIsLoading(true)
      setError('')

      // Generate registration code
      const registrationCode = generateRegistrationCode()
      
      // In a real app, this would be an API call
      const inductionData = {
        ...data,
        id: generateId(),
        registrationCode,
        createdAt: new Date().toISOString(),
        applicationsCount: 0
      }

      console.log('Creating induction:', inductionData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect to inductions list
      router.push('/admin/inductions')
    } catch (err) {
      setError('Failed to create induction. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute requiredRoles={['admin', 'advisor']}>
      <AdminLayout title="Create New Induction">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Create New Induction</h1>
                <p className="mt-2 text-sm text-gray-700">
                  Set up a new induction ceremony for your chapter.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Induction Title *
                    </label>
                    <input
                      {...register('title')}
                      type="text"
                      id="title"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Fall 2024 Induction Ceremony"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description *
                    </label>
                    <textarea
                      {...register('description')}
                      id="description"
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe the induction ceremony and its purpose..."
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="chapterId" className="block text-sm font-medium text-gray-700">
                      Chapter *
                    </label>
                    <select
                      {...register('chapterId')}
                      id="chapterId"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a chapter</option>
                      {chapters.map((chapter) => (
                        <option key={chapter.id} value={chapter.id}>
                          {chapter.name} ({chapter.code})
                        </option>
                      ))}
                    </select>
                    {errors.chapterId && (
                      <p className="mt-1 text-sm text-red-600">{errors.chapterId.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                      Capacity (Optional)
                    </label>
                    <input
                      {...register('capacity', { valueAsNumber: true })}
                      type="number"
                      id="capacity"
                      min="1"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Maximum number of inductees"
                    />
                    {errors.capacity && (
                      <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>
                    )}
                  </div>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="inductionDate" className="block text-sm font-medium text-gray-700">
                      Induction Date *
                    </label>
                    <input
                      {...register('inductionDate')}
                      type="date"
                      id="inductionDate"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.inductionDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.inductionDate.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="inductionTime" className="block text-sm font-medium text-gray-700">
                      Induction Time *
                    </label>
                    <input
                      {...register('inductionTime')}
                      type="time"
                      id="inductionTime"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.inductionTime && (
                      <p className="mt-1 text-sm text-red-600">{errors.inductionTime.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="registrationDeadline" className="block text-sm font-medium text-gray-700">
                      Registration Deadline (Optional)
                    </label>
                    <input
                      {...register('registrationDeadline')}
                      type="date"
                      id="registrationDeadline"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                      Location *
                    </label>
                    <input
                      {...register('location')}
                      type="text"
                      id="location"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., University Auditorium, Room 101"
                    />
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                    )}
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-6">
                  <div>
                    <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
                      Requirements (Optional)
                    </label>
                    <textarea
                      {...register('requirements')}
                      id="requirements"
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="List any specific requirements for applicants..."
                    />
                  </div>

                  <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                      Contact Email (Optional)
                    </label>
                    <input
                      {...register('contactEmail')}
                      type="email"
                      id="contactEmail"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Contact email for questions"
                    />
                    {errors.contactEmail && (
                      <p className="mt-1 text-sm text-red-600">{errors.contactEmail.message}</p>
                    )}
                  </div>

                  <div className="flex items-center">
                    <input
                      {...register('isActive')}
                      id="isActive"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                      Make this induction active immediately
                    </label>
                  </div>
                </div>

                {/* Registration Code Preview */}
                {watch('chapterId') && watch('inductionDate') && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">
                      Registration Code Preview
                    </h4>
                    <p className="text-sm text-blue-700">
                      The registration code will be: <strong>{generateRegistrationCode()}</strong>
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Students will use this code to register for the induction.
                    </p>
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </div>
                    ) : (
                      'Create Induction'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}

