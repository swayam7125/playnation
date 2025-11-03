// src/pages/admin/AdminBookingsPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
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
// --- 1. ADD IMPORTS ---
import BookingDetailModal from "../../components/admin/BookingDetailModal";
import BookingRow from "../../components/admin/BookingRow";

// --- 2. DELETE THE INTERNAL BookingDetailModal COMPONENT (lines 22-199) ---

// --- 3. DELETE THE INTERNAL BookingRow COMPONENT (lines 203-345) ---

function AdminBookingsPage() {
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
    key: "start_time",
    direction: "desc",
  });
  const [showFilters, setShowFilters] = useState(false);
  const { showModal } = useModal();

  const fetchBookings = useCallback(
    async (currentSearchTerm, currentFilters = {}) => {
      setLoading(true);
      setError(null);
      try {
        let query = supabase
          .from("bookings")
          .select(
            `
              *, 
              users:user_id (username, email, phone_number), 
              facilities(*, venues(*))
            `
          )
          .order("start_time", { ascending: false });

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
        
        if (currentFilters.date_range !== "all" && currentFilters.date_range) {
          const today = new Date();
          let startDate = new Date();
          
          if (currentFilters.date_range === 'today') {
            startDate.setHours(0, 0, 0, 0);
          } else if (currentFilters.date_range === 'week') {
            startDate.setDate(today.getDate() - 7);
            startDate.setHours(0, 0, 0, 0);
          } else if (currentFilters.date_range === 'month') {
            startDate.setMonth(today.getMonth() - 1);
            startDate.setHours(0, 0, 0, 0);
          }
          
          query = query.gte('start_time', startDate.toISOString());
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

  const handleRefundAction = (bookingId, action) => {
    const isApprove = action === "refunded";
    const modalTitle = isApprove ? "Confirm Refund Approval" : "Confirm Refund Revert";
    const modalMessage = `Are you sure you want to ${isApprove ? "approve the refund" : "revert the refund"} for booking ID: ${bookingId}?`;
    const confirmText = isApprove ? "Yes, Approve" : "Yes, Revert";

    showModal({
      title: modalTitle,
      message: modalMessage,
      confirmText,
      confirmStyle: isApprove ? "success" : "warning",
      onConfirm: async () => {
        try {
          let result;
          if (isApprove) {
            // Call the serverless function to process the refund
            const { data, error } = await supabase.functions.invoke("create-refund", {
              body: { booking_id: bookingId },
            });

            if (error) throw new Error(`Function error: ${error.message}`);
            result = data;

          } else {
            // Directly update the status for reverting a refund
            const { error } = await supabase
              .from("bookings")
              .update({ payment_status: "paid", updated_at: new Date().toISOString() })
              .eq("booking_id", bookingId);

            if (error) throw error;
          }

          toast.success(isApprove ? "Refund approved successfully!" : "Refund reverted successfully!");

          // Refresh data and update UI
          fetchBookings(searchTerm, filters);
          if (selectedBooking?.booking_id === bookingId) {
            const updatedBooking = { ...selectedBooking, payment_status: isApprove ? "refunded" : "paid" };
            setSelectedBooking(updatedBooking);
          }

        } catch (err) {
          showModal({
            title: "Error",
            message: `Failed to perform action: ${err.message}`,
          });
        }
      },
    });
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
        "Cancellation Reason", // <-- Added CSV column
      ],
      ...filteredAndSortedBookings.map((booking) => [
        booking.facilities.venues.name,
        booking.facilities.name,
        booking.users?.username || "-",
        booking.users?.email || "User Deleted",
        new Date(booking.start_time).toLocaleDateString("en-IN"),
        new Date(booking.start_time).toLocaleTimeString("en-IN"),
        booking.total_amount,
        booking.status,
        booking.payment_status,
        booking.cancellation_reason || "", // <-- Added CSV data
      ]),
    ]
      .map((row) => `"${row.join('","')}"`) // Quote all fields
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const filteredAndSortedBookings = useMemo(() => {
    let filtered = bookings;

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
        sortConfig.key === "start_time" ||
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-dark-text mb-1">
          Booking Management
        </h1>
        <p className="text-medium-text">
          Manage and monitor all venue bookings
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-primary-green to-primary-green-dark text-white p-4 rounded-2xl shadow-lg">
          <h3 className="text-xs font-medium opacity-90">Total Bookings</h3>
          <p className="text-2xl font-bold mt-1">{stats.total}</p>
        </div>
        <div className="bg-card-bg border-2 border-blue-200 p-4 rounded-2xl">
          <h3 className="text-xs font-medium text-blue-600">Confirmed</h3>
          <p className="text-xl font-bold text-blue-700 mt-1">{stats.confirmed}</p>
        </div>
        <div className="bg-card-bg border-2 border-green-200 p-4 rounded-2xl">
          <h3 className="text-xs font-medium text-green-600">Completed</h3>
          <p className="text-xl font-bold text-green-700 mt-1">{stats.completed}</p>
        </div>
        <div className="bg-card-bg border-2 border-red-200 p-4 rounded-2xl">
          <h3 className="text-xs font-medium text-red-600">Cancelled</h3>
          <p className="text-xl font-bold text-red-700 mt-1">{stats.cancelled}</p>
        </div>
        <div className="bg-gradient-to-br from-primary-green-light to-primary-green text-white p-4 rounded-2xl shadow-lg">
          <h3 className="text-xs font-medium opacity-90">Total Revenue</h3>
          <p className="text-xl font-bold mt-1">
            ₹{stats.totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>
      {/* --- COMPACT ACTION BAR START --- */}
      <div className="bg-card-bg rounded-2xl shadow-lg border border-border-color-light p-4 mb-6">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="relative flex-grow sm:flex-grow-0 sm:w-72">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-sm pl-9 pr-4 py-2 bg-hover-bg border-2 border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 border-2 text-sm font-medium ${
                showFilters
                  ? "bg-primary-green text-white border-primary-green"
                  : "bg-hover-bg text-medium-text border-border-color hover:border-primary-green"
              }`}
            >
              <FaFilter />
              <span>Filters</span>
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-3 py-2 bg-card-bg text-medium-text rounded-lg hover:bg-primary-green hover:text-white transition-all duration-200 border-2 border-border-color hover:border-primary-green text-sm font-medium"
            >
              <FaDownload />
              <span>Export</span>
            </button>
          </div>
        </div>
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 mt-3 border-t border-border-color-light">
            <div>
              <label className="block text-xs font-medium text-dark-text mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="w-full p-2 text-sm bg-hover-bg border-2 border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-text mb-1">
                Payment Status
              </label>
              <select
                value={filters.payment_status}
                onChange={(e) =>
                  setFilters({ ...filters, payment_status: e.target.value })
                }
                className="w-full p-2 text-sm bg-hover-bg border-2 border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="paid">Paid</option>
                <option value="refunded">Refunded</option>
                <option value="pending_refund">Pending Refund</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-text mb-1">
                Date Range
              </label>
              <select
                value={filters.date_range}
                onChange={(e) =>
                  setFilters({ ...filters, date_range: e.target.value })
                }
                className="w-full p-2 text-sm bg-hover-bg border-2 border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
          </div>
        )}
      </div>
       {/* --- COMPACT ACTION BAR END --- */}
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
                  onClick={() => handleSort("start_time")}
                >
                  <div className="flex items-center gap-2">
                    Booking Date {getSortIcon("start_time")}
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

                {/* --- HEADER FOR REASON --- */}
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-dark-text uppercase tracking-wider"
                >
                  Reason
                </th>
                {/* --- END OF CHANGE --- */}

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
                  <td colSpan="8" className="px-6 py-12 text-center">
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