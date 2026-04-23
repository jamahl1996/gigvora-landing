import { createFileRoute } from '@tanstack/react-router';
import DashboardBookingsPage from '@/pages/dashboard/DashboardBookingsPage';

export const Route = createFileRoute('/dashboard/bookings')({
  head: () => ({ meta: [
    { title: 'Bookings — Dashboard — Gigvora' },
    { name: 'description', content: 'Calls, sessions, and bookings on your calendar.' },
  ]}),
  component: () => <DashboardBookingsPage />,
});