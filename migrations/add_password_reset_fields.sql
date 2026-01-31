-- Add password reset fields to hospitals table
-- These fields will store the reset token and its expiration time

ALTER TABLE hospitals 
ADD COLUMN IF NOT EXISTS reset_token TEXT,
ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMPTZ;

-- Optional: Add an index for faster lookups by reset token
CREATE INDEX IF NOT EXISTS idx_hospitals_reset_token ON hospitals(reset_token) WHERE reset_token IS NOT NULL;
