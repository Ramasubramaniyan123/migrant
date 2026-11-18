import { useState } from 'react'

export const asArray = (data) => {
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.items)) return data.items
  if (data && Array.isArray(data.content)) return data.content
  return []
}
import { LoadingState, ErrorState, EmptyState } from '../../../components/ui/States'

export const AdminHeader = ({ title, description, actions }) => (
  <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h1 className="font-display text-2xl font-bold">{title}</h1>
      {description && <p className="mt-1 text-sm text-ink-2">{description}</p>}
    </div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </header>
)

export const StatusBadge = ({ status }) => {
  const s = String(status || 'unknown').toUpperCase()
  const good = ['ACTIVE', 'RESOLVED', 'VERIFIED', 'ACCEPTED', 'APPROVED', 'COMPLETED', 'SENT']
  const bad = ['SUSPENDED', 'DEACTIVATED', 'DISMISSED', 'REJECTED', 'CANCELLED', 'BLOCKED', 'FAILED']
  const warn = ['PENDING', 'UNDER_REVIEW', 'PENDING_VERIFICATION']
  const cls = good.includes(s) ? 'bg-success/10 text-success'
    : bad.includes(s) ? 'bg-danger/10 text-danger'
    : warn.includes(s) ? 'bg-warning/10 text-warning'
    : 'bg-surface-alt text-ink-2'
  return <span className={`badge ${cls}`}>{s.replace(/_/g, ' ')}</span>
}

export const AdminTable = ({ columns, rows, loading, error, onRetry, emptyTitle = 'Nothing to show', emptyDescription, actions }) => {
  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} onRetry={onRetry} />
  if (!rows || rows.length === 0) return <EmptyState title={emptyTitle} description={emptyDescription} />
  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-3">
            {columns.map((c) => <th key={c.key} className="px-4 py-3 font-medium">{c.label}</th>)}
            {actions && <th className="px-4 py-3 font-medium text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row, i) => (
            <tr key={row.id ?? i} className="hover:bg-hover/50">
              {columns.map((c) => <td key={c.key} className="px-4 py-3">{c.render ? c.render(row) : row[c.key]}</td>)}
              {actions && <td className="px-4 py-3 text-right">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const Pagination = ({ page, totalPages, onPage }) => {
  if (!totalPages || totalPages <= 1) return null
  return (
    <div className="mt-4 flex items-center justify-center gap-3">
      <button type="button" className="btn-outline btn-sm" disabled={page <= 0} onClick={() => onPage(page - 1)}>Previous</button>
      <span className="text-sm text-ink-2">Page {page + 1} of {totalPages}</span>
      <button type="button" className="btn-outline btn-sm" disabled={page >= totalPages - 1} onClick={() => onPage(page + 1)}>Next</button>
    </div>
  )
}

export const ConfirmButton = ({ label, confirmText, onConfirm, className = 'btn-outline btn-sm', disabled }) => {
  const [open, setOpen] = useState(false)
  if (!open) {
    return <button type="button" className={className} disabled={disabled} onClick={() => setOpen(true)}>{label}</button>
  }
  return (
    <span className="inline-flex items-center gap-2">
      <button type="button" className="btn-danger btn-sm" onClick={() => { setOpen(false); onConfirm() }}>Confirm</button>
      <button type="button" className="btn-ghost btn-sm" onClick={() => setOpen(false)}>Cancel</button>
    </span>
  )
}

export const StatCard = ({ label, value }) => (
  <div className="card p-5">
    <p className="font-display text-3xl font-bold">{value ?? '—'}</p>
    <p className="mt-1 text-xs text-ink-2">{label}</p>
  </div>
)
