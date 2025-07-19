'use client'

import React from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import {
  UsersIcon,
  BuildingOfficeIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  CalendarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

export default function AdminDashboard() {
  // Mock data - in real app, this would come from API
  const stats = [
    {
      name: 'Total Members',
      value: '1,247',
      change: '+12%',
      changeType: 'increase',
      icon: UsersIcon
    },
    {
      name: 'Active Chapters',
      value: '23',
      change: '+2',
      changeType: 'increase',
      icon: BuildingOfficeIcon
    },
    {
      name: 'Pending Applications',
      value: '18',
      change: '+5',
      changeType: 'increase',
      icon: ClipboardDocumentListIcon
    },
    {
      name: 'Monthly Revenue',
      value: '$12,450',
      change: '+8%',
      changeType: 'increase',
      icon: CreditCardIcon
    }
  ]

  const recentActivity = [
    {
      id: 1,
      type: 'member_joined',
      message: 'John Smith joined Alpha Beta Chapter',
      time: '2 hours ago',
      icon: UsersIcon,
      iconColor: 'text-green-600'
    },
    {
      id: 2,
      type: 'payment_received',
      message: 'Payment received from Sarah Johnson - $150',
      time: '4 hours ago',
      icon: CreditCardIcon,
      iconColor: 'text-blue-600'
    },
    {
      id: 3,
      type: 'application_submitted',
      message: 'New induction application from Mike Davis',
      time: '6 hours ago',
      icon: ClipboardDocumentListIcon,
      iconColor: 'text-yellow-600'
    },
    {
      id: 4,
      type: 'event_created',
      message: 'Annual Conference 2024 event created',
      time: '1 day ago',
      icon: CalendarIcon,
      iconColor: 'text-purple-600'
    }
  ]

  const alerts = [
    {
      id: 1,
      type: 'warning',
      message: '5 members have overdue payments',
      action: 'View Details',
      href: '/admin/payments?status=overdue'
    },
    {
      id: 2,
      type: 'info',
      message: '12 induction applications pending review',
      action: 'Review Applications',
      href: '/admin/inductions/applications'
    }
  ]

  return (
    <ProtectedRoute requiredRoles={['admin', 'advisor']}>
      <AdminLayout title="Dashboard">
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <stat.icon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.name}
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {stat.value}
                          </div>
                          <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                            stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            <ArrowTrendingUpIcon className="self-center flex-shrink-0 h-4 w-4" />
                            <span className="ml-1">{stat.change}</span>
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Recent Activity
                </h3>
                <div className="flow-root">
                  <ul className="-mb-8">
                    {recentActivity.map((activity, activityIdx) => (
                      <li key={activity.id}>
                        <div className="relative pb-8">
                          {activityIdx !== recentActivity.length - 1 ? (
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-gray-100`}>
                                <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-500">{activity.message}</p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                {activity.time}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Alerts & Quick Actions */}
            <div className="space-y-6">
              {/* Alerts */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Alerts
                  </h3>
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <div key={alert.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-md">
                        <div className="flex items-center">
                          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-3" />
                          <span className="text-sm text-gray-700">{alert.message}</span>
                        </div>
                        <a
                          href={alert.href}
                          className="text-sm font-medium text-blue-600 hover:text-blue-500"
                        >
                          {alert.action}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href="/admin/members/new"
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Add Member
                    </a>
                    <a
                      href="/admin/inductions/new"
                      className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Create Induction
                    </a>
                    <a
                      href="/admin/chapters/new"
                      className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Add Chapter
                    </a>
                    <a
                      href="/admin/events/new"
                      className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Create Event
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Membership Growth
              </h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
                <div className="text-center">
                  <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Chart component will be implemented with real data
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}

