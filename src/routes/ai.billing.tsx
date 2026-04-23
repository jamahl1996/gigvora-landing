import { createFileRoute } from '@tanstack/react-router';
import AIBillingPage from '@/pages/ai/AIBillingPage';
export const Route = createFileRoute('/ai/billing')({
  head: () => ({ meta: [{ title: 'AI Billing — Gigvora' }, { name: 'description', content: 'AI usage, credits, and billing across Gigvora AI tools.' }]}),
  component: () => <AIBillingPage />,
});
