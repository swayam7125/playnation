import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../AuthContext';

function AddVenuePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [venueDetails, setVenueDetails] = useState({
    name: '', address: '', city: '', state: '', zip_code: '', description: '',
    contact_email: '', contact_phone: '', opening_time: '06:00', closing_time: '23:00'
  });

  const [facilities, setFacilities] = useState([]);
  
  const [currentFacility, setCurrentFacility] = useState({
    name: '', sport_id: '', hourly_rate: '', capacity: '', selectedAmenities: new Set()
  });

  const [sports, setSports] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOptions = async () => {
      const { data: sportsData } = await supabase.from('sports').select('*');
      const { data: amenitiesData } = await supabase.from('amenities').select('*');
      setSports(sportsData || []);
      setAmenities(amenitiesData || []);
      if (sportsData && sportsData.length > 0) {
        setCurrentFacility(prev => ({ ...prev, sport_id: sportsData[0].sport_id }));
      }
    };
    fetchOptions();
  }, []);

  const handleVenueChange = (e) => setVenueDetails({ ...venueDetails, [e.target.name]: e.target.value });
  const handleFacilityChange = (e) => setCurrentFacility({ ...currentFacility, [e.target.name]: e.target.value });

  const handleAmenityToggle = (amenityId) => {
    setCurrentFacility(prev => {
      const newAmenities = new Set(prev.selectedAmenities);
      newAmenities.has(amenityId) ? newAmenities.delete(amenityId) : newAmenities.add(amenityId);
      return { ...prev, selectedAmenities: newAmenities };
    });
  };

  const handleAddFacility = () => {
    if (!currentFacility.name || !currentFacility.sport_id || !currentFacility.hourly_rate) {
      alert("Please provide a facility name, sport, and hourly rate.");
      return;
    }
    setFacilities([...facilities, { ...currentFacility, id: Date.now() }]);
    setCurrentFacility({ name: '', sport_id: sports[0]?.sport_id || '', hourly_rate: '', capacity: '', selectedAmenities: new Set() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { setError("You must be logged in."); return; }
    if (facilities.length === 0) { alert("Please add at least one facility to the venue."); return; }
    
    setLoading(true);
    setError(null);
    try {
      const { data: newVenue, error: venueError } = await supabase
        .from('venues')
        .insert({ ...venueDetails, owner_id: user.id, is_approved: false })
        .select().single();
      if (venueError) throw venueError;

      for (const facility of facilities) {
        const { data: newFacility, error: facilityError } = await supabase
          .from('facilities')
          .insert({
            venue_id: newVenue.venue_id, sport_id: facility.sport_id, name: facility.name,
            hourly_rate: facility.hourly_rate, capacity: facility.capacity || null,
          }).select().single();
        if (facilityError) throw facilityError;

        const amenitiesToInsert = Array.from(facility.selectedAmenities).map(amenityId => ({
          facility_id: newFacility.facility_id, amenity_id: amenityId,
          created_at: new Date(), updated_at: new Date(),
        }));
        
        if (amenitiesToInsert.length > 0) {
          const { error: amenityError } = await supabase.from('facility_amenities').insert(amenitiesToInsert);
          if (amenityError) throw amenityError;
        }
      }
      
      alert("Venue submitted for approval successfully!");
      navigate('/owner/my-venues');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "w-full py-3 px-4 border border-border-color rounded-lg text-sm bg-card-bg text-dark-text transition duration-300 focus:outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/20";
  const labelStyles = "font-semibold text-sm text-dark-text";
  const formSectionTitleStyles = "text-lg font-semibold mt-8 mb-4 pb-2 border-b border-border-color";

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-center text-3xl font-bold mb-8 text-dark-text">Add a New Venue</h1>
      <form onSubmit={handleSubmit} className="bg-card-bg p-8 rounded-xl border border-border-color shadow-xl w-full max-w-4xl mx-auto">
        {error && <p className="bg-red-100 text-red-700 p-4 rounded-lg text-center text-sm border border-red-300 mb-6 col-span-2">{error}</p>}
        
        <h3 className={formSectionTitleStyles}>1. Venue Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div className="md:col-span-2 flex flex-col gap-2"><label className={labelStyles}>Venue Name</label><input name="name" type="text" value={venueDetails.name} onChange={handleVenueChange} required className={inputStyles} /></div>
          <div className="md:col-span-2 flex flex-col gap-2"><label className={labelStyles}>Address</label><input name="address" type="text" value={venueDetails.address} onChange={handleVenueChange} required className={inputStyles} /></div>
          <div className="flex flex-col gap-2"><label className={labelStyles}>City</label><input name="city" type="text" value={venueDetails.city} onChange={handleVenueChange} required className={inputStyles} /></div>
          <div className="flex flex-col gap-2"><label className={labelStyles}>State</label><input name="state" type="text" value={venueDetails.state} onChange={handleVenueChange} required className={inputStyles} /></div>
          <div className="flex flex-col gap-2"><label className={labelStyles}>Zip Code</label><input name="zip_code" type="text" value={venueDetails.zip_code} onChange={handleVenueChange} className={inputStyles} /></div>
          <div className="flex flex-col gap-2"><label className={labelStyles}>Contact Email</label><input name="contact_email" type="email" value={venueDetails.contact_email} onChange={handleVenueChange} className={inputStyles} /></div>
          <div className="flex flex-col gap-2"><label className={labelStyles}>Contact Phone</label><input name="contact_phone" type="tel" value={venueDetails.contact_phone} onChange={handleVenueChange} className={inputStyles} /></div>
          <div className="flex flex-col gap-2"><label className={labelStyles}>Opening Time</label><input name="opening_time" type="time" value={venueDetails.opening_time} onChange={handleVenueChange} required className={inputStyles} /></div>
          <div className="flex flex-col gap-2"><label className={labelStyles}>Closing Time</label><input name="closing_time" type="time" value={venueDetails.closing_time} onChange={handleVenueChange} required className={inputStyles} /></div>
          <div className="md:col-span-2 flex flex-col gap-2"><label className={labelStyles}>Description</label><textarea name="description" rows="3" value={venueDetails.description} onChange={handleVenueChange} className={inputStyles}></textarea></div>
        </div>

        <h3 className={formSectionTitleStyles}>2. Add Facilities</h3>
        <div className="bg-hover-bg border border-border-color rounded-lg p-6 mb-6 flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="flex flex-col gap-2"><label className={labelStyles}>Facility Name (e.g., Court 1)</label><input name="name" type="text" value={currentFacility.name} onChange={handleFacilityChange} className={inputStyles} /></div>
            <div className="flex flex-col gap-2"><label className={labelStyles}>Sport</label><select name="sport_id" value={currentFacility.sport_id} onChange={handleFacilityChange} className={inputStyles}>{sports.map(s => <option key={s.sport_id} value={s.sport_id}>{s.name}</option>)}</select></div>
            <div className="flex flex-col gap-2"><label className={labelStyles}>Hourly Rate (₹)</label><input name="hourly_rate" type="number" value={currentFacility.hourly_rate} onChange={handleFacilityChange} className={inputStyles} /></div>
            <div className="flex flex-col gap-2"><label className={labelStyles}>Capacity</label><input name="capacity" type="number" value={currentFacility.capacity} onChange={handleFacilityChange} className={inputStyles} /></div>
          </div>
          <label className={`${labelStyles} mt-4`}>Amenities for this Facility</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 my-2">
            {amenities.map(a => (
              <label key={a.amenity_id} className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input type="checkbox" checked={currentFacility.selectedAmenities.has(a.amenity_id)} onChange={() => handleAmenityToggle(a.amenity_id)} className="h-4 w-4 rounded border-gray-300 text-primary-green focus:ring-primary-green" />
                {a.name}
              </label>
            ))}
          </div>
          <button type="button" className="self-end mt-4 py-2 px-5 rounded-lg font-semibold text-sm transition duration-300 no-underline bg-card-bg text-medium-text border border-border-color shadow-sm hover:bg-hover-bg hover:border-primary-green hover:text-primary-green" onClick={handleAddFacility}>Add Facility</button>
        </div>
        
        <div className="mt-6 space-y-2">
          {facilities.map((facility) => (
            <div key={facility.id} className="bg-light-green-bg text-emerald-800 p-3 rounded-lg font-medium text-sm">
              <strong>{facility.name}</strong> ({sports.find(s => s.sport_id === facility.sport_id)?.name}) - ₹{facility.hourly_rate}/hr
            </div>
          ))}
        </div>

        <button type="submit" className="w-full mt-8 py-4 px-6 rounded-lg font-semibold text-lg transition duration-300 bg-primary-green text-white shadow-sm hover:bg-primary-green-dark hover:-translate-y-px hover:shadow-md disabled:bg-gray-400" disabled={loading}>
          {loading ? "Submitting Venue..." : "Submit for Approval"}
        </button>
      </form>
    </div>
  );
}

export default AddVenuePage;