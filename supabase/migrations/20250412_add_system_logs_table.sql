
-- Create an enum for log types
CREATE TYPE log_type AS ENUM ('info', 'warning', 'error');

-- Create the system_logs table
CREATE TABLE IF NOT EXISTS system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service TEXT NOT NULL,
  type log_type NOT NULL DEFAULT 'info',
  message TEXT NOT NULL,
  details JSONB,
  severity TEXT DEFAULT 'low',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Add indexes for faster querying
CREATE INDEX system_logs_type_idx ON system_logs(type);
CREATE INDEX system_logs_service_idx ON system_logs(service);
CREATE INDEX system_logs_created_at_idx ON system_logs(created_at);

-- Add RLS policies
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- Admin users can see all logs
CREATE POLICY "Allow admins to view logs" ON system_logs
  FOR SELECT
  USING (is_admin(auth.uid()));

-- Admin users can insert logs
CREATE POLICY "Allow admins to insert logs" ON system_logs
  FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

-- Add some default logs for testing
INSERT INTO system_logs (service, type, message, severity)
VALUES 
  ('Database', 'info', 'Database connection established', 'low'),
  ('Authentication', 'info', 'Auth service started', 'low'),
  ('Edge Functions', 'warning', 'Slow response time detected', 'medium'),
  ('API Gateway', 'error', 'Connection timeout after 3 retries', 'high'),
  ('Storage', 'info', 'All buckets available', 'low');

-- Create a function for adding system logs
CREATE OR REPLACE FUNCTION public.add_system_log(
  service TEXT,
  log_type log_type,
  message TEXT,
  details JSONB DEFAULT NULL,
  severity TEXT DEFAULT 'low'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO system_logs (service, type, message, details, severity, created_by)
  VALUES (service, log_type, message, details, severity, auth.uid())
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;
