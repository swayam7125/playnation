// src/components/auth/LoginForm.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { AuthProvider } from '../../AuthContext';
import { supabase } from '../../supabaseClient';
import LoginForm from './LoginForm';

vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
    },
    // 👇 **ADD THIS MOCK FOR THE RPC CALL** 👇
    rpc: vi.fn().mockResolvedValue({ data: 'player', error: null }),
  },
}));

// ... (the rest of your test file remains the same)
describe('LoginForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should allow a user to log in successfully', async () => {
    const user = userEvent.setup();
    const mockLoginData = {
      data: {
        user: { id: '123', email: 'test@example.com' },
        session: { access_token: 'fake-token' },
      },
      error: null,
    };
    supabase.auth.signInWithPassword.mockResolvedValue(mockLoginData);

    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      </BrowserRouter>
    );

    const emailInput = await screen.findByPlaceholderText('you@example.com');
    const passwordInput = screen.getByPlaceholderText('Enter your password');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(screen.getByRole('button', { name: /Sign In/i }));

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });
});