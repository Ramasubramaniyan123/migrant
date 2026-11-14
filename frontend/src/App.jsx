import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { PublicRoutes } from './routes/PublicRoutes'
import { UserRoutes } from './routes/UserRoutes'
import { AdminRoutes } from './routes/AdminRoutes'
import { PrivateRoute } from './guards/PrivateRoute'
import { AdminRoute } from './guards/AdminRoute'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<PublicRoutes />} />
        <Route path="/app/*" element={<PrivateRoute><UserRoutes /></PrivateRoute>} />
        <Route path="/admin/*" element={<AdminRoute><AdminRoutes /></AdminRoute>} />
      </Routes>
    </Router>
  )
}

export default App