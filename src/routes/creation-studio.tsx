import { createFileRoute } from '@tanstack/react-router';
import StudioDraftsPage from '@/pages/creation-studio/StudioDraftsPage';
export const Route = createFileRoute('/creation-studio')({
  head: () => ({ meta: [{ title: 'Creation Studio — Gigvora' }, { name: 'description', content: 'Plan, draft, and ship multi-format content from one studio.' }]}),
  component: () => <StudioDraftsPage />,
});
