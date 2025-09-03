import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface UmrohRegistration {
  id?: string;
  registration_id: string;
  registration_date: string;
  full_name: string;
  gender: 'L' | 'P';
  birth_place: string;
  birth_date: string;
  father_name: string;
  mother_name: string;
  address: string;
  city: string;
  province: string;
  postal_code?: string;
  occupation: string;
  has_special_illness: boolean;
  illness_details?: string;
  needs_special_care: boolean;
  special_care_details?: string;
  needs_wheelchair: boolean;
  nik: string;
  passport_number: string;
  passport_issue_date: string;
  passport_expiry_date: string;
  passport_issue_place: string;
  phone: string;
  whatsapp: string;
  email?: string;
  has_umrah_experience: boolean;
  has_hajj_experience: boolean;
  emergency_contact_name: string;
  emergency_contact_relation: string;
  emergency_contact_phone: string;
  marital_status?: string;
  selected_package: string;
  payment_method: string;
  created_at?: string;
  updated_at?: string;
}

// Function to generate registration ID
export async function generateRegistrationId(): Promise<string> {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  // Get the count of registrations today to generate sequential number
  const today = date.toISOString().split('T')[0];
  
  const { count } = await supabase
    .from('umroh_registrations')
    .select('*', { count: 'exact', head: true })
    .eq('registration_date', today);
  
  const counter = ((count || 0) + 1).toString().padStart(4, '0');
  
  return `UM${year}${month}${day}${counter}`;
}

// Function to submit registration
export async function submitRegistration(data: Omit<UmrohRegistration, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const { data: result, error } = await supabase
      .from('umroh_registrations')
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: result };
  } catch (error) {
    console.error('Submission error:', error);
    return { success: false, error: 'Terjadi kesalahan saat menyimpan data' };
  }
}

// Function to get all registrations (for admin)
export async function getAllRegistrations(): Promise<UmrohRegistration[]> {
  const { data, error } = await supabase
    .from('umroh_registrations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching registrations:', error);
    return [];
  }

  return data || [];
}