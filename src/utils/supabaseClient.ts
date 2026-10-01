import { createClient } from '@supabase/supabase-js';

export const SUPABASE_PROJECT_ID = 'qyoqamviapkknidyspkc';
export const SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`;
export const SUPABASE_ANON_KEY = 'sb_publishable_IUiHWy2WngytTaHh5lGpCw_Cpjc6mqa';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Directly insert a booking into the Supabase 'bookings' table
 */
export async function saveBookingToSupabase(booking: {
  id: string;
  referenceCode: string;
  customerName: string;
  phone: string;
  email: string;
  companyName?: string;
  purpose: string;
  specialist: string;
  date: string;
  timeSlot: string;
  estimatedScope?: string;
  notes?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}) {
  try {
    const payload = {
      id: booking.id,
      reference_code: booking.referenceCode,
      customer_name: booking.customerName,
      phone: booking.phone,
      email: booking.email,
      company_name: booking.companyName || null,
      purpose: booking.purpose,
      specialist: booking.specialist,
      visit_date: booking.date,
      time_slot: booking.timeSlot,
      estimated_scope: booking.estimatedScope || null,
      notes: booking.notes || null,
      status: booking.status,
      created_at: booking.createdAt,
      updated_at: booking.updatedAt,
    };

    const { data, error } = await supabase.from('bookings').insert([payload]);
    if (error) {
      console.warn('Supabase client insert result:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    console.warn('Supabase client connection exception:', err.message);
    return { success: false, error: err.message };
  }
}
