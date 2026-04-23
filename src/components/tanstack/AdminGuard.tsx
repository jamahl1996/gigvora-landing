/**
 * Phase 11 — TanStack-native AdminGuard.
 * Mirror of src/components/layout/AdminGuard.tsx using @tanstack/react-router
 * Navigate component and useLocation hook.
 */
import React from 'react';
import { Navigate, useLocation } from '@tanstack/react-router';
import { useAdminAuth } from '@/lib/adminAuth';

export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAdminAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    // Cast `to` loosely — TanStack typed routes don't yet include /admin/login until cutover.
    return <Navigate to={`/admin/login?redirect=${redirect}` as unknown as '/'} replace />;
  }

  return <>{children}</>;
};