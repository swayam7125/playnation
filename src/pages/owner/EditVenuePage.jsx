import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../AuthContext';
import { FaTrash, FaPlusCircle, FaPlus } from 'react-icons/fa';

function EditVenuePage() {
    const { venueId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('details');
    const [venueDetails, setVenueDetails] = useState({
        name: '', address: '', city: '', state: '', zip_code: '', description: '', 
        contact_email: '', contact_phone: '', opening_time: '', closing_time: ''
    });
    const [sports, setSports] = useState([]);
    const [showAddFacilityForm, setShowAddFacilityForm] = useState(false);
    const [newFacility, setNewFacility] = useState({ name: '', sport_id: '', capacity: '', hourly_rate: '', description: '' });

    const fetchVenueData = async () => {
        setLoading(true);
        try {
            const { data: sportsData } = await supabase.from('sports').select('sport_id, name').order('name');
            setSports(sportsData || []);

            const { data: venueData, error } = await supabase.from('venues').select(`*, facilities(*, sports(name), time_slots(count))`).eq('venue_id', venueId).single();
            if (error) throw error;
            if (venueData.owner_id !== user.id) { navigate('/owner/my-venues'); return; }
            
            setVenue(venueData);
            setVenueDetails({
                name: venueData.name || '', address: venueData.address || '', city: venueData.city || '',
                state: venueData.state || '', zip_code: venueData.zip_code || '', description: venueData.description || '',
                contact_email: venueData.contact_email || '', contact_phone: venueData.contact_phone || '',
                opening_time: venueData.opening_time || '', closing_time: venueData.closing_time || '',
            });
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchVenueData();
    }, [user, venueId]);

    const handleDetailsChange = (e) => setVenueDetails({ ...venueDetails, [e.target.name]: e.target.value });
    const handleNewFacilityChange = (e) => setNewFacility({ ...newFacility, [e.target.name]: e.target.value });

    const handleDetailsUpdate = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('venues').update(venueDetails).eq('venue_id', venueId);
        if (error) { alert(`Update failed: ${error.message}`); } else { alert("Venue details updated successfully!"); }
    };
    
    const handleAddFacility = async (e) => {
        e.preventDefault();
        if (!newFacility.name.trim() || !newFacility.sport_id || !newFacility.capacity || !newFacility.hourly_rate) {
            alert("Please fill all required facility fields."); return;
        }
        try {
            const { error } = await supabase.from('facilities').insert([{ venue_id: venueId, ...newFacility }]);
            if (error) throw error;
            alert("Facility added successfully!");
            setShowAddFacilityForm(false);
            setNewFacility({ name: '', sport_id: '', capacity: '', hourly_rate: '', description: '' });
            fetchVenueData(); // Refresh data
        } catch (error) {
            alert(`Error adding facility: ${error.message}`);
        }
    };

    const handleDeleteFacility = async (facilityId, facilityName) => {
        if (window.confirm(`Are you sure you want to delete "${facilityName}"? This action cannot be undone.`)) {
            try {
                const { error } = await supabase.from('facilities').delete().eq('facility_id', facilityId);
                if (error) throw error;
                alert("Facility deleted!");
                fetchVenueData(); // Refresh data
            } catch (error) {
                alert(`Error deleting facility: ${error.message}`);
            }
        }
    };

    const inputStyles = "w-full py-2 px-3 border border-border-color rounded-lg text-sm bg-card-bg text-dark-text transition duration-300 focus:outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/20";
    const labelStyles = "font-semibold text-sm text-dark-text";
    
    if (loading) return <p className="container mx-auto text-center p-12">Loading...</p>;
    if (!venue) return <p className="container mx-auto text-center p-12">Venue not found.</p>;

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-2xl font-bold mb-8 text-dark-text">Edit: {venue.name}</h1>
            <div className="flex justify-center gap-4 mb-8 border-b border-border-color">
                <button onClick={() => setActiveTab('details')} className={`py-4 px-6 font-semibold text-base border-b-4 transition duration-300 ${activeTab === 'details' ? 'border-primary-green text-primary-green' : 'border-transparent text-light-text hover:text-dark-text'}`}>Edit Details</button>
                <button onClick={() => setActiveTab('facilities')} className={`py-4 px-6 font-semibold text-base border-b-4 transition duration-300 ${activeTab === 'facilities' ? 'border-primary-green text-primary-green' : 'border-transparent text-light-text hover:text-dark-text'}`}>Manage Facilities</button>
            </div>

            {activeTab === 'details' && (
                <form onSubmit={handleDetailsUpdate} className="max-w-4xl mx-auto bg-card-bg p-8 rounded-xl border border-border-color shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div className="md:col-span-2 flex flex-col gap-2"><label htmlFor="name" className={labelStyles}>Venue Name</label><input id="name" name="name" type="text" value={venueDetails.name} onChange={handleDetailsChange} className={inputStyles} /></div>
                        <div className="md:col-span-2 flex flex-col gap-2"><label htmlFor="address" className={labelStyles}>Address</label><input id="address" name="address" type="text" value={venueDetails.address} onChange={handleDetailsChange} className={inputStyles} /></div>
                        <div className="flex flex-col gap-2"><label htmlFor="city" className={labelStyles}>City</label><input id="city" name="city" type="text" value={venueDetails.city} onChange={handleDetailsChange} className={inputStyles} /></div>
                        <div className="flex flex-col gap-2"><label htmlFor="state" className={labelStyles}>State</label><input id="state" name="state" type="text" value={venueDetails.state} onChange={handleDetailsChange} className={inputStyles} /></div>
                        <div className="flex flex-col gap-2"><label htmlFor="zip_code" className={labelStyles}>Zip Code</label><input id="zip_code" name="zip_code" type="text" value={venueDetails.zip_code} onChange={handleDetailsChange} className={inputStyles} /></div>
                        <div className="flex flex-col gap-2"><label htmlFor="contact_email" className={labelStyles}>Contact Email</label><input id="contact_email" name="contact_email" type="email" value={venueDetails.contact_email} onChange={handleDetailsChange} className={inputStyles} /></div>
                        <div className="flex flex-col gap-2"><label htmlFor="contact_phone" className={labelStyles}>Contact Phone</label><input id="contact_phone" name="contact_phone" type="tel" value={venueDetails.contact_phone} onChange={handleDetailsChange} className={inputStyles} /></div>
                        <div className="flex flex-col gap-2"><label htmlFor="opening_time" className={labelStyles}>Opening Time</label><input id="opening_time" name="opening_time" type="time" value={venueDetails.opening_time} onChange={handleDetailsChange} className={inputStyles} /></div>
                        <div className="flex flex-col gap-2"><label htmlFor="closing_time" className={labelStyles}>Closing Time</label><input id="closing_time" name="closing_time" type="time" value={venueDetails.closing_time} onChange={handleDetailsChange} className={inputStyles} /></div>
                        <div className="md:col-span-2 flex flex-col gap-2"><label htmlFor="description" className={labelStyles}>Description</label><textarea id="description" name="description" rows="4" value={venueDetails.description} onChange={handleDetailsChange} className={inputStyles}></textarea></div>
                    </div>
                    <button type="submit" className="w-full mt-6 py-3 rounded-lg font-semibold bg-primary-green text-white shadow-sm hover:bg-primary-green-dark">Save Changes</button>
                </form>
            )}

            {activeTab === 'facilities' && (
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Manage Facilities</h2>
                        <button onClick={() => setShowAddFacilityForm(!showAddFacilityForm)} className="py-2 px-5 rounded-lg font-semibold text-sm bg-primary-green text-white shadow-sm hover:bg-primary-green-dark inline-flex items-center gap-2"><FaPlus /> Add New Facility</button>
                    </div>

                    {showAddFacilityForm && (
                        <form onSubmit={handleAddFacility} className="bg-hover-bg p-6 rounded-lg border border-border-color mb-8">
                            <h3 className="text-lg font-semibold mb-4">Add New Facility</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="flex flex-col gap-2"><label className={labelStyles}>Name *</label><input name="name" type="text" value={newFacility.name} onChange={handleNewFacilityChange} className={inputStyles} required /></div>
                                <div className="flex flex-col gap-2"><label className={labelStyles}>Sport *</label><select name="sport_id" value={newFacility.sport_id} onChange={handleNewFacilityChange} className={inputStyles} required><option value="">Select</option>{sports.map(s => (<option key={s.sport_id} value={s.sport_id}>{s.name}</option>))}</select></div>
                                <div className="flex flex-col gap-2"><label className={labelStyles}>Capacity *</label><input name="capacity" type="number" min="1" value={newFacility.capacity} onChange={handleNewFacilityChange} className={inputStyles} required /></div>
                                <div className="flex flex-col gap-2"><label className={labelStyles}>Rate (₹) *</label><input name="hourly_rate" type="number" min="0" value={newFacility.hourly_rate} onChange={handleNewFacilityChange} className={inputStyles} required /></div>
                                <div className="md:col-span-2 lg:col-span-4 flex flex-col gap-2"><label className={labelStyles}>Description</label><textarea name="description" rows="2" value={newFacility.description} onChange={handleNewFacilityChange} className={inputStyles} /></div>
                            </div>
                            <div className="flex justify-end gap-4 mt-4">
                                <button type="button" onClick={() => setShowAddFacilityForm(false)} className="py-2 px-5 rounded-lg font-semibold text-sm bg-card-bg text-medium-text border border-border-color shadow-sm hover:bg-hover-bg">Cancel</button>
                                <button type="submit" className="py-2 px-5 rounded-lg font-semibold text-sm bg-primary-green text-white shadow-sm hover:bg-primary-green-dark inline-flex items-center gap-2"><FaPlusCircle /> Create Facility</button>
                            </div>
                        </form>
                    )}

                    <h3 className="text-lg font-semibold mb-4">Existing Facilities</h3>
                    {venue.facilities.length === 0 ? <p className="text-light-text">No facilities added yet.</p> : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {venue.facilities.map(facility => (
                                <div key={facility.facility_id} className="bg-card-bg border border-border-color rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-dark-text">{facility.name}</h4>
                                        <button onClick={() => handleDeleteFacility(facility.facility_id, facility.name)} className="text-light-text hover:text-red-600 p-1"><FaTrash /></button>
                                    </div>
                                    <div className="text-sm text-medium-text space-y-1">
                                        <p><strong>Sport:</strong> {facility.sports?.name || 'N/A'}</p>
                                        <p><strong>Capacity:</strong> {facility.capacity} players</p>
                                        <p><strong>Rate:</strong> ₹{facility.hourly_rate}/hr</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default EditVenuePage;