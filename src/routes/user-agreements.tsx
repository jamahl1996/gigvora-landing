import { createFileRoute } from '@tanstack/react-router';
import UserAgreementsPage from '@/pages/UserAgreementsPage';

export const Route = createFileRoute('/user-agreements')({
  head: () => ({
    meta: [
      { title: 'User Agreements — Gigvora' },
      { name: 'description', content: 'The user agreements that apply when you use Gigvora.' },
    ],
  }),
  component: () => <UserAgreementsPage />,
});