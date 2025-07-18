'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { formatAmount, getPaymentStatusColor, getPaymentStatusLabel } from '@/lib/stripe'
import {
  UserIcon,
  CreditCardIcon,
  DocumentTextIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

interface Payment {
  id: string
  amount: number
  currency: string
  status: string
  description: string
  date: string
  receiptUrl?: string
}

interface MembershipInfo {
  type: 'student' | 'annual' | 'lifetime'
  status: 'active' | 'expired' | 'pending'
  startDate: string
  endDate?: string
  autoRenew?: boolean
}

export default function MemberPortalPage() {
  const { user } = useAuth()
  const [payments, setPayments] = useState<Payment[]>([])
  const [membershipInfo, setMembershipInfo] = useState<MembershipInfo | null>(null)
  const [loading, setLoading] = useState(true)

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockPayments: Payment[] = [
      {
        id: 'pi_1234567890',
        amount: 5000,
        currency: 'usd',
        status: 'succeeded',
        description: 'Annual Psi Alpha Membership',
        date: '2024-09-15T10:30:00Z',
        receiptUrl: '#'
      },
      {
        id: 'pi_0987654321',
        amount: 2500,
        currency: 'usd',
        status: 'succeeded',
        description: 'Student Psi Alpha Membership',
        date: '2024-01-20T14:15:00Z',
        receiptUrl: '#'
      },
      {
        id: 'pi_1122334455',
        amount: 1500,
        currency: 'usd',
        status: 'succeeded',
        description: 'Induction Ceremony Fee',
        date: '2023-11-10T16:45:00Z',
        receiptUrl: '#'
      }
    ]

    const mockMembership: MembershipInfo = {
      type: 'annual',
      status: 'active',
      startDate: '2024-09-15T10:30:00Z',
      endDate: '2025-09-15T10:30:00Z',
      autoRenew: true
    }

    setTimeout(() => {
      setPayments(mockPayments)
      setMembershipInfo(mockMembership)
      setLoading(false)
    }, 1000)
  }, [])

  const getMembershipStatusBadge = (status: string) => {
    const statusStyles = {
      active: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getMembershipTypeLabel = (type: string) => {
    const typeLabels = {
      student: 'Student Membership',
      annual: 'Annual Membership',
      lifetime: 'Lifetime Membership'
    }
    return typeLabels[type as keyof typeof typeLabels]
  }

  if (loading) {
    return (
      <ProtectedRoute requiredRoles={['member', 'admin', 'advisor']}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRoles={['member', 'admin', 'advisor']}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-blue-600 mb-2">Psi Alpha</h1>
              <p className="text-gray-600">Member Portal</p>
            </div>
            
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserIcon className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <div className="ml-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Welcome back, {user?.name || user?.email}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Manage your membership and view your payment history
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Membership Information */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Membership Status</h3>
                
                {membershipInfo && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Type</span>
                      <span className="text-sm text-gray-900">
                        {getMembershipTypeLabel(membershipInfo.type)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Status</span>
                      {getMembershipStatusBadge(membershipInfo.status)}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Start Date</span>
                      <span className="text-sm text-gray-900">
                        {new Date(membershipInfo.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {membershipInfo.endDate && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">End Date</span>
                        <span className="text-sm text-gray-900">
                          {new Date(membershipInfo.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    
                    {membershipInfo.autoRenew !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Auto Renew</span>
                        <span className="text-sm text-gray-900">
                          {membershipInfo.autoRenew ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <a
                    href="/payment"
                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Renew Membership
                  </a>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <a
                    href="/payment"
                    className="flex items-center p-3 text-sm text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    <CreditCardIcon className="h-5 w-5 mr-3 text-gray-400" />
                    Make a Payment
                  </a>
                  <a
                    href="/register"
                    className="flex items-center p-3 text-sm text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    <DocumentTextIcon className="h-5 w-5 mr-3 text-gray-400" />
                    Register for Induction
                  </a>
                  <a
                    href="#"
                    className="flex items-center p-3 text-sm text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    <CalendarIcon className="h-5 w-5 mr-3 text-gray-400" />
                    View Events
                  </a>
                </div>
              </div>
            </div>

            {/* Payment History */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Payment History</h3>
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                      Export
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Receipt
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(payment.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {payment.description}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {payment.id}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatAmount(payment.amount, payment.currency)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(payment.status)}`}>
                              {payment.status === 'succeeded' && <CheckCircleIcon className="h-3 w-3 mr-1" />}
                              {payment.status === 'failed' && <ExclamationTriangleIcon className="h-3 w-3 mr-1" />}
                              {getPaymentStatusLabel(payment.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {payment.receiptUrl && (
                              <a
                                href={payment.receiptUrl}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Download
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {payments.length === 0 && (
                  <div className="text-center py-12">
                    <CreditCardIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You haven't made any payments yet.
                    </p>
                    <div className="mt-6">
                      <a
                        href="/payment"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Make Your First Payment
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

