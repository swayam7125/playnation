// supabase/functions/create-booking/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Define the request body structure
interface CreateBookingRequestBody {
  facility_id: string;
  slot_id: string;
  total_amount: number; // This is the BASE amount before discount
  offer_id?: string | null; // Optional offer ID applied by the user
}

// Helper function to validate offer with detailed logging
async function validateOfferOnServer(
    supabaseAdmin: SupabaseClient,
    offerId: string,
    userId: string,
    facilityId: string,
    baseAmount: number
): Promise<{ valid: boolean; discountAmount: number; offerDetails: any | null; error?: string }> {
    // Added detailed logging prefix
    const logPrefix = `[validateOfferOnServer ${new Date().toISOString()}] OfferID: ${offerId}, UserID: ${userId}, FacilityID: ${facilityId}:`;
    console.log(`${logPrefix} Starting validation. Base amount: ${baseAmount}`);

    if (!offerId) {
      console.log(`${logPrefix} No Offer ID provided.`);
      return { valid: false, discountAmount: 0, offerDetails: null };
    }

    // 1. Fetch Offer Details
    console.log(`${logPrefix} Fetching offer details...`);
    const { data: offerData, error: offerError } = await supabaseAdmin
        .from('offers')
        .select(`
            *,
            offer_sports ( sport_id )
        `) // Removed venues here, fetched via facility later
        .eq('offer_id', offerId)
        .single();

    if (offerError || !offerData) {
        console.error(`${logPrefix} Offer fetch failed. Error:`, offerError?.message);
        return { valid: false, discountAmount: 0, offerDetails: null, error: 'Offer not found.' };
    }
    // Log key details fetched for the offer
    console.log(`${logPrefix} Offer data fetched:`, {
        offer_id: offerData.offer_id, // Log ID for confirmation
        is_active: offerData.is_active,
        valid_from: offerData.valid_from,
        valid_until: offerData.valid_until,
        is_global: offerData.is_global,
        venue_id: offerData.venue_id, // Offer's associated venue (if not global)
        applies_to_all_sports: offerData.applies_to_all_sports,
        min_booking_value: offerData.min_booking_value,
        max_uses: offerData.max_uses,
        max_uses_per_user: offerData.max_uses_per_user,
        offer_type: offerData.offer_type,
        discount_percentage: offerData.discount_percentage,
        fixed_discount_amount: offerData.fixed_discount_amount,
        offer_sports_count: offerData.offer_sports?.length || 0 // Count related sports
    });

    // 2. Fetch Facility Details
    console.log(`${logPrefix} Fetching facility details for facility ${facilityId}...`);
     const { data: facilityData, error: facilityError } = await supabaseAdmin
        .from('facilities')
        .select('venue_id, sport_id')
        .eq('facility_id', facilityId)
        .single();

    if (facilityError || !facilityData) {
         console.error(`${logPrefix} Facility fetch failed. Error:`, facilityError?.message);
         return { valid: false, discountAmount: 0, offerDetails: null, error: 'Facility details not found for validation.' };
    }
    const bookingSportId = facilityData.sport_id;
    const actualBookingVenueId = facilityData.venue_id;
    console.log(`${logPrefix} Facility data fetched:`, { venue_id: actualBookingVenueId, sport_id: bookingSportId });


    // 3. Perform Validation Checks
    if (!offerData.is_active) {
        console.log(`${logPrefix} Validation failed: Offer inactive.`);
        return { valid: false, discountAmount: 0, offerDetails: offerData, error: 'Offer is inactive.' };
    }
    console.log(`${logPrefix} Check passed: is_active.`);

    const now = new Date();
    if (offerData.valid_from && new Date(offerData.valid_from) > now) {
         console.log(`${logPrefix} Validation failed: Offer not yet valid (valid_from: ${offerData.valid_from}, now: ${now.toISOString()}).`);
         return { valid: false, discountAmount: 0, offerDetails: offerData, error: 'Offer not yet valid.' };
    }
    console.log(`${logPrefix} Check passed: valid_from.`);

    if (offerData.valid_until && new Date(offerData.valid_until) < now) {
         console.log(`${logPrefix} Validation failed: Offer expired (valid_until: ${offerData.valid_until}, now: ${now.toISOString()}).`);
         return { valid: false, discountAmount: 0, offerDetails: offerData, error: 'Offer has expired.' };
    }
    console.log(`${logPrefix} Check passed: valid_until.`);


    // --- Refined Applicability Logic ---
    if (offerData.is_global) {
        console.log(`${logPrefix} Applicability check: Offer is global. Skipping venue/sport specifics.`);
        // Global offers apply (potentially add checks for global sport exclusions if needed later)
    } else {
        console.log(`${logPrefix} Applicability check: Offer is venue-specific (Offer Venue: ${offerData.venue_id}).`);
        // Venue-Specific Offer
        if (offerData.venue_id !== actualBookingVenueId) {
            console.log(`${logPrefix} Validation failed: Venue mismatch (Offer venue: ${offerData.venue_id}, Booking venue: ${actualBookingVenueId}).`);
            return { valid: false, discountAmount: 0, offerDetails: offerData, error: 'Offer not valid for this venue.' };
        }
        console.log(`${logPrefix} Check passed: Venue matches.`);

        // Check sports for the venue-specific offer
        if (offerData.applies_to_all_sports) {
            console.log(`${logPrefix} Checking sport validity for 'applies_to_all_sports' at venue ${offerData.venue_id}. Booking sport: ${bookingSportId}`);
            if (!bookingSportId) {
                // Should not happen if facility has a sport, but good to check
                console.log(`${logPrefix} Validation failed: Cannot check sport because booking facility has no sport_id.`);
                return { valid: false, discountAmount: 0, offerDetails: offerData, error: 'Cannot determine sport for booking.' };
            }
            const { count: sportCount, error: venueSportsError } = await supabaseAdmin
                .from('facilities')
                .select('sport_id', { count: 'exact', head: true })
                .eq('venue_id', offerData.venue_id) // Offer's venue
                .eq('sport_id', bookingSportId);     // Sport being booked

            if (venueSportsError) {
                console.error(`${logPrefix} Error checking venue sports:`, venueSportsError);
                return { valid: false, discountAmount: 0, offerDetails: offerData, error: "Could not verify sports available at the venue." };
            }
            console.log(`${logPrefix} Count of facilities at venue ${offerData.venue_id} with sport ${bookingSportId}: ${sportCount}`);

            if (sportCount === null || sportCount === 0) {
                 console.log(`${logPrefix} Validation failed: Sport ${bookingSportId} not found at venue ${offerData.venue_id}.`);
                 return { valid: false, discountAmount: 0, offerDetails: offerData, error: 'Offer applies to all sports at its venue, but not the specific sport you are booking.' };
            }
            console.log(`${logPrefix} Check passed: Sport ${bookingSportId} is available at venue ${offerData.venue_id}.`);

        } else {
            console.log(`${logPrefix} Checking specific sport validity. Booking sport: ${bookingSportId}`);
            // Offer applies only to SPECIFIC sports
            if (!bookingSportId) {
                console.log(`${logPrefix} Validation failed: Cannot check specific sports, booking facility has no sport_id.`);
                 return { valid: false, discountAmount: 0, offerDetails: offerData, error: 'Cannot validate sport-specific offer without booking sport ID.' };
            }
            const applicableSportIds = offerData.offer_sports?.map((os: { sport_id: string }) => os.sport_id) || [];
             console.log(`${logPrefix} Applicable Sport IDs for offer:`, applicableSportIds);
            if (!applicableSportIds.includes(bookingSportId)) {
                console.log(`${logPrefix} Validation failed: Booking sport ${bookingSportId} not in applicable list.`);
                return { valid: false, discountAmount: 0, offerDetails: offerData, error: 'Offer not valid for the selected sport.' };
            }
            console.log(`${logPrefix} Check passed: Sport ${bookingSportId} matches specific offer sports.`);
        }
    }
    // --- End Refined Applicability Logic ---

    if (offerData.min_booking_value && baseAmount < offerData.min_booking_value) {
        console.log(`${logPrefix} Validation failed: Minimum booking value not met (Required: ${offerData.min_booking_value}, Actual: ${baseAmount}).`);
        return { valid: false, discountAmount: 0, offerDetails: offerData, error: `Minimum booking value of ₹${offerData.min_booking_value} required.` };
    }
    console.log(`${logPrefix} Check passed: min_booking_value (Required: ${offerData.min_booking_value}, Actual: ${baseAmount}).`);


    // --- Usage Limit Checks ---
    if (offerData.max_uses !== null || offerData.max_uses_per_user !== null) { // Check only if limits are set
        console.log(`${logPrefix} Checking usage limits (Max Uses: ${offerData.max_uses ?? 'N/A'}, Max/User: ${offerData.max_uses_per_user ?? 'N/A'})...`);
        const { count: totalRedemptions, error: totalCountError } = await supabaseAdmin
            .from('offer_redemptions')
            .select('*', { count: 'exact', head: true })
            .eq('offer_id', offerId);

        if (totalCountError) {
            console.error(`${logPrefix} Error counting total redemptions:`, totalCountError);
            return { valid: false, discountAmount: 0, offerDetails: offerData, error: 'Could not verify offer usage limits.' };
        }
        console.log(`${logPrefix} Current total redemptions: ${totalRedemptions}`);

        if (offerData.max_uses !== null && totalRedemptions !== null && totalRedemptions >= offerData.max_uses) {
            console.log(`${logPrefix} Validation failed: Max uses limit reached (${totalRedemptions} >= ${offerData.max_uses}).`);
            return { valid: false, discountAmount: 0, offerDetails: offerData, error: 'Offer usage limit reached.' };
        }

        if (offerData.max_uses_per_user !== null) { // Only query if this limit is set
            const { count: userRedemptions, error: userCountError } = await supabaseAdmin
                .from('offer_redemptions')
                .select('*', { count: 'exact', head: true })
                .eq('offer_id', offerId)
                .eq('user_id', userId);

            if (userCountError) {
                console.error(`${logPrefix} Error counting user redemptions:`, userCountError);
                return { valid: false, discountAmount: 0, offerDetails: offerData, error: 'Could not verify your usage limit.' };
            }
            console.log(`${logPrefix} Current user redemptions: ${userRedemptions}`);

            if (userRedemptions !== null && userRedemptions >= offerData.max_uses_per_user) {
                console.log(`${logPrefix} Validation failed: Max uses per user limit reached (${userRedemptions} >= ${offerData.max_uses_per_user}).`);
                return { valid: false, discountAmount: 0, offerDetails: offerData, error: 'You have already reached the usage limit for this offer.' };
            }
        }
         console.log(`${logPrefix} Check passed: Usage limits.`);
    } else {
        console.log(`${logPrefix} No usage limits defined for this offer.`);
    }
    // --- End Usage Limit Checks ---

    // 4. Calculate Discount
    let calculatedDiscount = 0;
    if (offerData.offer_type === 'percentage_discount' && offerData.discount_percentage) {
      calculatedDiscount = (baseAmount * offerData.discount_percentage) / 100;
      console.log(`${logPrefix} Calculated percentage discount: ${calculatedDiscount} (${offerData.discount_percentage}%)`);
    } else if (offerData.offer_type === 'fixed_amount_discount' && offerData.fixed_discount_amount) {
      calculatedDiscount = Math.min(offerData.fixed_discount_amount, baseAmount);
      console.log(`${logPrefix} Calculated fixed discount: ${calculatedDiscount} (Fixed: ${offerData.fixed_discount_amount})`);
    } else {
         console.log(`${logPrefix} Offer type '${offerData.offer_type}' not recognized or no discount value set.`);
    }
    calculatedDiscount = Math.max(0, Math.round(calculatedDiscount * 100) / 100); // Round and ensure non-negative
    console.log(`${logPrefix} Final calculated discount after rounding/min(0): ${calculatedDiscount}`);

    console.log(`${logPrefix} Validation successful.`);
    return { valid: true, discountAmount: calculatedDiscount, offerDetails: offerData };
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

  const logPrefixMain = `[create-booking ${new Date().toISOString()}]`;

  try {
    // 1. Authenticate User
    console.log(`${logPrefixMain} Authenticating user...`);
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
        console.error(`${logPrefixMain} Authentication failed: Missing header.`);
        return new Response(JSON.stringify({ error: 'Missing authorization header' }), { status: 401, headers: corsHeaders });
    }
    const supabaseUserClient = createClient(
      Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: userError } = await supabaseUserClient.auth.getUser();
    if (userError || !user) {
        console.error(`${logPrefixMain} Authentication failed:`, userError?.message || 'No user found.');
        return new Response(JSON.stringify({ error: 'User not authenticated' }), { status: 401, headers: corsHeaders });
    }
     console.log(`${logPrefixMain} User authenticated: ${user.id}`);


    // 2. Parse Request Body
    console.log(`${logPrefixMain} Parsing request body...`);
    let requestBody: CreateBookingRequestBody;
    try {
        requestBody = await req.json();
    } catch (parseError) {
        console.error(`${logPrefixMain} Failed to parse JSON body:`, parseError);
        return new Response(JSON.stringify({ error: 'Invalid request body.' }), { status: 400, headers: corsHeaders });
    }
    const { facility_id, slot_id, total_amount, offer_id } = requestBody;
    console.log(`${logPrefixMain} Parsed body:`, { facility_id, slot_id, total_amount, offer_id });


    if (!facility_id || !slot_id || total_amount === undefined || total_amount < 0) {
        console.error(`${logPrefixMain} Invalid parameters:`, { facility_id, slot_id, total_amount });
        return new Response(JSON.stringify({ error: 'Missing or invalid required booking parameters' }), { status: 400, headers: corsHeaders });
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // --- Transaction Logic Start ---

    // 3. Fetch Time Slot Details
    console.log(`${logPrefixMain} Fetching time slot ${slot_id}...`);
    const { data: timeSlot, error: slotFetchError } = await supabaseAdmin
      .from('time_slots')
      .select('slot_id, is_available, facility_id, start_time, end_time')
      .eq('slot_id', slot_id)
      .single();

    if (slotFetchError) {
        console.error(`${logPrefixMain} Slot fetch failed for ${slot_id}:`, slotFetchError.message);
        return new Response(JSON.stringify({ error: 'Time slot not found or database error.' }), { status: 404, headers: corsHeaders });
    }
    console.log(`${logPrefixMain} Slot fetched. ID: ${timeSlot.slot_id}, is_available: ${timeSlot.is_available}`);
    if (!timeSlot.is_available) {
        console.warn(`${logPrefixMain} Slot ${slot_id} is already unavailable (initial check).`);
        return new Response(JSON.stringify({ error: 'This slot has just been taken. Please choose another one.' }), { status: 409, headers: corsHeaders });
    }
    if (timeSlot.facility_id !== facility_id) {
         console.error(`${logPrefixMain} Slot ${slot_id} facility mismatch: expected ${facility_id}, got ${timeSlot.facility_id}`);
         return new Response(JSON.stringify({ error: 'Booking data mismatch. Please try again.' }), { status: 400, headers: corsHeaders });
    }


    // 4. Validate Offer on Server (if applicable)
    let finalAmount = total_amount;
    let appliedDiscount = 0;
    let validatedOfferId: string | null = null;
    let offerValidationErrorMessage: string | undefined;
    let validatedOfferTitle: string | null = null;

    if (offer_id) {
      console.log(`${logPrefixMain} Offer ID ${offer_id} provided. Re-validating on server...`);
      const validationResult = await validateOfferOnServer(
          supabaseAdmin, offer_id, user.id, facility_id, total_amount
      );

      console.log(`${logPrefixMain} Server-side validation result:`, validationResult); // Log the full result object

      if (validationResult.valid && validationResult.offerDetails) {
        validatedOfferId = offer_id; // Keep original ID if valid
        appliedDiscount = validationResult.discountAmount;
        finalAmount = Math.max(0, total_amount - appliedDiscount);
        validatedOfferTitle = validationResult.offerDetails.title;
        console.log(`${logPrefixMain} Validation PASSED. Final values set - finalAmount: ${finalAmount}, appliedDiscount: ${appliedDiscount}, validatedOfferId: ${validatedOfferId}`);
      } else {
        offerValidationErrorMessage = validationResult.error || 'Offer validation failed (unknown reason).';
        console.warn(`${logPrefixMain} Validation FAILED: ${offerValidationErrorMessage}. Resetting discount values.`);
        // Ensure values are reset if validation fails
        validatedOfferId = null;
        appliedDiscount = 0;
        finalAmount = total_amount; // Use original amount if offer fails
      }
    } else {
       console.log(`${logPrefixMain} No offer ID provided.`);
    }

    // 5. Attempt to Reserve the Slot
    console.log(`${logPrefixMain} Attempting atomic update to reserve slot ${slot_id}...`);
    const { data: updatedSlotData, error: updateError } = await supabaseAdmin
      .from('time_slots')
      .update({ is_available: false })
      .eq('slot_id', slot_id)
      .eq('is_available', true) // Critical check
      .select('slot_id')
      .single();

    if (updateError || !updatedSlotData) {
        if (updateError) { console.error(`${logPrefixMain} Failed to reserve slot ${slot_id} due to DB error:`, updateError.message); }
        else { console.warn(`${logPrefixMain} Failed to reserve slot ${slot_id}: Slot taken (race condition).`); }
        return new Response(JSON.stringify({ error: 'This slot has just been taken. Please choose another one.' }), { status: 409, headers: corsHeaders });
    }
     console.log(`${logPrefixMain} Slot ${slot_id} successfully reserved (marked as unavailable).`);


    // 6. Insert the Booking Record
    let bookingId: string | null = null;
    const bookingPayload = {
        user_id: user.id,
        facility_id: facility_id,
        slot_id: slot_id,
        start_time: timeSlot.start_time,
        end_time: timeSlot.end_time,
        total_amount: finalAmount,      // Uses final calculated amount
        discount_amount: appliedDiscount, // Uses calculated discount
        offer_id: validatedOfferId,     // Uses validated ID
        status: 'confirmed',
        payment_status: 'paid',
    };
    console.log(`${logPrefixMain} FINAL BOOKING PAYLOAD for insert:`, bookingPayload); // Log payload *before* try block

    try {
        const { data: booking, error: bookingError } = await supabaseAdmin
          .from('bookings')
          .insert(bookingPayload)
          .select('booking_id')
          .single();

        if (bookingError) throw bookingError; // Re-throw DB errors
        if (!booking || !booking.booking_id) throw new Error("Booking created but failed to retrieve ID.");

        bookingId = booking.booking_id;
        console.log(`${logPrefixMain} Booking record inserted successfully. Booking ID: ${bookingId}`);

    } catch (bookingInsertError) {
        // ... (attempt to revert slot logic) ...
        console.error(`${logPrefixMain} Booking insertion failed, attempting to revert slot:`, bookingInsertError.message);
        const { error: revertError } = await supabaseAdmin.from('time_slots').update({ is_available: true }).eq('slot_id', slot_id);
        if (revertError) { console.error(`${logPrefixMain} CRITICAL: Failed to revert slot ${slot_id}:`, revertError.message); }
        else { console.log(`${logPrefixMain} Successfully reverted slot ${slot_id}.`); }

        // ... (return booking error response) ...
        const statusCode = bookingInsertError.code === '23505' ? 409 : 500;
        return new Response(JSON.stringify({ error: `Failed to create booking: ${bookingInsertError.message}` }), { status: statusCode, headers: corsHeaders });
    }

    // --- Transaction Logic End ---

    // 7. [Optional] Log Offer Redemption
    if (validatedOfferId && bookingId) {
        console.log(`${logPrefixMain} Logging redemption for offer ${validatedOfferId}, booking ${bookingId}...`);
        const { error: redemptionInsertError } = await supabaseAdmin
            .from('offer_redemptions')
            .insert({
                offer_id: validatedOfferId,
                user_id: user.id,
                booking_id: bookingId,
                discount_amount: appliedDiscount // Log the actual discount applied
            });
        if (redemptionInsertError) {
            console.error(`${logPrefixMain} Failed to log redemption:`, redemptionInsertError.message);
        } else {
            console.log(`${logPrefixMain} Redemption logged successfully.`);
        }
    }

    // --- ⬇⬇ NEW CODE BLOCK FOR OWNER NOTIFICATION ⬇⬇ ---
    // 8. Send Notification to Venue Owner
    console.log(`${logPrefixMain} Attempting to send notification for booking ${bookingId}...`);
    try {
      // Get Player's Name and Facility/Owner Details
      const [facilityDetails, playerDetails] = await Promise.all([
        supabaseAdmin
          .from('facilities')
          .select('name, venues ( owner_id )') // Get facility name and nested owner_id
          .eq('facility_id', facility_id)
          .single(),
        supabaseAdmin
          .from('users') // Get player's username
          .select('username')
          .eq('user_id', user.id)
          .single()
      ]);

      if (facilityDetails.error) throw new Error(`Failed to get facility details: ${facilityDetails.error.message}`);
      if (playerDetails.error) throw new Error(`Failed to get player details: ${playerDetails.error.message}`);

      // Extract data
      const facilityName = facilityDetails.data?.name || 'Unknown Facility';
      const playerName = playerDetails.data?.username || 'A player';
      // deno-lint-ignore no-explicit-any
      const ownerId = (facilityDetails.data?.venues as any)?.owner_id;


      if (!ownerId) {
        throw new Error(`Could not find owner for facility ${facility_id}`);
      }

      // Format the time
      const formattedTime = new Date(timeSlot.start_time).toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        month: 'short',
        day: 'numeric'
      });

      // Call the create_notification function
      const { error: notificationError } = await supabaseAdmin.rpc('create_notification', {
        title: 'New Booking Confirmed',
        body: `${playerName} has booked ${facilityName} for ${formattedTime}.`,
        sender_type: 'system',      // Notification is from the system
        recipient_type: 'owner',    // This must match your function's expected role type
        recipient_ids: [ownerId],   // Pass the owner's ID in an array
        link_to: '/owner/calendar'  // This is the new redirect link
      });

      if (notificationError) {
        throw new Error(`Failed to create notification RPC: ${notificationError.message}`);
      }

      console.log(`${logPrefixMain} Successfully created notification for owner ${ownerId}.`);

    } catch (notificationError) {
      // IMPORTANT: Log the error but DO NOT fail the request.
      // The booking succeeded, which is the most important part.
      console.error(`${logPrefixMain} CRITICAL: Booking ${bookingId} succeeded, but notification FAILED:`, notificationError.message);
    }
    // --- ⬆⬆ END OF NEW CODE BLOCK ⬆⬆ ---


    // 9. Return Success Response (was step 8)
    let message = 'Booking created successfully';
    if (offerValidationErrorMessage) { message += `. Note: The provided offer code could not be applied (${offerValidationErrorMessage})`; }
    else if (appliedDiscount > 0 && validatedOfferTitle) { message += ` with offer "${validatedOfferTitle}" applied.`; }
    console.log(`${logPrefixMain} Sending success response.`);

    return new Response(
      JSON.stringify({
        booking_id: bookingId, // Changed from bookingId to booking_id
        message: message,
        final_amount: finalAmount
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // OK
      }
    );

  } catch (error) {
     // Catch-all
     console.error(`${logPrefixMain} UNHANDLED ERROR:`, error);
     return new Response(JSON.stringify({ error: error.message || 'An unexpected server error occurred' }), {
       headers: { ...corsHeaders, 'Content-Type': 'application/json' },
       status: error.message?.includes('authenticated') || error.message?.includes('authorization') ? 401 : 500,
     });
  }
});