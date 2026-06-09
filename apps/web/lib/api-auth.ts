/**
 * API-route auth helper (Phase 1B interim).
 *
 * Resolves the requesting user's role for permission gating in API routes.
 * Currently returns a MOCK role (matching lib/auth.tsx) until Logto JWT
 * verification is wired in the auth phase. The contract — `getRequestUser()`
 * returning `{ userId, role }` — stays stable so swapping in real JWT
 * verification later touches only this file.
 */
import 'server-only';

import type { Role } from '@gracie/shared';

export interface RequestUser {
  readonly userId: string;
  readonly role: Role;
}

// MOCK — replaced by Logto JWT verification (docs/07 §5). Keep in sync with
// the mock identities in lib/auth.tsx for consistent dev behavior.
const MOCK_REQUEST_USER: RequestUser = {
  userId: 'usr_allie',
  role: 'admin',
};

/**
 * Resolve the authenticated user for an API request.
 *
 * Phase 1B interim: returns the mock admin user. Auth phase: verify the Logto
 * JWT from the Authorization header and extract `{ sub, user_role }`.
 */
export function getRequestUser(): RequestUser {
  return MOCK_REQUEST_USER;
}

export function isAdmin(user: RequestUser): boolean {
  return user.role === 'admin';
}
