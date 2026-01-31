-- Appointments Table Schema
-- Execute this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS appointments (
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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_appointments_hospital_name ON appointments(hospital_name);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON appointments(created_at DESC);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations  (adjust based on your auth needs)
CREATE POLICY "Allow all operations on appointments" ON appointments
  FOR ALL USING (true);
