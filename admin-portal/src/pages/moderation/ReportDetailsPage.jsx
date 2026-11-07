import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, UserCheck, CheckCircle2, XCircle, Ban } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { Textarea } from '@/components/common/Input';
import Loader from '@/components/common/Loader';
import StatusBadge, { statusTone, statusLabel } from '@/components/common/StatusBadge';
import { moderationService } from '@/services/moderationService';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { ADMIN_ROUTES } from '@/utils/constants';
import { formatDateTime } from '@/utils/formatters';

const PRIORITY_TONE = { CRITICAL: 'red', HIGH: 'amber', MEDIUM: 'blue', LOW: 'gray' };

export default function ReportDetailsPage() {
  const { id } = useParams();
  const { admin } = useAdminAuth();
  const [report, setReport] = useState(null);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [busy, setBusy] = useState(null);

  const [resolveOpen, setResolveOpen] = useState(false);
  const [dismissOpen, setDismissOpen] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [resolution, setResolution] = useState('');
  const [reason, setReason] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [r, acts] = await Promise.all([
        moderationService.getReport(id),
        moderationService.listModerationActions()
      ]);
      setReport(r);
      setActions(acts.filter(a => a.reportId === id));
    } catch (err) {
      setError(err.message || 'Failed to load report');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const runAction = async (key, fn) => {
    setBusy(key);
    setActionError(null);
    try {
      await fn();
      setResolveOpen(false);
      setDismissOpen(false);
      setSuspendOpen(false);
      setResolution('');
      setReason('');
      await load();
    } catch (err) {
      setActionError(err.message || 'Action failed');
    } finally {
      setBusy(null);
    }
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Report details" />
        <Loader label="Loading report…" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div>
        <PageHeader title="Report details" />
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error || 'Report not found'}
        </div>
        <Link to={ADMIN_ROUTES.reports} className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-700">
          ← Back to reports
        </Link>
      </div>
    );
  }

  const isClosed = report.status === 'RESOLVED' || report.status === 'DISMISSED';
  const adminId = admin?.id ?? 'unknown';
  const adminName = admin?.name ?? 'Admin';

  return (
    <div>
      <PageHeader
        title={`Report ${report.id}`}
        description={`Filed ${formatDateTime(report.createdAt)} against a ${statusLabel(report.targetType).toLowerCase()}`}
        breadcrumbs={[
          { label: 'Moderation', to: ADMIN_ROUTES.moderation },
          { label: 'Reports', to: ADMIN_ROUTES.reports },
          { label: report.id }
        ]}
        actions={
          <Link to={ADMIN_ROUTES.reports}>
            <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Back
            </Button>
          </Link>
        }
      />

      {actionError ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Report details</h2>
            <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Category</dt>
                <dd className="mt-1 text-sm text-slate-800 dark:text-slate-200">{statusLabel(report.category)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Priority</dt>
                <dd className="mt-1">
                  <StatusBadge tone={PRIORITY_TONE[report.priority] ?? 'gray'} dot>
                    {statusLabel(report.priority)}
                  </StatusBadge>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Status</dt>
                <dd className="mt-1">
                  <StatusBadge tone={statusTone(report.status)} dot>
                    {statusLabel(report.status)}
                  </StatusBadge>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Reporter</dt>
                <dd className="mt-1 text-sm text-slate-800 dark:text-slate-200">{report.reporterName}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Target type</dt>
                <dd className="mt-1 text-sm text-slate-800 dark:text-slate-200">{statusLabel(report.targetType)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Assigned to</dt>
                <dd className="mt-1 text-sm text-slate-800 dark:text-slate-200">{report.assignedTo ?? 'Unassigned'}</dd>
              </div>
            </dl>
            <div className="mt-5">
              <h3 className="text-xs font-medium uppercase tracking-wide text-slate-400">Description</h3>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{report.description}</p>
            </div>
            {report.reporterHistory ? (
              <div className="mt-5 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/60">
                <h3 className="text-xs font-medium uppercase tracking-wide text-slate-400">Reporter history</h3>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                  {report.reporterHistory.totalReports} total report{report.reporterHistory.totalReports === 1 ? '' : 's'} filed ·{' '}
                  {report.reporterHistory.priorResolved} previously resolved
                </p>
              </div>
            ) : null}
          </div>

          <div className="card p-5">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Reported content</h2>
            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {statusLabel(report.targetType)} · {report.targetId}
              </p>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                {report.targetContent ?? report.targetPreview}
              </p>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Moderation history</h2>
            {actions.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">No moderation actions recorded for this report yet.</p>
            ) : (
              <ul className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
                {actions.map(a => (
                  <li key={a.id} className="flex items-start justify-between gap-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {statusLabel(a.action)}
                        <span className="ml-2 font-normal text-slate-500">by {a.adminName}</span>
                      </p>
                      {a.reason ? <p className="mt-0.5 text-xs text-slate-500">{a.reason}</p> : null}
                    </div>
                    <span className="shrink-0 text-xs text-slate-400">{formatDateTime(a.createdAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div>
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Actions</h2>
            <p className="mt-1 text-xs text-slate-500">
              {isClosed ? 'This report has been closed.' : 'Choose how to handle this report.'}
            </p>
            <div className="mt-4 space-y-3">
              {!isClosed ? (
                <>
                  <Button
                    variant="secondary"
                    fullWidth
                    leftIcon={<UserCheck className="h-4 w-4" />}
                    onClick={() =>
                      runAction('assign', () =>
                        moderationService.assignReport(id, adminId, adminName)
                      )
                    }
                    isLoading={busy === 'assign'}
                    disabled={!admin}
                  >
                    Assign to me
                  </Button>
                  <Button
                    fullWidth
                    leftIcon={<CheckCircle2 className="h-4 w-4" />}
                    onClick={() => setResolveOpen(true)}
                  >
                    Resolve report
                  </Button>
                  <Button
                    variant="secondary"
                    fullWidth
                    leftIcon={<XCircle className="h-4 w-4" />}
                    onClick={() => setDismissOpen(true)}
                  >
                    Dismiss report
                  </Button>
                  {report.targetType === 'USER' ? (
                    <Button
                      variant="danger"
                      fullWidth
                      leftIcon={<Ban className="h-4 w-4" />}
                      onClick={() => setSuspendOpen(true)}
                    >
                      Suspend user
                    </Button>
                  ) : null}
                </>
              ) : (
                <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                  {report.resolution ? `Resolution: ${report.resolution}` : 'No further action needed.'}
                </div>
              )}
            </div>
          </div>

          {report.resolvedAt ? (
            <div className="card mt-4 p-5">
              <h3 className="text-xs font-medium uppercase tracking-wide text-slate-400">Timestamps</h3>
              <dl className="mt-2 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Created</dt>
                  <dd className="text-slate-800 dark:text-slate-200">{formatDateTime(report.createdAt)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Resolved</dt>
                  <dd className="text-slate-800 dark:text-slate-200">{formatDateTime(report.resolvedAt)}</dd>
                </div>
              </dl>
            </div>
          ) : null}
        </div>
      </div>

      <Modal
        open={resolveOpen}
        onClose={() => setResolveOpen(false)}
        title="Resolve report"
        description="Describe the action taken to resolve this report."
        footer={
          <>
            <Button variant="secondary" onClick={() => setResolveOpen(false)}>Cancel</Button>
            <Button
              isLoading={busy === 'resolve'}
              disabled={!resolution.trim()}
              onClick={() =>
                runAction('resolve', () =>
                  moderationService.resolveReport(id, resolution.trim(), adminId, adminName)
                )
              }
            >
              Resolve
            </Button>
          </>
        }
      >
        <Textarea
          label="Resolution"
          value={resolution}
          onChange={e => setResolution(e.target.value)}
          placeholder="e.g. Content removed and user warned"
        />
      </Modal>

      <Modal
        open={dismissOpen}
        onClose={() => setDismissOpen(false)}
        title="Dismiss report"
        description="Explain why this report does not require action."
        footer={
          <>
            <Button variant="secondary" onClick={() => setDismissOpen(false)}>Cancel</Button>
            <Button
              variant="secondary"
              isLoading={busy === 'dismiss'}
              disabled={!reason.trim()}
              onClick={() =>
                runAction('dismiss', () =>
                  moderationService.dismissReport(id, reason.trim(), adminId, adminName)
                )
              }
            >
              Dismiss
            </Button>
          </>
        }
      >
        <Textarea
          label="Reason for dismissal"
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="e.g. Reviewed — no policy violation found"
        />
      </Modal>

      <Modal
        open={suspendOpen}
        onClose={() => setSuspendOpen(false)}
        title="Suspend user"
        description={`Suspend ${report.targetPreview}? This records a moderation action against the reported user.`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setSuspendOpen(false)}>Cancel</Button>
            <Button
              variant="danger"
              isLoading={busy === 'suspend'}
              disabled={!reason.trim()}
              onClick={() =>
                runAction('suspend', () =>
                  moderationService.suspendUserForReport(id, reason.trim(), adminId, adminName)
                )
              }
            >
              Suspend user
            </Button>
          </>
        }
      >
        <Textarea
          label="Suspension reason"
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="e.g. Repeated harassment reports"
        />
      </Modal>
    </div>
  );
}
