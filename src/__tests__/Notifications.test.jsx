
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NotificationsDropdown from '../components/notifications/NotificationsDropdown';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../AuthContext';

// Mock the hooks
vi.mock('../hooks/useNotifications');
vi.mock('../AuthContext');

describe('NotificationsDropdown', () => {
  const mockUser = { id: 'user-123' };
  const mockNotifications = [
    {
      id: 1,
      title: 'Test Notification 1',
      body: 'This is a test',
      created_at: new Date().toISOString(),
      notification_recipients: [{ recipient_id: 'user-123', read_at: null }],
    },
    {
      id: 2,
      title: 'Test Notification 2',
      body: 'This is another test',
      created_at: new Date().toISOString(),
      notification_recipients: [{ recipient_id: 'user-123', read_at: new Date().toISOString() }],
    },
  ];

  it('renders the notification bell', () => {
    useAuth.mockReturnValue({ user: mockUser });
    useNotifications.mockReturnValue({ data: [], isLoading: false, error: null });
    render(<NotificationsDropdown />);
    expect(screen.getByLabelText('Open notifications')).toBeInTheDocument();
  });

  it('shows the unread count', () => {
    useAuth.mockReturnValue({ user: mockUser });
    useNotifications.mockReturnValue({ data: mockNotifications, isLoading: false, error: null });
    render(<NotificationsDropdown />);
    const bell = screen.getByLabelText('Open notifications');
    expect(bell.querySelector('span')).toBeInTheDocument();
  });

  it('opens the dropdown on click', () => {
    useAuth.mockReturnValue({ user: mockUser });
    useNotifications.mockReturnValue({ data: mockNotifications, isLoading: false, error: null });
    render(<NotificationsDropdown />);
    fireEvent.click(screen.getByLabelText('Open notifications'));
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Test Notification 1')).toBeInTheDocument();
  });

  it('shows a message when there are no notifications', () => {
    useAuth.mockReturnValue({ user: mockUser });
    useNotifications.mockReturnValue({ data: [], isLoading: false, error: null });
    render(<NotificationsDropdown />);
    fireEvent.click(screen.getByLabelText('Open notifications'));
    expect(screen.getByText('No notifications yet.')).toBeInTheDocument();
  });
});
