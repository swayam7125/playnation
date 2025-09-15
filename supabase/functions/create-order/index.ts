import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Razorpay from 'https://esm.sh/razorpay@2.8.6';

// Initialize Razorpay with your API keys from environment variables
const razorpay = new Razorpay({
  key_id: Deno.env.get('RAZORPAY_KEY_ID')!,
  key_secret: Deno.env.get('RAZORPAY_KEY_SECRET')!,
});

serve(async (req) => {
  // CORS headers to allow requests from your web app
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Ensure you have a valid Supabase client for making authorized requests
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { slot_id } = await req.json();

    if (!slot_id) {
      throw new Error('Slot ID is required.');
    }

    // 1. Fetch the slot and its price details securely from the database
    const { data: slotData, error: slotError } = await supabaseAdmin
      .from('time_slots')
      .select(`
        price_override,
        facilities ( hourly_rate )
      `)
      .eq('slot_id', slot_id)
      .single();

    if (slotError || !slotData) {
      console.error('Supabase error:', slotError);
      throw new Error('Invalid slot or facility. Could not determine price.');
    }

    // Determine the final price (use override if it exists)
    const amount = slotData.price_override || slotData.facilities.hourly_rate;

    if (!amount || amount <= 0) {
      throw new Error('Invalid price for the selected slot.');
    }

    // 2. Create a Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Amount in the smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_playnation_${Date.now()}`,
      notes: {
        slot_id: slot_id // Add slot_id to the notes for tracking
      }
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      throw new Error("Failed to create Razorpay order.");
    }

    // 3. Return the order details to the client
    return new Response(JSON.stringify(order), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});