/**
 * Runtime environment facade.
 *
 * Provider endpoints are optional and should be supplied by the deployment
 * target that owns them.
 */
import { z } from 'zod';

const ClientEnvSchema = z.object({
  API_BASE_URL: z.string().optional(),
  AI_ASSISTANT_URL: z.string().url().optional(),
  MODE: z.enum(['development', 'production', 'test']).default('development'),
});

type ClientEnv = z.infer<typeof ClientEnvSchema>;

function loadClientEnv(): ClientEnv {
  const result = ClientEnvSchema.safeParse({
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    AI_ASSISTANT_URL: import.meta.env.VITE_AI_ASSISTANT_URL,
    MODE: import.meta.env.MODE,
  });

  if (!result.success) {
    // eslint-disable-next-line no-console
    console.error('[env] Invalid client environment:', result.error.flatten().fieldErrors);
    throw new Error('Client environment validation failed.');
  }

  return result.data;
}

export const clientEnv: ClientEnv = loadClientEnv();

const ServerEnvSchema = z.object({
  DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

type ServerEnv = z.infer<typeof ServerEnvSchema>;

export function loadServerEnv(env: NodeJS.ProcessEnv = process.env): ServerEnv {
  const result = ServerEnvSchema.safeParse(env);

  if (!result.success) {
    // eslint-disable-next-line no-console
    console.error('[env] Invalid server environment:', result.error.flatten().fieldErrors);
    throw new Error('Server environment validation failed.');
  }

  return result.data;
}
