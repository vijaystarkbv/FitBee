import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

if (supabaseUrl.includes('placeholder')) {
  console.warn('FitBee: Using placeholder Supabase credentials. Update .env.local with your Supabase Project credentials.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
