// supabase/functions/verify-payment/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Helper function to convert the signature buffer to a hex string for comparison
const bufferToHex = (buffer) => {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const rawBody = await req.text(); // Read the request body as plain text for signature verification
    const { event, payload } = JSON.parse(rawBody);
    const razorpaySignature = req.headers.get('x-razorpay-signature');
    const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET');

    if (!razorpaySignature || !webhookSecret) {
      throw new Error('Missing Razorpay signature or webhook secret.');
    }

    // --- JAVASCRIPT CRYPTO VERIFICATION ---
    // This block uses the Web Crypto API, which is standard in modern JS environments like Deno.
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(webhookSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      new TextEncoder().encode(rawBody)
    );
    const digest = bufferToHex(signature);
    
    if (digest !== razorpaySignature) {
      console.error('Signature verification failed.');
      throw new Error('Invalid signature');
    }
    // --- END OF FIX ---

    // If the signature is valid, proceed with the booking logic
    if (event === 'payment.captured') {
      const payment = payload.payment.entity;
      const order = payload.order.entity;
      
      const { user_id, slot_id, facility_id, start_time, end_time } = order.notes;

      if (!user_id || !slot_id || !facility_id || !start_time || !end_time) {
        throw new Error('Missing required information in order notes.');
      }

      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL'),
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
      );

      // Call the secure database function to create the booking
      const { error: rpcError } = await supabaseAdmin.rpc('create_booking_for_user', {
          p_user_id: user_id,
          p_facility_id: facility_id,
          p_slot_id: slot_id,
          p_total_amount: payment.amount / 100,
      });

      if (rpcError) {
        console.error('RPC Error:', rpcError);
        throw rpcError;
      }
    }

    return new Response(JSON.stringify({ status: 'success' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Function Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});