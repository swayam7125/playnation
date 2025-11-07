--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: booking_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.booking_status_enum AS ENUM (
    'confirmed',
    'cancelled',
    'completed'
);


--
-- Name: payment_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payment_status_enum AS ENUM (
    'paid',
    'pending',
    'failed',
    'refunded'
);


--
-- Name: cancel_booking_and_notify_admin(uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.cancel_booking_and_notify_admin(p_booking_id uuid, p_user_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    booking_record public.bookings;
    facility_record public.facilities;
BEGIN
    SELECT * INTO booking_record
    FROM public.bookings
    WHERE booking_id = p_booking_id
      AND user_id = p_user_id
      AND status = 'confirmed'::public.booking_status_enum; -- <--- FIX

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Booking not found or not owned by user.';
    END IF;

    IF booking_record.start_time < NOW() THEN
        RAISE EXCEPTION 'Cancellation not allowed for past bookings.';
    END IF;

    UPDATE public.bookings
    SET status = 'cancelled'::public.booking_status_enum,         -- <--- FIX
        payment_status = 'pending_refund'::public.payment_status_enum, -- <--- FIX
        cancelled_by = p_user_id
    WHERE booking_id = p_booking_id;

    UPDATE public.time_slots
    SET is_available = true
    WHERE slot_id = booking_record.slot_id;
    
    SELECT * INTO facility_record
    FROM public.facilities
    WHERE facility_id = booking_record.facility_id;

    INSERT INTO public.admin_notifications (type, message, data)
    VALUES (
        'booking_cancellation',
        'A booking has been cancelled by a user.',
        jsonb_build_object(
            'booking_id', p_booking_id,
            'venue_name', (SELECT name FROM public.venues WHERE venue_id = facility_record.venue_id),
            'facility_name', facility_record.name,
            'user_id', p_user_id
        )
    );
END;
$$;


--
-- Name: cancel_booking_transaction(uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.cancel_booking_transaction(p_booking_id uuid, p_user_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_slot_id UUID;
    v_booking_status public.booking_status_enum; -- <--- FIX: Use ENUM type
BEGIN
    SELECT slot_id, status INTO v_slot_id, v_booking_status
    FROM public.bookings
    WHERE booking_id = p_booking_id AND user_id = p_user_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Booking not found or not owned by the user.';
    END IF;

    IF v_booking_status = 'cancelled'::public.booking_status_enum THEN -- <--- FIX
        RAISE EXCEPTION 'Booking is already cancelled.';
    END IF;

    UPDATE public.bookings
    SET
        status = 'cancelled'::public.booking_status_enum, -- <--- FIX
        payment_status = 'paid'::public.payment_status_enum, -- <--- FIX
        cancelled_by = p_user_id,
        cancellation_reason = 'Cancelled by user',
        cancelled_at = NOW()
    WHERE
        booking_id = p_booking_id;

    UPDATE public.time_slots
    SET is_available = TRUE
    WHERE slot_id = v_slot_id;

END;$$;


--
-- Name: cancel_booking_transaction(uuid, uuid, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.cancel_booking_transaction(p_booking_id uuid, p_user_id uuid, p_cancellation_reason text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_slot_id UUID;
    v_status public.booking_status_enum; -- <--- FIX: Use ENUM type
BEGIN
    SELECT slot_id, status INTO v_slot_id, v_status
    FROM bookings
    WHERE booking_id = p_booking_id AND user_id = p_user_id;

    IF v_slot_id IS NULL THEN
        RAISE EXCEPTION 'Booking not found or not owned by user.';
    END IF;

    IF v_status <> 'confirmed'::public.booking_status_enum THEN -- <--- FIX
        RAISE EXCEPTION 'Booking is already cancelled or has failed.';
    END IF;

    UPDATE bookings
    SET 
        status = 'cancelled'::public.booking_status_enum, -- <--- FIX
        cancellation_reason = p_cancellation_reason,
        cancelled_at = now(),
        cancelled_by = p_user_id
    WHERE booking_id = p_booking_id;
    
END;
$$;


--
-- Name: create_booking_for_user(uuid, uuid, uuid, numeric); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_booking_for_user(p_user_id uuid, p_facility_id uuid, p_slot_id uuid, p_total_amount numeric) RETURNS TABLE(booking_id uuid, status text, message text)
    LANGUAGE plpgsql
    AS $$DECLARE
  new_booking_id UUID;
  v_slot_available BOOLEAN;
BEGIN
  -- Lock the time_slots table to prevent race conditions
  LOCK TABLE time_slots IN ROW EXCLUSIVE MODE;

  -- Check if the slot is available
  SELECT is_available INTO v_slot_available
  FROM time_slots
  WHERE slot_id = p_slot_id;

  IF NOT v_slot_available THEN
    RETURN QUERY SELECT NULL::UUID, 'error'::TEXT, 'This slot has just been taken.'::TEXT;
    RETURN;
  END IF;

  -- Update the slot to be unavailable
  UPDATE time_slots
  SET is_available = FALSE
  WHERE slot_id = p_slot_id;

  -- Insert the booking
  INSERT INTO bookings (user_id, facility_id, slot_id, total_amount, payment_status, status)
  VALUES (p_user_id, p_facility_id, p_slot_id, p_total_amount, 'paid', 'confirmed')
  RETURNING bookings.booking_id INTO new_booking_id;

  RETURN QUERY SELECT new_booking_id, 'success'::TEXT, 'Booking created successfully.'::TEXT;
END;$$;


--
-- Name: get_admin_dashboard_all_data(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_admin_dashboard_all_data() RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_stats jsonb;
    v_booking_trend jsonb;
    v_user_roles jsonb;
    v_top_venues jsonb;
    v_top_users jsonb;
    v_recent_bookings jsonb;
    v_recent_users jsonb;
    v_recent_venues jsonb;
BEGIN
    -- 1. KPI Stats
    SELECT jsonb_build_object(
        'total_users', COALESCE((SELECT COUNT(*) FROM public.users), 0),
        'total_venues', COALESCE((SELECT COUNT(*) FROM public.venues), 0),
        'total_bookings', COALESCE((SELECT COUNT(*) FROM public.bookings), 0),
        'total_revenue', COALESCE((SELECT SUM(total_amount) FROM public.bookings WHERE payment_status = 'paid'), 0),
        'new_users', COALESCE((SELECT COUNT(*) FROM public.users WHERE registration_date >= (NOW() - INTERVAL '30 days')), 0)
    ) INTO v_stats;

    -- 2. Booking Trend (Last 30 days)
    SELECT jsonb_agg(sub)
    INTO v_booking_trend
    FROM (
        SELECT
            to_char(date_series, 'YYYY-MM-DD') AS date,
            COALESCE(count(b.booking_id), 0) AS count -- <--- FIX
        FROM generate_series(
            CURRENT_DATE - INTERVAL '29 days',
            CURRENT_DATE,
            '1 day'
        ) AS date_series
        LEFT JOIN public.bookings b ON b.created_at::date = date_series
        GROUP BY date_series
        ORDER BY date_series
    ) sub;

    -- 3. User Role Distribution
    SELECT jsonb_agg(jsonb_build_object('name', role, 'value', count))
    INTO v_user_roles
    FROM (
        SELECT role, COUNT(*) AS count
        FROM public.users
        GROUP BY role
    ) sub;

    -- 4. Top Venues
    SELECT jsonb_agg(sub)
    INTO v_top_venues
    FROM (
        SELECT v.venue_id, v.name, COUNT(b.booking_id) AS booking_count -- <--- FIX
        FROM public.bookings b
        JOIN public.facilities f ON b.facility_id = f.facility_id
        JOIN public.venues v ON f.venue_id = v.venue_id
        GROUP BY v.venue_id, v.name
        ORDER BY booking_count DESC
        LIMIT 5
    ) sub;

    -- 5. Top Users
    SELECT jsonb_agg(sub)
    INTO v_top_users
    FROM (
        SELECT u.user_id, u.username, COUNT(b.booking_id) AS booking_count -- <--- FIX
        FROM public.bookings b
        JOIN public.users u ON b.user_id = u.user_id
        GROUP BY u.user_id, u.username
        ORDER BY booking_count DESC
        LIMIT 5
    ) sub;

    -- 6. Recent Bookings
    SELECT jsonb_agg(sub)
    INTO v_recent_bookings
    FROM (
        SELECT b.booking_id, v.name AS venue_name, b.start_time -- <--- FIX
        FROM public.bookings b
        JOIN public.facilities f ON b.facility_id = f.facility_id
        JOIN public.venues v ON f.venue_id = v.venue_id
        ORDER BY b.created_at DESC
        LIMIT 5
    ) sub;
    
    -- 7. Recent Users
    SELECT jsonb_agg(sub)
    INTO v_recent_users
    FROM (
        SELECT user_id, username, registration_date
        FROM public.users
        ORDER BY registration_date DESC
        LIMIT 5
    ) sub;

    -- 8. Recent Venues
    SELECT jsonb_agg(sub)
    INTO v_recent_venues
    FROM (
        SELECT venue_id, name, created_at
        FROM public.venues
        ORDER BY created_at DESC
        LIMIT 5
    ) sub;

    -- Combine all JSON into one
    RETURN jsonb_build_object(
        'stats', v_stats,
        'booking_trend', COALESCE(v_booking_trend, '[]'::jsonb),
        'user_roles', COALESCE(v_user_roles, '[]'::jsonb),
        'top_venues', COALESCE(v_top_venues, '[]'::jsonb),
        'top_users', COALESCE(v_top_users, '[]'::jsonb),
        'recent_bookings', COALESCE(v_recent_bookings, '[]'::jsonb),
        'recent_users', COALESCE(v_recent_users, '[]'::jsonb),
        'recent_venues', COALESCE(v_recent_venues, '[]'::jsonb)
    );
END;
$$;


--
-- Name: get_explore_page_venues(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_explore_page_venues() RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
DECLARE
    result_json jsonb;
BEGIN
    SELECT 
        jsonb_agg(
            jsonb_build_object(
                'venue_id', v.venue_id,
                'name', v.name,
                'address', v.address,
                'city', v.city,
                'description', v.description,
                'image_url', v.image_url,
                'created_at', v.created_at,
                'avg_rating', v.avg_rating,     -- Includes the rating
                'review_count', v.review_count, -- Includes the count
                'facilities', f.facilities      -- Includes the facilities
            )
        )
    INTO result_json
    FROM 
        public.venues_with_ratings v -- This view respects your RLS policies
    LEFT JOIN (
        -- This subquery aggregates facilities for each venue
        SELECT
            f_inner.venue_id,
            jsonb_agg(
                jsonb_build_object(
                    'facility_id', f_inner.facility_id,
                    'name', f_inner.name,
                    'sport_id', f_inner.sport_id,
                    'hourly_rate', f_inner.hourly_rate,
                    'sports', s, -- Nests the sports record
                    'facility_amenities', fa.amenities_json
                )
            ) AS facilities
        FROM public.facilities f_inner
        LEFT JOIN public.sports s ON f_inner.sport_id = s.sport_id
        LEFT JOIN (
            SELECT
                fa_inner.facility_id,
                -- Gets amenity names as a JSON array
                jsonb_agg(a.name) AS amenities_json 
            FROM public.facility_amenities fa_inner
            LEFT JOIN public.amenities a ON fa_inner.amenity_id = a.amenity_id
            GROUP BY fa_inner.facility_id
        ) fa ON f_inner.facility_id = fa.facility_id
        GROUP BY f_inner.venue_id
    ) f ON v.venue_id = f.venue_id
    
    -- --- FIX ---
    -- RLS policies will handle the filtering, so we don't
    -- need an explicit 'is_approved' check here,
    -- but your RLS *must* be correct for this to work.
    -- The v.is_suspended check has been removed.
    WHERE
        v.is_approved = true;
    -- --- END FIX ---

    RETURN result_json;
END;
$$;


--
-- Name: get_favorite_venues(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_favorite_venues(p_user_id uuid) RETURNS TABLE(venue_id uuid, name character varying, booking_count bigint)
    LANGUAGE sql
    AS $$
  SELECT
    v.venue_id,
    v.name,
    COUNT(b.booking_id) AS booking_count
  FROM
    public.bookings b
    JOIN public.facilities f ON b.facility_id = f.facility_id
    JOIN public.venues v ON f.venue_id = v.venue_id
  WHERE
    b.user_id = p_user_id
    AND b.status = 'confirmed' -- Only count successful bookings
    AND b.start_time < NOW()    -- Only count past bookings
  GROUP BY
    v.venue_id, v.name
  ORDER BY
    booking_count DESC, v.name ASC
  LIMIT 3; -- Get the top 3
$$;


--
-- Name: get_frequently_booked_venues(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_frequently_booked_venues(p_user_id uuid) RETURNS TABLE(venue_id uuid, booking_count bigint)
    LANGUAGE plpgsql
    AS $$
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
end;$$;


--
-- Name: get_invoice_details(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_invoice_details(p_booking_id uuid) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
     DECLARE
       invoice_data json;
     BEGIN
       SELECT json_build_object(
          'booking', row_to_json(b.*),
          'player', json_build_object(
              'first_name', u.first_name,
              'last_name', u.last_name,
              'email', u.email,
              'phone', u.phone_number
          ),
          'venue', row_to_json(v.*),
          'facility', row_to_json(f.*)
      )
      INTO invoice_data
      FROM
        bookings b
        JOIN users u ON b.user_id = u.id
        JOIN facilities f ON b.facility_id = f.facility_id
        JOIN venues v ON f.venue_id = v.venue_id
      WHERE
        b.booking_id = p_booking_id
        -- CRITICAL SECURITY CHECK:
        -- This ensures the person calling the function owns the booking.      
        AND b.user_id = auth.uid();
   
      RETURN invoice_data;
    END;
   $$;


--
-- Name: get_my_role(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_my_role() RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
     BEGIN
       RETURN (
        SELECT role
        FROM public.users
        WHERE user_id = auth.uid()
      );
    END;
    $$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: venues; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.venues (
    venue_id uuid DEFAULT gen_random_uuid() NOT NULL,
    owner_id uuid,
    name character varying(100) NOT NULL,
    address character varying(255) NOT NULL,
    city character varying(100) NOT NULL,
    state character varying(100),
    zip_code character varying(10),
    description text,
    contact_email character varying(100),
    contact_phone character varying(20),
    latitude numeric(9,6),
    longitude numeric(9,6),
    opening_time time without time zone,
    closing_time time without time zone,
    is_approved boolean DEFAULT false,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    image_url text[],
    rejection_reason text,
    booking_window_days integer DEFAULT 7,
    google_maps_url text,
    cancellation_cutoff_hours integer DEFAULT 24,
    cancellation_fee_percentage numeric(3,2) DEFAULT 0.00
);


--
-- Name: get_my_venues(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_my_venues() RETURNS SETOF public.venues
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY 
  SELECT * FROM public.venues
  WHERE owner_id = auth.uid();
END;
$$;


--
-- Name: get_my_venues_with_images(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_my_venues_with_images() RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  result json;
BEGIN
  SELECT json_agg(t)
  INTO result
  FROM (
    -- The only change is replacing SELECT * with an explicit list of all columns
    SELECT
      venue_id,
      owner_id,
      name,
      address,
      city,
      state,
      zip_code,
      description,
      contact_email,
      contact_phone,
      latitude,
      longitude,
      opening_time,
      closing_time,
      is_approved,
      created_at,
      updated_at,
      image_url -- Explicitly selecting the missing column
    FROM public.venues
    WHERE owner_id = auth.uid()
  ) t;
  RETURN result;
END;
$$;


--
-- Name: get_owner_dashboard_all_stats(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_owner_dashboard_all_stats() RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  result json;
  current_owner_id uuid := auth.uid();
  six_months_ago date := date_trunc('month', CURRENT_DATE) - interval '6 month';
BEGIN

  -- 1. Get all venues & facilities for the current owner
  WITH owner_venues AS (
    SELECT venue_id FROM venues WHERE owner_id = current_owner_id
  ),
  owner_facilities AS (
    SELECT facility_id, venue_id, sport_id FROM facilities 
    WHERE venue_id IN (SELECT venue_id FROM owner_venues)
  ),
  
  -- 2. Get all relevant bookings (confirmed or completed)
  all_bookings AS (
    SELECT
      b.total_amount,
      b.start_time,
      f.facility_id,
      f.venue_id,
      COALESCE(s.name, 'Unknown') as sport_name
    FROM bookings b
    JOIN owner_facilities f ON b.facility_id = f.facility_id
    LEFT JOIN sports s ON f.sport_id = s.sport_id
    WHERE b.status IN ('confirmed', 'completed')
  ),
  
  -- 3. Pre-calculate chart data
  revenue_trend_6mo AS (
    SELECT
      date_trunc('month', start_time)::date as month,
      SUM(total_amount) as revenue
    FROM all_bookings
    WHERE start_time >= six_months_ago
    GROUP BY 1
  ),
  peak_hours_alltime AS (
    SELECT
      TO_CHAR(start_time, 'HH24:MI') as name, -- Format as 'HH24:MI' for the chart
      COUNT(*) as bookings
    FROM all_bookings
    GROUP BY 1
  ),
  sport_distribution_alltime AS (
    SELECT
      sport_name as name, -- Use 'name' to match the chart's dataKey
      COUNT(*) as bookings
    FROM all_bookings
    GROUP BY 1
  )

  -- 4. Build the final JSON object (matching original stats)
  SELECT json_build_object(
    -- KPIs for the original cards
    'todays_revenue', (SELECT COALESCE(SUM(total_amount), 0) FROM all_bookings WHERE start_time::date = CURRENT_DATE),
    'todays_bookings', (SELECT COUNT(*) FROM all_bookings WHERE start_time::date = CURRENT_DATE),
    'upcoming_bookings', (SELECT COUNT(*) FROM all_bookings WHERE start_time > NOW()),
    'total_revenue', (SELECT COALESCE(SUM(total_amount), 0) FROM all_bookings),
    'total_bookings', (SELECT COUNT(*) FROM all_bookings),

    -- Chart: 6-Month Revenue Trend (matching original)
    'revenue_trend', (
      SELECT COALESCE(json_agg(json_build_object('month', TO_CHAR(month, 'YYYY-MM'), 'revenue', revenue) ORDER BY month), '[]')
      FROM revenue_trend_6mo
    ),
    
    -- Chart: Peak Hours (matching original)
    'peak_hours', (
      SELECT COALESCE(json_agg(json_build_object('name', name, 'bookings', bookings) ORDER BY bookings DESC), '[]')
      FROM peak_hours_alltime
    ),
    
    -- Chart: Sport Distribution (matching original)
    'sport_distribution', (
      SELECT COALESCE(json_agg(json_build_object('name', name, 'bookings', bookings) ORDER BY bookings DESC), '[]')
      FROM sport_distribution_alltime
    )
  )
  INTO result;
  
  RETURN result;
END;
$$;


--
-- Name: get_owner_dashboard_statistics(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_owner_dashboard_statistics(days_to_track integer DEFAULT 30) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  result json;
  current_owner_id uuid := auth.uid();
  last_month_start date := date_trunc('month', CURRENT_DATE) - interval '1 month';
  last_month_end date := date_trunc('month', CURRENT_DATE) - interval '1 day';
  current_month_start date := date_trunc('month', CURRENT_DATE);
  timeframe_start date := CURRENT_DATE - (days_to_track - 1 || ' days')::interval;
BEGIN
  WITH owner_bookings AS (
    SELECT
      b.total_amount,
      b.start_time,
      f.name as facility_name,
      COALESCE(s.name, 'Unknown') as sport_name
    FROM public.bookings b
    JOIN public.facilities f ON b.facility_id = f.facility_id
    JOIN public.venues v ON f.venue_id = v.venue_id
    LEFT JOIN public.sports s ON f.sport_id = s.sport_id
    WHERE v.owner_id = current_owner_id
      -- FIXED: Filter only for confirmed or completed bookings for accurate stats.
      AND b.status IN ('confirmed'::public.booking_status_enum, 'completed'::public.booking_status_enum)
  ),
  daily_revenue AS (
    SELECT
      date_trunc('day', start_time)::date as day,
      SUM(total_amount) as daily_revenue
    FROM owner_bookings
    WHERE start_time >= timeframe_start
    GROUP BY 1
  ),
  date_series AS (
    SELECT generate_series(timeframe_start, CURRENT_DATE, '1 day'::interval)::date as day
  )
  SELECT json_build_object(
    'todays_revenue', (SELECT COALESCE(SUM(total_amount), 0) FROM owner_bookings WHERE start_time::date = CURRENT_DATE),
    'monthly_revenue', (SELECT COALESCE(SUM(total_amount), 0) FROM owner_bookings WHERE start_time >= current_month_start),
    'total_revenue', (SELECT COALESCE(SUM(total_amount), 0) FROM owner_bookings),
    'todays_bookings', (SELECT COUNT(*) FROM owner_bookings WHERE start_time::date = CURRENT_DATE),
    'upcoming_bookings', (SELECT COUNT(*) FROM owner_bookings WHERE start_time > NOW()),
    'revenue_by_facility', (SELECT COALESCE(json_agg(json_build_object('name', facility_name, 'revenue', total_revenue) ORDER BY total_revenue DESC), '[]') FROM (SELECT facility_name, SUM(total_amount) as total_revenue FROM owner_bookings GROUP BY facility_name) as fr),
    'peak_booking_hours', (SELECT COALESCE(json_agg(json_build_object('hour', TO_CHAR(TO_TIMESTAMP(hour * 3600), 'HH24:MI'), 'bookings', count, 'hourNum', hour) ORDER BY count DESC, hour ASC), '[]') FROM (SELECT EXTRACT(hour FROM start_time) as hour, COUNT(*) as count FROM owner_bookings GROUP BY hour) as hb),
    'most_popular_sport', (SELECT sport_name FROM owner_bookings GROUP BY sport_name ORDER BY COUNT(*) DESC LIMIT 1),
    'mom_revenue_growth', (SELECT CASE WHEN (SELECT SUM(total_amount) FROM owner_bookings WHERE start_time BETWEEN last_month_start AND last_month_end) > 0 THEN ROUND((( (SELECT SUM(total_amount) FROM owner_bookings WHERE start_time >= current_month_start) - (SELECT SUM(total_amount) FROM owner_bookings WHERE start_time BETWEEN last_month_start AND last_month_end) ) / (SELECT SUM(total_amount) FROM owner_bookings WHERE start_time BETWEEN last_month_start AND last_month_end) * 100), 2) ELSE 100 END),
    'revenue_trend', (SELECT COALESCE(json_agg(json_build_object('date', TO_CHAR(ds.day, 'YYYY-MM-DD'), 'revenue', COALESCE(dr.daily_revenue, 0)) ORDER BY ds.day), '[]') FROM date_series ds LEFT JOIN daily_revenue dr ON ds.day = dr.day),
    'sport_distribution', (SELECT COALESCE(json_agg(json_build_object('name', sport_name, 'bookings', total_bookings)), '[]') FROM (SELECT sport_name, COUNT(*) as total_bookings FROM owner_bookings GROUP BY sport_name) as sd)
  )
  INTO result;
  RETURN result;
END;
$$;


--
-- Name: get_owner_dashboard_statistics(integer, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_owner_dashboard_statistics(days_to_track integer, p_owner_id uuid) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  result json;
  last_month_start date := date_trunc('month', CURRENT_DATE) - interval '1 month';
  last_month_end date := date_trunc('month', CURRENT_DATE) - interval '1 day';
  current_month_start date := date_trunc('month', CURRENT_DATE);
  timeframe_start date := CURRENT_DATE - (days_to_track - 1 || ' days')::interval;
BEGIN
  
  -- CRITICAL CTE: Filters by Owner AND Status
  WITH owner_bookings AS (
    SELECT
      b.total_amount,
      ts.start_time,
      f.name as facility_name,
      COALESCE(s.name, 'Unknown') as sport_name
    FROM public.bookings b
    JOIN public.time_slots ts ON b.slot_id = ts.slot_id
    JOIN public.facilities f ON ts.facility_id = f.facility_id
    JOIN public.venues v ON f.venue_id = v.venue_id
    LEFT JOIN public.sports s ON f.sport_id = s.sport_id
    WHERE 
      v.owner_id = p_owner_id -- Filter by Owner ID (Fix #1)
      AND b.status = 'confirmed'::public.booking_status_enum -- Filter by Confirmed Status (Fix #2)
      -- Optional: AND b.payment_status IN ('paid'::public.payment_status_enum, 'completed'::public.payment_status_enum)
  ),
  daily_revenue AS (
    SELECT
      date_trunc('day', start_time)::date as day,
      SUM(total_amount) as daily_revenue
    FROM owner_bookings
    WHERE start_time >= timeframe_start
    GROUP BY 1
  ),
  date_series AS (
    SELECT generate_series(timeframe_start, CURRENT_DATE, '1 day'::interval)::date as day
  )
  SELECT json_build_object(
    -- KPI Calculations (now guaranteed to use filtered bookings):
    'todays_revenue', (SELECT COALESCE(SUM(total_amount), 0) FROM owner_bookings WHERE start_time::date = CURRENT_DATE),
    'monthly_revenue', (SELECT COALESCE(SUM(total_amount), 0) FROM owner_bookings WHERE start_time >= current_month_start),
    'total_revenue', (SELECT COALESCE(SUM(total_amount), 0) FROM owner_bookings),
    'todays_bookings', (SELECT COUNT(*) FROM owner_bookings WHERE start_time::date = CURRENT_DATE),
    'upcoming_bookings', (SELECT COUNT(*) FROM owner_bookings WHERE start_time > NOW()),
    
    -- Chart/Detail Calculations (using filtered owner_bookings CTE):
    'revenue_by_facility', (SELECT COALESCE(json_agg(json_build_object('name', facility_name, 'revenue', total_revenue) ORDER BY total_revenue DESC), '[]') FROM (SELECT facility_name, SUM(total_amount) as total_revenue FROM owner_bookings GROUP BY facility_name) as fr),
    'peak_booking_hours', (SELECT COALESCE(json_agg(json_build_object('hour', TO_CHAR(TO_TIMESTAMP(hour * 3600), 'HH24:MI'), 'bookings', count, 'hourNum', hour) ORDER BY count DESC, hourNum ASC), '[]') FROM (SELECT EXTRACT(hour FROM start_time) as hour, COUNT(*) as count FROM owner_bookings WHERE start_time::date = CURRENT_DATE GROUP BY hour) as hb),
    'most_popular_sport', (SELECT sport_name FROM owner_bookings GROUP BY sport_name ORDER BY COUNT(*) DESC LIMIT 1),
    'mom_revenue_growth', (SELECT CASE WHEN (SELECT SUM(total_amount) FROM owner_bookings WHERE start_time BETWEEN last_month_start AND last_month_end) > 0 THEN ROUND((( (SELECT SUM(total_amount) FROM owner_bookings WHERE start_time >= current_month_start) - (SELECT SUM(total_amount) FROM owner_bookings WHERE start_time BETWEEN last_month_start AND last_month_end) ) / (SELECT SUM(total_amount) FROM owner_bookings WHERE start_time BETWEEN last_month_start AND last_month_end) * 100), 2) ELSE 100 END),
    'revenue_trend', (SELECT COALESCE(json_agg(json_build_object('date', TO_CHAR(ds.day, 'YYYY-MM-DD'), 'revenue', COALESCE(dr.daily_revenue, 0)) ORDER BY ds.day), '[]') FROM date_series ds LEFT JOIN daily_revenue dr ON ds.day = dr.day),
    'sport_distribution', (SELECT COALESCE(json_agg(json_build_object('name', sport_name, 'bookings', total_bookings)), '[]') FROM (SELECT sport_name, COUNT(*) as total_bookings FROM owner_bookings GROUP BY sport_name) as sd)
  )
  INTO result;
  RETURN result;
END;
$$;


--
-- Name: get_owner_dashboard_statistics_for_venues(integer, uuid, uuid[]); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_owner_dashboard_statistics_for_venues(days_to_track integer, p_owner_id uuid, p_venue_ids uuid[] DEFAULT NULL::uuid[]) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  result json;
  last_month_start date := date_trunc('month', CURRENT_DATE) - interval '1 month';
  last_month_end date := date_trunc('month', CURRENT_DATE) - interval '1 day';
  current_month_start date := date_trunc('month', CURRENT_DATE);
  timeframe_start date := CURRENT_DATE - (days_to_track - 1 || ' days')::interval;
BEGIN
  
  -- CRITICAL CTE: Filters by Owner, Status, AND optionally Venue IDs
  WITH owner_bookings AS (
    SELECT
      b.total_amount,
      ts.start_time,
      f.name as facility_name,
      COALESCE(s.name, 'Unknown') as sport_name
    FROM public.bookings b
    JOIN public.time_slots ts ON b.slot_id = ts.slot_id
    JOIN public.facilities f ON ts.facility_id = f.facility_id
    JOIN public.venues v ON f.venue_id = v.venue_id
    LEFT JOIN public.sports s ON f.sport_id = s.sport_id
    WHERE 
      v.owner_id = p_owner_id 
      AND b.status = 'confirmed'::public.booking_status_enum 
      AND (p_venue_ids IS NULL OR v.venue_id = ANY(p_venue_ids))
  ),
  
  -- Revenue trend calculation for the specified period (days_to_track)
  daily_revenue AS (
    SELECT
      date_trunc('day', start_time)::date as day,
      SUM(total_amount) as daily_revenue
    FROM owner_bookings
    WHERE start_time::date >= timeframe_start
    GROUP BY 1
  ),
  
  -- Generate date series to ensure all days in the range are included in the trend, even with 0 revenue
  date_series AS (
    SELECT generate_series(timeframe_start, CURRENT_DATE, '1 day'::interval)::date as day
  ),

  -- Calculate Peak Hours for today separately
  hourly_bookings_today AS (
      SELECT 
          date_trunc('hour', start_time) as hour_start, 
          COUNT(*) as count 
      FROM owner_bookings 
      WHERE start_time::date = CURRENT_DATE 
      GROUP BY 1
  ),

  -- Calculate Sport Distribution for today separately
  sport_distribution_today AS (
      SELECT 
          sport_name, 
          COUNT(*) as total_bookings
      FROM owner_bookings 
      WHERE start_time::date = CURRENT_DATE 
      GROUP BY sport_name
  )
  
  SELECT json_build_object(
    -- KPI Calculations
    'todays_revenue', (SELECT COALESCE(SUM(total_amount), 0) FROM owner_bookings WHERE start_time::date = CURRENT_DATE),
    'monthly_revenue', (SELECT COALESCE(SUM(total_amount), 0) FROM owner_bookings WHERE start_time >= current_month_start),
    'total_revenue', (SELECT COALESCE(SUM(total_amount), 0) FROM owner_bookings),
    'todays_bookings', (SELECT COUNT(*) FROM owner_bookings WHERE start_time::date = CURRENT_DATE),
    'upcoming_bookings', (SELECT COUNT(*) FROM owner_bookings WHERE start_time > NOW()),
    
    -- Chart/Detail Calculations
    -- Revenue by facility (for TODAY, as per dashboard needs)
    'revenue_by_facility', (SELECT COALESCE(json_agg(json_build_object('name', facility_name, 'revenue', total_revenue) ORDER BY total_revenue DESC), '[]') FROM (SELECT facility_name, SUM(total_amount) as total_revenue FROM owner_bookings WHERE start_time::date = CURRENT_DATE GROUP BY facility_name) as fr),
    
    -- Peak Hours (for today) - Using the dedicated CTE
    'peak_booking_hours', (
        SELECT COALESCE(json_agg(json_build_object(
            'hour', TO_CHAR(hb.hour_start, 'HH24:MI'), 
            'bookings', hb.count, 
            'hourNum', EXTRACT(hour FROM hb.hour_start)) 
        ORDER BY hb.count DESC, hb.hour_start ASC), '[]') 
        FROM hourly_bookings_today hb
    ),
                            
    -- Most Popular Sport (for today's distribution)
    'most_popular_sport', (SELECT COALESCE(sport_name, 'N/A') FROM sport_distribution_today ORDER BY total_bookings DESC LIMIT 1),
    
    -- MoM Revenue Growth (based on fixed calendar month logic)
    'mom_revenue_growth', (SELECT CASE WHEN (SELECT COALESCE(SUM(total_amount), 0) FROM owner_bookings WHERE start_time BETWEEN last_month_start AND last_month_end) > 0 
                                     THEN ROUND((( (SELECT SUM(total_amount) FROM owner_bookings WHERE start_time >= current_month_start) - (SELECT SUM(total_amount) FROM owner_bookings WHERE start_time BETWEEN last_month_start AND last_month_end) ) / (SELECT SUM(total_amount) FROM owner_bookings WHERE start_time BETWEEN last_month_start AND last_month_end) * 100), 2) 
                                     ELSE 100 
                                     END),
    
    -- Revenue Trend (for the specified period - days_to_track)
    'revenue_trend', (SELECT COALESCE(json_agg(json_build_object('date', TO_CHAR(ds.day, 'YYYY-MM-DD'), 'revenue', COALESCE(dr.daily_revenue, 0)) ORDER BY ds.day), '[]') FROM date_series ds LEFT JOIN daily_revenue dr ON ds.day = dr.day),
    
    -- Sport Distribution (for today) - Using the dedicated CTE
    'sport_distribution', (SELECT COALESCE(json_agg(json_build_object('name', sport_name, 'bookings', total_bookings) ORDER BY total_bookings DESC), '[]') 
                           FROM sport_distribution_today)
  )
  INTO result;
  
  RETURN result;
END;
$$;


--
-- Name: get_owner_report_stats(date, date); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_owner_report_stats(p_start_date date, p_end_date date) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  result json;
  current_owner_id uuid := auth.uid();

BEGIN

  WITH owner_venues AS (
    SELECT venue_id, name FROM venues WHERE owner_id = current_owner_id
  ),
  owner_facilities AS (
    SELECT facility_id, venue_id, sport_id FROM facilities 
    WHERE venue_id IN (SELECT venue_id FROM owner_venues)
  ),
  
  bookings_in_range AS (
    SELECT
      b.booking_id,
      b.total_amount,
      b.start_time,
      b.user_id,
      b.facility_id,
      f.venue_id,
      COALESCE(s.name, 'Unknown') as sport_name
    FROM bookings b
    JOIN owner_facilities f ON b.facility_id = f.facility_id
    LEFT JOIN sports s ON f.sport_id = s.sport_id
    WHERE 
      b.status IN ('confirmed', 'completed')
      -- *** FIX FOR ALL-TIME STATS ***
      -- This logic ensures that if p_start_date is NULL, the condition is ignored (returning all bookings).
      AND (p_start_date IS NULL OR b.start_time >= p_start_date)
      -- This logic ensures that if p_end_date is NULL, the condition is ignored.
      -- Otherwise, it includes the entire end day.
      AND (p_end_date IS NULL OR b.start_time < (p_end_date + interval '1 day'))
  ),

  most_booked_facility_in_range AS (
    SELECT
      fac.name as facility_name,
      COUNT(b.booking_id) as bookings_count
    FROM bookings_in_range b
    JOIN facilities fac ON b.facility_id = fac.facility_id
    GROUP BY fac.name
    ORDER BY bookings_count DESC
    LIMIT 1
  ),

  date_series AS (
    SELECT generate_series(p_start_date, p_end_date, '1 day'::interval)::date as day
    WHERE p_start_date IS NOT NULL AND p_end_date IS NOT NULL
  ),
  
  daily_revenue_trend AS (
    SELECT
      date_trunc('day', start_time)::date as day,
      SUM(total_amount) as revenue
    FROM bookings_in_range
    GROUP BY 1
  ),
  
  bookings_by_venue AS (
    SELECT
      v.name,
      v.venue_id,
      COUNT(b.booking_id) as bookings,
      COALESCE(SUM(b.total_amount), 0) as revenue
    FROM bookings_in_range b
    JOIN owner_venues v ON b.venue_id = v.venue_id
    GROUP BY v.venue_id, v.name
  ),

  sport_distribution_period AS (
    SELECT
      sport_name as name,
      COUNT(*) as bookings
    FROM bookings_in_range
    GROUP BY 1
  )
  
  SELECT json_build_object(
    'total_revenue', (SELECT COALESCE(SUM(total_amount), 0) FROM bookings_in_range),
    'total_bookings', (SELECT COUNT(*) FROM bookings_in_range),
    'avg_booking_value', (SELECT COALESCE(AVG(total_amount), 0) FROM bookings_in_range),
    'unique_players', (SELECT COUNT(DISTINCT user_id) FROM bookings_in_range),
    'most_booked_facility', COALESCE((SELECT facility_name FROM most_booked_facility_in_range), 'N/A'),
    
    'revenue_over_time', (
      SELECT COALESCE(json_agg(json_build_object('date', TO_CHAR(ds.day, 'YYYY-MM-DD'), 'revenue', COALESCE(drt.revenue, 0)) ORDER BY ds.day), '[]')
      FROM date_series ds
      LEFT JOIN daily_revenue_trend drt ON ds.day = drt.day
    ),
    
    'bookings_by_venue', (
      SELECT COALESCE(json_agg(vb.* ORDER BY vb.revenue DESC), '[]')
      FROM bookings_by_venue vb
    ),

    'sport_distribution', (
      SELECT COALESCE(json_agg(sdp.* ORDER BY sdp.bookings DESC), '[]')
      FROM sport_distribution_period sdp
    )
  )
  INTO result;
  
  RETURN result;
END;
$$;


--
-- Name: get_owner_report_stats(uuid, date, date); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_owner_report_stats(p_owner_id uuid, p_start_date date, p_end_date date) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
    -- *** THIS IS THE FIX ***
    v_owner_id uuid := p_owner_id; -- Use the parameter, not auth.uid()
    -- *** END OF FIX ***
    
    result_json json;
BEGIN
    WITH 
    owner_venues AS (
      SELECT venue_id, name 
      FROM public.venues 
      WHERE owner_id = v_owner_id
    ),
    
    -- Get bookings within the date range
    bookings_in_range AS (
      SELECT 
        f.venue_id,
        b.total_amount
      FROM public.bookings b
      JOIN public.facilities f ON b.facility_id = f.facility_id
      WHERE f.venue_id IN (SELECT venue_id FROM owner_venues)
        AND b.start_time::date >= p_start_date
        AND b.start_time::date <= p_end_date
        AND b.status IN ('confirmed', 'completed')
    ),
    
    -- Aggregate revenue by venue
    venue_revenue_agg AS (
      SELECT
        ov.venue_id,
        ov.name,
        COUNT(b.venue_id) AS bookings,
        COALESCE(SUM(b.total_amount), 0) AS revenue
      FROM owner_venues ov
      LEFT JOIN bookings_in_range b ON ov.venue_id = b.venue_id
      GROUP BY ov.venue_id, ov.name
    )

    -- Build the final JSON object
    SELECT json_build_object(
        'total_revenue', (SELECT COALESCE(SUM(revenue), 0) FROM venue_revenue_agg),
        'total_bookings', (SELECT COALESCE(SUM(bookings), 0) FROM venue_revenue_agg),
        
        'avg_booking_value', (
            SELECT CASE 
                WHEN SUM(bookings) > 0 THEN SUM(revenue) / SUM(bookings)
                ELSE 0
            END
            FROM venue_revenue_agg
        ),
        
        'venue_revenue', (SELECT COALESCE(json_agg(vra), '[]'::json) FROM venue_revenue_agg vra)
    )
    INTO result_json;
    
    RETURN result_json;
END;
$$;


--
-- Name: get_owner_report_stats(uuid, date, date, uuid[]); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_owner_report_stats(p_owner_id uuid, p_start_date date, p_end_date date, p_venue_ids uuid[] DEFAULT NULL::uuid[]) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
    v_owner_id uuid := p_owner_id;
    result_json json;
BEGIN
    WITH 
    owner_venues AS (
      SELECT venue_id, name 
      FROM public.venues 
      WHERE owner_id = v_owner_id
        -- *** THIS IS THE NEW LOGIC ***
        AND (
          p_venue_ids IS NULL 
          OR venue_id = ANY(p_venue_ids)
        )
        -- *** END OF NEW LOGIC ***
    ),
    
    bookings_in_range AS (
      SELECT 
        f.venue_id,
        b.total_amount
      FROM public.bookings b
      JOIN public.facilities f ON b.facility_id = f.facility_id
      WHERE f.venue_id IN (SELECT venue_id FROM owner_venues)
        AND b.start_time::date >= p_start_date
        AND b.start_time::date <= p_end_date
        AND b.status IN ('confirmed', 'completed')
    ),
    
    venue_revenue_agg AS (
      SELECT
        ov.venue_id,
        ov.name,
        COUNT(b.venue_id) AS bookings,
        COALESCE(SUM(b.total_amount), 0) AS revenue
      FROM owner_venues ov
      LEFT JOIN bookings_in_range b ON ov.venue_id = b.venue_id
      GROUP BY ov.venue_id, ov.name
    )

    SELECT json_build_object(
        'total_revenue', (SELECT COALESCE(SUM(revenue), 0) FROM venue_revenue_agg),
        'total_bookings', (SELECT COALESCE(SUM(bookings), 0) FROM venue_revenue_agg),
        
        'avg_booking_value', (
            SELECT CASE 
                WHEN SUM(bookings) > 0 THEN SUM(revenue) / SUM(bookings)
                ELSE 0
            END
            FROM venue_revenue_agg
        ),
        
        'venue_revenue', (SELECT COALESCE(json_agg(vra), '[]'::json) FROM venue_revenue_agg vra)
    )
    INTO result_json;
    
    RETURN result_json;
END;
$$;


--
-- Name: get_owner_today_dashboard(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_owner_today_dashboard() RETURNS json
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
      DECLARE
          v_owner_id uuid := auth.uid();
          v_today_start timestamptz := DATE_TRUNC('day', NOW() AT TIME ZONE 'Asia/Kolkata');
          v_today_end timestamptz := v_today_start + INTERVAL '1 day';
          result_json json;
     BEGIN
         WITH
         owner_venues AS (
           SELECT venue_id FROM public.venues WHERE owner_id = v_owner_id
         ),
     
         today_bookings AS (
           SELECT b.total_amount, b.start_time, b.user_id
           FROM public.bookings b
           JOIN public.facilities f ON b.facility_id = f.facility_id
           WHERE f.venue_id IN (SELECT venue_id FROM owner_venues)
             AND b.start_time >= v_today_start
             AND b.start_time < v_today_end
             AND b.status IN ('confirmed', 'completed')
         ),
    
         hours AS (
             SELECT generate_series(0, 23) AS hour
         ),
    
         hourly_trend AS (
           SELECT
             h.hour AS hour_of_day,
             COALESCE(SUM(tb.total_amount), 0) AS revenue
           FROM hours h
           LEFT JOIN today_bookings tb ON EXTRACT(HOUR FROM tb.start_time AT TIME ZONE 'Asia/Kolkata') = h.hour
           GROUP BY h.hour
           ORDER BY h.hour
         ),
    
         upcoming_list AS (
           SELECT
             b.booking_id,
             b.start_time,
            (SELECT first_name || ' ' || last_name FROM users WHERE user_id = b.user_id) AS player_name,
             f.name AS facility_name,
             v.name AS venue_name
           FROM public.bookings b
           JOIN public.facilities f ON b.facility_id = f.facility_id
           JOIN public.venues v ON f.venue_id = v.venue_id
           WHERE f.venue_id IN (SELECT venue_id FROM owner_venues)
             AND b.start_time >= NOW()
             AND b.start_time < v_today_end
             AND b.status = 'confirmed'
           ORDER BY b.start_time ASC
           LIMIT 5
         )
    
         SELECT json_build_object(
             'today_revenue', (SELECT COALESCE(SUM(total_amount), 0) FROM today_bookings),
             'today_bookings_count', (SELECT COUNT(*) FROM today_bookings),
             'todays_unique_players', (SELECT COUNT(DISTINCT user_id) FROM today_bookings),
    
             'upcoming_bookings_count_total', (
                 SELECT COUNT(*)
                 FROM public.bookings b
                 JOIN public.facilities f ON b.facility_id = f.facility_id
                 WHERE f.venue_id IN (SELECT venue_id FROM owner_venues)
                   AND b.start_time > NOW()
                   AND b.status = 'confirmed'
             ),
    
             'hourly_revenue_trend', (SELECT COALESCE(json_agg(ht), '[]'::json) FROM hourly_trend ht),
             'upcoming_bookings_list', (SELECT COALESCE(json_agg(ul), '[]'::json) FROM upcoming_list ul),
    
             'today_cancellations', (
                 SELECT COUNT(*)
                 FROM public.bookings b
                 JOIN public.facilities f ON b.facility_id = f.facility_id
                 WHERE f.venue_id IN (SELECT venue_id FROM owner_venues)
                   AND b.status = 'cancelled'
                   AND b.updated_at >= v_today_start
                   AND b.updated_at < v_today_end
             ),
    
             'today_new_reviews', (
                 SELECT COUNT(*)
                 FROM public.reviews r
                 WHERE r.venue_id IN (SELECT venue_id FROM owner_venues)
                   AND r.created_at >= v_today_start
                   AND r.created_at < v_today_end
             )
         )
         INTO result_json;
    
         RETURN result_json;
     END;
    $$;


--
-- Name: get_owner_today_dashboard(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_owner_today_dashboard(p_owner_id uuid) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
    -- *** THIS IS THE FIX ***
    v_owner_id uuid := p_owner_id; -- Use the parameter, not auth.uid()
    -- *** END OF FIX ***
    
    v_today_start timestamptz := DATE_TRUNC('day', NOW() AT TIME ZONE 'Asia/Kolkata');
    v_today_end timestamptz := v_today_start + INTERVAL '1 day';
    result_json json;
BEGIN
    WITH 
    owner_venues AS (
      SELECT venue_id FROM public.venues WHERE owner_id = v_owner_id
    ),
    
    today_bookings AS (
      SELECT b.total_amount, b.start_time
      FROM public.bookings b
      JOIN public.facilities f ON b.facility_id = f.facility_id
      WHERE f.venue_id IN (SELECT venue_id FROM owner_venues)
        AND b.start_time >= v_today_start
        AND b.start_time < v_today_end
        AND b.status IN ('confirmed', 'completed')
    ),

    hours AS (
        SELECT generate_series(0, 23) AS hour
    ),
    
    hourly_trend AS (
      SELECT 
        h.hour AS hour_of_day,
        COALESCE(SUM(tb.total_amount), 0) AS revenue
      FROM hours h
      LEFT JOIN today_bookings tb ON EXTRACT(HOUR FROM tb.start_time AT TIME ZONE 'Asia/Kolkata') = h.hour
      GROUP BY h.hour
      ORDER BY h.hour
    ),

    upcoming_list AS (
      SELECT 
        b.booking_id,
        b.start_time,
        (SELECT first_name || ' ' || last_name FROM users WHERE user_id = b.user_id) AS player_name,
        f.name AS facility_name,
        v.name AS venue_name
      FROM public.bookings b
      JOIN public.facilities f ON b.facility_id = f.facility_id
      JOIN public.venues v ON f.venue_id = v.venue_id
      WHERE f.venue_id IN (SELECT venue_id FROM owner_venues)
        AND b.start_time >= NOW()
        AND b.start_time < v_today_end
        AND b.status = 'confirmed'
      ORDER BY b.start_time ASC
      LIMIT 5
    )

    -- Build the final JSON object
    SELECT json_build_object(
        'today_revenue', (SELECT COALESCE(SUM(total_amount), 0) FROM today_bookings),
        'today_bookings_count', (SELECT COUNT(*) FROM today_bookings),
        
        'upcoming_bookings_count_total', (
            SELECT COUNT(*)
            FROM public.bookings b
            JOIN public.facilities f ON b.facility_id = f.facility_id
            WHERE f.venue_id IN (SELECT venue_id FROM owner_venues)
              AND b.start_time > NOW()
              AND b.status = 'confirmed'
        ),
        
        'hourly_revenue_trend', (SELECT COALESCE(json_agg(ht), '[]'::json) FROM hourly_trend ht),
        'upcoming_bookings_list', (SELECT COALESCE(json_agg(ul), '[]'::json) FROM upcoming_list ul),

        'today_cancellations', (
            SELECT COUNT(*)
            FROM public.bookings b
            JOIN public.facilities f ON b.facility_id = f.facility_id
            WHERE f.venue_id IN (SELECT venue_id FROM owner_venues)
              AND b.status = 'cancelled'
              AND b.updated_at >= v_today_start
              AND b.updated_at < v_today_end
        ),
            
        'today_new_reviews', (
            SELECT COUNT(*)
            FROM public.reviews r
            WHERE r.venue_id IN (SELECT venue_id FROM owner_venues)
              AND r.created_at >= v_today_start
              AND r.created_at < v_today_end
        )
    )
    INTO result_json;
    
    RETURN result_json;
END;
$$;


--
-- Name: get_owner_venues_details(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_owner_venues_details() RETURNS json
    LANGUAGE sql SECURITY DEFINER
    AS $$
  SELECT json_agg(
    json_build_object(
      'venue_id', v.venue_id,
      'name', v.name,
      'address', v.address,
      'city', v.city,
      'image_url', v.image_url, -- This line is crucial.
      'is_approved', v.is_approved,
      'rejection_reason', v.rejection_reason,
      'created_at', v.created_at,
      'facilities', (
        SELECT json_agg(
          json_build_object(
            'facility_id', f.facility_id,
            'name', f.name,
            'hourly_rate', f.hourly_rate,
            'sports', json_build_object('name', s.name),
            'facility_amenities', (
              SELECT json_agg(
                json_build_object('amenities', json_build_object('name', a.name))
              )
              FROM public.facility_amenities fa
              JOIN public.amenities a ON fa.amenity_id = a.amenity_id
              WHERE fa.facility_id = f.facility_id
            )
          )
          ORDER BY f.name ASC
        )
        FROM public.facilities f
        LEFT JOIN public.sports s ON f.sport_id = s.sport_id
        WHERE f.venue_id = v.venue_id
      )
    )
    ORDER BY v.created_at DESC
  )
  FROM public.venues v
  WHERE v.owner_id = auth.uid();
$$;


--
-- Name: get_player_dashboard_stats(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_player_dashboard_stats() RETURNS jsonb
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
DECLARE
    result_json jsonb;
    v_user_id uuid := auth.uid();
BEGIN
    SELECT jsonb_build_object(
        
        'upcoming_bookings_count', (
            SELECT COUNT(*)
            FROM public.bookings
            WHERE user_id = v_user_id
              AND status = 'confirmed'
              AND start_time > NOW()
        ),
        
        'favorite_venues', (
            SELECT jsonb_agg(fav_venues)
            FROM (
                SELECT *
                FROM public.get_favorite_venues(v_user_id)
            ) as fav_venues
        ),
        
        'credit_balance', (
            SELECT credit_balance
            FROM public.users
            WHERE user_id = v_user_id
        ),
        
        'total_bookings_count', (
            SELECT COUNT(*)
            FROM public.bookings
            WHERE user_id = v_user_id
              AND status IN ('confirmed', 'completed')
        ),
        
        'total_spent', (
            SELECT COALESCE(SUM(total_amount), 0)
            FROM public.bookings
            WHERE user_id = v_user_id
              AND status IN ('confirmed', 'completed')
        ),

        'upcoming_bookings_list', (
            SELECT jsonb_agg(upcoming)
            FROM (
                SELECT 
                    b.booking_id,
                    b.start_time,
                    b.total_amount,
                    v.name as venue_name,
                    f.name as facility_name
                FROM 
                    public.bookings b
                JOIN 
                    public.facilities f ON b.facility_id = f.facility_id
                JOIN 
                    public.venues v ON f.venue_id = v.venue_id
                WHERE 
                    b.user_id = v_user_id
                    AND b.status = 'confirmed'
                    AND b.start_time > NOW()
                ORDER BY 
                    b.start_time ASC
                LIMIT 3
            ) as upcoming
        ),

        'most_played_sport', (
            SELECT s.name
            FROM public.bookings b
            JOIN public.facilities f ON b.facility_id = f.facility_id
            JOIN public.sports s ON f.sport_id = s.sport_id
            WHERE b.user_id = v_user_id
              AND b.status IN ('completed', 'confirmed')
            GROUP BY s.name
            ORDER BY COUNT(*) DESC
            LIMIT 1
        )
    )
    INTO result_json;
    
    RETURN result_json;
END;
$$;


--
-- Name: get_public_profiles_for_owner(uuid[]); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_public_profiles_for_owner(user_ids uuid[]) RETURNS TABLE(user_id uuid, username character varying, first_name character varying, last_name character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- SECURITY CHECK: Only allow 'venue_owner' role to proceed
    IF auth.role() <> 'venue_owner' THEN
        RAISE EXCEPTION 'Permission denied. Only venue owners can access this data.';
    END IF;

    -- Perform SELECT only on non-sensitive columns, bypassing the need for a complex RLS bypass.
    RETURN QUERY
    SELECT
        u.user_id,
        u.username,
        u.first_name,
        u.last_name
    FROM public.users u
    WHERE u.user_id = ANY(user_ids);
END;
$$;


--
-- Name: get_slots_for_facility(uuid, date); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_slots_for_facility(p_facility_id uuid, p_date date) RETURNS TABLE(slot_id uuid, start_time timestamp with time zone, end_time timestamp with time zone, price numeric, is_available boolean)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        ts.slot_id,
        ts.start_time,
        ts.end_time,
        COALESCE(ts.price_override, (SELECT hourly_rate FROM facilities WHERE facility_id = p_facility_id)) AS price,
        ts.is_available AND NOT EXISTS (
            SELECT 1
            FROM bookings b
            WHERE b.slot_id = ts.slot_id
              AND DATE(b.start_time) = p_date
              AND b.status IN (
                  'confirmed'::public.booking_status_enum,  -- <--- FIX
                  'completed'::public.booking_status_enum   -- <--- FIX
              )
        ) AS is_available
    FROM
        time_slots ts
    WHERE
        ts.facility_id = p_facility_id
        AND DATE(ts.start_time) = p_date;
END;
$$;


--
-- Name: get_user_role(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_user_role() RETURNS text
    LANGUAGE sql SECURITY DEFINER
    AS $$
  select role from public.users where user_id = auth.uid();
$$;


--
-- Name: get_user_role_claim(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_user_role_claim(p_user_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
    DECLARE
      _role text;
    BEGIN
      -- Select the role column from your public.users table
      SELECT role INTO _role FROM public.users WHERE user_id = p_user_id;

      -- Return the role as a JSON object with the custom claim key 'app_role'
      RETURN jsonb_build_object(
        'app_role', _role
      );
    END;
  $$;


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
    BEGIN
      INSERT INTO public.users (user_id, email, username, first_name, last_name, role, phone_number, registration_date, updated_at)
      VALUES (
        new.id,
        new.email,
        new.raw_user_meta_data->>'username',
        new.raw_user_meta_data->>'first_name',
        new.raw_user_meta_data->>'last_name',
        new.raw_user_meta_data->>'role',
        new.raw_user_meta_data->>'phone_number',
        new.created_at,
        new.updated_at
      );
      RETURN new;
    END;
    $$;


--
-- Name: handle_new_user_username(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user_username() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  -- Check if username is NULL, which it will be on signup
  IF NEW.username IS NULL THEN
    NEW.username := split_part(NEW.email, '@', 1);
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: notify_admin_on_new_booking(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notify_admin_on_new_booking() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_venue_name VARCHAR;
    v_facility_name VARCHAR;
    v_username VARCHAR;
BEGIN
    -- Only proceed if the booking status is 'confirmed'
    IF NEW.status = 'confirmed'::public.booking_status_enum THEN
        
        -- 1. Fetch Venue Name, Facility Name, and Username
        -- Need to join bookings (NEW) -> facilities (f) -> venues (v)
        SELECT
            v.name, f.name, u.username
        INTO
            v_venue_name, v_facility_name, v_username
        FROM public.facilities f
        JOIN public.venues v ON f.venue_id = v.venue_id
        LEFT JOIN public.users u ON NEW.user_id = u.user_id
        WHERE f.facility_id = NEW.facility_id;
        
        -- 2. Insert the notification into the admin_notifications table
        INSERT INTO public.admin_notifications (type, message, data)
        VALUES (
            'new_confirmed_booking',
            -- Create a message for the admin dashboard
            'Booking Confirmed: ' || COALESCE(v_username, 'A Player') || ' booked ' || COALESCE(v_facility_name, 'Unknown Facility') || '.',
            jsonb_build_object(
                'booking_id', NEW.booking_id,
                'venue_name', v_venue_name,
                'facility_name', v_facility_name,
                'total_amount', NEW.total_amount
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$;


--
-- Name: process_booking_refund(uuid, numeric); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.process_booking_refund(booking_id_in uuid, refund_amount_in numeric) RETURNS TABLE(status text, message text)
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Optional: booking_status_check text;
    -- Optional: payment_intent_id text;
BEGIN
    -- 1. **Security Check (Crucial)**: Verify the user calling this function is the owner of the venue associated with the booking.
    --    RAISE EXCEPTION IF NOT authorized...

    -- 2. **State Check**: Ensure the booking is 'cancelled' and 'payment_status' is not already 'refunded'.
    --    SELECT status, payment_intent INTO booking_status_check, payment_intent_id FROM bookings WHERE booking_id = booking_id_in;
    --    RAISE EXCEPTION IF booking_status_check <> 'cancelled' OR payment_status_check = 'refunded'...

    -- 3. **Payment Gateway Integration (External)**: Call a function (e.g., using a webhook or a dedicated Supabase Edge Function) 
    --    to interface with your payment processor (Stripe, Razorpay, etc.) to process the actual refund.
    --    SELECT payment_provider_refund_api(payment_intent_id, refund_amount_in);

    -- 4. **Database Update**: If the payment gateway refund is successful:
    UPDATE bookings
    SET 
        payment_status = 'refunded',
        status = 'refunded', -- Or keep as 'cancelled' and only update payment_status
        refund_processed_at = now()
    WHERE booking_id = booking_id_in;
    
    -- 5. **Return Success**:
    RETURN QUERY SELECT 'refunded'::text, 'Refund successful'::text;

EXCEPTION
    WHEN others THEN
        -- 6. **Return Failure**:
        RETURN QUERY SELECT 'failed'::text, SQLERRM::text;
END;
$$;


--
-- Name: process_refund_by_owner(uuid, uuid, numeric); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.process_refund_by_owner(p_booking_id uuid, p_owner_id uuid, p_refund_amount numeric) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_booking_record public.bookings;
    v_venue_owner_id uuid;
BEGIN
    -- 1. Check if the p_owner_id actually owns the venue for this booking
    SELECT v.owner_id INTO v_venue_owner_id
    FROM public.bookings b
    JOIN public.facilities f ON b.facility_id = f.facility_id
    JOIN public.venues v ON f.venue_id = v.venue_id
    WHERE b.booking_id = p_booking_id;

    IF v_venue_owner_id IS DISTINCT FROM p_owner_id THEN
        RAISE EXCEPTION 'Permission denied. Owner ID does not match venue owner.';
    END IF;

    -- 2. Fetch booking details and check status (must be 'cancelled' to initiate refund process)
    SELECT * INTO v_booking_record FROM public.bookings
    WHERE booking_id = p_booking_id AND status = 'cancelled'::public.booking_status_enum
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Booking not found or not in cancelled status.';
    END IF;

    -- 3. Update payment status to indicate refund completion
    UPDATE public.bookings
    SET payment_status = 'refunded'::public.payment_status_enum,
        total_amount = total_amount - p_refund_amount -- Adjust total amount if necessary (or rely on existing logic)
    WHERE booking_id = p_booking_id;
    
    -- 4. Insert into payments table (optional, but good for record keeping)
    INSERT INTO public.payments (booking_id, amount, status, transaction_date)
    VALUES (p_booking_id, p_refund_amount, 'refunded', NOW());
    
    RETURN json_build_object('success', true, 'message', 'Refund processed successfully.');
END;
$$;


--
-- Name: search_users(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.search_users(p_search_term text) RETURNS TABLE(user_id uuid, username text, email text, role text, status text, registration_date timestamp with time zone)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  -- We must add a check to ensure only admins can run this function.
  IF (SELECT u.role FROM public.users u WHERE u.user_id = auth.uid()) != 'admin' THEN
    RAISE EXCEPTION 'Access denied: Admin role required.';
  END IF;

  -- The function returns all users matching the search term.
  -- If the search term is empty, it returns all users.
  RETURN QUERY
    SELECT
      u.user_id,
      u.username,
      u.email,
      u.role,
      u.status,
      u.registration_date
    FROM public.users u
    WHERE
      p_search_term = '' OR
      u.username ILIKE '%' || p_search_term || '%' OR
      u.email ILIKE '%' || p_search_term || '%' OR
      u.role ILIKE '%' || p_search_term || '%' OR
      u.status ILIKE '%' || p_search_term || '%'
    ORDER BY u.registration_date DESC;
END;
$$;


--
-- Name: set_timestamps(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_timestamps() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
        IF (TG_OP = 'INSERT') THEN
          NEW.created_at = now();
          NEW.updated_at = now();
      ELSIF (TG_OP = 'UPDATE') THEN
          NEW.updated_at = now();
      END IF;
      RETURN NEW;
  END;
  $$;


--
-- Name: set_venue_owner(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_venue_owner() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
      -- Set the owner_id of the new row to the ID of the currently authenticated user
      NEW.owner_id := auth.uid();
      RETURN NEW;
    END;
   $$;


--
-- Name: toggle_user_suspension(uuid, boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.toggle_user_suspension(target_user_id uuid, suspend_status boolean) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'auth', 'pg_temp'
    AS $$
DECLARE
    admin_role TEXT;
    current_user_id uuid := auth.uid();
    new_status TEXT := CASE WHEN suspend_status THEN 'suspended' ELSE 'active' END;
BEGIN
    -- 1. Check if the current user is an admin
    SELECT u.role INTO admin_role
    FROM public.users u
    WHERE u.user_id = current_user_id;

    IF admin_role IS DISTINCT FROM 'admin' THEN
        RAISE EXCEPTION 'Access denied: Only admin can change user status.'
        USING HINT = 'User role is ' || COALESCE(admin_role, 'unknown');
    END IF;
    
    -- 2. Update the status of the target user in public.users
    -- This runs with SECURITY DEFINER privileges and bypasses RLS.
    UPDATE public.users
    SET status = new_status, updated_at = now()
    WHERE user_id = target_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Target user not found.';
    END IF;

    -- 3. If suspending, immediately revoke all existing refresh tokens 
    -- to force an immediate logout and prevent future login/token renewal.
    IF suspend_status = TRUE THEN
        -- The auth schema's refresh_tokens table uses the user_id as text
        UPDATE auth.refresh_tokens
        SET revoked = TRUE, updated_at = now()
        WHERE user_id = target_user_id::text;
    END IF;
END;
$$;


--
-- Name: top_users_by_booking(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.top_users_by_booking() RETURNS TABLE(user_id uuid, username text, booking_count bigint)
    LANGUAGE plpgsql
    AS $$
begin
  return query
    select u.user_id, u.username::text, count(b.booking_id) as booking_count
    from users u
    join bookings b on u.user_id = b.user_id
    group by u.user_id, u.username
    order by booking_count desc
    limit 5;
end; $$;


--
-- Name: top_venues_by_booking(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.top_venues_by_booking() RETURNS TABLE(venue_id uuid, name text, booking_count bigint)
    LANGUAGE plpgsql
    AS $$
begin
  return query
    select v.venue_id, v.name::text, count(b.booking_id) as booking_count
    from venues v
    join facilities f on v.venue_id = f.venue_id
    join bookings b on f.facility_id = b.facility_id
    group by v.venue_id, v.name
    order by booking_count desc
    limit 5;
end; $$;


--
-- Name: admin_notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    type text NOT NULL,
    message text NOT NULL,
    data jsonb,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: amenities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.amenities (
    amenity_id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL
);


--
-- Name: backup_payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.backup_payments (
    payment_id uuid,
    booking_id uuid,
    razorpay_order_id character varying(100),
    razorpay_payment_id character varying(100),
    amount numeric(10,2),
    currency character varying(10),
    status text,
    payment_method character varying(50),
    transaction_date timestamp with time zone
);


--
-- Name: backup_reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.backup_reviews (
    review_id uuid,
    user_id uuid,
    venue_id uuid,
    rating integer,
    comment text,
    created_at timestamp with time zone,
    booking_id uuid
);


--
-- Name: bookings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bookings (
    booking_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    facility_id uuid NOT NULL,
    slot_id uuid NOT NULL,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone NOT NULL,
    total_amount numeric NOT NULL,
    status public.booking_status_enum DEFAULT 'confirmed'::public.booking_status_enum,
    payment_status public.payment_status_enum DEFAULT 'paid'::public.payment_status_enum,
    customer_name character varying,
    customer_phone character varying,
    created_at timestamp with time zone DEFAULT now(),
    has_been_reviewed boolean DEFAULT false,
    cancelled_at timestamp with time zone,
    cancelled_by uuid,
    cancellation_reason text,
    offer_id uuid,
    discount_amount numeric(10,2) DEFAULT 0.00,
    updated_at timestamp with time zone
);


--
-- Name: contact_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    message text NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: credit_transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.credit_transactions (
    transaction_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    amount numeric(10,2) NOT NULL,
    transaction_type text,
    booking_id uuid,
    description text,
    transaction_date timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT credit_transactions_transaction_type_check CHECK ((transaction_type = ANY (ARRAY['deposit'::text, 'booking_payment'::text, 'refund'::text, 'admin_adjustment'::text])))
);


--
-- Name: facilities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.facilities (
    facility_id uuid DEFAULT gen_random_uuid() NOT NULL,
    venue_id uuid,
    sport_id uuid,
    name character varying(100) NOT NULL,
    description text,
    capacity integer,
    hourly_rate numeric(10,2) NOT NULL,
    is_active boolean DEFAULT true
);


--
-- Name: facility_amenities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.facility_amenities (
    facility_id uuid NOT NULL,
    amenity_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: favorites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.favorites (
    user_id uuid NOT NULL,
    venue_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: offer_redemptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.offer_redemptions (
    redemption_id uuid DEFAULT gen_random_uuid() NOT NULL,
    offer_id uuid NOT NULL,
    user_id uuid NOT NULL,
    booking_id uuid NOT NULL,
    redeemed_at timestamp with time zone DEFAULT now(),
    discount_amount numeric(10,2) NOT NULL
);


--
-- Name: offer_sports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.offer_sports (
    offer_id uuid NOT NULL,
    sport_id uuid NOT NULL
);


--
-- Name: offers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.offers (
    offer_id uuid DEFAULT gen_random_uuid() NOT NULL,
    venue_id uuid,
    title character varying(255) NOT NULL,
    description text,
    discount_percentage numeric(5,2),
    is_active boolean DEFAULT true,
    valid_from timestamp with time zone DEFAULT now(),
    valid_until timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    is_global boolean DEFAULT false,
    background_image_url text,
    offer_code character varying(50),
    applies_to_all_sports boolean DEFAULT false,
    offer_type text DEFAULT 'percentage_discount'::text,
    fixed_discount_amount numeric(10,2),
    max_uses integer,
    max_uses_per_user integer,
    min_booking_value numeric(10,2),
    CONSTRAINT offers_offer_type_check CHECK ((offer_type = ANY (ARRAY['percentage_discount'::text, 'fixed_amount_discount'::text])))
);


--
-- Name: payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payments (
    payment_id uuid DEFAULT gen_random_uuid() NOT NULL,
    booking_id uuid,
    razorpay_order_id character varying(100),
    razorpay_payment_id character varying(100),
    amount numeric(10,2) NOT NULL,
    currency character varying(10) DEFAULT 'INR'::character varying,
    status text DEFAULT 'created'::text,
    payment_method character varying(50),
    transaction_date timestamp with time zone,
    CONSTRAINT payments_status_check CHECK ((status = ANY (ARRAY['created'::text, 'authorized'::text, 'captured'::text, 'refunded'::text, 'failed'::text])))
);


--
-- Name: points_transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.points_transactions (
    transaction_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    points_amount numeric(10,2) NOT NULL,
    transaction_type text,
    booking_id uuid,
    description text,
    transaction_date timestamp with time zone,
    CONSTRAINT points_transactions_transaction_type_check CHECK ((transaction_type = ANY (ARRAY['earned'::text, 'redeemed'::text, 'expired'::text, 'admin_adjustment'::text])))
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    user_id uuid DEFAULT gen_random_uuid() NOT NULL,
    username character varying(50),
    email character varying(100) NOT NULL,
    first_name character varying(50),
    last_name character varying(50),
    phone_number character varying(20),
    role text DEFAULT 'player'::text,
    credit_balance numeric(10,2) DEFAULT 0.00 NOT NULL,
    points_balance numeric(10,2) DEFAULT 0.00 NOT NULL,
    registration_date timestamp with time zone,
    status character varying(20) DEFAULT 'active'::character varying,
    avatar_url text,
    updated_at timestamp with time zone,
    credits integer DEFAULT 0,
    CONSTRAINT users_role_check CHECK ((role = ANY (ARRAY['player'::text, 'venue_owner'::text, 'admin'::text]))),
    CONSTRAINT users_status_check CHECK (((status)::text = ANY ((ARRAY['player'::character varying, 'venue_owner'::character varying, 'admin'::character varying, 'active'::character varying, 'suspended'::character varying])::text[])))
);


--
-- Name: review_user_info; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.review_user_info AS
 SELECT user_id,
    username,
    first_name,
    last_name
   FROM public.users;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    review_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    venue_id uuid,
    rating integer NOT NULL,
    comment text,
    created_at timestamp with time zone,
    booking_id uuid
);


--
-- Name: sports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sports (
    sport_id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(50) NOT NULL,
    description text,
    image_url text
);


--
-- Name: time_slots; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.time_slots (
    slot_id uuid DEFAULT gen_random_uuid() NOT NULL,
    facility_id uuid NOT NULL,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone NOT NULL,
    is_available boolean DEFAULT true,
    price_override numeric(10,2),
    block_reason text
);


--
-- Name: venues_with_ratings; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.venues_with_ratings AS
 SELECT v.venue_id,
    v.owner_id,
    v.name,
    v.address,
    v.city,
    v.state,
    v.zip_code,
    v.description,
    v.contact_email,
    v.contact_phone,
    v.latitude,
    v.longitude,
    v.opening_time,
    v.closing_time,
    v.is_approved,
    v.created_at,
    v.updated_at,
    v.image_url,
    v.rejection_reason,
    v.booking_window_days,
    v.google_maps_url,
    v.cancellation_cutoff_hours,
    v.cancellation_fee_percentage,
    COALESCE(r.avg_rating, (0)::numeric) AS avg_rating,
    COALESCE(r.review_count, (0)::bigint) AS review_count
   FROM (public.venues v
     LEFT JOIN ( SELECT reviews.venue_id,
            (avg((reviews.rating)::numeric))::numeric(2,1) AS avg_rating,
            count(reviews.review_id) AS review_count
           FROM public.reviews
          GROUP BY reviews.venue_id) r ON ((v.venue_id = r.venue_id)));


--
-- Name: admin_notifications admin_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_notifications
    ADD CONSTRAINT admin_notifications_pkey PRIMARY KEY (id);


--
-- Name: amenities amenities_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.amenities
    ADD CONSTRAINT amenities_name_key UNIQUE (name);


--
-- Name: amenities amenities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.amenities
    ADD CONSTRAINT amenities_pkey PRIMARY KEY (amenity_id);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (booking_id);


--
-- Name: bookings bookings_slot_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_slot_id_unique UNIQUE (slot_id);


--
-- Name: contact_messages contact_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_pkey PRIMARY KEY (id);


--
-- Name: credit_transactions credit_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credit_transactions
    ADD CONSTRAINT credit_transactions_pkey PRIMARY KEY (transaction_id);


--
-- Name: facilities facilities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.facilities
    ADD CONSTRAINT facilities_pkey PRIMARY KEY (facility_id);


--
-- Name: facility_amenities facility_amenities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.facility_amenities
    ADD CONSTRAINT facility_amenities_pkey PRIMARY KEY (facility_id, amenity_id);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (user_id, venue_id);


--
-- Name: offer_redemptions offer_redemptions_offer_id_user_id_booking_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offer_redemptions
    ADD CONSTRAINT offer_redemptions_offer_id_user_id_booking_id_key UNIQUE (offer_id, user_id, booking_id);


--
-- Name: offer_redemptions offer_redemptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offer_redemptions
    ADD CONSTRAINT offer_redemptions_pkey PRIMARY KEY (redemption_id);


--
-- Name: offer_sports offer_sports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offer_sports
    ADD CONSTRAINT offer_sports_pkey PRIMARY KEY (offer_id, sport_id);


--
-- Name: offers offers_offer_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offers
    ADD CONSTRAINT offers_offer_code_key UNIQUE (offer_code);


--
-- Name: offers offers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offers
    ADD CONSTRAINT offers_pkey PRIMARY KEY (offer_id);


--
-- Name: payments payments_booking_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_booking_id_key UNIQUE (booking_id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (payment_id);


--
-- Name: payments payments_razorpay_order_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_razorpay_order_id_key UNIQUE (razorpay_order_id);


--
-- Name: payments payments_razorpay_payment_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_razorpay_payment_id_key UNIQUE (razorpay_payment_id);


--
-- Name: points_transactions points_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.points_transactions
    ADD CONSTRAINT points_transactions_pkey PRIMARY KEY (transaction_id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (review_id);


--
-- Name: reviews reviews_user_id_venue_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_venue_id_key UNIQUE (user_id, venue_id);


--
-- Name: sports sports_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports
    ADD CONSTRAINT sports_name_key UNIQUE (name);


--
-- Name: sports sports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sports
    ADD CONSTRAINT sports_pkey PRIMARY KEY (sport_id);


--
-- Name: time_slots time_slots_facility_id_start_time_end_time_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.time_slots
    ADD CONSTRAINT time_slots_facility_id_start_time_end_time_key UNIQUE (facility_id, start_time, end_time);


--
-- Name: time_slots time_slots_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.time_slots
    ADD CONSTRAINT time_slots_pkey PRIMARY KEY (slot_id);


--
-- Name: reviews unique_review_per_booking; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT unique_review_per_booking UNIQUE (user_id, venue_id, booking_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_phone_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_number_key UNIQUE (phone_number);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: venues venues_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.venues
    ADD CONSTRAINT venues_pkey PRIMARY KEY (venue_id);


--
-- Name: idx_bookings_facility_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bookings_facility_id ON public.bookings USING btree (facility_id);


--
-- Name: idx_bookings_has_been_reviewed; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bookings_has_been_reviewed ON public.bookings USING btree (has_been_reviewed);


--
-- Name: idx_bookings_slot_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bookings_slot_id ON public.bookings USING btree (slot_id);


--
-- Name: idx_bookings_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bookings_user_id ON public.bookings USING btree (user_id);


--
-- Name: idx_credit_transactions_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_credit_transactions_user_id ON public.credit_transactions USING btree (user_id);


--
-- Name: idx_facilities_venue_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_facilities_venue_id ON public.facilities USING btree (venue_id);


--
-- Name: idx_facilities_venue_id_sport_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_facilities_venue_id_sport_id ON public.facilities USING btree (venue_id, sport_id);


--
-- Name: idx_facility_amenities_amenity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_facility_amenities_amenity_id ON public.facility_amenities USING btree (amenity_id);


--
-- Name: idx_favorites_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_favorites_user_id ON public.favorites USING btree (user_id);


--
-- Name: idx_offer_redemptions_offer_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_offer_redemptions_offer_id ON public.offer_redemptions USING btree (offer_id);


--
-- Name: idx_offer_redemptions_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_offer_redemptions_user_id ON public.offer_redemptions USING btree (user_id);


--
-- Name: idx_offers_venue_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_offers_venue_id ON public.offers USING btree (venue_id);


--
-- Name: idx_points_transactions_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_points_transactions_user_id ON public.points_transactions USING btree (user_id);


--
-- Name: idx_reviews_venue_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reviews_venue_id ON public.reviews USING btree (venue_id);


--
-- Name: idx_time_slots_facility_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_time_slots_facility_id ON public.time_slots USING btree (facility_id);


--
-- Name: idx_time_slots_facility_id_start_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_time_slots_facility_id_start_time ON public.time_slots USING btree (facility_id, start_time);


--
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- Name: idx_users_role_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_role_status ON public.users USING btree (role, status);


--
-- Name: idx_users_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_status ON public.users USING btree (status);


--
-- Name: idx_venues_city_is_approved; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_venues_city_is_approved ON public.venues USING btree (city, is_approved);


--
-- Name: idx_venues_owner_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_venues_owner_id ON public.venues USING btree (owner_id);


--
-- Name: users on_new_user_set_username; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER on_new_user_set_username BEFORE INSERT ON public.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_username();


--
-- Name: bookings trigger_notify_admin_on_new_booking; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_notify_admin_on_new_booking AFTER INSERT ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.notify_admin_on_new_booking();


--
-- Name: venues trigger_set_timestamps; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_set_timestamps BEFORE INSERT OR UPDATE ON public.venues FOR EACH ROW EXECUTE FUNCTION public.set_timestamps();


--
-- Name: venues trigger_set_venue_owner; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_set_venue_owner BEFORE INSERT ON public.venues FOR EACH ROW EXECUTE FUNCTION public.set_venue_owner();


--
-- Name: bookings bookings_cancelled_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_cancelled_by_fkey FOREIGN KEY (cancelled_by) REFERENCES public.users(user_id);


--
-- Name: bookings bookings_facility_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_facility_id_fkey FOREIGN KEY (facility_id) REFERENCES public.facilities(facility_id) ON DELETE CASCADE;


--
-- Name: bookings bookings_offer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_offer_id_fkey FOREIGN KEY (offer_id) REFERENCES public.offers(offer_id) ON DELETE SET NULL;


--
-- Name: bookings bookings_slot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_slot_id_fkey FOREIGN KEY (slot_id) REFERENCES public.time_slots(slot_id) ON DELETE CASCADE;


--
-- Name: bookings bookings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE SET NULL;


--
-- Name: credit_transactions credit_transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credit_transactions
    ADD CONSTRAINT credit_transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: facilities facilities_sport_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.facilities
    ADD CONSTRAINT facilities_sport_id_fkey FOREIGN KEY (sport_id) REFERENCES public.sports(sport_id) ON DELETE CASCADE;


--
-- Name: facilities facilities_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.facilities
    ADD CONSTRAINT facilities_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venues(venue_id) ON DELETE CASCADE;


--
-- Name: facility_amenities facility_amenities_amenity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.facility_amenities
    ADD CONSTRAINT facility_amenities_amenity_id_fkey FOREIGN KEY (amenity_id) REFERENCES public.amenities(amenity_id) ON DELETE CASCADE;


--
-- Name: facility_amenities facility_amenities_facility_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.facility_amenities
    ADD CONSTRAINT facility_amenities_facility_id_fkey FOREIGN KEY (facility_id) REFERENCES public.facilities(facility_id) ON DELETE CASCADE;


--
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: favorites favorites_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venues(venue_id) ON DELETE CASCADE;


--
-- Name: offer_redemptions offer_redemptions_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offer_redemptions
    ADD CONSTRAINT offer_redemptions_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(booking_id) ON DELETE CASCADE;


--
-- Name: offer_redemptions offer_redemptions_offer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offer_redemptions
    ADD CONSTRAINT offer_redemptions_offer_id_fkey FOREIGN KEY (offer_id) REFERENCES public.offers(offer_id) ON DELETE CASCADE;


--
-- Name: offer_redemptions offer_redemptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offer_redemptions
    ADD CONSTRAINT offer_redemptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: offer_sports offer_sports_offer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offer_sports
    ADD CONSTRAINT offer_sports_offer_id_fkey FOREIGN KEY (offer_id) REFERENCES public.offers(offer_id) ON DELETE CASCADE;


--
-- Name: offer_sports offer_sports_sport_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offer_sports
    ADD CONSTRAINT offer_sports_sport_id_fkey FOREIGN KEY (sport_id) REFERENCES public.sports(sport_id) ON DELETE CASCADE;


--
-- Name: offers offers_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offers
    ADD CONSTRAINT offers_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venues(venue_id) ON DELETE CASCADE;


--
-- Name: points_transactions points_transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.points_transactions
    ADD CONSTRAINT points_transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: reviews reviews_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(booking_id) ON DELETE SET NULL;


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: reviews reviews_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venues(venue_id) ON DELETE CASCADE;


--
-- Name: time_slots time_slots_facility_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.time_slots
    ADD CONSTRAINT time_slots_facility_id_fkey FOREIGN KEY (facility_id) REFERENCES public.facilities(facility_id) ON DELETE CASCADE;


--
-- Name: venues venues_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.venues
    ADD CONSTRAINT venues_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: venues Admin All Access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin All Access" ON public.venues USING ((( SELECT users.role
   FROM public.users
  WHERE (users.user_id = auth.uid())) = 'admin'::text)) WITH CHECK ((( SELECT users.role
   FROM public.users
  WHERE (users.user_id = auth.uid())) = 'admin'::text));


--
-- Name: users Admin can update all users by app_role; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can update all users by app_role" ON public.users FOR UPDATE USING (((auth.jwt() ->> 'app_role'::text) = 'admin'::text)) WITH CHECK (true);


--
-- Name: offers Admins and Owners can manage offers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins and Owners can manage offers" ON public.offers USING (((( SELECT users.role
   FROM public.users
  WHERE (users.user_id = auth.uid())) = 'admin'::text) OR (( SELECT venues.owner_id
   FROM public.venues
  WHERE (venues.venue_id = offers.venue_id)) = auth.uid())));


--
-- Name: users Admins can update user profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update user profiles" ON public.users FOR UPDATE USING ((public.get_my_role() = 'admin'::text)) WITH CHECK ((public.get_my_role() = 'admin'::text));


--
-- Name: contact_messages Admins can view all contact messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all contact messages" ON public.contact_messages FOR SELECT TO authenticated USING ((( SELECT users.role
   FROM public.users
  WHERE (users.user_id = auth.uid())) = 'admin'::text));


--
-- Name: contact_messages Admins full access on contact messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins full access on contact messages" ON public.contact_messages USING ((( SELECT users.role
   FROM public.users
  WHERE (users.user_id = auth.uid())) = 'admin'::text)) WITH CHECK ((( SELECT users.role
   FROM public.users
  WHERE (users.user_id = auth.uid())) = 'admin'::text));


--
-- Name: admin_notifications Admins full access on notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins full access on notifications" ON public.admin_notifications USING ((( SELECT users.role
   FROM public.users
  WHERE (users.user_id = auth.uid())) = 'admin'::text)) WITH CHECK ((( SELECT users.role
   FROM public.users
  WHERE (users.user_id = auth.uid())) = 'admin'::text));


--
-- Name: users Allow admins to read all user data; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow admins to read all user data" ON public.users FOR SELECT TO authenticated USING ((public.get_my_role() = 'admin'::text));


--
-- Name: venues Allow admins to update any venue; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow admins to update any venue" ON public.venues FOR UPDATE TO authenticated USING ((public.get_my_role() = 'admin'::text));


--
-- Name: users Allow individual users to read their own data; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow individual users to read their own data" ON public.users FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: time_slots Allow owners to add time slots for their venues; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow owners to add time slots for their venues" ON public.time_slots FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM (public.venues v
     JOIN public.facilities f ON ((v.venue_id = f.venue_id)))
  WHERE ((f.facility_id = time_slots.facility_id) AND (v.owner_id = auth.uid())))));


--
-- Name: venues Allow owners to delete their own venues; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow owners to delete their own venues" ON public.venues FOR DELETE TO authenticated USING ((auth.uid() = owner_id));


--
-- Name: venues Allow owners to update their own venues; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow owners to update their own venues" ON public.venues FOR UPDATE TO authenticated USING ((auth.uid() = owner_id));


--
-- Name: contact_messages Allow public insert for contact messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public insert for contact messages" ON public.contact_messages FOR INSERT TO authenticated, anon WITH CHECK (true);


--
-- Name: reviews Allow public read access to all reviews; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public read access to all reviews" ON public.reviews FOR SELECT USING (true);


--
-- Name: users Allow selecting users who have written reviews; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow selecting users who have written reviews" ON public.users FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.reviews
  WHERE (reviews.user_id = users.user_id))));


--
-- Name: users Allow users to update their own data; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow users to update their own data" ON public.users FOR UPDATE TO authenticated USING ((auth.uid() = user_id));


--
-- Name: venues Allow venue owners to create new venues; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow venue owners to create new venues" ON public.venues FOR INSERT TO authenticated WITH CHECK ((auth.uid() = owner_id));


--
-- Name: contact_messages Anon users can INSERT new messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anon users can INSERT new messages" ON public.contact_messages FOR INSERT TO authenticated, anon WITH CHECK (true);


--
-- Name: offers Enable read access for all users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable read access for all users" ON public.offers FOR SELECT USING (true);


--
-- Name: amenities Enable read access for amenities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable read access for amenities" ON public.amenities FOR SELECT USING (true);


--
-- Name: sports Enable read access for sports; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable read access for sports" ON public.sports FOR SELECT USING (true);


--
-- Name: venues Owners Full Access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Owners Full Access" ON public.venues USING ((owner_id = auth.uid())) WITH CHECK ((owner_id = auth.uid()));


--
-- Name: time_slots Owners can SELECT their time slots; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Owners can SELECT their time slots" ON public.time_slots FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM (public.facilities f
     JOIN public.venues v ON ((f.venue_id = v.venue_id)))
  WHERE ((f.facility_id = time_slots.facility_id) AND (v.owner_id = auth.uid())))));


--
-- Name: time_slots Owners can UPDATE slots; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Owners can UPDATE slots" ON public.time_slots FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM (public.facilities f
     JOIN public.venues v ON ((f.venue_id = v.venue_id)))
  WHERE ((f.facility_id = time_slots.facility_id) AND (v.owner_id = auth.uid())))));


--
-- Name: offer_sports Owners can manage links for their offers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Owners can manage links for their offers" ON public.offer_sports USING ((( SELECT offers.venue_id
   FROM public.offers
  WHERE (offers.offer_id = offer_sports.offer_id)) IN ( SELECT venues.venue_id
   FROM public.venues
  WHERE (venues.owner_id = auth.uid()))));


--
-- Name: time_slots Owners can update their time slots; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Owners can update their time slots" ON public.time_slots FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM (public.facilities f
     JOIN public.venues v ON ((f.venue_id = v.venue_id)))
  WHERE ((f.facility_id = time_slots.facility_id) AND (v.owner_id = auth.uid())))));


--
-- Name: venues Owners can view their own venues; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Owners can view their own venues" ON public.venues FOR SELECT TO authenticated USING ((auth.uid() = owner_id));


--
-- Name: venues Owners insert their own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Owners insert their own" ON public.venues FOR INSERT TO authenticated WITH CHECK (((( SELECT users.role
   FROM public.users
  WHERE (users.user_id = auth.uid())) = 'venue_owner'::text) AND (owner_id = auth.uid())));


--
-- Name: venues Owners update their own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Owners update their own" ON public.venues FOR UPDATE TO authenticated USING ((owner_id = auth.uid())) WITH CHECK ((owner_id = auth.uid()));


--
-- Name: facilities Owners: All access to their facilities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Owners: All access to their facilities" ON public.facilities USING ((EXISTS ( SELECT 1
   FROM public.venues
  WHERE ((venues.venue_id = facilities.venue_id) AND (venues.owner_id = auth.uid()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.venues
  WHERE ((venues.venue_id = facilities.venue_id) AND (venues.owner_id = auth.uid())))));


--
-- Name: facilities Players can read all facilities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Players can read all facilities" ON public.facilities FOR SELECT TO authenticated USING (true);


--
-- Name: time_slots Players can read all time_slots; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Players can read all time_slots" ON public.time_slots FOR SELECT TO authenticated USING (true);


--
-- Name: bookings Players can read their own bookings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Players can read their own bookings" ON public.bookings FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: offers Public can view active offers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can view active offers" ON public.offers FOR SELECT USING (((is_active = true) AND ((valid_until IS NULL) OR (valid_until > now()))));


--
-- Name: venues Public can view approved venues; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can view approved venues" ON public.venues FOR SELECT TO authenticated, anon USING ((is_approved = true));


--
-- Name: offer_sports Public can view linked sports; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can view linked sports" ON public.offer_sports FOR SELECT USING (true);


--
-- Name: facilities Public: Select approved facilities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public: Select approved facilities" ON public.facilities FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.venues
  WHERE ((venues.venue_id = facilities.venue_id) AND (venues.is_approved = true)))));


--
-- Name: users Role based SELECT access on users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Role based SELECT access on users" ON public.users FOR SELECT USING (((auth.jwt() ->> 'app_role'::text) = ANY (ARRAY['admin'::text, 'venue_owner'::text])));


--
-- Name: favorites Users can delete their own favorites; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own favorites" ON public.favorites FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: users Users can fully manage their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can fully manage their own profile" ON public.users TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: favorites Users can insert their own favorites; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own favorites" ON public.favorites FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: favorites Users can view their own favorites; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own favorites" ON public.favorites FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: offers Venue owners can delete their own offers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Venue owners can delete their own offers" ON public.offers FOR DELETE USING ((auth.uid() = ( SELECT venues.owner_id
   FROM public.venues
  WHERE (venues.venue_id = offers.venue_id))));


--
-- Name: admin_notifications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

--
-- Name: bookings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

--
-- Name: contact_messages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

--
-- Name: facilities; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;

--
-- Name: favorites; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

--
-- Name: offer_sports; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.offer_sports ENABLE ROW LEVEL SECURITY;

--
-- Name: offers; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

--
-- Name: reviews; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

--
-- Name: time_slots; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

--
-- Name: venues; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--

