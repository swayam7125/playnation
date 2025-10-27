// supabase/functions/validate-offer/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Request body structure remains the same
interface ValidateOfferRequestBody {
  offer_code: string;
  venue_id?: string;    // Venue ID of the booking attempt
  facility_id?: string; // Facility ID of the booking attempt (to get sport_id)
  booking_value?: number;
  // user_id derived from auth header
}

// Response structure remains the same
interface ValidOfferResponse {
  offer_id: string;
  title: string;
  discount_percentage?: number;
  offer_type: string;
  fixed_discount_amount?: number;
  calculated_discount: number;
}

// --- Main Server Function ---
serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Get User ID (Same as before)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Missing authorization header');
    const supabaseUserClient = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: userError } = await supabaseUserClient.auth.getUser();
    if (userError || !user) throw new Error('User not authenticated');
    const userId = user.id;

    // 2. Parse Request Body
    const {
      offer_code,
      venue_id: bookingVenueId,     // Venue where booking is attempted
      facility_id: bookingFacilityId, // Facility being booked
      booking_value
    }: ValidateOfferRequestBody = await req.json();

    if (!offer_code) throw new Error('Missing offer_code');
    if (!bookingFacilityId) throw new Error('Missing facility_id for validation.'); // Needed for sport check

    // 3. Create Admin Client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // 4. Fetch Offer Details
    const { data: offer, error: offerError } = await supabaseAdmin
      .from('offers')
      .select(`*, offer_sports ( sport_id )`) // Still fetch specific sports if defined
      .eq('offer_code', offer_code)
      .single();

    if (offerError || !offer) {
      return new Response(JSON.stringify({ error: 'Invalid or expired offer code.' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 5. Fetch Facility Details (to get the sport being booked and the venue it belongs to)
     const { data: facilityData, error: facilityError } = await supabaseAdmin
        .from('facilities')
        .select('venue_id, sport_id')
        .eq('facility_id', bookingFacilityId)
        .single();

    if (facilityError || !facilityData) {
         return new Response(JSON.stringify({ error: 'Facility details not found for validation.' }), {
            status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
    const bookingSportId = facilityData.sport_id;
    const actualBookingVenueId = facilityData.venue_id; // Use the venue ID from the facility table

    // --- Perform Validation Checks ---

    if (!offer.is_active) throw new Error('This offer is currently inactive.');

    const now = new Date();
    if (offer.valid_from && new Date(offer.valid_from) > now) throw new Error('This offer is not yet valid.');
    if (offer.valid_until && new Date(offer.valid_until) < now) throw new Error('This offer has expired.');

    // --- Refined Applicability Logic ---
    if (offer.is_global) {
        // Global offers apply everywhere (no venue/sport check needed beyond specific exclusions if any)
    } else {
        // Venue-Specific Offer
        if (offer.venue_id !== actualBookingVenueId) {
            throw new Error('This offer is not valid for this venue.');
        }

        // Now check sports for the venue-specific offer
        if (offer.applies_to_all_sports) {
            // **NEW LOGIC**: Check if the sport being booked exists at the OFFER'S venue
            const { data: venueSports, error: venueSportsError } = await supabaseAdmin
                .from('facilities')
                .select('sport_id')
                .eq('venue_id', offer.venue_id); // Check sports at the offer's venue

            if (venueSportsError) {
                console.error("Error fetching venue sports:", venueSportsError);
                throw new Error("Could not verify sports available at the venue.");
            }

            const venueSportIds = venueSports.map((f: { sport_id: string }) => f.sport_id);
            if (!bookingSportId || !venueSportIds.includes(bookingSportId)) {
                throw new Error('This offer applies to all sports at its venue, but not the specific sport you are booking.');
            }
            // If the sport is offered at the venue, the check passes.

        } else {
            // Offer applies only to SPECIFIC sports listed in offer_sports
            if (!bookingSportId) {
                 throw new Error('Cannot validate offer without knowing the sport being booked.');
            }
            const applicableSportIds = offer.offer_sports?.map((os: { sport_id: string }) => os.sport_id) || [];
            if (!applicableSportIds.includes(bookingSportId)) {
                throw new Error('This offer is not valid for the selected sport.');
            }
        }
    }
    // --- End Refined Applicability Logic ---


    if (booking_value && offer.min_booking_value && booking_value < offer.min_booking_value) {
       throw new Error(`Minimum booking value of ₹${offer.min_booking_value} required.`);
    }

    // --- Usage Limit Checks (Same as before) ---
    if (offer.max_uses || offer.max_uses_per_user) {
         const { count: totalRedemptions, error: totalCountError } = await supabaseAdmin
            .from('offer_redemptions')
            .select('*', { count: 'exact', head: true })
            .eq('offer_id', offer.offer_id);
         // Handle totalCountError...
         if (offer.max_uses && totalRedemptions !== null && totalRedemptions >= offer.max_uses) {
             throw new Error('Offer usage limit reached.');
         }
         if (offer.max_uses_per_user) {
             const { count: userRedemptions, error: userCountError } = await supabaseAdmin
                .from('offer_redemptions')
                .select('*', { count: 'exact', head: true })
                .eq('offer_id', offer.offer_id)
                .eq('user_id', userId);
             // Handle userCountError...
             if (userRedemptions !== null && userRedemptions >= offer.max_uses_per_user) {
                 throw new Error('You have reached the usage limit for this offer.');
             }
         }
    }
    // --- End Usage Limit Checks ---

    // 6. Calculate Discount (Same as before)
    let calculated_discount = 0;
    if (booking_value) {
        if (offer.offer_type === 'percentage_discount' && offer.discount_percentage) {
            calculated_discount = (booking_value * offer.discount_percentage) / 100;
        } else if (offer.offer_type === 'fixed_amount_discount' && offer.fixed_discount_amount) {
            calculated_discount = Math.min(offer.fixed_discount_amount, booking_value);
        }
        calculated_discount = Math.max(0, Math.round(calculated_discount * 100) / 100);
    }

    // 7. Prepare and Return Success Response
    const responseData: ValidOfferResponse = {
      offer_id: offer.offer_id,
      title: offer.title,
      offer_type: offer.offer_type,
      discount_percentage: offer.discount_percentage,
      fixed_discount_amount: offer.fixed_discount_amount,
      calculated_discount: calculated_discount,
    };

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Validation Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400, // Validation errors are typically 400 Bad Request
    });
  }
});