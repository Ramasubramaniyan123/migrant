import type { Post } from '@/types/community.types'
import { fullName } from '@/services/userService'
import { useUsers } from '@/hooks/useUsers'
import { formatRelativeTime } from '@/utils/formatters'
import Avatar from '@/components/common/Avatar'
import EmptyState from '@/components/common/EmptyState'
import Loader from '@/components/common/Loader'

interface CommunityFeedProps {
  posts: Post[]
  isLoading?: boolean
  onLike?: (post: Post) => void
  canInteract?: boolean
}

/** Chronological list of posts for a community, with like/comment counts. */
export default function CommunityFeed({ posts, isLoading, onLike, canInteract = false }: CommunityFeedProps) {
  const { getUserById } = useUsers()

  if (isLoading) {
    return <Loader label="Loading posts…" />
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        title="No posts yet"
        description="Be the first to start a conversation in this community."
      />
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const author = getUserById(post.userId)
        const name = author ? fullName(author) : 'Community member'
        return (
          <article key={post.id} className="card space-y-3">
            <div className="flex items-center gap-3">
              <Avatar name={name} src={author?.profile.avatarUrl} size="md" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{name}</p>
                <p className="text-xs text-slate-500">{formatRelativeTime(post.createdAt)}</p>
              </div>
            </div>

            <p className="whitespace-pre-line text-sm text-slate-700">{post.content}</p>

            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="Post attachment"
                loading="lazy"
                className="max-h-96 w-full rounded-lg border border-slate-200 object-cover"
              />
            )}

            <div className="flex items-center gap-6 border-t border-slate-100 pt-3 text-sm text-slate-500">
              <button
                type="button"
                onClick={() => onLike?.(post)}
                disabled={!canInteract}
                className={
                  'inline-flex items-center gap-1.5 transition ' +
                  (canInteract ? 'hover:text-brand-700' : 'cursor-not-allowed opacity-60')
                }
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <path d="M12 20.5s-7.5-4.35-7.5-9.5a4.5 4.5 0 0 1 8.1-2.79A4.5 4.5 0 0 1 19.5 11c0 5.15-7.5 9.5-7.5 9.5Z" />
                </svg>
                <span>{post.likeCount}</span>
              </button>
              <span className="inline-flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5Z" />
                </svg>
                <span>{post.commentCount}</span>
              </span>
            </div>
          </article>
        )
      })}
    </div>
  )
}
