import { createFileRoute } from '@tanstack/react-router';
import SearchComparePreviewPage from '@/pages/explore/SearchComparePreviewPage';
export const Route = createFileRoute('/explore/compare')({
  head: () => ({ meta: [{ title: 'Compare — Gigvora' }, { name: 'description', content: 'Side-by-side comparison of search results.' }]}),
  component: () => <SearchComparePreviewPage />,
});
