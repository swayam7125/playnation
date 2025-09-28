// src/components/auth/LoginForm.test.jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../../AuthContext"; // AuthContext is needed as LoginForm uses useAuth
import LoginForm from "./LoginForm";
import { describe, it, expect } from "vitest";

// Mock the ModalContext as it's not relevant for this test
vi.mock("../../ModalContext", () => ({
  useModal: () => ({
    showModal: vi.fn(),
  }),
}));

describe("LoginForm Component", () => {
  it("should render all input fields and the submit button", () => {
    // Arrange: Render the component within necessary providers
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      </BrowserRouter>
    );

    // Act & Assert: Check if the key elements are on the screen
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });
});
