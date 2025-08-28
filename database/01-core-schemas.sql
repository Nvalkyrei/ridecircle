-- Ride Circle Database Schema
-- PostgreSQL 15+ with JSON support and advanced features

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Create schemas for multi-tenant architecture
CREATE SCHEMA IF NOT EXISTS shared;
CREATE SCHEMA IF NOT EXISTS mumbai;
CREATE SCHEMA IF NOT EXISTS bangalore;
CREATE SCHEMA IF NOT EXISTS delhi;

-- Set default schema for this session
SET search_path TO shared, public;

-- =====================================================
-- SHARED SCHEMA - Platform-wide configurations
-- =====================================================

-- Global platform configurations
CREATE TABLE shared.platform_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tenant/City configurations
CREATE TABLE shared.tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL, -- mumbai, bangalore, delhi
    name VARCHAR(100) NOT NULL,
    subdomain VARCHAR(50) UNIQUE NOT NULL,
    region VARCHAR(50) NOT NULL,
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    currency VARCHAR(3) DEFAULT 'INR',
    language VARCHAR(5) DEFAULT 'en-IN',
    config JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Global audit log for cross-tenant activities
CREATE TABLE shared.audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES shared.tenants(id),
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default tenants
INSERT INTO shared.tenants (code, name, subdomain, region) VALUES
('mumbai', 'Mumbai', 'mumbai', 'Western India'),
('bangalore', 'Bangalore', 'bangalore', 'Southern India'),
('delhi', 'Delhi NCR', 'delhi', 'Northern India');

-- =====================================================
-- TENANT-SPECIFIC SCHEMA TEMPLATE (using mumbai as example)
-- =====================================================

SET search_path TO mumbai, shared, public;

-- =====================================================
-- 1. AUTHENTICATION & USER MANAGEMENT
-- =====================================================

-- User roles enum
CREATE TYPE user_role AS ENUM ('customer', 'host', 'admin', 'super_admin');
CREATE TYPE user_status AS ENUM ('pending', 'active', 'suspended', 'banned');
CREATE TYPE kyc_status AS ENUM ('pending', 'in_review', 'approved', 'rejected', 'expired');

-- Core users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'customer',
    status user_status DEFAULT 'pending',
    email_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP WITH TIME ZONE,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User profiles with personal information
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10),
    profile_image_url TEXT,
    address JSONB, -- Flexible address structure
    emergency_contact JSONB,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- KYC documents and verification
CREATE TABLE kyc_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- aadhaar, pan, driving_license, passport
    document_number VARCHAR(100) NOT NULL,
    document_url TEXT NOT NULL,
    verification_status kyc_status DEFAULT 'pending',
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES users(id),
    rejection_reason TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- OTP verification for phone/email
CREATE TABLE otp_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    contact VARCHAR(255) NOT NULL, -- phone or email
    otp_code VARCHAR(6) NOT NULL,
    purpose VARCHAR(50) NOT NULL, -- registration, login, password_reset
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    attempts INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- JWT refresh tokens
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    device_info JSONB,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. VEHICLE LISTINGS & MANAGEMENT
-- =====================================================

CREATE TYPE vehicle_status AS ENUM ('draft', 'pending_approval', 'active', 'inactive', 'maintenance', 'retired');
CREATE TYPE fuel_type AS ENUM ('petrol', 'diesel', 'cng', 'electric', 'hybrid');
CREATE TYPE transmission_type AS ENUM ('manual', 'automatic', 'cvt');

-- Vehicle categories and makes
CREATE TABLE vehicle_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vehicle_makes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    logo_url TEXT,
    country VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vehicle_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    make_id UUID NOT NULL REFERENCES vehicle_makes(id),
    category_id UUID NOT NULL REFERENCES vehicle_categories(id),
    name VARCHAR(100) NOT NULL,
    year_from INTEGER,
    year_to INTEGER,
    specifications JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Main vehicles table
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    host_id UUID NOT NULL REFERENCES users(id),
    model_id UUID NOT NULL REFERENCES vehicle_models(id),
    registration_number VARCHAR(20) UNIQUE NOT NULL,
    year INTEGER NOT NULL,
    color VARCHAR(50),
    fuel_type fuel_type NOT NULL,
    transmission transmission_type NOT NULL,
    seating_capacity INTEGER NOT NULL,
    mileage DECIMAL(5,2),
    status vehicle_status DEFAULT 'draft',
    
    -- Location information
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    address JSONB NOT NULL,
    pickup_instructions TEXT,
    
    -- Pricing
    base_price_per_day DECIMAL(10,2) NOT NULL,
    base_price_per_hour DECIMAL(10,2),
    security_deposit DECIMAL(10,2) NOT NULL,
    
    -- Features and amenities
    features JSONB DEFAULT '[]', -- ["bluetooth", "gps", "ac", "music_system"]
    rules JSONB DEFAULT '{}', -- smoking, pets, etc.
    
    -- Insurance and documents
    insurance_policy_number VARCHAR(100),
    insurance_expires_at DATE,
    rc_document_url TEXT,
    insurance_document_url TEXT,
    
    -- Operational data
    total_trips INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_earnings DECIMAL(12,2) DEFAULT 0,
    
    -- Timestamps
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Vehicle images
CREATE TABLE vehicle_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_type VARCHAR(50) NOT NULL, -- exterior, interior, documents
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Vehicle availability calendar
CREATE TABLE vehicle_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    is_available BOOLEAN DEFAULT true,
    price_override DECIMAL(10,2), -- Override base price for specific dates
    reason VARCHAR(255), -- maintenance, booked, blocked
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(vehicle_id, date)
);

-- =====================================================
-- 3. BOOKING & RESERVATION SYSTEM
-- =====================================================

CREATE TYPE booking_status AS ENUM (
    'pending', 'confirmed', 'payment_pending', 'active', 
    'completed', 'cancelled', 'no_show', 'disputed'
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_number VARCHAR(20) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES users(id),
    host_id UUID NOT NULL REFERENCES users(id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    
    -- Booking details
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    pickup_location GEOGRAPHY(POINT, 4326),
    dropoff_location GEOGRAPHY(POINT, 4326),
    pickup_address JSONB,
    dropoff_address JSONB,
    
    -- Pricing breakdown
    base_amount DECIMAL(10,2) NOT NULL,
    taxes DECIMAL(10,2) DEFAULT 0,
    fees DECIMAL(10,2) DEFAULT 0,
    discounts DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    security_deposit DECIMAL(10,2) NOT NULL,
    
    -- Status and tracking
    status booking_status DEFAULT 'pending',
    payment_status VARCHAR(50) DEFAULT 'pending',
    
    -- Trip details
    actual_start_time TIMESTAMP WITH TIME ZONE,
    actual_end_time TIMESTAMP WITH TIME ZONE,
    start_odometer INTEGER,
    end_odometer INTEGER,
    fuel_level_start INTEGER, -- Percentage
    fuel_level_end INTEGER,
    
    -- Additional information
    special_requests TEXT,
    cancellation_reason TEXT,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancelled_by UUID REFERENCES users(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Booking timeline/status history
CREATE TABLE booking_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    status booking_status NOT NULL,
    changed_by UUID REFERENCES users(id),
    reason TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 4. PAYMENT & FINANCIAL MANAGEMENT
-- =====================================================

CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded', 'disputed');
CREATE TYPE payment_method AS ENUM ('card', 'upi', 'netbanking', 'wallet', 'cash');
CREATE TYPE transaction_type AS ENUM ('booking', 'security_deposit', 'refund', 'penalty', 'commission');

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    user_id UUID NOT NULL REFERENCES users(id),
    
    -- Payment details
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    payment_method payment_method NOT NULL,
    transaction_type transaction_type NOT NULL,
    
    -- Gateway information
    gateway_provider VARCHAR(50), -- razorpay, stripe
    gateway_transaction_id VARCHAR(255),
    gateway_response JSONB,
    
    -- Status tracking
    status payment_status DEFAULT 'pending',
    processed_at TIMESTAMP WITH TIME ZONE,
    failed_reason TEXT,
    
    -- Refund information
    refund_amount DECIMAL(10,2) DEFAULT 0,
    refunded_at TIMESTAMP WITH TIME ZONE,
    refund_reason TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Host earnings and payouts
CREATE TABLE host_earnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    host_id UUID NOT NULL REFERENCES users(id),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    
    -- Earnings breakdown
    gross_amount DECIMAL(10,2) NOT NULL,
    platform_commission DECIMAL(10,2) NOT NULL,
    taxes DECIMAL(10,2) DEFAULT 0,
    net_amount DECIMAL(10,2) NOT NULL,
    
    -- Payout information
    payout_status VARCHAR(50) DEFAULT 'pending',
    payout_date DATE,
    payout_reference VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 5. REVIEWS & RATINGS
-- =====================================================

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    reviewer_id UUID NOT NULL REFERENCES users(id),
    reviewee_id UUID NOT NULL REFERENCES users(id),
    vehicle_id UUID REFERENCES vehicles(id),
    
    -- Rating (1-5 scale)
    overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
    cleanliness_rating INTEGER CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
    communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
    vehicle_condition_rating INTEGER CHECK (vehicle_condition_rating >= 1 AND vehicle_condition_rating <= 5),
    
    -- Review content
    title VARCHAR(255),
    comment TEXT,
    
    -- Moderation
    is_published BOOLEAN DEFAULT true,
    moderated_at TIMESTAMP WITH TIME ZONE,
    moderated_by UUID REFERENCES users(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(booking_id, reviewer_id)
);

-- =====================================================
-- 6. NOTIFICATIONS & MESSAGING
-- =====================================================

CREATE TYPE notification_type AS ENUM (
    'booking_request', 'booking_confirmed', 'payment_received', 
    'trip_started', 'trip_completed', 'review_received', 
    'system_alert', 'promotional'
);

CREATE TYPE notification_channel AS ENUM ('in_app', 'email', 'sms', 'push');

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    type notification_type NOT NULL,
    channel notification_channel NOT NULL,
    
    -- Content
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}', -- Additional data for the notification
    
    -- Delivery tracking
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    delivery_status VARCHAR(50) DEFAULT 'pending',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- In-app messaging between users
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id),
    sender_id UUID NOT NULL REFERENCES users(id),
    recipient_id UUID NOT NULL REFERENCES users(id),
    
    message TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'text', -- text, image, location
    metadata JSONB DEFAULT '{}',
    
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 7. DAMAGE REPORTS & INCIDENTS
-- =====================================================

CREATE TYPE incident_type AS ENUM ('damage', 'accident', 'theft', 'breakdown', 'traffic_violation');
CREATE TYPE incident_status AS ENUM ('reported', 'investigating', 'resolved', 'disputed', 'closed');

CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    reported_by UUID NOT NULL REFERENCES users(id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    
    -- Incident details
    type incident_type NOT NULL,
    status incident_status DEFAULT 'reported',
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location GEOGRAPHY(POINT, 4326),
    occurred_at TIMESTAMP WITH TIME ZONE,
    
    -- Financial impact
    estimated_cost DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    insurance_claim_number VARCHAR(100),
    
    -- Resolution
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES users(id),
    resolution_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Incident evidence (photos, documents)
CREATE TABLE incident_evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- image, document, video
    description TEXT,
    uploaded_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User-related indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role_status ON users(role, status);
CREATE INDEX idx_kyc_documents_user_type ON kyc_documents(user_id, document_type);

-- Vehicle-related indexes
CREATE INDEX idx_vehicles_host_id ON vehicles(host_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_location ON vehicles USING GIST(location);
CREATE INDEX idx_vehicles_model_category ON vehicles(model_id);
CREATE INDEX idx_vehicle_availability_date ON vehicle_availability(vehicle_id, date);

-- Booking-related indexes
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_bookings_host_id ON bookings(host_id);
CREATE INDEX idx_bookings_vehicle_id ON bookings(vehicle_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX idx_bookings_number ON bookings(booking_number);

-- Payment-related indexes
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_gateway_transaction ON payments(gateway_transaction_id);

-- Notification indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_read ON notifications(user_id, is_read);

-- Full-text search indexes
CREATE INDEX idx_vehicles_search ON vehicles USING GIN(to_tsvector('english', 
    COALESCE((SELECT name FROM vehicle_models WHERE id = vehicles.model_id), '') || ' ' ||
    COALESCE((SELECT name FROM vehicle_makes WHERE id = (SELECT make_id FROM vehicle_models WHERE id = vehicles.model_id)), '') || ' ' ||
    COALESCE(color, '')
));

-- =====================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Update timestamps trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO shared.audit_log (
        tenant_id,
        user_id,
        action,
        resource_type,
        resource_id,
        old_values,
        new_values,
        created_at
    ) VALUES (
        (SELECT id FROM shared.tenants WHERE code = current_schema()),
        COALESCE(current_setting('app.current_user_id', true)::UUID, NULL),
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
        CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN row_to_json(NEW) ELSE NULL END,
        CURRENT_TIMESTAMP
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to sensitive tables
CREATE TRIGGER audit_users AFTER INSERT OR UPDATE OR DELETE ON users FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_bookings AFTER INSERT OR UPDATE OR DELETE ON bookings FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_payments AFTER INSERT OR UPDATE OR DELETE ON payments FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
