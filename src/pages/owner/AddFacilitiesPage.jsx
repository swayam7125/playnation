import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useModal } from '../../ModalContext';
import { useAuth } from '../../AuthContext';
import { FaPlus, FaTimes, FaStar, FaArrowLeft } from 'react-icons/fa';

function AddFacilitiesPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { showModal } = useModal();
    const { user } = useAuth();

    const [venueDetails, setVenueDetails] = useState(null);
    const [venueImageFiles, setVenueImageFiles] = useState([]);
    
    const [facilities, setFacilities] = useState([]);
    const [currentFacility, setCurrentFacility] = useState({
        name: '', sport_id: '', hourly_rate: '', capacity: '', selectedAmenities: new Set(),
    });

    const [sports, setSports] = useState([]);
    const [amenities, setAmenities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initializePage = async () => {
            if (!state || !state.venueDetails) {
                await showModal({ title: "Error", message: "Venue information is missing. Please start over." });
                navigate('/owner/add-venue');
                return;
            }
            
            setVenueDetails(state.venueDetails);
            setVenueImageFiles(state.venueImageFiles || []);

            try {
                const { data: sportsData } = await supabase.from('sports').select('*');
                const { data: amenitiesData } = await supabase.from('amenities').select('*');
                setSports(sportsData || []);
                setAmenities(amenitiesData || []);
                if (sportsData && sportsData.length > 0) {
                    setCurrentFacility(prev => ({ ...prev, sport_id: sportsData[0].sport_id }));
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        initializePage();
    }, [state, navigate, showModal]);

    const handleFacilityChange = (e) =>
        setCurrentFacility({ ...currentFacility, [e.target.name]: e.target.value });

    const handleAmenityToggle = (amenityId) => {
        setCurrentFacility(prev => {
            const newAmenities = new Set(prev.selectedAmenities);
            newAmenities.has(amenityId) ? newAmenities.delete(amenityId) : newAmenities.add(amenityId);
            return { ...prev, selectedAmenities: newAmenities };
        });
    };

    const handleAddFacilityToList = () => {
        if (!currentFacility.name || !currentFacility.sport_id || !currentFacility.hourly_rate) {
            showModal({ title: "Required Fields", message: "Please provide facility name, sport, and rate." });
            return;
        }
        setFacilities([...facilities, { ...currentFacility, id: Date.now() }]);
        setCurrentFacility({
            name: '', sport_id: sports[0]?.sport_id || '', hourly_rate: '', capacity: '', selectedAmenities: new Set(),
        });
    };

    const removeFacility = (id) => {
        setFacilities(facilities.filter(f => f.id !== id));
    };
    
    const handleGoBack = () => {
        navigate('/owner/add-venue', {
            state: { venueDetails }
        });
    };

    const handleFinish = async () => {
        if (facilities.length === 0) {
            const confirmed = await showModal({
                title: "No Facilities Added",
                message: "Are you sure you want to finish without adding facilities?",
                confirmText: "Yes, Finish"
            });
            if (!confirmed) return;
        }

        setLoading(true);
        setError(null);

        try {
            const uploadPromises = venueImageFiles.map((file) => {
                const imageName = `${user.id}/${Date.now()}-${file.name}`;
                return supabase.storage.from("venue-images").upload(imageName, file);
            });
            const uploadResults = await Promise.all(uploadPromises);
            const imageUrls = uploadResults.map((result) => {
                if (result.error) throw result.error;
                return supabase.storage.from("venue-images").getPublicUrl(result.data.path).data.publicUrl;
            });

            const { data: newVenue, error: venueError } = await supabase
                .from("venues")
                .insert({ ...venueDetails, owner_id: user.id, image_url: imageUrls })
                .select('venue_id')
                .single();
            if (venueError) throw venueError;
            if (!newVenue) throw new Error("Venue creation failed.");

            for (const facility of facilities) {
                const { data: newFacilityData, error: facilityError } = await supabase
                    .from('facilities')
                    .insert({ venue_id: newVenue.venue_id, name: facility.name, sport_id: facility.sport_id, hourly_rate: facility.hourly_rate, capacity: facility.capacity || null })
                    .select('facility_id')
                    .single();
                if (facilityError) throw facilityError;

                const amenitiesToInsert = Array.from(facility.selectedAmenities).map(amenityId => ({
                    facility_id: newFacilityData.facility_id,
                    amenity_id: amenityId,
                }));

                if (amenitiesToInsert.length > 0) {
                    const { error: amenityError } = await supabase.from('facility_amenities').insert(amenitiesToInsert);
                    if (amenityError) throw amenityError;
                }
            }

            await showModal({ title: "Success!", message: "Your venue has been submitted for approval." });
            navigate('/owner/my-venues');

        } catch (err) {
            setError(err.message);
            showModal({ title: "Error", message: `An error occurred: ${err.message}` });
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
    if (error) return <div className="min-h-screen flex items-center justify-center"><p>Error: {error}</p></div>;

    return (
        <div className="min-h-screen bg-background p-4">
             <div className="max-w-3xl mx-auto">
                <div className="text-center mb-4">
                    <div className="bg-primary-green rounded-2xl shadow-lg p-4 relative overflow-hidden">
                        <div className="absolute -top-8 -left-8 w-24 h-24 border-4 border-white/10 rounded-full"></div>
                        <div className="absolute -bottom-8 -right-8 w-24 h-24 border-4 border-white/10 rounded-full"></div>
                        <h1 className="text-2xl font-bold text-white mb-1 relative z-10">
                            Step 2: Add Facilities
                        </h1>
                        <p className="text-white/80 text-sm relative z-10">
                            You're adding facilities for: <span className="font-bold">{venueDetails?.name || '...'}</span>
                        </p>
                    </div>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                    <div className="bg-primary-green p-3 relative overflow-hidden">
                        <div className="absolute -top-8 -right-8 w-24 h-24 border-4 border-white/10 rounded-full"></div>
                        <h2 className="text-lg font-bold text-white flex items-center gap-2 relative z-10">
                            <FaStar /> Manage Facilities
                        </h2>
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="bg-white rounded-xl p-3 border border-border-color-light">
                            <h3 className="font-semibold text-slate-800 mb-3 text-base">
                                Create New Facility
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                                <input name="name" type="text" value={currentFacility.name} onChange={handleFacilityChange} className="w-full py-2 px-3 text-sm bg-gray-50 border border-gray-200 rounded-lg" placeholder="Facility Name" />
                                <select name="sport_id" value={currentFacility.sport_id} onChange={handleFacilityChange} className="w-full py-2 px-3 text-sm bg-gray-50 border border-gray-200 rounded-lg">
                                    {sports.map(s => <option key={s.sport_id} value={s.sport_id}>{s.name}</option>)}
                                </select>
                                <input name="hourly_rate" type="number" value={currentFacility.hourly_rate} onChange={handleFacilityChange} className="w-full py-2 px-3 text-sm bg-gray-50 border border-gray-200 rounded-lg" placeholder="Rate (₹/hour)" />
                                <input name="capacity" type="number" value={currentFacility.capacity} onChange={handleFacilityChange} className="w-full py-2 px-3 text-sm bg-gray-50 border border-gray-200 rounded-lg" placeholder="Capacity" />
                            </div>
                            <div className="mb-3">
                                <label className="block text-xs font-medium text-slate-700 mb-1.5">Amenities</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {amenities.map(a => (
                                        <label key={a.amenity_id} className="flex items-center gap-2 p-1.5 rounded-md border border-slate-200 bg-white/50 cursor-pointer">
                                            <input type="checkbox" checked={currentFacility.selectedAmenities.has(a.amenity_id)} onChange={() => handleAmenityToggle(a.amenity_id)} className="w-3 h-3 text-primary-green" />
                                            <span className="text-slate-700 text-xs">{a.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <button type="button" onClick={handleAddFacilityToList} className="bg-primary-green hover:bg-primary-green-dark text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                                <FaPlus size={12} /> Add Facility
                            </button>
                        </div>
                        {facilities.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-slate-800 mb-2 text-base">Added Facilities ({facilities.length})</h3>
                                <div className="space-y-2">
                                    {facilities.map(facility => (
                                        <div key={facility.id} className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 flex justify-between items-center text-sm">
                                            <div>
                                                <span className="font-medium text-slate-800">{facility.name}</span>
                                                <span className="ml-2 px-2 py-0.5 bg-primary-green text-white text-xs rounded-full">{sports.find(s => s.sport_id === facility.sport_id)?.name}</span>
                                            </div>
                                            <button onClick={() => removeFacility(facility.id)} className="text-red-400 hover:text-red-600"><FaTimes /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex justify-center items-center gap-4 mt-4">
                     <button
                        type="button"
                        onClick={handleGoBack}
                        className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-bold text-base hover:bg-gray-300 transition-all flex items-center gap-2"
                    >
                        <FaArrowLeft /> Go Back
                    </button>
                    <button onClick={handleFinish} disabled={loading} className="bg-primary-green hover:bg-primary-green-dark text-white px-6 py-3 rounded-xl font-bold text-base hover:shadow-lg transition-all">
                        {loading ? 'Saving...' : 'Finish & Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddFacilitiesPage;