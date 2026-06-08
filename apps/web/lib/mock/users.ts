/**
 * MOCK DATA — team members. Replaced by real API/Logto data in Phase 1B.
 * Deterministic (no randomness at import). Typed with the shared `User` interface.
 */
import type { User } from '@gracie/shared';

const NOW = '2026-04-24T14:00:00.000Z';

export const MOCK_USERS: readonly User[] = [
  {
    id: 'usr_allie',
    logtoId: 'logto_allie',
    email: 'agrace@graceandassociates.com',
    name: 'Allie Grace',
    initials: 'AG',
    role: 'admin',
    isCalendarConnected: true,
    lastActiveAt: NOW,
    createdAt: '2025-07-23T09:00:00.000Z',
    updatedAt: NOW,
  },
  {
    id: 'usr_sarah',
    logtoId: 'logto_sarah',
    email: 'schen@graceandassociates.com',
    name: 'Sarah Chen',
    initials: 'SC',
    role: 'standard',
    isCalendarConnected: true,
    lastActiveAt: '2026-04-24T13:10:00.000Z',
    createdAt: '2025-08-01T09:00:00.000Z',
    updatedAt: NOW,
  },
  {
    id: 'usr_michael',
    logtoId: 'logto_michael',
    email: 'mtorres@graceandassociates.com',
    name: 'Michael Torres',
    initials: 'MT',
    role: 'standard',
    isCalendarConnected: true,
    lastActiveAt: '2026-04-24T11:42:00.000Z',
    createdAt: '2025-08-04T09:00:00.000Z',
    updatedAt: NOW,
  },
  {
    id: 'usr_emma',
    logtoId: 'logto_emma',
    email: 'ewilliams@graceandassociates.com',
    name: 'Emma Williams',
    initials: 'EW',
    role: 'standard',
    isCalendarConnected: false,
    lastActiveAt: '2026-04-23T16:20:00.000Z',
    createdAt: '2025-08-15T09:00:00.000Z',
    updatedAt: NOW,
  },
  {
    id: 'usr_david',
    logtoId: 'logto_david',
    email: 'dkim@graceandassociates.com',
    name: 'David Kim',
    initials: 'DK',
    role: 'standard',
    isCalendarConnected: true,
    lastActiveAt: '2026-04-24T08:55:00.000Z',
    createdAt: '2025-09-02T09:00:00.000Z',
    updatedAt: NOW,
  },
  {
    id: 'usr_joe',
    logtoId: 'logto_joe',
    email: 'jgrace@graceandassociates.com',
    name: 'Joe Grace',
    initials: 'JG',
    role: 'admin',
    isCalendarConnected: true,
    lastActiveAt: '2026-04-22T17:30:00.000Z',
    createdAt: '2025-05-01T09:00:00.000Z',
    updatedAt: NOW,
  },
  {
    id: 'usr_penny',
    logtoId: 'logto_penny',
    email: 'pnechanicky@graceandassociates.com',
    name: 'Penny Nechanicky',
    initials: 'PN',
    role: 'standard',
    isCalendarConnected: true,
    lastActiveAt: '2026-04-24T10:05:00.000Z',
    createdAt: '2026-01-02T09:00:00.000Z',
    updatedAt: NOW,
  },
  {
    id: 'usr_john',
    logtoId: 'logto_john',
    email: 'jsmith@graceandassociates.com',
    name: 'John Smith',
    initials: 'JS',
    role: 'viewer',
    isCalendarConnected: false,
    lastActiveAt: '2026-04-21T14:00:00.000Z',
    createdAt: '2025-10-10T09:00:00.000Z',
    updatedAt: NOW,
  },
];

export function getUserById(id: string): User | undefined {
  return MOCK_USERS.find((u) => u.id === id);
}

export function getUserInitials(id: string | null): string {
  if (id === null) return '—';
  return getUserById(id)?.initials ?? '—';
}

export function getUserName(id: string | null): string {
  if (id === null) return 'Unassigned';
  return getUserById(id)?.name ?? 'Unknown';
}
