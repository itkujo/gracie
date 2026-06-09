/**
 * Supabase SERVER client (Phase 1B).
 *
 * Uses the service-role key (bypasses RLS) — backend/worker ONLY. Never ship
 * this client or its key to the browser (docs/03 §6, docs/07 §3).
 *
 * The client is created LAZILY and memoized on first call. Importing this
 * module is side-effect free; env is only read when `getServerClient()` runs.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { getServerConfig } from './config.js';
import type { Database } from './database.types.js';

export type ServerClient = SupabaseClient<Database>;

let cached: ServerClient | undefined;

/**
 * Resolve the memoized service-role Supabase client.
 *
 * Throws if required env is missing (fail-fast). Sessions are disabled — this
 * is a stateless backend client.
 */
export function getServerClient(): ServerClient {
  if (cached !== undefined) return cached;
  const { url, serviceRoleKey } = getServerConfig();
  cached = createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
