import { createFileRoute } from '@tanstack/react-router';
import HireSettingsPage from '@/pages/hire/HireSettingsPage';

export const Route = createFileRoute('/hire/settings')({
  head: () => ({ meta: [
    { title: 'Hire Settings — Gigvora' },
    { name: 'description', content: 'Configure your hiring workflows, stages, and team permissions.' },
  ]}),
  component: () => <HireSettingsPage />,
});
