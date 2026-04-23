import { createFileRoute } from '@tanstack/react-router';
import ProductPage from '@/pages/ProductPage';

export const Route = createFileRoute('/product')({
  head: () => ({
    meta: [
      { title: 'Product — Gigvora' },
      { name: 'description', content: 'Explore the Gigvora product suite — Feed, Hire, Work, Network, and Create.' },
      { property: 'og:title', content: 'Gigvora Product' },
      { property: 'og:description', content: 'The unified enterprise platform for modern professionals.' },
    ],
  }),
  component: () => <ProductPage />,
});