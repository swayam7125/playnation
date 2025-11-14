import { useCallback, useMemo } from 'react';
import useSupabaseQuery from './useSupabaseQuery';
import { supabase } from '../supabaseClient';

// This function flattens the nested data
const transformNotificationData = (data) => {
  if (!data) return [];
  
  const notifications = [];
  
  for (const item of data) {
    if (item.notifications) {
      notifications.push({
        // Get details from the parent notification
        title: item.notifications.title,
        body: item.notifications.body,
        created_at: item.notifications.created_at,
        link_to: item.notifications.link_to,
        
        // Get details from the recipient record
        id: item.recipient_id, // Use the aliased 'recipient_id'
        is_read: item.is_read,
        read_at: item.read_at,
        delivered_at: item.delivered_at,
        notification_id: item.notification_id, // This is the FK
      });
    }
  }
  
  return notifications;
};

export function useNotifications() {
  
  // This is the explicit query that fixes the "ambiguous" error
  const query = useCallback(() => 
    supabase
      .from('notification_recipients')
      .select(`
        recipient_id:id, 
        notification_id, 
        is_read, 
        read_at, 
        delivered_at,
        notifications (
          notification_main_id:id,
          title,
          body,
          created_at,
          link_to
        )
      `)
      .eq('is_read', false)
      .order('created_at', { foreignTable: 'notifications', ascending: false })
      .limit(20),
    []
  );

  // Call your useSupabaseQuery hook and get the raw data
  const { data: rawData, loading, error, refetch } = useSupabaseQuery(
    'notifications',
    query
  );

  // Transform the raw data
  const notifications = useMemo(() => transformNotificationData(rawData), [rawData]);

  // Create the 'markAsRead' function
  const markAsRead = useCallback(async (recipientId) => {
    try {
      const { error: updateError } = await supabase
        .from('notification_recipients')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', recipientId);
      if (updateError) throw updateError;
      refetch();
    } catch (err) {
      console.error("Failed to mark as read:", err.message);
    }
  }, [refetch]);

  // Create the 'markAllAsRead' function
  const markAllAsRead = useCallback(async () => {
    try {
      const { error: rpcError } = await supabase.rpc('mark_all_notifications_as_read');
      if (rpcError) throw rpcError;
      refetch();
    } catch (err) {
      console.error("Failed to mark all as read:", err.message);
    }
  }, [refetch]);

  // Return the final, correct shape
  return { 
    notifications, 
    loading, 
    error, 
    markAsRead, 
    markAllAsRead,
    unreadCount: notifications?.length || 0 
  };
}