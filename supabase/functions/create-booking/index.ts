import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }), 
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }

    const supabaseUserClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );
    
    const { data: { user }, error: userError } = await supabaseUserClient.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'User not authenticated' }), 
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }

    // --- MODIFIED ---
    // Now accepting `offer_id` (which can be null) from the client
    const { facility_id, slot_id, offer_id } = await req.json();
    
    // --- MODIFIED ---
    // Removed `total_amount` from the check (as it's calculated on server)
    if (!facility_id || !slot_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required booking parameters' }), 
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // --- MODIFIED ---
    // Added `price_override` to the select statement.
    const { data: timeSlot, error: slotError } = await supabaseAdmin
      .from('time_slots')
      .select('slot_id, is_available, facility_id, start_time, end_time, price_override')
      .eq('slot_id', slot_id)
      .single();

    if (slotError) {
      return new Response(
        JSON.stringify({ error: 'Time slot not found' }), 
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    if (!timeSlot.is_available) {
      return new Response(
        JSON.stringify({ error: 'This slot has just been taken. Please choose another one.' }), 
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 409,
        }
      );
    }

    // --- SERVER-SIDE PRICE CALCULATION (from previous step) ---

    // 1. Fetch the facility to get the base hourly rate
    // --- MODIFIED ---
    // Added `venue_id` and `sport_id` to the select, needed for offer validation
    const { data: facility, error: facilityError } = await supabaseAdmin
      .from('facilities')
      .select('hourly_rate, venue_id, sport_id')
      .eq('facility_id', timeSlot.facility_id)
      .single();

    if (facilityError || !facility) {
      return new Response(
        JSON.stringify({ error: 'Could not find associated facility for this slot.' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    // 2. Determine the base price.
    // We rename `finalPrice` to `basePrice` to make room for the discount.
    const basePrice = timeSlot.price_override ?? facility.hourly_rate;

    // 3. Final safety check
    if (basePrice === null || basePrice === undefined) {
        return new Response(
        JSON.stringify({ error: 'Could not determine a price for this slot.' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }
    // --- END OF PRICE CALCULATION BLOCK ---

    // --- NEW BLOCK: SERVER-SIDE OFFER VALIDATION & DISCOUNT ---

    let finalAmount = basePrice;
    let appliedOfferId = null; // This will be null unless an offer is successfully validated

    // Check if an offer_id was even passed
    if (offer_id) {
      console.log(`Attempting to validate offer_id: ${offer_id}`);
      
      const { data: offer, error: offerError } = await supabaseAdmin
        .from('offers')
        // We must fetch all fields needed for validation
        .select('offer_id, discount_percentage, is_active, valid_from, valid_until, venue_id, is_global, applies_to_all_sports, offer_sports(sport_id)')
        .eq('offer_id', offer_id)
        .single();
      
      // We'll use console.warn for logging, so you can see in your function logs if an offer fails
      if (offerError) {
        console.warn(`Offer validation failed: Offer ${offer_id} not found.`);
      } else if (!offer.is_active) {
        console.warn(`Offer validation failed: Offer ${offer_id} is not active.`);
      } else if (offer.valid_from && new Date(offer.valid_from) > new Date()) {
        console.warn(`Offer validation failed: Offer ${offer_id} is not yet valid.`);
      } else if (offer.valid_until && new Date(offer.valid_until) < new Date()) {
        console.warn(`Offer validation failed: Offer ${offer_id} has expired.`);
      } else {
        
        // If we are here, the offer is active and in its date range.
        // Now, check if it applies to this specific facility.

        // Check 1: Venue Match (Offer is global OR its venue_id matches the facility's venue_id)
        const venueMatch = offer.is_global || offer.venue_id === facility.venue_id;
        
        // Check 2: Sport Match (Offer applies to all sports OR the facility's sport_id is in the offer's list)
        const sportMatch = offer.applies_to_all_sports || 
                           (offer.offer_sports && offer.offer_sports.some(s => s.sport_id === facility.sport_id));

        if (venueMatch && sportMatch) {
          // SUCCESS! Apply the discount
          const discount = offer.discount_percentage / 100;
          finalAmount = basePrice * (1 - discount);
          appliedOfferId = offer.offer_id; // Set the ID to be saved in the booking
          console.log(`Successfully applied offer ${offer_id}. Original: ${basePrice}, New: ${finalAmount}`);
        } else {
          // Offer is valid but doesn't apply
          if (!venueMatch) console.warn(`Offer validation failed: Offer ${offer_id} does not apply to venue ${facility.venue_id}.`);
          if (!sportMatch) console.warn(`Offer validation failed: Offer ${offer_id} does not apply to sport ${facility.sport_id}.`);
        }
      }
    }
    // If no offer_id was provided, or if validation failed,
    // `finalAmount` simply remains equal to `basePrice`.
    // --- END OF NEW BLOCK ---


    // --- MODIFIED ---
    // Use the server-calculated `finalAmount` and store the `appliedOfferId`
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert({
        user_id: user.id,
        facility_id: facility_id, // Using the facility_id from your original code
        slot_id: slot_id,
        start_time: timeSlot.start_time,
        end_time: timeSlot.end_time,
        total_amount: finalAmount, // Use the secure, server-calculated, and potentially discounted price
        offer_id: appliedOfferId,  // Store the ID of the applied offer (or null)
        status: 'confirmed',
        payment_status: 'paid',
      })
      .select('booking_id')
      .single();

    if (bookingError) {
      // This check is still valid (and even more important if you add the unique constraint)
      if (bookingError.code === '23505') {
        return new Response(
          JSON.stringify({ error: 'This slot has just been taken. Please choose another one.' }), 
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 409,
          }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to create booking: ' + bookingError.message }), 
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    const { error: updateError } = await supabaseAdmin
      .from('time_slots')
      .update({ is_available: false })
      .eq('slot_id', slot_id);

    if (updateError) {
      // Log but don't fail - booking was already created
      console.error('Failed to update time slot availability:', updateError.message);
    }

    return new Response(
      JSON.stringify({ 
        booking_id: booking.booking_id, // Your client expects this key
        message: 'Booking created successfully'
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    // Log the error for debugging
    console.error('Error in create-booking function:', error.message);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred'
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});