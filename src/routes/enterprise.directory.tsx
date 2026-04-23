import { createFileRoute } from '@tanstack/react-router';
import EnterpriseDirectoryPage from '@/pages/enterprise/EnterpriseDirectoryPage';
export const Route = createFileRoute('/enterprise/directory')({
  head: () => ({ meta: [{ title: 'Enterprise Directory — Gigvora' }, { name: 'description', content: 'Searchable directory of vetted enterprise organizations.' }]}),
  component: () => <EnterpriseDirectoryPage />,
});
