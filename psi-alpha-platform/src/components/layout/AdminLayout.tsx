'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { rbac } from '@/lib/auth'
import {
  HomeIcon,
  UsersIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  CalendarIcon,
  DocumentTextIcon,
  NewspaperIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
}

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  current?: boolean
  requiredPermission?: (user: any) => boolean
  children?: NavigationItem[]
}

export default function AdminLayout({ children, title = 'Dashboard' }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const { user, signOut } = useAuth()

  const navigation: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: HomeIcon,
      current: true
    },
    {
      name: 'Members',
      href: '/admin/members',
      icon: UsersIcon,
      requiredPermission: (user) => rbac.canManageMembers(user),
      children: [
        { name: 'All Members', href: '/admin/members', icon: UsersIcon },
        { name: 'Add Member', href: '/admin/members/new', icon: UsersIcon },
        { name: 'Import Members', href: '/admin/members/import', icon: UsersIcon }
      ]
    },
    {
      name: 'Chapters',
      href: '/admin/chapters',
      icon: BuildingOfficeIcon,
      requiredPermission: (user) => rbac.canManageChapters(user),
      children: [
        { name: 'All Chapters', href: '/admin/chapters', icon: BuildingOfficeIcon },
        { name: 'Add Chapter', href: '/admin/chapters/new', icon: BuildingOfficeIcon }
      ]
    },
    {
      name: 'Schools',
      href: '/admin/schools',
      icon: AcademicCapIcon,
      requiredPermission: (user) => rbac.canAccessAdmin(user)
    },
    {
      name: 'Advisors',
      href: '/admin/advisors',
      icon: UserGroupIcon,
      requiredPermission: (user) => rbac.canManageChapters(user)
    },
    {
      name: 'Inductions',
      href: '/admin/inductions',
      icon: ClipboardDocumentListIcon,
      requiredPermission: (user) => rbac.canCreateInductions(user),
      children: [
        { name: 'All Inductions', href: '/admin/inductions', icon: ClipboardDocumentListIcon },
        { name: 'Create Induction', href: '/admin/inductions/new', icon: ClipboardDocumentListIcon },
        { name: 'Applications', href: '/admin/inductions/applications', icon: ClipboardDocumentListIcon }
      ]
    },
    {
      name: 'Payments',
      href: '/admin/payments',
      icon: CreditCardIcon,
      requiredPermission: (user) => rbac.canViewFinancials(user)
    },
    {
      name: 'Events',
      href: '/admin/events',
      icon: CalendarIcon,
      requiredPermission: (user) => rbac.canManageContent(user)
    },
    {
      name: 'Content',
      href: '/admin/content',
      icon: DocumentTextIcon,
      requiredPermission: (user) => rbac.canManageContent(user),
      children: [
        { name: 'Pages', href: '/admin/content/pages', icon: DocumentTextIcon },
        { name: 'News Posts', href: '/admin/content/news', icon: NewspaperIcon }
      ]
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Cog6ToothIcon,
      requiredPermission: (user) => rbac.canAccessAdmin(user)
    }
  ]

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuName) 
        ? prev.filter(name => name !== menuName)
        : [...prev, menuName]
    )
  }

  const handleSignOut = async () => {
    await signOut()
  }

  const filteredNavigation = navigation.filter(item => 
    !item.requiredPermission || item.requiredPermission(user)
  )

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          <SidebarContent 
            navigation={filteredNavigation} 
            expandedMenus={expandedMenus}
            toggleMenu={toggleMenu}
            user={user}
            onSignOut={handleSignOut}
          />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <SidebarContent 
            navigation={filteredNavigation} 
            expandedMenus={expandedMenus}
            toggleMenu={toggleMenu}
            user={user}
            onSignOut={handleSignOut}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top bar */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="flex items-center h-16">
                    <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-3">
                  {user?.email}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function SidebarContent({ 
  navigation, 
  expandedMenus, 
  toggleMenu, 
  user, 
  onSignOut 
}: {
  navigation: NavigationItem[]
  expandedMenus: string[]
  toggleMenu: (name: string) => void
  user: any
  onSignOut: () => void
}) {
  return (
    <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <h1 className="text-2xl font-bold text-blue-600">Psi Alpha</h1>
        </div>
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <div key={item.name}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <item.icon className="mr-3 h-6 w-6" />
                    {item.name}
                    <ChevronDownIcon 
                      className={`ml-auto h-4 w-4 transform transition-transform ${
                        expandedMenus.includes(item.name) ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  {expandedMenus.includes(item.name) && (
                    <div className="mt-1 space-y-1">
                      {item.children.map((child) => (
                        <a
                          key={child.name}
                          href={child.href}
                          className="group flex items-center pl-11 pr-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50"
                        >
                          {child.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    item.current
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-6 w-6" />
                  {item.name}
                </a>
              )}
            </div>
          ))}
        </nav>
      </div>
      <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
        <button
          onClick={onSignOut}
          className="flex-shrink-0 w-full group block"
        >
          <div className="flex items-center">
            <ArrowRightOnRectangleIcon className="inline-block h-5 w-5 text-gray-400 group-hover:text-gray-500 mr-3" />
            <div className="text-sm">
              <p className="font-medium text-gray-700 group-hover:text-gray-900">Sign out</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}

