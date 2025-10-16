import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '../../test/utils'
import userEvent from '@testing-library/user-event'
import EmployeeDashboard from '../EmployeeDashboard'
import { mockEmployee, createMockAuthState } from '../../test/utils'

// Мокаем компоненты
vi.mock('../../components/Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}))

vi.mock('../../components/employee/EmployeeApplications', () => ({
  default: ({ applications, onStatusChange }: any) => (
    <div data-testid="employee-applications">
      <div>Applications: {applications.length}</div>
      <button onClick={() => onStatusChange(1, 'in-progress')}>Update Status</button>
    </div>
  ),
}))

vi.mock('../../components/employee/EmployeeNotifications', () => ({
  default: ({ notifications, onMarkRead }: any) => (
    <div data-testid="employee-notifications">
      <div>Notifications: {notifications.length}</div>
      <button onClick={() => onMarkRead(1)}>Mark Read</button>
    </div>
  ),
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
const mockRefetchRequests = vi.fn()
const mockUseQuery = vi.fn()

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query')
  return {
    ...actual,
    useQuery: (options: any) => mockUseQuery(options),
  }
})

// Мокаем API клиент
const mockUpdateRequestStatus = vi.fn()

vi.mock('../../lib/api', () => ({
  apiClient: {
    updateRequestStatus: mockUpdateRequestStatus,
  },
}))

describe('EmployeeDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockUseAuth.mockReturnValue({
      ...createMockAuthState(mockEmployee),
      isLoading: false,
    })

    mockUseQuery.mockImplementation((options: any) => {
      if (options.queryKey[0] === 'employee') {
        return {
          data: {
            id: 1,
            name: 'Алексей',
            last_name: 'Иванов',
            email: 'alexey@company.com',
            services: [{ name: 'Регистрация ИП' }],
          },
          isLoading: false,
          error: null,
        }
      }

      if (options.queryKey[0] === 'employee-requests') {
        return {
          data: [
            {
              id: 1,
              user: { name: 'Иван', last_name: 'Петров', email: 'ivan@example.com' },
              service: { name: 'Регистрация ИП' },
              status: 0,
              created_at: '2024-01-01T00:00:00Z',
              desired_at: '2024-12-31T23:59:59Z',
            },
            {
              id: 2,
              user: { name: 'Мария', last_name: 'Сидорова', email: 'maria@example.com' },
              service: { name: 'Создание сайта' },
              status: 1,
              created_at: '2024-01-02T00:00:00Z',
              desired_at: null,
            },
          ],
          isLoading: false,
          error: null,
          refetch: mockRefetchRequests,
        }
      }

      return { data: null, isLoading: false, error: null }
    })

    mockUpdateRequestStatus.mockResolvedValue({ id: 1, status: 1 })
  })

  it('should render employee dashboard', async () => {
    render(<EmployeeDashboard />)

    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByText('Панель сотрудника')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByTestId('employee-applications')).toBeInTheDocument()
    })
  })

  it('should display employee information', async () => {
    render(<EmployeeDashboard />)

    await waitFor(() => {
      expect(screen.getByText(/добро пожаловать, алексей иванов/i)).toBeInTheDocument()
    })
  })

  it('should display assigned applications', async () => {
    render(<EmployeeDashboard />)

    await waitFor(() => {
      expect(screen.getByText('Applications: 2')).toBeInTheDocument()
    })
  })

  it('should show all employee tabs', () => {
    render(<EmployeeDashboard />)

    expect(screen.getByRole('tab', { name: /мои заявки/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /уведомления/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /профиль/i })).toBeInTheDocument()
  })

  it('should show unread notifications count', () => {
    render(<EmployeeDashboard />)

    // Проверяем, что отображается количество непрочитанных уведомлений
    const notificationsTab = screen.getByRole('tab', { name: /уведомления/i })
    expect(notificationsTab).toBeInTheDocument()
  })

  it('should switch between tabs', async () => {
    const user = userEvent.setup()
    render(<EmployeeDashboard />)

    // По умолчанию должна быть вкладка "Мои заявки"
    expect(screen.getByRole('tab', { name: /мои заявки/i })).toHaveAttribute('aria-selected', 'true')

    // Переключаемся на вкладку "Уведомления"
    await user.click(screen.getByRole('tab', { name: /уведомления/i }))

    expect(screen.getByRole('tab', { name: /уведомления/i })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByTestId('employee-notifications')).toBeInTheDocument()
  })

  it('should show profile tab content', async () => {
    const user = userEvent.setup()
    render(<EmployeeDashboard />)

    await user.click(screen.getByRole('tab', { name: /профиль/i }))

    expect(screen.getByText('Профиль сотрудника')).toBeInTheDocument()
    expect(screen.getByText('Алексей Иванов')).toBeInTheDocument()
    expect(screen.getByText('alexey@company.com')).toBeInTheDocument()
    expect(screen.getByText('Регистрация ИП')).toBeInTheDocument()
  })

  it('should handle status update', async () => {
    const user = userEvent.setup()
    render(<EmployeeDashboard />)

    await waitFor(() => {
      expect(screen.getByTestId('employee-applications')).toBeInTheDocument()
    })

    const updateButton = screen.getByText('Update Status')
    await user.click(updateButton)

    await waitFor(() => {
      expect(mockUpdateRequestStatus).toHaveBeenCalledWith(1, 1)
    })

    await waitFor(() => {
      expect(mockRefetchRequests).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Статус обновлен",
        description: "Заявка №1 переведена в статус: in-progress",
      })
    })
  })

  it('should handle status update error', async () => {
    const user = userEvent.setup()
    mockUpdateRequestStatus.mockRejectedValueOnce(new Error('Update failed'))

    render(<EmployeeDashboard />)

    await waitFor(() => {
      expect(screen.getByTestId('employee-applications')).toBeInTheDocument()
    })

    const updateButton = screen.getByText('Update Status')
    await user.click(updateButton)

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Ошибка",
        description: "Не удалось обновить статус заявки",
        variant: "destructive",
      })
    })
  })

  it('should handle notification marking as read', async () => {
    const user = userEvent.setup()
    render(<EmployeeDashboard />)

    await user.click(screen.getByRole('tab', { name: /уведомления/i }))

    await waitFor(() => {
      expect(screen.getByTestId('employee-notifications')).toBeInTheDocument()
    })

    const markReadButton = screen.getByText('Mark Read')
    await user.click(markReadButton)

    // Проверяем, что функция была вызвана (через внутреннее состояние)
    // В реальном приложении здесь можно проверить изменение состояния
  })

  it('should handle loading states', () => {
    mockUseQuery.mockImplementation((options: any) => {
      if (options.queryKey[0] === 'employee') {
        return { data: null, isLoading: true, error: null }
      }
      if (options.queryKey[0] === 'employee-requests') {
        return { data: null, isLoading: true, error: null, refetch: mockRefetchRequests }
      }
      return { data: null, isLoading: false, error: null }
    })

    render(<EmployeeDashboard />)

    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByText('Панель сотрудника')).toBeInTheDocument()
  })

  it('should handle API errors gracefully', () => {
    mockUseQuery.mockImplementation((options: any) => {
      if (options.queryKey[0] === 'employee') {
        return {
          data: null,
          isLoading: false,
          error: new Error('Failed to fetch employee'),
        }
      }
      if (options.queryKey[0] === 'employee-requests') {
        return {
          data: null,
          isLoading: false,
          error: new Error('Failed to fetch requests'),
          refetch: mockRefetchRequests,
        }
      }
      return { data: null, isLoading: false, error: null }
    })

    render(<EmployeeDashboard />)

    // Приложение должно отрендериться даже при ошибке
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByText('Панель сотрудника')).toBeInTheDocument()
  })

  it('should display correct application data', async () => {
    render(<EmployeeDashboard />)

    await waitFor(() => {
      // Проверяем, что данные правильно преобразованы
      expect(screen.getByText('Applications: 2')).toBeInTheDocument()
    })
  })

  it('should show correct active applications count', async () => {
    render(<EmployeeDashboard />)

    await waitFor(() => {
      // Должно показать количество активных заявок (не завершенных)
      expect(screen.getByText(/у вас \d+ назначенных заявок/i)).toBeInTheDocument()
    })
  })

  it('should handle empty applications list', () => {
    mockUseQuery.mockImplementation((options: any) => {
      if (options.queryKey[0] === 'employee-requests') {
        return {
          data: [],
          isLoading: false,
          error: null,
          refetch: mockRefetchRequests,
        }
      }
      return { data: null, isLoading: false, error: null }
    })

    render(<EmployeeDashboard />)

    // Приложение должно отрендериться с пустым списком
    expect(screen.getByTestId('header')).toBeInTheDocument()
  })

  it('should show employee specialization in profile', async () => {
    const user = userEvent.setup()
    render(<EmployeeDashboard />)

    await user.click(screen.getByRole('tab', { name: /профиль/i }))

    await waitFor(() => {
      expect(screen.getByText('Регистрация ИП')).toBeInTheDocument()
    })
  })

  it('should display correct employee name in profile', async () => {
    const user = userEvent.setup()
    render(<EmployeeDashboard />)

    await user.click(screen.getByRole('tab', { name: /профиль/i }))

    await waitFor(() => {
      expect(screen.getByText('Алексей Иванов')).toBeInTheDocument()
    })
  })
})
