import { Routes, Route } from 'react-router-dom'
import { Home } from '../features/dashboard'
import { Discover } from '../features/discovery'
import { Communities } from '../features/communities'
import { Feed } from '../features/feed'
import { Connections } from '../features/connections'
import { Messaging } from '../features/messaging'
import { Notifications } from '../features/notifications'
import { Events } from '../features/events'
import { Profile } from '../features/profile'
import { Settings } from '../features/settings'

export const UserRoutes = () => (
  <Routes>
    <Route path="/app/home" element={<Home />} />
    <Route path="/app/discover" element={<Discover />} />
    <Route path="/app/communities" element={<Communities />} />
    <Route path="/app/feed" element={<Feed />} />
    <Route path="/app/connections" element={<Connections />} />
    <Route path="/app/messages" element={<Messaging />} />
    <Route path="/app/notifications" element={<Notifications />} />
    <Route path="/app/events" element={<Events />} />
    <Route path="/app/profile" element={<Profile />} />
    <Route path="/app/settings" element={<Settings />} />
  </Routes>
)