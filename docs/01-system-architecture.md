# Ride Circle - System Architecture & Implementation Plan

## Executive Summary

Ride Circle is a comprehensive peer-to-peer car rental platform connecting car owners (Hosts) with renters (Customers), with administrative oversight. This document provides crystal-clear, implementation-ready specifications aligned with Indian regulatory and security requirements.

## 1. System Context (C4 Level 1)

### 1.1 Context Diagram

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                        RIDE CIRCLE ECOSYSTEM                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────────────────────────────┐    │
│  │   CUSTOMER  │────│                                     │    │
│  │   (Renter)  │    │                                     │    │
│  └─────────────┘    │                                     │    │
│                     │         RIDE CIRCLE                 │    │
│  ┌─────────────┐    │         PLATFORM                    │    │
│  │    HOST     │────│                                     │    │
│  │ (Car Owner) │    │                                     │    │
│  └─────────────┘    │                                     │    │
│                     │                                     │    │
│  ┌─────────────┐    │                                     │    │
│  │    ADMIN    │────│                                     │    │
│  │ (Platform)  │    └─────────────────────────────────────┘    │
│  └─────────────┘                                               │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                      EXTERNAL SYSTEMS                          │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Payment   │  │     KYC     │  │  Insurance  │            │
│  │  Gateways   │  │  Services   │  │  Partners   │            │
│  │(Razorpay/   │  │(Aadhaar/    │  │             │            │
│  │ Stripe)     │  │ DigiLocker) │  │             │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   SMS/OTP   │  │   Maps &    │  │  Telematics │            │
│  │  Services   │  │  Location   │  │   & IoT     │            │
│  │             │  │  Services   │  │             │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

### 1.2 Key Stakeholders

- **Customers (Renters)**: Individuals seeking car rentals
- **Hosts (Car Owners)**: Vehicle owners monetizing their assets
- **Admins**: Platform operators managing the ecosystem
- **Regulatory Bodies**: RTO, Insurance regulators, Tax authorities
- **Service Providers**: Payment gateways, KYC services, Insurance partners

## 2. Container Architecture (C4 Level 2)

### 2.1 High-Level Container Diagram

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                    RIDE CIRCLE PLATFORM                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐                    │
│  │   WEB CLIENT    │    │  MOBILE APPS    │                    │
│  │   (Next.js)     │    │ (React Native)  │                    │
│  │                 │    │                 │                    │
│  │ • Customer UI   │    │ • iOS App       │                    │
│  │ • Host Portal   │    │ • Android App   │                    │
│  │ • Admin Panel   │    │                 │                    │
│  └─────────────────┘    └─────────────────┘                    │
│           │                       │                            │
│           └───────────┬───────────┘                            │
│                       │                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                API GATEWAY                              │   │
│  │              (Next.js API Routes)                      │   │
│  │                                                         │   │
│  │ • Authentication & Authorization                        │   │
│  │ • Rate Limiting & Throttling                           │   │
│  │ • Request Routing & Load Balancing                     │   │
│  │ • API Versioning & Documentation                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                               │                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              MICROSERVICES LAYER                       │   │
│  │                                                         │   │
│  │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │   │
│  │ │Auth & KYC   │ │  Listings   │ │ Booking &   │        │   │
│  │ │  Service    │ │  Service    │ │ Pricing     │        │   │
│  │ └─────────────┘ └─────────────┘ └─────────────┘        │   │
│  │                                                         │   │
│  │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │   │
│  │ │ Payments &  │ │ Trip &      │ │Notifications│        │   │
│  │ │ Invoicing   │ │ Telematics  │ │  Service    │        │   │
│  │ └─────────────┘ └─────────────┘ └─────────────┘        │   │
│  │                                                         │   │
│  │ ┌─────────────┐ ┌─────────────┐                        │   │
│  │ │  Host CRM   │ │   Admin     │                        │   │
│  │ │  Service    │ │  Service    │                        │   │
│  │ └─────────────┘ └─────────────┘                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                               │                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                DATA LAYER                               │   │
│  │                                                         │   │
│  │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │   │
│  │ │ PostgreSQL  │ │    Redis    │ │   AWS S3    │        │   │
│  │ │ (Primary    │ │ (Cache &    │ │ (Media &    │        │   │
│  │ │ Database)   │ │ Sessions)   │ │ Documents)  │        │   │
│  │ └─────────────┘ └─────────────┘ └─────────────┘        │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

### 2.2 Technology Stack Justification

**Frontend Stack:**
- **Next.js 14+ (App Router)**: Server-side rendering, SEO optimization, built-in API routes
- **TypeScript**: Type safety, better developer experience, reduced runtime errors
- **Tailwind CSS**: Rapid UI development, consistent design system
- **React Query/SWR**: Efficient data fetching and caching

**Backend Stack:**
- **Node.js + Express**: JavaScript ecosystem consistency, rapid development
- **TypeScript**: End-to-end type safety
- **PostgreSQL**: ACID compliance, complex queries, JSON support for flexible schemas
- **Redis**: Session management, caching, real-time features, job queues

**Infrastructure:**
- **AWS/Vercel**: Scalable hosting, global CDN, serverless functions
- **AWS S3**: Secure file storage with encryption
- **AWS Secrets Manager**: Secure credential management

**Why PostgreSQL over MongoDB:**
- **ACID Transactions**: Critical for financial operations and booking consistency
- **Complex Relationships**: Better handling of user-car-booking relationships
- **Regulatory Compliance**: Easier audit trails and data integrity
- **Mature Ecosystem**: Better tooling for analytics and reporting

## 3. Component Architecture (C4 Level 3)

### 3.1 Bounded Contexts & Services

#### 3.1.1 Authentication & KYC Service
\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                 AUTH & KYC SERVICE                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Components:                                                │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │ Authentication  │  │      KYC        │                  │
│  │   Controller    │  │   Controller    │                  │
│  └─────────────────┘  └─────────────────┘                  │
│           │                     │                          │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │      JWT        │  │   Document      │                  │
│  │    Service      │  │  Verification   │                  │
│  └─────────────────┘  └─────────────────┘                  │
│           │                     │                          │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │     OTP         │  │   Aadhaar       │                  │
│  │   Service       │  │  Integration    │                  │
│  └─────────────────┘  └─────────────────┘                  │
│                                                             │
│  Data Models:                                               │
│  • User, UserProfile, KYCDocument, OTPVerification         │
│  • Session, RefreshToken, LoginAttempt                     │
└─────────────────────────────────────────────────────────────┘
\`\`\`

#### 3.1.2 Listings Service
\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                   LISTINGS SERVICE                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Components:                                                │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   Vehicle       │  │    Search       │                  │
│  │  Controller     │  │  Controller     │                  │
│  └─────────────────┘  └─────────────────┘                  │
│           │                     │                          │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   Availability  │  │   Pricing       │                  │
│  │    Service      │  │   Service       │                  │
│  └─────────────────┘  └─────────────────┘                  │
│           │                     │                          │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │    Media        │  │   Location      │                  │
│  │   Service       │  │   Service       │                  │
│  └─────────────────┘  └─────────────────┘                  │
│                                                             │
│  Data Models:                                               │
│  • Vehicle, VehicleImage, VehicleFeature                   │
│  • Availability, PricingRule, Location                     │
└─────────────────────────────────────────────────────────────┘
\`\`\`

#### 3.1.3 Booking & Pricing Service
\`\`\`
┌─────────────────────────────────────────────────────────────┐
│               BOOKING & PRICING SERVICE                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Components:                                                │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │    Booking      │  │    Pricing      │                  │
│  │  Controller     │  │   Controller    │                  │
│  └─────────────────┘  └─────────────────┘                  │
│           │                     │                          │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │ Reservation     │  │   Dynamic       │                  │
│  │   Service       │  │  Pricing        │                  │
│  └─────────────────┘  └─────────────────┘                  │
│           │                     │                          │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   Calendar      │  │   Discount      │                  │
│  │   Service       │  │   Service       │                  │
│  └─────────────────┘  └─────────────────┘                  │
│                                                             │
│  Data Models:                                               │
│  • Booking, BookingStatus, PaymentSchedule                 │
│  • PricingTier, Discount, Surcharge                        │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### 3.2 Multi-Tenant Architecture

#### 3.2.1 Tenant Isolation Strategy
\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                 MULTI-TENANT DESIGN                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Strategy: Schema-per-tenant with shared infrastructure     │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                 TENANT ROUTER                       │   │
│  │                                                     │   │
│  │  • Subdomain-based routing (mumbai.ridecircle.in)  │   │
│  │  • City-specific configurations                    │   │
│  │  • Franchise management                            │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              DATABASE LAYER                         │   │
│  │                                                     │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │   Mumbai    │  │  Bangalore  │  │    Delhi    │  │   │
│  │  │   Schema    │  │   Schema    │  │   Schema    │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────────┐  │   │
│  │  │            SHARED SCHEMA                        │  │   │
│  │  │  • Global configurations                        │  │   │
│  │  │  • Cross-tenant analytics                       │  │   │
│  │  │  • Platform-wide settings                       │  │   │
│  │  └─────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
\`\`\`

#### 3.2.2 Franchise Support Model
- **City-level franchises**: Independent operations with shared platform
- **Revenue sharing**: Configurable commission structures
- **Local compliance**: City-specific regulatory requirements
- **Brand consistency**: Shared UI/UX with local customizations

## 4. Security Architecture

### 4.1 Security Layers
\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                   SECURITY ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                TRANSPORT LAYER                      │   │
│  │  • HTTPS/TLS 1.3 (mandatory)                       │   │
│  │  • Certificate pinning                             │   │
│  │  • HSTS headers                                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              APPLICATION LAYER                      │   │
│  │  • JWT + Rotating Refresh Tokens                   │   │
│  │  • Role-Based Access Control (RBAC)                │   │
│  │  • Multi-Factor Authentication (OTP)               │   │
│  │  • Rate limiting & DDoS protection                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                DATA LAYER                           │   │
│  │  • Encryption at rest (AES-256)                    │   │
│  │  • Field-level encryption for PII                  │   │
│  │  • Database connection encryption                  │   │
│  │  • Secure key management (AWS KMS)                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              COMPLIANCE LAYER                       │   │
│  │  • PII data retention policies                     │   │
│  │  • Audit logging & monitoring                      │   │
│  │  • GDPR/Data Protection compliance                 │   │
│  │  • Financial transaction security                  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### 4.2 Authentication Flow
\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                 AUTHENTICATION FLOW                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. User Registration/Login                                 │
│     ↓                                                       │
│  2. Phone/Email Verification (OTP)                          │
│     ↓                                                       │
│  3. KYC Document Upload & Verification                      │
│     ↓                                                       │
│  4. JWT Token Generation (Access + Refresh)                │
│     ↓                                                       │
│  5. Role Assignment (Customer/Host/Admin)                   │
│     ↓                                                       │
│  6. Session Management & Token Rotation                     │
│                                                             │
│  Security Measures:                                         │
│  • Access tokens: 15-minute expiry                         │
│  • Refresh tokens: 7-day expiry with rotation              │
│  • Failed login attempt lockout                            │
│  • Device fingerprinting                                   │
│  • Suspicious activity detection                           │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## 5. Data Architecture

### 5.1 Data Flow Patterns
\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    DATA FLOW PATTERNS                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                COMMAND FLOW                         │   │
│  │                                                     │   │
│  │  User Action → API Gateway → Service → Database    │   │
│  │       ↓              ↓           ↓         ↓       │   │
│  │  Validation → Auth Check → Business → Transaction  │   │
│  │                            Logic                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                 QUERY FLOW                          │   │
│  │                                                     │   │
│  │  User Request → Cache Check → Database Query       │   │
│  │       ↓              ↓              ↓              │   │
│  │  Response ← Cache Store ← Data Transform           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                EVENT FLOW                           │   │
│  │                                                     │   │
│  │  Database Change → Event Queue → Background Jobs   │   │
│  │       ↓                ↓              ↓            │   │
│  │  Notifications ← Event Processing ← Job Execution  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### 5.2 Caching Strategy
- **Redis Layers**: Session cache, API response cache, real-time data
- **CDN**: Static assets, images, frequently accessed content
- **Database**: Query result caching, connection pooling
- **Application**: In-memory caching for configuration data

## 6. Deployment Architecture

### 6.1 Infrastructure Overview
\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                DEPLOYMENT ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                 PRODUCTION                          │   │
│  │                                                     │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │   Vercel    │  │     AWS     │  │   AWS RDS   │  │   │
│  │  │ (Frontend)  │  │ (Services)  │  │(PostgreSQL) │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  │                                                     │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │   Redis     │  │   AWS S3    │  │   AWS KMS   │  │   │
│  │  │ (ElastiCache│  │  (Storage)  │  │  (Secrets)  │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                 STAGING                             │   │
│  │  • Mirror of production with test data             │   │
│  │  • Automated testing pipeline                      │   │
│  │  • Performance testing environment                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │               DEVELOPMENT                           │   │
│  │  • Local development with Docker                   │   │
│  │  • Feature branch deployments                      │   │
│  │  • Integration testing                             │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## 7. Regulatory Compliance

### 7.1 Indian Regulatory Requirements
- **RTO Compliance**: Vehicle registration verification
- **Insurance Mandates**: Comprehensive coverage validation
- **Tax Compliance**: GST collection and remittance
- **Data Protection**: Personal data handling as per IT Act
- **Financial Regulations**: Payment gateway compliance

### 7.2 Security Standards
- **ISO 27001**: Information security management
- **PCI DSS**: Payment card industry compliance
- **SOC 2**: Service organization controls
- **GDPR**: Global data protection regulation

This architecture provides a solid foundation for building a scalable, secure, and compliant car rental platform. The next steps involve detailed database schema design and API specifications.
