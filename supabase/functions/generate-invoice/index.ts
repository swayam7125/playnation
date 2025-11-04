import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PDFDocument, rgb, StandardFonts } from "https://esm.sh/pdf-lib@^1.17.1";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Create Supabase client with user's auth header
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    // 2. Get booking_id from request
    const { booking_id } = await req.json();
    if (!booking_id) {
      throw new Error("Booking ID is required");
    }

    // 3. Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error("User not found or not authenticated.");
    }
    
    // 4. Try to get user role
    let userRole = 'player'; // Default to the most restrictive role
    const { data: userProfile } = await supabase.from('users').select('role').eq('user_id', user.id).single();
    if (userProfile && userProfile.role) {
        userRole = userProfile.role;
    }
    const isAdmin = userRole.toLowerCase() === 'admin'; // Make check case-insensitive

    // 5. Perform security check: If user is not an admin, they must be the player or the venue owner.
    if (!isAdmin) {
      const { data: bookingCheck, error: checkError } = await supabase
        .from('bookings')
        .select('user_id, facilities(venues(owner_id))')
        .eq('booking_id', booking_id)
        .single();

      if (checkError) {
        throw new Error(`Security check query failed: ${checkError.message}`);
      }
      if (!bookingCheck) {
        throw new Error("Booking not found.");
      }

      const isPlayer = bookingCheck.user_id === user.id;
      const isVenueOwner = bookingCheck.facilities?.venues?.owner_id === user.id;

      if (!isPlayer && !isVenueOwner) {
        throw new Error("You do not have permission to access this invoice.");
      }
    }

    // 6. If authorized, fetch all data needed for the invoice
    const { data: invoiceDetails, error: detailsError } = await supabase
      .from('bookings')
      .select(`
        *,
        facilities(*,
          sports(name),
          venues(*)
        ),
        player:users!bookings_user_id_fkey(first_name, last_name, email, phone_number)
      `)
      .eq('booking_id', booking_id)
      .single();

    if (detailsError) {
      throw new Error(`Failed to fetch full invoice details: ${detailsError.message}`);
    }

    // 7. Generate the PDF with professional design
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    
    // Embed fonts
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Define color palette - matching your theme
    const primaryGreen = rgb(0.063, 0.725, 0.506); // #10b981
    const primaryGreenDark = rgb(0.02, 0.588, 0.412); // #059669
    const lightGreenBg = rgb(0.925, 0.992, 0.961); // #ecfdf5
    const darkText = rgb(0.067, 0.094, 0.153); // #111827
    const mediumText = rgb(0.216, 0.255, 0.318); // #374151
    const lightText = rgb(0.42, 0.447, 0.502); // #6b7280
    const borderColor = rgb(0.898, 0.906, 0.922); // #e5e7eb
    const borderColorLight = rgb(0.953, 0.957, 0.965); // #f3f4f6

    const venue = invoiceDetails.facilities.venues;
    const player = invoiceDetails.player;

    // --- Header Section with green background ---
    page.drawRectangle({
      x: 0,
      y: height - 140,
      width: width,
      height: 140,
      color: primaryGreen,
    });

    // Company/Brand Name
    page.drawText("PLAYNATION", {
      x: 50,
      y: height - 60,
      size: 28,
      font: boldFont,
      color: rgb(1, 1, 1),
    });

    page.drawText("Sports Booking Platform", {
      x: 50,
      y: height - 80,
      size: 11,
      font: regularFont,
      color: rgb(0.95, 0.98, 0.97),
    });

    // Invoice Title & Number (Right-aligned)
    const invoiceTitleText = "TAX INVOICE";
    const invoiceTitleSize = 20;
    const invoiceTitleWidth = boldFont.widthOfTextAtSize(invoiceTitleText, invoiceTitleSize);
    
    page.drawText(invoiceTitleText, {
      x: width - 50 - invoiceTitleWidth,
      y: height - 55,
      size: invoiceTitleSize,
      font: boldFont,
      color: rgb(1, 1, 1),
    });

    const bookingIdText = `#${invoiceDetails.booking_id}`;
    const bookingIdSize = 12;
    const bookingIdWidth = regularFont.widthOfTextAtSize(bookingIdText, bookingIdSize);

    page.drawText(bookingIdText, {
      x: width - 50 - bookingIdWidth,
      y: height - 75,
      size: bookingIdSize,
      font: regularFont,
      color: rgb(0.95, 0.98, 0.97),
    });

    const dateText = `Date: ${new Date(invoiceDetails.created_at).toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })}`;
    const dateSize = 10;
    const dateWidth = regularFont.widthOfTextAtSize(dateText, dateSize);

    page.drawText(dateText, {
      x: width - 50 - dateWidth,
      y: height - 95,
      size: dateSize,
      font: regularFont,
      color: rgb(0.95, 0.98, 0.97),
    });

    let y = height - 170;

    // --- Venue and Customer Info Section (Two Columns) ---
    // Left Column - Venue Info
    page.drawText("FROM:", {
      x: 50,
      y: y,
      size: 10,
      font: boldFont,
      color: lightText,
    });

    page.drawText(venue.name, {
      x: 50,
      y: y - 20,
      size: 13,
      font: boldFont,
      color: darkText,
    });

    page.drawText(venue.address, {
      x: 50,
      y: y - 38,
      size: 10,
      font: regularFont,
      color: mediumText,
    });

    page.drawText(`${venue.city}, ${venue.state || ''} ${venue.zip_code || ''}`, {
      x: 50,
      y: y - 53,
      size: 10,
      font: regularFont,
      color: mediumText,
    });

    // Right Column - Customer Info
    const rightColX = width - 250;
    
    page.drawText("BILL TO:", {
      x: rightColX,
      y: y,
      size: 10,
      font: boldFont,
      color: lightText,
    });

    page.drawText(`${player.first_name || ''} ${player.last_name || ''}`, {
      x: rightColX,
      y: y - 20,
      size: 13,
      font: boldFont,
      color: darkText,
    });

    page.drawText(player.email || 'N/A', {
      x: rightColX,
      y: y - 38,
      size: 10,
      font: regularFont,
      color: mediumText,
    });

    page.drawText(player.phone_number || 'N/A', {
      x: rightColX,
      y: y - 53,
      size: 10,
      font: regularFont,
      color: mediumText,
    });

    y -= 100;

    // Divider line
    page.drawLine({
      start: { x: 50, y: y },
      end: { x: width - 50, y: y },
      thickness: 1,
      color: borderColor,
    });

    y -= 35;

    // --- Booking Details Section ---
    page.drawText("BOOKING DETAILS", {
      x: 50,
      y: y,
      size: 12,
      font: boldFont,
      color: primaryGreen,
    });

    y -= 25;

    // Table header background
    page.drawRectangle({
      x: 45,
      y: y - 20,
      width: width - 90,
      height: 25,
      color: lightGreenBg,
    });

    // Table Headers
    page.drawText("DESCRIPTION", {
      x: 50,
      y: y - 5,
      size: 10,
      font: boldFont,
      color: darkText,
    });

    const amountHeaderText = "AMOUNT";
    const amountHeaderSize = 10;
    const amountHeaderWidth = boldFont.widthOfTextAtSize(amountHeaderText, amountHeaderSize);
    
    page.drawText(amountHeaderText, {
      x: width - 50 - amountHeaderWidth,
      y: y - 5,
      size: amountHeaderSize,
      font: boldFont,
      color: darkText,
    });

    y -= 35;

    // Item Details
    const facilityName = `${invoiceDetails.facilities.name} - ${invoiceDetails.facilities.sports.name}`;
    page.drawText(facilityName, {
      x: 50,
      y: y,
      size: 11,
      font: boldFont,
      color: darkText,
    });

    const startDate = new Date(invoiceDetails.start_time);
    const endDate = new Date(invoiceDetails.end_time);
    const timeSlot = `${startDate.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    })} • ${startDate.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })} - ${endDate.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })}`;

    page.drawText(timeSlot, {
      x: 50,
      y: y - 16,
      size: 9,
      font: regularFont,
      color: lightText,
    });

    // Calculate original amount (before discount)
    const originalAmount = (invoiceDetails.total_amount || 0) + (invoiceDetails.discount_amount || 0);
    const originalAmountText = `Rs. ${originalAmount.toFixed(2)}`;
    const originalAmountSize = 11;
    const originalAmountWidth = regularFont.widthOfTextAtSize(originalAmountText, originalAmountSize);
    
    page.drawText(originalAmountText, {
      x: width - 50 - originalAmountWidth,
      y: y,
      size: originalAmountSize,
      font: regularFont,
      color: darkText,
    });

    y -= 50;

    // Divider line
    page.drawLine({
      start: { x: 50, y: y },
      end: { x: width - 50, y: y },
      thickness: 1,
      color: borderColor,
    });

    y -= 30;

    // --- Totals Section ---
    const labelX = width - 200;

    // Subtotal
    page.drawText("Subtotal:", {
      x: labelX,
      y: y,
      size: 11,
      font: regularFont,
      color: mediumText,
    });

    const subtotalText = `Rs. ${originalAmount.toFixed(2)}`;
    const subtotalSize = 11;
    const subtotalWidth = regularFont.widthOfTextAtSize(subtotalText, subtotalSize);

    page.drawText(subtotalText, {
      x: width - 50 - subtotalWidth,
      y: y,
      size: subtotalSize,
      font: regularFont,
      color: darkText,
    });

    y -= 20;

    // Discount (if applicable)
    if (invoiceDetails.discount_amount > 0) {
      page.drawText("Discount:", {
        x: labelX,
        y: y,
        size: 11,
        font: regularFont,
        color: mediumText,
      });

      const discountText = `- Rs. ${(invoiceDetails.discount_amount || 0).toFixed(2)}`;
      const discountSize = 11;
      const discountWidth = regularFont.widthOfTextAtSize(discountText, discountSize);

      page.drawText(discountText, {
        x: width - 50 - discountWidth,
        y: y,
        size: discountSize,
        font: regularFont,
        color: rgb(0.8, 0.2, 0.2),
      });

      y -= 25;
    } else {
      y -= 5;
    }

    // Total background with green
    page.drawRectangle({
      x: labelX - 10,
      y: y - 20,
      width: width - labelX - 30,
      height: 30,
      color: primaryGreen,
    });

    // Total Amount
    page.drawText("TOTAL PAID:", {
      x: labelX,
      y: y - 5,
      size: 12,
      font: boldFont,
      color: rgb(1, 1, 1),
    });

    const totalText = `Rs. ${(invoiceDetails.total_amount || 0).toFixed(2)}`;
    const totalSize = 13;
    const totalWidth = boldFont.widthOfTextAtSize(totalText, totalSize);

    page.drawText(totalText, {
      x: width - 50 - totalWidth,
      y: y - 5,
      size: totalSize,
      font: boldFont,
      color: rgb(1, 1, 1),
    });

    y -= 60;

    // --- Payment Status Badge ---
    const statusText = invoiceDetails.status === 'confirmed' ? 'PAID' : 'PENDING';
    const statusColor = invoiceDetails.status === 'confirmed' ? primaryGreen : rgb(0.8, 0.52, 0.25);
    
    page.drawRectangle({
      x: 50,
      y: y - 15,
      width: 80,
      height: 25,
      color: statusColor,
    });

    page.drawText(statusText, {
      x: 65,
      y: y - 5,
      size: 10,
      font: boldFont,
      color: rgb(1, 1, 1),
    });

    // --- Footer Section ---
    const footerY = 80;

    page.drawLine({
      start: { x: 50, y: footerY + 30 },
      end: { x: width - 50, y: footerY + 30 },
      thickness: 1,
      color: borderColorLight,
    });

    page.drawText("Thank you for choosing PlayNation!", {
      x: 50,
      y: footerY,
      size: 11,
      font: boldFont,
      color: darkText,
    });

    page.drawText("For any queries, please contact support@playnation.com", {
      x: 50,
      y: footerY - 18,
      size: 9,
      font: regularFont,
      color: mediumText,
    });

    page.drawText("This is a computer-generated invoice and does not require a signature.", {
      x: 50,
      y: footerY - 33,
      size: 8,
      font: regularFont,
      color: lightText,
    });

    // --- End PDF Drawing ---

    const pdfBytes = await pdfDoc.save();
    return new Response(pdfBytes, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="PlayNation-Invoice-${booking_id}.pdf"`,
      },
    });

  } catch (err) {
    console.error("Function Error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 
        ...corsHeaders,
        "Content-Type": "application/json"
      },
    });
  }
});