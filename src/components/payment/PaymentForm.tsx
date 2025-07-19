'use client'

import React, { useState } from 'react'
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { stripePromise, STRIPE_CONFIG, formatAmount } from '@/lib/stripe'
import {
  CreditCardIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface PaymentFormProps {
  amount: number
  description: string
  membershipType?: 'annual' | 'lifetime' | 'student'
  memberId?: string
  onSuccess?: (paymentIntent: any) => void
  onError?: (error: string) => void
}

const CheckoutForm: React.FC<PaymentFormProps> = ({
  amount,
  description,
  membershipType,
  memberId,
  onSuccess,
  onError
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [succeeded, setSucceeded] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setError(null)

    const cardElement = elements.getElement(CardElement)

    if (!cardElement) {
      setError('Card element not found')
      setIsLoading(false)
      return
    }

    try {
      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      })

      if (paymentMethodError) {
        setError(paymentMethodError.message || 'Payment method creation failed')
        setIsLoading(false)
        return
      }

      // In a real app, you would send the payment method to your backend
      // to create a payment intent and confirm the payment
      
      // Mock successful payment for demo
      setTimeout(() => {
        const mockPaymentIntent = {
          id: `pi_${Math.random().toString(36).substring(2, 15)}`,
          amount,
          currency: STRIPE_CONFIG.CURRENCY,
          status: 'succeeded',
          description,
          metadata: {
            membershipType: membershipType || '',
            memberId: memberId || '',
          }
        }

        setSucceeded(true)
        setIsLoading(false)
        onSuccess?.(mockPaymentIntent)
      }, 2000)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed'
      setError(errorMessage)
      setIsLoading(false)
      onError?.(errorMessage)
    }
  }

  if (succeeded) {
    return (
      <div className="text-center py-8">
        <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Successful!</h3>
        <p className="text-sm text-gray-600">
          Your payment of {formatAmount(amount)} has been processed successfully.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h3>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">{description}</span>
            <span className="text-lg font-bold text-gray-900">{formatAmount(amount)}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Information
            </label>
            <div className="border border-gray-300 rounded-md p-3 bg-white">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-sm text-red-600">{error}</span>
            </div>
          )}

          <div className="flex items-center text-sm text-gray-500">
            <LockClosedIcon className="h-4 w-4 mr-2" />
            Your payment information is secure and encrypted
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing...
          </div>
        ) : (
          <div className="flex items-center">
            <CreditCardIcon className="h-4 w-4 mr-2" />
            Pay {formatAmount(amount)}
          </div>
        )}
      </button>
    </form>
  )
}

export default function PaymentForm(props: PaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  )
}

