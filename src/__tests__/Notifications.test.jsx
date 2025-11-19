
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
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
    useNotifications.mockReturnValue({ notifications: [], unreadCount: 0, isLoading: false, error: null });
    render(
      <BrowserRouter>
        <NotificationsDropdown />
      </BrowserRouter>
    );
    expect(screen.getByTestId('notification-bell')).toBeInTheDocument();
  });

  it('shows the unread count', () => {
    useAuth.mockReturnValue({ user: mockUser });
    useNotifications.mockReturnValue({ notifications: mockNotifications, unreadCount: 1, isLoading: false, error: null });
    render(
      <BrowserRouter>
        <NotificationsDropdown />
      </BrowserRouter>
    );
    const bell = screen.getByTestId('notification-bell');
    expect(bell.querySelector('span')).toBeInTheDocument();
  });

  it('opens the dropdown on click', () => {
    useAuth.mockReturnValue({ user: mockUser });
    useNotifications.mockReturnValue({ notifications: mockNotifications, unreadCount: 1, isLoading: false, error: null });
    render(
      <BrowserRouter>
        <NotificationsDropdown />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByTestId('notification-bell'));
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Test Notification 1')).toBeInTheDocument();
  });

  it('shows a message when there are no notifications', () => {
    useAuth.mockReturnValue({ user: mockUser });
    useNotifications.mockReturnValue({ notifications: [], unreadCount: 0, isLoading: false, error: null });
    render(
      <BrowserRouter>
        <NotificationsDropdown />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByTestId('notification-bell'));
    expect(screen.getByText('No new notifications')).toBeInTheDocument();
  });
});
