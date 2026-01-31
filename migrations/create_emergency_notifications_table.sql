-- Create emergency_notifications table to track which hospitals were notified about each emergency
-- This enables the hospital dashboard to show only emergencies relevant to that hospital

CREATE TABLE IF NOT EXISTS emergency_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    emergency_id UUID NOT NULL REFERENCES sos_emergencies(id) ON DELETE CASCADE,
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    distance_km DECIMAL(10, 2),
    notified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded_at TIMESTAMP WITH TIME ZONE,
    response_type VARCHAR(50), -- 'approved', 'rejected', 'timeout'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Create unique constraint to prevent duplicate notifications
    UNIQUE(emergency_id, hospital_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_emergency_notifications_emergency_id ON emergency_notifications(emergency_id);
CREATE INDEX IF NOT EXISTS idx_emergency_notifications_hospital_id ON emergency_notifications(hospital_id);
CREATE INDEX IF NOT EXISTS idx_emergency_notifications_notified_at ON emergency_notifications(notified_at DESC);

-- Add comment
COMMENT ON TABLE emergency_notifications IS 'Tracks which hospitals were notified about each emergency for the notification system';
