import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("create-refund function invoked");
  // Handle preflight requests for CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Ensure the request is a POST request
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Extract booking_id from the request body
    const body = await req.json();
    const { booking_id } = body;
    console.log("Request body:", body);

    if (!booking_id) {
      return new Response(JSON.stringify({ error: "booking_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create a Supabase client with the service role key
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch the booking to verify its status before refunding
    console.log(`Fetching booking with ID: ${booking_id}`);
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("status, payment_status")
      .eq("booking_id", booking_id)
      .single();

    if (fetchError) {
      console.error("Fetch error:", fetchError.message);
      throw new Error(`Supabase fetch error: ${fetchError.message}`);
    }
    console.log("Fetched booking:", booking);

    if (!booking) {
      return new Response(JSON.stringify({ error: "Booking not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if the booking is eligible for a refund
    if (booking.status !== "cancelled" || booking.payment_status !== "paid") {
      return new Response(
        JSON.stringify({
          error: "Booking is not eligible for a refund. It must be 'cancelled' and 'paid'.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Update the payment_status to 'refunded'
    console.log("Updating booking to 'refunded'");
    const { error: updateError } = await supabase
      .from("bookings")
      .update({
        payment_status: "refunded",
        updated_at: new Date().toISOString(),
      })
      .eq("booking_id", booking_id);

    if (updateError) {
      console.error("Update error:", updateError.message);
      throw new Error(`Supabase update error: ${updateError.message}`);
    }

    // Return a success response
    console.log("Refund approved successfully");
    return new Response(JSON.stringify({ message: "Refund approved successfully" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("An unexpected error occurred:", err.message);
    // Return an error response if something goes wrong
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
