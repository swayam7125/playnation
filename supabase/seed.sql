-- Seed data for the PlayNation application
--
-- This is a sample seed file. You should review and adapt it to your actual schema.
-- It's recommended to use the actual UUIDs of your test users from the auth.users table.
-- You can get them from the Supabase dashboard.
-- Replace the placeholder UUIDs below with your actual test user UUIDs.

-- Seed data for profiles
-- Assuming a 'profiles' table linked to 'auth.users'
INSERT INTO public.profiles (id, username, avatar_url) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'John Doe', 'https://i.pravatar.cc/150?u=a1b2c3d4-e5f6-7890-1234-567890abcdef'),
('b2c3d4e5-f6a7-8901-2345-67890abcdef0', 'Jane Smith', 'https://i.pravatar.cc/150?u=b2c3d4e5-f6a7-8901-2345-67890abcdef0');

-- Seed data for sports
-- Assuming a 'sports' table with 'name'
INSERT INTO public.sports (name) VALUES
('Football'),
('Basketball'),
('Tennis');

-- Seed data for venues
-- Assuming a 'venues' table with at least these columns
-- Replace the owner_id with the UUID of a test user.
INSERT INTO public.venues (name, address, description, owner_id) VALUES
('Greenfield Stadium', '123 Main St, Anytown, USA', 'A beautiful stadium for football and other sports.', 'a1b2c3d4-e5f6-7890-1234-567890abcdef'),
('City Sports Arena', '456 Oak Ave, Anytown, USA', 'A modern arena for basketball and indoor sports.', 'b2c3d4e5-f6a7-8901-2345-67890abcdef0');

-- Seed data for reviews
-- Assuming a 'reviews' table with these columns.
-- You might need to adjust the venue_id and user_id based on the actual IDs created above.
INSERT INTO public.reviews (venue_id, user_id, rating, comment) VALUES
(1, 'a1b2c3d4-e5f6-7890-1234-567890abcdef', 5, 'Great place! Well maintained and friendly staff.'),
(1, 'b2c3d4e5-f6a7-8901-2345-67890abcdef0', 4, 'Good facilities, but can get crowded on weekends.'),
(2, 'a1b2c3d4-e5f6-7890-1234-567890abcdef', 4, 'Nice indoor arena. The court is in excellent condition.');

