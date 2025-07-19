'use client'

import React from 'react'

interface SkipNavigationProps {
  links?: Array<{
    href: string
    label: string
  }>
}

const defaultLinks = [
  { href: '#main-content', label: 'Skip to main content' },
  { href: '#navigation', label: 'Skip to navigation' },
  { href: '#footer', label: 'Skip to footer' }
]

export default function SkipNavigation({ links = defaultLinks }: SkipNavigationProps) {
  return (
    <div className="skip-navigation">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.href}
          className="skip-link"
          onFocus={(e) => {
            // Ensure the target element exists and is focusable
            const target = document.querySelector(link.href)
            if (target) {
              target.setAttribute('tabindex', '-1')
            }
          }}
          onClick={(e) => {
            e.preventDefault()
            const target = document.querySelector(link.href)
            if (target) {
              target.scrollIntoView({ behavior: 'smooth' })
              // Focus the target element for screen readers
              if (target instanceof HTMLElement) {
                target.focus()
              }
            }
          }}
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}

// Landmark component for better semantic structure
interface LandmarkProps {
  as?: keyof JSX.IntrinsicElements
  role?: string
  ariaLabel?: string
  ariaLabelledBy?: string
  id?: string
  children: React.ReactNode
  className?: string
}

export function Landmark({
  as: Component = 'div',
  role,
  ariaLabel,
  ariaLabelledBy,
  id,
  children,
  className = ''
}: LandmarkProps) {
  return (
    <Component
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      id={id}
      className={className}
    >
      {children}
    </Component>
  )
}

// Focus management hook
export function useFocusManagement() {
  const focusElement = (selector: string) => {
    const element = document.querySelector(selector) as HTMLElement
    if (element) {
      element.focus()
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const trapFocus = (containerSelector: string) => {
    const container = document.querySelector(containerSelector) as HTMLElement
    if (!container) return

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  }

  const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    document.body.appendChild(announcement)
    
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement)
      }
    }, 1000)
  }

  return {
    focusElement,
    trapFocus,
    announceToScreenReader
  }
}

// Keyboard navigation hook
export function useKeyboardNavigation() {
  const handleArrowNavigation = (
    e: React.KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    onIndexChange: (index: number) => void,
    orientation: 'horizontal' | 'vertical' = 'vertical'
  ) => {
    const isHorizontal = orientation === 'horizontal'
    const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown'
    const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp'

    switch (e.key) {
      case nextKey:
        e.preventDefault()
        const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
        onIndexChange(nextIndex)
        items[nextIndex]?.focus()
        break
      case prevKey:
        e.preventDefault()
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
        onIndexChange(prevIndex)
        items[prevIndex]?.focus()
        break
      case 'Home':
        e.preventDefault()
        onIndexChange(0)
        items[0]?.focus()
        break
      case 'End':
        e.preventDefault()
        const lastIndex = items.length - 1
        onIndexChange(lastIndex)
        items[lastIndex]?.focus()
        break
    }
  }

  return { handleArrowNavigation }
}

