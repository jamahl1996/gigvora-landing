import { createFileRoute } from '@tanstack/react-router';
import SavedSearchesPage from '@/pages/explore/SavedSearchesPage';
export const Route = createFileRoute('/explore/saved')({
  head: () => ({ meta: [{ title: 'Saved Searches — Gigvora' }, { name: 'description', content: 'Manage your saved search queries and alerts.' }]}),
  component: () => <SavedSearchesPage />,
});
