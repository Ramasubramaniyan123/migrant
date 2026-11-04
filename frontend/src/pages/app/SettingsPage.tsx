import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Field, Select } from '@/components/ui/Input'
import { useApp } from '@/store/AppProvider'
import { useToast } from '@/components/ui/Toast'
import type { LocationVisibility, ProfileVisibility } from '@/types'

export function SettingsPage() {
  const { currentUser, updatePrivacy, unblockUser, state, deleteAccount, resetDemo, logout } = useApp()
  const toast = useToast()
  const navigate = useNavigate()
  const [confirmDelete, setConfirmDelete] = useState(false)
  if (!currentUser) return null

  const blocked = state.blocked.filter((item) => item.blockerId === currentUser.id)

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Privacy and safety</h1>
      <Card className="space-y-4 p-5">
        <h2 className="font-semibold">Visibility</h2>
        <Field label="Profile visibility">
          <Select
            value={currentUser.privacy.profileVisibility}
            onChange={(event) => updatePrivacy({ profileVisibility: event.target.value as ProfileVisibility })}
          >
            <option value="public">Visible in discovery</option>
            <option value="connections">Connections only</option>
            <option value="hidden">Hidden</option>
          </Select>
        </Field>
        <Field label="Location visibility">
          <Select
            value={currentUser.privacy.locationVisibility}
            onChange={(event) => updatePrivacy({ locationVisibility: event.target.value as LocationVisibility })}
          >
            <option value="approximate">Approximate distance</option>
            <option value="hidden">Hide distance</option>
          </Select>
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={currentUser.privacy.pauseDiscovery}
            onChange={(event) => {
              updatePrivacy({ pauseDiscovery: event.target.checked })
              toast(event.target.checked ? 'Discovery paused' : 'Discovery resumed')
            }}
          />
          Pause discovery — hide me from Find Your People
        </label>
        <p className="text-xs text-muted">Connect never displays exact coordinates, PG names or residential addresses.</p>
      </Card>
      <Card className="space-y-3 p-5">
        <h2 className="font-semibold">Blocked accounts</h2>
        {blocked.length === 0 ? (
          <p className="text-sm text-muted">You have not blocked anyone.</p>
        ) : (
          blocked.map((item) => {
            const user = state.users.find((person) => person.id === item.blockedId)
            if (!user) return null
            return (
              <div key={item.blockedId} className="flex items-center justify-between">
                <p className="text-sm">{user.name}</p>
                <Button size="sm" variant="outline" onClick={() => unblockUser(user.id)}>
                  Unblock
                </Button>
              </div>
            )
          })
        )}
      </Card>
      <Card className="space-y-3 p-5">
        <h2 className="font-semibold">Manage connections</h2>
        <Button variant="outline" onClick={() => navigate('/app/connections')}>
          Open connections
        </Button>
      </Card>
      <Card className="space-y-3 p-5">
        <h2 className="font-semibold">Demo data</h2>
        <p className="text-sm text-muted">Reset restores the original 30+ fictional neighbours, requests and chats.</p>
        <Button
          variant="outline"
          onClick={() => {
            resetDemo()
            toast('Demo data reset')
            navigate('/login')
          }}
        >
          Reset demo data
        </Button>
      </Card>
      <Card className="space-y-3 p-5">
        <h2 className="font-semibold">Delete account</h2>
        {confirmDelete ? (
          <div className="flex gap-2">
            <Button
              variant="danger"
              onClick={() => {
                deleteAccount()
                logout()
                navigate('/')
              }}
            >
              Confirm delete
            </Button>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button variant="danger" onClick={() => setConfirmDelete(true)}>
            Delete account
          </Button>
        )}
      </Card>
    </div>
  )
}
