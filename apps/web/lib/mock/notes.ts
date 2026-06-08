/**
 * MOCK DATA — client notes + master-record entries. Replaced by real API in Phase 1B.
 * Deterministic.
 */
import type { ClientNote, MasterRecordEntry } from '@gracie/shared';

export const MOCK_CLIENT_NOTES: readonly ClientNote[] = [
  {
    id: 'cnote_1',
    clientId: 'cli_cms',
    authorUserId: 'usr_allie',
    content:
      'CMS is our flagship account this quarter. Dr. Reyes responds best to data-backed recommendations — keep summaries metrics-forward.',
    createdAt: '2026-04-23T10:00:00.000Z',
    updatedAt: '2026-04-23T10:00:00.000Z',
  },
  {
    id: 'cnote_2',
    clientId: 'cli_cms',
    authorUserId: 'usr_sarah',
    content: 'Dashboard wireframes are with the client; expecting feedback by Friday.',
    createdAt: '2026-04-23T14:30:00.000Z',
    updatedAt: '2026-04-23T14:30:00.000Z',
  },
  {
    id: 'cnote_3',
    clientId: 'cli_hhs',
    authorUserId: 'usr_david',
    content:
      'Relationship cooling — last two meetings ran short and decisions keep slipping. Recommend an exec check-in.',
    createdAt: '2026-04-21T09:00:00.000Z',
    updatedAt: '2026-04-21T09:00:00.000Z',
  },
  {
    id: 'cnote_4',
    clientId: 'cli_va2',
    authorUserId: 'usr_michael',
    content: 'Claims backlog is a sensitive topic with leadership; frame progress carefully.',
    createdAt: '2026-04-19T18:00:00.000Z',
    updatedAt: '2026-04-19T18:00:00.000Z',
  },
];

export const MOCK_MASTER_RECORD: readonly MasterRecordEntry[] = [
  {
    id: 'mr_1',
    clientId: 'cli_cms',
    meetingId: 'mtg_1',
    summary:
      'Q2 dashboard review: agreed on KPI hierarchy, approved cloud migration of SAS job batch 1, flagged data-refresh latency for follow-up.',
    createdAt: '2026-04-22T15:45:00.000Z',
  },
  {
    id: 'mr_2',
    clientId: 'cli_cms',
    meetingId: null,
    summary:
      'Capability deck delivered; client expressed interest in expanding scope to Medicaid analytics in Q3.',
    createdAt: '2026-04-10T11:30:00.000Z',
  },
  {
    id: 'mr_3',
    clientId: 'cli_hhs',
    meetingId: 'mtg_3',
    summary:
      'API gateway planning: authentication design unresolved; FHIR identity mapping conflicts identified as primary blocker.',
    createdAt: '2026-04-20T16:45:00.000Z',
  },
];

export function getClientNotesByClient(clientId: string): readonly ClientNote[] {
  return MOCK_CLIENT_NOTES.filter((n) => n.clientId === clientId);
}

export function getMasterRecordByClient(clientId: string): readonly MasterRecordEntry[] {
  return MOCK_MASTER_RECORD.filter((e) => e.clientId === clientId);
}
