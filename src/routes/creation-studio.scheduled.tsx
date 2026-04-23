import { createFileRoute } from '@tanstack/react-router';
import ScheduledContentPage from '@/pages/creation-studio/ScheduledContentPage';
export const Route = createFileRoute('/creation-studio/scheduled')({
  head: () => ({ meta: [{ title: 'Scheduled Content — Creation Studio' }, { name: 'description', content: 'Plan and schedule content across every Gigvora surface.' }]}),
  component: () => <ScheduledContentPage />,
});
