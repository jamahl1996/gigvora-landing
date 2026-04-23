import { createFileRoute } from '@tanstack/react-router';
import InternalSearchPage from '@/pages/admin/InternalSearchPage';
export const Route = createFileRoute('/admin/search')({
  head: () => ({ meta: [{ title: 'Internal Search — Admin' }, { name: 'description', content: 'Search across users, orders, and entities.' }]}),
  component: () => <InternalSearchPage />,
});
