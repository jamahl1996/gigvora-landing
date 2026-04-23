import { createFileRoute } from '@tanstack/react-router';
import DisputesPolicyPage from '@/pages/legal/DisputesPolicyPage';

export const Route = createFileRoute('/legal/disputes-policy')({
  head: () => ({ meta: [
    { title: 'Disputes Policy — Gigvora' },
    { name: 'description', content: 'How disputes are raised, evaluated, and resolved on Gigvora.' },
  ]}),
  component: () => <DisputesPolicyPage />,
});