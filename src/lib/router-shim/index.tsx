/**
 * Compatibility shim: maps `@tanstack/react-router` imports to
 * `react-router-dom` equivalents. The app is bootstrapped with
 * <BrowserRouter> from react-router-dom (see src/App.tsx), but many
 * pages/components import Link/useNavigate/etc. from @tanstack/react-router.
 * Without this shim those hooks crash with "Cannot read properties of null
 * (reading 'isServer')" because there is no TanStack RouterProvider.
 *
 * Route-definition helpers (createFileRoute, createRootRouteWithContext,
 * createRouter) are no-ops here — the route tree under src/routes/ is not
 * actually mounted; pages are rendered through the react-router-dom <Routes>
 * tree in App.tsx.
 */
import * as React from "react";
import {
  Link as RRLink,
  Navigate as RRNavigate,
  Outlet as RROutlet,
  useLocation as rrUseLocation,
  useNavigate as rrUseNavigate,
  useParams as rrUseParams,
  useSearchParams,
} from "react-router-dom";

type AnyProps = Record<string, any>;

/** Convert a TanStack `to` + `params` into a plain react-router path. */
function buildPath(to: any, params?: Record<string, any>): string {
  if (typeof to !== "string") return "/";
  let path = to;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      // TanStack uses `$param`; react-router uses `:param`. Also tolerate `:param`.
      const enc = encodeURIComponent(String(v));
      path = path.split(`$${k}`).join(enc);
      path = path.split(`:${k}`).join(enc);
    }
  }
  return path;
}

function buildSearch(search: any, currentSearch: string): string {
  if (!search) return "";
  let next: URLSearchParams;
  if (typeof search === "function") {
    const current = Object.fromEntries(new URLSearchParams(currentSearch));
    const result = search(current) ?? {};
    next = new URLSearchParams();
    for (const [k, v] of Object.entries(result)) {
      if (v !== undefined && v !== null && v !== "") next.set(k, String(v));
    }
  } else if (typeof search === "object") {
    next = new URLSearchParams();
    for (const [k, v] of Object.entries(search)) {
      if (v !== undefined && v !== null && v !== "") next.set(k, String(v));
    }
  } else {
    return "";
  }
  const s = next.toString();
  return s ? `?${s}` : "";
}

export const Link = React.forwardRef<HTMLAnchorElement, AnyProps>(function Link(
  props,
  ref,
) {
  const {
    to,
    params,
    search,
    hash,
    activeProps,
    inactiveProps,
    activeOptions,
    preload,
    preloadDelay,
    from,
    mask,
    resetScroll,
    replace,
    children,
    className,
    style,
    ...rest
  } = props;
  const location = rrUseLocation();
  const path = buildPath(to, params);
  const searchStr = buildSearch(search, location.search);
  const hashStr = hash ? (hash.startsWith("#") ? hash : `#${hash}`) : "";
  const fullTo = `${path}${searchStr}${hashStr}`;

  // active-state handling
  const isActive = activeOptions?.exact
    ? location.pathname === path
    : location.pathname === path || location.pathname.startsWith(path + "/");

  const mergedClassName = [
    className,
    isActive ? activeProps?.className : inactiveProps?.className,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  const mergedStyle = { ...(style ?? {}), ...((isActive ? activeProps?.style : inactiveProps?.style) ?? {}) };

  const renderedChildren =
    typeof children === "function" ? (children as any)({ isActive }) : children;

  return (
    <RRLink
      ref={ref}
      to={fullTo}
      replace={replace}
      className={mergedClassName}
      style={mergedStyle}
      data-status={isActive ? "active" : undefined}
      {...rest}
    >
      {renderedChildren}
    </RRLink>
  );
});

export function Navigate(props: AnyProps) {
  const { to, params, search, hash, replace } = props;
  const location = rrUseLocation();
  const path = buildPath(to, params);
  const searchStr = buildSearch(search, location.search);
  const hashStr = hash ? (hash.startsWith("#") ? hash : `#${hash}`) : "";
  return <RRNavigate to={`${path}${searchStr}${hashStr}`} replace={replace} />;
}

export const Outlet = RROutlet;

export function useLocation() {
  const loc = rrUseLocation();
  return {
    pathname: loc.pathname,
    search: Object.fromEntries(new URLSearchParams(loc.search)),
    searchStr: loc.search,
    hash: loc.hash,
    state: loc.state,
    href: `${loc.pathname}${loc.search}${loc.hash}`,
  };
}

export function useNavigate<_T = unknown>(_opts?: { from?: string }) {
  const nav = rrUseNavigate();
  const location = rrUseLocation();
  return React.useCallback(
    (options: any = {}) => {
      if (typeof options === "string") {
        nav(options);
        return;
      }
      if (typeof options === "number") {
        nav(options);
        return;
      }
      const { to, params, search, hash, replace } = options;
      const path = to ? buildPath(to, params) : location.pathname;
      const searchStr = buildSearch(search, location.search);
      const hashStr = hash ? (hash.startsWith("#") ? hash : `#${hash}`) : "";
      nav(`${path}${searchStr}${hashStr}`, { replace });
    },
    [nav, location.pathname, location.search],
  );
}

export function useParams<T = Record<string, string>>(_opts?: any): T {
  return rrUseParams() as unknown as T;
}

export function useRouter() {
  const nav = rrUseNavigate();
  return {
    navigate: (opts: AnyProps) => {
      const path = opts?.to ? buildPath(opts.to, opts.params) : "/";
      nav(path, { replace: opts?.replace });
    },
    invalidate: () => Promise.resolve(),
    history: {
      back: () => window.history.back(),
      forward: () => window.history.forward(),
      go: (delta: number) => window.history.go(delta),
    },
  };
}

export function useSearch<T = Record<string, any>>(_opts?: any): T {
  const [params] = useSearchParams();
  return Object.fromEntries(params) as unknown as T;
}

/* ---------- Route-definition no-ops ---------- */
// These helpers are imported by files under src/routes/, but the route tree
// generated from them is not actually used at runtime (App.tsx mounts pages
// directly via react-router-dom). Returning a stable shape prevents crashes
// if anything ever evaluates them.

export function createFileRoute(_path?: string) {
  return (_options: any) => ({
    useParams,
    useSearch,
    useLoaderData: () => undefined as any,
    useRouteContext: () => ({} as any),
  });
}

export function createRootRoute(_options?: any) {
  return {
    useParams,
    useSearch,
    useLoaderData: () => undefined as any,
    useRouteContext: () => ({} as any),
  };
}

export function createRootRouteWithContext<_T>() {
  return (_options?: any) => createRootRoute(_options);
}

export function createRouter(options: any) {
  return options;
}

export function createRouteMask(options: any) {
  return options;
}

export const rootRouteId = "__root__";

export const ErrorComponent = ({ error }: { error: Error }) => (
  <div role="alert" style={{ padding: 24 }}>
    <p>Error: {error?.message ?? String(error)}</p>
  </div>
);

export function notFound(opts?: any) {
  const e: any = new Error("NotFound");
  e.routerCode = "NOT_FOUND";
  e.data = opts?.data;
  return e;
}

export function redirect(opts: any) {
  const e: any = new Error("Redirect");
  e.routerCode = "REDIRECT";
  e.options = opts;
  return e;
}

export function Await({ promise, children, fallback }: any) {
  const [state, setState] = React.useState<{ status: "pending" | "resolved" | "rejected"; value?: any; error?: any }>({
    status: "pending",
  });
  React.useEffect(() => {
    let cancelled = false;
    Promise.resolve(promise).then(
      (value) => !cancelled && setState({ status: "resolved", value }),
      (error) => !cancelled && setState({ status: "rejected", error }),
    );
    return () => {
      cancelled = true;
    };
  }, [promise]);
  if (state.status === "pending") return fallback ?? null;
  if (state.status === "rejected") throw state.error;
  return typeof children === "function" ? children(state.value) : children;
}

export function getRouteApi(_id: string) {
  return {
    useParams,
    useSearch,
    useLoaderData: () => undefined as any,
    useRouteContext: () => ({} as any),
  };
}

export function MatchRoute(_props: any) {
  return null;
}

export function linkOptions<T>(opts: T): T {
  return opts;
}

export function createLink<T extends React.ComponentType<any>>(Component: T): T {
  return Component;
}

export function useBlocker(_opts?: any) {
  return { proceed: () => {}, reset: () => {}, status: "idle" as const };
}

export const useQueryErrorResetBoundary = undefined as any;

/* ---------- Type exports for compatibility ---------- */
export type LinkProps = AnyProps;
export type LinkComponent<T = any> = React.ComponentType<LinkProps & React.ComponentProps<any>>;
