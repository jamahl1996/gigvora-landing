import { createFileRoute } from '@tanstack/react-router';
import WebinarsSearchPage from '@/pages/explore/WebinarsSearchPage';
export const Route = createFileRoute('/explore/webinars')({
  head: () => ({ meta: [{ title: 'Webinars Search — Gigvora' }, { name: 'description', content: 'Find upcoming and on-demand webinars.' }]}),
  component: () => <WebinarsSearchPage />,
});
