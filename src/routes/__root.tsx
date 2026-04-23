/**
 * Phase 10 — TanStack Router root route.
 * Wraps the app in QueryClientProvider + the legacy provider stack so the
 * catch-all route can render the existing react-router-dom App tree
 * unchanged during migration.
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet, Link } from '@tanstack/react-router';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { RoleProvider } from '@/contexts/RoleContext';
import { WorkspaceProvider } from '@/contexts/WorkspaceContext';
import type { RouterContext } from '@/router';

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: GlobalNotFound,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <RoleProvider>
            <WorkspaceProvider>
              <Outlet />
              <Toaster />
              <Sonner />
            </WorkspaceProvider>
          </RoleProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function GlobalNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 p-8 text-center">
      <h1 className="text-2xl font-bold">404 — Page Not Found</h1>
      <p className="text-muted-foreground text-sm">The page you requested does not exist.</p>
      <a href="/" className="text-primary underline text-sm">Go Home</a>
    </div>
  );
}