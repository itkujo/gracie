'use client';

import { use, useEffect, useState } from 'react';
import { Lock } from 'lucide-react';
import type { Client, Task } from '@gracie/shared';

import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/lib/auth';
import { TYPE } from '@/lib/typography';
import { feeTierDisplay, formatUsd } from '@/lib/client-display';
import { Card, CardHeader } from '@/components/ui/Card';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/StateViews';

/**
 * Client tab 3 — Finance (docs/08 §9). ADMIN-ONLY. The tab is hidden from the
 * tab nav for non-admins (client layout); this guard is defense-in-depth so a
 * direct URL visit still yields no finance content (mirrors the server 403,
 * D14). Data via `GET /api/clients/:id/finance` (admin-only; returns 403
 * otherwise) plus the operations tasks for the completion-rate panel.
 * Admin-only fields are marked with a 🔒 (docs/08 §1).
 */
interface FinanceResponse {
  readonly client: Client;
}

interface OperationsResponse {
  readonly tasks: readonly Task[];
}

export default function ClientFinancePage({
  params,
}: {
  readonly params: Promise<{ clientId: string }>;
}): React.JSX.Element {
  const { clientId } = use(params);
  const { can } = useAuth();
  const canViewFinance = can('finance.view');

  const [client, setClient] = useState<Client | null>(null);
  const [tasks, setTasks] = useState<readonly Task[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canViewFinance) return;
    let active = true;
    Promise.all([
      apiClient.get<FinanceResponse>(`/api/clients/${clientId}/finance`),
      apiClient.get<OperationsResponse>(`/api/clients/${clientId}/operations`),
    ])
      .then(([finance, operations]) => {
        if (!active) return;
        setClient(finance.client);
        setTasks(operations.tasks);
      })
      .catch((e: unknown) => {
        if (active) setError(e instanceof Error ? e.message : 'Failed to load finance');
      });
    return (): void => {
      active = false;
    };
  }, [clientId, canViewFinance]);

  if (!canViewFinance) {
    return (
      <ErrorState
        title="Access restricted"
        description="Financial details for this client are available to administrators only."
      />
    );
  }

  if (error !== null) {
    return <ErrorState title="Couldn’t load finance" description={error} />;
  }

  if (client === null || tasks === null) {
    return <LoadingState label="Loading finance…" />;
  }

  const activeTasks = tasks.filter((task) => !task.isArchived);
  const completedCount = activeTasks.filter((task) => task.status === 'complete').length;
  const completionRate =
    activeTasks.length === 0 ? 0 : Math.round((completedCount / activeTasks.length) * 100);
  const fee = feeTierDisplay(client.feeTier);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card>
          <p style={{ ...TYPE.label, color: 'var(--text-secondary)' }}>Fee Tier</p>
          {fee !== null ? (
            <p className="mt-2 flex items-center gap-2" style={{ ...TYPE.sectionHeader, color: fee.color }}>
              <span aria-hidden="true">{fee.dot}</span>
              {fee.label}
            </p>
          ) : (
            <p className="mt-2" style={{ ...TYPE.secondary, color: 'var(--text-secondary)' }}>
              Not set
            </p>
          )}
        </Card>

        <Card accent="admin">
          <p className="flex items-center gap-1.5" style={{ ...TYPE.label, color: 'var(--text-secondary)' }}>
            <Lock aria-hidden="true" size={12} />
            Contract Value
          </p>
          <p className="mt-2" style={TYPE.sectionHeader}>
            {formatUsd(client.contractValue)}
          </p>
        </Card>

        <Card accent="admin">
          <p className="flex items-center gap-1.5" style={{ ...TYPE.label, color: 'var(--text-secondary)' }}>
            <Lock aria-hidden="true" size={12} />
            Billing Cadence
          </p>
          <p className="mt-2" style={TYPE.sectionHeader}>
            {client.billingCadence ?? 'Not set'}
          </p>
        </Card>
      </div>

      {/* Task completion rate */}
      <Card>
        <CardHeader
          title="Task Completion Rate"
          description="Completed vs. total active tasks for this client."
        />
        {activeTasks.length === 0 ? (
          <EmptyState
            title="No tasks to measure"
            description="Completion rate will appear once tasks exist for this client."
          />
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <span style={{ ...TYPE.sectionHeader, color: 'var(--color-emerald-600)' }}>
                {completionRate}%
              </span>
              <span style={{ ...TYPE.secondary, color: 'var(--text-secondary)' }}>
                {completedCount} of {activeTasks.length} tasks complete
              </span>
            </div>
            <div
              className="h-2 w-full overflow-hidden rounded-full"
              role="progressbar"
              aria-valuenow={completionRate}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Task completion rate"
              style={{ backgroundColor: 'var(--color-slate-100)' }}
            >
              <div
                className="h-full rounded-full"
                style={{ width: `${completionRate}%`, backgroundColor: 'var(--color-emerald-500)' }}
              />
            </div>
          </div>
        )}
      </Card>

      {/* Time vs revenue */}
      <Card>
        <CardHeader
          title="Time vs. Revenue"
          description="Effort-to-revenue comparison for this engagement."
        />
        <EmptyState
          title="Time tracking not connected"
          description="Logged hours are not yet captured in Phase 2. This panel will compare tracked time against contract revenue once time entries are available."
        />
      </Card>
    </div>
  );
}
