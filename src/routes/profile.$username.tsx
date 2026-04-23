import { createFileRoute } from '@tanstack/react-router';
import ProfilePage from '@/pages/ProfilePage';
export const Route = createFileRoute('/profile/$username')({
  head: () => ({ meta: [{ title: 'Profile — Gigvora' }, { name: 'description', content: 'View public profile.' }]}),
  component: () => <ProfilePage />,
});
