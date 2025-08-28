-- =====================================================
-- COMPREHENSIVE SEED DATA FOR RIDE CIRCLE PLATFORM
-- =====================================================

SET search_path TO mumbai, shared, public;

-- =====================================================
-- 1. VEHICLE CATEGORIES & MAKES
-- =====================================================

INSERT INTO vehicle_categories (id, name, description, icon_url, sort_order) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Hatchback', 'Compact cars perfect for city driving', '/icons/hatchback.svg', 1),
('550e8400-e29b-41d4-a716-446655440002', 'Sedan', 'Comfortable mid-size cars for longer trips', '/icons/sedan.svg', 2),
('550e8400-e29b-41d4-a716-446655440003', 'SUV', 'Spacious vehicles for families and groups', '/icons/suv.svg', 3),
('550e8400-e29b-41d4-a716-446655440004', 'Luxury', 'Premium vehicles for special occasions', '/icons/luxury.svg', 4),
('550e8400-e29b-41d4-a716-446655440005', 'Electric', 'Eco-friendly electric vehicles', '/icons/electric.svg', 5);

INSERT INTO vehicle_makes (id, name, logo_url, country) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Maruti Suzuki', '/logos/maruti.png', 'India'),
('660e8400-e29b-41d4-a716-446655440002', 'Hyundai', '/logos/hyundai.png', 'South Korea'),
('660e8400-e29b-41d4-a716-446655440003', 'Tata', '/logos/tata.png', 'India'),
('660e8400-e29b-41d4-a716-446655440004', 'Honda', '/logos/honda.png', 'Japan'),
('660e8400-e29b-41d4-a716-446655440005', 'Toyota', '/logos/toyota.png', 'Japan'),
('660e8400-e29b-41d4-a716-446655440006', 'Mahindra', '/logos/mahindra.png', 'India'),
('660e8400-e29b-41d4-a716-446655440007', 'BMW', '/logos/bmw.png', 'Germany'),
('660e8400-e29b-41d4-a716-446655440008', 'Mercedes-Benz', '/logos/mercedes.png', 'Germany');

INSERT INTO vehicle_models (id, make_id, category_id, name, year_from, year_to, specifications) VALUES
-- Maruti Suzuki Models
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Swift', 2018, 2024, '{"engine": "1.2L", "power": "83 HP", "mileage": "23 kmpl"}'),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'Dzire', 2017, 2024, '{"engine": "1.2L", "power": "90 HP", "mileage": "24 kmpl"}'),
('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'Ertiga', 2018, 2024, '{"engine": "1.5L", "power": "105 HP", "mileage": "20 kmpl"}'),

-- Hyundai Models
('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'i20', 2020, 2024, '{"engine": "1.2L", "power": "83 HP", "mileage": "20 kmpl"}'),
('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Verna', 2020, 2024, '{"engine": "1.5L", "power": "115 HP", "mileage": "18 kmpl"}'),
('770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'Creta', 2020, 2024, '{"engine": "1.5L", "power": "115 HP", "mileage": "17 kmpl"}'),

-- Tata Models
('770e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Tiago', 2019, 2024, '{"engine": "1.2L", "power": "86 HP", "mileage": "24 kmpl"}'),
('770e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Harrier', 2019, 2024, '{"engine": "2.0L", "power": "170 HP", "mileage": "16 kmpl"}'),

-- Luxury Models
('770e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440004', '3 Series', 2019, 2024, '{"engine": "2.0L Turbo", "power": "258 HP", "mileage": "15 kmpl"}'),
('770e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440004', 'C-Class', 2020, 2024, '{"engine": "2.0L Turbo", "power": "245 HP", "mileage": "14 kmpl"}');

-- =====================================================
-- 2. SAMPLE USERS (HOSTS, CUSTOMERS, ADMINS)
-- =====================================================

-- Admin Users
INSERT INTO users (id, email, phone, password_hash, role, status, email_verified, phone_verified) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'admin@ridecircle.com', '+919876543210', '$2b$12$LQv3c1yqBwLFaAK4cDYhCOmqvjqxQzKfGqJzYzQzQzQzQzQzQzQzQ', 'admin', 'active', true, true),
('880e8400-e29b-41d4-a716-446655440002', 'superadmin@ridecircle.com', '+919876543211', '$2b$12$LQv3c1yqBwLFaAK4cDYhCOmqvjqxQzKfGqJzYzQzQzQzQzQzQzQzQ', 'super_admin', 'active', true, true);

-- Host Users
INSERT INTO users (id, email, phone, password_hash, role, status, email_verified, phone_verified) VALUES
('880e8400-e29b-41d4-a716-446655440003', 'rajesh.host@gmail.com', '+919876543212', '$2b$12$LQv3c1yqBwLFaAK4cDYhCOmqvjqxQzKfGqJzYzQzQzQzQzQzQzQzQ', 'host', 'active', true, true),
('880e8400-e29b-41d4-a716-446655440004', 'priya.cars@gmail.com', '+919876543213', '$2b$12$LQv3c1yqBwLFaAK4cDYhCOmqvjqxQzKfGqJzYzQzQzQzQzQzQzQzQ', 'host', 'active', true, true),
('880e8400-e29b-41d4-a716-446655440005', 'amit.fleet@gmail.com', '+919876543214', '$2b$12$LQv3c1yqBwLFaAK4cDYhCOmqvjqxQzKfGqJzYzQzQzQzQzQzQzQzQ', 'host', 'active', true, true);

-- Customer Users
INSERT INTO users (id, email, phone, password_hash, role, status, email_verified, phone_verified) VALUES
('880e8400-e29b-41d4-a716-446655440006', 'customer1@gmail.com', '+919876543215', '$2b$12$LQv3c1yqBwLFaAK4cDYhCOmqvjqxQzKfGqJzYzQzQzQzQzQzQzQzQ', 'customer', 'active', true, true),
('880e8400-e29b-41d4-a716-446655440007', 'customer2@gmail.com', '+919876543216', '$2b$12$LQv3c1yqBwLFaAK4cDYhCOmqvjqxQzKfGqJzYzQzQzQzQzQzQzQzQ', 'customer', 'active', true, true),
('880e8400-e29b-41d4-a716-446655440008', 'customer3@gmail.com', '+919876543217', '$2b$12$LQv3c1yqBwLFaAK4cDYhCOmqvjqxQzKfGqJzYzQzQzQzQzQzQzQzQ', 'customer', 'active', true, true);

-- User Profiles
INSERT INTO user_profiles (id, user_id, first_name, last_name, date_of_birth, gender, address) VALUES
('990e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'Admin', 'User', '1985-01-01', 'male', '{"street": "Admin Office", "city": "Mumbai", "state": "Maharashtra", "pincode": "400001"}'),
('990e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440003', 'Rajesh', 'Kumar', '1980-05-15', 'male', '{"street": "123 MG Road", "city": "Mumbai", "state": "Maharashtra", "pincode": "400001"}'),
('990e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440004', 'Priya', 'Sharma', '1985-08-22', 'female', '{"street": "456 Linking Road", "city": "Mumbai", "state": "Maharashtra", "pincode": "400050"}'),
('990e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440005', 'Amit', 'Patel', '1982-12-10', 'male', '{"street": "789 SV Road", "city": "Mumbai", "state": "Maharashtra", "pincode": "400058"}'),
('990e8400-e29b-41d4-a716-446655440006', '880e8400-e29b-41d4-a716-446655440006', 'Sneha', 'Reddy', '1990-03-18', 'female', '{"street": "321 Hill Road", "city": "Mumbai", "state": "Maharashtra", "pincode": "400052"}'),
('990e8400-e29b-41d4-a716-446655440007', '880e8400-e29b-41d4-a716-446655440007', 'Vikram', 'Singh', '1988-07-25', 'male', '{"street": "654 Carter Road", "city": "Mumbai", "state": "Maharashtra", "pincode": "400050"}'),
('990e8400-e29b-41d4-a716-446655440008', '880e8400-e29b-41d4-a716-446655440008', 'Anita', 'Joshi', '1992-11-30', 'female', '{"street": "987 Turner Road", "city": "Mumbai", "state": "Maharashtra", "pincode": "400050"}');

-- =====================================================
-- 3. SAMPLE VEHICLES
-- =====================================================

INSERT INTO vehicles (id, host_id, model_id, registration_number, year, color, fuel_type, transmission, seating_capacity, mileage, status, location, address, base_price_per_day, base_price_per_hour, security_deposit, features) VALUES
-- Rajesh's vehicles
('aa0e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', 'MH01AB1234', 2022, 'Red', 'petrol', 'manual', 5, 23.5, 'active', ST_GeogFromText('POINT(72.8777 19.0760)'), '{"street": "Bandra West", "city": "Mumbai", "state": "Maharashtra", "pincode": "400050"}', 1200.00, 150.00, 5000.00, '["bluetooth", "ac", "music_system"]'),
('aa0e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440002', 'MH01AB5678', 2021, 'White', 'petrol', 'automatic', 5, 24.2, 'active', ST_GeogFromText('POINT(72.8777 19.0760)'), '{"street": "Bandra West", "city": "Mumbai", "state": "Maharashtra", "pincode": "400050"}', 1500.00, 180.00, 6000.00, '["bluetooth", "ac", "music_system", "gps"]'),

-- Priya's vehicles
('aa0e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440004', 'MH01CD1234', 2023, 'Blue', 'petrol', 'automatic', 5, 20.1, 'active', ST_GeogFromText('POINT(72.8261 19.0176)'), '{"street": "Colaba", "city": "Mumbai", "state": "Maharashtra", "pincode": "400001"}', 1800.00, 220.00, 7000.00, '["bluetooth", "ac", "music_system", "gps", "sunroof"]'),
('aa0e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440006', 'MH01CD5678', 2022, 'Silver', 'diesel', 'automatic', 7, 17.5, 'active', ST_GeogFromText('POINT(72.8261 19.0176)'), '{"street": "Colaba", "city": "Mumbai", "state": "Maharashtra", "pincode": "400001"}', 2500.00, 300.00, 10000.00, '["bluetooth", "ac", "music_system", "gps", "sunroof", "leather_seats"]'),

-- Amit's vehicles (including luxury)
('aa0e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440008', 'MH01EF1234', 2021, 'Black', 'diesel', 'automatic', 7, 16.2, 'active', ST_GeogFromText('POINT(72.8342 19.1136)'), '{"street": "Juhu", "city": "Mumbai", "state": "Maharashtra", "pincode": "400049"}', 3000.00, 400.00, 15000.00, '["bluetooth", "ac", "music_system", "gps", "sunroof", "leather_seats", "premium_audio"]'),
('aa0e8400-e29b-41d4-a716-446655440006', '880e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440009', 'MH01EF5678', 2023, 'White', 'petrol', 'automatic', 5, 15.8, 'active', ST_GeogFromText('POINT(72.8342 19.1136)'), '{"street": "Juhu", "city": "Mumbai", "state": "Maharashtra", "pincode": "400049"}', 8000.00, 1000.00, 50000.00, '["bluetooth", "ac", "music_system", "gps", "sunroof", "leather_seats", "premium_audio", "navigation", "parking_sensors"]');

-- =====================================================
-- 4. SAMPLE BOOKINGS
-- =====================================================

INSERT INTO bookings (id, booking_number, customer_id, host_id, vehicle_id, start_date, end_date, pickup_location, pickup_address, base_amount, taxes, total_amount, security_deposit, status, payment_status) VALUES
('bb0e8400-e29b-41d4-a716-446655440001', 'RC240001', '880e8400-e29b-41d4-a716-446655440006', '880e8400-e29b-41d4-a716-446655440003', 'aa0e8400-e29b-41d4-a716-446655440001', '2024-01-15 10:00:00+05:30', '2024-01-17 18:00:00+05:30', ST_GeogFromText('POINT(72.8777 19.0760)'), '{"street": "Bandra West", "city": "Mumbai", "state": "Maharashtra", "pincode": "400050"}', 2400.00, 432.00, 2832.00, 5000.00, 'completed', 'completed'),
('bb0e8400-e29b-41d4-a716-446655440002', 'RC240002', '880e8400-e29b-41d4-a716-446655440007', '880e8400-e29b-41d4-a716-446655440004', 'aa0e8400-e29b-41d4-a716-446655440003', '2024-01-20 09:00:00+05:30', '2024-01-22 20:00:00+05:30', ST_GeogFromText('POINT(72.8261 19.0176)'), '{"street": "Colaba", "city": "Mumbai", "state": "Maharashtra", "pincode": "400001"}', 3600.00, 648.00, 4248.00, 7000.00, 'completed', 'completed'),
('bb0e8400-e29b-41d4-a716-446655440003', 'RC240003', '880e8400-e29b-41d4-a716-446655440008', '880e8400-e29b-41d4-a716-446655440005', 'aa0e8400-e29b-41d4-a716-446655440006', '2024-02-01 14:00:00+05:30', '2024-02-01 22:00:00+05:30', ST_GeogFromText('POINT(72.8342 19.1136)'), '{"street": "Juhu", "city": "Mumbai", "state": "Maharashtra", "pincode": "400049"}', 8000.00, 1440.00, 9440.00, 50000.00, 'active', 'completed');

-- =====================================================
-- 5. SAMPLE PAYMENTS
-- =====================================================

INSERT INTO payments (id, booking_id, user_id, amount, payment_method, transaction_type, gateway_provider, gateway_transaction_id, status, processed_at) VALUES
('cc0e8400-e29b-41d4-a716-446655440001', 'bb0e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440006', 2832.00, 'upi', 'booking', 'razorpay', 'pay_123456789', 'completed', '2024-01-15 09:30:00+05:30'),
('cc0e8400-e29b-41d4-a716-446655440002', 'bb0e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440006', 5000.00, 'upi', 'security_deposit', 'razorpay', 'pay_123456790', 'completed', '2024-01-15 09:30:00+05:30'),
('cc0e8400-e29b-41d4-a716-446655440003', 'bb0e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440007', 4248.00, 'card', 'booking', 'razorpay', 'pay_123456791', 'completed', '2024-01-20 08:45:00+05:30'),
('cc0e8400-e29b-41d4-a716-446655440004', 'bb0e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440007', 7000.00, 'card', 'security_deposit', 'razorpay', 'pay_123456792', 'completed', '2024-01-20 08:45:00+05:30');

-- =====================================================
-- 6. SAMPLE REVIEWS
-- =====================================================

INSERT INTO reviews (id, booking_id, reviewer_id, reviewee_id, vehicle_id, overall_rating, cleanliness_rating, communication_rating, vehicle_condition_rating, title, comment) VALUES
('dd0e8400-e29b-41d4-a716-446655440001', 'bb0e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440006', '880e8400-e29b-41d4-a716-446655440003', 'aa0e8400-e29b-41d4-a716-446655440001', 5, 5, 5, 5, 'Excellent Experience!', 'Great car, very clean and well-maintained. Rajesh was very helpful and responsive. Highly recommended!'),
('dd0e8400-e29b-41d4-a716-446655440002', 'bb0e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440007', '880e8400-e29b-41d4-a716-446655440004', 'aa0e8400-e29b-41d4-a716-446655440003', 4, 4, 5, 4, 'Good Service', 'Nice car with good features. Priya was very professional. Minor cleanliness issues but overall good experience.');

-- =====================================================
-- 7. SAMPLE FRANCHISES
-- =====================================================

INSERT INTO franchises (id, franchise_code, franchise_name, owner_id, business_registration_number, territory_bounds, cities_covered, commission_rate, security_deposit, status, contract_start_date, contract_end_date, contact_person, business_address) VALUES
('ee0e8400-e29b-41d4-a716-446655440001', 'MUM001', 'Mumbai Central Franchise', '880e8400-e29b-41d4-a716-446655440003', 'REG123456789', ST_GeogFromText('POLYGON((72.7500 18.9000, 72.9500 18.9000, 72.9500 19.2000, 72.7500 19.2000, 72.7500 18.9000))'), ARRAY['Mumbai'], 0.1500, 100000.00, 'active', '2024-01-01', '2026-12-31', '{"name": "Rajesh Kumar", "phone": "+919876543212", "email": "rajesh.host@gmail.com"}', '{"street": "123 MG Road", "city": "Mumbai", "state": "Maharashtra", "pincode": "400001"}');

INSERT INTO franchise_hosts (id, franchise_id, host_id, total_vehicles, total_earnings) VALUES
('ff0e8400-e29b-41d4-a716-446655440001', 'ee0e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440003', 2, 15000.00),
('ff0e8400-e29b-41d4-a716-446655440002', 'ee0e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440004', 2, 25000.00);

-- =====================================================
-- 8. SAMPLE PRICING RULES
-- =====================================================

INSERT INTO pricing_rules (id, name, description, rule_type, conditions, adjustment_type, adjustment_value, priority, valid_from, valid_until) VALUES
('110e8400-e29b-41d4-a716-446655440001', 'Weekend Premium', 'Higher rates for weekend bookings', 'demand', '{"day_of_week": [6, 7]}', 'percentage', 1.2000, 10, '2024-01-01 00:00:00+05:30', '2024-12-31 23:59:59+05:30'),
('110e8400-e29b-41d4-a716-446655440002', 'Festival Season', 'Premium pricing during festival season', 'seasonal', '{"date_range": {"start": "2024-10-15", "end": "2024-11-15"}}', 'percentage', 1.5000, 20, '2024-10-15 00:00:00+05:30', '2024-11-15 23:59:59+05:30'),
('110e8400-e29b-41d4-a716-446655440003', 'Long Duration Discount', 'Discount for bookings longer than 7 days', 'promotional', '{"booking_duration_days": {"min": 7}}', 'percentage', 0.9000, 5, '2024-01-01 00:00:00+05:30', '2024-12-31 23:59:59+05:30');

-- =====================================================
-- 9. SAMPLE DEPOSIT POLICIES
-- =====================================================

INSERT INTO deposit_policies (id, name, description, deposit_type, deposit_percentage, min_deposit, max_deposit, refund_timeline_days) VALUES
('120e8400-e29b-41d4-a716-446655440001', 'Standard Hatchback Policy', 'Standard deposit for hatchback vehicles', 'percentage', 0.3000, 3000.00, 10000.00, 7),
('120e8400-e29b-41d4-a716-446655440002', 'Luxury Vehicle Policy', 'Higher deposit for luxury vehicles', 'percentage', 0.5000, 25000.00, 100000.00, 14),
('120e8400-e29b-41d4-a716-446655440003', 'New Customer Policy', 'Higher deposit for new customers', 'percentage', 0.4000, 5000.00, 50000.00, 10);

-- =====================================================
-- 10. SAMPLE CHECKLIST TEMPLATES
-- =====================================================

INSERT INTO checklist_templates (id, name, type, description, items) VALUES
('130e8400-e29b-41d4-a716-446655440001', 'Pre-Trip Vehicle Inspection', 'pre_trip', 'Standard checklist for vehicle handover', '[
  {"id": "exterior_damage", "label": "Check for exterior damage", "type": "boolean", "required": true},
  {"id": "interior_cleanliness", "label": "Interior cleanliness", "type": "rating", "required": true, "scale": 5},
  {"id": "fuel_level", "label": "Fuel level (%)", "type": "number", "required": true, "min": 0, "max": 100},
  {"id": "odometer_reading", "label": "Odometer reading", "type": "number", "required": true},
  {"id": "documents_present", "label": "All documents present", "type": "boolean", "required": true},
  {"id": "spare_tire", "label": "Spare tire condition", "type": "rating", "required": true, "scale": 5},
  {"id": "additional_notes", "label": "Additional notes", "type": "text", "required": false}
]'),
('130e8400-e29b-41d4-a716-446655440002', 'Post-Trip Vehicle Return', 'post_trip', 'Standard checklist for vehicle return', '[
  {"id": "exterior_damage", "label": "Check for new exterior damage", "type": "boolean", "required": true},
  {"id": "interior_condition", "label": "Interior condition", "type": "rating", "required": true, "scale": 5},
  {"id": "fuel_level", "label": "Fuel level (%)", "type": "number", "required": true, "min": 0, "max": 100},
  {"id": "odometer_reading", "label": "Final odometer reading", "type": "number", "required": true},
  {"id": "cleanliness", "label": "Overall cleanliness", "type": "rating", "required": true, "scale": 5},
  {"id": "issues_found", "label": "Any issues found", "type": "text", "required": false}
]');

-- =====================================================
-- 11. SAMPLE WALLETS
-- =====================================================

INSERT INTO wallets (id, user_id, balance, lifetime_earned, lifetime_spent) VALUES
('140e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440003', 15000.00, 25000.00, 10000.00),
('140e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440004', 22000.00, 35000.00, 13000.00),
('140e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440005', 45000.00, 75000.00, 30000.00),
('140e8400-e29b-41d4-a716-446655440006', '880e8400-e29b-41d4-a716-446655440006', 500.00, 2000.00, 1500.00),
('140e8400-e29b-41d4-a716-446655440007', '880e8400-e29b-41d4-a716-446655440007', 1200.00, 5000.00, 3800.00),
('140e8400-e29b-41d4-a716-446655440008', '880e8400-e29b-41d4-a716-446655440008', 800.00, 3000.00, 2200.00);

-- =====================================================
-- 12. SAMPLE CMS PAGES
-- =====================================================

INSERT INTO cms_pages (id, slug, title, content_type, content, meta_title, meta_description, status, author_id, published_at) VALUES
('150e8400-e29b-41d4-a716-446655440001', 'about-us', 'About Ride Circle', 'page', '<h1>About Ride Circle</h1><p>Ride Circle is India''s leading peer-to-peer car rental platform...</p>', 'About Ride Circle - Car Rental Platform', 'Learn about Ride Circle, India''s trusted car rental platform connecting car owners with renters.', 'published', '880e8400-e29b-41d4-a716-446655440001', '2024-01-01 00:00:00+05:30'),
('150e8400-e29b-41d4-a716-446655440002', 'privacy-policy', 'Privacy Policy', 'policy', '<h1>Privacy Policy</h1><p>This privacy policy explains how we collect and use your data...</p>', 'Privacy Policy - Ride Circle', 'Read our privacy policy to understand how we protect your personal information.', 'published', '880e8400-e29b-41d4-a716-446655440001', '2024-01-01 00:00:00+05:30'),
('150e8400-e29b-41d4-a716-446655440003', 'terms-of-service', 'Terms of Service', 'policy', '<h1>Terms of Service</h1><p>By using our platform, you agree to these terms...</p>', 'Terms of Service - Ride Circle', 'Read our terms of service for using the Ride Circle platform.', 'published', '880e8400-e29b-41d4-a716-446655440001', '2024-01-01 00:00:00+05:30');

-- Update vehicle statistics based on sample data
UPDATE vehicles SET 
    total_trips = 1,
    average_rating = 5.0,
    total_earnings = 2400.00
WHERE id = 'aa0e8400-e29b-41d4-a716-446655440001';

UPDATE vehicles SET 
    total_trips = 1,
    average_rating = 4.0,
    total_earnings = 3600.00
WHERE id = 'aa0e8400-e29b-41d4-a716-446655440003';

-- Generate booking numbers sequence
CREATE SEQUENCE IF NOT EXISTS booking_number_seq START 1000;
CREATE SEQUENCE IF NOT EXISTS ticket_number_seq START 1000;
