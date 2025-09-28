// src/components/bookings/BookingCard.test.jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../../AuthContext";
import BookingCard from "./BookingCard";
import { describe, it, expect, vi } from "vitest";

// Mock the ModalContext as it's not relevant for this test
vi.mock("../../ModalContext", () => ({
  useModal: () => ({
    showModal: vi.fn(),
  }),
}));

describe("BookingCard Component", () => {
  const mockBooking = {
    booking_id: "123-abc",
    start_time: "2025-10-26T10:00:00Z", // Use a consistent ISO string for dates
    end_time: "2025-10-26T11:00:00Z",
    total_amount: 1500,
    status: "confirmed",
    has_been_reviewed: false,
    facilities: {
      name: "Main Football Turf",
      venues: {
        venue_id: "456-def",
        name: "Grand Sports Arena",
        address: "123 Sports Lane",
        city: "Metropolis",
        image_url: ["https://example.com/image.jpg"],
      },
      sports: {
        name: "Football",
      },
    },
  };

  it("should render all booking details correctly", () => {
    // Arrange
    render(
      <BrowserRouter>
        <AuthProvider>
          <BookingCard
            booking={mockBooking}
            onReviewSubmitted={() => {}}
            onCancelBooking={() => {}}
          />
        </AuthProvider>
      </BrowserRouter>
    );

    // Assert: Check for all key pieces of information
    expect(
      screen.getByText("Main Football Turf (Football)")
    ).toBeInTheDocument();
    expect(screen.getByText("Grand Sports Arena")).toBeInTheDocument();
    expect(screen.getByText(/123 Sports Lane, Metropolis/)).toBeInTheDocument();

    // Check for formatted date and time using date-fns format
    expect(screen.getByText(/Sun, 26 Oct 2025/)).toBeInTheDocument();
    // Note: The exact time output depends on your test environment's timezone.
    // This regex is more flexible.
    expect(
      screen.getByText(/\d{1,2}:\d{2}\s[AP]M - \d{1,2}:\d{2}\s[AP]M/)
    ).toBeInTheDocument();

    expect(screen.getByText("₹1500")).toBeInTheDocument();
    expect(screen.getByText("confirmed")).toBeInTheDocument();
  });
});