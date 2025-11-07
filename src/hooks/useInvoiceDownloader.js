import { useState } from 'react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

/**
 * Hook to handle downloading a booking invoice.
 * @returns {object} - An object containing:
 * - {function} downloadInvoice - Function to call with a bookingId.
 * - {boolean} isDownloading - State to track if a download is in progress.
 */
export function useInvoiceDownloader() {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadInvoice = async (bookingId) => {
    if (isDownloading) return;
    setIsDownloading(true);
    toast.loading('Generating your invoice...');

    try {
      // 1. Invoke the Edge Function you created
      const { data, error } = await supabase.functions.invoke('generate-invoice', {
        body: { booking_id: bookingId },
      });

      if (error) {
        console.error("Full error object from Edge Function:", error); // Log the full error
        const edgeFunctionError = error.context?.body?.error || error.message;
        throw new Error(edgeFunctionError);
      }

      // 2. Create a Blob from the returned PDF data
      // The Edge Function should return the raw PDF bytes (ArrayBuffer)
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      // 3. Create a temporary link to trigger the browser download
      const a = document.createElement('a');
      a.href = url;
      a.download = `PlayNation-Invoice-${bookingId}.pdf`;
      document.body.appendChild(a);
      a.click();

      // 4. Clean up the temporary link and URL
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.dismiss();
      toast.success('Invoice downloaded!');

    } catch (err) {
      console.error('Invoice download error:', err);
      toast.dismiss();
      toast.error(`Download failed: ${err.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return { isDownloading, downloadInvoice };
}