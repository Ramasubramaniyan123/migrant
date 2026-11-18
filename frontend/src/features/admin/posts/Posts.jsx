import { useEffect, useState, useCallback } from 'react'
import { adminPostService, adminCommunityService } from '../../../services/admin/adminService'
import { errorMessage } from '../../../services/api/apiClient'
import { AdminHeader, AdminTable, StatusBadge, ConfirmButton, asArray } from '../components/AdminUI'
import { formatDateTime } from '../../../utils/format'

export const Posts = () => {
  const [posts, setPosts] = useState([])
  const [communities, setCommunities] = useState([])
  const [communityId, setCommunityId] = useState('')
  const [flaggedOnly, setFlaggedOnly] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = flaggedOnly
        ? await adminPostService.flagged()
        : await adminPostService.list(communityId || undefined)
      setPosts(asArray(data))
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [communityId, flaggedOnly])

  useEffect(() => { load() }, [load])
  useEffect(() => {
    adminCommunityService.list({ page: 1, pageSize: 100 })
      .then((r) => setCommunities(r.items || []))
      .catch(() => {})
  }, [])

  const remove = async (id) => {
    try { await adminPostService.remove(id); load() } catch (e) { setError(errorMessage(e)) }
  }

  return (
    <div>
      <AdminHeader title="Post moderation" description="Review and remove user posts across communities." />
      <div className="mb-4 flex flex-wrap gap-2">
        <select className="input max-w-[220px]" value={communityId} onChange={(e) => setCommunityId(e.target.value)}>
          <option value="">All communities</option>
          {communities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button
          type="button"
          className={`btn-sm ${flaggedOnly ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFlaggedOnly((v) => !v)}
        >
          Flagged only
        </button>
      </div>
      <AdminTable
        rows={posts}
        loading={loading} error={error} onRetry={load}
        emptyTitle="No posts found" emptyDescription="No posts match the current filters."
        columns={[
          { key: 'content', label: 'Post', render: (p) => (
            <span className="block max-w-md">
              <span className="line-clamp-2">{p.content || '(no text)'}</span>
              {p.imageUrl && <span className="text-xs text-ink-3">Has image</span>}
            </span>
          )},
          { key: 'author', label: 'Author', render: (p) => p.authorName || '—' },
          { key: 'community', label: 'Community', render: (p) => p.communityName || '—' },
          { key: 'likes', label: 'Likes', render: (p) => p.likeCount ?? 0 },
          { key: 'comments', label: 'Comments', render: (p) => p.commentCount ?? 0 },
          { key: 'flagged', label: 'Flagged', render: (p) => p.isFlagged ? <StatusBadge status="PENDING" /> : '—' },
          { key: 'created', label: 'Created', render: (p) => formatDateTime(p.createdAt) },
        ]}
        actions={(p) => (
          <ConfirmButton label="Delete" className="btn-outline btn-sm text-danger" onConfirm={() => remove(p.id)} />
        )}
      />
    </div>
  )
}
