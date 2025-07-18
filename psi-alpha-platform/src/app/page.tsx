'use client'

import React from 'react'
import Link from 'next/link'
import {
  AcademicCapIcon,
  UsersIcon,
  TrophyIcon,
  GlobeAltIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  StarIcon,
  BookOpenIcon,
  UserGroupIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

export default function HomePage() {
  const features = [
    {
      name: 'Academic Excellence',
      description: 'Recognize outstanding achievement in psychology studies and research.',
      icon: AcademicCapIcon,
    },
    {
      name: 'Professional Network',
      description: 'Connect with psychology professionals, researchers, and fellow students.',
      icon: UsersIcon,
    },
    {
      name: 'Career Development',
      description: 'Access exclusive resources, workshops, and career advancement opportunities.',
      icon: TrophyIcon,
    },
    {
      name: 'Global Community',
      description: 'Join a worldwide network of psychology honor society members.',
      icon: GlobeAltIcon,
    },
  ]

  const benefits = [
    'Recognition of academic achievement',
    'Access to exclusive scholarships',
    'Professional networking opportunities',
    'Career development resources',
    'Research collaboration opportunities',
    'Leadership development programs',
    'Alumni mentorship network',
    'Conference discounts and priority registration'
  ]

  const stats = [
    { name: 'Active Members', value: '50,000+' },
    { name: 'Chapters Worldwide', value: '1,100+' },
    { name: 'Universities', value: '800+' },
    { name: 'Countries', value: '15+' },
  ]

  return (
    <div className="bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-blue-600">Psi Alpha</h1>
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <a href="#about" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">About</a>
                <a href="#membership" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">Membership</a>
                <a href="#chapters" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">Chapters</a>
                <a href="#resources" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">Resources</a>
                <a href="#events" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">Events</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Sign In
              </Link>
              <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Psi Alpha
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-blue-100">
              The International Psychology Honor Society
            </p>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-blue-200">
              Recognizing excellence in psychology education and fostering professional development 
              for students and faculty worldwide.
            </p>
            <div className="mt-10 flex justify-center space-x-6">
              <Link href="/register" className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3 rounded-md text-lg font-medium transition-colors">
                Apply for Membership
              </Link>
              <Link href="#about" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-md text-lg font-medium transition-colors">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.name} className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
                <div className="mt-2 text-sm font-medium text-gray-600">{stat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">About Psi Alpha</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Excellence in Psychology Education
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Psi Alpha is the premier international honor society in psychology, dedicated to recognizing 
              academic excellence and promoting the advancement of psychological science.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.name} className="text-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="mt-5">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{feature.name}</h3>
                    <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Membership Benefits */}
      <div id="membership" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Membership Benefits</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Why Join Psi Alpha?
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Membership in Psi Alpha provides numerous benefits that support your academic and professional journey in psychology.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-6 w-6 text-green-500" aria-hidden="true" />
                  </div>
                  <p className="ml-3 text-base text-gray-700">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/payment" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors">
              View Membership Options
            </Link>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-600">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to join?</span>
            <span className="block">Start your application today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-200">
            Take the first step towards joining the premier psychology honor society and unlock exclusive benefits.
          </p>
          <div className="mt-8 flex justify-center space-x-6">
            <Link href="/register" className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3 rounded-md text-lg font-medium transition-colors">
              Apply Now
            </Link>
            <Link href="/portal" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-md text-lg font-medium transition-colors">
              Member Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4">Psi Alpha</h3>
              <p className="text-gray-300 text-base">
                The International Psychology Honor Society, recognizing excellence in psychology education 
                and fostering professional development worldwide.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-300 hover:text-white">About</a></li>
                <li><a href="#membership" className="text-gray-300 hover:text-white">Membership</a></li>
                <li><a href="/register" className="text-gray-300 hover:text-white">Apply</a></li>
                <li><a href="/portal" className="text-gray-300 hover:text-white">Member Portal</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="text-gray-300">Email: info@psialpha.org</li>
                <li className="text-gray-300">Phone: (555) 123-4567</li>
                <li className="text-gray-300">Address: 123 Psychology Ave</li>
                <li className="text-gray-300">Suite 100, Academic City, AC 12345</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8">
            <p className="text-base text-gray-400 text-center">
              © 2024 Psi Alpha International Psychology Honor Society. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

