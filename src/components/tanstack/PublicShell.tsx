/**
 * Phase 11 — TanStack-native PublicShell.
 * Mirror of src/components/layout/PublicShell.tsx using TanStack's <Outlet />
 * and the TanStack-native PublicTopBar / Footer / AutoBackNav.
 *
 * This shell is wired into TanStack pathless layout routes (e.g. _publicShell.tsx)
 * once main.tsx is flipped to RouterProvider in a later session.
 */
import React from 'react';
import { Outlet } from '@tanstack/react-router';
import { PublicTopBar } from './PublicTopBar';
import { Footer } from './Footer';
import { AutoBackNav } from './AutoBackNav';

export const PublicShell: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicTopBar />
      <main className="flex-1">
        <div className="max-w-[var(--public-max-width)] mx-auto w-full px-[var(--shell-gutter-wide)] py-10">
          <AutoBackNav />
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};