/**
 * GET /api/clients/:clientId/notes — Notes tab data.
 *
 * Returns the client's notes (newest first) with their author ids. Author
 * name/initials resolution is a display concern handled in the UI (users module
 * is not wired yet). Auth resolves to the mock user via getRequestUser().
 */
import { NextResponse } from 'next/server';

import { getClientDetail, getClientNotes } from '@/lib/data/client-detail';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ clientId: string }> },
): Promise<NextResponse> {
  try {
    const { clientId } = await params;
    const client = await getClientDetail(clientId);
    if (client === null) {
      return NextResponse.json(
        { error: { code: 'client_not_found', message: 'Client not found' } },
        { status: 404 },
      );
    }
    const notes = await getClientNotes(clientId);
    return NextResponse.json({ notes });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: { code: 'client_notes_failed', message } },
      { status: 500 },
    );
  }
}
