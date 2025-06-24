import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://zdqcyemiwglybvpfczya.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkcWN5ZW1pd2dseWJ2cGZjenlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3ODQzMjksImV4cCI6MjA1MDM2MDMyOX0.eRUuO0H3nuJwHMljwxAhlaZpOFRcc2LN4puAfbZvvrI';

export const supabase = createClient(supabaseUrl, supabaseKey);