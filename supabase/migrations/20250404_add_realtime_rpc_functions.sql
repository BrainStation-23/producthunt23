
-- Function to set replica identity full for a table
CREATE OR REPLACE FUNCTION public.set_table_replica_identity_full(table_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE format('ALTER TABLE public.%I REPLICA IDENTITY FULL', table_name);
END;
$$;

-- Function to add a table to the supabase_realtime publication
CREATE OR REPLACE FUNCTION public.add_table_to_publication(table_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', table_name);
END;
$$;
