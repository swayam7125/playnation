// src/components/offers/OfferForm.jsx
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../AuthContext";
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
    offer_code: "",
    venue_id: "",
    background_image_url: "",
    valid_from: formatDateForInput(new Date()),
    valid_until: "",
    // ** Re-added for the new database column **
    applies_to_all_sports: false,
    is_global: false,
  });

  const [allVenues, setAllVenues] = useState([]);
  const [availableSports, setAvailableSports] = useState([]);
  const [selectedSports, setSelectedSports] = useState(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (offer) {
      setFormData({
        title: offer.title || "",
        description: offer.description || "",
        discount_percentage: offer.discount_percentage || "",
        offer_code: offer.offer_code || "",
        venue_id: offer.venue_id || "",
        background_image_url: offer.background_image_url || "",
        valid_from: formatDateForInput(offer.valid_from),
        valid_until: formatDateForInput(offer.valid_until),
        // ** Re-added for the new database column **
        applies_to_all_sports: offer.applies_to_all_sports || false,
        is_global: offer.is_global || false,
      });
      if (offer.offer_sports) {
        setSelectedSports(new Set(offer.offer_sports.map((os) => os.sport_id)));
      }
    }
  }, [offer]);

  useEffect(() => {
    const fetchVenues = async () => {
      if (!user) return;
      let query = supabase
        .from("venues")
        .select("venue_id, name")
        .eq("is_approved", true);

      if (!isAdmin) {
        query = query.eq("owner_id", user.id);
      }
      const { data: approvedVenues, error: venuesError } = await query;
      if (venuesError) {
        setError("Could not fetch venues: " + venuesError.message);
        setAllVenues([]);
        return;
      }
      let finalVenues = approvedVenues || [];
      if (offer && offer.venue_id) {
        const isVenueInList = finalVenues.some(
          (v) => v.venue_id === offer.venue_id
        );
        if (!isVenueInList) {
          const { data: currentVenue } = await supabase
            .from("venues")
            .select("venue_id, name")
            .eq("venue_id", offer.venue_id)
            .single();

          if (currentVenue) {
            finalVenues = [currentVenue, ...finalVenues];
          }
        }
      }
      setAllVenues(finalVenues);
      if (!offer && finalVenues?.length === 1 && !isAdmin) {
        setFormData((prev) => ({ ...prev, venue_id: finalVenues[0].venue_id }));
      }
    };
    fetchVenues();
  }, [user, isAdmin, offer]);

  useEffect(() => {
    const fetchVenueSports = async () => {
      if (formData.venue_id) {
        const { data } = await supabase
          .from("facilities")
          .select("sports(sport_id, name)")
          .eq("venue_id", formData.venue_id);
        const uniqueSports = new Map();
        data?.forEach((item) => {
          if (item.sports) {
            uniqueSports.set(item.sports.sport_id, item.sports);
          }
        });
        setAvailableSports(Array.from(uniqueSports.values()));
      } else {
        setAvailableSports([]);
      }
    };
    fetchVenueSports();
  }, [formData.venue_id]);

  const handleSportSelection = (sportId) => {
    setSelectedSports((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(sportId)) newSelection.delete(sportId);
      else newSelection.add(sportId);
      return newSelection;
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));

    if (name === "is_global" && checked) {
      setFormData((prev) => ({ ...prev, venue_id: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.is_global && !formData.venue_id) {
      setError("Please select a venue or mark the offer as global.");
      return;
    }
    if (
      !formData.applies_to_all_sports &&
      !formData.is_global &&
      selectedSports.size === 0
    ) {
      setError(
        'Please select at least one sport or check "Apply to all sports".'
      );
      return;
    }
    setIsSubmitting(true);
    try {
      const offerData = {
        title: formData.title,
        description: formData.description,
        discount_percentage: parseFloat(formData.discount_percentage),
        offer_code: formData.offer_code,
        venue_id: formData.is_global ? null : formData.venue_id || null,
        background_image_url: formData.background_image_url || null,
        valid_from: formData.valid_from,
        valid_until: formData.valid_until || null,
        is_global: formData.is_global,
        // ** Re-added to save to the new database column **
        applies_to_all_sports: formData.applies_to_all_sports,
      };
      let savedOffer;
      if (offer) {
        const { data, error: uError } = await supabase
          .from("offers")
          .update(offerData)
          .eq("offer_id", offer.offer_id)
          .select()
          .single();
        if (uError) throw uError;
        savedOffer = data;
      } else {
        const { data, error: iError } = await supabase
          .from("offers")
          .insert(offerData)
          .select()
          .single();
        if (iError) throw iError;
        savedOffer = data;
      }
      const { error: deleteError } = await supabase
        .from("offer_sports")
        .delete()
        .eq("offer_id", savedOffer.offer_id);
      if (deleteError) throw deleteError;

      // Only save to offer_sports if the "all sports" flag is false
      if (!formData.applies_to_all_sports && selectedSports.size > 0) {
        const sportLinks = Array.from(selectedSports).map((sportId) => ({
          offer_id: savedOffer.offer_id,
          sport_id: sportId,
        }));
        const { error: insertError } = await supabase
          .from("offer_sports")
          .insert(sportLinks);
        if (insertError) throw insertError;
      }
      onSave(savedOffer);
    } catch (err) {
      setError(`Failed to save offer: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div
        ref={formRef}
        className="bg-card-bg rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-dark-text flex items-center gap-3">
              <FiTag className="text-primary-green" />
              {offer ? "Edit Offer" : "Create a New Offer"}
            </h2>
            <button
              onClick={onCancel}
              className="text-light-text hover:text-dark-text"
            >
              <FiX size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* --- SECTION 1: OFFER DETAILS --- */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-medium-text border-b border-border-color pb-2">
                Offer Details
              </h3>
              <div className="relative">
                <FiFileText className="absolute top-1/2 -translate-y-1/2 left-3 text-light-text" />
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. 20% Off on Weekdays"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-green-light focus:border-primary-green"
                />
              </div>
              <div className="relative">
                <textarea
                  name="description"
                  placeholder="A brief description of the offer..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-2 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-green-light focus:border-primary-green"
                ></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <FiPercent className="absolute top-1/2 -translate-y-1/2 left-3 text-light-text" />
                  <input
                    type="number"
                    name="discount_percentage"
                    placeholder="Discount %"
                    value={formData.discount_percentage}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-green-light focus:border-primary-green"
                  />
                </div>
                <div className="relative">
                  <FiStar className="absolute top-1/2 -translate-y-1/2 left-3 text-light-text" />
                  <input
                    type="text"
                    name="offer_code"
                    placeholder="Offer Code"
                    value={formData.offer_code}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-green-light focus:border-primary-green"
                  />
                </div>
              </div>
            </div>

            {/* --- SECTION 2: VALIDITY --- */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-medium-text border-b border-border-color pb-2">
                Validity
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <FiCalendar className="absolute top-1/2 -translate-y-1/2 left-3 text-light-text" />
                  <input
                    type="date"
                    name="valid_from"
                    value={formData.valid_from}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-green-light focus:border-primary-green"
                  />
                </div>
                <div className="relative">
                  <FiCalendar className="absolute top-1/2 -translate-y-1/2 left-3 text-light-text" />
                  <input
                    type="date"
                    name="valid_until"
                    placeholder="End Date (Optional)"
                    value={formData.valid_until}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-green-light focus:border-primary-green"
                  />
                </div>
              </div>
            </div>

            {/* --- SECTION 3: VENUE & SPORTS --- */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-medium-text border-b border-border-color pb-2">
                Venue & Sports
              </h3>
              {isAdmin && (
                <div className="bg-light-green-bg border border-primary-green-light rounded-lg p-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_global"
                      name="is_global"
                      checked={formData.is_global}
                      onChange={handleChange}
                      disabled={!!offer}
                      className="h-4 w-4 rounded border-gray-300 text-primary-green focus:ring-primary-green disabled:opacity-50"
                    />
                    <label
                      htmlFor="is_global"
                      className="ml-3 flex items-center gap-2 text-sm font-medium text-primary-green-dark"
                    >
                      <FiGlobe />
                      Global Offer (Shows on homepage)
                      {!!offer && (
                        <span className="text-xs text-light-text italic">
                          (Cannot be changed)
                        </span>
                      )}
                    </label>
                  </div>
                </div>
              )}
              <div className="relative">
                <FiMapPin className="absolute top-1/2 -translate-y-1/2 left-3 text-light-text" />
                <select
                  name="venue_id"
                  id="venue_id"
                  value={formData.venue_id}
                  onChange={handleChange}
                  required={!formData.is_global}
                  disabled={formData.is_global}
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border-color rounded-lg focus:ring-2 focus:ring-primary-green-light focus:border-primary-green disabled:bg-gray-200 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {formData.is_global
                      ? "No Venue (Global Offer)"
                      : "Choose a Venue"}
                  </option>
                  {allVenues.map((venue) => (
                    <option key={venue.venue_id} value={venue.venue_id}>
                      {venue.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div className="bg-background border border-border-color rounded-lg p-4">
                  {/* ** Re-added for the new database column ** */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="applies_to_all_sports"
                      name="applies_to_all_sports"
                      checked={formData.applies_to_all_sports}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-primary-green focus:ring-primary-green"
                    />
                    <label
                      htmlFor="applies_to_all_sports"
                      className="ml-3 block text-sm font-medium text-medium-text"
                    >
                      Apply to all sports at the selected venue
                    </label>
                  </div>
                  {!formData.is_global &&
                    !formData.applies_to_all_sports &&
                    availableSports.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-4 mt-4 border-t border-border-color">
                        {availableSports.map((sport) => (
                          <div
                            key={sport.sport_id}
                            className="flex items-center"
                          >
                            <input
                              id={`sport-${sport.sport_id}`}
                              type="checkbox"
                              checked={selectedSports.has(sport.sport_id)}
                              onChange={() =>
                                handleSportSelection(sport.sport_id)
                              }
                              className="h-4 w-4 rounded border-gray-300 text-primary-green focus:ring-primary-green"
                            />
                            <label
                              htmlFor={`sport-${sport.sport_id}`}
                              className="ml-3 text-sm text-medium-text"
                            >
                              {sport.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* --- SECTION 4: APPEARANCE --- */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-medium-text border-b border-border-color pb-2">
                Appearance
              </h3>
              <div className="relative">
                <FiImage className="absolute top-1/2 -translate-y-1/2 left-3 text-light-text" />
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
    </div>
  );
};

export default OfferForm;
