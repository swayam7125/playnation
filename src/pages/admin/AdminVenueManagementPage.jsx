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

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <p className="text-medium-text text-lg">Loading venues...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <p className="text-red-600 text-lg">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-dark-text mb-2">Admin Venue Management</h1>
                    <p className="text-light-text text-lg">Review and manage all venues on the platform.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {venues.length > 0 ? (
                        venues.map(venue => {
                            const isPending = !venue.is_approved && !venue.rejection_reason;
                            const isDeclined = !venue.is_approved && venue.rejection_reason;
                            const isApproved = venue.is_approved;

                            return (
                                <div 
                                    key={venue.venue_id} 
                                    className={`bg-card-bg rounded-xl shadow-lg border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                                        isPending 
                                            ? 'border-yellow-400 ring-2 ring-yellow-100' 
                                            : 'border-border-color hover:border-primary-green/20'
                                    }`}
                                >
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-dark-text mb-3">{venue.name}</h3>
                                        
                                        <div className="space-y-2 mb-4">
                                            <p className="text-sm text-medium-text">
                                                <span className="font-semibold">Owner:</span> {venue.users?.username || venue.users?.email}
                                            </p>
                                            <p className="text-sm text-light-text">{venue.address}, {venue.city}</p>
                                        </div>

                                        <div className="mb-4">
                                            <span className="text-sm font-semibold text-medium-text mr-2">Status:</span>
                                            <span 
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                    isApproved
                                                        ? 'bg-light-green-bg text-primary-green-dark'
                                                        : isDeclined
                                                            ? 'bg-red-50 text-red-700 border border-red-200'
                                                            : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                                }`}
                                            >
                                                {isApproved ? 'Approved' : isDeclined ? 'Declined' : 'Pending Approval'}
                                            </span>
                                        </div>

                                        {venue.rejection_reason && (
                                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                <div className="flex items-start gap-2 text-red-800 text-sm">
                                                    <FaExclamationTriangle className="mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <span className="font-semibold">Restriction Reason:</span> {venue.rejection_reason}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-hover-bg px-6 py-4 border-t border-border-color rounded-b-xl">
                                        <div className="flex gap-3">
                                            {isApproved ? (
                                                <button 
                                                    onClick={() => handleDecline(venue.venue_id)} 
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                                                >
                                                    <FaTimesCircle /> Restrict
                                                </button>
                                            ) : isDeclined ? (
                                                <button 
                                                    onClick={() => handleApproval(venue.venue_id)} 
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-green hover:bg-primary-green-dark text-white text-sm font-semibold rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                                                >
                                                    <FaCheckCircle /> Approve Again
                                                </button>
                                            ) : (
                                                <>
                                                    <button 
                                                        onClick={() => handleApproval(venue.venue_id)} 
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-green hover:bg-primary-green-dark text-white text-sm font-semibold rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                                                    >
                                                        <FaCheckCircle /> Approve
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDecline(venue.venue_id)} 
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                                                    >
                                                        <FaTimesCircle /> Restrict
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-light-text text-lg">No venues found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminVenueManagementPage;