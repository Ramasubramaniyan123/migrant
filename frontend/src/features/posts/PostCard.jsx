import { useState, useEffect, useCallback } from 'react'
import { Heart, MessageCircle, Share2, Trash2, Flag, Send, X } from 'lucide-react'
import { postService } from '../../services/posts/postService'
import { moderationService } from '../../services/moderation/moderationService'
import { errorMessage } from '../../services/api/apiClient'
import { Avatar } from '../../components/ui/Avatar'
import { timeAgo } from '../../utils/format'

const REPORT_CATEGORIES = [
  'SPAM', 'HARASSMENT', 'HATE_SPEECH', 'INAPPROPRIATE_CONTENT', 'FAKE_PROFILE', 'PRIVACY_VIOLATION', 'OTHER',
]

export const PostCard = ({ post, currentUserId, onChanged, onDeleted }) => {
  const [liked, setLiked] = useState(post.likedByMe)
  const [likeCount, setLikeCount] = useState(post.likeCount ?? 0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editDraft, setEditDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [shared, setShared] = useState(false)

  useEffect(() => {
    setLiked(post.likedByMe)
    setLikeCount(post.likeCount ?? 0)
  }, [post.id, post.likedByMe, post.likeCount])

  // Scroll to and highlight when arriving via a shared #post-{id} link.
  useEffect(() => {
    if (window.location.hash === `#post-${post.id}`) {
      const el = document.getElementById(`post-${post.id}`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el?.classList.add('ring-2', 'ring-accent')
      const t = setTimeout(() => el?.classList.remove('ring-2', 'ring-accent'), 2500)
      return () => clearTimeout(t)
    }
    return undefined
  }, [post.id])

  const toggleLike = async () => {
    setBusy(true)
    setError('')
    try {
      if (liked) await postService.unreact(post.id)
      else await postService.react(post.id)
      setLiked(!liked)
      setLikeCount((c) => c + (liked ? -1 : 1))
      onChanged?.()
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    if (!window.confirm('Delete this post?')) return
    try {
      await postService.remove(post.id)
      onDeleted?.(post.id)
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  const saveEdit = async () => {
    const content = editDraft.trim()
    if (!content || saving) return
    setSaving(true)
    setError('')
    try {
      await postService.update(post.id, { content })
      setEditing(false)
      onChanged?.()
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const share = async () => {
    const url = `${window.location.origin}/app/feed#post-${post.id}`
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Community post', url })
      } else {
        await navigator.clipboard.writeText(url)
        setShared(true)
        setTimeout(() => setShared(false), 2000)
      }
    } catch {
      // User cancelled share sheet — ignore.
    }
  }

  const isOwn = String(post.authorId) === String(currentUserId)

  return (
    <article id={`post-${post.id}`} className="card scroll-mt-24 p-5">
      <header className="flex items-start gap-3">
        <Avatar name={post.authorName} src={post.authorAvatarUrl} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{post.authorName || 'Community member'}</p>
          <p className="text-xs text-ink-3">
            {post.communityName && <span>{post.communityName} · </span>}
            {post.createdAt ? timeAgo(post.createdAt) : ''}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {!isOwn && (
            <button
              type="button"
              onClick={() => setReportOpen(true)}
              className="rounded-lg p-1.5 text-ink-3 hover:bg-hover hover:text-danger"
              aria-label="Report post"
            >
              <Flag className="h-4 w-4" />
            </button>
          )}
          {isOwn && (
            <>
              <button
                type="button"
                onClick={() => { setEditDraft(post.content); setEditing((v) => !v) }}
                className="rounded-lg px-2 py-1.5 text-xs text-ink-3 hover:bg-hover hover:text-ink"
              >
                {editing ? 'Cancel' : 'Edit'}
              </button>
              <button type="button" onClick={remove} className="rounded-lg p-1.5 text-ink-3 hover:bg-hover hover:text-danger" aria-label="Delete post">
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </header>

      {editing ? (
        <div className="mt-3 space-y-2">
          <textarea
            className="input min-h-[80px] resize-y"
            value={editDraft}
            onChange={(e) => setEditDraft(e.target.value)}
            maxLength={5000}
            aria-label="Edit post"
          />
          <button type="button" className="btn-accent btn-sm" onClick={saveEdit} disabled={saving || !editDraft.trim()}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      ) : (
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">{post.content}</p>
      )}

      {(post.imageUrl || post.imageUrls?.length > 0) && (
        <img
          src={post.imageUrl || post.imageUrls[0]}
          alt="Post attachment"
          className="mt-4 max-h-96 w-full rounded-lg object-cover"
        />
      )}

      {error && <p className="mt-2 text-xs text-danger" role="alert">{error}</p>}

      <footer className="mt-4 flex items-center gap-1 border-t border-line pt-3">
        <button
          type="button"
          onClick={toggleLike}
          disabled={busy}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${
            liked ? 'text-danger' : 'text-ink-3 hover:bg-hover hover:text-ink'
          }`}
          aria-pressed={liked}
        >
          <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} /> {likeCount}
        </button>
        <button
          type="button"
          onClick={() => setCommentsOpen((o) => !o)}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${
            commentsOpen ? 'bg-hover text-ink' : 'text-ink-3 hover:bg-hover hover:text-ink'
          }`}
          aria-expanded={commentsOpen}
        >
          <MessageCircle className="h-4 w-4" /> {post.commentCount ?? 0}
        </button>
        <button
          type="button"
          onClick={share}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-ink-3 hover:bg-hover hover:text-ink"
          aria-label="Share post"
        >
          <Share2 className="h-4 w-4" /> {shared ? 'Link copied' : ''}
        </button>
      </footer>

      {commentsOpen && (
        <CommentsSection postId={post.id} currentUserId={currentUserId} onChanged={onChanged} />
      )}

      {reportOpen && (
        <ReportDialog postId={post.id} onClose={() => setReportOpen(false)} />
      )}
    </article>
  )
}

const CommentsSection = ({ postId, currentUserId, onChanged }) => {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)

  const load = useCallback(async () => {
    try {
      const page = await postService.comments(postId, { size: 50 })
      const items = page.items || []
      setComments([...items].reverse())
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [postId])

  useEffect(() => { load() }, [load])

  const submit = async (e) => {
    e.preventDefault()
    const content = draft.trim()
    if (!content || sending) return
    setSending(true)
    try {
      await postService.addComment({ postId, content })
      setDraft('')
      await load()
      onChanged?.()
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSending(false)
    }
  }

  const remove = async (commentId) => {
    try {
      await postService.deleteComment(commentId)
      setComments((prev) => prev.filter((c) => c.id !== commentId))
      onChanged?.()
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  return (
    <div className="mt-4 border-t border-line pt-4">
      {loading ? (
        <p className="py-3 text-center text-xs text-ink-3">Loading comments…</p>
      ) : (
        <ul className="space-y-3">
          {comments.length === 0 && !error && (
            <li className="py-2 text-center text-xs text-ink-3">No comments yet. Start the conversation.</li>
          )}
          {comments.map((c) => {
            const own = String(c.authorId) === String(currentUserId)
            return (
              <li key={c.id} className="flex items-start gap-2.5">
                <Avatar name={c.authorName} size="sm" />
                <div className="min-w-0 flex-1 rounded-lg bg-surface-alt px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs font-medium">{c.authorName || 'Member'}</p>
                    <span className="flex items-center gap-2">
                      <span className="text-[10px] text-ink-3">{c.createdAt ? timeAgo(c.createdAt) : ''}</span>
                      {own && (
                        <button
                          type="button"
                          onClick={() => remove(c.id)}
                          className="text-ink-3 hover:text-danger"
                          aria-label="Delete comment"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </span>
                  </div>
                  <p className="mt-0.5 whitespace-pre-line text-sm">{c.content}</p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
      {error && <p className="mt-2 text-xs text-danger" role="alert">{error}</p>}
      <form onSubmit={submit} className="mt-3 flex gap-2">
        <input
          className="input"
          placeholder="Write a comment…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={2000}
          aria-label="Add a comment"
        />
        <button type="submit" className="btn-accent btn-sm" disabled={sending || !draft.trim()} aria-label="Post comment">
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  )
}

const ReportDialog = ({ postId, onClose }) => {
  const [category, setCategory] = useState('SPAM')
  const [description, setDescription] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      await moderationService.report({
        targetType: 'POST',
        targetId: postId,
        category,
        description: description.trim() || undefined,
      })
      setDone(true)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label="Report post">
      <div className="card w-full max-w-md p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Report post</h3>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-ink-3 hover:bg-hover" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        {done ? (
          <div>
            <p className="text-sm text-success" role="status">Thank you — our moderators will review this post.</p>
            <button type="button" className="btn-outline btn-sm mt-4" onClick={onClose}>Close</button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label htmlFor="report-category" className="label">Category</label>
              <select id="report-category" className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
                {REPORT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="report-desc" className="label">Details (optional)</label>
              <textarea
                id="report-desc"
                rows={3}
                className="input resize-y"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={1000}
              />
            </div>
            {error && <p className="text-sm text-danger" role="alert">{error}</p>}
            <div className="flex justify-end gap-2">
              <button type="button" className="btn-ghost btn-sm" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn-danger btn-sm" disabled={sending}>
                {sending ? 'Submitting…' : 'Submit report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
