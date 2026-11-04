import { useMemo, useState } from 'react'
import { LayoutGrid, ListFilter, Rows3, Search } from 'lucide-react'
import { PersonCard } from '@/components/people/PersonCard'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input, Select } from '@/components/ui/Input'
import { EmptyState } from '@/components/ui/EmptyState'
import { INTERESTS, LANGUAGES, LOCALITIES, RADIUS_OPTIONS, STATES } from '@/data/constants'
import { useApp } from '@/store/AppProvider'
import { discoverableUsers, sharedInterests, withDistance } from '@/lib/people'
import { cn } from '@/lib/cn'

export function DiscoverPage() {
  const { currentUser, state } = useApp()
  const [query, setQuery] = useState('')
  const [radius, setRadius] = useState(5000)
  const [language, setLanguage] = useState('all')
  const [hometown, setHometown] = useState('')
  const [homeState, setHomeState] = useState('all')
  const [profession, setProfession] = useState('')
  const [interest, setInterest] = useState('all')
  const [sort, setSort] = useState('nearest')
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const people = useMemo(() => {
    if (!currentUser) return []
    let rows = withDistance(discoverableUsers(state, currentUser), currentUser)
    rows = rows.filter((item) => item.distance * 1000 <= radius)
    if (language !== 'all') rows = rows.filter((item) => item.user.motherTongue === language)
    if (homeState !== 'all') rows = rows.filter((item) => item.user.homeState === homeState)
    if (hometown.trim()) rows = rows.filter((item) => item.user.hometown.toLowerCase().includes(hometown.toLowerCase()))
    if (profession.trim()) rows = rows.filter((item) => item.user.profession.toLowerCase().includes(profession.toLowerCase()))
    if (interest !== 'all') rows = rows.filter((item) => item.user.interests.includes(interest))
    if (query.trim()) {
      const q = query.toLowerCase()
      rows = rows.filter(
        (item) =>
          item.user.name.toLowerCase().includes(q) ||
          item.user.hometown.toLowerCase().includes(q) ||
          item.user.profession.toLowerCase().includes(q) ||
          item.user.motherTongue.toLowerCase().includes(q),
      )
    }
    if (sort === 'recent') rows = [...rows].sort((a, b) => b.user.createdAt.localeCompare(a.user.createdAt))
    if (sort === 'shared') {
      rows = [...rows].sort(
        (a, b) => sharedInterests(currentUser, b.user).length - sharedInterests(currentUser, a.user).length,
      )
    }
    return rows
  }, [currentUser, state, radius, language, hometown, homeState, profession, interest, query, sort])

  if (!currentUser) return null

  const filters = (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-semibold">Location radius</p>
        <div className="space-y-1">
          {RADIUS_OPTIONS.map((option) => (
            <label key={option.metres} className="flex items-center gap-2 text-sm">
              <input type="radio" name="radius" checked={radius === option.metres} onChange={() => setRadius(option.metres)} />
              {option.label}
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold">Language</p>
        <Select value={language} onChange={(event) => setLanguage(event.target.value)}>
          <option value="all">All languages</option>
          {LANGUAGES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </Select>
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold">State</p>
        <Select value={homeState} onChange={(event) => setHomeState(event.target.value)}>
          <option value="all">All states</option>
          {STATES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </Select>
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold">Hometown</p>
        <Input value={hometown} onChange={(event) => setHometown(event.target.value)} placeholder="Tenkasi, Kochi..." />
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold">Profession</p>
        <Input value={profession} onChange={(event) => setProfession(event.target.value)} placeholder="Designer, engineer..." />
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold">Interests</p>
        <Select value={interest} onChange={(event) => setInterest(event.target.value)}>
          <option value="all">All interests</option>
          {INTERESTS.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </Select>
      </div>
      <p className="text-xs text-muted">Showing people near {currentUser.locality}. Distances are approximate. Localities: {LOCALITIES.slice(0, 3).join(', ')} and more.</p>
    </div>
  )

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Find Your People</h1>
        <p className="text-muted">Discover familiar faces in your new city.</p>
      </div>
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted" />
          <Input className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, hometown or profession" />
        </div>
        <Select value={sort} onChange={(event) => setSort(event.target.value)} className="md:w-48">
          <option value="nearest">Nearest</option>
          <option value="recent">Recently joined</option>
          <option value="shared">Shared interests</option>
        </Select>
        <div className="flex gap-2">
          <Button variant={layout === 'grid' ? 'secondary' : 'outline'} onClick={() => setLayout('grid')}>
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant={layout === 'list' ? 'secondary' : 'outline'} onClick={() => setLayout('list')}>
            <Rows3 className="h-4 w-4" />
          </Button>
          <Button className="lg:hidden" variant="outline" onClick={() => setFiltersOpen((value) => !value)}>
            <ListFilter className="h-4 w-4" /> Filters
          </Button>
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <Card className={cn('h-fit p-4', filtersOpen ? 'block' : 'hidden lg:block')}>{filters}</Card>
        <div>
          {people.length === 0 ? (
            <EmptyState title="No one in this radius" body="Try a wider radius or clear a language filter. Discovery never uses exact addresses." />
          ) : (
            <div className={cn(layout === 'grid' ? 'grid gap-3 md:grid-cols-2 xl:grid-cols-3' : 'space-y-3')}>
              {people.map(({ user, distance }) => (
                <PersonCard
                  key={user.id}
                  person={user}
                  distance={distance}
                  shared={sharedInterests(currentUser, user)}
                  layout={layout}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
