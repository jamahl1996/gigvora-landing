import { createFileRoute } from '@tanstack/react-router';
import HireCommandCenter from '@/pages/hire/HireCommandCenter';

export const Route = createFileRoute('/hire')({
  head: () => ({ meta: [
    { title: 'Hire Command Center — Gigvora' },
    { name: 'description', content: 'Unified command center for sourcing, screening, and hiring on Gigvora.' },
  ]}),
  component: () => <HireCommandCenter />,
});
