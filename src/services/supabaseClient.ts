import { createClient } from '@supabase/supabase-js';

const env = (typeof import.meta !== 'undefined' && import.meta.env) || (typeof process !== 'undefined' && process.env) || {};
const supabaseUrl = env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

if (supabaseUrl.includes('placeholder')) {
  console.warn('FitBee: Using placeholder Supabase credentials. Update .env.local with your Supabase Project credentials.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
