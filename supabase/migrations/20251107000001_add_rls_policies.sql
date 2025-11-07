
-- Enable RLS on the tables
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_recipients ENABLE ROW LEVEL SECURITY;

-- Helper function to get user role
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT
LANGUAGE sql
STABLE
AS $$
  SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid();
$$;

-- Policies for notifications table
CREATE POLICY "Allow admin full access" ON notifications
    FOR ALL
    USING (get_my_role() = 'admin')
    WITH CHECK (get_my_role() = 'admin');

CREATE POLICY "Allow sender to see their notifications" ON notifications
    FOR SELECT
    USING (sender_id = auth.uid());

CREATE POLICY "Allow recipients to see their notifications" ON notifications
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1
            FROM notification_recipients
            WHERE notification_recipients.notification_id = notifications.id
            AND notification_recipients.recipient_id = auth.uid()
        )
    );

-- Policies for notification_recipients table
CREATE POLICY "Allow admin full access" ON notification_recipients
    FOR ALL
    USING (get_my_role() = 'admin')
    WITH CHECK (get_my_role() = 'admin');

CREATE POLICY "Allow user to see their own recipient records" ON notification_recipients
    FOR SELECT
    USING (recipient_id = auth.uid());

CREATE POLICY "Allow user to mark their notifications as read" ON notification_recipients
    FOR UPDATE
    USING (recipient_id = auth.uid())
    WITH CHECK (recipient_id = auth.uid());

-- Rollback instructions
-- To rollback this migration, you can run the following SQL:
-- ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE notification_recipients DISABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS "Allow admin full access" ON notifications;
-- DROP POLICY IF EXISTS "Allow sender to see their notifications" ON notifications;
-- DROP POLICY IF EXISTS "Allow recipients to see their notifications" ON notifications;
-- DROP POLICY IF EXISTS "Allow admin full access" ON notification_recipients;
-- DROP POLICY IF EXISTS "Allow user to see their own recipient records" ON notification_recipients;
-- DROP POLICY IF EXISTS "Allow user to mark their notifications as read" ON notification_recipients;
-- DROP FUNCTION IF EXISTS get_my_role();
