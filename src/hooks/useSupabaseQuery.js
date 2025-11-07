// src/hooks/useSupabaseQuery.js
import { useState, useEffect, useCallback } from 'react';

/**
 * A custom hook to execute a Supabase query.
 * @param {string} queryKey - A unique key for the query.
 * @param {Function} queryFn - An async function that returns a Supabase query.
 * @param {Object} options - Options for the query, e.g., { enabled: true }.
 * @returns {{data: any, loading: boolean, error: string|null, setData: Function}}
 */
export default function useSupabaseQuery(queryKey, queryFn, { enabled = true } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: resultData, error: queryError } = await queryFn();

      if (queryError) {
        throw queryError;
      }

      setData(resultData);
    } catch (err) {
      console.error(`Error fetching for query ${queryKey}:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [queryKey, queryFn, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, setData };
}