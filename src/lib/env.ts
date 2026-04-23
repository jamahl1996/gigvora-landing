/**
 * Phase 05 — Runtime environment validation.
 *
 * Centralises every `import.meta.env.*` and `process.env.*` read in the
 * web app behind a zod-validated facade. If a required variable is missing
 * or malformed, we fail fast with a precise error instead of crashing
 * downstream with `Cannot read properties of undefined`.
 *
 * The Lovable-managed Supabase project is the *DailyMint demo only*
 * (see mem://tech/no-domain-code-in-supabase). Gigvora enterprise data
 * lives in the user's own Postgres reached via api-nest. This file
 * therefore validates the small set of vars the web shell actually uses:
 * the auth + AI gateway endpoints injected by Lovable Cloud.
 *
 * Usage:
 *   import { clientEnv } from '@/lib/env';
 *   const url = clientEnv.SUPABASE_URL;
 *
 *   // Server-only (never import in a React component):
 *   import { serverEnv } from '@/lib/env';
 */
import { z } from 'zod';

/* ------------------------------------------------------------------ */
/* Client (browser) env — values bundled at build by Vite             */
/* ------------------------------------------------------------------ */

const ClientEnvSchema = z.object({
  /** Supabase project URL — used by the auth + storage SDK. */
  SUPABASE_URL: z.string().url(),
  /** Supabase publishable / anon key — safe to ship to the browser. */
  SUPABASE_PUBLISHABLE_KEY: z.string().min(20),
  /** Project ref for analytics + edge fn URLs. */
  SUPABASE_PROJECT_ID: z.string().min(8).optional(),
  /** Build mode — 'development' | 'production' | 'test'. */
  MODE: z.enum(['development', 'production', 'test']).default('development'),
});

type ClientEnv = z.infer<typeof ClientEnvSchema>;

function loadClientEnv(): ClientEnv {
  const raw = {
    SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    SUPABASE_PROJECT_ID: import.meta.env.VITE_SUPABASE_PROJECT_ID,
    MODE: import.meta.env.MODE,
  };
  const result = ClientEnvSchema.safeParse(raw);
  if (!result.success) {
    // Surface the precise field errors so the developer can fix the .env
    // mapping in Lovable Cloud immediately.
    // eslint-disable-next-line no-console
    console.error(
      '[env] Invalid client environment:',
      result.error.flatten().fieldErrors,
    );
    throw new Error(
      'Client environment validation failed. ' +
        'Required: VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY.',
    );
  }
  return result.data;
}

/** Validated client env. Safe to import from any browser code. */
export const clientEnv: ClientEnv = loadClientEnv();

/* ------------------------------------------------------------------ */
/* Server env — process.env, only available in TanStack server fns    */
/* ------------------------------------------------------------------ */

const ServerEnvSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_PUBLISHABLE_KEY: z.string().min(20),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
  /** Lovable AI Gateway key — used by the ai-assistant edge fn + future server fns. */
  LOVABLE_API_KEY: z.string().min(10).optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

type ServerEnv = z.infer<typeof ServerEnvSchema>;

/**
 * Lazy server-env loader. Importing this from a React component will
 * throw at runtime in the browser — exactly what we want, since it
 * prevents accidental leaks of the service-role key into the bundle.
 */
export function loadServerEnv(env: NodeJS.ProcessEnv = process.env): ServerEnv {
  const result = ServerEnvSchema.safeParse(env);
  if (!result.success) {
    // eslint-disable-next-line no-console
    console.error(
      '[env] Invalid server environment:',
      result.error.flatten().fieldErrors,
    );
    throw new Error(
      'Server environment validation failed. ' +
        'Required: SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, SUPABASE_SERVICE_ROLE_KEY.',
    );
  }
  return result.data;
}