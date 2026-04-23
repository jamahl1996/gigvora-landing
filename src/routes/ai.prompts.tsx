import { createFileRoute } from '@tanstack/react-router';
import AIPromptLibraryPage from '@/pages/ai/AIPromptLibraryPage';
export const Route = createFileRoute('/ai/prompts')({
  head: () => ({ meta: [{ title: 'Prompt Library — Gigvora AI' }, { name: 'description', content: 'Curated and saved prompts across every Gigvora AI tool.' }]}),
  component: () => <AIPromptLibraryPage />,
});
