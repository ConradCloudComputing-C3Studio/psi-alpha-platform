'use client'

import React, { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import { 
  locales, 
  localeNames, 
  localeFlags, 
  type Locale,
  getLocaleFromPathname,
  removeLocaleFromPathname
} from '@/i18n/config'
import {
  ChevronDownIcon,
  LanguageIcon
} from '@heroicons/react/24/outline'

interface LanguageSelectorProps {
  className?: string
  variant?: 'dropdown' | 'inline'
}

export default function LanguageSelector({ 
  className = '', 
  variant = 'dropdown' 
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useLocale() as Locale

  const handleLanguageChange = (newLocale: Locale) => {
    if (newLocale === currentLocale) return

    // Remove current locale from pathname and add new locale
    const pathWithoutLocale = removeLocaleFromPathname(pathname)
    const newPath = `/${newLocale}${pathWithoutLocale}`
    
    router.push(newPath)
    setIsOpen(false)
  }

  if (variant === 'inline') {
    return (
      <div className={`flex space-x-2 ${className}`}>
        {locales.map((locale) => (
          <button
            key={locale}
            onClick={() => handleLanguageChange(locale)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              locale === currentLocale
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
            }`}
          >
            <span className="mr-1">{localeFlags[locale]}</span>
            {localeNames[locale]}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <LanguageIcon className="h-4 w-4" />
        <span className="hidden sm:block">{localeFlags[currentLocale]} {localeNames[currentLocale]}</span>
        <span className="sm:hidden">{localeFlags[currentLocale]}</span>
        <ChevronDownIcon className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 z-20 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
            <div className="py-1">
              {locales.map((locale) => (
                <button
                  key={locale}
                  onClick={() => handleLanguageChange(locale)}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    locale === currentLocale
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{localeFlags[locale]}</span>
                  {localeNames[locale]}
                  {locale === currentLocale && (
                    <span className="ml-2 text-blue-600">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Hook for getting translated text
export function useTranslations() {
  const locale = useLocale()
  
  return {
    locale,
    isRTL: false, // Add RTL support for Arabic, Hebrew, etc. if needed
    formatNumber: (num: number) => new Intl.NumberFormat(locale).format(num),
    formatCurrency: (amount: number, currency = 'USD') => 
      new Intl.NumberFormat(locale, { 
        style: 'currency', 
        currency 
      }).format(amount),
    formatDate: (date: Date) => new Intl.DateTimeFormat(locale).format(date),
    formatRelativeTime: (value: number, unit: Intl.RelativeTimeFormatUnit) =>
      new Intl.RelativeTimeFormat(locale).format(value, unit)
  }
}

