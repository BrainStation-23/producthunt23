// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://actvkmglkippzhzwzuzo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdHZrbWdsa2lwcHpoend6dXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5NTY2ODEsImV4cCI6MjA1NzUzMjY4MX0.d5zCUPllQRZCTOBCl3eTg-82WDzmNXC8G2N4lTiOxxM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);