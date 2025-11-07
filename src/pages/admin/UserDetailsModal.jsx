import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import {
  FaUserCircle,
  FaEnvelope,
  FaCalendarAlt,
  FaPhone,
  FaMapMarkerAlt,
  FaBook,
  FaHome,
  FaTimes,
} from "react-icons/fa";

const UserDetailsModal = ({ user, onClose }) => {
  const [bookings, setBookings] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user) return;
      setLoading(true);

      // Fetch bookings
      const { data: bookingsData } = await supabase
        .from("bookings")
        .select("*, facilities(*, venues(*))")
        .eq("user_id", user.user_id)
        .order("start_time", { ascending: false });
      setBookings(bookingsData || []);

      // Fetch venues if user is a venue owner
      if (user.role === "venue_owner") {
        const { data: venuesData } = await supabase
          .from("venues")
          .select("*")
          .eq("owner_id", user.user_id);
        setVenues(venuesData || []);
      }

      setLoading(false);
    };

    fetchUserDetails();
  }, [user]);

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 sticky top-0 bg-white border-b border-gray-200 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FaTimes className="text-gray-600" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <FaUserCircle className="text-4xl text-green-600" />
              <div>
                <h3 className="font-semibold text-lg">{user.username}</h3>
                <p className="text-sm text-gray-500">{user.role}</p>
              </div>
            </div>
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 text-sm">
                <FaEnvelope className="text-gray-400" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FaCalendarAlt className="text-gray-400" />
                <span>
                  Joined:{" "}
                  {new Date(user.registration_date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4 border-b pb-2 flex items-center gap-2">
              <FaBook /> Bookings ({bookings.length})
            </h4>
            {loading ? (
              <p>Loading bookings...</p>
            ) : bookings.length > 0 ? (
              <ul className="space-y-3">
                {bookings.map((booking) => (
                  <li
                    key={booking.id}
                    className="p-3 bg-blue-50 rounded-md text-sm"
                  >
                    <p className="font-semibold">
                      {booking.facilities?.venues?.name || "Venue not found"}
                    </p>
                    <p>
                      Date:{" "}
                      {new Date(booking.start_time).toLocaleDateString()}
                    </p>
                    <p>
                      Status:{" "}
                      <span
                        className={`font-medium ${
                          booking.status === "confirmed"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No bookings found for this user.</p>
            )}
          </div>

          {user.role === "venue_owner" && (
            <div>
              <h4 className="text-lg font-semibold mb-4 border-b pb-2 flex items-center gap-2">
                <FaHome /> Venues ({venues.length})
              </h4>
              {loading ? (
                <p>Loading venues...</p>
              ) : venues.length > 0 ? (
                <ul className="space-y-3">
                  {venues.map((venue) => (
                    <li
                      key={venue.id}
                      className="p-3 bg-green-50 rounded-md text-sm"
                    >
                      <p className="font-semibold">{venue.name}</p>
                      <p>{venue.location}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No venues listed by this user.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
