import { createFileRoute } from '@tanstack/react-router';
import AISettingsPage from '@/pages/ai/AISettingsPage';
export const Route = createFileRoute('/ai/settings')({
  head: () => ({ meta: [{ title: 'AI Settings — Gigvora' }, { name: 'description', content: 'Default models, personas, and AI workspace preferences.' }]}),
  component: () => <AISettingsPage />,
});
