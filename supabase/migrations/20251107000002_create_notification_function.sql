
CREATE OR REPLACE FUNCTION public.create_notification(
    title TEXT,
    body TEXT,
    sender_type TEXT,
    recipient_type TEXT,
    recipient_ids UUID[] DEFAULT NULL,
    owner_id UUID DEFAULT NULL
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    notification_id BIGINT;
    current_user_id UUID := auth.uid();
    current_user_role TEXT;
    resolved_recipient_ids UUID[];
BEGIN
    -- Get the role of the current user
    SELECT raw_user_meta_data->>'role' INTO current_user_role FROM auth.users WHERE id = current_user_id;

    -- Permission checks
    IF current_user_role = 'admin' AND sender_type != 'admin' THEN
        RAISE EXCEPTION 'Admins can only send notifications as admin';
    ELSIF current_user_role = 'owner' AND sender_type != 'owner' THEN
        RAISE EXCEPTION 'Owners can only send notifications as owner';
    ELSIF current_user_role IS NULL THEN
        RAISE EXCEPTION 'User role not found';
    END IF;

    -- Recipient resolution
    CASE recipient_type
        WHEN 'all_owners' THEN
            IF current_user_role != 'admin' THEN
                RAISE EXCEPTION 'Only admins can send notifications to all owners';
            END IF;
            SELECT array_agg(id) INTO resolved_recipient_ids FROM auth.users WHERE raw_user_meta_data->>'role' = 'owner';
        WHEN 'all_players' THEN
            IF current_user_role != 'owner' THEN
                RAISE EXCEPTION 'Only owners can send notifications to all players';
            END IF;
            SELECT array_agg(id) INTO resolved_recipient_ids FROM auth.users WHERE raw_user_meta_data->>'role' = 'player';
        WHEN 'visitors' THEN
            IF current_user_role != 'owner' THEN
                RAISE EXCEPTION 'Only owners can send notifications to visitors';
            END IF;
            IF owner_id IS NULL OR owner_id != current_user_id THEN
                RAISE EXCEPTION 'Owner can only send notifications to their own visitors';
            END IF;
            SELECT array_agg(DISTINCT player_id) INTO resolved_recipient_ids FROM visits WHERE visits.owner_id = owner_id;
        WHEN 'owner' OR 'player' THEN
            IF recipient_ids IS NULL OR array_length(recipient_ids, 1) = 0 THEN
                RAISE EXCEPTION 'Recipient IDs must be provided for this recipient type';
            END IF;
            resolved_recipient_ids := recipient_ids;
        ELSE
            RAISE EXCEPTION 'Invalid recipient_type';
    END CASE;

    -- Deduplicate recipients
    SELECT array_agg(DISTINCT unnested) INTO resolved_recipient_ids FROM unnest(resolved_recipient_ids) as unnested;

    -- Insert the notification
    INSERT INTO notifications (title, body, sender_type, sender_id, recipient_type, recipient_ids, owner_id, status, sent_at)
    VALUES (title, body, sender_type, current_user_id, recipient_type, recipient_ids, owner_id, 'sent', NOW())
    RETURNING id INTO notification_id;

    -- Insert the recipients
    INSERT INTO notification_recipients (notification_id, recipient_id, delivered_at)
    SELECT notification_id, recipient_id, NOW()
    FROM unnest(resolved_recipient_ids) AS recipient_id;

    -- Simple rate limiting for broadcasts (placeholder)
    -- In a real implementation, this would involve checking timestamps of previous broadcasts.
    IF recipient_type IN ('all_owners', 'all_players') THEN
        -- e.g., UPDATE some_table SET last_broadcast_at = NOW() WHERE user_id = current_user_id;
    END IF;

    RETURN notification_id;
END;
$$;
