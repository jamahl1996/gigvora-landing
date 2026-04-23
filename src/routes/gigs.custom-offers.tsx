import { createFileRoute } from '@tanstack/react-router';
import CustomOffersPage from '@/pages/gigs/CustomOffersPage';
export const Route = createFileRoute('/gigs/custom-offers')({
  head: () => ({ meta: [{ title: 'Custom Offers — Gigs' }, { name: 'description', content: 'Send tailored quotes for custom buyer requests.' }]}),
  component: () => <CustomOffersPage />,
});
