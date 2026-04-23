import { createFileRoute } from '@tanstack/react-router';
import CommercePatronagePage from '@/pages/finance/CommercePatronagePage';
export const Route = createFileRoute('/finance/patronage')({
  head: () => ({ meta: [{ title: 'Patronage — Finance' }, { name: 'description', content: 'Patronage and recurring support.' }]}),
  component: () => <CommercePatronagePage />,
});
