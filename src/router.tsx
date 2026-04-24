/**
 * Phase 10 — TanStack Router instance for Gigvora.
 *
 * Migration plan: this is the new app entrypoint. The legacy <App/> tree
 * (react-router-dom + 222 routes) currently mounts under a single catch-all
 * route in src/routes/__catch.tsx so nothing visually changes for users
 * during the migration. Subsequent phases peel pages off the catch-all and
 * land them as native TanStack file routes under src/routes/.
 *
 * Per the SSR-safe pattern: QueryClient is created INSIDE getRouter() so
 * each server request gets a fresh cache. defaultPreloadStaleTime: 0 lets
 * TanStack Query control freshness (router preload cache disabled).
 */
import { QueryClient } from '@tanstack/react-query';
import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

export interface RouterAuthState {
  isAuthenticated: boolean;
  userId: string | null;
}

export interface RouterContext {
  queryClient: QueryClient;
  auth: RouterAuthState;
}

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Sensible enterprise defaults; override per-query as needed.
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

  const router = createTanStackRouter({
    routeTree,
    context: {
      queryClient,
      // Filled in by the AuthProvider via router.update({ context }) at
      // mount time — see src/main.tsx.
      auth: { isAuthenticated: false, userId: null } satisfies RouterAuthState,
    },
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
  });

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}