import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '../utils'
import { MemoryRouter } from 'react-router-dom'
import ProtectedRoute from '../../components/ProtectedRoute'
import { mockUser, mockEmployee, mockManager, createMockAuthState } from '../utils'

// Мокаем useAuth
const mockUseAuth = vi.fn()
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}))

describe('Auth Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render children when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      ...createMockAuthState(mockUser),
      isLoading: false,
    })

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    )

    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
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
      <MemoryRouter>
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    )

    // Проверяем, что происходит редирект (в реальном приложении это было бы Navigate)
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
  })

  it('should allow access when user type matches required type', () => {
    mockUseAuth.mockReturnValue({
      ...createMockAuthState(mockUser),
      isLoading: false,
    })

    render(
      <MemoryRouter>
        <ProtectedRoute requiredUserType="user">
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    )

    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
  })

  it('should redirect when user type does not match required type', () => {
    mockUseAuth.mockReturnValue({
      ...createMockAuthState(mockEmployee),
      isLoading: false,
    })

    render(
      <MemoryRouter>
        <ProtectedRoute requiredUserType="user">
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    )

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
  })

  it('should allow manager to access manager route', () => {
    mockUseAuth.mockReturnValue({
      ...createMockAuthState(mockManager),
      isLoading: false,
    })

    render(
      <MemoryRouter>
        <ProtectedRoute requiredUserType="manager">
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    )

    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
  })

  it('should allow employee to access employee route', () => {
    mockUseAuth.mockReturnValue({
      ...createMockAuthState(mockEmployee),
      isLoading: false,
    })

    render(
      <MemoryRouter>
        <ProtectedRoute requiredUserType="employee">
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    )

    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
  })

  it('should show loading state during authentication check', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      login: vi.fn(),
      logout: vi.fn(),
    })

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    )

    expect(screen.getByText('Загрузка...')).toBeInTheDocument()
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
  })

  it('should allow access without requiredUserType when authenticated', () => {
    mockUseAuth.mockReturnValue({
      ...createMockAuthState(mockUser),
      isLoading: false,
    })

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    )

    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
  })
})