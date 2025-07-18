'use client'

import React, { useState, useEffect } from 'react'
import {
  EyeIcon,
  SpeakerWaveIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  PlusIcon,
  MinusIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline'

interface AccessibilitySettings {
  fontSize: number
  highContrast: boolean
  darkMode: boolean
  reducedMotion: boolean
  screenReader: boolean
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 16,
  highContrast: false,
  darkMode: false,
  reducedMotion: false,
  screenReader: false
}

export default function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...defaultSettings, ...parsed })
      } catch (error) {
        console.error('Failed to parse accessibility settings:', error)
      }
    }
  }, [])

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement

    // Font size
    root.style.fontSize = `${settings.fontSize}px`

    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    // Dark mode
    if (settings.darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduce-motion')
    } else {
      root.classList.remove('reduce-motion')
    }

    // Save to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings))
  }, [settings])

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const increaseFontSize = () => {
    if (settings.fontSize < 24) {
      updateSetting('fontSize', settings.fontSize + 2)
    }
  }

  const decreaseFontSize = () => {
    if (settings.fontSize > 12) {
      updateSetting('fontSize', settings.fontSize - 2)
    }
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
  }

  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    document.body.appendChild(announcement)
    
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  return (
    <>
      {/* Accessibility Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        aria-label="Open accessibility options"
        title="Accessibility Options"
      >
        <AdjustmentsHorizontalIcon className="h-6 w-6" />
      </button>

      {/* Accessibility Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-md mx-4">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Accessibility Options
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  aria-label="Close accessibility options"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Font Size */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Font Size
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={decreaseFontSize}
                    disabled={settings.fontSize <= 12}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Decrease font size"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <span className="text-sm text-gray-600 min-w-[3rem] text-center">
                    {settings.fontSize}px
                  </span>
                  <button
                    onClick={increaseFontSize}
                    disabled={settings.fontSize >= 24}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Increase font size"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Toggle Options */}
              <div className="space-y-4">
                {/* High Contrast */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <EyeIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <label htmlFor="high-contrast" className="text-sm font-medium text-gray-700">
                      High Contrast
                    </label>
                  </div>
                  <button
                    id="high-contrast"
                    role="switch"
                    aria-checked={settings.highContrast}
                    onClick={() => {
                      updateSetting('highContrast', !settings.highContrast)
                      announceToScreenReader(
                        `High contrast ${!settings.highContrast ? 'enabled' : 'disabled'}`
                      )
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      settings.highContrast ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.highContrast ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Dark Mode */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MoonIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <label htmlFor="dark-mode" className="text-sm font-medium text-gray-700">
                      Dark Mode
                    </label>
                  </div>
                  <button
                    id="dark-mode"
                    role="switch"
                    aria-checked={settings.darkMode}
                    onClick={() => {
                      updateSetting('darkMode', !settings.darkMode)
                      announceToScreenReader(
                        `Dark mode ${!settings.darkMode ? 'enabled' : 'disabled'}`
                      )
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      settings.darkMode ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Reduced Motion */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <label htmlFor="reduced-motion" className="text-sm font-medium text-gray-700">
                      Reduce Motion
                    </label>
                  </div>
                  <button
                    id="reduced-motion"
                    role="switch"
                    aria-checked={settings.reducedMotion}
                    onClick={() => {
                      updateSetting('reducedMotion', !settings.reducedMotion)
                      announceToScreenReader(
                        `Reduced motion ${!settings.reducedMotion ? 'enabled' : 'disabled'}`
                      )
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      settings.reducedMotion ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Reset Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    resetSettings()
                    announceToScreenReader('Accessibility settings reset to default')
                  }}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Reset to Default
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Screen Reader Only Content */}
      <div className="sr-only" aria-live="polite" aria-atomic="true" />
    </>
  )
}

// CSS classes to add to your global styles
export const accessibilityStyles = `
  /* High Contrast Mode */
  .high-contrast {
    filter: contrast(150%);
  }
  
  .high-contrast * {
    border-color: #000 !important;
  }
  
  .high-contrast a {
    text-decoration: underline !important;
  }
  
  /* Reduced Motion */
  .reduce-motion *,
  .reduce-motion *::before,
  .reduce-motion *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  
  /* Screen Reader Only */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  
  /* Focus Visible */
  .focus-visible:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
  
  /* Skip Link */
  .skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: #000;
    color: #fff;
    padding: 8px;
    text-decoration: none;
    z-index: 1000;
  }
  
  .skip-link:focus {
    top: 6px;
  }
`

