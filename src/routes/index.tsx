/**
 * Phase 10 — Index "/" route.
 * Renders the legacy LandingPage during migration. In subsequent phases
 * this becomes the canonical landing route with its own head() metadata.
 */
import { createFileRoute } from '@tanstack/react-router';
import LandingPage from '@/pages/LandingPage';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Gigvora — Work, hire, network' },
      { name: 'description', content: 'The enterprise platform for freelance work, hiring, and professional networking.' },
    ],
  }),
  component: () => <LandingPage />,
});