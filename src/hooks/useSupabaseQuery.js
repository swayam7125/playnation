// src/hooks/useSupabaseQuery.js
import { useState, useEffect, useCallback } from 'react';

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

  // --- V V V --- THIS IS THE CHANGE --- V V V ---
  return { data, loading, error, setData, refetch: fetchData };
  // --- ^ ^ ^ --- THIS IS THE CHANGE --- ^ ^ ^ ---
}