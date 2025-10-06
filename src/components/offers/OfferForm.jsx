// src/components/offers/OfferForm.jsx
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../AuthContext";
import toast from 'react-hot-toast'; // Import react-hot-toast
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
} from "react-icons/fi";

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [ref, handler]);
};

const OfferForm = ({ offer, onSave, onCancel }) => {
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === "admin";
  const formRef = useRef();

  useClickOutside(formRef, onCancel);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discount_percentage: "",
    is_global: false,
    valid_from: "",
    valid_until: "",
    venue_id: null,
    background_image_url: "",
  });

  const [venues, setVenues] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVenues = async () => {
      if (!isAdmin) return;
      const { data, error } = await supabase.from("venues").select("venue_id, name");
      if (error) {
        console.error("Error fetching venues:", error);
      } else {
        setVenues(data);
      }
    };

    fetchVenues();
  }, [isAdmin]);

  useEffect(() => {
    if (offer) {
      setFormData({
        title: offer.title || "",
        description: offer.description || "",
        discount_percentage: offer.discount_percentage || "",
        is_global: offer.is_global || false,
        valid_from: formatDateForInput(offer.valid_from),
        valid_until: formatDateForInput(offer.valid_until),
        venue_id: offer.venue_id || null,
        background_image_url: offer.background_image_url || "",
      });
    }
  }, [offer]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    const loadingToast = toast.loading('Saving offer...');


    let venueIdToSave = null;
    if (!isAdmin) {
      const { data: ownerVenues, error: ownerVenuesError } = await supabase
        .from("venues")
        .select("venue_id")
        .eq("owner_id", user.id)
        .limit(1);

      if (ownerVenuesError || ownerVenues.length === 0) {
        toast.dismiss(loadingToast);
        toast.error("Could not find a venue associated with your account.");
        setIsSubmitting(false);
        return;
      }
      venueIdToSave = ownerVenues[0].venue_id;
    } else {
      venueIdToSave = formData.is_global ? null : formData.venue_id;
    }

    const offerData = {
      ...formData,
      venue_id: venueIdToSave,
      valid_from: formData.valid_from || null,
      valid_until: formData.valid_until || null,
    };

    let result;
    if (offer) {
      result = await supabase
        .from("offers")
        .update(offerData)
        .eq("offer_id", offer.offer_id);
    } else {
      result = await supabase.from("offers").insert([offerData]);
    }
    
    toast.dismiss(loadingToast);
    const { error: supabaseError } = result;

    if (supabaseError) {
      toast.error(`Failed to save offer: ${supabaseError.message}`);
    } else {
      toast.success(`Offer successfully ${offer ? 'updated' : 'created'}.`);
      onSave();
    }

    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div
        ref={formRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* --- HEADER --- */}
          <div className="flex justify-between items-center pb-4 border-b border-border-color">
            <h2 className="text-2xl font-bold text-dark-text flex items-center gap-3">
              <FiStar className="text-primary-green" />
              {offer ? "Edit Offer" : "Create New Offer"}
            </h2>
            <button
              type="button"
              onClick={onCancel}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* --- FORM FIELDS --- */}
          <div className="space-y-4">
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
                className="w-full pl-10 pr-4 py-3 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-green-light focus:border-primary-green"
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
                className="w-full pl-10 pr-4 py-3 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-green-light focus:border-primary-green"
              ></textarea>
            </div>

            {/* Discount & Global Toggle */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <FiPercent className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  name="discount_percentage"
                  placeholder="Discount %"
                  value={formData.discount_percentage}
                  onChange={handleChange}
                  required
                  min="1"
                  max="100"
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-green-light focus:border-primary-green"
                />
              </div>
              {isAdmin && (
                <div className="flex-1 flex items-center justify-center sm:justify-start bg-background border border-border-color rounded-lg px-4 py-3">
                  <label
                    htmlFor="is_global"
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <FiGlobe className="text-gray-400" />
                    <span className="font-semibold text-dark-text">
                      Global Offer
                    </span>
                    <input
                      type="checkbox"
                      name="is_global"
                      id="is_global"
                      checked={formData.is_global}
                      onChange={handleChange}
                      className="h-5 w-5 rounded border-gray-300 text-primary-green focus:ring-primary-green"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Venue Select (for Admin) */}
            {isAdmin && !formData.is_global && (
              <div className="relative">
                <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  name="venue_id"
                  value={formData.venue_id || ""}
                  onChange={handleChange}
                  required={!formData.is_global}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border-color rounded-lg appearance-none focus:ring-2 focus:ring-primary-green-light focus:border-primary-green"
                >
                  <option value="" disabled>
                    Select a venue
                  </option>
                  {venues.map((venue) => (
                    <option key={venue.venue_id} value={venue.venue_id}>
                      {venue.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  name="valid_from"
                  value={formData.valid_from}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-green-light focus:border-primary-green"
                />
              </div>
              <div className="relative">
                <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  name="valid_until"
                  value={formData.valid_until}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-green-light focus:border-primary-green"
                />
              </div>
            </div>

             {/* Background Image URL */}
             <div className="relative">
              <FiImage className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="background_image_url"
                placeholder="Background Image URL (Optional)"
                value={formData.background_image_url}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-green-light focus:border-primary-green"
              />
            </div>
          </div>

          {/* --- FORM ACTIONS --- */}
          {error && (
            <p className="text-red-600 bg-red-100 p-3 rounded-lg text-sm">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-4 pt-4 border-t border-border-color">
            <button
              type="button"
              onClick={onCancel}
              className="py-2 px-5 rounded-lg font-semibold text-sm bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2 px-5 rounded-lg font-semibold text-sm bg-primary-green text-white hover:bg-primary-green-dark disabled:opacity-50 flex items-center gap-2 transition-colors"
            >
              {isSubmitting ? "Saving..." : "Save Offer"}
              <FiCheck />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OfferForm;