import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../AuthContext';
import { useModal } from '../../ModalContext';

function AddVenuePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showModal } = useModal();
  
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

  const handleVenueChange = (e) => {
    setVenueDetails({ ...venueDetails, [e.target.name]: e.target.value });
  };

  const handleFacilityChange = (e) => {
    setCurrentFacility({ ...currentFacility, [e.target.name]: e.target.value });
  };

  const handleAmenityToggle = (amenityId) => {
    setCurrentFacility(prev => {
      const newAmenities = new Set(prev.selectedAmenities);
      if (newAmenities.has(amenityId)) {
        newAmenities.delete(amenityId);
      } else {
        newAmenities.add(amenityId);
      }
      return { ...prev, selectedAmenities: newAmenities };
    });
  };

  const handleAddFacility = async () => {
    if (!currentFacility.name || !currentFacility.sport_id || !currentFacility.hourly_rate) {
      await showModal({
        type: 'error',
        title: 'Missing Information',
        message: "Please provide a facility name, sport, and hourly rate.",
      });
      return;
    }
    setFacilities([...facilities, { ...currentFacility, id: Date.now() }]);
    setCurrentFacility({ name: '', sport_id: sports[0]?.sport_id || '', hourly_rate: '', capacity: '', selectedAmenities: new Set() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { return; }
    if (facilities.length === 0) {
      await showModal({
        type: 'error',
        title: 'No Facilities Added',
        message: "Please add at least one facility to the venue before submitting.",
      });
      return;
    }
    
    setLoading(true);
    try {
      const { data: newVenue, error: venueError } = await supabase
        .from('venues')
        .insert({ ...venueDetails, owner_id: user.id, is_approved: false })
        .select()
        .single();
      if (venueError) throw venueError;

      for (const facility of facilities) {
        const { data: newFacility, error: facilityError } = await supabase
          .from('facilities')
          .insert({
            venue_id: newVenue.venue_id,
            sport_id: facility.sport_id,
            name: facility.name,
            hourly_rate: facility.hourly_rate,
            capacity: facility.capacity || null,
          })
          .select()
          .single();
        if (facilityError) throw facilityError;

        const amenitiesToInsert = Array.from(facility.selectedAmenities).map(amenityId => ({
          facility_id: newFacility.facility_id,
          amenity_id: amenityId,
          created_at: new Date(),
          updated_at: new Date(),
        }));
        
        if (amenitiesToInsert.length > 0) {
          const { error: amenityError } = await supabase.from('facility_amenities').insert(amenitiesToInsert);
          if (amenityError) throw amenityError;
        }
      }
      
      await showModal({
        type: 'info',
        title: 'Venue Submitted',
        message: 'Your venue has been submitted for approval successfully!',
        confirmText: 'OK'
      });
      navigate('/owner/my-venues');

    } catch (err) {
      await showModal({
        type: 'error',
        title: 'Submission Error',
        message: `An error occurred: ${err.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container dashboard-page">
      <h1 className="section-heading" style={{ textAlign: 'center' }}>Add a New Venue</h1>
      <form onSubmit={handleSubmit} className="auth-card" style={{ maxWidth: '900px', margin: 'auto' }}>
        
        <h3 className="form-section-title">1. Venue Details</h3>
        <div className="form-grid">
          <div className="form-group grid-col-span-2"><label>Venue Name</label><input name="name" type="text" value={venueDetails.name} onChange={handleVenueChange} required /></div>
          <div className="form-group grid-col-span-2"><label>Address</label><input name="address" type="text" value={venueDetails.address} onChange={handleVenueChange} required /></div>
          <div className="form-group"><label>City</label><input name="city" type="text" value={venueDetails.city} onChange={handleVenueChange} required /></div>
          <div className="form-group"><label>State</label><input name="state" type="text" value={venueDetails.state} onChange={handleVenueChange} required /></div>
          <div className="form-group"><label>Zip Code</label><input name="zip_code" type="text" value={venueDetails.zip_code} onChange={handleVenueChange} /></div>
          <div className="form-group"><label>Contact Email</label><input name="contact_email" type="email" value={venueDetails.contact_email} onChange={handleVenueChange} /></div>
          <div className="form-group"><label>Contact Phone</label><input name="contact_phone" type="tel" value={venueDetails.contact_phone} onChange={handleVenueChange} /></div>
          <div className="form-group"><label>Opening Time</label><input name="opening_time" type="time" value={venueDetails.opening_time} onChange={handleVenueChange} required /></div>
          <div className="form-group"><label>Closing Time</label><input name="closing_time" type="time" value={venueDetails.closing_time} onChange={handleVenueChange} required /></div>
          <div className="form-group grid-col-span-2"><label>Description</label><textarea name="description" rows="3" value={venueDetails.description} onChange={handleVenueChange}></textarea></div>
        </div>

        <h3 className="form-section-title">2. Add Facilities</h3>
        <div className="facility-subform">
          <div className="form-grid">
            <div className="form-group"><label>Facility Name (e.g., Court 1)</label><input name="name" type="text" value={currentFacility.name} onChange={handleFacilityChange} /></div>
            <div className="form-group"><label>Sport</label><select name="sport_id" value={currentFacility.sport_id} onChange={handleFacilityChange}>{sports.map(s => <option key={s.sport_id} value={s.sport_id}>{s.name}</option>)}</select></div>
            <div className="form-group"><label>Hourly Rate (₹)</label><input name="hourly_rate" type="number" value={currentFacility.hourly_rate} onChange={handleFacilityChange} /></div>
            <div className="form-group"><label>Capacity</label><input name="capacity" type="number" value={currentFacility.capacity} onChange={handleFacilityChange} /></div>
          </div>
          <label>Amenities for this Facility</label>
          <div className="amenities-checklist">
            {amenities.map(a => (
              <label key={a.amenity_id} className="amenity-checkbox">
                <input type="checkbox" checked={currentFacility.selectedAmenities.has(a.amenity_id)} onChange={() => handleAmenityToggle(a.amenity_id)} />
                {a.name}
              </label>
            ))}
          </div>
          <button type="button" className="btn btn-secondary" onClick={handleAddFacility} style={{ alignSelf: 'flex-end' }}>Add Facility</button>
        </div>
        
        <div className="added-facilities-list">
          {facilities.map((facility) => (
            <div key={facility.id} className="added-facility-card">
              <strong>{facility.name}</strong> ({sports.find(s => s.sport_id === facility.sport_id)?.name}) - ₹{facility.hourly_rate}/hr
            </div>
          ))}
        </div>

        <button type="submit" className="auth-submit-button" disabled={loading}>
          {loading ? "Submitting Venue..." : "Submit for Approval"}
        </button>
      </form>
    </div>
  );
}

export default AddVenuePage;