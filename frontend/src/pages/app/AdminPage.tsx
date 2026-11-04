import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useApp } from '@/store/AppProvider'
import { LANGUAGES } from '@/data/constants'
import { useToast } from '@/components/ui/Toast'

export function AdminPage() {
  const { state, suspendUser, restoreUser, reviewReport, unflagPost } = useApp()
  const toast = useToast()
  const active = state.users.filter((user) => user.status === 'active')
  const suspended = state.users.filter((user) => user.status === 'suspended')
  const pendingReports = state.reports.filter((item) => item.status === 'pending')
  const flagged = state.posts.filter((post) => post.flagged)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Admin dashboard</h1>
        <p className="text-muted">Mock operations console for the Gurugram prototype.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-2xl font-bold">{state.users.filter((user) => user.status !== 'deleted').length}</p>
          <p className="text-sm text-muted">Registered users</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xl font-bold">{active.length}</p>
          <p className="text-sm text-muted">Active users</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xl font-bold">{pendingReports.length}</p>
          <p className="text-sm text-muted">Pending reports</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xl font-bold">{suspended.length}</p>
          <p className="text-sm text-muted">Suspended accounts</p>
        </Card>
      </div>
      <Card className="p-5">
        <h2 className="font-semibold">Language distribution</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {LANGUAGES.map((language) => {
            const count = state.users.filter((user) => user.motherTongue === language && user.status === 'active').length
            return (
              <div key={language} className="flex items-center justify-between text-sm">
                <span>{language}</span>
                <span className="font-medium">{count}</span>
              </div>
            )
          })}
        </div>
      </Card>
      <Card className="p-5">
        <h2 className="font-semibold">Community statistics</h2>
        <div className="mt-3 space-y-2">
          {state.communities.map((community) => (
            <div key={community.id} className="flex items-center justify-between text-sm">
              <span>{community.name}</span>
              <span>{community.memberIds.length} members</span>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-5">
        <h2 className="mb-3 font-semibold">Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-muted">
                <th className="pb-2">Name</th>
                <th className="pb-2">Language</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {state.users
                .filter((user) => user.status !== 'deleted')
                .map((user) => (
                  <tr key={user.id} className="border-t border-line">
                    <td className="py-2">{user.name}</td>
                    <td>{user.motherTongue}</td>
                    <td>
                      <Badge tone={user.status === 'suspended' ? 'accent' : 'soft'}>{user.status}</Badge>
                    </td>
                    <td className="py-2">
                      {user.role === 'admin' ? (
                        '—'
                      ) : user.status === 'suspended' ? (
                        <Button size="sm" variant="outline" onClick={() => restoreUser(user.id)}>
                          Restore
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => {
                            suspendUser(user.id)
                            toast('Account suspended')
                          }}
                        >
                          Suspend
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card className="space-y-3 p-5">
        <h2 className="font-semibold">Pending reports</h2>
        {pendingReports.map((report) => (
          <div key={report.id} className="rounded-xl bg-canvas p-3 text-sm">
            <p className="font-medium">{report.reason}</p>
            <p className="text-muted">{report.details}</p>
            <div className="mt-2 flex gap-2">
              <Button size="sm" onClick={() => reviewReport(report.id, 'reviewed')}>
                Mark reviewed
              </Button>
              <Button size="sm" variant="outline" onClick={() => reviewReport(report.id, 'dismissed')}>
                Dismiss
              </Button>
            </div>
          </div>
        ))}
      </Card>
      <Card className="space-y-3 p-5">
        <h2 className="font-semibold">Flagged posts</h2>
        {flagged.map((post) => (
          <div key={post.id} className="rounded-xl bg-canvas p-3 text-sm">
            <p>{post.content}</p>
            <Button className="mt-2" size="sm" variant="outline" onClick={() => unflagPost(post.id)}>
              Restore post
            </Button>
          </div>
        ))}
      </Card>
    </div>
  )
}
