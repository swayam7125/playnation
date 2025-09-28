// src/pages/owner/AddVenuePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../AuthContext";
import { useModal } from "../../ModalContext";
import {
  FaUpload,
  FaPlus,
  FaTimes,
  FaCheck,
  FaMapMarkerAlt,
  FaClock,
  FaPhone,
  FaEnvelope,
  FaStar,
  FaImages,
} from "react-icons/fa";

function AddVenuePage() {
  const { user } = useAuth();
  const { showModal } = useModal();
  const navigate = useNavigate();

  const [venueDetails, setVenueDetails] = useState({
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
  });

  // --- MODIFICATION: Handle multiple images ---
  const [venueImageFiles, setVenueImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  // --- END MODIFICATION ---

  const [facilities, setFacilities] = useState([]);

  const [currentFacility, setCurrentFacility] = useState({
    name: "",
    sport_id: "",
    hourly_rate: "",
    capacity: "",
    selectedAmenities: new Set(),
  });

  const [sports, setSports] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    const fetchOptions = async () => {
      const { data: sportsData } = await supabase.from("sports").select("*");
      const { data: amenitiesData } = await supabase
        .from("amenities")
        .select("*");
      setSports(sportsData || []);
      setAmenities(amenitiesData || []);
      if (sportsData && sportsData.length > 0) {
        setCurrentFacility((prev) => ({
          ...prev,
          sport_id: sportsData[0].sport_id,
        }));
      }
    };
    fetchOptions();
  }, []);

  const handleVenueChange = (e) =>
    setVenueDetails({ ...venueDetails, [e.target.name]: e.target.value });
  const handleFacilityChange = (e) =>
    setCurrentFacility({ ...currentFacility, [e.target.name]: e.target.value });

  // --- MODIFICATION: Handle multiple file selection ---
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setVenueImageFiles(files);
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previewUrls);
  };

  const handleRemoveImage = (index) => {
    setVenueImageFiles((files) => files.filter((_, i) => i !== index));
    setImagePreviews((previews) => previews.filter((_, i) => i !== index));
  };
  // --- END MODIFICATION ---

  const handleAmenityToggle = (amenityId) => {
    setCurrentFacility((prev) => {
      const newAmenities = new Set(prev.selectedAmenities);
      newAmenities.has(amenityId)
        ? newAmenities.delete(amenityId)
        : newAmenities.add(amenityId);
      return { ...prev, selectedAmenities: newAmenities };
    });
  };

  const handleAddFacility = async () => {
    if (
      !currentFacility.name ||
      !currentFacility.sport_id ||
      !currentFacility.hourly_rate
    ) {
      await showModal({
        title: "Required Fields",
        message: "Please provide a facility name, sport, and hourly rate.",
      });
      return;
    }
    setFacilities([...facilities, { ...currentFacility, id: Date.now() }]);
    setCurrentFacility({
      name: "",
      sport_id: sports[0]?.sport_id || "",
      hourly_rate: "",
      capacity: "",
      selectedAmenities: new Set(),
    });
  };

  const removeFacility = (id) => {
    setFacilities(facilities.filter((f) => f.id !== id));
  };

  // --- MODIFICATION: Updated submit handler for multiple images ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in.");
      return;
    }
    if (venueImageFiles.length === 0) {
      await showModal({
        title: "Images Required",
        message: "Please upload at least one image for the venue.",
      });
      return;
    }
    if (facilities.length === 0) {
      await showModal({
        title: "Missing Facilities",
        message: "Please add at least one facility to the venue.",
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const uploadPromises = venueImageFiles.map((file) => {
        const imageName = `${user.id}/${Date.now()}-${file.name}`;
        return supabase.storage.from("venue-images").upload(imageName, file);
      });

      const uploadResults = await Promise.all(uploadPromises);

      const imageUrls = uploadResults.map((result, index) => {
        if (result.error) {
          // Attempt to remove already uploaded files if one fails
          const successfulUploads = uploadResults
            .slice(0, index)
            .map((res) => res.data.path);
          if (successfulUploads.length > 0) {
            supabase.storage.from("venue-images").remove(successfulUploads);
          }
          throw result.error;
        }
        return supabase.storage
          .from("venue-images")
          .getPublicUrl(result.data.path).data.publicUrl;
      });

      const { data: newVenue, error: venueError } = await supabase
        .from("venues")
        .insert({
          ...venueDetails,
          owner_id: user.id,
          is_approved: false,
          image_url: imageUrls,
        })
        .select()
        .single();

      if (venueError) {
        await supabase.storage
          .from("venue-images")
          .remove(imageUrls.map((url) => url.split("/").slice(-2).join("/")));
        throw venueError;
      }

      // ... (rest of the facility creation logic remains the same)
      for (const facility of facilities) {
        const { data: newFacility, error: facilityError } = await supabase
          .from("facilities")
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

        const amenitiesToInsert = Array.from(facility.selectedAmenities).map(
          (amenityId) => ({
            facility_id: newFacility.facility_id,
            amenity_id: amenityId,
            created_at: new Date(),
            updated_at: new Date(),
          })
        );

        if (amenitiesToInsert.length > 0) {
          const { error: amenityError } = await supabase
            .from("facility_amenities")
            .insert(amenitiesToInsert);
          if (amenityError) throw amenityError;
        }
      }

      await showModal({
        title: "Submission Successful",
        message: "Venue submitted for approval successfully!",
      });
      navigate("/owner/my-venues");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  // --- END MODIFICATION ---

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      {/* ... (Header and Progress Steps remain the same) */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-green via-emerald-500 to-teal-500 bg-clip-text text-transparent mb-2">
              Create Your Venue
            </h1>
            <p className="text-slate-600">
              Join our platform by adding your sports venue
            </p>
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 mb-6">
          <div className="flex justify-center">
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  activeStep >= 1
                    ? "bg-primary-green text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                <FaMapMarkerAlt className="text-xs" />
                <span className="hidden sm:inline">Venue Info</span>
              </div>
              <div
                className={`w-8 h-0.5 ${
                  activeStep >= 2 ? "bg-primary-green" : "bg-slate-300"
                }`}
              ></div>
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  activeStep >= 2
                    ? "bg-primary-green text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                <FaStar className="text-xs" />
                <span className="hidden sm:inline">Facilities</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 px-4 py-3 rounded-2xl flex items-center gap-2">
              <FaTimes />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-green via-emerald-500 to-teal-500 p-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FaMapMarkerAlt /> Venue Information
              </h2>
            </div>

            <div className="p-6 space-y-4">
              {/* --- MODIFICATION: Updated Image Upload section --- */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Venue Images <span className="text-red-500">*</span>
                </label>

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index}`}
                          className="w-full h-24 object-cover rounded-xl shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="relative">
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-primary-green transition-colors cursor-pointer">
                    <FaImages className="mx-auto text-3xl text-slate-400 mb-2" />
                    <p className="text-slate-600 font-medium">
                      Upload one or more images
                    </p>
                    <p className="text-slate-400 text-sm">
                      PNG, JPG up to 10MB each
                    </p>
                  </div>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    multiple
                    required={venueImageFiles.length === 0}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                  />
                </div>
              </div>
              {/* --- END MODIFICATION --- */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ... (Rest of the form inputs remain the same) */}
                <div className="md:col-span-2">
                  <input
                    name="name"
                    type="text"
                    value={venueDetails.name}
                    onChange={handleVenueChange}
                    required
                    className="w-full py-3 px-4 bg-white/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                    placeholder="Venue Name *"
                  />
                </div>
                <div className="md:col-span-2">
                  <input
                    name="address"
                    type="text"
                    value={venueDetails.address}
                    onChange={handleVenueChange}
                    required
                    className="w-full py-3 px-4 bg-white/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                    placeholder="Full Address *"
                  />
                </div>
                <input
                  name="city"
                  type="text"
                  value={venueDetails.city}
                  onChange={handleVenueChange}
                  required
                  className="w-full py-3 px-4 bg-white/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                  placeholder="City *"
                />
                <input
                  name="state"
                  type="text"
                  value={venueDetails.state}
                  onChange={handleVenueChange}
                  required
                  className="w-full py-3 px-4 bg-white/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                  placeholder="State *"
                />
                <input
                  name="zip_code"
                  type="text"
                  value={venueDetails.zip_code}
                  onChange={handleVenueChange}
                  className="w-full py-3 px-4 bg-white/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                  placeholder="Zip Code"
                />
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-green" />
                  <input
                    name="contact_email"
                    type="email"
                    value={venueDetails.contact_email}
                    onChange={handleVenueChange}
                    className="w-full py-3 pl-10 pr-4 bg-white/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                    placeholder="Contact Email"
                  />
                </div>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-green" />
                  <input
                    name="contact_phone"
                    type="tel"
                    value={venueDetails.contact_phone}
                    onChange={handleVenueChange}
                    className="w-full py-3 pl-10 pr-4 bg-white/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                    placeholder="Phone Number"
                  />
                </div>
                <div className="relative">
                  <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-green" />
                  <input
                    name="opening_time"
                    type="time"
                    value={venueDetails.opening_time}
                    onChange={handleVenueChange}
                    required
                    className="w-full py-3 pl-10 pr-4 bg-white/50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                  />
                </div>
                <div className="relative">
                  <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-green" />
                  <input
                    name="closing_time"
                    type="time"
                    value={venueDetails.closing_time}
                    onChange={handleVenueChange}
                    required
                    className="w-full py-3 pl-10 pr-4 bg-white/50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <textarea
                    name="description"
                    rows="3"
                    value={venueDetails.description}
                    onChange={handleVenueChange}
                    className="w-full py-3 px-4 bg-white/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all resize-none"
                    placeholder="Describe your venue, facilities, and what makes it special..."
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="w-full bg-gradient-to-r from-primary-green to-emerald-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Next: Add Facilities
              </button>
            </div>
          </div>

          {/* ... (Facilities and Submit sections remain the same) ... */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FaStar /> Add Facilities
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-200">
                <h3 className="font-semibold text-slate-800 mb-4">
                  Create New Facility
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <input
                    name="name"
                    type="text"
                    value={currentFacility.name}
                    onChange={handleFacilityChange}
                    className="w-full py-2 px-3 bg-white/70 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                    placeholder="Facility Name"
                  />
                  <select
                    name="sport_id"
                    value={currentFacility.sport_id}
                    onChange={handleFacilityChange}
                    className="w-full py-2 px-3 bg-white/70 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                  >
                    {sports.map((s) => (
                      <option key={s.sport_id} value={s.sport_id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <input
                    name="hourly_rate"
                    type="number"
                    value={currentFacility.hourly_rate}
                    onChange={handleFacilityChange}
                    className="w-full py-2 px-3 bg-white/70 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                    placeholder="Rate (₹/hour)"
                  />
                  <input
                    name="capacity"
                    type="number"
                    value={currentFacility.capacity}
                    onChange={handleFacilityChange}
                    className="w-full py-2 px-3 bg-white/70 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                    placeholder="Capacity"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Amenities
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {amenities.map((a) => (
                      <label
                        key={a.amenity_id}
                        className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-white/50 hover:bg-white/80 transition-colors cursor-pointer text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={currentFacility.selectedAmenities.has(
                            a.amenity_id
                          )}
                          onChange={() => handleAmenityToggle(a.amenity_id)}
                          className="w-3 h-3 text-primary-green bg-white border-slate-300 rounded focus:ring-primary-green"
                        />
                        <span className="text-slate-700">{a.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddFacility}
                  className="bg-gradient-to-r from-primary-green to-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <FaPlus className="text-sm" /> Add Facility
                </button>
              </div>
              {facilities.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-800 mb-3">
                    Added Facilities ({facilities.length})
                  </h3>
                  <div className="space-y-2">
                    {facilities.map((facility) => (
                      <div
                        key={facility.id}
                        className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-3 flex justify-between items-center"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-medium text-slate-800">
                              {facility.name}
                            </span>
                            <span className="px-2 py-1 bg-primary-green text-white text-xs rounded-full">
                              {
                                sports.find(
                                  (s) => s.sport_id === facility.sport_id
                                )?.name
                              }
                            </span>
                            <span className="text-emerald-600 font-medium text-sm">
                              ₹{facility.hourly_rate}/hr
                            </span>
                          </div>
                          {facility.capacity && (
                            <span className="text-xs text-slate-600">
                              Capacity: {facility.capacity} players
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => removeFacility(facility.id)}
                          className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <FaTimes className="text-sm" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-primary-green via-emerald-500 to-teal-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <FaCheck /> Submit for Approval
                </>
              )}
            </button>
            <p className="text-slate-500 text-sm mt-3">
              Your venue will be reviewed within 24-48 hours
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddVenuePage;
