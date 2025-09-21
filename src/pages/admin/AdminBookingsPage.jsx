import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../../supabaseClient';
import { 
    FaSearch, 
    FaRedo, 
    FaFilter, 
    FaCalendarAlt, // Used for StatsCard props
    FaRupeeSign,   // Used for StatsCard props
    FaDownload,    // Used in Export button
    FaTimes,       // Used in Clear Filters button
    FaClock        // Used for StatsCard props and Footer display
} from 'react-icons/fa';
import { useModal } from '../../ModalContext';

// --- Import Reusable Components & Utilities ---
import StatsCard from '../../components/common/StatsCard'; 
import BookingRow from '../../components/admin/BookingRow'; 
import FilterPanel from '../../components/admin/FilterPanel'; 
import { LoadingSpinner, ErrorState } from '../../components/common/LoadingAndError'; 
import { formatTimestamp } from '../../utils/formatters'; 
// --- End Imports ---

function AdminBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        status: '',
        paymentStatus: '',
        dateFrom: '',
        dateTo: ''
    });
    const { showModal } = useModal();

    // Helper function used in modal and export (uses external formatTimestamp)
    const safeFormatTimestampForModal = (timestamp) => {
        return formatTimestamp(timestamp, true); 
    };

    /**
     * Data Fetching Logic (Core Logic)
     */
    const fetchBookings = useCallback(async (currentSearchTerm, currentFilters = {}) => {
        setLoading(true);
        setError(null);
        try {
            let query = supabase
                .from('bookings')
                .select(`
                    *,
                    users:bookings_user_id_fkey(username, email, phone_number),
                    facilities(
                        name,
                        venues(name, address, city)
                    )
                `)
                .order('booking_date', { ascending: false });

            // Apply Server-Side Search Filter (optimized)
            if (currentSearchTerm && currentSearchTerm.trim()) {
                const searchPattern = `%${currentSearchTerm.toLowerCase()}%`;
                query = query.or(
                    `facilities.venues.name.ilike.${searchPattern},facilities.name.ilike.${searchPattern},users.username.ilike.${searchPattern},users.email.ilike.${searchPattern}`
                );
            }

            // Apply filters
            if (currentFilters.status) { query = query.eq('status', currentFilters.status); }
            if (currentFilters.paymentStatus) { query = query.eq('payment_status', currentFilters.paymentStatus); }
            if (currentFilters.dateFrom) { query = query.gte('booking_date', currentFilters.dateFrom); }
            if (currentFilters.dateTo) { query = query.lte('booking_date', currentFilters.dateTo); }

            const { data, error } = await query;
            if (error) throw error;
            setBookings(data || []);
        } catch (err) {
            console.error('Error fetching bookings:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounce Fetching
    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchBookings(searchTerm, filters);
        }, 300);
        return () => clearTimeout(timeout);
    }, [searchTerm, filters, fetchBookings]);

    /**
     * Statistics Calculation - FIX APPLIED HERE
     */
    const stats = useMemo(() => {
        const paidBookings = bookings.filter(b => b.payment_status === 'paid');
        
        // FIX: Ensure total_amount is parsed as float for correct summation
        const totalRevenue = paidBookings.reduce((sum, b) => sum + parseFloat(b.total_amount || 0), 0);
        const today = new Date().toDateString();

        const monthlyRevenue = bookings.filter(b => {
            const date = new Date(b.booking_date);
            return date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear() && b.payment_status === 'paid';
        }).reduce((sum, b) => sum + parseFloat(b.total_amount || 0), 0); // FIX: Ensure parsing

        return {
            totalBookings: bookings.length,
            totalRevenue: totalRevenue,
            pendingRefunds: bookings.filter(b => b.payment_status === 'pending_refund').length,
            completedBookings: bookings.filter(b => b.status === 'completed').length,
            todayBookings: bookings.filter(b => new Date(b.booking_date).toDateString() === today).length,
            monthlyRevenue: monthlyRevenue,
        };
    }, [bookings]);

    /**
     * Action Handlers
     */
    const handleRefundAction = async (bookingId, newPaymentStatus) => {
        const action = newPaymentStatus === 'refunded' ? 'Approve Refund' : 'Revert Refund';
        const isConfirmed = await showModal({
            title: `Confirm ${action}`,
            message: `Are you sure you want to ${action.toLowerCase()} for booking ID: ${bookingId}?`,
            confirmText: `Yes, ${action}`,
            confirmStyle: newPaymentStatus === 'refunded' ? "success" : "warning"
        });

        if (isConfirmed) {
            try {
                const { error } = await supabase
                    .from('bookings')
                    .update({ payment_status: newPaymentStatus, updated_at: new Date().toISOString() })
                    .eq('booking_id', bookingId);
                
                if (error) throw error;
                await showModal({ title: "Success", message: `${action} completed successfully.`, showCancel: false });
                fetchBookings(searchTerm, filters);
            } catch (err) {
                await showModal({ title: "Error", message: `Failed to ${action.toLowerCase()}: ${err.message}`, showCancel: false });
            }
        }
    };

    const handleViewDetails = (booking) => {
        const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const formatTime = (time) => new Date(time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

        showModal({
            title: `Booking Details - ${booking.booking_id}`,
            message: `
📍 VENUE INFORMATION:
   • Venue: ${booking.facilities?.venues?.name || 'N/A'}
   • Facility: ${booking.facilities?.name || 'N/A'}
   • Address: ${booking.facilities?.venues?.address || 'N/A'}${booking.facilities?.venues?.city ? `, ${booking.facilities.venues.city}` : ''}

👤 USER INFORMATION:
   • Name: ${booking.users?.username || 'N/A'}
   • Email: ${booking.users?.email || 'N/A'}
   • Phone: ${booking.users?.phone_number || 'N/A'}

📅 BOOKING INFORMATION:
   • Date: ${formatDate(booking.booking_date)}
   • Time: ${formatTime(booking.start_time)} - ${formatTime(booking.end_time)}
   • Duration: ${((new Date(booking.end_time) - new Date(booking.start_time)) / (1000 * 60 * 60)).toFixed(1)} hours
   • Amount: ₹${booking.total_amount?.toLocaleString('en-IN') || '0'}

📊 STATUS INFORMATION:
   • Booking Status: ${booking.status?.toUpperCase() || 'N/A'}
   • Payment Status: ${booking.payment_status?.replace('_', ' ').toUpperCase() || 'N/A'}
   • Payment Method: ${booking.payment_method || 'Online Payment'}
   • Created: ${safeFormatTimestampForModal(booking.booking_date)}
            `,
            showCancel: false,
            confirmText: "Close"
        });
    };

    const toggleRowExpansion = (bookingId) => {
        setExpandedRows(prev => {
            const newSet = new Set(prev);
            newSet.has(bookingId) ? newSet.delete(bookingId) : newSet.add(bookingId);
            return newSet;
        });
    };

    const handleExportData = () => {
        try {
            const csv = [
                ['Booking ID', 'Venue', 'Facility', 'User', 'Email', 'Phone', 'Date', 'Start Time', 'End Time', 'Duration (Hours)', 'Amount', 'Status', 'Payment Status', 'Payment Method', 'Created At', 'Notes'],
                ...bookings.map(booking => [
                    booking.booking_id || '', booking.facilities?.venues?.name || '', booking.facilities?.name || '', booking.users?.username || '', booking.users?.email || '', booking.users?.phone_number || '',
                    new Date(booking.booking_date).toLocaleDateString('en-IN'), new Date(booking.start_time).toLocaleTimeString('en-IN'), new Date(booking.end_time).toLocaleTimeString('en-IN'),
                    ((new Date(booking.end_time) - new Date(booking.start_time)) / (1000 * 60 * 60)).toFixed(1),
                    booking.total_amount || 0, booking.status || '', booking.payment_status || '', booking.payment_method || 'Online Payment',
                    safeFormatTimestampForModal(booking.booking_date),
                    booking.notes || ''
                ])
            ].map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')).join('\n');

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const a = document.createElement('a');
            a.setAttribute('hidden', '');
            a.setAttribute('href', window.URL.createObjectURL(blob));
            a.setAttribute('download', `bookings-export-${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(a.href);

            showModal({ title: "Export Successful", message: `Successfully exported ${bookings.length} booking records to CSV format.`, showCancel: false, confirmText: "Close" });
        } catch (err) {
            showModal({ title: "Export Error", message: `Failed to export data: ${err.message}`, showCancel: false, confirmText: "Close" });
        }
    };

    const clearFilters = () => {
        setFilters({ status: '', paymentStatus: '', dateFrom: '', dateTo: '' });
        setSearchTerm('');
        setExpandedRows(new Set());
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorState error={error} onRetry={() => fetchBookings(searchTerm, filters)} />;

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-dark-text">Booking Management</h1>
                    <p className="text-medium-text mt-2">Monitor and manage all venue bookings</p>
                </div>
                <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                    <button onClick={handleExportData} disabled={bookings.length === 0} className="px-4 py-2.5 bg-card-bg border border-border-color text-medium-text hover:text-primary-green hover:border-primary-green disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 flex items-center space-x-2">
                        <FaDownload className="text-sm" /><span>Export ({bookings.length})</span>
                    </button>
                    <button onClick={() => fetchBookings(searchTerm, filters)} className="px-4 py-2.5 bg-primary-green text-white hover:bg-primary-green-dark rounded-lg transition-all duration-200 flex items-center space-x-2">
                        <FaRedo className="text-sm" /><span>Refresh</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard 
                    title="Total Bookings" 
                    value={stats.totalBookings.toLocaleString()} 
                    icon={FaCalendarAlt} 
                    color="primary-green" 
                    subtitle={`${stats.todayBookings} today`} 
                />
                <StatsCard 
                    title="Total Revenue" 
                    value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`} 
                    icon={FaRupeeSign} 
                    color="primary-green" 
                    subtitle={`₹${stats.monthlyRevenue.toLocaleString('en-IN')} this month`} 
                />
                <StatsCard 
                    title="Completed" 
                    value={stats.completedBookings.toLocaleString()} 
                    icon={FaClock} 
                    color="primary-green" 
                    subtitle={`${((stats.completedBookings / Math.max(stats.totalBookings, 1)) * 100).toFixed(1)}% completion rate`} 
                />
                <StatsCard 
                    title="Pending Refunds" 
                    value={stats.pendingRefunds.toLocaleString()} 
                    icon={FaClock} 
                    color="orange-600" 
                    subtitle={stats.pendingRefunds > 0 ? "Requires attention" : "All clear"} 
                />
            </div>

            {/* Main Content Card */}
            <div className="bg-card-bg rounded-2xl shadow-lg border border-border-color-light">
                {/* Search and Filters Header */}
                <div className="p-6 border-b border-border-color-light">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="relative flex-1 max-w-md">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-light-text" />
                            <input type="text" placeholder="Search venues, users, emails..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-hover-bg border border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-primary-green transition-all duration-200" />
                        </div>
                        <div className="flex items-center space-x-3">
                            <button onClick={() => setShowFilters(!showFilters)} className={`px-4 py-2.5 rounded-xl border transition-all duration-200 flex items-center space-x-2 ${showFilters ? 'bg-primary-green text-white border-primary-green' : 'bg-card-bg border-border-color text-medium-text hover:border-primary-green hover:text-primary-green'}`}>
                                <FaFilter className="text-sm" /><span>Filters</span>
                                {Object.values(filters).some(f => f) && (<span className="bg-white text-primary-green text-xs px-1.5 py-0.5 rounded-full font-medium">{Object.values(filters).filter(f => f).length}</span>)}
                            </button>
                            {(filters.status || filters.paymentStatus || filters.dateFrom || filters.dateTo || searchTerm) && (<button onClick={clearFilters} className="px-3 py-2.5 text-light-text hover:text-medium-text rounded-xl hover:bg-hover-bg transition-all duration-200" title="Clear all filters"><FaTimes /></button>)}
                        </div>
                    </div>
                </div>

                {/* Filters Panel */}
                <FilterPanel filters={filters} onFiltersChange={setFilters} onClear={clearFilters} isOpen={showFilters} onToggle={() => setShowFilters(!showFilters)} />

                {/* Table Container */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border-color-light">
                        <thead className="bg-hover-bg">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-dark-text uppercase tracking-wider">Venue & Facility</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-dark-text uppercase tracking-wider">User Details</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-dark-text uppercase tracking-wider">Booking Time</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-dark-text uppercase tracking-wider">Amount</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-dark-text uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-dark-text uppercase tracking-wider">Payment</th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-dark-text uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-card-bg divide-y divide-border-color-light">
                            {bookings.map(booking => (
                                <BookingRow
                                    key={booking.booking_id}
                                    booking={booking}
                                    onRefundAction={handleRefundAction}
                                    onViewDetails={handleViewDetails}
                                    isExpanded={expandedRows.has(booking.booking_id)}
                                    onToggleExpand={() => toggleRowExpansion(booking.booking_id)}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {bookings.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">📅</div>
                        <h3 className="text-xl font-semibold text-dark-text mb-2">No bookings found</h3>
                        <p className="text-medium-text mb-6 max-w-md mx-auto">
                            {searchTerm || Object.values(filters).some(f => f) 
                                ? "We couldn't find any bookings matching your search criteria. Try adjusting your filters or search terms." 
                                : "No bookings have been made yet. Once customers start booking venues, they'll appear here."}
                        </p>
                        {(searchTerm || Object.values(filters).some(f => f)) && (
                            <button onClick={clearFilters} className="px-6 py-3 bg-primary-green text-white rounded-lg hover:bg-primary-green-dark transition-colors duration-200">Clear All Filters</button>
                        )}
                    </div>
                )}

                {/* Footer with pagination info */}
                {bookings.length > 0 && (
                    <div className="px-6 py-4 border-t border-border-color-light">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                            <div className="flex items-center space-x-2 text-sm text-medium-text">
                                <span>Showing</span>
                                <span className="font-semibold text-dark-text">{bookings.length}</span>
                                <span>{bookings.length === 1 ? 'booking' : 'bookings'}{(searchTerm || Object.values(filters).some(f => f)) && ' (filtered)'}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2 text-sm text-medium-text">
                                    <FaClock className="text-primary-green" />
                                    <span>Last updated:</span>
                                    <span className="font-medium text-dark-text">
                                        {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                {expandedRows.size > 0 && (
                                    <button onClick={() => setExpandedRows(new Set())} className="text-xs text-light-text hover:text-medium-text px-2 py-1 rounded hover:bg-hover-bg transition-all duration-200">Collapse All ({expandedRows.size})</button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-card-bg rounded-2xl shadow-lg border border-border-color-light p-6">
                <h2 className="text-xl font-semibold text-dark-text mb-4 flex items-center"><span className="mr-2">⚡</span>Quick Actions & Insights</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border border-border-color rounded-xl hover:border-primary-green hover:bg-light-green-bg transition-all duration-200 cursor-pointer group">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                                <span className="text-orange-600 text-lg">⏰</span>
                            </div>
                            <div>
                                <h3 className="font-medium text-dark-text">Pending Refunds</h3>
                                <p className="text-sm text-medium-text">{stats.pendingRefunds} {stats.pendingRefunds === 1 ? 'request' : 'requests'} awaiting approval</p>
                                {stats.pendingRefunds > 0 && (<button onClick={() => setFilters({...filters, paymentStatus: 'pending_refund'})} className="text-xs text-primary-green hover:text-primary-green-dark mt-1">View pending refunds →</button>)}
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border border-border-color rounded-xl hover:border-primary-green hover:bg-light-green-bg transition-all duration-200 cursor-pointer group">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                <FaCalendarAlt className="text-blue-600 text-lg" />
                            </div>
                            <div>
                                <h3 className="font-medium text-dark-text">Today's Bookings</h3>
                                <p className="text-sm text-medium-text">{stats.todayBookings} {stats.todayBookings === 1 ? 'booking' : 'bookings'} scheduled for today</p>
                                {stats.todayBookings > 0 && (<button onClick={() => { const today = new Date().toISOString().split('T')[0]; setFilters({...filters, dateFrom: today, dateTo: today}); }} className="text-xs text-primary-green hover:text-primary-green-dark mt-1">View today's bookings →</button>)}
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border border-border-color rounded-xl hover:border-primary-green hover:bg-light-green-bg transition-all duration-200 cursor-pointer group">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                                <FaRupeeSign className="text-primary-green text-lg" />
                            </div>
                            <div>
                                <h3 className="font-medium text-dark-text">Monthly Revenue</h3>
                                <p className="text-sm text-medium-text">₹{stats.monthlyRevenue.toLocaleString('en-IN')} earned this month</p>
                                <p className="text-xs text-light-text mt-1">{((stats.monthlyRevenue / Math.max(stats.totalRevenue, 1)) * 100).toFixed(1)}% of total revenue</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminBookingsPage;