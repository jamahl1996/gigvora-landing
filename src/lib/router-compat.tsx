/**
 * Phase 10 — react-router-dom ⇄ @tanstack/react-router compatibility shim.
 *
 * Why this exists: the Gigvora codebase has 635 files importing from
 * `react-router-dom`. Migrating them all in one turn would brick the app.
 * This module re-exports a react-router-dom-shaped API on top of TanStack
 * Router so existing code keeps working while we incrementally rewrite
 * call sites to native TanStack patterns.
 *
 * SAFETY: all type-safe TanStack features (params, search, fullPath) are
 * preserved when callers migrate to direct `@tanstack/react-router` imports.
 * This shim is a *temporary* bridge — every file that migrates off it is
 * tracked in docs/release-readiness/MIGRATION_TANSTACK.md.
 *
 * What we re-implement:
 *   - <Link to="/path"> with template-literal `to` (TanStack requires
 *     `to="/posts/$id" params={{id}}`; we accept the legacy string form
 *     and forward it as a free-form path).
 *   - useNavigate() — returns a function that accepts (path, options) OR
 *     ({to, replace, state}) like RR-DOM. Internally calls TanStack navigate.
 *   - useLocation() — returns { pathname, search, hash, state } shape.
 *   - useParams<T>() — returns Record<string,string> (loose-typed).
 *   - useSearchParams() — returns [URLSearchParams, setSearchParams] tuple.
 *   - <Outlet /> — re-export from TanStack.
 *   - <Navigate to=...> — declarative redirect.
 *   - <BrowserRouter> / <Routes> / <Route> — NO-OP wrappers that just
 *     render children, since TanStack file-based routing handles all
 *     mounting at the router level. App.tsx will be torn down in Phase 5+.
 */
import * as React from 'react';
import {
  Link as TLink,
  Outlet as TOutlet,
  Navigate as TNavigate,
  useNavigate as useTNavigate,
  useLocation as useTLocation,
  useParams as useTParams,
  useSearch as useTSearch,
  useRouter as useTRouter,
  type LinkProps as TLinkProps,
} from '@tanstack/react-router';

// ───────────── <Link> ─────────────
export interface RRLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string;
  replace?: boolean;
  state?: unknown;
  reloadDocument?: boolean;
}
export const Link = React.forwardRef<HTMLAnchorElement, RRLinkProps>(
  function Link({ to, replace, state, reloadDocument, ...rest }, ref) {
    if (reloadDocument) {
      return <a ref={ref} href={to} {...rest} />;
    }
    // Cast: TanStack types `to` very strictly via the route tree, but at
    // shim-time we accept any string and let the runtime resolve it.
    return (
      <TLink
        ref={ref as never}
        to={to as TLinkProps['to']}
        replace={replace}
        state={state as never}
        {...(rest as object)}
      />
    );
  },
);

// ───────────── <NavLink> ─────────────
// RR-DOM NavLink supports a className/style/children render-prop receiving
// { isActive }. We omit the base anchor `children`/`className` so the
// render-prop variants don't conflict with the parent type.
export interface RRNavLinkProps
  extends Omit<RRLinkProps, 'children' | 'className' | 'style'> {
  end?: boolean;
  className?: string | ((args: { isActive: boolean; isPending: boolean }) => string);
  style?: React.CSSProperties | ((args: { isActive: boolean; isPending: boolean }) => React.CSSProperties);
  children?: React.ReactNode | ((args: { isActive: boolean; isPending: boolean }) => React.ReactNode);
}
export const NavLink = React.forwardRef<HTMLAnchorElement, RRNavLinkProps>(
  function NavLink({ to, end, className, style, children, replace, state, ...rest }, ref) {
    return (
      <TLink
        ref={ref as never}
        to={to as TLinkProps['to']}
        replace={replace}
        state={state as never}
        activeOptions={{ exact: end }}
        {...(rest as object)}
      >
        {(args: { isActive: boolean }) => {
          const ctx = { isActive: args.isActive, isPending: false };
          const cls = typeof className === 'function' ? className(ctx) : className;
          const sty = typeof style === 'function' ? style(ctx) : style;
          const node = typeof children === 'function' ? children(ctx) : children;
          return (
            <span className={cls} style={sty}>
              {node}
            </span>
          );
        }}
      </TLink>
    );
  },
);

// ───────────── <Outlet>, <Navigate> ─────────────
export const Outlet = TOutlet;

export interface RRNavigateProps {
  to: string;
  replace?: boolean;
  state?: unknown;
}
export function Navigate({ to, replace, state }: RRNavigateProps) {
  return <TNavigate to={to as never} replace={replace} state={state as never} />;
}

// ───────────── useNavigate ─────────────
// RR-DOM signature: navigate(to: string | number, opts?: { replace?: boolean; state?: unknown })
//                   navigate(-1) goes back.
export type NavigateFunction = {
  (delta: number): void;
  (to: string, opts?: { replace?: boolean; state?: unknown }): void;
  (opts: { to?: string; replace?: boolean; state?: unknown }): void;
};
export function useNavigate(): NavigateFunction {
  const tnav = useTNavigate();
  const router = useTRouter();
  return React.useCallback(
    ((arg1: number | string | { to?: string; replace?: boolean; state?: unknown }, arg2?: { replace?: boolean; state?: unknown }) => {
      if (typeof arg1 === 'number') {
        if (arg1 === -1) router.history.back();
        else if (arg1 === 1) router.history.forward();
        else router.history.go(arg1);
        return;
      }
      if (typeof arg1 === 'string') {
        tnav({ to: arg1 as never, replace: arg2?.replace, state: arg2?.state as never });
        return;
      }
      if (arg1 && typeof arg1 === 'object') {
        if (!arg1.to) return;
        tnav({ to: arg1.to as never, replace: arg1.replace, state: arg1.state as never });
      }
    }) as NavigateFunction,
    [tnav, router],
  );
}

// ───────────── useLocation ─────────────
export interface RRLocation {
  pathname: string;
  search: string;
  hash: string;
  state: unknown;
  key: string;
}
export function useLocation(): RRLocation {
  const loc = useTLocation();
  return React.useMemo(
    () => ({
      pathname: loc.pathname,
      search: loc.searchStr ?? '',
      hash: loc.hash ?? '',
      state: loc.state ?? null,
      key: (loc as { state?: { key?: string } }).state?.key ?? 'default',
    }),
    [loc],
  );
}

// ───────────── useParams ─────────────
// RR-DOM returns Record<string, string | undefined>. TanStack's strict-mode
// useParams requires a `from`. We use { strict: false } to mirror RR-DOM.
export function useParams<
  T extends Record<string, string | undefined> = Record<string, string | undefined>,
>(): T {
  return useTParams({ strict: false } as never) as T;
}

// ───────────── useSearchParams ─────────────
// RR-DOM signature: const [params, setParams] = useSearchParams();
// `setParams` accepts URLSearchParams | string | Record<string,string> | (prev) => same.
type SetURLSearchParams = (
  next:
    | URLSearchParams
    | string
    | Record<string, string>
    | ((prev: URLSearchParams) => URLSearchParams | string | Record<string, string>),
  opts?: { replace?: boolean; state?: unknown },
) => void;

export function useSearchParams(
  defaultInit?: URLSearchParams | string | Record<string, string>,
): [URLSearchParams, SetURLSearchParams] {
  const loc = useTLocation();
  const tnav = useTNavigate();
  // Tanstack's useSearch returns the parsed search object; we want a raw
  // URLSearchParams to match the RR-DOM API surface.
  const search = useTSearch({ strict: false }) as Record<string, unknown>;

  const params = React.useMemo(() => {
    const sp = new URLSearchParams();
    Object.entries(search).forEach(([k, v]) => {
      if (v == null) return;
      if (Array.isArray(v)) v.forEach((vi) => sp.append(k, String(vi)));
      else sp.set(k, String(v));
    });
    if (sp.toString() === '' && defaultInit) {
      if (defaultInit instanceof URLSearchParams) return new URLSearchParams(defaultInit);
      if (typeof defaultInit === 'string') return new URLSearchParams(defaultInit);
      Object.entries(defaultInit).forEach(([k, v]) => sp.set(k, v));
    }
    return sp;
  }, [search, defaultInit]);

  const setParams = React.useCallback<SetURLSearchParams>(
    (next, opts) => {
      const resolved = typeof next === 'function' ? next(params) : next;
      let sp: URLSearchParams;
      if (resolved instanceof URLSearchParams) sp = resolved;
      else if (typeof resolved === 'string') sp = new URLSearchParams(resolved);
      else {
        sp = new URLSearchParams();
        Object.entries(resolved).forEach(([k, v]) => sp.set(k, v));
      }
      const obj: Record<string, string> = {};
      sp.forEach((v, k) => { obj[k] = v; });
      tnav({ to: loc.pathname as never, search: obj as never, replace: opts?.replace, state: opts?.state as never });
    },
    [params, tnav, loc.pathname],
  );

  return [params, setParams];
}

// ───────────── matchPath / generatePath / createSearchParams ─────────────
// Minimal helpers a few RR-DOM consumers reach for.
export function createSearchParams(
  init?: string | Record<string, string | string[]> | URLSearchParams,
): URLSearchParams {
  if (init instanceof URLSearchParams) return new URLSearchParams(init);
  if (typeof init === 'string') return new URLSearchParams(init);
  const sp = new URLSearchParams();
  if (init) {
    Object.entries(init).forEach(([k, v]) => {
      if (Array.isArray(v)) v.forEach((vi) => sp.append(k, vi));
      else sp.set(k, v);
    });
  }
  return sp;
}

export function generatePath(pattern: string, params: Record<string, string> = {}) {
  return pattern.replace(/:([A-Za-z0-9_]+)/g, (_, k) =>
    encodeURIComponent(params[k] ?? `:${k}`),
  );
}

// ───────────── BrowserRouter / Routes / Route — NO-OP shims ─────────────
// These exist purely so legacy `import { BrowserRouter, Routes, Route } from
// 'react-router-dom'` compiles. The actual mounting happens via TanStack's
// file-based router; the legacy <App/> is rendered inside a single catch-all
// TanStack route during Phase 4-7.
export function BrowserRouter({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}
export function HashRouter({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}
export function MemoryRouter({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}
export function Routes({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}
export function Route(_props: { path?: string; element?: React.ReactNode; children?: React.ReactNode; index?: boolean }) {
  // RR-DOM <Route> elements are config nodes, not rendered. Return null.
  return null;
}

// ───────────── Misc compatibility exports ─────────────
export type Params<K extends string = string> = Record<K, string | undefined>;
export type Location = RRLocation;
