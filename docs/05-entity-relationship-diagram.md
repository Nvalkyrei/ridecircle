# Ride Circle Platform - Entity Relationship Diagram

## Core Entity Relationships

### 1. User Management & Authentication
\`\`\`
Users (1) ←→ (1) UserProfiles
Users (1) ←→ (*) KYCDocuments
Users (1) ←→ (*) OTPVerifications
Users (1) ←→ (*) RefreshTokens
Users (1) ←→ (1) Wallets
Users (1) ←→ (*) BiometricESignRecords
\`\`\`

### 2. Vehicle & Listing Management
\`\`\`
Users (Host) (1) ←→ (*) Vehicles
VehicleMakes (1) ←→ (*) VehicleModels
VehicleModels (1) ←→ (*) Vehicles
VehicleCategories (1) ←→ (*) VehicleModels
Vehicles (1) ←→ (*) VehicleImages
Vehicles (1) ←→ (*) VehicleAvailability
Vehicles (1) ←→ (1) RCVerifications
\`\`\`

### 3. Franchise Management
\`\`\`
Users (Owner) (1) ←→ (*) Franchises
Franchises (1) ←→ (*) FranchiseHosts
FranchiseHosts (*) ←→ (1) Users (Host)
\`\`\`

### 4. Booking & Trip Management
\`\`\`
Users (Customer) (1) ←→ (*) Bookings
Users (Host) (1) ←→ (*) Bookings
Vehicles (1) ←→ (*) Bookings
Bookings (1) ←→ (*) BookingStatusHistory
Bookings (1) ←→ (*) VideoDeclarations
Bookings (1) ←→ (*) ChecklistResponses
ChecklistTemplates (1) ←→ (*) ChecklistResponses
\`\`\`

### 5. Payment & Financial
\`\`\`
Bookings (1) ←→ (*) Payments
Users (1) ←→ (*) Payments
Bookings (1) ←→ (*) HostEarnings
Users (Host) (1) ←→ (*) HostEarnings
Wallets (1) ←→ (*) WalletTransactions
\`\`\`

### 6. Reviews & Communication
\`\`\`
Bookings (1) ←→ (*) Reviews
Users (Reviewer) (1) ←→ (*) Reviews
Users (Reviewee) (1) ←→ (*) Reviews
Users (1) ←→ (*) Notifications
Users (Sender) (1) ←→ (*) Messages
Users (Recipient) (1) ←→ (*) Messages
Bookings (1) ←→ (*) Messages
\`\`\`

### 7. Incidents & Support
\`\`\`
Bookings (1) ←→ (*) Incidents
Vehicles (1) ←→ (*) Incidents
Incidents (1) ←→ (*) IncidentEvidence
Bookings (1) ←→ (*) DamageReports
Vehicles (1) ←→ (*) DamageReports
Users (1) ←→ (*) SupportTickets
SupportTickets (1) ←→ (*) TicketMessages
\`\`\`

### 8. CRM & Content Management
\`\`\`
Users (1) ←→ (0..1) CRMContacts
CRMContacts (1) ←→ (*) CRMInteractions
Users (1) ←→ (*) BlacklistEntries
Users (Author) (1) ←→ (*) CMSPages
CMSPages (1) ←→ (*) CMSPages (Parent-Child)
\`\`\`

### 9. Configuration & Policies
\`\`\`
VehicleCategories (*) ←→ (*) PricingRules
Franchises (*) ←→ (*) PricingRules
VehicleCategories (*) ←→ (*) DepositPolicies
ServiceProviders (1) ←→ (*) SupportTickets (Assignment)
\`\`\`

### 10. Multi-Tenant Architecture
\`\`\`
Tenants (1) ←→ (*) AuditLog
Tenants (1) ←→ (*) [All City-Specific Tables]
\`\`\`

## Key Relationships Summary

### Primary Entities:
- **Users**: Central entity connecting to all user-related data
- **Vehicles**: Core asset entity with rich metadata and verification
- **Bookings**: Central transaction entity connecting customers, hosts, and vehicles
- **Payments**: Financial transaction tracking with multiple gateways
- **Franchises**: Business entity for territorial management

### Junction Tables:
- **FranchiseHosts**: Many-to-many between franchises and hosts
- **VehicleImages**: One-to-many for vehicle photo management
- **BookingStatusHistory**: Audit trail for booking state changes
- **IncidentEvidence**: Supporting documents for incidents

### Audit & Compliance:
- **AuditLog**: Cross-tenant activity tracking
- **BiometricESignRecords**: Legal compliance for digital signatures
- **KYCDocuments**: Identity verification and compliance
- **BlacklistEntries**: Risk management and fraud prevention

### Configuration Entities:
- **PricingRules**: Dynamic pricing based on conditions
- **DepositPolicies**: Security deposit calculation rules
- **ChecklistTemplates**: Standardized inspection procedures
- **CMSPages**: Content management for platform pages

This ERD represents a comprehensive car rental platform with strong emphasis on:
- **Regulatory Compliance**: KYC, biometric signatures, audit trails
- **Multi-tenancy**: City-based data isolation
- **Financial Integrity**: Detailed payment and wallet management
- **Operational Excellence**: Checklists, damage tracking, support systems
- **Business Scalability**: Franchise management and dynamic pricing
