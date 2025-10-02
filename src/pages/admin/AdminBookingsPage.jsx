// src/pages/admin/AdminBookingsPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "../../supabaseClient";
import {
  FaSearch,
  FaFilter,
  FaRedo,
  FaUndo,
  FaEye,
  FaDownload,
  FaCalendar,
  FaUser,
  FaMapMarkerAlt,
  FaCreditCard,
  FaChevronDown,
  FaChevronUp,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import { useModal } from "../../ModalContext";

const BookingDetailModal = ({ booking, onClose, onRefundAction }) => {
  if (!booking) return null;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  const formatTime = (time) =>
    new Date(time).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const statusColors = {
    confirmed: "bg-blue-50 text-blue-700 border-blue-200",
    completed: "bg-green-50 text-green-700 border-green-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };

  const paymentColors = {
    paid: "bg-green-50 text-green-700 border-green-200",
    refunded: "bg-yellow-50 text-yellow-700 border-yellow-200",
    pending_refund: "bg-orange-50 text-orange-700 border-orange-200",
  };

  // FIX: Safely get user info, defaulting to 'N/A' or an empty object
  const user = booking.users || {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card-bg rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-dark-text">
              Booking Details
            </h2>
            <button
              onClick={onClose}
              className="text-light-text hover:text-dark-text text-xl"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="bg-light-green-bg rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <FaMapMarkerAlt className="text-primary-green" />
                  <h3 className="font-semibold text-dark-text">
                    Venue Information
                  </h3>
                </div>
                <p className="font-bold text-dark-text">
                  {booking.facilities.venues.name}
                </p>
                <p className="text-medium-text">{booking.facilities.name}</p>
              </div>

              <div className="bg-hover-bg rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <FaUser className="text-primary-green" />
                  <h3 className="font-semibold text-dark-text">
                    User Information
                  </h3>
                </div>
                <p className="font-bold text-dark-text">
                  {user.username || "N/A"}
                </p>
                <p className="text-medium-text">
                  {user.email || "User Deleted"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-hover-bg rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <FaCalendar className="text-primary-green" />
                  <h3 className="font-semibold text-dark-text">Booking Time</h3>
                </div>
                <p className="font-bold text-dark-text">
                  {formatDate(booking.booking_date)}
                </p>
                <p className="text-medium-text">
                  {formatTime(booking.start_time)}
                </p>
              </div>

              <div className="bg-hover-bg rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <FaCreditCard className="text-primary-green" />
                  <h3 className="font-semibold text-dark-text">Payment</h3>
                </div>
                <p className="font-bold text-2xl text-primary-green">
                  ₹{booking.total_amount}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <div
              className={`px-4 py-2 rounded-full border ${
                statusColors[booking.status]
              } font-semibold`}
            >
              Status:{" "}
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </div>
            <div
              className={`px-4 py-2 rounded-full border ${
                paymentColors[booking.payment_status]
              } font-semibold`}
            >
              Payment:{" "}
              {booking.payment_status
                .replace("_", " ")
                .charAt(0)
                .toUpperCase() +
                booking.payment_status.replace("_", " ").slice(1)}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border-color-light">
            {booking.status === "cancelled" &&
              booking.payment_status === "paid" && (
                <button
                  onClick={() => onRefundAction(booking.booking_id, "refunded")}
                  className="flex items-center gap-2 px-6 py-3 bg-primary-green text-white rounded-xl hover:bg-primary-green-dark transition-all duration-200 font-medium"
                >
                  <FaRedo /> Approve Refund
                </button>
              )}
            {booking.payment_status === "refunded" && (
              <button
                onClick={() => onRefundAction(booking.booking_id, "paid")}
                className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-all duration-200 font-medium"
              >
                <FaUndo /> Revert Refund
              </button>
            )}
            <button
              onClick={onClose}
              className="px-6 py-3 bg-border-color text-medium-text rounded-xl hover:bg-border-color-light transition-all duration-200 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingRow = ({
  booking,
  onRefundAction,
  onViewDetails,
  isExpanded,
  onToggleExpand,
}) => {
  // ... (This component remains the same, but will now receive correct user data)
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  const formatTime = (time) =>
    new Date(time).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const statusClasses = {
    confirmed: "bg-blue-100 text-blue-800 border border-blue-200",
    completed: "bg-green-100 text-green-800 border border-green-200",
    cancelled: "bg-red-100 text-red-800 border border-red-200",
  };

  const paymentStatusClasses = {
    paid: "bg-green-100 text-green-800 border border-green-200",
    refunded: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    pending_refund: "bg-orange-100 text-orange-800 border border-orange-200",
  };

  // FIX: Safely get user info
  const user = booking.users || {};

  return (
    <>
      <tr className="border-b border-border-color-light hover:bg-light-green-bg transition-all duration-200 group">
        <td className="px-6 py-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onToggleExpand(booking.booking_id)}
              className="text-light-text hover:text-primary-green transition-colors"
            >
              {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            <div>
              <div className="text-sm font-bold text-dark-text">
                {booking.facilities.venues.name}
              </div>
              <div className="text-xs text-medium-text bg-hover-bg px-2 py-1 rounded-md inline-block mt-1">
                {booking.facilities.name}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-green-light rounded-full flex items-center justify-center">
              <FaUser className="text-primary-green text-xs" />
            </div>
            <div>
              <div className="text-sm font-semibold text-dark-text">
                {user.username || "N/A"}
              </div>
              <div className="text-xs text-light-text">
                {user.email || "User Deleted"}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-6">
          <div className="bg-hover-bg rounded-lg p-2 text-center">
            <div className="text-sm font-semibold text-dark-text">
              {formatDate(booking.booking_date)}
            </div>
            <div className="text-xs text-medium-text">
              {formatTime(booking.start_time)}
            </div>
          </div>
        </td>
        <td className="px-6 py-6">
          <div className="text-lg font-bold text-primary-green">
            ₹{booking.total_amount}
          </div>
        </td>
        <td className="px-6 py-6">
          <span
            className={`px-3 py-2 inline-flex text-xs leading-5 font-semibold rounded-lg ${
              statusClasses[booking.status]
            }`}
          >
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </td>
        <td className="px-6 py-6">
          <span
            className={`px-3 py-2 inline-flex text-xs leading-5 font-semibold rounded-lg ${
              paymentStatusClasses[booking.payment_status]
            }`}
          >
            {booking.payment_status.replace("_", " ").charAt(0).toUpperCase() +
              booking.payment_status.replace("_", " ").slice(1)}
          </span>
        </td>
        <td className="px-6 py-6 text-right">
          <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onViewDetails(booking)}
              className="p-2 text-primary-green hover:bg-primary-green hover:text-white rounded-lg transition-all duration-200"
              title="View Details"
            >
              <FaEye />
            </button>
            {booking.status === "cancelled" &&
              booking.payment_status === "paid" && (
                <button
                  onClick={() => onRefundAction(booking.booking_id, "refunded")}
                  className="p-2 text-green-600 hover:bg-green-600 hover:text-white rounded-lg transition-all duration-200"
                  title="Approve Refund"
                >
                  <FaRedo />
                </button>
              )}
            {booking.payment_status === "refunded" && (
              <button
                onClick={() => onRefundAction(booking.booking_id, "paid")}
                className="p-2 text-yellow-600 hover:bg-yellow-600 hover:text-white rounded-lg transition-all duration-200"
                title="Revert Refund"
              >
                <FaUndo />
              </button>
            )}
          </div>
        </td>
      </tr>
      {isExpanded && (
        <tr className="bg-light-green-bg">
          <td colSpan="7" className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-light-text">Booking ID:</span>
                <span className="ml-2 font-mono bg-hover-bg px-2 py-1 rounded">
                  {booking.booking_id}
                </span>
              </div>
              <div>
                <span className="text-light-text">Created:</span>
                <span className="ml-2 text-medium-text">
                  {new Date(booking.created_at).toLocaleDateString("en-IN")}
                </span>
              </div>
              <div className="md:text-right">
                <button
                  onClick={() => onViewDetails(booking)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-primary-green-dark transition-all duration-200"
                >
                  <FaEye /> View Full Details
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

function AdminBookingsPage() {
  // ... (State and other functions remain the same)
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [filters, setFilters] = useState({
    status: "all",
    payment_status: "all",
    date_range: "all",
  });
  const [sortConfig, setSortConfig] = useState({
    key: "booking_date",
    direction: "desc",
  });
  const [showFilters, setShowFilters] = useState(false);
  const { showModal } = useModal();

  const fetchBookings = useCallback(
    async (currentSearchTerm, currentFilters = {}) => {
      setLoading(true);
      setError(null);
      try {
        // --- THE FIX IS HERE ---
        // The query now correctly selects related data from the 'users' table.
        // Supabase client understands 'users(*)' because of the foreign key relationship.
        let query = supabase
          .from("bookings")
          .select(
            `
                    *, 
                    users:user_id (username, email, phone_number), 
                    facilities(*, venues(*))
                `
          )
          .order("booking_date", { ascending: false });
        // --- END OF FIX ---

        if (currentSearchTerm && currentSearchTerm.trim()) {
          const searchPattern = `%${currentSearchTerm.toLowerCase()}%`;
          query = query.or(
            `facilities.venues.name.ilike.${searchPattern},facilities.name.ilike.${searchPattern},users.username.ilike.${searchPattern},users.email.ilike.${searchPattern}`
          );
        }

        if (currentFilters.status !== "all" && currentFilters.status) {
          query = query.eq("status", currentFilters.status);
        }
        if (
          currentFilters.payment_status !== "all" &&
          currentFilters.payment_status
        ) {
          query = query.eq("payment_status", currentFilters.payment_status);
        }

        const { data, error } = await query;
        if (error) throw error;
        setBookings(data || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ... (rest of the component logic remains the same)
  const handleRefundAction = async (bookingId, newPaymentStatus) => {
    const action =
      newPaymentStatus === "refunded" ? "Approve Refund" : "Revert Refund";
    const isConfirmed = await showModal({
      title: `Confirm ${action}`,
      message: `Are you sure you want to ${action.toLowerCase()} for booking ID: ${bookingId}?`,
      confirmText: `Yes, ${action}`,
      confirmStyle: newPaymentStatus === "refunded" ? "success" : "warning",
    });

    if (isConfirmed) {
      try {
        const { error } = await supabase
          .from("bookings")
          .update({
            payment_status: newPaymentStatus,
            updated_at: new Date().toISOString(),
          })
          .eq("booking_id", bookingId);

        if (error) throw error;
        await showModal({
          title: "Success",
          message: `Action completed successfully.`,
        });
        fetchBookings(searchTerm, filters);
        if (selectedBooking && selectedBooking.booking_id === bookingId) {
          const updatedBooking = bookings.find(
            (b) => b.booking_id === bookingId
          );
          if (updatedBooking) {
            setSelectedBooking({
              ...updatedBooking,
              payment_status: newPaymentStatus,
            });
          }
        }
      } catch (err) {
        await showModal({
          title: "Error",
          message: `Failed to update booking: ${err.message}`,
        });
      }
    }
  };

  useEffect(() => {
    fetchBookings(searchTerm, filters);
  }, [fetchBookings, searchTerm, filters]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleToggleExpand = (bookingId) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(bookingId)) {
        newSet.delete(bookingId);
      } else {
        newSet.add(bookingId);
      }
      return newSet;
    });
  };

  const exportToCSV = () => {
    const csvContent = [
      [
        "Venue",
        "Facility",
        "User",
        "Email",
        "Date",
        "Time",
        "Amount",
        "Status",
        "Payment Status",
      ],
      ...filteredAndSortedBookings.map((booking) => [
        booking.facilities.venues.name,
        booking.facilities.name,
        // FIX: Use the correct 'users' property
        booking.users?.username || "N/A",
        booking.users?.email || "User Deleted",
        new Date(booking.booking_date).toLocaleDateString("en-IN"),
        new Date(booking.start_time).toLocaleTimeString("en-IN"),
        booking.total_amount,
        booking.status,
        booking.payment_status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const filteredAndSortedBookings = useMemo(() => {
    let filtered = bookings;

    // Note: Main search is now done on the server, this is a fallback client-side filter
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          (b.facilities?.venues?.name || "")
            .toLowerCase()
            .includes(lowerCaseSearch) ||
          (b.users?.username || "").toLowerCase().includes(lowerCaseSearch) ||
          (b.users?.email || "").toLowerCase().includes(lowerCaseSearch) ||
          b.booking_id.toString().includes(lowerCaseSearch)
      );
    }

    filtered.sort((a, b) => {
      let aVal;
      let bVal;

      if (sortConfig.key === "facilities.venues.name") {
        aVal = a.facilities?.venues?.name || "";
        bVal = b.facilities?.venues?.name || "";
      } else if (sortConfig.key === "users.username") {
        aVal = a.users?.username || "";
        bVal = b.users?.username || "";
      } else if (sortConfig.key === "total_amount") {
        aVal = parseFloat(a.total_amount);
        bVal = parseFloat(b.total_amount);
      } else if (
        sortConfig.key === "booking_date" ||
        sortConfig.key === "created_at"
      ) {
        aVal = new Date(a[sortConfig.key]);
        bVal = new Date(b[sortConfig.key]);
      } else {
        aVal = a[sortConfig.key];
        bVal = b[sortConfig.key];
      }

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [bookings, searchTerm, sortConfig]);

  const stats = useMemo(() => {
    const total = bookings.length;
    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    const completed = bookings.filter((b) => b.status === "completed").length;
    const cancelled = bookings.filter((b) => b.status === "cancelled").length;
    const totalRevenue = bookings
      .filter((b) => b.payment_status === "paid")
      .reduce((sum, b) => sum + parseFloat(b.total_amount), 0);

    return { total, confirmed, completed, cancelled, totalRevenue };
  }, [bookings]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green mx-auto mb-4"></div>
          <p className="text-medium-text">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <p className="text-red-600 text-lg font-semibold mb-2">
            Error Loading Bookings
          </p>
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => fetchBookings(searchTerm, filters)}
            className="mt-4 px-6 py-3 bg-primary-green text-white rounded-xl hover:bg-primary-green-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <FaSortAmountUp />
    ) : (
      <FaSortAmountDown />
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-dark-text mb-2">
          Booking Management
        </h1>
        <p className="text-medium-text">
          Manage and monitor all venue bookings
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-gradient-to-br from-primary-green to-primary-green-dark text-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-sm font-medium opacity-90">Total Bookings</h3>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-card-bg border-2 border-blue-200 p-6 rounded-2xl">
          <h3 className="text-sm font-medium text-blue-600">Confirmed</h3>
          <p className="text-2xl font-bold text-blue-700">{stats.confirmed}</p>
        </div>
        <div className="bg-card-bg border-2 border-green-200 p-6 rounded-2xl">
          <h3 className="text-sm font-medium text-green-600">Completed</h3>
          <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
        </div>
        <div className="bg-card-bg border-2 border-red-200 p-6 rounded-2xl">
          <h3 className="text-sm font-medium text-red-600">Cancelled</h3>
          <p className="text-2xl font-bold text-red-700">{stats.cancelled}</p>
        </div>
        <div className="bg-gradient-to-br from-primary-green-light to-primary-green text-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-sm font-medium opacity-90">Total Revenue</h3>
          <p className="text-2xl font-bold">
            ₹{stats.totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="bg-card-bg rounded-2xl shadow-lg border border-border-color-light p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-4">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-light-text" />
            <input
              type="text"
              placeholder="Search bookings, users, venues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-hover-bg border-2 border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 border-2 font-medium ${
                showFilters
                  ? "bg-primary-green text-white border-primary-green"
                  : "bg-hover-bg text-medium-text border-border-color hover:border-primary-green"
              }`}
            >
              <FaFilter /> Filters
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-3 bg-card-bg text-medium-text rounded-xl hover:bg-primary-green hover:text-white transition-all duration-200 border-2 border-border-color hover:border-primary-green font-medium"
            >
              <FaDownload /> Export
            </button>
          </div>
        </div>
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border-color-light">
            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="w-full p-3 bg-hover-bg border-2 border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                Payment Status
              </label>
              <select
                value={filters.payment_status}
                onChange={(e) =>
                  setFilters({ ...filters, payment_status: e.target.value })
                }
                className="w-full p-3 bg-hover-bg border-2 border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
              >
                <option value="all">All Payment Statuses</option>
                <option value="paid">Paid</option>
                <option value="refunded">Refunded</option>
                <option value="pending_refund">Pending Refund</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                Date Range
              </label>
              <select
                value={filters.date_range}
                onChange={(e) =>
                  setFilters({ ...filters, date_range: e.target.value })
                }
                className="w-full p-3 bg-hover-bg border-2 border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
          </div>
        )}
      </div>
      <div className="bg-card-bg rounded-2xl shadow-lg border border-border-color-light overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border-color-light">
            <thead className="bg-gradient-to-r from-hover-bg to-light-green-bg">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-dark-text uppercase tracking-wider cursor-pointer hover:bg-primary-green-light hover:bg-opacity-20 transition-colors"
                  onClick={() => handleSort("facilities.venues.name")}
                >
                  <div className="flex items-center gap-2">
                    Venue {getSortIcon("facilities.venues.name")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-dark-text uppercase tracking-wider cursor-pointer hover:bg-primary-green-light hover:bg-opacity-20 transition-colors"
                  onClick={() => handleSort("users.username")}
                >
                  <div className="flex items-center gap-2">
                    User {getSortIcon("users.username")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-dark-text uppercase tracking-wider cursor-pointer hover:bg-primary-green-light hover:bg-opacity-20 transition-colors"
                  onClick={() => handleSort("booking_date")}
                >
                  <div className="flex items-center gap-2">
                    Booking Date {getSortIcon("booking_date")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-dark-text uppercase tracking-wider cursor-pointer hover:bg-primary-green-light hover:bg-opacity-20 transition-colors"
                  onClick={() => handleSort("total_amount")}
                >
                  <div className="flex items-center gap-2">
                    Amount {getSortIcon("total_amount")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-dark-text uppercase tracking-wider cursor-pointer hover:bg-primary-green-light hover:bg-opacity-20 transition-colors"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center gap-2">
                    Status {getSortIcon("status")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-dark-text uppercase tracking-wider cursor-pointer hover:bg-primary-green-light hover:bg-opacity-20 transition-colors"
                  onClick={() => handleSort("payment_status")}
                >
                  <div className="flex items-center gap-2">
                    Payment {getSortIcon("payment_status")}
                  </div>
                </th>
                <th scope="col" className="relative px-6 py-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-card-bg divide-y divide-border-color-light">
              {filteredAndSortedBookings.length > 0 ? (
                filteredAndSortedBookings.map((booking) => (
                  <BookingRow
                    key={booking.booking_id}
                    booking={booking}
                    onRefundAction={handleRefundAction}
                    onViewDetails={setSelectedBooking}
                    isExpanded={expandedRows.has(booking.booking_id)}
                    onToggleExpand={() =>
                      handleToggleExpand(booking.booking_id)
                    }
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-border-color-light rounded-full flex items-center justify-center">
                        <FaCalendar className="text-light-text text-xl" />
                      </div>
                      <div>
                        <p className="text-medium-text font-semibold mb-1">
                          No bookings found
                        </p>
                        <p className="text-light-text text-sm">
                          {searchTerm ||
                          filters.status !== "all" ||
                          filters.payment_status !== "all" ||
                          filters.date_range !== "all"
                            ? "Try adjusting your filters or search terms"
                            : "No bookings have been made yet"}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filteredAndSortedBookings.length > 0 && (
          <div className="bg-hover-bg px-6 py-4 flex items-center justify-between border-t border-border-color-light">
            <div className="text-sm text-medium-text">
              Showing{" "}
              <span className="font-semibold">
                {filteredAndSortedBookings.length}
              </span>{" "}
              of <span className="font-semibold">{bookings.length}</span>{" "}
              bookings
            </div>
            <div className="text-sm text-light-text">
              {searchTerm && <span>Filtered by: "{searchTerm}"</span>}
            </div>
          </div>
        )}
      </div>
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onRefundAction={handleRefundAction}
        />
      )}
    </div>
  );
}

export default AdminBookingsPage;
