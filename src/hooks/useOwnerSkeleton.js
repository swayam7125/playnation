import React from "react";
import {
  OwnerDashboardSkeleton,
  ManageVenuesSkeleton,
  ManageSlotsSkeleton,
  ManageBookingsSkeleton,
  OwnerAnalyticsSkeleton,
  ReportPageSkeleton,
  AddVenuePageSkeleton,
  AddFacilityPageSkeleton,
  EditVenuePageSkeleton,
  MyVenuesPageSkeleton,
  // Removed OwnerSettingsSkeleton, OwnerSupportSkeleton, and BaseOwnerSkeleton as they do not exist
} from "../components/skeletons/owner";

/**
 * useOwnerSkeleton
 * Returns the appropriate skeleton loader component based on the page name or route.
 *
 * @param {string} pageName - The page identifier (e.g., "dashboard", "venues", "reports").
 * @returns {React.Element} - A skeleton component for that page.
 */
export default function useOwnerSkeleton(pageName) {
  const normalized = pageName?.toLowerCase() || "";

  switch (true) {
    case normalized.includes("dashboard"):
      return <OwnerDashboardSkeleton />;

    case normalized.includes("venue") && normalized.includes("add"):
      return <AddVenuePageSkeleton />;

    case normalized.includes("venue") && normalized.includes("edit"):
      return <EditVenuePageSkeleton />;
    
    // Note: This case uses MyVenuesPageSkeleton. You also have ManageVenuesSkeleton if you prefer it.
    case normalized.includes("venues"):
      return <MyVenuesPageSkeleton />;

    case normalized.includes("facility") && normalized.includes("add"):
      return <AddFacilityPageSkeleton />;

    case normalized.includes("slot"):
      return <ManageSlotsSkeleton />;

    case normalized.includes("booking"):
      return <ManageBookingsSkeleton />;

    // --- UPDATED LOGIC ---
    // Point "report" to the correct skeleton
    case normalized.includes("report"):
      return <ReportPageSkeleton />;

    // Keep "analytics" pointing to its skeleton
    case normalized.includes("analytics"):
      return <OwnerAnalyticsSkeleton />;

    // --- REMOVED CASES ---
    // Removed "setting" and "support" cases as their components do not exist

    // --- UPDATED DEFAULT ---
    // Changed default to a component that exists
    default:
      return <OwnerDashboardSkeleton />;
  }
}