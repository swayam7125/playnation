import { Routes, Route, Outlet, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import React, { useEffect } from "react"; // 👈 Import React and useEffect

// Auth & Context
import { AuthProvider, useAuth } from "./AuthContext";
import { ModalProvider } from "./ModalContext";

// Layout
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// General Pages
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import VenuePage from "./pages/VenuePage";
import AuthPage from "./pages/AuthPage";
import AboutUsPage from "./pages/AboutUsPage";
import ContactUsPage from "./pages/ContactUsPage";

// Player Pages
import MyBookingsPage from "./pages/player/MyBookingsPage";
import ProfilePage from "./pages/player/ProfilePage";
import BookingPage from "./pages/player/BookingPage";

// Owner Pages
import OwnerDashboardPage from "./pages/owner/OwnerDashboardPage";
import MyVenuesPage from "./pages/owner/MyVenuesPage";
import AddVenuePage from "./pages/owner/AddVenuePage";
import AddFacilitiesPage from "./pages/owner/AddFacilitiesPage";
import EditVenuePage from "./pages/owner/EditVenuePage";
import ManageSlotsPage from "./pages/owner/ManageSlotsPage";
import ManageOffersPage from "./pages/owner/ManageOffersPage";
import BookingCalendarPage from "./pages/owner/BookingCalendarPage";
import ReportsPage from "./pages/owner/ReportsPage"; // Adjust path as necessary

// Admin Pages
import AdminUserManagementPage from "./pages/admin/AdminUserManagementPage";
import AdminVenueManagementPage from "./pages/admin/AdminVenueManagementPage";
import AdminBookingsPage from "./pages/admin/AdminBookingsPage";
import AdminManageOffersPage from "./pages/admin/AdminManageOffersPage";
import AdminNotifyPage from "./pages/admin/AdminNotifyPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";

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
    return <div>Loading...</div>;
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
      switch (profile.role) {
        case "venue_owner":
          return <Navigate to="/owner/dashboard" replace />;
        case "admin":
          return <Navigate to="/admin/dashboard" replace />;
          if (location.pathname === "/") {
            return <Navigate to="/explore" replace />;
          }
          break;
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
    return <div>Loading...</div>;
  }

  if (!user) {
    // Save the attempted location and redirect to auth
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!profile) {
    return <div>Loading profile...</div>;
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
        return <Navigate to="/explore" replace />;
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
              {/* Auth Routes */}
              <Route path="auth" element={<AuthPage />} />
              <Route path="login" element={<AuthPage />} />
              <Route path="signup" element={<AuthPage />} />
              {/* Player Routes - Also accessible by non-logged in users */}
              <Route path="explore" element={<ExplorePage />} />
              <Route
                path="venues/:venueId"
                element={
                  <RequireAuth allowedRoles={["player"]}>
                    <VenuePage />
                  </RequireAuth>
                }
              />
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
                <Route path="edit-venue/:venueId" element={<EditVenuePage />} />
                <Route path="add-facilities" element={<AddFacilitiesPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="manage-slots" element={<ManageSlotsPage />} />
                <Route path="manage-offers" element={<ManageOffersPage />} />
                <Route path="calendar" element={<BookingCalendarPage />} />
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
        </AuthRouter>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
