
import useSupabaseQuery from './useSupabaseQuery';
import { supabase } from '../supabaseClient';

export function useNotifications() {
  return useSupabaseQuery(
    'notifications',
    () => supabase
      .from('notifications')
      .select('*, notification_recipients(*)')
      .order('created_at', { ascending: false })
  );
}
