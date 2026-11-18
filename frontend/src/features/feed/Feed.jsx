import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ImagePlus, X } from 'lucide-react'
import { postService } from '../../services/posts/postService'
import { uploadService } from '../../services/uploads/uploadService'
import { communityService } from '../../services/communities/communityService'
import { useAuth } from '../../contexts'
import { errorMessage } from '../../services/api/apiClient'
import { PostCard } from '../posts/PostCard'
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/States'
import { PageHeader } from '../../components/ui/PageHeader'

export const Feed = () => {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const [posts, setPosts] = useState([])
  const [communities, setCommunities] = useState([])
  const [communityId, setCommunityId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const [composer, setComposer] = useState({ communityId: '', content: '', imageUrl: '' })
  const [imageFiles, setImageFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [posting, setPosting] = useState(false)
  const [postError, setPostError] = useState('')

  const load = useCallback(async (p = page, cid = communityId) => {
    setLoading(true)
    setError('')
    try {
      const result = await postService.feed({ communityId: cid || undefined, page: p, size: 10 })
      setPosts(result.items || [])
      setTotalPages(result.totalPages || 1)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [page, communityId])

  // Deep-link support: /app/feed?community={id} preselects the filter.
  useEffect(() => {
    const cid = searchParams.get('community')
    if (cid) {
      setCommunityId(cid)
      load(0, cid)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  useEffect(() => {
    load(0, '')
    communityService.mine({ size: 50 })
      .then((r) => setCommunities(r.items || []))
      .catch(() => setCommunities([]))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const submitPost = async (e) => {
    e.preventDefault()
    if (!composer.communityId || !composer.content.trim()) return
    setPosting(true)
    setUploading(true)
    setPostError('')
    try {
      const imageUrls = []
      for (const file of imageFiles) {
        const res = await uploadService.upload(file)
        if (res?.filename) imageUrls.push(uploadService.fileUrl(res.filename))
      }
      await postService.create({
        communityId: Number(composer.communityId),
        content: composer.content.trim(),
        imageUrl: composer.imageUrl || imageUrls[0] || undefined,
        imageUrls: imageUrls.length ? imageUrls : undefined,
      })
      setComposer({ communityId: composer.communityId, content: '', imageUrl: '' })
      setImageFiles([])
      load(0, communityId)
    } catch (err) {
      setPostError(errorMessage(err))
    } finally {
      setPosting(false)
      setUploading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Feed" description="Latest posts from your communities." />

      {communities.length > 0 && (
        <form onSubmit={submitPost} className="card mb-6 space-y-3 p-4">
          <select
            className="input"
            value={composer.communityId}
            onChange={(e) => setComposer((c) => ({ ...c, communityId: e.target.value }))}
            aria-label="Community"
            required
          >
            <option value="">Choose a community…</option>
            {communities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <textarea
            className="input min-h-[80px] resize-y"
            placeholder="Share something with your community…"
            value={composer.content}
            onChange={(e) => setComposer((c) => ({ ...c, content: e.target.value }))}
            maxLength={5000}
            required
          />
          <div>
            <label htmlFor="post-image-url" className="label">Image URL (optional)</label>
            <input
              id="post-image-url"
              className="input"
              placeholder="https://…"
              value={composer.imageUrl}
              onChange={(e) => setComposer((c) => ({ ...c, imageUrl: e.target.value }))}
            />
          </div>
          <div>
            <span className="label">Or upload images</span>
            <label className="btn-outline btn-sm cursor-pointer">
              <ImagePlus className="h-4 w-4" /> {uploading ? 'Uploading…' : 'Choose files'}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled={uploading}
                onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
              />
            </label>
            {imageFiles.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-2">
                {imageFiles.map((f, i) => (
                  <li key={i} className="badge flex items-center gap-1 bg-surface-alt text-ink-2">
                    {f.name}
                    <button type="button" onClick={() => setImageFiles((p) => p.filter((_, j) => j !== i))} aria-label={`Remove ${f.name}`}>
                      <X className="h-3 w-3" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {postError && <p className="text-sm text-danger" role="alert">{postError}</p>}
          <button type="submit" className="btn-accent btn-sm" disabled={posting || !composer.communityId || !composer.content.trim()}>
            {posting ? 'Posting…' : uploading ? 'Uploading images…' : 'Post'}
          </button>
        </form>
      )}

      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="feed-filter" className="text-sm text-ink-2">Filter:</label>
        <select
          id="feed-filter"
          className="input max-w-xs"
          value={communityId}
          onChange={(e) => { setCommunityId(e.target.value); setPage(0); load(0, e.target.value) }}
        >
          <option value="">All communities</option>
          {communities.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={() => load()} />
      ) : posts.length === 0 ? (
        <EmptyState title="No posts yet" description="Posts from communities you belong to will appear here." />
      ) : (
        <div className="space-y-4">
          {posts.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              currentUserId={user?.id}
              onChanged={() => load(page, communityId)}
              onDeleted={() => load(page, communityId)}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button type="button" className="btn-outline btn-sm" disabled={page === 0} onClick={() => { setPage(page - 1); load(page - 1) }}>Previous</button>
          <span className="text-sm text-ink-2">Page {page + 1} of {totalPages}</span>
          <button type="button" className="btn-outline btn-sm" disabled={page >= totalPages - 1} onClick={() => { setPage(page + 1); load(page + 1) }}>Next</button>
        </div>
      )}
    </div>
  )
}
