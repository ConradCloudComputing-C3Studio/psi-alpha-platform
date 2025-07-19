'use client'

import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'

interface Application {
  id: string
  applicantName: string
  email: string
  phone: string
  institution: string
  major: string
  gpa?: number
  graduationYear: number
  inductionTitle: string
  inductionDate: string
  status: 'submitted' | 'under_review' | 'approved' | 'rejected'
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  notes?: string
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedApplications, setSelectedApplications] = useState<string[]>([])

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockApplications: Application[] = [
      {
        id: '1',
        applicantName: 'Emily Johnson',
        email: 'emily.johnson@university.edu',
        phone: '(555) 123-4567',
        institution: 'State University',
        major: 'Psychology',
        gpa: 3.8,
        graduationYear: 2025,
        inductionTitle: 'Fall 2024 Induction Ceremony',
        inductionDate: '2024-11-15',
        status: 'submitted',
        submittedAt: '2024-10-01T10:30:00Z'
      },
      {
        id: '2',
        applicantName: 'Michael Chen',
        email: 'michael.chen@university.edu',
        phone: '(555) 234-5678',
        institution: 'State University',
        major: 'Computer Science',
        gpa: 3.9,
        graduationYear: 2024,
        inductionTitle: 'Fall 2024 Induction Ceremony',
        inductionDate: '2024-11-15',
        status: 'under_review',
        submittedAt: '2024-09-28T14:15:00Z',
        reviewedAt: '2024-10-02T09:00:00Z',
        reviewedBy: 'Dr. Smith'
      },
      {
        id: '3',
        applicantName: 'Sarah Williams',
        email: 'sarah.williams@university.edu',
        phone: '(555) 345-6789',
        institution: 'State University',
        major: 'Biology',
        gpa: 3.7,
        graduationYear: 2025,
        inductionTitle: 'Fall 2024 Induction Ceremony',
        inductionDate: '2024-11-15',
        status: 'approved',
        submittedAt: '2024-09-25T16:45:00Z',
        reviewedAt: '2024-09-30T11:30:00Z',
        reviewedBy: 'Dr. Johnson',
        notes: 'Excellent academic record and strong references.'
      },
      {
        id: '4',
        applicantName: 'David Rodriguez',
        email: 'david.rodriguez@university.edu',
        phone: '(555) 456-7890',
        institution: 'State University',
        major: 'Engineering',
        gpa: 3.5,
        graduationYear: 2024,
        inductionTitle: 'Fall 2024 Induction Ceremony',
        inductionDate: '2024-11-15',
        status: 'rejected',
        submittedAt: '2024-09-20T12:00:00Z',
        reviewedAt: '2024-09-28T15:20:00Z',
        reviewedBy: 'Dr. Brown',
        notes: 'Does not meet minimum GPA requirement.'
      }
    ]
    
    setTimeout(() => {
      setApplications(mockApplications)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredApplications = applications.filter(application => {
    const matchesSearch = 
      application.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.major.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.institution.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || application.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const handleSelectApplication = (applicationId: string) => {
    setSelectedApplications(prev => 
      prev.includes(applicationId) 
        ? prev.filter(id => id !== applicationId)
        : [...prev, applicationId]
    )
  }

  const handleSelectAll = () => {
    setSelectedApplications(
      selectedApplications.length === filteredApplications.length 
        ? [] 
        : filteredApplications.map(app => app.id)
    )
  }

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      submitted: 'bg-blue-100 text-blue-800',
      under_review: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    }
    
    const statusLabels = {
      submitted: 'Submitted',
      under_review: 'Under Review',
      approved: 'Approved',
      rejected: 'Rejected'
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles]}`}>
        {statusLabels[status as keyof typeof statusLabels]}
      </span>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <DocumentTextIcon className="h-4 w-4 text-blue-500" />
      case 'under_review':
        return <ClockIcon className="h-4 w-4 text-yellow-500" />
      case 'approved':
        return <CheckIcon className="h-4 w-4 text-green-500" />
      case 'rejected':
        return <XMarkIcon className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    // In a real app, this would be an API call
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { 
              ...app, 
              status: newStatus as any,
              reviewedAt: new Date().toISOString(),
              reviewedBy: 'Current User' // In real app, get from auth context
            }
          : app
      )
    )
  }

  if (loading) {
    return (
      <ProtectedRoute requiredRoles={['admin', 'advisor']}>
        <AdminLayout title="Applications">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRoles={['admin', 'advisor']}>
      <AdminLayout title="Induction Applications">
        <div className="space-y-6">
          {/* Header */}
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Induction Applications</h1>
              <p className="mt-2 text-sm text-gray-700">
                Review and manage applications for induction ceremonies.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <div className="flex space-x-3">
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <FunnelIcon className="-ml-0.5 mr-2 h-4 w-4" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
            {[
              { name: 'Total Applications', value: applications.length, color: 'blue' },
              { name: 'Pending Review', value: applications.filter(a => a.status === 'submitted').length, color: 'yellow' },
              { name: 'Approved', value: applications.filter(a => a.status === 'approved').length, color: 'green' },
              { name: 'Rejected', value: applications.filter(a => a.status === 'rejected').length, color: 'red' }
            ].map((stat) => (
              <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 bg-${stat.color}-100 rounded-md flex items-center justify-center`}>
                        <span className={`text-${stat.color}-600 font-semibold`}>{stat.value}</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.name}
                        </dt>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
                      placeholder="Search applications..."
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
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedApplications.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedApplications.length} application(s) selected
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => selectedApplications.forEach(id => handleStatusChange(id, 'approved'))}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200"
                  >
                    Approve Selected
                  </button>
                  <button 
                    onClick={() => selectedApplications.forEach(id => handleStatusChange(id, 'rejected'))}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                  >
                    Reject Selected
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Applications Table */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {filteredApplications.length} Applications
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          checked={selectedApplications.length === filteredApplications.length && filteredApplications.length > 0}
                          onChange={handleSelectAll}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applicant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Academic Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Induction
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredApplications.map((application) => (
                      <tr key={application.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedApplications.includes(application.id)}
                            onChange={() => handleSelectApplication(application.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {application.applicantName.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {application.applicantName}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <EnvelopeIcon className="h-3 w-3 mr-1" />
                                {application.email}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <PhoneIcon className="h-3 w-3 mr-1" />
                                {application.phone}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center">
                              <AcademicCapIcon className="h-4 w-4 mr-1 text-gray-400" />
                              {application.institution}
                            </div>
                            <div className="text-sm text-gray-500">
                              {application.major} • Class of {application.graduationYear}
                            </div>
                            {application.gpa && (
                              <div className="text-sm text-gray-500">
                                GPA: {application.gpa}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {application.inductionTitle}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(application.inductionDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(application.status)}
                            <div className="ml-2">
                              {getStatusBadge(application.status)}
                            </div>
                          </div>
                          {application.reviewedBy && (
                            <div className="text-xs text-gray-500 mt-1">
                              Reviewed by {application.reviewedBy}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(application.submittedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button 
                              className="text-blue-600 hover:text-blue-900"
                              title="View Application"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            {application.status === 'submitted' && (
                              <>
                                <button 
                                  onClick={() => handleStatusChange(application.id, 'approved')}
                                  className="text-green-600 hover:text-green-900"
                                  title="Approve"
                                >
                                  <CheckIcon className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => handleStatusChange(application.id, 'rejected')}
                                  className="text-red-600 hover:text-red-900"
                                  title="Reject"
                                >
                                  <XMarkIcon className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
              <p className="mt-1 text-sm text-gray-500">
                No applications match your current search criteria.
              </p>
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}

