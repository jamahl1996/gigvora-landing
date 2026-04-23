import { createFileRoute } from '@tanstack/react-router';
import SolutionsPage from '@/pages/SolutionsPage';

export const Route = createFileRoute('/solutions/$role')({
  head: () => ({
    meta: [
      { title: 'Solutions — Gigvora' },
      { name: 'description', content: 'Role-specific solutions on Gigvora.' },
      { property: 'og:title', content: 'Solutions — Gigvora' },
      { property: 'og:description', content: 'Tailored Gigvora solutions for your role.' },
    ],
  }),
  component: () => <SolutionsPage />,
});