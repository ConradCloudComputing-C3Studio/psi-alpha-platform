'use client'

import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ClipboardDocumentIcon,
  CalendarIcon,
  MapPinIcon,
  UsersIcon
} from '@heroicons/react/24/outline'

interface Induction {
  id: string
  title: string
  description: string
  inductionDate: string
  location: string
  capacity?: number
  registrationCode: string
  isActive: boolean
  chapter: string
  applicationsCount: number
  createdAt: string
}

export default function InductionsPage() {
  const [inductions, setInductions] = useState<Induction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockInductions: Induction[] = [
      {
        id: '1',
        title: 'Fall 2024 Induction Ceremony',
        description: 'Annual fall induction ceremony for new members',
        inductionDate: '2024-11-15',
        location: 'University Auditorium',
        capacity: 50,
        registrationCode: 'FALL2024-AB',
        isActive: true,
        chapter: 'Alpha Beta',
        applicationsCount: 12,
        createdAt: '2024-09-01'
      },
      {
        id: '2',
        title: 'Spring 2024 Induction',
        description: 'Spring semester induction for qualified candidates',
        inductionDate: '2024-04-20',
        location: 'Student Center',
        capacity: 30,
        registrationCode: 'SPRING2024-GD',
        isActive: false,
        chapter: 'Gamma Delta',
        applicationsCount: 25,
        createdAt: '2024-02-15'
      },
      {
        id: '3',
        title: 'Winter 2024 Special Induction',
        description: 'Special winter induction for transfer students',
        inductionDate: '2024-12-10',
        location: 'Library Conference Room',
        capacity: 15,
        registrationCode: 'WINTER2024-AB',
        isActive: true,
        chapter: 'Alpha Beta',
        applicationsCount: 5,
        createdAt: '2024-10-01'
      }
    ]
    
    setTimeout(() => {
      setInductions(mockInductions)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredInductions = inductions.filter(induction => {
    const matchesSearch = 
      induction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      induction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      induction.registrationCode.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && induction.isActive) ||
      (filterStatus === 'inactive' && !induction.isActive)
    
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    )
  }

  const copyRegistrationCode = (code: string) => {
    navigator.clipboard.writeText(code)
    // In a real app, you'd show a toast notification here
    alert('Registration code copied to clipboard!')
  }

  if (loading) {
    return (
      <ProtectedRoute requiredRoles={['admin', 'advisor']}>
        <AdminLayout title="Inductions">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRoles={['admin', 'advisor']}>
      <AdminLayout title="Inductions">
        <div className="space-y-6">
          {/* Header */}
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Inductions</h1>
              <p className="mt-2 text-sm text-gray-700">
                Manage induction ceremonies and track applications.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <a
                href="/admin/inductions/new"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <PlusIcon className="-ml-1 mr-2 h-4 w-4" />
                Create Induction
              </a>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search inductions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Inductions Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {filteredInductions.map((induction) => (
              <div key={induction.id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {induction.title}
                    </h3>
                    {getStatusBadge(induction.isActive)}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {induction.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {new Date(induction.inductionDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      {induction.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <UsersIcon className="h-4 w-4 mr-2" />
                      {induction.applicationsCount} applications
                      {induction.capacity && ` / ${induction.capacity} capacity`}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-md p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Registration Code
                        </p>
                        <p className="text-sm font-mono text-gray-900">
                          {induction.registrationCode}
                        </p>
                      </div>
                      <button
                        onClick={() => copyRegistrationCode(induction.registrationCode)}
                        className="text-blue-600 hover:text-blue-500"
                      >
                        <ClipboardDocumentIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {induction.chapter}
                    </span>
                    <div className="flex space-x-2">
                      <a
                        href={`/admin/inductions/${induction.id}/applications`}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Applications"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </a>
                      <a
                        href={`/admin/inductions/${induction.id}/edit`}
                        className="text-gray-600 hover:text-gray-900"
                        title="Edit Induction"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </a>
                      <button
                        className="text-red-600 hover:text-red-900"
                        title="Delete Induction"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredInductions.length === 0 && (
            <div className="text-center py-12">
              <ClipboardDocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No inductions found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new induction ceremony.
              </p>
              <div className="mt-6">
                <a
                  href="/admin/inductions/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                  Create Induction
                </a>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}

