/**
 * Phase 10 batch 1 — /about route migrated to TanStack file-based routing.
 * Thin wrapper around the legacy AboutPage component so we can incrementally
 * peel routes off App.tsx without breaking the live app. The same page
 * remains mounted in App.tsx for the moment; once we flip main.tsx to
 * RouterProvider this file becomes the canonical owner.
 */
import { createFileRoute } from '@tanstack/react-router';
import AboutPage from '@/pages/AboutPage';

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      { title: 'About Gigvora — Built for the modern professional' },
      { name: 'description', content: 'Learn about Gigvora — the enterprise platform unifying freelance work, hiring, networking, and creator monetisation in one place.' },
      { property: 'og:title', content: 'About Gigvora' },
      { property: 'og:description', content: 'The enterprise platform for work, hire, network, and create — built for the modern professional.' },
    ],
  }),
  component: () => <AboutPage />,
});