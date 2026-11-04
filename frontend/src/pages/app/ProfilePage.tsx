import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Field, Input, Select, Textarea } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { ALL_LANGUAGES, INTERESTS, LOCALITIES } from '@/data/constants'
import { distanceKm, formatDistance } from '@/lib/distance'
import { sharedInterests } from '@/lib/people'
import { useApp } from '@/store/AppProvider'
import { useToast } from '@/components/ui/Toast'
import type { Language } from '@/types'

export function ProfilePage({ self = false }: { self?: boolean }) {
  const { id } = useParams()
  const { state, currentUser, updateProfile, sendRequest, requestState, conversationWith, blockUser, reportUser } = useApp()
  const toast = useToast()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [reason, setReason] = useState('Unwanted contact')

  const user = self ? currentUser : state.users.find((item) => item.id === id)
  if (!user || !currentUser) return <p>Profile not found.</p>
  const mine = user.id === currentUser.id
  const status = requestState(user.id)
  const conv = conversationWith(user.id)

  const [name, setName] = useState(user.name)
  const [bio, setBio] = useState(user.bio)
  const [profession, setProfession] = useState(user.profession)
  const [locality, setLocality] = useState(user.locality)
  const [languages, setLanguages] = useState<Language[]>(user.languages)
  const [interests, setInterests] = useState(user.interests)

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Card className="p-6">
        <div className="flex flex-wrap items-start gap-4">
          <Avatar src={user.photo} name={user.name} size="xl" />
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-muted">{user.profession}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge>{user.motherTongue}</Badge>
              {user.languages.filter((item) => item !== user.motherTongue).map((item) => (
                <Badge key={item} tone="line">
                  {item}
                </Badge>
              ))}
            </div>
            <p className="mt-3 text-sm text-muted">
              From {user.hometown}, {user.homeState} · Now in {user.locality}, Gurugram
              {!mine && user.privacy.locationVisibility === 'approximate' ? ` · ${formatDistance(distanceKm(currentUser, user))}` : ''}
            </p>
          </div>
          {mine ? (
            <Button onClick={() => setEditing((value) => !value)}>{editing ? 'Close editor' : 'Edit profile'}</Button>
          ) : (
            <div className="flex flex-wrap gap-2">
              {status === 'accepted' ? (
                <Button onClick={() => navigate(`/app/messages/${user.id}`)}>Message</Button>
              ) : status === 'pending-out' ? (
                <Button disabled variant="outline">
                  Request sent
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    sendRequest(user.id)
                    toast('Request sent')
                  }}
                >
                  Connect
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => {
                  blockUser(user.id)
                  toast('User blocked')
                  navigate('/app/discover')
                }}
              >
                Block
              </Button>
              <Button variant="danger" onClick={() => setReportOpen(true)}>
                Report
              </Button>
            </div>
          )}
        </div>
        <p className="mt-5 text-sm leading-7">{user.bio}</p>
        <div className="mt-4">
          <p className="text-sm font-semibold">Interests</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {user.interests.map((item) => (
              <Badge key={item} tone="accent">
                {item}
              </Badge>
            ))}
          </div>
        </div>
        {!mine && sharedInterests(currentUser, user).length ? (
          <p className="mt-3 text-sm text-muted">You both like {sharedInterests(currentUser, user).join(', ')}.</p>
        ) : null}
      </Card>
      <Card className="p-5">
        <h2 className="font-semibold">Joined communities</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {state.communities
            .filter((community) => user.joinedCommunityIds.includes(community.id))
            .map((community) => (
              <Link key={community.id} to={`/app/communities/${community.id}`}>
                <Badge>{community.name}</Badge>
              </Link>
            ))}
        </div>
      </Card>
      {mine && editing ? (
        <Card className="space-y-4 p-5">
          <h2 className="font-semibold">Update profile</h2>
          <Field label="Name">
            <Input value={name} onChange={(event) => setName(event.target.value)} />
          </Field>
          <Field label="Profession">
            <Input value={profession} onChange={(event) => setProfession(event.target.value)} />
          </Field>
          <Field label="About">
            <Textarea value={bio} onChange={(event) => setBio(event.target.value)} />
          </Field>
          <Field label="Locality">
            <Select value={locality} onChange={(event) => setLocality(event.target.value)}>
              {LOCALITIES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </Select>
          </Field>
          <p className="text-sm font-medium">Languages</p>
          <div className="flex flex-wrap gap-2">
            {ALL_LANGUAGES.map((language) => {
              const selected = languages.includes(language)
              return (
                <button
                  key={language}
                  type="button"
                  className={`rounded-full border px-3 py-1 text-sm ${selected ? 'border-brand bg-brand-soft text-brand' : 'border-line'}`}
                  onClick={() =>
                    setLanguages((current) => (selected ? current.filter((item) => item !== language) : [...current, language]))
                  }
                >
                  {language}
                </button>
              )
            })}
          </div>
          <p className="text-sm font-medium">Interests</p>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((interest) => {
              const selected = interests.includes(interest)
              return (
                <button
                  key={interest}
                  type="button"
                  className={`rounded-full border px-3 py-1 text-sm ${selected ? 'border-brand bg-brand-soft text-brand' : 'border-line'}`}
                  onClick={() =>
                    setInterests((current) => (selected ? current.filter((item) => item !== interest) : [...current, interest]))
                  }
                >
                  {interest}
                </button>
              )
            })}
          </div>
          <Button
            onClick={() => {
              updateProfile({ name, bio, profession, locality, languages, interests })
              setEditing(false)
              toast('Profile updated')
            }}
          >
            Save changes
          </Button>
          {conv ? <p className="text-xs text-muted">Existing conversations stay available after edits.</p> : null}
        </Card>
      ) : null}
      <Modal open={reportOpen} title="Report user" onClose={() => setReportOpen(false)}>
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault()
            reportUser(user.id, reason, reason)
            setReportOpen(false)
            toast('Report submitted')
          }}
        >
          <Field label="Reason">
            <Select value={reason} onChange={(event) => setReason(event.target.value)}>
              <option>Unwanted contact</option>
              <option>Asked for private address or phone</option>
              <option>Harassment</option>
              <option>Spam</option>
            </Select>
          </Field>
          <Button type="submit">Submit report</Button>
        </form>
      </Modal>
    </div>
  )
}
