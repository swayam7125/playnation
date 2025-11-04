import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const useSports = () => {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSports = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase.from('sports').select('*');
        if (error) throw error;
        setSports(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSports();
  }, []);

  return { sports, loading, error };
};

export default useSports;
