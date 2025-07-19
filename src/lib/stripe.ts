import { loadStripe } from '@stripe/stripe-js'

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

export const STRIPE_CONFIG = {
  // Membership fee amounts in cents
  MEMBERSHIP_FEES: {
    ANNUAL: 5000, // $50.00
    LIFETIME: 15000, // $150.00
    STUDENT: 2500, // $25.00
  },
  
  // Payment descriptions
  PAYMENT_DESCRIPTIONS: {
    ANNUAL: 'Annual Psi Alpha Membership',
    LIFETIME: 'Lifetime Psi Alpha Membership',
    STUDENT: 'Student Psi Alpha Membership',
    INDUCTION: 'Induction Ceremony Fee',
    EVENT: 'Event Registration Fee',
  },
  
  // Currency
  CURRENCY: 'usd',
  
  // Success and cancel URLs
  SUCCESS_URL: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
  CANCEL_URL: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: string
  description?: string
  metadata?: Record<string, string>
}

export interface StripeCustomer {
  id: string
  email: string
  name?: string
  metadata?: Record<string, string>
}

export interface PaymentMethod {
  id: string
  type: string
  card?: {
    brand: string
    last4: string
    exp_month: number
    exp_year: number
  }
}

export interface Subscription {
  id: string
  status: string
  current_period_start: number
  current_period_end: number
  plan: {
    id: string
    amount: number
    currency: string
    interval: string
  }
}

// Helper function to format amount for display
export const formatAmount = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount / 100)
}

// Helper function to get payment status color
export const getPaymentStatusColor = (status: string): string => {
  switch (status) {
    case 'succeeded':
      return 'text-green-600 bg-green-100'
    case 'pending':
      return 'text-yellow-600 bg-yellow-100'
    case 'failed':
      return 'text-red-600 bg-red-100'
    case 'canceled':
      return 'text-gray-600 bg-gray-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

// Helper function to get payment status label
export const getPaymentStatusLabel = (status: string): string => {
  switch (status) {
    case 'succeeded':
      return 'Paid'
    case 'pending':
      return 'Pending'
    case 'failed':
      return 'Failed'
    case 'canceled':
      return 'Canceled'
    case 'requires_payment_method':
      return 'Payment Required'
    case 'requires_confirmation':
      return 'Confirming'
    case 'requires_action':
      return 'Action Required'
    default:
      return 'Unknown'
  }
}

