import React, { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "../../supabaseClient";
import { useModal } from "../../ModalContext";
import toast from 'react-hot-toast';
import {
  FaUserCircle,
  FaUsers,
  FaUserCog,
  FaUserShield,
  FaSearch,
  FaFilter,
  FaEnvelope,
  FaCalendarAlt,
  FaBan,
  FaCheck,
  FaExclamationTriangle,
  FaEye,
  FaThLarge, // Grid Icon
  FaList,      // List Icon
} from "react-icons/fa";
import StatsCard from "../../components/common/StatsCard";
import AdminUserManagementPageSkeleton from "../../components/skeletons/admin/AdminUserManagementPageSkeleton";
import UserDetailsModal from "./UserDetailsModal";

// --- NEW: User List Row Component ---
const UserTableRow = ({ user, currentUser, onToggleStatus, onViewDetails }) => {
  const getRoleConfig = (role) => {
    switch (role) {
      case "player":
        return { color: "bg-blue-100 text-blue-800 border-blue-200", text: "Player" };
      case "venue_owner":
        return { color: "bg-green-100 text-green-800 border-green-200", text: "Venue Owner" };
      case "admin":
        return { color: "bg-purple-100 text-purple-800 border-purple-200", text: "Admin" };
      default:
        return { color: "bg-gray-100 text-gray-800 border-gray-200", text: "Unknown" };
    }
  };

  const roleConfig = getRoleConfig(user.role);
  const isActive = user.status !== "suspended";
  const isProtectedAdmin = user.role === "admin";
  const isSelf = currentUser && currentUser.id === user.user_id;

  return (
    <tr className="border-b border-border-color-light hover:bg-light-green-bg transition-all duration-200 group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-green-light rounded-full flex items-center justify-center">
            <FaUserCircle className="text-primary-green text-xs" />
          </div>
          <div>
            <div className="text-sm font-semibold text-dark-text">
              {user.username || "N/A"} {isSelf && <span className="text-xs text-gray-500">(You)</span>}
            </div>
            <div className="text-xs text-light-text">
              {user.email}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`px-3 py-2 inline-flex text-xs leading-5 font-semibold rounded-lg ${roleConfig.color}`}>
          {roleConfig.text}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`px-3 py-2 inline-flex text-xs leading-5 font-semibold rounded-lg ${isActive ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}`}>
          {isActive ? "Active" : "Suspended"}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-dark-text">{new Date(user.registration_date).toLocaleDateString()}</div>
      </td>
      <td className="px-6 py-4 text-right">
          <div className="flex items-center gap-2 justify-end transition-opacity duration-200">
            {!isProtectedAdmin ? (
              <>
                <button
                  onClick={() => onViewDetails(user)}
                  className="p-2 text-primary-green hover:bg-primary-green hover:text-white rounded-lg transition-all duration-200"
                  title="View Details"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => onToggleStatus(user, isActive ? "suspended" : "active")}
                  className={`p-2 text-white rounded-lg transition-all duration-200 ${isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}>
                  {isActive ? <FaBan /> : <FaCheck />}
                </button>
              </>
            ) : (
              <span className="text-xs text-gray-500 italic px-2 py-1">Protected</span>
            )}
          </div>
      </td>
    </tr>
  );
};
// --- END: User List Row Component ---


const UserCard = ({ user, currentUser, onToggleStatus, onViewDetails }) => {
  const getRoleConfig = (role) => {
    switch (role) {
      case "player":
        return {
          color: "bg-blue-50 text-blue-700 border-blue-200",
          text: "Player",
          dot: "bg-blue-500",
          icon: FaUserCircle,
        };
      case "venue_owner":
        return {
          color: "bg-green-50 text-green-700 border-green-200",
          text: "Venue Owner",
          dot: "bg-green-500",
          icon: FaUserCog,
        };
      case "admin":
        return {
          color: "bg-purple-50 text-purple-700 border-purple-200",
          text: "Admin",
          dot: "bg-purple-500",
          icon: FaUserShield,
        };
      default:
        return {
          color: "bg-gray-50 text-gray-700 border-gray-200",
          text: "Unknown",
          dot: "bg-gray-500",
          icon: FaUserCircle,
        };
    }
  };

  const roleConfig = getRoleConfig(user.role);
  const RoleIcon = roleConfig.icon;
  const isActive = user.status !== "suspended";

  const isProtectedAdmin = user.role === "admin";
  const isSelf = currentUser && currentUser.id === user.user_id;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-green-300 transition-all duration-300 group overflow-hidden">
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <FaUserCircle className="text-2xl text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold text-gray-900 mb-1 truncate group-hover:text-green-700 transition-colors">
                {user.username || "No Username"}
                {isSelf && (
                  <span className="text-sm text-gray-500 ml-2">(You)</span>
                )}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <FaEnvelope className="text-xs" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FaCalendarAlt className="text-xs" />
                <span>
                  Joined {new Date(user.registration_date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${roleConfig.color}`}
            >
              <RoleIcon className="text-xs" />
              {roleConfig.text}
            </div>
            <div
              className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${
                isActive
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isActive ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              {isActive ? "Active" : "Suspended"}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 min-h-[68px]">
        {!isProtectedAdmin ? (
          <div className="flex gap-3">
            <button
              onClick={() =>
                onToggleStatus(user, isActive ? "suspended" : "active")
              }
              className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 flex-1 inline-flex items-center justify-center gap-2 ${
                isActive
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {isActive ? (
                <>
                  <FaBan /> Suspend
                </>
              ) : (
                <>
                  <FaCheck /> Activate
                </>
              )}
            </button>
            <button
              onClick={() => onViewDetails(user)}
              className="px-4 py-2.5 bg-white hover:bg-gray-100 text-gray-600 text-sm font-medium rounded-xl transition-all duration-200 border border-gray-200"
            >
              <FaEye />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs text-gray-500 font-semibold">
              ADMIN ACTIONS DISABLED
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ activeTab }) => {
  const config = {
    all: {
      icon: FaUsers,
      title: "No Users Found",
      description: "No users match your current search criteria.",
      color: "text-medium-text",
    },
    player: {
      icon: FaUserCircle,
      title: "No Players Found",
      description: "No players match your current search criteria.",
      color: "text-blue-500",
    },
    venue_owner: {
      icon: FaUserCog,
      title: "No Venue Owners Found",
      description: "No venue owners match your current search criteria.",
      color: "text-green-500",
    },
    admin: {
      icon: FaUserShield,
      title: "No Admins Found",
      description: "No admin users match your current search criteria.",
      color: "text-purple-500",
    },
    suspended: {
      icon: FaBan,
      title: "No Suspended Users",
      description: "No suspended users found.",
      color: "text-red-500",
    },
  }[activeTab] || {
    icon: FaUsers,
    title: "No Users Found",
    description: "No users match your current criteria.",
    color: "text-medium-text",
  };

  const Icon = config.icon;

  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16">
      <div className={`${config.color} mb-6`}>
        <Icon className="text-6xl" />
      </div>
      <h3 className="text-xl font-semibold text-dark-text mb-2">
        {config.title}
      </h3>
      <p className="text-medium-text text-center max-w-md">
        {config.description}
      </p>
    </div>
  );
};

function AdminUserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
  // --- NEW STATE: View Mode ---
  const [viewMode, setViewMode] = useState("list"); // 'grid' or 'list'
  // -------------------------
  const { showModal } = useModal();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("registration_date", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      setError(
        "Could not fetch users. Please ensure the correct RLS policies are active for the 'users' table in your Supabase dashboard."
      );
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    const fetchCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    fetchCurrentUser();
  }, [fetchUsers]);

  const handleToggleStatus = (userToUpdate, newStatus) => {
    const action = newStatus === "suspended" ? "Suspend" : "Activate";
    showModal({
      title: `${action} User`,
      message: `Are you sure you want to ${action.toLowerCase()} this user?`,
      confirmText: `Yes, ${action}`,
      confirmStyle: newStatus === "suspended" ? "danger" : "primary",
      onConfirm: async () => {
        const toastId = toast.loading(`Updating user status...`);
        try {
          // First, invoke the edge function to update the user's auth status
          const { error: functionError } = await supabase.functions.invoke('update-user-status', {
            body: { user_id: userToUpdate.user_id, status: newStatus },
          });

          if (functionError) {
            throw new Error(`Authentication update failed: ${functionError.message}`);
          }

          // If the auth update is successful, then update the public.users table
          const { data: updateData, error: updateError } = await supabase
            .from("users")
            .update({ status: newStatus })
            .eq("user_id", userToUpdate.user_id)
            .select();

          if (updateError) {
            throw new Error(`Database update failed: ${updateError.message}`);
          }
          
          if (!updateData || updateData.length === 0) {
            throw new Error("User not found or RLS policy prevented update.");
          }

          // If both are successful, update the local state
          setUsers((currentUsers) =>
            currentUsers.map((u) =>
              u.user_id === userToUpdate.user_id ? { ...u, status: newStatus } : u
            )
          );

          toast.dismiss(toastId);
          toast.success(`User successfully ${action.toLowerCase()}ed.`);
          
        } catch (err) {
          toast.dismiss(toastId);
          toast.error(`Failed to update user status: ${err.message}`);
          setError(err.message);
          // No need to manually revert state as we now update it only on full success
        }
      },
    });
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsUserDetailsModalOpen(true);
  };

  const filteredUsers = useMemo(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = users.filter(
      (user) =>
        (user.username?.toLowerCase() || "").includes(lowercasedFilter) ||
        (user.email?.toLowerCase() || "").includes(lowercasedFilter)
    );

    if (activeTab === "all") return filtered;
    if (activeTab === "suspended")
      return filtered.filter((u) => u.status === "suspended");
    return filtered.filter((u) => u.role === activeTab);
  }, [users, activeTab, searchTerm]);

  const statsData = useMemo(
    () => [
      {
        title: "Total Users",
        count: users.length,
        icon: FaUsers,
        color: "bg-blue-500",
        bgColor: "bg-white",
      },
      {
        title: "Players",
        count: users.filter((u) => u.role === "player").length,
        icon: FaUserCircle,
        color: "bg-blue-500",
        bgColor: "bg-white",
      },
      {
        title: "Venue Owners",
        count: users.filter((u) => u.role === "venue_owner").length,
        icon: FaUserCog,
        color: "bg-green-500",
        bgColor: "bg-white",
      },
      {
        title: "Admins",
        count: users.filter((u) => u.role === "admin").length,
        icon: FaUserShield,
        color: "bg-purple-500",
        bgColor: "bg-white",
      },
    ],
    [users]
  );

  const tabData = useMemo(
    () => [
      { key: "all", label: "All Users", count: users.length },
      {
        key: "player",
        label: "Players",
        count: users.filter((u) => u.role === "player").length,
      },
      {
        key: "venue_owner",
        label: "Venue Owners",
        count: users.filter((u) => u.role === "venue_owner").length,
      },
      {
        key: "admin",
        label: "Admins",
        count: users.filter((u) => u.role === "admin").length,
      },
      {
        key: "suspended",
        label: "Suspended",
        count: users.filter((u) => u.status === "suspended").length,
      },
    ],
    [users]
  );

  if (loading || !currentUser)
    return <AdminUserManagementPageSkeleton />; 

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 mb-4">
            <FaExclamationTriangle className="text-5xl mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchUsers}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            User Management
          </h1>
          <p className="text-lg text-gray-600">
            Manage all users and their roles on your platform
          </p>
        </div>
        
        {/* --- Stats Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat) => (
            <StatsCard key={stat.title} title={stat.title} count={stat.count} icon={stat.icon} bgColor={stat.color} />
          ))}
        </div>
        
        {/* --- Controls Panel (Search, Count, View Mode) --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-lg w-full">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              />
            </div>
            
            <div className="flex items-center gap-4">
              {/* Filter Count */}
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                <FaFilter />
                <span>Showing {filteredUsers.length} user(s)</span>
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-white shadow-sm text-green-600'
                      : 'text-gray-500 hover:text-green-600'
                  }`}
                  title="Grid View"
                >
                  <FaThLarge className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    viewMode === 'list'
                      ? 'bg-white shadow-sm text-green-600'
                      : 'text-gray-500 hover:text-green-600'
                  }`}
                  title="List View"
                >
                  <FaList className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- Role Tabs --- */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white p-1 rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
            {tabData.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-shrink-0 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.key
                    ? "bg-green-500 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* --- User Display Area (Conditional Rendering) --- */}
        {filteredUsers.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <UserCard
                  key={user.user_id}
                  user={user}
                  currentUser={currentUser}
                  onToggleStatus={handleToggleStatus}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <div className="bg-card-bg rounded-2xl shadow-lg border border-border-color-light overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border-color-light">
                  <thead className="bg-gradient-to-r from-hover-bg to-light-green-bg">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-dark-text uppercase tracking-wider">User</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-dark-text uppercase tracking-wider">Role</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-dark-text uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-dark-text uppercase tracking-wider">Joined</th>
                      <th scope="col" className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody className="bg-card-bg divide-y divide-border-color-light">
                    {filteredUsers.map((user) => (
                      <UserTableRow
                        key={user.user_id}
                        user={user}
                        currentUser={currentUser}
                        onToggleStatus={handleToggleStatus}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : (
          <EmptyState activeTab={activeTab} />
        )}
      </div>
      {isUserDetailsModalOpen && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setIsUserDetailsModalOpen(false)}
        />
      )}
    </div>
  );
}

export { AdminUserManagementPage as default };