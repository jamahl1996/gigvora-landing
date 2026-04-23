import { createFileRoute } from '@tanstack/react-router';
import GigPackagesBuilderPage from '@/pages/gigs/GigPackagesBuilderPage';
export const Route = createFileRoute('/gigs/packages')({
  head: () => ({ meta: [{ title: 'Gig Packages Builder — Gigvora' }, { name: 'description', content: 'Design tiered packages (Basic, Standard, Premium) for your gigs.' }]}),
  component: () => <GigPackagesBuilderPage />,
});
