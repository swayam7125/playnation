// src/__mocks__/supabaseClient.js
import { vi } from 'vitest';

export const supabase = {
  auth: {
    signInWithPassword: vi.fn(),
  },
  // Mock other Supabase methods you use
};