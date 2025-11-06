import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../AuthContext';
import { FiDownload, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function DownloadReportButton({ startDate, endDate, selectedVenueId }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!user) {
      toast.error("You must be logged in to download reports.");
      return;
    }
    setLoading(true);
    
    try {
      const venue_ids_param = selectedVenueId ? [selectedVenueId] : null;

      const { data, error } = await supabase.functions.invoke('generate-report', {
        body: {
          p_start_date: startDate,
          p_end_date: endDate,
          p_venue_ids: venue_ids_param,
        },
      });

      if (error) throw error;

      // Create a blob from the response and trigger download
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = startDate ? `report-${startDate}-to-${endDate}.pdf` : 'report-all-time.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error("Error generating report:", err);
      toast.error(err.message || "Failed to generate PDF report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="py-2 px-4 rounded-lg text-sm font-medium transition-colors bg-primary-green text-white hover:bg-primary-green-dark flex items-center gap-2 disabled:opacity-50"
    >
      {loading ? (
        <FiLoader className="animate-spin" />
      ) : (
        <FiDownload />
      )}
      <span>{loading ? 'Generating...' : 'Download PDF'}</span>
    </button>
  );
}