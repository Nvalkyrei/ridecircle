// TypeScript interfaces for database models
// These correspond to the PostgreSQL schema definitions

// =====================================================
// SHARED MODELS
// =====================================================

export interface PlatformConfig {
  id: string
  key: string
  value: Record<string, any>
  description?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Tenant {
  id: string
  code: string
  name: string
  subdomain: string
  region: string
  timezone: string
  currency: string
  language: string
  config: Record<string, any>
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AuditLog {
  id: string
  tenantId?: string
  userId?: string
  action: string
  resourceType: string
  resourceId?: string
  oldValues?: Record<string, any>
  newValues?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  createdAt: Date
}

// =====================================================
// USER & AUTHENTICATION MODELS
// =====================================================

export type UserRole = "customer" | "host" | "admin" | "super_admin"
export type UserStatus = "pending" | "active" | "suspended" | "banned"
export type KYCStatus = "pending" | "in_review" | "approved" | "rejected" | "expired"

export interface User {
  id: string
  email: string
  phone: string
  passwordHash: string
  role: UserRole
  status: UserStatus
  emailVerified: boolean
  phoneVerified: boolean
  lastLogin?: Date
  failedLoginAttempts: number
  lockedUntil?: Date
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile {
  id: string
  userId: string
  firstName: string
  lastName: string
  dateOfBirth?: Date
  gender?: string
  profileImageUrl?: string
  address?: {
    street: string
    city: string
    state: string
    pincode: string
    country: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  preferences: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface KYCDocument {
  id: string
  userId: string
  documentType: "aadhaar" | "pan" | "driving_license" | "passport"
  documentNumber: string
  documentUrl: string
  verificationStatus: KYCStatus
  verifiedAt?: Date
  verifiedBy?: string
  rejectionReason?: string
  expiresAt?: Date
  metadata: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface OTPVerification {
  id: string
  userId?: string
  contact: string
  otpCode: string
  purpose: "registration" | "login" | "password_reset"
  expiresAt: Date
  verifiedAt?: Date
  attempts: number
  createdAt: Date
}

export interface RefreshToken {
  id: string
  userId: string
  tokenHash: string
  deviceInfo?: Record<string, any>
  expiresAt: Date
  revokedAt?: Date
  createdAt: Date
}

// =====================================================
// VEHICLE MODELS
// =====================================================

export type VehicleStatus = "draft" | "pending_approval" | "active" | "inactive" | "maintenance" | "retired"
export type FuelType = "petrol" | "diesel" | "cng" | "electric" | "hybrid"
export type TransmissionType = "manual" | "automatic" | "cvt"

export interface VehicleCategory {
  id: string
  name: string
  description?: string
  iconUrl?: string
  sortOrder: number
  isActive: boolean
  createdAt: Date
}

export interface VehicleMake {
  id: string
  name: string
  logoUrl?: string
  country?: string
  isActive: boolean
  createdAt: Date
}

export interface VehicleModel {
  id: string
  makeId: string
  categoryId: string
  name: string
  yearFrom?: number
  yearTo?: number
  specifications: Record<string, any>
  isActive: boolean
  createdAt: Date
}

export interface Vehicle {
  id: string
  hostId: string
  modelId: string
  registrationNumber: string
  year: number
  color?: string
  fuelType: FuelType
  transmission: TransmissionType
  seatingCapacity: number
  mileage?: number
  status: VehicleStatus

  // Location
  location: {
    type: "Point"
    coordinates: [number, number] // [longitude, latitude]
  }
  address: {
    street: string
    area: string
    city: string
    state: string
    pincode: string
    landmark?: string
  }
  pickupInstructions?: string

  // Pricing
  basePricePerDay: number
  basePricePerHour?: number
  securityDeposit: number

  // Features
  features: string[] // ["bluetooth", "gps", "ac", "music_system"]
  rules: {
    smoking?: boolean
    pets?: boolean
    additionalDrivers?: boolean
    mileageLimit?: number
    fuelPolicy?: "same_to_same" | "pay_for_fuel"
  }

  // Documents
  insurancePolicyNumber?: string
  insuranceExpiresAt?: Date
  rcDocumentUrl?: string
  insuranceDocumentUrl?: string

  // Stats
  totalTrips: number
  averageRating: number
  totalEarnings: number

  // Approval
  approvedAt?: Date
  approvedBy?: string

  createdAt: Date
  updatedAt: Date
}

export interface VehicleImage {
  id: string
  vehicleId: string
  imageUrl: string
  imageType: "exterior" | "interior" | "documents"
  sortOrder: number
  isPrimary: boolean
  createdAt: Date
}

export interface VehicleAvailability {
  id: string
  vehicleId: string
  date: Date
  isAvailable: boolean
  priceOverride?: number
  reason?: string
  createdAt: Date
}

// =====================================================
// BOOKING MODELS
// =====================================================

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "payment_pending"
  | "active"
  | "completed"
  | "cancelled"
  | "no_show"
  | "disputed"

export interface Booking {
  id: string
  bookingNumber: string
  customerId: string
  hostId: string
  vehicleId: string

  // Timing
  startDate: Date
  endDate: Date
  pickupLocation?: {
    type: "Point"
    coordinates: [number, number]
  }
  dropoffLocation?: {
    type: "Point"
    coordinates: [number, number]
  }
  pickupAddress?: Record<string, any>
  dropoffAddress?: Record<string, any>

  // Pricing
  baseAmount: number
  taxes: number
  fees: number
  discounts: number
  totalAmount: number
  securityDeposit: number

  // Status
  status: BookingStatus
  paymentStatus: string

  // Trip details
  actualStartTime?: Date
  actualEndTime?: Date
  startOdometer?: number
  endOdometer?: number
  fuelLevelStart?: number
  fuelLevelEnd?: number

  // Additional info
  specialRequests?: string
  cancellationReason?: string
  cancelledAt?: Date
  cancelledBy?: string

  createdAt: Date
  updatedAt: Date
}

export interface BookingStatusHistory {
  id: string
  bookingId: string
  status: BookingStatus
  changedBy?: string
  reason?: string
  metadata: Record<string, any>
  createdAt: Date
}

// =====================================================
// PAYMENT MODELS
// =====================================================

export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "refunded" | "disputed"
export type PaymentMethod = "card" | "upi" | "netbanking" | "wallet" | "cash"
export type TransactionType = "booking" | "security_deposit" | "refund" | "penalty" | "commission"

export interface Payment {
  id: string
  bookingId: string
  userId: string

  // Payment details
  amount: number
  currency: string
  paymentMethod: PaymentMethod
  transactionType: TransactionType

  // Gateway info
  gatewayProvider?: string
  gatewayTransactionId?: string
  gatewayResponse?: Record<string, any>

  // Status
  status: PaymentStatus
  processedAt?: Date
  failedReason?: string

  // Refund info
  refundAmount: number
  refundedAt?: Date
  refundReason?: string

  createdAt: Date
  updatedAt: Date
}

export interface HostEarnings {
  id: string
  hostId: string
  bookingId: string

  // Earnings breakdown
  grossAmount: number
  platformCommission: number
  taxes: number
  netAmount: number

  // Payout info
  payoutStatus: string
  payoutDate?: Date
  payoutReference?: string

  createdAt: Date
  updatedAt: Date
}

// =====================================================
// REVIEW & RATING MODELS
// =====================================================

export interface Review {
  id: string
  bookingId: string
  reviewerId: string
  revieweeId: string
  vehicleId?: string

  // Ratings (1-5)
  overallRating: number
  cleanlinessRating?: number
  communicationRating?: number
  vehicleConditionRating?: number

  // Content
  title?: string
  comment?: string

  // Moderation
  isPublished: boolean
  moderatedAt?: Date
  moderatedBy?: string

  createdAt: Date
  updatedAt: Date
}

// =====================================================
// NOTIFICATION MODELS
// =====================================================

export type NotificationType =
  | "booking_request"
  | "booking_confirmed"
  | "payment_received"
  | "trip_started"
  | "trip_completed"
  | "review_received"
  | "system_alert"
  | "promotional"

export type NotificationChannel = "in_app" | "email" | "sms" | "push"

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  channel: NotificationChannel

  // Content
  title: string
  message: string
  data: Record<string, any>

  // Delivery tracking
  sentAt?: Date
  deliveredAt?: Date
  readAt?: Date
  clickedAt?: Date

  // Status
  isRead: boolean
  deliveryStatus: string

  createdAt: Date
}

export interface Message {
  id: string
  bookingId?: string
  senderId: string
  recipientId: string

  message: string
  messageType: string
  metadata: Record<string, any>

  readAt?: Date
  createdAt: Date
}

// =====================================================
// INCIDENT MODELS
// =====================================================

export type IncidentType = "damage" | "accident" | "theft" | "breakdown" | "traffic_violation"
export type IncidentStatus = "reported" | "investigating" | "resolved" | "disputed" | "closed"

export interface Incident {
  id: string
  bookingId: string
  reportedBy: string
  vehicleId: string

  // Details
  type: IncidentType
  status: IncidentStatus
  title: string
  description: string
  location?: {
    type: "Point"
    coordinates: [number, number]
  }
  occurredAt?: Date

  // Financial
  estimatedCost?: number
  actualCost?: number
  insuranceClaimNumber?: string

  // Resolution
  resolvedAt?: Date
  resolvedBy?: string
  resolutionNotes?: string

  createdAt: Date
  updatedAt: Date
}

export interface IncidentEvidence {
  id: string
  incidentId: string
  fileUrl: string
  fileType: "image" | "document" | "video"
  description?: string
  uploadedBy: string
  createdAt: Date
}

// =====================================================
// API REQUEST/RESPONSE TYPES
// =====================================================

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: string[]
  timestamp: string
}

// Search and filter types
export interface VehicleSearchFilters {
  location?: {
    lat: number
    lng: number
    radius?: number // in km
  }
  startDate?: Date
  endDate?: Date
  categoryId?: string
  makeId?: string
  priceRange?: {
    min: number
    max: number
  }
  features?: string[]
  transmission?: TransmissionType
  fuelType?: FuelType
  seatingCapacity?: number
  sortBy?: "price" | "rating" | "distance" | "popularity"
}

export interface BookingSearchFilters {
  status?: BookingStatus[]
  startDate?: Date
  endDate?: Date
  customerId?: string
  hostId?: string
  vehicleId?: string
}
