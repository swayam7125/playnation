import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../supabaseClient';
import { FaSearch, FaUserCheck, FaUserSlash } from 'react-icons/fa';
import { useModal } from '../../ModalContext';

const PlayerRow = ({ player, onStatusChange }) => {
    return (
        <tr className="border-b border-border-color-light hover:bg-hover-bg transition-colors duration-200">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-dark-text">{player.first_name} {player.last_name}</div>
                <div className="text-xs text-light-text">@{player.username}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-medium-text">{player.email}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-medium-text">{player.phone_number || 'N/A'}</td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${player.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {player.is_active ? 'Active' : 'Suspended'}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {player.is_active ? (
                    <button onClick={() => onStatusChange(player.user_id, false)} className="text-red-600 hover:text-red-800 flex items-center gap-2">
                        <FaUserSlash /> Suspend
                    </button>
                ) : (
                    <button onClick={() => onStatusChange(player.user_id, true)} className="text-green-600 hover:text-green-800 flex items-center gap-2">
                        <FaUserCheck /> Unsuspend
                    </button>
                )}
            </td>
        </tr>
    );
};

function AdminPlayersPage() {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { showModal } = useModal();

    const fetchPlayers = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .in('role', ['player', 'venue_owner']); // Fetches both players and owners

            if (error) throw error;
            setPlayers(data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlayers();
    }, []);
    
    const handleStatusChange = async (userId, newStatus) => {
        const action = newStatus ? 'Unsuspend' : 'Suspend';
        const isConfirmed = await showModal({
            title: `${action} User`,
            message: `Are you sure you want to ${action.toLowerCase()} this user?`,
            confirmText: `Yes, ${action}`,
            confirmStyle: newStatus ? "success" : "danger"
        });

        if (isConfirmed) {
            try {
                const { error } = await supabase
                    .from('users')
                    .update({ is_active: newStatus })
                    .eq('user_id', userId);
                if (error) throw error;
                await showModal({ title: "Success", message: `User has been ${action.toLowerCase()}ed.` });
                fetchPlayers();
            } catch (err) {
                await showModal({ title: "Error", message: `Failed to update user status: ${err.message}` });
            }
        }
    };

    const filteredPlayers = useMemo(() => {
        if (!searchTerm) return players;
        const lowerCaseSearch = searchTerm.toLowerCase();
        return players.filter(p =>
            (p.username || '').toLowerCase().includes(lowerCaseSearch) ||
            (p.email || '').toLowerCase().includes(lowerCaseSearch) ||
            (p.first_name || '').toLowerCase().includes(lowerCaseSearch) ||
            (p.last_name || '').toLowerCase().includes(lowerCaseSearch)
        );
    }, [players, searchTerm]);

    if (loading) return <p className="container mx-auto text-center p-12">Loading players...</p>;
    if (error) return <p className="container mx-auto text-center text-red-600 p-12">Error: {error}</p>;

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-dark-text mb-8">Manage Players & Owners</h1>
            <div className="bg-card-bg p-6 rounded-2xl shadow-lg border border-border-color-light">
                <div className="relative mb-4">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-light-text" />
                    <input
                        type="text"
                        placeholder="Search by name, username, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-hover-bg border border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border-color-light">
                        <thead className="bg-hover-bg">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-dark-text uppercase tracking-wider">User</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-dark-text uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-dark-text uppercase tracking-wider">Phone</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-dark-text uppercase tracking-wider">Status</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-card-bg divide-y divide-border-color-light">
                            {filteredPlayers.map(player => <PlayerRow key={player.user_id} player={player} onStatusChange={handleStatusChange} />)}
                        </tbody>
                    </table>
                </div>
                {filteredPlayers.length === 0 && (
                    <p className="text-center py-8 text-medium-text">No users found matching your search.</p>
                )}
            </div>
        </div>
    );
}

export default AdminPlayersPage;