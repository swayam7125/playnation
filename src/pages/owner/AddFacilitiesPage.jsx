// src/pages/owner/AddFacilitiesPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../AuthContext";
import { useModal } from "../../ModalContext";
import toast from "react-hot-toast";
import { FaPlus, FaTrash, FaRupeeSign, FaUsers, FaArrowLeft, FaSpinner } from "react-icons/fa";
import { v4 as uuidv4 } from 'uuid';

// Helper function to upload a single image
const uploadVenueImage = async (file, userId) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `venue-images/${userId}/${fileName}`;

    const { data, error } = await supabase.storage
        .from('venue-images')
        .upload(filePath, file);

    if (error) {
        console.error('Error uploading image:', error);
        throw error;
    }

    const { data: urlData } = supabase.storage.from('venue-images').getPublicUrl(filePath);
    return urlData.publicUrl;
};


function AddFacilitiesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showModal } = useModal();
  const { venueDetails, venueImageFiles } = location.state || {};

  const [facilities, setFacilities] = useState([]);
  const [sports, setSports] = useState([]);
  const [allAmenities, setAllAmenities] = useState([]); // 👈 For amenity checkboxes

  const [newFacility, setNewFacility] = useState({
    name: "",
    sport_id: "",
    capacity: "",
    hourly_rate: "",
    description: "",
    selectedAmenities: new Set(), // 👈 To track selections
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if state is missing
  useEffect(() => {
    if (!venueDetails || !venueImageFiles || !user) {
      console.error("Missing venue details, images, or user.");
      toast.error("An error occurred. Please start over.");
      navigate("/owner/add-venue");
    }
  }, [venueDetails, venueImageFiles, user, navigate]);

  // Fetch sports and amenities
  useEffect(() => {
    const fetchData = async () => {
      // Fetch Sports
      const { data: sportsData, error: sportsError } = await supabase.from("sports").select("*");
      if (sportsError) {
        toast.error("Could not fetch sports list.");
      } else {
        setSports(sportsData);
      }
      // Fetch Amenities
      const { data: amenitiesData, error: amenitiesError } = await supabase.from("amenities").select("*");
       if (amenitiesError) {
        toast.error("Could not fetch amenities list.");
      } else {
        setAllAmenities(amenitiesData);
      }
    };
    fetchData();
  }, []);

  const handleFacilityChange = (e) =>
    setNewFacility({ ...newFacility, [e.target.name]: e.target.value });

  // Handle amenity checkbox changes
  const handleAmenityChange = (amenityId) => {
      setNewFacility(prev => {
          const newAmenities = new Set(prev.selectedAmenities);
          if (newAmenities.has(amenityId)) {
              newAmenities.delete(amenityId);
          } else {
              newAmenities.add(amenityId);
          }
          return { ...prev, selectedAmenities: newAmenities };
      });
  };

  const handleAddFacility = (e) => {
    e.preventDefault();
    if (!newFacility.name || !newFacility.sport_id || !newFacility.hourly_rate) {
      toast.error("Please fill in Name, Sport, and Hourly Rate.");
      return;
    }
    setFacilities([...facilities, newFacility]);
    // Reset form
    setNewFacility({
      name: "",
      sport_id: "",
      capacity: "",
      hourly_rate: "",
      description: "",
      selectedAmenities: new Set(),
    }); 
  };

  const handleRemoveFacility = (index) => {
    setFacilities(facilities.filter((_, i) => i !== index));
  };

  // --- YOUR NEW `handleFinish` FUNCTION (renamed to `handleVenueSubmit`) ---
  const handleVenueSubmit = async () => {
      if (facilities.length === 0) {
          const confirmed = await showModal({
              title: "No Facilities Added",
              message: "Are you sure you want to finish without adding facilities?",
              confirmText: "Yes, Finish",
              showCancel: true // 👈 Ensure cancel button shows
          });
          if (!confirmed) return;
      }

      setIsSubmitting(true);
      const loadingToast = toast.loading("Submitting venue...");

      try {
          // 1. Upload Images in Parallel (from your function)
          const uploadPromises = venueImageFiles.map((file) => {
              // Using the robust helper function for unique names
              return uploadVenueImage(file, user.id);
          });
          const imageUrls = await Promise.all(uploadPromises);

          // 2. Insert Venue
          const { data: newVenue, error: venueError } = await supabase
              .from("venues")
              .insert({ 
                  ...venueDetails, 
                  owner_id: user.id, 
                  image_url: imageUrls,
                  is_approved: false // 👈 Added this for the admin approval flow
              })
              .select('venue_id')
              .single();
          if (venueError) throw venueError;
          if (!newVenue) throw new Error("Venue creation failed.");

          // 3. Insert Facilities and Amenities (from your function)
          for (const facility of facilities) {
              const { data: newFacilityData, error: facilityError } = await supabase
                  .from('facilities')
                  .insert({ 
                      venue_id: newVenue.venue_id, 
                      name: facility.name, 
                      sport_id: facility.sport_id, 
                      hourly_rate: parseFloat(facility.hourly_rate), // 👈 Ensure it's a number
                      capacity: facility.capacity ? parseInt(facility.capacity, 10) : null // 👈 Ensure it's a number
                  })
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

          toast.success("Venue submitted and pending approval!", {
              id: loadingToast, // 👈 Update the loading toast
              duration: 4000,
          });
          navigate('/owner/my-venues');

      } catch (err) {
          toast.error(`Error: ${err.message}`, { id: loadingToast }); // 👈 Update loading toast on error
          showModal({ title: "Error", message: `An error occurred: ${err.message}` });
      } finally {
          setIsSubmitting(false);
      }
  };
  
  const getSportName = (sportId) => {
      const sport = sports.find(s => String(s.sport_id) === String(sportId));
      return sport ? sport.name : 'Unknown';
  }
  
  const getAmenityName = (amenityId) => {
      const amenity = allAmenities.find(a => a.amenity_id === amenityId);
      return amenity ? amenity.name : '...';
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/owner/add-venue", { state: { venueDetails } })}
          className="mb-4 text-sm font-semibold text-primary-green flex items-center gap-2"
        >
          <FaArrowLeft /> Back to Venue Details
        </button>
        <div className="text-center mb-4">
          <div className="bg-primary-green rounded-2xl shadow-lg p-4 relative overflow-hidden">
            <div className="absolute -top-8 -left-8 w-24 h-24 border-4 border-white/10 rounded-full"></div>
            <div className="absolute -bottom-8 -right-8 w-24 h-24 border-4 border-white/10 rounded-full"></div>
            <h1 className="text-2xl font-bold text-white mb-1 relative z-10">
              Step 2: Add Facilities
            </h1>
            <p className="text-white/80 text-sm relative z-10">
              Add at least one facility (e.g., "Court 1", "Turf A").
            </p>
          </div>
        </div>

        {/* Facility List */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 mb-4">
          <h2 className="text-lg font-bold text-slate-700 mb-2">Your Facilities ({facilities.length})</h2>
          {facilities.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-4">No facilities added yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {facilities.map((fac, index) => (
                <div key={index} className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 relative">
                    <button onClick={() => handleRemoveFacility(index)} className="absolute top-2 right-2 text-red-400 hover:text-red-600">
                        <FaTrash />
                    </button>
                    <p className="font-bold text-emerald-800">{fac.name}</p>
                    <p className="text-sm text-emerald-700">{getSportName(fac.sport_id)}</p>
                    <div className="flex gap-4 text-sm mt-2">
                        <span className="flex items-center gap-1"><FaRupeeSign className="text-xs" /> {fac.hourly_rate}/hr</span>
                        {fac.capacity && <span className="flex items-center gap-1"><FaUsers className="text-xs" /> {fac.capacity}</span>}
                    </div>
                    {fac.selectedAmenities.size > 0 && (
                        <div className="mt-2 pt-2 border-t border-emerald-200">
                            <p className="text-xs font-semibold text-emerald-600">Amenities:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {Array.from(fac.selectedAmenities).map(id => (
                                    <span key={id} className="text-xs bg-white text-emerald-700 px-1.5 py-0.5 rounded-full border border-emerald-200">
                                        {getAmenityName(id)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>


        {/* Add Facility Form */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          <div className="bg-primary-green p-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FaPlus /> Add a New Facility
            </h2>
          </div>
          <form onSubmit={handleAddFacility} className="p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                name="name"
                type="text"
                value={newFacility.name}
                onChange={handleFacilityChange}
                className="w-full py-2 px-3 bg-white/50 border rounded-lg text-sm"
                placeholder="Facility Name (e.g., Court 1) *"
              />
              <select
                name="sport_id"
                value={newFacility.sport_id}
                onChange={handleFacilityChange}
                className="w-full py-2 px-3 bg-white/50 border rounded-lg text-sm"
              >
                <option value="">Select Sport *</option>
                {sports.map((sport) => (
                  <option key={sport.sport_id} value={sport.sport_id}>
                    {sport.name}
                  </option>
                ))}
              </select>
              <input
                name="hourly_rate"
                type="number"
                value={newFacility.hourly_rate}
                onChange={handleFacilityChange}
                className="w-full py-2 px-3 bg-white/50 border rounded-lg text-sm"
                placeholder="Hourly Rate (₹) *"
              />
              <input
                name="capacity"
                type="number"
                value={newFacility.capacity}
                onChange={handleFacilityChange}
                className="w-full py-2 px-3 bg-white/50 border rounded-lg text-sm"
                placeholder="Capacity (e.g., 10)"
              />
               <textarea
                name="description"
                rows="2"
                value={newFacility.description}
                onChange={handleFacilityChange}
                className="w-full md:col-span-2 py-2 px-3 bg-white/50 border rounded-lg resize-none text-sm"
                placeholder="Description (Optional)"
              />
            </div>
            
            {/* --- AMENITIES CHECKBOXES --- */}
            {allAmenities.length > 0 && (
                <div className="pt-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Available Amenities</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {allAmenities.map(amenity => (
                            <label key={amenity.amenity_id} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                <input 
                                    type="checkbox"
                                    checked={newFacility.selectedAmenities.has(amenity.amenity_id)}
                                    onChange={() => handleAmenityChange(amenity.amenity_id)}
                                    className="rounded text-primary-green focus:ring-primary-green"
                                />
                                {amenity.name}
                            </label>
                        ))}
                    </div>
                </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-slate-700 hover:bg-slate-800 text-white py-2.5 rounded-lg font-semibold transition-colors"
            >
              Add This Facility to List
            </button>
          </form>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
            <button
                onClick={handleVenueSubmit}
                disabled={isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {isSubmitting ? (
                    <>
                        <FaSpinner className="animate-spin" /> Submitting...
                    </>
                ) : (
                    "Submit Venue for Approval"
                )}
            </button>
        </div>
      </div>
    </div>
  );
}

export default AddFacilitiesPage;