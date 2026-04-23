import { createFileRoute } from '@tanstack/react-router';
import FollowUpCenterPage from '@/pages/networking/FollowUpCenterPage';
export const Route = createFileRoute('/networking/follow-ups')({
  head: () => ({ meta: [{ title: 'Follow-Up Center — Networking — Gigvora' }, { name: 'description', content: 'Track follow-ups across every relationship and event.' }]}),
  component: () => <FollowUpCenterPage />,
});
