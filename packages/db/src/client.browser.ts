/**
 * Supabase BROWSER client (Phase 1B).
 *
 * Uses the anon key and is RLS-bound (frontend-safe). RLS policies in docs/04
 * enforce row visibility (defense-in-depth; API middleware is primary). NEVER
 * use the service-role key here (docs/03 §6).
 *
 * Import is side-effect free; env is read lazily on first call. An optional
 * Logto access token can be supplied so `auth_role()`/`auth_uid()` resolve in
 * RLS once auth is wired.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { getBrowserConfig } from './config.js';
import type { Database } from './database.types.js';

export type BrowserClient = SupabaseClient<Database>;

let cached: BrowserClient | undefined;

/**
 * Resolve the memoized anon (RLS-bound) Supabase client.
 *
 * @param accessToken Optional Logto JWT to attach as the Authorization bearer
 *        so RLS policies see the user's role/sub claims.
 */
export function getBrowserClient(accessToken?: string): BrowserClient {
  if (cached !== undefined && accessToken === undefined) return cached;
  const { url, anonKey } = getBrowserConfig();
  const client = createClient<Database>(url, anonKey, {
    auth: { persistSession: false },
    global:
      accessToken !== undefined
        ? { headers: { Authorization: `Bearer ${accessToken}` } }
        : {},
  });
  if (accessToken === undefined) cached = client;
  return client;
}
