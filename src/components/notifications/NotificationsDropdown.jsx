import React, { useState, useRef, useEffect } from "react";
import { FaBell, FaCheckDouble, FaSpinner, FaInbox } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNotifications } from "../../hooks/useNotifications";
import toast from "react-hot-toast";

const formatTimeAgo = (dateString) => {
  // ... (Your existing formatTimeAgo function)
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "m ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "min ago";
  return "Just now";
};

function NotificationsDropdown() {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // --- ⬇⬇⬇ THIS IS THE FIX ⬇⬇⬇ ---
  // We move the error toast into a useEffect hook.
  // This hook will only run when the 'error' value changes,
  // preventing the infinite loop.
  useEffect(() => {
    if (error) {
      toast.error(`Error loading notifications: ${error}`);
    }
  }, [error]);
  // --- ⬆⬆⬆ END OF FIX ⬆⬆⬆ ---

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- 🚨 The problematic code below has been removed ---
  // if (error) {
  //   toast.error(`Error loading notifications: ${error}`);
  // }
  // ---

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = (e, notificationId) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent link navigation
    markAsRead(notificationId);
  };

  const handleMarkAllAsRead = (e) => {
    e.stopPropagation();
    if (notifications.length > 0 && unreadCount > 0) {
      markAllAsRead();
    }
  };

  const NotificationItem = ({ notification }) => (
    <Link
      to={notification.link_to || "#"}
      onClick={() => {
        setIsOpen(false);
        if (!notification.is_read) {
          markAsRead(notification.notification_id);
        }
      }}
      className={`block px-4 py-3 hover:bg-hover-bg ${
        !notification.is_read ? "bg-light-green-bg" : "bg-card-bg"
      }`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div
            className={`w-3 h-3 rounded-full mt-1.5 ${
              !notification.is_read
                ? "bg-primary-green"
                : "bg-border-color-light"
            }`}
          ></div>
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-medium text-dark-text truncate">
            {notification.title}
          </p>
          <p className="text-sm text-medium-text">{notification.body}</p>
          <p className="text-xs text-light-text mt-1">
            {formatTimeAgo(notification.created_at)}
          </p>
        </div>
        {!notification.is_read && (
          <div className="ml-2 flex-shrink-0">
            <button
              onClick={(e) => handleMarkAsRead(e, notification.notification_id)}
              className="text-primary-green hover:text-primary-green-dark"
              title="Mark as read"
            >
              <FaCheckDouble />
            </button>
          </div>
        )}
      </div>
    </Link>
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-full text-medium-text hover:text-dark-text hover:bg-hover-bg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green"
      >
        <FaBell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-card-bg rounded-lg shadow-xl border border-border-color-light overflow-hidden z-50">
          <div className="flex justify-between items-center px-4 py-3 border-b border-border-color-light">
            <h3 className="text-lg font-semibold text-dark-text">
              Notifications
            </h3>
            <button
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className="text-sm font-medium text-primary-green hover:text-primary-green-dark disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Mark all as read
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <FaSpinner className="animate-spin text-primary-green text-2xl" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-10 px-4">
                <FaInbox className="mx-auto text-4xl text-gray-400" />
                <p className="mt-2 text-sm font-medium text-medium-text">
                  No new notifications
                </p>
                <p className="text-xs text-light-text">
                  We'll let you know when something new comes up.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border-color-light">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.notification_id}
                    notification={notification}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="px-4 py-2 bg-hover-bg border-t border-border-color-light">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center text-sm font-medium text-primary-green hover:text-primary-green-dark"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationsDropdown;
