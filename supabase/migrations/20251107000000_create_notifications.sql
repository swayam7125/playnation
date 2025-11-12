-- Create the visits table if it doesn't exist
CREATE TABLE IF NOT EXISTS visits (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    player_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    venue_id BIGINT,
    visited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(player_id, owner_id, venue_id)
);

COMMENT ON TABLE visits IS 'Tracks player visits to venues, used for targeted notifications by owners.';

-- Create the notifications table
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('admin', 'owner', 'system')),
    sender_id UUID REFERENCES auth.users(id),
    recipient_type TEXT NOT NULL CHECK (recipient_type IN ('player', 'owner', 'all_owners', 'all_players', 'visitors')),
    recipient_ids UUID[],
    owner_id UUID, -- For 'visitors' recipient_type
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    CONSTRAINT sender_id_fk FOREIGN KEY (sender_id) REFERENCES auth.users(id)
);

COMMENT ON TABLE notifications IS 'Stores notification messages sent by admins, owners, or the system.';

-- Create the notification_recipients table
CREATE TABLE notification_recipients (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    notification_id BIGINT NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(notification_id, recipient_id)
);

COMMENT ON TABLE notification_recipients IS 'Tracks the delivery and read status of notifications for each recipient.';

-- Add indexes for performance
CREATE INDEX idx_notifications_sender ON notifications(sender_type, sender_id);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_type, owner_id);
CREATE INDEX idx_notification_recipients_recipient_id ON notification_recipients(recipient_id);
CREATE INDEX idx_visits_player_owner ON visits(player_id, owner_id);

-- Seed data for visits
INSERT INTO visits (player_id, owner_id, venue_id, visited_at)
SELECT 
    p.id as player_id,
    o.id as owner_id,
    1 as venue_id, -- Assuming a venue_id for simplicity
    NOW() - (INTERVAL '1 day' * floor(random() * 30))
FROM 
    auth.users p, auth.users o
WHERE 
    p.raw_user_meta_data->>'role' = 'player' AND
    o.raw_user_meta_data->>'role' = 'owner' AND
    random() < 0.5 -- 50% chance of a player visiting an owner's venue
ON CONFLICT (player_id, owner_id, venue_id) DO NOTHING;

-- Rollback instructions
-- To rollback this migration, you can run the following SQL:
-- DROP TABLE IF EXISTS notification_recipients;
-- DROP TABLE IF EXISTS notifications;
-- DROP TABLE IF EXISTS visits;
