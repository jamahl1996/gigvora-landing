import { createFileRoute } from '@tanstack/react-router';
import GigWorkspaceHomePage from '@/pages/gigs/GigWorkspaceHomePage';
export const Route = createFileRoute('/gigs/workspace')({
  head: () => ({ meta: [{ title: 'Gig Workspace — Gigvora' }, { name: 'description', content: 'Manage your gigs, orders, and seller performance from one cockpit.' }]}),
  component: () => <GigWorkspaceHomePage />,
});
