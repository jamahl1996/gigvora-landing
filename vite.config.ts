import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    // TanStack Router plugin must run BEFORE the React plugin so it can
    // generate src/routeTree.gen.ts before SWC compiles route files.
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
    }),
    react(),
  ].filter(Boolean),
  resolve: {
    alias: [
      // Order matters: more-specific subpath alias FIRST so `@gigvora/sdk/foo`
      // resolves to packages/sdk/src/foo.ts, then the bare alias for the
      // root SDK entry. Without the directory alias Vite was treating the
      // bare alias as a file and trying to read `index.ts/foo` as a child.
      { find: /^@gigvora\/sdk\/(.*)$/, replacement: path.resolve(__dirname, "./packages/sdk/src/$1.ts") },
      { find: "@gigvora/sdk", replacement: path.resolve(__dirname, "./packages/sdk/src/index.ts") },
      // The app is bootstrapped with react-router-dom <BrowserRouter>, but
      // many pages import Link/useNavigate from `@tanstack/react-router`.
      // Redirect those imports to a thin compatibility shim so they work
      // against react-router-dom instead of crashing on missing TanStack
      // RouterProvider context.
      { find: /^@tanstack\/react-router$/, replacement: path.resolve(__dirname, "./src/lib/router-shim/index.tsx") },
      { find: "@", replacement: path.resolve(__dirname, "./src") },
    ],
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
