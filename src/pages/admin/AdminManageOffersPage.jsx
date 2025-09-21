// src/pages/admin/AdminManageOffersPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../AuthContext";
import { useModal } from "../../ModalContext";
import { FaPlus, FaTicketAlt } from "react-icons/fa";
import OwnerOfferCard from "../../components/offers/OwnerOfferCard";
import OfferForm from "../../components/offers/OfferForm";

function AdminManageOffersPage() {
  const { profile } = useAuth(); // Get the user's profile
  const { showModal } = useModal();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);

  const fetchOffers = useCallback(async () => {
    // ... fetch logic remains the same
    setLoading(true);
    setError(null);
    try {
      const { data, error: offersError } = await supabase
        .from("offers")
        .select(`*, venues(name), offer_sports(sport_id, sports(name))`)
        .order("created_at", { ascending: false });
      if (offersError) throw offersError;
      setOffers(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  // Handler functions for managing offers
  const handleAddNew = () => {
    setEditingOffer(null);
    setIsFormOpen(true);
  };
  const handleEdit = (offer) => {
    setEditingOffer(offer);
    setIsFormOpen(true);
  };
  const handleSave = () => {
    fetchOffers();
    setIsFormOpen(false);
    setEditingOffer(null);
  };
  const handleDelete = async (offerId) => {
    const isConfirmed = await showModal({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this offer?",
      confirmText: "Delete",
      confirmStyle: "danger",
    });
    if (isConfirmed) {
      const { error } = await supabase
        .from("offers")
        .delete()
        .eq("offer_id", offerId);
      if (error) {
        setError(error.message);
      } else {
        fetchOffers();
      }
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
          <p className="text-medium-text text-lg">Loading all offers...</p>
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
          <h1 className="text-3xl font-bold text-dark-text">
            Manage All Offers (Admin)
          </h1>
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
                profile={profile} // <-- PASS THE PROFILE DOWN
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
                No offers found in the system.
              </h3>
              <p className="text-medium-text">
                Click "Add New Offer" to create the first one.
              </p>
            </div>
          </div>
        )}
      </div>

      {isFormOpen && (
        <OfferForm
          offer={editingOffer}
          onSave={handleSave}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}

export default AdminManageOffersPage;
