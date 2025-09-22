import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaSearch, FaFilter, FaBuilding, FaUser, FaMapMarkerAlt, FaClock, FaEye } from 'react-icons/fa';
import { useModal } from '../../ModalContext';
import StatsCard from '../../components/common/StatsCard';

const VenueCard = ({ venue, onApprove, onDecline }) => {
    // 🛑 CORRECTED LINE: Access owner data from the 'owner_id' property 
    // as renamed in the fetch query to resolve FK ambiguity.
    const owner = venue.owner_id;

    const isApproved = venue.is_approved;
    const isDeclined = !isApproved && venue.rejection_reason;

    const statusConfig = isApproved
        ? { color: 'bg-light-green-bg text-primary-green-dark border-primary-green/20', text: 'Approved', dot: 'bg-primary-green' }
        : isDeclined
        ? { color: 'bg-red-50 text-red-700 border-red-200', text: 'Restricted', dot: 'bg-red-500' }
        : { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', text: 'Pending Review', dot: 'bg-yellow-500' };

    return (
        <div className="bg-card-bg rounded-2xl shadow-sm border border-border-color-light hover:shadow-lg hover:border-primary-green/20 transition-all duration-300 group overflow-hidden">
            <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold text-dark-text mb-2 group-hover:text-primary-green-dark transition-colors">{venue.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-medium-text mb-3">
                            {/* 🛑 CORRECTED LINE: Use 'owner' variable (which holds venue.owner_id data) */}
                            <div className="flex items-center gap-2"><FaUser className="text-xs" /><span>{owner?.username || owner?.email}</span></div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-light-text"><FaMapMarkerAlt className="text-xs" /><span>{venue.address}, {venue.city}</span></div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                        <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></div>
                        {statusConfig.text}
                    </div>
                </div>

                {venue.rejection_reason && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-xl">
                        <div className="flex items-start gap-3 text-red-800">
                            <FaExclamationTriangle className="mt-0.5 text-red-500 flex-shrink-0" />
                            <div className="text-sm">
                                <span className="font-semibold block mb-1">Restriction Reason:</span>
                                <span className="text-red-700">{venue.rejection_reason}</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border-color-light">
                    <div className="flex items-center gap-2 text-sm text-medium-text"><FaBuilding className="text-primary-green" /><span>Venue ID: {venue.venue_id}</span></div>
                    <div className="flex items-center gap-2 text-sm text-medium-text"><FaClock className="text-primary-green" /><span>{new Date(venue.created_at).toLocaleDateString()}</span></div>
                </div>
            </div>

            <div className="px-6 py-4 bg-hover-bg border-t border-border-color-light">
                <div className="flex gap-3">
                    {isApproved ? (
                        <>
                            <button onClick={() => onDecline(venue.venue_id)} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"><FaTimesCircle /> Restrict Venue</button>
                            <button className="px-4 py-2.5 bg-background hover:bg-border-color-light text-medium-text text-sm font-medium rounded-xl transition-all duration-200 border border-border-color"><FaEye /></button>
                        </>
                    ) : isDeclined ? (
                        <>
                            <button onClick={() => onApprove(venue.venue_id)} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-green hover:bg-primary-green-dark text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"><FaCheckCircle /> Approve Venue</button>
                            <button className="px-4 py-2.5 bg-background hover:bg-border-color-light text-medium-text text-sm font-medium rounded-xl transition-all duration-200 border border-border-color"><FaEye /></button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => onApprove(venue.venue_id)} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-green hover:bg-primary-green-dark text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"><FaCheckCircle /> Approve</button>
                            <button onClick={() => onDecline(venue.venue_id)} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"><FaTimesCircle /> Restrict</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const EmptyState = ({ activeTab }) => {
    const config = {
        pending: { icon: FaClock, title: 'No Pending Venues', description: 'All venues have been reviewed. New submissions will appear here.', color: 'text-yellow-500' },
        approved: { icon: FaCheckCircle, title: 'No Approved Venues', description: 'Approved venues will be displayed here once you start approving submissions.', color: 'text-primary-green' },
        rejected: { icon: FaTimesCircle, title: 'No Restricted Venues', description: 'Restricted venues will appear here when you decline submissions.', color: 'text-red-500' }
    }[activeTab] || { icon: FaBuilding, title: 'No Venues Found', description: 'No venues match your current criteria.', color: 'text-medium-text' };

    const Icon = config.icon;

    return (
        <div className="col-span-full flex flex-col items-center justify-center py-16">
            <div className={`${config.color} mb-6`}><Icon className="text-6xl" /></div>
            <h3 className="text-xl font-semibold text-dark-text mb-2">{config.title}</h3>
            <p className="text-medium-text text-center max-w-md">{config.description}</p>
        </div>
    );
};

function AdminVenueManagementPage() {
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('pending');
    const [searchTerm, setSearchTerm] = useState('');
    const { showModal } = useModal();

    const fetchAllVenues = async () => {
        setLoading(true);
        setError(null);
        try {
            // 🛑 CORRECTED LINE: Using 'owner_id' as the embedded relationship name 
            // to uniquely select the owner user data.
            const { data, error } = await supabase.from('venues').select(`*, owner_id (username, email)`).order('created_at', { ascending: false });
            if (error) throw error;
            setVenues(data || []);
        } catch (err) {
            setError(err.message);
            console.error("Error fetching venues:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAllVenues() }, []);

    const handleApproval = async (venueId) => {
        if (await showModal({ title: "Approve Venue", message: "Are you sure you want to approve this venue?" })) {
            try {
                const { error } = await supabase.from('venues').update({ is_approved: true, rejection_reason: null }).eq('venue_id', venueId);
                if (error) throw error;
                showModal({ title: "Success", message: "Venue approved successfully!" });
                fetchAllVenues();
            } catch (err) {
                showModal({ title: "Error", message: `Failed to approve venue: ${err.message}` });
            }
        }
    };

    const handleDecline = async (venueId) => {
        const rejectionReason = await showModal({
            title: "Restrict Venue", message: "Please provide a reason for restricting this venue.", isInput: true,
            inputPlaceholder: "Reason for restriction (required)", confirmText: "Confirm Restriction", confirmStyle: "danger"
        });

        if (rejectionReason) {
            if (!rejectionReason.trim()) {
                showModal({ title: "Error", message: "A restriction reason is required." });
                return;
            }
            try {
                const { error } = await supabase.from('venues').update({ is_approved: false, rejection_reason: rejectionReason.trim() }).eq('venue_id', venueId);
                if (error) throw error;
                showModal({ title: "Success", message: "Venue restricted successfully!" });
                fetchAllVenues();
            } catch (err) {
                showModal({ title: "Error", message: `An unexpected error occurred: ${err.message}` });
            }
        }
    };

    const filterVenues = (venueList) => {
        if (!searchTerm) return venueList;
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return venueList.filter(v => 
            // 🛑 CORRECTED LINE: Search against 'owner_id' properties
            `${v.name} ${v.city} ${v.address} ${v.owner_id?.username || ''} ${v.owner_id?.email || ''}`.toLowerCase().includes(lowerCaseSearchTerm)
        );
    };

    const pendingVenues = filterVenues(venues.filter(v => !v.is_approved && !v.rejection_reason));
    const approvedVenues = filterVenues(venues.filter(v => v.is_approved));
    const rejectedVenues = filterVenues(venues.filter(v => !v.is_approved && v.rejection_reason));

    const currentVenues = { pending: pendingVenues, approved: approvedVenues, rejected: rejectedVenues }[activeTab] || [];
    
    const statsData = [
        { title: "Pending Review", count: pendingVenues.length, icon: FaClock, color: "bg-yellow-500" },
        { title: "Approved Venues", count: approvedVenues.length, icon: FaCheckCircle, color: "bg-primary-green" },
        { title: "Restricted Venues", count: rejectedVenues.length, icon: FaTimesCircle, color: "bg-red-500" },
    ];

    const tabData = [
        { key: 'pending', label: 'Pending Review', count: pendingVenues.length },
        { key: 'approved', label: 'Approved', count: approvedVenues.length },
        { key: 'rejected', label: 'Restricted', count: rejectedVenues.length }
    ];

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green mx-auto mb-4"></div>
                <p className="text-medium-text text-lg">Loading venues...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center max-w-md mx-auto px-4">
                <div className="text-red-500 mb-4"><FaExclamationTriangle className="text-5xl mx-auto" /></div>
                <h2 className="text-xl font-semibold text-dark-text mb-2">Something went wrong</h2>
                <p className="text-red-600 mb-4">{error}</p>
                <button onClick={fetchAllVenues} className="px-6 py-3 bg-primary-green hover:bg-primary-green-dark text-white font-medium rounded-xl transition-colors duration-200">Try Again</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-dark-text mb-3">Venue Management</h1>
                    <p className="text-lg text-medium-text">Review and manage all venues on your platform</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {statsData.map(stat => <StatsCard key={stat.title} {...stat} bgColor="bg-card-bg" />)}
                </div>

                <div className="bg-card-bg rounded-2xl shadow-sm border border-border-color-light p-6 mb-8">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-text text-sm" />
                            <input
                                type="text" placeholder="Search venues, cities, or owners..." value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-background border border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent text-dark-text placeholder-light-text"
                            />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-medium-text"><FaFilter /><span>Showing {currentVenues.length} venues</span></div>
                    </div>
                </div>

                <div className="mb-8">
                    <div className="flex space-x-1 bg-card-bg p-1 rounded-2xl border border-border-color-light shadow-sm">
                        {tabData.map(tab => (
                            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                                className={`flex-1 px-6 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${activeTab === tab.key ? 'bg-primary-green text-white shadow-sm' : 'text-medium-text hover:text-dark-text hover:bg-hover-bg'}`}
                            >
                                {tab.label} ({tab.count})
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {currentVenues.length > 0 ? (
                        currentVenues.map(venue => <VenueCard key={venue.venue_id} venue={venue} onApprove={handleApproval} onDecline={handleDecline} />)
                    ) : (
                        <EmptyState activeTab={activeTab} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminVenueManagementPage;