import { createFileRoute } from '@tanstack/react-router';
import GigRequirementsBuilderPage from '@/pages/gigs/GigRequirementsBuilderPage';
export const Route = createFileRoute('/gigs/requirements')({
  head: () => ({ meta: [{ title: 'Gig Requirements — Gigvora' }, { name: 'description', content: 'Configure the intake form buyers complete after ordering.' }]}),
  component: () => <GigRequirementsBuilderPage />,
});
