import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

// Can be imported from a shared config
export const locales = ['en', 'es'] as const
export type Locale = typeof locales[number]

export const defaultLocale: Locale = 'en'

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español'
}

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  es: '🇪🇸'
}

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) notFound()

  return {
    messages: (await import(`./locales/${locale}/common.json`)).default
  }
})

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  const segments = pathname.split('/')
  const potentialLocale = segments[1]
  
  if (potentialLocale && isValidLocale(potentialLocale)) {
    return potentialLocale
  }
  
  return null
}

export function removeLocaleFromPathname(pathname: string): string {
  const locale = getLocaleFromPathname(pathname)
  if (locale) {
    return pathname.replace(`/${locale}`, '') || '/'
  }
  return pathname
}

