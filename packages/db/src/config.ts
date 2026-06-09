/**
 * Supabase connection config — validated, fail-fast at first use (Phase 1B).
 *
 * Reads env at call time (not import time) so importing db modules stays
 * side-effect free. Throws a clear error if a required var is missing.
 *
 * Required env:
 *   SUPABASE_URL                 — Kong gateway URL (internal or dev-LAN)
 *   SUPABASE_ANON_KEY            — RLS-bound, browser-safe
 *   SUPABASE_SERVICE_ROLE_KEY    — backend/worker only; bypasses RLS
 */

export interface SupabaseConfig {
  readonly url: string;
  readonly anonKey: string;
  readonly serviceRoleKey: string;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined || value === '') {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `Set it before using the Supabase client (see docs/07-integrations.md).`,
    );
  }
  return value;
}

/** Server-side config (service role). Backend/worker only. */
export function getServerConfig(): SupabaseConfig {
  return {
    url: requireEnv('SUPABASE_URL'),
    anonKey: requireEnv('SUPABASE_ANON_KEY'),
    serviceRoleKey: requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
  };
}

/** Browser-safe config (anon only). Never exposes the service-role key. */
export function getBrowserConfig(): Pick<SupabaseConfig, 'url' | 'anonKey'> {
  return {
    url: requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    anonKey: requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  };
}
