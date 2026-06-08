/**
 * MOCK DATA barrel — single import surface for UI built ahead of Phase 1B.
 *
 * ⚠️ ALL data here is MOCK and deterministic. Every export is replaced by real
 * API calls when integrations are wired in Phase 1B. UI should import selectors
 * from here (not the individual files) so the swap to real data is a one-spot change.
 */
export * from './users.js';
export * from './clients.js';
export * from './tasks.js';
export * from './documents.js';
export * from './meetings.js';
export * from './notes.js';
