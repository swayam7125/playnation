import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// Mock AuthContext before importing App so App uses the mocked hooks/provider
vi.mock("../AuthContext", () => {
  return {
    AuthProvider: ({ children }) => <>{children}</>,
    useAuth: () => ({
      user: { id: "user-1", email: "owner@example.com" },
      profile: { role: "venue_owner" },
      loading: false,
    }),
  };
});

// Mock the route pages so tests don't rely on large implementation details
vi.mock("../pages/player/ProfilePage", () => ({
  default: () => <div>PROFILE_PAGE</div>,
}));
vi.mock("../pages/owner/OwnerDashboardPage", () => ({
  default: () => <div>OWNER_DASH</div>,
}));
vi.mock("../pages/HomePage", () => ({ default: () => <div>HOME_PAGE</div> }));
vi.mock("../pages/ExplorePage", () => ({
  default: () => <div>EXPLORE_PAGE</div>,
}));

// Import App after mocks are configured
import App from "../App";

describe("Routing", () => {
  it("allows venue_owner to access /profile", async () => {
    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText("PROFILE_PAGE")).toBeDefined();
  });

  it("redirects venue_owner from / to /owner/dashboard", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    // Owner dashboard should be rendered
    expect(await screen.findByText("OWNER_DASH")).toBeDefined();
  });
});
