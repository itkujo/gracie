/**
 * Row mappers for tasks — convert raw Supabase rows (snake_case) to the
 * camelCase domain types in `@gracie/shared`. Keeps the DB↔domain boundary
 * explicit, mirroring lib/mappers.ts (the clients template).
 *
 * `daysOverdue` is computed at render time (due_date vs now), never stored, so
 * it is intentionally absent from the Task row type and this mapper.
 */
import type { Database } from '@gracie/db';
import type { Task, TaskNote } from '@gracie/shared';

type TaskRow = Database['public']['Tables']['tasks']['Row'];
type TaskNoteRow = Database['public']['Tables']['task_notes']['Row'];

export function mapTask(row: TaskRow): Task {
  return {
    id: row.id,
    clientId: row.client_id,
    sourceMeetingId: row.source_meeting_id,
    sourceDocumentId: row.source_document_id,
    description: row.description,
    ownerUserId: row.owner_user_id,
    dueDate: row.due_date,
    status: row.status,
    hasPriorityFlag: row.priority_flag,
    isArchived: row.archived,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapTaskNote(row: TaskNoteRow): TaskNote {
  return {
    id: row.id,
    taskId: row.task_id,
    authorUserId: row.author_user_id,
    content: row.content,
    createdAt: row.created_at,
  };
}
