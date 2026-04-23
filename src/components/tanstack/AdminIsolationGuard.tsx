/**
 * Phase 11 — TanStack-native AdminIsolationGuard.
 * Mirror of src/components/layout/AdminIsolationGuard.tsx using
 * @tanstack/react-router useLocation hook.
 */
import React, { useEffect } from 'react';
import { useLocation } from '@tanstack/react-router';

const LEAK_SELECTOR = '[data-user-shell-widget]';

export const AdminIsolationGuard: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!pathname.startsWith('/admin')) return;
    const check = () => {
      const leaks = document.querySelectorAll(LEAK_SELECTOR);
      if (leaks.length > 0) {
        // eslint-disable-next-line no-console
        console.error(
          `[AdminIsolationGuard] ${leaks.length} user-shell widget(s) leaked into /admin/*`,
          Array.from(leaks).map((el) => el.tagName + (el.id ? `#${el.id}` : '')),
        );
        leaks.forEach((el) => el.setAttribute('hidden', 'true'));
      }
      document.body.classList.remove('user-shell-active', 'public-shell-active');
    };
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [pathname]);

  return null;
};

export default AdminIsolationGuard;