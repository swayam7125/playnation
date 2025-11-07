import { serve } from "std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";
import { corsHeaders } from "../_shared/cors.ts";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("Report generation started");
    const { format } = await req.json();
    console.log("Format requested:", format);

    console.log("Format requested:", format);

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      console.error("Missing environment variables");
      return new Response(
        JSON.stringify({ error: "Server configuration error: Missing environment variables" }), 
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    console.log("Initializing Supabase client");
    const supabase = createClient(
      supabaseUrl,
      supabaseAnonKey,
      { global: { headers: { Authorization: `Bearer ${supabaseServiceKey}` } } }
    );

    // Fetch data with error handling
    console.log("Fetching users count");
    const { count: totalUsers, error: usersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    if (usersError) {
      console.error("Error fetching users:", usersError);
      return new Response(
        JSON.stringify({ error: `Failed to fetch users: ${usersError.message}` }), 
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    console.log("Fetching venues count");
    const { count: totalVenues, error: venuesError } = await supabase
      .from('venues')
      .select('*', { count: 'exact', head: true });
    
    if (venuesError) {
      console.error("Error fetching venues:", venuesError);
      return new Response(
        JSON.stringify({ error: `Failed to fetch venues: ${venuesError.message}` }), 
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    console.log("Fetching bookings count");
    const { count: totalBookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true });
    
    if (bookingsError) {
      console.error("Error fetching bookings:", bookingsError);
      return new Response(
        JSON.stringify({ error: `Failed to fetch bookings: ${bookingsError.message}` }), 
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    console.log("Fetching revenue data");
    const { data: revenueData, error: revenueError } = await supabase
      .from('bookings')
      .select('total_amount')
      .eq('payment_status', 'paid');
    
    if (revenueError) {
      console.error("Error fetching revenue:", revenueError);
      return new Response(
        JSON.stringify({ error: `Failed to fetch revenue: ${revenueError.message}` }), 
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    const totalRevenue = revenueData?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0;

    console.log("Fetching recent bookings");
    const { data: recentBookings, error: recentBookingsError } = await supabase
      .from('bookings')
      .select('*, users!bookings_user_id_fkey(username), facilities(name, venues(name))')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (recentBookingsError) {
      console.error("Error fetching recent bookings:", recentBookingsError);
      return new Response(
        JSON.stringify({ error: `Failed to fetch recent bookings: ${recentBookingsError.message}` }), 
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    console.log("Fetching recent users");
    const { data: recentUsers, error: recentUsersError } = await supabase
      .from('users')
      .select('*')
      .order('registration_date', { ascending: false })
      .limit(10);
    
    if (recentUsersError) {
      console.error("Error fetching recent users:", recentUsersError);
      return new Response(
        JSON.stringify({ error: `Failed to fetch recent users: ${recentUsersError.message}` }), 
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    console.log("Data fetched successfully:", {
      totalUsers,
      totalVenues,
      totalBookings,
      totalRevenue,
      recentBookingsCount: recentBookings?.length || 0,
      recentUsersCount: recentUsers?.length || 0
    });

    if (format === 'pdf') {
      try {
        console.log("Starting PDF generation");
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595, 842]); // A4 size
        const { width, height } = page.getSize();
        
        // Fonts
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        
        // Colors
        const primaryGreen = rgb(0.063, 0.725, 0.506); // #10b981
        const darkGreen = rgb(0.02, 0.4, 0.286); // #059669
        const lightGreen = rgb(0.925, 0.992, 0.961); // #ecfdf5
        const darkText = rgb(0.067, 0.094, 0.153); // #111827
        const mediumText = rgb(0.216, 0.255, 0.318); // #374151
        const lightText = rgb(0.42, 0.447, 0.502); // #6b7280
        const borderColor = rgb(0.898, 0.906, 0.922); // #e5e7eb
        
        let y = height - 60;

        // Header Section with Background
        page.drawRectangle({
          x: 0,
          y: height - 120,
          width: width,
          height: 120,
          color: primaryGreen,
        });

        // Logo/Title
        page.drawText('PLAYNATION', {
          x: 50,
          y: height - 65,
          size: 28,
          font: boldFont,
          color: rgb(1, 1, 1),
        });

        page.drawText('Platform Analytics Report', {
          x: 50,
          y: height - 88,
          size: 14,
          font: font,
          color: rgb(1, 1, 1),
        });

        // Report Date
        const reportDate = new Date().toLocaleDateString('en-IN', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        page.drawText(`Generated: ${reportDate}`, {
          x: 50,
          y: height - 108,
          size: 10,
          font: font,
          color: rgb(0.9, 0.9, 0.9),
        });

        y = height - 160;

        // Statistics Cards Section
        page.drawText('Key Metrics Overview', {
          x: 50,
          y,
          size: 16,
          font: boldFont,
          color: darkText,
        });
        y -= 25;

        // Draw 4 metric cards in a grid
        const cardWidth = 120;
        const cardHeight = 70;
        const cardSpacing = 15;
        const startX = 50;

        const metrics = [
          { label: 'Total Users', value: totalUsers || 0 },
          { label: 'Total Venues', value: totalVenues || 0 },
          { label: 'Total Bookings', value: totalBookings || 0 },
          { label: 'Revenue (INR)', value: totalRevenue.toLocaleString('en-IN') },
        ];

        metrics.forEach((metric, index) => {
          const cardX = startX + (index * (cardWidth + cardSpacing));
          
          // Card background
          page.drawRectangle({
            x: cardX,
            y: y - cardHeight,
            width: cardWidth,
            height: cardHeight,
            color: lightGreen,
            borderColor: primaryGreen,
            borderWidth: 1,
          });

          // Value
          page.drawText(String(metric.value), {
            x: cardX + 10,
            y: y - 30,
            size: 18,
            font: boldFont,
            color: darkGreen,
          });

          // Label
          page.drawText(metric.label, {
            x: cardX + 10,
            y: y - 50,
            size: 9,
            font: font,
            color: mediumText,
          });
        });

        y -= cardHeight + 40;

        // Recent Bookings Section
        page.drawText('Recent Bookings', {
          x: 50,
          y,
          size: 16,
          font: boldFont,
          color: darkText,
        });
        y -= 10;

        // Horizontal line
        page.drawLine({
          start: { x: 50, y },
          end: { x: width - 50, y },
          thickness: 1,
          color: borderColor,
        });
        y -= 15;

        // Table header
        const tableStartY = y;
        page.drawRectangle({
          x: 50,
          y: y - 20,
          width: width - 100,
          height: 20,
          color: lightGreen,
        });

        page.drawText('Venue', { x: 60, y: y - 15, size: 10, font: boldFont, color: darkText });
        page.drawText('Customer', { x: 200, y: y - 15, size: 10, font: boldFont, color: darkText });
        page.drawText('Date', { x: 340, y: y - 15, size: 10, font: boldFont, color: darkText });
        y -= 25;

        // Table rows
        const bookingsToShow = recentBookings?.slice(0, 8) || [];
        bookingsToShow.forEach((b, index) => {
          const rowY = y - (index * 18);
          
          // Alternating row background
          if (index % 2 === 0) {
            page.drawRectangle({
              x: 50,
              y: rowY - 15,
              width: width - 100,
              height: 18,
              color: rgb(0.98, 0.98, 0.98),
            });
          }

          const venueName = b.facilities?.venues?.name || 'N/A';
          const userName = b.users?.username || 'N/A';
          const bookingDate = new Date(b.start_time).toLocaleDateString('en-IN');

          page.drawText(venueName.substring(0, 25), { 
            x: 60, 
            y: rowY - 12, 
            size: 9, 
            font: font, 
            color: mediumText 
          });
          page.drawText(userName.substring(0, 20), { 
            x: 200, 
            y: rowY - 12, 
            size: 9, 
            font: font, 
            color: mediumText 
          });
          page.drawText(bookingDate, { 
            x: 340, 
            y: rowY - 12, 
            size: 9, 
            font: font, 
            color: mediumText 
          });
        });

        y -= (bookingsToShow.length * 18) + 30;

        // Recent Users Section
        if (y > 200) {
          page.drawText('Recent Users', {
            x: 50,
            y,
            size: 16,
            font: boldFont,
            color: darkText,
          });
          y -= 10;

          // Horizontal line
          page.drawLine({
            start: { x: 50, y },
            end: { x: width - 50, y },
            thickness: 1,
            color: borderColor,
          });
          y -= 15;

          // Table header
          page.drawRectangle({
            x: 50,
            y: y - 20,
            width: width - 100,
            height: 20,
            color: lightGreen,
          });

          page.drawText('Username', { x: 60, y: y - 15, size: 10, font: boldFont, color: darkText });
          page.drawText('Email', { x: 200, y: y - 15, size: 10, font: boldFont, color: darkText });
          page.drawText('Registration Date', { x: 380, y: y - 15, size: 10, font: boldFont, color: darkText });
          y -= 25;

          // Table rows
          const usersToShow = recentUsers?.slice(0, 8) || [];
          usersToShow.forEach((u, index) => {
            const rowY = y - (index * 18);
            
            // Alternating row background
            if (index % 2 === 0) {
              page.drawRectangle({
                x: 50,
                y: rowY - 15,
                width: width - 100,
                height: 18,
                color: rgb(0.98, 0.98, 0.98),
              });
            }

            const username = u.username || 'N/A';
            const email = u.email || 'N/A';
            const regDate = new Date(u.registration_date).toLocaleDateString('en-IN');

            page.drawText(username.substring(0, 20), { 
              x: 60, 
              y: rowY - 12, 
              size: 9, 
              font: font, 
              color: mediumText 
            });
            page.drawText(email.substring(0, 25), { 
              x: 200, 
              y: rowY - 12, 
              size: 9, 
              font: font, 
              color: mediumText 
            });
            page.drawText(regDate, { 
              x: 380, 
              y: rowY - 12, 
              size: 9, 
              font: font, 
              color: mediumText 
            });
          });
        }

        // Footer
        page.drawLine({
          start: { x: 50, y: 60 },
          end: { x: width - 50, y: 60 },
          thickness: 0.5,
          color: borderColor,
        });

        page.drawText('PlayNation Platform - Confidential Report', {
          x: 50,
          y: 45,
          size: 8,
          font: font,
          color: lightText,
        });

        page.drawText(`Page 1 of 1`, {
          x: width - 100,
          y: 45,
          size: 8,
          font: font,
          color: lightText,
        });

        const pdfBytes = await pdfDoc.save();
        console.log("PDF generated successfully, size:", pdfBytes.length, "bytes");
        return new Response(pdfBytes, { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="PlayNation-Report-${new Date().toISOString().split('T')[0]}.pdf"`
          } 
        });
      } catch (e) {
        console.error("PDF generation error:", e);
        console.error("Error stack:", e.stack);
        return new Response(JSON.stringify({ 
          error: `PDF generation failed: ${e.message}`,
          details: e.stack,
          type: e.name 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }
    } else {
      // CSV Generation
      const csvRows = [];
      csvRows.push('Report Type,Value');
      csvRows.push(`Total Users,${totalUsers || 0}`);
      csvRows.push(`Total Venues,${totalVenues || 0}`);
      csvRows.push(`Total Bookings,${totalBookings || 0}`);
      csvRows.push(`Total Revenue (INR),${totalRevenue.toLocaleString('en-IN')}`);
      csvRows.push('');
      csvRows.push('Recent Bookings');
      csvRows.push('Venue,Customer,Date');
      recentBookings?.forEach(b => {
        csvRows.push(`${b.facilities?.venues?.name || 'N/A'},${b.users?.username || 'N/A'},${new Date(b.start_time).toLocaleDateString()}`);
      });
      csvRows.push('');
      csvRows.push('Recent Users');
      csvRows.push('Username,Email,Registration Date');
      recentUsers?.forEach(u => {
        csvRows.push(`${u.username || 'N/A'},${u.email || 'N/A'},${new Date(u.registration_date).toLocaleDateString()}`);
      });

      const csv = csvRows.join('\n');
      return new Response(csv, { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="PlayNation-Report-${new Date().toISOString().split('T')[0]}.csv"`
        } 
      }      );
    }

  } catch (error) {
    console.error("Main error handler:", error);
    console.error("Error stack:", error.stack);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.stack,
      type: error.name 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});