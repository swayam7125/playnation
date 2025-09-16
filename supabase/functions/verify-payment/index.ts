import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import crypto from 'https://deno.land/std@0.168.0/node/crypto.ts';

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  try {
    const { event, payload } = await req.json();

    // Check if it's a payment success event
    if (event === 'payment.captured') {
      const payment = payload.payment.entity;
      const order = payload.order.entity;

      const razorpaySignature = req.headers.get('x-razorpay-signature');
      const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')!;

      // 1. Securely verify the webhook signature
      const shasum = crypto.createHmac('sha256', webhookSecret);
      shasum.update(JSON.stringify(payload));
      const digest = shasum.digest('hex');

      if (digest !== razorpaySignature) {
        throw new Error('Invalid signature');
      }
      
      // 2. Signature is valid, proceed with booking
      const { user_id, slot_id } = order.notes;

      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );

      // 3. Insert the new booking into the database
      const { error: bookingError } = await supabaseAdmin
        .from('bookings')
        .insert({
          user_id: user_id,
          slot_id: slot_id,
          facility_id: payment.notes.facility_id, // Pass this from notes
          booking_date: new Date(),
          start_time: payment.notes.start_time,
          end_time: payment.notes.end_time,
          total_amount: payment.amount / 100,
          status: 'confirmed',
          payment_status: 'paid',
        });
        
      if (bookingError) throw bookingError;
      
      // 4. Mark the time slot as unavailable
      const { error: slotError } = await supabaseAdmin
        .from('time_slots')
        .update({ is_available: false })
        .eq('slot_id', slot_id);

      if (slotError) throw slotError;
    }

    return new Response(JSON.stringify({ status: 'success' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});