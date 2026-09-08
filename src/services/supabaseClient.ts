import { createClient } from '@supabase/supabase-js';

const env = (typeof import.meta !== 'undefined' && import.meta.env) || (typeof process !== 'undefined' && process.env) || {};
const supabaseUrl = env.VITE_SUPABASE_URL || 'https://rbbaqzpfimffcgixyukr.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_L9KrnrVHAkBfHOPospS55A_cQOTr8II';


export const supabase = createClient(supabaseUrl, supabaseAnonKey);
