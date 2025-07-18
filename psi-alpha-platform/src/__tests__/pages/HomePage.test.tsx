import { render, screen, fireEvent } from '@testing-library/react'
import HomePage from '@/app/page'

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

describe('HomePage', () => {
  beforeEach(() => {
    render(<HomePage />)
  })

  it('renders the main heading', () => {
    const heading = screen.getByRole('heading', { name: /psi alpha/i, level: 1 })
    expect(heading).toBeInTheDocument()
  })

  it('displays the subtitle', () => {
    const subtitle = screen.getByText(/the international psychology honor society/i)
    expect(subtitle).toBeInTheDocument()
  })

  it('shows the main description', () => {
    const description = screen.getByText(/recognizing excellence in psychology education/i)
    expect(description).toBeInTheDocument()
  })

  it('displays navigation links', () => {
    expect(screen.getAllByText('About').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Membership').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Chapters').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Resources').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Events').length).toBeGreaterThan(0)
  })

  it('shows call-to-action buttons', () => {
    const applyButtons = screen.getAllByRole('link', { name: /apply for membership/i })
    const learnMoreButtons = screen.getAllByRole('link', { name: /learn more/i })
    
    expect(applyButtons.length).toBeGreaterThan(0)
    expect(learnMoreButtons.length).toBeGreaterThan(0)
    expect(applyButtons.some(button => button.getAttribute('href') === '/register')).toBe(true)
  })

  it('displays statistics', () => {
    expect(screen.getByText('50,000+')).toBeInTheDocument()
    expect(screen.getByText('Active Members')).toBeInTheDocument()
    expect(screen.getByText('1,100+')).toBeInTheDocument()
    expect(screen.getByText('Chapters Worldwide')).toBeInTheDocument()
  })

  it('shows feature cards', () => {
    expect(screen.getByText('Academic Excellence')).toBeInTheDocument()
    expect(screen.getByText('Professional Network')).toBeInTheDocument()
    expect(screen.getByText('Career Development')).toBeInTheDocument()
    expect(screen.getByText('Global Community')).toBeInTheDocument()
  })

  it('displays membership benefits', () => {
    expect(screen.getByText('Why Join Psi Alpha?')).toBeInTheDocument()
    expect(screen.getByText('Recognition of academic achievement')).toBeInTheDocument()
    expect(screen.getByText('Access to exclusive scholarships')).toBeInTheDocument()
    expect(screen.getByText('Professional networking opportunities')).toBeInTheDocument()
  })

  it('shows footer information', () => {
    expect(screen.getByText(/email: info@psialpha.org/i)).toBeInTheDocument()
    expect(screen.getByText(/phone: \(555\) 123-4567/i)).toBeInTheDocument()
    expect(screen.getByText(/© 2024 psi alpha/i)).toBeInTheDocument()
  })

  it('has proper link destinations', () => {
    const signInLinks = screen.getAllByRole('link', { name: /sign in/i })
    const joinNowLinks = screen.getAllByRole('link', { name: /join now/i })
    const memberPortalLinks = screen.getAllByRole('link', { name: /member portal/i })
    
    // Check that at least one of each link exists with correct href
    expect(signInLinks.some(link => link.getAttribute('href') === '/auth/login')).toBe(true)
    expect(joinNowLinks.some(link => link.getAttribute('href') === '/register')).toBe(true)
    expect(memberPortalLinks.some(link => link.getAttribute('href') === '/portal')).toBe(true)
  })

  it('handles smooth scrolling for anchor links', () => {
    const learnMoreButtons = screen.getAllByRole('link', { name: /learn more/i })
    const anchorLink = learnMoreButtons.find(button => button.getAttribute('href') === '#about')
    expect(anchorLink).toBeDefined()
  })
})

