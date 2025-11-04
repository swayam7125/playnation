// supabase/functions/get-available-offers/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log("get-available-offers function_starting");

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // --- 1. Get Supabase client (service role) ---
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // --- 2. Get booking details from request body ---
    const { venue_id, sport_id, booking_value } = await req.json() 
    
    if (typeof booking_value === 'undefined' || booking_value === null) {
      throw new Error("Booking value is required.");
    }

    // --- 3. Build the query ---
    const now = new Date().toISOString();

    let query = supabaseAdmin
      .from('offers')
      .select(
        'offer_id, title, offer_code, description, offer_type, discount_percentage, fixed_discount_amount, min_booking_value'
      )
      .eq('is_active', true)
      .lte('valid_from', now)
      .or(`valid_until.gte.${now},valid_until.is.null`); // Validity date check

    // --- THIS IS THE FIX ---
    // We must check for offers that meet the minimum *OR* have no minimum (is.null)
    query = query.or(
      `min_booking_value.lte.${booking_value},min_booking_value.is.null`
    );
    // --- END OF FIX ---

    // Now, filter for scope (Global OR this specific Venue)
    let scopeFilter = `is_global.eq.true`;
    if (venue_id) {
      scopeFilter += `,venue_id.eq.${venue_id}`;
    }
    query = query.or(scopeFilter); 
    
    // Note: We are still letting 'validate-offer' handle the final sport-specific check.

    // --- 4. Execute query ---
    const { data: offers, error } = await query;

    if (error) {
      console.error("Error querying offers:", error.message);
      throw error;
    }

    // --- 5. Return the list of offers ---
    return new Response(JSON.stringify(offers || []), { // Ensure we return an array
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    console.error("Error in get-available-offers function:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})