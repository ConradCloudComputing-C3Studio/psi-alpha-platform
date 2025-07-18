'use client'

import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { formatAmount, getPaymentStatusColor, getPaymentStatusLabel } from '@/lib/stripe'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  CreditCardIcon,
  BanknotesIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface Payment {
  id: string
  memberName: string
  memberEmail: string
  amount: number
  currency: string
  status: string
  description: string
  paymentMethod: string
  date: string
  receiptUrl?: string
  refunded?: boolean
  refundAmount?: number
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockPayments: Payment[] = [
      {
        id: 'pi_1234567890',
        memberName: 'Emily Johnson',
        memberEmail: 'emily.johnson@university.edu',
        amount: 5000,
        currency: 'usd',
        status: 'succeeded',
        description: 'Annual Psi Alpha Membership',
        paymentMethod: 'card',
        date: '2024-10-15T10:30:00Z',
        receiptUrl: '#'
      },
      {
        id: 'pi_0987654321',
        memberName: 'Michael Chen',
        memberEmail: 'michael.chen@university.edu',
        amount: 2500,
        currency: 'usd',
        status: 'succeeded',
        description: 'Student Psi Alpha Membership',
        paymentMethod: 'card',
        date: '2024-10-12T14:15:00Z',
        receiptUrl: '#'
      },
      {
        id: 'pi_1122334455',
        memberName: 'Sarah Williams',
        memberEmail: 'sarah.williams@university.edu',
        amount: 1500,
        currency: 'usd',
        status: 'pending',
        description: 'Induction Ceremony Fee',
        paymentMethod: 'bank_transfer',
        date: '2024-10-10T16:45:00Z'
      },
      {
        id: 'pi_5566778899',
        memberName: 'David Rodriguez',
        memberEmail: 'david.rodriguez@university.edu',
        amount: 15000,
        currency: 'usd',
        status: 'succeeded',
        description: 'Lifetime Psi Alpha Membership',
        paymentMethod: 'card',
        date: '2024-10-08T09:20:00Z',
        receiptUrl: '#'
      },
      {
        id: 'pi_9988776655',
        memberName: 'Jessica Brown',
        memberEmail: 'jessica.brown@university.edu',
        amount: 5000,
        currency: 'usd',
        status: 'failed',
        description: 'Annual Psi Alpha Membership',
        paymentMethod: 'card',
        date: '2024-10-05T11:30:00Z'
      },
      {
        id: 'pi_4433221100',
        memberName: 'Robert Wilson',
        memberEmail: 'robert.wilson@university.edu',
        amount: 3000,
        currency: 'usd',
        status: 'succeeded',
        description: 'Event Registration Fee',
        paymentMethod: 'card',
        date: '2024-10-03T13:45:00Z',
        receiptUrl: '#',
        refunded: true,
        refundAmount: 3000
      }
    ]
    
    setTimeout(() => {
      setPayments(mockPayments)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.memberEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus
    
    const matchesType = filterType === 'all' || 
      (filterType === 'membership' && payment.description.toLowerCase().includes('membership')) ||
      (filterType === 'induction' && payment.description.toLowerCase().includes('induction')) ||
      (filterType === 'event' && payment.description.toLowerCase().includes('event'))
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCardIcon className="h-4 w-4" />
      case 'bank_transfer':
        return <BanknotesIcon className="h-4 w-4" />
      default:
        return <CreditCardIcon className="h-4 w-4" />
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'card':
        return 'Credit Card'
      case 'bank_transfer':
        return 'Bank Transfer'
      default:
        return 'Unknown'
    }
  }

  // Calculate statistics
  const totalRevenue = payments
    .filter(p => p.status === 'succeeded')
    .reduce((sum, p) => sum + p.amount, 0)
  
  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0)
  
  const refundedAmount = payments
    .filter(p => p.refunded)
    .reduce((sum, p) => sum + (p.refundAmount || 0), 0)

  if (loading) {
    return (
      <ProtectedRoute requiredRoles={['admin']}>
        <AdminLayout title="Payments">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <AdminLayout title="Payments">
        <div className="space-y-6">
          {/* Header */}
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
              <p className="mt-2 text-sm text-gray-700">
                Track and manage all payments across the platform.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <ArrowDownTrayIcon className="-ml-0.5 mr-2 h-4 w-4" />
                Export
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Revenue
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {formatAmount(totalRevenue)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ClockIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Pending
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {formatAmount(pendingAmount)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Refunded
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {formatAmount(refundedAmount)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CreditCardIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Payments
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {payments.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
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
                      placeholder="Search payments..."
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
                    <option value="succeeded">Succeeded</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                <div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                  >
                    <option value="all">All Types</option>
                    <option value="membership">Membership</option>
                    <option value="induction">Induction</option>
                    <option value="event">Event</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {filteredPayments.length} Payments
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Member
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {payment.memberName.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {payment.memberName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {payment.memberEmail}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {payment.description}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payment.id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatAmount(payment.amount, payment.currency)}
                          </div>
                          {payment.refunded && (
                            <div className="text-xs text-red-600">
                              Refunded: {formatAmount(payment.refundAmount || 0)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            {getPaymentMethodIcon(payment.paymentMethod)}
                            <span className="ml-2">{getPaymentMethodLabel(payment.paymentMethod)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(payment.status)}`}>
                            {getPaymentStatusLabel(payment.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(payment.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            className="text-blue-600 hover:text-blue-900 mr-3"
                            title="View Details"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          {payment.receiptUrl && (
                            <a
                              href={payment.receiptUrl}
                              className="text-gray-600 hover:text-gray-900"
                              title="Download Receipt"
                            >
                              <ArrowDownTrayIcon className="h-4 w-4" />
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <CreditCardIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
              <p className="mt-1 text-sm text-gray-500">
                No payments match your current search criteria.
              </p>
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}

