/**
 * Server-side data access for clients (Phase 1B).
 *
 * Uses the service-role Supabase client (bypasses RLS); permission enforcement
 * is the API layer's job (docs/02 §D14). Runs only on the server — never import
 * this into a client component.
 */
import 'server-only';

import { getServerClient } from '@gracie/db';
import type { Client } from '@gracie/shared';

import { mapClient } from '../mappers.js';

/** List all clients, ordered by relationship health (desc). */
export async function listClients(): Promise<Client[]> {
  const db = getServerClient();
  const { data, error } = await db
    .from('clients')
    .select('*')
    .order('relationship_health', { ascending: false, nullsFirst: false });
  if (error) throw new Error(`listClients: ${error.message}`);
  return (data ?? []).map(mapClient);
}

/** Fetch a single client by id, or null if not found. */
export async function getClient(id: string): Promise<Client | null> {
  const db = getServerClient();
  const { data, error } = await db.from('clients').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(`getClient: ${error.message}`);
  return data === null ? null : mapClient(data);
}

/**
 * Strip admin-only fields from a client for non-admin roles (docs/02 §D14).
 * Fee tier and contract value are omitted entirely, not nulled-and-hidden.
 */
export function redactClientForRole(client: Client, isAdmin: boolean): Client {
  if (isAdmin) return client;
  return { ...client, feeTier: null, contractValue: null };
}
