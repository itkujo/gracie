'use client';

import { use, useEffect, useState } from 'react';
import type { ClientNote } from '@gracie/shared';

import { getUserInitials, getUserName } from '@/lib/mock';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/lib/auth';
import { TYPE } from '@/lib/typography';
import { formatEasternDateTime } from '@/lib/format';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ClientAvatar } from '@/components/ClientAvatar';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/StateViews';

/**
 * Client tab 5 — Notes (docs/08 §9). Compose area (editors only) + chronological
 * feed (newest first) with author chip + timestamp. The compose Post action is
 * visual-only in Phase 2 (no persistence); it will wire to
 * `POST /api/clients/:id/notes` later. Notes load via `GET /api/clients/:id/notes`
 * (real Supabase data). User names/initials still resolve through the mock
 * display lookup (users module not yet wired).
 */
interface NotesResponse {
  readonly notes: readonly ClientNote[];
}

export default function ClientNotesPage({
  params,
}: {
  readonly params: Promise<{ clientId: string }>;
}): React.JSX.Element {
  const { clientId } = use(params);
  const { canEdit } = useAuth();
  const [draft, setDraft] = useState<string>('');

  const [notes, setNotes] = useState<readonly ClientNote[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    apiClient
      .get<NotesResponse>(`/api/clients/${clientId}/notes`)
      .then((result) => {
        if (active) setNotes(result.notes);
      })
      .catch((e: unknown) => {
        if (active) setError(e instanceof Error ? e.message : 'Failed to load notes');
      });
    return (): void => {
      active = false;
    };
  }, [clientId]);

  if (error !== null) {
    return <ErrorState title="Couldn’t load notes" description={error} />;
  }

  if (notes === null) {
    return <LoadingState label="Loading notes…" />;
  }

  return (
    <div className="flex flex-col gap-6">
      {canEdit() ? (
        <Card>
          <label htmlFor="note-compose" style={{ ...TYPE.label, color: 'var(--text-secondary)' }}>
            Add a note
          </label>
          <textarea
            id="note-compose"
            value={draft}
            onChange={(event): void => setDraft(event.target.value)}
            rows={3}
            placeholder="Share context about this client with the team…"
            className="mt-2 w-full resize-y rounded-lg border p-3"
            style={{ borderColor: 'var(--border-subtle)', ...TYPE.body }}
          />
          <div className="mt-3 flex justify-end">
            {/* Wires to POST /api/clients/:id/notes later. Visual-only now. */}
            <Button variant="primary" disabled={draft.trim() === ''}>
              Post note
            </Button>
          </div>
        </Card>
      ) : null}

      {notes.length === 0 ? (
        <EmptyState
          title="No notes yet"
          description="Notes shared about this client will appear here, newest first."
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {notes.map((note) => (
            <li key={note.id}>
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <ClientAvatar
                    initials={getUserInitials(note.authorUserId)}
                    size="sm"
                    color="var(--color-blue-700)"
                  />
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="flex flex-wrap items-baseline gap-2">
                      <span style={TYPE.bodyStrong}>{getUserName(note.authorUserId)}</span>
                      <span style={{ ...TYPE.secondary, color: 'var(--text-secondary)' }}>
                        {formatEasternDateTime(note.createdAt)}
                      </span>
                    </span>
                    <p style={TYPE.body}>{note.content}</p>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
