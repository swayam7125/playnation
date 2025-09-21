import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { useModal } from '../../ModalContext';
import { FaUserCircle, FaUsers, FaUserCog, FaUserShield, FaSearch, FaFilter, FaEnvelope, FaCalendarAlt, FaEdit, FaTrash, FaBan, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import StatsCard from '../../components/common/StatsCard';

const UserCard = ({ user, onRoleChange, onDeleteUser, onToggleStatus }) => {
    const getRoleConfig = (role) => {
        switch (role) {
            case 'player':
                return { 
                    color: 'bg-blue-50 text-blue-700 border-blue-200', 
                    text: 'Player', 
                    dot: 'bg-blue-500',
                    icon: FaUserCircle 
                };
            case 'venue_owner':
                return { 
                    color: 'bg-green-50 text-green-700 border-green-200', 
                    text: 'Venue Owner', 
                    dot: 'bg-green-500',
                    icon: FaUserCog 
                };
            case 'admin':
                return { 
                    color: 'bg-purple-50 text-purple-700 border-purple-200', 
                    text: 'Admin', 
                    dot: 'bg-purple-500',
                    icon: FaUserShield 
                };
            default:
                return { 
                    color: 'bg-gray-50 text-gray-700 border-gray-200', 
                    text: 'Unknown', 
                    dot: 'bg-gray-500',
                    icon: FaUserCircle 
                };
        }
    };

    const roleConfig = getRoleConfig(user.role);
    const RoleIcon = roleConfig.icon;
    const isActive = user.status !== 'suspended';

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
                                {user.username || 'No Username'}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <FaEnvelope className="text-xs" />
                                <span className="truncate">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <FaCalendarAlt className="text-xs" />
                                <span>Joined {new Date(user.registration_date).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${roleConfig.color}`}>
                            <RoleIcon className="text-xs" />
                            {roleConfig.text}
                        </div>
                        <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${
                            isActive 
                                ? 'bg-green-50 text-green-700 border border-green-200' 
                                : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            {isActive ? 'Active' : 'Suspended'}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-4 h-4 bg-green-200 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-green-700">ID</span>
                        </div>
                        <span>#{user.user_id}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaUsers className="text-green-600" />
                        <span>{user.role?.replace('_', ' ') || 'No Role'}</span>
                    </div>
                </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex gap-2 flex-wrap">
                    {/* Role Change Buttons */}
                    {user.role !== 'player' && (
                        <button 
                            onClick={() => onRoleChange(user.user_id, 'player')}
                            className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-medium rounded-lg transition-all duration-200 hover:shadow-sm"
                        >
                            Make Player
                        </button>
                    )}
                    {user.role !== 'venue_owner' && (
                        <button 
                            onClick={() => onRoleChange(user.user_id, 'venue_owner')}
                            className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-800 text-xs font-medium rounded-lg transition-all duration-200 hover:shadow-sm"
                        >
                            Make Owner
                        </button>
                    )}
                    {user.role !== 'admin' && (
                        <button 
                            onClick={() => onRoleChange(user.user_id, 'admin')}
                            className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-medium rounded-lg transition-all duration-200 hover:shadow-sm"
                        >
                            Make Admin
                        </button>
                    )}
                    
                    {/* Status Toggle Button */}
                    <button 
                        onClick={() => onToggleStatus(user.user_id, isActive ? 'suspended' : 'active')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 hover:shadow-sm ${
                            isActive 
                                ? 'bg-red-100 hover:bg-red-200 text-red-800' 
                                : 'bg-green-100 hover:bg-green-200 text-green-800'
                        }`}
                    >
                        {isActive ? (
                            <>
                                <FaBan className="inline mr-1" />
                                Suspend
                            </>
                        ) : (
                            <>
                                <FaCheck className="inline mr-1" />
                                Activate
                            </>
                        )}
                    </button>
                    
                    {/* Delete Button - Only show for non-admin users */}
                    {user.role !== 'admin' && (
                        <button 
                            onClick={() => onDeleteUser(user.user_id)}
                            className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 text-xs font-medium rounded-lg transition-all duration-200 hover:shadow-sm ml-auto"
                        >
                            <FaTrash className="inline mr-1" />
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const EmptyState = ({ activeTab }) => {
    const config = {
        all: { icon: FaUsers, title: 'No Users Found', description: 'No users match your current search criteria.', color: 'text-medium-text' },
        players: { icon: FaUserCircle, title: 'No Players Found', description: 'No players match your current search criteria.', color: 'text-blue-500' },
        venue_owners: { icon: FaUserCog, title: 'No Venue Owners Found', description: 'No venue owners match your current search criteria.', color: 'text-green-500' },
        admins: { icon: FaUserShield, title: 'No Admins Found', description: 'No admin users match your current search criteria.', color: 'purple-500' },
        suspended: { icon: FaBan, title: 'No Suspended Users', description: 'No suspended users found.', color: 'text-red-500' }
    }[activeTab] || { icon: FaUsers, title: 'No Users Found', description: 'No users match your current criteria.', color: 'text-medium-text' };

    const Icon = config.icon;

    return (
        <div className="col-span-full flex flex-col items-center justify-center py-16">
            <div className={`${config.color} mb-6`}>
                <Icon className="text-6xl" />
            </div>
            <h3 className="text-xl font-semibold text-dark-text mb-2">{config.title}</h3>
            <p className="text-medium-text text-center max-w-md">{config.description}</p>
        </div>
    );
};

function AdminUserManagementPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const { showModal } = useModal();

    const fetchAllUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('registration_date', { ascending: false });
            
            if (error) throw error;
            setUsers(data || []);
        } catch (err) {
            setError(err.message);
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        const confirmed = await showModal({
            title: "Change User Role",
            message: `Are you sure you want to change this user's role to "${newRole.replace('_', ' ')}"?`,
            confirmText: "Yes, Change Role",
            confirmStyle: "primary"
        });

        if (confirmed) {
            try {
                const { error } = await supabase
                    .from('users')
                    .update({ role: newRole })
                    .eq('user_id', userId);

                if (error) {
                    showModal({
                        title: "Error",
                        message: `Failed to update user role: ${error.message}`
                    });
                    return;
                }

                showModal({
                    title: "Success",
                    message: "User role updated successfully!"
                });

                fetchAllUsers();
            } catch (err) {
                showModal({
                    title: "Error",
                    message: `An unexpected error occurred: ${err.message}`
                });
            }
        }
    };

    const handleToggleStatus = async (userId, newStatus) => {
        const action = newStatus === 'suspended' ? 'suspend' : 'activate';
        const confirmed = await showModal({
            title: `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
            message: `Are you sure you want to ${action} this user?`,
            confirmText: `Yes, ${action.charAt(0).toUpperCase() + action.slice(1)}`,
            confirmStyle: newStatus === 'suspended' ? 'danger' : 'primary'
        });

        if (confirmed) {
            try {
                const { error } = await supabase
                    .from('users')
                    .update({ status: newStatus })
                    .eq('user_id', userId);

                if (error) {
                    showModal({
                        title: "Error",
                        message: `Failed to ${action} user: ${error.message}`
                    });
                    return;
                }

                showModal({
                    title: "Success",
                    message: `User ${action}d successfully!`
                });

                fetchAllUsers();
            } catch (err) {
                showModal({
                    title: "Error",
                    message: `An unexpected error occurred: ${err.message}`
                });
            }
        }
    };

    const handleDeleteUser = async (userId) => {
        const confirmed = await showModal({
            title: "Delete User",
            message: "Are you sure you want to permanently delete this user? This action cannot be undone.",
            confirmText: "Yes, Delete",
            confirmStyle: "danger"
        });

        if (confirmed) {
            try {
                const { error } = await supabase
                    .from('users')
                    .delete()
                    .eq('user_id', userId);

                if (error) {
                    showModal({
                        title: "Error",
                        message: `Failed to delete user: ${error.message}`
                    });
                    return;
                }

                showModal({
                    title: "Success",
                    message: "User deleted successfully!"
                });

                fetchAllUsers();
            } catch (err) {
                showModal({
                    title: "Error",
                    message: `An unexpected error occurred: ${err.message}`
                });
            }
        }
    };

    const filterUsers = (userList) => {
        if (!searchTerm) return userList;
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return userList.filter(user => 
            `${user.username || ''} ${user.email} ${user.role}`.toLowerCase().includes(lowerCaseSearchTerm)
        );
    };

    const allUsers = filterUsers(users);
    const players = filterUsers(users.filter(u => u.role === 'player'));
    const venueOwners = filterUsers(users.filter(u => u.role === 'venue_owner'));
    const admins = filterUsers(users.filter(u => u.role === 'admin'));
    const suspendedUsers = filterUsers(users.filter(u => u.status === 'suspended'));

    const currentUsers = {
        all: allUsers,
        players: players,
        venue_owners: venueOwners,
        admins: admins,
        suspended: suspendedUsers
    }[activeTab] || [];

    const statsData = [
        { title: "Total Users", count: allUsers.length, icon: FaUsers, color: "bg-blue-500", bgColor: "bg-white" },
        { title: "Players", count: players.length, icon: FaUserCircle, color: "bg-blue-500", bgColor: "bg-white" },
        { title: "Venue Owners", count: venueOwners.length, icon: FaUserCog, color: "bg-green-500", bgColor: "bg-white" },
        { title: "Admins", count: admins.length, icon: FaUserShield, color: "bg-purple-500", bgColor: "bg-white" },
    ];

    const tabData = [
        { key: 'all', label: 'All Users', count: allUsers.length },
        { key: 'players', label: 'Players', count: players.length },
        { key: 'venue_owners', label: 'Venue Owners', count: venueOwners.length },
        { key: 'admins', label: 'Admins', count: admins.length },
        { key: 'suspended', label: 'Suspended', count: suspendedUsers.length }
    ];

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">Loading users...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto px-4">
                <div className="text-red-500 mb-4">
                    <FaExclamationTriangle className="text-5xl mx-auto" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                    onClick={fetchAllUsers}
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
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">User Management</h1>
                    <p className="text-lg text-gray-600">Manage all users and their roles on your platform</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statsData.map(stat => (
                        <StatsCard key={stat.title} {...stat} />
                    ))}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                type="text"
                                placeholder="Search users by name, email, or role..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                            />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaFilter />
                            <span>Showing {currentUsers.length} users</span>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <div className="flex space-x-1 bg-white p-1 rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
                        {tabData.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex-shrink-0 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 whitespace-nowrap ${
                                    activeTab === tab.key 
                                        ? 'bg-green-500 text-white shadow-sm' 
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            >
                                {tab.label} ({tab.count})
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {currentUsers.length > 0 ? (
                        currentUsers.map(user => (
                            <UserCard 
                                key={user.user_id} 
                                user={user} 
                                onRoleChange={handleRoleChange}
                                onDeleteUser={handleDeleteUser}
                                onToggleStatus={handleToggleStatus}
                            />
                        ))
                    ) : (
                        <EmptyState activeTab={activeTab} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminUserManagementPage;