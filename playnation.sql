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
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    image_url text
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
-- Name: search_v2(text, text, integer, integer, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
BEGIN
    RETURN query EXECUTE
        $sql$
        SELECT * FROM (
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name || '/' AS name,
                    NULL::uuid AS id,
                    NULL::timestamptz AS updated_at,
                    NULL::timestamptz AS created_at,
                    NULL::jsonb AS metadata
                FROM storage.prefixes
                WHERE name COLLATE "C" LIKE $1 || '%'
                AND bucket_id = $2
                AND level = $4
                AND name COLLATE "C" > $5
                ORDER BY prefixes.name COLLATE "C" LIMIT $3
            )
            UNION ALL
            (SELECT split_part(name, '/', $4) AS key,
                name,
                id,
                updated_at,
                created_at,
                metadata
            FROM storage.objects
            WHERE name COLLATE "C" LIKE $1 || '%'
                AND bucket_id = $2
                AND level = $4
                AND name COLLATE "C" > $5
            ORDER BY name COLLATE "C" LIMIT $3)
        ) obj
        ORDER BY name COLLATE "C" LIMIT $3;
        $sql$
        USING prefix, bucket_name, limits, levels, start_after;
END;
$_$;


ALTER FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text) OWNER TO supabase_storage_admin;

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
    tag text
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
-- Name: amenities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.amenities (
    amenity_id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.amenities OWNER TO postgres;

--
-- Name: bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookings (
    booking_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    facility_id uuid,
    slot_id uuid,
    booking_date timestamp without time zone,
    start_time timestamp without time zone NOT NULL,
    end_time timestamp without time zone NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    status text DEFAULT 'pending'::text,
    payment_status text DEFAULT 'pending'::text,
    cancellation_reason text,
    cancelled_by uuid,
    CONSTRAINT bookings_payment_status_check CHECK ((payment_status = ANY (ARRAY['pending'::text, 'paid'::text, 'failed'::text, 'refunded'::text]))),
    CONSTRAINT bookings_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'cancelled'::text, 'completed'::text, 'refunded'::text])))
);


ALTER TABLE public.bookings OWNER TO postgres;

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
    transaction_date timestamp without time zone,
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
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.facility_amenities OWNER TO postgres;

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
    transaction_date timestamp without time zone,
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
    transaction_date timestamp without time zone,
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
    created_at timestamp without time zone
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
    facility_id uuid,
    start_time timestamp without time zone NOT NULL,
    end_time timestamp without time zone NOT NULL,
    is_available boolean DEFAULT true,
    price_override numeric(10,2)
);


ALTER TABLE public.time_slots OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id uuid DEFAULT gen_random_uuid() NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    first_name character varying(50),
    last_name character varying(50),
    phone_number character varying(20),
    role text DEFAULT 'player'::text,
    credit_balance numeric(10,2) DEFAULT 0.00 NOT NULL,
    points_balance numeric(10,2) DEFAULT 0.00 NOT NULL,
    registration_date timestamp without time zone,
    last_login timestamp without time zone,
    is_active boolean DEFAULT true,
    CONSTRAINT users_role_check CHECK ((role = ANY (ARRAY['player'::text, 'venue_owner'::text, 'admin'::text])))
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
3ffeb52c-11ee-45f0-8b43-48dbca566c45	2025-08-16 08:38:27.411024+00	2025-08-16 08:38:27.411024+00	password	a3f6c081-5505-41c4-ad75-b7e34bba02dd
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
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
00000000-0000-0000-0000-000000000000	91	2fiw3tse3wp5	c90139a0-2de3-4237-89b8-032367f73a37	f	2025-08-16 08:38:27.408346+00	2025-08-16 08:38:27.408346+00	\N	3ffeb52c-11ee-45f0-8b43-48dbca566c45
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
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag) FROM stdin;
3ffeb52c-11ee-45f0-8b43-48dbca566c45	c90139a0-2de3-4237-89b8-032367f73a37	2025-08-16 08:38:27.406362+00	2025-08-16 08:38:27.406362+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0	49.36.89.164	\N
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
00000000-0000-0000-0000-000000000000	073c625c-eb02-45e8-9c67-50acbdc72cd6	authenticated	authenticated	harsh@gmail.com	$2a$10$4KK/J4ROUoG4YacY/9oQluMayEemAbAWOSoXzXwIOg53cosk3zCLm	2025-08-10 08:14:37.525903+00	\N		\N		\N			\N	2025-08-14 08:51:06.962446+00	{"provider": "email", "providers": ["email"]}	{"sub": "073c625c-eb02-45e8-9c67-50acbdc72cd6", "email": "harsh@gmail.com", "last_name": "shah", "first_name": "harsh", "email_verified": true, "phone_verified": false}	\N	2025-08-10 08:14:37.499555+00	2025-08-14 15:55:55.663927+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	authenticated	authenticated	otherswayam@gmail.com	$2a$10$24Vj8oF.MDV8c5ag0wnMRuW.VUWaQ9Ec616AAmamkklJpDKKcNxNy	2025-08-09 05:53:37.131872+00	\N		\N		\N			\N	2025-08-16 08:37:55.656713+00	{"provider": "email", "providers": ["email"]}	{"sub": "bb3e7bae-8aed-4e6c-bb71-bd644eff5402", "email": "otherswayam@gmail.com", "last_name": "shah", "first_name": "swayam", "email_verified": true, "phone_verified": false}	\N	2025-08-09 05:53:37.123654+00	2025-08-16 08:37:55.667013+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	c90139a0-2de3-4237-89b8-032367f73a37	authenticated	authenticated	surbhiroy780@gmail.com	$2a$10$rzcB77Trm6WgTT34mHyQ4u1o9.O6X9p1STGBcV9ru.jCBQ97mPntW	2025-08-09 05:56:52.519796+00	\N		\N		\N			\N	2025-08-16 08:38:27.406274+00	{"provider": "email", "providers": ["email"]}	{"sub": "c90139a0-2de3-4237-89b8-032367f73a37", "email": "surbhiroy780@gmail.com", "last_name": "roy", "first_name": "srubhi", "email_verified": true, "phone_verified": false}	\N	2025-08-09 05:56:52.503913+00	2025-08-16 08:38:27.410617+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	e86f726e-9210-47ca-8dc7-c84d46cc55e2	authenticated	authenticated	admin@playnation.com	$2a$10$Odpx/MPYwsSsCf4Uiywd1OgDxHtZ8IXE7531egy3pILZ0da.1sAMu	2025-08-10 08:50:46.562958+00	\N		\N		\N			\N	2025-08-10 14:17:12.022867+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2025-08-10 08:50:46.541627+00	2025-08-10 14:17:12.027124+00	\N	\N			\N		0	\N		\N	f	\N	f
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
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bookings (booking_id, user_id, facility_id, slot_id, booking_date, start_time, end_time, total_amount, status, payment_status, cancellation_reason, cancelled_by) FROM stdin;
8a3bd22b-689a-4f10-8d2e-e52ab0163aa3	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	f3f3f3f3-3333-41d4-a7f6-000000000003	1400cf89-0b6f-4c54-9d25-3b95d9fcda02	2025-08-10 11:37:24.227	2025-08-10 06:00:00	2025-08-10 07:00:00	1200.00	confirmed	paid	\N	\N
f6c73d23-c15e-4a15-a885-fb927a063bb9	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	f3f3f3f3-3333-41d4-a7f6-000000000003	50a7b6e1-c321-43e9-a206-829206d3a0f4	2025-08-10 11:37:32.745	2025-08-10 08:00:00	2025-08-10 09:00:00	1200.00	confirmed	paid	\N	\N
2f17c142-25d4-42d7-b0ad-12328fad356f	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	f4f4f4f4-4444-41d4-a7f6-000000000004	092d75e5-c1a0-4e24-81d4-7934f3410f32	2025-08-10 12:01:38.611	2025-08-10 19:00:00	2025-08-10 20:00:00	350.00	confirmed	paid	\N	\N
d65fb628-822b-4cdf-a231-afef6a1fa068	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	f5f5f5f5-5555-41d4-a7f6-000000000005	f79aed18-61fc-41c5-bb54-07f99e371ea6	2025-08-10 12:01:50.227	2025-08-10 21:00:00	2025-08-10 22:00:00	350.00	confirmed	paid	\N	\N
28da6264-3f71-4574-a3f0-39568a9dcfed	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	f4f4f4f4-4444-41d4-a7f6-000000000004	f9a7f7e9-2a14-42b4-8344-a87630f9023b	2025-08-11 15:51:29.938	2025-08-12 19:00:00	2025-08-12 20:00:00	350.00	confirmed	paid	\N	\N
a5823fdc-0178-4063-8a79-6fb2578ec1c8	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	f3f3f3f3-3333-41d4-a7f6-000000000003	ca0c3f39-31e7-4dce-ac38-ce9a3308b43b	2025-08-11 15:56:38.709	2025-08-12 21:00:00	2025-08-12 22:00:00	1200.00	confirmed	paid	\N	\N
64121cf1-5166-491d-82ca-0de8195ec7cd	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	f3f3f3f3-3333-41d4-a7f6-000000000003	535bbadb-3955-47f4-bde7-67c83491461e	2025-08-11 17:06:04.716	2025-08-11 20:00:00	2025-08-11 21:00:00	1200.00	confirmed	paid	\N	\N
417c41c7-b843-4378-b144-b0dc2cbaaf86	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	f3f3f3f3-3333-41d4-a7f6-000000000003	abfcc3a4-66d3-49e2-b25f-1e5195f2a3e8	2025-08-11 17:06:09.483	2025-08-10 09:00:00	2025-08-10 10:00:00	1200.00	confirmed	paid	\N	\N
0d99b537-420f-40e2-993b-21317e43949d	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	f3f3f3f3-3333-41d4-a7f6-000000000003	20a09030-8768-4457-907b-c6400d564ead	2025-08-12 07:27:22.549	2025-08-12 16:00:00	2025-08-12 17:00:00	1200.00	confirmed	paid	\N	\N
3d8814dc-719b-485b-a75c-36355a99542b	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	f4f4f4f4-4444-41d4-a7f6-000000000004	b0effd17-b50f-41c3-9b3f-c6ab7bf271d5	2025-08-14 16:03:23.124	2025-08-14 20:00:00	2025-08-14 21:00:00	350.00	confirmed	paid	\N	\N
78f9ed10-d040-44f5-ae99-0546852307eb	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	f3f3f3f3-3333-41d4-a7f6-000000000003	6ab9d9dd-e08d-4012-bb45-3e6afaee2c4a	2025-08-15 07:53:01.903	2025-08-15 16:00:00	2025-08-15 17:00:00	1200.00	cancelled	refunded	\N	bb3e7bae-8aed-4e6c-bb71-bd644eff5402
4ee83973-10f7-413a-810e-cda1e35ef25d	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	f3f3f3f3-3333-41d4-a7f6-000000000003	e55c3dd7-fa06-4429-8fe0-5a48038292ef	2025-08-15 08:00:58.547	2025-08-15 17:00:00	2025-08-15 18:00:00	1200.00	cancelled	refunded	\N	bb3e7bae-8aed-4e6c-bb71-bd644eff5402
baae81bc-2de4-4557-b653-bfabf1f4d393	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	f3f3f3f3-3333-41d4-a7f6-000000000003	17d84ec0-2eab-47a3-bc97-27c47433350f	2025-08-15 08:08:15.768	2025-08-15 18:00:00	2025-08-15 19:00:00	1200.00	cancelled	refunded	\N	bb3e7bae-8aed-4e6c-bb71-bd644eff5402
774d7d76-fddc-4f8e-a25e-6966669bff2c	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	f3f3f3f3-3333-41d4-a7f6-000000000003	e55c3dd7-fa06-4429-8fe0-5a48038292ef	2025-08-15 08:12:31.215	2025-08-15 17:00:00	2025-08-15 18:00:00	1200.00	confirmed	paid	\N	\N
e0794764-5150-437d-b965-d6b66757c029	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	f3f3f3f3-3333-41d4-a7f6-000000000003	17d84ec0-2eab-47a3-bc97-27c47433350f	2025-08-15 08:40:31.918	2025-08-15 18:00:00	2025-08-15 19:00:00	1200.00	confirmed	paid	\N	\N
fbff2e3a-6030-4d68-8411-54ca41b7e210	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	f4f4f4f4-4444-41d4-a7f6-000000000004	8a0f9e21-a087-420f-b275-be181f5e65fd	2025-08-16 08:38:13.092	2025-08-16 17:00:00	2025-08-16 18:00:00	350.00	confirmed	paid	\N	\N
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
f1f1f1f1-1111-41d4-a7f6-000000000001	a1a1a1a1-1111-41d4-a7f6-000000000001	550e8400-e29b-41d4-a716-446655440001	Cricket Net A	\N	10	800.00	t
f2f2f2f2-2222-41d4-a7f6-000000000002	a1a1a1a1-1111-41d4-a7f6-000000000001	550e8400-e29b-41d4-a716-446655440001	Cricket Net B	\N	10	800.00	t
f3f3f3f3-3333-41d4-a7f6-000000000003	b2b2b2b2-2222-41d4-a7f6-000000000002	550e8400-e29b-41d4-a716-446655440002	Football Turf 1	\N	12	1200.00	t
f4f4f4f4-4444-41d4-a7f6-000000000004	c3c3c3c3-3333-41d4-a7f6-000000000003	550e8400-e29b-41d4-a716-446655440005	Badminton Court 1	\N	4	350.00	t
f5f5f5f5-5555-41d4-a7f6-000000000005	c3c3c3c3-3333-41d4-a7f6-000000000003	550e8400-e29b-41d4-a716-446655440005	Badminton Court 2	\N	4	350.00	t
8f45470a-81ca-42cb-92e7-8873da55e1f4	1dde8e3f-b39d-446a-b8b1-cd1b958804a6	550e8400-e29b-41d4-a716-446655440007	table 1	\N	4	150.00	t
3757d7b1-b559-4a2a-920c-23302134f24d	1dde8e3f-b39d-446a-b8b1-cd1b958804a6	550e8400-e29b-41d4-a716-446655440007	table 2	\N	4	300.00	t
\.


--
-- Data for Name: facility_amenities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.facility_amenities (facility_id, amenity_id, created_at, updated_at) FROM stdin;
f3f3f3f3-3333-41d4-a7f6-000000000003	660e8400-e29b-41d4-a716-446655440001	2025-08-09 10:24:59.551452	2025-08-09 10:24:59.551452
f3f3f3f3-3333-41d4-a7f6-000000000003	660e8400-e29b-41d4-a716-446655440002	2025-08-09 10:24:59.551452	2025-08-09 10:24:59.551452
f3f3f3f3-3333-41d4-a7f6-000000000003	660e8400-e29b-41d4-a716-446655440008	2025-08-09 10:24:59.551452	2025-08-09 10:24:59.551452
f1f1f1f1-1111-41d4-a7f6-000000000001	660e8400-e29b-41d4-a716-446655440001	2025-08-09 10:24:59.551452	2025-08-09 10:24:59.551452
f1f1f1f1-1111-41d4-a7f6-000000000001	660e8400-e29b-41d4-a716-446655440002	2025-08-09 10:24:59.551452	2025-08-09 10:24:59.551452
f1f1f1f1-1111-41d4-a7f6-000000000001	660e8400-e29b-41d4-a716-446655440007	2025-08-09 10:24:59.551452	2025-08-09 10:24:59.551452
f4f4f4f4-4444-41d4-a7f6-000000000004	660e8400-e29b-41d4-a716-446655440001	2025-08-09 10:24:59.551452	2025-08-09 10:24:59.551452
f4f4f4f4-4444-41d4-a7f6-000000000004	660e8400-e29b-41d4-a716-446655440002	2025-08-09 10:24:59.551452	2025-08-09 10:24:59.551452
f4f4f4f4-4444-41d4-a7f6-000000000004	660e8400-e29b-41d4-a716-446655440003	2025-08-09 10:24:59.551452	2025-08-09 10:24:59.551452
f4f4f4f4-4444-41d4-a7f6-000000000004	660e8400-e29b-41d4-a716-446655440006	2025-08-09 10:24:59.551452	2025-08-09 10:24:59.551452
8f45470a-81ca-42cb-92e7-8873da55e1f4	660e8400-e29b-41d4-a716-446655440001	2025-08-10 14:29:07.006	2025-08-10 14:29:07.006
8f45470a-81ca-42cb-92e7-8873da55e1f4	660e8400-e29b-41d4-a716-446655440004	2025-08-10 14:29:07.006	2025-08-10 14:29:07.006
8f45470a-81ca-42cb-92e7-8873da55e1f4	660e8400-e29b-41d4-a716-446655440005	2025-08-10 14:29:07.006	2025-08-10 14:29:07.006
8f45470a-81ca-42cb-92e7-8873da55e1f4	660e8400-e29b-41d4-a716-446655440002	2025-08-10 14:29:07.006	2025-08-10 14:29:07.006
8f45470a-81ca-42cb-92e7-8873da55e1f4	660e8400-e29b-41d4-a716-446655440006	2025-08-10 14:29:07.006	2025-08-10 14:29:07.006
3757d7b1-b559-4a2a-920c-23302134f24d	660e8400-e29b-41d4-a716-446655440001	2025-08-10 14:29:07.441	2025-08-10 14:29:07.441
3757d7b1-b559-4a2a-920c-23302134f24d	660e8400-e29b-41d4-a716-446655440004	2025-08-10 14:29:07.441	2025-08-10 14:29:07.441
3757d7b1-b559-4a2a-920c-23302134f24d	660e8400-e29b-41d4-a716-446655440005	2025-08-10 14:29:07.441	2025-08-10 14:29:07.441
3757d7b1-b559-4a2a-920c-23302134f24d	660e8400-e29b-41d4-a716-446655440002	2025-08-10 14:29:07.441	2025-08-10 14:29:07.441
3757d7b1-b559-4a2a-920c-23302134f24d	660e8400-e29b-41d4-a716-446655440006	2025-08-10 14:29:07.441	2025-08-10 14:29:07.441
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

COPY public.reviews (review_id, user_id, venue_id, rating, comment, created_at) FROM stdin;
11cec7f7-e650-4a8f-b811-3217492680c6	bb3e7bae-8aed-4e6c-bb71-bd644eff5402	b2b2b2b2-2222-41d4-a7f6-000000000002	5	Amazing turf quality and great service!	2025-08-09 10:10:50.930041
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

COPY public.time_slots (slot_id, facility_id, start_time, end_time, is_available, price_override) FROM stdin;
f9f003e3-67d7-497c-be1c-e4b00f1443f5	8f45470a-81ca-42cb-92e7-8873da55e1f4	2025-08-14 22:00:00	2025-08-14 23:00:00	t	\N
cf23ad30-9b40-43ec-b4ba-a63cba837aea	8f45470a-81ca-42cb-92e7-8873da55e1f4	2025-08-14 21:00:00	2025-08-14 22:00:00	t	\N
24d57798-7e41-457e-b57e-f1c97effbdf5	8f45470a-81ca-42cb-92e7-8873da55e1f4	2025-08-14 20:00:00	2025-08-14 21:00:00	t	\N
02652aa5-cd96-4c8d-964f-b861e5a21e4c	8f45470a-81ca-42cb-92e7-8873da55e1f4	2025-08-14 19:00:00	2025-08-14 20:00:00	t	\N
152747ad-490b-41f9-951a-1576ce41bae8	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-15 20:00:00	2025-08-15 21:00:00	t	\N
2c247f9f-2cda-4f6e-9d0e-cc9cc2881cc1	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-15 21:00:00	2025-08-15 22:00:00	t	\N
ab44ebdc-1142-4ec4-887d-573d9ec080de	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-16 15:00:00	2025-08-16 16:00:00	t	\N
b34e0da8-fcad-4a24-befd-3cee05b19959	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-16 21:00:00	2025-08-16 22:00:00	t	\N
0edd3191-66a7-4ea0-83b7-17898e497afd	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-16 20:00:00	2025-08-16 21:00:00	t	\N
bd3baac2-aafb-4136-a33f-220f04013556	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-16 19:00:00	2025-08-16 20:00:00	t	\N
070eed7a-c3a3-42f9-88c5-8b05baf30bfa	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-16 16:00:00	2025-08-16 17:00:00	t	\N
27dab3e2-3b9c-4625-b9c6-c98fad52d22c	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-16 17:00:00	2025-08-16 18:00:00	t	\N
6aad28d8-19bf-4096-8bbf-360c9a9b6737	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-16 18:00:00	2025-08-16 19:00:00	t	\N
47b37e01-f355-4792-8a79-551de023b8ec	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-17 15:00:00	2025-08-17 16:00:00	t	\N
e2dd2167-d7c2-4ab1-8c73-e4c270865049	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-17 16:00:00	2025-08-17 17:00:00	t	\N
f88636b1-ff1d-4e3f-bcae-40e465d50793	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-17 18:00:00	2025-08-17 19:00:00	t	\N
ce30ca83-7cd0-4730-802b-46bf7ce1682c	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-17 17:00:00	2025-08-17 18:00:00	t	\N
f400c05b-3087-4d52-b3c7-ab8746fe8330	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-17 21:00:00	2025-08-17 22:00:00	t	\N
5c3d9897-00ba-455c-8903-07ec5f185014	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-17 20:00:00	2025-08-17 21:00:00	t	\N
a5d09299-f9a2-4615-a42d-f48a0b1cc343	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-17 19:00:00	2025-08-17 20:00:00	t	\N
5912f555-e8bb-417b-a770-b9f2a9d92946	f4f4f4f4-4444-41d4-a7f6-000000000004	2025-08-14 18:00:00	2025-08-14 19:00:00	t	\N
a5527ae9-3fdf-4397-a3c8-2a476c5c5f0e	f4f4f4f4-4444-41d4-a7f6-000000000004	2025-08-14 19:00:00	2025-08-14 20:00:00	t	\N
3c94a70e-67b6-4ae9-8595-caeb87062eec	f4f4f4f4-4444-41d4-a7f6-000000000004	2025-08-15 17:00:00	2025-08-15 18:00:00	t	\N
c7859d9a-b74f-4021-88bb-f809acde3d26	f4f4f4f4-4444-41d4-a7f6-000000000004	2025-08-15 18:00:00	2025-08-15 19:00:00	t	\N
fc507fc1-ad76-47b5-bb17-cfbca1bafda4	f4f4f4f4-4444-41d4-a7f6-000000000004	2025-08-15 19:00:00	2025-08-15 20:00:00	t	\N
d2245bc3-f901-4639-be69-ec9d87e7d955	f4f4f4f4-4444-41d4-a7f6-000000000004	2025-08-15 20:00:00	2025-08-15 21:00:00	t	\N
2386d929-c9d0-484a-8221-b616b6b19e6c	f4f4f4f4-4444-41d4-a7f6-000000000004	2025-08-16 19:00:00	2025-08-16 20:00:00	t	\N
198051b1-d665-4601-bc4b-7a8e35fbce63	f4f4f4f4-4444-41d4-a7f6-000000000004	2025-08-16 20:00:00	2025-08-16 21:00:00	t	\N
ff7ffa05-0676-441d-a83c-b5764c7a6853	f5f5f5f5-5555-41d4-a7f6-000000000005	2025-08-16 17:00:00	2025-08-16 18:00:00	t	\N
1a6d772b-5392-4fd5-9d7b-66ed3ad036fa	f5f5f5f5-5555-41d4-a7f6-000000000005	2025-08-16 18:00:00	2025-08-16 19:00:00	t	\N
629bbbc0-135f-45cd-93f3-af11aaace41e	f5f5f5f5-5555-41d4-a7f6-000000000005	2025-08-16 19:00:00	2025-08-16 20:00:00	t	\N
df330d5d-a49d-47fb-91af-16265e9a214c	f5f5f5f5-5555-41d4-a7f6-000000000005	2025-08-16 20:00:00	2025-08-16 21:00:00	t	\N
948865ff-9598-4de7-b0d4-8e4dcda60b9c	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-10 07:00:00	2025-08-10 08:00:00	t	\N
1400cf89-0b6f-4c54-9d25-3b95d9fcda02	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-10 06:00:00	2025-08-10 07:00:00	f	\N
50a7b6e1-c321-43e9-a206-829206d3a0f4	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-10 08:00:00	2025-08-10 09:00:00	f	\N
c30e7c26-be17-4bc0-a144-a55dae1eb104	f5f5f5f5-5555-41d4-a7f6-000000000005	2025-08-15 17:00:00	2025-08-15 18:00:00	t	\N
0b4b6697-e1e7-4879-92f4-9a725ee8592e	f5f5f5f5-5555-41d4-a7f6-000000000005	2025-08-15 18:00:00	2025-08-15 19:00:00	t	\N
4b4fcc4e-da15-4414-97ae-f5e4a4491811	f5f5f5f5-5555-41d4-a7f6-000000000005	2025-08-15 20:00:00	2025-08-15 21:00:00	t	\N
94601140-4bf1-43d6-8c82-5ff847e5607a	f4f4f4f4-4444-41d4-a7f6-000000000004	2025-08-10 20:00:00	2025-08-10 21:00:00	t	\N
64ba406a-671b-46aa-a704-da1f45c70579	f4f4f4f4-4444-41d4-a7f6-000000000004	2025-08-10 21:00:00	2025-08-10 22:00:00	t	\N
a89c57f6-b436-40fc-a855-c8217ffd2620	f5f5f5f5-5555-41d4-a7f6-000000000005	2025-08-10 19:00:00	2025-08-10 20:00:00	t	\N
5a0cfe54-59d0-4799-8e2d-1fedcda481a2	f5f5f5f5-5555-41d4-a7f6-000000000005	2025-08-14 17:00:00	2025-08-14 18:00:00	t	\N
04dd994e-9dc4-4cb8-9688-cb0a1293eb9f	f5f5f5f5-5555-41d4-a7f6-000000000005	2025-08-14 18:00:00	2025-08-14 19:00:00	t	\N
8dfc149c-c062-4f2e-a426-dfc4b580ed0c	f5f5f5f5-5555-41d4-a7f6-000000000005	2025-08-10 20:00:00	2025-08-10 21:00:00	t	\N
092d75e5-c1a0-4e24-81d4-7934f3410f32	f4f4f4f4-4444-41d4-a7f6-000000000004	2025-08-10 19:00:00	2025-08-10 20:00:00	f	\N
f79aed18-61fc-41c5-bb54-07f99e371ea6	f5f5f5f5-5555-41d4-a7f6-000000000005	2025-08-10 21:00:00	2025-08-10 22:00:00	f	\N
ac6473a8-3e03-494a-af70-33d49c1a537c	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-11 21:00:00	2025-08-11 22:00:00	t	\N
8ac225ad-e6e2-4ced-95b0-98068cbef8b9	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-11 22:00:00	2025-08-11 23:00:00	t	\N
286795e8-be73-408b-95bb-050ef8a85bbd	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-11 23:00:00	2025-08-12 00:00:00	t	\N
fe885613-8794-4145-8cea-a36631762fd5	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-12 17:00:00	2025-08-12 18:00:00	t	\N
9ddc823a-49ed-41be-8590-76a427d2ad4c	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-12 18:00:00	2025-08-12 19:00:00	t	\N
526b1bda-5447-4526-a2d3-2f374b1001a1	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-12 19:00:00	2025-08-12 20:00:00	t	\N
7bf9bc36-825b-4d0e-9569-d2d7e188e1af	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-12 20:00:00	2025-08-12 21:00:00	t	\N
a669a712-56d9-45b6-a985-09e40ac076ce	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-12 22:00:00	2025-08-12 23:00:00	t	\N
089a96db-3c04-4b37-a502-27cfd7abff23	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-12 23:00:00	2025-08-13 00:00:00	t	\N
0ff5daef-2e96-4d4e-828c-afcfe3debf0b	f4f4f4f4-4444-41d4-a7f6-000000000004	2025-08-12 16:00:00	2025-08-12 17:00:00	t	\N
d9b0c3f4-00f6-423c-8f82-9ff98467e84a	f4f4f4f4-4444-41d4-a7f6-000000000004	2025-08-12 17:00:00	2025-08-12 18:00:00	t	\N
7201bad5-fd0c-4d3e-b01a-1e530568c238	f4f4f4f4-4444-41d4-a7f6-000000000004	2025-08-12 18:00:00	2025-08-12 19:00:00	t	\N
d286346e-6627-46f7-b62e-b49d872c7d38	f4f4f4f4-4444-41d4-a7f6-000000000004	2025-08-12 20:00:00	2025-08-12 21:00:00	t	\N
f9a7f7e9-2a14-42b4-8344-a87630f9023b	f4f4f4f4-4444-41d4-a7f6-000000000004	2025-08-12 19:00:00	2025-08-12 20:00:00	f	\N
ca0c3f39-31e7-4dce-ac38-ce9a3308b43b	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-12 21:00:00	2025-08-12 22:00:00	f	\N
535bbadb-3955-47f4-bde7-67c83491461e	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-11 20:00:00	2025-08-11 21:00:00	f	\N
abfcc3a4-66d3-49e2-b25f-1e5195f2a3e8	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-10 09:00:00	2025-08-10 10:00:00	f	\N
20a09030-8768-4457-907b-c6400d564ead	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-12 16:00:00	2025-08-12 17:00:00	f	\N
89aa5181-08eb-4134-8fc8-2c6e86262189	f5f5f5f5-5555-41d4-a7f6-000000000005	2025-08-14 19:00:00	2025-08-14 20:00:00	t	\N
217cf937-6ef7-41bd-9114-66ff7cebbec4	f5f5f5f5-5555-41d4-a7f6-000000000005	2025-08-14 20:00:00	2025-08-14 21:00:00	t	\N
44b747e0-0cb1-4bea-b557-07fe82e980db	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-15 19:00:00	2025-08-15 20:00:00	f	\N
b0effd17-b50f-41c3-9b3f-c6ab7bf271d5	f4f4f4f4-4444-41d4-a7f6-000000000004	2025-08-14 20:00:00	2025-08-14 21:00:00	f	\N
20c828d9-9f4d-4c28-bb62-4d1efc5ca33f	f4f4f4f4-4444-41d4-a7f6-000000000004	2025-08-16 18:00:00	2025-08-16 19:00:00	f	\N
e5b56f08-f8dd-4772-bee8-34b1fe2ba3d9	f5f5f5f5-5555-41d4-a7f6-000000000005	2025-08-15 19:00:00	2025-08-15 20:00:00	f	\N
eb00eeca-5103-417e-aa4b-4eda6d4694b3	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-14 14:00:00	2025-08-14 15:00:00	t	\N
cde6c64f-4a08-4957-acbd-073c82ace8c6	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-14 15:00:00	2025-08-14 16:00:00	t	\N
45a7dc59-cf96-496c-878a-94ab6ef09ed6	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-14 16:00:00	2025-08-14 17:00:00	t	\N
eabf17e3-7f4e-4cd4-bb42-497a677e046e	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-15 15:00:00	2025-08-15 16:00:00	f	\N
6ab9d9dd-e08d-4012-bb45-3e6afaee2c4a	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-15 16:00:00	2025-08-15 17:00:00	f	\N
e55c3dd7-fa06-4429-8fe0-5a48038292ef	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-15 17:00:00	2025-08-15 18:00:00	f	\N
17d84ec0-2eab-47a3-bc97-27c47433350f	f3f3f3f3-3333-41d4-a7f6-000000000003	2025-08-15 18:00:00	2025-08-15 19:00:00	f	\N
8a0f9e21-a087-420f-b275-be181f5e65fd	f4f4f4f4-4444-41d4-a7f6-000000000004	2025-08-16 17:00:00	2025-08-16 18:00:00	f	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, username, email, first_name, last_name, phone_number, role, credit_balance, points_balance, registration_date, last_login, is_active) FROM stdin;
bb3e7bae-8aed-4e6c-bb71-bd644eff5402	swayam	otherswayam@gmail.com	swayam	shah	6353040453	player	0.00	0.00	\N	\N	t
073c625c-eb02-45e8-9c67-50acbdc72cd6	harsh	harsh@gmail.com	harsh	shah	09426775977	venue_owner	0.00	0.00	\N	\N	t
e86f726e-9210-47ca-8dc7-c84d46cc55e2	admin	admin@playnation.com	admin	\N	\N	admin	0.00	0.00	\N	\N	t
c90139a0-2de3-4237-89b8-032367f73a37	surbhi	surbhiroy780@gmail.com	srubhi	roy	07852156984	venue_owner	0.00	0.00	\N	\N	t
\.


--
-- Data for Name: venues; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.venues (venue_id, owner_id, name, address, city, state, zip_code, description, contact_email, contact_phone, latitude, longitude, opening_time, closing_time, is_approved, created_at, updated_at, image_url) FROM stdin;
a1a1a1a1-1111-41d4-a7f6-000000000001	073c625c-eb02-45e8-9c67-50acbdc72cd6	Elite Sports Arena	123 VIP Road	Surat	Gujarat	395007	State-of-the-art multi-sport facility with floodlights.	\N	\N	\N	\N	06:00:00	23:00:00	t	2025-08-09 10:10:50.930041	2025-08-09 10:10:50.930041	https://okgeuiooqfqdxxqxjeod.supabase.co/storage/v1/object/public/venue-images/hero-playnation.jpg
1dde8e3f-b39d-446a-b8b1-cd1b958804a6	073c625c-eb02-45e8-9c67-50acbdc72cd6	Pool & Snooker	Adajan	surat	gujarat	395007	Step into the ultimate haven for snooker enthusiasts. With tournament-grade tables, ambient lighting, and a relaxed lounge atmosphere, CuePoint offers the perfect blend of competition and camaraderie. Whether you're a seasoned player or just picking up a cue, our club is your go-to destination for precision, passion, and play.	ps@gmail.com	08888888888	\N	\N	06:00:00	23:00:00	t	\N	\N	https://okgeuiooqfqdxxqxjeod.supabase.co/storage/v1/object/public/venue-images/venue-turf.jpg
b2b2b2b2-2222-41d4-a7f6-000000000002	c90139a0-2de3-4237-89b8-032367f73a37	Champion Turf	700 VIP road, Vesu	Surat	Gujarat	395007	Premium 5-a-side football turf with excellent drainage.	championturf@gmail.com	8753214569	\N	\N	07:00:00	22:00:00	t	2025-08-09 10:10:50.930041	2025-08-09 10:10:50.930041	https://okgeuiooqfqdxxqxjeod.supabase.co/storage/v1/object/public/venue-images/venue-pickleball.jpg
c3c3c3c3-3333-41d4-a7f6-000000000003	c90139a0-2de3-4237-89b8-032367f73a37	Adajan Badminton Club	789 Ghod Dod Road	Surat	Gujarat	395001	Professional wooden courts for badminton enthusiasts.	badmintonclub@gmail.com	08523654821	\N	\N	09:00:00	21:00:00	t	2025-08-09 10:10:50.930041	2025-08-09 10:10:50.930041	https://okgeuiooqfqdxxqxjeod.supabase.co/storage/v1/object/public/venue-images/venue-snooker.jpg
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
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata, level) FROM stdin;
405798bd-3acb-4e07-87bd-e95286d56634	venue-images	hero-playnation.jpg	\N	2025-08-09 11:51:04.245245+00	2025-08-09 17:34:41.540568+00	2025-08-09 11:51:04.245245+00	{"eTag": "\\"c13a5713e1463941e160cce15dcaabe7-1\\"", "size": 42571, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-08-09T11:51:04.000Z", "contentLength": 42571, "httpStatusCode": 200}	c742db23-7d40-477d-9227-44d6e1133f3a	\N	\N	1
af5bf9e9-1a75-46ff-88c9-4573f3cbab82	venue-images	venue-pickleball.jpg	\N	2025-08-09 11:51:04.24646+00	2025-08-09 17:34:41.540568+00	2025-08-09 11:51:04.24646+00	{"eTag": "\\"70f5359a0bb7c9fb35ae894d2e6c52e2-1\\"", "size": 81937, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-08-09T11:51:04.000Z", "contentLength": 81937, "httpStatusCode": 200}	dc3fca7a-57bf-4500-979b-2fd71bba29b3	\N	\N	1
475337b8-d9ca-49ce-9ba8-247f50798d18	venue-images	venue-snooker.jpg	\N	2025-08-09 11:51:04.233952+00	2025-08-09 17:34:41.540568+00	2025-08-09 11:51:04.233952+00	{"eTag": "\\"1429a8b25a618567ffadf1d6c721c084-1\\"", "size": 78274, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-08-09T11:51:04.000Z", "contentLength": 78274, "httpStatusCode": 200}	c9c19d51-2070-47b9-a509-826fcf56d479	\N	\N	1
b2875b73-888a-463e-b9bc-a4c948ffbb9f	venue-images	venue-turf.jpg	\N	2025-08-09 11:51:04.179971+00	2025-08-09 17:34:41.540568+00	2025-08-09 11:51:04.179971+00	{"eTag": "\\"781b462416c485ca3678feb05a51882c-1\\"", "size": 129525, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-08-09T11:51:04.000Z", "contentLength": 129525, "httpStatusCode": 200}	447d1447-810a-4596-96ff-343ec9203830	\N	\N	1
\.


--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.prefixes (bucket_id, name, created_at, updated_at) FROM stdin;
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
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 91, true);


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
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


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
    ADD CONSTRAINT bookings_cancelled_by_fkey FOREIGN KEY (cancelled_by) REFERENCES public.users(user_id) ON DELETE SET NULL;


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
    ADD CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: credit_transactions credit_transactions_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit_transactions
    ADD CONSTRAINT credit_transactions_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(booking_id) ON DELETE SET NULL;


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
-- Name: payments payments_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(booking_id) ON DELETE CASCADE;


--
-- Name: points_transactions points_transactions_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.points_transactions
    ADD CONSTRAINT points_transactions_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(booking_id) ON DELETE SET NULL;


--
-- Name: points_transactions points_transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.points_transactions
    ADD CONSTRAINT points_transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


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
-- Name: venues Allow owners to insert their own venues; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow owners to insert their own venues" ON public.venues FOR INSERT TO authenticated WITH CHECK (((( SELECT users.role
   FROM public.users
  WHERE (users.user_id = auth.uid())) = 'venue_owner'::text) AND (owner_id = auth.uid())));


--
-- Name: bookings Allow owners to update bookings in their venues; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow owners to update bookings in their venues" ON public.bookings FOR UPDATE TO authenticated USING ((( SELECT v.owner_id
   FROM (public.venues v
     JOIN public.facilities f ON ((v.venue_id = f.venue_id)))
  WHERE (f.facility_id = bookings.facility_id)) = auth.uid()));


--
-- Name: venues Allow owners to update their own venues; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow owners to update their own venues" ON public.venues FOR UPDATE TO authenticated USING ((auth.uid() = owner_id)) WITH CHECK ((auth.uid() = owner_id));


--
-- Name: venues Allow read access based on ownership or approval; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow read access based on ownership or approval" ON public.venues FOR SELECT USING (((is_approved = true) OR (owner_id = auth.uid())));


--
-- Name: bookings Allow users to update (cancel) their own bookings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow users to update (cancel) their own bookings" ON public.bookings FOR UPDATE TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: users Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public.users FOR SELECT USING (true);


--
-- Name: venues; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

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
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT ON TABLE auth.schema_migrations TO postgres WITH GRANT OPTION;


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
-- Name: TABLE amenities; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.amenities TO anon;
GRANT ALL ON TABLE public.amenities TO authenticated;
GRANT ALL ON TABLE public.amenities TO service_role;


--
-- Name: TABLE bookings; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.bookings TO anon;
GRANT ALL ON TABLE public.bookings TO authenticated;
GRANT ALL ON TABLE public.bookings TO service_role;


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

