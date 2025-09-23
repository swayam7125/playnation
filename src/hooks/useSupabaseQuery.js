// src/hooks/useSupabaseQuery.js
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

/**
 * A custom hook to fetch data from Supabase.
 * @param {string} tableName - The name of the table to query.
 * @param {string} selectQuery - The select query string (e.g., '*', 'id, name').
 * @param {Object} filters - An object of filters to apply (e.g., { owner_id: '...' }).
 * @returns {{data: any[], loading: boolean, error: string|null}}
 */
function useSupabaseQuery(tableName, selectQuery, filters = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Don't run the query if a filter value is missing.
      // For example, if we need user.id but the user is not loaded yet.
      const filterValues = Object.values(filters);
      if (filterValues.some(value => value === null || value === undefined)) {
        // We are not setting loading to false here, because we expect
        // the hook to re-run when the filter value is available.
        return;
      }
      
      setLoading(true);
      setError(null);

      let query = supabase.from(tableName).select(selectQuery);

      // Apply all filters from the filters object
      for (const column in filters) {
        query = query.eq(column, filters[column]);
      }

      const { data, error } = await query;

      if (error) {
        console.error(`Error fetching from ${tableName}:`, error);
        setError(error.message);
      } else {
        setData(data);
      }
      
      setLoading(false);
    };

    fetchData();
    // We stringify the filters object to prevent infinite re-renders
    // because an object will have a new reference on every render.
  }, [tableName, selectQuery, JSON.stringify(filters)]);

  return { data, loading, error };
}

export default useSupabaseQuery;