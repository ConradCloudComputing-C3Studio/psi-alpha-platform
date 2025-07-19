'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import PaymentForm from '@/components/payment/PaymentForm'
import { STRIPE_CONFIG, formatAmount } from '@/lib/stripe'
import {
  CheckCircleIcon,
  ClockIcon,
  AcademicCapIcon,
  StarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

interface MembershipOption {
  id: string
  name: string
  description: string
  amount: number
  icon: React.ComponentType<{ className?: string }>
  features: string[]
  popular?: boolean
}

export default function PaymentPage() {
  const { user } = useAuth()
  const [selectedMembership, setSelectedMembership] = useState<MembershipOption | null>(null)
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  const membershipOptions: MembershipOption[] = [
    {
      id: 'student',
      name: 'Student Membership',
      description: 'Perfect for current students',
      amount: STRIPE_CONFIG.MEMBERSHIP_FEES.STUDENT,
      icon: AcademicCapIcon,
      features: [
        'Access to all member resources',
        'Chapter events and meetings',
        'Networking opportunities',
        'Academic support',
        'Valid while enrolled'
      ]
    },
    {
      id: 'annual',
      name: 'Annual Membership',
      description: 'Renewable yearly membership',
      amount: STRIPE_CONFIG.MEMBERSHIP_FEES.ANNUAL,
      icon: ClockIcon,
      features: [
        'All student benefits',
        'Professional networking',
        'Career development resources',
        'Alumni directory access',
        'Annual conference discount'
      ],
      popular: true
    },
    {
      id: 'lifetime',
      name: 'Lifetime Membership',
      description: 'One-time payment, lifetime access',
      amount: STRIPE_CONFIG.MEMBERSHIP_FEES.LIFETIME,
      icon: ArrowPathIcon,
      features: [
        'All annual benefits',
        'Lifetime access',
        'No renewal required',
        'Legacy member status',
        'Special recognition',
        'Best value overall'
      ]
    }
  ]

  const handleMembershipSelect = (membership: MembershipOption) => {
    setSelectedMembership(membership)
    setShowPaymentForm(true)
  }

  const handlePaymentSuccess = (paymentIntent: any) => {
    console.log('Payment successful:', paymentIntent)
    // In a real app, you would update the user's membership status
    // and redirect to a success page
  }

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error)
    // In a real app, you would show an error message
    // and possibly retry the payment
  }

  if (showPaymentForm && selectedMembership) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">Psi Alpha</h1>
            <p className="text-gray-600">Complete Your Membership Payment</p>
          </div>

          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <selectedMembership.icon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">{selectedMembership.name}</h3>
                <p className="text-sm text-gray-600">{selectedMembership.description}</p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <ul className="space-y-2">
                {selectedMembership.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <PaymentForm
              amount={selectedMembership.amount}
              description={STRIPE_CONFIG.PAYMENT_DESCRIPTIONS[selectedMembership.id.toUpperCase() as keyof typeof STRIPE_CONFIG.PAYMENT_DESCRIPTIONS]}
              membershipType={selectedMembership.id as any}
              memberId={user?.id}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => setShowPaymentForm(false)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to membership options
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">Psi Alpha</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose Your Membership</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join the premier psychology honor society and unlock exclusive benefits, 
            networking opportunities, and professional development resources.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {membershipOptions.map((option) => (
            <div
              key={option.id}
              className={`relative bg-white rounded-lg shadow-lg overflow-hidden ${
                option.popular ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {option.popular && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-sm font-medium rounded-bl-lg">
                  <StarIcon className="h-4 w-4 inline mr-1" />
                  Most Popular
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <option.icon className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{option.name}</h3>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatAmount(option.amount)}
                  </span>
                  {option.id === 'annual' && (
                    <span className="text-sm text-gray-600 ml-1">/year</span>
                  )}
                  {option.id === 'student' && (
                    <span className="text-sm text-gray-600 ml-1">/semester</span>
                  )}
                </div>
                
                <ul className="space-y-3 mb-8">
                  {option.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handleMembershipSelect(option)}
                  className={`w-full py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                    option.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Select {option.name}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Secure Payments</h4>
              <p>All payments are processed securely through Stripe. Your payment information is encrypted and never stored on our servers.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Refund Policy</h4>
              <p>Membership fees are non-refundable. However, if you experience any issues, please contact our support team for assistance.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Questions?</h4>
              <p>If you have any questions about membership or payments, please contact us at <a href="mailto:support@psialpha.org" className="text-blue-600 hover:text-blue-500">support@psialpha.org</a></p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Member Benefits</h4>
              <p>Your membership includes access to exclusive resources, networking events, and professional development opportunities.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

