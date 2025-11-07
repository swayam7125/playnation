import React, { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "../../supabaseClient";
import { useModal } from "../../ModalContext";
import toast from 'react-hot-toast';
import OfferForm from "../../components/offers/OfferForm";
import OwnerOfferCard from "../../components/offers/OwnerOfferCard";
import AdminManageOffersPageSkeleton from "../../components/skeletons/admin/AdminManageOffersPageSkeleton";
import { FaPlus, FaSearch } from "react-icons/fa";

function AdminManageOffersPage() {
  const [offers, setOffers] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOffer, setCurrentOffer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { showModal } = useModal();

  const fetchOffersAndVenues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: offersData, error: offersError } = await supabase
        .from("offers")
        .select("*, venues (name)");
      if (offersError) throw offersError;

      const { data: venuesData, error: venuesError } = await supabase
        .from("venues")
        .select("venue_id, name");
      if (venuesError) throw venuesError;

      setOffers(offersData || []);
      setVenues(venuesData || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffersAndVenues();
  }, [fetchOffersAndVenues]);

  const handleAddNew = () => {
    setCurrentOffer(null);
    setIsModalOpen(true);
  };

  const handleEdit = (offer) => {
    setCurrentOffer(offer);
    setIsModalOpen(true);
  };

  const handleDelete = (offerId) => {
    showModal({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this offer? This action cannot be undone.",
      confirmText: "Delete",
      confirmStyle: "danger",
      onConfirm: async () => {
        const toastId = toast.loading('Deleting offer...');
        try {
          const { error } = await supabase
            .from("offers")
            .delete()
            .eq("offer_id", offerId);
          if (error) throw error;
          toast.dismiss(toastId);
          toast.success("Offer deleted successfully.");
          fetchOffersAndVenues();
        } catch (err) {
          toast.dismiss(toastId);
          toast.error(`Failed to delete offer: ${err.message}`);
          setError(err.message);
        }
      },
    });
  };

  const handleToggle = async (offer) => {
    try {
      const { error } = await supabase
        .from("offers")
        .update({ is_active: !offer.is_active })
        .eq("offer_id", offer.offer_id);
      if (error) throw error;
      fetchOffersAndVenues();
    } catch (err) {
      await showModal({ title: "Error", message: `Failed to toggle offer status: ${err.message}` });
    }
  };

  const handleSave = () => {
    setIsModalOpen(false);
    fetchOffersAndVenues();
  };

  const filteredOffers = useMemo(() => {
    if (!searchTerm) return offers;
    const lowercasedFilter = searchTerm.toLowerCase();
    return offers.filter(
      (offer) =>
        offer.title.toLowerCase().includes(lowercasedFilter) ||
        (offer.venues && offer.venues.name.toLowerCase().includes(lowercasedFilter))
    );
  }, [offers, searchTerm]);

  if (loading) {
    return <AdminManageOffersPageSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-500">{`Error: ${error}`}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-dark-text mb-1">
          Manage Offers
        </h1>
        <p className="text-medium-text">Create, edit, and manage all promotional offers.</p>
      </div>

      <div className="bg-card-bg rounded-xl shadow-md border border-border-color-light p-4 mb-6">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text" />
            <input
              type="text"
              placeholder="Search by title or venue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-sm pl-9 pr-4 py-2 bg-hover-bg border-2 border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent transition-all"
            />
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-primary-green-dark transition-all duration-200 text-sm font-medium"
          >
            <FaPlus />
            <span>Create New Offer</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOffers.length > 0 ? (
          filteredOffers.map((offer) => (
            <OwnerOfferCard
              key={offer.offer_id}
              offer={offer}
              onEdit={() => handleEdit(offer)}
              onDelete={() => handleDelete(offer.offer_id)}
              onToggle={() => handleToggle(offer)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-medium-text">No offers found. Try adjusting your search.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card-bg rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <OfferForm
              offer={currentOffer}
              venues={venues}
              onSave={handleSave}
              onCancel={() => setIsModalOpen(false)}
              isAdmin={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminManageOffersPage;