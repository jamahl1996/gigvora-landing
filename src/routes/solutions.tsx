import { createFileRoute } from '@tanstack/react-router';
import SolutionsPage from '@/pages/SolutionsPage';

export const Route = createFileRoute('/solutions')({
  head: () => ({
    meta: [
      { title: 'Solutions — Gigvora' },
      { name: 'description', content: 'Solutions for freelancers, recruiters, enterprise buyers, and creators.' },
      { property: 'og:title', content: 'Solutions — Gigvora' },
      { property: 'og:description', content: 'Tailored solutions for every kind of professional on Gigvora.' },
    ],
  }),
  component: () => <SolutionsPage />,
});