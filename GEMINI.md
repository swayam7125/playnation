# Project Overview

This is a React application for booking sports venues, called "PlayNation". It's built with Vite and uses Supabase for its backend. The application allows users to find and book sports venues, and it has different user roles: player, venue owner, and admin.

## Main Technologies

*   **Frontend:** React, Vite, Tailwind CSS, React Router, Leaflet, Recharts
*   **Backend:** Supabase (PostgreSQL, Auth, Storage, Functions)
*   **Testing:** Vitest, React Testing Library

## Architecture

The application follows a component-based architecture with a clear separation of concerns. It uses React hooks for state management and custom hooks for data fetching. The routing is handled by React Router, with protected routes for different user roles. The UI is built with Tailwind CSS and includes a variety of components for displaying data, handling user input, and providing a modern user experience.

# Building and Running

## Prerequisites

*   Node.js and npm
*   A Supabase project with the required database schema and functions.

## Installation

1.  Clone the repository.
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the root of the project and add the following environment variables:
    ```
    VITE_SUPABASE_URL=<your-supabase-url>
    VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
    ```

## Running the application

*   To start the development server:
    ```bash
    npm run dev
    ```
*   To create a production build:
    ```bash
    npm run build
    ```
*   To preview the production build:
    ```bash
    npm run preview
    ```

## Testing

*   To run the tests:
    ```bash
    npm run test
    ```

# Development Conventions

*   **Coding Style:** The project uses ESLint to enforce a consistent coding style.
*   **Testing:** The project uses Vitest and React Testing Library for unit and component testing.
*   **Commits:** Commit messages should follow the Conventional Commits specification.
