import { createFileRoute } from '@tanstack/react-router';
import MentorMarketplacePage from '@/pages/mentorship/MentorMarketplacePage';
export const Route = createFileRoute('/mentorship')({
  head: () => ({ meta: [{ title: 'Mentorship — Gigvora' }, { name: 'description', content: 'Find mentors across every domain and discipline.' }]}),
  component: () => <MentorMarketplacePage />,
});
