import { createFileRoute } from '@tanstack/react-router';
import PostComposerPage from '@/pages/create/PostComposerPage';
export const Route = createFileRoute('/create/post')({
  head: () => ({ meta: [{ title: 'New Post — Gigvora' }, { name: 'description', content: 'Compose a post, article, or media update for your network.' }]}),
  component: () => <PostComposerPage />,
});
