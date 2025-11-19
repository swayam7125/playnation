// src/components/offers/OfferForm.jsx
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../AuthContext";
import toast from 'react-hot-toast';
import Select from 'react-select'; // Import react-select
import {
  FiTag,
  FiFileText,
  FiPercent,
  FiStar,
  FiCalendar,
  FiMapPin,
  FiX,
  FiCheck,
  FiGlobe,
  FiImage,
  FiAward, // Icon for Sports
} from "react-icons/fi";
import { ChevronDown } from "lucide-react";

// --- Helper Functions ---
const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  // Adjust for timezone offset to ensure the correct date is displayed locally
  const offset = date.getTimezoneOffset();
  const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
  return adjustedDate.toISOString().split("T")[0];
};

const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener); // Also handle touch events
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

// --- Component ---
const OfferForm = ({ offer, onSave, onCancel }) => {
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === "admin";
  const formRef = useRef();

  useClickOutside(formRef, onCancel); // Close modal on outside click

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discount_percentage: "",
    offer_type: "percentage_discount", // Default type
    fixed_discount_amount: "",
    is_global: false,
    valid_from: "",
    valid_until: "",
    venue_id: null,
    background_image_url: "",
    applies_to_all_sports: false, // New field
    min_booking_value: "",
    max_uses: "",
    max_uses_per_user: "",
    offer_code: "",
  });

  const [venues, setVenues] = useState([]);
  const [allSports, setAllSports] = useState([]); // For dropdown options [{ value, label }]
  const [selectedSports, setSelectedSports] = useState([]); // For selected sport options [{ value, label }]
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch Venues (only needed for Admin)
  useEffect(() => {
    const fetchVenues = async () => {
      if (!isAdmin) return;
      const { data, error } = await supabase.from("venues").select("venue_id, name");
      if (error) {
        console.error("Error fetching venues:", error);
      } else {
        setVenues(data || []);
      }
    };
    fetchVenues();
  }, [isAdmin]);

  // Fetch All Sports (needed for sport selection)
  useEffect(() => {
    const fetchSports = async () => {
      const { data, error } = await supabase.from('sports').select('sport_id, name').order('name');
      if (error) {
        console.error("Error fetching sports:", error);
      } else {
        // Format for react-select
        setAllSports(data.map(sport => ({ value: sport.sport_id, label: sport.name })));
      }
    };
    fetchSports();
  }, []);

  // Effect to populate form when editing an offer
  useEffect(() => {
    if (offer) {
      setFormData({
        title: offer.title || "",
        description: offer.description || "",
        discount_percentage: offer.discount_percentage || "",
        offer_type: offer.offer_type || "percentage_discount",
        fixed_discount_amount: offer.fixed_discount_amount || "",
        is_global: offer.is_global || false,
        valid_from: formatDateForInput(offer.valid_from),
        valid_until: formatDateForInput(offer.valid_until),
        venue_id: offer.venue_id || null,
        background_image_url: offer.background_image_url || "",
        applies_to_all_sports: offer.applies_to_all_sports || false, // Populate checkbox
        min_booking_value: offer.min_booking_value || "",
        max_uses: offer.max_uses || "",
        max_uses_per_user: offer.max_uses_per_user || "",
        offer_code: offer.offer_code || "",
      });

      // Fetch and set selected sports if not applicable to all
      const fetchOfferSports = async () => {
          if (offer.offer_id && !offer.applies_to_all_sports) {
              const { data: offerSportsData, error: offerSportsError } = await supabase
                  .from('offer_sports')
                  .select('sport_id, sports(name)')
                  .eq('offer_id', offer.offer_id);

              if (!offerSportsError && offerSportsData) {
                  setSelectedSports(offerSportsData.map(os => ({
                      value: os.sport_id,
                      label: os.sports.name
                  })));
              } else {
                 console.error("Error fetching offer sports:", offerSportsError);
                 setSelectedSports([]);
              }
          } else {
              setSelectedSports([]); // Clear selection if applies to all or new offer
          }
      };
      fetchOfferSports();

    } else {
       // Reset form for new offer
       setFormData({
         title: "", description: "", discount_percentage: "",
         offer_type: "percentage_discount", fixed_discount_amount: "",
         is_global: false, valid_from: "", valid_until: "",
         venue_id: null, background_image_url: "",
         applies_to_all_sports: false, min_booking_value: "",
         max_uses: "", max_uses_per_user: "", offer_code: "",
       });
       setSelectedSports([]);
    }
  }, [offer]); // Re-run when the offer prop changes

  // General input change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Handle checkboxes specifically
      [name]: type === "checkbox" ? checked : value,
      // Clear conflicting discount type if switching
      ...(name === 'offer_type' && value === 'percentage_discount' && { fixed_discount_amount: "" }),
      ...(name === 'offer_type' && value === 'fixed_amount_discount' && { discount_percentage: "" }),
      // Clear venue if global is checked (Admin only)
      ...(isAdmin && name === 'is_global' && checked && { venue_id: null }),
      // Clear selected sports if applies_to_all_sports is checked
      ...(name === 'applies_to_all_sports' && checked && { /* selectedSports cleared via setSelectedSports([]) below */ }),
    }));

     // Clear selected sports state directly when checking applies_to_all_sports
    if (name === 'applies_to_all_sports' && checked) {
        setSelectedSports([]);
    }
  };


  // --- Submit Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    const loadingToast = toast.loading('Saving offer...');

    // Determine venue ID based on role and global flag
    let venueIdToSave = null;
    if (!isAdmin) {
      // Find the owner's venue (assuming one venue per owner for simplicity here)
      const { data: ownerVenues, error: ownerVenuesError } = await supabase
        .from("venues")
        .select("venue_id")
        .eq("owner_id", user.id)
        .limit(1);

      if (ownerVenuesError || !ownerVenues || ownerVenues.length === 0) {
        toast.dismiss(loadingToast);
        toast.error("Could not find a venue associated with your account.");
        setIsSubmitting(false);
        return;
      }
      venueIdToSave = ownerVenues[0].venue_id;
    } else {
      // Admin: Save NULL if global, otherwise use selected venue_id
      venueIdToSave = formData.is_global ? null : formData.venue_id;
    }

    // Prepare main offer data
    const offerData = {
      title: formData.title,
      description: formData.description,
      offer_type: formData.offer_type,
      discount_percentage: formData.discount_percentage || null,
      fixed_discount_amount: formData.fixed_discount_amount || null,
      is_global: formData.is_global,
      valid_from: formData.valid_from || null,
      valid_until: formData.valid_until || null,
      venue_id: venueIdToSave,
      background_image_url: formData.background_image_url || null,
      applies_to_all_sports: formData.applies_to_all_sports, // Save this flag
      min_booking_value: formData.min_booking_value || null,
      max_uses: formData.max_uses || null,
      max_uses_per_user: formData.max_uses_per_user || null,
      offer_code: formData.offer_code || null, // Ensure offer code is saved
      // `is_active` is usually handled by toggle, not form, but could be added if needed
    };

    let savedOfferId = offer?.offer_id; // Use existing ID if editing
    let isNewOffer = !offer;

    // --- Save Offer Details ---
    let result;
    if (offer) { // Update existing offer
        result = await supabase
            .from("offers")
            .update(offerData)
            .eq("offer_id", offer.offer_id)
            .select('offer_id') // Ensure we get the ID back
            .single(); // Expecting a single row result
    } else { // Insert new offer
        result = await supabase
            .from("offers")
            .insert([offerData])
            .select('offer_id') // Select the ID of the newly inserted row
            .single(); // Expecting a single row result
    }

    const { data: savedOfferData, error: supabaseError } = result;

    if (supabaseError || !savedOfferData?.offer_id) {
        toast.dismiss(loadingToast);
        toast.error(`Failed to save offer details: ${supabaseError?.message || 'Could not retrieve saved offer ID.'}`);
        setIsSubmitting(false);
        return; // Stop if main offer save failed
    }

    // If it was a new offer, update savedOfferId
    savedOfferId = savedOfferData.offer_id;


    // --- Save Sport Associations (Only if main save succeeded) ---
    try {
        // 1. Delete ALL existing sport associations for this offer first
        const { error: deleteError } = await supabase
            .from('offer_sports')
            .delete()
            .eq('offer_id', savedOfferId);

        if (deleteError) throw deleteError; // Throw error to be caught below

        // 2. Insert new associations IF applies_to_all_sports is FALSE and specific sports ARE selected
        if (!formData.applies_to_all_sports && selectedSports.length > 0) {
            const sportsToInsert = selectedSports.map(sport => ({
                offer_id: savedOfferId,
                sport_id: sport.value // 'value' holds the sport_id from react-select
            }));
            const { error: insertError } = await supabase
                .from('offer_sports')
                .insert(sportsToInsert);

            if (insertError) throw insertError; // Throw error to be caught below
        }

        // If offer save and sport association updates (if needed) succeeded
        toast.dismiss(loadingToast);
        toast.success(`Offer successfully ${offer ? 'updated' : 'created'}.`);
        onSave(); // Call the onSave callback provided by parent

    } catch (sportsError) {
        toast.dismiss(loadingToast);
        // Notify about the sports association error, but the main offer data was likely saved/updated
        toast.error(`Offer details saved, but failed to update sport associations: ${sportsError.message}`);
        // Still call onSave because the main part succeeded
        onSave();
    } finally {
        setIsSubmitting(false);
    }
  };


  // --- Render Form ---
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div
        ref={formRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5"> {/* Adjusted spacing */}
          {/* --- HEADER --- */}
          <div className="flex justify-between items-center pb-4 border-b border-border-color">
            <h2 className="text-xl sm:text-2xl font-bold text-dark-text flex items-center gap-3">
              <FiStar className="text-primary-green" />
              {offer ? "Edit Offer" : "Create New Offer"}
            </h2>
            <button
              type="button"
              onClick={onCancel}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
              aria-label="Close form"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* --- FORM FIELDS --- */}
          <div className="space-y-4"> {/* Consistent spacing for fields */}
            {/* Offer Code */}
             <div className="relative">
              <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="offer_code"
                placeholder="Offer Code (e.g., WEEKEND20)"
                value={formData.offer_code}
                onChange={handleChange}
                // required // Make required if codes are mandatory
                className="w-full pl-10 pr-4 py-3 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-green-light focus:border-primary-green text-sm sm:text-base"
              />
            </div>

            {/* Title */}
            <div className="relative">
              <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="title"
                placeholder="Offer Title (e.g., Weekend Bonanza)"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-green-light focus:border-primary-green text-sm sm:text-base"
              />
            </div>

            {/* Description */}
            <div className="relative">
              <FiFileText className="absolute left-4 top-4 text-gray-400" />
              <textarea
                name="description"
                placeholder="Describe your offer..."
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full pl-10 pr-4 py-3 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-green-light focus:border-primary-green text-sm sm:text-base"
              ></textarea>
            </div>

            {/* Offer Type Selection */}
             <div className="relative">
               {/* Icon can be adjusted */}
               <FiPercent className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
               <div className="relative">
               <select
                 name="offer_type"
                 value={formData.offer_type}
                 onChange={handleChange}
                 required
                 className="appearance-none w-full pl-10 pr-4 py-3 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-green-light focus:border-primary-green text-sm sm:text-base cursor-pointer"
               >
                 <option value="percentage_discount">Percentage Discount</option>
                 <option value="fixed_amount_discount">Fixed Amount Discount</option>
                 {/* Add more types here as needed */}
               </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Discount Amount (Conditional) & Global Toggle */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Conditional Discount Input */}
               <div className="relative flex-1">
                 {formData.offer_type === 'percentage_discount' ? (
                    <>
                        <FiPercent className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="number"
                            name="discount_percentage"
                            placeholder="Discount %"
                            value={formData.discount_percentage}
                            onChange={handleChange}
                            required={formData.offer_type === 'percentage_discount'}
                            min="1"
                            max="100"
                            step="0.01" // Allow decimals
                            className="w-full pl-10 pr-4 py-3 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-green-light focus:border-primary-green text-sm sm:text-base"
                        />
                    </>
                 ) : ( // Fixed Amount
                     <>
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">₹</span>
                        <input
                            type="number"
                            name="fixed_discount_amount"
                            placeholder="Discount Amount (₹)"
                            value={formData.fixed_discount_amount}
                            onChange={handleChange}
                            required={formData.offer_type === 'fixed_amount_discount'}
                            min="0.01"
                            step="0.01"
                            className="w-full pl-10 pr-4 py-3 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-green-light focus:border-primary-green text-sm sm:text-base"
                        />
                     </>
                 )}
              </div>

              {/* Global Toggle (Admin Only) */}
              {isAdmin && (
                <div className="flex-1 flex items-center justify-center sm:justify-start bg-background border border-border-color rounded-lg px-4 py-3 min-w-[150px]"> {/* Ensure it doesn't shrink too much */}
                  <label htmlFor="is_global" className="flex items-center gap-2 cursor-pointer">
                    <FiGlobe className="text-gray-400" />
                    <span className="font-semibold text-dark-text text-sm sm:text-base whitespace-nowrap">Global</span>
                    <input
                      type="checkbox"
                      name="is_global"
                      id="is_global"
                      checked={formData.is_global}
                      onChange={handleChange}
                      className="ml-auto h-5 w-5 rounded border-gray-300 text-primary-green focus:ring-primary-green"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Venue Select (Admin Only, Non-Global) */}
            {isAdmin && !formData.is_global && (
              <div className="relative">
                <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <div className="relative">
                <select
                  name="venue_id"
                  value={formData.venue_id || ""}
                  onChange={handleChange}
                  required={!formData.is_global} // Required only if NOT global
                  className="appearance-none w-full pl-10 pr-4 py-3 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-green-light focus:border-primary-green text-sm sm:text-base cursor-pointer"
                >
                  <option value="" disabled>Select a venue</option>
                  {venues.map((venue) => (
                    <option key={venue.venue_id} value={venue.venue_id}>
                      {venue.name}
                    </option>
                  ))}
                </select>
                 {/* Arrow indicator for select */}
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Applies to All Sports Checkbox */}
            <div className="flex items-center gap-3 bg-background border border-border-color rounded-lg px-4 py-3">
              <label htmlFor="applies_to_all_sports" className="flex items-center gap-2 cursor-pointer w-full">
                <FiAward className="text-gray-400" />
                <span className="font-semibold text-dark-text text-sm sm:text-base flex-grow">Applies to All Sports</span>
                <input
                  type="checkbox"
                  name="applies_to_all_sports"
                  id="applies_to_all_sports"
                  checked={formData.applies_to_all_sports}
                  onChange={handleChange} // Use general handler, logic included
                  className="ml-auto h-5 w-5 rounded border-gray-300 text-primary-green focus:ring-primary-green"
                />
              </label>
            </div>

            {/* Sport Select (Conditional) */}
            {!formData.applies_to_all_sports && (
                <div className="relative">
                <label className="block text-xs font-medium text-gray-500 mb-1">Select Applicable Sports</label>
                <Select
                    isMulti
                    name="sports"
                    options={allSports}
                    className="basic-multi-select text-sm sm:text-base" // Adjust font size if needed
                    classNamePrefix="select"
                    value={selectedSports}
                    onChange={setSelectedSports} // react-select manages its state via this callback
                    placeholder="Choose specific sports..."
                    // Add styles if needed for focus states etc. matching other inputs
                    styles={{ // Basic styling example
                      control: (base) => ({
                         ...base,
                         backgroundColor: 'var(--background-color)', // Use CSS variables if defined
                         borderColor: 'var(--border-color)', // Use CSS variables if defined
                         minHeight: '46px', // Match height of other inputs
                          '&:hover': {
                            borderColor: 'var(--primary-green-light)', // Use CSS variables
                          },
                         boxShadow: 'none', // Remove default focus shadow
                      }),
                      input: (base) => ({ ...base, color: 'var(--dark-text)' }), // Match text color
                      multiValue: (base) => ({ ...base, backgroundColor: 'var(--light-green-bg)'}), // Example tag style
                      multiValueLabel: (base) => ({ ...base, color: 'var(--primary-green-dark)'}),
                    }}
                 />
                </div>
            )}


            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                 <label className="block text-xs font-medium text-gray-500 mb-1">Valid From (Optional)</label>
                <FiCalendar className="absolute left-4 top-[calc(50%+4px)] -translate-y-1/2 text-gray-400" /> {/* Adjusted top position */}
                <input
                  type="date"
                  name="valid_from"
                  value={formData.valid_from}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-green-light focus:border-primary-green text-sm sm:text-base"
                />
              </div>
              <div className="relative">
                 <label className="block text-xs font-medium text-gray-500 mb-1">Valid Until (Optional)</label>
                <FiCalendar className="absolute left-4 top-[calc(50%+4px)] -translate-y-1/2 text-gray-400" /> {/* Adjusted top position */}
                <input
                  type="date"
                  name="valid_until"
                  value={formData.valid_until}
                  onChange={handleChange}
                  min={formData.valid_from || ""} // Prevent selecting date before start date
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-green-light focus:border-primary-green text-sm sm:text-base"
                />
              </div>
            </div>

             {/* Background Image URL */}
             <div className="relative">
              <FiImage className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="url" // Use type="url" for better semantics/potential browser validation
                name="background_image_url"
                placeholder="Background Image URL (Optional)"
                value={formData.background_image_url}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-green-light focus:border-primary-green text-sm sm:text-base"
              />
            </div>

            {/* Optional Fields: Min Booking Value, Usage Limits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">₹</span>
                  <input
                    type="number"
                    name="min_booking_value"
                    placeholder="Min. Value (₹)"
                    value={formData.min_booking_value}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-green-light focus:border-primary-green text-sm sm:text-base"
                     title="Minimum booking value required to use this offer"
                  />
                </div>
                 <div className="relative">
                    {/* Add an icon like FiUsers or FiRepeat */}
                  <input
                    type="number"
                    name="max_uses"
                    placeholder="Max Total Uses"
                    value={formData.max_uses}
                    onChange={handleChange}
                    min="1"
                    step="1"
                    className="w-full pl-4 pr-4 py-3 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-green-light focus:border-primary-green text-sm sm:text-base"
                     title="Maximum total times this offer can be redeemed (leave blank for unlimited)"
                  />
                </div>
                 <div className="relative">
                   {/* Add an icon like FiUser */}
                  <input
                    type="number"
                    name="max_uses_per_user"
                    placeholder="Max Uses/User"
                    value={formData.max_uses_per_user}
                    onChange={handleChange}
                    min="1"
                    step="1"
                    className="w-full pl-4 pr-4 py-3 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-green-light focus:border-primary-green text-sm sm:text-base"
                    title="Maximum times one user can redeem this offer (leave blank for unlimited)"
                  />
                </div>
            </div>
          </div>

          {/* --- FORM ACTIONS --- */}
          {error && (
            <p className="text-red-600 bg-red-100 p-3 rounded-lg text-sm border border-red-200">
              Error: {error}
            </p>
          )}
          <div className="flex justify-end gap-3 sm:gap-4 pt-4 border-t border-border-color">
            <button
              type="button"
              onClick={onCancel}
              className="py-2 px-4 sm:px-5 rounded-lg font-semibold text-xs sm:text-sm bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2 px-4 sm:px-5 rounded-lg font-semibold text-xs sm:text-sm bg-primary-green text-white hover:bg-primary-green-dark disabled:opacity-50 flex items-center gap-2 transition-colors"
            >
              {isSubmitting ? (
                 <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Saving...
                 </div>
              ) : "Save Offer"}
              {!isSubmitting && <FiCheck />}
            </button>
          </div>
        </form>
      </div>
       {/* Simple fade-in animation */}
       <style jsx>{`
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
            }
            .animate-fade-in {
                animation: fadeIn 0.2s ease-out forwards;
            }
            /* Add basic styling for react-select if needed */
            .select__control {
              /* Your Tailwind/CSS classes for the select container */
            }
            .select__menu {
              /* Your Tailwind/CSS classes for the dropdown menu */
              z-index: 60; /* Ensure dropdown is above other content */
            }
        `}</style>
    </div>
  );
};

export default OfferForm;