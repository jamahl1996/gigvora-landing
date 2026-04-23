/**
 * Phase 11 — TanStack-native LoggedInShell.
 * Mirror of src/components/layout/LoggedInShell.tsx using @tanstack/react-router
 * Outlet, with all navigation sub-components routed through tanstack/ siblings.
 *
 * Sub-components still on react-router-dom (deferred to Session 4 because they
 * are also consumed by DashboardShell):
 *   - QuickCreateMenu, NotificationTray, InboxCounter, TaskTray
 * They render fine while we are dual-runtime (rrd is the active provider) and
 * will be migrated when DashboardShell is converted in Session 4.
 */
import React from 'react';
import { Outlet } from '@tanstack/react-router';
import { LoggedInTopBar } from './LoggedInTopBar';
import { MobileBottomNav } from './MobileBottomNav';
import MessagingBubble from './MessagingBubble';
import { MlFallbackBanner } from '@/components/ml/MlFallbackBanner';
import { AutoBackNav } from './AutoBackNav';

export const LoggedInShell: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LoggedInTopBar />
      <main
        className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden pb-16 md:pb-0"
        style={{ height: 'calc(100vh - var(--topbar-height) - var(--megamenu-height))' }}
      >
        <div className="max-w-[var(--content-max-width)] mx-auto w-full px-3 md:px-[var(--shell-gutter)] py-5 md:py-7">
          <MlFallbackBanner className="mb-4" />
          <AutoBackNav />
          <Outlet />
        </div>
      </main>
      <MobileBottomNav />
      <MessagingBubble />
    </div>
  );
};