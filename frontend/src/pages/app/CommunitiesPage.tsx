import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useApp } from '@/store/AppProvider'
import { useToast } from '@/components/ui/Toast'

export function CommunitiesPage() {
  const { state, currentUser, joinCommunity, leaveCommunity } = useApp()
  const toast = useToast()
  if (!currentUser) return null

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Gurugram communities</h1>
        <p className="text-muted">Language-based local circles. Join one, leave anytime.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {state.communities.map((community) => {
          const joined = community.memberIds.includes(currentUser.id)
          return (
            <Card key={community.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{community.name}</h2>
                  <div className="mt-2 flex gap-2">
                    <Badge>{community.language}</Badge>
                    <Badge tone="line">{community.location}</Badge>
                  </div>
                </div>
                <p className="text-sm text-muted">{community.memberIds.length} members</p>
              </div>
              <p className="mt-3 text-sm text-muted">{community.description}</p>
              <div className="mt-4 flex gap-2">
                <Link to={`/app/communities/${community.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    Open feed
                  </Button>
                </Link>
                {joined ? (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      leaveCommunity(community.id)
                      toast('Left community')
                    }}
                  >
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
          )
        })}
      </div>
    </div>
  )
}
