import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useModal } from "../../ModalContext.jsx";
import {
  FaImages,
  FaMapMarkerAlt,
  FaClock,
  FaPhone,
  FaEnvelope,
  FaTrash,
} from "react-icons/fa";
import LocationPickerMap from '../../components/maps/LocationPickerMap'; // Import the map component

function AddVenuePage() {
  const { showModal } = useModal();
  const navigate = useNavigate();
  const location = useLocation();

  const [venueDetails, setVenueDetails] = useState(
    location.state?.venueDetails || {
      name: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      description: "",
      contact_email: "",
      contact_phone: "",
      opening_time: "06:00",
      closing_time: "23:00",
      google_maps_url: "", // Optional Google Maps URL field
      // Latitude and Longitude will be handled by the map component state now
      cancellation_cutoff_hours: 24, // Default 24 hours
      // cancellation_fee_percentage: 0, // We'll just use the cutoff for now
    }
  );

  const [venueImageFiles, setVenueImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // State for map coordinates
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Cleanup object URLs on component unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleVenueChange = (e) =>
    setVenueDetails({ ...venueDetails, [e.target.name]: e.target.value });

  // THE FIX: This function now appends images instead of replacing them
  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (newFiles.length === 0) return;

    // Append new files to the existing array
    setVenueImageFiles(prevFiles => [...prevFiles, ...newFiles]);

    // Create new preview URLs and append them to the existing previews
    const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviewUrls]);
  };

  const clearImages = () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
      setImagePreviews([]);
      setVenueImageFiles([]);
  }

  const handleNextStep = (e) => {
    e.preventDefault();
    if (venueImageFiles.length === 0) {
      showModal({
        title: "Images Required",
        message: "Please upload at least one image for the venue.",
      });
      return;
    }

    if (!selectedLocation) { // Check if location is selected
      showModal({ title: "Location Required", message: "Please select the venue location on the map." });
      return;
    }

    // Combine venue details and location for the next step
    const completeVenueDetails = {
      ...venueDetails,
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
    };

    navigate('/owner/add-facilities', {
      state: {
        venueDetails: completeVenueDetails, // Pass combined details
        // Note: Passing actual File objects in navigation state can be problematic.
        // It's often better to handle uploads here or pass minimal info.
        // For simplicity, we'll pass them, but be aware of potential size limits.
        venueImageFiles,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-4">
          <div className="bg-primary-green rounded-2xl shadow-lg p-4 relative overflow-hidden">
            <div className="absolute -top-8 -left-8 w-24 h-24 border-4 border-white/10 rounded-full"></div>
            <div className="absolute -bottom-8 -right-8 w-24 h-24 border-4 border-white/10 rounded-full"></div>
            <h1 className="text-2xl font-bold text-white mb-1 relative z-10">
              Step 1: Create Your Venue
            </h1>
            <p className="text-white/80 text-sm relative z-10">
              Add your venue's details to get started.
            </p>
          </div>
        </div>

        <form onSubmit={handleNextStep} className="space-y-4">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <div className="bg-primary-green p-3 relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-24 h-24 border-4 border-white/10 rounded-full"></div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2 relative z-10">
                <FaMapMarkerAlt /> Venue Information
              </h2>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Venue Images <span className="text-red-500">*</span>
                    </label>
                    {imagePreviews.length > 0 && (
                        <button type="button" onClick={clearImages} className="text-xs text-red-500 font-semibold flex items-center gap-1">
                            <FaTrash /> Clear All
                        </button>
                    )}
                </div>

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-2">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img src={preview} alt={`Preview ${index}`} className="w-full h-16 object-cover rounded-md" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-4 text-center cursor-pointer hover:border-primary-green transition-colors">
                  <FaImages className="mx-auto text-2xl text-slate-400 mb-1" />
                  <p className="text-sm text-slate-600">Add More Images</p>
                  <p className="text-xs text-slate-500 mt-1">(Re-select if you go back)</p>
                  <input type="file" onChange={handleImageChange} multiple className="absolute inset-0 w-full h-full opacity-0" accept="image/*" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input name="name" type="text" value={venueDetails.name} onChange={handleVenueChange} required className="w-full py-2 px-3 bg-white/50 border rounded-lg text-sm" placeholder="Venue Name *" />
                <input name="address" type="text" value={venueDetails.address} onChange={handleVenueChange} required className="w-full py-2 px-3 bg-white/50 border rounded-lg text-sm" placeholder="Full Address *" />
                <input name="city" type="text" value={venueDetails.city} onChange={handleVenueChange} required className="w-full py-2 px-3 bg-white/50 border rounded-lg text-sm" placeholder="City *" />
                <input name="state" type="text" value={venueDetails.state} onChange={handleVenueChange} required className="w-full py-2 px-3 bg-white/50 border rounded-lg text-sm" placeholder="State *" />
                 <input name="zip_code" type="text" value={venueDetails.zip_code} onChange={handleVenueChange} className="w-full py-2 px-3 bg-white/50 border rounded-lg text-sm" placeholder="ZIP Code" />
                <input name="google_maps_url" type="url" value={venueDetails.google_maps_url} onChange={handleVenueChange} className="w-full py-2 px-3 bg-white/50 border rounded-lg text-sm" placeholder="Google Maps Share Link (Optional)" />
                <div className="relative"><FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-green text-xs" /><input name="contact_email" type="email" value={venueDetails.contact_email} onChange={handleVenueChange} className="w-full py-2 pl-8 pr-3 bg-white/50 border rounded-lg text-sm" placeholder="Contact Email" /></div>
                <div className="relative"><FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-green text-xs" /><input name="contact_phone" type="tel" value={venueDetails.contact_phone} onChange={handleVenueChange} className="w-full py-2 pl-8 pr-3 bg-white/50 border rounded-lg text-sm" placeholder="Phone Number" /></div>
                <div className="relative"><FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-green text-xs" /><label className="sr-only" htmlFor="opening_time">Opening Time</label><input id="opening_time" name="opening_time" type="time" value={venueDetails.opening_time} onChange={handleVenueChange} required className="w-full py-2 pl-8 pr-3 bg-white/50 border rounded-lg text-sm" /></div>
                <div className="relative"><FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-green text-xs" /><label className="sr-only" htmlFor="closing_time">Closing Time</label><input id="closing_time" name="closing_time" type="time" value={venueDetails.closing_time} onChange={handleVenueChange} required className="w-full py-2 pl-8 pr-3 bg-white/50 border rounded-lg text-sm" /></div>
                <div className="md:col-span-2"><textarea name="description" rows="2" value={venueDetails.description} onChange={handleVenueChange} className="w-full py-2 px-3 bg-white/50 border rounded-lg resize-none text-sm" placeholder="Describe your venue..."></textarea></div>
                <div className="pt-4 border-t border-gray-200">
                 <h3 className="text-md font-semibold text-slate-800 mb-2">Cancellation Policy</h3>
                 <div>
                    <label 
                      htmlFor="cancellation_cutoff_hours" 
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Cancellation Cutoff (in hours)
                    </label>
                    <input 
                      id="cancellation_cutoff_hours"
                      name="cancellation_cutoff_hours" 
                      type="number" 
                      value={venueDetails.cancellation_cutoff_hours} 
                      onChange={handleVenueChange} 
                      required 
                      min="0"
                      className="w-full py-2 px-3 bg-white/50 border rounded-lg text-sm" 
                      placeholder="e.g., 24" 
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Time in hours before a booking that a player can cancel (e.g., 24).
                    </p>
                 </div>
              </div>
              </div>

               {/* Add the Location Picker Map */}
               <div className="md:col-span-2">
                 <LocationPickerMap onLocationSelect={setSelectedLocation} />
               </div>

              <button type="submit" className="w-full bg-primary-green hover:bg-primary-green-dark text-white py-2.5 rounded-lg font-semibold transition-colors">
                Continue to Add Facilities
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddVenuePage;