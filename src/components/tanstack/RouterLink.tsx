/**
 * Phase 11 — TanStack-native Link shim that mirrors react-router-dom's <Link to="..."> API.
 *
 * Why this exists: The legacy shells (PublicShell, LoggedInShell, DashboardShell)
 * pass arbitrary string `to` props (e.g. to={cta.to}, to={link.href}). TanStack
 * Router's typed <Link> rejects unknown route paths at compile time. We use
 * createLink() to wrap a plain <a> so dynamic strings work like rrd, while
 * still benefiting from TanStack's client-side navigation, preloading, and
 * scroll restoration once main.tsx is flipped to RouterProvider.
 *
 * Use this in any component that lives inside a TanStack-rendered shell.
 */
import * as React from 'react';
import {
  createLink,
  useNavigate as useTanStackNavigate,
  useParams as useTanStackParams,
  useSearch as useTanStackSearch,
  useRouter,
  Navigate as TanStackNavigate,
  type LinkComponent,
} from '@tanstack/react-router';

interface BasicAnchorProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  // We intentionally do not require href here — TanStack's createLink fills it
  // from the `to` prop on the wrapped <Link>.
}

const BasicAnchor = React.forwardRef<HTMLAnchorElement, BasicAnchorProps>((props, ref) => {
  return <a ref={ref} {...props} />;
});
BasicAnchor.displayName = 'BasicAnchor';

const CreatedRouterLink = createLink(BasicAnchor);

/**
 * Drop-in replacement for `import { Link } from 'react-router-dom'`.
 * Accepts string `to` paths (typed loosely as `string` via `as any` cast at
 * the call sites that need it — but most usage will Just Work).
 */
export const RouterLink: LinkComponent<typeof BasicAnchor> = (props) => {
  return <CreatedRouterLink preload="intent" {...props} />;
};

/**
 * Loose-typed alias for legacy code that passes string paths from data files.
 * Use this when migrating components that build hrefs dynamically.
 */
export const Link = RouterLink as unknown as React.FC<
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    to: string;
    params?: Record<string, string>;
    search?: Record<string, unknown> | ((prev: Record<string, unknown>) => Record<string, unknown>);
    activeProps?: { className?: string };
    inactiveProps?: { className?: string };
    preload?: 'intent' | 'viewport' | 'render' | false;
  }
>;

/**
 * Drop-in replacement for `import { useNavigate } from 'react-router-dom'`.
 *
 * Returns a function that accepts EITHER a string path (legacy rrd API used
 * by AvatarDropdown, LoggedInTopBar, ConnectionsPopover, MessagingBubble,
 * AdminShell role-switch, etc.) OR a TanStack-style `{ to, params, search }`
 * object. Internally translates string args to TanStack's typed shape.
 *
 * NOTE: this is a migration-shim. New TanStack-native code should use
 * `useNavigate()` from `@tanstack/react-router` directly with typed routes.
 */
export function useNavigate(): (
  target?: number | string | { to?: string; params?: Record<string, string>; replace?: boolean; search?: unknown },
  opts?: { replace?: boolean; state?: unknown },
) => void {
  const navigate = useTanStackNavigate();
  return React.useCallback(
    (target, opts) => {
      if (typeof target === 'number') {
        // react-router-dom navigate(-1)/navigate(1) → history back/forward
        if (target < 0) {
          for (let i = 0; i < -target; i++) window.history.back();
        } else if (target > 0) {
          for (let i = 0; i < target; i++) window.history.forward();
        }
        return;
      }
      if (typeof target === 'string') {
        navigate({ to: target as unknown as '/', replace: opts?.replace } as Parameters<typeof navigate>[0]);
        return;
      }
      if (!target) return;
      navigate({
        to: (target.to ?? '.') as unknown as '/',
        replace: target.replace ?? opts?.replace,
      } as Parameters<typeof navigate>[0]);
    },
    [navigate],
  );
}

/**
 * Drop-in replacement for `import { useParams } from 'react-router-dom'`.
 * Returns a loosely-typed `Record<string, string | undefined>` so legacy code
 * that destructures arbitrary param names (`const { id } = useParams()`) keeps
 * compiling. TanStack's strict `useParams({ from: '/...' })` should be used in
 * new TanStack-native code.
 */
export function useParams<T extends Record<string, string | undefined> = Record<string, string | undefined>>(): T {
  return useTanStackParams({ strict: false }) as unknown as T;
}

/**
 * Drop-in replacement for `import { useSearchParams } from 'react-router-dom'`.
 * Returns a tuple `[URLSearchParams, setter]` mirroring rrd's API. The setter
 * accepts either a URLSearchParams, a record, or an updater function.
 */
export function useSearchParams(): [
  URLSearchParams,
  (next: URLSearchParams | Record<string, string> | ((prev: URLSearchParams) => URLSearchParams | Record<string, string>)) => void,
] {
  const search = useTanStackSearch({ strict: false }) as Record<string, unknown>;
  const navigate = useTanStackNavigate();
  const params = React.useMemo(() => {
    const sp = new URLSearchParams();
    Object.entries(search ?? {}).forEach(([k, v]) => {
      if (v != null) sp.set(k, String(v));
    });
    return sp;
  }, [search]);
  const setParams = React.useCallback(
    (next: URLSearchParams | Record<string, string> | ((prev: URLSearchParams) => URLSearchParams | Record<string, string>)) => {
      const resolved = typeof next === 'function' ? next(params) : next;
      const obj: Record<string, string> = {};
      if (resolved instanceof URLSearchParams) {
        resolved.forEach((v, k) => { obj[k] = v; });
      } else {
        Object.assign(obj, resolved);
      }
      navigate({ to: '.' as unknown as '/', search: obj as never, replace: true } as Parameters<typeof navigate>[0]);
    },
    [navigate, params],
  );
  return [params, setParams];
}

/**
 * Drop-in replacement for `import { Navigate } from 'react-router-dom'`.
 * Accepts a string `to` and optional `replace`. Loose-typed for migration.
 */
export const Navigate: React.FC<{ to: string; replace?: boolean }> = ({ to, replace }) => {
  return <TanStackNavigate to={to as unknown as '/'} replace={replace} />;
};