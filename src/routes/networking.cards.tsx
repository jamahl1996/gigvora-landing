import { createFileRoute } from '@tanstack/react-router';
import DigitalCardGalleryPage from '@/pages/networking/DigitalCardGalleryPage';
export const Route = createFileRoute('/networking/cards')({
  head: () => ({ meta: [{ title: 'Digital Cards — Networking — Gigvora' }, { name: 'description', content: 'Saved digital business cards from your network.' }]}),
  component: () => <DigitalCardGalleryPage />,
});
