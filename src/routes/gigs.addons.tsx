import { createFileRoute } from '@tanstack/react-router';
import GigAddonsBuilderPage from '@/pages/gigs/GigAddonsBuilderPage';
export const Route = createFileRoute('/gigs/addons')({
  head: () => ({ meta: [{ title: 'Gig Add-ons — Gigvora' }, { name: 'description', content: 'Build upsells and add-ons to grow average order value.' }]}),
  component: () => <GigAddonsBuilderPage />,
});
