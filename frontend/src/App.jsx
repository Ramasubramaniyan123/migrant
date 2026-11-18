import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { PublicLayout } from './layouts/PublicLayout'
import { UserLayout } from './layouts/UserLayout'
import { AdminLayout } from './layouts/AdminLayout'
import { PublicRoutes } from './routes/PublicRoutes'
import { UserRoutes } from './routes/UserRoutes'
import { AdminRoutes } from './routes/AdminRoutes'
import { PrivateRoute } from './guards/PrivateRoute'
import { AdminRoute } from './guards/AdminRoute'

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route element={<PublicLayout />}>
          {PublicRoutes}
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="app" element={<UserLayout />}>
            {UserRoutes}
          </Route>
        </Route>
        <Route element={<AdminRoute />}>
          <Route path="admin" element={<AdminLayout />}>
            {AdminRoutes}
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
