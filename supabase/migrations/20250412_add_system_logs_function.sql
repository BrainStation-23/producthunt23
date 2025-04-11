
-- Create a function to retrieve recent error logs
CREATE OR REPLACE FUNCTION public.get_recent_error_logs(limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
  id UUID,
  service TEXT,
  message TEXT,
  type log_type,
  details JSONB,
  severity TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  created_by UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sl.id,
    sl.service,
    sl.message,
    sl.type,
    sl.details,
    sl.severity,
    sl.created_at,
    sl.created_by
  FROM 
    system_logs sl
  WHERE 
    sl.type = 'error'
  ORDER BY 
    sl.created_at DESC
  LIMIT limit_count;
END;
$$;

-- Update the Allow admins policy to also include the function
CREATE POLICY IF NOT EXISTS "Allow admins to execute log functions" ON system_logs
  FOR ALL
  USING (is_admin(auth.uid()));
