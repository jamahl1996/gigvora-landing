import { createFileRoute } from '@tanstack/react-router';
import CalendarPage from '@/pages/CalendarPage';

export const Route = createFileRoute('/calendar')({
  head: () => ({ meta: [
    { title: 'Calendar — Gigvora' },
    { name: 'description', content: 'Your meetings, interviews, and project milestones across Gigvora.' },
  ]}),
  component: () => <CalendarPage />,
});