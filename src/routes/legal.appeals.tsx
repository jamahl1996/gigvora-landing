import { createFileRoute } from '@tanstack/react-router';
import AppealsPolicyPage from '@/pages/legal/AppealsPolicyPage';

export const Route = createFileRoute('/legal/appeals')({
  head: () => ({ meta: [
    { title: 'Appeals Policy — Gigvora' },
    { name: 'description', content: 'How to appeal moderation, demonetization, or suspension decisions on Gigvora.' },
    { property: 'og:title', content: 'Appeals Policy — Gigvora' },
    { property: 'og:description', content: 'Appeal a moderation or account decision on Gigvora.' },
  ]}),
  component: () => <AppealsPolicyPage />,
});