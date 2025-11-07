create or replace function get_frequently_booked_venues(p_user_id uuid)
returns table (venue_id uuid, booking_count bigint) as $$
begin
  return query
  select
    f.venue_id,
    count(b.booking_id) as booking_count
  from
    bookings b
    join facilities f on b.facility_id = f.facility_id
  where
    b.user_id = p_user_id
  group by
    f.venue_id
  order by
    booking_count desc
  limit 4;
end;$$ language plpgsql;