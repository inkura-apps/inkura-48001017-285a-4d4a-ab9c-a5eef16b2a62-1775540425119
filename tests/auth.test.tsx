import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

// ── Mocks ──────────────────────────────���───────────────────────────────────

vi.mock('react-router-dom', async (importOriginal) => {
  const mod = await importOriginal<typeof import('react-router-dom')>()
  return { ...mod, useNavigate: () => vi.fn() }
})

vi.mock('../src/hooks/useAuth', () => ({
  login: vi.fn().mockResolvedValue({ error: null }),
  signup: vi.fn().mockResolvedValue({ error: null }),
  loginWithGoogle: vi.fn().mockResolvedValue({ error: null }),
  sendMagicLink: vi.fn().mockResolvedValue({ error: null }),
}))

vi.mock('../src/contexts/AuthContext', async (importOriginal) => {
  const mod = await importOriginal<typeof import('../src/contexts/AuthContext')>()
  return {
    ...mod,
    useAuthContext: vi.fn(() => ({
      user: null,
      loading: false,
      session: null,
      signOut: vi.fn(),
    })),
  }
})

import { AuthProvider }  from '../src/contexts/AuthContext'
import { useAuthContext } from '../src/contexts/AuthContext'
import { ProtectedRoute } from '../src/components/auth/ProtectedRoute'
import LoginPage           from '../src/components/auth/LoginPage'
import SignupPage          from '../src/components/auth/SignupPage'

const mockAuth = vi.mocked(useAuthContext)

// ── AuthProvider ───────────────���───────────────────────────────────────────

describe('AuthProvider', () => {
  it('renders children without crashing', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <div data-testid="child">hello</div>
        </AuthProvider>
      </MemoryRouter>,
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('provides loading and user state to consumers', () => {
    mockAuth.mockReturnValue({ user: null, loading: true, session: null, signOut: vi.fn() })
    render(
      <MemoryRouter>
        <AuthProvider>
          <div data-testid="child" />
        </AuthProvider>
      </MemoryRouter>,
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })
})

// ── ProtectedRoute ─────────────────────────────────────────────────────────

describe('ProtectedRoute', () => {
  beforeEach(() => {
    mockAuth.mockReturnValue({ user: null, loading: false, session: null, signOut: vi.fn() })
  })

  it('does not render children when user is not authenticated', () => {
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div data-testid="secret">secret</div>
        </ProtectedRoute>
      </MemoryRouter>,
    )
    expect(screen.queryByTestId('secret')).not.toBeInTheDocument()
  })

  it('renders children when user is authenticated', () => {
    mockAuth.mockReturnValue({
      user: { id: 'u1', email: 'user@test.com' } as any,
      loading: false,
      session: null,
      signOut: vi.fn(),
    })
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div data-testid="secret">secret</div>
        </ProtectedRoute>
      </MemoryRouter>,
    )
    expect(screen.getByTestId('secret')).toBeInTheDocument()
  })

  it('shows loading spinner while session is being checked', () => {
    mockAuth.mockReturnValue({ user: null, loading: true, session: null, signOut: vi.fn() })
    const { container } = render(
      <MemoryRouter>
        <ProtectedRoute>
          <div data-testid="secret">secret</div>
        </ProtectedRoute>
      </MemoryRouter>,
    )
    expect(screen.queryByTestId('secret')).not.toBeInTheDocument()
    expect(container.firstChild).toBeTruthy()
  })
})

// ── LoginPage ────────────────────────────���────────────────────────────���────

describe('LoginPage', () => {
  it('renders email and password fields', () => {
    render(<MemoryRouter><LoginPage /></MemoryRouter>)
    expect(screen.getByText('Email address')).toBeInTheDocument()
    expect(screen.getByText('Password')).toBeInTheDocument()
  })

  it('renders sign-in submit button', () => {
    render(<MemoryRouter><LoginPage /></MemoryRouter>)
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('submit button is enabled initially', () => {
    render(<MemoryRouter><LoginPage /></MemoryRouter>)
    expect(screen.getByRole('button', { name: /sign in/i })).not.toBeDisabled()
  })
})

// ── SignupPage ──────────────────────────��──────────────────────────���───────

describe('SignupPage', () => {
  it('renders email and password fields', () => {
    render(<MemoryRouter><SignupPage /></MemoryRouter>)
    expect(screen.getByText('Email address')).toBeInTheDocument()
    expect(screen.getByText('Password')).toBeInTheDocument()
  })

  it('renders profile fields from spec', () => {
    render(<MemoryRouter><SignupPage /></MemoryRouter>)
    expect(screen.getByText('Display Name')).toBeInTheDocument()
  })

  it('renders sign-up submit button', () => {
    render(<MemoryRouter><SignupPage /></MemoryRouter>)
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('shows validation error for short password', async () => {
    render(<MemoryRouter><SignupPage /></MemoryRouter>)
    const passwordInput = screen.getByPlaceholderText(/min. 8|password/i)
    fireEvent.change(passwordInput, { target: { value: 'short' } })
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))
    await waitFor(() => {
      expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument()
    })
  })
})
