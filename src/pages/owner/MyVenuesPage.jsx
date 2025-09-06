import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../AuthContext';
import OwnerVenueCard from '../../components/venues/OwnerVenueCard';

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
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 p-8 bg-card-bg rounded-xl shadow-lg border border-border-color">
        <div>
            <h1 className="text-2xl font-bold text-dark-text relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-16 after:h-1 after:bg-primary-green after:rounded-sm">My Venues</h1>
            <p className="text-light-text mt-2">Manage, edit, and view the status of your venues.</p>
        </div>
        <Link to="/owner/add-venue" className="mt-4 md:mt-0 py-3 px-6 rounded-lg font-semibold text-sm transition duration-300 no-underline bg-primary-green text-white shadow-sm hover:bg-primary-green-dark hover:-translate-y-px hover:shadow-md">Add New Venue</Link>
      </div>
      
      {loading ? (
        <p className="text-center">Loading your venues...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {venues.length > 0 ? (
            venues.map(venue => <OwnerVenueCard key={venue.venue_id} venue={venue} />)
          ) : (
            <p className="col-span-full text-center text-light-text">You haven't added any venues yet. Click "Add New Venue" to get started.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default MyVenuesPage;