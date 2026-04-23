import { createFileRoute } from '@tanstack/react-router';
import PagesSearchPage from '@/pages/explore/PagesSearchPage';
export const Route = createFileRoute('/explore/pages')({
  head: () => ({ meta: [{ title: 'Pages Search — Gigvora' }, { name: 'description', content: 'Search organization and brand pages.' }]}),
  component: () => <PagesSearchPage />,
});
