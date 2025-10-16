import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '../../test/utils'
import userEvent from '@testing-library/user-event'
import NewApplicationModal from '../NewApplicationModal'

// Мокаем useToast
const mockToast = vi.fn()
vi.mock('../../hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}))

// Мокаем API клиент
const mockGetServices = vi.fn()
const mockCreateRequest = vi.fn()

vi.mock('../../lib/api', () => ({
  apiClient: {
    getServices: mockGetServices,
    createRequest: mockCreateRequest,
  },
}))

describe('NewApplicationModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetServices.mockResolvedValue([
      { id: 1, name: 'Регистрация ИП' },
      { id: 2, name: 'Создание сайта' },
    ])
    mockCreateRequest.mockResolvedValue({ id: 1, service_id: 1 })
  })

  it('should render modal when open', () => {
    render(
      <NewApplicationModal 
        open={true} 
        onOpenChange={vi.fn()} 
      />
    )

    expect(screen.getByText('Создать новую заявку')).toBeInTheDocument()
    expect(screen.getByText('Заполните форму для создания новой заявки')).toBeInTheDocument()
  })

  it('should not render modal when closed', () => {
    render(
      <NewApplicationModal 
        open={false} 
        onOpenChange={vi.fn()} 
      />
    )

    expect(screen.queryByText('Создать новую заявку')).not.toBeInTheDocument()
  })

  it('should load services on open', async () => {
    render(
      <NewApplicationModal 
        open={true} 
        onOpenChange={vi.fn()} 
      />
    )

    await waitFor(() => {
      expect(mockGetServices).toHaveBeenCalled()
    })
  })

  it('should display services in select', async () => {
    render(
      <NewApplicationModal 
        open={true} 
        onOpenChange={vi.fn()} 
      />
    )

    await waitFor(() => {
      expect(mockGetServices).toHaveBeenCalled()
    })

    const serviceSelect = screen.getByRole('combobox', { name: /услуга/i })
    expect(serviceSelect).toBeInTheDocument()

    // Кликаем на селект
    await userEvent.click(serviceSelect)

    await waitFor(() => {
      expect(screen.getByText('Регистрация ИП')).toBeInTheDocument()
      expect(screen.getByText('Создание сайта')).toBeInTheDocument()
    })
  })

  it('should create request successfully', async () => {
    const user = userEvent.setup()
    const mockOnOpenChange = vi.fn()
    const mockOnRequestCreated = vi.fn()

    render(
      <NewApplicationModal 
        open={true} 
        onOpenChange={mockOnOpenChange}
        onRequestCreated={mockOnRequestCreated}
      />
    )

    await waitFor(() => {
      expect(mockGetServices).toHaveBeenCalled()
    })

    // Выбираем услугу
    const serviceSelect = screen.getByRole('combobox', { name: /услуга/i })
    await user.click(serviceSelect)

    await waitFor(() => {
      expect(screen.getByText('Регистрация ИП')).toBeInTheDocument()
    })

    await user.click(screen.getByText('Регистрация ИП'))

    // Заполняем дату
    const dateInput = screen.getByLabelText(/желаемая дата завершения/i)
    await user.type(dateInput, '2024-12-31T10:00')

    // Отправляем форму
    const submitButton = screen.getByRole('button', { name: /создать заявку/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockCreateRequest).toHaveBeenCalledWith({
        service_id: 1,
        desired_at: '2024-12-31T10:00',
      })
    })

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Заявка создана",
        description: "Ваша заявка успешно отправлена на рассмотрение",
      })
    })

    await waitFor(() => {
      expect(mockOnOpenChange).toHaveBeenCalledWith(false)
    })

    await waitFor(() => {
      expect(mockOnRequestCreated).toHaveBeenCalled()
    })
  })

  it('should show error when service is not selected', async () => {
    const user = userEvent.setup()

    render(
      <NewApplicationModal 
        open={true} 
        onOpenChange={vi.fn()} 
      />
    )

    await waitFor(() => {
      expect(mockGetServices).toHaveBeenCalled()
    })

    // Пытаемся отправить форму без выбора услуги
    const submitButton = screen.getByRole('button', { name: /создать заявку/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Ошибка",
        description: "Пожалуйста, выберите услугу",
        variant: "destructive",
      })
    })

    expect(mockCreateRequest).not.toHaveBeenCalled()
  })

  it('should handle creation error', async () => {
    const user = userEvent.setup()
    mockCreateRequest.mockRejectedValueOnce(new Error('Creation failed'))

    render(
      <NewApplicationModal 
        open={true} 
        onOpenChange={vi.fn()} 
      />
    )

    await waitFor(() => {
      expect(mockGetServices).toHaveBeenCalled()
    })

    // Выбираем услугу
    const serviceSelect = screen.getByRole('combobox', { name: /услуга/i })
    await user.click(serviceSelect)

    await waitFor(() => {
      expect(screen.getByText('Регистрация ИП')).toBeInTheDocument()
    })

    await user.click(screen.getByText('Регистрация ИП'))

    // Отправляем форму
    const submitButton = screen.getByRole('button', { name: /создать заявку/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Ошибка создания заявки",
        description: "Creation failed",
        variant: "destructive",
      })
    })
  })

  it('should show loading state during creation', async () => {
    const user = userEvent.setup()
    let resolveCreate: () => void
    const createPromise = new Promise<void>((resolve) => {
      resolveCreate = resolve
    })
    mockCreateRequest.mockReturnValueOnce(createPromise)

    render(
      <NewApplicationModal 
        open={true} 
        onOpenChange={vi.fn()} 
      />
    )

    await waitFor(() => {
      expect(mockGetServices).toHaveBeenCalled()
    })

    // Выбираем услугу
    const serviceSelect = screen.getByRole('combobox', { name: /услуга/i })
    await user.click(serviceSelect)

    await waitFor(() => {
      expect(screen.getByText('Регистрация ИП')).toBeInTheDocument()
    })

    await user.click(screen.getByText('Регистрация ИП'))

    // Отправляем форму
    const submitButton = screen.getByRole('button', { name: /создать заявку/i })
    await user.click(submitButton)

    // Проверяем состояние загрузки
    expect(screen.getByText(/создание\.\.\./i)).toBeInTheDocument()
    expect(submitButton).toBeDisabled()

    // Завершаем создание
    resolveCreate!()
    await waitFor(() => {
      expect(screen.queryByText(/создание\.\.\./i)).not.toBeInTheDocument()
    })
  })

  it('should close modal when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const mockOnOpenChange = vi.fn()

    render(
      <NewApplicationModal 
        open={true} 
        onOpenChange={mockOnOpenChange} 
      />
    )

    const cancelButton = screen.getByRole('button', { name: /отмена/i })
    await user.click(cancelButton)

    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  it('should reset form after successful creation', async () => {
    const user = userEvent.setup()
    const mockOnOpenChange = vi.fn()

    render(
      <NewApplicationModal 
        open={true} 
        onOpenChange={mockOnOpenChange}
      />
    )

    await waitFor(() => {
      expect(mockGetServices).toHaveBeenCalled()
    })

    // Выбираем услугу
    const serviceSelect = screen.getByRole('combobox', { name: /услуга/i })
    await user.click(serviceSelect)

    await waitFor(() => {
      expect(screen.getByText('Регистрация ИП')).toBeInTheDocument()
    })

    await user.click(screen.getByText('Регистрация ИП'))

    // Заполняем дату
    const dateInput = screen.getByLabelText(/желаемая дата завершения/i)
    await user.type(dateInput, '2024-12-31T10:00')

    // Отправляем форму
    const submitButton = screen.getByRole('button', { name: /создать заявку/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockCreateRequest).toHaveBeenCalled()
    })

    // Проверяем, что форма была сброшена
    await waitFor(() => {
      expect(serviceSelect).toHaveValue('')
    })
  })

  it('should handle services loading error', async () => {
    mockGetServices.mockRejectedValueOnce(new Error('Failed to load services'))

    render(
      <NewApplicationModal 
        open={true} 
        onOpenChange={vi.fn()} 
      />
    )

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Ошибка",
        description: "Не удалось загрузить список услуг",
        variant: "destructive",
      })
    })
  })
})
