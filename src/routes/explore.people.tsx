import { createFileRoute } from '@tanstack/react-router';
import PeopleSearchPage from '@/pages/explore/PeopleSearchPage';
export const Route = createFileRoute('/explore/people')({
  head: () => ({ meta: [{ title: 'People Search — Gigvora' }, { name: 'description', content: 'Find professionals by skills, location, and availability.' }]}),
  component: () => <PeopleSearchPage />,
});
