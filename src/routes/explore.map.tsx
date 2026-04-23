import { createFileRoute } from '@tanstack/react-router';
import SearchMapViewPage from '@/pages/explore/SearchMapViewPage';
export const Route = createFileRoute('/explore/map')({
  head: () => ({ meta: [{ title: 'Map View — Gigvora' }, { name: 'description', content: 'Visualize search results on an interactive map.' }]}),
  component: () => <SearchMapViewPage />,
});
