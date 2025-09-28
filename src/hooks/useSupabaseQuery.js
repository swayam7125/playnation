// src/hooks/useSupabaseQuery.js
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

/**
 * A custom hook to fetch data from Supabase.
 * @param {string} tableName - The name of the table to query.
 * @param {string} selectQuery - The select query string (e.g., '*', 'id, name').
 * @param {Object} filters - An object of filters to apply (e.g., { owner_id: '...' }).
 * @returns {{data: any[], loading: boolean, error: string|null, setData: Function}}
 */
export default function useSupabaseQuery(tableName, selectQuery, filters = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    const filterValues = Object.values(filters);
    if (filterValues.some(value => value === null || value === undefined)) {
      return;
    }
    
    setLoading(true);
    setError(null);

    let query = supabase.from(tableName).select(selectQuery);

    for (const column in filters) {
      query = query.eq(column, filters[column]);
    }

    const { data: resultData, error: queryError } = await query;

    if (queryError) {
      console.error(`Error fetching from ${tableName}:`, queryError);
      setError(queryError.message);
    } else {
      setData(resultData);
    }
    
    setLoading(false);
  }, [tableName, selectQuery, JSON.stringify(filters)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Return setData so components can perform optimistic updates
  return { data, loading, error, setData };
}