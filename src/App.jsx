import {
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Auth & Context
import { AuthProvider } from "./AuthContext";
import { ModalProvider } from "./ModalContext";
import AdminProtectedRoute from "./components/auth/AdminProtectedRoute";
import OwnerProtectedRoute from "./components/auth/OwnerProtectedRoute";

// Layout
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// General Pages
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import VenuePage from "./pages/VenuePage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
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
import EditVenuePage from "./pages/owner/EditVenuePage";
import ManageSlotsPage from "./pages/owner/ManageSlotsPage";
import ManageOffersPage from "./pages/owner/ManageOffersPage";
import BookingCalendarPage from "./pages/owner/BookingCalendarPage";

// Admin Pages
import AdminUserManagementPage from "./pages/admin/AdminUserManagementPage";
import AdminVenueManagementPage from "./pages/admin/AdminVenueManagementPage";
import AdminBookingsPage from "./pages/admin/AdminBookingsPage";
import AdminManageOffersPage from "./pages/admin/AdminManageOffersPage";
import AdminNotifyPage from "./pages/admin/AdminNotifyPage";

// Layout Component to conditionally render footer
const AppLayout = () => {
  const location = useLocation();
  const { pathname } = location;

  // Define the paths where the footer should be displayed
  const showFooterOnPaths = ["/", "/explore", "/about", "/contact"];

  // Check for exact paths or if it's a dynamic venue page
  const shouldShowFooter =
    showFooterOnPaths.includes(pathname) || pathname.startsWith("/venue/");

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

function App() {
  return (
    <AuthProvider>
      <ModalProvider>
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
              fontSize: '14px',
              maxWidth: '500px',
              padding: '12px 16px',
            },
          }}
        />
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="explore" element={<ExplorePage />} />
            <Route path="venue/:venueId" element={<VenuePage />} />
            <Route path="about" element={<AboutUsPage />} />
            <Route path="contact" element={<ContactUsPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            
            {/* Auth Routes */}
            <Route path="auth" element={<AuthPage />} />
            <Route path="login" element={<AuthPage />} />
            <Route path="signup" element={<AuthPage />} />

            {/* Player Routes */}
            <Route path="my-bookings" element={<MyBookingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="book/:facilityId" element={<BookingPage />} />

            {/* Owner Routes */}
            <Route
              path="owner"
              element={
                <OwnerProtectedRoute>
                  <Outlet />
                </OwnerProtectedRoute>
              }
            >
              <Route index element={<OwnerDashboardPage />} />
              <Route path="dashboard" element={<OwnerDashboardPage />} />
              <Route path="my-venues" element={<MyVenuesPage />} />
              <Route path="add-venue" element={<AddVenuePage />} />
              <Route path="edit-venue/:venueId" element={<EditVenuePage />} />
              <Route
                path="manage-slots/:facilityId"
                element={<ManageSlotsPage />}
              />
              <Route
                path="manage-offers"
                element={<ManageOffersPage />}
              />
              {/* --- FIX: Changed route path to "calendar" --- */}
              <Route
                path="calendar"
                element={<BookingCalendarPage />}
              />
            </Route>

            {/* Admin Routes */}
            <Route
              path="admin"
              element={
                <AdminProtectedRoute>
                  <Outlet />
                </AdminProtectedRoute>
              }
            >
              <Route index element={<AdminUserManagementPage />} />
              <Route path="users" element={<AdminUserManagementPage />} />
              <Route path="venues" element={<AdminVenueManagementPage />} />
              <Route path="bookings" element={<AdminBookingsPage />} />
              <Route path="manage-offers" element={<AdminManageOffersPage />} />
              <Route path="notify" element={<AdminNotifyPage />} />
            </Route>
          </Route>
        </Routes>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;