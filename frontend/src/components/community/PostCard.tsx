import { useState } from 'react'
import { Heart, MessageSquare, Flag } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { formatRelative } from '@/lib/dates'
import { useApp } from '@/store/AppProvider'
import { useToast } from '@/components/ui/Toast'
import type { Post } from '@/types'

export function PostCard({ post }: { post: Post }) {
  const { state, currentUser, toggleLike, addComment, reportPost } = useApp()
  const toast = useToast()
  const [text, setText] = useState('')
  const author = state.users.find((user) => user.id === post.authorId)
  const liked = currentUser ? post.likes.includes(currentUser.id) : false

  if (!author) return null

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <Avatar src={author.photo} name={author.name} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{author.name}</p>
          <p className="text-xs text-muted">{formatRelative(post.createdAt)}</p>
          <p className="mt-3 text-sm leading-6 text-ink">{post.content}</p>
          <div className="mt-3 flex items-center gap-2">
            <Button size="sm" variant={liked ? 'secondary' : 'ghost'} onClick={() => toggleLike(post.id)}>
              <Heart className={`h-4 w-4 ${liked ? 'fill-brand text-brand' : ''}`} /> {post.likes.length}
            </Button>
            <span className="inline-flex items-center gap-1 px-2 text-sm text-muted">
              <MessageSquare className="h-4 w-4" /> {post.comments.length}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                reportPost(post.id, 'Inappropriate community post')
                toast('Post reported for review')
              }}
            >
              <Flag className="h-4 w-4" /> Report
            </Button>
          </div>
          <div className="mt-3 space-y-2">
            {post.comments.map((comment) => {
              const commenter = state.users.find((user) => user.id === comment.authorId)
              return (
                <div key={comment.id} className="rounded-xl bg-canvas px-3 py-2 text-sm">
                  <span className="font-medium">{commenter?.name ?? 'Member'}: </span>
                  {comment.text}
                </div>
              )
            })}
            <form
              className="flex gap-2"
              onSubmit={(event) => {
                event.preventDefault()
                addComment(post.id, text)
                setText('')
              }}
            >
              <Input value={text} onChange={(event) => setText(event.target.value)} placeholder="Write a comment" />
              <Button type="submit" size="sm">
                Send
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Card>
  )
}
