import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '../../test/utils'
import userEvent from '@testing-library/user-event'
import Dashboard from '../Dashboard'
import { mockUser, createMockAuthState } from '../../test/utils'

// Мокаем компоненты
vi.mock('../../components/Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}))

vi.mock('../../components/NewApplicationModal', () => ({
  default: ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => (
    <div data-testid="new-application-modal" data-open={open}>
      <button onClick={() => onOpenChange(false)}>Close Modal</button>
    </div>
  ),
}))

vi.mock('../../components/dashboard/UserProfileCard', () => ({
  default: ({ userInfo }: { userInfo: any }) => (
    <div data-testid="user-profile-card">
      <div>{userInfo.name}</div>
      <div>{userInfo.email}</div>
    </div>
  ),
}))

vi.mock('../../components/dashboard/QuickActionsCard', () => ({
  default: ({ onNewApplication }: { onNewApplication: () => void }) => (
    <div data-testid="quick-actions-card">
      <button onClick={onNewApplication}>New Application</button>
    </div>
  ),
}))

vi.mock('../../components/dashboard/RecentApplicationsCard', () => ({
  default: ({ applications }: { applications: any[] }) => (
    <div data-testid="recent-applications-card">
      {applications.map(app => (
        <div key={app.id}>{app.type} - {app.status}</div>
      ))}
    </div>
  ),
}))

vi.mock('../../components/dashboard/ApplicationsList', () => ({
  default: ({ applications }: { applications: any[] }) => (
    <div data-testid="applications-list">
      {applications.map(app => (
        <div key={app.id}>{app.type} - {app.status}</div>
      ))}
    </div>
  ),
}))

vi.mock('../../components/dashboard/PersonalDataForm', () => ({
  default: () => <div data-testid="personal-data-form">Personal Data Form</div>,
}))

vi.mock('../../components/dashboard/ChatSection', () => ({
  default: () => <div data-testid="chat-section">Chat Section</div>,
}))

vi.mock('../../components/dashboard/PaymentsSection', () => ({
  default: () => <div data-testid="payments-section">Payments Section</div>,
}))

// Мокаем useAuth
const mockUseAuth = vi.fn()
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}))

// Мокаем useToast
const mockToast = vi.fn()
vi.mock('../../hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}))

// Мокаем React Query
const mockRefetch = vi.fn()
const mockUseQuery = vi.fn()

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query')
  return {
    ...actual,
    useQuery: (options: any) => mockUseQuery(options),
  }
})

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    mockUseAuth.mockReturnValue({
      ...createMockAuthState(mockUser),
      isLoading: false,
    })

    mockUseQuery.mockImplementation((options: any) => {
      if (options.queryKey[0] === 'user') {
        return {
          data: {
            id: 1,
            name: 'Иван',
            last_name: 'Петров',
            email: 'ivan@example.com',
            phone: '+7 (999) 123-45-67',
            tariff: { name: 'Бизнес' },
            created_at: '2024-01-01T00:00:00Z',
          },
          isLoading: false,
          error: null,
        }
      }
      
      if (options.queryKey[0] === 'requests') {
        return {
          data: [
            {
              id: 1,
              service: { name: 'Регистрация ИП' },
              status: 0,
              created_at: '2024-01-01T00:00:00Z',
            },
            {
              id: 2,
              service: { name: 'Создание сайта' },
              status: 1,
              created_at: '2024-01-02T00:00:00Z',
            },
          ],
          isLoading: false,
          error: null,
          refetch: mockRefetch,
        }
      }
      
      return { data: null, isLoading: false, error: null }
    })
  })

  it('should render dashboard with user information', async () => {
    render(<Dashboard />)
    
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByText('Личный кабинет')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByTestId('user-profile-card')).toBeInTheDocument()
    })
  })

  it('should display user profile information', async () => {
    render(<Dashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Иван Петров')).toBeInTheDocument()
      expect(screen.getByText('ivan@example.com')).toBeInTheDocument()
    })
  })

  it('should display applications from API', async () => {
    render(<Dashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Регистрация ИП - pending')).toBeInTheDocument()
      expect(screen.getByText('Создание сайта - in-progress')).toBeInTheDocument()
    })
  })

  it('should show loading state for user data', () => {
    mockUseQuery.mockImplementation((options: any) => {
      if (options.queryKey[0] === 'user') {
        return { data: null, isLoading: true, error: null }
      }
      return { data: null, isLoading: false, error: null }
    })

    render(<Dashboard />)
    
    expect(screen.getByText('Загрузка...')).toBeInTheDocument()
  })

  it('should open new application modal when button is clicked', async () => {
    const user = userEvent.setup()
    render(<Dashboard />)
    
    await waitFor(() => {
      expect(screen.getByTestId('quick-actions-card')).toBeInTheDocument()
    })
    
    const newAppButton = screen.getByText('New Application')
    await user.click(newAppButton)
    
    expect(screen.getByTestId('new-application-modal')).toBeInTheDocument()
    expect(screen.getByTestId('new-application-modal')).toHaveAttribute('data-open', 'true')
  })

  it('should switch between tabs', async () => {
    const user = userEvent.setup()
    render(<Dashboard />)
    
    // По умолчанию должна быть вкладка "Обзор"
    expect(screen.getByRole('tab', { name: /обзор/i })).toHaveAttribute('aria-selected', 'true')
    
    // Переключаемся на вкладку "Заявки"
    await user.click(screen.getByRole('tab', { name: /заявки/i }))
    
    expect(screen.getByRole('tab', { name: /заявки/i })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByTestId('applications-list')).toBeInTheDocument()
  })

  it('should show all available tabs', () => {
    render(<Dashboard />)
    
    expect(screen.getByRole('tab', { name: /обзор/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /заявки/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /документы/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /чат/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /платежи/i })).toBeInTheDocument()
  })

  it('should show documents tab content', async () => {
    const user = userEvent.setup()
    render(<Dashboard />)
    
    await user.click(screen.getByRole('tab', { name: /документы/i }))
    
    expect(screen.getByTestId('personal-data-form')).toBeInTheDocument()
  })

  it('should show chat tab content', async () => {
    const user = userEvent.setup()
    render(<Dashboard />)
    
    await user.click(screen.getByRole('tab', { name: /чат/i }))
    
    expect(screen.getByTestId('chat-section')).toBeInTheDocument()
  })

  it('should show payments tab content', async () => {
    const user = userEvent.setup()
    render(<Dashboard />)
    
    await user.click(screen.getByRole('tab', { name: /платежи/i }))
    
    expect(screen.getByTestId('payments-section')).toBeInTheDocument()
  })

  it('should handle request creation callback', async () => {
    const user = userEvent.setup()
    render(<Dashboard />)
    
    // Симулируем создание заявки
    const newAppButton = screen.getByText('New Application')
    await user.click(newAppButton)
    
    // Закрываем модальное окно (симулируем создание заявки)
    const closeButton = screen.getByText('Close Modal')
    await user.click(closeButton)
    
    // Проверяем, что был вызван refetch
    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalled()
    })
  })

  it('should handle API error gracefully', () => {
    mockUseQuery.mockImplementation((options: any) => {
      if (options.queryKey[0] === 'user') {
        return {
          data: null,
          isLoading: false,
          error: new Error('Failed to fetch user'),
        }
      }
      return { data: null, isLoading: false, error: null }
    })

    render(<Dashboard />)
    
    // Приложение должно отрендериться даже при ошибке
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByText('Личный кабинет')).toBeInTheDocument()
  })

  it('should show create application button in applications tab', async () => {
    const user = userEvent.setup()
    render(<Dashboard />)
    
    await user.click(screen.getByRole('tab', { name: /заявки/i }))
    
    expect(screen.getByRole('button', { name: /создать заявку/i })).toBeInTheDocument()
  })

  it('should handle empty applications list', () => {
    mockUseQuery.mockImplementation((options: any) => {
      if (options.queryKey[0] === 'requests') {
        return {
          data: [],
          isLoading: false,
          error: null,
          refetch: mockRefetch,
        }
      }
      return { data: null, isLoading: false, error: null }
    })

    render(<Dashboard />)
    
    // Приложение должно отрендериться с пустым списком
    expect(screen.getByTestId('header')).toBeInTheDocument()
  })
})
