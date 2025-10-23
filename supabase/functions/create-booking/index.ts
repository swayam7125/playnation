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

    const { facility_id, slot_id, total_amount } = await req.json();
    
    if (!facility_id || !slot_id || total_amount === undefined) {
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

    const { data: timeSlot, error: slotError } = await supabaseAdmin
      .from('time_slots')
      .select('slot_id, is_available, facility_id, start_time, end_time')
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

    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert({
        user_id: user.id,
        facility_id: facility_id,
        slot_id: slot_id,
        start_time: timeSlot.start_time,
        end_time: timeSlot.end_time,
        total_amount: total_amount,
        status: 'confirmed',
        payment_status: 'paid',
      })
      .select('booking_id')
      .single();

    if (bookingError) {
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
        bookingId: booking.booking_id, 
        message: 'Booking created successfully'
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
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