import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PostCard } from '@/components/community/PostCard'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Textarea } from '@/components/ui/Input'
import { EmptyState } from '@/components/ui/EmptyState'
import { useApp } from '@/store/AppProvider'
import { useToast } from '@/components/ui/Toast'

export function CommunityDetailPage() {
  const { id } = useParams()
  const { state, currentUser, joinCommunity, leaveCommunity, createPost } = useApp()
  const toast = useToast()
  const [content, setContent] = useState('')
  const community = state.communities.find((item) => item.id === id)
  if (!community || !currentUser) {
    return <EmptyState title="Community not found" body="This community may have been moved." action={<Link to="/app/communities">Back</Link>} />
  }
  const joined = community.memberIds.includes(currentUser.id)
  const posts = state.posts.filter((post) => post.communityId === community.id && !post.flagged)

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Card className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{community.name}</h1>
            <p className="mt-1 text-sm text-muted">
              {community.language} · {community.location} · {community.memberIds.length} members
            </p>
            <p className="mt-3 text-sm">{community.description}</p>
          </div>
          {joined ? (
            <Button variant="outline" onClick={() => leaveCommunity(community.id)}>
              Leave
            </Button>
          ) : (
            <Button
              onClick={() => {
                joinCommunity(community.id)
                toast('Joined community')
              }}
            >
              Join
            </Button>
          )}
        </div>
      </Card>
      {joined ? (
        <Card className="p-4">
          <form
            onSubmit={(event) => {
              event.preventDefault()
              createPost(community.id, content)
              setContent('')
              toast('Post published')
            }}
            className="space-y-3"
          >
            <Textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="Share an update. Do not include addresses or phone numbers." />
            <Button type="submit" disabled={!content.trim()}>
              Post
            </Button>
          </form>
        </Card>
      ) : (
        <EmptyState title="Join to participate" body="Members can post, like and comment in this community feed." />
      )}
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
