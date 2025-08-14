import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../AuthContext';
import OwnerVenueCard from '../components/OwnerVenueCard';

// Renamed the function to match the file name
function MyVenuesPage() {
  const { user } = useAuth();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwnerVenues = async () => {
      if (!user) { setLoading(false); return; }
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('venues')
          .select(`*, facilities (*, sports (name), facility_amenities (amenities (name)))`)
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });
        if (error) throw error;
        setVenues(data || []);
      } catch (error) {
        console.error("Error fetching owner venues:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOwnerVenues();
  }, [user]);

  return (
    <div className="container dashboard-page">
      <div className="owner-header">
        <h1 className="section-heading">My Venues</h1>
        <Link to="/owner/add-venue" className="btn btn-primary">Add New Venue</Link>
      </div>
      {loading ? (
        <p>Loading your venues...</p>
      ) : (
        <div className="venue-grid">
          {venues.length > 0 ? (
            venues.map(venue => <OwnerVenueCard key={venue.venue_id} venue={venue} />)
          ) : (
            <p>You haven't added any venues yet. Click "Add New Venue" to get started.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default MyVenuesPage;