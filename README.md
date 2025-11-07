# Playnation - Sports Venue Booking Platform

Playnation is a modern, full-stack web application designed to connect players with sports venue owners. It provides a comprehensive, role-based platform for browsing and booking sports facilities, managing venue operations, and administering the entire ecosystem.

This project is built with a database-centric architecture, moving complex business logic (like booking transactions, reporting, and dashboard statistics) into secure PostgreSQL functions, which are called from both the client-side and server-side Edge Functions.

## Table of Contents

- [Core Features](#core-features)
- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development Setup](#local-development-setup)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Backend Deep Dive](#backend-deep-dive)
  - [Database Schema & Logic](#database-schema--logic)
  - [Supabase Edge Functions](#supabase-edge-functions)
- [Testing](#testing)

-----

## Core Features

The application is built around three distinct user roles with tailored experiences for each.

### 1. Player Portal (Default Role)

  - **Explore Venues:** Search, filter, and browse sports venues by city, sport, and other amenities.
  - **View Venue Details:** See facility information, photos, location (via Leaflet map), and read reviews.
  - **Booking System:** Select a facility, date, and available time slot to book.
  - **Player Dashboard:** A personalized dashboard showing upcoming bookings, total spending, and favorite venues.
  - **My Bookings:** A dedicated page to view and manage all past and upcoming bookings, with options to cancel.
  - **User Profile:** Manage personal information and change passwords.

### 2. Venue Owner Portal (`venue_owner` Role)

  - **Owner Dashboard:** An analytics dashboard with charts (via Recharts) for revenue, booking trends, and peak hours.
  - **Venue Management:** Create, edit, and manage multiple venue listings.
  - **Facility Management:** Add and configure individual facilities (e.g., "Court 1", "Turf 2") for each venue.
  - **Slot Management:** A calendar-based interface to manage availability, set custom prices, and block slots.
  - **Offer Management:** Create and manage discount offers (e.g., "50% OFF") for specific venues.
  - **Booking Calendar:** A comprehensive calendar view of all bookings across all venues.
  - **Reporting:** Generate and download PDF reports (via `pdf-lib`) for revenue and booking data.

### 3. Admin Portal (`admin` Role)

  - **Admin Dashboard:** A high-level overview of the entire platform's health, including new users, total bookings, and venues pending approval.
  - **User Management:** View, search, and manage all users. Includes functionality to suspend or activate user accounts.
  - **Venue Management:** Approve or reject new venue submissions from owners.
  - **Booking Management:** View and monitor all bookings across the platform.
  - **Global Offer Management:** Create and manage global offers that apply to all venues.
  - **Notification Center:** View system notifications for new bookings or cancellations.

-----

## Architecture Overview

This project is a modern full-stack application leveraging the Supabase platform.

  * **Frontend:** A client-side rendered (CSR) application built with **React 19** and **Vite**. It uses **Tailwind CSS** for styling and `react-router-dom` for navigation. All page components are code-split using `React.lazy()` and `Suspense` for optimal performance.
  * **Backend (BaaS):** **Supabase** serves as the core backend, providing:
      * **Database:** A **PostgreSQL** database (version 17) with a detailed schema.
      * **Auth:** Manages user sign-up, sign-in, and role-based access control (RBAC).
      * **Storage:** Used to host user avatars and venue images.
      * **Edge Functions:** Server-side Deno functions for secure operations.
  * **Security Model:** The application employs a robust, multi-layered security model:
    1.  **Client-Side:** Routes are protected using a `RequireAuth` component that checks user roles.
    2.  **API-Side:** Edge Functions are secured with JWT verification (`verify_jwt = true`).
    3.  **Database-Side:** **Row Level Security (RLS)** is enabled on all critical tables, ensuring users can only read/write data they are permitted to access. Business logic is encapsulated in `SECURITY DEFINER` SQL functions to run with elevated privileges securely.

-----

## Tech Stack

### Frontend

  - **Framework:** React 19
  - **Build Tool:** Vite
  - **Routing:** React Router v7
  - **Styling:** Tailwind CSS, PostCSS
  - **UI & UX:**
      - Framer Motion (Animations)
      - Recharts (Charts)
      - Leaflet (Interactive Maps)
      - React Icons, Lucide Icons
      - Swiper (Carousels)
      - React Hot Toast (Notifications)
      - DOMPurify (XSS Protection)

### Backend

  - **Platform:** Supabase
  - **Database:** PostgreSQL 17
  - **Auth:** Supabase Auth (Email/Password, JWT)
  - **Serverless:** Supabase Edge Functions (Deno)
  - **Storage:** Supabase Storage
  - **PDF Generation:** `pdf-lib` (used in Edge Function)

### Testing

  - **Runner:** Vitest
  - **Libraries:** React Testing Library, Jest-DOM
  - **UI:** JSDOM

-----

## Getting Started

Follow these instructions to get the project running on your local machine for development and testing.

### Prerequisites

You must have the following tools installed on your system:

  - [Node.js](https://nodejs.org/) (v18 or newer)
  - [npm](https://www.npmjs.com/)
  - [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started)
  - [Git](https://git-scm.com/)

### Local Development Setup

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/your-username/playnation.git
    cd playnation-c
    ```

2.  **Install Frontend Dependencies**

    ```bash
    npm install
    ```

3.  **Start Supabase Local Environment**
    This will spin up the entire backend stack (Postgres, Auth, Storage, etc.) in Docker.

    ```bash
    cd supabase
    supabase start
    ```

    Once it's running, **copy the local database URL and API keys** from the terminal output.

4.  **Restore the Database**
    The provided `playnation.sql` file is a full dump of the database schema, roles, and RLS policies.

      - Take the `DB URL` from the `supabase start` output (it will look like `postgresql://postgres:postgres@127.0.0.1:54322/postgres`).
      - From the project's root directory (`playnation-c`), run the following command to restore the schema:

    <!-- end list -->

    ```bash
    psql 'YOUR_LOCAL_DB_URL' < playnation.sql
    ```

    This will apply the entire schema, create all tables, functions, and RLS policies.

5.  **Configure Environment Variables (Frontend)**

      - In the root directory (`playnation-c`), create a new file named `.env`.
      - Copy the API keys from the `supabase start` output into this file.

    Your `.env.example` should look like this:

    ```env
    # Get these values from the `supabase start` command
    VITE_SUPABASE_URL=http://127.0.0.1:54321
    VITE_SUPABASE_ANON_KEY=YOUR_LOCAL_ANON_KEY
    ```

    Replace `YOUR_LOCAL_ANON_KEY` with the `anon key` from the CLI output.

6.  **Run the Application**

    ```bash
    npm run dev
    ```

    The application will be running live at `http://127.0.0.1:5173` (or the port specified by Vite).

-----

## Project Structure

```
playnation-c/
├── public/                 # Static assets
├── src/                    # Frontend source code
│   ├── assets/             # Images, fonts
│   ├── components/         # Reusable React components (common, auth, admin, etc.)
│   ├── hooks/              # Custom React hooks (e.g., useVenues)
│   ├── pages/              # Top-level page components, organized by role
│   │   ├── admin/
│   │   ├── owner/
│   │   ├── player/
│   │   └── ... (public pages)
│   ├── utils/              # Utility functions
│   ├── App.jsx             # Main application component with routing
│   ├── AuthContext.jsx     # Global authentication context
│   ├── main.jsx            # Application entry point
│   └── supabaseClient.js   # Supabase client initialization
├── supabase/
│   ├── functions/          # Supabase Edge Functions (Deno)
│   │   ├── create-booking/
│   │   ├── generate-invoice/
│   │   ├── generate-report/
│   │   └── ...
│   ├── config.toml         # Supabase project configuration
│   └── seed.sql            # (Optional) Seed data
├── eslint.config.js        # ESLint configuration
├── package.json            # Project dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── playnation.sql          # Master database schema file
└── vite.config.js          # Vite configuration
```

-----

## Available Scripts

From the root directory (`playnation-c`), you can run:

  - `npm run dev`: Starts the Vite development server.
  - `npm run build`: Builds the application for production.
  - `npm run lint`: Lints the project files using ESLint.
  - `npm run preview`: Serves the production build locally.
  - `npm run test`: Runs the test suite with Vitest.

-----

## Backend Deep Dive

The backend's power comes from its deep integration with PostgreSQL.

### Database Schema & Logic

The schema (`playnation.sql`) defines all data relations. Business logic is not in the application server but in the database itself for performance and security.

**Key Tables:**

  - `public.users`: Stores public user profiles and roles (synced from `auth.users`).
  - `public.venues`: Main table for venue information, linked to an `owner_id`.
  - `public.facilities`: Child table for venues (e.g., "Court 1", "Court 2").
  - `public.time_slots`: Defines all available booking slots for each facility.
  - `public.bookings`: The central table for all bookings, linking users, facilities, and slots.
  - `public.reviews`: User-submitted reviews for venues.
  - `public.offers`: Stores discount offers, either global (admin) or per-venue (owner).

**Key SQL Functions:**

  - `handle_new_user()`: A trigger function that automatically creates a `public.users` profile when a new user signs up in `auth.users`.
  - `create_booking_for_user()`: A transaction-safe function that **locks the `time_slots` table** during a booking to prevent race conditions and double-bookings.
  - `cancel_booking_transaction()`: An atomic function that updates the booking status and correctly marks the time slot as available again.
  - `get_owner_dashboard_all_stats()`, `get_player_dashboard_stats()`: Powerful reporting functions that aggregate all statistics for dashboards in a single, fast database query.

### Supabase Edge Functions

Secure server-side logic is handled by Deno Edge Functions. These are primarily used for tasks that shouldn't be exposed to the client or require complex integrations.

  - `/supabase/functions/create-booking`: Securely calls the `create_booking_for_user` SQL function.
  - `/supabase/functions/generate-invoice`: Generates a PDF invoice for a specific booking.
  - `/supabase/functions/generate-report`: Generates a PDF report for venue owners.
  - `/supabase/functions/validate-offer`: Checks the validity of a discount code before applying it.
  - `/supabase/functions/update-user-status`: An admin-only function to suspend or reactivate users.

-----

## Testing

This project uses **Vitest** for testing.

To run the test suite:

```bash
npm run test
```
