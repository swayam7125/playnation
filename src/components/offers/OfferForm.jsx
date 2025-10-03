// src/components/offers/OfferForm.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../AuthContext";

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

const OfferForm = ({ offer, onSave, onCancel }) => {
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === "admin";

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discount_percentage: "",
    offer_code: "",
    venue_id: "",
    background_image_url: "",
    valid_from: formatDateForInput(new Date()),
    valid_until: "",
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
      let query = supabase.from("venues").select("venue_id, name");
      if (!isAdmin) {
        query = query.eq("owner_id", user.id);
      }
      const { data } = await query;
      setAllVenues(data || []);
      if (!offer && data?.length === 1 && !isAdmin) {
        setFormData((prev) => ({ ...prev, venue_id: data[0].venue_id }));
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
        // Flatten and deduplicate the sports array
        const uniqueSports = new Map();
        data?.forEach(item => {
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
    if (!formData.applies_to_all_sports && selectedSports.size === 0) {
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
        venue_id: formData.is_global ? null : formData.venue_id,
        background_image_url: formData.background_image_url || null,
        valid_from: formData.valid_from,
        valid_until: formData.valid_until || null,
        applies_to_all_sports: formData.applies_to_all_sports,
        is_global: formData.is_global,
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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-card-bg rounded-2xl shadow-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-dark-text mb-6">
          {offer ? "Edit Offer" : "Create Offer"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-medium-text mb-2"
            >
              Offer Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-background border border-border-color rounded-lg focus:ring-primary-green focus:border-primary-green"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-medium-text mb-2"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-2 bg-background border border-border-color rounded-lg focus:ring-primary-green focus:border-primary-green"
            ></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="discount_percentage"
                className="block text-sm font-medium text-medium-text mb-2"
              >
                Discount (%)
              </label>
              <input
                type="number"
                name="discount_percentage"
                id="discount_percentage"
                value={formData.discount_percentage}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-background border border-border-color rounded-lg focus:ring-primary-green focus:border-primary-green"
              />
            </div>
            <div>
              <label
                htmlFor="offer_code"
                className="block text-sm font-medium text-medium-text mb-2"
              >
                Offer Code
              </label>
              <input
                type="text"
                name="offer_code"
                id="offer_code"
                value={formData.offer_code}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-background border border-border-color rounded-lg"
              />
            </div>
          </div>

          {/* --- DATE FIELDS ARE RESTORED HERE --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="valid_from"
                className="block text-sm font-medium text-medium-text mb-2"
              >
                Start Date
              </label>
              <input
                type="date"
                name="valid_from"
                id="valid_from"
                value={formData.valid_from}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-background border border-border-color rounded-lg"
              />
            </div>
            <div>
              <label
                htmlFor="valid_until"
                className="block text-sm font-medium text-medium-text mb-2"
              >
                End Date (Optional)
              </label>
              <input
                type="date"
                name="valid_until"
                id="valid_until"
                value={formData.valid_until}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-background border border-border-color rounded-lg"
              />
            </div>
          </div>

          {isAdmin && (
            <div className="bg-background border border-border-color rounded-lg p-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_global"
                  name="is_global"
                  checked={formData.is_global}
                  onChange={handleChange}
                  disabled={!!offer}
                  className="h-4 w-4 rounded border-gray-300 text-primary-green focus:ring-primary-green disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <label
                  htmlFor="is_global"
                  className="ml-3 block text-sm font-medium text-medium-text"
                >
                  Global Offer (Shows on homepage)
                  {!!offer && (
                    <span className="text-xs text-light-text italic">
                      {" "}
                      (Cannot be changed)
                    </span>
                  )}
                </label>
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="venue_id"
              className="block text-sm font-medium text-medium-text mb-2"
            >
              Venue
            </label>
            <select
              name="venue_id"
              id="venue_id"
              value={formData.venue_id}
              onChange={handleChange}
              required={!formData.is_global}
              disabled={formData.is_global}
              className="w-full px-4 py-2 bg-background border border-border-color rounded-lg focus:ring-primary-green focus:border-primary-green disabled:bg-gray-200 disabled:cursor-not-allowed"
            >
              <option value="">
                --{" "}
                {formData.is_global
                  ? "No Venue (Global Offer)"
                  : "Choose a Venue"}{" "}
                --
              </option>
              {allVenues.map((venue) => (
                <option key={venue.venue_id} value={venue.venue_id}>
                  {venue.name}
                </option>
              ))}
            </select>
          </div>

          {/* --- SPORT SELECTION IS RESTORED HERE --- */}
          <div>
            <label className="block text-sm font-medium text-medium-text mb-2">
              Applicable Sports
            </label>
            <div className="bg-background border border-border-color rounded-lg p-4">
              <div className="flex items-center mb-4">
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
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-4 border-t border-border-color">
                    {availableSports.map((sport) => (
                      <div key={sport.sport_id} className="flex items-center">
                        <input
                          id={`sport-${sport.sport_id}`}
                          type="checkbox"
                          checked={selectedSports.has(sport.sport_id)}
                          onChange={() => handleSportSelection(sport.sport_id)}
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

          <div>
            <label
              htmlFor="background_image_url"
              className="block text-sm font-medium text-medium-text mb-2"
            >
              Background Image URL (Optional)
            </label>
            <input
              type="text"
              name="background_image_url"
              id="background_image_url"
              value={formData.background_image_url}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-background border border-border-color rounded-lg focus:ring-primary-green focus:border-primary-green"
              placeholder="https://..."
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="py-2 px-5 rounded-lg font-semibold text-sm bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2 px-5 rounded-lg font-semibold text-sm bg-primary-green text-white hover:bg-primary-green-dark disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Offer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OfferForm;
