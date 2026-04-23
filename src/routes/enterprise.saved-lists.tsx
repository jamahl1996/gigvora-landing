import { createFileRoute } from '@tanstack/react-router';
import EnterpriseSavedListsPage from '@/pages/enterprise/EnterpriseSavedListsPage';
export const Route = createFileRoute('/enterprise/saved-lists')({
  head: () => ({ meta: [{ title: 'Saved Enterprise Lists — Gigvora' }, { name: 'description', content: 'Watch lists, prospect lists, and partner lists for enterprise teams.' }]}),
  component: () => <EnterpriseSavedListsPage />,
});
