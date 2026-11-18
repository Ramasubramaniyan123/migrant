import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LoginPage } from './LoginPage'
import { RegisterPage } from './RegisterPage'
import { ResetPasswordPage } from './ResetPasswordPage'

const loginMock = vi.fn()
const registerMock = vi.fn()
const resetMock = vi.fn()
const resendMock = vi.fn()

vi.mock('../../services/auth/authService', () => ({
  authService: {
    login: (...a) => loginMock(...a),
    register: (...a) => registerMock(...a),
    resetPassword: (...a) => resetMock(...a),
    resendVerification: (...a) => resendMock(...a),
  },
}))

const authState = { user: null, loading: false }
vi.mock('../../contexts', () => ({
  useAuth: () => ({
    ...authState,
    login: vi.fn(async (email, password) => loginMock(email, password)),
    register: vi.fn(async (values) => registerMock(values)),
  }),
}))

const wrap = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>)

describe('LoginPage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('rejects empty submission with field errors', async () => {
    wrap(<LoginPage />)
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => expect(screen.getByText(/required|invalid/i)).toBeInTheDocument())
    expect(loginMock).not.toHaveBeenCalled()
  })

  it('shows backend error on failed login', async () => {
    loginMock.mockRejectedValue({ response: { data: { message: 'Invalid credentials' } } })
    wrap(<LoginPage />)
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password1!' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => expect(screen.getByText('Invalid credentials')).toBeInTheDocument())
  })
})

describe('RegisterPage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('requires all fields', async () => {
    wrap(<RegisterPage />)
    fireEvent.click(screen.getByRole('button', { name: /create|register|sign up/i }))
    await waitFor(() => expect(loginMock).not.toHaveBeenCalled())
    expect(registerMock).not.toHaveBeenCalled()
  })
})

describe('ResetPasswordPage (BUG-02 regression)', () => {
  beforeEach(() => vi.clearAllMocks())

  const fill = (pw, confirm) => {
    fireEvent.change(screen.getByLabelText('Reset code'), { target: { value: '123456' } })
    fireEvent.change(screen.getByLabelText('New password'), { target: { value: pw } })
    fireEvent.change(screen.getByLabelText('Confirm new password'), { target: { value: confirm } })
  }

  it('rejects mismatched passwords', async () => {
    wrap(<ResetPasswordPage />)
    fill('Password1!', 'Different1!')
    fireEvent.click(screen.getByRole('button', { name: /reset|update/i }))
    await waitFor(() => expect(screen.getByText(/do not match|match/i)).toBeInTheDocument())
    expect(resetMock).not.toHaveBeenCalled()
  })

  it('submits matching valid passwords', async () => {
    resetMock.mockResolvedValue({})
    wrap(<ResetPasswordPage />)
    fill('Password1!', 'Password1!')
    fireEvent.click(screen.getByRole('button', { name: /reset|update/i }))
    await waitFor(() => expect(resetMock).toHaveBeenCalled())
  })
})
