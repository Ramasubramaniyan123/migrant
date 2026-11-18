import { Route, Navigate } from 'react-router-dom'
import { Home } from '../features/dashboard'
import { Discover } from '../features/discovery'
import { Communities } from '../features/communities'
import { CommunityDetails } from '../features/communities/CommunityDetails'
import { Feed } from '../features/feed'
import { Connections } from '../features/connections'
import { Messaging } from '../features/messaging'
import { Notifications } from '../features/notifications'
import { Events } from '../features/events'
import { EventDetails } from '../features/events/EventDetails'
import { Profile } from '../features/profile'
import { Settings } from '../features/settings'
import { Onboarding } from '../features/onboarding/Onboarding'

export const UserRoutes = (
  <>
    <Route index element={<Navigate to="/app/home" replace />} />
    <Route path="home" element={<Home />} />
    <Route path="onboarding" element={<Onboarding />} />
    <Route path="discover" element={<Discover />} />
    <Route path="communities" element={<Communities />} />
    <Route path="communities/:id" element={<CommunityDetails />} />
    <Route path="feed" element={<Feed />} />
    <Route path="connections" element={<Connections />} />
    <Route path="messages" element={<Messaging />} />
    <Route path="notifications" element={<Notifications />} />
    <Route path="events" element={<Events />} />
    <Route path="events/:id" element={<EventDetails />} />
    <Route path="profile" element={<Profile />} />
    <Route path="settings" element={<Settings />} />
    <Route path="*" element={<Navigate to="/app/home" replace />} />
  </>
)
