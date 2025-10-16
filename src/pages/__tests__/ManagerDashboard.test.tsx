import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '../../test/utils'
import userEvent from '@testing-library/user-event'
import ManagerDashboard from '../ManagerDashboard'
import { mockManager, createMockAuthState } from '../../test/utils'

// Мокаем компоненты
vi.mock('../../components/Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}))

vi.mock('../../components/manager/KanbanBoard', () => ({
  default: ({ applications, onStatusChange, onAssignManager, managers }: any) => (
    <div data-testid="kanban-board">
      <div>Applications: {applications.length}</div>
      <div>Managers: {managers.length}</div>
      <button onClick={() => onStatusChange(1, 'in-progress')}>Update Status</button>
      <button onClick={() => onAssignManager(1, 'Test Manager')}>Assign Manager</button>
    </div>
  ),
}))

vi.mock('../../components/manager/ManagerAssignmentPanel', () => ({
  default: ({ managers, applications, onAssignManager }: any) => (
    <div data-testid="manager-assignment-panel">
      <div>Managers: {managers.length}</div>
      <div>Applications: {applications.length}</div>
    </div>
  ),
}))

vi.mock('../../components/manager/CRMAnalytics', () => ({
  default: ({ managers, applications }: any) => (
    <div data-testid="crm-analytics">
      <div>Managers: {managers.length}</div>
      <div>Applications: {applications.length}</div>
    </div>
  ),
}))

vi.mock('../../components/manager/ManagerSettings', () => ({
  default: () => <div data-testid="manager-settings">Manager Settings</div>,
}))

// Мокаем useToast
const mockToast = vi.fn()
vi.mock('../../hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}))

// Мокаем React Query
const mockRefetchRequests = vi.fn()
const mockRefetchEmployees = vi.fn()
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
const mockAssignEmployee = vi.fn()

vi.mock('../../lib/api', () => ({
  apiClient: {
    updateRequestStatus: mockUpdateRequestStatus,
    assignEmployee: mockAssignEmployee,
  },
}))

describe('ManagerDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockUseQuery.mockImplementation((options: any) => {
      if (options.queryKey[0] === 'all-requests') {
        return {
          data: [
            {
              id: 1,
              user: { name: 'Иван', last_name: 'Петров', email: 'ivan@example.com' },
              service: { name: 'Регистрация ИП' },
              status: 0,
              created_at: '2024-01-01T00:00:00Z',
              employee: null,
            },
            {
              id: 2,
              user: { name: 'Мария', last_name: 'Сидорова', email: 'maria@example.com' },
              service: { name: 'Создание сайта' },
              status: 1,
              created_at: '2024-01-02T00:00:00Z',
              employee: { name: 'Алексей', last_name: 'Иванов' },
            },
          ],
          isLoading: false,
          error: null,
          refetch: mockRefetchRequests,
        }
      }

      if (options.queryKey[0] === 'employees') {
        return {
          data: [
            {
              id: 1,
              name: 'Алексей',
              last_name: 'Иванов',
              email: 'alexey@company.com',
              services: [{ name: 'Регистрация ИП' }],
            },
            {
              id: 2,
              name: 'Елена',
              last_name: 'Смирнова',
              email: 'elena@company.com',
              services: [{ name: 'Создание сайта' }],
            },
          ],
          isLoading: false,
          error: null,
          refetch: mockRefetchEmployees,
        }
      }

      return { data: null, isLoading: false, error: null }
    })

    mockUpdateRequestStatus.mockResolvedValue({ id: 1, status: 1 })
    mockAssignEmployee.mockResolvedValue({ id: 1, employee_id: 1 })
  })

  it('should render manager dashboard', async () => {
    render(<ManagerDashboard />)

    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByText('Панель менеджера')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByTestId('kanban-board')).toBeInTheDocument()
    })
  })

  it('should display applications and employees data', async () => {
    render(<ManagerDashboard />)

    await waitFor(() => {
      expect(screen.getByText('Applications: 2')).toBeInTheDocument()
      expect(screen.getByText('Managers: 2')).toBeInTheDocument()
    })
  })

  it('should show all manager tabs', () => {
    render(<ManagerDashboard />)

    expect(screen.getByRole('tab', { name: /доска заявок/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /менеджеры/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /crm аналитика/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /настройки/i })).toBeInTheDocument()
  })

  it('should switch between tabs', async () => {
    const user = userEvent.setup()
    render(<ManagerDashboard />)

    // По умолчанию должна быть вкладка "Доска заявок"
    expect(screen.getByRole('tab', { name: /доска заявок/i })).toHaveAttribute('aria-selected', 'true')

    // Переключаемся на вкладку "Менеджеры"
    await user.click(screen.getByRole('tab', { name: /менеджеры/i }))

    expect(screen.getByRole('tab', { name: /менеджеры/i })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByTestId('manager-assignment-panel')).toBeInTheDocument()
  })

  it('should show CRM analytics tab', async () => {
    const user = userEvent.setup()
    render(<ManagerDashboard />)

    await user.click(screen.getByRole('tab', { name: /crm аналитика/i }))

    expect(screen.getByTestId('crm-analytics')).toBeInTheDocument()
  })

  it('should show manager settings tab', async () => {
    const user = userEvent.setup()
    render(<ManagerDashboard />)

    await user.click(screen.getByRole('tab', { name: /настройки/i }))

    expect(screen.getByTestId('manager-settings')).toBeInTheDocument()
  })

  it('should handle status update', async () => {
    const user = userEvent.setup()
    render(<ManagerDashboard />)

    await waitFor(() => {
      expect(screen.getByTestId('kanban-board')).toBeInTheDocument()
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

  it('should handle manager assignment', async () => {
    const user = userEvent.setup()
    render(<ManagerDashboard />)

    await waitFor(() => {
      expect(screen.getByTestId('kanban-board')).toBeInTheDocument()
    })

    const assignButton = screen.getByText('Assign Manager')
    await user.click(assignButton)

    await waitFor(() => {
      expect(mockAssignEmployee).toHaveBeenCalledWith(1, 1)
    })

    await waitFor(() => {
      expect(mockRefetchRequests).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Сотрудник назначен",
        description: "Заявка №1 назначена сотруднику Test Manager",
      })
    })
  })

  it('should handle status update error', async () => {
    const user = userEvent.setup()
    mockUpdateRequestStatus.mockRejectedValueOnce(new Error('Update failed'))

    render(<ManagerDashboard />)

    await waitFor(() => {
      expect(screen.getByTestId('kanban-board')).toBeInTheDocument()
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

  it('should handle manager assignment error', async () => {
    const user = userEvent.setup()
    mockAssignEmployee.mockRejectedValueOnce(new Error('Assignment failed'))

    render(<ManagerDashboard />)

    await waitFor(() => {
      expect(screen.getByTestId('kanban-board')).toBeInTheDocument()
    })

    const assignButton = screen.getByText('Assign Manager')
    await user.click(assignButton)

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Ошибка",
        description: "Не удалось назначить сотрудника",
        variant: "destructive",
      })
    })
  })

  it('should handle loading states', () => {
    mockUseQuery.mockImplementation((options: any) => {
      if (options.queryKey[0] === 'all-requests') {
        return { data: null, isLoading: true, error: null, refetch: mockRefetchRequests }
      }
      if (options.queryKey[0] === 'employees') {
        return { data: null, isLoading: true, error: null, refetch: mockRefetchEmployees }
      }
      return { data: null, isLoading: false, error: null }
    })

    render(<ManagerDashboard />)

    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByText('Панель менеджера')).toBeInTheDocument()
  })

  it('should handle API errors gracefully', () => {
    mockUseQuery.mockImplementation((options: any) => {
      if (options.queryKey[0] === 'all-requests') {
        return {
          data: null,
          isLoading: false,
          error: new Error('Failed to fetch requests'),
          refetch: mockRefetchRequests,
        }
      }
      return { data: null, isLoading: false, error: null }
    })

    render(<ManagerDashboard />)

    // Приложение должно отрендериться даже при ошибке
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByText('Панель менеджера')).toBeInTheDocument()
  })

  it('should display correct application data', async () => {
    render(<ManagerDashboard />)

    await waitFor(() => {
      // Проверяем, что данные правильно преобразованы
      expect(screen.getByText('Applications: 2')).toBeInTheDocument()
    })
  })

  it('should display correct manager data', async () => {
    render(<ManagerDashboard />)

    await waitFor(() => {
      // Проверяем, что данные сотрудников правильно преобразованы
      expect(screen.getByText('Managers: 2')).toBeInTheDocument()
    })
  })
})
