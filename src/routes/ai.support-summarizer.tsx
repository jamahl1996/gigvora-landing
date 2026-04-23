import { createFileRoute } from '@tanstack/react-router';
import AISupportSummarizerPage from '@/pages/ai/AISupportSummarizerPage';
export const Route = createFileRoute('/ai/support-summarizer')({
  head: () => ({ meta: [{ title: 'Support Summarizer — Gigvora AI' }, { name: 'description', content: 'AI summarization for support tickets, threads, and incident reports.' }]}),
  component: () => <AISupportSummarizerPage />,
});
