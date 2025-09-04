import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useModal } from '../../ModalContext';

function AdminVenueManagementPage() {
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { showModal } = useModal();

    const fetchAllVenues = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('venues')
                .select(`*, users (username, email)`)
                .order('created_at', { ascending: false });
            if (error) throw error;
            setVenues(data || []);
        } catch (err) {
            setError(err.message);
            console.error("Error fetching venues:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllVenues();
    }, []);

    const handleApproval = async (venueId) => {
        const confirmed = await showModal({
            title: "Approve Venue",
            message: "Are you sure you want to approve this venue?"
        });

        if (confirmed) {
            try {
                const { error } = await supabase
                    .from('venues')
                    .update({ is_approved: true, rejection_reason: null })
                    .eq('venue_id', venueId);

                if (error) {
                    showModal({
                        title: "Error",
                        message: `Failed to approve venue. Database Error: ${error.message}. Please check RLS policies.`
                    });
                    return;
                }
                
                showModal({
                    title: "Success",
                    message: "Venue approved successfully!"
                });

                fetchAllVenues();
            } catch (err) {
                showModal({
                    title: "Error",
                    message: `An unexpected error occurred: ${err.message}`
                });
            }
        }
    };

    const handleDecline = async (venueId) => {
        const rejectionReason = await showModal({
            title: "Restrict Venue",
            message: "Are you sure you want to restrict this venue? Please provide a reason.",
            isInput: true,
            inputPlaceholder: "Reason for restriction (required)",
            confirmText: "Confirm Restriction",
            confirmStyle: "danger"
        });

        if (rejectionReason) {
            if (!rejectionReason.trim()) {
                showModal({
                    title: "Error",
                    message: "A restriction reason is required."
                });
                return;
            }

            try {
                const { error } = await supabase
                    .from('venues')
                    .update({ is_approved: false, rejection_reason: rejectionReason.trim() })
                    .eq('venue_id', venueId);

                if (error) {
                    showModal({
                        title: "Error",
                        message: `Failed to restrict venue. Database Error: ${error.message}. Please check RLS policies.`
                    });
                    return;
                }
                
                showModal({
                    title: "Success",
                    message: "Venue restricted successfully!"
                });
                
                fetchAllVenues();
            } catch (err) {
                showModal({
                    title: "Error",
                    message: `An unexpected error occurred: ${err.message}`
                });
            }
        }
    };

    if (loading) return <p className="container" style={{ textAlign: 'center' }}>Loading venues...</p>;
    if (error) return <p className="container" style={{ textAlign: 'center', color: 'red' }}>Error: {error}</p>;

    return (
        <div className="container dashboard-page">
            <h1 className="section-heading">Admin Venue Management</h1>
            <p className="dashboard-subtitle">Review and manage all venues on the platform.</p>

            <div className="venue-management-grid">
                {venues.length > 0 ? (
                    venues.map(venue => (
                        <div key={venue.venue_id} className={`venue-card ${!venue.is_approved ? 'pending-card' : ''}`}>
                            <div className="venue-card-content">
                                <h3>{venue.name}</h3>
                                <p><strong>Owner:</strong> {venue.users?.username || venue.users?.email}</p>
                                <p>{venue.address}, {venue.city}</p>
                                <p className="mt-4">
                                    <strong>Status: </strong>
                                    <span className={`status-badge ${
                                        venue.is_approved 
                                            ? 'approved' 
                                            : venue.rejection_reason 
                                                ? 'declined' 
                                                : 'pending'
                                    }`}>
                                        {venue.is_approved 
                                            ? 'Approved' 
                                            : venue.rejection_reason 
                                                ? 'Declined' 
                                                : 'Pending Approval'}
                                    </span>
                                </p>
                                {venue.rejection_reason && (
                                    <p className="rejection-reason-text">
                                        <FaExclamationTriangle /> <strong>Restriction Reason:</strong> {venue.rejection_reason}
                                    </p>
                                )}
                                <div className="owner-card-footer">
                                    {/* Updated conditional logic for action buttons */}
                                    {venue.is_approved ? (
                                        <button 
                                            onClick={() => handleDecline(venue.venue_id)} 
                                            className="btn btn-danger"
                                        >
                                            <FaTimesCircle /> Restrict
                                        </button>
                                    ) : venue.rejection_reason ? (
                                        <button 
                                            onClick={() => handleApproval(venue.venue_id)} 
                                            className="btn btn-primary"
                                        >
                                            <FaCheckCircle /> Approve Again
                                        </button>
                                    ) : (
                                        <>
                                            <button 
                                                onClick={() => handleApproval(venue.venue_id)} 
                                                className="btn btn-primary"
                                            >
                                                <FaCheckCircle /> Approve
                                            </button>
                                            <button 
                                                onClick={() => handleDecline(venue.venue_id)} 
                                                className="btn btn-danger"
                                            >
                                                <FaTimesCircle /> Restrict
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No venues found.</p>
                )}
            </div>
        </div>
    );
}

export default AdminVenueManagementPage;