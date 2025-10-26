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
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- Name: supabase_migrations; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA supabase_migrations;


ALTER SCHEMA supabase_migrations OWNER TO postgres;

--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_authorization_status AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


ALTER TYPE auth.oauth_authorization_status OWNER TO supabase_auth_admin;

--
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_client_type AS ENUM (
    'public',
    'confidential'
);


ALTER TYPE auth.oauth_client_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


ALTER TYPE auth.oauth_registration_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_response_type AS ENUM (
    'code'
);


ALTER TYPE auth.oauth_response_type OWNER TO supabase_auth_admin;

--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- Name: booking_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.booking_status_enum AS ENUM (
    'confirmed',
    'cancelled',
    'completed'
);


ALTER TYPE public.booking_status_enum OWNER TO postgres;

--
-- Name: payment_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payment_status_enum AS ENUM (
    'paid',
    'pending',
    'failed',
    'refunded'
);


ALTER TYPE public.payment_status_enum OWNER TO postgres;

--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS'
);


ALTER TYPE storage.buckettype OWNER TO supabase_storage_admin;

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: supabase_admin
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
begin
    raise debug 'PgBouncer auth request: %', p_usename;

    return query
    select 
        rolname::text, 
        case when rolvaliduntil < now() 
            then null 
            else rolpassword::text 
        end 
    from pg_authid 
    where rolname=$1 and rolcanlogin;
end;
$_$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO supabase_admin;

--
-- Name: cancel_booking_and_notify_admin(uuid, uuid); Type: FUNCTION; Schema: public; Owner: postgres
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


ALTER FUNCTION public.cancel_booking_and_notify_admin(p_booking_id uuid, p_user_id uuid) OWNER TO postgres;

--
-- Name: cancel_booking_transaction(uuid, uuid); Type: FUNCTION; Schema: public; Owner: postgres
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


ALTER FUNCTION public.cancel_booking_transaction(p_booking_id uuid, p_user_id uuid) OWNER TO postgres;

--
-- Name: cancel_booking_transaction(uuid, uuid, text); Type: FUNCTION; Schema: public; Owner: postgres
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


ALTER FUNCTION public.cancel_booking_transaction(p_booking_id uuid, p_user_id uuid, p_cancellation_reason text) OWNER TO postgres;

--
-- Name: create_booking_for_user(uuid, uuid, uuid, numeric); Type: FUNCTION; Schema: public; Owner: postgres
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


ALTER FUNCTION public.create_booking_for_user(p_user_id uuid, p_facility_id uuid, p_slot_id uuid, p_total_amount numeric) OWNER TO postgres;

--
-- Name: get_my_role(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_my_role() RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RETURN (
    SELECT role
    FROM public.users
    WHERE user_id = auth.uid()
    LIMIT 1
  );
END;
$$;


ALTER FUNCTION public.get_my_role() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: venues; Type: TABLE; Schema: public; Owner: postgres
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
    booking_window_days integer DEFAULT 7
);


ALTER TABLE public.venues OWNER TO postgres;

--
-- Name: get_my_venues(); Type: FUNCTION; Schema: public; Owner: postgres
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


ALTER FUNCTION public.get_my_venues() OWNER TO postgres;

--
-- Name: get_my_venues_with_images(); Type: FUNCTION; Schema: public; Owner: postgres
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


ALTER FUNCTION public.get_my_venues_with_images() OWNER TO postgres;

--
-- Name: get_owner_dashboard_statistics(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_owner_dashboard_statistics() RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  result json;
  current_owner_id uuid := auth.uid();
  last_month_start date := date_trunc('month', CURRENT_DATE) - interval '1 month';
  last_month_end date := date_trunc('month', CURRENT_DATE) - interval '1 day';
  current_month_start date := date_trunc('month', CURRENT_DATE);
BEGIN
  WITH owner_bookings AS (
    SELECT
      b.total_amount,
      b.start_time,
      f.name as facility_name,
      s.name as sport_name
    FROM public.bookings b
    JOIN public.facilities f ON b.facility_id = f.facility_id
    JOIN public.venues v ON f.venue_id = v.venue_id
    JOIN public.sports s ON f.sport_id = s.sport_id
    WHERE v.owner_id = current_owner_id
  )
  SELECT json_build_object(
    'todays_revenue', (SELECT COALESCE(SUM(total_amount), 0) FROM owner_bookings WHERE start_time::date = CURRENT_DATE),
    'monthly_revenue', (SELECT COALESCE(SUM(total_amount), 0) FROM owner_bookings WHERE start_time >= current_month_start),
    'total_revenue', (SELECT COALESCE(SUM(total_amount), 0) FROM owner_bookings),
    'todays_bookings', (SELECT COUNT(*) FROM owner_bookings WHERE start_time::date = CURRENT_DATE),
    'upcoming_bookings', (SELECT COUNT(*) FROM owner_bookings WHERE start_time > NOW()),
    'revenue_by_facility', (SELECT json_agg(json_build_object('name', facility_name, 'revenue', total_revenue)) FROM (SELECT facility_name, SUM(total_amount) as total_revenue FROM owner_bookings GROUP BY facility_name ORDER BY total_revenue DESC) as fr),
    'peak_booking_hours', (SELECT json_agg(json_build_object('hour', hour, 'bookings', count)) FROM (SELECT EXTRACT(hour FROM start_time) as hour, COUNT(*) as count FROM owner_bookings GROUP BY hour ORDER BY hour) as hb),
    'most_popular_sport', (SELECT sport_name FROM owner_bookings GROUP BY sport_name ORDER BY COUNT(*) DESC LIMIT 1),
    'mom_revenue_growth', (SELECT CASE WHEN (SELECT SUM(total_amount) FROM owner_bookings WHERE start_time BETWEEN last_month_start AND last_month_end) > 0 THEN ROUND((( (SELECT SUM(total_amount) FROM owner_bookings WHERE start_time >= current_month_start) - (SELECT SUM(total_amount) FROM owner_bookings WHERE start_time BETWEEN last_month_start AND last_month_end) ) / (SELECT SUM(total_amount) FROM owner_bookings WHERE start_time BETWEEN last_month_start AND last_month_end) * 100), 2) ELSE 100 END),
    'revenue_trend', (SELECT json_agg(json_build_object('date', day, 'revenue', daily_revenue)) FROM (SELECT start_time::date as day, SUM(total_amount) as daily_revenue FROM owner_bookings WHERE start_time >= CURRENT_DATE - interval '30 days' GROUP BY day ORDER BY day) as dd)
  )
  INTO result;
  RETURN result;
END;
$$;


ALTER FUNCTION public.get_owner_dashboard_statistics() OWNER TO postgres;

--
-- Name: get_owner_dashboard_statistics(integer); Type: FUNCTION; Schema: public; Owner: postgres
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
      -- THIS IS THE FIX:
      AND b.status <> 'cancelled'::public.booking_status_enum
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


ALTER FUNCTION public.get_owner_dashboard_statistics(days_to_track integer) OWNER TO postgres;

--
-- Name: get_owner_venues_details(); Type: FUNCTION; Schema: public; Owner: postgres
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


ALTER FUNCTION public.get_owner_venues_details() OWNER TO postgres;

--
-- Name: get_public_profiles_for_owner(uuid[]); Type: FUNCTION; Schema: public; Owner: postgres
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


ALTER FUNCTION public.get_public_profiles_for_owner(user_ids uuid[]) OWNER TO postgres;

--
-- Name: get_slots_for_facility(uuid, date); Type: FUNCTION; Schema: public; Owner: postgres
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


ALTER FUNCTION public.get_slots_for_facility(p_facility_id uuid, p_date date) OWNER TO postgres;

--
-- Name: get_user_role(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_user_role() RETURNS text
    LANGUAGE sql SECURITY DEFINER
    AS $$
  select role from public.users where user_id = auth.uid();
$$;


ALTER FUNCTION public.get_user_role() OWNER TO postgres;

--
-- Name: get_user_role_claim(uuid); Type: FUNCTION; Schema: public; Owner: postgres
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


ALTER FUNCTION public.get_user_role_claim(p_user_id uuid) OWNER TO postgres;

--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.users (user_id, email, username, first_name, last_name, role, phone_number)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'role',
    new.raw_user_meta_data->>'phone_number'
  );
  RETURN new;
END;
$$;


ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

--
-- Name: handle_new_user_username(); Type: FUNCTION; Schema: public; Owner: postgres
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


ALTER FUNCTION public.handle_new_user_username() OWNER TO postgres;

--
-- Name: search_users(text); Type: FUNCTION; Schema: public; Owner: postgres
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


ALTER FUNCTION public.search_users(p_search_term text) OWNER TO postgres;

--
-- Name: set_venue_owner(); Type: FUNCTION; Schema: public; Owner: postgres
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


ALTER FUNCTION public.set_venue_owner() OWNER TO postgres;

--
-- Name: toggle_user_suspension(uuid, boolean); Type: FUNCTION; Schema: public; Owner: postgres
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


ALTER FUNCTION public.toggle_user_suspension(target_user_id uuid, suspend_status boolean) OWNER TO postgres;

--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  BEGIN
    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (payload, event, topic, private, extension)
    VALUES (payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- Name: add_prefixes(text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.add_prefixes(_bucket_id text, _name text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    prefixes text[];
BEGIN
    prefixes := "storage"."get_prefixes"("_name");

    IF array_length(prefixes, 1) > 0 THEN
        INSERT INTO storage.prefixes (name, bucket_id)
        SELECT UNNEST(prefixes) as name, "_bucket_id" ON CONFLICT DO NOTHING;
    END IF;
END;
$$;


ALTER FUNCTION storage.add_prefixes(_bucket_id text, _name text) OWNER TO supabase_storage_admin;

--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- Name: delete_leaf_prefixes(text[], text[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_leaf_prefixes(bucket_ids text[], names text[]) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_rows_deleted integer;
BEGIN
    LOOP
        WITH candidates AS (
            SELECT DISTINCT
                t.bucket_id,
                unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        ),
        uniq AS (
             SELECT
                 bucket_id,
                 name,
                 storage.get_level(name) AS level
             FROM candidates
             WHERE name <> ''
             GROUP BY bucket_id, name
        ),
        leaf AS (
             SELECT
                 p.bucket_id,
                 p.name,
                 p.level
             FROM storage.prefixes AS p
                  JOIN uniq AS u
                       ON u.bucket_id = p.bucket_id
                           AND u.name = p.name
                           AND u.level = p.level
             WHERE NOT EXISTS (
                 SELECT 1
                 FROM storage.objects AS o
                 WHERE o.bucket_id = p.bucket_id
                   AND o.level = p.level + 1
                   AND o.name COLLATE "C" LIKE p.name || '/%'
             )
             AND NOT EXISTS (
                 SELECT 1
                 FROM storage.prefixes AS c
                 WHERE c.bucket_id = p.bucket_id
                   AND c.level = p.level + 1
                   AND c.name COLLATE "C" LIKE p.name || '/%'
             )
        )
        DELETE
        FROM storage.prefixes AS p
            USING leaf AS l
        WHERE p.bucket_id = l.bucket_id
          AND p.name = l.name
          AND p.level = l.level;

        GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
        EXIT WHEN v_rows_deleted = 0;
    END LOOP;
END;
$$;


ALTER FUNCTION storage.delete_leaf_prefixes(bucket_ids text[], names text[]) OWNER TO supabase_storage_admin;

--
-- Name: delete_prefix(text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_prefix(_bucket_id text, _name text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Check if we can delete the prefix
    IF EXISTS(
        SELECT FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name") + 1
          AND "prefixes"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    )
    OR EXISTS(
        SELECT FROM "storage"."objects"
        WHERE "objects"."bucket_id" = "_bucket_id"
          AND "storage"."get_level"("objects"."name") = "storage"."get_level"("_name") + 1
          AND "objects"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    ) THEN
    -- There are sub-objects, skip deletion
    RETURN false;
    ELSE
        DELETE FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name")
          AND "prefixes"."name" = "_name";
        RETURN true;
    END IF;
END;
$$;


ALTER FUNCTION storage.delete_prefix(_bucket_id text, _name text) OWNER TO supabase_storage_admin;

--
-- Name: delete_prefix_hierarchy_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_prefix_hierarchy_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    prefix text;
BEGIN
    prefix := "storage"."get_prefix"(OLD."name");

    IF coalesce(prefix, '') != '' THEN
        PERFORM "storage"."delete_prefix"(OLD."bucket_id", prefix);
    END IF;

    RETURN OLD;
END;
$$;


ALTER FUNCTION storage.delete_prefix_hierarchy_trigger() OWNER TO supabase_storage_admin;

--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


ALTER FUNCTION storage.enforce_bucket_name_length() OWNER TO supabase_storage_admin;

--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    SELECT _parts[array_length(_parts,1)] INTO _filename;
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_level(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_level(name text) RETURNS integer
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
SELECT array_length(string_to_array("name", '/'), 1);
$$;


ALTER FUNCTION storage.get_level(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_prefix(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_prefix(name text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
SELECT
    CASE WHEN strpos("name", '/') > 0 THEN
             regexp_replace("name", '[\/]{1}[^\/]+\/?$', '')
         ELSE
             ''
        END;
$_$;


ALTER FUNCTION storage.get_prefix(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_prefixes(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_prefixes(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
DECLARE
    parts text[];
    prefixes text[];
    prefix text;
BEGIN
    -- Split the name into parts by '/'
    parts := string_to_array("name", '/');
    prefixes := '{}';

    -- Construct the prefixes, stopping one level below the last part
    FOR i IN 1..array_length(parts, 1) - 1 LOOP
            prefix := array_to_string(parts[1:i], '/');
            prefixes := array_append(prefixes, prefix);
    END LOOP;

    RETURN prefixes;
END;
$$;


ALTER FUNCTION storage.get_prefixes(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text) OWNER TO supabase_storage_admin;

--
-- Name: lock_top_prefixes(text[], text[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.lock_top_prefixes(bucket_ids text[], names text[]) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket text;
    v_top text;
BEGIN
    FOR v_bucket, v_top IN
        SELECT DISTINCT t.bucket_id,
            split_part(t.name, '/', 1) AS top
        FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        WHERE t.name <> ''
        ORDER BY 1, 2
        LOOP
            PERFORM pg_advisory_xact_lock(hashtextextended(v_bucket || '/' || v_top, 0));
        END LOOP;
END;
$$;


ALTER FUNCTION storage.lock_top_prefixes(bucket_ids text[], names text[]) OWNER TO supabase_storage_admin;

--
-- Name: objects_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_delete_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.objects_delete_cleanup() OWNER TO supabase_storage_admin;

--
-- Name: objects_insert_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_insert_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    NEW.level := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.objects_insert_prefix_trigger() OWNER TO supabase_storage_admin;

--
-- Name: objects_update_cleanup(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_update_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    -- NEW - OLD (destinations to create prefixes for)
    v_add_bucket_ids text[];
    v_add_names      text[];

    -- OLD - NEW (sources to prune)
    v_src_bucket_ids text[];
    v_src_names      text[];
BEGIN
    IF TG_OP <> 'UPDATE' THEN
        RETURN NULL;
    END IF;

    -- 1) Compute NEW−OLD (added paths) and OLD−NEW (moved-away paths)
    WITH added AS (
        SELECT n.bucket_id, n.name
        FROM new_rows n
        WHERE n.name <> '' AND position('/' in n.name) > 0
        EXCEPT
        SELECT o.bucket_id, o.name FROM old_rows o WHERE o.name <> ''
    ),
    moved AS (
         SELECT o.bucket_id, o.name
         FROM old_rows o
         WHERE o.name <> ''
         EXCEPT
         SELECT n.bucket_id, n.name FROM new_rows n WHERE n.name <> ''
    )
    SELECT
        -- arrays for ADDED (dest) in stable order
        COALESCE( (SELECT array_agg(a.bucket_id ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        COALESCE( (SELECT array_agg(a.name      ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        -- arrays for MOVED (src) in stable order
        COALESCE( (SELECT array_agg(m.bucket_id ORDER BY m.bucket_id, m.name) FROM moved m), '{}' ),
        COALESCE( (SELECT array_agg(m.name      ORDER BY m.bucket_id, m.name) FROM moved m), '{}' )
    INTO v_add_bucket_ids, v_add_names, v_src_bucket_ids, v_src_names;

    -- Nothing to do?
    IF (array_length(v_add_bucket_ids, 1) IS NULL) AND (array_length(v_src_bucket_ids, 1) IS NULL) THEN
        RETURN NULL;
    END IF;

    -- 2) Take per-(bucket, top) locks: ALL prefixes in consistent global order to prevent deadlocks
    DECLARE
        v_all_bucket_ids text[];
        v_all_names text[];
    BEGIN
        -- Combine source and destination arrays for consistent lock ordering
        v_all_bucket_ids := COALESCE(v_src_bucket_ids, '{}') || COALESCE(v_add_bucket_ids, '{}');
        v_all_names := COALESCE(v_src_names, '{}') || COALESCE(v_add_names, '{}');

        -- Single lock call ensures consistent global ordering across all transactions
        IF array_length(v_all_bucket_ids, 1) IS NOT NULL THEN
            PERFORM storage.lock_top_prefixes(v_all_bucket_ids, v_all_names);
        END IF;
    END;

    -- 3) Create destination prefixes (NEW−OLD) BEFORE pruning sources
    IF array_length(v_add_bucket_ids, 1) IS NOT NULL THEN
        WITH candidates AS (
            SELECT DISTINCT t.bucket_id, unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(v_add_bucket_ids, v_add_names) AS t(bucket_id, name)
            WHERE name <> ''
        )
        INSERT INTO storage.prefixes (bucket_id, name)
        SELECT c.bucket_id, c.name
        FROM candidates c
        ON CONFLICT DO NOTHING;
    END IF;

    -- 4) Prune source prefixes bottom-up for OLD−NEW
    IF array_length(v_src_bucket_ids, 1) IS NOT NULL THEN
        -- re-entrancy guard so DELETE on prefixes won't recurse
        IF current_setting('storage.gc.prefixes', true) <> '1' THEN
            PERFORM set_config('storage.gc.prefixes', '1', true);
        END IF;

        PERFORM storage.delete_leaf_prefixes(v_src_bucket_ids, v_src_names);
    END IF;

    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.objects_update_cleanup() OWNER TO supabase_storage_admin;

--
-- Name: objects_update_level_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_update_level_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Set the new level
        NEW."level" := "storage"."get_level"(NEW."name");
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.objects_update_level_trigger() OWNER TO supabase_storage_admin;

--
-- Name: objects_update_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_update_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    old_prefixes TEXT[];
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Retrieve old prefixes
        old_prefixes := "storage"."get_prefixes"(OLD."name");

        -- Remove old prefixes that are only used by this object
        WITH all_prefixes as (
            SELECT unnest(old_prefixes) as prefix
        ),
        can_delete_prefixes as (
             SELECT prefix
             FROM all_prefixes
             WHERE NOT EXISTS (
                 SELECT 1 FROM "storage"."objects"
                 WHERE "bucket_id" = OLD."bucket_id"
                   AND "name" <> OLD."name"
                   AND "name" LIKE (prefix || '%')
             )
         )
        DELETE FROM "storage"."prefixes" WHERE name IN (SELECT prefix FROM can_delete_prefixes);

        -- Add new prefixes
        PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    END IF;
    -- Set the new level
    NEW."level" := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.objects_update_prefix_trigger() OWNER TO supabase_storage_admin;

--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- Name: prefixes_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.prefixes_delete_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.prefixes_delete_cleanup() OWNER TO supabase_storage_admin;

--
-- Name: prefixes_insert_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.prefixes_insert_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.prefixes_insert_trigger() OWNER TO supabase_storage_admin;

--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql
    AS $$
declare
    can_bypass_rls BOOLEAN;
begin
    SELECT rolbypassrls
    INTO can_bypass_rls
    FROM pg_roles
    WHERE rolname = coalesce(nullif(current_setting('role', true), 'none'), current_user);

    IF can_bypass_rls THEN
        RETURN QUERY SELECT * FROM storage.search_v1_optimised(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    ELSE
        RETURN QUERY SELECT * FROM storage.search_legacy_v1(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    END IF;
end;
$$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_legacy_v1(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select path_tokens[$1] as folder
           from storage.objects
             where objects.name ilike $2 || $3 || ''%''
               and bucket_id = $4
               and array_length(objects.path_tokens, 1) <> $1
           group by folder
           order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_v1_optimised(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select (string_to_array(name, ''/''))[level] as name
           from storage.prefixes
             where lower(prefixes.name) like lower($2 || $3) || ''%''
               and bucket_id = $4
               and level = $1
           order by name ' || v_sort_order || '
     )
     (select name,
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[level] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where lower(objects.name) like lower($2 || $3) || ''%''
       and bucket_id = $4
       and level = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    sort_col text;
    sort_ord text;
    cursor_op text;
    cursor_expr text;
    sort_expr text;
BEGIN
    -- Validate sort_order
    sort_ord := lower(sort_order);
    IF sort_ord NOT IN ('asc', 'desc') THEN
        sort_ord := 'asc';
    END IF;

    -- Determine cursor comparison operator
    IF sort_ord = 'asc' THEN
        cursor_op := '>';
    ELSE
        cursor_op := '<';
    END IF;
    
    sort_col := lower(sort_column);
    -- Validate sort column  
    IF sort_col IN ('updated_at', 'created_at') THEN
        cursor_expr := format(
            '($5 = '''' OR ROW(date_trunc(''milliseconds'', %I), name COLLATE "C") %s ROW(COALESCE(NULLIF($6, '''')::timestamptz, ''epoch''::timestamptz), $5))',
            sort_col, cursor_op
        );
        sort_expr := format(
            'COALESCE(date_trunc(''milliseconds'', %I), ''epoch''::timestamptz) %s, name COLLATE "C" %s',
            sort_col, sort_ord, sort_ord
        );
    ELSE
        cursor_expr := format('($5 = '''' OR name COLLATE "C" %s $5)', cursor_op);
        sort_expr := format('name COLLATE "C" %s', sort_ord);
    END IF;

    RETURN QUERY EXECUTE format(
        $sql$
        SELECT * FROM (
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    NULL::uuid AS id,
                    updated_at,
                    created_at,
                    NULL::timestamptz AS last_accessed_at,
                    NULL::jsonb AS metadata
                FROM storage.prefixes
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
            UNION ALL
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    id,
                    updated_at,
                    created_at,
                    last_accessed_at,
                    metadata
                FROM storage.objects
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
        ) obj
        ORDER BY %s
        LIMIT $3
        $sql$,
        cursor_expr,    -- prefixes WHERE
        sort_expr,      -- prefixes ORDER BY
        cursor_expr,    -- objects WHERE
        sort_expr,      -- objects ORDER BY
        sort_expr       -- final ORDER BY
    )
    USING prefix, bucket_name, limits, levels, start_after, sort_column_after;
END;
$_$;


ALTER FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text, sort_order text, sort_column text, sort_column_after text) OWNER TO supabase_storage_admin;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_authorizations (
    id uuid NOT NULL,
    authorization_id text NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid,
    redirect_uri text NOT NULL,
    scope text NOT NULL,
    state text,
    resource text,
    code_challenge text,
    code_challenge_method auth.code_challenge_method,
    response_type auth.oauth_response_type DEFAULT 'code'::auth.oauth_response_type NOT NULL,
    status auth.oauth_authorization_status DEFAULT 'pending'::auth.oauth_authorization_status NOT NULL,
    authorization_code text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
    approved_at timestamp with time zone,
    CONSTRAINT oauth_authorizations_authorization_code_length CHECK ((char_length(authorization_code) <= 255)),
    CONSTRAINT oauth_authorizations_code_challenge_length CHECK ((char_length(code_challenge) <= 128)),
    CONSTRAINT oauth_authorizations_expires_at_future CHECK ((expires_at > created_at)),
    CONSTRAINT oauth_authorizations_redirect_uri_length CHECK ((char_length(redirect_uri) <= 2048)),
    CONSTRAINT oauth_authorizations_resource_length CHECK ((char_length(resource) <= 2048)),
    CONSTRAINT oauth_authorizations_scope_length CHECK ((char_length(scope) <= 4096)),
    CONSTRAINT oauth_authorizations_state_length CHECK ((char_length(state) <= 4096))
);


ALTER TABLE auth.oauth_authorizations OWNER TO supabase_auth_admin;

--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_secret_hash text,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    client_type auth.oauth_client_type DEFAULT 'confidential'::auth.oauth_client_type NOT NULL,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048))
);


ALTER TABLE auth.oauth_clients OWNER TO supabase_auth_admin;

--
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_consents (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    scopes text NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT oauth_consents_revoked_after_granted CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at))),
    CONSTRAINT oauth_consents_scopes_length CHECK ((char_length(scopes) <= 2048)),
    CONSTRAINT oauth_consents_scopes_not_empty CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))
);


ALTER TABLE auth.oauth_consents OWNER TO supabase_auth_admin;

--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text,
    oauth_client_id uuid
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: admin_notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    type text NOT NULL,
    message text NOT NULL,
    data jsonb,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.admin_notifications OWNER TO postgres;

--
-- Name: amenities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.amenities (
    amenity_id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.amenities OWNER TO postgres;

--
-- Name: backup_payments; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.backup_payments OWNER TO postgres;

--
-- Name: backup_reviews; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.backup_reviews OWNER TO postgres;

--
-- Name: bookings; Type: TABLE; Schema: public; Owner: postgres
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
    cancellation_reason text
);


ALTER TABLE public.bookings OWNER TO postgres;

--
-- Name: contact_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    message text NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.contact_messages OWNER TO postgres;

--
-- Name: credit_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.credit_transactions (
    transaction_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    amount numeric(10,2) NOT NULL,
    transaction_type text,
    booking_id uuid,
    description text,
    transaction_date timestamp with time zone,
    CONSTRAINT credit_transactions_transaction_type_check CHECK ((transaction_type = ANY (ARRAY['deposit'::text, 'booking_payment'::text, 'refund'::text, 'admin_adjustment'::text])))
);


ALTER TABLE public.credit_transactions OWNER TO postgres;

--
-- Name: facilities; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.facilities OWNER TO postgres;

--
-- Name: facility_amenities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.facility_amenities (
    facility_id uuid NOT NULL,
    amenity_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.facility_amenities OWNER TO postgres;

--
-- Name: favorites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favorites (
    user_id uuid NOT NULL,
    venue_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.favorites OWNER TO postgres;

--
-- Name: offer_sports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.offer_sports (
    offer_id uuid NOT NULL,
    sport_id uuid NOT NULL
);


ALTER TABLE public.offer_sports OWNER TO postgres;

--
-- Name: offers; Type: TABLE; Schema: public; Owner: postgres
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
    applies_to_all_sports boolean DEFAULT false
);


ALTER TABLE public.offers OWNER TO postgres;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: points_transactions; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.points_transactions OWNER TO postgres;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: sports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sports (
    sport_id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(50) NOT NULL,
    description text
);


ALTER TABLE public.sports OWNER TO postgres;

--
-- Name: time_slots; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.time_slots OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
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
    last_login timestamp with time zone,
    status character varying(20) DEFAULT 'active'::character varying,
    avatar_url text,
    updated_at timestamp with time zone,
    CONSTRAINT users_role_check CHECK ((role = ANY (ARRAY['player'::text, 'venue_owner'::text, 'admin'::text]))),
    CONSTRAINT users_status_check CHECK (((status)::text = ANY ((ARRAY['player'::character varying, 'venue_owner'::character varying, 'admin'::character varying, 'active'::character varying, 'suspended'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_analytics (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.buckets_analytics OWNER TO supabase_storage_admin;

--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb,
    level integer
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: prefixes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.prefixes (
    bucket_id text NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    level integer GENERATED ALWAYS AS (storage.get_level(name)) STORED NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE storage.prefixes OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: supabase_migrations; Owner: postgres
--

CREATE TABLE supabase_migrations.schema_migrations (
    version text NOT NULL,
    statements text[],
    name text
);


ALTER TABLE supabase_migrations.schema_migrations OWNER TO postgres;

--
-- Name: seed_files; Type: TABLE; Schema: supabase_migrations; Owner: postgres
--

CREATE TABLE supabase_migrations.seed_files (
    path text NOT NULL,
    hash text NOT NULL
);


ALTER TABLE supabase_migrations.seed_files OWNER TO postgres;

--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
00000000-0000-0000-0000-000000000000	17863e9d-1684-443d-97d4-8c6ec879e73d	{"action":"user_confirmation_requested","actor_id":"c6726507-34c4-4f89-9273-daaa1e3a83a3","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-08-08 14:08:15.277403+00	
00000000-0000-0000-0000-000000000000	42a99c4a-8453-4cd5-a021-5c17b75febfa	{"action":"user_confirmation_requested","actor_id":"c6726507-34c4-4f89-9273-daaa1e3a83a3","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-08-08 14:12:48.0589+00	
00000000-0000-0000-0000-000000000000	32c3ada8-864a-40b6-bdae-899f8eeecc63	{"action":"user_signedup","actor_id":"c6726507-34c4-4f89-9273-daaa1e3a83a3","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-08 14:23:27.240861+00	
00000000-0000-0000-0000-000000000000	dc7e8eac-9678-4cef-884f-e7ec5325592a	{"action":"login","actor_id":"c6726507-34c4-4f89-9273-daaa1e3a83a3","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 14:23:27.258648+00	
00000000-0000-0000-0000-000000000000	01aad6c8-14d0-4ca7-a607-8c8128eee8d1	{"action":"user_repeated_signup","actor_id":"c6726507-34c4-4f89-9273-daaa1e3a83a3","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-08-08 14:23:47.094032+00	
00000000-0000-0000-0000-000000000000	af0a36f8-84e5-40de-9f43-0085a51ceb9a	{"action":"user_repeated_signup","actor_id":"c6726507-34c4-4f89-9273-daaa1e3a83a3","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-08-08 14:24:31.098089+00	
00000000-0000-0000-0000-000000000000	854e9cef-de71-4ef0-872d-61c22f0500ce	{"action":"login","actor_id":"c6726507-34c4-4f89-9273-daaa1e3a83a3","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 14:24:55.870911+00	
00000000-0000-0000-0000-000000000000	a8867787-0500-49d1-86fe-1ef0c8abda0f	{"action":"login","actor_id":"c6726507-34c4-4f89-9273-daaa1e3a83a3","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 14:25:17.884512+00	
00000000-0000-0000-0000-000000000000	568bfbc0-97e8-4249-9f4e-5b37358ddd57	{"action":"logout","actor_id":"c6726507-34c4-4f89-9273-daaa1e3a83a3","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 14:49:50.141267+00	
00000000-0000-0000-0000-000000000000	44e5b936-643f-4408-a58b-5552c03772d3	{"action":"login","actor_id":"c6726507-34c4-4f89-9273-daaa1e3a83a3","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 15:20:37.526994+00	
00000000-0000-0000-0000-000000000000	5325d9f2-70e4-4dd5-8401-d47bd303a258	{"action":"logout","actor_id":"c6726507-34c4-4f89-9273-daaa1e3a83a3","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 15:20:43.77539+00	
00000000-0000-0000-0000-000000000000	6f7ec2cf-ecec-4ff4-9959-a2f93c555c20	{"action":"user_repeated_signup","actor_id":"c6726507-34c4-4f89-9273-daaa1e3a83a3","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-08-08 15:28:34.921234+00	
00000000-0000-0000-0000-000000000000	9cdaf7a9-a3a3-4963-b488-6dc09b37e650	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"otherswayam@gmail.com","user_id":"c6726507-34c4-4f89-9273-daaa1e3a83a3","user_phone":""}}	2025-08-08 15:31:36.143808+00	
00000000-0000-0000-0000-000000000000	a239bebc-5020-48f9-aee8-ea26017753b2	{"action":"user_signedup","actor_id":"858b55fb-a690-406b-8b6f-5baedda23960","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-08 15:31:43.093338+00	
00000000-0000-0000-0000-000000000000	1683878b-7851-4bd6-8752-4698131a4d59	{"action":"login","actor_id":"858b55fb-a690-406b-8b6f-5baedda23960","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 15:31:43.097206+00	
00000000-0000-0000-0000-000000000000	76e70920-2c33-41ea-b1aa-19edb7104125	{"action":"login","actor_id":"858b55fb-a690-406b-8b6f-5baedda23960","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 15:32:35.729396+00	
00000000-0000-0000-0000-000000000000	4ba577bd-fd93-456d-8d49-dcd8524cd86a	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"otherswayam@gmail.com","user_id":"858b55fb-a690-406b-8b6f-5baedda23960","user_phone":""}}	2025-08-08 15:39:56.912863+00	
00000000-0000-0000-0000-000000000000	39a456f4-126d-4f5d-8cd5-6352f7bd15c3	{"action":"user_signedup","actor_id":"de572608-7ce8-4d22-85f6-e4110c92b428","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-09 04:48:05.953493+00	
00000000-0000-0000-0000-000000000000	17b413f9-8224-46ba-bf9e-6c85bbf89b83	{"action":"login","actor_id":"de572608-7ce8-4d22-85f6-e4110c92b428","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-09 04:48:05.979263+00	
00000000-0000-0000-0000-000000000000	f2b602c0-9f18-4dce-9129-99b3827ad6f2	{"action":"login","actor_id":"de572608-7ce8-4d22-85f6-e4110c92b428","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-09 04:48:21.175318+00	
00000000-0000-0000-0000-000000000000	8afe99b7-eb55-4831-bfa6-3ab545d5f4e3	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"otherswayam@gmail.com","user_id":"de572608-7ce8-4d22-85f6-e4110c92b428","user_phone":""}}	2025-08-09 04:51:11.203964+00	
00000000-0000-0000-0000-000000000000	8c296587-19d4-481a-8579-9c61b04a5b4a	{"action":"user_signedup","actor_id":"a6e45c40-e4dc-42b6-b656-3013029ae8ce","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-09 04:51:56.104213+00	
00000000-0000-0000-0000-000000000000	4a11f467-fc1a-40ac-9fb8-dae96702c79b	{"action":"login","actor_id":"a6e45c40-e4dc-42b6-b656-3013029ae8ce","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-09 04:51:56.112899+00	
00000000-0000-0000-0000-000000000000	1706547e-ad8d-4c13-9dd2-2a6404f51c86	{"action":"logout","actor_id":"a6e45c40-e4dc-42b6-b656-3013029ae8ce","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-09 04:54:48.092239+00	
00000000-0000-0000-0000-000000000000	4cfe2897-c6ed-4e86-bdfb-385f238d8bb8	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"otherswayam@gmail.com","user_id":"a6e45c40-e4dc-42b6-b656-3013029ae8ce","user_phone":""}}	2025-08-09 04:55:10.865377+00	
00000000-0000-0000-0000-000000000000	e95bfe71-5122-4be8-9e58-a6bee8ee41bd	{"action":"user_signedup","actor_id":"95f773df-0b44-4483-95a2-ba8f15d99fd3","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-09 04:55:32.345315+00	
00000000-0000-0000-0000-000000000000	fb9f586e-99bd-4922-aedd-2735a8b1d92d	{"action":"login","actor_id":"95f773df-0b44-4483-95a2-ba8f15d99fd3","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-09 04:55:32.349924+00	
00000000-0000-0000-0000-000000000000	6f92dba1-4e4e-4226-aa90-ce41085f40eb	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"otherswayam@gmail.com","user_id":"95f773df-0b44-4483-95a2-ba8f15d99fd3","user_phone":""}}	2025-08-09 05:44:54.743797+00	
00000000-0000-0000-0000-000000000000	e823be1e-e115-436b-aba4-3e6f2e0b5b09	{"action":"user_signedup","actor_id":"2434bdf0-a9bb-4666-882c-a3ccb6af1230","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-09 05:45:23.592015+00	
00000000-0000-0000-0000-000000000000	34b98e2e-5307-407d-862c-af064d1a5292	{"action":"login","actor_id":"2434bdf0-a9bb-4666-882c-a3ccb6af1230","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-09 05:45:23.598248+00	
00000000-0000-0000-0000-000000000000	8e8511ab-392c-4cc5-b345-62413d0628b6	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"otherswayam@gmail.com","user_id":"2434bdf0-a9bb-4666-882c-a3ccb6af1230","user_phone":""}}	2025-08-09 05:47:19.492773+00	
00000000-0000-0000-0000-000000000000	c018a49e-9643-4492-a764-54bab014df4a	{"action":"user_signedup","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-09 05:53:37.130429+00	
00000000-0000-0000-0000-000000000000	b9dcdf8f-3c7f-478d-83c8-5bf1ac0a9f32	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-09 05:53:37.135255+00	
00000000-0000-0000-0000-000000000000	b670d2cf-0a62-4624-852c-bc55586cf04b	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-09 05:56:07.365605+00	
00000000-0000-0000-0000-000000000000	f46c2899-af82-4149-b31c-7cf23f7e27bc	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-09 05:56:14.562295+00	
00000000-0000-0000-0000-000000000000	ef29f909-1a82-4136-a203-128b1c7d6d6a	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-09 05:56:17.290984+00	
00000000-0000-0000-0000-000000000000	ddf462c5-0210-4748-a81a-28d33e481658	{"action":"user_signedup","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-09 05:56:52.518534+00	
00000000-0000-0000-0000-000000000000	11cb4617-ec3f-42a9-99d7-766ede377be5	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-09 05:56:52.524143+00	
00000000-0000-0000-0000-000000000000	013ce1d8-f7c5-41bd-bc38-e2091f2e26dd	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-09 05:56:57.796868+00	
00000000-0000-0000-0000-000000000000	2c04a03a-23c6-4bbf-8ba7-90eed0e47e9b	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-09 09:09:42.110473+00	
00000000-0000-0000-0000-000000000000	7994fa09-b460-450a-8164-eb1f0216ce55	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-09 09:10:06.633328+00	
00000000-0000-0000-0000-000000000000	a4b2bd81-01a6-45dd-8c54-07c5d601aeb1	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-09 09:10:17.968787+00	
00000000-0000-0000-0000-000000000000	037192d9-5512-4283-9fbd-db1d78fd95ed	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-09 09:20:57.38247+00	
00000000-0000-0000-0000-000000000000	c87f70f3-526b-43ed-8b7b-45882cd05459	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-09 09:48:29.511616+00	
00000000-0000-0000-0000-000000000000	52c22a61-5d7b-49ba-8aaa-55db5c93fbfb	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-09 10:25:04.122718+00	
00000000-0000-0000-0000-000000000000	3659a073-c1e5-46bd-b93d-ca4f71abf8ef	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-09 10:25:11.352809+00	
00000000-0000-0000-0000-000000000000	c3e19d82-a291-40f3-b099-4f45ceacc4fd	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-09 10:25:37.492674+00	
00000000-0000-0000-0000-000000000000	e7b3246d-00f6-47e8-a209-8284b892e2ed	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-09 10:25:44.314647+00	
00000000-0000-0000-0000-000000000000	2db67cc7-f9bb-40bd-9def-6e54bc5db4d2	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-09 10:26:21.470124+00	
00000000-0000-0000-0000-000000000000	d5ada2cd-e897-4867-a9c3-bc8973dde94d	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-09 10:26:27.522107+00	
00000000-0000-0000-0000-000000000000	fbf72766-fec0-4cb8-abb4-b3a964588492	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-09 11:06:33.348589+00	
00000000-0000-0000-0000-000000000000	4de6b710-94c8-45ad-aa0e-abd0221ffe79	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-09 11:06:42.51145+00	
00000000-0000-0000-0000-000000000000	0687d211-c028-4a20-9ef9-d8549c641339	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-09 11:15:08.756778+00	
00000000-0000-0000-0000-000000000000	bdb80c9d-1846-4619-a0aa-b4a012841fe6	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-09 11:15:19.774248+00	
00000000-0000-0000-0000-000000000000	56fd8c16-a20f-4474-a695-3aea90e6086f	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-09 11:26:10.662857+00	
00000000-0000-0000-0000-000000000000	284f1214-a507-44ca-9d99-629958dda886	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-09 11:26:28.785697+00	
00000000-0000-0000-0000-000000000000	fe72e0c3-be2f-4916-aa90-346e6c3a4183	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-09 11:30:29.74766+00	
00000000-0000-0000-0000-000000000000	c2c2ceb1-eaae-4eae-a339-ff65c1fbbfeb	{"action":"user_signedup","actor_id":"92f8b34e-5d38-4a2e-8efa-82770e56ab6b","actor_username":"bhavi@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-09 11:31:10.696295+00	
00000000-0000-0000-0000-000000000000	be19d9fd-c9ea-4e0d-b71b-a1ecfe3804a7	{"action":"login","actor_id":"92f8b34e-5d38-4a2e-8efa-82770e56ab6b","actor_username":"bhavi@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-09 11:31:10.70603+00	
00000000-0000-0000-0000-000000000000	2ab8a245-8d10-4624-8d12-e9cc14c66bfe	{"action":"logout","actor_id":"92f8b34e-5d38-4a2e-8efa-82770e56ab6b","actor_username":"bhavi@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-09 11:31:45.925905+00	
00000000-0000-0000-0000-000000000000	bf6603ad-9914-4e80-8ab2-0c524d6848ce	{"action":"user_signedup","actor_id":"89dfead4-22e9-4803-b481-075395f16cc2","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-09 11:33:35.444767+00	
00000000-0000-0000-0000-000000000000	aca68ff8-f646-45ae-91d0-fd2c5e1e6f4e	{"action":"login","actor_id":"89dfead4-22e9-4803-b481-075395f16cc2","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-09 11:33:35.453078+00	
00000000-0000-0000-0000-000000000000	43a45ff3-a618-40d5-8b81-59c90fa23bcd	{"action":"token_refreshed","actor_id":"89dfead4-22e9-4803-b481-075395f16cc2","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-09 12:55:54.346786+00	
00000000-0000-0000-0000-000000000000	07f9b43c-5b13-46cb-be5f-4bad525609e7	{"action":"token_revoked","actor_id":"89dfead4-22e9-4803-b481-075395f16cc2","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-09 12:55:54.367258+00	
00000000-0000-0000-0000-000000000000	214fb10f-48b7-4c64-a241-c975b65958ef	{"action":"logout","actor_id":"89dfead4-22e9-4803-b481-075395f16cc2","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-09 12:56:02.729042+00	
00000000-0000-0000-0000-000000000000	57ccf269-fd14-4a27-b2d8-3848bf520341	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-09 12:56:48.213617+00	
00000000-0000-0000-0000-000000000000	7400fbb4-935d-4caa-86ee-1261979189d8	{"action":"token_refreshed","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-09 16:53:43.490211+00	
00000000-0000-0000-0000-000000000000	4457825a-e20d-4a86-866f-62c8b3541379	{"action":"token_revoked","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-09 16:53:43.505889+00	
00000000-0000-0000-0000-000000000000	e30dd7f9-edf3-4792-990b-b8c2d4c70d46	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-09 16:53:53.853239+00	
00000000-0000-0000-0000-000000000000	57f7bfdc-cffc-4d43-81bb-a4e5aa94f2fe	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-09 16:54:08.679829+00	
00000000-0000-0000-0000-000000000000	8b750cdb-44ee-4776-8825-2e69d0c159e1	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-09 17:06:59.837871+00	
00000000-0000-0000-0000-000000000000	2734316a-18bf-490e-90ca-1978525a6ba9	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-09 17:07:08.131403+00	
00000000-0000-0000-0000-000000000000	1ac575d4-c1ce-4945-8039-e655e4d85ee6	{"action":"token_refreshed","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-10 08:12:23.213083+00	
00000000-0000-0000-0000-000000000000	706c5d6d-7c6a-4992-8cbd-bf9181e1a0b1	{"action":"token_revoked","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-10 08:12:23.226912+00	
00000000-0000-0000-0000-000000000000	cb7be8e0-2d4e-49bd-9021-41a9f28ba0bd	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-10 08:12:34.842866+00	
00000000-0000-0000-0000-000000000000	25b8d3ac-d96b-490f-ad87-efb960d469b6	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-10 08:12:41.322262+00	
00000000-0000-0000-0000-000000000000	96eb1226-9454-4a79-b07a-60f2c8f07038	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-10 08:12:44.985784+00	
00000000-0000-0000-0000-000000000000	ef00dfa5-798a-4e09-9faf-c5818cb01c43	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-10 08:12:53.347849+00	
00000000-0000-0000-0000-000000000000	6e524eca-91a4-489d-ac0b-a7820d490caa	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-10 08:13:23.407733+00	
00000000-0000-0000-0000-000000000000	4214d21f-43ed-4c50-863b-c4d8ba5915a9	{"action":"user_repeated_signup","actor_id":"89dfead4-22e9-4803-b481-075395f16cc2","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-08-10 08:13:41.666347+00	
00000000-0000-0000-0000-000000000000	5e90aaa7-f7f5-458f-9abd-ee5d8eb2c097	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"harsh@gmail.com","user_id":"89dfead4-22e9-4803-b481-075395f16cc2","user_phone":""}}	2025-08-10 08:14:29.597686+00	
00000000-0000-0000-0000-000000000000	9154d8b5-85ef-47bf-a396-d1ba6dacaef3	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"bhavi@gmail.com","user_id":"92f8b34e-5d38-4a2e-8efa-82770e56ab6b","user_phone":""}}	2025-08-10 08:14:29.621318+00	
00000000-0000-0000-0000-000000000000	433d5b8e-54ae-45dd-a782-34658f8e4025	{"action":"user_signedup","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-10 08:14:37.52531+00	
00000000-0000-0000-0000-000000000000	2f6f75e8-920f-4917-b28f-bc25462d590d	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-10 08:14:37.530965+00	
00000000-0000-0000-0000-000000000000	22906678-1894-4ab8-81f1-6152385c20d7	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-10 08:15:42.985313+00	
00000000-0000-0000-0000-000000000000	6d71beaf-18ae-4cd9-9fd4-331b2e38727c	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-10 08:15:50.90898+00	
00000000-0000-0000-0000-000000000000	0137c646-6109-4b37-9b93-ff455ec511b8	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-10 08:45:28.453862+00	
00000000-0000-0000-0000-000000000000	7dcc3c04-ef00-4fdb-885f-13446c2f320d	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-10 08:47:09.748985+00	
00000000-0000-0000-0000-000000000000	260fe592-6c08-44b2-9950-c85a5a0e3d4f	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"admin@playnation.com","user_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","user_phone":""}}	2025-08-10 08:50:46.558089+00	
00000000-0000-0000-0000-000000000000	94d2c959-1dc4-408a-b370-cb4dd81708cf	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-10 08:53:22.87314+00	
00000000-0000-0000-0000-000000000000	a4bf8ad5-e90d-4637-a709-5c6530e1cc97	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-10 08:53:30.885085+00	
00000000-0000-0000-0000-000000000000	f67a78f9-7400-4483-b7a9-a965a2d84847	{"action":"token_refreshed","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-08-10 10:59:22.41518+00	
00000000-0000-0000-0000-000000000000	ba429cb2-82de-4953-8137-b08a553aedfd	{"action":"token_revoked","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-08-10 10:59:22.450087+00	
00000000-0000-0000-0000-000000000000	c3f1914f-c977-4918-bb1f-a8b39f5919e9	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-08-10 11:08:29.29542+00	
00000000-0000-0000-0000-000000000000	85cd0b3c-2b5c-43e6-914c-0d78509a120e	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-10 11:08:42.431202+00	
00000000-0000-0000-0000-000000000000	15a213a2-874a-4dbf-ba75-cb35af4ee78c	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-10 11:14:29.383295+00	
00000000-0000-0000-0000-000000000000	6553b2eb-fb3f-4c16-9804-ec854b52361f	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-10 11:14:38.89559+00	
00000000-0000-0000-0000-000000000000	12f8855e-d8f9-400e-b8d4-0e57dfa11f42	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-10 11:36:36.535678+00	
00000000-0000-0000-0000-000000000000	4c1b252b-aca4-42fd-ae33-27b8a588b31a	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-10 11:36:48.987254+00	
00000000-0000-0000-0000-000000000000	cd4d417f-d585-4bbb-a257-a4d327d6d7b2	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-10 11:37:15.353955+00	
00000000-0000-0000-0000-000000000000	ee2af769-ed79-4615-9eeb-4e9ad872b851	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-10 11:37:40.810621+00	
00000000-0000-0000-0000-000000000000	f2a648ac-398d-4e0c-82cf-0a459c14a08d	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-10 11:37:48.605622+00	
00000000-0000-0000-0000-000000000000	6aadb280-32d0-4e64-b08f-a35faad9620c	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-10 11:43:42.933474+00	
00000000-0000-0000-0000-000000000000	49f51b02-1eaa-42e0-ba8f-8f982ebc291b	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-10 11:43:51.77006+00	
00000000-0000-0000-0000-000000000000	1ba682ce-2090-40bc-a699-5a68f1562436	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-10 11:57:31.121945+00	
00000000-0000-0000-0000-000000000000	8f8adb03-c1d8-46ca-ad6a-6b4a91f5ebda	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-10 11:57:43.100081+00	
00000000-0000-0000-0000-000000000000	e0c7fe40-1b15-492c-b3ae-74f1b910aee6	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-10 11:58:45.143297+00	
00000000-0000-0000-0000-000000000000	0b6e4665-f7fd-4a74-903f-9234af0fd601	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-10 11:58:54.767914+00	
00000000-0000-0000-0000-000000000000	2e037199-593a-488a-885e-364714183894	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-10 12:01:13.888886+00	
00000000-0000-0000-0000-000000000000	f75d4fe4-d49e-405a-8460-169af9f3961a	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-10 12:01:28.711133+00	
00000000-0000-0000-0000-000000000000	16fba219-488a-42ce-a525-c875956e660a	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-10 12:01:59.83047+00	
00000000-0000-0000-0000-000000000000	65dfdaf0-b2fc-446d-b9c5-25ad6296694f	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-10 12:02:08.773327+00	
00000000-0000-0000-0000-000000000000	c59437b0-eb86-43f7-b3a0-c1bfacce294c	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-10 12:05:12.307975+00	
00000000-0000-0000-0000-000000000000	c32ef087-930e-43df-ba46-a0f65aa6f273	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-10 12:05:20.20919+00	
00000000-0000-0000-0000-000000000000	b9cfa2ff-f353-442e-a73f-d638ad1978a4	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-10 12:06:30.929718+00	
00000000-0000-0000-0000-000000000000	72e2f90c-527c-4e62-a7d1-6795b4b3e2bd	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-10 12:09:10.309185+00	
00000000-0000-0000-0000-000000000000	388b099e-1089-4ede-b232-2a7dcfde25ef	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-10 12:09:23.594794+00	
00000000-0000-0000-0000-000000000000	9fbf1a67-beac-41fa-ac60-0de0b41b63e6	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-10 12:35:29.57901+00	
00000000-0000-0000-0000-000000000000	e6e2efa3-30cd-43ba-a5fb-87214935177f	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-10 12:35:39.684705+00	
00000000-0000-0000-0000-000000000000	1133ec30-31f9-433e-aff3-54bfc8170bdd	{"action":"token_refreshed","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-10 13:45:05.652132+00	
00000000-0000-0000-0000-000000000000	ebf3059a-ef4d-4807-bb9a-2e0af86bce5a	{"action":"token_revoked","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-10 13:45:05.682972+00	
00000000-0000-0000-0000-000000000000	582e817c-2701-4981-8177-6f95a31ede49	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-10 13:45:11.243997+00	
00000000-0000-0000-0000-000000000000	14104a86-70f2-4edb-b710-de69aefbed9e	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-10 13:46:01.682709+00	
00000000-0000-0000-0000-000000000000	d6ced81b-ebb6-47d4-8623-48e0f32d4cfa	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-10 13:46:37.922276+00	
00000000-0000-0000-0000-000000000000	d1349f69-62c6-4ef0-8017-cc548b8903c2	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-10 13:46:44.455168+00	
00000000-0000-0000-0000-000000000000	254dc92f-3169-4889-be28-548bfed1ee94	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-10 13:59:15.382666+00	
00000000-0000-0000-0000-000000000000	332daf6c-6242-4afa-9ea3-0bc63aab783a	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-10 13:59:24.159832+00	
00000000-0000-0000-0000-000000000000	b8bfff7d-2495-4cfa-86ef-0ab08baad703	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-10 14:11:38.414207+00	
00000000-0000-0000-0000-000000000000	d73e2645-69a4-4c8a-bfdc-14734f53af2e	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-10 14:11:44.842139+00	
00000000-0000-0000-0000-000000000000	b1b0e8e2-aecb-4dad-83a0-8297b06ab356	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-10 14:17:04.451553+00	
00000000-0000-0000-0000-000000000000	61605321-eb4a-4ddf-9746-5da84fab848f	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-10 14:17:12.01385+00	
00000000-0000-0000-0000-000000000000	e5e9fc40-9894-4a02-a40f-c9fd19271488	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-08-10 14:26:38.283243+00	
00000000-0000-0000-0000-000000000000	c4419db4-c587-48f9-9293-28952da13c0c	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-10 14:27:01.50052+00	
00000000-0000-0000-0000-000000000000	a78577a5-9c68-4441-8550-2c53ad186104	{"action":"token_refreshed","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-10 16:08:11.325538+00	
00000000-0000-0000-0000-000000000000	cab3adad-59ea-4c41-b109-fa89455b9236	{"action":"token_revoked","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-10 16:08:11.352401+00	
00000000-0000-0000-0000-000000000000	0d6b8ad9-77b2-40c0-ad77-c6a47b5ca23c	{"action":"token_refreshed","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-11 15:31:57.21645+00	
00000000-0000-0000-0000-000000000000	f71dcb9a-fe51-471e-9886-fff7e3fb531c	{"action":"token_revoked","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-11 15:31:57.240132+00	
00000000-0000-0000-0000-000000000000	b00ef223-ee05-4c96-80cc-0b1804edfccf	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 15:32:07.538698+00	
00000000-0000-0000-0000-000000000000	37954c33-8d08-4fa8-ae04-8afc6de81879	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 15:32:14.433929+00	
00000000-0000-0000-0000-000000000000	2f040887-4278-4a8c-8d03-76b79aefb927	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 15:50:45.818303+00	
00000000-0000-0000-0000-000000000000	26865cc9-7663-4209-a034-dcbd351b2701	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 15:50:54.243681+00	
00000000-0000-0000-0000-000000000000	214cd2e7-1532-4467-b549-835ff3658089	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 15:56:53.585455+00	
00000000-0000-0000-0000-000000000000	c8b7a31a-0fb0-44c5-9b39-bfd8647da2fd	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 15:57:04.10833+00	
00000000-0000-0000-0000-000000000000	0dc594e8-fdf2-40ef-ba7e-7d3f92aff2ee	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 16:13:42.586434+00	
00000000-0000-0000-0000-000000000000	a1c90f04-ced3-47b0-95ea-9c086e2fe1b9	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 16:18:49.446794+00	
00000000-0000-0000-0000-000000000000	093fe518-44f5-42ca-9e73-6dcfd93a80d7	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 16:58:53.207439+00	
00000000-0000-0000-0000-000000000000	2398fa1f-3c28-471a-9058-70a7170a664f	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 17:05:09.203994+00	
00000000-0000-0000-0000-000000000000	0e599ab4-e207-40a3-9c03-8f361d1aa018	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 17:05:15.091559+00	
00000000-0000-0000-0000-000000000000	7e4c85cd-b041-44b8-b01c-c14a002c0ab4	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 17:06:34.658303+00	
00000000-0000-0000-0000-000000000000	0789baf4-d197-4214-aca0-3e94ce23940e	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 17:06:47.54086+00	
00000000-0000-0000-0000-000000000000	894b82fd-50c5-4dd2-a060-db7f67afd80c	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 17:06:58.710422+00	
00000000-0000-0000-0000-000000000000	386c4f65-c96f-4d4e-87c5-0c01293af59c	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 17:07:00.107808+00	
00000000-0000-0000-0000-000000000000	81d1c27c-aeb3-4170-a214-5331d97a6bdc	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 17:07:16.49718+00	
00000000-0000-0000-0000-000000000000	19a2b90d-5ffa-461c-97cf-4c43b19ab444	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 17:07:40.618629+00	
00000000-0000-0000-0000-000000000000	571c64de-539f-4f24-8a8c-041e9c76f3fe	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 17:07:44.854073+00	
00000000-0000-0000-0000-000000000000	b4c89d32-617a-4695-a6a0-2c5279b41e9f	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 17:11:27.371463+00	
00000000-0000-0000-0000-000000000000	59eaf95a-7fb3-4741-b13d-490538adc6f5	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 17:11:42.991297+00	
00000000-0000-0000-0000-000000000000	35278b98-8e7e-4075-9add-5a384cdc195e	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 17:25:01.811409+00	
00000000-0000-0000-0000-000000000000	f24e15ae-9638-4fd0-85e6-72fbae76e353	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-12 07:25:43.721555+00	
00000000-0000-0000-0000-000000000000	1b7df587-3f06-4812-800d-e2608813d887	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-12 07:26:01.868261+00	
00000000-0000-0000-0000-000000000000	99dffa75-631a-4168-91db-96f95d03ace2	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-12 07:26:22.150277+00	
00000000-0000-0000-0000-000000000000	8635d54b-f9a7-44ae-8bbc-af2ec0169a82	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-12 07:27:38.316323+00	
00000000-0000-0000-0000-000000000000	be6054a9-4e43-4580-beb3-2516733a660d	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-14 08:51:06.936979+00	
00000000-0000-0000-0000-000000000000	93398530-da3e-47bd-be34-4028471dd6d5	{"action":"token_refreshed","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-14 15:55:55.589855+00	
00000000-0000-0000-0000-000000000000	2a63f84a-25b7-4a9f-932c-3aee29cc100b	{"action":"token_revoked","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-14 15:55:55.616759+00	
00000000-0000-0000-0000-000000000000	a62d658f-939c-4ced-a657-6b0be45103ef	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-14 15:58:32.88104+00	
00000000-0000-0000-0000-000000000000	ffc0399e-a30c-4ccd-add8-38b4cfbe3d74	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-14 15:58:48.803451+00	
00000000-0000-0000-0000-000000000000	de5c526d-4122-48b7-9135-d27313094dc5	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-14 16:01:44.808551+00	
00000000-0000-0000-0000-000000000000	ec4d7bcb-9702-4f60-af7a-168ac704ef37	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-14 16:01:55.693968+00	
00000000-0000-0000-0000-000000000000	920be3fa-6c40-422b-88d1-96fdba8e630b	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-14 16:02:17.159167+00	
00000000-0000-0000-0000-000000000000	86b45dc2-5aef-4691-817d-359f6fe946d4	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-14 16:02:38.246438+00	
00000000-0000-0000-0000-000000000000	9cc98041-b28d-4e9b-bb44-2d9d9c713b24	{"action":"token_refreshed","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-14 17:13:18.11544+00	
00000000-0000-0000-0000-000000000000	bea2a479-31aa-41b0-a672-fd8d8706049d	{"action":"token_revoked","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-14 17:13:18.134687+00	
00000000-0000-0000-0000-000000000000	16b1ff8b-72f2-43c0-8bc3-4c73009dc0b7	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-14 17:16:22.187576+00	
00000000-0000-0000-0000-000000000000	0f94144e-2596-4c9b-b783-e65e1aa5e137	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-14 17:16:46.562578+00	
00000000-0000-0000-0000-000000000000	d758f874-bb5d-4afd-8a3b-4be07e8a60e0	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-14 17:17:12.802617+00	
00000000-0000-0000-0000-000000000000	c077912a-aaed-4455-bf7c-c68d40210fdb	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-14 17:17:27.997375+00	
00000000-0000-0000-0000-000000000000	76e7220d-286d-40ce-b2fa-9abc68af3228	{"action":"token_refreshed","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-14 18:17:46.410013+00	
00000000-0000-0000-0000-000000000000	e7071258-f667-452c-9590-cb9b237bb478	{"action":"token_revoked","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-14 18:17:46.420771+00	
00000000-0000-0000-0000-000000000000	ef9f9021-88c2-4ddf-8f35-d1fde185924f	{"action":"token_refreshed","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-15 07:27:03.318351+00	
00000000-0000-0000-0000-000000000000	539519c8-d4f2-41c9-afc2-2f75581eb4cc	{"action":"token_revoked","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-15 07:27:03.345068+00	
00000000-0000-0000-0000-000000000000	2ae0e287-1929-47f3-99ea-da39b9603bd3	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-15 08:12:37.94083+00	
00000000-0000-0000-0000-000000000000	6c9fa021-58bb-484b-9f7d-bc31f4707574	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-15 08:12:47.218061+00	
00000000-0000-0000-0000-000000000000	1ab0474b-f8b3-43f1-bca7-de941d4795db	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-15 08:40:10.630358+00	
00000000-0000-0000-0000-000000000000	10d21217-c464-4f40-866e-0e2daf083d25	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-15 08:40:17.268412+00	
00000000-0000-0000-0000-000000000000	b7ff22dd-dd8c-40aa-b720-fe522e5a6b65	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-15 08:40:58.029383+00	
00000000-0000-0000-0000-000000000000	a70c128c-ec04-4ef7-8dea-d17352089da7	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-15 08:41:11.195849+00	
00000000-0000-0000-0000-000000000000	115b65ff-2a2c-42b8-ab9e-4ef253416f5d	{"action":"token_refreshed","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-16 08:36:50.883378+00	
00000000-0000-0000-0000-000000000000	db59ce4f-2de9-44fa-89ed-d08eaa3b7e81	{"action":"token_revoked","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-16 08:36:50.918284+00	
00000000-0000-0000-0000-000000000000	5524b2ff-7833-43a4-b5f3-1c0441907efc	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-16 08:37:46.259177+00	
00000000-0000-0000-0000-000000000000	283201f8-8f1f-4b0a-b590-39c48a703b5e	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-16 08:37:55.655248+00	
00000000-0000-0000-0000-000000000000	4f522b4b-eca4-4150-b09f-28f680dc6022	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-16 08:38:20.486799+00	
00000000-0000-0000-0000-000000000000	45b00b3a-462c-492e-8c50-bfa5240c577c	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-16 08:38:27.405508+00	
00000000-0000-0000-0000-000000000000	91628c7c-de42-4373-ac17-d7d56d59deb6	{"action":"token_refreshed","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-16 09:38:40.105152+00	
00000000-0000-0000-0000-000000000000	7c2f0a00-df72-46c6-a05d-3ca244248e86	{"action":"token_revoked","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-16 09:38:40.116801+00	
00000000-0000-0000-0000-000000000000	0354a06b-5f65-42e5-b5ff-daf7c8045745	{"action":"token_refreshed","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-16 11:38:39.929573+00	
00000000-0000-0000-0000-000000000000	dd3795b2-37b9-4c0e-a60e-1d5f88976594	{"action":"token_revoked","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-16 11:38:39.954402+00	
00000000-0000-0000-0000-000000000000	15569cae-d6f9-42b3-8169-04dc4c8dd5e2	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-16 11:48:50.741141+00	
00000000-0000-0000-0000-000000000000	1c77a54b-3c99-4ba0-845d-d17740a3bcc2	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-16 11:49:03.031922+00	
00000000-0000-0000-0000-000000000000	a4f07e12-6e69-45fe-a3c6-3fd9622e2279	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-16 11:57:25.877957+00	
00000000-0000-0000-0000-000000000000	8e3e3760-ce27-43bd-84c6-5f79a62f3500	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-16 11:57:32.805092+00	
00000000-0000-0000-0000-000000000000	d81087dd-617d-4bf9-a98f-98f375599ae8	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-16 11:59:06.664485+00	
00000000-0000-0000-0000-000000000000	900b6eb4-9e42-492a-b51c-f97e2fba3922	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-16 11:59:24.646372+00	
00000000-0000-0000-0000-000000000000	bce77713-dc1f-4349-b73b-babd338f7598	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-16 12:00:15.504425+00	
00000000-0000-0000-0000-000000000000	4f8dba03-c8cf-4b20-84f0-6fd1d5016eda	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-16 12:00:39.672238+00	
00000000-0000-0000-0000-000000000000	9faa6b0a-621a-4a82-934e-9ac7db0804ef	{"action":"token_refreshed","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-17 08:48:36.368499+00	
00000000-0000-0000-0000-000000000000	33de8359-89e4-447d-8361-d09059261aa4	{"action":"token_revoked","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-17 08:48:36.395855+00	
00000000-0000-0000-0000-000000000000	b3943a71-30b0-4c8f-8cec-f73cd04e9e87	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-17 08:48:42.397599+00	
00000000-0000-0000-0000-000000000000	2097fca1-35d7-43e4-ac15-77e7b83f7252	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-17 09:47:15.913319+00	
00000000-0000-0000-0000-000000000000	18970fe5-7ea5-424d-a0b5-40070faf568e	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-17 09:47:34.663116+00	
00000000-0000-0000-0000-000000000000	e1a5987b-45e1-42c7-a0b5-32a10634aaf6	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-17 09:47:39.022935+00	
00000000-0000-0000-0000-000000000000	577dd604-6931-4d89-946c-203a52544154	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-17 09:50:25.046379+00	
00000000-0000-0000-0000-000000000000	4456a17a-31df-4207-bcd1-791697ccdc1b	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-17 10:09:14.534134+00	
00000000-0000-0000-0000-000000000000	e7edf313-ad18-4ec4-a7c6-9a57798fb5fb	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-17 10:18:51.968362+00	
00000000-0000-0000-0000-000000000000	1af9b4cc-8cd2-4f16-85a9-259d7407c01f	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-17 10:19:03.596871+00	
00000000-0000-0000-0000-000000000000	78fe35f4-67e7-4290-a5ca-74ac54397a0f	{"action":"token_refreshed","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-20 08:46:41.524029+00	
00000000-0000-0000-0000-000000000000	16ce8b05-f251-4986-a8b7-045119ac6295	{"action":"token_revoked","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-20 08:46:41.556874+00	
00000000-0000-0000-0000-000000000000	8c7a8a14-6ae0-4f61-a098-7c8d7168ffe2	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-20 08:47:12.525536+00	
00000000-0000-0000-0000-000000000000	3a42a56f-e8b1-496a-8323-5e4e82a2001d	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-20 08:47:20.1406+00	
00000000-0000-0000-0000-000000000000	9e7cbea3-e3c1-41a7-9669-accc3e8013bc	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-20 08:48:11.309273+00	
00000000-0000-0000-0000-000000000000	ce2cac5f-ba03-4637-b19c-d231939e3f42	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-20 08:48:55.315623+00	
00000000-0000-0000-0000-000000000000	34023bfa-7684-4c53-8567-416e25d3dfea	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-20 08:50:21.682984+00	
00000000-0000-0000-0000-000000000000	f1866c26-8421-40e4-9923-0e1e853626de	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-21 03:47:15.769593+00	
00000000-0000-0000-0000-000000000000	147fb0ba-5e35-4a25-b3b9-bc2118f206d6	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-21 03:49:14.326879+00	
00000000-0000-0000-0000-000000000000	f9f9a2e3-7fc6-45cf-b7ed-06f77a029386	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-21 03:49:35.720031+00	
00000000-0000-0000-0000-000000000000	867754f6-c2ca-4b69-90e5-0e53bfc6d12c	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-21 04:26:52.634255+00	
00000000-0000-0000-0000-000000000000	c509944f-83ea-441c-8810-5fde2a378e9d	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-21 04:26:57.197426+00	
00000000-0000-0000-0000-000000000000	ae5ea343-3d02-494d-b732-82775a787918	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-21 04:28:36.56393+00	
00000000-0000-0000-0000-000000000000	3fa087ef-d969-4d19-9b1d-031aa328a4fc	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-21 04:29:10.953192+00	
00000000-0000-0000-0000-000000000000	ae784c4e-ce85-4215-ba06-7c82d43db5f1	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-21 04:31:18.169057+00	
00000000-0000-0000-0000-000000000000	6f10441b-c11e-4105-ac4d-50bb269ad129	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-21 04:31:21.652189+00	
00000000-0000-0000-0000-000000000000	08808b1b-b86c-4a39-8f54-67a2b754db45	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-21 04:32:50.52955+00	
00000000-0000-0000-0000-000000000000	e26534b0-7810-48b6-ac19-fd8dacc72e5d	{"action":"user_signedup","actor_id":"364406a0-59ad-4fbe-b42c-9adfee2e27da","actor_username":"heer@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-21 04:57:53.656545+00	
00000000-0000-0000-0000-000000000000	e7ecd9c7-e0aa-45d9-b726-0f4e09a42e96	{"action":"login","actor_id":"364406a0-59ad-4fbe-b42c-9adfee2e27da","actor_username":"heer@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-21 04:57:53.689694+00	
00000000-0000-0000-0000-000000000000	05900480-84e7-4615-8db9-967c58c86c58	{"action":"logout","actor_id":"364406a0-59ad-4fbe-b42c-9adfee2e27da","actor_username":"heer@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-21 05:08:54.513143+00	
00000000-0000-0000-0000-000000000000	49df7c5d-4850-418f-ad8b-100ad0c228ec	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-21 05:09:13.652251+00	
00000000-0000-0000-0000-000000000000	ee66f668-e02a-4a53-badb-ad2aee91265b	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-21 05:10:28.397878+00	
00000000-0000-0000-0000-000000000000	12875f2f-d640-4cf5-aa60-8351571df12f	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-21 17:10:56.632019+00	
00000000-0000-0000-0000-000000000000	ff605585-0619-4410-8b1f-6972f867d433	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-21 17:18:46.674753+00	
00000000-0000-0000-0000-000000000000	552a7aef-b6d6-424c-90e9-0c47dd643f4c	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-21 17:19:01.972138+00	
00000000-0000-0000-0000-000000000000	22f561f2-593d-46e2-b99c-9e31b909e689	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-21 17:19:20.694884+00	
00000000-0000-0000-0000-000000000000	a74174d5-dffb-4488-b9c2-68e8ab6f6998	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-21 17:19:28.836255+00	
00000000-0000-0000-0000-000000000000	ac7d2271-c046-408d-b070-22d353a9691d	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-21 17:30:03.83923+00	
00000000-0000-0000-0000-000000000000	9343d0c3-6110-4f07-98da-871b0de7ab7c	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-21 17:30:38.282847+00	
00000000-0000-0000-0000-000000000000	5cea00c7-8dbf-427f-b551-891a56c0cc9d	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-21 17:31:24.905824+00	
00000000-0000-0000-0000-000000000000	f614dab8-dfbf-4283-a0f3-eec276d7aac5	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-21 17:31:31.857643+00	
00000000-0000-0000-0000-000000000000	daddc085-eb87-4c7e-86d9-ecc01e05895c	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-21 17:31:37.982979+00	
00000000-0000-0000-0000-000000000000	ef8fe649-9fd6-440d-9009-4acc6dc1d83c	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-21 17:31:54.621702+00	
00000000-0000-0000-0000-000000000000	7bfadb58-f3f8-46b5-a027-49e1f17efdfd	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-21 17:32:44.042066+00	
00000000-0000-0000-0000-000000000000	0ea25a6a-735e-4307-9008-db264e43f4e5	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-21 17:32:52.711941+00	
00000000-0000-0000-0000-000000000000	3133ef68-ccb7-4f61-a2cb-bf93752f28d1	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-21 17:37:47.214064+00	
00000000-0000-0000-0000-000000000000	b9cbeab7-3cc3-44ef-994c-229c3ef82a4c	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-21 17:37:54.185806+00	
00000000-0000-0000-0000-000000000000	e12d6dc7-7446-4b08-8fe2-c93481aec49e	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-21 17:38:17.840721+00	
00000000-0000-0000-0000-000000000000	910aac0e-eecd-4bbc-a798-75999e64e7da	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-21 17:38:30.738134+00	
00000000-0000-0000-0000-000000000000	ca874b59-2604-43eb-b956-f76a423f2fda	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-21 17:39:04.550929+00	
00000000-0000-0000-0000-000000000000	cb7adea3-cd0d-42ca-9fb4-ecc55d9a91a3	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-21 17:39:16.687982+00	
00000000-0000-0000-0000-000000000000	b72e61ec-389e-4820-aaca-8160083ba637	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-21 17:39:27.433404+00	
00000000-0000-0000-0000-000000000000	a6ad2576-7544-4dfb-a4a5-dff1ee51eb75	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-21 17:39:35.084963+00	
00000000-0000-0000-0000-000000000000	a7692bdf-036c-4b7c-8137-8da1ae9e92d5	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-21 17:57:55.260949+00	
00000000-0000-0000-0000-000000000000	98d3aaec-df76-4bd1-a02b-32436abcef86	{"action":"user_repeated_signup","actor_id":"364406a0-59ad-4fbe-b42c-9adfee2e27da","actor_username":"heer@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-08-21 17:58:30.354254+00	
00000000-0000-0000-0000-000000000000	417dd125-ca48-4803-a7ef-a25b5b931bd6	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"heer@gmail.com","user_id":"364406a0-59ad-4fbe-b42c-9adfee2e27da","user_phone":""}}	2025-08-21 17:58:43.168933+00	
00000000-0000-0000-0000-000000000000	85e64d8f-2650-4b95-8a7c-2ed252540225	{"action":"user_signedup","actor_id":"e29e3e2d-7b33-494c-acb5-c905a365f605","actor_username":"heer@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-21 17:58:54.263666+00	
00000000-0000-0000-0000-000000000000	c28f9ecf-9331-4b50-accc-9bf14ccce5d0	{"action":"login","actor_id":"e29e3e2d-7b33-494c-acb5-c905a365f605","actor_username":"heer@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-21 17:58:54.267727+00	
00000000-0000-0000-0000-000000000000	7af2e099-4a09-4294-9e96-d5e9ffbd8c07	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"heer@gmail.com","user_id":"e29e3e2d-7b33-494c-acb5-c905a365f605","user_phone":""}}	2025-08-21 18:12:10.798573+00	
00000000-0000-0000-0000-000000000000	229d4889-9ecf-424a-8613-01a6b43ece11	{"action":"user_signedup","actor_id":"04464571-dbc4-4785-9cd8-7caad9434225","actor_username":"heer@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-21 18:20:45.182719+00	
00000000-0000-0000-0000-000000000000	7c000ff5-48de-4757-8297-ef565543b733	{"action":"login","actor_id":"04464571-dbc4-4785-9cd8-7caad9434225","actor_username":"heer@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-21 18:20:45.193836+00	
00000000-0000-0000-0000-000000000000	f77822ce-d28e-418b-937c-9988d4fe7a77	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-22 03:58:15.404353+00	
00000000-0000-0000-0000-000000000000	d766e46c-8af2-4a99-a89f-844c6b762bc7	{"action":"token_refreshed","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-22 04:56:48.768426+00	
00000000-0000-0000-0000-000000000000	043d5885-86c7-4e1b-b759-e643db60e63c	{"action":"token_revoked","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-22 04:56:48.791146+00	
00000000-0000-0000-0000-000000000000	78fd1edf-544a-44e4-96ea-9653d0259d6f	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-22 04:57:15.67763+00	
00000000-0000-0000-0000-000000000000	248bfe25-996b-4c4d-8284-0b18023754dc	{"action":"user_signedup","actor_id":"06649c5c-dead-4d9f-88ed-7c87bb28b7ec","actor_username":"piyu@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-22 05:22:21.236547+00	
00000000-0000-0000-0000-000000000000	8e6fd58b-561f-45bf-ba94-cd9e951069cf	{"action":"login","actor_id":"06649c5c-dead-4d9f-88ed-7c87bb28b7ec","actor_username":"piyu@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-22 05:22:21.25816+00	
00000000-0000-0000-0000-000000000000	488f68d1-8c44-4310-8208-4cf41cf2704a	{"action":"user_repeated_signup","actor_id":"06649c5c-dead-4d9f-88ed-7c87bb28b7ec","actor_username":"piyu@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-08-22 05:28:18.026722+00	
00000000-0000-0000-0000-000000000000	7e53f082-dbe5-4349-9846-0353a66c375a	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"heer@gmail.com","user_id":"04464571-dbc4-4785-9cd8-7caad9434225","user_phone":""}}	2025-08-22 05:29:45.384156+00	
00000000-0000-0000-0000-000000000000	485a8eb0-15e6-45f7-8089-e8aff8ddbfc3	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"piyu@gmail.com","user_id":"06649c5c-dead-4d9f-88ed-7c87bb28b7ec","user_phone":""}}	2025-08-22 05:29:45.507682+00	
00000000-0000-0000-0000-000000000000	b9e98b74-b7e5-44ff-a5e6-1af41b01ce0a	{"action":"user_signedup","actor_id":"008fc7f7-3e0b-45de-8d63-67be40048896","actor_username":"piyu@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-22 05:29:51.63184+00	
00000000-0000-0000-0000-000000000000	b3d4ca59-6ba9-49f5-bf6e-4fdfd9c647e4	{"action":"login","actor_id":"008fc7f7-3e0b-45de-8d63-67be40048896","actor_username":"piyu@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-22 05:29:51.638141+00	
00000000-0000-0000-0000-000000000000	ed961f95-1e83-4232-85a4-05e193730a9e	{"action":"logout","actor_id":"008fc7f7-3e0b-45de-8d63-67be40048896","actor_username":"piyu@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-22 05:32:56.92874+00	
00000000-0000-0000-0000-000000000000	88c21933-b168-426a-a282-b0004f670f63	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-22 05:33:21.383207+00	
00000000-0000-0000-0000-000000000000	2335b26a-a5e2-46be-98e5-f43ee6c32995	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"piyu@gmail.com","user_id":"008fc7f7-3e0b-45de-8d63-67be40048896","user_phone":""}}	2025-08-22 05:36:26.061769+00	
00000000-0000-0000-0000-000000000000	a676f9b3-0947-463c-b465-f5435435c1a9	{"action":"user_signedup","actor_id":"b132e528-6102-43e1-ab08-43ca9971e895","actor_username":"heer@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-22 06:02:13.364687+00	
00000000-0000-0000-0000-000000000000	0a6cdc0b-8faa-46ef-b36f-b24cb8b4fa11	{"action":"login","actor_id":"b132e528-6102-43e1-ab08-43ca9971e895","actor_username":"heer@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-22 06:02:13.392297+00	
00000000-0000-0000-0000-000000000000	06c4fc3a-ec73-4eee-9c58-86827cb11cc4	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"heer@gmail.com","user_id":"b132e528-6102-43e1-ab08-43ca9971e895","user_phone":""}}	2025-08-22 06:06:21.956421+00	
00000000-0000-0000-0000-000000000000	3ee5d908-7679-4349-a45f-2e81888bb479	{"action":"user_signedup","actor_id":"c894af28-d8c7-4514-bd13-4afa96febaeb","actor_username":"heer@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-22 06:06:54.829702+00	
00000000-0000-0000-0000-000000000000	51aa0d4d-267b-4d0f-a3da-de68ec3a8f5c	{"action":"login","actor_id":"c894af28-d8c7-4514-bd13-4afa96febaeb","actor_username":"heer@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-22 06:06:54.834819+00	
00000000-0000-0000-0000-000000000000	cfdf9b52-122d-4d0e-b4db-6f62d7120bb0	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"heer@gmail.com","user_id":"c894af28-d8c7-4514-bd13-4afa96febaeb","user_phone":""}}	2025-08-22 06:07:50.653853+00	
00000000-0000-0000-0000-000000000000	d771678b-15a2-4ccd-8d00-dd56eca37032	{"action":"token_refreshed","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-22 06:57:09.403556+00	
00000000-0000-0000-0000-000000000000	7ec68ba4-e364-4fc8-8c7a-00064d664950	{"action":"token_revoked","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-22 06:57:09.432212+00	
00000000-0000-0000-0000-000000000000	a659cc57-eede-40e7-97d0-b297d64e53f5	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-22 06:57:16.782357+00	
00000000-0000-0000-0000-000000000000	86249354-3d07-4bbb-945f-fb6f16d81e0b	{"action":"user_signedup","actor_id":"7ef72ca4-3e98-4324-9bef-abcb5b40252e","actor_username":"het@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-22 07:28:04.460992+00	
00000000-0000-0000-0000-000000000000	3c39e6f3-759a-48d3-854d-f44509e09be7	{"action":"login","actor_id":"7ef72ca4-3e98-4324-9bef-abcb5b40252e","actor_username":"het@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-22 07:28:04.485984+00	
00000000-0000-0000-0000-000000000000	3e99072a-e455-4d2b-98ed-c0b7a6eb0b78	{"action":"logout","actor_id":"7ef72ca4-3e98-4324-9bef-abcb5b40252e","actor_username":"het@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-22 07:28:39.43834+00	
00000000-0000-0000-0000-000000000000	e64be60e-497d-41e5-836d-7e0b0188a238	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-22 07:28:47.111382+00	
00000000-0000-0000-0000-000000000000	6be2dc55-d0b6-470d-8ca5-3a049cc32a73	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-22 07:31:08.724418+00	
00000000-0000-0000-0000-000000000000	a4be1bcd-d48b-4fd2-9bc5-908b4192ca03	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-22 07:31:23.824171+00	
00000000-0000-0000-0000-000000000000	13b65c3e-dbd4-4184-ba39-9e6800298b42	{"action":"token_refreshed","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-23 09:13:34.848845+00	
00000000-0000-0000-0000-000000000000	1c020813-8161-49ae-ba6d-4b05e3573249	{"action":"token_revoked","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-23 09:13:34.880423+00	
00000000-0000-0000-0000-000000000000	62b8ed57-648b-4336-a785-bb97a48f2eba	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-25 09:58:18.416102+00	
00000000-0000-0000-0000-000000000000	75ed9f6c-64bf-403b-a3ef-5b296da65485	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-25 10:00:08.710772+00	
00000000-0000-0000-0000-000000000000	62dcae1a-6fd5-4d7a-b1be-fa09b02e5c8b	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-26 07:10:13.360349+00	
00000000-0000-0000-0000-000000000000	df7ca38e-eccf-48be-9018-b7e2f3ad744b	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-26 07:10:35.786222+00	
00000000-0000-0000-0000-000000000000	7ca0535b-47d0-4ac4-9117-490431ad1f62	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-26 07:10:46.471167+00	
00000000-0000-0000-0000-000000000000	5edeb636-b330-46d2-9823-1c1e461d17d0	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-26 07:11:30.977031+00	
00000000-0000-0000-0000-000000000000	913655a5-3bf3-4dd9-939a-2b947be19036	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-26 07:23:35.682047+00	
00000000-0000-0000-0000-000000000000	4a179a8b-5503-4fb8-94c5-014b2c8bb51c	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-26 07:25:54.348269+00	
00000000-0000-0000-0000-000000000000	cb9488fd-f3e9-4879-8127-f5b9623bce15	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-26 07:26:18.328733+00	
00000000-0000-0000-0000-000000000000	d1ad3abd-15e0-4f3b-87a2-45014f0b5c9f	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-26 07:33:50.736679+00	
00000000-0000-0000-0000-000000000000	5081999d-4914-4587-82ad-436435effdb4	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-26 07:34:10.357394+00	
00000000-0000-0000-0000-000000000000	b187c816-aa4e-4ec2-b053-fe800bf5ab55	{"action":"token_refreshed","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-26 16:39:15.018848+00	
00000000-0000-0000-0000-000000000000	25bb8027-a3ee-4d61-af13-273f51e1f12e	{"action":"token_revoked","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-26 16:39:15.047321+00	
00000000-0000-0000-0000-000000000000	2191789e-560e-41de-8350-1675b9a72942	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-26 16:39:26.96444+00	
00000000-0000-0000-0000-000000000000	88846c88-dee3-4ef1-b49e-4961aa006e68	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-26 16:39:35.187805+00	
00000000-0000-0000-0000-000000000000	14d61292-7f93-48bc-bb25-828450f172f5	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-26 16:39:36.926155+00	
00000000-0000-0000-0000-000000000000	b398bc16-ca6a-4933-b225-5f7b74bd85ef	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-26 16:39:53.209424+00	
00000000-0000-0000-0000-000000000000	769b9e3d-35cb-4725-b241-7abd91120092	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-26 16:40:09.848226+00	
00000000-0000-0000-0000-000000000000	ac35d6e0-6bc7-4edd-97ed-2ed24517bbba	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-26 16:40:18.649831+00	
00000000-0000-0000-0000-000000000000	e643dbb3-6132-44d8-b302-be5879d1f41f	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-26 16:42:24.657442+00	
00000000-0000-0000-0000-000000000000	cbd3664c-5960-416c-ba30-aab3967e282b	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-29 13:56:46.718324+00	
00000000-0000-0000-0000-000000000000	6904b22c-e47e-4e7f-8270-d5b4f88ed6df	{"action":"token_refreshed","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-29 14:55:15.205326+00	
00000000-0000-0000-0000-000000000000	c86734c5-6e98-4a1e-ac5c-9282310b79a0	{"action":"token_revoked","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-29 14:55:15.224215+00	
00000000-0000-0000-0000-000000000000	25662296-e483-4bdb-84c7-98672dc26027	{"action":"token_refreshed","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-29 15:56:23.507725+00	
00000000-0000-0000-0000-000000000000	3af19800-81e1-41db-8c77-c18b87ad579e	{"action":"token_revoked","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-29 15:56:23.520214+00	
00000000-0000-0000-0000-000000000000	00f7b26b-a1a5-490f-ba0e-1931d80bcda3	{"action":"token_refreshed","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-30 11:30:23.359527+00	
00000000-0000-0000-0000-000000000000	c3c2c457-17ae-4536-bdb0-c7eb27b4d5d1	{"action":"token_revoked","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-30 11:30:23.389446+00	
00000000-0000-0000-0000-000000000000	b6174cae-04a2-4f0b-820f-3c6e2ac5387d	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-30 11:35:24.534725+00	
00000000-0000-0000-0000-000000000000	9ee58d85-69f9-41b6-83ad-e52bdf529e44	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-30 11:38:20.397329+00	
00000000-0000-0000-0000-000000000000	c7133032-6a9f-4306-8787-e88dc7499741	{"action":"token_refreshed","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-30 16:28:18.126751+00	
00000000-0000-0000-0000-000000000000	68bd929d-be5b-4b7b-aace-8f30f55607f5	{"action":"token_revoked","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-30 16:28:18.15016+00	
00000000-0000-0000-0000-000000000000	87fb07ab-958d-435a-a285-2af7b58e0771	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-30 16:28:56.63149+00	
00000000-0000-0000-0000-000000000000	7495b7f5-4259-4a07-9f58-1bcab72ed6b1	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-30 16:29:04.875761+00	
00000000-0000-0000-0000-000000000000	a0b81ee1-e976-41a6-b027-44969b94d530	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-30 16:44:11.216041+00	
00000000-0000-0000-0000-000000000000	bc8143f1-4635-404a-a924-1d24f231663a	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-30 16:44:20.742924+00	
00000000-0000-0000-0000-000000000000	4c9fb698-e95c-485d-b681-816113645cb3	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-30 16:52:01.628301+00	
00000000-0000-0000-0000-000000000000	21f7f486-dc4b-435f-a957-73b05dde2df1	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-30 16:52:09.387399+00	
00000000-0000-0000-0000-000000000000	9ef19641-a3ce-4fe9-908b-b01e9a46dbc3	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-30 16:53:01.968789+00	
00000000-0000-0000-0000-000000000000	37fe20a0-d340-4456-9807-59d9b75b6867	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-30 16:53:10.723198+00	
00000000-0000-0000-0000-000000000000	b8f7391e-c5a0-4194-9784-e102a4661e34	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-30 17:19:42.857684+00	
00000000-0000-0000-0000-000000000000	c864eca9-11d9-4c3d-950a-705310406538	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-30 17:19:50.979542+00	
00000000-0000-0000-0000-000000000000	343f1536-836c-4b75-b06b-58f6db8978e0	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-30 17:44:17.922847+00	
00000000-0000-0000-0000-000000000000	acf99c2a-ae13-45ce-aacc-c0e2c21f8992	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-30 17:44:24.314839+00	
00000000-0000-0000-0000-000000000000	0189f78a-1a3e-4138-9206-992432490ad6	{"action":"token_refreshed","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-31 17:11:49.065387+00	
00000000-0000-0000-0000-000000000000	e95cfb85-0964-4dc4-a6d8-38fa768e481f	{"action":"token_revoked","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-08-31 17:11:49.080699+00	
00000000-0000-0000-0000-000000000000	6d5a28f2-1f50-4294-9e40-6cdb66f59c38	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-31 17:16:05.847645+00	
00000000-0000-0000-0000-000000000000	8bfe8096-c7b0-42a4-bdad-c8143b627f7f	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-31 17:16:12.38536+00	
00000000-0000-0000-0000-000000000000	26eee882-83d5-41a4-81f8-859942b2e54b	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-31 17:17:22.329364+00	
00000000-0000-0000-0000-000000000000	ebca5757-88b2-4f55-906e-48ae8446142d	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-31 17:19:10.377013+00	
00000000-0000-0000-0000-000000000000	005270d5-1760-4a18-835d-8c11eb70ddc4	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-31 17:19:39.783763+00	
00000000-0000-0000-0000-000000000000	4d22e3fe-9aa3-4fe6-8f84-34971ceac0d7	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-31 17:19:46.568035+00	
00000000-0000-0000-0000-000000000000	9bb45c15-770f-44ff-b784-92c502271d72	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-31 17:26:05.2108+00	
00000000-0000-0000-0000-000000000000	5fd861bc-1f67-4770-bef8-cbe326157db1	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-31 17:26:11.145947+00	
00000000-0000-0000-0000-000000000000	19f9cca1-7d56-4955-b350-20e93337bd5d	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-31 17:27:45.949682+00	
00000000-0000-0000-0000-000000000000	e312c3e2-18b2-4cb3-b788-055e630ff2dc	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-31 17:31:09.664203+00	
00000000-0000-0000-0000-000000000000	eb1e18bd-69fe-4d8c-b6c9-558343082865	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-08-31 17:31:24.368968+00	
00000000-0000-0000-0000-000000000000	a05d6ec9-bdd2-4835-8bb8-a7fc8313dde9	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-01 15:41:03.081026+00	
00000000-0000-0000-0000-000000000000	3287b515-4229-440a-a32f-459ebd8a9639	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-01 16:07:12.169268+00	
00000000-0000-0000-0000-000000000000	0efc210a-6590-45a6-8d3f-e3081384380c	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-01 16:08:39.333021+00	
00000000-0000-0000-0000-000000000000	7fb270b4-e92e-4ab7-8a7e-f6ea81211f6f	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-01 16:09:56.363664+00	
00000000-0000-0000-0000-000000000000	54ca6fd0-c034-4794-a2fb-608b7e5c030c	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-01 16:09:59.625881+00	
00000000-0000-0000-0000-000000000000	07578dbc-4a91-4386-aefe-845a321162e3	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 17:21:44.162176+00	
00000000-0000-0000-0000-000000000000	e0f7a2c0-4640-4c68-8a09-a8ae7d83405d	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-02 17:23:01.26558+00	
00000000-0000-0000-0000-000000000000	234b42b4-68fd-4ddf-9879-26a6423e8be5	{"action":"token_refreshed","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-03 14:39:20.638078+00	
00000000-0000-0000-0000-000000000000	05a5fb9d-253c-4582-b4a2-5db9860f53cc	{"action":"token_revoked","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-03 14:39:20.670535+00	
00000000-0000-0000-0000-000000000000	3f7211ea-6dec-4b67-ae8e-5ac855daa34c	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-03 14:39:30.917823+00	
00000000-0000-0000-0000-000000000000	a3b7d48d-8875-47c2-8396-2b545c10c0fb	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-03 16:59:39.005426+00	
00000000-0000-0000-0000-000000000000	1093a400-662c-4acc-991f-dd202e05fc7c	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-03 17:02:49.597157+00	
00000000-0000-0000-0000-000000000000	ae88cfe6-db74-4987-8a8f-da5b6300d072	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-03 17:11:42.070699+00	
00000000-0000-0000-0000-000000000000	d33dcc78-b29a-4fa2-af97-39542782269f	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-03 17:11:47.993443+00	
00000000-0000-0000-0000-000000000000	3e965aef-6315-42bf-b7bf-742156f3099e	{"action":"token_refreshed","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-04 13:54:01.182343+00	
00000000-0000-0000-0000-000000000000	60913d81-0a4a-425d-a3ac-954d115e6c66	{"action":"token_revoked","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-04 13:54:01.210255+00	
00000000-0000-0000-0000-000000000000	cb34b4b6-e16b-4087-987d-6d5e2ba3eddf	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-04 13:54:46.558946+00	
00000000-0000-0000-0000-000000000000	be638f2e-7caf-46de-a452-ab7e829ecff5	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-04 13:55:20.620905+00	
00000000-0000-0000-0000-000000000000	7e2a4c35-5159-492d-a611-7d41298c3397	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-04 14:36:51.824921+00	
00000000-0000-0000-0000-000000000000	1cb220e6-8ab2-4041-97a8-9362e75f9d26	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-04 14:44:05.468133+00	
00000000-0000-0000-0000-000000000000	f923feae-f22f-4045-8f93-0f5d1126a9b8	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-04 14:44:29.592818+00	
00000000-0000-0000-0000-000000000000	717d8ace-afef-4d19-88ce-b83e7905d6e3	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-04 14:54:09.023373+00	
00000000-0000-0000-0000-000000000000	37980977-e8bf-4bdc-8d87-db133df4e60a	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-04 14:54:25.943483+00	
00000000-0000-0000-0000-000000000000	2384b504-f4ad-4883-9ce9-3200e3f8bd91	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-04 15:07:23.578507+00	
00000000-0000-0000-0000-000000000000	60ef8577-9c5e-49b5-999e-0433c8ef51d9	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-04 15:07:33.067245+00	
00000000-0000-0000-0000-000000000000	d1295388-bd81-4ab7-aa7d-b890b8b3980b	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-04 15:12:20.458789+00	
00000000-0000-0000-0000-000000000000	c1b1c4ba-9cef-432a-a9e0-7b776aaee411	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-04 15:12:26.108485+00	
00000000-0000-0000-0000-000000000000	110e0f14-80b5-489b-9d05-9ce5f825cb55	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-04 15:29:37.141502+00	
00000000-0000-0000-0000-000000000000	856272e2-647b-48c9-92e8-18ca70bdf8be	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-04 15:30:00.904479+00	
00000000-0000-0000-0000-000000000000	63d6c084-8471-4ab4-9901-600bcb258354	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-04 15:32:50.158776+00	
00000000-0000-0000-0000-000000000000	0ff97c76-643a-49ab-b1bf-72be3f15e6a7	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-04 15:32:56.47592+00	
00000000-0000-0000-0000-000000000000	7c2ba9e3-72de-47ac-8938-4b80947d9990	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-04 15:38:56.905499+00	
00000000-0000-0000-0000-000000000000	d58b13e2-2c6b-4c21-bbd4-c3b10dd00e36	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-04 15:39:02.026637+00	
00000000-0000-0000-0000-000000000000	c74fb39b-b56f-46f4-b906-29f0e1d88001	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-04 15:42:30.775679+00	
00000000-0000-0000-0000-000000000000	f0531d9e-1665-4184-9604-6fe2812c38ac	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-04 15:42:35.620834+00	
00000000-0000-0000-0000-000000000000	c172fa2b-1421-4629-a250-3a75d65fcbc7	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-04 16:09:36.467744+00	
00000000-0000-0000-0000-000000000000	c39d318b-f05e-428f-a469-0c00b86eee75	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-04 16:09:42.208699+00	
00000000-0000-0000-0000-000000000000	ae986b38-a278-4d5d-bd11-b7719d05e812	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-04 16:12:35.138076+00	
00000000-0000-0000-0000-000000000000	61644a28-6b47-4990-93e2-3ff5286532a2	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-04 16:12:40.493081+00	
00000000-0000-0000-0000-000000000000	5eebf1b6-5d5d-4c8b-8ff0-5a16206629c9	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-04 17:17:19.54444+00	
00000000-0000-0000-0000-000000000000	f9e9fb90-6fe4-4e8e-a6a7-28a12531c5e5	{"action":"token_refreshed","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-04 18:15:27.484656+00	
00000000-0000-0000-0000-000000000000	4535f691-4da3-4a16-84f1-fbdc45ed8ad1	{"action":"token_revoked","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-04 18:15:27.499573+00	
00000000-0000-0000-0000-000000000000	70133be1-a842-49e5-9188-77af4ddd4bf4	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-05 12:15:28.523152+00	
00000000-0000-0000-0000-000000000000	f5a870f2-9e5c-44d3-93b8-5e9ddbe52a9e	{"action":"token_refreshed","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-05 14:11:00.496648+00	
00000000-0000-0000-0000-000000000000	435df39a-e41a-4bb2-87a5-67a855e8ca27	{"action":"token_revoked","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-05 14:11:00.518391+00	
00000000-0000-0000-0000-000000000000	0a53effa-83e0-4054-9e27-ab29fa0710ca	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-05 14:12:34.277277+00	
00000000-0000-0000-0000-000000000000	7dd17455-d8aa-4d0b-9f3f-47342c278165	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-05 14:13:03.117725+00	
00000000-0000-0000-0000-000000000000	02f8293a-84ff-4043-82ee-1a0349ac6a75	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-05 14:15:57.80964+00	
00000000-0000-0000-0000-000000000000	642aa2ab-1b6a-4e28-8d12-7038b828a2c2	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-05 14:16:04.352261+00	
00000000-0000-0000-0000-000000000000	e833d143-14b1-4835-8691-eb653aeb3deb	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-05 14:17:11.389835+00	
00000000-0000-0000-0000-000000000000	e5be75bd-e091-4fd4-b86f-8b0e13c1ca28	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-05 14:17:32.365424+00	
00000000-0000-0000-0000-000000000000	45c9c6f5-dfff-45df-b1f8-116ddd9224a9	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-05 14:19:32.3403+00	
00000000-0000-0000-0000-000000000000	9babfaa9-ecf1-47b7-b654-d0421fa3ed98	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-05 14:19:40.328226+00	
00000000-0000-0000-0000-000000000000	5c036c78-1a3c-4e26-ab6d-4db4c08f0b7a	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-05 14:22:48.417074+00	
00000000-0000-0000-0000-000000000000	9b7a7e74-171c-4f03-8d9d-9a642f1c7ba2	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-05 14:22:58.204506+00	
00000000-0000-0000-0000-000000000000	9e7ed8fd-10de-471f-95fc-5dd904f97212	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-05 14:28:56.844986+00	
00000000-0000-0000-0000-000000000000	8d1c8e22-96c3-455c-a589-ada257d0ebf3	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-05 14:29:02.564085+00	
00000000-0000-0000-0000-000000000000	7476357b-351a-4fc9-b311-bf29ecc88de1	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-05 14:34:54.17654+00	
00000000-0000-0000-0000-000000000000	673f143a-0c61-4ed2-bae4-146c2f904d0e	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-05 14:34:59.570975+00	
00000000-0000-0000-0000-000000000000	4913cf7b-00a9-4bc0-a03d-476cb3b95810	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-05 14:40:56.221067+00	
00000000-0000-0000-0000-000000000000	069f5893-d543-4502-af5e-285fc33d18bf	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-05 14:41:01.646073+00	
00000000-0000-0000-0000-000000000000	0dbd4ce8-218b-4d95-b8d8-b4e9d4d45a67	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-05 14:41:49.861588+00	
00000000-0000-0000-0000-000000000000	9c94cb18-ae4c-447b-a251-9beba9148170	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-05 14:41:54.720888+00	
00000000-0000-0000-0000-000000000000	8bf58e80-4b07-45b5-99e2-33d1dd210aef	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-05 15:03:16.869883+00	
00000000-0000-0000-0000-000000000000	e57e5c81-ca75-40c8-945d-89151acc134a	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-05 15:03:22.407464+00	
00000000-0000-0000-0000-000000000000	e9f91680-eb76-43f1-9ac1-d50b75fac9f3	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-05 15:08:15.739462+00	
00000000-0000-0000-0000-000000000000	ce51198b-f628-4466-a12f-73aa66862eab	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-05 15:08:21.458302+00	
00000000-0000-0000-0000-000000000000	6f15247a-146e-45d8-a0f2-545108431bd2	{"action":"token_refreshed","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-05 16:08:58.741049+00	
00000000-0000-0000-0000-000000000000	93476985-3771-4464-873e-57e5372d0109	{"action":"token_revoked","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-05 16:08:58.766011+00	
00000000-0000-0000-0000-000000000000	3ef01077-8f5b-4689-9162-297b0150183a	{"action":"token_refreshed","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-05 17:21:08.412314+00	
00000000-0000-0000-0000-000000000000	e54d6979-e1af-4a41-9f03-6eab30714e2d	{"action":"token_revoked","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-05 17:21:08.442515+00	
00000000-0000-0000-0000-000000000000	1674bd04-f148-4b80-882c-a997ead19eac	{"action":"token_refreshed","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-06 05:24:55.007002+00	
00000000-0000-0000-0000-000000000000	255f4012-d557-4043-8126-94b253c6d940	{"action":"token_revoked","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-06 05:24:55.027679+00	
00000000-0000-0000-0000-000000000000	0de88223-8fb7-45fe-9541-5c323c0b4e3c	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-06 05:25:10.000148+00	
00000000-0000-0000-0000-000000000000	933f6018-7136-4986-9123-6f3b0fc9cff7	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-06 05:25:16.410209+00	
00000000-0000-0000-0000-000000000000	494ecb93-0dbc-493f-bf21-7156bdbd3826	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-06 05:32:44.839043+00	
00000000-0000-0000-0000-000000000000	bf049628-5ad9-44ba-b9ca-15e082ba1a35	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-06 05:32:50.469534+00	
00000000-0000-0000-0000-000000000000	82d74178-415f-4ae4-a51d-fc0fb1c558cf	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-06 05:34:37.034267+00	
00000000-0000-0000-0000-000000000000	943a65b5-0d9a-4f63-9e98-39ee75188dee	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-06 05:34:41.84563+00	
00000000-0000-0000-0000-000000000000	723b7584-95c9-4018-9fc1-34f823a0d9f8	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-06 05:39:54.516784+00	
00000000-0000-0000-0000-000000000000	c12b14f7-4db3-4c35-9a62-88438e4aeaca	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-06 05:40:00.394958+00	
00000000-0000-0000-0000-000000000000	5f2ded8a-07ac-4183-babd-06a5786c962b	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-06 05:41:39.283124+00	
00000000-0000-0000-0000-000000000000	3db427da-3ebc-4265-8238-b6369c64b4d1	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-06 05:41:44.125802+00	
00000000-0000-0000-0000-000000000000	b4992951-91e7-4c61-a5e4-350a88c763ef	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-06 05:43:04.048369+00	
00000000-0000-0000-0000-000000000000	9464bb00-c209-4329-8dcf-ec0e10552c4b	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-06 05:43:10.297849+00	
00000000-0000-0000-0000-000000000000	c279e72d-6035-4fe3-9f6d-9e15ee693b1d	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-06 11:29:41.743957+00	
00000000-0000-0000-0000-000000000000	ab73c046-c992-4d74-a77a-26821426d4c7	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-06 11:34:39.174193+00	
00000000-0000-0000-0000-000000000000	305df85c-476d-402b-aa21-2d47235e06e4	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-06 11:34:56.741458+00	
00000000-0000-0000-0000-000000000000	7c3b1296-6aae-4f6b-be16-eddc48b2f7b5	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-06 11:36:33.989615+00	
00000000-0000-0000-0000-000000000000	d9a65a61-2939-4adc-8377-8a2d70977559	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-06 11:40:44.351673+00	
00000000-0000-0000-0000-000000000000	096549cb-8f72-4a60-87d0-673d023dc115	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-06 11:55:03.777416+00	
00000000-0000-0000-0000-000000000000	25bad768-2a3c-4f7e-932a-0d564ae8e861	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-06 11:55:20.343365+00	
00000000-0000-0000-0000-000000000000	1ea3fe68-151d-49c5-9da0-7c465032a624	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-06 11:59:18.995947+00	
00000000-0000-0000-0000-000000000000	128a218d-92ab-4752-ada5-2334bbe902c5	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-06 11:59:26.665+00	
00000000-0000-0000-0000-000000000000	9e9ae122-2fdc-49c5-a556-2b7ffab1e329	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-06 12:00:02.049441+00	
00000000-0000-0000-0000-000000000000	4655e841-6912-4944-8663-7eb65ba6151f	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-06 12:00:09.425896+00	
00000000-0000-0000-0000-000000000000	4286b5cd-fbe4-4ec6-8f19-2bf176179844	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-06 12:31:08.103807+00	
00000000-0000-0000-0000-000000000000	7ccdc987-4b8a-4560-b0ac-f46b59c4f857	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-06 12:31:14.668102+00	
00000000-0000-0000-0000-000000000000	199a6f95-27b7-4b0a-a0ac-f050266b1579	{"action":"token_refreshed","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-06 13:32:50.509984+00	
00000000-0000-0000-0000-000000000000	e597caf3-b564-4b73-bbd3-fedb31802601	{"action":"token_revoked","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-06 13:32:50.535193+00	
00000000-0000-0000-0000-000000000000	e2a08b09-3fad-4c26-8161-dbf307ac4e5b	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-06 13:57:56.795737+00	
00000000-0000-0000-0000-000000000000	c9bf6fa1-6763-43ac-9b78-dab0c43aa249	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-06 13:58:04.880105+00	
00000000-0000-0000-0000-000000000000	27627cf1-c5a4-4da6-b61b-9b6e99f073c4	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-06 14:07:39.572505+00	
00000000-0000-0000-0000-000000000000	7cd6c052-76d2-49b1-8529-f4e48ddc7b54	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-06 14:07:47.933638+00	
00000000-0000-0000-0000-000000000000	0eba6597-c419-4d55-9a6a-d680afd4455e	{"action":"token_refreshed","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-06 16:02:57.284889+00	
00000000-0000-0000-0000-000000000000	a4564921-4755-417a-96df-d73aba5e92ee	{"action":"token_revoked","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-06 16:02:57.312346+00	
00000000-0000-0000-0000-000000000000	173d5d0a-7f55-416d-a324-948ecbf32b54	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-06 16:02:59.935332+00	
00000000-0000-0000-0000-000000000000	cf2c0bdf-b820-4773-9d3c-63f4570102c8	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-06 16:03:05.787845+00	
00000000-0000-0000-0000-000000000000	72107370-1b6b-44a1-8d65-6d99e8343cc6	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-06 16:05:48.751685+00	
00000000-0000-0000-0000-000000000000	ef7cb316-8b5b-4515-902a-29cb1af0dac6	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-06 16:05:54.265164+00	
00000000-0000-0000-0000-000000000000	466c8c3f-dd65-47a8-b608-2e928db93543	{"action":"token_refreshed","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 06:35:33.171307+00	
00000000-0000-0000-0000-000000000000	549f742a-f0b3-48f6-9f7f-e5d7f5dc2647	{"action":"token_revoked","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 06:35:33.195507+00	
00000000-0000-0000-0000-000000000000	698287e1-d87a-49eb-a582-adbbba550df9	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-07 06:37:28.765508+00	
00000000-0000-0000-0000-000000000000	d54b122e-cd23-4040-849d-33ed1adc276d	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-07 06:37:36.509644+00	
00000000-0000-0000-0000-000000000000	67f97ad8-aaa3-433f-88e7-d91576965f6e	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-07 06:59:37.278211+00	
00000000-0000-0000-0000-000000000000	97a9d049-c2e8-44ce-a425-a87d15c96ad9	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-07 06:59:53.278872+00	
00000000-0000-0000-0000-000000000000	d43078a8-b0a0-477b-964f-61b7f186bc89	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-07 06:59:59.993615+00	
00000000-0000-0000-0000-000000000000	e7163eaf-86fb-42fd-a086-e38869df1d6b	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-07 07:00:10.756098+00	
00000000-0000-0000-0000-000000000000	f30012c4-d444-4fe7-b33a-fb2c56be34c9	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-07 07:09:20.504796+00	
00000000-0000-0000-0000-000000000000	62e7ed35-a176-42b1-8d86-31feb068dbe4	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-07 07:09:32.011238+00	
00000000-0000-0000-0000-000000000000	7794a428-fd67-4139-b8c5-a5a15265b4f6	{"action":"token_refreshed","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 10:14:05.004732+00	
00000000-0000-0000-0000-000000000000	1084fedf-10fc-4a6c-bce5-d025a7cfd31e	{"action":"token_revoked","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 10:14:05.035059+00	
00000000-0000-0000-0000-000000000000	0340d0dd-da1f-45ec-9db9-092dcc90a65f	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-07 10:20:59.269945+00	
00000000-0000-0000-0000-000000000000	1f1b782f-7595-48c1-a105-ac67e11e6495	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-07 10:21:07.151028+00	
00000000-0000-0000-0000-000000000000	b6e274fa-db19-4919-a569-b0274441ab27	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-07 12:50:43.03703+00	
00000000-0000-0000-0000-000000000000	516da7c4-3c99-49e6-9d55-c608f6b99edf	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-07 12:57:18.558263+00	
00000000-0000-0000-0000-000000000000	40f58c74-cddb-444e-96cf-e30e48b3c80c	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-07 12:57:36.977492+00	
00000000-0000-0000-0000-000000000000	3cb7be56-0949-44ff-a0cf-b42203a18e67	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-07 12:58:01.861715+00	
00000000-0000-0000-0000-000000000000	9c89e52c-7c48-4fb0-a242-13400db9d9d0	{"action":"token_refreshed","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 14:50:51.492105+00	
00000000-0000-0000-0000-000000000000	a64650c1-76d2-4f0b-bb72-c1e1684e6319	{"action":"token_revoked","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-07 14:50:51.518942+00	
00000000-0000-0000-0000-000000000000	abfba4a4-f8a5-4642-b8ef-1dc67a33d1c0	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-07 14:51:14.308474+00	
00000000-0000-0000-0000-000000000000	02289421-34d4-4cb2-a41c-9f53d4c2bfd8	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-07 14:51:22.003537+00	
00000000-0000-0000-0000-000000000000	b6790fc0-215e-4781-8fd5-7df7cbc4e968	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-08 08:56:32.279018+00	
00000000-0000-0000-0000-000000000000	27bece86-397c-4119-b139-45de6e1ea0bf	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-08 08:57:17.073693+00	
00000000-0000-0000-0000-000000000000	5c93c12a-4c72-464c-9960-c0b6a1e49353	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-08 08:57:31.466212+00	
00000000-0000-0000-0000-000000000000	4fd41cc8-9c1f-4d30-b177-146ac4673dfa	{"action":"token_refreshed","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 12:27:15.539274+00	
00000000-0000-0000-0000-000000000000	4f91743f-c2c0-42af-b47f-6e22b83bf0fa	{"action":"token_revoked","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-08 12:27:15.561593+00	
00000000-0000-0000-0000-000000000000	34d6ee9c-cf1e-4364-813b-93fc517287c5	{"action":"token_refreshed","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-13 12:02:07.879981+00	
00000000-0000-0000-0000-000000000000	487d0c86-2ab1-440b-8b02-a98472f9a732	{"action":"token_revoked","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-13 12:02:07.905424+00	
00000000-0000-0000-0000-000000000000	59cc04d5-7853-494f-b26d-5eb4c01e37bd	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-13 12:02:44.302115+00	
00000000-0000-0000-0000-000000000000	4f51c819-e68b-464d-acc4-c32f20779804	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-14 08:14:47.618367+00	
00000000-0000-0000-0000-000000000000	dc1f4c4f-462e-42d2-8050-bee633e6ca3c	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-14 08:32:35.62167+00	
00000000-0000-0000-0000-000000000000	8d960473-9b4b-4dfa-82ac-9f8c761d22bc	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-14 08:35:05.406558+00	
00000000-0000-0000-0000-000000000000	8441c50f-1c45-4c3e-b551-95d5ad481cd0	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-14 08:35:20.812953+00	
00000000-0000-0000-0000-000000000000	baba6555-a5e8-4c0e-b123-2dc17b217e2d	{"action":"user_signedup","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-09-14 08:58:39.718397+00	
00000000-0000-0000-0000-000000000000	ab8c3562-6e1c-47f5-bbd7-b7d43a04884a	{"action":"login","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-14 08:58:39.736435+00	
00000000-0000-0000-0000-000000000000	b8bcfa06-5d74-4c08-aea5-eeafe261c9fe	{"action":"logout","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-14 09:05:57.708623+00	
00000000-0000-0000-0000-000000000000	5b3d5b5b-35ac-4435-9363-a8e5c29f53b7	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-14 11:43:14.238556+00	
00000000-0000-0000-0000-000000000000	39b094dc-835d-48ba-a30e-9f7f6e750a0c	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-14 12:22:41.228371+00	
00000000-0000-0000-0000-000000000000	a0e35a3e-7387-4994-bb81-5cece4394d64	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-15 08:54:38.995331+00	
00000000-0000-0000-0000-000000000000	0d3cec7e-3746-479a-9dde-5b72c1a44ee6	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-15 08:56:31.205625+00	
00000000-0000-0000-0000-000000000000	1193c087-2158-481d-8311-936655aa57b0	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-15 14:20:52.720029+00	
00000000-0000-0000-0000-000000000000	be34f2a4-915b-4f3b-99e1-9a92cebda796	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-15 15:00:57.631318+00	
00000000-0000-0000-0000-000000000000	409c115b-65f3-4fd8-b53c-d5507e60a4de	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-15 15:12:43.028497+00	
00000000-0000-0000-0000-000000000000	085617dc-83c6-4e03-949c-e1d4f778ef26	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-15 15:14:16.323863+00	
00000000-0000-0000-0000-000000000000	a460d3c9-6420-4b3a-afa3-8325833ba98a	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-15 15:14:26.447563+00	
00000000-0000-0000-0000-000000000000	65ae185d-9095-4a30-b61f-97c0eeeb8424	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-15 15:15:02.580318+00	
00000000-0000-0000-0000-000000000000	2beab130-f8cd-4ca4-888f-b67a41e9b173	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-15 15:15:09.65995+00	
00000000-0000-0000-0000-000000000000	40d1839f-c84b-4a95-bd65-eb5ab9d3f7b7	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-15 15:17:45.271103+00	
00000000-0000-0000-0000-000000000000	b5326b26-27be-4849-a22c-ea1493cba63c	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-15 15:17:52.817839+00	
00000000-0000-0000-0000-000000000000	20da0e00-ba26-481a-b680-2f4d22c41306	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-15 15:18:37.395453+00	
00000000-0000-0000-0000-000000000000	0b8264db-e357-48d1-80d0-0e3095c2dfee	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-15 15:19:01.369293+00	
00000000-0000-0000-0000-000000000000	48dcdabf-11c1-45ff-b68c-54b217f5332d	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-15 15:19:14.111913+00	
00000000-0000-0000-0000-000000000000	e531ec0c-93a4-4fcf-9878-6ef1a064cc29	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-15 15:20:38.578242+00	
00000000-0000-0000-0000-000000000000	63c64cb3-b66f-4356-a81d-dbedb3a27a8e	{"action":"token_refreshed","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-15 17:02:19.122327+00	
00000000-0000-0000-0000-000000000000	5344fa92-3366-4bf1-a30f-d28a65cae80e	{"action":"token_revoked","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-15 17:02:19.156193+00	
00000000-0000-0000-0000-000000000000	eadf0d7f-5d99-4644-b303-4043b5e9a1bb	{"action":"token_refreshed","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-15 18:07:46.987559+00	
00000000-0000-0000-0000-000000000000	8a1cf5cb-6dd1-4564-883b-a5d69a3062fd	{"action":"token_revoked","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-15 18:07:47.002589+00	
00000000-0000-0000-0000-000000000000	3d03923d-3da9-49d6-aec9-63ac545204cb	{"action":"login","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-15 21:02:20.709199+00	
00000000-0000-0000-0000-000000000000	656c4958-ad95-431b-b0d9-3d45354c19af	{"action":"user_updated_password","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"user"}	2025-09-15 21:03:09.361374+00	
00000000-0000-0000-0000-000000000000	505b55bf-2499-4f03-854c-431fe2a1bf50	{"action":"user_modified","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"user"}	2025-09-15 21:03:09.371473+00	
00000000-0000-0000-0000-000000000000	972159b6-c3e2-45fe-a016-8105151a5059	{"action":"logout","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-15 21:03:16.241965+00	
00000000-0000-0000-0000-000000000000	74c874c9-73e1-4254-91df-71f2850b2f5b	{"action":"login","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-15 21:03:22.457472+00	
00000000-0000-0000-0000-000000000000	af711319-9091-42d4-a76c-defd02b20bae	{"action":"logout","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-15 21:03:27.268869+00	
00000000-0000-0000-0000-000000000000	04586de9-42cf-418e-9000-cac0975133ef	{"action":"login","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-15 21:03:48.845005+00	
00000000-0000-0000-0000-000000000000	78c8ad1a-2728-48fc-8c63-72899245aca4	{"action":"token_refreshed","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-15 22:13:25.99557+00	
00000000-0000-0000-0000-000000000000	c301bfd3-e1d8-4e60-8230-a5d32a067cb8	{"action":"token_revoked","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-15 22:13:26.02351+00	
00000000-0000-0000-0000-000000000000	64de6b21-ae81-41ac-bb78-0e47d0ca189f	{"action":"logout","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-15 22:31:28.452445+00	
00000000-0000-0000-0000-000000000000	e97976fa-2c5a-4a4a-8072-aa7c2d6076e9	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-15 22:32:32.073599+00	
00000000-0000-0000-0000-000000000000	58669a00-35a6-46d8-9a38-431e7569b421	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-15 23:00:15.74154+00	
00000000-0000-0000-0000-000000000000	f76f9482-06f0-4ac4-b390-308f1cacba2d	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-15 23:02:01.647663+00	
00000000-0000-0000-0000-000000000000	f23cd6b7-b438-4ba9-96b7-28bde5524d96	{"action":"login","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-15 23:03:03.25654+00	
00000000-0000-0000-0000-000000000000	deb29823-5274-415d-b122-492eeac8c2d1	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-16 04:15:46.964601+00	
00000000-0000-0000-0000-000000000000	d2505590-2375-453c-8db7-150bd3d24ad2	{"action":"token_refreshed","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-16 05:13:24.70847+00	
00000000-0000-0000-0000-000000000000	a6429f9a-158b-4df0-ad6d-9e2f666aa003	{"action":"token_revoked","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-16 05:13:24.750507+00	
00000000-0000-0000-0000-000000000000	dd069213-c635-4984-8944-4a92cfedfc3c	{"action":"token_refreshed","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-16 05:51:30.372405+00	
00000000-0000-0000-0000-000000000000	a0146fb3-dcd4-40fd-9c73-619916e99585	{"action":"token_revoked","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-16 05:51:30.393873+00	
00000000-0000-0000-0000-000000000000	56415812-a221-4c18-96c9-7f6feb8a2364	{"action":"token_refreshed","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-16 09:17:55.894268+00	
00000000-0000-0000-0000-000000000000	29a6e999-2567-454d-a8dd-1097eeaed256	{"action":"token_revoked","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-16 09:17:55.90221+00	
00000000-0000-0000-0000-000000000000	29094812-e30f-4288-8581-0f341ad7946f	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-16 09:23:56.366107+00	
00000000-0000-0000-0000-000000000000	9e271137-d89c-43b0-90f6-8baee061dcf9	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-16 09:24:03.253248+00	
00000000-0000-0000-0000-000000000000	1b85abce-5941-4643-8c70-82916efa4d12	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-16 09:24:55.557431+00	
00000000-0000-0000-0000-000000000000	eb943e20-7a3d-47fa-87c4-29bfe5b362db	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-16 09:25:00.778656+00	
00000000-0000-0000-0000-000000000000	f17bd154-de62-4c0a-924d-c5174f845fdc	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-16 10:10:03.457438+00	
00000000-0000-0000-0000-000000000000	f4ecc0d9-35b7-4a4a-94c5-cda52f1b666b	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-16 10:15:24.034902+00	
00000000-0000-0000-0000-000000000000	a5508776-fa5c-41e4-900f-60f9b5c4c06c	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-16 10:15:42.952696+00	
00000000-0000-0000-0000-000000000000	b04a31eb-06e1-4143-ba16-dbe53d7e3184	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-16 10:16:03.583511+00	
00000000-0000-0000-0000-000000000000	10e0a9c9-4650-4533-85cf-edff19d8e29d	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-16 10:17:02.354751+00	
00000000-0000-0000-0000-000000000000	4775e674-38ef-49ee-9126-964a994c46aa	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-16 10:19:01.524062+00	
00000000-0000-0000-0000-000000000000	bac640af-b4b1-487c-b0a3-2c1a7aa151f8	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-16 10:38:22.264977+00	
00000000-0000-0000-0000-000000000000	45af1f30-3996-41be-81b6-7044f09a330a	{"action":"login","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-16 20:28:49.931303+00	
00000000-0000-0000-0000-000000000000	f1237dbd-71f5-45da-914c-4c282335242e	{"action":"token_refreshed","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-17 10:30:13.059692+00	
00000000-0000-0000-0000-000000000000	d3cbdafd-cd5c-4b6b-af94-5b3d4d099266	{"action":"token_revoked","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-17 10:30:13.091228+00	
00000000-0000-0000-0000-000000000000	a9595a0d-2202-4d59-94c5-9545e32be548	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-17 10:30:20.958106+00	
00000000-0000-0000-0000-000000000000	5b181b28-6449-45f8-8619-5ad6a2a533b6	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-17 10:31:49.257903+00	
00000000-0000-0000-0000-000000000000	513e27ec-f6c4-4b79-af17-4449b2f64c46	{"action":"user_updated_password","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"user"}	2025-09-17 10:35:26.158757+00	
00000000-0000-0000-0000-000000000000	da994d7f-b2ce-4d8d-ac32-3f34e2a0515e	{"action":"user_modified","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"user"}	2025-09-17 10:35:26.166784+00	
00000000-0000-0000-0000-000000000000	2d472168-afc5-4de3-ad47-d2f883417535	{"action":"user_updated_password","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"user"}	2025-09-17 10:35:50.173578+00	
00000000-0000-0000-0000-000000000000	89ed1518-9ffe-4278-a315-1b70354f19b8	{"action":"user_modified","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"user"}	2025-09-17 10:35:50.175144+00	
00000000-0000-0000-0000-000000000000	b3d08685-aee3-468b-ba31-834e8894e3df	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-17 10:36:34.15889+00	
00000000-0000-0000-0000-000000000000	3e13fab5-10e6-4ee4-8105-378cadbba7aa	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-17 10:37:26.447635+00	
00000000-0000-0000-0000-000000000000	d812adba-1091-49d2-8706-deab03fa29f2	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-17 10:40:06.239733+00	
00000000-0000-0000-0000-000000000000	516d520e-e37a-47f7-b6e1-b56ec5ca3d6e	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-17 10:40:37.075616+00	
00000000-0000-0000-0000-000000000000	8e3f5fc5-5730-48e7-8871-1d42bb2c20e2	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-17 10:43:31.3746+00	
00000000-0000-0000-0000-000000000000	053e430e-2471-435d-96ec-73b4689af959	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-17 10:44:03.736736+00	
00000000-0000-0000-0000-000000000000	d8d81d7b-c961-4833-afea-6b0d9bde8c04	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-17 10:44:30.585712+00	
00000000-0000-0000-0000-000000000000	3c99ace2-00a5-4d40-ac47-36c3001f6c8e	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-20 15:36:09.78776+00	
00000000-0000-0000-0000-000000000000	b1ca5c6e-e90d-4cf3-9b04-0bc595efbaf4	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-20 15:36:51.428197+00	
00000000-0000-0000-0000-000000000000	8184576c-00ab-4dc9-9541-f03a63220be6	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-20 15:36:59.214578+00	
00000000-0000-0000-0000-000000000000	6b200377-5a1c-4fe5-85d5-d4d43f3c9ae9	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-20 15:37:37.700802+00	
00000000-0000-0000-0000-000000000000	39c66633-85be-4203-b0fa-7bef327d26bd	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-20 15:37:52.171899+00	
00000000-0000-0000-0000-000000000000	2562ae6f-21ca-4dcd-8ff2-deb6d25859cf	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-20 15:39:15.197127+00	
00000000-0000-0000-0000-000000000000	e9c09425-2e14-4d89-a935-b3a7504bc538	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-20 15:39:28.584922+00	
00000000-0000-0000-0000-000000000000	4a38d652-a900-46d0-89dc-c08ebc8025c8	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-20 16:01:19.910388+00	
00000000-0000-0000-0000-000000000000	7205f151-32a9-46c1-813c-e3e5500c671c	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-20 16:01:25.198029+00	
00000000-0000-0000-0000-000000000000	1ae0a099-badb-4aed-b4f9-13fb5f13a7b0	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-20 16:01:42.835556+00	
00000000-0000-0000-0000-000000000000	6537dcf5-3aef-4fe1-bfdf-bbefda6eba46	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-20 16:01:47.567994+00	
00000000-0000-0000-0000-000000000000	4ad55f42-4893-458f-8242-f0a4fa971c1e	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-20 16:31:46.808286+00	
00000000-0000-0000-0000-000000000000	14a600ff-39bb-4c39-85c7-2e0ab3d11ce2	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-20 16:31:52.032519+00	
00000000-0000-0000-0000-000000000000	a89fe21d-bc81-4208-aa8a-0b674ec97bf2	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-20 16:57:52.13818+00	
00000000-0000-0000-0000-000000000000	0e2d6bc1-555b-4716-a581-36bc00c4bbf9	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-20 16:57:57.610893+00	
00000000-0000-0000-0000-000000000000	6a11bf95-0898-4f0d-a804-6c3e96669ca3	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-20 17:01:37.091774+00	
00000000-0000-0000-0000-000000000000	9f31284a-9c6f-490e-a0e1-ef23e8e6e68c	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-20 17:01:42.929994+00	
00000000-0000-0000-0000-000000000000	978a23d7-4b98-4271-8bbe-375c65e27f6a	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-20 17:58:39.422823+00	
00000000-0000-0000-0000-000000000000	318023f8-e3f5-4c30-94da-210dcb56eefd	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-20 17:58:43.28631+00	
00000000-0000-0000-0000-000000000000	511d0562-d9c0-412b-8b4e-83dcdc41225c	{"action":"token_refreshed","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-20 19:27:59.995548+00	
00000000-0000-0000-0000-000000000000	00ab43cb-e605-4672-bcb0-ecbabd28b4fd	{"action":"token_revoked","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-20 19:28:00.023933+00	
00000000-0000-0000-0000-000000000000	6990b30f-68e8-43e1-a0d8-429f7780803b	{"action":"token_refreshed","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-20 20:40:05.370965+00	
00000000-0000-0000-0000-000000000000	8dbc8a7b-ce72-44b8-a981-d5026e0a2cef	{"action":"token_revoked","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-20 20:40:05.390472+00	
00000000-0000-0000-0000-000000000000	0a83ce88-0c8f-4e07-bedc-6f69a45a1165	{"action":"token_refreshed","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-20 21:25:14.427567+00	
00000000-0000-0000-0000-000000000000	346d4f65-467b-4eec-a5d5-cb1ab72ff0e3	{"action":"token_revoked","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-20 21:25:14.444584+00	
00000000-0000-0000-0000-000000000000	6c605072-db0a-4540-927d-39ba06796241	{"action":"token_refreshed","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-21 06:26:41.693375+00	
00000000-0000-0000-0000-000000000000	350344c5-d042-4b90-b416-931248740cba	{"action":"token_revoked","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-21 06:26:41.722738+00	
00000000-0000-0000-0000-000000000000	9847917a-5f29-42c3-92d9-57d096389b82	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-21 06:26:58.659463+00	
00000000-0000-0000-0000-000000000000	8e22c343-2cad-4926-b1b2-1ba182d53955	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 06:27:01.518216+00	
00000000-0000-0000-0000-000000000000	1934acc9-d46a-4647-9efe-96d54d7d324e	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-21 06:27:03.944573+00	
00000000-0000-0000-0000-000000000000	77c24ed5-6d45-45a1-a4b0-7cbe935aa6a3	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 06:27:08.511624+00	
00000000-0000-0000-0000-000000000000	a4a2ade2-fefd-41cd-b673-3d70d227f337	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-21 06:33:41.269134+00	
00000000-0000-0000-0000-000000000000	c1999649-c989-4f25-aa25-fd54375e04f4	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 06:34:39.85172+00	
00000000-0000-0000-0000-000000000000	3e1a3c0c-aad1-474f-ba4b-e1890c0e9134	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-21 06:34:45.809346+00	
00000000-0000-0000-0000-000000000000	c0b624f7-8d7b-4e91-8d83-2825ee5849ab	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 06:35:37.696886+00	
00000000-0000-0000-0000-000000000000	cda728b2-e7e9-496c-960e-b57e84d77840	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-21 06:52:47.592095+00	
00000000-0000-0000-0000-000000000000	08e10944-c79f-4a4d-b644-957e8b07a811	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 07:03:03.124754+00	
00000000-0000-0000-0000-000000000000	fa623211-238a-48f8-9101-b0392b66c2a1	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-21 07:03:28.843043+00	
00000000-0000-0000-0000-000000000000	03087ec5-10ef-45bc-99ec-d2b0dc1ed812	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 07:03:34.151008+00	
00000000-0000-0000-0000-000000000000	05d4c5a0-9d14-4da4-9823-a1bc314f4bcd	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 07:04:58.087489+00	
00000000-0000-0000-0000-000000000000	65f895d2-2617-4d73-b5b3-def02d1167e7	{"action":"token_refreshed","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-21 08:09:29.477106+00	
00000000-0000-0000-0000-000000000000	c5b31e85-02a3-4d41-a389-2c1f6703575d	{"action":"token_revoked","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-21 08:09:29.500409+00	
00000000-0000-0000-0000-000000000000	fa7bcea0-9b95-4df5-907f-85bc1ddd43f0	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-21 08:09:40.02924+00	
00000000-0000-0000-0000-000000000000	c0dcbabf-5e56-4ad6-a0f1-0815e20d720b	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 08:10:07.740011+00	
00000000-0000-0000-0000-000000000000	f5e12714-8aed-41f8-9cec-caa14d92e799	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-21 08:10:28.538711+00	
00000000-0000-0000-0000-000000000000	768bdfd5-72d3-493e-b1f7-c904a00205d1	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 08:10:36.234235+00	
00000000-0000-0000-0000-000000000000	6a40be5d-d851-4571-8ede-0b6adc00d060	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-21 08:46:58.847236+00	
00000000-0000-0000-0000-000000000000	fa13598b-079a-42f9-bf0c-1b652ed54e67	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 08:47:06.042499+00	
00000000-0000-0000-0000-000000000000	5e52d732-51eb-456c-ae02-b3fe387a3396	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-21 08:50:20.739179+00	
00000000-0000-0000-0000-000000000000	b578ef7a-8f6d-47f9-b183-b6fc2ef8d547	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 08:50:27.327565+00	
00000000-0000-0000-0000-000000000000	e3b5dc4c-486d-47a0-8338-e43f1df177d1	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 09:23:47.827618+00	
00000000-0000-0000-0000-000000000000	e4491303-7f7c-47b0-b93d-543393dc9ea5	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-21 09:24:24.052096+00	
00000000-0000-0000-0000-000000000000	6c7a42b6-83b6-4490-8008-c5f2c4849f72	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 09:24:33.768084+00	
00000000-0000-0000-0000-000000000000	83e083c1-66e7-4c8f-b05a-396d14033196	{"action":"token_refreshed","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-21 10:41:10.139912+00	
00000000-0000-0000-0000-000000000000	393ea487-020c-4e5e-bc33-54947fe17a07	{"action":"token_revoked","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-21 10:41:10.165689+00	
00000000-0000-0000-0000-000000000000	09494789-6c68-4bd7-a26d-58d151184b47	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-21 11:12:08.958168+00	
00000000-0000-0000-0000-000000000000	cc36f975-6083-41d4-b50c-cc5b87810a55	{"action":"token_refreshed","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-21 11:14:37.968639+00	
00000000-0000-0000-0000-000000000000	4330e13f-fc8f-41d5-8b0e-be449fb726d0	{"action":"token_revoked","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-21 11:14:37.985495+00	
00000000-0000-0000-0000-000000000000	fa0db37a-980e-4d64-b93d-d24b7502a987	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 11:19:21.423142+00	
00000000-0000-0000-0000-000000000000	008555ac-9836-40a1-9b3a-d29980bbf6a5	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-21 11:23:14.016672+00	
00000000-0000-0000-0000-000000000000	65733270-b50e-4124-9d2d-955977460733	{"action":"token_refreshed","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-21 11:56:13.650121+00	
00000000-0000-0000-0000-000000000000	3aea1879-397d-48f3-8207-840700f94677	{"action":"token_revoked","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-21 11:56:13.659706+00	
00000000-0000-0000-0000-000000000000	e2b8a39c-39d3-4340-8eee-a655772421bc	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 12:18:16.297681+00	
00000000-0000-0000-0000-000000000000	3d3dd636-f631-4318-9058-9b95f84377ec	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-21 12:32:42.477679+00	
00000000-0000-0000-0000-000000000000	39f8f850-314c-4f25-9a2e-b63bc34efb79	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 12:32:48.396607+00	
00000000-0000-0000-0000-000000000000	7430ba39-c33a-45c4-a8f9-2f3fa4dd481c	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-21 12:33:43.582496+00	
00000000-0000-0000-0000-000000000000	dcd13576-6f30-47a5-9816-2eafbb6b1a27	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 12:33:50.025573+00	
00000000-0000-0000-0000-000000000000	62f01023-e9f6-4811-8925-35e5ef929a09	{"action":"token_refreshed","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-21 12:40:56.55828+00	
00000000-0000-0000-0000-000000000000	d74704cb-e77e-4a81-bd77-80fab272d300	{"action":"token_revoked","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-21 12:40:56.561355+00	
00000000-0000-0000-0000-000000000000	4b38ea31-60c4-4b5d-b711-d7e1bb85e3d7	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-21 13:24:47.194878+00	
00000000-0000-0000-0000-000000000000	54b4c35d-e01e-4d1d-afe8-639e75ed0519	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 13:24:52.235366+00	
00000000-0000-0000-0000-000000000000	9d57ca3b-3d33-470c-a41f-a887e9b87c17	{"action":"token_refreshed","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-21 13:40:35.202021+00	
00000000-0000-0000-0000-000000000000	aed471ca-fb71-458c-aad7-4952926bce7a	{"action":"token_revoked","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-21 13:40:35.210947+00	
00000000-0000-0000-0000-000000000000	b58e46b1-1edc-4eb7-9e23-53d416bfcbab	{"action":"logout","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-21 14:11:39.064733+00	
00000000-0000-0000-0000-000000000000	d10e5d0e-b49f-4eff-b62a-3c3778083e82	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 14:11:57.98197+00	
00000000-0000-0000-0000-000000000000	f59fcc42-7b4f-4864-8bfd-04b95bf81afb	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-21 14:12:30.813382+00	
00000000-0000-0000-0000-000000000000	20f53a1f-82b0-4b4e-ba62-ba7b7479a652	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 14:15:25.248196+00	
00000000-0000-0000-0000-000000000000	1275f36d-860e-4373-bd3f-ebb34a024a53	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-21 14:19:44.46623+00	
00000000-0000-0000-0000-000000000000	fe194f9a-91f1-4341-8c7e-034de8a703bb	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 14:19:54.385219+00	
00000000-0000-0000-0000-000000000000	a0f363ce-2018-4b61-b03a-151cd70f3b03	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 14:36:16.015918+00	
00000000-0000-0000-0000-000000000000	30142b22-13db-4d27-ab57-98026a8cfb18	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-21 14:46:08.206763+00	
00000000-0000-0000-0000-000000000000	b5c182c5-d344-4ddd-a185-3a7e564d4e77	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 14:46:13.928097+00	
00000000-0000-0000-0000-000000000000	b8ad8e27-2b46-44e3-9a77-b60515d033b0	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-21 14:46:24.547284+00	
00000000-0000-0000-0000-000000000000	669af932-3606-41e1-a937-5855d2325244	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 14:46:30.678706+00	
00000000-0000-0000-0000-000000000000	08d1a48a-72ad-4328-a516-0db0f1edb5c3	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-21 15:05:14.319654+00	
00000000-0000-0000-0000-000000000000	b62839b9-23d4-4d21-b42f-be4946f1b2a1	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 15:05:39.172572+00	
00000000-0000-0000-0000-000000000000	4dacb029-6089-4dca-bdd6-02e27304406a	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-21 15:22:00.074668+00	
00000000-0000-0000-0000-000000000000	1ecbf681-1f94-4060-81a7-2dd01ae03b1a	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 15:22:05.533677+00	
00000000-0000-0000-0000-000000000000	44abbd7d-9f52-4c5a-aae4-4e4642ebfbe0	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 15:48:46.235432+00	
00000000-0000-0000-0000-000000000000	2bc8c3bb-d536-4af4-a88d-cdb3e4e85baf	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-21 16:38:13.28461+00	
00000000-0000-0000-0000-000000000000	b432f27c-bfc6-4be5-a93f-f4ef7d3e71ce	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 16:41:20.703499+00	
00000000-0000-0000-0000-000000000000	01e38b26-bbc8-4072-adb1-6cca4d88582a	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 16:42:32.768477+00	
00000000-0000-0000-0000-000000000000	aec3219e-3235-4093-aedc-3619e0eedbcc	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 16:52:28.820065+00	
00000000-0000-0000-0000-000000000000	94ba8400-a4b5-4759-9a8e-6377d25a42e6	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-21 16:55:15.123075+00	
00000000-0000-0000-0000-000000000000	817a3dfe-7295-42ad-8556-6a039b24e068	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 16:55:23.152821+00	
00000000-0000-0000-0000-000000000000	fb9329da-1df9-4691-83a1-4f49820585a9	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-21 16:58:11.311184+00	
00000000-0000-0000-0000-000000000000	592f7646-6e82-4f99-a00f-72e43ac2602a	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 17:00:42.425984+00	
00000000-0000-0000-0000-000000000000	3edfaa62-1d3b-4d26-bc15-8629a5038896	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 19:06:45.223629+00	
00000000-0000-0000-0000-000000000000	ff8e4bab-adda-4f01-9b40-ca46d0aa941a	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-21 19:08:39.039595+00	
00000000-0000-0000-0000-000000000000	cb5b35a7-e2ab-434d-b2d5-41359680bee9	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 19:09:11.697078+00	
00000000-0000-0000-0000-000000000000	d41453d2-46fa-40c6-aaee-ec15ba48bc61	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-21 19:09:15.65909+00	
00000000-0000-0000-0000-000000000000	d2f242bf-67b8-4bff-a548-4ebec39a2537	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 19:09:27.137126+00	
00000000-0000-0000-0000-000000000000	c40a8142-6b67-4bf6-a983-3b009908d625	{"action":"login","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 20:39:11.815689+00	
00000000-0000-0000-0000-000000000000	032a85b1-3bb7-48b7-b960-860359c203a0	{"action":"logout","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-21 20:39:40.507073+00	
00000000-0000-0000-0000-000000000000	faec1a18-85cf-40b4-b3af-6d45e99f4d8f	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 20:39:52.0107+00	
00000000-0000-0000-0000-000000000000	cb51861d-4366-42ce-bc42-adc200bec1ce	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-21 20:42:47.555206+00	
00000000-0000-0000-0000-000000000000	e7a80080-28f5-49cb-a9f2-37e50c2de565	{"action":"login","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 20:42:53.759946+00	
00000000-0000-0000-0000-000000000000	6ead61c7-ddb9-4fa5-8a10-a1317b98bba1	{"action":"logout","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-21 20:43:28.627668+00	
00000000-0000-0000-0000-000000000000	5ea804cb-ba1c-4fa3-b6ab-054696bb4f76	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 20:43:34.894683+00	
00000000-0000-0000-0000-000000000000	dc51fe19-14d3-4dc5-92a8-6ec4b5899aef	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-21 20:44:55.513071+00	
00000000-0000-0000-0000-000000000000	7811394b-27f2-4972-90b9-39247adc536e	{"action":"login","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 20:45:02.841885+00	
00000000-0000-0000-0000-000000000000	ee2ccbbf-4b00-4a73-a91b-a3cf407d0269	{"action":"login","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 21:44:26.460424+00	
00000000-0000-0000-0000-000000000000	b5b5d729-6d76-4f46-a43d-b18694d3a1d1	{"action":"login","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 21:44:46.032861+00	
00000000-0000-0000-0000-000000000000	8b08f2b0-5d20-4485-98b8-f7f9c37dc2f7	{"action":"token_refreshed","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-21 21:50:12.953741+00	
00000000-0000-0000-0000-000000000000	f3eca7b4-9fd7-43d1-bcf5-903d82e956ff	{"action":"token_revoked","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-21 21:50:12.960794+00	
00000000-0000-0000-0000-000000000000	fdd4ba60-3132-4cd5-b82b-63c26070485c	{"action":"login","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 22:02:55.901199+00	
00000000-0000-0000-0000-000000000000	4e2c4a43-adbb-4b17-ad51-950668a9b305	{"action":"logout","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-21 22:12:24.325114+00	
00000000-0000-0000-0000-000000000000	0018868e-9842-471c-b4ea-e9c44e14d992	{"action":"login","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 22:12:30.956998+00	
00000000-0000-0000-0000-000000000000	80f8a92c-cedc-42c0-b6dc-a464621d59b0	{"action":"logout","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-21 22:33:14.790426+00	
00000000-0000-0000-0000-000000000000	b390282c-de2b-40b2-a7d6-6f1f24d8ce2e	{"action":"login","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 22:33:19.698706+00	
00000000-0000-0000-0000-000000000000	8f1d8582-7dfd-4063-8e68-5d85b5346f57	{"action":"logout","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-21 22:33:32.340167+00	
00000000-0000-0000-0000-000000000000	0e9d7dd0-e7de-4988-a4dd-ec4a218f097d	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-21 22:33:50.718855+00	
00000000-0000-0000-0000-000000000000	20ae2e5f-d7a6-46b6-977b-d8bd5ad1337b	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-21 22:49:43.089408+00	
00000000-0000-0000-0000-000000000000	030bfb28-1c8b-4791-a9f1-3cff2da7657b	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-22 14:30:38.314064+00	
00000000-0000-0000-0000-000000000000	18891a1a-1be3-4dbf-81de-dc7bc1b4d930	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-22 14:36:10.731586+00	
00000000-0000-0000-0000-000000000000	266f1645-e055-41e0-ac6e-b42ff40b566e	{"action":"token_refreshed","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-22 14:36:31.001155+00	
00000000-0000-0000-0000-000000000000	f7b2db2f-b014-4562-a953-aa1865c4b040	{"action":"token_revoked","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-22 14:36:31.004407+00	
00000000-0000-0000-0000-000000000000	c663d086-e80e-4925-9d4d-1ba1c08b1ef7	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-22 14:36:40.610735+00	
00000000-0000-0000-0000-000000000000	cde5a0da-ad2f-41be-bb72-c39177bd82ca	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-22 14:36:45.847585+00	
00000000-0000-0000-0000-000000000000	3fe5096b-d8e2-488f-a594-23d7108c41a8	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-22 14:36:51.788859+00	
00000000-0000-0000-0000-000000000000	d1316519-ab0d-4d9c-af64-67857e25130e	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-22 14:36:56.428537+00	
00000000-0000-0000-0000-000000000000	cdba642d-4d63-41fb-8abd-3671bab412e4	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-22 14:40:56.918061+00	
00000000-0000-0000-0000-000000000000	d394cb5d-c75b-4909-acce-fca68f82f55a	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-22 14:41:04.3107+00	
00000000-0000-0000-0000-000000000000	20cf714d-8463-48ce-ad37-8fde94bfda5e	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-22 14:41:08.21839+00	
00000000-0000-0000-0000-000000000000	a8b5092d-f02d-4468-a5c3-c520ba25e2cb	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-22 14:43:29.402642+00	
00000000-0000-0000-0000-000000000000	0624886b-b32c-4ac7-abd9-526abbd0499e	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-22 14:43:35.203488+00	
00000000-0000-0000-0000-000000000000	cbf3cb9a-66bc-4365-bdc7-50d75ef1b344	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-22 14:53:08.531419+00	
00000000-0000-0000-0000-000000000000	61374ad4-2c25-4d48-934d-db38535e369a	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-22 14:58:45.167449+00	
00000000-0000-0000-0000-000000000000	e8cb8740-9006-4e05-9c4d-ee2682289c73	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-22 15:14:05.033112+00	
00000000-0000-0000-0000-000000000000	98928b1e-3d7d-470a-bf9b-ac82feb55f59	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-22 15:14:08.554572+00	
00000000-0000-0000-0000-000000000000	73739101-b2c9-4ac2-b590-6db0df34cb21	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-22 15:14:48.889572+00	
00000000-0000-0000-0000-000000000000	8c560185-b87f-4b86-b156-f3fd412f1c42	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-22 15:14:52.777833+00	
00000000-0000-0000-0000-000000000000	59f4c86f-4185-4c12-9919-520628196dc6	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-22 15:55:18.832443+00	
00000000-0000-0000-0000-000000000000	184ee83a-51ab-4be8-92b5-8585a1111f9b	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-22 15:55:28.269339+00	
00000000-0000-0000-0000-000000000000	113ecfdc-c92b-4736-b56d-90fa0b200a37	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-22 15:55:35.932021+00	
00000000-0000-0000-0000-000000000000	906a15c1-47be-49c4-88f4-b451ad15a2c2	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-22 15:55:41.511883+00	
00000000-0000-0000-0000-000000000000	f2181244-b12d-4b93-ab73-aa312e9fcffd	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-22 16:12:03.748105+00	
00000000-0000-0000-0000-000000000000	10b4585c-6591-4526-9ae1-900bdc882c31	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-22 16:12:08.232862+00	
00000000-0000-0000-0000-000000000000	af105ca1-2a4f-4a51-b761-ccd9a63aa296	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-22 16:44:34.614083+00	
00000000-0000-0000-0000-000000000000	ddce43f1-1c7f-4259-a926-d643d4ef27cc	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-22 16:48:31.63596+00	
00000000-0000-0000-0000-000000000000	dc778bd0-6e2e-42a3-a40c-646e47b12e0d	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-22 16:49:43.069365+00	
00000000-0000-0000-0000-000000000000	ac1187b9-d1db-4793-a8a9-f923c3523cb1	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-22 16:49:48.470195+00	
00000000-0000-0000-0000-000000000000	7b8c78f4-a65e-4b46-9dc1-82d6538740c9	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-22 16:49:56.051362+00	
00000000-0000-0000-0000-000000000000	99647cdd-7c8c-402d-ad02-2e8c7da7aaef	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-22 17:43:21.441628+00	
00000000-0000-0000-0000-000000000000	346c7233-eac7-46d6-af69-b171c96de2ad	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-22 17:43:29.73877+00	
00000000-0000-0000-0000-000000000000	6ea415ca-a79a-4fb8-9123-71eb60d7acf0	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-22 17:45:18.509904+00	
00000000-0000-0000-0000-000000000000	e1971b94-b4c7-4c36-809a-6d9ab517ba72	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-22 17:45:24.320432+00	
00000000-0000-0000-0000-000000000000	48f880a6-9228-45ec-9628-d184c03db0be	{"action":"token_refreshed","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-22 17:50:15.217156+00	
00000000-0000-0000-0000-000000000000	8bb01492-e519-4858-97e0-1c64f810e1e4	{"action":"token_revoked","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-22 17:50:15.220603+00	
00000000-0000-0000-0000-000000000000	66f9159e-5deb-447b-b913-560a5713da2a	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-22 17:53:17.159252+00	
00000000-0000-0000-0000-000000000000	2c8d68cb-bd8e-4b0f-8cf4-a352306e3cc5	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-22 17:53:23.351921+00	
00000000-0000-0000-0000-000000000000	a2b4e6bf-d921-4c09-b04a-fc4803b753bf	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-22 17:53:43.893756+00	
00000000-0000-0000-0000-000000000000	1b61261f-b1ce-41e5-99a2-7de7c24101de	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-22 17:53:49.076275+00	
00000000-0000-0000-0000-000000000000	b81238a1-6eee-4778-96bd-27d060fac8a1	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-22 17:54:08.017057+00	
00000000-0000-0000-0000-000000000000	86d5753c-2afc-451f-a100-48408c2f0594	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-22 17:54:13.198437+00	
00000000-0000-0000-0000-000000000000	bbac5b81-ca1f-45ea-b658-a8fa88198cda	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-22 17:54:33.212208+00	
00000000-0000-0000-0000-000000000000	43ca24b8-ed73-455c-84fa-96f75f826f05	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-22 17:54:40.361117+00	
00000000-0000-0000-0000-000000000000	600ed24e-48fc-40be-8835-464f060e582b	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-22 17:55:17.605629+00	
00000000-0000-0000-0000-000000000000	b0c4ced9-5c25-4ba8-9cda-bcfd3b192186	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-22 17:55:21.933672+00	
00000000-0000-0000-0000-000000000000	e065b6fb-8d38-4dbf-be9b-c0cf1d3352e3	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-22 18:05:52.279592+00	
00000000-0000-0000-0000-000000000000	196ddae0-b9df-4709-ac9d-5faceba1ec7d	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-22 18:06:09.964453+00	
00000000-0000-0000-0000-000000000000	b021bfe5-cd52-4f41-8a9b-717d91ac4edf	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-22 18:07:52.748451+00	
00000000-0000-0000-0000-000000000000	633c1a36-e710-46a6-bcc8-fb65437c8051	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-22 18:23:03.905325+00	
00000000-0000-0000-0000-000000000000	6700b8dc-aa9c-452b-86f3-c646b9a54178	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-22 18:30:13.919195+00	
00000000-0000-0000-0000-000000000000	98447601-d062-4d2a-ae0c-4727331b24bf	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-23 10:22:52.155402+00	
00000000-0000-0000-0000-000000000000	92adc892-2766-4191-a567-5ee4f1e4d8a0	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-23 11:00:03.037832+00	
00000000-0000-0000-0000-000000000000	68399280-558e-4536-af2b-52ba04095e51	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-23 11:00:24.843114+00	
00000000-0000-0000-0000-000000000000	3d738f92-f642-4bdb-9714-0025d1af4133	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-23 11:08:50.311507+00	
00000000-0000-0000-0000-000000000000	0999ad91-6ded-4098-8636-5214c78e76df	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-23 11:09:48.729491+00	
00000000-0000-0000-0000-000000000000	3e749631-3f24-46a2-98fe-dac59840ddcf	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-23 11:21:45.817711+00	
00000000-0000-0000-0000-000000000000	e28d4c0e-6e70-47c9-94aa-a928e78e75ab	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-23 11:22:04.483192+00	
00000000-0000-0000-0000-000000000000	11064d9b-1855-4c2d-9019-64efaa3b9c3c	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-23 11:23:08.625515+00	
00000000-0000-0000-0000-000000000000	c67ebb07-d1f1-47de-aa9c-5d6b9941dca0	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-23 11:40:24.218233+00	
00000000-0000-0000-0000-000000000000	21ccfa61-e1e7-4a41-a74e-c78f73ce4968	{"action":"token_refreshed","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-23 14:01:40.271144+00	
00000000-0000-0000-0000-000000000000	58b7bd34-6c0d-4a71-8dca-7eebdd0d883a	{"action":"token_revoked","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-23 14:01:40.303477+00	
00000000-0000-0000-0000-000000000000	dfbc4f83-95cb-4e56-9405-29c6048dd51d	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-23 14:02:52.58678+00	
00000000-0000-0000-0000-000000000000	71a6e130-b4b0-4c96-85d4-c50a3e9d1830	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-23 14:05:07.759886+00	
00000000-0000-0000-0000-000000000000	8f6f74ca-0be9-4ff2-bb43-c9adc8580f8e	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-23 14:17:53.385721+00	
00000000-0000-0000-0000-000000000000	9498acc7-a1e7-433a-bff3-3caef2f4ce26	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-23 14:58:38.877178+00	
00000000-0000-0000-0000-000000000000	a2ecad93-db05-4ed7-9ec2-6d34f15844f0	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-23 15:03:50.283836+00	
00000000-0000-0000-0000-000000000000	df1ca6a7-c549-40c6-88cb-7c18b0888b2d	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-23 15:39:22.378758+00	
00000000-0000-0000-0000-000000000000	5b96e009-9c4c-46b7-b69a-0c3ad4ce5e68	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-23 15:52:51.153262+00	
00000000-0000-0000-0000-000000000000	363cb95e-86b5-428f-a26c-05c2f99b0fe1	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-23 16:45:36.358134+00	
00000000-0000-0000-0000-000000000000	e4243abc-1d34-4e45-bfbe-efe4c7e93540	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-23 16:45:58.851845+00	
00000000-0000-0000-0000-000000000000	30acca55-ae0e-4ee9-8927-c06b80408bec	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-23 16:46:07.811544+00	
00000000-0000-0000-0000-000000000000	8d3f09df-5411-4e0e-8641-3bde090f765e	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-23 17:25:27.181265+00	
00000000-0000-0000-0000-000000000000	84c44d60-52fa-45ed-8cf0-ae2eba16ca81	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-23 17:26:01.921429+00	
00000000-0000-0000-0000-000000000000	ba99473a-352b-48a2-9bb3-f8fcff4c72ff	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-23 17:29:18.890567+00	
00000000-0000-0000-0000-000000000000	c117539a-8349-4a86-8ad1-4486abd55d65	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-24 06:49:43.258606+00	
00000000-0000-0000-0000-000000000000	7325b358-3af8-4a33-8d85-14c81e6d3800	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-24 08:45:48.839774+00	
00000000-0000-0000-0000-000000000000	04dca8be-30ff-42d0-9c3b-cd71f61734fb	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-24 08:48:25.545841+00	
00000000-0000-0000-0000-000000000000	6d9f7352-ad03-4ac5-81f4-91fda579e4db	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-24 08:48:29.555542+00	
00000000-0000-0000-0000-000000000000	b9d1f4fe-f7d8-40c6-b3d4-44bcb3adf04b	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-24 14:05:20.489395+00	
00000000-0000-0000-0000-000000000000	4bdefef9-4f17-4f25-b5fa-889768a0f829	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-24 14:06:18.547508+00	
00000000-0000-0000-0000-000000000000	1442927a-8a99-477b-a5a6-af1c85d6d022	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-24 14:06:25.589655+00	
00000000-0000-0000-0000-000000000000	41064c3c-7f94-4453-ad19-7604c4e6b438	{"action":"token_refreshed","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-24 16:35:07.55059+00	
00000000-0000-0000-0000-000000000000	1bd3c4e6-4af0-4c16-adda-613c6e1e889b	{"action":"token_revoked","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-24 16:35:07.579584+00	
00000000-0000-0000-0000-000000000000	5940c0ba-c15b-44f6-bcd6-875171faca39	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-24 16:35:29.738796+00	
00000000-0000-0000-0000-000000000000	efac17b9-ed53-4fb4-b966-4e2588b1aef5	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-24 16:59:16.343415+00	
00000000-0000-0000-0000-000000000000	9ddc983d-e310-445e-9500-3a89e43a4c4a	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-24 16:59:20.55255+00	
00000000-0000-0000-0000-000000000000	f346466f-f164-470e-b6c4-ac86384fde21	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-24 18:37:11.603211+00	
00000000-0000-0000-0000-000000000000	63ec8176-e8cc-40b0-b5e2-cddd5feea32b	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-24 18:37:15.702414+00	
00000000-0000-0000-0000-000000000000	192bb097-36a3-4ba7-bf87-229a79531b89	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-25 15:59:15.076014+00	
00000000-0000-0000-0000-000000000000	2b1a34d6-bc99-4f4b-8bda-5ed91188481e	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-25 15:59:21.394107+00	
00000000-0000-0000-0000-000000000000	93386545-12d5-44e4-a227-11edfb31cf2c	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-26 11:05:42.160071+00	
00000000-0000-0000-0000-000000000000	be5d5cfd-8fc4-4ba1-bf20-ae7e9be77882	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-26 11:06:22.911958+00	
00000000-0000-0000-0000-000000000000	0f77621d-49cb-41a3-a158-ccdbac06beae	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-26 11:06:28.209891+00	
00000000-0000-0000-0000-000000000000	12905f40-1e16-4ff3-94dd-2e8120c78e68	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-26 11:06:44.649284+00	
00000000-0000-0000-0000-000000000000	17c83f07-af13-40f3-9119-2a4b2b3c2bee	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-26 11:06:49.699699+00	
00000000-0000-0000-0000-000000000000	5beea4f7-2cfb-4089-93c1-63dddec69461	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-26 11:07:12.685131+00	
00000000-0000-0000-0000-000000000000	950a6ffe-8366-4fa7-a77a-a7229bccf321	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-26 11:07:21.595663+00	
00000000-0000-0000-0000-000000000000	669f0a9f-148e-4237-9d85-a43682ee195e	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-26 11:08:03.9152+00	
00000000-0000-0000-0000-000000000000	4cfc10ee-6b2f-4669-a55d-16830261dc0a	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-26 14:31:51.254223+00	
00000000-0000-0000-0000-000000000000	cff7a941-dbdf-4d0c-a0a8-d784245feb30	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-26 14:34:15.304342+00	
00000000-0000-0000-0000-000000000000	dec2d2fc-4830-497f-866e-d943ad1ab0c4	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-26 14:34:52.00187+00	
00000000-0000-0000-0000-000000000000	90a164fb-a71c-436f-8ecb-eae8d79234c8	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-26 14:34:54.855942+00	
00000000-0000-0000-0000-000000000000	f4f2b701-6bd7-47db-ae34-cc3c53e09bc7	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-26 15:19:33.931079+00	
00000000-0000-0000-0000-000000000000	cfc44895-1e5d-466d-b6b5-27491b26fc06	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-26 15:23:21.279937+00	
00000000-0000-0000-0000-000000000000	b8f0576c-fd3f-4766-bf28-681d68712132	{"action":"token_refreshed","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-26 17:24:59.024701+00	
00000000-0000-0000-0000-000000000000	ec652dca-98b1-49b1-b6a0-30202494d510	{"action":"token_revoked","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-26 17:24:59.052893+00	
00000000-0000-0000-0000-000000000000	a04e6690-b694-4dcc-bc40-84b673b2d3bf	{"action":"token_refreshed","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-26 18:47:19.886085+00	
00000000-0000-0000-0000-000000000000	f041b362-e1ff-4c33-be51-7e1e06ce11fa	{"action":"token_revoked","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-09-26 18:47:19.896318+00	
00000000-0000-0000-0000-000000000000	3ce4c9c4-a332-4619-a9b6-657300541c00	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-26 18:47:29.519778+00	
00000000-0000-0000-0000-000000000000	baa0ef4c-b4e1-4226-986f-c10fcf1a101d	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-26 18:47:39.832068+00	
00000000-0000-0000-0000-000000000000	c242f36c-4d06-4f3b-b92b-7d7b611fd4fa	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-26 18:52:59.331085+00	
00000000-0000-0000-0000-000000000000	e5cf34ba-1731-4ad3-8878-6e3fafdf3b55	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-26 18:53:08.22838+00	
00000000-0000-0000-0000-000000000000	778f669f-ba6b-4cdc-8965-4885666672e3	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-26 18:56:08.546096+00	
00000000-0000-0000-0000-000000000000	19350db3-3929-4764-8c8c-521aa813307d	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-26 18:56:13.660126+00	
00000000-0000-0000-0000-000000000000	c11abe06-1d1c-46d7-8399-843c3c15aff9	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-26 19:24:01.182324+00	
00000000-0000-0000-0000-000000000000	926e98ea-b6c1-41c2-8766-1b226b19e1bf	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-26 19:24:16.368029+00	
00000000-0000-0000-0000-000000000000	7cd402f3-85a8-4d38-8247-7afab3f66bbb	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-26 19:26:54.142951+00	
00000000-0000-0000-0000-000000000000	ddec9231-25c7-4094-8889-22ec0a1ca8ae	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-26 19:27:00.025546+00	
00000000-0000-0000-0000-000000000000	0dfa2958-ac99-47ff-8b1d-5d73441baeaf	{"action":"token_refreshed","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-27 08:03:18.879068+00	
00000000-0000-0000-0000-000000000000	7fd74415-71a4-4c9d-a187-b4fef9e94f44	{"action":"token_revoked","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-27 08:03:18.908835+00	
00000000-0000-0000-0000-000000000000	53e6f7ce-203f-4cce-a6c3-a3b154c89824	{"action":"token_refreshed","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-28 14:38:23.735927+00	
00000000-0000-0000-0000-000000000000	48803201-1c3c-4527-b59a-e554d0bda58c	{"action":"token_revoked","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-28 14:38:23.755891+00	
00000000-0000-0000-0000-000000000000	3c2e6c0c-28e5-44a6-8adf-cda82ae05357	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-28 14:38:29.052928+00	
00000000-0000-0000-0000-000000000000	dccf6e6f-8bec-4d09-94a9-a311745145e0	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 14:38:51.788626+00	
00000000-0000-0000-0000-000000000000	2c50ec6c-e698-4cef-bf17-598124e9c6d6	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-28 15:23:32.05236+00	
00000000-0000-0000-0000-000000000000	7a994be9-bbde-488e-aa26-c3214e9aad95	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 15:23:35.712138+00	
00000000-0000-0000-0000-000000000000	138505ca-7284-48f9-8dc6-82f36a19556d	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-28 15:24:30.561146+00	
00000000-0000-0000-0000-000000000000	48ee7401-e10b-46c7-9d36-b13ae3b15996	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 15:24:35.367147+00	
00000000-0000-0000-0000-000000000000	6eb35ea6-9e6e-4984-bb6a-5f1048d05a4e	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-28 16:01:34.554637+00	
00000000-0000-0000-0000-000000000000	261f4679-d7ff-49e0-a244-54a8ed3a0fc2	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 16:01:39.211805+00	
00000000-0000-0000-0000-000000000000	af202694-64c7-483c-9651-c95413fab599	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-28 16:02:08.847046+00	
00000000-0000-0000-0000-000000000000	d392cd12-7c99-41ad-b2b1-01168371bd7f	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 16:02:12.867954+00	
00000000-0000-0000-0000-000000000000	d5beb067-c8ec-402d-8085-75ea95d832ee	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-28 16:02:34.125347+00	
00000000-0000-0000-0000-000000000000	93c166e3-00ce-4fc1-a67f-ee1505ff8f1d	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 16:02:38.555233+00	
00000000-0000-0000-0000-000000000000	12aa878f-252f-4005-8168-4f910f2921ea	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-28 16:02:55.076625+00	
00000000-0000-0000-0000-000000000000	9c651543-bd56-4555-8629-46dac86511c5	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 16:03:01.129956+00	
00000000-0000-0000-0000-000000000000	b9fa08fc-7823-4a87-bb7c-d334cf05f011	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-28 16:04:36.212571+00	
00000000-0000-0000-0000-000000000000	1f97aad5-9d9a-4ba7-96ad-5e078576e19e	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 16:04:39.90581+00	
00000000-0000-0000-0000-000000000000	cbaf7c28-e6d8-4407-9144-727944bf17ad	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-28 16:14:34.045965+00	
00000000-0000-0000-0000-000000000000	7d8dd6aa-d664-47d6-93ad-4083b4937b47	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 16:18:50.041021+00	
00000000-0000-0000-0000-000000000000	cc376298-1a0a-4727-9b49-a039bfdd00fd	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-28 16:26:45.493+00	
00000000-0000-0000-0000-000000000000	346b1a2c-3720-495b-aaf4-9794b9e781f0	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 16:27:20.396245+00	
00000000-0000-0000-0000-000000000000	7b1de037-ad96-4ce0-b978-c98dea015efe	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-28 16:35:06.529084+00	
00000000-0000-0000-0000-000000000000	0801bb49-d432-4bfe-a3c7-6a13031abb70	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 16:41:44.859227+00	
00000000-0000-0000-0000-000000000000	1e1aef90-80b9-4867-a5fe-683d2fd7dfed	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-28 16:41:55.104392+00	
00000000-0000-0000-0000-000000000000	0b896588-2559-46be-b87a-5cf6a698673c	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 16:41:59.689991+00	
00000000-0000-0000-0000-000000000000	c80b0bf6-4171-4dcf-8282-3ed8b779bd64	{"action":"user_updated_password","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"user"}	2025-09-28 16:42:57.294385+00	
00000000-0000-0000-0000-000000000000	32717434-a85a-435a-8bfc-d6bab61d0c6c	{"action":"user_modified","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"user"}	2025-09-28 16:42:57.2963+00	
00000000-0000-0000-0000-000000000000	7e86c36e-f744-4391-b555-d99bbea49d9d	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-28 16:43:01.49264+00	
00000000-0000-0000-0000-000000000000	7f839630-be81-4eaf-8b23-fccf76a8cdcb	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 16:43:09.236869+00	
00000000-0000-0000-0000-000000000000	40026d04-0b5b-4c94-a570-033ace45e0d5	{"action":"user_updated_password","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"user"}	2025-09-28 16:43:17.687284+00	
00000000-0000-0000-0000-000000000000	d19342c0-ef51-437b-9e41-4578a045104b	{"action":"user_modified","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"user"}	2025-09-28 16:43:17.688767+00	
00000000-0000-0000-0000-000000000000	d0cb80c1-4ec2-436d-b076-c2c1994bb73d	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-28 17:14:49.513659+00	
00000000-0000-0000-0000-000000000000	be3006c0-b76f-4e28-86dc-034326434673	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 19:08:39.14689+00	
00000000-0000-0000-0000-000000000000	5943bb00-995c-4ba3-8dcc-fff9c8e6ed5d	{"action":"login","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 19:08:49.223697+00	
00000000-0000-0000-0000-000000000000	fcb4c794-16ea-43f0-8b01-c88d37d0d8e5	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 19:08:52.2512+00	
00000000-0000-0000-0000-000000000000	674e12d9-026e-4b6c-a978-da218bde7192	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 19:08:54.818149+00	
00000000-0000-0000-0000-000000000000	bc091397-5f5f-4de8-bece-b125f2f03cfb	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-28 19:09:02.511344+00	
00000000-0000-0000-0000-000000000000	126d6bb9-a8cb-4064-bc77-276e263d6ef3	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 19:09:04.1969+00	
00000000-0000-0000-0000-000000000000	346503ba-b15f-4219-8276-5d7bf482421a	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 19:09:07.131004+00	
00000000-0000-0000-0000-000000000000	318a9b5c-17cd-4fb8-8207-d03a65a0d932	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-28 19:09:10.624744+00	
00000000-0000-0000-0000-000000000000	20c48b9e-9da1-4889-8127-b656a602a9be	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 19:09:14.593506+00	
00000000-0000-0000-0000-000000000000	f872240e-762e-42c4-ac3e-151a4b6b1540	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-28 19:09:15.33908+00	
00000000-0000-0000-0000-000000000000	226ad946-bf50-47d6-88fc-91b684f82c71	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 19:09:29.780042+00	
00000000-0000-0000-0000-000000000000	7fc3e044-5853-4808-85f7-94612af0b015	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-28 19:09:46.320332+00	
00000000-0000-0000-0000-000000000000	46d4aea0-3cfb-45ba-878c-64d081cd4125	{"action":"login","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 19:09:53.328069+00	
00000000-0000-0000-0000-000000000000	e809ac44-f540-424b-8417-7cb557ecac0e	{"action":"token_refreshed","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-28 20:08:11.433184+00	
00000000-0000-0000-0000-000000000000	9f530a16-562e-4a27-a6d8-fe78c2d6b6b1	{"action":"token_revoked","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-28 20:08:11.459803+00	
00000000-0000-0000-0000-000000000000	ddbf8331-6deb-4bfa-a19a-438f27470045	{"action":"token_refreshed","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-28 21:07:41.742551+00	
00000000-0000-0000-0000-000000000000	2e33001d-c442-4356-8c57-f2be49fd76b6	{"action":"token_revoked","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-09-28 21:07:41.758478+00	
00000000-0000-0000-0000-000000000000	7fcb414a-6cf9-4678-aa08-cbe685da1090	{"action":"logout","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-28 21:07:47.708891+00	
00000000-0000-0000-0000-000000000000	21ff8d07-1067-464a-ba8b-cb5681dc8461	{"action":"login","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 21:07:56.725252+00	
00000000-0000-0000-0000-000000000000	15fcdd0e-ee0c-4514-af8d-6075d443c08d	{"action":"logout","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-28 21:14:25.878631+00	
00000000-0000-0000-0000-000000000000	9c8ec3e6-e891-44af-9196-13b35c438338	{"action":"login","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 21:15:52.792648+00	
00000000-0000-0000-0000-000000000000	f20499f7-7213-4ea7-acd8-54e1982c8260	{"action":"logout","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-28 21:50:00.695378+00	
00000000-0000-0000-0000-000000000000	5966efb8-7b1b-45c3-ae09-29e927589359	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 21:50:08.346703+00	
00000000-0000-0000-0000-000000000000	b12b2ac9-1dc9-4cc1-90da-211a1570563b	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-28 22:06:26.125888+00	
00000000-0000-0000-0000-000000000000	50f2a375-d9ac-4290-9938-168a385f57f0	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 22:06:32.70519+00	
00000000-0000-0000-0000-000000000000	083541bb-cd09-4dae-9a5c-c0d2fd78661a	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-28 22:08:00.079952+00	
00000000-0000-0000-0000-000000000000	6535e97b-5b6f-44f3-846d-ade938fc3a36	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 22:08:09.348082+00	
00000000-0000-0000-0000-000000000000	d5c8ff18-0cd5-4669-9be9-e13439be6011	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-28 22:11:59.226928+00	
00000000-0000-0000-0000-000000000000	c014acc9-44e2-45f8-8866-da2e70966336	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 22:12:06.199911+00	
00000000-0000-0000-0000-000000000000	6dd70698-143d-46e4-8ba7-414942e15b78	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-28 22:15:29.936897+00	
00000000-0000-0000-0000-000000000000	1a82036a-17f9-4aab-876e-994d5d8545de	{"action":"login","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 22:15:39.246836+00	
00000000-0000-0000-0000-000000000000	f027e390-6319-48fc-a19d-903494cfad76	{"action":"logout","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-28 22:16:00.048162+00	
00000000-0000-0000-0000-000000000000	38e2c409-5283-4010-8291-1d8e6e3127f4	{"action":"login","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 22:16:12.062334+00	
00000000-0000-0000-0000-000000000000	fb0449d7-cf03-4f72-960d-9987769c996e	{"action":"logout","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-28 22:16:17.087824+00	
00000000-0000-0000-0000-000000000000	f56c8486-59b2-45f9-8008-62ea352d37e2	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 22:16:23.154383+00	
00000000-0000-0000-0000-000000000000	7a3ee6ed-f2cc-4b8e-aaf7-08bec6e09eba	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-28 22:17:32.824547+00	
00000000-0000-0000-0000-000000000000	efb91e0d-3994-45f7-9e5a-64650576aa39	{"action":"login","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 22:17:44.136435+00	
00000000-0000-0000-0000-000000000000	4110eae1-6ee8-46e0-ae0a-d68657784355	{"action":"logout","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-28 22:24:14.211235+00	
00000000-0000-0000-0000-000000000000	78f256fe-9163-4f4d-8053-d13cb44ba30c	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 22:24:19.658344+00	
00000000-0000-0000-0000-000000000000	a3384ec5-ddbd-4f18-910f-b643471170db	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-28 22:25:31.88937+00	
00000000-0000-0000-0000-000000000000	f5e8624b-53f2-47f5-b95b-5b659c4dd9fc	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 22:27:11.52394+00	
00000000-0000-0000-0000-000000000000	bc7aeb60-b2a2-468c-aaa3-fa64fb132916	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-28 22:27:54.401372+00	
00000000-0000-0000-0000-000000000000	7d34b5be-22d5-447c-b14d-ffde817251fa	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 22:28:17.91977+00	
00000000-0000-0000-0000-000000000000	d58714f0-1e65-49d1-abab-4b5bf424be05	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 22:28:22.630956+00	
00000000-0000-0000-0000-000000000000	6ef5d17d-2ae3-4779-aae0-cda0e0fa7acb	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 22:40:45.230257+00	
00000000-0000-0000-0000-000000000000	6f1ae377-38ff-4a13-9c48-96e70542fac8	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 22:42:51.657656+00	
00000000-0000-0000-0000-000000000000	bfef17cd-cab0-49ae-a605-c4ce4c26dc01	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-28 22:50:05.86577+00	
00000000-0000-0000-0000-000000000000	2bbeaa1d-f48e-4e63-a072-941cfe07cce1	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 22:50:56.113146+00	
00000000-0000-0000-0000-000000000000	768ba9bd-9f67-4771-aa80-fd883f0e046f	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-28 22:51:11.167947+00	
00000000-0000-0000-0000-000000000000	02decd3d-df0d-48c1-92f6-f7f058707b2c	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 22:51:17.091168+00	
00000000-0000-0000-0000-000000000000	3ec6a1d6-2ba1-4f00-9d4a-fca440fcd433	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-28 22:55:20.096201+00	
00000000-0000-0000-0000-000000000000	42468eb0-8f99-4646-939d-55a74c7d8e72	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 22:55:26.608234+00	
00000000-0000-0000-0000-000000000000	158dde49-5d4e-487d-9384-d57acb5237b9	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-28 22:58:30.263774+00	
00000000-0000-0000-0000-000000000000	84688d3c-6ec2-4d38-a787-a9103105c9cb	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-28 22:58:39.490064+00	
00000000-0000-0000-0000-000000000000	0fc93e63-e6d3-41e5-88c8-7126ed06f63d	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-29 07:39:25.521823+00	
00000000-0000-0000-0000-000000000000	ca429845-585a-4cad-9b32-343c4006c8e3	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-29 07:48:02.82338+00	
00000000-0000-0000-0000-000000000000	acf344a0-671b-4f81-9ea4-62259b4770cc	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-29 07:48:06.266802+00	
00000000-0000-0000-0000-000000000000	8f17015b-922c-49d7-98d9-ce73c1b36d6d	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-29 07:49:07.917431+00	
00000000-0000-0000-0000-000000000000	ca43e27d-5acc-4df3-ac5b-c6f6130aede5	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-29 07:49:14.709459+00	
00000000-0000-0000-0000-000000000000	2b71dfd2-23a3-42bf-8f72-61f55b97cb3a	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-29 07:50:53.26971+00	
00000000-0000-0000-0000-000000000000	e546b755-5254-4974-8cd8-fd7e1e59a0ad	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-29 13:42:38.103322+00	
00000000-0000-0000-0000-000000000000	f24370f0-4a65-47a2-8667-c286554b9fae	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-29 13:42:55.978505+00	
00000000-0000-0000-0000-000000000000	9ef799f0-ecce-462b-92f6-4d099514293f	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-29 13:43:06.432161+00	
00000000-0000-0000-0000-000000000000	15c1a3a3-9050-45e8-8907-3e44a929fda3	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-29 13:44:35.768079+00	
00000000-0000-0000-0000-000000000000	d581d59d-c6cb-4cb7-9513-50ed213e3c50	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-29 13:45:00.058157+00	
00000000-0000-0000-0000-000000000000	0a268339-cc84-430b-bbd2-69b2ffb43dcb	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-29 13:45:04.669007+00	
00000000-0000-0000-0000-000000000000	5c70781e-29b7-4e7f-9e58-3cf831bfccb9	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-29 13:51:28.859854+00	
00000000-0000-0000-0000-000000000000	08aa6460-dac1-4f2d-90dc-a647ccfdb2b7	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-29 13:51:39.865022+00	
00000000-0000-0000-0000-000000000000	5a936c76-7c49-458c-8ff0-3ed94847286b	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-29 13:52:10.329091+00	
00000000-0000-0000-0000-000000000000	2d21995a-49f6-453a-88f7-c690457b843c	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-29 13:52:16.905519+00	
00000000-0000-0000-0000-000000000000	a624ab66-e84e-431a-ba53-080d65721106	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-29 13:57:06.758145+00	
00000000-0000-0000-0000-000000000000	13f24670-9a53-4dc7-b0b0-024e03d42673	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-29 13:57:13.202111+00	
00000000-0000-0000-0000-000000000000	51392144-0a1d-4a78-a6ea-0a9e6becc478	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-29 14:03:10.771551+00	
00000000-0000-0000-0000-000000000000	587e6071-f0dd-4bc9-acd7-672270d37b93	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-29 14:06:14.547803+00	
00000000-0000-0000-0000-000000000000	9ab7e4d1-9e89-4fc3-83a8-a75a570439ac	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-29 14:06:25.608815+00	
00000000-0000-0000-0000-000000000000	6354432b-5c98-42ca-929d-1e065ca7649a	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-29 14:07:04.706321+00	
00000000-0000-0000-0000-000000000000	5ce79543-025d-49db-b428-11237c42d435	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-29 14:07:11.993331+00	
00000000-0000-0000-0000-000000000000	51b8780d-ada5-45c9-acfe-2446e84c0b39	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-29 14:14:10.709463+00	
00000000-0000-0000-0000-000000000000	764b78fc-2c70-4aa5-8ad2-04dd4b211b5b	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-29 14:14:21.228292+00	
00000000-0000-0000-0000-000000000000	64078144-710e-402d-bc98-1ced0d573172	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-29 14:15:04.225346+00	
00000000-0000-0000-0000-000000000000	fba86c80-586b-4235-a8da-6e4bcc53d57a	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-29 14:15:14.083402+00	
00000000-0000-0000-0000-000000000000	75a4c6c9-c3a4-49b0-b786-3c29f58fc06b	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-09-29 14:25:24.316051+00	
00000000-0000-0000-0000-000000000000	7386f48f-93b9-48b6-858c-4a27b5c102f7	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-29 14:25:32.177459+00	
00000000-0000-0000-0000-000000000000	f7508aad-c3da-4cbf-b219-e2e67cad5f6a	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-29 14:25:53.367857+00	
00000000-0000-0000-0000-000000000000	f1dadd1a-f644-4240-9c41-dd27cb5b2a31	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-29 14:30:22.12365+00	
00000000-0000-0000-0000-000000000000	0a7b9a9d-d3d5-412b-81b3-0d30f03a912c	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-29 14:30:24.685515+00	
00000000-0000-0000-0000-000000000000	a7a08718-2c23-4ab5-9745-f6f870941524	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-29 14:30:30.933075+00	
00000000-0000-0000-0000-000000000000	1a69a1fc-267f-4ae0-8d12-02bc2b9ba546	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-29 14:34:24.463016+00	
00000000-0000-0000-0000-000000000000	f4c7ce9a-9140-4019-b0d5-db9bc0d64f43	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-29 14:34:35.457053+00	
00000000-0000-0000-0000-000000000000	8f514bce-0a30-466d-8d7e-e78be0e29aaa	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-29 14:36:16.155519+00	
00000000-0000-0000-0000-000000000000	2cf82549-9fd9-4273-8de5-a6c1c10c54d2	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-29 14:36:23.771135+00	
00000000-0000-0000-0000-000000000000	a22e700d-de99-4d57-b180-ffd7950b012b	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-29 14:38:52.818803+00	
00000000-0000-0000-0000-000000000000	8a9472e2-4b3b-4c23-ae1c-62701aa2ab87	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-29 14:38:58.968509+00	
00000000-0000-0000-0000-000000000000	f7e3796f-fd93-4fde-abda-55e9fc92d52d	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-29 14:43:48.94462+00	
00000000-0000-0000-0000-000000000000	38abcff2-dc65-4cb4-8750-2bd2daa21bab	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-09-29 14:44:55.714616+00	
00000000-0000-0000-0000-000000000000	b756a494-8942-4410-a843-34a1d372d8b1	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-01 08:31:30.54795+00	
00000000-0000-0000-0000-000000000000	22263998-3317-4082-89d5-d88fa8966c6c	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-01 08:31:45.083671+00	
00000000-0000-0000-0000-000000000000	233071d2-feda-4887-a8f8-1872afb71396	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-01 08:42:08.920853+00	
00000000-0000-0000-0000-000000000000	b60aa352-a97e-425a-99f9-f871cc8dc4bd	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-01 08:45:34.666693+00	
00000000-0000-0000-0000-000000000000	a74e96b4-7a38-4708-8538-df8671903db8	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-01 08:45:38.278691+00	
00000000-0000-0000-0000-000000000000	31bd3a2e-d481-4cda-96e0-7ec932f2a05a	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-01 08:45:41.174874+00	
00000000-0000-0000-0000-000000000000	5fc60687-283d-409e-b0e8-0c8162a6d15a	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-01 08:45:44.211498+00	
00000000-0000-0000-0000-000000000000	df992841-9c74-418c-8005-aeaff30bcc1a	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-01 08:45:49.037941+00	
00000000-0000-0000-0000-000000000000	c0ce327b-e081-4313-86cc-865e56db28c1	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-01 08:45:54.033764+00	
00000000-0000-0000-0000-000000000000	85d986ac-2385-49a9-b167-7c144b4fb489	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-01 08:45:59.59296+00	
00000000-0000-0000-0000-000000000000	0e28cf86-cde7-4a45-b839-6b3896c0dceb	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-01 08:46:39.851631+00	
00000000-0000-0000-0000-000000000000	f13524f6-df3a-4cc9-9b28-8829d190738b	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-01 08:46:50.605816+00	
00000000-0000-0000-0000-000000000000	b5668c99-8772-472b-a63e-cf030ce9d3a3	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-01 08:47:14.466767+00	
00000000-0000-0000-0000-000000000000	7686f20f-308a-4d28-b916-d8e702571f78	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-01 08:47:41.652786+00	
00000000-0000-0000-0000-000000000000	0c2b32cf-4fcf-4654-8cff-4b5f8ee39cdd	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-01 08:47:45.512625+00	
00000000-0000-0000-0000-000000000000	845d5f90-f23d-4249-b419-64b781e72ff9	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-01 08:47:49.616745+00	
00000000-0000-0000-0000-000000000000	a024a4fc-8df6-4ceb-a632-cdb22c494c11	{"action":"token_refreshed","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-01 09:47:02.529475+00	
00000000-0000-0000-0000-000000000000	341395d3-f1bb-4f40-977c-e76d2c356511	{"action":"token_revoked","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-01 09:47:02.5405+00	
00000000-0000-0000-0000-000000000000	fa1d4d56-bc1d-4e6e-9bfe-604a4aaa4971	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-01 09:53:13.719424+00	
00000000-0000-0000-0000-000000000000	e75be241-494e-401f-a885-2b39a9ef6bc9	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-01 09:53:19.781586+00	
00000000-0000-0000-0000-000000000000	2bbaba8a-fcbc-4f47-9eb6-9c268bf2f5bd	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-01 09:57:07.700041+00	
00000000-0000-0000-0000-000000000000	70201ab9-5a83-4fca-86b2-3914942f0b0a	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-01 09:57:23.840587+00	
00000000-0000-0000-0000-000000000000	1907db61-7637-493c-8321-07d06ce10d36	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-01 10:24:16.948394+00	
00000000-0000-0000-0000-000000000000	797d3341-8f5f-4609-852c-a91ea6b2ea32	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-01 11:00:19.451681+00	
00000000-0000-0000-0000-000000000000	cf360bc0-395f-4cd5-89e7-d761cbf67d28	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-01 11:00:24.39396+00	
00000000-0000-0000-0000-000000000000	8acbea5b-517c-4c72-875e-85da4c417a13	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-01 17:37:05.112596+00	
00000000-0000-0000-0000-000000000000	0ea156c3-71e8-4f03-9f83-85eb7f561fd2	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-01 17:37:09.542895+00	
00000000-0000-0000-0000-000000000000	11d57889-3bff-4c52-a01c-4ed3025cd471	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-01 17:37:13.889844+00	
00000000-0000-0000-0000-000000000000	28fe55fd-eb45-4797-911b-24844c94720d	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-01 17:37:17.7622+00	
00000000-0000-0000-0000-000000000000	1efae9af-49a2-431d-8f92-18fc96f12864	{"action":"user_signedup","actor_id":"51f47342-ed3d-4e1b-8d03-3863a8de027c","actor_username":"peter@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-01 17:42:00.933188+00	
00000000-0000-0000-0000-000000000000	748e8015-5469-4b6d-9540-f71bc629cedb	{"action":"login","actor_id":"51f47342-ed3d-4e1b-8d03-3863a8de027c","actor_username":"peter@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-01 17:42:00.943088+00	
00000000-0000-0000-0000-000000000000	e78cdd2e-8ffe-40b0-bf8c-bfd335d0bb1b	{"action":"logout","actor_id":"51f47342-ed3d-4e1b-8d03-3863a8de027c","actor_username":"peter@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-01 17:45:07.919242+00	
00000000-0000-0000-0000-000000000000	2abda829-bbf1-43c8-9673-1618412a08b0	{"action":"login","actor_id":"51f47342-ed3d-4e1b-8d03-3863a8de027c","actor_username":"peter@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-01 17:45:21.075556+00	
00000000-0000-0000-0000-000000000000	b66d0bf3-55f6-4e0e-9ca6-d246ff33569e	{"action":"logout","actor_id":"51f47342-ed3d-4e1b-8d03-3863a8de027c","actor_username":"peter@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-01 17:46:32.420855+00	
00000000-0000-0000-0000-000000000000	49217664-84fb-4311-8ebc-534df123b535	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-01 17:46:39.126726+00	
00000000-0000-0000-0000-000000000000	aeced884-ee9b-41c8-b42e-a65732c5c830	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-01 17:47:01.857815+00	
00000000-0000-0000-0000-000000000000	b100e04e-cf87-4404-90b4-738620e35326	{"action":"login","actor_id":"51f47342-ed3d-4e1b-8d03-3863a8de027c","actor_username":"peter@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-01 17:47:06.72947+00	
00000000-0000-0000-0000-000000000000	893c7222-66d8-4730-ba7e-713ad1153159	{"action":"logout","actor_id":"51f47342-ed3d-4e1b-8d03-3863a8de027c","actor_username":"peter@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-01 17:56:03.162232+00	
00000000-0000-0000-0000-000000000000	e4acb20e-6830-4716-96a8-3213090dbc3c	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-01 17:56:07.407927+00	
00000000-0000-0000-0000-000000000000	84bfda1b-0f28-4d88-874d-e78231eedef3	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-01 18:09:16.855895+00	
00000000-0000-0000-0000-000000000000	f9ec9cf0-b832-471c-ac0d-bb7ea1430540	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-01 18:09:23.634346+00	
00000000-0000-0000-0000-000000000000	09a08517-1f0d-44e5-af77-dabc9e5b0032	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-01 18:19:01.269194+00	
00000000-0000-0000-0000-000000000000	3e30d7d0-0d5c-46bf-a1e8-b492d34601b8	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-01 18:19:07.996719+00	
00000000-0000-0000-0000-000000000000	f57e90f2-69fd-4256-8ce2-0799f90a9204	{"action":"token_refreshed","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-10-02 04:25:34.793944+00	
00000000-0000-0000-0000-000000000000	023ab53f-05a7-4f1f-8593-f6a102513717	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-04 15:13:30.877995+00	
00000000-0000-0000-0000-000000000000	65b141b1-5bb4-4ffe-a761-7aed45849817	{"action":"token_revoked","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-10-02 04:25:34.824628+00	
00000000-0000-0000-0000-000000000000	9330a129-1135-439e-baff-f3866a6427d1	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-02 04:49:20.131396+00	
00000000-0000-0000-0000-000000000000	62f95ea5-c1e2-4605-8a74-2ff2aeb4add7	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-02 04:49:26.198481+00	
00000000-0000-0000-0000-000000000000	ea93cb78-d226-474a-bf19-6996c85c2193	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-02 05:28:14.163253+00	
00000000-0000-0000-0000-000000000000	2619504f-38c2-490f-b324-deb5daa5a336	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-02 05:28:18.673711+00	
00000000-0000-0000-0000-000000000000	9304f816-4e4a-487a-9889-7027a43a285a	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-02 05:30:04.028896+00	
00000000-0000-0000-0000-000000000000	ebeec5a9-e87f-46f4-a8a2-2defef4783a0	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-02 05:30:09.39911+00	
00000000-0000-0000-0000-000000000000	706c8f9b-2706-4d3d-a791-272231991dac	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-02 05:33:56.475095+00	
00000000-0000-0000-0000-000000000000	a512fade-fe38-4a1c-8e64-4c7728c62ea1	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-02 05:36:28.871689+00	
00000000-0000-0000-0000-000000000000	75b6fe61-8c00-4fd2-97a2-3e85bc69ae25	{"action":"token_refreshed","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-02 14:45:43.253124+00	
00000000-0000-0000-0000-000000000000	88c22bb6-db81-423f-aebf-917c9d31a2ec	{"action":"token_revoked","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-02 14:45:43.282909+00	
00000000-0000-0000-0000-000000000000	25d8b53f-a725-4af0-9624-b8d88e7a6c71	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-02 14:49:46.237547+00	
00000000-0000-0000-0000-000000000000	1f3d9e0d-d00c-490f-84fa-f3f3a55f0618	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-02 14:49:51.939337+00	
00000000-0000-0000-0000-000000000000	aa8ac142-c163-4866-8412-5700746c0b8c	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-02 14:55:21.573643+00	
00000000-0000-0000-0000-000000000000	c8c0e7c8-96bc-4ce1-9808-1e90b5f5a126	{"action":"token_refreshed","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-10-02 15:53:59.906863+00	
00000000-0000-0000-0000-000000000000	4c59f175-239d-4691-8966-6aaf6d8629b5	{"action":"token_revoked","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-10-02 15:53:59.922279+00	
00000000-0000-0000-0000-000000000000	10138080-a56d-4a40-923c-75e286d14447	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-02 15:54:00.201207+00	
00000000-0000-0000-0000-000000000000	9b60c410-504b-4667-ab54-2b9c2b79f9a0	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-02 15:54:04.919207+00	
00000000-0000-0000-0000-000000000000	ab28d2a0-f922-4467-9525-d7a4e05b2177	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-02 15:55:19.177941+00	
00000000-0000-0000-0000-000000000000	81da9244-5578-47fa-b1b0-38e0eb74937f	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-02 15:55:24.459516+00	
00000000-0000-0000-0000-000000000000	50244786-d5b0-4220-ae67-8169dd6df2e4	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-02 16:08:25.659843+00	
00000000-0000-0000-0000-000000000000	b7384178-3d7a-472d-bed9-596c6ad1d894	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-02 16:08:28.333775+00	
00000000-0000-0000-0000-000000000000	81aff8b1-0000-4ecc-85d4-8823384ddc6b	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-02 16:11:57.121656+00	
00000000-0000-0000-0000-000000000000	a740dab5-0af2-45b8-95f7-34b101850ab0	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-02 16:12:00.418132+00	
00000000-0000-0000-0000-000000000000	a85360bd-7287-4787-89d1-cbc26113a061	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-03 01:32:30.566143+00	
00000000-0000-0000-0000-000000000000	4608bed3-a4ed-4ae6-b994-458166fcde57	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-03 01:32:45.35373+00	
00000000-0000-0000-0000-000000000000	cf013c6e-bb03-42c7-86ca-f95086970a96	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-03 01:32:51.782067+00	
00000000-0000-0000-0000-000000000000	7dbf6b98-5664-49f7-b98e-91f6c29506dc	{"action":"token_refreshed","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-10-03 02:31:26.308219+00	
00000000-0000-0000-0000-000000000000	9d361e82-3032-4d0e-9743-5922a9c8df6f	{"action":"token_revoked","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-10-03 02:31:26.326644+00	
00000000-0000-0000-0000-000000000000	cbe8721a-4ad1-47cf-986a-207adc6c26b3	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-03 03:27:03.825353+00	
00000000-0000-0000-0000-000000000000	40840843-a199-4499-a556-c5d1111e8490	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-03 03:27:10.118513+00	
00000000-0000-0000-0000-000000000000	dae6de19-0ed6-49a2-a5e8-b33c423ec384	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-03 03:27:50.436329+00	
00000000-0000-0000-0000-000000000000	ff788a64-1e41-4011-98ab-a8bbe19135e5	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 08:45:03.056849+00	
00000000-0000-0000-0000-000000000000	497dbe9c-efb8-4a20-9991-903895dc4dab	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-03 03:27:56.92773+00	
00000000-0000-0000-0000-000000000000	3be6e155-74ee-4ea7-874c-d4263cda9942	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-03 03:28:56.020593+00	
00000000-0000-0000-0000-000000000000	4f0545fa-0141-4e01-87ca-faf22937f0bf	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-03 03:29:05.749472+00	
00000000-0000-0000-0000-000000000000	db7cefec-90f9-43da-9ed5-efd588d143a0	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-03 03:31:22.114631+00	
00000000-0000-0000-0000-000000000000	9ba7400a-ef58-4bea-8724-d01c939727a0	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-03 03:31:29.449643+00	
00000000-0000-0000-0000-000000000000	b93935fd-fb93-4314-9214-72186fbe445e	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-03 08:15:40.721226+00	
00000000-0000-0000-0000-000000000000	a028e010-6e13-436c-b3dd-6ee860a9d121	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-03 09:09:13.085388+00	
00000000-0000-0000-0000-000000000000	17e0c44d-344b-4726-96dd-2396636d556d	{"action":"login","actor_id":"51f47342-ed3d-4e1b-8d03-3863a8de027c","actor_username":"peter@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-03 09:09:20.988837+00	
00000000-0000-0000-0000-000000000000	ff221454-76c3-42b0-9473-21a4190517cc	{"action":"logout","actor_id":"51f47342-ed3d-4e1b-8d03-3863a8de027c","actor_username":"peter@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-03 09:09:27.307443+00	
00000000-0000-0000-0000-000000000000	8a005835-453a-4aa4-924d-6014b1dd61ee	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-03 09:09:33.21786+00	
00000000-0000-0000-0000-000000000000	0790a68b-6c65-448b-a7b3-e1aabd26d950	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-03 09:17:49.475026+00	
00000000-0000-0000-0000-000000000000	ad3f02d1-4900-4f20-87d5-552e82202f86	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-03 09:22:16.002847+00	
00000000-0000-0000-0000-000000000000	4137e473-293e-47e8-915a-524d54907961	{"action":"token_refreshed","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-10-03 11:22:02.872992+00	
00000000-0000-0000-0000-000000000000	6a7e11ba-75e1-48a4-acf0-dec36675ddfd	{"action":"token_revoked","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-10-03 11:22:02.901009+00	
00000000-0000-0000-0000-000000000000	2d1ece60-8a93-4512-80ec-f676c389dd78	{"action":"token_refreshed","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-10-03 13:02:44.644327+00	
00000000-0000-0000-0000-000000000000	082234f8-e132-4223-a991-7bfde3f19f22	{"action":"token_revoked","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-10-03 13:02:44.665767+00	
00000000-0000-0000-0000-000000000000	3a62e017-631c-4204-86a9-f08b9e80dad1	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-03 13:09:18.474534+00	
00000000-0000-0000-0000-000000000000	1332dd25-2a82-4778-b8a5-ce59dadb5ffe	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-03 13:09:28.270404+00	
00000000-0000-0000-0000-000000000000	f978bb9c-9536-4cc0-83d2-af9eedbf77b0	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-03 13:15:21.40045+00	
00000000-0000-0000-0000-000000000000	d8da492d-d754-406a-8427-9525bf8cb2b3	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-03 13:15:26.038963+00	
00000000-0000-0000-0000-000000000000	34ac5f88-0cf4-46ea-b27e-f0e27b9ef252	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-03 13:19:01.136024+00	
00000000-0000-0000-0000-000000000000	038606a0-6e3c-43a1-8de8-af46f222f79c	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-03 14:10:16.886647+00	
00000000-0000-0000-0000-000000000000	bf9d9563-2c2c-48d8-84fb-f7b9ccbf3956	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-03 14:13:00.427558+00	
00000000-0000-0000-0000-000000000000	b4f9d001-299b-4bad-93e2-611b25585f0b	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-03 14:17:00.961804+00	
00000000-0000-0000-0000-000000000000	4227ef13-09bf-4fb1-93b3-9f38c0911d44	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-03 14:24:06.767628+00	
00000000-0000-0000-0000-000000000000	3ba0e5b0-4d80-41f2-abb8-b23c27b7ecc0	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-03 14:24:09.834947+00	
00000000-0000-0000-0000-000000000000	46752b36-a28b-4298-9262-64d464d75738	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-03 14:26:19.693673+00	
00000000-0000-0000-0000-000000000000	d7395d86-42b6-4672-97f8-fa7906dee797	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-03 14:26:24.295981+00	
00000000-0000-0000-0000-000000000000	dee541cc-b8b2-4fa5-acac-6570ac64a17b	{"action":"token_refreshed","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-03 15:54:06.179732+00	
00000000-0000-0000-0000-000000000000	97d047cb-1e21-4040-af61-4bac4e96bb35	{"action":"token_revoked","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-03 15:54:06.210689+00	
00000000-0000-0000-0000-000000000000	0d4eae6d-e0f6-4596-b2b0-6db2cfcf111d	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-03 16:34:50.638261+00	
00000000-0000-0000-0000-000000000000	df7e0a00-b79e-4629-abfc-f9f77a979e43	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-03 16:36:42.688305+00	
00000000-0000-0000-0000-000000000000	74ee76b9-acf4-44c9-97ab-e65f00fd315a	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-03 16:36:47.862384+00	
00000000-0000-0000-0000-000000000000	08133788-2f5d-43c2-a3b6-c8fa6228480c	{"action":"token_refreshed","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-03 20:25:56.252212+00	
00000000-0000-0000-0000-000000000000	80b468d5-4b8a-4496-bbee-45c796a261cd	{"action":"token_revoked","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-03 20:25:56.279565+00	
00000000-0000-0000-0000-000000000000	01c27528-1745-4c20-9aa1-181c07f7af5b	{"action":"token_refreshed","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-03 21:28:44.234106+00	
00000000-0000-0000-0000-000000000000	80b7d614-a2b1-43bf-a82b-d718591f240c	{"action":"token_revoked","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-03 21:28:44.250317+00	
00000000-0000-0000-0000-000000000000	10d2e766-9d39-49b1-8c3b-2c3e58b26e68	{"action":"token_refreshed","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-03 22:52:36.67993+00	
00000000-0000-0000-0000-000000000000	5c707ceb-f01a-4c07-a683-01c0644e4148	{"action":"token_revoked","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-03 22:52:36.697648+00	
00000000-0000-0000-0000-000000000000	52dd38f8-7367-4d15-95a1-0b1dfb6db7d5	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-03 23:21:36.466913+00	
00000000-0000-0000-0000-000000000000	65fede7d-4fa9-4a0b-8cfa-572cc275e2f3	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-03 23:21:52.719677+00	
00000000-0000-0000-0000-000000000000	3e893b7e-ff87-4d42-944f-9113ece619a5	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-03 23:24:29.372125+00	
00000000-0000-0000-0000-000000000000	571a408a-2908-4541-b68d-38f18168a29b	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-03 23:37:30.130542+00	
00000000-0000-0000-0000-000000000000	05386ef5-ae87-4c57-9409-e1f06e89045a	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-03 23:38:20.857154+00	
00000000-0000-0000-0000-000000000000	22253fda-ac74-48a0-a84b-d4f6bf9af714	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-03 23:38:27.564813+00	
00000000-0000-0000-0000-000000000000	c34e63e6-468a-4c95-b3c0-dc0cb4bfdce7	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-03 23:40:39.231067+00	
00000000-0000-0000-0000-000000000000	41fd8a16-4ed3-4c7b-852f-ee043c63067d	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-03 23:42:46.283705+00	
00000000-0000-0000-0000-000000000000	61a01bad-9435-4ba9-b368-6d0bdee3c36a	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-03 23:44:54.041139+00	
00000000-0000-0000-0000-000000000000	b073b503-9d7a-4925-aaf9-eb89f1751cb0	{"action":"login","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-03 23:45:06.966606+00	
00000000-0000-0000-0000-000000000000	52cc2a1e-5c50-4558-83ff-658b88598bf8	{"action":"logout","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-04 00:14:17.868577+00	
00000000-0000-0000-0000-000000000000	7c920ecd-0d19-4b86-9e8a-3d23417526de	{"action":"login","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-04 00:14:24.464007+00	
00000000-0000-0000-0000-000000000000	0d0372ff-67b9-436f-82e7-0c7b581b285a	{"action":"logout","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-04 00:15:36.539777+00	
00000000-0000-0000-0000-000000000000	4e3de693-967e-462f-a18b-2f6127ffd63b	{"action":"login","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-04 00:15:40.944228+00	
00000000-0000-0000-0000-000000000000	82754f14-c3ab-472f-b6f0-6a1fcf288f93	{"action":"logout","actor_id":"541b69e6-5c6e-4ad7-8764-7aa01c435021","actor_username":"tony@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-04 00:16:02.137782+00	
00000000-0000-0000-0000-000000000000	4ec52e79-f6f9-4bf8-84cc-6b1a8dec770a	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-04 00:16:07.895839+00	
00000000-0000-0000-0000-000000000000	77d74f15-fcb5-4497-8011-00c50baa3051	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-04 00:28:30.171399+00	
00000000-0000-0000-0000-000000000000	066420d3-b176-4e18-8083-fe1f18ca5d3a	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-04 00:28:36.468245+00	
00000000-0000-0000-0000-000000000000	40677441-ede0-4464-9be4-35dec0275000	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-04 00:38:40.677682+00	
00000000-0000-0000-0000-000000000000	ed79d131-46d5-4e0d-8ee5-d0b530277d46	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-04 00:38:47.351915+00	
00000000-0000-0000-0000-000000000000	fc2995a5-fe53-4bf3-acf4-139b1616f460	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-04 00:39:10.28594+00	
00000000-0000-0000-0000-000000000000	4cea181d-947c-4b67-b9c8-68399ec8ee0e	{"action":"user_signedup","actor_id":"4f6068ff-f8bc-4c66-8ecc-1fa8b006412b","actor_username":"stark@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-04 00:41:03.24202+00	
00000000-0000-0000-0000-000000000000	0fe1c31b-85af-4aac-83f3-271f8dc15974	{"action":"login","actor_id":"4f6068ff-f8bc-4c66-8ecc-1fa8b006412b","actor_username":"stark@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-04 00:41:03.253674+00	
00000000-0000-0000-0000-000000000000	c307f9e8-64c2-436b-8071-3db9341f4708	{"action":"logout","actor_id":"4f6068ff-f8bc-4c66-8ecc-1fa8b006412b","actor_username":"stark@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-04 00:41:37.81107+00	
00000000-0000-0000-0000-000000000000	5b5d5a46-c0de-4e23-8f29-26f5afd85505	{"action":"login","actor_id":"4f6068ff-f8bc-4c66-8ecc-1fa8b006412b","actor_username":"stark@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-04 00:42:00.219041+00	
00000000-0000-0000-0000-000000000000	b2845050-dd77-4ee6-a71f-e2b151941701	{"action":"logout","actor_id":"4f6068ff-f8bc-4c66-8ecc-1fa8b006412b","actor_username":"stark@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-04 00:42:05.301904+00	
00000000-0000-0000-0000-000000000000	55d54e5b-07e2-4e0f-b4c0-8c2c7f822483	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-04 00:42:11.777501+00	
00000000-0000-0000-0000-000000000000	4b886d17-a819-4992-8a47-a9d3600e70e8	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-04 00:42:41.029073+00	
00000000-0000-0000-0000-000000000000	bbf366e8-6f63-40cf-993e-23ab7d8f656c	{"action":"login","actor_id":"4f6068ff-f8bc-4c66-8ecc-1fa8b006412b","actor_username":"stark@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-04 00:42:58.072712+00	
00000000-0000-0000-0000-000000000000	f9e0d97b-1123-4c8f-a4c8-074a6504b486	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-04 07:32:23.642699+00	
00000000-0000-0000-0000-000000000000	1468608f-1417-4304-96e3-e27cd34abcfd	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-04 07:32:54.227544+00	
00000000-0000-0000-0000-000000000000	8c4565e3-bd9a-408a-b7c4-77ebb1fe836c	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-04 07:33:00.778679+00	
00000000-0000-0000-0000-000000000000	465b7883-44cb-4c0c-9457-b4ef66022726	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-04 07:33:42.592602+00	
00000000-0000-0000-0000-000000000000	873decbc-421b-4302-9c48-751e8160829b	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-04 07:33:50.087644+00	
00000000-0000-0000-0000-000000000000	58050be4-79bf-4e66-a4eb-235c68f746ac	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-04 07:34:30.990597+00	
00000000-0000-0000-0000-000000000000	fb4e9e62-4449-48c0-8dea-5b7f277b70f0	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-04 09:46:56.28726+00	
00000000-0000-0000-0000-000000000000	c291444e-b66d-41ec-bc5d-ff4ae1192ddd	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-04 09:48:42.958363+00	
00000000-0000-0000-0000-000000000000	b4b26674-fcfd-4b9b-84bb-fc450b1b08c5	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-04 09:49:22.053643+00	
00000000-0000-0000-0000-000000000000	3abbc6b7-977d-442d-bfbe-07bc4a8ca416	{"action":"token_refreshed","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-04 10:49:20.689637+00	
00000000-0000-0000-0000-000000000000	fdb60757-9708-427a-9a43-cd5725f80ad8	{"action":"token_revoked","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-04 10:49:20.710854+00	
00000000-0000-0000-0000-000000000000	0e45ca82-489d-4db9-837d-98a9ba5d9987	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-04 11:00:09.138912+00	
00000000-0000-0000-0000-000000000000	291a4d52-0440-46d5-b6c9-f25f6b8b0b68	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-04 11:00:17.075339+00	
00000000-0000-0000-0000-000000000000	62c424bf-c3be-4c23-8469-7e8bcffac1c2	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-04 11:33:04.78718+00	
00000000-0000-0000-0000-000000000000	336da4ed-a589-4733-a211-1cc06568a663	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-04 11:33:11.544588+00	
00000000-0000-0000-0000-000000000000	72f633d2-b3fd-4ae3-985e-bf4c545491c4	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-04 12:06:32.371062+00	
00000000-0000-0000-0000-000000000000	eb5edf36-4b4f-42de-8f73-88a403ddfbd0	{"action":"login","actor_id":"51f47342-ed3d-4e1b-8d03-3863a8de027c","actor_username":"peter@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-04 12:06:37.323733+00	
00000000-0000-0000-0000-000000000000	6d85d85b-36eb-4985-bcc1-70d457b0f448	{"action":"logout","actor_id":"51f47342-ed3d-4e1b-8d03-3863a8de027c","actor_username":"peter@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-04 12:08:03.226673+00	
00000000-0000-0000-0000-000000000000	1bc7f046-453a-4e4e-b444-e5bd41ff8db2	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-04 12:12:22.406146+00	
00000000-0000-0000-0000-000000000000	58087891-b079-46b8-895b-d9072572312f	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-04 12:15:55.866227+00	
00000000-0000-0000-0000-000000000000	43bbac87-1352-44e0-92e2-5bfae34a0531	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-04 12:16:00.205559+00	
00000000-0000-0000-0000-000000000000	62cd2e34-b155-4223-9ab7-50e7c6a4e1e8	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-04 12:16:20.352009+00	
00000000-0000-0000-0000-000000000000	4c9fa149-0740-4297-b052-c11927f2cb32	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-04 12:16:25.591456+00	
00000000-0000-0000-0000-000000000000	99fc1456-1342-40f8-ba03-359d7a481795	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-04 12:17:40.553028+00	
00000000-0000-0000-0000-000000000000	49358f38-e3de-460f-adbd-6b14a24ff42f	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-04 12:17:57.313547+00	
00000000-0000-0000-0000-000000000000	7ce8fb94-8dad-4d53-b62d-25ce7fe56fa2	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-04 12:18:34.713142+00	
00000000-0000-0000-0000-000000000000	7f0d3c35-e407-40e5-9de8-25de53c2b113	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-04 12:18:38.772147+00	
00000000-0000-0000-0000-000000000000	7152a250-e0a9-41f5-bb63-b492fe27efcb	{"action":"token_refreshed","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-04 15:11:47.557426+00	
00000000-0000-0000-0000-000000000000	55423b60-e44c-46aa-93d2-bb985bf7d1f8	{"action":"token_revoked","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-04 15:11:47.589001+00	
00000000-0000-0000-0000-000000000000	d3565263-1583-4644-868e-7de815cfd9be	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-04 15:13:36.469465+00	
00000000-0000-0000-0000-000000000000	f34af636-9cb5-4742-90ea-2c8f0a8edb85	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-05 06:33:15.30397+00	
00000000-0000-0000-0000-000000000000	7dab6522-42e0-4cd4-9c9e-6b4f49341d3c	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-05 06:33:33.948323+00	
00000000-0000-0000-0000-000000000000	84dbcab9-4cfd-481a-bdf7-dc0086fd9ad0	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-05 06:33:49.355938+00	
00000000-0000-0000-0000-000000000000	f8cdac61-3f06-4341-81e9-a5cfe0a1324f	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-05 06:37:24.937863+00	
00000000-0000-0000-0000-000000000000	1e9fc68f-d83b-4642-9858-471d0aa4e9cc	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-05 11:37:00.815091+00	
00000000-0000-0000-0000-000000000000	789ed05d-1987-461f-94e1-5af8b5e8b902	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-05 11:44:08.300403+00	
00000000-0000-0000-0000-000000000000	42a4cdb0-df6a-4773-bd83-014ab60e155b	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-05 11:44:17.238304+00	
00000000-0000-0000-0000-000000000000	3fd6e004-72e2-4dac-8159-a7d9d5f7b235	{"action":"token_refreshed","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-05 13:03:52.729054+00	
00000000-0000-0000-0000-000000000000	d9fbbbfb-df05-4fda-a49b-02e8dd077dd0	{"action":"token_revoked","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-05 13:03:52.754903+00	
00000000-0000-0000-0000-000000000000	2f14fb1e-90cf-4153-b02c-4d06ebd21d59	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-05 13:07:34.777501+00	
00000000-0000-0000-0000-000000000000	cf4fe34b-916a-45fe-b824-254961311791	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-05 13:07:40.147495+00	
00000000-0000-0000-0000-000000000000	95c2611e-24f0-4243-b4ec-97db2f58b2a9	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-05 13:08:11.342371+00	
00000000-0000-0000-0000-000000000000	af3deb18-2a21-4558-baf7-30a63a81af08	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-05 13:08:18.783252+00	
00000000-0000-0000-0000-000000000000	ff2861d0-eb3c-4615-a61e-245d3dc96f9f	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-05 13:40:52.965006+00	
00000000-0000-0000-0000-000000000000	5cc96cc9-8390-4c8c-b1a1-9847be90f4b6	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-05 13:40:58.265241+00	
00000000-0000-0000-0000-000000000000	d28079ec-d0d0-4145-9f37-607bd1eddc67	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-05 13:41:21.006102+00	
00000000-0000-0000-0000-000000000000	ea48ae19-db53-4a6a-8d47-62a48645b488	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-05 13:41:38.463269+00	
00000000-0000-0000-0000-000000000000	c57566b8-3175-4a89-978e-dc6c27efca3e	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-05 13:42:00.732707+00	
00000000-0000-0000-0000-000000000000	e8a32e8a-6e90-4abe-8544-b80e828198c9	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-05 13:42:07.317284+00	
00000000-0000-0000-0000-000000000000	bf52d25d-8e6c-4c1c-95ae-311a866b98e2	{"action":"token_refreshed","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-10-06 10:29:28.668749+00	
00000000-0000-0000-0000-000000000000	24ae03aa-8fa2-448e-929f-945792b89978	{"action":"token_revoked","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-10-06 10:29:28.706309+00	
00000000-0000-0000-0000-000000000000	55d18e78-cec2-46d8-b542-8777c7fb443d	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-06 10:49:26.161296+00	
00000000-0000-0000-0000-000000000000	4b2db63e-90ea-41fb-9fd3-e1c650c46185	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-06 10:49:40.491423+00	
00000000-0000-0000-0000-000000000000	fb45394f-97ad-4afa-9689-191ec7f3eeda	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-06 10:54:35.588321+00	
00000000-0000-0000-0000-000000000000	5e2f6628-aae4-453b-b9d7-bb644ccf42ec	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-06 10:54:41.241511+00	
00000000-0000-0000-0000-000000000000	68714b98-d94d-4b15-8e71-8dda83abb25c	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-06 10:59:25.488682+00	
00000000-0000-0000-0000-000000000000	fab24368-27b0-4de6-a79b-93eede3eab91	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-06 10:59:30.174397+00	
00000000-0000-0000-0000-000000000000	ecbecf95-c234-42a1-9f4a-d2bf090fdeb8	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-06 11:31:56.51501+00	
00000000-0000-0000-0000-000000000000	14e6dedb-98af-485a-a423-dcc5d7701d25	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-06 11:46:05.739893+00	
00000000-0000-0000-0000-000000000000	12e98285-b7f0-46c9-825f-53928b2f8052	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-06 11:54:44.092121+00	
00000000-0000-0000-0000-000000000000	fa37d071-59df-41ee-a695-ed9ccbc4cd1e	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-06 12:12:59.612848+00	
00000000-0000-0000-0000-000000000000	168af2f7-ef5d-4b02-b1f8-289089c2549f	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-06 12:46:49.472899+00	
00000000-0000-0000-0000-000000000000	abe84541-5a4f-4b1f-a3f2-a80a4b78c399	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-06 12:46:51.989036+00	
00000000-0000-0000-0000-000000000000	f0a29470-bf54-4c3a-8b75-8a242ddc813c	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-06 12:49:15.20906+00	
00000000-0000-0000-0000-000000000000	3d840e75-f14f-453c-b3d1-907fdb709636	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-06 12:49:21.388459+00	
00000000-0000-0000-0000-000000000000	c30a4bfc-1eb0-40a3-9aae-40d0ffae92d8	{"action":"token_refreshed","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-06 17:16:31.6314+00	
00000000-0000-0000-0000-000000000000	e35437a0-9ba5-494d-ab98-8ea7946cff77	{"action":"token_revoked","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-06 17:16:31.645939+00	
00000000-0000-0000-0000-000000000000	907bd29f-bfd9-4a0a-9ead-7b7bb67bdc35	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-06 17:16:39.491762+00	
00000000-0000-0000-0000-000000000000	7cb1e186-bac5-4dbc-bb15-1d293831ad64	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-06 17:16:44.587281+00	
00000000-0000-0000-0000-000000000000	ac73ebf5-1931-47ba-b67f-286f64b78800	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-11 07:47:40.68221+00	
00000000-0000-0000-0000-000000000000	984f21d8-11a8-437c-905c-4092b1ffbe4e	{"action":"token_refreshed","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-11 12:25:02.727326+00	
00000000-0000-0000-0000-000000000000	9c55492f-2fa3-4353-9a0c-3c8ca3b957fe	{"action":"token_revoked","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-11 12:25:02.747794+00	
00000000-0000-0000-0000-000000000000	ce6a2a13-e461-4b3e-833b-35da03ffc2a3	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-11 12:25:40.670222+00	
00000000-0000-0000-0000-000000000000	63dfb264-8fbd-484c-8261-87c38ed85860	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-11 12:30:28.809701+00	
00000000-0000-0000-0000-000000000000	5c4acbbc-7b26-487d-a337-57d6db76cf5a	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-11 12:33:27.11007+00	
00000000-0000-0000-0000-000000000000	121e5110-5fe3-4950-bb51-8731fa1606cf	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-11 12:33:31.827066+00	
00000000-0000-0000-0000-000000000000	0380dcee-70ae-4275-9567-146133d23884	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-11 13:21:38.084749+00	
00000000-0000-0000-0000-000000000000	a4fb8344-25f3-48d4-b105-0ab8c8d9819b	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-11 13:21:44.600985+00	
00000000-0000-0000-0000-000000000000	d6b020b5-f675-40b1-ace8-c73060ae1599	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-11 13:43:38.101879+00	
00000000-0000-0000-0000-000000000000	ecf96689-bc7c-43c8-bfa7-3cd84a9d1484	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-11 13:43:42.007844+00	
00000000-0000-0000-0000-000000000000	110feb3d-fd13-40b5-ada1-6930a8db9484	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-11 13:47:18.36248+00	
00000000-0000-0000-0000-000000000000	85eed320-498e-43d0-96ba-aa3272870d3c	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-11 13:48:42.672182+00	
00000000-0000-0000-0000-000000000000	49170c4d-48ce-40bb-a700-de6b48636418	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-11 13:57:49.230916+00	
00000000-0000-0000-0000-000000000000	1c12d420-b0a4-4709-b997-173ee9fcd042	{"action":"user_signedup","actor_id":"af5f30cf-4ce8-42c2-93bc-379fd6f05122","actor_username":"steve@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-11 14:05:35.030519+00	
00000000-0000-0000-0000-000000000000	ec0df5d5-3672-48f5-9014-532ffd843b3e	{"action":"login","actor_id":"af5f30cf-4ce8-42c2-93bc-379fd6f05122","actor_username":"steve@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-11 14:05:35.049033+00	
00000000-0000-0000-0000-000000000000	01c4e79f-7c39-4077-8155-3d39a16c8f93	{"action":"logout","actor_id":"af5f30cf-4ce8-42c2-93bc-379fd6f05122","actor_username":"steve@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-11 14:09:05.241964+00	
00000000-0000-0000-0000-000000000000	a8746722-8219-4307-868c-5ea9e1157c4e	{"action":"user_repeated_signup","actor_id":"af5f30cf-4ce8-42c2-93bc-379fd6f05122","actor_username":"steve@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-10-11 14:11:25.943638+00	
00000000-0000-0000-0000-000000000000	99063413-2b9a-406c-abaa-2effcb20f60f	{"action":"user_signedup","actor_id":"9a7214bd-fed5-436f-8403-9f193276312d","actor_username":"fenil@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-11 14:15:25.003514+00	
00000000-0000-0000-0000-000000000000	734eb8ca-5f44-49d0-83d6-a86a2b94fa90	{"action":"login","actor_id":"9a7214bd-fed5-436f-8403-9f193276312d","actor_username":"fenil@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-11 14:15:25.013261+00	
00000000-0000-0000-0000-000000000000	e17eddd8-b6b5-4c20-bdeb-ed5429290c35	{"action":"token_refreshed","actor_id":"4f6068ff-f8bc-4c66-8ecc-1fa8b006412b","actor_username":"stark@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-11 14:20:19.973603+00	
00000000-0000-0000-0000-000000000000	cf55c8f1-3f49-426f-9998-b28fe36dd199	{"action":"token_revoked","actor_id":"4f6068ff-f8bc-4c66-8ecc-1fa8b006412b","actor_username":"stark@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-11 14:20:19.979054+00	
00000000-0000-0000-0000-000000000000	f5f16c9e-9585-4d40-b7bf-123cb4459e08	{"action":"logout","actor_id":"9a7214bd-fed5-436f-8403-9f193276312d","actor_username":"fenil@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-11 14:21:41.437018+00	
00000000-0000-0000-0000-000000000000	0b102758-0860-432f-81e3-74ebf31b6c6d	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-11 14:21:53.971978+00	
00000000-0000-0000-0000-000000000000	5a6df36d-398c-43b7-9452-e05bf324db6f	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-11 14:22:44.397319+00	
00000000-0000-0000-0000-000000000000	b1a6978a-c3eb-4d70-a4ca-06448fd712c6	{"action":"user_signedup","actor_id":"5c13d7e0-4377-4c38-938f-219e7f071a64","actor_username":"meet@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-11 14:23:15.613353+00	
00000000-0000-0000-0000-000000000000	345ef2ed-9f53-4e17-98de-d86cf484ab34	{"action":"login","actor_id":"5c13d7e0-4377-4c38-938f-219e7f071a64","actor_username":"meet@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-11 14:23:15.618487+00	
00000000-0000-0000-0000-000000000000	f902f2ea-2bd7-42ca-a45f-226211c85d33	{"action":"logout","actor_id":"5c13d7e0-4377-4c38-938f-219e7f071a64","actor_username":"meet@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-11 14:24:35.886514+00	
00000000-0000-0000-0000-000000000000	63d20c52-b0bd-4355-b277-f359bbdb6de1	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-11 14:24:38.576479+00	
00000000-0000-0000-0000-000000000000	7adaa6c9-096c-4523-8894-812a729be3f9	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-11 14:24:47.591018+00	
00000000-0000-0000-0000-000000000000	3e75a4fc-6386-44ed-a020-9a610f8d8a8d	{"action":"user_signedup","actor_id":"862728e7-d599-44fc-95e6-b26690d0e993","actor_username":"devam@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-11 14:25:20.924142+00	
00000000-0000-0000-0000-000000000000	0911e082-cc6f-47b0-9b1a-fa44eb25fd43	{"action":"login","actor_id":"862728e7-d599-44fc-95e6-b26690d0e993","actor_username":"devam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-11 14:25:20.952905+00	
00000000-0000-0000-0000-000000000000	4a58d98d-3653-4640-9ea2-018e51d209fe	{"action":"logout","actor_id":"862728e7-d599-44fc-95e6-b26690d0e993","actor_username":"devam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-11 14:29:04.088713+00	
00000000-0000-0000-0000-000000000000	cd885cbf-6eea-4cb0-bbae-e3b3f905f813	{"action":"user_signedup","actor_id":"dda49e5f-250c-4a86-ab5a-88fbf67afc36","actor_username":"kavya@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-11 14:30:00.671299+00	
00000000-0000-0000-0000-000000000000	ef1961d3-a00c-43a7-afbe-48b085dab959	{"action":"login","actor_id":"dda49e5f-250c-4a86-ab5a-88fbf67afc36","actor_username":"kavya@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-11 14:30:00.678038+00	
00000000-0000-0000-0000-000000000000	d0d2979c-e3b2-4b07-a46b-9ef3d1da4317	{"action":"logout","actor_id":"dda49e5f-250c-4a86-ab5a-88fbf67afc36","actor_username":"kavya@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-11 14:32:39.595781+00	
00000000-0000-0000-0000-000000000000	dcf623d6-34f8-4a06-ad56-a0a7f60ffb23	{"action":"user_signedup","actor_id":"800d97d7-f790-4ca9-9895-e38cd2222a37","actor_username":"pujan@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-11 14:37:19.198996+00	
00000000-0000-0000-0000-000000000000	41b887d9-9034-40e4-a4ae-a3cf70864167	{"action":"login","actor_id":"800d97d7-f790-4ca9-9895-e38cd2222a37","actor_username":"pujan@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-11 14:37:19.207166+00	
00000000-0000-0000-0000-000000000000	47392a0c-dcfd-4a7b-ba9e-886f298ede4e	{"action":"logout","actor_id":"800d97d7-f790-4ca9-9895-e38cd2222a37","actor_username":"pujan@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-11 14:38:03.528534+00	
00000000-0000-0000-0000-000000000000	424949fa-cb3d-4627-9535-488358bee6e7	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-11 14:39:44.775943+00	
00000000-0000-0000-0000-000000000000	b28d1f31-2c83-439c-a3ff-adde3dd4b81b	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-11 14:40:36.200893+00	
00000000-0000-0000-0000-000000000000	40005fae-82d6-4057-9889-b3224e1c9a06	{"action":"user_signedup","actor_id":"69e1780f-b194-4ca5-ac19-3d13dc70d624","actor_username":"meet@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-11 14:50:12.321899+00	
00000000-0000-0000-0000-000000000000	c6d2319a-fb8c-471c-bce9-4faf0ff4c3ea	{"action":"login","actor_id":"69e1780f-b194-4ca5-ac19-3d13dc70d624","actor_username":"meet@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-11 14:50:12.328669+00	
00000000-0000-0000-0000-000000000000	952bc904-11a0-4e81-a346-a76889c3e4fa	{"action":"logout","actor_id":"69e1780f-b194-4ca5-ac19-3d13dc70d624","actor_username":"meet@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-11 14:50:17.956496+00	
00000000-0000-0000-0000-000000000000	a03f434b-0ce4-4069-86ea-47963ddb5b3c	{"action":"user_signedup","actor_id":"33e9b2e3-af18-4310-9ce8-733c365ae2ce","actor_username":"fenil@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-11 14:50:37.041154+00	
00000000-0000-0000-0000-000000000000	12b3ca8c-75f3-4468-b566-14087d43a9e5	{"action":"login","actor_id":"33e9b2e3-af18-4310-9ce8-733c365ae2ce","actor_username":"fenil@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-11 14:50:37.047124+00	
00000000-0000-0000-0000-000000000000	ebfed165-4d6b-4305-9b4c-69cc6768a00b	{"action":"logout","actor_id":"33e9b2e3-af18-4310-9ce8-733c365ae2ce","actor_username":"fenil@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-11 14:53:23.834089+00	
00000000-0000-0000-0000-000000000000	cb3c56ea-9c4d-4f7d-a61b-360939d96478	{"action":"user_signedup","actor_id":"0c359e05-cf82-4356-b240-d40ce51e699a","actor_username":"fenil@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-11 14:54:35.409482+00	
00000000-0000-0000-0000-000000000000	0802a6b7-dc70-4e2d-aa8f-60ca4e676b72	{"action":"login","actor_id":"0c359e05-cf82-4356-b240-d40ce51e699a","actor_username":"fenil@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-11 14:54:35.415426+00	
00000000-0000-0000-0000-000000000000	a25378ce-7de1-4d70-b102-5a76d5a8f639	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-11 14:55:43.545317+00	
00000000-0000-0000-0000-000000000000	49e505dc-20e4-48b0-b231-58f2d49dc626	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-11 14:56:30.603688+00	
00000000-0000-0000-0000-000000000000	cc50c150-81e0-4e83-a16b-1c6b255fc6b9	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-11 14:56:35.097422+00	
00000000-0000-0000-0000-000000000000	5d86aaa8-2e64-4659-9e86-8a947b161d3f	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-11 14:58:14.137454+00	
00000000-0000-0000-0000-000000000000	c936077c-ce18-4945-a5b0-d8f105f48381	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-11 14:58:26.212888+00	
00000000-0000-0000-0000-000000000000	ef7befb3-0eaf-48dd-ae0b-185ebc2b4f44	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-11 14:59:36.13048+00	
00000000-0000-0000-0000-000000000000	1db2824b-bf65-4681-913a-bf45fbacf31b	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-11 14:59:41.369767+00	
00000000-0000-0000-0000-000000000000	9d7eaa67-074e-4c84-8586-fd6bb4fd3a08	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-11 14:59:45.643979+00	
00000000-0000-0000-0000-000000000000	934c3579-4b01-437f-92ab-4d1ef4fcb305	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-11 14:59:55.556825+00	
00000000-0000-0000-0000-000000000000	34a63f2b-1de4-4351-96c9-7f9bf7340d51	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-11 15:12:52.882824+00	
00000000-0000-0000-0000-000000000000	7b07c094-5e88-4fd7-8463-22903972257a	{"action":"token_refreshed","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-10-11 16:03:12.824084+00	
00000000-0000-0000-0000-000000000000	cf8eed31-3c70-40b5-be0f-ce9dd1957a26	{"action":"token_revoked","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-10-11 16:03:12.838776+00	
00000000-0000-0000-0000-000000000000	a361b14f-35bc-4a10-8b25-5c7ac3242a43	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-11 16:17:36.513546+00	
00000000-0000-0000-0000-000000000000	860a114e-2f2d-42c7-9bbb-710f56e7f428	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-11 16:17:41.305507+00	
00000000-0000-0000-0000-000000000000	c4acda72-4815-4841-b48b-7f7d6f7668c7	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-11 16:18:21.644791+00	
00000000-0000-0000-0000-000000000000	d6e237bf-50bc-4697-a59d-ba61eb3320b4	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-11 16:18:27.335297+00	
00000000-0000-0000-0000-000000000000	8cc33858-1839-43c1-95b8-953023d13189	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-11 16:24:23.952992+00	
00000000-0000-0000-0000-000000000000	772649e0-61e6-4c19-86e4-9ae8a4811276	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-11 16:24:30.24215+00	
00000000-0000-0000-0000-000000000000	0de0d23e-d172-48c6-bbc6-438aa5e69806	{"action":"token_refreshed","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-12 08:35:51.604783+00	
00000000-0000-0000-0000-000000000000	b24908d5-f74e-44a1-bb24-25820b2d4a9d	{"action":"token_revoked","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-12 08:35:51.64564+00	
00000000-0000-0000-0000-000000000000	bad2155f-9ece-43e8-9335-378e25a4866f	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 08:43:44.399863+00	
00000000-0000-0000-0000-000000000000	0bb588a0-fb83-4c65-b50d-6df1f02e728b	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 08:43:50.507868+00	
00000000-0000-0000-0000-000000000000	1787a2cc-b6f6-4695-afe3-3159e3190f12	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 08:45:05.914002+00	
00000000-0000-0000-0000-000000000000	cdf20ba8-56d6-4b11-b73f-b70d3315d083	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 08:45:10.44077+00	
00000000-0000-0000-0000-000000000000	93215ade-7e37-4fe5-9128-c994083c2029	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 08:45:14.568996+00	
00000000-0000-0000-0000-000000000000	6c667426-271e-454d-9d13-edb624402402	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 08:54:52.635263+00	
00000000-0000-0000-0000-000000000000	b97d023b-9f32-465d-a278-13698d6d2eca	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 08:54:55.672888+00	
00000000-0000-0000-0000-000000000000	b6ba1c6f-8f28-48a8-a05e-fa0307fd872f	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 08:55:01.771409+00	
00000000-0000-0000-0000-000000000000	82302042-2c10-4b6f-8b68-e5ae3d0464ce	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 08:55:05.086401+00	
00000000-0000-0000-0000-000000000000	f6fce6ab-894a-49a6-8d9f-ab4eedcdf62a	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 08:55:08.132511+00	
00000000-0000-0000-0000-000000000000	1267c20c-bea7-46c1-9ce5-ac6f1a8dd803	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 08:55:12.980046+00	
00000000-0000-0000-0000-000000000000	d146e905-ffad-4d45-896b-4304f0daca48	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 08:57:23.806303+00	
00000000-0000-0000-0000-000000000000	b349e3cf-f198-45d9-b350-da9a19f92693	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 08:57:29.106363+00	
00000000-0000-0000-0000-000000000000	13876eba-370c-468a-9d4d-1a4e142c43c8	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 08:57:33.148137+00	
00000000-0000-0000-0000-000000000000	79a943ea-f6d9-4e0e-acef-1cedc90af8a3	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 08:57:53.460481+00	
00000000-0000-0000-0000-000000000000	93339267-210b-48f2-aa75-c0c6ca08b493	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 09:01:25.195682+00	
00000000-0000-0000-0000-000000000000	6220cc5b-820c-4ee5-9afc-54e046be2ef3	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 09:01:30.767073+00	
00000000-0000-0000-0000-000000000000	cf490aa8-8a9d-4c0b-b7ea-b166df1ac838	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 09:01:34.059385+00	
00000000-0000-0000-0000-000000000000	4b86012d-050e-4bcf-880d-1a722038335a	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 09:01:38.471343+00	
00000000-0000-0000-0000-000000000000	258b8e12-41f7-48ed-be30-a263a4296794	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 09:02:55.602644+00	
00000000-0000-0000-0000-000000000000	4f00a313-d22b-4ab1-aa2b-a0c28c434336	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 09:03:56.212333+00	
00000000-0000-0000-0000-000000000000	e785700e-0e59-4f35-8126-b7eb2c14592e	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 09:04:13.748736+00	
00000000-0000-0000-0000-000000000000	8e616a91-c19a-4a8c-858b-7e3fcf13349e	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 09:04:19.38994+00	
00000000-0000-0000-0000-000000000000	6bb6db33-3671-4ceb-94b1-26007e23e224	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 09:04:21.668384+00	
00000000-0000-0000-0000-000000000000	e5ec7978-e63a-4cd2-ba51-f245f5bc3a26	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 09:05:50.016605+00	
00000000-0000-0000-0000-000000000000	fc1a79bb-54c9-4b84-aa40-2bca66645f1d	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 09:05:55.100611+00	
00000000-0000-0000-0000-000000000000	b7aa33e5-c485-4313-8399-0f3ae27780ac	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 09:11:30.100208+00	
00000000-0000-0000-0000-000000000000	9e8d8a91-946e-458e-93ef-3c1bccf30f0b	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 09:11:41.799159+00	
00000000-0000-0000-0000-000000000000	cfe4d759-8452-4bc0-9d75-50f9efb8d26f	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 09:11:47.860466+00	
00000000-0000-0000-0000-000000000000	fb202872-2689-45b1-b2bb-0f262be0ebee	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 09:11:51.028552+00	
00000000-0000-0000-0000-000000000000	5d664345-765f-40ff-b7bf-d1e4bfd1a738	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 09:11:56.707038+00	
00000000-0000-0000-0000-000000000000	91543305-07b9-4cc6-986e-b13aee6dfc46	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 09:17:21.865905+00	
00000000-0000-0000-0000-000000000000	db834150-a976-4f9c-96c5-f8ec98ac53ab	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 09:17:24.600356+00	
00000000-0000-0000-0000-000000000000	b50f11e0-53b0-4e35-a3a2-756f1e08bc8d	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 09:17:28.853466+00	
00000000-0000-0000-0000-000000000000	08cb4e7a-4554-4684-9dc1-399a1e173ec6	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 09:17:33.749158+00	
00000000-0000-0000-0000-000000000000	1f97178c-1644-4d18-bd65-403fc3facc50	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 09:26:22.442471+00	
00000000-0000-0000-0000-000000000000	9466f523-3dd7-447e-b9c7-3e0d854d4012	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 09:26:27.170769+00	
00000000-0000-0000-0000-000000000000	1256091f-1550-44da-9e16-2815fb0e9d49	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 09:26:31.612412+00	
00000000-0000-0000-0000-000000000000	f65e4043-de68-4511-aba8-bccababecae2	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 09:26:39.705427+00	
00000000-0000-0000-0000-000000000000	4076ec3b-2abd-499c-a019-f708bfd66a0e	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 09:26:44.61389+00	
00000000-0000-0000-0000-000000000000	90f95c6e-b298-4980-86d6-5c5132083db8	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 09:27:35.360948+00	
00000000-0000-0000-0000-000000000000	5542ab52-0ade-4ff7-adce-2fce99e2a86b	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 09:27:41.871902+00	
00000000-0000-0000-0000-000000000000	0af99b6c-0838-443f-92c8-69f7abeeb9c4	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 09:27:51.915282+00	
00000000-0000-0000-0000-000000000000	b6f30ba1-588e-4638-b8a2-18cc1218829f	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 09:27:58.146032+00	
00000000-0000-0000-0000-000000000000	2dbd62dd-2533-4d41-a95a-b0c2bb94dc62	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 09:30:25.71513+00	
00000000-0000-0000-0000-000000000000	25f31b96-6600-4f82-8aaa-0e5eca462ee6	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 09:30:50.397657+00	
00000000-0000-0000-0000-000000000000	19100107-e551-4087-ae5f-7b9d022a230c	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 09:32:52.402049+00	
00000000-0000-0000-0000-000000000000	68aed9cd-6c4b-4c81-9de9-f5dbbfbc1554	{"action":"user_signedup","actor_id":"38f0c23d-4d25-42cd-8ec0-426d6636eecd","actor_username":"fenil@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-12 09:33:09.060648+00	
00000000-0000-0000-0000-000000000000	a6750f71-4616-42da-b4fb-5df3254d3259	{"action":"login","actor_id":"38f0c23d-4d25-42cd-8ec0-426d6636eecd","actor_username":"fenil@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 09:33:09.070576+00	
00000000-0000-0000-0000-000000000000	a6b7e1fc-013d-413c-ad29-096b5dfc07e9	{"action":"logout","actor_id":"38f0c23d-4d25-42cd-8ec0-426d6636eecd","actor_username":"fenil@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 09:34:31.143188+00	
00000000-0000-0000-0000-000000000000	6fb911a7-774f-401c-8b68-d9a659279120	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 09:34:35.396845+00	
00000000-0000-0000-0000-000000000000	810788b7-0363-49ea-8b3d-76be6adcffc3	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 09:37:18.258324+00	
00000000-0000-0000-0000-000000000000	c57c4aaa-89d2-4c11-ae3d-ec131faa12b3	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 09:37:24.279977+00	
00000000-0000-0000-0000-000000000000	626f811d-7ca9-4e3f-8918-3b9ba4ea5428	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 09:37:37.732646+00	
00000000-0000-0000-0000-000000000000	8bc81f59-9c92-4ab1-9371-89e3307fd35e	{"action":"login","actor_id":"38f0c23d-4d25-42cd-8ec0-426d6636eecd","actor_username":"fenil@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 09:37:48.702302+00	
00000000-0000-0000-0000-000000000000	5f451a6b-2b52-48da-9101-6ed00d75317d	{"action":"token_refreshed","actor_id":"38f0c23d-4d25-42cd-8ec0-426d6636eecd","actor_username":"fenil@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-12 11:24:56.457304+00	
00000000-0000-0000-0000-000000000000	bf2ab4ad-1f58-458e-ac0d-2c44cc974c3b	{"action":"token_revoked","actor_id":"38f0c23d-4d25-42cd-8ec0-426d6636eecd","actor_username":"fenil@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-12 11:24:56.492283+00	
00000000-0000-0000-0000-000000000000	4486433d-0e82-468f-8b99-a1824a1f2fc4	{"action":"logout","actor_id":"38f0c23d-4d25-42cd-8ec0-426d6636eecd","actor_username":"fenil@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 11:59:48.238799+00	
00000000-0000-0000-0000-000000000000	d124d828-fdb6-4c0d-b1c4-9d49a5c46375	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 11:59:55.330455+00	
00000000-0000-0000-0000-000000000000	beab9d56-9cca-419e-a575-08e2da02bf29	{"action":"token_refreshed","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-10-12 13:18:40.104218+00	
00000000-0000-0000-0000-000000000000	13fba327-0e1b-4915-b37f-75d1417eafc8	{"action":"token_revoked","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-10-12 13:18:40.1198+00	
00000000-0000-0000-0000-000000000000	38c2445e-f0f9-46b6-bbe7-788bdf2c30d9	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 13:19:16.404447+00	
00000000-0000-0000-0000-000000000000	babe7907-861b-4307-ba28-b82382daef0d	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 13:19:23.751162+00	
00000000-0000-0000-0000-000000000000	18df7431-d2c5-49b2-90dc-2d9182779bda	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 13:20:54.916161+00	
00000000-0000-0000-0000-000000000000	f3cd0fe5-a8a0-4ac4-8e0c-05d45970bf51	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 13:21:01.035784+00	
00000000-0000-0000-0000-000000000000	80d07e36-af04-43ef-bc07-96c21c42b8d6	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 13:21:40.224219+00	
00000000-0000-0000-0000-000000000000	c23ebe99-a01e-40a2-af2e-b197d3e6ec00	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 13:21:45.448572+00	
00000000-0000-0000-0000-000000000000	29f44031-d2c8-4a6b-b13a-69b55b7dd5ce	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 13:22:04.680754+00	
00000000-0000-0000-0000-000000000000	6b03e332-fc2b-4684-a1bf-7699f247f6de	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 13:22:08.874441+00	
00000000-0000-0000-0000-000000000000	c1e13be9-64bc-46f5-8e2c-a5d3ef9a5d50	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 13:23:20.973562+00	
00000000-0000-0000-0000-000000000000	e98df779-f8ba-4b65-8495-e44f929eb43f	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 13:23:34.651314+00	
00000000-0000-0000-0000-000000000000	f6ac1ad0-a031-4bf5-85e3-79bb70c790f4	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 13:23:52.369299+00	
00000000-0000-0000-0000-000000000000	ec6f19a4-d92a-4086-92de-898298f0bfe2	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 13:23:56.528679+00	
00000000-0000-0000-0000-000000000000	06d0a354-d44c-44fc-825a-fdc0b70981ac	{"action":"token_refreshed","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-10-12 16:13:45.054493+00	
00000000-0000-0000-0000-000000000000	8e9b2803-5a45-46ea-9692-b8432406c02b	{"action":"token_revoked","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-10-12 16:13:45.079138+00	
00000000-0000-0000-0000-000000000000	27b9ba38-1ab9-46b6-844a-69fb9034ad5e	{"action":"token_refreshed","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-10-12 18:41:27.973474+00	
00000000-0000-0000-0000-000000000000	024730d7-2ec4-4c04-9de3-099ec437fb6e	{"action":"token_revoked","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"token"}	2025-10-12 18:41:27.989581+00	
00000000-0000-0000-0000-000000000000	f9b73150-2b4b-42ee-9c2d-1aef1cb07b64	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 18:41:38.336114+00	
00000000-0000-0000-0000-000000000000	1476cf58-f176-4f59-bf4c-364785ac48c3	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 18:41:43.127284+00	
00000000-0000-0000-0000-000000000000	c955af2e-c63d-4b9f-a901-59117afa7618	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 18:42:09.503316+00	
00000000-0000-0000-0000-000000000000	d1175ac8-144a-4bfb-808d-3eb87aec65b2	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 18:42:17.881474+00	
00000000-0000-0000-0000-000000000000	504c3fad-27de-4acc-83b1-6e260135c5d3	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 18:42:34.790266+00	
00000000-0000-0000-0000-000000000000	3feaf47a-d97d-4f6c-99d7-c2bd945dac03	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 18:42:39.816947+00	
00000000-0000-0000-0000-000000000000	7f4a302e-96f1-4d6e-8fe7-54ef9ff50633	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 18:42:48.123837+00	
00000000-0000-0000-0000-000000000000	c43e38ee-928a-4a68-ac65-be62a3b0c088	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 18:43:06.06583+00	
00000000-0000-0000-0000-000000000000	3c8edbf3-917a-4ebc-ba7c-e27de9d9e703	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 18:43:10.7713+00	
00000000-0000-0000-0000-000000000000	63a6fa43-fec1-433f-99fa-daa40c4426e0	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 18:43:26.509352+00	
00000000-0000-0000-0000-000000000000	9c2ace53-d45e-446f-9b34-3ebc1c7b8425	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 18:43:57.911408+00	
00000000-0000-0000-0000-000000000000	8225e9e6-0b30-45b4-9e76-215181eb0c1d	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 18:44:41.266099+00	
00000000-0000-0000-0000-000000000000	1c31ef3f-8e67-4435-aaa4-67770d133b1b	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 20:30:25.096617+00	
00000000-0000-0000-0000-000000000000	f4ecac5c-5c6c-4970-8f07-3e0e489150a6	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 20:30:51.055549+00	
00000000-0000-0000-0000-000000000000	1f7d89e4-8cda-45ec-a3df-0f9e247aa8a8	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 20:31:02.423619+00	
00000000-0000-0000-0000-000000000000	ff3e729e-3060-4470-8248-4811e917f2fc	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 20:31:36.533673+00	
00000000-0000-0000-0000-000000000000	0feaf71d-3f8a-46eb-b22e-3508e948aa3b	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 20:31:42.010122+00	
00000000-0000-0000-0000-000000000000	2ad27e97-8fb8-40f0-8de9-78683eb9f2d3	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 20:33:00.169899+00	
00000000-0000-0000-0000-000000000000	afef85e0-1308-49f9-9100-00226fb627af	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 20:33:08.396869+00	
00000000-0000-0000-0000-000000000000	7ef9b29d-394f-4de2-ab34-45f394491010	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 20:33:23.805874+00	
00000000-0000-0000-0000-000000000000	1229e9de-33ca-4731-9cd8-879ed3feca34	{"action":"login","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 20:33:30.882007+00	
00000000-0000-0000-0000-000000000000	d4bbed03-4a0a-4ffa-b5f7-ac2c33504514	{"action":"logout","actor_id":"073c625c-eb02-45e8-9c67-50acbdc72cd6","actor_username":"harsh@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 20:38:33.613396+00	
00000000-0000-0000-0000-000000000000	f995e46d-f6be-4003-8fe2-ef5522571ba0	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 20:38:43.978105+00	
00000000-0000-0000-0000-000000000000	b83c28f9-7d0f-4ccf-b17c-b8eb03c20e6c	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 20:41:47.84282+00	
00000000-0000-0000-0000-000000000000	3923c5ca-f81e-47c8-8187-4c512aeb6568	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 20:42:05.425704+00	
00000000-0000-0000-0000-000000000000	fc46be8d-b097-43c5-b4ce-436d2ab1c157	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-12 20:44:04.42936+00	
00000000-0000-0000-0000-000000000000	c846583c-0a06-4ab5-b7ca-3bc54f7353e7	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-12 21:13:40.864106+00	
00000000-0000-0000-0000-000000000000	d17136e2-2666-46b4-837a-796eb1773539	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-13 05:05:33.638106+00	
00000000-0000-0000-0000-000000000000	ef72622a-e2fb-44cd-bb76-04a3283ebbe4	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-13 05:05:50.150123+00	
00000000-0000-0000-0000-000000000000	76059e15-25df-4cf6-a3dd-7e846522d328	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-13 05:06:04.215613+00	
00000000-0000-0000-0000-000000000000	b3c1e920-0378-4d78-ba90-6ab8ebf15031	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-13 05:06:20.004412+00	
00000000-0000-0000-0000-000000000000	ebdeb75c-e6fc-48c9-96af-7253117059dd	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-13 05:06:24.326056+00	
00000000-0000-0000-0000-000000000000	089ab7c0-31b4-44b3-94ed-4810a7bb9e9d	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-13 06:41:32.861179+00	
00000000-0000-0000-0000-000000000000	ce8631af-4aae-43ba-a7ab-378040179f14	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-13 06:42:30.796041+00	
00000000-0000-0000-0000-000000000000	6f39a43d-83cd-475e-978e-d561e5c25e6b	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-13 06:42:57.348046+00	
00000000-0000-0000-0000-000000000000	ae40479f-5bad-43f4-bd08-c22d12216316	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-13 07:06:28.666869+00	
00000000-0000-0000-0000-000000000000	0898f4ff-7cfb-4406-b2fa-fe9dbb8fd047	{"action":"token_refreshed","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-14 11:15:52.522457+00	
00000000-0000-0000-0000-000000000000	23172a71-8e6b-430c-907c-b09d71a93734	{"action":"token_revoked","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-14 11:15:52.561505+00	
00000000-0000-0000-0000-000000000000	bcd8f8dd-609b-4cc4-88a6-dcd314bb1385	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-14 11:16:21.096283+00	
00000000-0000-0000-0000-000000000000	7c304be4-f1de-4810-a4c8-8a8977fbe401	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-14 11:26:16.391827+00	
00000000-0000-0000-0000-000000000000	261f8dd3-55af-46f9-ba6d-e8ccf97dad4d	{"action":"token_refreshed","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-14 12:26:10.666723+00	
00000000-0000-0000-0000-000000000000	0b163ed4-bea1-4cac-bce3-b2908e2117df	{"action":"token_revoked","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-14 12:26:10.678929+00	
00000000-0000-0000-0000-000000000000	209874ed-56eb-44fc-ba82-392e9648edfc	{"action":"token_refreshed","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-19 15:45:26.209956+00	
00000000-0000-0000-0000-000000000000	800956e4-153a-4db2-8a5b-367fc8c1e1a4	{"action":"token_revoked","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-19 15:45:26.242071+00	
00000000-0000-0000-0000-000000000000	50561e11-bccc-45cc-a084-0f827e57e81c	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-19 15:48:13.279362+00	
00000000-0000-0000-0000-000000000000	72d8c7f8-3bcc-48bf-935d-3fde63604588	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-19 15:48:20.986285+00	
00000000-0000-0000-0000-000000000000	8318413e-4c9b-4d72-b211-fea3e5d224ee	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-19 15:48:57.131748+00	
00000000-0000-0000-0000-000000000000	49d2c404-1b29-4c2d-b474-9f3c5856a3c9	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-19 15:49:25.9586+00	
00000000-0000-0000-0000-000000000000	b116f26d-8969-4c13-adc3-3545992670f5	{"action":"token_refreshed","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-19 16:57:58.596925+00	
00000000-0000-0000-0000-000000000000	ef519180-2df5-4438-b51d-6995ac5fec90	{"action":"token_revoked","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-19 16:57:58.615267+00	
00000000-0000-0000-0000-000000000000	ae39f9e8-9eae-4ad1-afbd-e305abece877	{"action":"token_refreshed","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-21 11:42:14.252917+00	
00000000-0000-0000-0000-000000000000	c6ae1bad-1abe-4bb9-9b3d-8aa18b3abc26	{"action":"token_revoked","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-21 11:42:14.285892+00	
00000000-0000-0000-0000-000000000000	1d532760-905c-4603-87ce-176eadccc28e	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-21 11:42:51.53896+00	
00000000-0000-0000-0000-000000000000	419725a1-3a28-4873-b2f4-50dbd9077510	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-21 11:43:00.778642+00	
00000000-0000-0000-0000-000000000000	29adaff8-757e-4a49-9192-bd6e85d856f5	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-21 11:43:48.168042+00	
00000000-0000-0000-0000-000000000000	9a004c5d-5cf2-4c5a-983b-53cb24da77e2	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-23 13:06:45.222555+00	
00000000-0000-0000-0000-000000000000	560f9c6c-1424-4797-ac46-f05f56504415	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-23 13:06:49.339927+00	
00000000-0000-0000-0000-000000000000	462c86f7-adbc-4933-b0ac-d9094d6ae893	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-23 13:06:54.797476+00	
00000000-0000-0000-0000-000000000000	02e7454e-53c5-4ec9-891b-dd217c0599d7	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-23 13:10:07.358398+00	
00000000-0000-0000-0000-000000000000	ab6ed8e0-d7ea-47b3-b9be-7e237b40be9c	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-23 13:10:29.74678+00	
00000000-0000-0000-0000-000000000000	3ad3019b-a340-4ebc-a97a-5913e80c894b	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-23 13:10:44.472913+00	
00000000-0000-0000-0000-000000000000	f01e7570-3e02-48e9-921b-14f75b5455cf	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-23 13:10:57.3631+00	
00000000-0000-0000-0000-000000000000	76e0fc51-092b-4f06-b919-65d6d3405118	{"action":"token_refreshed","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-23 14:14:57.291583+00	
00000000-0000-0000-0000-000000000000	d197462d-d080-4e37-b62f-0c3d95be0948	{"action":"token_revoked","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-23 14:14:57.319849+00	
00000000-0000-0000-0000-000000000000	0ce2e4c6-8a24-42ca-941a-400ae7d5632c	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-23 14:39:30.173125+00	
00000000-0000-0000-0000-000000000000	80dae31a-3176-424e-8153-cb3c5ada35be	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-23 14:39:34.778568+00	
00000000-0000-0000-0000-000000000000	0ade358e-69f6-4522-94ca-c622ba42d444	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-23 14:39:55.559317+00	
00000000-0000-0000-0000-000000000000	9ed29a9f-27cc-41fa-a9ef-9a4092decdc4	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-23 14:39:59.838739+00	
00000000-0000-0000-0000-000000000000	606e480d-113a-4007-9f21-8cbd05eef46a	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-23 14:56:02.325403+00	
00000000-0000-0000-0000-000000000000	89057beb-89b0-407c-ad98-5be72435c751	{"action":"login","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-23 14:56:07.171154+00	
00000000-0000-0000-0000-000000000000	48238b3b-1497-4e9b-869f-54e1762b72e0	{"action":"logout","actor_id":"e86f726e-9210-47ca-8dc7-c84d46cc55e2","actor_username":"admin@playnation.com","actor_via_sso":false,"log_type":"account"}	2025-10-23 15:32:52.721508+00	
00000000-0000-0000-0000-000000000000	d50b9ad1-68fc-4180-8f1e-97802737ef03	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-23 15:33:01.398204+00	
00000000-0000-0000-0000-000000000000	cfaaeae9-b026-435a-bf63-fa0d62f08745	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-23 15:33:35.404585+00	
00000000-0000-0000-0000-000000000000	65e908f6-ec51-46be-8f73-3ac9055e6104	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-23 15:33:52.95674+00	
00000000-0000-0000-0000-000000000000	8f5bd92f-e2e2-43cd-b586-f52b8db7ef31	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-23 15:42:19.254502+00	
00000000-0000-0000-0000-000000000000	1d5e60cd-c526-4d9e-b69b-fc2f3cf67f58	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-23 15:42:35.022122+00	
00000000-0000-0000-0000-000000000000	0c265d3a-3806-4251-9f83-f33db54b88ba	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-23 15:50:16.327073+00	
00000000-0000-0000-0000-000000000000	52f17b89-e31c-4806-840f-bf1bb358da0f	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-23 15:50:32.121283+00	
00000000-0000-0000-0000-000000000000	d694033b-eed3-4e94-8992-5f0faf117b51	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-23 15:50:43.338605+00	
00000000-0000-0000-0000-000000000000	f9bea2de-ea33-4eaf-b872-a2f6c57b89ac	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-23 15:51:02.747506+00	
00000000-0000-0000-0000-000000000000	49d7fb5d-1674-41f5-9fa5-80f7fd9f398d	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-23 15:57:27.577424+00	
00000000-0000-0000-0000-000000000000	f6a38772-45c7-4855-9e78-ad0b594ef04f	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-23 15:57:53.835797+00	
00000000-0000-0000-0000-000000000000	b2869391-9920-4345-8b21-347fa5d4c233	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-23 16:01:09.469051+00	
00000000-0000-0000-0000-000000000000	90d60e4e-eb4c-44dc-a39d-e5b03f405a7b	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-23 16:01:30.735488+00	
00000000-0000-0000-0000-000000000000	95b9d586-b04c-4617-bdee-8c99e554bf2b	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-23 16:17:18.822481+00	
00000000-0000-0000-0000-000000000000	40d8fd08-ce7a-40d0-b8b6-899e1dbc4a50	{"action":"login","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-23 16:17:41.534252+00	
00000000-0000-0000-0000-000000000000	4023983b-2fe1-41c2-be85-a5e22cee281a	{"action":"logout","actor_id":"bb3e7bae-8aed-4e6c-bb71-bd644eff5402","actor_username":"otherswayam@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-23 16:44:58.221585+00	
00000000-0000-0000-0000-000000000000	e5c62a16-e24f-4c63-ae11-2c5d9290ce4d	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-23 16:45:05.14162+00	
00000000-0000-0000-0000-000000000000	483616f4-a528-4bd0-8a69-1a53e02d2633	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-23 16:45:35.387809+00	
00000000-0000-0000-0000-000000000000	79ccdcb5-183f-4683-80af-115bad348070	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-23 16:45:37.956119+00	
00000000-0000-0000-0000-000000000000	dd2b8793-cf0b-4a5a-93f0-f59f689d7447	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-23 16:45:52.713772+00	
00000000-0000-0000-0000-000000000000	b17c858f-3a49-4534-be9f-49aebc965e4a	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-23 16:45:55.579389+00	
00000000-0000-0000-0000-000000000000	95eae3f7-42dd-4db5-a725-4ed2ef231f4f	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-23 16:46:48.692639+00	
00000000-0000-0000-0000-000000000000	4cabae67-33ce-4e3a-8949-e7b3f6367761	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-23 16:46:51.103071+00	
00000000-0000-0000-0000-000000000000	0ec2e3f7-1943-47c8-b807-62e49114fa9d	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-23 16:49:52.574203+00	
00000000-0000-0000-0000-000000000000	0befb947-db75-4efc-a837-8ab53f218f2b	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-23 16:49:55.517111+00	
00000000-0000-0000-0000-000000000000	462b5672-8221-42a7-8c87-5f7488016c71	{"action":"token_refreshed","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-24 08:21:21.588954+00	
00000000-0000-0000-0000-000000000000	33ac1a9e-dc95-402a-8abc-4f11572618a1	{"action":"token_revoked","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-24 08:21:21.621178+00	
00000000-0000-0000-0000-000000000000	094d15eb-66a5-4824-be19-47288a488bdf	{"action":"logout","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-10-24 08:22:04.39281+00	
00000000-0000-0000-0000-000000000000	5f7e8575-3d4c-4334-8ebf-4c612cfbd7d9	{"action":"login","actor_id":"c90139a0-2de3-4237-89b8-032367f73a37","actor_username":"surbhiroy780@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-24 08:22:07.483092+00	
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
bb3e7bae-8aed-4e6c-bb71-bd644eff5402	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	{"sub": "bb3e7bae-8aed-4e6c-bb71-bd644eff5402", "email": "otherswayam@gmail.com", "last_name": "shah", "first_name": "swayam", "email_verified": false, "phone_verified": false}	email	2025-08-09 05:53:37.127421+00	2025-08-09 05:53:37.127471+00	2025-08-09 05:53:37.127471+00	05bb3fa1-281a-4a79-a227-8c0257c178db
c90139a0-2de3-4237-89b8-032367f73a37	c90139a0-2de3-4237-89b8-032367f73a37	{"sub": "c90139a0-2de3-4237-89b8-032367f73a37", "email": "surbhiroy780@gmail.com", "last_name": "roy", "first_name": "srubhi", "email_verified": false, "phone_verified": false}	email	2025-08-09 05:56:52.512587+00	2025-08-09 05:56:52.512638+00	2025-08-09 05:56:52.512638+00	573e40c1-d672-4443-965f-9e1e4ec6d9fe
073c625c-eb02-45e8-9c67-50acbdc72cd6	073c625c-eb02-45e8-9c67-50acbdc72cd6	{"sub": "073c625c-eb02-45e8-9c67-50acbdc72cd6", "email": "harsh@gmail.com", "last_name": "shah", "first_name": "harsh", "email_verified": false, "phone_verified": false}	email	2025-08-10 08:14:37.516935+00	2025-08-10 08:14:37.517562+00	2025-08-10 08:14:37.517562+00	be47e0ca-3489-4c7e-8400-2ed2635c2ea9
e86f726e-9210-47ca-8dc7-c84d46cc55e2	e86f726e-9210-47ca-8dc7-c84d46cc55e2	{"sub": "e86f726e-9210-47ca-8dc7-c84d46cc55e2", "email": "admin@playnation.com", "email_verified": false, "phone_verified": false}	email	2025-08-10 08:50:46.55172+00	2025-08-10 08:50:46.552399+00	2025-08-10 08:50:46.552399+00	ead436f6-6eff-4519-9106-48f181857fe0
38f0c23d-4d25-42cd-8ec0-426d6636eecd	38f0c23d-4d25-42cd-8ec0-426d6636eecd	{"sub": "38f0c23d-4d25-42cd-8ec0-426d6636eecd", "role": "player", "email": "fenil@gmail.com", "username": "fenill", "last_name": "pastagia", "first_name": "fenil", "phone_number": "7586214860", "email_verified": false, "phone_verified": false}	email	2025-10-12 09:33:09.048744+00	2025-10-12 09:33:09.048802+00	2025-10-12 09:33:09.048802+00	e4da4709-663c-4411-bec9-b83f37449fa2
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
dcdf63ff-14a4-4338-a804-f60681ce9ff1	2025-10-24 08:22:07.502017+00	2025-10-24 08:22:07.502017+00	password	975e03f9-8e2f-4442-af81-92031489786b
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid) FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_authorizations (id, authorization_id, client_id, user_id, redirect_uri, scope, state, resource, code_challenge, code_challenge_method, response_type, status, authorization_code, created_at, expires_at, approved_at) FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_clients (id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at, client_type) FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_consents (id, user_id, client_id, scopes, granted_at, revoked_at) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
00000000-0000-0000-0000-000000000000	713	j26g5kdc4a4q	c90139a0-2de3-4237-89b8-032367f73a37	f	2025-10-24 08:22:07.500183+00	2025-10-24 08:22:07.500183+00	\N	dcdf63ff-14a4-4338-a804-f60681ce9ff1
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id) FROM stdin;
dcdf63ff-14a4-4338-a804-f60681ce9ff1	c90139a0-2de3-4237-89b8-032367f73a37	2025-10-24 08:22:07.486749+00	2025-10-24 08:22:07.486749+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0	49.36.91.106	\N	\N
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
00000000-0000-0000-0000-000000000000	c90139a0-2de3-4237-89b8-032367f73a37	authenticated	authenticated	surbhiroy780@gmail.com	$2a$10$rzcB77Trm6WgTT34mHyQ4u1o9.O6X9p1STGBcV9ru.jCBQ97mPntW	2025-08-09 05:56:52.519796+00	\N		\N		\N			\N	2025-10-24 08:22:07.486066+00	{"provider": "email", "providers": ["email"]}	{"sub": "c90139a0-2de3-4237-89b8-032367f73a37", "email": "surbhiroy780@gmail.com", "last_name": "roy", "first_name": "srubhi", "email_verified": true, "phone_verified": false}	\N	2025-08-09 05:56:52.503913+00	2025-10-24 08:22:07.501712+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	authenticated	authenticated	otherswayam@gmail.com	$2a$10$IAvXmD9RhMUIQWJlFk8BY.MkX1opB5IqVu4w7nJ63C/TMcq0aH66i	2025-08-09 05:53:37.131872+00	\N		\N		\N			\N	2025-10-23 16:17:41.539205+00	{"provider": "email", "providers": ["email"]}	{"sub": "bb3e7bae-8aed-4e6c-bb71-bd644eff5402", "email": "otherswayam@gmail.com", "last_name": "shah", "first_name": "swayam", "email_verified": true, "phone_verified": false}	\N	2025-08-09 05:53:37.123654+00	2025-10-23 16:17:41.547564+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	073c625c-eb02-45e8-9c67-50acbdc72cd6	authenticated	authenticated	harsh@gmail.com	$2a$10$4KK/J4ROUoG4YacY/9oQluMayEemAbAWOSoXzXwIOg53cosk3zCLm	2025-08-10 08:14:37.525903+00	\N		\N		\N			\N	2025-10-12 20:33:30.8828+00	{"provider": "email", "providers": ["email"]}	{"sub": "073c625c-eb02-45e8-9c67-50acbdc72cd6", "email": "harsh@gmail.com", "last_name": "shah", "first_name": "harsh", "email_verified": true, "phone_verified": false}	\N	2025-08-10 08:14:37.499555+00	2025-10-12 20:33:30.884608+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	e86f726e-9210-47ca-8dc7-c84d46cc55e2	authenticated	authenticated	admin@playnation.com	$2a$10$Odpx/MPYwsSsCf4Uiywd1OgDxHtZ8IXE7531egy3pILZ0da.1sAMu	2025-08-10 08:50:46.562958+00	\N		\N		\N			\N	2025-10-23 14:56:07.175865+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2025-08-10 08:50:46.541627+00	2025-10-23 14:56:07.186296+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	38f0c23d-4d25-42cd-8ec0-426d6636eecd	authenticated	authenticated	fenil@gmail.com	$2a$10$wC5LDx6u5k8FTIHrKPOEwOm1f21cVE8.SfhPAjB.W6wxEek7Ig9ZC	2025-10-12 09:33:09.062174+00	\N		\N		\N			\N	2025-10-12 09:37:48.705186+00	{"provider": "email", "providers": ["email"]}	{"sub": "38f0c23d-4d25-42cd-8ec0-426d6636eecd", "role": "player", "email": "fenil@gmail.com", "username": "fenill", "last_name": "pastagia", "first_name": "fenil", "phone_number": "7586214860", "email_verified": true, "phone_verified": false}	\N	2025-10-12 09:33:09.015285+00	2025-10-12 11:24:56.534367+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: admin_notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin_notifications (id, type, message, data, is_read, created_at) FROM stdin;
\.


--
-- Data for Name: amenities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.amenities (amenity_id, name) FROM stdin;
660e8400-e29b-41d4-a716-446655440001	Parking
660e8400-e29b-41d4-a716-446655440002	Washroom
660e8400-e29b-41d4-a716-446655440003	Changing Room
660e8400-e29b-41d4-a716-446655440004	Cafeteria
660e8400-e29b-41d4-a716-446655440005	Air Conditioning
660e8400-e29b-41d4-a716-446655440006	Lighting
660e8400-e29b-41d4-a716-446655440007	Equipment Rental
660e8400-e29b-41d4-a716-446655440008	First Aid
660e8400-e29b-41d4-a716-446655440009	WiFi
660e8400-e29b-41d4-a716-446655440010	Lockers
\.


--
-- Data for Name: backup_payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.backup_payments (payment_id, booking_id, razorpay_order_id, razorpay_payment_id, amount, currency, status, payment_method, transaction_date) FROM stdin;
\.


--
-- Data for Name: backup_reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.backup_reviews (review_id, user_id, venue_id, rating, comment, created_at, booking_id) FROM stdin;
11cec7f7-e650-4a8f-b811-3217492680c6	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	b2b2b2b2-2222-41d4-a7f6-000000000002	5	Amazing turf quality and great service!	2025-08-09 10:10:50.930041+00	\N
\.


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bookings (booking_id, user_id, facility_id, slot_id, start_time, end_time, total_amount, status, payment_status, customer_name, customer_phone, created_at, has_been_reviewed, cancelled_at, cancelled_by, cancellation_reason) FROM stdin;
a1988d01-0f64-4743-9cce-7d576f42ad8b	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	9566ee54-1213-482b-b766-6d0f87c88776	83576b2b-d65f-4e53-bb8c-419eaf2c90b3	2025-10-07 03:30:00+00	2025-10-07 04:30:00+00	1500	confirmed	pending	\N	\N	2025-10-06 10:55:48.516758+00	f	\N	\N	\N
64ca99b0-4372-45a9-8bc3-04943da619e7	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	9566ee54-1213-482b-b766-6d0f87c88776	314fe74a-b1d5-4c1f-bc30-f60ca28dac42	2025-10-07 04:30:00+00	2025-10-07 05:30:00+00	1500	confirmed	pending	\N	\N	2025-10-06 17:43:33.44907+00	f	\N	\N	\N
217e69e0-fc62-4fc1-b06e-f5d5d06add1d	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	9566ee54-1213-482b-b766-6d0f87c88776	f51a94af-14f0-44ac-86d4-4d30a0fcb558	2025-10-11 08:30:00+00	2025-10-11 09:30:00+00	1500	confirmed	pending	\N	\N	2025-10-11 07:48:52.610724+00	f	\N	\N	\N
b7313a30-f9b5-437f-a8d6-a1abc19165cd	38f0c23d-4d25-42cd-8ec0-426d6636eecd	9566ee54-1213-482b-b766-6d0f87c88776	7a39bdb3-2ddb-4971-98d9-62aec0b58dbb	2025-10-12 10:30:00+00	2025-10-12 11:30:00+00	1500	cancelled	pending	\N	\N	2025-10-12 09:33:24.596578+00	f	2025-10-12 10:24:23.224+00	38f0c23d-4d25-42cd-8ec0-426d6636eecd	I can't
d045daf3-bc3f-4584-b5fc-bfd85405661e	38f0c23d-4d25-42cd-8ec0-426d6636eecd	2b123724-4e3c-4344-8df1-7b66c1cc81a6	a99225cc-0791-458e-ac69-2a9d37f01c67	2025-10-12 13:30:00+00	2025-10-12 14:30:00+00	1500	cancelled	pending	\N	\N	2025-10-12 10:31:32.809426+00	f	2025-10-12 10:31:50.016+00	38f0c23d-4d25-42cd-8ec0-426d6636eecd	going somewhere else
df496452-c7fd-4e35-9bbf-a2dba0bfbbe2	38f0c23d-4d25-42cd-8ec0-426d6636eecd	9566ee54-1213-482b-b766-6d0f87c88776	cef53716-0e39-4518-b5b5-cf4e985b264b	2025-10-13 03:30:00+00	2025-10-13 04:30:00+00	1500	cancelled	pending	\N	\N	2025-10-12 09:33:47.320566+00	f	2025-10-12 11:25:04.537+00	38f0c23d-4d25-42cd-8ec0-426d6636eecd	can not attend
eba14809-617c-4de1-addb-f7763aed4454	38f0c23d-4d25-42cd-8ec0-426d6636eecd	857b3a73-e640-4cfd-b886-a96815b6e562	0b977864-168f-499e-976b-301a08a9f646	2025-10-12 13:30:00+00	2025-10-12 14:30:00+00	10000	cancelled	pending	\N	\N	2025-10-12 09:34:06.487575+00	f	2025-10-12 11:32:27.252+00	38f0c23d-4d25-42cd-8ec0-426d6636eecd	i can not attend
38e99405-f111-4dfa-ab24-f57777987a1f	38f0c23d-4d25-42cd-8ec0-426d6636eecd	9566ee54-1213-482b-b766-6d0f87c88776	1a5f0d3b-a8ad-4a2d-9f77-11c585f95866	2025-10-12 13:30:00+00	2025-10-12 14:30:00+00	1500	cancelled	refunded	\N	\N	2025-10-12 11:56:00.466669+00	f	2025-10-12 11:57:56.578622+00	38f0c23d-4d25-42cd-8ec0-426d6636eecd	Cancelled by user
bc1109a5-d441-460d-8552-81ec8d2aea30	38f0c23d-4d25-42cd-8ec0-426d6636eecd	9566ee54-1213-482b-b766-6d0f87c88776	1a5f0d3b-a8ad-4a2d-9f77-11c585f95866	2025-10-12 13:30:00+00	2025-10-12 14:30:00+00	1500	cancelled	refunded	\N	\N	2025-10-12 11:59:17.500548+00	f	2025-10-12 11:59:30.986407+00	38f0c23d-4d25-42cd-8ec0-426d6636eecd	Cancelled by user
b8a53238-7fa6-473b-a8c4-ed51a5fc6676	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	857b3a73-e640-4cfd-b886-a96815b6e562	fad04bbf-04bb-4952-8bc1-00c6b9486c22	2025-10-12 14:30:00+00	2025-10-12 15:30:00+00	10000	cancelled	paid	\N	\N	2025-10-12 13:19:35.922917+00	f	2025-10-12 13:20:10.985318+00	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	Cancelled by user
4adce674-1e0d-4b0d-b74c-ea027768e548	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	2b123724-4e3c-4344-8df1-7b66c1cc81a6	7cfdec1b-0128-4dc0-af8c-08a5c6229e2f	2025-10-12 14:30:00+00	2025-10-12 15:30:00+00	1500	confirmed	pending	\N	\N	2025-10-12 13:21:58.494383+00	f	\N	\N	\N
07846fe4-4b51-453e-811c-4f9545e463ef	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	857b3a73-e640-4cfd-b886-a96815b6e562	fad04bbf-04bb-4952-8bc1-00c6b9486c22	2025-10-12 14:30:00+00	2025-10-12 15:30:00+00	10000	confirmed	pending	\N	\N	2025-10-12 13:23:45.121329+00	f	\N	\N	\N
6ab2581d-0e2d-4453-98f6-eadcec7bcc83	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	9566ee54-1213-482b-b766-6d0f87c88776	cef53716-0e39-4518-b5b5-cf4e985b264b	2025-10-13 03:30:00+00	2025-10-13 04:30:00+00	1500	cancelled	paid	\N	\N	2025-10-12 18:41:59.83265+00	f	2025-10-12 18:43:02.006869+00	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	Cancelled by user
0cefe795-bc3a-4056-8ad9-b9c227064786	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	2b123724-4e3c-4344-8df1-7b66c1cc81a6	61390823-5cb8-44d6-834d-b73340ddee9b	2025-10-13 03:30:00+00	2025-10-13 04:30:00+00	1500	confirmed	paid	\N	\N	2025-10-12 18:44:09.668456+00	f	\N	\N	\N
e534b136-8af9-4c92-9527-069e43f11008	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	9566ee54-1213-482b-b766-6d0f87c88776	d8a3dd07-3622-4a58-99d6-218c5abb7a4a	2025-10-13 12:30:00+00	2025-10-13 13:30:00+00	1500	confirmed	paid	\N	\N	2025-10-12 21:15:34.478059+00	f	\N	\N	\N
aeeb6443-68dd-4580-9583-7a1ed942533a	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	9566ee54-1213-482b-b766-6d0f87c88776	cef53716-0e39-4518-b5b5-cf4e985b264b	2025-10-13 03:30:00+00	2025-10-13 04:30:00+00	1500	cancelled	paid	\N	\N	2025-10-12 18:44:33.885378+00	f	2025-10-12 21:16:37.283561+00	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	Cancelled by user
3cd2d384-d72a-441a-9f71-585ae8922fb9	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	9566ee54-1213-482b-b766-6d0f87c88776	a10b25d8-f5b0-4b82-b6e8-3cdcf0e7bd22	2025-10-13 05:30:00+00	2025-10-13 06:30:00+00	1500	cancelled	paid	\N	\N	2025-10-12 21:14:03.957184+00	f	2025-10-12 21:17:23.183405+00	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	Cancelled by user
803f0914-7191-4f20-9d44-d08afe2a24de	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	2b123724-4e3c-4344-8df1-7b66c1cc81a6	c702f9c0-57f0-4c7f-9c63-fd3775affb03	2025-10-13 14:30:00+00	2025-10-13 15:30:00+00	1500	cancelled	paid	\N	\N	2025-10-13 07:06:51.555973+00	f	2025-10-13 07:08:40.641429+00	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	Cancelled by user
5a32e4d3-576a-4cd7-89c0-7e1520865f2a	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	2b123724-4e3c-4344-8df1-7b66c1cc81a6	100f7f16-2294-4782-ba45-fb39a24d4503	2025-10-14 14:30:00+00	2025-10-14 15:30:00+00	1500	cancelled	paid	\N	\N	2025-10-14 11:50:35.475166+00	f	2025-10-14 11:50:48.087754+00	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	Cancelled by user
3c6aeaa7-172c-4552-a124-a37c888cfbde	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	857b3a73-e640-4cfd-b886-a96815b6e562	662052ed-4b30-4bbc-b118-1953fcbc1413	2025-10-14 13:30:00+00	2025-10-14 14:30:00+00	10000	cancelled	paid	\N	\N	2025-10-14 11:26:32.723946+00	f	2025-10-14 12:05:52.108032+00	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	Cancelled by user
97bf51a5-b8e8-432e-9c49-b7b0c9cfe3ad	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	9566ee54-1213-482b-b766-6d0f87c88776	d6036ce2-7259-4d01-8b1a-9b7fb4ecb5c3	2025-10-14 14:30:00+00	2025-10-14 15:30:00+00	1500	confirmed	paid	\N	\N	2025-10-14 12:06:12.130976+00	f	\N	\N	\N
887e069e-d269-479a-8cc7-30072ce7f601	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	857b3a73-e640-4cfd-b886-a96815b6e562	a469ffed-4185-461f-94fd-16d07035859b	2025-10-14 14:30:00+00	2025-10-14 15:30:00+00	10000	confirmed	paid	\N	\N	2025-10-14 12:09:40.8392+00	f	\N	\N	\N
3e3f1680-3394-44f7-8d8b-15005a4579b9	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	9566ee54-1213-482b-b766-6d0f87c88776	fafbb584-999e-4fb9-b9ec-a663cd788197	2025-10-23 13:30:00+00	2025-10-23 14:30:00+00	1500	confirmed	paid	\N	\N	2025-10-23 13:11:37.243127+00	f	\N	\N	\N
cdcd3850-86cf-4b3a-95bb-944fe4c73acc	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	9566ee54-1213-482b-b766-6d0f87c88776	aa27e328-e88b-420f-bd73-4421acc144d7	2025-10-06 11:30:00+00	2025-10-06 12:30:00+00	1500	confirmed	pending	\N	\N	2025-10-06 10:54:56.210885+00	t	\N	\N	\N
1f15140f-b8ce-448f-8dea-03604a99a3f7	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	9566ee54-1213-482b-b766-6d0f87c88776	761fa7c6-c790-4937-9106-7f9de91d4116	2025-10-23 14:30:00+00	2025-10-23 15:30:00+00	1500	confirmed	paid	\N	\N	2025-10-23 14:16:51.787045+00	f	\N	\N	\N
c0bcdf7d-57a1-458f-8eb0-4e9001ca8cde	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	ccb0837d-d7d3-4f56-99a7-610e14389e2c	2025-10-23 14:30:00+00	2025-10-23 15:30:00+00	1500	confirmed	paid	\N	\N	2025-10-23 14:17:37.764439+00	f	\N	\N	\N
e3e8c018-921b-41b0-bca8-42bc0c687933	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	9566ee54-1213-482b-b766-6d0f87c88776	52de7f59-7814-45cd-8356-8064ac1bcd19	2025-10-28 03:30:00+00	2025-10-28 04:30:00+00	1500	confirmed	paid	\N	\N	2025-10-23 14:20:22.402061+00	f	\N	\N	\N
18ba3c85-208a-48db-99b7-f05280b7aa2b	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	9566ee54-1213-482b-b766-6d0f87c88776	92908011-45a0-4afd-9d36-254a0c26a209	2025-10-26 03:30:00+00	2025-10-26 04:30:00+00	1500	confirmed	paid	\N	\N	2025-10-23 14:20:50.979028+00	f	\N	\N	\N
77711d30-af0b-445f-8837-37709093a012	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	9566ee54-1213-482b-b766-6d0f87c88776	f1d463a0-b661-4fdc-a556-f01fba3fd29c	2025-10-24 03:30:00+00	2025-10-24 04:30:00+00	1500	cancelled	paid	\N	\N	2025-10-23 14:17:12.797418+00	f	2025-10-23 14:55:56.256772+00	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	can not attend
fd79ef34-e548-4ad6-a7ae-bf2a7213252b	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	9566ee54-1213-482b-b766-6d0f87c88776	81d1f813-7ae8-43e6-b558-41aeed78feda	2025-10-24 10:30:00+00	2025-10-24 11:30:00+00	1500	confirmed	paid	\N	\N	2025-10-23 15:33:29.060542+00	f	\N	\N	\N
5acee641-3d17-4ed4-ad55-e8cc8ab7f4de	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	9566ee54-1213-482b-b766-6d0f87c88776	652fe316-3d4e-40ac-877d-05f1f0bfed82	2025-10-28 05:30:00+00	2025-10-28 06:30:00+00	1500	confirmed	paid	\N	\N	2025-10-23 16:44:51.28461+00	f	\N	\N	\N
\.


--
-- Data for Name: contact_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contact_messages (id, name, email, message, is_read, created_at) FROM stdin;
\.


--
-- Data for Name: credit_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.credit_transactions (transaction_id, user_id, amount, transaction_type, booking_id, description, transaction_date) FROM stdin;
\.


--
-- Data for Name: facilities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.facilities (facility_id, venue_id, sport_id, name, description, capacity, hourly_rate, is_active) FROM stdin;
857b3a73-e640-4cfd-b886-a96815b6e562	0a5d58bf-2471-4e36-9a5d-3485be962dee	550e8400-e29b-41d4-a716-446655440001	Box	\N	20	10000.00	t
fb028c96-667c-4fd0-be9f-ffbfb413c8cd	0a5d58bf-2471-4e36-9a5d-3485be962dee	550e8400-e29b-41d4-a716-446655440008	VolleyCourt	\N	12	1000.00	t
ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	0a5d58bf-2471-4e36-9a5d-3485be962dee	550e8400-e29b-41d4-a716-446655440006	Golden Racing Pool	\N	15	20000.00	t
9566ee54-1213-482b-b766-6d0f87c88776	1f72fb3d-916d-477a-9e2e-5abd9e21c4da	550e8400-e29b-41d4-a716-446655440005	Table 1		4	1500.00	t
ac55c1c9-cfb3-4ad6-a099-ffaee8470547	1f72fb3d-916d-477a-9e2e-5abd9e21c4da	550e8400-e29b-41d4-a716-446655440005	Table 2		4	1500.00	t
2b123724-4e3c-4344-8df1-7b66c1cc81a6	8534d12f-5f7b-43fd-80ac-82e6c59ba9ad	550e8400-e29b-41d4-a716-446655440001	Court 1		16	1500.00	t
e68d5a25-1d7b-4b59-9599-9a140ee15af9	8534d12f-5f7b-43fd-80ac-82e6c59ba9ad	550e8400-e29b-41d4-a716-446655440002	Court 2		20	3000.00	t
ea904f64-86ad-40cf-88c3-47727800e3da	8534d12f-5f7b-43fd-80ac-82e6c59ba9ad	550e8400-e29b-41d4-a716-446655440007	Table 1		4	700.00	t
\.


--
-- Data for Name: facility_amenities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.facility_amenities (facility_id, amenity_id, created_at, updated_at) FROM stdin;
857b3a73-e640-4cfd-b886-a96815b6e562	660e8400-e29b-41d4-a716-446655440001	2025-10-04 00:24:15.580914	2025-10-04 00:24:15.580914
857b3a73-e640-4cfd-b886-a96815b6e562	660e8400-e29b-41d4-a716-446655440004	2025-10-04 00:24:15.580914	2025-10-04 00:24:15.580914
857b3a73-e640-4cfd-b886-a96815b6e562	660e8400-e29b-41d4-a716-446655440007	2025-10-04 00:24:15.580914	2025-10-04 00:24:15.580914
857b3a73-e640-4cfd-b886-a96815b6e562	660e8400-e29b-41d4-a716-446655440010	2025-10-04 00:24:15.580914	2025-10-04 00:24:15.580914
857b3a73-e640-4cfd-b886-a96815b6e562	660e8400-e29b-41d4-a716-446655440002	2025-10-04 00:24:15.580914	2025-10-04 00:24:15.580914
857b3a73-e640-4cfd-b886-a96815b6e562	660e8400-e29b-41d4-a716-446655440005	2025-10-04 00:24:15.580914	2025-10-04 00:24:15.580914
857b3a73-e640-4cfd-b886-a96815b6e562	660e8400-e29b-41d4-a716-446655440008	2025-10-04 00:24:15.580914	2025-10-04 00:24:15.580914
857b3a73-e640-4cfd-b886-a96815b6e562	660e8400-e29b-41d4-a716-446655440009	2025-10-04 00:24:15.580914	2025-10-04 00:24:15.580914
857b3a73-e640-4cfd-b886-a96815b6e562	660e8400-e29b-41d4-a716-446655440006	2025-10-04 00:24:15.580914	2025-10-04 00:24:15.580914
857b3a73-e640-4cfd-b886-a96815b6e562	660e8400-e29b-41d4-a716-446655440003	2025-10-04 00:24:15.580914	2025-10-04 00:24:15.580914
fb028c96-667c-4fd0-be9f-ffbfb413c8cd	660e8400-e29b-41d4-a716-446655440001	2025-10-04 00:24:16.229975	2025-10-04 00:24:16.229975
fb028c96-667c-4fd0-be9f-ffbfb413c8cd	660e8400-e29b-41d4-a716-446655440004	2025-10-04 00:24:16.229975	2025-10-04 00:24:16.229975
fb028c96-667c-4fd0-be9f-ffbfb413c8cd	660e8400-e29b-41d4-a716-446655440007	2025-10-04 00:24:16.229975	2025-10-04 00:24:16.229975
fb028c96-667c-4fd0-be9f-ffbfb413c8cd	660e8400-e29b-41d4-a716-446655440010	2025-10-04 00:24:16.229975	2025-10-04 00:24:16.229975
fb028c96-667c-4fd0-be9f-ffbfb413c8cd	660e8400-e29b-41d4-a716-446655440008	2025-10-04 00:24:16.229975	2025-10-04 00:24:16.229975
fb028c96-667c-4fd0-be9f-ffbfb413c8cd	660e8400-e29b-41d4-a716-446655440005	2025-10-04 00:24:16.229975	2025-10-04 00:24:16.229975
fb028c96-667c-4fd0-be9f-ffbfb413c8cd	660e8400-e29b-41d4-a716-446655440002	2025-10-04 00:24:16.229975	2025-10-04 00:24:16.229975
fb028c96-667c-4fd0-be9f-ffbfb413c8cd	660e8400-e29b-41d4-a716-446655440003	2025-10-04 00:24:16.229975	2025-10-04 00:24:16.229975
fb028c96-667c-4fd0-be9f-ffbfb413c8cd	660e8400-e29b-41d4-a716-446655440006	2025-10-04 00:24:16.229975	2025-10-04 00:24:16.229975
fb028c96-667c-4fd0-be9f-ffbfb413c8cd	660e8400-e29b-41d4-a716-446655440009	2025-10-04 00:24:16.229975	2025-10-04 00:24:16.229975
ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	660e8400-e29b-41d4-a716-446655440001	2025-10-04 00:24:16.94185	2025-10-04 00:24:16.94185
ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	660e8400-e29b-41d4-a716-446655440004	2025-10-04 00:24:16.94185	2025-10-04 00:24:16.94185
ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	660e8400-e29b-41d4-a716-446655440007	2025-10-04 00:24:16.94185	2025-10-04 00:24:16.94185
ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	660e8400-e29b-41d4-a716-446655440010	2025-10-04 00:24:16.94185	2025-10-04 00:24:16.94185
ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	660e8400-e29b-41d4-a716-446655440008	2025-10-04 00:24:16.94185	2025-10-04 00:24:16.94185
ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	660e8400-e29b-41d4-a716-446655440005	2025-10-04 00:24:16.94185	2025-10-04 00:24:16.94185
ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	660e8400-e29b-41d4-a716-446655440002	2025-10-04 00:24:16.94185	2025-10-04 00:24:16.94185
ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	660e8400-e29b-41d4-a716-446655440006	2025-10-04 00:24:16.94185	2025-10-04 00:24:16.94185
ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	660e8400-e29b-41d4-a716-446655440003	2025-10-04 00:24:16.94185	2025-10-04 00:24:16.94185
ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	660e8400-e29b-41d4-a716-446655440009	2025-10-04 00:24:16.94185	2025-10-04 00:24:16.94185
\.


--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.favorites (user_id, venue_id, created_at) FROM stdin;
\.


--
-- Data for Name: offer_sports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.offer_sports (offer_id, sport_id) FROM stdin;
\.


--
-- Data for Name: offers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.offers (offer_id, venue_id, title, description, discount_percentage, is_active, valid_from, valid_until, created_at, is_global, background_image_url, offer_code, applies_to_all_sports) FROM stdin;
0f575722-8123-4148-8525-b25950cd972d	\N	25% Off on weekdays	25% off on all venues for weekdays	25.00	t	2025-10-06 00:00:00+00	2025-10-13 00:00:00+00	2025-10-06 11:30:13.341723+00	t	\N	25WEEK	t
dd592e08-0f54-4de3-8024-6c524a4f8e2b	1f72fb3d-916d-477a-9e2e-5abd9e21c4da	10% OFF	10% off on Fun & play	10.00	t	2025-10-06 00:00:00+00	2025-10-11 00:00:00+00	2025-10-06 12:17:10.792218+00	f		\N	f
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (payment_id, booking_id, razorpay_order_id, razorpay_payment_id, amount, currency, status, payment_method, transaction_date) FROM stdin;
\.


--
-- Data for Name: points_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.points_transactions (transaction_id, user_id, points_amount, transaction_type, booking_id, description, transaction_date) FROM stdin;
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (review_id, user_id, venue_id, rating, comment, created_at, booking_id) FROM stdin;
e35e0c6f-3126-4f19-9192-f47833dc36eb	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	1f72fb3d-916d-477a-9e2e-5abd9e21c4da	5	nice place to enjoy	\N	cdcd3850-86cf-4b3a-95bb-944fe4c73acc
\.


--
-- Data for Name: sports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sports (sport_id, name, description) FROM stdin;
550e8400-e29b-41d4-a716-446655440001	Cricket	Team sport played with bat and ball
550e8400-e29b-41d4-a716-446655440002	Football	Team sport played with a round ball
550e8400-e29b-41d4-a716-446655440003	Basketball	Team sport played on a court with hoops
550e8400-e29b-41d4-a716-446655440004	Tennis	Racket sport played on a court
550e8400-e29b-41d4-a716-446655440005	Badminton	Racket sport played with shuttlecock
550e8400-e29b-41d4-a716-446655440006	Swimming	Water sport and recreation activity
550e8400-e29b-41d4-a716-446655440007	Table Tennis	Indoor racket sport
550e8400-e29b-41d4-a716-446655440008	Volleyball	Team sport played with net
\.


--
-- Data for Name: time_slots; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.time_slots (slot_id, facility_id, start_time, end_time, is_available, price_override, block_reason) FROM stdin;
07e65912-5270-4048-a334-c24bf59d2cc4	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-06 03:30:00+00	2025-10-06 04:30:00+00	t	\N	\N
c39d8fec-474f-4fbd-b756-3d7a71f01ee9	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-06 04:30:00+00	2025-10-06 05:30:00+00	t	\N	\N
9baf7555-06f9-476f-af54-3f5dbdaa1716	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-06 05:30:00+00	2025-10-06 06:30:00+00	t	\N	\N
e8639c87-55f0-413c-9e75-9bc36056daa5	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-06 06:30:00+00	2025-10-06 07:30:00+00	t	\N	\N
5f866b5f-5681-4a20-aa2e-09e52e6f6fe1	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-06 07:30:00+00	2025-10-06 08:30:00+00	t	\N	\N
4ed844c8-5eb6-405b-8dd5-969251a9d06c	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-06 08:30:00+00	2025-10-06 09:30:00+00	t	\N	\N
753498c0-ab79-4041-be3f-5e6c2d7ec982	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-06 09:30:00+00	2025-10-06 10:30:00+00	t	\N	\N
e6e8a5ea-f1cd-447c-b9b1-25e24bbcf68a	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-06 10:30:00+00	2025-10-06 11:30:00+00	t	\N	\N
dc2bbf82-65b5-4e87-a920-9e745776c6a0	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-06 12:30:00+00	2025-10-06 13:30:00+00	t	\N	\N
958619fc-d65c-4d7a-9cbb-60f7c4e10846	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-06 13:30:00+00	2025-10-06 14:30:00+00	t	\N	\N
513c7cca-33a9-4a7e-a5d8-b4f59145ddf4	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-06 14:30:00+00	2025-10-06 15:30:00+00	t	\N	\N
b3a29512-1869-4a23-9027-63f542287ef0	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-07 05:30:00+00	2025-10-07 06:30:00+00	t	\N	\N
68d1fd52-fed0-4fc3-977d-d376aaa2ab55	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-07 06:30:00+00	2025-10-07 07:30:00+00	t	\N	\N
f1f2d773-f14c-4ded-953a-a324a7908756	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-07 07:30:00+00	2025-10-07 08:30:00+00	t	\N	\N
3d404910-9bb0-4d23-afb6-c7cf1ec2481f	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-07 08:30:00+00	2025-10-07 09:30:00+00	t	\N	\N
a22c91ea-a12e-43dc-ac4c-1a6c96f0a4d6	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-07 09:30:00+00	2025-10-07 10:30:00+00	t	\N	\N
489d4af4-ea59-43bb-bbf7-f57401df53d1	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-07 10:30:00+00	2025-10-07 11:30:00+00	t	\N	\N
53a8e66c-50e9-494b-bb80-efd9fc722dac	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-07 11:30:00+00	2025-10-07 12:30:00+00	t	\N	\N
2db6ee1c-d922-4f3c-8227-1df3a83f3be4	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-07 12:30:00+00	2025-10-07 13:30:00+00	t	\N	\N
002d0d27-6e4d-41e9-99b2-8f61a86998d6	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-07 13:30:00+00	2025-10-07 14:30:00+00	t	\N	\N
48462175-85a3-49a8-9896-f6107e7f4e1f	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-07 14:30:00+00	2025-10-07 15:30:00+00	t	\N	\N
71af8696-bcb9-4b64-871b-be4a10e273f9	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-08 03:30:00+00	2025-10-08 04:30:00+00	t	\N	\N
1cb4664c-2a44-4e21-9e34-105326bc4b43	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-08 04:30:00+00	2025-10-08 05:30:00+00	t	\N	\N
05e490e1-7262-4bcc-ad7a-6d57fdc2194d	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-08 05:30:00+00	2025-10-08 06:30:00+00	t	\N	\N
71b2fe0d-f268-4b8e-b7c3-8bb18e803185	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-08 06:30:00+00	2025-10-08 07:30:00+00	t	\N	\N
3a3a0651-7224-4a20-a4ad-98119504c01f	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-08 07:30:00+00	2025-10-08 08:30:00+00	t	\N	\N
98447738-9ac5-4c9e-849e-a75a1126fac6	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-08 08:30:00+00	2025-10-08 09:30:00+00	t	\N	\N
015367d2-c4f7-428a-95b1-f8c0443d897c	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-08 09:30:00+00	2025-10-08 10:30:00+00	t	\N	\N
e89e15e4-0239-471d-b3cb-a0008be81973	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-08 10:30:00+00	2025-10-08 11:30:00+00	t	\N	\N
2db338f5-1e35-4a52-adff-70541f0958e1	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-08 11:30:00+00	2025-10-08 12:30:00+00	t	\N	\N
cf90a36d-449a-4332-baa0-6c4e242292e8	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-08 12:30:00+00	2025-10-08 13:30:00+00	t	\N	\N
ccca32fd-cc8d-4a28-a7c7-52d953971764	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-08 13:30:00+00	2025-10-08 14:30:00+00	t	\N	\N
eabcb074-f98e-4b69-a2f6-6d4c20d823f0	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-08 14:30:00+00	2025-10-08 15:30:00+00	t	\N	\N
b46f3fd3-6a69-4b8e-948d-3ae1e6b894af	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-09 03:30:00+00	2025-10-09 04:30:00+00	t	\N	\N
e8a93509-f649-469d-b2e6-02aaab4ffbe1	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-09 04:30:00+00	2025-10-09 05:30:00+00	t	\N	\N
487f236b-3223-440c-a79b-c74457f9c80c	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-09 05:30:00+00	2025-10-09 06:30:00+00	t	\N	\N
cbfa6642-8f28-4906-9bf3-a3c37ac6fbd9	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-09 06:30:00+00	2025-10-09 07:30:00+00	t	\N	\N
e345f24a-61fd-497d-abd6-929e59f2fc9f	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-09 07:30:00+00	2025-10-09 08:30:00+00	t	\N	\N
d95dc357-9fcd-4bb8-89c6-a2698d197ec7	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-09 08:30:00+00	2025-10-09 09:30:00+00	t	\N	\N
0e8e099d-4dbf-4348-bfca-ca276e4c9d6a	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-09 09:30:00+00	2025-10-09 10:30:00+00	t	\N	\N
f2bf29f5-fbd7-4b1d-998b-031382c12ff2	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-09 10:30:00+00	2025-10-09 11:30:00+00	t	\N	\N
da3323e3-e502-4f19-97b6-7623abc644ae	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-09 11:30:00+00	2025-10-09 12:30:00+00	t	\N	\N
e499bdd7-698e-4d82-9d6e-86c6f453a516	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-09 12:30:00+00	2025-10-09 13:30:00+00	t	\N	\N
d31b4e54-bcfd-492a-9aaf-df2dfc7702bb	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-09 13:30:00+00	2025-10-09 14:30:00+00	t	\N	\N
e5a3838e-cf11-4352-abc8-636eed0bf608	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-09 14:30:00+00	2025-10-09 15:30:00+00	t	\N	\N
ea0d52df-5ebf-4e32-b946-ded3714abfb3	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-10 03:30:00+00	2025-10-10 04:30:00+00	t	\N	\N
c8007998-278d-4b55-9a2d-26fcd66858de	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-10 04:30:00+00	2025-10-10 05:30:00+00	t	\N	\N
8dc71da0-2338-4013-9738-3284cb404761	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-10 05:30:00+00	2025-10-10 06:30:00+00	t	\N	\N
c65dd1bc-2570-4cb1-869f-5c4c2da3e75b	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-10 06:30:00+00	2025-10-10 07:30:00+00	t	\N	\N
74420e90-ec2d-4bb8-9810-eff28ad8eed0	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-10 07:30:00+00	2025-10-10 08:30:00+00	t	\N	\N
3e8b23d3-3ad9-42f8-8259-84c686b6ecd1	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-10 08:30:00+00	2025-10-10 09:30:00+00	t	\N	\N
5260a4bc-9366-473b-a95e-a6b203796f33	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-10 09:30:00+00	2025-10-10 10:30:00+00	t	\N	\N
b5eab6d8-b4df-494f-bb6c-24cf4fb49f71	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-10 10:30:00+00	2025-10-10 11:30:00+00	t	\N	\N
97c8c158-f4c9-4808-89bc-bd68010003ae	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-10 11:30:00+00	2025-10-10 12:30:00+00	t	\N	\N
77ae3627-344a-40a6-86a6-22e27d86640f	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-10 12:30:00+00	2025-10-10 13:30:00+00	t	\N	\N
960a5e22-3414-4fe6-afda-8f356196a003	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-10 13:30:00+00	2025-10-10 14:30:00+00	t	\N	\N
226688f2-5e49-4a4f-b7dc-ab17bfb5fa8f	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-10 14:30:00+00	2025-10-10 15:30:00+00	t	\N	\N
9f459078-fe8b-4e57-b74b-d0b489682f16	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-11 03:30:00+00	2025-10-11 04:30:00+00	t	\N	\N
2923bd40-fa4c-4f7b-9a6e-496f72dcbfac	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-11 04:30:00+00	2025-10-11 05:30:00+00	t	\N	\N
6a897a4b-be82-49a1-ab7b-b1383410b273	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-11 05:30:00+00	2025-10-11 06:30:00+00	t	\N	\N
907434e5-21c4-40cc-beb2-11ddbfae5a11	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-11 06:30:00+00	2025-10-11 07:30:00+00	t	\N	\N
8c746e21-e1ae-4d58-bb42-6f2ca2c9212a	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-11 07:30:00+00	2025-10-11 08:30:00+00	t	\N	\N
1a37cf06-0439-46e5-957a-84a2e0dde005	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-11 09:30:00+00	2025-10-11 10:30:00+00	t	\N	\N
00000f27-5cca-459d-bc0e-c638ddd7b214	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-11 10:30:00+00	2025-10-11 11:30:00+00	t	\N	\N
12b7221f-4ac7-45e2-9442-dae28c2f1d3b	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-11 11:30:00+00	2025-10-11 12:30:00+00	t	\N	\N
26bfda80-728a-4317-8e5d-886a0b54c9fb	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-11 12:30:00+00	2025-10-11 13:30:00+00	t	\N	\N
df4dd59d-9f77-42d5-b97b-b40b5b3b3402	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-11 13:30:00+00	2025-10-11 14:30:00+00	t	\N	\N
ff3e3f70-fcd9-4d84-a2b8-74e933658e17	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-11 14:30:00+00	2025-10-11 15:30:00+00	t	\N	\N
f83da071-532c-4763-b606-a6b716f9752b	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-12 03:30:00+00	2025-10-12 04:30:00+00	t	\N	\N
570d51d8-384c-4eb9-9335-edb934f6d910	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-12 04:30:00+00	2025-10-12 05:30:00+00	t	\N	\N
53db7b74-a479-4baa-a024-e4118ef97423	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-12 05:30:00+00	2025-10-12 06:30:00+00	t	\N	\N
c04e1bb8-bb90-42ff-a125-9981a57c1116	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-12 06:30:00+00	2025-10-12 07:30:00+00	t	\N	\N
3ca29f1a-6431-42a4-b368-7180fef66607	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-12 07:30:00+00	2025-10-12 08:30:00+00	t	\N	\N
8dfbe6e6-d9a4-4e6d-9ecf-ef6632c88fe2	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-12 08:30:00+00	2025-10-12 09:30:00+00	t	\N	\N
57a419ce-3726-4d34-abc8-c621bccfdb19	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-12 09:30:00+00	2025-10-12 10:30:00+00	t	\N	\N
0f8d8d15-3709-4404-8fd7-8eb3ef24d651	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-12 11:30:00+00	2025-10-12 12:30:00+00	t	\N	\N
d2d69e95-dd4e-4969-93e7-c56881ae1b63	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-12 12:30:00+00	2025-10-12 13:30:00+00	t	\N	\N
f515ad81-18c8-471a-9c6c-a80176c0b08e	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-12 14:30:00+00	2025-10-12 15:30:00+00	t	\N	\N
488baabe-e474-494c-8348-68371ba0bcd3	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-13 04:30:00+00	2025-10-13 05:30:00+00	t	\N	\N
161621b7-4f54-4b9d-ba63-2f15ad673532	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-13 06:30:00+00	2025-10-13 07:30:00+00	t	\N	\N
c4e1d4b5-7ade-445a-95db-f58275e3f414	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-13 07:30:00+00	2025-10-13 08:30:00+00	t	\N	\N
169fcf21-468a-4194-9b7a-65772c122724	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-13 08:30:00+00	2025-10-13 09:30:00+00	t	\N	\N
d5f26d09-2de8-4177-b621-96df955c81b8	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-13 09:30:00+00	2025-10-13 10:30:00+00	t	\N	\N
d6d612ce-c4ae-44bf-a033-3ff3246e6249	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-13 10:30:00+00	2025-10-13 11:30:00+00	t	\N	\N
e378e403-4138-46f6-a036-b9d31e57803c	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-13 11:30:00+00	2025-10-13 12:30:00+00	t	\N	\N
40517e21-17f3-4325-b3bb-155a87c4f8d2	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-13 13:30:00+00	2025-10-13 14:30:00+00	t	\N	\N
90b66fa2-9d9e-495a-a009-5f3bc6184779	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-13 14:30:00+00	2025-10-13 15:30:00+00	t	\N	\N
aa27e328-e88b-420f-bd73-4421acc144d7	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-06 11:30:00+00	2025-10-06 12:30:00+00	f	\N	\N
83576b2b-d65f-4e53-bb8c-419eaf2c90b3	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-07 03:30:00+00	2025-10-07 04:30:00+00	f	\N	\N
314fe74a-b1d5-4c1f-bc30-f60ca28dac42	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-07 04:30:00+00	2025-10-07 05:30:00+00	f	\N	\N
f51a94af-14f0-44ac-86d4-4d30a0fcb558	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-11 08:30:00+00	2025-10-11 09:30:00+00	f	\N	\N
7a39bdb3-2ddb-4971-98d9-62aec0b58dbb	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-12 10:30:00+00	2025-10-12 11:30:00+00	t	\N	\N
1a5f0d3b-a8ad-4a2d-9f77-11c585f95866	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-12 13:30:00+00	2025-10-12 14:30:00+00	t	\N	\N
d8a3dd07-3622-4a58-99d6-218c5abb7a4a	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-13 12:30:00+00	2025-10-13 13:30:00+00	f	\N	\N
a10b25d8-f5b0-4b82-b6e8-3cdcf0e7bd22	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-13 05:30:00+00	2025-10-13 06:30:00+00	t	\N	\N
021fbbed-bd05-49a7-b020-b258fce7f294	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-06 03:30:00+00	2025-10-06 04:30:00+00	t	\N	\N
7f4dbcf3-5f8b-4990-ae06-141235829519	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-06 04:30:00+00	2025-10-06 05:30:00+00	t	\N	\N
36e46e41-b2e0-4156-91b5-057153e11f12	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-06 05:30:00+00	2025-10-06 06:30:00+00	t	\N	\N
3f675cc4-76ef-4d8d-a5a0-658db32ade65	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-06 06:30:00+00	2025-10-06 07:30:00+00	t	\N	\N
6435c5eb-5a2b-49e9-a97c-9b7708ab1a42	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-06 07:30:00+00	2025-10-06 08:30:00+00	t	\N	\N
4f941be9-da08-4f60-b0c4-e3a0b4b0df7a	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-06 08:30:00+00	2025-10-06 09:30:00+00	t	\N	\N
f8f6f060-1c2c-447d-a637-c6db4abfe818	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-06 09:30:00+00	2025-10-06 10:30:00+00	t	\N	\N
3f019a92-be1d-4cba-b504-e2221e1b65df	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-06 10:30:00+00	2025-10-06 11:30:00+00	t	\N	\N
0f97e0d9-e36a-46d4-8019-3216c8f0a44a	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-06 11:30:00+00	2025-10-06 12:30:00+00	t	\N	\N
ca9e951a-f319-459a-b202-dd6e82d32c18	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-06 12:30:00+00	2025-10-06 13:30:00+00	t	\N	\N
193e8b8f-226b-484e-b1e2-8028b60492a1	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-06 13:30:00+00	2025-10-06 14:30:00+00	t	\N	\N
38287f2e-88da-4093-a94d-7bcab07de27e	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-06 14:30:00+00	2025-10-06 15:30:00+00	t	\N	\N
8383be27-c730-4602-9e3f-cd69ae49e455	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-07 03:30:00+00	2025-10-07 04:30:00+00	t	\N	\N
f70fa712-1e6e-4217-8813-d69dba812603	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-07 04:30:00+00	2025-10-07 05:30:00+00	t	\N	\N
d88f0770-b164-4cf8-b123-a1a89f1dd6b2	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-07 05:30:00+00	2025-10-07 06:30:00+00	t	\N	\N
60f4bae8-1cdc-4813-aa50-8743263947f5	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-07 06:30:00+00	2025-10-07 07:30:00+00	t	\N	\N
f08df24e-cf94-4fc6-a1af-72437eded325	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-07 07:30:00+00	2025-10-07 08:30:00+00	t	\N	\N
4f7da4bd-cbbc-4a0d-ad27-dce1882fc3f0	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-07 08:30:00+00	2025-10-07 09:30:00+00	t	\N	\N
a95844f6-bd8e-4c24-9c97-27ae0a4309da	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-07 09:30:00+00	2025-10-07 10:30:00+00	t	\N	\N
1d603f60-3fa1-4728-8bf3-f8ac05baa30f	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-07 10:30:00+00	2025-10-07 11:30:00+00	t	\N	\N
65441e4f-3e85-4374-93ef-226b7ce4323e	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-07 11:30:00+00	2025-10-07 12:30:00+00	t	\N	\N
faf692b3-3ee8-448b-8ebb-9d5dda8c09ff	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-07 12:30:00+00	2025-10-07 13:30:00+00	t	\N	\N
15308096-a12e-4c93-8993-72baecad6ea8	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-07 13:30:00+00	2025-10-07 14:30:00+00	t	\N	\N
3bd1b4ab-a74d-475a-ab5c-e66e492894cc	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-07 14:30:00+00	2025-10-07 15:30:00+00	t	\N	\N
65d09a7d-02ed-403a-9a2a-452d8fa62848	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-08 03:30:00+00	2025-10-08 04:30:00+00	t	\N	\N
8914441b-5ecd-4dc0-a3a4-39c505f9e5b7	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-08 04:30:00+00	2025-10-08 05:30:00+00	t	\N	\N
f08309da-d649-4dcc-8003-583619e3f447	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-08 05:30:00+00	2025-10-08 06:30:00+00	t	\N	\N
b96ccc7e-0d96-43fa-a049-a32c42bcd4a8	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-08 06:30:00+00	2025-10-08 07:30:00+00	t	\N	\N
7588f5c2-1f5b-4f14-bbcf-935350e91624	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-08 07:30:00+00	2025-10-08 08:30:00+00	t	\N	\N
96818823-7ac3-4122-9c4c-1188813cf175	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-08 08:30:00+00	2025-10-08 09:30:00+00	t	\N	\N
09955328-3ec5-43a0-88e4-02c6b7b29ec6	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-08 09:30:00+00	2025-10-08 10:30:00+00	t	\N	\N
c152725b-85d0-421d-a821-81d36bedfd4c	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-08 10:30:00+00	2025-10-08 11:30:00+00	t	\N	\N
b48f679d-27b2-418d-bffd-4d235742c2a6	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-08 11:30:00+00	2025-10-08 12:30:00+00	t	\N	\N
163d5a41-ea6f-4dfb-a649-5cb30918dc01	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-08 12:30:00+00	2025-10-08 13:30:00+00	t	\N	\N
f2f04f50-edc3-4545-a65f-16c6e9d5b110	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-08 13:30:00+00	2025-10-08 14:30:00+00	t	\N	\N
3baff408-2722-48e1-8bbc-dc8fa505795e	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-08 14:30:00+00	2025-10-08 15:30:00+00	t	\N	\N
2abcd311-a1d3-4fbe-ba05-7c0a9b56d26d	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-09 03:30:00+00	2025-10-09 04:30:00+00	t	\N	\N
33c19e76-2d54-4c5a-9e0f-f062a40f6731	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-09 04:30:00+00	2025-10-09 05:30:00+00	t	\N	\N
9df24f02-1f57-44d2-b943-ea1ef31a7028	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-09 05:30:00+00	2025-10-09 06:30:00+00	t	\N	\N
82808ce5-435e-422f-aacb-690fff3d583f	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-09 06:30:00+00	2025-10-09 07:30:00+00	t	\N	\N
48ecf2cd-2ccd-41df-ae8e-08641a78c1aa	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-09 07:30:00+00	2025-10-09 08:30:00+00	t	\N	\N
499396fe-ccca-4f46-a2e3-3cd287497da4	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-09 08:30:00+00	2025-10-09 09:30:00+00	t	\N	\N
bb1579c7-504c-4aee-b5cb-ffca40d97d6d	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-09 09:30:00+00	2025-10-09 10:30:00+00	t	\N	\N
0fba4f19-8488-4e6c-b4fd-034bb4bbbdfa	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-09 10:30:00+00	2025-10-09 11:30:00+00	t	\N	\N
58f4d063-6f01-4331-a457-8a52bb044616	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-09 11:30:00+00	2025-10-09 12:30:00+00	t	\N	\N
bd288cd8-d87c-459f-82a4-5cf4e2b1e059	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-09 12:30:00+00	2025-10-09 13:30:00+00	t	\N	\N
5edd5569-4cd9-4dcd-a798-3f4647d0ea25	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-09 13:30:00+00	2025-10-09 14:30:00+00	t	\N	\N
4d048c52-f548-47c0-a0c0-a34e7591126d	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-09 14:30:00+00	2025-10-09 15:30:00+00	t	\N	\N
7ddf0465-6ff9-4b7f-a5c6-dbd48b2e8bc7	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-10 03:30:00+00	2025-10-10 04:30:00+00	t	\N	\N
33496dc5-491f-42f2-aaea-8660f4c12b81	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-10 04:30:00+00	2025-10-10 05:30:00+00	t	\N	\N
7facf9be-f0a8-4128-b38a-b1ba0f967c3f	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-10 05:30:00+00	2025-10-10 06:30:00+00	t	\N	\N
322ae144-a562-453d-954b-0985b1656719	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-10 06:30:00+00	2025-10-10 07:30:00+00	t	\N	\N
06b6f95d-ca9b-45d8-9bf0-32d9d17dffb8	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-10 07:30:00+00	2025-10-10 08:30:00+00	t	\N	\N
e2b03d27-a805-4dc7-9592-f7057674e180	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-10 08:30:00+00	2025-10-10 09:30:00+00	t	\N	\N
eaade2ec-016e-488c-a0ad-301af61f4063	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-10 09:30:00+00	2025-10-10 10:30:00+00	t	\N	\N
71cbd4ef-f933-4c17-8389-a3eba9aefe2f	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-10 10:30:00+00	2025-10-10 11:30:00+00	t	\N	\N
dc649b90-5d08-4772-86ee-e04446d9b747	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-10 11:30:00+00	2025-10-10 12:30:00+00	t	\N	\N
9a5d6a66-7689-4713-865a-bff118bd4380	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-10 12:30:00+00	2025-10-10 13:30:00+00	t	\N	\N
bc59b728-6756-4d91-8004-22913c0498c5	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-10 13:30:00+00	2025-10-10 14:30:00+00	t	\N	\N
4bb10b3b-2abc-42ff-935b-896c3f8b420d	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-10 14:30:00+00	2025-10-10 15:30:00+00	t	\N	\N
d486f51f-8e5e-40aa-8e74-d32ea7c8c741	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-11 03:30:00+00	2025-10-11 04:30:00+00	t	\N	\N
2b762e36-8abe-4577-b6f6-5dfe7551c463	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-11 04:30:00+00	2025-10-11 05:30:00+00	t	\N	\N
b3dbca2c-c70b-4334-a01a-9fb57a74ce67	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-11 05:30:00+00	2025-10-11 06:30:00+00	t	\N	\N
d1089a0f-548c-44fd-81dd-206a6c80d1d8	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-11 06:30:00+00	2025-10-11 07:30:00+00	t	\N	\N
85646407-6983-4425-9c0e-ec1790e41f23	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-11 07:30:00+00	2025-10-11 08:30:00+00	t	\N	\N
aa140ffe-8018-4ef6-81be-3ac7558b461b	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-11 08:30:00+00	2025-10-11 09:30:00+00	t	\N	\N
6a8f9f78-d451-4360-a557-f7d51632d967	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-11 09:30:00+00	2025-10-11 10:30:00+00	t	\N	\N
29d9ab5b-3425-4ec7-84ed-b345430302f9	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-11 10:30:00+00	2025-10-11 11:30:00+00	t	\N	\N
4ce26bbe-2254-4cfd-9b1b-fe35a02fbd7e	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-11 11:30:00+00	2025-10-11 12:30:00+00	t	\N	\N
c89bb8c1-9f49-423c-894f-fbd997df6856	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-11 12:30:00+00	2025-10-11 13:30:00+00	t	\N	\N
de89cc17-b9be-42c3-a3bc-a67567d0520a	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-11 13:30:00+00	2025-10-11 14:30:00+00	t	\N	\N
7627ea8f-c19b-436b-847e-44eb725dfa13	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-11 14:30:00+00	2025-10-11 15:30:00+00	t	\N	\N
4ba27223-8846-4a14-ad55-6f481fb2fe70	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-12 03:30:00+00	2025-10-12 04:30:00+00	t	\N	\N
fd2206d0-ba40-42c4-b096-c9e9f6cecc31	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-12 04:30:00+00	2025-10-12 05:30:00+00	t	\N	\N
a4ac88c4-22be-4c6a-b686-f1931c8f7b7e	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-12 05:30:00+00	2025-10-12 06:30:00+00	t	\N	\N
e039f5cc-5ac3-4e2f-97d1-acd4a11e5324	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-12 06:30:00+00	2025-10-12 07:30:00+00	t	\N	\N
2f584262-f6fd-4c22-930c-45d39a0316a6	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-12 07:30:00+00	2025-10-12 08:30:00+00	t	\N	\N
55ce7b49-1822-432f-9b53-23d6175fe155	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-12 08:30:00+00	2025-10-12 09:30:00+00	t	\N	\N
0eb8359f-5ecb-466c-8c5a-293a0cfd7b12	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-12 09:30:00+00	2025-10-12 10:30:00+00	t	\N	\N
8e17c00a-1eca-4948-8132-38d1e063f743	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-12 10:30:00+00	2025-10-12 11:30:00+00	t	\N	\N
a8fe26bb-8b1e-41f9-9124-4f79f3122fce	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-12 11:30:00+00	2025-10-12 12:30:00+00	t	\N	\N
134520dd-6bb4-4b29-b260-ffe14f4d8d13	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-12 12:30:00+00	2025-10-12 13:30:00+00	t	\N	\N
335ce756-aac7-4e06-aebf-60be44eab527	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-12 13:30:00+00	2025-10-12 14:30:00+00	t	\N	\N
31065fb3-ce8d-4815-889e-4b63b8942359	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-12 14:30:00+00	2025-10-12 15:30:00+00	t	\N	\N
6aeaab3d-f61d-45e3-9985-4b569898c5ba	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-13 03:30:00+00	2025-10-13 04:30:00+00	t	\N	\N
74ae1acd-f789-498a-ac3a-4c41647a8829	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-13 04:30:00+00	2025-10-13 05:30:00+00	t	\N	\N
856eb262-7ae3-4e43-b9a9-f6f97896edcf	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-13 05:30:00+00	2025-10-13 06:30:00+00	t	\N	\N
fe158263-b98e-45cc-b5a2-d4a11eb0258b	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-13 06:30:00+00	2025-10-13 07:30:00+00	t	\N	\N
6b668255-93f1-4668-a40c-c97347cb66f3	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-13 07:30:00+00	2025-10-13 08:30:00+00	t	\N	\N
fb4466cb-60ad-4e70-8957-9bd965018c41	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-13 08:30:00+00	2025-10-13 09:30:00+00	t	\N	\N
6fd4e4ad-17fe-48e5-8ddd-f02b53dbf3be	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-13 09:30:00+00	2025-10-13 10:30:00+00	t	\N	\N
b2176937-d17b-43b6-bab0-bee7e6cd3df5	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-13 10:30:00+00	2025-10-13 11:30:00+00	t	\N	\N
49238063-b4fc-450c-87e1-b9cb4cff3ca1	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-13 11:30:00+00	2025-10-13 12:30:00+00	t	\N	\N
f914382e-6079-4d03-b5c8-a7af6821eb56	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-13 12:30:00+00	2025-10-13 13:30:00+00	t	\N	\N
5dd266c9-e02f-4d4b-bf7b-3e6b4f446deb	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-13 13:30:00+00	2025-10-13 14:30:00+00	t	\N	\N
233c36aa-6d85-4706-9c4e-a66a39e48672	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-13 14:30:00+00	2025-10-13 15:30:00+00	t	\N	\N
bc4be1fe-7a76-4620-b23b-1b4f718b4cee	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-14 03:30:00+00	2025-10-14 04:30:00+00	t	\N	\N
70f7c178-e06f-423b-8b38-5ea66b735be8	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-14 04:30:00+00	2025-10-14 05:30:00+00	t	\N	\N
4649d15d-cfb4-4915-9dd4-29798ab48cd0	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-14 05:30:00+00	2025-10-14 06:30:00+00	t	\N	\N
6b21e18e-c90b-4849-8e95-29067962db0e	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-14 06:30:00+00	2025-10-14 07:30:00+00	t	\N	\N
394aafb6-aa39-407e-b8f5-cea4deea1031	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-14 07:30:00+00	2025-10-14 08:30:00+00	t	\N	\N
3708a9ca-89ef-45d5-8fae-e2fd2d11b524	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-14 08:30:00+00	2025-10-14 09:30:00+00	t	\N	\N
09ba8a8c-fd98-4309-b32d-89fe2036a333	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-14 09:30:00+00	2025-10-14 10:30:00+00	t	\N	\N
a95db986-9b2c-450a-96f2-e81265b309e0	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-14 10:30:00+00	2025-10-14 11:30:00+00	t	\N	\N
f3965fdc-7f68-4c92-a1d1-6288c029d039	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-14 11:30:00+00	2025-10-14 12:30:00+00	t	\N	\N
77e69f5c-6207-4f38-89f5-50b5825db3b1	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-14 12:30:00+00	2025-10-14 13:30:00+00	t	\N	\N
55093f25-aa8c-4f39-b69d-fda8116aca91	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-14 13:30:00+00	2025-10-14 14:30:00+00	t	\N	\N
8ed2631a-c66f-4090-9b7f-0ce7de79d867	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-15 03:30:00+00	2025-10-15 04:30:00+00	t	\N	\N
29e95ef1-afbf-4a94-ae1d-c69156f1a188	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-15 04:30:00+00	2025-10-15 05:30:00+00	t	\N	\N
b95e861e-f4fe-406b-a9b9-2cd1fef23d09	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-15 05:30:00+00	2025-10-15 06:30:00+00	t	\N	\N
a917678a-50c2-435a-95d6-9581768e5539	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-15 06:30:00+00	2025-10-15 07:30:00+00	t	\N	\N
65349649-be0c-4a4d-8aa5-0a6e6b81917d	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-15 07:30:00+00	2025-10-15 08:30:00+00	t	\N	\N
e3e9c637-39bd-46e2-b68b-98ec7c01d1b9	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-15 08:30:00+00	2025-10-15 09:30:00+00	t	\N	\N
f1894bb8-b29c-4ce7-9788-68132a14fbec	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-15 09:30:00+00	2025-10-15 10:30:00+00	t	\N	\N
7de938fb-8c6c-474a-86a7-210cace4a45f	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-15 10:30:00+00	2025-10-15 11:30:00+00	t	\N	\N
6b1b4f97-0475-4146-a737-65304a8ad2ed	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-15 11:30:00+00	2025-10-15 12:30:00+00	t	\N	\N
20f3c286-54c9-4c3d-85fa-2e352e1f8c66	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-15 12:30:00+00	2025-10-15 13:30:00+00	t	\N	\N
b6ad719c-9a1f-4416-9c83-7ce607a1094c	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-15 13:30:00+00	2025-10-15 14:30:00+00	t	\N	\N
638a0608-fb5a-4f98-a616-0b366fed6947	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-15 14:30:00+00	2025-10-15 15:30:00+00	t	\N	\N
4fb709d8-38ec-4be3-8d07-f755ea3b0a4c	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-16 03:30:00+00	2025-10-16 04:30:00+00	t	\N	\N
b83ab8c2-ea27-4080-aafb-13aa432c6ddf	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-16 04:30:00+00	2025-10-16 05:30:00+00	t	\N	\N
7e9a6c0a-53c3-419c-9d38-8a62cb33e76e	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-16 05:30:00+00	2025-10-16 06:30:00+00	t	\N	\N
a609d169-516e-4069-a6af-0e621fb9781d	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-16 06:30:00+00	2025-10-16 07:30:00+00	t	\N	\N
b340dc9a-965e-4157-ae3b-d0bc18ff7682	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-16 07:30:00+00	2025-10-16 08:30:00+00	t	\N	\N
a10fa895-0e89-46af-bd1d-964f28a494e5	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-16 08:30:00+00	2025-10-16 09:30:00+00	t	\N	\N
95c02b5d-0a63-4328-a507-d322cfdff270	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-16 09:30:00+00	2025-10-16 10:30:00+00	t	\N	\N
e7f37cee-4df1-4290-a161-d2769ab3d3ca	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-16 10:30:00+00	2025-10-16 11:30:00+00	t	\N	\N
b18cba59-a016-414d-a5aa-0c077fc6a481	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-16 11:30:00+00	2025-10-16 12:30:00+00	t	\N	\N
5489399b-1a7a-4805-b48e-0bca55fb4693	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-16 12:30:00+00	2025-10-16 13:30:00+00	t	\N	\N
f4ab1264-38b7-4ad3-965b-dbd1abf9ae56	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-16 13:30:00+00	2025-10-16 14:30:00+00	t	\N	\N
acbf8f8e-dbbd-4c4c-820f-bee9b5ea3b01	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-16 14:30:00+00	2025-10-16 15:30:00+00	t	\N	\N
e4c09311-3a4b-461a-b9bd-8a16ecc8ca1d	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-17 03:30:00+00	2025-10-17 04:30:00+00	t	\N	\N
e8609ff6-8eec-4e4f-9566-5bb1e3149d2e	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-17 04:30:00+00	2025-10-17 05:30:00+00	t	\N	\N
2e465d7c-58dc-43dc-b3e0-6c5a6c131388	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-17 05:30:00+00	2025-10-17 06:30:00+00	t	\N	\N
195935c8-296c-4b44-899d-f485bccda325	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-17 06:30:00+00	2025-10-17 07:30:00+00	t	\N	\N
c39d26fc-1cab-467c-a0ec-0dd60dae1497	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-17 07:30:00+00	2025-10-17 08:30:00+00	t	\N	\N
fb085372-8dd9-41a0-af4e-23a3faeffe46	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-17 08:30:00+00	2025-10-17 09:30:00+00	t	\N	\N
7fba8cc5-2a54-4430-90b7-855b716799ec	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-17 09:30:00+00	2025-10-17 10:30:00+00	t	\N	\N
cd2ad71c-2bd2-4dae-8988-5b3a11d4b310	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-17 10:30:00+00	2025-10-17 11:30:00+00	t	\N	\N
3b26649e-72a2-4650-bfb3-625bdf4a37b3	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-17 11:30:00+00	2025-10-17 12:30:00+00	t	\N	\N
648140c9-2777-4fdd-99b7-e7002daa4a25	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-17 12:30:00+00	2025-10-17 13:30:00+00	t	\N	\N
1cf7ce0a-cecb-4956-9350-c8ddc3e945c6	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-17 13:30:00+00	2025-10-17 14:30:00+00	t	\N	\N
394512fb-8079-407f-ac93-a3ba89e8a024	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-17 14:30:00+00	2025-10-17 15:30:00+00	t	\N	\N
f3158007-df55-4fdf-bcd3-60a032b34707	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-18 03:30:00+00	2025-10-18 04:30:00+00	t	\N	\N
7253a04d-a07d-4650-a40a-3846c007c7c5	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-18 04:30:00+00	2025-10-18 05:30:00+00	t	\N	\N
feda4795-f55a-47d8-8b1e-d8074688d809	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-18 05:30:00+00	2025-10-18 06:30:00+00	t	\N	\N
6adc82ba-bb27-49f4-b26b-f9632479ee76	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-18 06:30:00+00	2025-10-18 07:30:00+00	t	\N	\N
d5070888-5021-4ad1-8a50-e3e38079f841	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-18 07:30:00+00	2025-10-18 08:30:00+00	t	\N	\N
1e9df5f4-860f-41e3-86e6-a50915becec2	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-18 08:30:00+00	2025-10-18 09:30:00+00	t	\N	\N
e0687c28-9b79-4df0-bbde-e5df161f1508	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-18 09:30:00+00	2025-10-18 10:30:00+00	t	\N	\N
36350fb8-b49b-4868-965b-f36ade4f7817	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-18 10:30:00+00	2025-10-18 11:30:00+00	t	\N	\N
a4bba4bf-115d-4189-afb7-d7f6fbbc2fc1	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-18 11:30:00+00	2025-10-18 12:30:00+00	t	\N	\N
7afb1ba5-b652-4804-8062-cf946c36d9de	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-18 12:30:00+00	2025-10-18 13:30:00+00	t	\N	\N
09ebe0c2-40fc-46c6-b4be-ae25204acaaf	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-18 13:30:00+00	2025-10-18 14:30:00+00	t	\N	\N
6ac9cdc1-6991-4d0d-bad8-487617f559a8	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-18 14:30:00+00	2025-10-18 15:30:00+00	t	\N	\N
ae38735b-fcd8-46b8-b57a-a02ccaf04190	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-19 03:30:00+00	2025-10-19 04:30:00+00	t	\N	\N
57da989e-924e-4468-a439-bc579b883059	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-19 04:30:00+00	2025-10-19 05:30:00+00	t	\N	\N
b1d2c621-8c2a-4a4d-99a1-0f3f0135dd0f	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-19 05:30:00+00	2025-10-19 06:30:00+00	t	\N	\N
22da8442-4a4b-4f6f-a20f-efa05d2d83e2	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-19 06:30:00+00	2025-10-19 07:30:00+00	t	\N	\N
3767fb1c-86cb-4868-93e4-057ce708d2c8	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-19 07:30:00+00	2025-10-19 08:30:00+00	t	\N	\N
8c4d8ad0-84a2-4c58-886e-1dc0194976ff	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-19 08:30:00+00	2025-10-19 09:30:00+00	t	\N	\N
926680cc-2c06-46c4-9865-4f6701138d40	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-19 09:30:00+00	2025-10-19 10:30:00+00	t	\N	\N
8ce01fea-eea2-48f1-9aef-73060f4a983d	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-19 10:30:00+00	2025-10-19 11:30:00+00	t	\N	\N
7c503c24-7331-47d6-81d1-d4909b55b1cf	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-19 11:30:00+00	2025-10-19 12:30:00+00	t	\N	\N
ed1b4160-217f-4be5-92a5-ca9a869e5791	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-19 12:30:00+00	2025-10-19 13:30:00+00	t	\N	\N
cc82584d-d86d-4a06-bd93-cee62ff37b1b	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-19 13:30:00+00	2025-10-19 14:30:00+00	t	\N	\N
8cd96bf2-fd58-4380-b5fb-0d33e2f18497	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-19 14:30:00+00	2025-10-19 15:30:00+00	t	\N	\N
80dfc90f-ec8d-4d87-ab5d-e92fef943d8b	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-20 03:30:00+00	2025-10-20 04:30:00+00	t	\N	\N
ae7d512e-b94f-4d96-8ac3-ece869918d56	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-20 04:30:00+00	2025-10-20 05:30:00+00	t	\N	\N
be890b55-e095-4274-9e20-43fe4e9c49fd	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-20 05:30:00+00	2025-10-20 06:30:00+00	t	\N	\N
38e40f69-3574-4cc2-9123-8c26f0a6a4f8	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-20 06:30:00+00	2025-10-20 07:30:00+00	t	\N	\N
801795be-0f94-4b2f-b4a2-66af24cb31ee	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-20 07:30:00+00	2025-10-20 08:30:00+00	t	\N	\N
7a01a6d0-13e5-41ad-bffa-ad37378a3dbf	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-20 08:30:00+00	2025-10-20 09:30:00+00	t	\N	\N
70478a2d-728d-4bb6-896b-f1cc81595c38	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-20 09:30:00+00	2025-10-20 10:30:00+00	t	\N	\N
c2578c90-e0d7-47b9-a764-37f639317e43	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-20 10:30:00+00	2025-10-20 11:30:00+00	t	\N	\N
fa4a35ba-225c-4405-9052-4689055bb9b9	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-20 11:30:00+00	2025-10-20 12:30:00+00	t	\N	\N
e6146fe6-8978-4de0-b097-9a7b22a3623c	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-20 12:30:00+00	2025-10-20 13:30:00+00	t	\N	\N
cc0004ad-475c-4c17-82a5-e47c764740b8	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-20 13:30:00+00	2025-10-20 14:30:00+00	t	\N	\N
d589a41e-4f90-4516-b3cc-810aae1984b3	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-20 14:30:00+00	2025-10-20 15:30:00+00	t	\N	\N
4a0a651b-4482-456b-b66d-ea22c893a999	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-21 03:30:00+00	2025-10-21 04:30:00+00	t	\N	\N
83dd0452-d4a9-4146-87dd-8d8abdf7a1cc	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-21 04:30:00+00	2025-10-21 05:30:00+00	t	\N	\N
07aa1e95-445a-4563-a5b3-1332dbf234c0	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-21 05:30:00+00	2025-10-21 06:30:00+00	t	\N	\N
9f06ccab-b3e5-4516-88d7-4679d6061838	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-21 06:30:00+00	2025-10-21 07:30:00+00	t	\N	\N
7cc1b34c-3c39-479b-8f3c-7ecdd4113232	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-21 07:30:00+00	2025-10-21 08:30:00+00	t	\N	\N
d4254efc-ec3d-4640-90ee-1e53f7b2ada6	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-21 08:30:00+00	2025-10-21 09:30:00+00	t	\N	\N
dc623c81-4fa7-4128-8ab0-b9c9975aadda	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-21 09:30:00+00	2025-10-21 10:30:00+00	t	\N	\N
fcd9b8b0-c264-4b08-93b2-38523953f78a	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-21 10:30:00+00	2025-10-21 11:30:00+00	t	\N	\N
2a66c4ba-9f5c-437d-b741-b57f05134c0a	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-21 11:30:00+00	2025-10-21 12:30:00+00	t	\N	\N
b1fdda3c-0e35-4ce6-8b8a-8c5c20def5b7	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-21 12:30:00+00	2025-10-21 13:30:00+00	t	\N	\N
e8e15c58-fe6f-4f91-96d4-248e909dfb33	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-21 13:30:00+00	2025-10-21 14:30:00+00	t	\N	\N
2cf0e4f5-d333-44fe-937a-1ed40be76c1d	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-21 14:30:00+00	2025-10-21 15:30:00+00	t	\N	\N
40c4a5af-1512-4a4d-9a14-3691f9c907a1	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-14 03:30:00+00	2025-10-14 04:30:00+00	t	\N	\N
e3c5878f-3ded-4383-ba8c-5df40b17062b	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-14 04:30:00+00	2025-10-14 05:30:00+00	t	\N	\N
ca775f2c-3360-4d73-8312-ebb9710fc5bc	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-14 05:30:00+00	2025-10-14 06:30:00+00	t	\N	\N
9c0e2f73-a407-4920-a10b-2c5047c339e4	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-14 06:30:00+00	2025-10-14 07:30:00+00	t	\N	\N
a78ebff9-e1c9-4dcf-ac6e-373faf865cca	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-14 07:30:00+00	2025-10-14 08:30:00+00	t	\N	\N
111c3027-a19b-4249-b02a-4aa74bba0ec5	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-14 08:30:00+00	2025-10-14 09:30:00+00	t	\N	\N
e6f53f1d-4837-46d7-8800-f4d52ba42147	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-14 09:30:00+00	2025-10-14 10:30:00+00	t	\N	\N
bd74e484-59c7-4f3e-adb8-2e148d351c76	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-14 10:30:00+00	2025-10-14 11:30:00+00	t	\N	\N
e68271cf-d2a2-4ef5-a72f-19b49ae157c5	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-14 11:30:00+00	2025-10-14 12:30:00+00	t	\N	\N
df69dcf0-1703-41a0-b784-a1552ab3909a	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-14 12:30:00+00	2025-10-14 13:30:00+00	t	\N	\N
c507db4d-cedb-4dec-a72a-d5084757f843	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-14 13:30:00+00	2025-10-14 14:30:00+00	t	\N	\N
3fc386e4-876c-4d12-a7c9-24a055f288ea	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-14 14:30:00+00	2025-10-14 15:30:00+00	t	\N	\N
49ab8be2-0c11-45e5-a2b3-3d3238b511e7	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-15 03:30:00+00	2025-10-15 04:30:00+00	t	\N	\N
bc67330a-8c8f-4e12-8c46-1f6633fd6dcb	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-15 04:30:00+00	2025-10-15 05:30:00+00	t	\N	\N
e3220171-be67-4fb2-b0d9-094df066fb3b	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-15 05:30:00+00	2025-10-15 06:30:00+00	t	\N	\N
ca6e9ab7-30e4-4c87-8cb8-1cb171377c19	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-15 06:30:00+00	2025-10-15 07:30:00+00	t	\N	\N
566d3757-a5d6-41d9-9505-9b956c416596	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-15 07:30:00+00	2025-10-15 08:30:00+00	t	\N	\N
99ed3dc8-5235-43fc-8648-555e0da47776	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-15 08:30:00+00	2025-10-15 09:30:00+00	t	\N	\N
7116a924-d21c-42b5-b255-701e5a24bdae	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-15 09:30:00+00	2025-10-15 10:30:00+00	t	\N	\N
ad0c6a1f-f732-4cdc-8cf9-7bbce5a39d42	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-15 10:30:00+00	2025-10-15 11:30:00+00	t	\N	\N
9627070c-2376-4fe3-8252-5f8604e7df1b	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-15 11:30:00+00	2025-10-15 12:30:00+00	t	\N	\N
516734c3-c5d0-4cd7-b760-6fdd5ac0b3e5	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-15 12:30:00+00	2025-10-15 13:30:00+00	t	\N	\N
08c1f640-b7c3-4d8e-aa74-fde2c0e7151e	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-15 13:30:00+00	2025-10-15 14:30:00+00	t	\N	\N
c327e710-e84b-4081-b6a4-cd6ef1b67fea	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-15 14:30:00+00	2025-10-15 15:30:00+00	t	\N	\N
33f726d9-0693-4f0d-a30d-9c228269a46d	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-16 03:30:00+00	2025-10-16 04:30:00+00	t	\N	\N
d24abe17-961b-49b9-be58-ea5941873c33	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-16 04:30:00+00	2025-10-16 05:30:00+00	t	\N	\N
55a2127d-d49c-40fa-b3c6-1ca5e7ed0066	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-16 05:30:00+00	2025-10-16 06:30:00+00	t	\N	\N
1e6f9f7f-bea2-4165-9209-13736afc7dfe	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-16 06:30:00+00	2025-10-16 07:30:00+00	t	\N	\N
c4da01ea-efc4-49c4-9307-085880ff02b9	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-16 07:30:00+00	2025-10-16 08:30:00+00	t	\N	\N
b0e358fe-4276-4ea3-96da-224e560bcfdd	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-16 08:30:00+00	2025-10-16 09:30:00+00	t	\N	\N
802b178f-85dd-4a03-80cf-bedf1cf7b5e7	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-16 09:30:00+00	2025-10-16 10:30:00+00	t	\N	\N
42028ec7-2201-4d50-aa1e-244f236f44c6	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-16 10:30:00+00	2025-10-16 11:30:00+00	t	\N	\N
6e53685a-50da-4e07-954c-5807859c16bb	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-16 11:30:00+00	2025-10-16 12:30:00+00	t	\N	\N
6718af00-8852-445a-864f-042c13cc1bf8	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-16 12:30:00+00	2025-10-16 13:30:00+00	t	\N	\N
cdd6ea60-15fe-4c6e-a6d6-cc401ee5d358	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-16 13:30:00+00	2025-10-16 14:30:00+00	t	\N	\N
c6a4d5ef-2a59-4d29-8d3d-6d079271b005	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-16 14:30:00+00	2025-10-16 15:30:00+00	t	\N	\N
6592c1c5-532f-41fb-99bd-628af3e008b0	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-17 03:30:00+00	2025-10-17 04:30:00+00	t	\N	\N
6db412f5-e4af-4121-b984-941f304c2c3a	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-17 04:30:00+00	2025-10-17 05:30:00+00	t	\N	\N
af4259ec-2245-476f-97be-dc3fd9412ce5	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-17 05:30:00+00	2025-10-17 06:30:00+00	t	\N	\N
8e06ab7c-8b11-4c9d-a3a2-9294971d957a	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-17 06:30:00+00	2025-10-17 07:30:00+00	t	\N	\N
c1ae0eb0-4533-451e-aee4-75a38acb7c90	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-17 07:30:00+00	2025-10-17 08:30:00+00	t	\N	\N
86f69fcb-6b8f-4f3d-a4bc-a5e453bac911	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-17 08:30:00+00	2025-10-17 09:30:00+00	t	\N	\N
b99533c1-40ad-4851-a7c5-b9b30ad7de31	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-17 09:30:00+00	2025-10-17 10:30:00+00	t	\N	\N
3441f95a-d653-40c2-a3b1-84eb50d0c38c	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-17 10:30:00+00	2025-10-17 11:30:00+00	t	\N	\N
64a5abe4-624a-4bb3-8d80-71dc5c88f42d	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-17 11:30:00+00	2025-10-17 12:30:00+00	t	\N	\N
e537c394-c86b-4736-92f4-df63dec09d6e	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-17 12:30:00+00	2025-10-17 13:30:00+00	t	\N	\N
20d65601-1651-4850-906d-dd641891a02f	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-17 13:30:00+00	2025-10-17 14:30:00+00	t	\N	\N
572bf232-d11e-4859-808b-7383ea10dedb	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-17 14:30:00+00	2025-10-17 15:30:00+00	t	\N	\N
21ee8679-1184-425f-8920-617fee2298e3	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-18 03:30:00+00	2025-10-18 04:30:00+00	t	\N	\N
a20698c8-1634-45c0-9ea9-fa2c00ce7fc2	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-18 04:30:00+00	2025-10-18 05:30:00+00	t	\N	\N
6d7c32f8-0203-4893-ae77-b627fe75f74c	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-18 05:30:00+00	2025-10-18 06:30:00+00	t	\N	\N
2de31d41-c312-44c0-83f1-06ea12a3c063	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-18 06:30:00+00	2025-10-18 07:30:00+00	t	\N	\N
92fee9f4-d77b-4a3f-b94b-6342af60f03b	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-18 07:30:00+00	2025-10-18 08:30:00+00	t	\N	\N
7a1aede2-3264-47b3-a3f1-b806d38b3af3	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-18 08:30:00+00	2025-10-18 09:30:00+00	t	\N	\N
e9fa8da9-2452-4e33-ac15-5a89af298440	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-18 09:30:00+00	2025-10-18 10:30:00+00	t	\N	\N
703b044d-fcd0-4d16-99d6-7372c0fefbef	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-18 10:30:00+00	2025-10-18 11:30:00+00	t	\N	\N
4134954f-0eda-4960-94f8-0920a18919fe	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-18 11:30:00+00	2025-10-18 12:30:00+00	t	\N	\N
63286f9c-3df2-405f-8272-c050b420bbe1	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-18 12:30:00+00	2025-10-18 13:30:00+00	t	\N	\N
81bd5c03-2b58-4c2f-b95f-e026e516d04f	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-18 13:30:00+00	2025-10-18 14:30:00+00	t	\N	\N
c51aa42a-2151-4b7b-bbee-5305ea3ac9b8	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-18 14:30:00+00	2025-10-18 15:30:00+00	t	\N	\N
b8b31f3c-9d99-4d4a-b9b9-2e28ddbaed3b	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-19 03:30:00+00	2025-10-19 04:30:00+00	t	\N	\N
872c59a1-e34d-43d7-ba1e-657b081a4269	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-19 04:30:00+00	2025-10-19 05:30:00+00	t	\N	\N
4852aed3-503a-41f7-ab43-66efb4c0f2c0	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-19 05:30:00+00	2025-10-19 06:30:00+00	t	\N	\N
04f4d044-59b0-49f4-86f3-05b948b850eb	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-19 06:30:00+00	2025-10-19 07:30:00+00	t	\N	\N
9109047e-c418-4407-8d6c-72652151a3d7	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-19 07:30:00+00	2025-10-19 08:30:00+00	t	\N	\N
ad2062af-f7bc-4a33-a304-a297ef3ebe80	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-19 08:30:00+00	2025-10-19 09:30:00+00	t	\N	\N
882df336-401b-4e33-aeed-b6a602a9d124	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-19 09:30:00+00	2025-10-19 10:30:00+00	t	\N	\N
431a2c78-82ea-4c07-8aff-b11620d2a257	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-19 10:30:00+00	2025-10-19 11:30:00+00	t	\N	\N
024f2897-2bc2-4abf-9075-b8160a61b1d1	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-19 11:30:00+00	2025-10-19 12:30:00+00	t	\N	\N
359fc6a6-7f71-4a4c-bdc5-758235ed4fa5	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-19 12:30:00+00	2025-10-19 13:30:00+00	t	\N	\N
a803b9f2-159d-4f3d-8073-64122f3b7443	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-19 13:30:00+00	2025-10-19 14:30:00+00	t	\N	\N
c3111ad2-ec97-46ad-917c-ebfbea8151fb	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-19 14:30:00+00	2025-10-19 15:30:00+00	t	\N	\N
6fd1150f-7f4b-461c-8dea-8f8ba180fef2	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-20 03:30:00+00	2025-10-20 04:30:00+00	t	\N	\N
9fd69414-2fc3-4717-baf6-a693dceb28a9	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-20 04:30:00+00	2025-10-20 05:30:00+00	t	\N	\N
cf0dc7a7-e92a-4d83-9928-e2896ef1aa37	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-20 05:30:00+00	2025-10-20 06:30:00+00	t	\N	\N
f3b784ed-7ad7-449b-91d9-2696e1838b01	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-20 06:30:00+00	2025-10-20 07:30:00+00	t	\N	\N
57e08af3-3b49-4800-b04a-faa950d37141	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-20 07:30:00+00	2025-10-20 08:30:00+00	t	\N	\N
c1bf1f84-8ce4-4187-8d70-866fd55ebac2	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-20 08:30:00+00	2025-10-20 09:30:00+00	t	\N	\N
eb0c176a-d39e-4476-b287-336dde01f0f3	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-20 09:30:00+00	2025-10-20 10:30:00+00	t	\N	\N
150b8952-3a3c-48e9-939b-efc50f1eccf6	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-20 10:30:00+00	2025-10-20 11:30:00+00	t	\N	\N
ebd8981e-8e72-43ee-aa53-334281b55299	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-20 11:30:00+00	2025-10-20 12:30:00+00	t	\N	\N
bc863b96-cb62-480e-b1e5-f34f908c7c8e	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-20 12:30:00+00	2025-10-20 13:30:00+00	t	\N	\N
afe97155-dcd2-4ae6-8bc6-05c5d63f2f9e	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-20 13:30:00+00	2025-10-20 14:30:00+00	t	\N	\N
40b228ae-5122-48cd-90d3-4b3f9f1749fc	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-20 14:30:00+00	2025-10-20 15:30:00+00	t	\N	\N
1c3dd586-b628-48d3-ba47-f2dcc27b56c0	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-21 03:30:00+00	2025-10-21 04:30:00+00	t	\N	\N
1c2f38ec-ca5c-41d1-97b3-2b0d7ae081f1	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-21 04:30:00+00	2025-10-21 05:30:00+00	t	\N	\N
c10187b1-654a-4dff-ab82-05d2a1e3329c	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-21 05:30:00+00	2025-10-21 06:30:00+00	t	\N	\N
da8baa49-5e85-48c9-970c-bfed7029c8ec	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-21 06:30:00+00	2025-10-21 07:30:00+00	t	\N	\N
2b462666-3266-4cd7-bc2f-6cc047e976aa	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-21 07:30:00+00	2025-10-21 08:30:00+00	t	\N	\N
a0eeb207-49a3-4c83-acaf-b1d44f04832e	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-21 08:30:00+00	2025-10-21 09:30:00+00	t	\N	\N
02e459aa-bc13-4357-b9ee-c7b80fde3394	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-21 09:30:00+00	2025-10-21 10:30:00+00	t	\N	\N
920cd49a-9374-440b-bb3f-202efda903e9	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-21 10:30:00+00	2025-10-21 11:30:00+00	t	\N	\N
d99f87b3-1126-468b-b1be-0f1d1b5c19f3	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-21 11:30:00+00	2025-10-21 12:30:00+00	t	\N	\N
4c7d4d66-a261-47a4-b195-6c9719adb330	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-21 12:30:00+00	2025-10-21 13:30:00+00	t	\N	\N
b2bea6f7-2fb4-4875-8771-609b05fe258a	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-21 13:30:00+00	2025-10-21 14:30:00+00	t	\N	\N
459b6244-64b1-47ea-801b-fa953065b6cf	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-21 14:30:00+00	2025-10-21 15:30:00+00	t	\N	\N
d0a9c8c3-e3b7-46e4-97a9-ff26dada0503	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-12 03:30:00+00	2025-10-12 04:30:00+00	t	\N	\N
211d277c-be03-4eaf-82ff-bf584cf3854e	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-12 04:30:00+00	2025-10-12 05:30:00+00	t	\N	\N
55b0e9fe-84b8-4cbe-9a87-b4b48eff25bd	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-12 05:30:00+00	2025-10-12 06:30:00+00	t	\N	\N
c1df4f80-7038-4997-ad6e-c89da8dc192e	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-12 06:30:00+00	2025-10-12 07:30:00+00	t	\N	\N
d26bb7d6-5119-4218-aa54-949ec811697e	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-12 07:30:00+00	2025-10-12 08:30:00+00	t	\N	\N
689796cd-0eb6-4dd8-b456-a8cc84792bc7	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-12 08:30:00+00	2025-10-12 09:30:00+00	t	\N	\N
e4b46bd6-9840-446f-b681-f52f14c40bcf	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-12 09:30:00+00	2025-10-12 10:30:00+00	t	\N	\N
e4ffdf9a-1e57-4e31-ad05-8f096ee07ea4	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-12 10:30:00+00	2025-10-12 11:30:00+00	t	\N	\N
0b4ab5b7-0258-4f53-85b9-faeb7a157e29	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-12 11:30:00+00	2025-10-12 12:30:00+00	t	\N	\N
55eac0eb-63e8-4ef6-9840-d72b65da5257	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-12 12:30:00+00	2025-10-12 13:30:00+00	t	\N	\N
b9005440-3edc-4125-ba4f-23494a10c823	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-13 03:30:00+00	2025-10-13 04:30:00+00	t	\N	\N
d6506e0a-c2d5-400d-8dda-2e1767ef8b2c	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-13 04:30:00+00	2025-10-13 05:30:00+00	t	\N	\N
0cdf9e2f-a386-4e95-8466-dd26dc3ab6c9	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-13 05:30:00+00	2025-10-13 06:30:00+00	t	\N	\N
90078e32-5b21-417d-bf90-d3ecbbca326a	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-13 06:30:00+00	2025-10-13 07:30:00+00	t	\N	\N
1c55d575-8ba7-4a21-8657-9410beb721b3	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-13 07:30:00+00	2025-10-13 08:30:00+00	t	\N	\N
2be2bce5-b250-49dd-987c-9b789c3db328	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-13 08:30:00+00	2025-10-13 09:30:00+00	t	\N	\N
a4bf264e-803c-4162-b0b2-bca328c3204c	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-13 09:30:00+00	2025-10-13 10:30:00+00	t	\N	\N
a3b4fd03-35d2-4a0e-ac83-6acfb8d33dd8	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-13 10:30:00+00	2025-10-13 11:30:00+00	t	\N	\N
fba19fca-7776-4bf0-ace0-9c3278633f92	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-13 11:30:00+00	2025-10-13 12:30:00+00	t	\N	\N
2a76c337-7225-4bb3-bf61-a09774e07cb1	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-13 12:30:00+00	2025-10-13 13:30:00+00	t	\N	\N
7aab4a3e-0fd5-4696-8f32-c8b9c9b0c601	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-13 13:30:00+00	2025-10-13 14:30:00+00	t	\N	\N
8f516c52-e992-47f9-8d77-524e309894bb	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-13 14:30:00+00	2025-10-13 15:30:00+00	t	\N	\N
ab5cc9e6-3a1b-4f9f-9302-45471011e702	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-14 03:30:00+00	2025-10-14 04:30:00+00	t	\N	\N
1f6a4a18-bb82-4ecb-9d46-3177ceedc71a	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-14 04:30:00+00	2025-10-14 05:30:00+00	t	\N	\N
a1ff0ae6-8f8c-41cc-83bd-600ae215c0d2	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-14 05:30:00+00	2025-10-14 06:30:00+00	t	\N	\N
355423ef-e563-4f78-928c-bb65b2fb7e6b	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-14 06:30:00+00	2025-10-14 07:30:00+00	t	\N	\N
e006e816-ed9e-41c4-8801-2c6148461b5e	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-14 07:30:00+00	2025-10-14 08:30:00+00	t	\N	\N
566e2257-61ef-4e87-a865-0a4c04a1cb59	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-14 08:30:00+00	2025-10-14 09:30:00+00	t	\N	\N
d11e0932-b868-4c52-a799-8dbc76736d87	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-14 09:30:00+00	2025-10-14 10:30:00+00	t	\N	\N
95793429-b1ee-41e5-a699-29f15b58f534	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-14 10:30:00+00	2025-10-14 11:30:00+00	t	\N	\N
ccf9b043-ef82-43de-88f5-a0afcedfc525	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-14 11:30:00+00	2025-10-14 12:30:00+00	t	\N	\N
bbed50fa-93fc-4fa1-ac57-64c938fba41b	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-14 12:30:00+00	2025-10-14 13:30:00+00	t	\N	\N
f6444fc2-dfd7-4262-a22f-6dce3147d16e	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-15 03:30:00+00	2025-10-15 04:30:00+00	t	\N	\N
3847b061-865c-41c2-b56e-7eaa03ddceeb	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-15 04:30:00+00	2025-10-15 05:30:00+00	t	\N	\N
c7c2c777-1203-49a8-a1a2-991435661898	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-15 05:30:00+00	2025-10-15 06:30:00+00	t	\N	\N
f10b71f4-dacd-493b-9d1b-76df454e3b88	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-15 06:30:00+00	2025-10-15 07:30:00+00	t	\N	\N
f9a4b920-15d9-4faf-98ad-612c9bebd790	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-15 07:30:00+00	2025-10-15 08:30:00+00	t	\N	\N
b9f46088-7472-471e-8db8-56cea05a0c13	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-15 08:30:00+00	2025-10-15 09:30:00+00	t	\N	\N
b6e9063d-1725-4519-939d-e2f7ad96ae44	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-15 09:30:00+00	2025-10-15 10:30:00+00	t	\N	\N
478dc903-5d7a-403f-be90-2fe5dc0be972	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-15 10:30:00+00	2025-10-15 11:30:00+00	t	\N	\N
78ab3ace-710b-4d10-a269-084fe4689d65	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-15 11:30:00+00	2025-10-15 12:30:00+00	t	\N	\N
30a8db86-7c2e-45d5-bcf9-a14cc56cb91b	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-15 12:30:00+00	2025-10-15 13:30:00+00	t	\N	\N
d3db5b21-d2ec-47b0-8474-6000aec13427	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-15 13:30:00+00	2025-10-15 14:30:00+00	t	\N	\N
382ca501-508b-44ea-a350-cfb6d3427be4	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-15 14:30:00+00	2025-10-15 15:30:00+00	t	\N	\N
b2030830-2079-4445-8204-67d1b6f38daf	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-16 03:30:00+00	2025-10-16 04:30:00+00	t	\N	\N
4c4309cd-b110-4f7f-b3b1-a15d3758d372	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-16 04:30:00+00	2025-10-16 05:30:00+00	t	\N	\N
80213768-0c3c-4367-9e8b-5f4184fd6a84	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-16 05:30:00+00	2025-10-16 06:30:00+00	t	\N	\N
b3bb7bbd-851c-4da1-8c65-2c75d0ea4c76	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-16 06:30:00+00	2025-10-16 07:30:00+00	t	\N	\N
5524a346-e570-4b4b-98f6-fa6ef991ed9d	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-16 07:30:00+00	2025-10-16 08:30:00+00	t	\N	\N
8b7159de-1918-4e2a-81dc-d5c0e7754305	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-16 08:30:00+00	2025-10-16 09:30:00+00	t	\N	\N
74636cc0-4bc0-4249-97fd-099122f5d1ee	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-16 09:30:00+00	2025-10-16 10:30:00+00	t	\N	\N
ea643596-0628-4c8f-9ac9-d3b314afd6d3	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-16 10:30:00+00	2025-10-16 11:30:00+00	t	\N	\N
f249784f-04d1-423c-97b1-34be44dbf173	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-16 11:30:00+00	2025-10-16 12:30:00+00	t	\N	\N
a430f14e-9c2d-4b0d-97e3-5ac69c1730e7	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-16 12:30:00+00	2025-10-16 13:30:00+00	t	\N	\N
3051962a-790a-4d06-b34d-8dda22e4db47	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-16 13:30:00+00	2025-10-16 14:30:00+00	t	\N	\N
31bd3cab-9c31-4691-b226-36100012f330	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-16 14:30:00+00	2025-10-16 15:30:00+00	t	\N	\N
03994654-acf6-400c-91fa-22bdd6a2fa73	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-17 03:30:00+00	2025-10-17 04:30:00+00	t	\N	\N
eb4a5c43-3715-4fa6-bae1-3ed2f79140e4	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-17 04:30:00+00	2025-10-17 05:30:00+00	t	\N	\N
3d695654-c134-4daf-9d2e-8fae5b512ded	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-17 05:30:00+00	2025-10-17 06:30:00+00	t	\N	\N
b085a076-7554-43f5-852f-7e77d052ca7b	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-17 06:30:00+00	2025-10-17 07:30:00+00	t	\N	\N
52a9c8b3-0026-4a5b-8c18-c4022d2a06ff	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-17 07:30:00+00	2025-10-17 08:30:00+00	t	\N	\N
2976f87b-0152-4b7c-91b1-3aeec81d5333	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-17 08:30:00+00	2025-10-17 09:30:00+00	t	\N	\N
b8021859-42cb-4a65-a025-6e71cd5572aa	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-17 09:30:00+00	2025-10-17 10:30:00+00	t	\N	\N
81663108-0f87-4351-b90e-91e0db0ab102	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-17 10:30:00+00	2025-10-17 11:30:00+00	t	\N	\N
9e173dcc-8ba7-4677-a09d-6c78ac64b51b	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-17 11:30:00+00	2025-10-17 12:30:00+00	t	\N	\N
eec407b1-433a-4786-8887-6bac19db9d58	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-17 12:30:00+00	2025-10-17 13:30:00+00	t	\N	\N
b2d31815-e200-4740-b38d-2e9c4461492d	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-17 13:30:00+00	2025-10-17 14:30:00+00	t	\N	\N
ed45fed4-c296-4700-a110-495505cb9fbf	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-17 14:30:00+00	2025-10-17 15:30:00+00	t	\N	\N
ba35c99f-d6fd-4f7b-a175-c7ae4e40d563	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-18 03:30:00+00	2025-10-18 04:30:00+00	t	\N	\N
9b78cec1-7fbb-48a6-a4f5-42704ed9afab	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-18 04:30:00+00	2025-10-18 05:30:00+00	t	\N	\N
587aa95f-6152-45d0-8a1a-fc97dd081356	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-18 05:30:00+00	2025-10-18 06:30:00+00	t	\N	\N
e9b5a9b4-7049-4c50-b45f-84a4266e6455	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-18 06:30:00+00	2025-10-18 07:30:00+00	t	\N	\N
b3013f52-53ee-4fb7-8424-82b4fd6b16d8	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-18 07:30:00+00	2025-10-18 08:30:00+00	t	\N	\N
3440508e-0734-4efa-8092-761d4e469790	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-18 08:30:00+00	2025-10-18 09:30:00+00	t	\N	\N
dd57b990-3aa6-4d51-b2f5-9b3e324e4441	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-18 09:30:00+00	2025-10-18 10:30:00+00	t	\N	\N
4931825f-ffc4-4c26-9f33-733df790fa12	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-18 10:30:00+00	2025-10-18 11:30:00+00	t	\N	\N
85d615c4-ee3f-4b12-81dc-7aa2209e6263	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-18 11:30:00+00	2025-10-18 12:30:00+00	t	\N	\N
85f51fd6-bdba-4000-9beb-345a6f21cb96	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-18 12:30:00+00	2025-10-18 13:30:00+00	t	\N	\N
d23816fe-9820-4e91-9a44-80d169c70015	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-18 13:30:00+00	2025-10-18 14:30:00+00	t	\N	\N
a68be27e-b7f6-4e88-a3a1-ca40020f4b6a	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-18 14:30:00+00	2025-10-18 15:30:00+00	t	\N	\N
1269398d-9321-4ea4-9313-ffe98dd15867	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-19 03:30:00+00	2025-10-19 04:30:00+00	t	\N	\N
2248bd3d-5c97-4f38-993c-8b5a739f8350	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-19 04:30:00+00	2025-10-19 05:30:00+00	t	\N	\N
cbfbfca3-ba11-4fc8-83aa-4a55f2ea4b5a	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-19 05:30:00+00	2025-10-19 06:30:00+00	t	\N	\N
ddf6d8ab-a379-4d10-aa32-7630e631e50e	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-19 06:30:00+00	2025-10-19 07:30:00+00	t	\N	\N
22133cb5-d6d3-4283-b917-197e2e2ceb6c	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-19 07:30:00+00	2025-10-19 08:30:00+00	t	\N	\N
fad04bbf-04bb-4952-8bc1-00c6b9486c22	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-12 14:30:00+00	2025-10-12 15:30:00+00	f	\N	\N
a469ffed-4185-461f-94fd-16d07035859b	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-14 14:30:00+00	2025-10-14 15:30:00+00	f	\N	\N
662052ed-4b30-4bbc-b118-1953fcbc1413	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-14 13:30:00+00	2025-10-14 14:30:00+00	t	\N	\N
a00efcac-980c-49e7-88c9-2943636fcebc	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-19 08:30:00+00	2025-10-19 09:30:00+00	t	\N	\N
9d21bd11-9220-45aa-bdae-5af83ebfca9c	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-19 09:30:00+00	2025-10-19 10:30:00+00	t	\N	\N
90ccd593-1093-45de-af0a-876bda2e0233	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-19 10:30:00+00	2025-10-19 11:30:00+00	t	\N	\N
7cd2dda7-435a-4a89-a95a-3f109b733544	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-19 11:30:00+00	2025-10-19 12:30:00+00	t	\N	\N
5436504d-a6b4-4830-876f-6d315ff38f09	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-19 12:30:00+00	2025-10-19 13:30:00+00	t	\N	\N
b74fa337-21bf-4224-b551-697cf1c702db	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-19 13:30:00+00	2025-10-19 14:30:00+00	t	\N	\N
324eb462-80ba-41fd-90e4-330c52a81ae8	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-19 14:30:00+00	2025-10-19 15:30:00+00	t	\N	\N
f865a58f-6566-4083-9254-2959910dd9d7	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-12 03:30:00+00	2025-10-12 04:30:00+00	t	\N	\N
88b757ac-f4fd-4ba2-9d05-9c926e2533b8	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-12 04:30:00+00	2025-10-12 05:30:00+00	t	\N	\N
f3df872e-967c-4d97-bbd2-8c203dba64f7	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-12 05:30:00+00	2025-10-12 06:30:00+00	t	\N	\N
3e784bf6-cca0-4378-88da-1b35778011ad	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-12 06:30:00+00	2025-10-12 07:30:00+00	t	\N	\N
93f6d221-9e5c-4747-a0cc-99f7cd6a4d2d	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-12 07:30:00+00	2025-10-12 08:30:00+00	t	\N	\N
494c2555-741a-4975-b708-c9507e13c7f4	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-12 08:30:00+00	2025-10-12 09:30:00+00	t	\N	\N
9113f537-f2b6-42aa-b7ad-ece18cd3221c	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-12 09:30:00+00	2025-10-12 10:30:00+00	t	\N	\N
0a1136de-029f-419b-9e75-f9ed8020c883	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-12 10:30:00+00	2025-10-12 11:30:00+00	t	\N	\N
9ec04712-f97b-489b-972b-bf9d52dd7179	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-12 11:30:00+00	2025-10-12 12:30:00+00	t	\N	\N
7ce3b7d6-3e69-441c-aaf4-e1e5212e11e5	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-12 12:30:00+00	2025-10-12 13:30:00+00	t	\N	\N
68f805f6-db7f-4818-8019-bd5749fddb1e	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-12 13:30:00+00	2025-10-12 14:30:00+00	t	\N	\N
ef9dff7c-b878-467b-8702-0a1a79968fb2	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-12 14:30:00+00	2025-10-12 15:30:00+00	t	\N	\N
4966e90f-2cf2-4dbd-9205-e31f75dddd34	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-13 03:30:00+00	2025-10-13 04:30:00+00	t	\N	\N
bae9a55c-1bce-4b46-bb00-6c109385ae12	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-13 04:30:00+00	2025-10-13 05:30:00+00	t	\N	\N
a697f762-12c4-467b-a27b-9473a7c6636d	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-13 05:30:00+00	2025-10-13 06:30:00+00	t	\N	\N
a28db73e-3f83-4e7e-bcd0-544547daef7f	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-13 06:30:00+00	2025-10-13 07:30:00+00	t	\N	\N
0725f945-fc9f-46e2-b6bf-d541ce384571	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-13 07:30:00+00	2025-10-13 08:30:00+00	t	\N	\N
77c5ae45-7340-44fc-a341-0e57d5e9c849	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-13 08:30:00+00	2025-10-13 09:30:00+00	t	\N	\N
4d48d80e-a4d2-4041-808c-714b31a97138	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-13 09:30:00+00	2025-10-13 10:30:00+00	t	\N	\N
c9040979-6296-4296-947e-f22c6f9bac82	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-13 10:30:00+00	2025-10-13 11:30:00+00	t	\N	\N
12da81ae-f1c2-4833-9b28-6eb61a9a5abf	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-13 11:30:00+00	2025-10-13 12:30:00+00	t	\N	\N
819d0496-106e-48cb-b766-67fd72c587ee	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-13 12:30:00+00	2025-10-13 13:30:00+00	t	\N	\N
29233831-9041-453f-8357-487c6deddb64	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-13 13:30:00+00	2025-10-13 14:30:00+00	t	\N	\N
71caca02-c777-4023-b937-64eea819a860	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-13 14:30:00+00	2025-10-13 15:30:00+00	t	\N	\N
467fb9b1-05be-4ebd-8c0d-97db64736550	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-14 03:30:00+00	2025-10-14 04:30:00+00	t	\N	\N
563b02a5-47fa-4a31-8680-55156e789545	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-14 04:30:00+00	2025-10-14 05:30:00+00	t	\N	\N
659685b1-e649-41dc-8618-b327457d21c2	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-14 05:30:00+00	2025-10-14 06:30:00+00	t	\N	\N
b2bd625e-b993-4c27-b255-e62be29812a4	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-14 06:30:00+00	2025-10-14 07:30:00+00	t	\N	\N
02163204-2edf-401a-a251-1683268e4d24	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-14 07:30:00+00	2025-10-14 08:30:00+00	t	\N	\N
34a077e2-06b7-4eeb-9bd3-234b99694086	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-14 08:30:00+00	2025-10-14 09:30:00+00	t	\N	\N
4dd5038c-a154-4f66-829e-183658c84928	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-14 09:30:00+00	2025-10-14 10:30:00+00	t	\N	\N
327c18ad-0080-4153-a406-7ea04bf1c0ee	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-14 10:30:00+00	2025-10-14 11:30:00+00	t	\N	\N
dd2dc186-42af-4dcb-b42f-82c06bd9f883	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-14 11:30:00+00	2025-10-14 12:30:00+00	t	\N	\N
1529422c-bea4-413f-9212-5a3742c6c1d6	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-14 12:30:00+00	2025-10-14 13:30:00+00	t	\N	\N
75e1e71b-f1e9-41c3-ae38-51a5c2dcc639	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-14 13:30:00+00	2025-10-14 14:30:00+00	t	\N	\N
432e59f6-2d65-4011-bfc4-ff0921708eb3	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-14 14:30:00+00	2025-10-14 15:30:00+00	t	\N	\N
cd24a43a-fbec-4236-b837-994646514929	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-15 03:30:00+00	2025-10-15 04:30:00+00	t	\N	\N
b0e8b64b-8c71-4784-91b7-5740a004e13a	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-15 04:30:00+00	2025-10-15 05:30:00+00	t	\N	\N
01f1b9e1-488a-409c-8a40-2deca5feb608	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-15 05:30:00+00	2025-10-15 06:30:00+00	t	\N	\N
fb62b22a-b0a2-4c85-a16e-a133a552f195	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-15 06:30:00+00	2025-10-15 07:30:00+00	t	\N	\N
9c1dc28c-1bf1-4e00-8108-58fee3c05789	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-15 07:30:00+00	2025-10-15 08:30:00+00	t	\N	\N
d0223d97-46ef-4986-a9fd-6e331c2fb981	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-15 08:30:00+00	2025-10-15 09:30:00+00	t	\N	\N
c1e2327e-2acc-4e74-a673-e8bf4542fc06	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-15 09:30:00+00	2025-10-15 10:30:00+00	t	\N	\N
7ba51ad2-bafc-436f-aaa2-a614533bba97	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-15 10:30:00+00	2025-10-15 11:30:00+00	t	\N	\N
358330df-a272-44d0-a366-2df2a0203ddc	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-15 11:30:00+00	2025-10-15 12:30:00+00	t	\N	\N
5bbffd43-8606-4c12-a701-94679bc69d49	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-15 12:30:00+00	2025-10-15 13:30:00+00	t	\N	\N
b24413ac-6d9c-4bdf-9e68-9c734234358c	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-15 13:30:00+00	2025-10-15 14:30:00+00	t	\N	\N
d41a42cf-b2d0-401b-9abd-d5e5229f10fd	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-15 14:30:00+00	2025-10-15 15:30:00+00	t	\N	\N
757add12-1d12-4008-9fe1-1fdbcaad27c3	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-16 03:30:00+00	2025-10-16 04:30:00+00	t	\N	\N
9156b571-bf03-4145-9b50-6bfb9eb492cb	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-16 04:30:00+00	2025-10-16 05:30:00+00	t	\N	\N
303c8ef4-c00d-4834-8171-226758b6c388	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-16 05:30:00+00	2025-10-16 06:30:00+00	t	\N	\N
fca309c3-4e8a-46ea-ba1d-75898bc90a26	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-16 06:30:00+00	2025-10-16 07:30:00+00	t	\N	\N
a0a01531-be98-4b4f-9f1c-8dd6e367f4f5	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-16 07:30:00+00	2025-10-16 08:30:00+00	t	\N	\N
ff218c07-1f14-41fc-8e7c-14567666290a	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-16 08:30:00+00	2025-10-16 09:30:00+00	t	\N	\N
5c338327-86ba-4ea9-a061-015030c788fc	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-16 09:30:00+00	2025-10-16 10:30:00+00	t	\N	\N
1f1e80ab-f95b-4fe8-8d1a-d77e2eca2177	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-16 10:30:00+00	2025-10-16 11:30:00+00	t	\N	\N
92c4d650-ebf1-4cc4-ab1e-10a3285eaf05	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-16 11:30:00+00	2025-10-16 12:30:00+00	t	\N	\N
fde5823a-3d73-4bbe-9b50-8d00c6c4485e	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-16 12:30:00+00	2025-10-16 13:30:00+00	t	\N	\N
a34c37b1-3cfe-4e88-8fa5-6ffa435eb69e	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-16 13:30:00+00	2025-10-16 14:30:00+00	t	\N	\N
9c61cdf4-115c-4491-866d-903abd25171e	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-16 14:30:00+00	2025-10-16 15:30:00+00	t	\N	\N
083069f7-567d-4925-8065-e5dbf59b8fd1	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-17 03:30:00+00	2025-10-17 04:30:00+00	t	\N	\N
d51a78a5-cd2c-49ba-994e-ebd3be936b78	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-17 04:30:00+00	2025-10-17 05:30:00+00	t	\N	\N
4093e32e-ac0d-46bc-9624-15e2f22a879f	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-17 05:30:00+00	2025-10-17 06:30:00+00	t	\N	\N
f74e9ff8-b524-40dc-8d99-352c194cd0ac	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-17 06:30:00+00	2025-10-17 07:30:00+00	t	\N	\N
0b28b397-323a-4b1f-b206-bdc2efeb68f3	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-17 07:30:00+00	2025-10-17 08:30:00+00	t	\N	\N
583f1da7-a2f2-4c0b-b136-4b241a4ae0b3	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-17 08:30:00+00	2025-10-17 09:30:00+00	t	\N	\N
f8efe4b5-1e43-4154-88f6-f6de44798ab5	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-17 09:30:00+00	2025-10-17 10:30:00+00	t	\N	\N
6bb5832b-6ea8-4bc3-a5f9-25b1be1eee92	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-17 10:30:00+00	2025-10-17 11:30:00+00	t	\N	\N
8bbd7cab-8c40-41dd-bf4f-453058a2c897	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-17 11:30:00+00	2025-10-17 12:30:00+00	t	\N	\N
7eb6c8a1-dc29-49f3-9cde-43ff0d5a901a	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-17 12:30:00+00	2025-10-17 13:30:00+00	t	\N	\N
4416f46c-a0d3-437e-a8d2-49983a048d61	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-17 13:30:00+00	2025-10-17 14:30:00+00	t	\N	\N
33bb9ab5-f39e-431a-b04b-f38124ab4523	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-17 14:30:00+00	2025-10-17 15:30:00+00	t	\N	\N
c281c4f3-b4fb-48c3-a052-b399b8716f6d	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-18 03:30:00+00	2025-10-18 04:30:00+00	t	\N	\N
0d7666b1-f4a8-4aca-bc6f-da3bcb4faab7	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-18 04:30:00+00	2025-10-18 05:30:00+00	t	\N	\N
99a320d0-7d9c-4689-9536-18023e0e7679	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-18 05:30:00+00	2025-10-18 06:30:00+00	t	\N	\N
1c83df79-3201-4fd3-bb44-2c363c5da629	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-18 06:30:00+00	2025-10-18 07:30:00+00	t	\N	\N
e6368f9d-9a3d-45e3-8915-7dcf1b293cc0	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-18 07:30:00+00	2025-10-18 08:30:00+00	t	\N	\N
f956b39f-e7b4-4a0a-b64d-8e8f9355226a	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-18 08:30:00+00	2025-10-18 09:30:00+00	t	\N	\N
a334df0a-4dcc-40df-929c-015e5010372d	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-18 09:30:00+00	2025-10-18 10:30:00+00	t	\N	\N
2d4a01ce-6a81-4cd2-b660-2489d5bc002a	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-18 10:30:00+00	2025-10-18 11:30:00+00	t	\N	\N
c1eb166d-7c9c-492c-abae-843976e17929	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-18 11:30:00+00	2025-10-18 12:30:00+00	t	\N	\N
0244589f-f756-4884-89d5-a96425058b52	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-18 12:30:00+00	2025-10-18 13:30:00+00	t	\N	\N
653b63ea-9f53-4d06-9df8-2c3518023d47	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-18 13:30:00+00	2025-10-18 14:30:00+00	t	\N	\N
d59816af-d6c0-4ebf-9720-1f9eabdd6b61	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-18 14:30:00+00	2025-10-18 15:30:00+00	t	\N	\N
58a0f0e3-40a3-4aa2-8dab-1064eb9951e0	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-19 03:30:00+00	2025-10-19 04:30:00+00	t	\N	\N
a01e8369-6775-4e6e-ae2c-4f8b703870db	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-19 04:30:00+00	2025-10-19 05:30:00+00	t	\N	\N
282dea07-e804-4482-ac26-70d9c9cb8b47	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-19 05:30:00+00	2025-10-19 06:30:00+00	t	\N	\N
f838c1d5-3e8f-4bd6-aaf6-353b12f02a3e	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-19 06:30:00+00	2025-10-19 07:30:00+00	t	\N	\N
4bff4e86-f9cf-4130-ba5f-9e8fdb7878a7	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-19 07:30:00+00	2025-10-19 08:30:00+00	t	\N	\N
bb04a817-d3e4-4915-b565-df4fefc6e76e	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-19 08:30:00+00	2025-10-19 09:30:00+00	t	\N	\N
817bc835-69db-43a9-b989-0c42df2b55fe	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-19 09:30:00+00	2025-10-19 10:30:00+00	t	\N	\N
4ac7cec1-15e8-4b57-80ad-6eacef61a11e	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-19 10:30:00+00	2025-10-19 11:30:00+00	t	\N	\N
69660f25-ebf0-4c85-a291-0cd9472d08a0	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-19 11:30:00+00	2025-10-19 12:30:00+00	t	\N	\N
92087bc5-a170-44e5-9a78-d789ebc8ea3c	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-19 12:30:00+00	2025-10-19 13:30:00+00	t	\N	\N
e0d3c3e8-a25a-4bae-8db1-5d4ccdcc4796	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-19 13:30:00+00	2025-10-19 14:30:00+00	t	\N	\N
ebe95a38-111a-42a3-b8a5-a4c7f0cef2ee	fb028c96-667c-4fd0-be9f-ffbfb413c8cd	2025-10-19 14:30:00+00	2025-10-19 15:30:00+00	t	\N	\N
b2215c68-1e94-485a-bc67-a5a03582650b	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-12 03:30:00+00	2025-10-12 04:30:00+00	t	\N	\N
3091b252-53ef-496b-9e02-a5591f2f9e1e	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-12 04:30:00+00	2025-10-12 05:30:00+00	t	\N	\N
f9c41e56-fce7-4587-834e-c75ef67dde99	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-12 05:30:00+00	2025-10-12 06:30:00+00	t	\N	\N
4b929a9f-03d7-4679-9110-31c3bed7b853	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-12 06:30:00+00	2025-10-12 07:30:00+00	t	\N	\N
ae08cbc0-426b-4c10-a5c7-edb1310a79d2	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-12 07:30:00+00	2025-10-12 08:30:00+00	t	\N	\N
58abcbd6-8c3b-4612-9ae6-6988450cbbc2	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-12 08:30:00+00	2025-10-12 09:30:00+00	t	\N	\N
492c0e5d-9942-4f55-b603-693f4bcfd5d8	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-12 09:30:00+00	2025-10-12 10:30:00+00	t	\N	\N
fbefca39-b740-4202-9a7a-a956b19f215a	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-12 10:30:00+00	2025-10-12 11:30:00+00	t	\N	\N
6872a87c-5bdf-4707-87ef-528ec804f359	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-12 11:30:00+00	2025-10-12 12:30:00+00	t	\N	\N
c9ff1ffd-fe41-48eb-8ee8-51520532610e	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-12 12:30:00+00	2025-10-12 13:30:00+00	t	\N	\N
12315988-8460-4b34-8938-cf4424f65cdb	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-12 13:30:00+00	2025-10-12 14:30:00+00	t	\N	\N
7811cf02-04f0-4adc-85da-342f1091c57a	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-12 14:30:00+00	2025-10-12 15:30:00+00	t	\N	\N
6cbc4deb-b82f-49f8-97dd-4fbcbdc5e492	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-13 03:30:00+00	2025-10-13 04:30:00+00	t	\N	\N
28446810-4ed6-4504-bdba-07a78b40eac2	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-13 04:30:00+00	2025-10-13 05:30:00+00	t	\N	\N
101ec329-94dc-4e1c-985c-6c7c42c8e7f6	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-13 05:30:00+00	2025-10-13 06:30:00+00	t	\N	\N
ad78efd3-4ee4-40ac-bc0a-d0bdc1ff8da1	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-13 06:30:00+00	2025-10-13 07:30:00+00	t	\N	\N
b51d6457-2281-43f5-8577-e6572ec123dd	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-13 07:30:00+00	2025-10-13 08:30:00+00	t	\N	\N
f3f0a981-87e2-4412-ae3d-251573d0947d	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-13 08:30:00+00	2025-10-13 09:30:00+00	t	\N	\N
675a476a-1241-4779-932f-46b2109eab25	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-13 09:30:00+00	2025-10-13 10:30:00+00	t	\N	\N
bb56687c-f479-4846-b64e-2f7d90c55ea5	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-13 10:30:00+00	2025-10-13 11:30:00+00	t	\N	\N
f3a8c770-fccc-4a1c-9dc7-d5d5a1c3989d	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-13 11:30:00+00	2025-10-13 12:30:00+00	t	\N	\N
131826f2-f089-4694-8aff-67e0c47a8532	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-13 12:30:00+00	2025-10-13 13:30:00+00	t	\N	\N
4a0f6331-40ca-41fe-bea9-67167d55e9f6	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-13 13:30:00+00	2025-10-13 14:30:00+00	t	\N	\N
2bcbf345-d4b5-4f8e-b25e-a887f302bca0	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-13 14:30:00+00	2025-10-13 15:30:00+00	t	\N	\N
606eec9a-afed-41f2-b4e7-7a795e64c3a4	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-14 03:30:00+00	2025-10-14 04:30:00+00	t	\N	\N
4102be21-b67c-4f24-b594-76a0d5651794	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-14 04:30:00+00	2025-10-14 05:30:00+00	t	\N	\N
579ca7fc-d6b7-4635-8a5f-bb1c8496572d	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-14 05:30:00+00	2025-10-14 06:30:00+00	t	\N	\N
774c1c51-9faf-4216-af9d-e566235b613f	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-14 06:30:00+00	2025-10-14 07:30:00+00	t	\N	\N
beb99ecc-ae61-4325-8892-e14cec683ea1	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-14 07:30:00+00	2025-10-14 08:30:00+00	t	\N	\N
193296bf-8e8b-4315-8989-0acf49634999	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-14 08:30:00+00	2025-10-14 09:30:00+00	t	\N	\N
4d9e7f4a-d9b4-4551-b817-ad6c3b0e0219	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-14 09:30:00+00	2025-10-14 10:30:00+00	t	\N	\N
ba4b9cf4-d21b-4ae0-bc46-b39c82f4e6f3	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-14 10:30:00+00	2025-10-14 11:30:00+00	t	\N	\N
d31286a2-eae1-4449-ae27-dad828cce8e6	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-14 11:30:00+00	2025-10-14 12:30:00+00	t	\N	\N
f4394ebe-cdb4-4d04-b692-1dfdcbbd263a	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-14 12:30:00+00	2025-10-14 13:30:00+00	t	\N	\N
f2aad867-fee0-40e8-ad5e-0a276e81c892	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-14 13:30:00+00	2025-10-14 14:30:00+00	t	\N	\N
bdc6bad3-146b-47f6-b186-2bd930b00109	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-14 14:30:00+00	2025-10-14 15:30:00+00	t	\N	\N
b38f8e12-893a-4763-bf57-1bf131836eaf	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-15 03:30:00+00	2025-10-15 04:30:00+00	t	\N	\N
93abd968-8033-4537-b673-eefff54397c7	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-15 04:30:00+00	2025-10-15 05:30:00+00	t	\N	\N
e4b067c2-0973-4ac4-9a42-3107050bd747	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-15 05:30:00+00	2025-10-15 06:30:00+00	t	\N	\N
e258258b-22fd-48a0-9e34-b649f79af227	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-15 06:30:00+00	2025-10-15 07:30:00+00	t	\N	\N
299a7f25-0b2f-41e5-8627-18f3ed1cf05e	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-15 07:30:00+00	2025-10-15 08:30:00+00	t	\N	\N
37e38efb-386d-4ae2-b34f-cce6d46acca2	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-15 08:30:00+00	2025-10-15 09:30:00+00	t	\N	\N
7fd2affd-d0f3-446d-8b90-c824f46eb20b	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-15 09:30:00+00	2025-10-15 10:30:00+00	t	\N	\N
9175e5a3-207d-43cd-80e9-f90c5dec24c2	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-15 10:30:00+00	2025-10-15 11:30:00+00	t	\N	\N
c638fe3a-27cc-408a-87cb-7eb7b265c8f8	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-15 11:30:00+00	2025-10-15 12:30:00+00	t	\N	\N
3ecd6789-ea71-4447-bb29-49b562aadba4	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-15 12:30:00+00	2025-10-15 13:30:00+00	t	\N	\N
d30dd877-1970-40bb-a8d7-a8b3037cfcb5	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-15 13:30:00+00	2025-10-15 14:30:00+00	t	\N	\N
6f8444a2-985e-4039-a9e2-9b5074ba3161	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-15 14:30:00+00	2025-10-15 15:30:00+00	t	\N	\N
88afd30d-49d3-468c-b687-e9a51d52ff3e	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-16 03:30:00+00	2025-10-16 04:30:00+00	t	\N	\N
ef45ff54-5bb3-4c48-9ddd-2f5cca58ff18	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-16 04:30:00+00	2025-10-16 05:30:00+00	t	\N	\N
26f079c4-7ae2-4a5b-9aa9-14d3a76a93b3	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-16 05:30:00+00	2025-10-16 06:30:00+00	t	\N	\N
26de9954-6516-46c5-b06f-fdc9b245015c	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-16 06:30:00+00	2025-10-16 07:30:00+00	t	\N	\N
8516ba00-4667-4321-9f32-ab5c2ec5ffae	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-16 07:30:00+00	2025-10-16 08:30:00+00	t	\N	\N
5ef8281c-18cc-4776-be1a-24f0bf2f4a6c	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-16 08:30:00+00	2025-10-16 09:30:00+00	t	\N	\N
4faf49a2-7e6d-43f5-885d-03107b50f8ff	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-16 09:30:00+00	2025-10-16 10:30:00+00	t	\N	\N
ebd0bc0d-73f6-47bf-9142-ed4c91e285b0	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-16 10:30:00+00	2025-10-16 11:30:00+00	t	\N	\N
d2f2fcde-35ef-4ea5-a4c2-42913d0509e4	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-16 11:30:00+00	2025-10-16 12:30:00+00	t	\N	\N
c08af30c-1fb6-4ed8-b7ac-936941b56edb	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-16 12:30:00+00	2025-10-16 13:30:00+00	t	\N	\N
5ec591c4-9778-4f53-b3d3-c493a891b078	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-16 13:30:00+00	2025-10-16 14:30:00+00	t	\N	\N
38883b4c-fa2c-46bb-8cb4-39a830e62739	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-16 14:30:00+00	2025-10-16 15:30:00+00	t	\N	\N
078008bd-3556-4f85-910d-72360df1d61d	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-17 03:30:00+00	2025-10-17 04:30:00+00	t	\N	\N
7345d463-864c-452e-82d1-9bdbb932cb77	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-17 04:30:00+00	2025-10-17 05:30:00+00	t	\N	\N
012a9868-30cf-4172-a78c-2bf895d8505f	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-17 05:30:00+00	2025-10-17 06:30:00+00	t	\N	\N
36291b54-f27e-43ce-97a0-01dd0376ec35	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-17 06:30:00+00	2025-10-17 07:30:00+00	t	\N	\N
ecc60133-b5e0-4f7b-a345-d4b67fab95e6	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-17 07:30:00+00	2025-10-17 08:30:00+00	t	\N	\N
ef61760b-5aa9-483c-9359-2fa498cc640a	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-17 08:30:00+00	2025-10-17 09:30:00+00	t	\N	\N
964af4c1-5288-4cdc-a116-fe21fb91e66e	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-17 09:30:00+00	2025-10-17 10:30:00+00	t	\N	\N
fb0b021f-c9a8-4ce2-8f1b-560f94e79817	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-17 10:30:00+00	2025-10-17 11:30:00+00	t	\N	\N
6ccfb76e-713b-42f7-840e-a6c5d8282880	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-17 11:30:00+00	2025-10-17 12:30:00+00	t	\N	\N
8cce526e-5595-4400-9ac3-dffe9c6b560a	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-17 12:30:00+00	2025-10-17 13:30:00+00	t	\N	\N
09f6015f-6ed8-4c94-979e-87eb79247c35	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-17 13:30:00+00	2025-10-17 14:30:00+00	t	\N	\N
d5bf8b9b-c870-491f-bfca-e193068b79eb	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-17 14:30:00+00	2025-10-17 15:30:00+00	t	\N	\N
2c03b61c-ece5-4c4c-8382-2a0665c2cb1a	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-18 03:30:00+00	2025-10-18 04:30:00+00	t	\N	\N
bd9bed83-ba9e-47f6-acae-437bebd9c084	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-18 04:30:00+00	2025-10-18 05:30:00+00	t	\N	\N
525f1ed5-3267-4d34-8b48-f2b8e51f4547	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-18 05:30:00+00	2025-10-18 06:30:00+00	t	\N	\N
e53b7e9b-ebd8-4ff7-b2de-f330bc4b19bf	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-18 06:30:00+00	2025-10-18 07:30:00+00	t	\N	\N
98ed5501-73b2-4961-a135-60c04514865a	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-18 07:30:00+00	2025-10-18 08:30:00+00	t	\N	\N
b3a9e791-0e35-4138-95f6-d70c21e7aed2	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-18 08:30:00+00	2025-10-18 09:30:00+00	t	\N	\N
77d152ab-af9f-4b68-aea8-673b143d1db3	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-18 09:30:00+00	2025-10-18 10:30:00+00	t	\N	\N
bbaffd71-b935-457a-99ef-529401201fc9	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-18 10:30:00+00	2025-10-18 11:30:00+00	t	\N	\N
39601301-0c77-4a11-929f-c2fbfe114c0d	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-18 11:30:00+00	2025-10-18 12:30:00+00	t	\N	\N
649564cc-95dc-4fb9-b984-73a3a6f9b365	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-18 12:30:00+00	2025-10-18 13:30:00+00	t	\N	\N
cf19a8e0-db2b-4095-a49e-bb110786eca5	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-18 13:30:00+00	2025-10-18 14:30:00+00	t	\N	\N
6b451937-4fa6-40e7-8f3b-202444e21a0d	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-18 14:30:00+00	2025-10-18 15:30:00+00	t	\N	\N
da31abc8-22a2-4461-8b0b-c233222f188b	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-19 03:30:00+00	2025-10-19 04:30:00+00	t	\N	\N
a3956d85-dc97-4112-8b4d-40afae1ce87e	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-19 04:30:00+00	2025-10-19 05:30:00+00	t	\N	\N
73e32809-c186-4afd-876b-de354a8106ed	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-19 05:30:00+00	2025-10-19 06:30:00+00	t	\N	\N
3431ebab-ae84-453c-87c6-ca47f87cd5be	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-19 06:30:00+00	2025-10-19 07:30:00+00	t	\N	\N
dfae9a9d-3ec9-41aa-a938-00259bb6ec2d	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-19 07:30:00+00	2025-10-19 08:30:00+00	t	\N	\N
a617dbaa-6de1-4bd4-8e74-b8932e51c2c8	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-19 08:30:00+00	2025-10-19 09:30:00+00	t	\N	\N
4e693969-4b51-4a51-b621-faa60dd4cf70	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-19 09:30:00+00	2025-10-19 10:30:00+00	t	\N	\N
665adc2f-73b0-4f2e-8924-8ea332b4fbe0	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-19 10:30:00+00	2025-10-19 11:30:00+00	t	\N	\N
5cfdf787-7ae7-429a-916f-a12996c83df1	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-19 11:30:00+00	2025-10-19 12:30:00+00	t	\N	\N
f0a68b5e-7566-4baa-87ec-4026af43b0ed	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-19 12:30:00+00	2025-10-19 13:30:00+00	t	\N	\N
dd3151f0-0c21-44e0-a8e8-a62de6d5d3f2	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-19 13:30:00+00	2025-10-19 14:30:00+00	t	\N	\N
2c6a149b-6e2b-4d1e-98f7-f72a260ccd2a	ab9fba0e-c266-41e7-9327-2a2dcdd2f5e9	2025-10-19 14:30:00+00	2025-10-19 15:30:00+00	t	\N	\N
75ecf729-5179-4dd0-bd72-08df1b29da72	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-12 03:30:00+00	2025-10-12 04:30:00+00	t	\N	\N
93d43391-d851-4957-bca6-b9ec8ea640d9	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-12 04:30:00+00	2025-10-12 05:30:00+00	t	\N	\N
4389b1ef-6648-486b-919b-f605c7694831	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-12 05:30:00+00	2025-10-12 06:30:00+00	t	\N	\N
3341b748-10fb-46f3-985c-b499688a4c1a	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-12 06:30:00+00	2025-10-12 07:30:00+00	t	\N	\N
42ad9503-2528-4ab7-a487-1920aadf268d	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-12 07:30:00+00	2025-10-12 08:30:00+00	t	\N	\N
f9ceb99e-63e7-4b1c-ae8d-fe24e2574f19	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-12 08:30:00+00	2025-10-12 09:30:00+00	t	\N	\N
33d83ae0-649f-454b-9327-217ea6f6b419	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-12 09:30:00+00	2025-10-12 10:30:00+00	t	\N	\N
bdca4f93-e9a6-47c2-9b77-e42c54960c0e	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-12 10:30:00+00	2025-10-12 11:30:00+00	t	\N	\N
911a4fde-4f29-4410-8f3d-4c27cb367528	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-12 11:30:00+00	2025-10-12 12:30:00+00	t	\N	\N
c7d2c696-6382-4b99-881e-0a340ddf093b	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-12 12:30:00+00	2025-10-12 13:30:00+00	t	\N	\N
926226e6-951f-443d-b717-edfe4a05a245	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-13 04:30:00+00	2025-10-13 05:30:00+00	t	\N	\N
f758e4de-7ab0-4ae3-8593-dde7b801f3b1	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-13 05:30:00+00	2025-10-13 06:30:00+00	t	\N	\N
79a61ef9-b5da-4a32-a2f0-e888889c16c5	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-13 06:30:00+00	2025-10-13 07:30:00+00	t	\N	\N
1c24884a-8d32-4a3d-b20c-faaa402826eb	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-13 07:30:00+00	2025-10-13 08:30:00+00	t	\N	\N
7820e59b-6e07-49b9-a693-cea4c3e84759	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-13 08:30:00+00	2025-10-13 09:30:00+00	t	\N	\N
c86546c5-e8ab-4159-bbb8-e80d96679688	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-13 09:30:00+00	2025-10-13 10:30:00+00	t	\N	\N
6d41d91f-01fe-453e-bb97-19e10f3d1fa2	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-13 10:30:00+00	2025-10-13 11:30:00+00	t	\N	\N
681a0bd3-930d-43f5-b5c8-1d23ab72a4a0	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-13 11:30:00+00	2025-10-13 12:30:00+00	t	\N	\N
740ef99b-e14b-4946-b2b3-d9c858924a0d	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-13 12:30:00+00	2025-10-13 13:30:00+00	t	\N	\N
2ecd6b30-3668-47da-be05-bf36c86e39a7	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-13 13:30:00+00	2025-10-13 14:30:00+00	t	\N	\N
4ce39c7f-288c-4ad2-8818-18cec02ccc4e	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-14 03:30:00+00	2025-10-14 04:30:00+00	t	\N	\N
ce42065b-68d7-448c-9d39-77e9101c663b	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-14 04:30:00+00	2025-10-14 05:30:00+00	t	\N	\N
445f7af8-b849-4301-a4f1-041b60c4086a	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-14 05:30:00+00	2025-10-14 06:30:00+00	t	\N	\N
140d1b74-6d55-416e-9b29-04079c68470d	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-14 06:30:00+00	2025-10-14 07:30:00+00	t	\N	\N
0ab57d39-cbaa-4218-ade1-58dd9bcb8c24	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-14 07:30:00+00	2025-10-14 08:30:00+00	t	\N	\N
f4eb258d-b8bd-43f3-a593-cb7b175d6830	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-14 08:30:00+00	2025-10-14 09:30:00+00	t	\N	\N
83d625d6-02d8-4db0-af63-650a116c1b6a	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-14 09:30:00+00	2025-10-14 10:30:00+00	t	\N	\N
7ad9778c-2625-4c55-9ea2-a1da3df10ebf	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-14 10:30:00+00	2025-10-14 11:30:00+00	t	\N	\N
42660fd4-2db6-403c-9062-09ecf100d3b0	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-14 11:30:00+00	2025-10-14 12:30:00+00	t	\N	\N
d28a8ce0-e8a5-4ea2-a5d2-b1137fe63376	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-14 12:30:00+00	2025-10-14 13:30:00+00	t	\N	\N
0b5e6aa7-da7c-46ad-8800-31a90549d69b	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-14 13:30:00+00	2025-10-14 14:30:00+00	t	\N	\N
093e282d-a49a-448e-a1c1-106a73baac96	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-15 03:30:00+00	2025-10-15 04:30:00+00	t	\N	\N
a86ce486-0a2d-4247-aa83-c42750f482ad	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-15 04:30:00+00	2025-10-15 05:30:00+00	t	\N	\N
f864eec2-7e38-45f0-8fd9-b7c6b4ccd4e0	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-15 05:30:00+00	2025-10-15 06:30:00+00	t	\N	\N
126741c3-5ec3-4094-861e-6ccb5d2bd7de	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-15 06:30:00+00	2025-10-15 07:30:00+00	t	\N	\N
68fd360d-a2a2-4d7d-805b-f1b966126908	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-15 07:30:00+00	2025-10-15 08:30:00+00	t	\N	\N
728de6e4-d9ff-4590-9ed9-50f161021066	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-15 08:30:00+00	2025-10-15 09:30:00+00	t	\N	\N
eb5821ea-2448-4491-ad4a-8b7dafcc49ea	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-15 09:30:00+00	2025-10-15 10:30:00+00	t	\N	\N
94921023-5568-45bb-a29f-94e54c72c868	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-15 10:30:00+00	2025-10-15 11:30:00+00	t	\N	\N
0c7289c0-30ea-4deb-990e-61b41dd0482f	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-15 11:30:00+00	2025-10-15 12:30:00+00	t	\N	\N
6381abcf-9591-469d-be59-1434c78dcf13	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-15 12:30:00+00	2025-10-15 13:30:00+00	t	\N	\N
89626e2d-d4b5-4f36-bc11-a99c8d03b73b	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-15 13:30:00+00	2025-10-15 14:30:00+00	t	\N	\N
0b464153-3edd-4dad-8a48-b72638a15c0d	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-15 14:30:00+00	2025-10-15 15:30:00+00	t	\N	\N
9a516fee-0bc5-4349-bf86-c1c74f53c766	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-16 03:30:00+00	2025-10-16 04:30:00+00	t	\N	\N
f668af2e-4058-4d0e-9c2a-090396310d5c	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-16 04:30:00+00	2025-10-16 05:30:00+00	t	\N	\N
3ef280e9-0b4b-4727-b9b8-92c88f249cef	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-16 05:30:00+00	2025-10-16 06:30:00+00	t	\N	\N
a13d7236-638e-44bd-8ea9-f191516b334b	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-16 06:30:00+00	2025-10-16 07:30:00+00	t	\N	\N
e0670d4a-4cd8-4a9d-a8f7-a6a4f127b5b5	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-16 07:30:00+00	2025-10-16 08:30:00+00	t	\N	\N
a9f0eade-1e60-4677-a4aa-b0fa6867269b	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-16 08:30:00+00	2025-10-16 09:30:00+00	t	\N	\N
f97ec961-4434-409c-b2ae-3c3f14032e72	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-16 09:30:00+00	2025-10-16 10:30:00+00	t	\N	\N
13340271-7acc-4bf5-b8bc-c25b185d064e	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-16 10:30:00+00	2025-10-16 11:30:00+00	t	\N	\N
0de6ef04-87c4-49c3-ad8c-ba17d21c969a	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-16 11:30:00+00	2025-10-16 12:30:00+00	t	\N	\N
16d40c7e-0a5f-41e3-9fc1-195ff08d9438	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-16 12:30:00+00	2025-10-16 13:30:00+00	t	\N	\N
6fb8822c-1586-47d1-9da5-5e654acf0db9	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-16 13:30:00+00	2025-10-16 14:30:00+00	t	\N	\N
656d6377-de6e-4d37-a375-37278bb7593b	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-16 14:30:00+00	2025-10-16 15:30:00+00	t	\N	\N
388df11b-b425-4192-a571-505a30efbdc9	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-17 03:30:00+00	2025-10-17 04:30:00+00	t	\N	\N
a35549c8-8727-4f32-9913-4e11e43f2e21	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-17 04:30:00+00	2025-10-17 05:30:00+00	t	\N	\N
17aad385-99e8-4015-bbee-00de1c4984cc	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-17 05:30:00+00	2025-10-17 06:30:00+00	t	\N	\N
a06c6b24-ef4b-465b-bd09-81d9d4cdfeb4	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-17 06:30:00+00	2025-10-17 07:30:00+00	t	\N	\N
3d8f0675-cbd6-442a-bf86-063d07315e29	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-17 07:30:00+00	2025-10-17 08:30:00+00	t	\N	\N
74c48f9e-552d-4eea-8344-035f5d984744	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-17 08:30:00+00	2025-10-17 09:30:00+00	t	\N	\N
30b9982b-9408-4349-81ec-f642b6d422a3	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-17 09:30:00+00	2025-10-17 10:30:00+00	t	\N	\N
1f2df6d5-6b6d-42d1-a4e7-d2cde34308e1	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-17 10:30:00+00	2025-10-17 11:30:00+00	t	\N	\N
96bbcc85-246e-40df-aade-a7b8908d743e	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-17 11:30:00+00	2025-10-17 12:30:00+00	t	\N	\N
21db23f7-e13d-4057-aa91-93c21ffa649c	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-17 12:30:00+00	2025-10-17 13:30:00+00	t	\N	\N
5724cbdb-a961-4e2b-ad69-72589368b369	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-17 13:30:00+00	2025-10-17 14:30:00+00	t	\N	\N
dc3228e9-e77a-4a08-adca-e9836a34c98c	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-17 14:30:00+00	2025-10-17 15:30:00+00	t	\N	\N
e7e66055-21db-4679-9b33-09698c190bab	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-18 03:30:00+00	2025-10-18 04:30:00+00	t	\N	\N
4f40ce2a-3122-4582-89ea-5ae6da5d6a34	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-18 04:30:00+00	2025-10-18 05:30:00+00	t	\N	\N
90ca925f-31e4-4480-90e3-9162ab9b19bb	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-18 05:30:00+00	2025-10-18 06:30:00+00	t	\N	\N
4344f99b-475f-4156-ad85-f67627551537	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-18 06:30:00+00	2025-10-18 07:30:00+00	t	\N	\N
c2cf200f-da71-4a0a-9b7e-37f7e5e625c2	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-18 07:30:00+00	2025-10-18 08:30:00+00	t	\N	\N
a7d94fff-d424-4944-a8f9-92f5e94b7358	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-18 08:30:00+00	2025-10-18 09:30:00+00	t	\N	\N
f206d5a0-baa7-4186-bed0-a83508b33ca0	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-18 09:30:00+00	2025-10-18 10:30:00+00	t	\N	\N
7b5992c4-7f40-49e9-9f5c-da008ae3b1ca	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-18 10:30:00+00	2025-10-18 11:30:00+00	t	\N	\N
342efbdf-ba7e-4d7e-ae9a-f06b9b3f4484	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-18 11:30:00+00	2025-10-18 12:30:00+00	t	\N	\N
001af226-b076-47bf-ad82-2c1e170a2292	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-18 12:30:00+00	2025-10-18 13:30:00+00	t	\N	\N
54a26227-a8b9-416e-bf0f-9ff22f79f11c	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-18 13:30:00+00	2025-10-18 14:30:00+00	t	\N	\N
5408d812-db87-4615-81dd-2fc389dcd51b	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-18 14:30:00+00	2025-10-18 15:30:00+00	t	\N	\N
f797856d-f834-4b68-949a-7689f89233f7	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-19 03:30:00+00	2025-10-19 04:30:00+00	t	\N	\N
3e70cf3e-d215-46f6-9b7f-a477b1d51971	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-19 04:30:00+00	2025-10-19 05:30:00+00	t	\N	\N
e85ce168-f6b7-4d40-b874-777004781311	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-19 05:30:00+00	2025-10-19 06:30:00+00	t	\N	\N
7f46c524-26cc-4080-80d6-53216cab3133	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-19 06:30:00+00	2025-10-19 07:30:00+00	t	\N	\N
133354bc-ff51-4719-ad1e-1133cdd02458	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-19 07:30:00+00	2025-10-19 08:30:00+00	t	\N	\N
395eb04e-5fe3-4bd8-b0a6-c7f4b83dd74b	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-19 08:30:00+00	2025-10-19 09:30:00+00	t	\N	\N
db0f8e0d-b0a4-4c65-857e-32b9c094e6fa	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-19 09:30:00+00	2025-10-19 10:30:00+00	t	\N	\N
7f53bb1d-5a69-4ccd-8661-506aa92b0e66	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-19 10:30:00+00	2025-10-19 11:30:00+00	t	\N	\N
7cfdec1b-0128-4dc0-af8c-08a5c6229e2f	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-12 14:30:00+00	2025-10-12 15:30:00+00	f	\N	\N
61390823-5cb8-44d6-834d-b73340ddee9b	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-13 03:30:00+00	2025-10-13 04:30:00+00	f	\N	\N
c702f9c0-57f0-4c7f-9c63-fd3775affb03	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-13 14:30:00+00	2025-10-13 15:30:00+00	t	\N	\N
100f7f16-2294-4782-ba45-fb39a24d4503	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-14 14:30:00+00	2025-10-14 15:30:00+00	t	\N	\N
af541bd5-5fbf-4c52-991e-39661c46b6b3	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-19 11:30:00+00	2025-10-19 12:30:00+00	t	\N	\N
79b167cc-a321-44df-a471-7f78e37157e1	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-19 12:30:00+00	2025-10-19 13:30:00+00	t	\N	\N
61a36072-b41d-464c-b397-fcddc8380852	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-19 13:30:00+00	2025-10-19 14:30:00+00	t	\N	\N
7d7e8d40-43d0-40ae-92e9-56e625d7c582	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-19 14:30:00+00	2025-10-19 15:30:00+00	t	\N	\N
2c9c4972-5506-48d9-a499-bbf178c9288b	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-12 03:30:00+00	2025-10-12 04:30:00+00	t	\N	\N
00f2cda7-55df-457d-bc59-26531f84f2ce	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-12 04:30:00+00	2025-10-12 05:30:00+00	t	\N	\N
85cdb678-255c-44d6-993b-2fd7b30803e9	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-12 05:30:00+00	2025-10-12 06:30:00+00	t	\N	\N
cdfe7f20-e927-4dea-b7e1-6ef151d7af1d	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-12 06:30:00+00	2025-10-12 07:30:00+00	t	\N	\N
e567d523-abad-4a34-b84f-d8be98a04706	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-12 07:30:00+00	2025-10-12 08:30:00+00	t	\N	\N
25f7bfd1-be38-4063-81ea-4b6229b7be07	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-12 08:30:00+00	2025-10-12 09:30:00+00	t	\N	\N
3563929b-8bcf-4021-a9ce-3d5b4871f0e6	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-12 09:30:00+00	2025-10-12 10:30:00+00	t	\N	\N
fc16b83b-80ef-4315-815d-eb51310442a7	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-12 10:30:00+00	2025-10-12 11:30:00+00	t	\N	\N
9096af20-1598-4425-b550-35ff14ab7ec9	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-12 11:30:00+00	2025-10-12 12:30:00+00	t	\N	\N
6dabf675-8698-4cfe-bd10-585793bbe579	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-12 12:30:00+00	2025-10-12 13:30:00+00	t	\N	\N
1fbb6fe3-9956-47f4-a54c-11e2bddd0a3c	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-12 13:30:00+00	2025-10-12 14:30:00+00	t	\N	\N
8053b4a0-0b5d-46a0-8a1a-a7bfaff66502	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-12 14:30:00+00	2025-10-12 15:30:00+00	t	\N	\N
ce5e68ed-db6f-45c5-95a5-bade8fc84b68	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-13 03:30:00+00	2025-10-13 04:30:00+00	t	\N	\N
bc7c6517-e00e-4bdf-9ba8-1ed222f27c49	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-13 04:30:00+00	2025-10-13 05:30:00+00	t	\N	\N
54152634-7fbf-40d0-af81-0a6ecc795d12	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-13 05:30:00+00	2025-10-13 06:30:00+00	t	\N	\N
0b25fd31-8fe7-4c38-b4ab-41396c1fde65	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-13 06:30:00+00	2025-10-13 07:30:00+00	t	\N	\N
781b883c-2715-4474-b7be-912d8f40ef9c	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-13 07:30:00+00	2025-10-13 08:30:00+00	t	\N	\N
f9b7abce-f181-4cae-8650-5709576f4809	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-13 08:30:00+00	2025-10-13 09:30:00+00	t	\N	\N
66cbb624-5cbb-4918-bf6e-d28cdc4d7363	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-13 09:30:00+00	2025-10-13 10:30:00+00	t	\N	\N
89e9d751-67b4-4a87-a9a2-830963464942	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-13 10:30:00+00	2025-10-13 11:30:00+00	t	\N	\N
c3e99663-5dbe-4048-a8f0-50d89ab061aa	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-13 11:30:00+00	2025-10-13 12:30:00+00	t	\N	\N
2ce5518b-47a2-436d-b03c-34c13923fcbc	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-13 12:30:00+00	2025-10-13 13:30:00+00	t	\N	\N
0b679b3d-145a-47cf-864a-4d1995906cb3	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-13 13:30:00+00	2025-10-13 14:30:00+00	t	\N	\N
a8761c23-455f-4110-a71c-47dfd2e25700	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-13 14:30:00+00	2025-10-13 15:30:00+00	t	\N	\N
e18fc55c-c185-42e8-8cb8-ae3b4c3c9690	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-14 03:30:00+00	2025-10-14 04:30:00+00	t	\N	\N
bd0586a7-b4db-47b5-abfe-5328c79f348a	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-14 04:30:00+00	2025-10-14 05:30:00+00	t	\N	\N
2250a57d-3573-4628-8daa-5c278db818c4	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-14 05:30:00+00	2025-10-14 06:30:00+00	t	\N	\N
f5e878ed-f0c1-4c56-bfa3-127a97194b6a	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-14 06:30:00+00	2025-10-14 07:30:00+00	t	\N	\N
2a34bae4-6942-41e6-b32b-9d8a297e9203	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-14 07:30:00+00	2025-10-14 08:30:00+00	t	\N	\N
5f516443-e76d-4f73-aac1-652c03f744f4	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-14 08:30:00+00	2025-10-14 09:30:00+00	t	\N	\N
5f5424a7-468a-451f-91b3-041dd0893233	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-14 09:30:00+00	2025-10-14 10:30:00+00	t	\N	\N
def91a54-84e7-4df3-9a1f-a896471e7ec7	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-14 10:30:00+00	2025-10-14 11:30:00+00	t	\N	\N
da6a314c-a4da-4012-a176-ad4865fa4d21	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-14 11:30:00+00	2025-10-14 12:30:00+00	t	\N	\N
8f61f4d2-2837-46be-8288-1448c522cabf	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-14 12:30:00+00	2025-10-14 13:30:00+00	t	\N	\N
649b6cbd-99d7-4c20-9b8c-f6819ef50e59	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-14 13:30:00+00	2025-10-14 14:30:00+00	t	\N	\N
f7f4e95a-5d2b-4053-b4a2-8d5b488441e2	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-14 14:30:00+00	2025-10-14 15:30:00+00	t	\N	\N
18572fc5-9611-428b-9ad7-0038923d56f0	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-15 03:30:00+00	2025-10-15 04:30:00+00	t	\N	\N
366528cb-4edd-4494-9ed8-44c11eb82cf4	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-15 04:30:00+00	2025-10-15 05:30:00+00	t	\N	\N
d1a1fd64-d8ac-4a39-951a-0563d662d8e1	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-15 05:30:00+00	2025-10-15 06:30:00+00	t	\N	\N
5f47a788-d581-40f2-9bd1-dc576b9ab083	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-15 06:30:00+00	2025-10-15 07:30:00+00	t	\N	\N
f2433bc2-3310-4967-872d-400190aad8ee	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-15 07:30:00+00	2025-10-15 08:30:00+00	t	\N	\N
89c3c516-197e-402d-b697-a67478be9f67	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-15 08:30:00+00	2025-10-15 09:30:00+00	t	\N	\N
eaa13c9a-2353-4b27-9e06-c61c627e2f7c	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-15 09:30:00+00	2025-10-15 10:30:00+00	t	\N	\N
11ccae51-a96f-41e5-808d-fbb3b02885bd	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-15 10:30:00+00	2025-10-15 11:30:00+00	t	\N	\N
025f5b81-c600-4cd3-a720-61c81a21df4c	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-15 11:30:00+00	2025-10-15 12:30:00+00	t	\N	\N
a0e49f42-b31d-4cff-8c53-ebd5f2a5e2c9	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-15 12:30:00+00	2025-10-15 13:30:00+00	t	\N	\N
9f562653-d406-4849-8352-7dbdb2aeddb4	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-15 13:30:00+00	2025-10-15 14:30:00+00	t	\N	\N
255634f6-b0c4-4092-8311-adf220ac7342	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-15 14:30:00+00	2025-10-15 15:30:00+00	t	\N	\N
e12e7751-7140-4c1a-bfe8-c244eae58115	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-16 03:30:00+00	2025-10-16 04:30:00+00	t	\N	\N
fe873d60-6503-444c-ac7c-14cdb71a6e52	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-16 04:30:00+00	2025-10-16 05:30:00+00	t	\N	\N
1263c332-b1f1-481c-9a37-07a2651302fd	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-16 05:30:00+00	2025-10-16 06:30:00+00	t	\N	\N
20f4f485-f810-4646-941d-b8bd16c5923a	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-16 06:30:00+00	2025-10-16 07:30:00+00	t	\N	\N
c769de42-4562-402b-9a19-ded815982b1f	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-16 07:30:00+00	2025-10-16 08:30:00+00	t	\N	\N
5562b67f-7d36-41cb-a607-c6a4316a4a02	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-16 08:30:00+00	2025-10-16 09:30:00+00	t	\N	\N
0f4c6d37-5cae-4cdb-b510-6f4a1959c355	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-16 09:30:00+00	2025-10-16 10:30:00+00	t	\N	\N
789de60d-360c-49db-86b1-e1119aadb35b	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-16 10:30:00+00	2025-10-16 11:30:00+00	t	\N	\N
959ab10a-3947-46d8-b2fb-eb075442d572	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-16 11:30:00+00	2025-10-16 12:30:00+00	t	\N	\N
101e79d2-ca6b-4369-bcdd-a41455898bac	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-16 12:30:00+00	2025-10-16 13:30:00+00	t	\N	\N
f0241fd5-adc3-499a-b289-c05722dcc032	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-16 13:30:00+00	2025-10-16 14:30:00+00	t	\N	\N
6bf6e4ad-07ee-4fe9-9700-386ba2524881	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-16 14:30:00+00	2025-10-16 15:30:00+00	t	\N	\N
27f0263c-51e5-4d7d-9216-79511c039a39	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-17 03:30:00+00	2025-10-17 04:30:00+00	t	\N	\N
aa1ae0c3-f0ac-475b-841c-da487065b053	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-17 04:30:00+00	2025-10-17 05:30:00+00	t	\N	\N
ddf169d8-3cbb-4d6f-9ddb-044874c3a42e	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-17 05:30:00+00	2025-10-17 06:30:00+00	t	\N	\N
cb3f48a3-5670-4654-a610-4529afaedd02	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-17 06:30:00+00	2025-10-17 07:30:00+00	t	\N	\N
827f6f8e-a381-4292-ab22-5761714e4e0d	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-17 07:30:00+00	2025-10-17 08:30:00+00	t	\N	\N
973bdb1c-5a5a-4214-a008-f90f45859752	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-17 08:30:00+00	2025-10-17 09:30:00+00	t	\N	\N
11648bc1-3e77-4088-83d3-c5621550b76d	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-17 09:30:00+00	2025-10-17 10:30:00+00	t	\N	\N
7594ca99-472f-42e8-92ba-62bd48c61356	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-17 10:30:00+00	2025-10-17 11:30:00+00	t	\N	\N
c35c34e1-e748-46ba-be48-32076dc4bfd4	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-17 11:30:00+00	2025-10-17 12:30:00+00	t	\N	\N
cfca320f-fac2-4d33-9676-a57d19dd0efc	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-17 12:30:00+00	2025-10-17 13:30:00+00	t	\N	\N
c26a3cdb-e8b2-4a0d-9f3a-6e45cf872f52	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-17 13:30:00+00	2025-10-17 14:30:00+00	t	\N	\N
6d96e059-35af-4732-a45b-4a9a29c5eafb	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-17 14:30:00+00	2025-10-17 15:30:00+00	t	\N	\N
a8f368f7-6dab-4328-92c7-d420c3bba686	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-18 03:30:00+00	2025-10-18 04:30:00+00	t	\N	\N
58367ffb-eb88-4307-ab02-aa30f3b8bcb3	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-18 04:30:00+00	2025-10-18 05:30:00+00	t	\N	\N
dabea045-edbb-4862-9077-2fa6185b588d	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-18 05:30:00+00	2025-10-18 06:30:00+00	t	\N	\N
55365ece-87a9-47aa-89b7-11c41e018a46	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-18 06:30:00+00	2025-10-18 07:30:00+00	t	\N	\N
9983c9a3-07e3-496c-9236-9be899c4ad5c	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-18 07:30:00+00	2025-10-18 08:30:00+00	t	\N	\N
ecffafca-d01c-4a68-8465-25c319480c83	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-18 08:30:00+00	2025-10-18 09:30:00+00	t	\N	\N
9d7942e1-1e31-4b70-a357-a389124da397	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-18 09:30:00+00	2025-10-18 10:30:00+00	t	\N	\N
f49260ee-9fbf-4439-8779-857c288fdd74	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-18 10:30:00+00	2025-10-18 11:30:00+00	t	\N	\N
a7084868-3407-4f38-bebc-ffb8f3f32816	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-18 11:30:00+00	2025-10-18 12:30:00+00	t	\N	\N
1eee0e6a-eb93-4199-9c74-0d1c8b06ab35	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-18 12:30:00+00	2025-10-18 13:30:00+00	t	\N	\N
46b32085-87b8-4efc-a9ae-088c216f1b4c	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-18 13:30:00+00	2025-10-18 14:30:00+00	t	\N	\N
8859248d-427f-4c45-a3b3-9af5e8415ffd	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-18 14:30:00+00	2025-10-18 15:30:00+00	t	\N	\N
eb9ea642-8f3b-4d95-8f3f-259e37297a96	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-19 03:30:00+00	2025-10-19 04:30:00+00	t	\N	\N
cb32663e-d3e0-4994-8085-1241b574ed65	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-19 04:30:00+00	2025-10-19 05:30:00+00	t	\N	\N
6b0c0d72-f9b9-4374-bd9b-df5eec91116c	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-19 05:30:00+00	2025-10-19 06:30:00+00	t	\N	\N
849b9196-d5bf-4eb0-84c7-f37a81b9a825	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-19 06:30:00+00	2025-10-19 07:30:00+00	t	\N	\N
acc24bf2-ac12-4a37-aa67-9a38a536df6c	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-19 07:30:00+00	2025-10-19 08:30:00+00	t	\N	\N
4e343789-e96e-497d-b228-f6c2341acf9f	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-19 08:30:00+00	2025-10-19 09:30:00+00	t	\N	\N
3b8625e6-e84d-4f60-ba7c-44bac46e3fc8	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-19 09:30:00+00	2025-10-19 10:30:00+00	t	\N	\N
e6ee2c49-e629-4a6e-93c0-bab861f66ce0	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-19 10:30:00+00	2025-10-19 11:30:00+00	t	\N	\N
9d3e2cde-20fa-43f9-b275-bb0cd1aae857	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-19 11:30:00+00	2025-10-19 12:30:00+00	t	\N	\N
1465fc53-49d5-4fba-8301-33b1f82f88c5	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-19 12:30:00+00	2025-10-19 13:30:00+00	t	\N	\N
86c19f32-6853-42af-975e-d38ef840b60a	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-19 13:30:00+00	2025-10-19 14:30:00+00	t	\N	\N
88748e53-4b9e-478f-a1b0-980b6ab2b6c5	e68d5a25-1d7b-4b59-9599-9a140ee15af9	2025-10-19 14:30:00+00	2025-10-19 15:30:00+00	t	\N	\N
88f46cf1-2220-4bc2-a184-437eab6f6e81	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-12 03:30:00+00	2025-10-12 04:30:00+00	t	\N	\N
b79d2940-333e-4b45-bb51-124e11bd09ca	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-12 04:30:00+00	2025-10-12 05:30:00+00	t	\N	\N
2d421dc1-7f8d-4d05-abc2-c4182d1c34c0	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-12 05:30:00+00	2025-10-12 06:30:00+00	t	\N	\N
a16b305c-f3d2-4672-ae43-095ed0729829	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-12 06:30:00+00	2025-10-12 07:30:00+00	t	\N	\N
daa7ede1-e17f-4808-adda-4660d9ed04b9	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-12 07:30:00+00	2025-10-12 08:30:00+00	t	\N	\N
6efca044-6af3-4e51-9265-fce291a6d121	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-12 08:30:00+00	2025-10-12 09:30:00+00	t	\N	\N
d2ef2e73-209d-4818-931b-056bf2415d3a	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-12 09:30:00+00	2025-10-12 10:30:00+00	t	\N	\N
ae1b342e-c9d2-4b92-bf1e-611ff010cab2	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-12 10:30:00+00	2025-10-12 11:30:00+00	t	\N	\N
3f76612c-f297-4f3b-9165-bb1e84cf7f24	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-12 11:30:00+00	2025-10-12 12:30:00+00	t	\N	\N
f51edb71-da99-4611-baed-e44ec77e0894	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-12 12:30:00+00	2025-10-12 13:30:00+00	t	\N	\N
e79d9931-175a-4969-9c8c-408b2d52267d	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-12 13:30:00+00	2025-10-12 14:30:00+00	t	\N	\N
f6ae2371-f5a3-42f3-a831-73540ef86dfd	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-12 14:30:00+00	2025-10-12 15:30:00+00	t	\N	\N
02b841c7-cced-423e-9d99-a9cbbca91df1	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-13 03:30:00+00	2025-10-13 04:30:00+00	t	\N	\N
121dbf75-a614-4d17-82d5-e31eb290358c	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-13 04:30:00+00	2025-10-13 05:30:00+00	t	\N	\N
ba8741c5-a25f-4465-8b02-8e473b366fa2	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-13 05:30:00+00	2025-10-13 06:30:00+00	t	\N	\N
d78eee64-2c9e-4a97-b66d-80e2d89d08fa	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-13 06:30:00+00	2025-10-13 07:30:00+00	t	\N	\N
c175b1b1-44d8-4cd5-88f7-c6da33ed44a5	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-13 07:30:00+00	2025-10-13 08:30:00+00	t	\N	\N
6b1408db-52f3-44bd-b83f-d371c88f13fd	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-13 08:30:00+00	2025-10-13 09:30:00+00	t	\N	\N
dc262168-c881-469c-84dd-2865881af43a	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-13 09:30:00+00	2025-10-13 10:30:00+00	t	\N	\N
aa1605de-9b59-435b-94b1-9e9e60f38515	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-13 10:30:00+00	2025-10-13 11:30:00+00	t	\N	\N
82f92273-cba8-4db2-8006-c7b68fbe8e32	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-13 11:30:00+00	2025-10-13 12:30:00+00	t	\N	\N
0a8ad3fa-0f8f-4399-adda-a78cf70acf71	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-13 12:30:00+00	2025-10-13 13:30:00+00	t	\N	\N
806ecf37-2b12-4158-82fc-c0e71a2ea366	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-13 13:30:00+00	2025-10-13 14:30:00+00	t	\N	\N
85e3c945-1ac8-4a18-a6aa-fd8db0b3ca45	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-13 14:30:00+00	2025-10-13 15:30:00+00	t	\N	\N
fefb51a5-6661-4495-9be4-8f57e6028ef2	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-14 03:30:00+00	2025-10-14 04:30:00+00	t	\N	\N
667fa93a-f346-4890-8040-cf78105f1bd5	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-14 04:30:00+00	2025-10-14 05:30:00+00	t	\N	\N
eca46a28-809d-4acc-b350-bd5c4118c4d1	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-14 05:30:00+00	2025-10-14 06:30:00+00	t	\N	\N
32d58f32-324d-4cf7-9d2c-1aba6ab7e5ac	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-14 06:30:00+00	2025-10-14 07:30:00+00	t	\N	\N
4c3242b3-912c-4711-9356-acc3a4b58d53	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-14 07:30:00+00	2025-10-14 08:30:00+00	t	\N	\N
16befc65-57e4-487a-93ef-108a84454b16	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-14 08:30:00+00	2025-10-14 09:30:00+00	t	\N	\N
1fc8d3db-44de-4455-8411-926820f24672	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-14 09:30:00+00	2025-10-14 10:30:00+00	t	\N	\N
76809ba1-1c28-44c4-8d5d-6e31bb25e857	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-14 10:30:00+00	2025-10-14 11:30:00+00	t	\N	\N
7ae1a055-b60e-47da-87bb-01da3ef37f5a	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-14 11:30:00+00	2025-10-14 12:30:00+00	t	\N	\N
79d340f0-b8d4-4178-af83-f749f50f1e98	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-14 12:30:00+00	2025-10-14 13:30:00+00	t	\N	\N
261c6a2c-3180-405f-ad0f-8b1e55eefc2f	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-14 13:30:00+00	2025-10-14 14:30:00+00	t	\N	\N
43a40f82-ef49-46d0-87f9-d4a921985a87	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-14 14:30:00+00	2025-10-14 15:30:00+00	t	\N	\N
066b8848-b1ad-4238-b977-81e633f48db0	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-15 03:30:00+00	2025-10-15 04:30:00+00	t	\N	\N
bee34da5-45a3-492d-ba64-e42cbcfd5e30	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-15 04:30:00+00	2025-10-15 05:30:00+00	t	\N	\N
512d074f-56cb-47f2-b030-5579c4038762	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-15 05:30:00+00	2025-10-15 06:30:00+00	t	\N	\N
fe71eda5-fa96-416b-9b81-6ceb9c471fc7	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-15 06:30:00+00	2025-10-15 07:30:00+00	t	\N	\N
71467cfd-50d1-47ec-aa14-8bb14ec7b7a3	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-15 07:30:00+00	2025-10-15 08:30:00+00	t	\N	\N
9ad51fea-b1dc-4c80-8a49-c56f197cc3b8	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-15 08:30:00+00	2025-10-15 09:30:00+00	t	\N	\N
5a82bf6c-226e-4903-b93d-6ba6f1bf7d86	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-15 09:30:00+00	2025-10-15 10:30:00+00	t	\N	\N
770ed8e9-fdce-4f12-be81-d64a63b352bb	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-15 10:30:00+00	2025-10-15 11:30:00+00	t	\N	\N
6f7ac5c6-2488-4dbf-838f-4c66a4a3cf00	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-15 11:30:00+00	2025-10-15 12:30:00+00	t	\N	\N
321e09a9-e636-4066-8f78-716be85327a2	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-15 12:30:00+00	2025-10-15 13:30:00+00	t	\N	\N
f9fb9a62-8c81-4c03-83cb-49a84b9978d3	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-15 13:30:00+00	2025-10-15 14:30:00+00	t	\N	\N
cde445ad-e13d-4d14-9c89-9f721f192cee	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-15 14:30:00+00	2025-10-15 15:30:00+00	t	\N	\N
bd7cfdbe-3b37-48c9-8a7a-5c3dfc7aebef	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-16 03:30:00+00	2025-10-16 04:30:00+00	t	\N	\N
dc5cc0df-e1dd-4dd1-8a1c-de13b65fa262	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-16 04:30:00+00	2025-10-16 05:30:00+00	t	\N	\N
6db39914-9562-4fff-b738-27f801402956	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-16 05:30:00+00	2025-10-16 06:30:00+00	t	\N	\N
951badd7-2795-445c-ab32-9fc1aa78dc8c	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-16 06:30:00+00	2025-10-16 07:30:00+00	t	\N	\N
050db90c-b8ea-4160-aacf-91860fbd960c	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-16 07:30:00+00	2025-10-16 08:30:00+00	t	\N	\N
c8cfeb4f-7b72-467e-9aa4-b968358c962c	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-16 08:30:00+00	2025-10-16 09:30:00+00	t	\N	\N
7d41dd04-e0f5-4702-9c8a-7c56e09fa7ad	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-16 09:30:00+00	2025-10-16 10:30:00+00	t	\N	\N
4651b248-b819-4ff2-a57a-c2c6a82d4f47	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-16 10:30:00+00	2025-10-16 11:30:00+00	t	\N	\N
4417d099-34af-410c-8d93-0f42de3b76aa	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-16 11:30:00+00	2025-10-16 12:30:00+00	t	\N	\N
d78f8788-708d-4031-a115-81a96c53f304	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-16 12:30:00+00	2025-10-16 13:30:00+00	t	\N	\N
d864e2c6-2c4a-413e-a822-23d632e38b60	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-16 13:30:00+00	2025-10-16 14:30:00+00	t	\N	\N
538a0e5e-aee8-4189-bfe0-bb8c1bf929eb	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-16 14:30:00+00	2025-10-16 15:30:00+00	t	\N	\N
8fc95474-c219-4950-9849-9806ca58d06b	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-17 03:30:00+00	2025-10-17 04:30:00+00	t	\N	\N
aec0b729-d0ac-40a5-806e-707189d351c0	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-17 04:30:00+00	2025-10-17 05:30:00+00	t	\N	\N
cbb87fdc-38ce-4e85-ab42-a77cdbbc7e7d	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-17 05:30:00+00	2025-10-17 06:30:00+00	t	\N	\N
b37f7e8e-9747-4968-b981-c667556a9ee3	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-17 06:30:00+00	2025-10-17 07:30:00+00	t	\N	\N
f9b1b06e-3bcc-4328-b502-c222d18daf4a	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-17 07:30:00+00	2025-10-17 08:30:00+00	t	\N	\N
036d71e4-d46b-4b8e-b71b-251e9bd83de0	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-17 08:30:00+00	2025-10-17 09:30:00+00	t	\N	\N
5eba9e61-f3c5-44ca-8773-c13df674fd34	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-17 09:30:00+00	2025-10-17 10:30:00+00	t	\N	\N
e8aa62a6-9fc2-456d-960e-d9d91fba6168	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-17 10:30:00+00	2025-10-17 11:30:00+00	t	\N	\N
e250b30d-e710-4aec-aa2d-316aaf71d0e9	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-17 11:30:00+00	2025-10-17 12:30:00+00	t	\N	\N
0765735e-137d-4575-aff4-583b7677456f	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-17 12:30:00+00	2025-10-17 13:30:00+00	t	\N	\N
0ff56511-00ea-42b2-b6f0-8b5c3589fe4a	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-17 13:30:00+00	2025-10-17 14:30:00+00	t	\N	\N
c2aef0ca-ca36-4851-af1e-08908f736726	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-17 14:30:00+00	2025-10-17 15:30:00+00	t	\N	\N
4c492358-20c8-401b-abdb-6286feb4f8cd	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-18 03:30:00+00	2025-10-18 04:30:00+00	t	\N	\N
d5e655ea-41cb-4082-ba8d-43217425ed63	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-18 04:30:00+00	2025-10-18 05:30:00+00	t	\N	\N
32a495d8-1268-4c70-8a1a-bed4b8e8ad8e	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-18 05:30:00+00	2025-10-18 06:30:00+00	t	\N	\N
9af9e915-ad1c-4538-936a-c1bf148391fb	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-18 06:30:00+00	2025-10-18 07:30:00+00	t	\N	\N
a4c2ef08-6a03-4aff-bd95-61b9ebde3785	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-18 07:30:00+00	2025-10-18 08:30:00+00	t	\N	\N
470e6cee-5ffd-43d0-82b3-25d4a48a9019	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-18 08:30:00+00	2025-10-18 09:30:00+00	t	\N	\N
fba34850-883a-4864-a9c8-1f258461fba2	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-18 09:30:00+00	2025-10-18 10:30:00+00	t	\N	\N
dfa92b4d-beae-475d-9b31-6c1133730200	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-18 10:30:00+00	2025-10-18 11:30:00+00	t	\N	\N
da4f5a07-c1ff-4134-8669-6dca971c4b59	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-18 11:30:00+00	2025-10-18 12:30:00+00	t	\N	\N
40109386-3c27-4184-a028-cfefa16c3f06	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-18 12:30:00+00	2025-10-18 13:30:00+00	t	\N	\N
033439a5-7462-4a16-84e9-67d811aee132	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-18 13:30:00+00	2025-10-18 14:30:00+00	t	\N	\N
76c0cf34-d423-4a76-8b94-78e0482c8f62	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-18 14:30:00+00	2025-10-18 15:30:00+00	t	\N	\N
d787b867-5bc2-4a15-9940-1bc9ada32ead	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-19 03:30:00+00	2025-10-19 04:30:00+00	t	\N	\N
13e4aba9-5431-4432-b0ec-83b380846977	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-19 04:30:00+00	2025-10-19 05:30:00+00	t	\N	\N
83197a4b-1dc2-4324-ac2d-bb47af2942d4	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-19 05:30:00+00	2025-10-19 06:30:00+00	t	\N	\N
d30b67d0-98a6-4556-a6bf-3e5a9e4ad508	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-19 06:30:00+00	2025-10-19 07:30:00+00	t	\N	\N
25d3c6aa-fc57-40af-b48a-844f746e5eae	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-19 07:30:00+00	2025-10-19 08:30:00+00	t	\N	\N
59e1c825-15fc-4030-8989-fcd77012cbf6	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-19 08:30:00+00	2025-10-19 09:30:00+00	t	\N	\N
93c68433-f71f-4373-a1d9-890a6d6599c4	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-19 09:30:00+00	2025-10-19 10:30:00+00	t	\N	\N
4edd8d69-553f-4c3b-88bd-5ba540f2ca51	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-19 10:30:00+00	2025-10-19 11:30:00+00	t	\N	\N
34ed5923-297b-457c-9479-903d33ac552e	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-19 11:30:00+00	2025-10-19 12:30:00+00	t	\N	\N
e33a68e1-dd1b-4704-83dc-2f82fead08c7	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-19 12:30:00+00	2025-10-19 13:30:00+00	t	\N	\N
bd1ff79a-d6fe-486f-b5bc-e30a28dc5b17	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-19 13:30:00+00	2025-10-19 14:30:00+00	t	\N	\N
49eabc8a-af64-4f1f-888b-d6d0e087866f	ea904f64-86ad-40cf-88c3-47727800e3da	2025-10-19 14:30:00+00	2025-10-19 15:30:00+00	t	\N	\N
a99225cc-0791-458e-ac69-2a9d37f01c67	2b123724-4e3c-4344-8df1-7b66c1cc81a6	2025-10-12 13:30:00+00	2025-10-12 14:30:00+00	t	\N	\N
fafbb584-999e-4fb9-b9ec-a663cd788197	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-23 13:30:00+00	2025-10-23 14:30:00+00	f	\N	\N
0b977864-168f-499e-976b-301a08a9f646	857b3a73-e640-4cfd-b886-a96815b6e562	2025-10-12 13:30:00+00	2025-10-12 14:30:00+00	t	\N	\N
761fa7c6-c790-4937-9106-7f9de91d4116	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-23 14:30:00+00	2025-10-23 15:30:00+00	f	\N	\N
f1d463a0-b661-4fdc-a556-f01fba3fd29c	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-24 03:30:00+00	2025-10-24 04:30:00+00	f	\N	\N
52de7f59-7814-45cd-8356-8064ac1bcd19	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-28 03:30:00+00	2025-10-28 04:30:00+00	f	\N	\N
cef53716-0e39-4518-b5b5-cf4e985b264b	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-13 03:30:00+00	2025-10-13 04:30:00+00	t	\N	\N
d6036ce2-7259-4d01-8b1a-9b7fb4ecb5c3	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-14 14:30:00+00	2025-10-14 15:30:00+00	f	\N	\N
8d9e7896-f087-4365-b6b8-d61f8081d105	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-23 03:30:00+00	2025-10-23 04:30:00+00	t	\N	\N
7c2ee7e4-5860-477e-9092-746f6c48a63f	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-23 04:30:00+00	2025-10-23 05:30:00+00	t	\N	\N
30039841-373e-4e0d-83c3-6532163e0c4e	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-23 05:30:00+00	2025-10-23 06:30:00+00	t	\N	\N
f3dc66b1-0f67-4e16-8b12-3089e09fa18f	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-23 06:30:00+00	2025-10-23 07:30:00+00	t	\N	\N
5f1b1629-1d32-4d4d-871e-83c1cc6ca81d	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-23 07:30:00+00	2025-10-23 08:30:00+00	t	\N	\N
4ac501f7-2fe3-44f7-9104-5023c9879ccf	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-23 08:30:00+00	2025-10-23 09:30:00+00	t	\N	\N
9665982d-a6f0-4238-8fe7-f7a1e915f015	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-23 09:30:00+00	2025-10-23 10:30:00+00	t	\N	\N
de97ec73-62bf-4c43-98ef-30b8c5c7049b	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-23 10:30:00+00	2025-10-23 11:30:00+00	t	\N	\N
1407e9af-be29-43e6-8e23-4632cd4496c9	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-23 11:30:00+00	2025-10-23 12:30:00+00	t	\N	\N
d4dc88e5-3228-495a-8313-e5a7aa10dd5a	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-23 12:30:00+00	2025-10-23 13:30:00+00	t	\N	\N
cfdc4dec-da7a-47bc-add6-acdf426720db	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-24 04:30:00+00	2025-10-24 05:30:00+00	t	\N	\N
3804bbc9-05c8-457c-81a6-d9ac36dbd1a4	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-24 05:30:00+00	2025-10-24 06:30:00+00	t	\N	\N
665b9fe1-3771-4f6d-ab57-0098aba549c0	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-24 06:30:00+00	2025-10-24 07:30:00+00	t	\N	\N
ea21878a-27b2-450f-9634-38bf81ef734e	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-24 07:30:00+00	2025-10-24 08:30:00+00	t	\N	\N
95487c4b-a01e-4fbc-b77c-8ec57257a0dd	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-24 08:30:00+00	2025-10-24 09:30:00+00	t	\N	\N
b77f294b-d3e3-4ff6-83bd-2445fba7506d	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-24 09:30:00+00	2025-10-24 10:30:00+00	t	\N	\N
b957b6c2-ee1f-4b7f-93cf-08ce1736489e	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-24 11:30:00+00	2025-10-24 12:30:00+00	t	\N	\N
2c3c5f19-198d-43af-bf1d-e24d4ff07bbb	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-24 12:30:00+00	2025-10-24 13:30:00+00	t	\N	\N
9f8bde59-6557-40bc-8823-d28303c86a10	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-24 13:30:00+00	2025-10-24 14:30:00+00	t	\N	\N
c71787f1-af04-4a0e-9a03-3157ce987b2d	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-24 14:30:00+00	2025-10-24 15:30:00+00	t	\N	\N
2df94a32-79ac-4b14-af5b-e6ab80b14a0c	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-25 03:30:00+00	2025-10-25 04:30:00+00	t	\N	\N
891d874e-54ea-41f1-bea3-d9b1b8e6e036	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-25 04:30:00+00	2025-10-25 05:30:00+00	t	\N	\N
7189d4df-cd85-4685-814e-8c510b60a55d	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-25 05:30:00+00	2025-10-25 06:30:00+00	t	\N	\N
254dfac9-67d2-4cc2-b48b-d56ab5a9388b	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-25 06:30:00+00	2025-10-25 07:30:00+00	t	\N	\N
80f7b920-b5d6-4dcb-a38a-4a3bd24d8b58	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-25 07:30:00+00	2025-10-25 08:30:00+00	t	\N	\N
a9e742cd-d6f4-4cc8-8928-1bd6907729e3	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-25 08:30:00+00	2025-10-25 09:30:00+00	t	\N	\N
96b84ee3-6df5-49c5-bc8a-0df7d47c2a02	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-25 09:30:00+00	2025-10-25 10:30:00+00	t	\N	\N
7060940d-06d1-4a6f-8fb9-45ea5980ca19	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-25 10:30:00+00	2025-10-25 11:30:00+00	t	\N	\N
4b4ae135-8264-4242-82b8-47e4006d155c	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-25 11:30:00+00	2025-10-25 12:30:00+00	t	\N	\N
1a78fa69-c93b-4b00-be0a-ae103d406456	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-25 12:30:00+00	2025-10-25 13:30:00+00	t	\N	\N
a1e7f478-a8b9-4846-8b12-2f7381097ce4	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-25 13:30:00+00	2025-10-25 14:30:00+00	t	\N	\N
6ba33a7e-a390-4433-9b45-21d95a1540fc	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-25 14:30:00+00	2025-10-25 15:30:00+00	t	\N	\N
964cce92-314d-4d8c-9830-794a9136bc61	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-26 04:30:00+00	2025-10-26 05:30:00+00	t	\N	\N
dfea4379-36ad-459e-a6fb-03b895339daa	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-26 05:30:00+00	2025-10-26 06:30:00+00	t	\N	\N
d3451ba5-8a8f-4775-a421-eb96d3fa38a7	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-26 06:30:00+00	2025-10-26 07:30:00+00	t	\N	\N
b5ca3000-32ee-4a67-8001-6eff99cf65a3	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-26 07:30:00+00	2025-10-26 08:30:00+00	t	\N	\N
7d26493f-7f43-4110-942a-54b4292bdb16	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-26 08:30:00+00	2025-10-26 09:30:00+00	t	\N	\N
d639800f-0a3b-4209-8da0-ce74049dcbda	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-26 09:30:00+00	2025-10-26 10:30:00+00	t	\N	\N
c4038b61-5521-462b-ab30-02f47a97dc56	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-26 10:30:00+00	2025-10-26 11:30:00+00	t	\N	\N
2b07f818-96cc-4d9d-b568-4e6832ec54af	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-26 11:30:00+00	2025-10-26 12:30:00+00	t	\N	\N
e6c9582b-f2f6-4b7b-93f5-4a1c8c009157	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-26 12:30:00+00	2025-10-26 13:30:00+00	t	\N	\N
3fcfe4ea-bc32-435c-8201-15c09f46e371	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-26 13:30:00+00	2025-10-26 14:30:00+00	t	\N	\N
6e7d1b1c-7c63-48fc-9128-08177e6325c8	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-26 14:30:00+00	2025-10-26 15:30:00+00	t	\N	\N
5e917bcf-f2de-4375-99df-320f22649432	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-27 03:30:00+00	2025-10-27 04:30:00+00	t	\N	\N
a1ae8113-4ce1-44ab-9f4d-111985553df2	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-27 04:30:00+00	2025-10-27 05:30:00+00	t	\N	\N
847c3d99-acbf-48dc-bac0-29cc0a0ef8ed	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-27 05:30:00+00	2025-10-27 06:30:00+00	t	\N	\N
c8b3cfe3-fde7-43cb-a0d7-c319d8d6e11d	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-27 06:30:00+00	2025-10-27 07:30:00+00	t	\N	\N
fa2ba820-4c8f-4fe5-8127-c67322e0907c	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-27 07:30:00+00	2025-10-27 08:30:00+00	t	\N	\N
69f96e25-9614-43da-a5ea-ed5819c24512	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-27 08:30:00+00	2025-10-27 09:30:00+00	t	\N	\N
ce125e8b-63c6-4d6b-b7d4-bc07e4b25eb2	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-27 09:30:00+00	2025-10-27 10:30:00+00	t	\N	\N
57a4d00e-6987-473a-b45d-912fdce1f963	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-27 10:30:00+00	2025-10-27 11:30:00+00	t	\N	\N
80b38729-5d3f-4546-aa45-fc79df3fce9a	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-27 11:30:00+00	2025-10-27 12:30:00+00	t	\N	\N
93c9d39b-6d12-408e-b2e2-1280e3cb7450	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-27 12:30:00+00	2025-10-27 13:30:00+00	t	\N	\N
26ee0b45-19af-4742-8cc3-e9904156b0a2	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-27 13:30:00+00	2025-10-27 14:30:00+00	t	\N	\N
daed2666-b967-45dd-85d9-015a00d9576b	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-27 14:30:00+00	2025-10-27 15:30:00+00	t	\N	\N
b48b9c76-267c-4193-874b-c84958130d03	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-28 04:30:00+00	2025-10-28 05:30:00+00	t	\N	\N
6a98b7c0-df84-44c0-ba0b-1158759b396a	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-28 06:30:00+00	2025-10-28 07:30:00+00	t	\N	\N
40c7cdaa-6ef6-4f98-b071-48e7cf61f132	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-28 07:30:00+00	2025-10-28 08:30:00+00	t	\N	\N
d9a916bd-d50a-4771-829d-e4132602de12	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-28 08:30:00+00	2025-10-28 09:30:00+00	t	\N	\N
fa5ae45f-6dd4-4986-b8ae-72b67a8bce5f	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-28 09:30:00+00	2025-10-28 10:30:00+00	t	\N	\N
cf461828-32d9-4649-9077-772848100805	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-28 10:30:00+00	2025-10-28 11:30:00+00	t	\N	\N
4373bcae-9b6c-4d9c-9ebd-36b6973064a4	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-28 11:30:00+00	2025-10-28 12:30:00+00	t	\N	\N
c31a0446-d84b-4474-972b-93772a5d6402	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-28 12:30:00+00	2025-10-28 13:30:00+00	t	\N	\N
7a79a959-8074-4e79-ae8f-0ae4fdc34099	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-28 13:30:00+00	2025-10-28 14:30:00+00	t	\N	\N
5e62fe09-c524-497c-bf7f-6ddf13546faf	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-28 14:30:00+00	2025-10-28 15:30:00+00	t	\N	\N
d925f80f-eece-4162-8d6d-0a81a63d014d	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-29 03:30:00+00	2025-10-29 04:30:00+00	t	\N	\N
06e7c440-8cf8-4a2b-8cf4-182bfd1a305b	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-29 04:30:00+00	2025-10-29 05:30:00+00	t	\N	\N
05926831-c7a7-467f-b539-4d22b191544f	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-29 05:30:00+00	2025-10-29 06:30:00+00	t	\N	\N
e4454ef7-9e42-4840-b5fd-da9cbcac32e9	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-29 06:30:00+00	2025-10-29 07:30:00+00	t	\N	\N
e62a2f3b-f19b-4a43-b0e5-eaca1f60c78b	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-29 07:30:00+00	2025-10-29 08:30:00+00	t	\N	\N
2e6cb9dc-d276-41f1-87d3-56023562eaed	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-29 08:30:00+00	2025-10-29 09:30:00+00	t	\N	\N
e12543af-06a4-40e6-88eb-1db4f82a68b3	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-29 09:30:00+00	2025-10-29 10:30:00+00	t	\N	\N
df588b72-9f39-42bd-97e2-39ce159726f4	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-29 10:30:00+00	2025-10-29 11:30:00+00	t	\N	\N
4bfc9135-7ed3-4a61-a52e-4c732e69d383	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-29 11:30:00+00	2025-10-29 12:30:00+00	t	\N	\N
65f40259-2c52-4e82-8da4-29094d191f49	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-29 12:30:00+00	2025-10-29 13:30:00+00	t	\N	\N
6a8e3e57-c002-487c-85b8-a4a3226d7b1b	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-29 13:30:00+00	2025-10-29 14:30:00+00	t	\N	\N
fc726c29-10a3-411a-89d4-4b2577650b38	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-29 14:30:00+00	2025-10-29 15:30:00+00	t	\N	\N
92908011-45a0-4afd-9d36-254a0c26a209	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-26 03:30:00+00	2025-10-26 04:30:00+00	f	\N	\N
81d1f813-7ae8-43e6-b558-41aeed78feda	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-24 10:30:00+00	2025-10-24 11:30:00+00	f	\N	\N
652fe316-3d4e-40ac-877d-05f1f0bfed82	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-28 05:30:00+00	2025-10-28 06:30:00+00	f	\N	\N
122f9520-032c-49a2-83fe-caebfd94d4bc	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-30 03:30:00+00	2025-10-30 04:30:00+00	t	\N	\N
3de05709-b296-4480-a564-9aee24732d5a	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-30 04:30:00+00	2025-10-30 05:30:00+00	t	\N	\N
edba70d2-0608-4943-9452-90fea321c1ad	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-30 05:30:00+00	2025-10-30 06:30:00+00	t	\N	\N
f2e445c5-8240-4c42-98bd-054690d3f786	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-30 06:30:00+00	2025-10-30 07:30:00+00	t	\N	\N
ff868217-938e-4126-80ec-5edac0b94dc8	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-30 07:30:00+00	2025-10-30 08:30:00+00	t	\N	\N
d8eb751b-a8ff-484d-a404-1647ef07773e	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-30 08:30:00+00	2025-10-30 09:30:00+00	t	\N	\N
06e63ea4-065c-4cd9-9395-5e85aaa52a1c	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-30 09:30:00+00	2025-10-30 10:30:00+00	t	\N	\N
e1e6b8c7-e1df-4b5a-a3db-ae1f296d2bd7	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-30 10:30:00+00	2025-10-30 11:30:00+00	t	\N	\N
5ba6641a-1315-4c03-88b6-11eb626fdbf3	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-30 11:30:00+00	2025-10-30 12:30:00+00	t	\N	\N
619a9d97-8f12-4f5e-9274-2d02b1fd6946	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-30 12:30:00+00	2025-10-30 13:30:00+00	t	\N	\N
f8837e17-d9a7-4822-afe8-6ed5f3d79335	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-30 13:30:00+00	2025-10-30 14:30:00+00	t	\N	\N
09d3943a-10de-4191-aa10-6ffba05fa2ba	9566ee54-1213-482b-b766-6d0f87c88776	2025-10-30 14:30:00+00	2025-10-30 15:30:00+00	t	\N	\N
67ca3648-87b4-40ac-9224-47eb24732603	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-23 03:30:00+00	2025-10-23 04:30:00+00	t	\N	\N
82ff7e1f-9cd4-4953-b0c1-96cfe8b095a4	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-23 04:30:00+00	2025-10-23 05:30:00+00	t	\N	\N
d125d10d-66d1-4ae2-b4ba-49471276fc81	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-23 05:30:00+00	2025-10-23 06:30:00+00	t	\N	\N
062cf7f6-2d66-4357-aa51-17ec3d3ed902	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-23 06:30:00+00	2025-10-23 07:30:00+00	t	\N	\N
e5d3dced-7b67-4811-94ee-c88ced868c01	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-23 07:30:00+00	2025-10-23 08:30:00+00	t	\N	\N
052c2d71-56c7-4c12-be5e-7a3be22acabe	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-23 08:30:00+00	2025-10-23 09:30:00+00	t	\N	\N
96476356-f18b-4604-9832-1a1a05c3af9c	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-23 09:30:00+00	2025-10-23 10:30:00+00	t	\N	\N
333fa94a-4938-47e3-aeef-11bc1d00fd9f	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-23 10:30:00+00	2025-10-23 11:30:00+00	t	\N	\N
f96460fb-354e-4c18-95ad-82e1260f3078	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-23 11:30:00+00	2025-10-23 12:30:00+00	t	\N	\N
a8f50826-b095-479c-b3f2-870605ef38a1	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-23 12:30:00+00	2025-10-23 13:30:00+00	t	\N	\N
4ba71e52-208c-4ded-ba1a-4c22bb792c1c	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-23 13:30:00+00	2025-10-23 14:30:00+00	t	\N	\N
60188bc1-5c18-436f-9a83-4c0f8f038e64	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-24 03:30:00+00	2025-10-24 04:30:00+00	t	\N	\N
49754b65-f337-45eb-9e6c-31c54ba59ad5	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-24 04:30:00+00	2025-10-24 05:30:00+00	t	\N	\N
42bf4be1-12e5-4d23-9c07-39f54b998700	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-24 05:30:00+00	2025-10-24 06:30:00+00	t	\N	\N
4d940f99-9c8c-45c0-b568-4b3ace363de9	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-24 06:30:00+00	2025-10-24 07:30:00+00	t	\N	\N
ddd576eb-1d9a-426c-82e4-41b0baaec56d	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-24 07:30:00+00	2025-10-24 08:30:00+00	t	\N	\N
3d7e6ae4-c460-4287-8925-3a466fc7e813	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-24 08:30:00+00	2025-10-24 09:30:00+00	t	\N	\N
aa8c2b77-c15b-4ebe-86b4-dfe2401b05dc	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-24 09:30:00+00	2025-10-24 10:30:00+00	t	\N	\N
ed061c94-509a-4448-937b-4f83dfaaa749	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-24 10:30:00+00	2025-10-24 11:30:00+00	t	\N	\N
2e49e4bb-0fc3-4cbd-b2dd-eb5fa031ce2f	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-24 11:30:00+00	2025-10-24 12:30:00+00	t	\N	\N
530eaa49-dc84-41a4-8391-1fb63521f616	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-24 12:30:00+00	2025-10-24 13:30:00+00	t	\N	\N
dec36212-9b09-4740-8c6f-794d69c7cb8c	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-24 13:30:00+00	2025-10-24 14:30:00+00	t	\N	\N
ac3cee85-a72b-4569-bea5-33e2793c76de	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-24 14:30:00+00	2025-10-24 15:30:00+00	t	\N	\N
f79b2ada-4663-458d-9171-8662978640d7	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-25 03:30:00+00	2025-10-25 04:30:00+00	t	\N	\N
f6e86ad2-e9e0-4143-8101-97e06a93160f	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-25 04:30:00+00	2025-10-25 05:30:00+00	t	\N	\N
03032384-1285-4e69-a9a6-16835170fbb9	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-25 05:30:00+00	2025-10-25 06:30:00+00	t	\N	\N
19bb18cf-e802-4f65-88f9-11606e5ab2f1	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-25 06:30:00+00	2025-10-25 07:30:00+00	t	\N	\N
75e39b88-30d7-441a-8a3e-d8a257df9139	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-25 07:30:00+00	2025-10-25 08:30:00+00	t	\N	\N
6ae16918-2b2d-4715-b3b1-2d8ad9577d36	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-25 08:30:00+00	2025-10-25 09:30:00+00	t	\N	\N
a4ba877b-e913-4ba6-8400-fc1fcfcc577c	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-25 09:30:00+00	2025-10-25 10:30:00+00	t	\N	\N
59c28a54-bf33-4f0a-b007-cb6daf8c0416	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-25 10:30:00+00	2025-10-25 11:30:00+00	t	\N	\N
5391f4cb-f270-4410-af2b-2737d6485a48	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-25 11:30:00+00	2025-10-25 12:30:00+00	t	\N	\N
70ffea8f-7e28-44d2-a48e-d535f9d4fc2d	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-25 12:30:00+00	2025-10-25 13:30:00+00	t	\N	\N
1e26b343-8c09-46ff-bb23-7502fabcdbad	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-25 13:30:00+00	2025-10-25 14:30:00+00	t	\N	\N
84634c7b-8b6c-48d5-8f42-634a7e333b76	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-25 14:30:00+00	2025-10-25 15:30:00+00	t	\N	\N
8fceed98-1f79-4ab0-a234-26f4c2d51357	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-26 03:30:00+00	2025-10-26 04:30:00+00	t	\N	\N
9860005d-4a82-4afc-973e-b0afbaa16f36	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-26 04:30:00+00	2025-10-26 05:30:00+00	t	\N	\N
c05a9aa5-a32c-4ae2-a978-4201d32a5c5a	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-26 05:30:00+00	2025-10-26 06:30:00+00	t	\N	\N
a30ba9b2-cd51-4597-b3e0-fe8aa7db5738	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-26 06:30:00+00	2025-10-26 07:30:00+00	t	\N	\N
95ed075c-d82d-4217-b874-270fd0fa59ba	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-26 07:30:00+00	2025-10-26 08:30:00+00	t	\N	\N
666196db-fd9e-4958-8222-44b28baeae73	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-26 08:30:00+00	2025-10-26 09:30:00+00	t	\N	\N
3e3a6db1-7e32-431d-836e-424ae6a6d38d	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-26 09:30:00+00	2025-10-26 10:30:00+00	t	\N	\N
75fbb44f-51d6-44b2-872f-0bb29335bfac	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-26 10:30:00+00	2025-10-26 11:30:00+00	t	\N	\N
1b133b5f-80c4-4962-90a1-1d160170d12c	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-26 11:30:00+00	2025-10-26 12:30:00+00	t	\N	\N
f2d447bc-12d3-4cea-9e30-6c5f524938a1	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-26 12:30:00+00	2025-10-26 13:30:00+00	t	\N	\N
6f863ee1-d9d2-4143-9121-25bd21747dfb	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-26 13:30:00+00	2025-10-26 14:30:00+00	t	\N	\N
e652faa1-5e69-445b-923d-236119cf04a2	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-26 14:30:00+00	2025-10-26 15:30:00+00	t	\N	\N
dd5863c4-c872-4d7d-9639-9725dfd89ebb	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-27 03:30:00+00	2025-10-27 04:30:00+00	t	\N	\N
a82a3bc5-d776-4406-b266-8d40667dd243	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-27 04:30:00+00	2025-10-27 05:30:00+00	t	\N	\N
64bdb0f6-6164-4bb2-a962-584a9dafe3d5	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-27 05:30:00+00	2025-10-27 06:30:00+00	t	\N	\N
e73645f8-5964-4380-a5b9-a411397f3824	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-27 06:30:00+00	2025-10-27 07:30:00+00	t	\N	\N
84f0ff25-51d7-4c00-9098-9c5e703e8cbe	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-27 07:30:00+00	2025-10-27 08:30:00+00	t	\N	\N
e0221b23-d8f7-4282-9859-2800f4074bcc	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-27 08:30:00+00	2025-10-27 09:30:00+00	t	\N	\N
6314dc8a-7d68-498f-a27e-4be9d65154c5	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-27 09:30:00+00	2025-10-27 10:30:00+00	t	\N	\N
ae7e8527-6727-44fe-9861-ea3466b45403	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-27 10:30:00+00	2025-10-27 11:30:00+00	t	\N	\N
73912f24-a064-4acf-8782-0a6c4e752b49	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-27 11:30:00+00	2025-10-27 12:30:00+00	t	\N	\N
b23a42ea-9cc2-450d-9c51-6d24e3eb2836	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-27 12:30:00+00	2025-10-27 13:30:00+00	t	\N	\N
0df401aa-8acc-4008-b817-1748ad20256b	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-27 13:30:00+00	2025-10-27 14:30:00+00	t	\N	\N
3350be08-ea78-42de-a1a2-ec91c9f3d553	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-27 14:30:00+00	2025-10-27 15:30:00+00	t	\N	\N
d988b1d0-a8f1-4ade-a908-8bf9a546fa35	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-28 03:30:00+00	2025-10-28 04:30:00+00	t	\N	\N
8e09219a-f74e-475a-9041-86fe02562bb7	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-28 04:30:00+00	2025-10-28 05:30:00+00	t	\N	\N
6c26167e-5970-4f21-9b38-1afc3a272765	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-28 05:30:00+00	2025-10-28 06:30:00+00	t	\N	\N
53f7b3d6-b59d-4fcf-b599-c1b48ec89b19	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-28 06:30:00+00	2025-10-28 07:30:00+00	t	\N	\N
0b285b43-97d4-4d70-be76-27fbdda977c1	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-28 07:30:00+00	2025-10-28 08:30:00+00	t	\N	\N
04bf422d-d669-476c-9df7-481b9933ecdc	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-28 08:30:00+00	2025-10-28 09:30:00+00	t	\N	\N
f39b0b4c-2cd9-4078-9c2d-0180ca468018	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-28 09:30:00+00	2025-10-28 10:30:00+00	t	\N	\N
008b48aa-d693-4a5b-b7e3-3b26bfc93666	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-28 10:30:00+00	2025-10-28 11:30:00+00	t	\N	\N
20f332c9-009d-4a64-baa4-df9a6c1740a4	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-28 11:30:00+00	2025-10-28 12:30:00+00	t	\N	\N
6b088dc8-6382-413f-8ae2-2f310a4a7179	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-28 12:30:00+00	2025-10-28 13:30:00+00	t	\N	\N
fb6f6e9b-c639-47ae-864e-ba1cd62b25f9	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-28 13:30:00+00	2025-10-28 14:30:00+00	t	\N	\N
4e29aaad-3307-449f-bded-4821ede3077d	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-28 14:30:00+00	2025-10-28 15:30:00+00	t	\N	\N
a3d6bf99-1636-4ee4-8e59-a83df818c3a2	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-29 03:30:00+00	2025-10-29 04:30:00+00	t	\N	\N
4ff89783-0e2c-428a-871d-06fdbbd46623	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-29 04:30:00+00	2025-10-29 05:30:00+00	t	\N	\N
25e6bdfd-0153-4af9-a1e9-57eaf77a4a4a	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-29 05:30:00+00	2025-10-29 06:30:00+00	t	\N	\N
c7686356-fab3-4d82-ae3e-3f60c4319d75	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-29 06:30:00+00	2025-10-29 07:30:00+00	t	\N	\N
4ebf9d4b-7f11-4db0-a3ce-d195167defde	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-29 07:30:00+00	2025-10-29 08:30:00+00	t	\N	\N
95320a38-b5f9-4aba-8a27-e8c46ee52479	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-29 08:30:00+00	2025-10-29 09:30:00+00	t	\N	\N
74fb431e-6b19-4763-9afb-3ca95a650bd0	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-29 09:30:00+00	2025-10-29 10:30:00+00	t	\N	\N
556f16e8-391e-4c3b-82a3-a98255afe9a6	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-29 10:30:00+00	2025-10-29 11:30:00+00	t	\N	\N
8fe672c0-81c9-4898-a97f-8aff2f6eda6b	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-29 11:30:00+00	2025-10-29 12:30:00+00	t	\N	\N
ae07f669-febf-4f53-899f-67266302e5b0	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-29 12:30:00+00	2025-10-29 13:30:00+00	t	\N	\N
fab45c26-e06e-4c07-ab2c-c5f904cac691	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-29 13:30:00+00	2025-10-29 14:30:00+00	t	\N	\N
7edb5a2e-e5ed-4338-9a17-e433e3bed08f	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-29 14:30:00+00	2025-10-29 15:30:00+00	t	\N	\N
43e3a2a4-3aa3-4b54-9f0a-f36c3653ebe7	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-30 03:30:00+00	2025-10-30 04:30:00+00	t	\N	\N
5d53f31b-37d1-40f4-8525-c66d91739b3e	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-30 04:30:00+00	2025-10-30 05:30:00+00	t	\N	\N
03fc67ed-8fc4-458f-a2c0-8d68dc45b866	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-30 05:30:00+00	2025-10-30 06:30:00+00	t	\N	\N
cd47776e-5daa-4794-801c-207233d77f29	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-30 06:30:00+00	2025-10-30 07:30:00+00	t	\N	\N
b8a66c9d-0fef-468c-8909-192414b66aca	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-30 07:30:00+00	2025-10-30 08:30:00+00	t	\N	\N
2307b8f8-8162-40cf-adc7-35277a5fe4fb	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-30 08:30:00+00	2025-10-30 09:30:00+00	t	\N	\N
50cb711e-f71e-4db9-a5d0-fe5ae9bdb5e1	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-30 09:30:00+00	2025-10-30 10:30:00+00	t	\N	\N
62705d47-3440-4a03-9e1d-5a5be0576c02	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-30 10:30:00+00	2025-10-30 11:30:00+00	t	\N	\N
b94f39df-80d6-4910-a9c7-c6bad9848169	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-30 11:30:00+00	2025-10-30 12:30:00+00	t	\N	\N
3185763d-3d69-420b-b9c1-8c23f9bb6019	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-30 12:30:00+00	2025-10-30 13:30:00+00	t	\N	\N
a382e076-49ea-4a5f-8f3e-9d8a4bc72394	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-30 13:30:00+00	2025-10-30 14:30:00+00	t	\N	\N
ed174fa5-b018-4d87-9083-ebfa4ddd1a50	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-30 14:30:00+00	2025-10-30 15:30:00+00	t	\N	\N
ccb0837d-d7d3-4f56-99a7-610e14389e2c	ac55c1c9-cfb3-4ad6-a099-ffaee8470547	2025-10-23 14:30:00+00	2025-10-23 15:30:00+00	f	\N	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, username, email, first_name, last_name, phone_number, role, credit_balance, points_balance, registration_date, last_login, status, avatar_url, updated_at) FROM stdin;
bb3e7bae-8aed-4e6c-bb71-bd644eff5402	swayam	otherswayam@gmail.com	swayam	shah	6353040453	player	0.00	0.00	\N	\N	active	https://okgeuiooqfqdxxqxjeod.supabase.co/storage/v1/object/public/avatars/bb3e7bae-8aed-4e6c-bb71-bd644eff5402/bb3e7bae-8aed-4e6c-bb71-bd644eff5402.jpg?t=1759079630968	2025-09-28 17:13:50.968+00
e86f726e-9210-47ca-8dc7-c84d46cc55e2	admin	admin@playnation.com	admin	\N	\N	admin	0.00	0.00	\N	\N	active	\N	\N
c90139a0-2de3-4237-89b8-032367f73a37	surbhi	surbhiroy780@gmail.com	srubhi	roy	07852156984	venue_owner	0.00	0.00	\N	\N	active	\N	\N
38f0c23d-4d25-42cd-8ec0-426d6636eecd	fenill	fenil@gmail.com	fenil	pastagia	7586214860	player	0.00	0.00	\N	\N	active	\N	\N
073c625c-eb02-45e8-9c67-50acbdc72cd6	harsh	harsh@gmail.com	harsh	shah	09426775977	venue_owner	0.00	0.00	\N	\N	active	https://okgeuiooqfqdxxqxjeod.supabase.co/storage/v1/object/public/avatars/073c625c-eb02-45e8-9c67-50acbdc72cd6/073c625c-eb02-45e8-9c67-50acbdc72cd6.jpg?t=1760301448757	2025-10-12 20:37:28.757+00
\.


--
-- Data for Name: venues; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.venues (venue_id, owner_id, name, address, city, state, zip_code, description, contact_email, contact_phone, latitude, longitude, opening_time, closing_time, is_approved, created_at, updated_at, image_url, rejection_reason, booking_window_days) FROM stdin;
0a5d58bf-2471-4e36-9a5d-3485be962dee	073c625c-eb02-45e8-9c67-50acbdc72cd6	Stark Club	VIP Road	Surat	Gujarat			harsh@gmail.com	8765876587	\N	\N	06:00:00	23:00:00	t	\N	\N	{https://okgeuiooqfqdxxqxjeod.supabase.co/storage/v1/object/public/venue-images/073c625c-eb02-45e8-9c67-50acbdc72cd6/1759537452338-iron-man.jpg,https://okgeuiooqfqdxxqxjeod.supabase.co/storage/v1/object/public/venue-images/venue-images/073c625c-eb02-45e8-9c67-50acbdc72cd6/ee802bc6-bb91-495c-9d2a-9989d537ed9f.jpg,https://okgeuiooqfqdxxqxjeod.supabase.co/storage/v1/object/public/venue-images/venue-images/073c625c-eb02-45e8-9c67-50acbdc72cd6/7037689e-40ff-4e29-99dd-d2da6b386455.jpg}	\N	7
8534d12f-5f7b-43fd-80ac-82e6c59ba9ad	073c625c-eb02-45e8-9c67-50acbdc72cd6	Fast & Furies	VIP Road	Surat	Gujarat			harsh@gmail.com	08765876587	\N	\N	06:00:00	23:00:00	t	\N	\N	{https://okgeuiooqfqdxxqxjeod.supabase.co/storage/v1/object/public/venue-images/073c625c-eb02-45e8-9c67-50acbdc72cd6/1759537696839-fast-and-furious-v11raaj1ea90khx1.jpg,https://okgeuiooqfqdxxqxjeod.supabase.co/storage/v1/object/public/venue-images/venue-images/073c625c-eb02-45e8-9c67-50acbdc72cd6/e253210d-7fcf-4aca-a129-e9a546cae2e3.jpg,https://okgeuiooqfqdxxqxjeod.supabase.co/storage/v1/object/public/venue-images/venue-images/073c625c-eb02-45e8-9c67-50acbdc72cd6/5afff5e2-865e-4ee1-bd44-87076cdb3ea8.jpg}	\N	7
1f72fb3d-916d-477a-9e2e-5abd9e21c4da	c90139a0-2de3-4237-89b8-032367f73a37	Fun & Play	Rander	Surat	Gujarat			harsh@gmail.com	228522252	\N	\N	06:00:00	23:00:00	t	\N	\N	{https://okgeuiooqfqdxxqxjeod.supabase.co/storage/v1/object/public/venue-images/c90139a0-2de3-4237-89b8-032367f73a37/1759538312472-OIP%20(2).webp}	\N	7
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2025-08-05 19:09:07
20211116045059	2025-08-05 19:09:08
20211116050929	2025-08-05 19:09:09
20211116051442	2025-08-05 19:09:09
20211116212300	2025-08-05 19:09:10
20211116213355	2025-08-05 19:09:11
20211116213934	2025-08-05 19:09:11
20211116214523	2025-08-05 19:09:12
20211122062447	2025-08-05 19:09:13
20211124070109	2025-08-05 19:09:14
20211202204204	2025-08-05 19:09:14
20211202204605	2025-08-05 19:09:15
20211210212804	2025-08-05 19:09:17
20211228014915	2025-08-05 19:09:17
20220107221237	2025-08-05 19:09:18
20220228202821	2025-08-05 19:09:19
20220312004840	2025-08-05 19:09:19
20220603231003	2025-08-05 19:09:20
20220603232444	2025-08-05 19:09:21
20220615214548	2025-08-05 19:09:22
20220712093339	2025-08-05 19:09:22
20220908172859	2025-08-05 19:09:23
20220916233421	2025-08-05 19:09:24
20230119133233	2025-08-05 19:09:24
20230128025114	2025-08-05 19:09:25
20230128025212	2025-08-05 19:09:26
20230227211149	2025-08-05 19:09:26
20230228184745	2025-08-05 19:09:27
20230308225145	2025-08-05 19:09:28
20230328144023	2025-08-05 19:09:28
20231018144023	2025-08-05 19:09:29
20231204144023	2025-08-05 19:09:30
20231204144024	2025-08-05 19:09:31
20231204144025	2025-08-05 19:09:31
20240108234812	2025-08-05 19:09:32
20240109165339	2025-08-05 19:09:33
20240227174441	2025-08-05 19:09:34
20240311171622	2025-08-05 19:09:35
20240321100241	2025-08-05 19:09:36
20240401105812	2025-08-05 19:09:38
20240418121054	2025-08-05 19:09:39
20240523004032	2025-08-05 19:09:41
20240618124746	2025-08-05 19:09:42
20240801235015	2025-08-05 19:09:42
20240805133720	2025-08-05 19:09:43
20240827160934	2025-08-05 19:09:43
20240919163303	2025-08-05 19:09:44
20240919163305	2025-08-05 19:09:45
20241019105805	2025-08-05 19:09:46
20241030150047	2025-08-05 19:09:48
20241108114728	2025-08-05 19:09:49
20241121104152	2025-08-05 19:09:49
20241130184212	2025-08-05 19:09:50
20241220035512	2025-08-05 19:09:51
20241220123912	2025-08-05 19:09:51
20241224161212	2025-08-05 19:09:52
20250107150512	2025-08-05 19:09:53
20250110162412	2025-08-05 19:09:53
20250123174212	2025-08-05 19:09:54
20250128220012	2025-08-05 19:09:55
20250506224012	2025-08-05 19:09:55
20250523164012	2025-08-05 19:09:56
20250714121412	2025-08-05 19:09:56
20250905041441	2025-09-26 15:35:56
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) FROM stdin;
venue-images	venue-images	\N	2025-08-09 11:48:27.119271+00	2025-08-09 11:48:27.119271+00	t	f	\N	\N	\N	STANDARD
offer-backgrounds	offer-backgrounds	\N	2025-09-21 12:34:39.741028+00	2025-09-21 12:34:39.741028+00	f	f	\N	\N	\N	STANDARD
avatars	avatars	\N	2025-09-21 21:09:01.659816+00	2025-09-21 21:09:01.659816+00	t	f	10485760	\N	\N	STANDARD
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_analytics (id, type, format, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2025-08-05 19:08:37.576661
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2025-08-05 19:08:37.589828
2	storage-schema	5c7968fd083fcea04050c1b7f6253c9771b99011	2025-08-05 19:08:37.595557
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2025-08-05 19:08:37.647548
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2025-08-05 19:08:37.72751
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2025-08-05 19:08:37.733095
6	change-column-name-in-get-size	f93f62afdf6613ee5e7e815b30d02dc990201044	2025-08-05 19:08:37.73954
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2025-08-05 19:08:37.746048
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2025-08-05 19:08:37.751115
9	fix-search-function	3a0af29f42e35a4d101c259ed955b67e1bee6825	2025-08-05 19:08:37.756931
10	search-files-search-function	68dc14822daad0ffac3746a502234f486182ef6e	2025-08-05 19:08:37.764419
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2025-08-05 19:08:37.770265
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2025-08-05 19:08:37.77894
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2025-08-05 19:08:37.786166
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2025-08-05 19:08:37.792056
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2025-08-05 19:08:37.820163
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2025-08-05 19:08:37.825603
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2025-08-05 19:08:37.830839
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2025-08-05 19:08:37.839178
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2025-08-05 19:08:37.846363
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2025-08-05 19:08:37.851713
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2025-08-05 19:08:37.86092
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2025-08-05 19:08:37.877417
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2025-08-05 19:08:37.892258
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2025-08-05 19:08:37.897879
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2025-08-05 19:08:37.9032
26	objects-prefixes	ef3f7871121cdc47a65308e6702519e853422ae2	2025-08-09 17:34:40.948128
27	search-v2	33b8f2a7ae53105f028e13e9fcda9dc4f356b4a2	2025-08-09 17:34:41.137688
28	object-bucket-name-sorting	ba85ec41b62c6a30a3f136788227ee47f311c436	2025-08-09 17:34:41.347841
29	create-prefixes	a7b1a22c0dc3ab630e3055bfec7ce7d2045c5b7b	2025-08-09 17:34:41.443964
30	update-object-levels	6c6f6cc9430d570f26284a24cf7b210599032db7	2025-08-09 17:34:41.648713
31	objects-level-index	33f1fef7ec7fea08bb892222f4f0f5d79bab5eb8	2025-08-09 17:34:41.842834
32	backward-compatible-index-on-objects	2d51eeb437a96868b36fcdfb1ddefdf13bef1647	2025-08-09 17:34:41.94958
33	backward-compatible-index-on-prefixes	fe473390e1b8c407434c0e470655945b110507bf	2025-08-09 17:34:42.140597
34	optimize-search-function-v1	82b0e469a00e8ebce495e29bfa70a0797f7ebd2c	2025-08-09 17:34:42.151379
35	add-insert-trigger-prefixes	63bb9fd05deb3dc5e9fa66c83e82b152f0caf589	2025-08-09 17:34:42.359173
36	optimise-existing-functions	81cf92eb0c36612865a18016a38496c530443899	2025-08-09 17:34:42.638782
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2025-08-09 17:34:42.750831
38	iceberg-catalog-flag-on-buckets	19a8bd89d5dfa69af7f222a46c726b7c41e462c5	2025-08-09 17:34:42.756
39	add-search-v2-sort-support	39cf7d1e6bf515f4b02e41237aba845a7b492853	2025-09-23 10:18:45.481983
40	fix-prefix-race-conditions-optimized	fd02297e1c67df25a9fc110bf8c8a9af7fb06d1f	2025-09-23 10:18:45.594847
41	add-object-level-update-trigger	44c22478bf01744b2129efc480cd2edc9a7d60e9	2025-09-25 15:59:30.547767
42	rollback-prefix-triggers	f2ab4f526ab7f979541082992593938c05ee4b47	2025-09-25 15:59:30.641176
43	fix-object-level	ab837ad8f1c7d00cc0b7310e989a23388ff29fc6	2025-09-25 15:59:30.666214
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata, level) FROM stdin;
4e2341a3-5cd0-444e-a667-2d471e6f9377	venue-images	venue_16a86a6d-c300-4cda-bebf-9bc74ddfb8cc_1756483481340.jpg	c90139a0-2de3-4237-89b8-032367f73a37	2025-08-29 16:05:40.358138+00	2025-08-29 16:05:40.358138+00	2025-08-29 16:05:40.358138+00	{"eTag": "\\"bfc033f61e35d8ac08528516dd38272e\\"", "size": 4479036, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-08-29T16:05:41.000Z", "contentLength": 4479036, "httpStatusCode": 200}	05515afa-7f76-4c3e-b608-389e07ec78bc	c90139a0-2de3-4237-89b8-032367f73a37	{}	1
405798bd-3acb-4e07-87bd-e95286d56634	venue-images	hero-playnation.jpg	\N	2025-08-09 11:51:04.245245+00	2025-08-09 17:34:41.540568+00	2025-08-09 11:51:04.245245+00	{"eTag": "\\"c13a5713e1463941e160cce15dcaabe7-1\\"", "size": 42571, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-08-09T11:51:04.000Z", "contentLength": 42571, "httpStatusCode": 200}	c742db23-7d40-477d-9227-44d6e1133f3a	\N	\N	1
7c24d814-d91c-4be8-93ce-3422a1c415d6	venue-images	073c625c-eb02-45e8-9c67-50acbdc72cd6/1759097503881-default-offer-bg.png	073c625c-eb02-45e8-9c67-50acbdc72cd6	2025-09-28 22:11:44.828165+00	2025-09-28 22:11:44.828165+00	2025-09-28 22:11:44.828165+00	{"eTag": "\\"933d2f04281f8b4e07a90cd77ec59764\\"", "size": 912705, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-28T22:11:45.000Z", "contentLength": 912705, "httpStatusCode": 200}	4067da7e-c1d0-4dd3-abf0-b17631866563	073c625c-eb02-45e8-9c67-50acbdc72cd6	{}	2
7d839e27-6dc5-44c2-81ce-818caa9ece1b	venue-images	c90139a0-2de3-4237-89b8-032367f73a37/1757949433233-20240515_163801.jpg	c90139a0-2de3-4237-89b8-032367f73a37	2025-09-15 15:17:25.330092+00	2025-09-15 15:17:25.330092+00	2025-09-15 15:17:25.330092+00	{"eTag": "\\"a410c3259680bcd1d0ec75fcf399a8d9\\"", "size": 3095858, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-09-15T15:17:26.000Z", "contentLength": 3095858, "httpStatusCode": 200}	c721ba4e-8678-455c-adb8-e1f9f0281328	c90139a0-2de3-4237-89b8-032367f73a37	{}	2
78b8a1ae-1696-4f0f-9fa2-0c529a002867	venue-images	c90139a0-2de3-4237-89b8-032367f73a37/1758565634985-tt-1716560931882.webp	c90139a0-2de3-4237-89b8-032367f73a37	2025-09-22 18:26:08.723371+00	2025-09-22 18:26:08.723371+00	2025-09-22 18:26:08.723371+00	{"eTag": "\\"938d55498e8f993a73312c6464665fd6\\"", "size": 226292, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-09-22T18:26:09.000Z", "contentLength": 226292, "httpStatusCode": 200}	df7c71fc-94f0-47dd-822f-f0a85e1697fd	c90139a0-2de3-4237-89b8-032367f73a37	{}	2
640a6f95-c200-4a7e-a12c-41ca581a40f8	venue-images	c90139a0-2de3-4237-89b8-032367f73a37/1758565657834-The-Turf-Arena-Box-cricket-and-Football-1.jpeg	c90139a0-2de3-4237-89b8-032367f73a37	2025-09-22 18:26:30.703296+00	2025-09-22 18:26:30.703296+00	2025-09-22 18:26:30.703296+00	{"eTag": "\\"055b127a6cc04dffa150e543e65f725e\\"", "size": 136470, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-09-22T18:26:31.000Z", "contentLength": 136470, "httpStatusCode": 200}	29fe95a8-551c-4f9b-9642-96fe87d1b635	c90139a0-2de3-4237-89b8-032367f73a37	{}	2
3dc12229-a1dd-47cf-8154-70ad38cd93d9	venue-images	c90139a0-2de3-4237-89b8-032367f73a37/1758626527096-terrace.jpg	c90139a0-2de3-4237-89b8-032367f73a37	2025-09-23 11:21:01.411655+00	2025-09-23 11:21:01.411655+00	2025-09-23 11:21:01.411655+00	{"eTag": "\\"a681d532c9eba37ebdba6e420c2ba209\\"", "size": 249884, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-09-23T11:21:02.000Z", "contentLength": 249884, "httpStatusCode": 200}	1b583fd6-5ac0-4edd-ba3b-53298887b22d	c90139a0-2de3-4237-89b8-032367f73a37	{}	2
214ecd58-a73b-41b1-90b2-d49d05130c07	venue-images	c90139a0-2de3-4237-89b8-032367f73a37/1758637114153-mno.jpg	c90139a0-2de3-4237-89b8-032367f73a37	2025-09-23 14:17:27.168647+00	2025-09-23 14:17:27.168647+00	2025-09-23 14:17:27.168647+00	{"eTag": "\\"f96a490b1524433fcc484008f400c140\\"", "size": 118981, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-09-23T14:17:28.000Z", "contentLength": 118981, "httpStatusCode": 200}	30290cfe-1e70-43c5-ab21-257f86ae0f7f	c90139a0-2de3-4237-89b8-032367f73a37	{}	2
fe9f9ec4-0534-4805-bdb2-b8ca25e97038	venue-images	venue-images/c90139a0-2de3-4237-89b8-032367f73a37/b2995af0-624d-4a1f-a641-f0773a73d0ac.jpg	c90139a0-2de3-4237-89b8-032367f73a37	2025-09-23 16:45:17.254997+00	2025-09-23 16:45:17.254997+00	2025-09-23 16:45:17.254997+00	{"eTag": "\\"f96a490b1524433fcc484008f400c140\\"", "size": 118981, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-09-23T16:45:18.000Z", "contentLength": 118981, "httpStatusCode": 200}	82a280d1-bc5d-4bed-b510-7195642c3c76	c90139a0-2de3-4237-89b8-032367f73a37	{}	3
e8102975-ac0c-4727-83c9-9d32bd741aa4	venue-images	c90139a0-2de3-4237-89b8-032367f73a37/1758647582437-20240516_212233.jpg	c90139a0-2de3-4237-89b8-032367f73a37	2025-09-23 17:13:13.476413+00	2025-09-23 17:13:13.476413+00	2025-09-23 17:13:13.476413+00	{"eTag": "\\"bfc033f61e35d8ac08528516dd38272e\\"", "size": 4479036, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-09-23T17:13:14.000Z", "contentLength": 4479036, "httpStatusCode": 200}	fe1c065f-9e1a-4ee8-a6aa-68496994a88a	c90139a0-2de3-4237-89b8-032367f73a37	{}	2
0a8cd284-215b-4e58-855c-2d3b152c032e	venue-images	c90139a0-2de3-4237-89b8-032367f73a37/1758647651536-20240518_163002.jpg	c90139a0-2de3-4237-89b8-032367f73a37	2025-09-23 17:14:23.05169+00	2025-09-23 17:14:23.05169+00	2025-09-23 17:14:23.05169+00	{"eTag": "\\"7a6832f1dc453e72bdc724d130c0812b-2\\"", "size": 6730830, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-09-23T17:14:23.000Z", "contentLength": 6730830, "httpStatusCode": 200}	3eccdcb0-98af-48b9-ad24-d1c6b5fa202e	c90139a0-2de3-4237-89b8-032367f73a37	{}	2
f63cfca0-3ff9-4524-9a75-f9589b403f11	venue-images	c90139a0-2de3-4237-89b8-032367f73a37/1758647726252-20240520_185020.jpg	c90139a0-2de3-4237-89b8-032367f73a37	2025-09-23 17:15:36.507403+00	2025-09-23 17:15:36.507403+00	2025-09-23 17:15:36.507403+00	{"eTag": "\\"7c49175ba688474c28d481addf3bfbfa\\"", "size": 3585772, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-09-23T17:15:37.000Z", "contentLength": 3585772, "httpStatusCode": 200}	a43449e1-d23d-4e85-bc0e-df46236bb1eb	c90139a0-2de3-4237-89b8-032367f73a37	{}	2
702cdfca-e97b-4fe0-91e5-1bb205294993	venue-images	c90139a0-2de3-4237-89b8-032367f73a37/1758647728267-20240522_212442.jpg	c90139a0-2de3-4237-89b8-032367f73a37	2025-09-23 17:15:38.839386+00	2025-09-23 17:15:38.839386+00	2025-09-23 17:15:38.839386+00	{"eTag": "\\"fe7f85a475821a19dda45e296d2fe778\\"", "size": 3972225, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-09-23T17:15:39.000Z", "contentLength": 3972225, "httpStatusCode": 200}	38be3f4a-e0ac-4006-baac-4e809166ab09	c90139a0-2de3-4237-89b8-032367f73a37	{}	2
8a687f37-aae0-4d04-8db6-77ce26ed450b	venue-images	c90139a0-2de3-4237-89b8-032367f73a37/1757949218183-20240511_112006.jpg	c90139a0-2de3-4237-89b8-032367f73a37	2025-09-15 15:13:49.956205+00	2025-09-15 15:13:49.956205+00	2025-09-15 15:13:49.956205+00	{"eTag": "\\"295e3920bbafda00fe134f6d2b3b65be\\"", "size": 3686349, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-09-15T15:13:50.000Z", "contentLength": 3686349, "httpStatusCode": 200}	27947250-0e79-4735-af7e-6fa3f47b2f0f	c90139a0-2de3-4237-89b8-032367f73a37	{}	2
5baa4251-4710-4e41-ba70-45d12286ddc1	offer-backgrounds	default-offer-bg.png	\N	2025-09-21 13:01:18.419984+00	2025-09-21 13:01:18.419984+00	2025-09-21 13:01:18.419984+00	{"eTag": "\\"973aaf46ed35975fd5696ab469260f0b-1\\"", "size": 912705, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-09-21T13:01:18.000Z", "contentLength": 912705, "httpStatusCode": 200}	0fc88769-0132-4726-9ce1-3007aaae339a	\N	\N	1
9ae2e349-4225-42f6-ba8e-c9d667e9e087	venue-images	c90139a0-2de3-4237-89b8-032367f73a37/1758623153873-tt-1716560931882.webp	c90139a0-2de3-4237-89b8-032367f73a37	2025-09-23 10:24:46.599581+00	2025-09-23 10:24:46.599581+00	2025-09-23 10:24:46.599581+00	{"eTag": "\\"938d55498e8f993a73312c6464665fd6\\"", "size": 226292, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-09-23T10:24:47.000Z", "contentLength": 226292, "httpStatusCode": 200}	dc2873c0-2f74-4336-8d29-04497b702331	c90139a0-2de3-4237-89b8-032367f73a37	{}	2
af5bf9e9-1a75-46ff-88c9-4573f3cbab82	venue-images	venue-pickleball.jpg	\N	2025-08-09 11:51:04.24646+00	2025-08-09 17:34:41.540568+00	2025-08-09 11:51:04.24646+00	{"eTag": "\\"70f5359a0bb7c9fb35ae894d2e6c52e2-1\\"", "size": 81937, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-08-09T11:51:04.000Z", "contentLength": 81937, "httpStatusCode": 200}	dc3fca7a-57bf-4500-979b-2fd71bba29b3	\N	\N	1
475337b8-d9ca-49ce-9ba8-247f50798d18	venue-images	venue-snooker.jpg	\N	2025-08-09 11:51:04.233952+00	2025-08-09 17:34:41.540568+00	2025-08-09 11:51:04.233952+00	{"eTag": "\\"1429a8b25a618567ffadf1d6c721c084-1\\"", "size": 78274, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-08-09T11:51:04.000Z", "contentLength": 78274, "httpStatusCode": 200}	c9c19d51-2070-47b9-a509-826fcf56d479	\N	\N	1
b2875b73-888a-463e-b9bc-a4c948ffbb9f	venue-images	venue-turf.jpg	\N	2025-08-09 11:51:04.179971+00	2025-08-09 17:34:41.540568+00	2025-08-09 11:51:04.179971+00	{"eTag": "\\"781b462416c485ca3678feb05a51882c-1\\"", "size": 129525, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-08-09T11:51:04.000Z", "contentLength": 129525, "httpStatusCode": 200}	447d1447-810a-4596-96ff-343ec9203830	\N	\N	1
acc49073-c5da-432a-be3d-91470d3a2e69	venue-images	c90139a0-2de3-4237-89b8-032367f73a37/1758623401856-tt-1716560931882.webp	c90139a0-2de3-4237-89b8-032367f73a37	2025-09-23 10:28:55.333497+00	2025-09-23 10:28:55.333497+00	2025-09-23 10:28:55.333497+00	{"eTag": "\\"938d55498e8f993a73312c6464665fd6\\"", "size": 226292, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-09-23T10:28:56.000Z", "contentLength": 226292, "httpStatusCode": 200}	7538fa7a-9319-492b-9bb2-1b185acb93b2	c90139a0-2de3-4237-89b8-032367f73a37	{}	2
538687c1-4e74-43af-b176-2136e9289d5b	venue-images	c90139a0-2de3-4237-89b8-032367f73a37/1758625730089-The-Turf-Arena-Box-cricket-and-Football-1.jpeg	c90139a0-2de3-4237-89b8-032367f73a37	2025-09-23 11:07:42.96002+00	2025-09-23 11:07:42.96002+00	2025-09-23 11:07:42.96002+00	{"eTag": "\\"055b127a6cc04dffa150e543e65f725e\\"", "size": 136470, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-09-23T11:07:43.000Z", "contentLength": 136470, "httpStatusCode": 200}	420f9ca7-78af-4a81-87d1-c537c2b230c7	c90139a0-2de3-4237-89b8-032367f73a37	{}	2
e7a69a53-73da-4ea4-bc61-919707efe816	venue-images	c90139a0-2de3-4237-89b8-032367f73a37/1758626118899-bcd.jpg	c90139a0-2de3-4237-89b8-032367f73a37	2025-09-23 11:14:11.68452+00	2025-09-23 11:14:11.68452+00	2025-09-23 11:14:11.68452+00	{"eTag": "\\"38467053b1b6acbcfd5b6961207a8da6\\"", "size": 44851, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-09-23T11:14:12.000Z", "contentLength": 44851, "httpStatusCode": 200}	175676b6-c4ec-4bf4-ad90-b471e26e7434	c90139a0-2de3-4237-89b8-032367f73a37	{}	2
88950849-0ff3-460f-83ee-1fd2eb6ba076	venue-images	c90139a0-2de3-4237-89b8-032367f73a37/1758637000060-xyz.avif	c90139a0-2de3-4237-89b8-032367f73a37	2025-09-23 14:15:32.010756+00	2025-09-23 14:15:32.010756+00	2025-09-23 14:15:32.010756+00	{"eTag": "\\"c523348f724b305adb46d5a97d2ff82a\\"", "size": 89690, "mimetype": "image/avif", "cacheControl": "max-age=3600", "lastModified": "2025-09-23T14:15:32.000Z", "contentLength": 89690, "httpStatusCode": 200}	db7722ea-25ab-4c88-b1cf-84fff5246cc8	c90139a0-2de3-4237-89b8-032367f73a37	{}	2
f40183f7-df4a-472f-ae90-30daba1eeb63	venue-images	c90139a0-2de3-4237-89b8-032367f73a37/1758644555222-bcd.jpg	c90139a0-2de3-4237-89b8-032367f73a37	2025-09-23 16:21:27.667909+00	2025-09-23 16:21:27.667909+00	2025-09-23 16:21:27.667909+00	{"eTag": "\\"38467053b1b6acbcfd5b6961207a8da6\\"", "size": 44851, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-09-23T16:21:28.000Z", "contentLength": 44851, "httpStatusCode": 200}	539ef29c-daef-4228-b92f-952a6a70fb3f	c90139a0-2de3-4237-89b8-032367f73a37	{}	2
ad96849b-3bef-4445-9301-791d67259aa5	venue-images	c90139a0-2de3-4237-89b8-032367f73a37/1758647650153-20240517_150704(0).jpg	c90139a0-2de3-4237-89b8-032367f73a37	2025-09-23 17:14:19.772912+00	2025-09-23 17:14:19.772912+00	2025-09-23 17:14:19.772912+00	{"eTag": "\\"64065f171a0b98869a3f73243f7bc055\\"", "size": 1050905, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-09-23T17:14:20.000Z", "contentLength": 1050905, "httpStatusCode": 200}	7d606f52-9664-4141-ace5-3e04d0ff051a	c90139a0-2de3-4237-89b8-032367f73a37	{}	2
c972b7cd-6061-41d7-8174-eac0b3f63309	venue-images	venue_16a86a6d-c300-4cda-bebf-9bc74ddfb8cc_1756483332071.jpg	c90139a0-2de3-4237-89b8-032367f73a37	2025-08-29 16:02:54.025559+00	2025-08-29 16:02:54.025559+00	2025-08-29 16:02:54.025559+00	{"eTag": "\\"697829300ee6229fedd4b4c638afe641\\"", "size": 2886572, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-08-29T16:02:54.000Z", "contentLength": 2886572, "httpStatusCode": 200}	529e4ace-d1bf-4591-a93f-40ba8efd8cc6	c90139a0-2de3-4237-89b8-032367f73a37	{}	1
a908b4d8-466f-4cc8-b920-d9f54d59df02	venue-images	c90139a0-2de3-4237-89b8-032367f73a37/1758647730652-20240523_181745.jpg	c90139a0-2de3-4237-89b8-032367f73a37	2025-09-23 17:15:41.025987+00	2025-09-23 17:15:41.025987+00	2025-09-23 17:15:41.025987+00	{"eTag": "\\"53ea3073d6c8adf3d80c0c1371f6db4b\\"", "size": 4012776, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-09-23T17:15:41.000Z", "contentLength": 4012776, "httpStatusCode": 200}	635f84a6-fa39-49e8-801e-39320d0f4067	c90139a0-2de3-4237-89b8-032367f73a37	{}	2
2fcd782a-e699-436a-afbb-1972eb499214	venue-images	073c625c-eb02-45e8-9c67-50acbdc72cd6/1759097503880-iron-man.jpg	073c625c-eb02-45e8-9c67-50acbdc72cd6	2025-09-28 22:11:45.096282+00	2025-09-28 22:11:45.096282+00	2025-09-28 22:11:45.096282+00	{"eTag": "\\"90c8b186cb74ecf23c35809a877ca21d\\"", "size": 1313142, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-09-28T22:11:45.000Z", "contentLength": 1313142, "httpStatusCode": 200}	c8345bb6-bc56-455c-a68b-57311211473b	073c625c-eb02-45e8-9c67-50acbdc72cd6	{}	2
ab9b2ecc-cea5-4f50-8175-4777af564b22	venue-images	venue-images/c90139a0-2de3-4237-89b8-032367f73a37/fcc8ce58-4b31-438c-b0c7-274451447775.jpg	c90139a0-2de3-4237-89b8-032367f73a37	2025-09-23 17:18:33.032943+00	2025-09-23 17:18:33.032943+00	2025-09-23 17:18:33.032943+00	{"eTag": "\\"9b848aac94588568d3dcf1a47afbb600\\"", "size": 9889, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-09-23T17:18:33.000Z", "contentLength": 9889, "httpStatusCode": 200}	bde80336-21a9-47b9-b4a4-5b2eb388d9ff	c90139a0-2de3-4237-89b8-032367f73a37	{}	3
05ce9453-c875-46d6-8543-752adafb55f4	venue-images	073c625c-eb02-45e8-9c67-50acbdc72cd6/1759381064583-founder group.jpg.png	073c625c-eb02-45e8-9c67-50acbdc72cd6	2025-10-02 04:57:52.217211+00	2025-10-02 04:57:52.217211+00	2025-10-02 04:57:52.217211+00	{"eTag": "\\"bc54dcf85963527c96ecb0126924edd3\\"", "size": 191315, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-10-02T04:57:53.000Z", "contentLength": 191315, "httpStatusCode": 200}	28775656-1a7d-498a-bc30-670a8fe2567e	073c625c-eb02-45e8-9c67-50acbdc72cd6	{}	2
44de0cb2-cebb-434d-b5a3-29660d94a5c7	venue-images	venue-images/c90139a0-2de3-4237-89b8-032367f73a37/25a9e8aa-bcbb-402c-8f2c-6c9ae0ecc113.jpg	c90139a0-2de3-4237-89b8-032367f73a37	2025-09-23 17:18:33.406383+00	2025-09-23 17:18:33.406383+00	2025-09-23 17:18:33.406383+00	{"eTag": "\\"7255d76f758b389bf4460735e507111f\\"", "size": 51966, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-09-23T17:18:34.000Z", "contentLength": 51966, "httpStatusCode": 200}	5efe6d5a-5579-4fad-9f92-08c0ecf13333	c90139a0-2de3-4237-89b8-032367f73a37	{}	3
8a87ad86-2e23-4743-a6ca-04362961ee2b	venue-images	venue-images/c90139a0-2de3-4237-89b8-032367f73a37/116b175f-40dd-489c-be35-a7c653011308.webp	c90139a0-2de3-4237-89b8-032367f73a37	2025-09-23 17:18:33.724428+00	2025-09-23 17:18:33.724428+00	2025-09-23 17:18:33.724428+00	{"eTag": "\\"4747b8de5ac3e7d28890165fb462fc3c\\"", "size": 30170, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-09-23T17:18:34.000Z", "contentLength": 30170, "httpStatusCode": 200}	565ea021-6ba7-4b1c-b58f-f021ca1afc25	c90139a0-2de3-4237-89b8-032367f73a37	{}	3
952783ec-efbe-45d6-9ef4-e85bc7880fc1	venue-images	073c625c-eb02-45e8-9c67-50acbdc72cd6/1759381445949-founder group.jpg.png	073c625c-eb02-45e8-9c67-50acbdc72cd6	2025-10-02 05:04:13.719385+00	2025-10-02 05:04:13.719385+00	2025-10-02 05:04:13.719385+00	{"eTag": "\\"bc54dcf85963527c96ecb0126924edd3\\"", "size": 191315, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-10-02T05:04:14.000Z", "contentLength": 191315, "httpStatusCode": 200}	9babf342-17d9-479d-8c79-e4edcd27e49a	073c625c-eb02-45e8-9c67-50acbdc72cd6	{}	2
0cf5bd64-a7d9-4757-a080-b7702f946b99	venue-images	venue-images/c90139a0-2de3-4237-89b8-032367f73a37/6523caf1-0779-4379-a3a4-780673f9a781.jpeg	c90139a0-2de3-4237-89b8-032367f73a37	2025-09-23 17:18:34.028845+00	2025-09-23 17:18:34.028845+00	2025-09-23 17:18:34.028845+00	{"eTag": "\\"1373c4e2dd3f46791c40daec552c9a58\\"", "size": 4838, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-09-23T17:18:34.000Z", "contentLength": 4838, "httpStatusCode": 200}	e7c11c7b-c978-4ed5-bffd-fcf4c17708ce	c90139a0-2de3-4237-89b8-032367f73a37	{}	3
fcabc56a-0b92-4693-9357-a873357ba01c	venue-images	073c625c-eb02-45e8-9c67-50acbdc72cd6/1759537452338-iron-man.jpg	073c625c-eb02-45e8-9c67-50acbdc72cd6	2025-10-04 00:24:13.89035+00	2025-10-04 00:24:13.89035+00	2025-10-04 00:24:13.89035+00	{"eTag": "\\"90c8b186cb74ecf23c35809a877ca21d\\"", "size": 1313142, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-10-04T00:24:14.000Z", "contentLength": 1313142, "httpStatusCode": 200}	d2ff9e2d-4185-4506-8cf1-1bf65b8d30ad	073c625c-eb02-45e8-9c67-50acbdc72cd6	{}	2
f602ea1e-7c74-4548-b27f-740151a7fb50	venue-images	073c625c-eb02-45e8-9c67-50acbdc72cd6/1759537696839-fast-and-furious-v11raaj1ea90khx1.jpg	073c625c-eb02-45e8-9c67-50acbdc72cd6	2025-10-04 00:28:17.648881+00	2025-10-04 00:28:17.648881+00	2025-10-04 00:28:17.648881+00	{"eTag": "\\"84fb2ceaf2dd48a2e7170f4d532d6944\\"", "size": 337609, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-10-04T00:28:18.000Z", "contentLength": 337609, "httpStatusCode": 200}	5b2093c0-1a71-4ded-a04f-e48cb3dffece	073c625c-eb02-45e8-9c67-50acbdc72cd6	{}	2
a9c23803-fc28-464d-9939-504b9bfd6a69	venue-images	venue-images/c90139a0-2de3-4237-89b8-032367f73a37/b12cf2e8-c90b-4349-b71f-4419e3a9c411.jpg	c90139a0-2de3-4237-89b8-032367f73a37	2025-09-23 17:24:30.501488+00	2025-09-23 17:24:30.501488+00	2025-09-23 17:24:30.501488+00	{"eTag": "\\"9b848aac94588568d3dcf1a47afbb600\\"", "size": 9889, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-09-23T17:24:31.000Z", "contentLength": 9889, "httpStatusCode": 200}	1c57b5f7-dc56-4e95-9800-8ac80618867c	c90139a0-2de3-4237-89b8-032367f73a37	{}	3
6b85a74b-9250-4451-aa96-d93853e8a383	venue-images	venue-images/c90139a0-2de3-4237-89b8-032367f73a37/842e2a23-bef4-409a-8320-c4b133f13a6d.jpg	c90139a0-2de3-4237-89b8-032367f73a37	2025-09-23 17:24:30.951504+00	2025-09-23 17:24:30.951504+00	2025-09-23 17:24:30.951504+00	{"eTag": "\\"9b848aac94588568d3dcf1a47afbb600\\"", "size": 9889, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-09-23T17:24:31.000Z", "contentLength": 9889, "httpStatusCode": 200}	367b8a8b-cb3b-481a-bf91-406fd8369cfd	c90139a0-2de3-4237-89b8-032367f73a37	{}	3
4deaf429-faad-41f6-81aa-a23d8f623adf	venue-images	venue-images/c90139a0-2de3-4237-89b8-032367f73a37/c69de97e-cee1-4675-a989-e83f3d075e42.jpg	c90139a0-2de3-4237-89b8-032367f73a37	2025-09-23 17:24:31.82633+00	2025-09-23 17:24:31.82633+00	2025-09-23 17:24:31.82633+00	{"eTag": "\\"7255d76f758b389bf4460735e507111f\\"", "size": 51966, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-09-23T17:24:32.000Z", "contentLength": 51966, "httpStatusCode": 200}	96c45942-0c48-4735-bcd0-589d1052eea7	c90139a0-2de3-4237-89b8-032367f73a37	{}	3
f61f62fe-a6be-4e94-a1a9-9b34567c61e9	venue-images	073c625c-eb02-45e8-9c67-50acbdc72cd6/1759154209237-Wallpaper1.jpg	073c625c-eb02-45e8-9c67-50acbdc72cd6	2025-09-29 13:56:54.537485+00	2025-09-29 13:56:54.537485+00	2025-09-29 13:56:54.537485+00	{"eTag": "\\"046fe391a1c19949189b025d18efa610\\"", "size": 77413, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-09-29T13:56:55.000Z", "contentLength": 77413, "httpStatusCode": 200}	95c4d09a-982c-4064-aefe-61cfcb02c1b7	073c625c-eb02-45e8-9c67-50acbdc72cd6	{}	2
96159015-dcf8-48a9-8963-a67c30ca8905	venue-images	venue-images/c90139a0-2de3-4237-89b8-032367f73a37/d7794a00-53d2-4ee2-a23d-44a17ef4dbde.webp	c90139a0-2de3-4237-89b8-032367f73a37	2025-09-23 17:24:32.301812+00	2025-09-23 17:24:32.301812+00	2025-09-23 17:24:32.301812+00	{"eTag": "\\"4747b8de5ac3e7d28890165fb462fc3c\\"", "size": 30170, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-09-23T17:24:33.000Z", "contentLength": 30170, "httpStatusCode": 200}	db786015-638a-413e-b1f4-54c8c998d349	c90139a0-2de3-4237-89b8-032367f73a37	{}	3
1ccf2318-b212-4db1-944f-9243c52e5b04	venue-images	073c625c-eb02-45e8-9c67-50acbdc72cd6/1759154209237-iron-man 1920x1080.jpg	073c625c-eb02-45e8-9c67-50acbdc72cd6	2025-09-29 13:56:54.558558+00	2025-09-29 13:56:54.558558+00	2025-09-29 13:56:54.558558+00	{"eTag": "\\"be39fb63585d3f621b5fced9d875aa36\\"", "size": 176137, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-09-29T13:56:55.000Z", "contentLength": 176137, "httpStatusCode": 200}	06477bec-c995-4e10-bb6f-a46db8e9a63e	073c625c-eb02-45e8-9c67-50acbdc72cd6	{}	2
1b89ee22-637b-49f1-95da-d72912580e3b	venue-images	venue-images/c90139a0-2de3-4237-89b8-032367f73a37/24b3641f-a027-4f08-920f-0cdd472ed954.webp	c90139a0-2de3-4237-89b8-032367f73a37	2025-09-23 17:24:32.76528+00	2025-09-23 17:24:32.76528+00	2025-09-23 17:24:32.76528+00	{"eTag": "\\"5b6cd002be22a5b53d6a177011ffd5c4\\"", "size": 27750, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-09-23T17:24:33.000Z", "contentLength": 27750, "httpStatusCode": 200}	e2fad94b-5586-4a80-9816-d200fad627ee	c90139a0-2de3-4237-89b8-032367f73a37	{}	3
4dbc856c-339a-4780-a4ec-0b3e5384a539	venue-images	073c625c-eb02-45e8-9c67-50acbdc72cd6/1759154209235-1682356542386.jpg	073c625c-eb02-45e8-9c67-50acbdc72cd6	2025-09-29 13:56:54.593497+00	2025-09-29 13:56:54.593497+00	2025-09-29 13:56:54.593497+00	{"eTag": "\\"4b670d793cf359728512ca89afff33bf\\"", "size": 250965, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-09-29T13:56:55.000Z", "contentLength": 250965, "httpStatusCode": 200}	98d655c6-a6e2-44ca-b7f0-c4cd25850a95	073c625c-eb02-45e8-9c67-50acbdc72cd6	{}	2
acc1d4ad-ccd0-4ea1-99e3-2aedd13e28b4	venue-images	venue-images/c90139a0-2de3-4237-89b8-032367f73a37/f1776469-a03f-40c2-80b9-62272c14605c.jpeg	c90139a0-2de3-4237-89b8-032367f73a37	2025-09-23 17:24:33.297266+00	2025-09-23 17:24:33.297266+00	2025-09-23 17:24:33.297266+00	{"eTag": "\\"1373c4e2dd3f46791c40daec552c9a58\\"", "size": 4838, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-09-23T17:24:34.000Z", "contentLength": 4838, "httpStatusCode": 200}	56a9aa55-b80a-4d7e-b4ea-bb0e3dd460b7	c90139a0-2de3-4237-89b8-032367f73a37	{}	3
5d189282-0235-47f9-a04e-8f8639ea9466	venue-images	venue-images/c90139a0-2de3-4237-89b8-032367f73a37/e85e6084-af8a-4674-999c-8151784c9a07.jpeg	c90139a0-2de3-4237-89b8-032367f73a37	2025-09-23 17:24:33.703622+00	2025-09-23 17:24:33.703622+00	2025-09-23 17:24:33.703622+00	{"eTag": "\\"abda8b4adfae0588c0488464791d8f1f\\"", "size": 6280, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-09-23T17:24:34.000Z", "contentLength": 6280, "httpStatusCode": 200}	4f4be3b9-b044-436b-96ba-896a0ba8233d	c90139a0-2de3-4237-89b8-032367f73a37	{}	3
d021cadf-8014-4169-a1eb-b9000974d1ca	venue-images	venue-images/c90139a0-2de3-4237-89b8-032367f73a37/d07da7d5-9a0d-4334-abe6-f40de6f6890e.jpeg	c90139a0-2de3-4237-89b8-032367f73a37	2025-09-23 17:24:34.260036+00	2025-09-23 17:24:34.260036+00	2025-09-23 17:24:34.260036+00	{"eTag": "\\"b66864c2e733426e56b99d264469681d\\"", "size": 8020, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-09-23T17:24:35.000Z", "contentLength": 8020, "httpStatusCode": 200}	18c428d3-d3ed-4b27-917f-1d1249790b76	c90139a0-2de3-4237-89b8-032367f73a37	{}	3
74fb3c84-56fb-442c-8567-aefa5e69fd7c	venue-images	073c625c-eb02-45e8-9c67-50acbdc72cd6/1759382726537-founder group.jpg.png	073c625c-eb02-45e8-9c67-50acbdc72cd6	2025-10-02 05:25:34.039467+00	2025-10-02 05:25:34.039467+00	2025-10-02 05:25:34.039467+00	{"eTag": "\\"bc54dcf85963527c96ecb0126924edd3\\"", "size": 191315, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-10-02T05:25:34.000Z", "contentLength": 191315, "httpStatusCode": 200}	7de7f2fb-4fce-4389-92e7-8db63fae81d0	073c625c-eb02-45e8-9c67-50acbdc72cd6	{}	2
b4f71420-2c00-4035-a07e-530834b061f9	venue-images	venue-images/c90139a0-2de3-4237-89b8-032367f73a37/2910c0bd-8c82-410b-a49e-0b1581016e25.jpeg	c90139a0-2de3-4237-89b8-032367f73a37	2025-09-23 17:24:34.72774+00	2025-09-23 17:24:34.72774+00	2025-09-23 17:24:34.72774+00	{"eTag": "\\"3aa570d6da356250ff56b269aca11224\\"", "size": 7254, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-09-23T17:24:35.000Z", "contentLength": 7254, "httpStatusCode": 200}	efe0f77b-779a-499a-ad4d-44bf97e12a32	c90139a0-2de3-4237-89b8-032367f73a37	{}	3
422b3f1c-9e27-4b3c-afcc-45db9ef35f6e	avatars	bb3e7bae-8aed-4e6c-bb71-bd644eff5402/bb3e7bae-8aed-4e6c-bb71-bd644eff5402.jpg	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	2025-09-28 16:55:31.532111+00	2025-09-28 17:13:53.461964+00	2025-09-28 16:55:31.532111+00	{"eTag": "\\"fa4e9f0053de684cb9c1590a5bf7deaa\\"", "size": 3894127, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-09-28T17:13:54.000Z", "contentLength": 3894127, "httpStatusCode": 200}	edca1ac4-5446-42bb-bfab-d2eda9af385d	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	{}	2
5c82cb5e-2eec-44e7-a08e-6d10f2098285	venue-images	venue-images/c90139a0-2de3-4237-89b8-032367f73a37/8f127ad3-925b-4fa3-a03b-43b27eb16d75.webp	c90139a0-2de3-4237-89b8-032367f73a37	2025-09-23 17:29:08.282924+00	2025-09-23 17:29:08.282924+00	2025-09-23 17:29:08.282924+00	{"eTag": "\\"5b6cd002be22a5b53d6a177011ffd5c4\\"", "size": 27750, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-09-23T17:29:09.000Z", "contentLength": 27750, "httpStatusCode": 200}	3e187901-7f84-4a3f-be37-1b7821e8e172	c90139a0-2de3-4237-89b8-032367f73a37	{}	3
bd3f0f88-33d7-4da4-9647-d78e95c37ee4	venue-images	venue-images/c90139a0-2de3-4237-89b8-032367f73a37/3a6d2dc1-a00e-493f-9ff4-ba1e2c7131bb.jpeg	c90139a0-2de3-4237-89b8-032367f73a37	2025-09-23 17:29:08.621504+00	2025-09-23 17:29:08.621504+00	2025-09-23 17:29:08.621504+00	{"eTag": "\\"1373c4e2dd3f46791c40daec552c9a58\\"", "size": 4838, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-09-23T17:29:09.000Z", "contentLength": 4838, "httpStatusCode": 200}	88753344-5894-4ad0-9d24-3fc090e71d2f	c90139a0-2de3-4237-89b8-032367f73a37	{}	3
af225183-5271-47c5-95fa-e2394890fed1	venue-images	venue-images/c90139a0-2de3-4237-89b8-032367f73a37/0c3f11fa-5a87-43b7-a29f-f36a9afb7f86.jpeg	c90139a0-2de3-4237-89b8-032367f73a37	2025-09-23 17:29:09.512173+00	2025-09-23 17:29:09.512173+00	2025-09-23 17:29:09.512173+00	{"eTag": "\\"abda8b4adfae0588c0488464791d8f1f\\"", "size": 6280, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-09-23T17:29:10.000Z", "contentLength": 6280, "httpStatusCode": 200}	9b180d04-f649-4a69-a29c-7af3b04d4144	c90139a0-2de3-4237-89b8-032367f73a37	{}	3
9090a896-33c6-4a47-9674-08f5539a81d4	venue-images	073c625c-eb02-45e8-9c67-50acbdc72cd6/1759342283296-playnation-vision.jpg	073c625c-eb02-45e8-9c67-50acbdc72cd6	2025-10-01 18:11:31.108279+00	2025-10-01 18:11:31.108279+00	2025-10-01 18:11:31.108279+00	{"eTag": "\\"8f0845b663a3d6bb7dd90875c70992cf\\"", "size": 45832, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-10-01T18:11:32.000Z", "contentLength": 45832, "httpStatusCode": 200}	22a52517-2d6f-4b67-b6b4-2f273730885d	073c625c-eb02-45e8-9c67-50acbdc72cd6	{}	2
5e3f7c04-44d3-424f-8603-ee0014af1bb9	venue-images	073c625c-eb02-45e8-9c67-50acbdc72cd6/1759342283294-founder group.jpg.png	073c625c-eb02-45e8-9c67-50acbdc72cd6	2025-10-01 18:11:31.218403+00	2025-10-01 18:11:31.218403+00	2025-10-01 18:11:31.218403+00	{"eTag": "\\"bc54dcf85963527c96ecb0126924edd3\\"", "size": 191315, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-10-01T18:11:32.000Z", "contentLength": 191315, "httpStatusCode": 200}	9d15de76-9946-4be6-bb7e-bce0aa453f7d	073c625c-eb02-45e8-9c67-50acbdc72cd6	{}	2
6cf9bbe0-7360-40d0-b800-7aa64ba2d9c0	venue-images	073c625c-eb02-45e8-9c67-50acbdc72cd6/1759382368765-founder group.jpg.png	073c625c-eb02-45e8-9c67-50acbdc72cd6	2025-10-02 05:19:37.454081+00	2025-10-02 05:19:37.454081+00	2025-10-02 05:19:37.454081+00	{"eTag": "\\"bc54dcf85963527c96ecb0126924edd3\\"", "size": 191315, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-10-02T05:19:38.000Z", "contentLength": 191315, "httpStatusCode": 200}	9d212776-1067-4942-8470-9327c6a798f5	073c625c-eb02-45e8-9c67-50acbdc72cd6	{}	2
63f8412e-4302-4599-83fd-cfe713bb51d5	venue-images	c90139a0-2de3-4237-89b8-032367f73a37/1759538312472-OIP (2).webp	c90139a0-2de3-4237-89b8-032367f73a37	2025-10-04 00:38:32.836286+00	2025-10-04 00:38:32.836286+00	2025-10-04 00:38:32.836286+00	{"eTag": "\\"0639c820be552be1872d3a16316233c2\\"", "size": 20320, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-10-04T00:38:33.000Z", "contentLength": 20320, "httpStatusCode": 200}	46dfabb2-25dd-40c9-8d87-445ebdfe3c94	c90139a0-2de3-4237-89b8-032367f73a37	{}	2
688f44f2-a513-4365-a22c-79581d5973ea	venue-images	venue-images/073c625c-eb02-45e8-9c67-50acbdc72cd6/ee802bc6-bb91-495c-9d2a-9989d537ed9f.jpg	073c625c-eb02-45e8-9c67-50acbdc72cd6	2025-10-11 13:23:36.73086+00	2025-10-11 13:23:36.73086+00	2025-10-11 13:23:36.73086+00	{"eTag": "\\"53ea3073d6c8adf3d80c0c1371f6db4b\\"", "size": 4012776, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-10-11T13:23:37.000Z", "contentLength": 4012776, "httpStatusCode": 200}	b2ddd2a4-feb3-45e8-a1a9-7b8182426c43	073c625c-eb02-45e8-9c67-50acbdc72cd6	{}	3
fcf79369-7cfb-4526-b948-610fa128dda0	venue-images	venue-images/073c625c-eb02-45e8-9c67-50acbdc72cd6/7037689e-40ff-4e29-99dd-d2da6b386455.jpg	073c625c-eb02-45e8-9c67-50acbdc72cd6	2025-10-11 13:23:38.896804+00	2025-10-11 13:23:38.896804+00	2025-10-11 13:23:38.896804+00	{"eTag": "\\"c436d292313ed34135a4a8feffb5ab0d-2\\"", "size": 6033890, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-10-11T13:23:39.000Z", "contentLength": 6033890, "httpStatusCode": 200}	786fc015-7e64-4130-ae2f-6bb545599114	073c625c-eb02-45e8-9c67-50acbdc72cd6	{}	3
5d2b06fd-947e-4a2c-990b-06f859b31352	venue-images	venue-images/073c625c-eb02-45e8-9c67-50acbdc72cd6/e253210d-7fcf-4aca-a129-e9a546cae2e3.jpg	073c625c-eb02-45e8-9c67-50acbdc72cd6	2025-10-11 13:25:07.513545+00	2025-10-11 13:25:07.513545+00	2025-10-11 13:25:07.513545+00	{"eTag": "\\"9e3c3f8871549600b0d33669c4e05b8d\\"", "size": 469354, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-10-11T13:25:08.000Z", "contentLength": 469354, "httpStatusCode": 200}	57d6deb5-d2cd-4869-ae68-3e63e7dffb88	073c625c-eb02-45e8-9c67-50acbdc72cd6	{}	3
a137117c-b12a-44a0-ada8-845320166199	venue-images	venue-images/073c625c-eb02-45e8-9c67-50acbdc72cd6/5afff5e2-865e-4ee1-bd44-87076cdb3ea8.jpg	073c625c-eb02-45e8-9c67-50acbdc72cd6	2025-10-11 13:25:07.987314+00	2025-10-11 13:25:07.987314+00	2025-10-11 13:25:07.987314+00	{"eTag": "\\"22f615c127e0d5f388ed18025a9ae4a9\\"", "size": 591215, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-10-11T13:25:08.000Z", "contentLength": 591215, "httpStatusCode": 200}	96d44ed2-5cb9-4a25-a0eb-e4e5acb6e304	073c625c-eb02-45e8-9c67-50acbdc72cd6	{}	3
28c272c1-634e-4549-bd4c-b5f7b830b4f9	avatars	073c625c-eb02-45e8-9c67-50acbdc72cd6/073c625c-eb02-45e8-9c67-50acbdc72cd6.jpg	073c625c-eb02-45e8-9c67-50acbdc72cd6	2025-10-12 20:37:28.6448+00	2025-10-12 20:37:28.6448+00	2025-10-12 20:37:28.6448+00	{"eTag": "\\"2a1fc37e013741fc63054523f3cda2fb\\"", "size": 240310, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-10-12T20:37:29.000Z", "contentLength": 240310, "httpStatusCode": 200}	b6f0412e-2b27-4268-b3da-0c059337bcd7	073c625c-eb02-45e8-9c67-50acbdc72cd6	{}	2
\.


--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.prefixes (bucket_id, name, created_at, updated_at) FROM stdin;
venue-images	c90139a0-2de3-4237-89b8-032367f73a37	2025-09-15 15:13:49.956205+00	2025-09-15 15:13:49.956205+00
venue-images	venue-images	2025-09-23 16:45:17.254997+00	2025-09-23 16:45:17.254997+00
venue-images	venue-images/c90139a0-2de3-4237-89b8-032367f73a37	2025-09-23 16:45:17.254997+00	2025-09-23 16:45:17.254997+00
avatars	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	2025-09-28 16:55:31.532111+00	2025-09-28 16:55:31.532111+00
venue-images	073c625c-eb02-45e8-9c67-50acbdc72cd6	2025-09-28 22:11:44.828165+00	2025-09-28 22:11:44.828165+00
venue-images	venue-images/073c625c-eb02-45e8-9c67-50acbdc72cd6	2025-10-11 13:23:36.73086+00	2025-10-11 13:23:36.73086+00
avatars	073c625c-eb02-45e8-9c67-50acbdc72cd6	2025-10-12 20:37:28.6448+00	2025-10-12 20:37:28.6448+00
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: supabase_migrations; Owner: postgres
--

COPY supabase_migrations.schema_migrations (version, statements, name) FROM stdin;
20250926190030	\N	remote_commit
\.


--
-- Data for Name: seed_files; Type: TABLE DATA; Schema: supabase_migrations; Owner: postgres
--

COPY supabase_migrations.seed_files (path, hash) FROM stdin;
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 713, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id);


--
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_pkey PRIMARY KEY (id);


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: admin_notifications admin_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_notifications
    ADD CONSTRAINT admin_notifications_pkey PRIMARY KEY (id);


--
-- Name: amenities amenities_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.amenities
    ADD CONSTRAINT amenities_name_key UNIQUE (name);


--
-- Name: amenities amenities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.amenities
    ADD CONSTRAINT amenities_pkey PRIMARY KEY (amenity_id);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (booking_id);


--
-- Name: contact_messages contact_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_pkey PRIMARY KEY (id);


--
-- Name: credit_transactions credit_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit_transactions
    ADD CONSTRAINT credit_transactions_pkey PRIMARY KEY (transaction_id);


--
-- Name: facilities facilities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facilities
    ADD CONSTRAINT facilities_pkey PRIMARY KEY (facility_id);


--
-- Name: facility_amenities facility_amenities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facility_amenities
    ADD CONSTRAINT facility_amenities_pkey PRIMARY KEY (facility_id, amenity_id);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (user_id, venue_id);


--
-- Name: offer_sports offer_sports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offer_sports
    ADD CONSTRAINT offer_sports_pkey PRIMARY KEY (offer_id, sport_id);


--
-- Name: offers offers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offers
    ADD CONSTRAINT offers_pkey PRIMARY KEY (offer_id);


--
-- Name: payments payments_booking_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_booking_id_key UNIQUE (booking_id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (payment_id);


--
-- Name: payments payments_razorpay_order_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_razorpay_order_id_key UNIQUE (razorpay_order_id);


--
-- Name: payments payments_razorpay_payment_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_razorpay_payment_id_key UNIQUE (razorpay_payment_id);


--
-- Name: points_transactions points_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.points_transactions
    ADD CONSTRAINT points_transactions_pkey PRIMARY KEY (transaction_id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (review_id);


--
-- Name: reviews reviews_user_id_venue_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_venue_id_key UNIQUE (user_id, venue_id);


--
-- Name: sports sports_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sports
    ADD CONSTRAINT sports_name_key UNIQUE (name);


--
-- Name: sports sports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sports
    ADD CONSTRAINT sports_pkey PRIMARY KEY (sport_id);


--
-- Name: time_slots time_slots_facility_id_start_time_end_time_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.time_slots
    ADD CONSTRAINT time_slots_facility_id_start_time_end_time_key UNIQUE (facility_id, start_time, end_time);


--
-- Name: time_slots time_slots_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.time_slots
    ADD CONSTRAINT time_slots_pkey PRIMARY KEY (slot_id);


--
-- Name: reviews unique_review_per_booking; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT unique_review_per_booking UNIQUE (user_id, venue_id, booking_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_phone_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_number_key UNIQUE (phone_number);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: venues venues_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venues
    ADD CONSTRAINT venues_pkey PRIMARY KEY (venue_id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: prefixes prefixes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT prefixes_pkey PRIMARY KEY (bucket_id, level, name);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--

ALTER TABLE ONLY supabase_migrations.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: seed_files seed_files_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--

ALTER TABLE ONLY supabase_migrations.seed_files
    ADD CONSTRAINT seed_files_pkey PRIMARY KEY (path);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_auth_pending_exp_idx ON auth.oauth_authorizations USING btree (expires_at) WHERE (status = 'pending'::auth.oauth_authorization_status);


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_client_idx ON auth.oauth_consents USING btree (client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_user_client_idx ON auth.oauth_consents USING btree (user_id, client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_user_order_idx ON auth.oauth_consents USING btree (user_id, granted_at DESC);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_oauth_client_id_idx ON auth.sessions USING btree (oauth_client_id);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: idx_bookings_facility_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_facility_id ON public.bookings USING btree (facility_id);


--
-- Name: idx_bookings_has_been_reviewed; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_has_been_reviewed ON public.bookings USING btree (has_been_reviewed);


--
-- Name: idx_bookings_slot_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_slot_id ON public.bookings USING btree (slot_id);


--
-- Name: idx_bookings_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_user_id ON public.bookings USING btree (user_id);


--
-- Name: idx_credit_transactions_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_credit_transactions_user_id ON public.credit_transactions USING btree (user_id);


--
-- Name: idx_facilities_venue_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_facilities_venue_id ON public.facilities USING btree (venue_id);


--
-- Name: idx_facilities_venue_id_sport_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_facilities_venue_id_sport_id ON public.facilities USING btree (venue_id, sport_id);


--
-- Name: idx_facility_amenities_amenity_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_facility_amenities_amenity_id ON public.facility_amenities USING btree (amenity_id);


--
-- Name: idx_favorites_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_favorites_user_id ON public.favorites USING btree (user_id);


--
-- Name: idx_offers_venue_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_offers_venue_id ON public.offers USING btree (venue_id);


--
-- Name: idx_points_transactions_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_points_transactions_user_id ON public.points_transactions USING btree (user_id);


--
-- Name: idx_reviews_venue_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_venue_id ON public.reviews USING btree (venue_id);


--
-- Name: idx_time_slots_facility_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_time_slots_facility_id ON public.time_slots USING btree (facility_id);


--
-- Name: idx_time_slots_facility_id_start_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_time_slots_facility_id_start_time ON public.time_slots USING btree (facility_id, start_time);


--
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- Name: idx_users_role_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_role_status ON public.users USING btree (role, status);


--
-- Name: idx_users_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_status ON public.users USING btree (status);


--
-- Name: idx_venues_city_is_approved; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_venues_city_is_approved ON public.venues USING btree (city, is_approved);


--
-- Name: idx_venues_owner_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_venues_owner_id ON public.venues USING btree (owner_id);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_name_bucket_level_unique; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX idx_name_bucket_level_unique ON storage.objects USING btree (name COLLATE "C", bucket_id, level);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: idx_objects_lower_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_lower_name ON storage.objects USING btree ((path_tokens[level]), lower(name) text_pattern_ops, bucket_id, level);


--
-- Name: idx_prefixes_lower_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_prefixes_lower_name ON storage.prefixes USING btree (bucket_id, level, ((string_to_array(name, '/'::text))[level]), lower(name) text_pattern_ops);


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: objects_bucket_id_level_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX objects_bucket_id_level_idx ON storage.objects USING btree (bucket_id, level, name COLLATE "C");


--
-- Name: users on_auth_user_created; Type: TRIGGER; Schema: auth; Owner: supabase_auth_admin
--

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


--
-- Name: users on_new_user_set_username; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_new_user_set_username BEFORE INSERT ON public.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_username();


--
-- Name: venues trigger_set_venue_owner; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_set_venue_owner BEFORE INSERT ON public.venues FOR EACH ROW EXECUTE FUNCTION public.set_venue_owner();


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- Name: objects objects_delete_delete_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_delete_delete_prefix AFTER DELETE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- Name: objects objects_insert_create_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_insert_create_prefix BEFORE INSERT ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.objects_insert_prefix_trigger();


--
-- Name: objects objects_update_create_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_update_create_prefix BEFORE UPDATE ON storage.objects FOR EACH ROW WHEN (((new.name <> old.name) OR (new.bucket_id <> old.bucket_id))) EXECUTE FUNCTION storage.objects_update_prefix_trigger();


--
-- Name: prefixes prefixes_create_hierarchy; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER prefixes_create_hierarchy BEFORE INSERT ON storage.prefixes FOR EACH ROW WHEN ((pg_trigger_depth() < 1)) EXECUTE FUNCTION storage.prefixes_insert_trigger();


--
-- Name: prefixes prefixes_delete_hierarchy; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER prefixes_delete_hierarchy AFTER DELETE ON storage.prefixes FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_oauth_client_id_fkey FOREIGN KEY (oauth_client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: bookings bookings_cancelled_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_cancelled_by_fkey FOREIGN KEY (cancelled_by) REFERENCES public.users(user_id);


--
-- Name: bookings bookings_facility_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_facility_id_fkey FOREIGN KEY (facility_id) REFERENCES public.facilities(facility_id) ON DELETE CASCADE;


--
-- Name: bookings bookings_slot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_slot_id_fkey FOREIGN KEY (slot_id) REFERENCES public.time_slots(slot_id) ON DELETE CASCADE;


--
-- Name: bookings bookings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE SET NULL;


--
-- Name: credit_transactions credit_transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit_transactions
    ADD CONSTRAINT credit_transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: facilities facilities_sport_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facilities
    ADD CONSTRAINT facilities_sport_id_fkey FOREIGN KEY (sport_id) REFERENCES public.sports(sport_id) ON DELETE CASCADE;


--
-- Name: facilities facilities_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facilities
    ADD CONSTRAINT facilities_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venues(venue_id) ON DELETE CASCADE;


--
-- Name: facility_amenities facility_amenities_amenity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facility_amenities
    ADD CONSTRAINT facility_amenities_amenity_id_fkey FOREIGN KEY (amenity_id) REFERENCES public.amenities(amenity_id) ON DELETE CASCADE;


--
-- Name: facility_amenities facility_amenities_facility_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facility_amenities
    ADD CONSTRAINT facility_amenities_facility_id_fkey FOREIGN KEY (facility_id) REFERENCES public.facilities(facility_id) ON DELETE CASCADE;


--
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: favorites favorites_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venues(venue_id) ON DELETE CASCADE;


--
-- Name: offer_sports offer_sports_offer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offer_sports
    ADD CONSTRAINT offer_sports_offer_id_fkey FOREIGN KEY (offer_id) REFERENCES public.offers(offer_id) ON DELETE CASCADE;


--
-- Name: offer_sports offer_sports_sport_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offer_sports
    ADD CONSTRAINT offer_sports_sport_id_fkey FOREIGN KEY (sport_id) REFERENCES public.sports(sport_id) ON DELETE CASCADE;


--
-- Name: offers offers_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offers
    ADD CONSTRAINT offers_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venues(venue_id) ON DELETE CASCADE;


--
-- Name: points_transactions points_transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.points_transactions
    ADD CONSTRAINT points_transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: reviews reviews_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(booking_id) ON DELETE SET NULL;


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: reviews reviews_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venues(venue_id) ON DELETE CASCADE;


--
-- Name: time_slots time_slots_facility_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.time_slots
    ADD CONSTRAINT time_slots_facility_id_fkey FOREIGN KEY (facility_id) REFERENCES public.facilities(facility_id) ON DELETE CASCADE;


--
-- Name: venues venues_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venues
    ADD CONSTRAINT venues_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: prefixes prefixes_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT "prefixes_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: venues Admin All Access; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admin All Access" ON public.venues USING ((( SELECT users.role
   FROM public.users
  WHERE (users.user_id = auth.uid())) = 'admin'::text)) WITH CHECK ((( SELECT users.role
   FROM public.users
  WHERE (users.user_id = auth.uid())) = 'admin'::text));


--
-- Name: users Admin can update all users by app_role; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admin can update all users by app_role" ON public.users FOR UPDATE USING (((auth.jwt() ->> 'app_role'::text) = 'admin'::text)) WITH CHECK (true);


--
-- Name: offers Admins and Owners can manage offers; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins and Owners can manage offers" ON public.offers USING (((( SELECT users.role
   FROM public.users
  WHERE (users.user_id = auth.uid())) = 'admin'::text) OR (( SELECT venues.owner_id
   FROM public.venues
  WHERE (venues.venue_id = offers.venue_id)) = auth.uid())));


--
-- Name: contact_messages Admins full access on contact messages; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins full access on contact messages" ON public.contact_messages USING ((( SELECT users.role
   FROM public.users
  WHERE (users.user_id = auth.uid())) = 'admin'::text)) WITH CHECK ((( SELECT users.role
   FROM public.users
  WHERE (users.user_id = auth.uid())) = 'admin'::text));


--
-- Name: admin_notifications Admins full access on notifications; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins full access on notifications" ON public.admin_notifications USING ((( SELECT users.role
   FROM public.users
  WHERE (users.user_id = auth.uid())) = 'admin'::text)) WITH CHECK ((( SELECT users.role
   FROM public.users
  WHERE (users.user_id = auth.uid())) = 'admin'::text));


--
-- Name: users Allow admins to read all user data; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow admins to read all user data" ON public.users FOR SELECT TO authenticated USING ((public.get_my_role() = 'admin'::text));


--
-- Name: venues Allow admins to read all venues; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow admins to read all venues" ON public.venues FOR SELECT TO authenticated USING ((public.get_my_role() = 'admin'::text));


--
-- Name: venues Allow admins to update any venue; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow admins to update any venue" ON public.venues FOR UPDATE TO authenticated USING ((public.get_my_role() = 'admin'::text));


--
-- Name: users Allow individual users to read their own data; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow individual users to read their own data" ON public.users FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: venues Allow owners to delete their own venues; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow owners to delete their own venues" ON public.venues FOR DELETE TO authenticated USING ((auth.uid() = owner_id));


--
-- Name: venues Allow owners to read their own venues; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow owners to read their own venues" ON public.venues FOR SELECT TO authenticated USING ((auth.uid() = owner_id));


--
-- Name: venues Allow owners to update their own venues; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow owners to update their own venues" ON public.venues FOR UPDATE TO authenticated USING ((auth.uid() = owner_id));


--
-- Name: contact_messages Allow public insert for contact messages; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow public insert for contact messages" ON public.contact_messages FOR INSERT TO authenticated, anon WITH CHECK (true);


--
-- Name: reviews Allow public read access to all reviews; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow public read access to all reviews" ON public.reviews FOR SELECT USING (true);


--
-- Name: venues Allow public read access to venues; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow public read access to venues" ON public.venues FOR SELECT USING (true);


--
-- Name: users Allow users to update their own data; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow users to update their own data" ON public.users FOR UPDATE TO authenticated USING ((auth.uid() = user_id));


--
-- Name: venues Allow venue owners to create new venues; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow venue owners to create new venues" ON public.venues FOR INSERT TO authenticated WITH CHECK ((auth.uid() = owner_id));


--
-- Name: offers Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public.offers FOR SELECT USING (true);


--
-- Name: amenities Enable read access for amenities; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for amenities" ON public.amenities FOR SELECT USING (true);


--
-- Name: sports Enable read access for sports; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for sports" ON public.sports FOR SELECT USING (true);


--
-- Name: venues Owners Full Access; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Owners Full Access" ON public.venues USING ((owner_id = auth.uid())) WITH CHECK ((owner_id = auth.uid()));


--
-- Name: venues Owners and public select; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Owners and public select" ON public.venues FOR SELECT TO authenticated, anon USING (((is_approved = true) OR (owner_id = auth.uid())));


--
-- Name: offer_sports Owners can manage links for their offers; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Owners can manage links for their offers" ON public.offer_sports USING ((( SELECT offers.venue_id
   FROM public.offers
  WHERE (offers.offer_id = offer_sports.offer_id)) IN ( SELECT venues.venue_id
   FROM public.venues
  WHERE (venues.owner_id = auth.uid()))));


--
-- Name: venues Owners insert their own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Owners insert their own" ON public.venues FOR INSERT TO authenticated WITH CHECK (((( SELECT users.role
   FROM public.users
  WHERE (users.user_id = auth.uid())) = 'venue_owner'::text) AND (owner_id = auth.uid())));


--
-- Name: venues Owners update their own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Owners update their own" ON public.venues FOR UPDATE TO authenticated USING ((owner_id = auth.uid())) WITH CHECK ((owner_id = auth.uid()));


--
-- Name: facilities Owners: All access to their facilities; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Owners: All access to their facilities" ON public.facilities USING ((EXISTS ( SELECT 1
   FROM public.venues
  WHERE ((venues.venue_id = facilities.venue_id) AND (venues.owner_id = auth.uid()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.venues
  WHERE ((venues.venue_id = facilities.venue_id) AND (venues.owner_id = auth.uid())))));


--
-- Name: offers Public can view active offers; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public can view active offers" ON public.offers FOR SELECT USING (((is_active = true) AND ((valid_until IS NULL) OR (valid_until > now()))));


--
-- Name: venues Public can view approved venues; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public can view approved venues" ON public.venues FOR SELECT USING ((is_approved = true));


--
-- Name: offer_sports Public can view linked sports; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public can view linked sports" ON public.offer_sports FOR SELECT USING (true);


--
-- Name: facilities Public: Select approved facilities; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public: Select approved facilities" ON public.facilities FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.venues
  WHERE ((venues.venue_id = facilities.venue_id) AND (venues.is_approved = true)))));


--
-- Name: users Role based SELECT access on users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Role based SELECT access on users" ON public.users FOR SELECT USING (((auth.jwt() ->> 'app_role'::text) = ANY (ARRAY['admin'::text, 'venue_owner'::text])));


--
-- Name: favorites Users can delete their own favorites; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete their own favorites" ON public.favorites FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: users Users can fully manage their own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can fully manage their own profile" ON public.users TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: favorites Users can insert their own favorites; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert their own favorites" ON public.favorites FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: favorites Users can view their own favorites; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own favorites" ON public.favorites FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: admin_notifications; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

--
-- Name: contact_messages; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

--
-- Name: favorites; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

--
-- Name: offer_sports; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.offer_sports ENABLE ROW LEVEL SECURITY;

--
-- Name: offers; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

--
-- Name: venues; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: objects Allow authenticated users to delete venue images; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Allow authenticated users to delete venue images" ON storage.objects FOR DELETE USING (((bucket_id = 'venue-images'::text) AND (auth.role() = 'authenticated'::text)));


--
-- Name: objects Allow authenticated users to update venue images; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Allow authenticated users to update venue images" ON storage.objects FOR UPDATE USING ((auth.uid() = owner)) WITH CHECK ((bucket_id = 'venue-images'::text));


--
-- Name: objects Allow authenticated users to upload venue images; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Allow authenticated users to upload venue images" ON storage.objects FOR INSERT WITH CHECK (((bucket_id = 'venue-images'::text) AND (auth.role() = 'authenticated'::text)));


--
-- Name: objects Anyone can update their own avatar.; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Anyone can update their own avatar." ON storage.objects FOR UPDATE USING ((auth.uid() = owner)) WITH CHECK (((bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));


--
-- Name: objects Anyone can upload an avatar.; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Anyone can upload an avatar." ON storage.objects FOR INSERT WITH CHECK (((auth.uid() IS NOT NULL) AND (bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));


--
-- Name: objects Avatar images are publicly accessible.; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Avatar images are publicly accessible." ON storage.objects FOR SELECT USING ((bucket_id = 'avatars'::text));


--
-- Name: objects Give users authenticated access to folder 1oj01fe_0; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Give users authenticated access to folder 1oj01fe_0" ON storage.objects FOR SELECT USING (((bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = 'private'::text) AND (auth.role() = 'authenticated'::text)));


--
-- Name: objects Give users authenticated access to folder 1oj01fe_1; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Give users authenticated access to folder 1oj01fe_1" ON storage.objects FOR INSERT WITH CHECK (((bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = 'private'::text) AND (auth.role() = 'authenticated'::text)));


--
-- Name: objects Give users authenticated access to folder 1oj01fe_2; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Give users authenticated access to folder 1oj01fe_2" ON storage.objects FOR UPDATE USING (((bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = 'private'::text) AND (auth.role() = 'authenticated'::text)));


--
-- Name: objects Give users authenticated access to folder 1oj01fe_3; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Give users authenticated access to folder 1oj01fe_3" ON storage.objects FOR DELETE USING (((bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = 'private'::text) AND (auth.role() = 'authenticated'::text)));


--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: prefixes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.prefixes ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- Name: SCHEMA vault; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA vault TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA vault TO service_role;


--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea, text[], text[]) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.crypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.dearmor(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_bytes(integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_uuid() FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text, integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO dashboard_user;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_key_id(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1mc() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v4() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_nil() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_dns() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_oid() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_url() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_x500() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO postgres;


--
-- Name: FUNCTION cancel_booking_and_notify_admin(p_booking_id uuid, p_user_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.cancel_booking_and_notify_admin(p_booking_id uuid, p_user_id uuid) TO anon;
GRANT ALL ON FUNCTION public.cancel_booking_and_notify_admin(p_booking_id uuid, p_user_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.cancel_booking_and_notify_admin(p_booking_id uuid, p_user_id uuid) TO service_role;


--
-- Name: FUNCTION cancel_booking_transaction(p_booking_id uuid, p_user_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.cancel_booking_transaction(p_booking_id uuid, p_user_id uuid) TO anon;
GRANT ALL ON FUNCTION public.cancel_booking_transaction(p_booking_id uuid, p_user_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.cancel_booking_transaction(p_booking_id uuid, p_user_id uuid) TO service_role;


--
-- Name: FUNCTION cancel_booking_transaction(p_booking_id uuid, p_user_id uuid, p_cancellation_reason text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.cancel_booking_transaction(p_booking_id uuid, p_user_id uuid, p_cancellation_reason text) TO anon;
GRANT ALL ON FUNCTION public.cancel_booking_transaction(p_booking_id uuid, p_user_id uuid, p_cancellation_reason text) TO authenticated;
GRANT ALL ON FUNCTION public.cancel_booking_transaction(p_booking_id uuid, p_user_id uuid, p_cancellation_reason text) TO service_role;


--
-- Name: FUNCTION create_booking_for_user(p_user_id uuid, p_facility_id uuid, p_slot_id uuid, p_total_amount numeric); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.create_booking_for_user(p_user_id uuid, p_facility_id uuid, p_slot_id uuid, p_total_amount numeric) TO anon;
GRANT ALL ON FUNCTION public.create_booking_for_user(p_user_id uuid, p_facility_id uuid, p_slot_id uuid, p_total_amount numeric) TO authenticated;
GRANT ALL ON FUNCTION public.create_booking_for_user(p_user_id uuid, p_facility_id uuid, p_slot_id uuid, p_total_amount numeric) TO service_role;


--
-- Name: FUNCTION get_my_role(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_my_role() TO anon;
GRANT ALL ON FUNCTION public.get_my_role() TO authenticated;
GRANT ALL ON FUNCTION public.get_my_role() TO service_role;


--
-- Name: TABLE venues; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.venues TO anon;
GRANT ALL ON TABLE public.venues TO authenticated;
GRANT ALL ON TABLE public.venues TO service_role;


--
-- Name: FUNCTION get_my_venues(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_my_venues() TO anon;
GRANT ALL ON FUNCTION public.get_my_venues() TO authenticated;
GRANT ALL ON FUNCTION public.get_my_venues() TO service_role;


--
-- Name: FUNCTION get_my_venues_with_images(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_my_venues_with_images() TO anon;
GRANT ALL ON FUNCTION public.get_my_venues_with_images() TO authenticated;
GRANT ALL ON FUNCTION public.get_my_venues_with_images() TO service_role;


--
-- Name: FUNCTION get_owner_dashboard_statistics(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_owner_dashboard_statistics() TO anon;
GRANT ALL ON FUNCTION public.get_owner_dashboard_statistics() TO authenticated;
GRANT ALL ON FUNCTION public.get_owner_dashboard_statistics() TO service_role;


--
-- Name: FUNCTION get_owner_dashboard_statistics(days_to_track integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_owner_dashboard_statistics(days_to_track integer) TO anon;
GRANT ALL ON FUNCTION public.get_owner_dashboard_statistics(days_to_track integer) TO authenticated;
GRANT ALL ON FUNCTION public.get_owner_dashboard_statistics(days_to_track integer) TO service_role;


--
-- Name: FUNCTION get_owner_venues_details(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_owner_venues_details() TO anon;
GRANT ALL ON FUNCTION public.get_owner_venues_details() TO authenticated;
GRANT ALL ON FUNCTION public.get_owner_venues_details() TO service_role;


--
-- Name: FUNCTION get_public_profiles_for_owner(user_ids uuid[]); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_public_profiles_for_owner(user_ids uuid[]) TO anon;
GRANT ALL ON FUNCTION public.get_public_profiles_for_owner(user_ids uuid[]) TO authenticated;
GRANT ALL ON FUNCTION public.get_public_profiles_for_owner(user_ids uuid[]) TO service_role;


--
-- Name: FUNCTION get_slots_for_facility(p_facility_id uuid, p_date date); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_slots_for_facility(p_facility_id uuid, p_date date) TO anon;
GRANT ALL ON FUNCTION public.get_slots_for_facility(p_facility_id uuid, p_date date) TO authenticated;
GRANT ALL ON FUNCTION public.get_slots_for_facility(p_facility_id uuid, p_date date) TO service_role;


--
-- Name: FUNCTION get_user_role(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_user_role() TO anon;
GRANT ALL ON FUNCTION public.get_user_role() TO authenticated;
GRANT ALL ON FUNCTION public.get_user_role() TO service_role;


--
-- Name: FUNCTION get_user_role_claim(p_user_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_user_role_claim(p_user_id uuid) TO anon;
GRANT ALL ON FUNCTION public.get_user_role_claim(p_user_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.get_user_role_claim(p_user_id uuid) TO service_role;


--
-- Name: FUNCTION handle_new_user(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.handle_new_user() TO anon;
GRANT ALL ON FUNCTION public.handle_new_user() TO authenticated;
GRANT ALL ON FUNCTION public.handle_new_user() TO service_role;


--
-- Name: FUNCTION handle_new_user_username(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.handle_new_user_username() TO anon;
GRANT ALL ON FUNCTION public.handle_new_user_username() TO authenticated;
GRANT ALL ON FUNCTION public.handle_new_user_username() TO service_role;


--
-- Name: FUNCTION search_users(p_search_term text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.search_users(p_search_term text) TO anon;
GRANT ALL ON FUNCTION public.search_users(p_search_term text) TO authenticated;
GRANT ALL ON FUNCTION public.search_users(p_search_term text) TO service_role;


--
-- Name: FUNCTION set_venue_owner(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.set_venue_owner() TO anon;
GRANT ALL ON FUNCTION public.set_venue_owner() TO authenticated;
GRANT ALL ON FUNCTION public.set_venue_owner() TO service_role;


--
-- Name: FUNCTION toggle_user_suspension(target_user_id uuid, suspend_status boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.toggle_user_suspension(target_user_id uuid, suspend_status boolean) TO anon;
GRANT ALL ON FUNCTION public.toggle_user_suspension(target_user_id uuid, suspend_status boolean) TO authenticated;
GRANT ALL ON FUNCTION public.toggle_user_suspension(target_user_id uuid, suspend_status boolean) TO service_role;


--
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- Name: FUNCTION _crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO service_role;


--
-- Name: FUNCTION create_secret(new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: FUNCTION update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;


--
-- Name: TABLE oauth_authorizations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_authorizations TO postgres;
GRANT ALL ON TABLE auth.oauth_authorizations TO dashboard_user;


--
-- Name: TABLE oauth_clients; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_clients TO postgres;
GRANT ALL ON TABLE auth.oauth_clients TO dashboard_user;


--
-- Name: TABLE oauth_consents; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_consents TO postgres;
GRANT ALL ON TABLE auth.oauth_consents TO dashboard_user;


--
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;


--
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;


--
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;


--
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements_info FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO dashboard_user;


--
-- Name: TABLE admin_notifications; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.admin_notifications TO anon;
GRANT ALL ON TABLE public.admin_notifications TO authenticated;
GRANT ALL ON TABLE public.admin_notifications TO service_role;


--
-- Name: TABLE amenities; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.amenities TO anon;
GRANT ALL ON TABLE public.amenities TO authenticated;
GRANT ALL ON TABLE public.amenities TO service_role;


--
-- Name: TABLE backup_payments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.backup_payments TO anon;
GRANT ALL ON TABLE public.backup_payments TO authenticated;
GRANT ALL ON TABLE public.backup_payments TO service_role;


--
-- Name: TABLE backup_reviews; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.backup_reviews TO anon;
GRANT ALL ON TABLE public.backup_reviews TO authenticated;
GRANT ALL ON TABLE public.backup_reviews TO service_role;


--
-- Name: TABLE bookings; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.bookings TO anon;
GRANT ALL ON TABLE public.bookings TO authenticated;
GRANT ALL ON TABLE public.bookings TO service_role;


--
-- Name: TABLE contact_messages; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.contact_messages TO anon;
GRANT ALL ON TABLE public.contact_messages TO authenticated;
GRANT ALL ON TABLE public.contact_messages TO service_role;


--
-- Name: TABLE credit_transactions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.credit_transactions TO anon;
GRANT ALL ON TABLE public.credit_transactions TO authenticated;
GRANT ALL ON TABLE public.credit_transactions TO service_role;


--
-- Name: TABLE facilities; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.facilities TO anon;
GRANT ALL ON TABLE public.facilities TO authenticated;
GRANT ALL ON TABLE public.facilities TO service_role;


--
-- Name: TABLE facility_amenities; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.facility_amenities TO anon;
GRANT ALL ON TABLE public.facility_amenities TO authenticated;
GRANT ALL ON TABLE public.facility_amenities TO service_role;


--
-- Name: TABLE favorites; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.favorites TO anon;
GRANT ALL ON TABLE public.favorites TO authenticated;
GRANT ALL ON TABLE public.favorites TO service_role;


--
-- Name: TABLE offer_sports; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.offer_sports TO anon;
GRANT ALL ON TABLE public.offer_sports TO authenticated;
GRANT ALL ON TABLE public.offer_sports TO service_role;


--
-- Name: TABLE offers; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.offers TO anon;
GRANT ALL ON TABLE public.offers TO authenticated;
GRANT ALL ON TABLE public.offers TO service_role;


--
-- Name: TABLE payments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.payments TO anon;
GRANT ALL ON TABLE public.payments TO authenticated;
GRANT ALL ON TABLE public.payments TO service_role;


--
-- Name: TABLE points_transactions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.points_transactions TO anon;
GRANT ALL ON TABLE public.points_transactions TO authenticated;
GRANT ALL ON TABLE public.points_transactions TO service_role;


--
-- Name: TABLE reviews; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.reviews TO anon;
GRANT ALL ON TABLE public.reviews TO authenticated;
GRANT ALL ON TABLE public.reviews TO service_role;


--
-- Name: TABLE sports; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sports TO anon;
GRANT ALL ON TABLE public.sports TO authenticated;
GRANT ALL ON TABLE public.sports TO service_role;


--
-- Name: TABLE time_slots; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.time_slots TO anon;
GRANT ALL ON TABLE public.time_slots TO authenticated;
GRANT ALL ON TABLE public.time_slots TO service_role;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.users TO anon;
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;


--
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT ALL ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT ALL ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO postgres WITH GRANT OPTION;


--
-- Name: TABLE buckets_analytics; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets_analytics TO service_role;
GRANT ALL ON TABLE storage.buckets_analytics TO authenticated;
GRANT ALL ON TABLE storage.buckets_analytics TO anon;


--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO postgres WITH GRANT OPTION;


--
-- Name: TABLE prefixes; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.prefixes TO service_role;
GRANT ALL ON TABLE storage.prefixes TO authenticated;
GRANT ALL ON TABLE storage.prefixes TO anon;


--
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;


--
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;


--
-- Name: TABLE secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.secrets TO service_role;


--
-- Name: TABLE decrypted_secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.decrypted_secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.decrypted_secrets TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO service_role;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO supabase_admin;

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

--
-- PostgreSQL database dump complete
--

