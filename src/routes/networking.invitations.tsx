import { createFileRoute } from '@tanstack/react-router';
import PendingInvitationsPage from '@/pages/networking/PendingInvitationsPage';
export const Route = createFileRoute('/networking/invitations')({
  head: () => ({ meta: [{ title: 'Invitations — Networking — Gigvora' }, { name: 'description', content: 'Pending connection requests and intros across your network.' }]}),
  component: () => <PendingInvitationsPage />,
});
