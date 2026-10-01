import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID || 'qyoqamviapkknidyspkc';
const SUPABASE_URL = process.env.SUPABASE_URL || `https://${SUPABASE_PROJECT_ID}.supabase.co`;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_IUiHWy2WngytTaHh5lGpCw_Cpjc6mqa';

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface SupabaseHealth {
  connected: boolean;
  projectId: string;
  url: string;
  hasBookingsTable: boolean;
  hasQuotesTable: boolean;
  hasProductsTable: boolean;
  schemaReady: boolean;
  message: string;
}

export async function checkSupabaseHealth(): Promise<SupabaseHealth> {
  let hasBookingsTable = false;
  let hasQuotesTable = false;
  let hasProductsTable = false;
  let connected = false;
  let message = 'Supabase client initialized';

  try {
    const { error: bErr } = await supabase.from('bookings').select('id').limit(1);
    if (!bErr) {
      hasBookingsTable = true;
      connected = true;
    } else if (bErr.code === 'PGRST205') {
      connected = true; // Connection works, but table not yet created
      message = "Connected to Supabase project, but 'bookings' table is not yet created in the database schema.";
    }

    const { error: qErr } = await supabase.from('quotes').select('id').limit(1);
    if (!qErr) hasQuotesTable = true;

    const { error: pErr } = await supabase.from('products').select('id').limit(1);
    if (!pErr) hasProductsTable = true;

    const schemaReady = hasBookingsTable && hasQuotesTable && hasProductsTable;

    if (schemaReady) {
      message = 'Connected to Supabase PostgreSQL database. Tables verified.';
    }

    return {
      connected,
      projectId: SUPABASE_PROJECT_ID,
      url: SUPABASE_URL,
      hasBookingsTable,
      hasQuotesTable,
      hasProductsTable,
      schemaReady,
      message,
    };
  } catch (err: any) {
    return {
      connected: false,
      projectId: SUPABASE_PROJECT_ID,
      url: SUPABASE_URL,
      hasBookingsTable: false,
      hasQuotesTable: false,
      hasProductsTable: false,
      schemaReady: false,
      message: err.message || 'Network connection to Supabase failed',
    };
  }
}

// Sync helper: When a booking is created locally, attempt to mirror to Supabase
export async function mirrorBookingToSupabase(booking: any) {
  try {
    const { error } = await supabase.from('bookings').upsert({
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
      cancellation_reason: booking.cancellationReason || null,
      created_at: booking.createdAt,
      updated_at: booking.updatedAt,
    });
    if (error && error.code !== 'PGRST205') {
      console.warn('Supabase mirror error (booking):', error.message);
    }
  } catch (err) {
    // Non-blocking
  }
}

// Sync helper: When a quote is created locally, attempt to mirror to Supabase
export async function mirrorQuoteToSupabase(quote: any) {
  try {
    const { error } = await supabase.from('quotes').upsert({
      id: quote.id,
      reference_code: quote.referenceCode,
      customer_name: quote.customerName,
      phone: quote.phone,
      email: quote.email,
      company_name: quote.companyName || null,
      customer_type: quote.customerType,
      delivery_district: quote.deliveryDistrict,
      items: quote.items,
      project_notes: quote.projectNotes || null,
      urgency: quote.urgency,
      status: quote.status,
      created_at: quote.createdAt,
      updated_at: quote.updatedAt,
    });
    if (error && error.code !== 'PGRST205') {
      console.warn('Supabase mirror error (quote):', error.message);
    }
  } catch (err) {
    // Non-blocking
  }
}
