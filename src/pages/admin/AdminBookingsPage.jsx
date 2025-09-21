import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../supabaseClient';
import { FaSearch, FaFilter, FaRedo, FaUndo } from 'react-icons/fa';
import { useModal } from '../../ModalContext';

const BookingRow = ({ booking, onRefundAction }) => {
    const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const formatTime = (time) => new Date(time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const statusClasses = {
        confirmed: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    const paymentStatusClasses = {
        paid: 'bg-green-100 text-green-800',
        refunded: 'bg-yellow-100 text-yellow-800',
        pending_refund: 'bg-orange-100 text-orange-800'
    };

    return (
        <tr className="border-b border-border-color-light hover:bg-hover-bg">
            <td className="px-6 py-4">
                <div className="text-sm font-semibold text-dark-text">{booking.facilities.venues.name}</div>
                <div className="text-xs text-light-text">{booking.facilities.name}</div>
            </td>
            <td className="px-6 py-4">
                <div className="text-sm font-semibold text-dark-text">{booking.users.username}</div>
                <div className="text-xs text-light-text">{booking.users.email}</div>
            </td>
            <td className="px-6 py-4 text-sm text-medium-text">
                {formatDate(booking.booking_date)} at {formatTime(booking.start_time)}
            </td>
            <td className="px-6 py-4 text-sm font-bold text-dark-text">₹{booking.total_amount}</td>
            <td className="px-6 py-4">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[booking.status]}`}>
                    {booking.status}
                </span>
            </td>
            <td className="px-6 py-4">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${paymentStatusClasses[booking.payment_status]}`}>
                    {booking.payment_status.replace('_', ' ')}
                </span>
            </td>
            <td className="px-6 py-4 text-right">
                {booking.status === 'cancelled' && booking.payment_status === 'paid' && (
                    <button onClick={() => onRefundAction(booking.booking_id, 'refunded')} className="text-sm font-medium text-primary-green hover:text-primary-green-dark flex items-center gap-2">
                        <FaRedo /> Approve Refund
                    </button>
                )}
                 {booking.payment_status === 'refunded' && (
                    <button onClick={() => onRefundAction(booking.booking_id, 'paid')} className="text-sm font-medium text-yellow-600 hover:text-yellow-800 flex items-center gap-2">
                        <FaUndo /> Revert Refund
                    </button>
                )}
            </td>
        </tr>
    );
};


function AdminBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { showModal } = useModal();

    const fetchBookings = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('bookings')
                // --- MODIFIED: Removed brittle foreign key constraint name ---
                .select(`
                    *, 
                    users(username, email), 
                    facilities(*, venues(*))
                `)
                .order('booking_date', { ascending: false }); 
            
            if (error) throw error;
            setBookings(data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);
    
    const handleRefundAction = async (bookingId, newPaymentStatus) => {
        const action = newPaymentStatus === 'refunded' ? 'Approve Refund' : 'Revert Refund';
        const isConfirmed = await showModal({
            title: `Confirm Action`,
            message: `Are you sure you want to ${action.toLowerCase()} for this booking?`,
            confirmText: `Yes, ${action}`,
            confirmStyle: newPaymentStatus === 'refunded' ? "success" : "warning"
        });

        if (isConfirmed) {
            try {
                const { error } = await supabase
                    .from('bookings')
                    .update({ payment_status: newPaymentStatus })
                    .eq('booking_id', bookingId);
                if (error) throw error;
                await showModal({ title: "Success", message: `Action completed successfully.` });
                fetchBookings();
            } catch (err) {
                 await showModal({ title: "Error", message: `Failed to update booking: ${err.message}` });
            }
        }
    };

    const filteredBookings = useMemo(() => {
        if (!searchTerm) return bookings;
        const lowerCaseSearch = searchTerm.toLowerCase();
        return bookings.filter(b =>
            (b.facilities?.venues?.name || '').toLowerCase().includes(lowerCaseSearch) ||
            (b.users?.username || '').toLowerCase().includes(lowerCaseSearch) ||
            (b.users?.email || '').toLowerCase().includes(lowerCaseSearch)
        );
    }, [bookings, searchTerm]);

    if (loading) return <p className="container mx-auto text-center p-12">Loading bookings...</p>;
    if (error) return <p className="container mx-auto text-center text-red-600 p-12">Error: {error}</p>;

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-dark-text mb-8">Manage Bookings</h1>
            <div className="bg-card-bg p-6 rounded-2xl shadow-lg border border-border-color-light">
                <div className="relative mb-4">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-light-text" />
                    <input
                        type="text"
                        placeholder="Search by venue, user, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-hover-bg border border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border-color-light">
                        <thead className="bg-hover-bg">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-dark-text uppercase tracking-wider">Venue</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-dark-text uppercase tracking-wider">User</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-dark-text uppercase tracking-wider">Booking Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-dark-text uppercase tracking-wider">Amount</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-dark-text uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-dark-text uppercase tracking-wider">Payment</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-card-bg divide-y divide-border-color-light">
                            {filteredBookings.map(booking => <BookingRow key={booking.booking_id} booking={booking} onRefundAction={handleRefundAction} />)}
                        </tbody>
                    </table>
                </div>
                 {filteredBookings.length === 0 && (
                    <p className="text-center py-8 text-medium-text">No bookings found.</p>
                )}
            </div>
        </div>
    );
}

export default AdminBookingsPage;