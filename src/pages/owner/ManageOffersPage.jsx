// src/pages/owner/ManageOffersPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../AuthContext";
import { useModal } from "../../ModalContext";
import toast from 'react-hot-toast';
import { FaPlus, FaTicketAlt } from "react-icons/fa";
import OwnerOfferCard from "../../components/offers/OwnerOfferCard";
import OfferForm from "../../components/offers/OfferForm";

function ManageOffersPage() {
  const { user, profile } = useAuth(); // Get the user's profile
  const { showModal } = useModal();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formState, setFormState] = useState({ isOpen: false, offer: null });

  const fetchOffers = useCallback(async () => {
    // ... fetch logic remains the same
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data: venuesData, error: venuesError } = await supabase
        .from("venues")
        .select("venue_id")
        .eq("owner_id", user.id);
      if (venuesError) throw venuesError;
      const venueIds = venuesData.map((v) => v.venue_id);
      if (venueIds.length > 0) {
        const { data: offersData, error: offersError } = await supabase
          .from("offers")
          .select(`*, venues(name), offer_sports(sport_id, sports(name))`)
          .in("venue_id", venueIds)
          .order("created_at", { ascending: false });
        if (offersError) throw offersError;
        setOffers(offersData || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const handleAddNew = () => {
    setFormState({ isOpen: true, offer: null });
  };
  const handleEdit = (offer) => {
    setFormState({ isOpen: true, offer: offer });
  };
  const handleSave = () => {
    fetchOffers();
    setFormState({ isOpen: false, offer: null });
  };
  const handleDelete = (offerId) => {
    showModal({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this offer? This action cannot be undone.",
      confirmText: "Delete",
      confirmStyle: "danger",
      onConfirm: async () => {
        const toastId = toast.loading('Deleting offer...');
        const { error } = await supabase
          .from("offers")
          .delete()
          .eq("offer_id", offerId);

        if (error) {
          toast.dismiss(toastId);
          toast.error(`Failed to delete offer: ${error.message}`);
          setError(error.message);
        } else {
          toast.dismiss(toastId);
          toast.success("Offer deleted successfully.");
          setOffers((prevOffers) => prevOffers.filter((o) => o.offer_id !== offerId));
        }
      },
    });
  };

  const handleToggle = async (offer) => {
    const updatedStatus = !offer.is_active;
    const { error } = await supabase
      .from("offers")
      .update({ is_active: updatedStatus })
      .eq("offer_id", offer.offer_id);

    if (error) {
      setError(error.message);
    } else {
      setOffers((prevOffers) =>
        prevOffers.map((o) =>
          o.offer_id === offer.offer_id ? { ...o, is_active: updatedStatus } : o
        )
      );
    }
  };

  if (loading) {
    /* ... */
  }
  if (error) {
    /* ... */
  }

  // Re-paste loading/error states
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green mx-auto mb-4"></div>
          <p className="text-medium-text text-lg">Loading your offers...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <p className="container mx-auto text-center p-12 text-red-600">
        Error: {error}
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-dark-text">Manage Offers</h1>
          <button
            onClick={handleAddNew}
            className="bg-primary-green text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-green-dark transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <FaPlus /> Add New Offer
          </button>
        </div>

        {offers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <OwnerOfferCard
                key={offer.offer_id}
                offer={offer}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggle={handleToggle} // <-- PASS THE TOGGLE HANDLER
                profile={profile}
              />
            ))}
          </div>
        ) : (
          <div className="bg-card-bg rounded-2xl border border-border-color p-8 text-center shadow-sm">
            <div className="max-w-md mx-auto">
              <div className="p-4 bg-light-green-bg rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <FaTicketAlt className="text-primary-green text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-dark-text mb-2">
                No offers created yet.
              </h3>
              <p className="text-medium-text">
                Click "Add New Offer" to create your first promotion.
              </p>
            </div>
          </div>
        )}
      </div>

      {formState.isOpen && (
        <OfferForm
          offer={formState.offer}
          onSave={handleSave}
          onCancel={() => setFormState({ isOpen: false, offer: null })}
        />
      )}
    </div>
  );
}

export default ManageOffersPage;
