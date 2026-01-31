-- Simple Appointments Table Creation
-- Copy this entire content and paste it into Supabase SQL Editor, then click RUN

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_phone VARCHAR(20) NOT NULL,
  user_name VARCHAR(255),
  blood_group VARCHAR(10),
  medical_conditions TEXT,
  issue_type VARCHAR(100) NOT NULL,
  description TEXT,
  hospital_name VARCHAR(255) NOT NULL,
  hospital_lat DOUBLE PRECISION NOT NULL,
  hospital_lng DOUBLE PRECISION NOT NULL,
  user_lat DOUBLE PRECISION NOT NULL,
  user_lng DOUBLE PRECISION NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  appointment_time TIMESTAMP,
  assigned_doctor VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_appointments_hospital_name ON appointments(hospital_name);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_created_at ON appointments(created_at DESC);

-- Enable RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Allow all operations (you can customize this later for better security)
CREATE POLICY "Enable all operations for appointments" 
ON appointments FOR ALL 
USING (true) 
WITH CHECK (true);
