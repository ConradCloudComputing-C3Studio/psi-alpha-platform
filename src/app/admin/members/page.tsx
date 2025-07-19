'use client'

import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'

interface Member {
  id: string
  firstName: string
  lastName: string
  email: string
  memberNumber: string
  chapter: string
  membershipType: 'active' | 'associate' | 'honorary' | 'alumni'
  paymentStatus: 'current' | 'overdue' | 'exempt' | 'suspended'
  inductionDate: string
  isActive: boolean
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterChapter, setFilterChapter] = useState('all')
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockMembers: Member[] = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@email.com',
        memberNumber: 'PA001',
        chapter: 'Alpha Beta',
        membershipType: 'active',
        paymentStatus: 'current',
        inductionDate: '2023-09-15',
        isActive: true
      },
      {
        id: '2',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@email.com',
        memberNumber: 'PA002',
        chapter: 'Gamma Delta',
        membershipType: 'active',
        paymentStatus: 'overdue',
        inductionDate: '2023-08-20',
        isActive: true
      },
      {
        id: '3',
        firstName: 'Mike',
        lastName: 'Davis',
        email: 'mike.davis@email.com',
        memberNumber: 'PA003',
        chapter: 'Alpha Beta',
        membershipType: 'alumni',
        paymentStatus: 'exempt',
        inductionDate: '2020-09-10',
        isActive: false
      }
    ]
    
    setTimeout(() => {
      setMembers(mockMembers)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.memberNumber.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || member.paymentStatus === filterStatus
    const matchesChapter = filterChapter === 'all' || member.chapter === filterChapter
    
    return matchesSearch && matchesStatus && matchesChapter
  })

  const handleSelectMember = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    )
  }

  const handleSelectAll = () => {
    setSelectedMembers(
      selectedMembers.length === filteredMembers.length 
        ? [] 
        : filteredMembers.map(member => member.id)
    )
  }

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      current: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
      exempt: 'bg-blue-100 text-blue-800',
      suspended: 'bg-gray-100 text-gray-800'
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles]}`}>
        {status}
      </span>
    )
  }

  const getMembershipTypeBadge = (type: string) => {
    const typeStyles = {
      active: 'bg-green-100 text-green-800',
      associate: 'bg-blue-100 text-blue-800',
      honorary: 'bg-purple-100 text-purple-800',
      alumni: 'bg-gray-100 text-gray-800'
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeStyles[type as keyof typeof typeStyles]}`}>
        {type}
      </span>
    )
  }

  if (loading) {
    return (
      <ProtectedRoute requiredRoles={['admin', 'advisor']}>
        <AdminLayout title="Members">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRoles={['admin', 'advisor']}>
      <AdminLayout title="Members">
        <div className="space-y-6">
          {/* Header */}
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Members</h1>
              <p className="mt-2 text-sm text-gray-700">
                Manage chapter members, their status, and membership information.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <a
                href="/admin/members/new"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <PlusIcon className="-ml-1 mr-2 h-4 w-4" />
                Add Member
              </a>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div className="sm:col-span-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search members..."
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
                    <option value="current">Current</option>
                    <option value="overdue">Overdue</option>
                    <option value="exempt">Exempt</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div>
                  <select
                    value={filterChapter}
                    onChange={(e) => setFilterChapter(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                  >
                    <option value="all">All Chapters</option>
                    <option value="Alpha Beta">Alpha Beta</option>
                    <option value="Gamma Delta">Gamma Delta</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedMembers.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedMembers.length} member(s) selected
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200">
                    Send Email
                  </button>
                  <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200">
                    Export
                  </button>
                  <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200">
                    Suspend
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Members Table */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {filteredMembers.length} Members
                </h3>
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <ArrowDownTrayIcon className="-ml-0.5 mr-2 h-4 w-4" />
                  Export
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
                          onChange={handleSelectAll}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Member
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Chapter
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Induction Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedMembers.includes(member.id)}
                            onChange={() => handleSelectMember(member.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {member.firstName[0]}{member.lastName[0]}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {member.firstName} {member.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {member.email}
                              </div>
                              <div className="text-xs text-gray-400">
                                #{member.memberNumber}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {member.chapter}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getMembershipTypeBadge(member.membershipType)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(member.paymentStatus)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(member.inductionDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}

