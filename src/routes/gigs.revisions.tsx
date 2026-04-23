import { createFileRoute } from '@tanstack/react-router';
import RevisionManagementPage from '@/pages/gigs/RevisionManagementPage';
export const Route = createFileRoute('/gigs/revisions')({
  head: () => ({ meta: [{ title: 'Revision Management — Gigs' }, { name: 'description', content: 'Track and manage revision requests across active orders.' }]}),
  component: () => <RevisionManagementPage />,
});
