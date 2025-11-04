// src/components/bookings/BookingOfferSection.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../../supabaseClient";
import toast from "react-hot-toast";
import { 
  FiTag, 
  FiXCircle, 
  FiLoader, 
  FiCheck, 
  FiX, 
  FiChevronDown,
  FiChevronUp 
} from "react-icons/fi";

// Debounce Hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

/**
 * A component to handle all offer-related logic for the booking page.
 * @param {object} props
 * @param {object} props.bookingDetails - The details of the current booking
 * @param {number} props.baseTotalAmount - The price of the booking before discounts
 * @param {boolean} props.confirmLoading - Disables inputs if the parent is processing
 * @param {function} props.onOfferApplied - Callback to pass the discount and offer object to the parent
 */
function BookingOfferSection({ bookingDetails, baseTotalAmount, confirmLoading, onOfferApplied }) {
  // --- State for Offer Functionality ---
  const [offerCode, setOfferCode] = useState("");
  const debouncedOfferCode = useDebounce(offerCode, 500);
  const [appliedOffer, setAppliedOffer] = useState(null);
  const [offerStatus, setOfferStatus] = useState("idle"); // 'idle', 'checking', 'valid', 'invalid'
  const [offerMessage, setOfferMessage] = useState("");
  const [isApplyingOffer, setIsApplyingOffer] = useState(false);

  // --- State for Available Offers List ---
  const [availableOffers, setAvailableOffers] = useState([]);
  const [availableOffersLoading, setAvailableOffersLoading] = useState(false);
  const [availableOffersError, setAvailableOffersError] = useState(null);
  const [expandedOfferId, setExpandedOfferId] = useState(null);

  const isInitialMount = useRef(true);
  
  // --- Effect to Fetch Available Offers ---
  useEffect(() => {
    if (!bookingDetails || !baseTotalAmount) {
      return;
    }

    const fetchAvailableOffers = async () => {
      setAvailableOffersLoading(true);
      setAvailableOffersError(null);
      setAvailableOffers([]);
      try {
        const { data, error: functionError } = await supabase.functions.invoke('get-available-offers', {
            body: JSON.stringify({
              venue_id: bookingDetails.venue?.venue_id,
              sport_id: bookingDetails.facility?.sports?.sport_id,
              booking_value: baseTotalAmount,
            }),
          });
          
        if (functionError) {
           let message = 'Failed to get offers.';
           if (functionError.context && typeof functionError.context.json === 'function') {
               try { 
                 const errorJson = await functionError.context.json(); 
                 message = errorJson.error || errorJson.message || message; 
               } catch { /* ignore */ }
           } else if (functionError instanceof Error) { 
             message = functionError.message; 
           }
           console.error("Get Available Offers Function Error Raw:", functionError);
           throw new Error(message);
        }

        if (data && data.error) throw new Error(data.error);
        
        setAvailableOffers(data || []);

      } catch (err) {
        console.error("Error fetching available offers:", err);
        setAvailableOffersError(err.message || "Could not load available offers.");
      } finally {
        setAvailableOffersLoading(false);
      }
    };

    fetchAvailableOffers();
  }, [bookingDetails, baseTotalAmount]);


  // --- Core Validation Logic ---
  const validateAndApplyCode = useCallback(async (codeToValidate) => {
    if (!bookingDetails) return; 

    setOfferStatus("checking");
    setOfferMessage("Checking code...");
    setAppliedOffer(null);
    onOfferApplied(0, null); // Pass reset up to parent

    let offerData;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Please log in to validate offers.");

      const { data, error: functionError } = await supabase.functions.invoke('validate-offer', {
          body: JSON.stringify({
            offer_code: codeToValidate,
            venue_id: bookingDetails.venue?.venue_id,
            sport_id: bookingDetails.facility?.sports?.sport_id,
            booking_value: baseTotalAmount,
          }),
        });

      if (functionError) {
         let message = 'Failed to validate offer.';
         if (functionError.context && typeof functionError.context.json === 'function') {
             try { const errorJson = await functionError.context.json(); message = errorJson.error || errorJson.message || message; } catch { /* ignore */ }
         } else if (functionError instanceof Error) { message = functionError.message; }
         console.error("Validate Offer Function Error Raw:", functionError);
         throw new Error(message);
      }

      if (data && data.error) throw new Error(data.error);
      if (!data || typeof data.calculated_discount === 'undefined' || !data.offer_id) {
        console.error("Invalid response structure from validate-offer:", data);
        throw new Error("Received an invalid response from the server.");
      }
      
      offerData = data;
      
      // Set local state
      setOfferStatus("valid");
      setOfferMessage(`Offer applied: ${offerData.title} (-₹${offerData.calculated_discount.toFixed(2)})`);
      setAppliedOffer(offerData);
      
      // --- Pass result up to parent ---
      onOfferApplied(offerData.calculated_discount, offerData);

      return { success: true, data: offerData };

    } catch (err) {
      console.error("Offer validation error:", err);
      setOfferStatus("invalid");
      setOfferMessage(err.message || "Invalid offer code.");
      setAppliedOffer(null);
      
      // --- Pass reset up to parent ---
      onOfferApplied(0, null);
      
      return { success: false, error: err.message };
    }
  }, [bookingDetails, baseTotalAmount, onOfferApplied]);

  
  // --- Debounced Offer Validation Effect ---
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!debouncedOfferCode || debouncedOfferCode.length < 3) {
      setOfferStatus("idle");
      setOfferMessage("");
      setAppliedOffer(null);
      onOfferApplied(0, null); // Pass reset up to parent
      return;
    }
    validateAndApplyCode(debouncedOfferCode);
  }, [debouncedOfferCode, validateAndApplyCode, onOfferApplied]);


  // --- Apply Button Handler ---
  const handleApplyOffer = useCallback(async () => {
    if (!offerCode || !bookingDetails) return;
    setIsApplyingOffer(true);
    const { success, data } = await validateAndApplyCode(offerCode);
    if (success && data) {
       toast.success(`Offer "${data.title}" applied!`);
    }
    setIsApplyingOffer(false);
  }, [offerCode, bookingDetails, validateAndApplyCode]);


  // --- Handler for Clicking an Available Offer ---
  const handleSelectOffer = useCallback(async (offer) => {
    if (!offer || !offer.offer_code) return;

    setOfferCode(offer.offer_code);
    setIsApplyingOffer(true); 
    const { success, data } = await validateAndApplyCode(offer.offer_code);
    if (success && data) {
      toast.success(`Offer "${data.title}" applied!`);
    }
    setIsApplyingOffer(false);
  }, [validateAndApplyCode]);

  // --- Handler to toggle offer details ---
  const handleToggleOfferDetails = (offerId) => {
    setExpandedOfferId(prevId => (prevId === offerId ? null : offerId));
  };

  // --- Remove Offer Handler ---
  const handleRemoveOffer = () => {
    setAppliedOffer(null);
    onOfferApplied(0, null); // Pass reset up to parent
    setOfferCode("");
    setOfferStatus("idle");
    setOfferMessage("");
    setAvailableOffersError(null); 
    toast.success("Offer removed.");
 };

  return (
    <div className="border-t border-border-color-light pt-6">
      <h3 className="text-lg font-semibold text-dark-text mb-4 flex items-center gap-2">
        <FiTag className="text-primary-green" /> Apply Offer Code
      </h3>

      {/* Offer Input and Apply Button */}
      <div className="flex gap-2 items-start">
        <div className="flex-grow">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter code (min 3 chars)"
              value={offerCode}
              onChange={(e) => setOfferCode(e.target.value.toUpperCase())}
              className={`w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-1 text-sm ${
                offerStatus === "invalid"
                  ? "border-red-500 ring-red-500"
                  : offerStatus === "valid"
                  ? "border-green-500 ring-green-500"
                  : "border-border-color focus:ring-primary-green"
              }`}
              disabled={isApplyingOffer || confirmLoading}
              aria-label="Offer Code Input"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {offerStatus === "checking" && <FiLoader className="animate-spin text-blue-500" />}
              {offerStatus === "valid" && <FiCheck className="text-green-500" />}
              {offerStatus === "invalid" && <FiX className="text-red-500" />}
            </div>
          </div>
          {offerMessage && (
            <p
              className={`mt-1.5 text-xs ${
                offerStatus === "invalid"
                  ? "text-red-600"
                  : offerStatus === "valid"
                  ? "text-green-600"
                  : "text-blue-600"
              }`}
            >
              {offerMessage}
            </p>
          )}
        </div>

        <button
          onClick={handleApplyOffer}
          disabled={!offerCode || isApplyingOffer || confirmLoading || offerStatus === 'checking'}
          className={`px-5 py-2 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap ${
          !offerCode || isApplyingOffer || confirmLoading || offerStatus === 'checking'
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-primary-green text-white hover:bg-primary-green-dark"
          }`}
        >
          {isApplyingOffer ? (
            <div className="flex items-center justify-center">
              <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" /> Applying...
            </div>
          ) : (
            "Apply"
          )}
        </button>
        {(offerStatus === "valid" || appliedOffer) && (
          <button
            onClick={handleRemoveOffer}
            className="p-2.5 rounded-lg text-red-600 hover:bg-red-100 transition-colors"
            title="Remove Offer"
            disabled={isApplyingOffer || confirmLoading}
          >
            <FiXCircle size={18} />
          </button>
        )}
      </div>

      {/* Available Offers List */}
      <div className="mt-6">
        <h4 className="text-sm font-semibold text-medium-text mb-3">
          Available Offers for You
        </h4>

        {availableOffersLoading && (
          <div className="text-center text-medium-text py-3">
            <FiLoader className="animate-spin inline-block mr-2" /> Loading offers...
          </div>
        )}

        {availableOffersError && (
          <div className="text-center text-red-600 py-3 bg-red-50 border border-red-200 rounded-lg text-sm px-3">
            <FiXCircle className="inline-block mr-2" /> {availableOffersError}
          </div>
        )}

        {!availableOffersLoading && !availableOffersError && availableOffers.length > 0 && (
          <div className="space-y-2">
            {availableOffers.map((offer) => {
              const isExpanded = expandedOfferId === offer.offer_id;
              const isApplied = appliedOffer?.offer_id === offer.offer_id;

              return (
                <div
                  key={offer.offer_id}
                  className={`border rounded-lg overflow-hidden transition-all shadow-sm ${
                    isApplied
                      ? "bg-green-50 border-green-500 ring-2 ring-green-400"
                      : "bg-hover-bg border-border-color"
                  }`}
                >
                  <div className="flex items-center justify-between p-3">
                    {/* Button 1: Apply Offer */}
                    <button
                      onClick={() => handleSelectOffer(offer)}
                      disabled={confirmLoading || isApplyingOffer}
                      className="flex-1 flex items-center gap-2 min-w-0 disabled:opacity-60 disabled:cursor-not-allowed group"
                      aria-label={`Apply offer ${offer.title}`}
                    >
                      <span
                        className={`font-bold text-sm px-2 py-0.5 rounded ${
                          isApplied
                            ? "bg-green-200 text-green-800"
                            : "bg-primary-green-light bg-opacity-20 text-primary-green"
                        }`}
                      >
                        {offer.offer_code}
                      </span>
                      <p className="text-sm font-semibold text-dark-text truncate group-hover:text-primary-green transition-colors">
                        {offer.title}
                      </p>
                    </button>

                    <div className="flex items-center gap-3 ml-2 flex-shrink-0">
                      {isApplied && (
                        <span className="text-xs font-medium text-green-700 flex items-center gap-1">
                          <FiCheck /> Applied
                        </span>
                      )}
                      {/* Button 2: Toggle Details */}
                      <button
                        onClick={() => handleToggleOfferDetails(offer.offer_id)}
                        className="p-1 rounded-full hover:bg-border-color text-medium-text transition-colors"
                        aria-label="Toggle details"
                        disabled={confirmLoading || isApplyingOffer}
                      >
                        {isExpanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded details area */}
                  {isExpanded && (
                    <div className="p-3 border-t border-border-color-light bg-background">
                      <p className="text-sm text-medium-text">
                        {offer.description || "No further details available for this offer."}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!availableOffersLoading && !availableOffersError && availableOffers.length === 0 && (
          <div className="text-center text-medium-text py-3 bg-hover-bg rounded-lg text-sm">
            No specific offers available for this booking.
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingOfferSection;