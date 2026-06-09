/**
 * Row mappers for client-detail extras — convert raw Supabase rows (snake_case)
 * to the camelCase domain types in `@gracie/shared`. Keeps the DB↔domain
 * boundary explicit, mirroring lib/mappers.ts (the clients template).
 */
import type { Database } from '@gracie/db';
import type { ClientNote, MasterRecordEntry } from '@gracie/shared';

type ClientNoteRow = Database['public']['Tables']['client_notes']['Row'];
type MasterRecordEntryRow =
  Database['public']['Tables']['master_record_entries']['Row'];

export function mapClientNote(row: ClientNoteRow): ClientNote {
  return {
    id: row.id,
    clientId: row.client_id,
    authorUserId: row.author_user_id,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapMasterRecordEntry(row: MasterRecordEntryRow): MasterRecordEntry {
  return {
    id: row.id,
    clientId: row.client_id,
    meetingId: row.meeting_id,
    summary: row.summary,
    createdAt: row.created_at,
  };
}
