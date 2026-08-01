import { supabase } from './supabaseClient';
import { WeightLog } from '../types/database.types';

/**
 * Logs a weight entry in weight_logs and updates profile weight_kg
 */
export async function logUserWeight(userId: string, weightKg: number): Promise<WeightLog> {
  const { data: log, error } = await supabase
    .from('weight_logs')
    .insert({
      user_id: userId,
      weight_kg: weightKg,
    })
    .select('*')
    .single();

  if (error) throw error;

  // Also update current weight on profiles table
  await supabase
    .from('profiles')
    .update({ weight_kg: weightKg, updated_at: new Date().toISOString() })
    .eq('id', userId);

  return log;
}

/**
 * Fetches user weight history ordered chronologically
 */
export async function getUserWeightHistory(userId: string): Promise<WeightLog[]> {
  const { data, error } = await supabase
    .from('weight_logs')
    .select('*')
    .eq('user_id', userId)
    .order('logged_at', { ascending: true });

  if (error) throw error;
  return data || [];
}
