import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Adjust for production
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const getChartUrl = (data) => {
  const labels = data.map(d => d.name);
  const revenueData = data.map(d => d.revenue);
  const bookingData = data.map(d => d.bookings);

  const chartConfig = {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Revenue',
        data: revenueData,
      }]
    }
  };

  const pieChartConfig = {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        label: 'Bookings',
        data: bookingData,
        backgroundColor: ['#059669', '#047857', '#065f46', '#064e3b', '#023020'],
      }]
    }
  };

  const encodedConfig = encodeURIComponent(JSON.stringify(chartConfig));
  const encodedPieConfig = encodeURIComponent(JSON.stringify(pieChartConfig));

  return {
    barChartUrl: `https://quickchart.io/chart?c=${encodedConfig}`,
    pieChartUrl: `https://quickchart.io/chart?c=${encodedPieConfig}`
  };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { p_start_date, p_end_date, p_venue_ids } = await req.json();

    const { data: reportData, error: reportError } = await supabaseClient.rpc('get_owner_report_stats', {
      p_owner_id: user.id,
      p_start_date: p_start_date || null,
      p_end_date: p_end_date || null,
      p_venue_ids: p_venue_ids || null,
    });

    if (reportError) throw reportError;

    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let y = height - 50;

    page.drawText('PlayNation Venue Report', {
      x: 50,
      y,
      font: boldFont,
      size: 24,
      color: rgb(0.019, 0.592, 0.353),
    });
    y -= 30;

    const dateRangeText = p_start_date && p_end_date ? `Date Range: ${p_start_date} to ${p_end_date}` : 'Date Range: All Time';
    page.drawText(dateRangeText, { x: 50, y, font, size: 12, color: rgb(0.4, 0.4, 0.4) });
    y -= 40;

    // Summary Stats
    page.drawText('Summary', { x: 50, y, font: boldFont, size: 18, color: rgb(0.023, 0.4, 0.227) });
    y -= 25;

    const stats = [
      { label: 'Total Revenue', value: `Rs. ${reportData.total_revenue.toFixed(2)}` },
      { label: 'Total Bookings', value: reportData.total_bookings },
      { label: 'Avg. Booking Value', value: `Rs. ${reportData.avg_booking_value.toFixed(2)}` },
    ];

    stats.forEach(stat => {
      page.drawText(`${stat.label}: ${stat.value}`, { x: 60, y, font, size: 12 });
      y -= 20;
    });
    y -= 20;

    // Venue Details Table
    page.drawText('Revenue by Venue', { x: 50, y, font: boldFont, size: 18, color: rgb(0.023, 0.4, 0.227) });
    y -= 25;

    const table = {
      x: 50,
      y,
      colWidths: [250, 100, 150],
      header: ['Venue', 'Bookings', 'Revenue'],
    };

    page.drawText(table.header[0], { x: table.x, y: table.y, font: boldFont, size: 12 });
    page.drawText(table.header[1], { x: table.x + table.colWidths[0], y: table.y, font: boldFont, size: 12 });
    page.drawText(table.header[2], { x: table.x + table.colWidths[0] + table.colWidths[1], y: table.y, font: boldFont, size: 12 });
    y -= 20;

    reportData.venue_revenue.forEach(venue => {
      if (y < 50) {
        page = pdfDoc.addPage();
        y = height - 50;
      }
      page.drawText(venue.name, { x: table.x, y, font, size: 10 });
      page.drawText(venue.bookings.toString(), { x: table.x + table.colWidths[0], y, font, size: 10 });
      page.drawText(`Rs. ${venue.revenue.toFixed(2)}`, { x: table.x + table.colWidths[0] + table.colWidths[1], y, font, size: 10 });
      y -= 20;
    });

    // Generate and embed charts
    if (reportData.venue_revenue && reportData.venue_revenue.length > 0) {
      const { barChartUrl, pieChartUrl } = getChartUrl(reportData.venue_revenue);

      const barChartImageBytes = await fetch(barChartUrl).then(res => res.arrayBuffer());
      const pieChartImageBytes = await fetch(pieChartUrl).then(res => res.arrayBuffer());

      const barChartImage = await pdfDoc.embedPng(barChartImageBytes);
      const pieChartImage = await pdfDoc.embedPng(pieChartImageBytes);

      const chartPage = pdfDoc.addPage();
      chartPage.drawText('Visualizations', { x: 50, y: height - 50, font: boldFont, size: 18, color: rgb(0.023, 0.4, 0.227) });
      chartPage.drawImage(barChartImage, {
        x: 50,
        y: height - 350,
        width: 500,
        height: 250,
      });
      chartPage.drawImage(pieChartImage, {
        x: 50,
        y: height - 650,
        width: 500,
        height: 250,
      });
    }

    const pdfBytes = await pdfDoc.save();

    return new Response(pdfBytes, {
      headers: { ...corsHeaders, 'Content-Type': 'application/pdf' },
    });

  } catch (error) {
    console.error('Error generating report:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
