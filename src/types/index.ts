// User and Authentication Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  status: UserStatus
  profileImage?: string
  phone?: string
  address?: Address
  createdAt: string
  updatedAt: string
}

export type UserRole = "admin" | "advisor" | "member" | "prospect" | "alumni"

export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended'

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

// Member Types
export interface Member {
  id: string
  userId: string
  user?: User
  membershipType: MembershipType
  dues: number
  paymentStatus: PaymentStatus
  inductionDate?: string
  alumniDate?: string
  emergencyContact?: EmergencyContact
  medicalInfo?: string
  customFields?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export type MembershipType = 'active' | 'associate' | 'honorary' | 'alumni'
export type PaymentStatus = 'current' | 'overdue' | 'exempt' | 'suspended'

export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
  email?: string
}

// Payment Types
export interface Payment {
  id: string
  userId: string
  user?: User
  amount: number
  currency: string
  type: PaymentType
  status: PaymentStatus
  stripePaymentId?: string
  description?: string
  dueDate?: string
  paidAt?: string
  createdAt: string
  updatedAt: string
}

export type PaymentType = 'dues' | 'fees' | 'donation' | 'merchandise' | 'event'

// Event Types
export interface Event {
  id: string
  title: string
  description: string
  date: string
  endDate?: string
  location: string
  capacity?: number
  registrationRequired: boolean
  registrationDeadline?: string
  price?: number
  createdBy: string
  attendees?: EventAttendee[]
  createdAt: string
  updatedAt: string
}

export interface EventAttendee {
  id: string
  eventId: string
  userId: string
  user?: User
  registeredAt: string
  attended?: boolean
  notes?: string
}

// Content Types
export interface Page {
  id: string
  slug: string
  title: string
  content: string
  metaDescription?: string
  published: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface NewsPost {
  id: string
  title: string
  content: string
  excerpt?: string
  featuredImage?: string
  published: boolean
  publishedAt?: string
  createdBy: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

// Form Types
export interface InductionApplication {
  id: string
  userId: string
  user?: User
  status: ApplicationStatus
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  notes?: string
  documents?: ApplicationDocument[]
  personalInfo: PersonalInfo
  academicInfo?: AcademicInfo
  references?: Reference[]
}

export type ApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'

export interface ApplicationDocument {
  id: string
  name: string
  type: string
  url: string
  uploadedAt: string
}

export interface PersonalInfo {
  dateOfBirth: string
  gender?: string
  nationality?: string
  occupation?: string
  employer?: string
  interests?: string[]
}

export interface AcademicInfo {
  institution: string
  degree: string
  graduationYear: number
  gpa?: number
  major?: string
}

export interface Reference {
  name: string
  email: string
  phone?: string
  relationship: string
  organization?: string
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}

// Form Validation Types
export interface FormErrors {
  [key: string]: string | undefined
}

// UI State Types
export interface LoadingState {
  [key: string]: boolean
}

export interface NotificationState {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

