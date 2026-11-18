import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { PrivateRoute } from './PrivateRoute'
import { AdminRoute } from './AdminRoute'
import { adminTokenStore } from '../services/api/adminClient'

const mockUseAuth = vi.fn()
vi.mock('../contexts', () => ({
  useAuth: () => mockUseAuth(),
}))

const renderAt = (path, routes) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>{routes}</Routes>
    </MemoryRouter>
  )

describe('PrivateRoute', () => {
  beforeEach(() => mockUseAuth.mockReset())

  it('shows loading state while restoring session', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true })
    renderAt('/app/home', (
      <Route element={<PrivateRoute />}>
        <Route path="app/*" element={<div>secret</div>} />
      </Route>
    ))
    expect(screen.getByText(/Restoring your session/)).toBeInTheDocument()
  })

  it('redirects unauthenticated users to /login preserving from', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false })
    renderAt('/app/feed', (
      <>
        <Route path="login" element={<div>login page</div>} />
        <Route element={<PrivateRoute />}>
          <Route path="app/*" element={<div>secret</div>} />
        </Route>
      </>
    ))
    expect(screen.getByText('login page')).toBeInTheDocument()
  })

  it('renders outlet for authenticated users', () => {
    mockUseAuth.mockReturnValue({ user: { id: 1 }, loading: false })
    renderAt('/app/home', (
      <Route element={<PrivateRoute />}>
        <Route path="app/*" element={<div>secret</div>} />
      </Route>
    ))
    expect(screen.getByText('secret')).toBeInTheDocument()
  })
})

describe('AdminRoute', () => {
  beforeEach(() => adminTokenStore.clear())

  it('redirects to /login without a token', () => {
    renderAt('/admin/dashboard', (
      <>
        <Route path="login" element={<div>login page</div>} />
        <Route element={<AdminRoute />}>
          <Route path="admin/*" element={<div>admin secret</div>} />
        </Route>
      </>
    ))
    expect(screen.getByText('login page')).toBeInTheDocument()
  })

  it('renders outlet with a stored token', () => {
    adminTokenStore.set({ token: 'abc', admin: { email: 'a@b.c' } })
    renderAt('/admin/dashboard', (
      <Route element={<AdminRoute />}>
        <Route path="admin/*" element={<div>admin secret</div>} />
      </Route>
    ))
    expect(screen.getByText('admin secret')).toBeInTheDocument()
  })
})
