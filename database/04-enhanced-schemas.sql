-- =====================================================
-- ENHANCED RIDE CIRCLE DATABASE SCHEMA
-- Additional entities for comprehensive platform coverage
-- =====================================================

-- Continue with existing schema context
SET search_path TO mumbai, shared, public;

-- =====================================================
-- 8. VIDEO DECLARATIONS & BIOMETRIC E-SIGN
-- =====================================================

CREATE TYPE declaration_type AS ENUM ('pre_trip', 'post_trip', 'damage_report', 'kyc_verification');
CREATE TYPE esign_status AS ENUM ('pending', 'signed', 'failed', 'expired');

-- Video declarations for trip verification
CREATE TABLE video_declarations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id),
    user_id UUID NOT NULL REFERENCES users(id),
    declaration_type declaration_type NOT NULL,
    
    -- Video details
    video_url TEXT NOT NULL,
    video_duration INTEGER, -- seconds
    video_size BIGINT, -- bytes
    thumbnail_url TEXT,
    
    -- AI analysis results
    face_verification_score DECIMAL(5,4), -- 0.0000 to 1.0000
    voice_verification_score DECIMAL(5,4),
    content_analysis JSONB DEFAULT '{}', -- AI-detected objects, conditions
    
    -- Verification status
    is_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMP WITH TIME ZONE,
    verification_notes TEXT,
    
    -- Metadata
    device_info JSONB,
    location GEOGRAPHY(POINT, 4326),
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Biometric e-signature records
CREATE TABLE biometric_esign_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    document_type VARCHAR(100) NOT NULL, -- rental_agreement, damage_waiver, etc.
    document_hash VARCHAR(255) NOT NULL, -- SHA-256 hash of signed document
    
    -- Biometric data (encrypted)
    fingerprint_template TEXT, -- Encrypted biometric template
    face_template TEXT, -- Encrypted face biometric template
    signature_image_url TEXT, -- Digital signature image
    
    -- E-sign details
    status esign_status DEFAULT 'pending',
    signed_at TIMESTAMP WITH TIME ZONE,
    certificate_serial VARCHAR(255), -- Digital certificate serial number
    timestamp_authority_response JSONB, -- TSA response for legal validity
    
    -- Device and location info
    device_fingerprint TEXT,
    ip_address INET,
    location GEOGRAPHY(POINT, 4326),
    
    -- Legal compliance
    consent_given BOOLEAN DEFAULT false,
    consent_timestamp TIMESTAMP WITH TIME ZONE,
    retention_period INTERVAL DEFAULT '7 years', -- Legal retention requirement
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 9. FRANCHISE MANAGEMENT
-- =====================================================

CREATE TYPE franchise_status AS ENUM ('pending', 'active', 'suspended', 'terminated');

CREATE TABLE franchises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    franchise_code VARCHAR(20) UNIQUE NOT NULL,
    franchise_name VARCHAR(200) NOT NULL,
    owner_id UUID NOT NULL REFERENCES users(id),
    
    -- Business details
    business_registration_number VARCHAR(100),
    gst_number VARCHAR(15),
    pan_number VARCHAR(10),
    
    -- Territory and operations
    territory_bounds GEOGRAPHY(POLYGON, 4326), -- Geographic boundary
    cities_covered TEXT[], -- Array of city names
    max_vehicles INTEGER DEFAULT 50,
    commission_rate DECIMAL(5,4) DEFAULT 0.1500, -- 15% default
    
    -- Financial details
    security_deposit DECIMAL(12,2) NOT NULL,
    monthly_fee DECIMAL(10,2) DEFAULT 0,
    revenue_share_percentage DECIMAL(5,4),
    
    -- Status and performance
    status franchise_status DEFAULT 'pending',
    total_vehicles INTEGER DEFAULT 0,
    total_bookings INTEGER DEFAULT 0,
    total_revenue DECIMAL(15,2) DEFAULT 0,
    
    -- Contract details
    contract_start_date DATE,
    contract_end_date DATE,
    contract_document_url TEXT,
    
    -- Contact information
    contact_person JSONB, -- Name, phone, email
    business_address JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Franchise-host relationships
CREATE TABLE franchise_hosts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    franchise_id UUID NOT NULL REFERENCES franchises(id),
    host_id UUID NOT NULL REFERENCES users(id),
    
    -- Relationship details
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    commission_override DECIMAL(5,4), -- Override franchise commission for specific host
    is_active BOOLEAN DEFAULT true,
    
    -- Performance tracking
    total_vehicles INTEGER DEFAULT 0,
    total_earnings DECIMAL(12,2) DEFAULT 0,
    
    UNIQUE(franchise_id, host_id)
);

-- =====================================================
-- 10. RC VERIFICATION & DOCUMENT MANAGEMENT
-- =====================================================

CREATE TYPE verification_status AS ENUM ('pending', 'in_progress', 'verified', 'failed', 'expired');

CREATE TABLE rc_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    rc_number VARCHAR(20) NOT NULL,
    
    -- RC Document details
    rc_document_url TEXT NOT NULL,
    owner_name VARCHAR(200),
    registration_date DATE,
    engine_number VARCHAR(50),
    chassis_number VARCHAR(50),
    fuel_type VARCHAR(20),
    vehicle_class VARCHAR(50),
    
    -- Verification details
    verification_status verification_status DEFAULT 'pending',
    verification_method VARCHAR(50), -- api, manual, ocr
    verification_provider VARCHAR(50), -- govt_api, third_party
    verification_response JSONB,
    
    -- Verification results
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES users(id),
    verification_score DECIMAL(5,4), -- Confidence score
    discrepancies JSONB DEFAULT '[]', -- Array of found discrepancies
    
    -- Expiry and renewal
    expires_at DATE,
    renewal_reminder_sent BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 11. PRICING RULES & DEPOSIT POLICIES
-- =====================================================

CREATE TYPE pricing_rule_type AS ENUM ('base', 'seasonal', 'demand', 'promotional', 'penalty');
CREATE TYPE rule_condition_type AS ENUM ('date_range', 'day_of_week', 'time_of_day', 'booking_duration', 'demand_level');

CREATE TABLE pricing_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    rule_type pricing_rule_type NOT NULL,
    
    -- Applicability
    vehicle_category_ids UUID[], -- Array of category IDs
    franchise_ids UUID[], -- Array of franchise IDs
    city_codes TEXT[], -- Array of city codes
    
    -- Rule conditions
    conditions JSONB NOT NULL, -- Flexible condition structure
    -- Example: {"date_range": {"start": "2024-12-20", "end": "2024-01-05"}, "day_of_week": [6,7]}
    
    -- Pricing adjustments
    adjustment_type VARCHAR(20) NOT NULL, -- percentage, fixed_amount, multiplier
    adjustment_value DECIMAL(10,4) NOT NULL,
    min_price DECIMAL(10,2),
    max_price DECIMAL(10,2),
    
    -- Rule priority and status
    priority INTEGER DEFAULT 0, -- Higher number = higher priority
    is_active BOOLEAN DEFAULT true,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE deposit_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- Policy conditions
    vehicle_category_ids UUID[], -- Applicable categories
    min_vehicle_value DECIMAL(12,2), -- Minimum vehicle value
    max_vehicle_value DECIMAL(12,2), -- Maximum vehicle value
    customer_kyc_level VARCHAR(20), -- basic, verified, premium
    
    -- Deposit calculation
    deposit_type VARCHAR(20) NOT NULL, -- fixed, percentage, tiered
    deposit_amount DECIMAL(10,2), -- Fixed amount
    deposit_percentage DECIMAL(5,4), -- Percentage of booking value
    min_deposit DECIMAL(10,2),
    max_deposit DECIMAL(10,2),
    
    -- Refund policy
    refund_conditions JSONB DEFAULT '{}',
    refund_timeline_days INTEGER DEFAULT 7,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    effective_from DATE DEFAULT CURRENT_DATE,
    effective_until DATE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 12. CHECKLISTS & DAMAGE REPORTS
-- =====================================================

CREATE TYPE checklist_type AS ENUM ('pre_trip', 'post_trip', 'maintenance', 'inspection');
CREATE TYPE checklist_item_type AS ENUM ('boolean', 'rating', 'text', 'image', 'number');

CREATE TABLE checklist_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    type checklist_type NOT NULL,
    description TEXT,
    
    -- Template structure
    items JSONB NOT NULL, -- Array of checklist items with structure
    -- Example: [{"id": "exterior_damage", "label": "Check for exterior damage", "type": "boolean", "required": true}]
    
    -- Applicability
    vehicle_category_ids UUID[],
    is_mandatory BOOLEAN DEFAULT true,
    
    -- Version control
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE checklist_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    template_id UUID NOT NULL REFERENCES checklist_templates(id),
    completed_by UUID NOT NULL REFERENCES users(id),
    
    -- Response data
    responses JSONB NOT NULL, -- Responses to checklist items
    -- Example: {"exterior_damage": false, "fuel_level": 80, "cleanliness_rating": 4}
    
    -- Completion details
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    location GEOGRAPHY(POINT, 4326),
    device_info JSONB,
    
    -- Issues identified
    issues_found BOOLEAN DEFAULT false,
    issue_summary TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE damage_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    reported_by UUID NOT NULL REFERENCES users(id),
    
    -- Damage details
    damage_type VARCHAR(100) NOT NULL, -- scratch, dent, interior_damage, mechanical
    severity VARCHAR(20) NOT NULL, -- minor, moderate, major, total
    description TEXT NOT NULL,
    location_on_vehicle VARCHAR(100), -- front_bumper, driver_door, etc.
    
    -- Evidence
    images JSONB DEFAULT '[]', -- Array of image URLs
    estimated_repair_cost DECIMAL(10,2),
    repair_quote_document_url TEXT,
    
    -- Assessment
    assessed_by UUID REFERENCES users(id),
    assessment_notes TEXT,
    final_repair_cost DECIMAL(10,2),
    
    -- Resolution
    is_resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_method VARCHAR(50), -- insurance, direct_payment, waived
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 13. GARAGE & SUPPORT TICKETS
-- =====================================================

CREATE TYPE ticket_type AS ENUM ('technical', 'billing', 'vehicle_issue', 'booking_issue', 'general');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'waiting_customer', 'resolved', 'closed');

CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number VARCHAR(20) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    booking_id UUID REFERENCES bookings(id),
    vehicle_id UUID REFERENCES vehicles(id),
    
    -- Ticket details
    type ticket_type NOT NULL,
    priority ticket_priority DEFAULT 'medium',
    status ticket_status DEFAULT 'open',
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    
    -- Assignment
    assigned_to UUID REFERENCES users(id),
    assigned_at TIMESTAMP WITH TIME ZONE,
    
    -- Resolution
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    customer_satisfaction_rating INTEGER CHECK (customer_satisfaction_rating >= 1 AND customer_satisfaction_rating <= 5),
    
    -- Metadata
    tags TEXT[], -- Array of tags for categorization
    attachments JSONB DEFAULT '[]', -- Array of attachment URLs
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ticket_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    
    message TEXT NOT NULL,
    attachments JSONB DEFAULT '[]',
    is_internal BOOLEAN DEFAULT false, -- Internal notes vs customer-visible
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Garage/Service provider management
CREATE TABLE service_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL, -- garage, towing, insurance, cleaning
    
    -- Contact details
    contact_person VARCHAR(100),
    phone VARCHAR(15),
    email VARCHAR(255),
    address JSONB,
    location GEOGRAPHY(POINT, 4326),
    
    -- Service details
    services_offered TEXT[], -- Array of services
    service_radius_km INTEGER DEFAULT 10,
    hourly_rate DECIMAL(8,2),
    
    -- Performance metrics
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_jobs INTEGER DEFAULT 0,
    response_time_minutes INTEGER, -- Average response time
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 14. CRM & BLACKLIST MANAGEMENT
-- =====================================================

CREATE TYPE contact_type AS ENUM ('lead', 'customer', 'host', 'partner', 'vendor');
CREATE TYPE contact_status AS ENUM ('new', 'contacted', 'qualified', 'converted', 'inactive');

CREATE TABLE crm_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id), -- Link to actual user if converted
    
    -- Contact information
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(15),
    company VARCHAR(200),
    
    -- CRM details
    type contact_type NOT NULL,
    status contact_status DEFAULT 'new',
    source VARCHAR(100), -- website, referral, advertisement
    
    -- Lead scoring and qualification
    lead_score INTEGER DEFAULT 0,
    qualification_notes TEXT,
    
    -- Interaction tracking
    last_contacted TIMESTAMP WITH TIME ZONE,
    next_followup TIMESTAMP WITH TIME ZONE,
    total_interactions INTEGER DEFAULT 0,
    
    -- Assignment
    assigned_to UUID REFERENCES users(id), -- Sales rep or account manager
    
    -- Custom fields
    custom_fields JSONB DEFAULT '{}',
    tags TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE crm_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contact_id UUID NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id), -- Staff member who made contact
    
    -- Interaction details
    type VARCHAR(50) NOT NULL, -- call, email, meeting, note
    subject VARCHAR(255),
    notes TEXT,
    outcome VARCHAR(100), -- interested, not_interested, callback_requested
    
    -- Scheduling
    scheduled_at TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Blacklist management
CREATE TYPE blacklist_reason AS ENUM ('fraud', 'damage', 'no_show', 'policy_violation', 'payment_default');
CREATE TYPE blacklist_scope AS ENUM ('platform', 'city', 'franchise');

CREATE TABLE blacklist_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    
    -- Identification details (for non-users)
    phone VARCHAR(15),
    email VARCHAR(255),
    id_document_number VARCHAR(100), -- Aadhaar, PAN, etc.
    
    -- Blacklist details
    reason blacklist_reason NOT NULL,
    scope blacklist_scope DEFAULT 'platform',
    description TEXT NOT NULL,
    
    -- Evidence
    evidence_urls JSONB DEFAULT '[]', -- Supporting documents/images
    related_booking_id UUID REFERENCES bookings(id),
    
    -- Management
    added_by UUID NOT NULL REFERENCES users(id),
    reviewed_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    
    -- Appeal process
    appeal_submitted BOOLEAN DEFAULT false,
    appeal_notes TEXT,
    appeal_decision VARCHAR(50), -- approved, rejected, pending
    appeal_decided_by UUID REFERENCES users(id),
    appeal_decided_at TIMESTAMP WITH TIME ZONE,
    
    -- Expiry
    expires_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 15. CMS & CONTENT MANAGEMENT
-- =====================================================

CREATE TYPE page_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE content_type AS ENUM ('page', 'blog_post', 'faq', 'policy', 'announcement');

CREATE TABLE cms_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    content_type content_type DEFAULT 'page',
    
    -- Content
    content TEXT, -- HTML content
    excerpt TEXT, -- Short description
    meta_title VARCHAR(255),
    meta_description TEXT,
    featured_image_url TEXT,
    
    -- SEO and structure
    parent_id UUID REFERENCES cms_pages(id), -- For hierarchical pages
    sort_order INTEGER DEFAULT 0,
    template VARCHAR(100), -- Template to use for rendering
    
    -- Publishing
    status page_status DEFAULT 'draft',
    published_at TIMESTAMP WITH TIME ZONE,
    scheduled_publish_at TIMESTAMP WITH TIME ZONE,
    
    -- Authoring
    author_id UUID NOT NULL REFERENCES users(id),
    last_modified_by UUID REFERENCES users(id),
    
    -- Localization
    language VARCHAR(5) DEFAULT 'en-IN',
    translated_from UUID REFERENCES cms_pages(id),
    
    -- Analytics
    view_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 16. WALLET & TRANSACTION MANAGEMENT
-- =====================================================

CREATE TYPE wallet_transaction_type AS ENUM (
    'credit', 'debit', 'refund', 'bonus', 'penalty', 'commission', 'withdrawal'
);

CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Balance information
    balance DECIMAL(12,2) DEFAULT 0.00 CHECK (balance >= 0),
    locked_balance DECIMAL(12,2) DEFAULT 0.00 CHECK (locked_balance >= 0),
    lifetime_earned DECIMAL(15,2) DEFAULT 0.00,
    lifetime_spent DECIMAL(15,2) DEFAULT 0.00,
    
    -- Wallet settings
    auto_reload_enabled BOOLEAN DEFAULT false,
    auto_reload_threshold DECIMAL(10,2) DEFAULT 100.00,
    auto_reload_amount DECIMAL(10,2) DEFAULT 500.00,
    
    -- Security
    pin_hash VARCHAR(255), -- Encrypted wallet PIN
    is_locked BOOLEAN DEFAULT false,
    locked_until TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES wallets(id),
    user_id UUID NOT NULL REFERENCES users(id),
    
    -- Transaction details
    type wallet_transaction_type NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    balance_before DECIMAL(12,2) NOT NULL,
    balance_after DECIMAL(12,2) NOT NULL,
    
    -- Reference information
    reference_type VARCHAR(50), -- booking, refund, bonus, etc.
    reference_id UUID, -- ID of related entity
    description TEXT,
    
    -- Payment gateway details (for credits)
    gateway_transaction_id VARCHAR(255),
    gateway_response JSONB,
    
    -- Status
    status VARCHAR(50) DEFAULT 'completed', -- pending, completed, failed, reversed
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ADDITIONAL INDEXES FOR NEW ENTITIES
-- =====================================================

-- Video declarations indexes
CREATE INDEX idx_video_declarations_booking ON video_declarations(booking_id);
CREATE INDEX idx_video_declarations_user_type ON video_declarations(user_id, declaration_type);
CREATE INDEX idx_video_declarations_verification ON video_declarations(is_verified);

-- Biometric e-sign indexes
CREATE INDEX idx_biometric_esign_user ON biometric_esign_records(user_id);
CREATE INDEX idx_biometric_esign_status ON biometric_esign_records(status);
CREATE INDEX idx_biometric_esign_document ON biometric_esign_records(document_type, document_hash);

-- Franchise indexes
CREATE INDEX idx_franchises_owner ON franchises(owner_id);
CREATE INDEX idx_franchises_status ON franchises(status);
CREATE INDEX idx_franchise_hosts_franchise ON franchise_hosts(franchise_id);
CREATE INDEX idx_franchise_hosts_host ON franchise_hosts(host_id);

-- RC verification indexes
CREATE INDEX idx_rc_verifications_vehicle ON rc_verifications(vehicle_id);
CREATE INDEX idx_rc_verifications_status ON rc_verifications(verification_status);
CREATE INDEX idx_rc_verifications_rc_number ON rc_verifications(rc_number);

-- Pricing and deposit indexes
CREATE INDEX idx_pricing_rules_active ON pricing_rules(is_active, valid_from, valid_until);
CREATE INDEX idx_pricing_rules_type ON pricing_rules(rule_type);
CREATE INDEX idx_deposit_policies_active ON deposit_policies(is_active, effective_from, effective_until);

-- Checklist indexes
CREATE INDEX idx_checklist_responses_booking ON checklist_responses(booking_id);
CREATE INDEX idx_checklist_responses_template ON checklist_responses(template_id);
CREATE INDEX idx_damage_reports_booking ON damage_reports(booking_id);
CREATE INDEX idx_damage_reports_vehicle ON damage_reports(vehicle_id);

-- Support ticket indexes
CREATE INDEX idx_support_tickets_user ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_assigned ON support_tickets(assigned_to);
CREATE INDEX idx_support_tickets_number ON support_tickets(ticket_number);

-- CRM indexes
CREATE INDEX idx_crm_contacts_type_status ON crm_contacts(type, status);
CREATE INDEX idx_crm_contacts_assigned ON crm_contacts(assigned_to);
CREATE INDEX idx_crm_contacts_email ON crm_contacts(email);
CREATE INDEX idx_crm_contacts_phone ON crm_contacts(phone);

-- Blacklist indexes
CREATE INDEX idx_blacklist_entries_user ON blacklist_entries(user_id);
CREATE INDEX idx_blacklist_entries_phone ON blacklist_entries(phone);
CREATE INDEX idx_blacklist_entries_email ON blacklist_entries(email);
CREATE INDEX idx_blacklist_entries_active ON blacklist_entries(is_active);

-- CMS indexes
CREATE INDEX idx_cms_pages_slug ON cms_pages(slug);
CREATE INDEX idx_cms_pages_status ON cms_pages(status);
CREATE INDEX idx_cms_pages_type ON cms_pages(content_type);
CREATE INDEX idx_cms_pages_published ON cms_pages(published_at);

-- Wallet indexes
CREATE INDEX idx_wallets_user ON wallets(user_id);
CREATE INDEX idx_wallet_transactions_wallet ON wallet_transactions(wallet_id);
CREATE INDEX idx_wallet_transactions_type ON wallet_transactions(type);
CREATE INDEX idx_wallet_transactions_reference ON wallet_transactions(reference_type, reference_id);

-- =====================================================
-- ADDITIONAL TRIGGERS FOR NEW ENTITIES
-- =====================================================

-- Apply updated_at triggers to new tables
CREATE TRIGGER update_franchises_updated_at BEFORE UPDATE ON franchises FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rc_verifications_updated_at BEFORE UPDATE ON rc_verifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pricing_rules_updated_at BEFORE UPDATE ON pricing_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deposit_policies_updated_at BEFORE UPDATE ON deposit_policies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_damage_reports_updated_at BEFORE UPDATE ON damage_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crm_contacts_updated_at BEFORE UPDATE ON crm_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blacklist_entries_updated_at BEFORE UPDATE ON blacklist_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cms_pages_updated_at BEFORE UPDATE ON cms_pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply audit triggers to sensitive new tables
CREATE TRIGGER audit_franchises AFTER INSERT OR UPDATE OR DELETE ON franchises FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_biometric_esign_records AFTER INSERT OR UPDATE OR DELETE ON biometric_esign_records FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_blacklist_entries AFTER INSERT OR UPDATE OR DELETE ON blacklist_entries FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_wallet_transactions AFTER INSERT OR UPDATE OR DELETE ON wallet_transactions FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Wallet balance update trigger
CREATE OR REPLACE FUNCTION update_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
    -- Update wallet balance based on transaction
    UPDATE wallets 
    SET 
        balance = NEW.balance_after,
        lifetime_earned = CASE 
            WHEN NEW.type IN ('credit', 'refund', 'bonus') THEN lifetime_earned + NEW.amount
            ELSE lifetime_earned
        END,
        lifetime_spent = CASE 
            WHEN NEW.type IN ('debit', 'penalty', 'withdrawal') THEN lifetime_spent + NEW.amount
            ELSE lifetime_spent
        END,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.wallet_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_wallet_balance_trigger 
    AFTER INSERT ON wallet_transactions 
    FOR EACH ROW EXECUTE FUNCTION update_wallet_balance();
