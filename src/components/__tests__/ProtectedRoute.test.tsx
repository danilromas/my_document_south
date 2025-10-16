import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '../../test/utils'
import ProtectedRoute from '../ProtectedRoute'
import { mockUser, mockEmployee, mockManager, createMockAuthState } from '../../test/utils'

// Мокаем useLocation
const mockLocation = {
  pathname: '/dashboard',
  search: '',
  hash: '',
  state: null,
  key: 'test-key',
}

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useLocation: () => mockLocation,
    Navigate: ({ to, state }: { to: string; state?: any }) => (
      <div data-testid="navigate" data-to={to} data-state={JSON.stringify(state)}>
        Navigate to {to}
      </div>
    ),
  }
})

// Мокаем AuthContext
const mockUseAuth = vi.fn()
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}))

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render children when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      ...createMockAuthState(mockUser),
      isLoading: false,
    })

    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
  })

  it('should show loading state when auth is loading', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      login: vi.fn(),
      logout: vi.fn(),
    })

    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByText('Загрузка...')).toBeInTheDocument()
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
  })

  it('should redirect to login when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
    })

    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByTestId('navigate')).toBeInTheDocument()
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login')
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
  })

  it('should pass location state when redirecting', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
    })

    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    )

    const navigateElement = screen.getByTestId('navigate')
    expect(navigateElement).toHaveAttribute('data-state')
    
    const state = JSON.parse(navigateElement.getAttribute('data-state') || '{}')
    expect(state.from).toEqual(mockLocation)
  })

  it('should allow access when user type matches required type', () => {
    mockUseAuth.mockReturnValue({
      ...createMockAuthState(mockUser),
      isLoading: false,
    })

    render(
      <ProtectedRoute requiredUserType="user">
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
  })

  it('should redirect when user type does not match required type', () => {
    mockUseAuth.mockReturnValue({
      ...createMockAuthState(mockEmployee),
      isLoading: false,
    })

    render(
      <ProtectedRoute requiredUserType="user">
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByTestId('navigate')).toBeInTheDocument()
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/employee')
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
  })

  it('should redirect employee to dashboard when accessing manager route', () => {
    mockUseAuth.mockReturnValue({
      ...createMockAuthState(mockEmployee),
      isLoading: false,
    })

    render(
      <ProtectedRoute requiredUserType="manager">
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByTestId('navigate')).toBeInTheDocument()
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/employee')
  })

  it('should redirect user to dashboard when accessing employee route', () => {
    mockUseAuth.mockReturnValue({
      ...createMockAuthState(mockUser),
      isLoading: false,
    })

    render(
      <ProtectedRoute requiredUserType="employee">
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByTestId('navigate')).toBeInTheDocument()
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/dashboard')
  })

  it('should allow manager to access manager route', () => {
    mockUseAuth.mockReturnValue({
      ...createMockAuthState(mockManager),
      isLoading: false,
    })

    render(
      <ProtectedRoute requiredUserType="manager">
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
  })

  it('should allow employee to access employee route', () => {
    mockUseAuth.mockReturnValue({
      ...createMockAuthState(mockEmployee),
      isLoading: false,
    })

    render(
      <ProtectedRoute requiredUserType="employee">
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
  })

  it('should allow access without requiredUserType when authenticated', () => {
    mockUseAuth.mockReturnValue({
      ...createMockAuthState(mockUser),
      isLoading: false,
    })

    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
  })
})
