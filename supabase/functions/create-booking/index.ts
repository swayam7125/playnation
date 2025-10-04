// playnation - Copy/supabase/functions/create-booking/index.ts
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
    // 1. Create a client with the user's auth header to validate the user
    const supabaseUserClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!, // Use the public anon key for this client
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );
    const { data: { user } } = await supabaseUserClient.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // 2. Create a separate admin client for privileged operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { facility_id, slot_id, total_amount } = await req.json();
    if (!facility_id || !slot_id || total_amount === undefined) {
      throw new Error("Missing required booking parameters: facility_id, slot_id, or total_amount.");
    }

    // 3. Call the database function with the admin client to bypass RLS
    // This function will check for slot availability and create the booking in one transaction.
    const { data, error } = await supabaseAdmin.rpc('create_booking_for_user', {
      p_user_id: user.id,
      p_facility_id: facility_id,
      p_slot_id: slot_id,
      p_total_amount: total_amount,
    });

    if (error) {
      // Check for a specific error code if you have one for "slot taken"
      if (error.message.includes('slot has just been taken')) {
         return new Response(JSON.stringify({ error: 'This slot has just been taken. Please choose another one.' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 409, // Conflict
        });
      }
      throw new Error(`Database error: ${error.message}`);
    }

    const result = data[0];

    // 4. Check the logical status returned from the database function
    if (result.status === 'error') {
      return new Response(JSON.stringify({ error: result.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 409, // Conflict status for "slot taken"
      });
    }

    // 5. On success, return the new booking ID
    return new Response(JSON.stringify({ bookingId: result.booking_id, message: result.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: error.message.includes("authenticated") ? 401 : 400,
    });
  }
});