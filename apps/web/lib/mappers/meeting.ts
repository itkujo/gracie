/**
 * Row mapper for meetings — converts raw Supabase rows (snake_case) to the
 * camelCase `Meeting` domain type in `@gracie/shared`. Keeps the DB↔domain
 * boundary explicit, mirroring lib/mappers.ts (the clients template).
 */
import type { Database } from '@gracie/db';
import type { Meeting } from '@gracie/shared';

type MeetingRow = Database['public']['Tables']['meetings']['Row'];

export function mapMeeting(row: MeetingRow): Meeting {
  return {
    id: row.id,
    clientId: row.client_id,
    title: row.title,
    dateTime: row.date_time,
    durationMinutes: row.duration_minutes,
    meetingType: row.meeting_type,
    meetingLeadUserId: row.meeting_lead_user_id,
    attendeeUserIds: row.attendee_user_ids,
    calendarEventId: row.calendar_event_id,
    videoLink: row.video_link,
    isBotDispatched: row.bot_dispatched,
    botJobId: row.bot_job_id,
    isTranscriptReceived: row.transcript_received,
    pipelineStatus: row.pipeline_status,
    pipelineStartedAt: row.pipeline_started_at,
    pipelineCompletedAt: row.pipeline_completed_at,
    hasOpenItems: row.has_open_items,
    source: row.source,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
