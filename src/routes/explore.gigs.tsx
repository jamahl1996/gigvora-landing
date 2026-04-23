import { createFileRoute } from '@tanstack/react-router';
import GigsSearchPage from '@/pages/explore/GigsSearchPage';
export const Route = createFileRoute('/explore/gigs')({
  head: () => ({ meta: [{ title: 'Gigs Search — Gigvora' }, { name: 'description', content: 'Browse productized gigs across every category.' }]}),
  component: () => <GigsSearchPage />,
});
