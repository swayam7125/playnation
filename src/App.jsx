import { Routes, Route, Outlet, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import React, { useEffect, Suspense, lazy } from "react"; // 👈 Import React and useEffect

// Auth & Context
import { AuthProvider, useAuth } from "./AuthContext";
import { ModalProvider } from "./ModalContext";

// Layout
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import SuspenseLoader from "./components/common/SuspenseLoader";
import PageSkeleton from "./components/skeletons/PageSkeleton"; // Import PageSkeleton

// General Pages
const HomePage = lazy(() => import("./pages/HomePage"));
const ExplorePage = lazy(() => import("./pages/ExplorePage"));
const VenuePage = lazy(() => import("./pages/VenuePage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const AboutUsPage = lazy(() => import("./pages/AboutUsPage"));
const ContactUsPage = lazy(() => import("./pages/ContactUsPage"));

// Player Pages
const MyBookingsPage = lazy(() => import("./pages/player/MyBookingsPage"));
const ProfilePage = lazy(() => import("./pages/player/ProfilePage"));
const BookingPage = lazy(() => import("./pages/player/BookingPage"));
const PlayerDashboardPage = lazy(() => import("./pages/player/PlayerDashboardPage"));

// Owner Pages
const OwnerNotifyPage = lazy(() => import("./pages/owner/OwnerNotifyPage"));
const OwnerDashboardPage = lazy(() => import("./pages/owner/OwnerDashboardPage"));
const MyVenuesPage = lazy(() => import("./pages/owner/MyVenuesPage"));
const AddVenuePage = lazy(() => import("./pages/owner/AddVenuePage"));
const AddFacilitiesPage = lazy(() => import("./pages/owner/AddFacilitiesPage"));
const EditVenuePage = lazy(() => import("./pages/owner/EditVenuePage"));
const ManageSlotsPage = lazy(() => import("./pages/owner/ManageSlotsPage"));
const ManageOffersPage = lazy(() => import("./pages/owner/ManageOffersPage"));
const BookingCalendarPage = lazy(() => import("./pages/owner/BookingCalendarPage"));
const ReportsPage = lazy(() => import("./pages/owner/ReportsPage")); // Adjust path as necessary

// Admin Pages
const AdminUserManagementPage = lazy(() => import("./pages/admin/AdminUserManagementPage"));
const AdminVenueManagementPage = lazy(() => import("./pages/admin/AdminVenueManagementPage"));
const AdminBookingsPage = lazy(() => import("./pages/admin/AdminBookingsPage"));
const AdminManageOffersPage = lazy(() => import("./pages/admin/AdminManageOffersPage"));
const AdminNotifyPage = lazy(() => import("./pages/admin/AdminNotifyPage"));
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));

// --- NEW COMPONENT: Resets scroll position on route change ---
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scrolls to the top-left corner of the page on every route change
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
// -------------------------------------------------------------

// Layout Component to conditionally render footer
const AppLayout = () => {
  const location = useLocation();
  const { pathname } = location;

  // Define the paths where the footer should be displayed
  const showFooterOnPaths = ["/", "/about", "/contact"];

  // Check for exact paths or if it's a dynamic venue page
  const shouldShowFooter = showFooterOnPaths.includes(pathname);

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      {shouldShowFooter && <Footer />}
    </div>
  );
};

// Authentication and role-based routing
const AuthRouter = ({ children }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageSkeleton />;
  }

  if (user && profile) {
    const isOnPublicRoute = [
      "/",
      "/about",
      "/contact",
      "/auth",
      "/login",
      "/signup",
      "/explore",
    ].includes(location.pathname);
    const isOwner = profile.role === "venue_owner";
    const isOnWrongPath = isOwner && !location.pathname.startsWith("/owner");

    // Redirect based on role when on public routes
    if (isOnPublicRoute) {
      // Allow players to access the explore page even when logged in
      if (location.pathname === '/explore' && profile.role === 'player') {
        return children;
      }
      
      switch (profile.role) {
        case "venue_owner":
          return <Navigate to="/owner/dashboard" replace />;
        case "admin":
          return <Navigate to="/admin/dashboard" replace />;
        case "player":
          return <Navigate to="/dashboard" replace />;
        default:
          break;
      }
    }

    // Allow owners to access their profile page; otherwise keep them
    // inside the /owner/* section. Exempt /profile and /profile/* paths.
    const isProfilePath =
      location.pathname === "/profile" ||
      location.pathname.startsWith("/profile/");

    // Redirect venue owners to their dashboard only when they try to access
    // non-owner routes other than their own profile.
    if (
      profile.role === "venue_owner" &&
      !location.pathname.startsWith("/owner") &&
      !isProfilePath
    ) {
      return <Navigate to="/owner/dashboard" replace />;
    }
  }

  return children;
};

// Protected route component
const RequireAuth = ({ children, allowedRoles = [] }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageSkeleton />;
  }

  if (!user) {
    // Save the attempted location and redirect to auth
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!profile) {
    return <PageSkeleton />;
  }

  // Special handling for owners - ensure they can access their routes
  if (
    profile.role === "venue_owner" &&
    location.pathname.startsWith("/owner")
  ) {
    return children;
  }

  // If roles specified and user's role is not allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(profile.role)) {
    // Redirect to appropriate dashboard based on role
    switch (profile.role) {
      case "admin":
        return <Navigate to="/admin/dashboard" replace />;
      case "venue_owner":
        return <Navigate to="/owner/dashboard" replace />;
      case "player":
        return <Navigate to="/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <AuthRouter>
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              success: {
                duration: 3000,
              },
              error: {
                duration: 5000,
              },
              style: {
                fontSize: "16px",
                maxWidth: "500px",
                padding: "16px 24px",
              },
            }}
          />
          <Suspense fallback={<SuspenseLoader />}>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <ScrollToTop /> <AppLayout />
                  </>
                }
              >
                {/* Public routes */}
                <Route index element={<HomePage />} />
                <Route path="about" element={<AboutUsPage />} />
                <Route path="contact" element={<ContactUsPage />} />
                <Route path="venue/:venueId" element={<VenuePage />} />
                {/* Auth Routes */}
                <Route path="auth" element={<AuthPage />} />
                <Route path="login" element={<AuthPage />} />
                <Route path="signup" element={<AuthPage />} />
                {/* Player Routes - Also accessible by non-logged in users */}
                <Route path="explore" element={<ExplorePage />} />
                <Route
                  path="dashboard"
                  element={
                    <RequireAuth allowedRoles={["player"]}>
                      <PlayerDashboardPage />
                    </RequireAuth>
                  }
                />
                <Route path="venues/:venueId" element={<VenuePage />} />
                <Route
                  path="my-bookings"
                  element={
                    <RequireAuth allowedRoles={["player"]}>
                      <MyBookingsPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <RequireAuth allowedRoles={[]}>
                      <ProfilePage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="booking/:facilityId"
                  element={
                    <RequireAuth allowedRoles={["player"]}>
                      <BookingPage />
                    </RequireAuth>
                  }
                />
                {/* Owner Routes */}
                <Route
                  path="owner"
                  element={
                    <RequireAuth allowedRoles={["venue_owner"]}>
                      <Outlet />
                    </RequireAuth>
                  }
                >
                  <Route index element={<OwnerDashboardPage />} />
                  <Route path="dashboard" element={<OwnerDashboardPage />} />
                  <Route path="my-venues" element={<MyVenuesPage />} />
                  <Route path="add-venue" element={<AddVenuePage />} />
                  <Route
                    path="edit-venue/:venueId"
                    element={<EditVenuePage />}
                  />
                  <Route
                    path="add-facilities"
                    element={<AddFacilitiesPage />}
                  />
                  <Route path="reports" element={<ReportsPage />} />
                  <Route path="manage-slots" element={<ManageSlotsPage />} />
                  <Route path="manage-offers" element={<ManageOffersPage />} />
                  <Route path="calendar" element={<BookingCalendarPage />} />
                  <Route path="notify" element={<OwnerNotifyPage />} />
                </Route>
                {/* Admin Routes */}
                <Route
                  path="admin"
                  element={
                    <RequireAuth allowedRoles={["admin"]}>
                      <Outlet />
                    </RequireAuth>
                  }
                >
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="dashboard" element={<AdminDashboardPage />} />
                  <Route path="users" element={<AdminUserManagementPage />} />
                  <Route path="venues" element={<AdminVenueManagementPage />} />
                  <Route path="bookings" element={<AdminBookingsPage />} />
                  <Route
                    path="manage-offers"
                    element={<AdminManageOffersPage />}
                  />
                  <Route path="notify" element={<AdminNotifyPage />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </AuthRouter>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;