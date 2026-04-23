import { createFileRoute } from '@tanstack/react-router';
import ProfilePage from '@/pages/ProfilePage';

export const Route = createFileRoute('/profile')({
  head: () => ({ meta: [
    { title: 'Your Profile — Gigvora' },
    { name: 'description', content: 'Manage your professional profile, work history, and public presence on Gigvora.' },
  ]}),
  component: () => <ProfilePage />,
});