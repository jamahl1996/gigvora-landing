import { createFileRoute } from '@tanstack/react-router';
import TrustSafetyPage from '@/pages/TrustSafetyPage';

export const Route = createFileRoute('/trust-safety')({
  head: () => ({
    meta: [
      { title: 'Trust & Safety — Gigvora' },
      { name: 'description', content: 'How Gigvora keeps the marketplace safe — verification, moderation, fraud prevention, and dispute resolution.' },
      { property: 'og:title', content: 'Trust & Safety — Gigvora' },
      { property: 'og:description', content: 'Verification, moderation, and dispute resolution on Gigvora.' },
    ],
  }),
  component: () => <TrustSafetyPage />,
});