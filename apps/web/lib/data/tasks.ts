/**
 * Server-side data access for tasks + task notes (Phase 1B).
 *
 * Uses the service-role Supabase client (bypasses RLS); permission enforcement
 * is the API layer's job (docs/02 §D14). Runs only on the server — never import
 * this into a client component. Mirrors lib/data/clients.ts.
 */
import 'server-only';

import { getServerClient } from '@gracie/db';
import type { Task, TaskNote } from '@gracie/shared';

import { mapTask, mapTaskNote } from '../mappers/task.js';

interface ListTasksOptions {
  readonly includeArchived?: boolean;
}

/**
 * List tasks ordered by due date (asc, nulls last). Archived tasks are excluded
 * by default; pass `{ includeArchived: true }` to include them (M6 toggle).
 */
export async function listTasks(opts?: ListTasksOptions): Promise<Task[]> {
  const db = getServerClient();
  let query = db
    .from('tasks')
    .select('*')
    .order('due_date', { ascending: true, nullsFirst: false });
  if (opts?.includeArchived !== true) {
    query = query.eq('archived', false);
  }
  const { data, error } = await query;
  if (error) throw new Error(`listTasks: ${error.message}`);
  return (data ?? []).map(mapTask);
}

/** List all tasks for a single client, ordered by due date (asc, nulls last). */
export async function getTasksByClient(clientId: string): Promise<Task[]> {
  const db = getServerClient();
  const { data, error } = await db
    .from('tasks')
    .select('*')
    .eq('client_id', clientId)
    .order('due_date', { ascending: true, nullsFirst: false });
  if (error) throw new Error(`getTasksByClient: ${error.message}`);
  return (data ?? []).map(mapTask);
}

/** List the append-only note feed for a task, oldest first. */
export async function getTaskNotes(taskId: string): Promise<TaskNote[]> {
  const db = getServerClient();
  const { data, error } = await db
    .from('task_notes')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: true });
  if (error) throw new Error(`getTaskNotes: ${error.message}`);
  return (data ?? []).map(mapTaskNote);
}
