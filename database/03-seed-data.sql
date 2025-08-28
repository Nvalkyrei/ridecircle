-- Seed data for Ride Circle platform
-- This provides initial data for development and testing

SET search_path TO mumbai, shared, public;

-- =====================================================
-- VEHICLE CATEGORIES
-- =====================================================

INSERT INTO vehicle_categories (id, name, description, icon_url, sort_order) VALUES
(uuid_generate_v4(), 'Hatchback', 'Compact cars perfect for city driving', '/icons/hatchback.svg', 1),
(uuid_generate_v4(), 'Sedan', 'Comfortable mid-size cars for longer trips', '/icons/sedan.svg', 2),
(uuid_generate_v4(), 'SUV', 'Spacious vehicles for families and groups', '/icons/suv.svg', 3),
(uuid_generate_v4(), 'Luxury', 'Premium vehicles for special occasions', '/icons/luxury.svg', 4),
(uuid_generate_v4(), 'Electric', 'Eco-friendly electric vehicles', '/icons/electric.svg', 5);

-- =====================================================
-- VEHICLE MAKES
-- =====================================================

INSERT INTO vehicle_makes (id, name, logo_url, country) VALUES
(uuid_generate_v4(), 'Maruti Suzuki', '/logos/maruti.png', 'India'),
(uuid_generate_v4(), 'Hyundai', '/logos/hyundai.png', 'South Korea'),
(uuid_generate_v4(), 'Honda', '/logos/honda.png', 'Japan'),
(uuid_generate_v4(), 'Toyota', '/logos/toyota.png', 'Japan'),
(uuid_generate_v4(), 'Tata', '/logos/tata.png', 'India'),
(uuid_generate_v4(), 'Mahindra', '/logos/mahindra.png', 'India'),
(uuid_generate_v4(), 'BMW', '/logos/bmw.png', 'Germany'),
(uuid_generate_v4(), 'Mercedes-Benz', '/logos/mercedes.png', 'Germany'),
(uuid_generate_v4(), 'Audi', '/logos/audi.png', 'Germany');

-- =====================================================
-- VEHICLE MODELS
-- =====================================================

-- Get category and make IDs for reference
WITH categories AS (
  SELECT id as cat_id, name as cat_name FROM vehicle_categories
), makes AS (
  SELECT id as make_id, name as make_name FROM vehicle_makes
)

INSERT INTO vehicle_models (id, make_id, category_id, name, year_from, year_to, specifications)
SELECT 
  uuid_generate_v4(),
  m.make_id,
  c.cat_id,
  model_data.name,
  model_data.year_from,
  model_data.year_to,
  model_data.specs::jsonb
FROM makes m
CROSS JOIN categories c
CROSS JOIN (
  VALUES
    -- Maruti Suzuki models
    ('Maruti Suzuki', 'Hatchback', 'Swift', 2010, NULL, '{"engine": "1.2L", "mileage": "23 kmpl", "safety_rating": 4}'),
    ('Maruti Suzuki', 'Hatchback', 'Baleno', 2015, NULL, '{"engine": "1.2L", "mileage": "21 kmpl", "safety_rating": 4}'),
    ('Maruti Suzuki', 'Sedan', 'Dzire', 2012, NULL, '{"engine": "1.2L", "mileage": "24 kmpl", "safety_rating": 4}'),
    ('Maruti Suzuki', 'SUV', 'Vitara Brezza', 2016, NULL, '{"engine": "1.5L", "mileage": "18 kmpl", "safety_rating": 4}'),
    
    -- Hyundai models
    ('Hyundai', 'Hatchback', 'i20', 2014, NULL, '{"engine": "1.2L", "mileage": "20 kmpl", "safety_rating": 4}'),
    ('Hyundai', 'Sedan', 'Verna', 2017, NULL, '{"engine": "1.6L", "mileage": "17 kmpl", "safety_rating": 4}'),
    ('Hyundai', 'SUV', 'Creta', 2015, NULL, '{"engine": "1.6L", "mileage": "16 kmpl", "safety_rating": 5}'),
    
    -- Honda models
    ('Honda', 'Sedan', 'City', 2014, NULL, '{"engine": "1.5L", "mileage": "17 kmpl", "safety_rating": 4}'),
    ('Honda', 'Sedan', 'Amaze', 2018, NULL, '{"engine": "1.2L", "mileage": "19 kmpl", "safety_rating": 4}'),
    
    -- Toyota models
    ('Toyota', 'Sedan', 'Camry', 2019, NULL, '{"engine": "2.5L", "mileage": "13 kmpl", "safety_rating": 5}'),
    ('Toyota', 'SUV', 'Fortuner', 2016, NULL, '{"engine": "2.8L", "mileage": "10 kmpl", "safety_rating": 5}'),
    
    -- BMW models
    ('BMW', 'Luxury', '3 Series', 2019, NULL, '{"engine": "2.0L Turbo", "mileage": "14 kmpl", "safety_rating": 5}'),
    ('BMW', 'Luxury', 'X3', 2018, NULL, '{"engine": "2.0L Turbo", "mileage": "12 kmpl", "safety_rating": 5}')
) AS model_data(make_name, cat_name, name, year_from, year_to, specs)
WHERE m.make_name = model_data.make_name 
  AND c.cat_name = model_data.cat_name;

-- =====================================================
-- SAMPLE USERS (for development/testing)
-- =====================================================

-- Create sample admin user
INSERT INTO users (id, email, phone, password_hash, role, status, email_verified, phone_verified) VALUES
(uuid_generate_v4(), 'admin@ridecircle.in', '+919876543210', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJWuzF4EG', 'admin', 'active', true, true);

-- Create sample host users
INSERT INTO users (id, email, phone, password_hash, role, status, email_verified, phone_verified) VALUES
(uuid_generate_v4(), 'host1@example.com', '+919876543211', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJWuzF4EG', 'host', 'active', true, true),
(uuid_generate_v4(), 'host2@example.com', '+919876543212', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJWuzF4EG', 'host', 'active', true, true);

-- Create sample customer users
INSERT INTO users (id, email, phone, password_hash, role, status, email_verified, phone_verified) VALUES
(uuid_generate_v4(), 'customer1@example.com', '+919876543213', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJWuzF4EG', 'customer', 'active', true, true),
(uuid_generate_v4(), 'customer2@example.com', '+919876543214', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJWuzF4EG', 'customer', 'active', true, true);

-- Create user profiles for the sample users
INSERT INTO user_profiles (id, user_id, first_name, last_name, address, preferences)
SELECT 
  uuid_generate_v4(),
  u.id,
  profile_data.first_name,
  profile_data.last_name,
  profile_data.address::jsonb,
  profile_data.preferences::jsonb
FROM users u
CROSS JOIN (
  VALUES
    ('admin@ridecircle.in', 'Admin', 'User', '{"street": "123 Admin Street", "city": "Mumbai", "state": "Maharashtra", "pincode": "400001", "country": "India"}', '{"notifications": {"email": true, "sms": true}}'),
    ('host1@example.com', 'Rajesh', 'Sharma', '{"street": "456 Host Lane", "city": "Mumbai", "state": "Maharashtra", "pincode": "400050", "country": "India"}', '{"notifications": {"email": true, "sms": false}}'),
    ('host2@example.com', 'Priya', 'Patel', '{"street": "789 Car Street", "city": "Mumbai", "state": "Maharashtra", "pincode": "400070", "country": "India"}', '{"notifications": {"email": true, "sms": true}}'),
    ('customer1@example.com', 'Amit', 'Kumar', '{"street": "321 Customer Road", "city": "Mumbai", "state": "Maharashtra", "pincode": "400020", "country": "India"}', '{"notifications": {"email": true, "sms": true}}'),
    ('customer2@example.com', 'Sneha', 'Singh', '{"street": "654 Renter Avenue", "city": "Mumbai", "state": "Maharashtra", "pincode": "400030", "country": "India"}', '{"notifications": {"email": false, "sms": true}}')
) AS profile_data(email, first_name, last_name, address, preferences)
WHERE u.email = profile_data.email;

-- =====================================================
-- SAMPLE VEHICLES
-- =====================================================

-- Create sample vehicles for hosts
WITH host_users AS (
  SELECT id, email FROM users WHERE role = 'host'
), vehicle_models_with_details AS (
  SELECT 
    vm.id as model_id,
    vm.name as model_name,
    vmk.name as make_name,
    vc.name as category_name
  FROM vehicle_models vm
  JOIN vehicle_makes vmk ON vm.make_id = vmk.id
  JOIN vehicle_categories vc ON vm.category_id = vc.id
)

INSERT INTO vehicles (
  id, host_id, model_id, registration_number, year, color, 
  fuel_type, transmission, seating_capacity, mileage, status,
  location, address, base_price_per_day, base_price_per_hour, 
  security_deposit, features, rules
)
SELECT 
  uuid_generate_v4(),
  hu.id,
  vmd.model_id,
  vehicle_data.reg_number,
  vehicle_data.year,
  vehicle_data.color,
  vehicle_data.fuel_type::fuel_type,
  vehicle_data.transmission::transmission_type,
  vehicle_data.seating_capacity,
  vehicle_data.mileage,
  'active'::vehicle_status,
  ST_GeogFromText('POINT(' || vehicle_data.lng || ' ' || vehicle_data.lat || ')'),
  vehicle_data.address::jsonb,
  vehicle_data.price_per_day,
  vehicle_data.price_per_hour,
  vehicle_data.security_deposit,
  vehicle_data.features::jsonb,
  vehicle_data.rules::jsonb
FROM host_users hu
CROSS JOIN vehicle_models_with_details vmd
CROSS JOIN (
  VALUES
    -- Host 1 vehicles
    ('host1@example.com', 'Swift', 'MH01AB1234', 2020, 'Red', 'petrol', 'manual', 5, 23.0, 72.8777, 19.0760, '{"street": "Bandra West", "area": "Bandra", "city": "Mumbai", "state": "Maharashtra", "pincode": "400050"}', 2500, 350, 5000, '["bluetooth", "ac", "music_system"]', '{"smoking": false, "pets": false, "mileageLimit": 300}'),
    ('host1@example.com', 'City', 'MH01CD5678', 2019, 'Silver', 'petrol', 'automatic', 5, 17.0, 72.8777, 19.0760, '{"street": "Bandra West", "area": "Bandra", "city": "Mumbai", "state": "Maharashtra", "pincode": "400050"}', 3200, 450, 7000, '["bluetooth", "ac", "gps", "music_system"]', '{"smoking": false, "pets": true, "mileageLimit": 250}'),
    
    -- Host 2 vehicles  
    ('host2@example.com', 'Creta', 'MH01EF9012', 2021, 'White', 'diesel', 'automatic', 5, 16.0, 72.8697, 19.1136, '{"street": "Andheri East", "area": "Andheri", "city": "Mumbai", "state": "Maharashtra", "pincode": "400069"}', 4500, 600, 10000, '["bluetooth", "ac", "gps", "music_system", "sunroof"]', '{"smoking": false, "pets": false, "mileageLimit": 200}'),
    ('host2@example.com', 'i20', 'MH01GH3456', 2020, 'Blue', 'petrol', 'manual', 5, 20.0, 72.8697, 19.1136, '{"street": "Andheri East", "area": "Andheri", "city": "Mumbai", "state": "Maharashtra", "pincode": "400069"}', 2800, 380, 6000, '["bluetooth", "ac", "music_system"]', '{"smoking": false, "pets": true, "mileageLimit": 350}')
) AS vehicle_data(host_email, model_name, reg_number, year, color, fuel_type, transmission, seating_capacity, mileage, lng, lat, address, price_per_day, price_per_hour, security_deposit, features, rules)
WHERE hu.email = vehicle_data.host_email 
  AND vmd.model_name = vehicle_data.model_name;

-- =====================================================
-- SAMPLE VEHICLE IMAGES
-- =====================================================

-- Add sample images for vehicles
INSERT INTO vehicle_images (id, vehicle_id, image_url, image_type, sort_order, is_primary)
SELECT 
  uuid_generate_v4(),
  v.id,
  '/vehicles/' || v.registration_number || '_' || image_data.image_type || '_' || image_data.sort_order || '.jpg',
  image_data.image_type::VARCHAR(50),
  image_data.sort_order,
  image_data.is_primary
FROM vehicles v
CROSS JOIN (
  VALUES
    ('exterior', 1, true),
    ('exterior', 2, false),
    ('interior', 1, false),
    ('interior', 2, false)
) AS image_data(image_type, sort_order, is_primary);

-- =====================================================
-- SAMPLE AVAILABILITY DATA
-- =====================================================

-- Create availability for next 90 days for all vehicles
INSERT INTO vehicle_availability (id, vehicle_id, date, is_available)
SELECT 
  uuid_generate_v4(),
  v.id,
  CURRENT_DATE + INTERVAL '1 day' * generate_series(0, 89),
  CASE 
    WHEN random() > 0.1 THEN true  -- 90% availability
    ELSE false 
  END
FROM vehicles v;

-- =====================================================
-- PLATFORM CONFIGURATION
-- =====================================================

INSERT INTO shared.platform_config (key, value, description) VALUES
('commission_rate', '{"default": 0.15, "premium_hosts": 0.12}', 'Platform commission rates'),
('payment_gateways', '{"primary": "razorpay", "backup": "stripe", "test_mode": true}', 'Payment gateway configuration'),
('kyc_requirements', '{"mandatory": ["aadhaar", "driving_license"], "optional": ["pan"]}', 'KYC document requirements'),
('booking_rules', '{"min_booking_hours": 4, "max_advance_days": 90, "cancellation_window_hours": 24}', 'Booking business rules'),
('notification_settings', '{"sms_provider": "twilio", "email_provider": "sendgrid", "push_provider": "firebase"}', 'Notification service configuration'),
('security_settings', '{"jwt_expiry_minutes": 15, "refresh_token_days": 7, "max_login_attempts": 5}', 'Security configuration'),
('feature_flags', '{"dynamic_pricing": true, "instant_booking": false, "chat_messaging": true}', 'Feature toggles');

-- =====================================================
-- INDEXES AND CONSTRAINTS VERIFICATION
-- =====================================================

-- Verify all foreign key constraints are working
DO $$
DECLARE
    constraint_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO constraint_count
    FROM information_schema.table_constraints 
    WHERE constraint_type = 'FOREIGN KEY' 
    AND table_schema = current_schema();
    
    RAISE NOTICE 'Total foreign key constraints created: %', constraint_count;
END $$;

-- Verify all indexes are created
DO $$
DECLARE
    index_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO index_count
    FROM pg_indexes 
    WHERE schemaname = current_schema();
    
    RAISE NOTICE 'Total indexes created: %', index_count;
END $$;

COMMIT;
