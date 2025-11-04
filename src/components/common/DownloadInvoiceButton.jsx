import React from 'react';
import { Download } from 'lucide-react';
import { useInvoiceDownloader } from '../../hooks/useInvoiceDownloader';

/**
 * A reusable button for downloading an invoice.
 * @param {object} props
 * @param {string} props.bookingId - The UUID of the booking.
 */
const DownloadInvoiceButton = ({ bookingId }) => {
  const { isDownloading, downloadInvoice } = useInvoiceDownloader();

  const handleClick = (e) => {
    e.stopPropagation(); // Prevents clicking the row/card behind it
    e.preventDefault();
    downloadInvoice(bookingId);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDownloading}
      className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 whitespace-nowrap bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title="Download Invoice"
    >
      <Download size={16} />
      {isDownloading ? 'Generating...' : 'Download Invoice'}
    </button>
  );
};

export default DownloadInvoiceButton;