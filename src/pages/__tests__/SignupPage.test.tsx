import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '../../test/utils'
import userEvent from '@testing-library/user-event'
import SignupPage from '../SignupPage'

// Мокаем useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Мокаем useToast
const mockToast = vi.fn()
vi.mock('../../hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}))

// Мокаем API клиент
const mockUserSignup = vi.fn()
const mockEmployeeSignup = vi.fn()
const mockGetTariffs = vi.fn()
const mockGetRoles = vi.fn()

vi.mock('../../lib/api', () => ({
  apiClient: {
    userSignup: mockUserSignup,
    employeeSignup: mockEmployeeSignup,
    getTariffs: mockGetTariffs,
    getRoles: mockGetRoles,
  },
}))

describe('SignupPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetTariffs.mockResolvedValue([
      { id: 1, name: 'Бизнес' },
      { id: 2, name: 'Стандарт' }
    ])
    mockGetRoles.mockResolvedValue([
      { id: 1, name: 'Менеджер' },
      { id: 2, name: 'Сотрудник' }
    ])
  })

  it('should render signup form', () => {
    render(<SignupPage />)
    
    expect(screen.getByText('Регистрация')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /пользователь/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /сотрудник/i })).toBeInTheDocument()
  })

  it('should show user registration form by default', () => {
    render(<SignupPage />)
    
    expect(screen.getByLabelText(/имя \*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/фамилия \*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/отчество/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email \*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/телефон/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/инн/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/снилс/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/тариф/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/пароль \*/i)).toBeInTheDocument()
  })

  it('should switch to employee registration form', async () => {
    const user = userEvent.setup()
    render(<SignupPage />)
    
    await user.click(screen.getByRole('tab', { name: /сотрудник/i }))
    
    expect(screen.getByLabelText(/имя \*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/фамилия \*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email \*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/роль \*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/пароль \*/i)).toBeInTheDocument()
    
    // Поля, которые есть только у пользователей, не должны быть видны
    expect(screen.queryByLabelText(/телефон/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/инн/i)).not.toBeInTheDocument()
  })

  it('should handle successful user registration', async () => {
    const user = userEvent.setup()
    mockUserSignup.mockResolvedValueOnce({})
    
    render(<SignupPage />)
    
    // Заполняем форму пользователя
    await user.type(screen.getByLabelText(/имя \*/i), 'Иван')
    await user.type(screen.getByLabelText(/фамилия \*/i), 'Петров')
    await user.type(screen.getByLabelText(/email \*/i), 'ivan@example.com')
    await user.type(screen.getByLabelText(/пароль \*/i), 'password123')
    
    // Выбираем тариф
    await user.click(screen.getByRole('combobox', { name: /тариф/i }))
    await waitFor(() => {
      expect(screen.getByText('Бизнес')).toBeInTheDocument()
    })
    await user.click(screen.getByText('Бизнес'))
    
    // Отправляем форму
    await user.click(screen.getByRole('button', { name: /зарегистрироваться/i }))
    
    await waitFor(() => {
      expect(mockUserSignup).toHaveBeenCalledWith({
        name: 'Иван',
        last_name: 'Петров',
        middle_name: '',
        email: 'ivan@example.com',
        phone: '',
        password: 'password123',
        inn: '',
        snils: '',
        tariff_id: 1,
      })
    })
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })
  })

  it('should handle successful employee registration', async () => {
    const user = userEvent.setup()
    mockEmployeeSignup.mockResolvedValueOnce({})
    
    render(<SignupPage />)
    
    // Переключаемся на вкладку сотрудника
    await user.click(screen.getByRole('tab', { name: /сотрудник/i }))
    
    // Заполняем форму сотрудника
    await user.type(screen.getByLabelText(/имя \*/i), 'Алексей')
    await user.type(screen.getByLabelText(/фамилия \*/i), 'Иванов')
    await user.type(screen.getByLabelText(/email \*/i), 'alexey@company.com')
    await user.type(screen.getByLabelText(/пароль \*/i), 'password123')
    
    // Выбираем роль
    await user.click(screen.getByRole('combobox', { name: /роль/i }))
    await waitFor(() => {
      expect(screen.getByText('Менеджер')).toBeInTheDocument()
    })
    await user.click(screen.getByText('Менеджер'))
    
    // Отправляем форму
    await user.click(screen.getByRole('button', { name: /зарегистрировать сотрудника/i }))
    
    await waitFor(() => {
      expect(mockEmployeeSignup).toHaveBeenCalledWith({
        name: 'Алексей',
        last_name: 'Иванов',
        middle_name: '',
        email: 'alexey@company.com',
        password: 'password123',
        active: true,
        role_id: 1,
      })
    })
  })

  it('should handle registration error', async () => {
    const user = userEvent.setup()
    mockUserSignup.mockRejectedValueOnce(new Error('Email already exists'))
    
    render(<SignupPage />)
    
    // Заполняем форму
    await user.type(screen.getByLabelText(/имя \*/i), 'Иван')
    await user.type(screen.getByLabelText(/фамилия \*/i), 'Петров')
    await user.type(screen.getByLabelText(/email \*/i), 'existing@example.com')
    await user.type(screen.getByLabelText(/пароль \*/i), 'password123')
    
    // Отправляем форму
    await user.click(screen.getByRole('button', { name: /зарегистрироваться/i }))
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Ошибка регистрации",
        description: "Email already exists",
        variant: "destructive",
      })
    })
  })

  it('should show loading state during registration', async () => {
    const user = userEvent.setup()
    let resolveSignup: () => void
    const signupPromise = new Promise<void>((resolve) => {
      resolveSignup = resolve
    })
    mockUserSignup.mockReturnValueOnce(signupPromise)
    
    render(<SignupPage />)
    
    // Заполняем форму
    await user.type(screen.getByLabelText(/имя \*/i), 'Иван')
    await user.type(screen.getByLabelText(/фамилия \*/i), 'Петров')
    await user.type(screen.getByLabelText(/email \*/i), 'ivan@example.com')
    await user.type(screen.getByLabelText(/пароль \*/i), 'password123')
    
    // Отправляем форму
    await user.click(screen.getByRole('button', { name: /зарегистрироваться/i }))
    
    // Проверяем состояние загрузки
    expect(screen.getByText(/регистрация\.\.\./i)).toBeInTheDocument()
    
    // Завершаем регистрацию
    resolveSignup!()
    await waitFor(() => {
      expect(screen.queryByText(/регистрация\.\.\./i)).not.toBeInTheDocument()
    })
  })

  it('should require mandatory fields', async () => {
    const user = userEvent.setup()
    render(<SignupPage />)
    
    const submitButton = screen.getByRole('button', { name: /зарегистрироваться/i })
    
    // Пытаемся отправить форму без заполнения обязательных полей
    await user.click(submitButton)
    
    // Проверяем, что поля помечены как обязательные
    expect(screen.getByLabelText(/имя \*/i)).toBeRequired()
    expect(screen.getByLabelText(/фамилия \*/i)).toBeRequired()
    expect(screen.getByLabelText(/email \*/i)).toBeRequired()
    expect(screen.getByLabelText(/пароль \*/i)).toBeRequired()
  })

  it('should toggle password visibility', async () => {
    const user = userEvent.setup()
    render(<SignupPage />)
    
    const passwordInput = screen.getByLabelText(/пароль \*/i)
    const toggleButtons = screen.getAllByRole('button', { name: '' }) // Кнопки переключения видимости
    
    // По умолчанию пароль скрыт
    expect(passwordInput).toHaveAttribute('type', 'password')
    
    // Нажимаем на кнопку переключения
    await user.click(toggleButtons[0])
    expect(passwordInput).toHaveAttribute('type', 'text')
    
    // Нажимаем еще раз
    await user.click(toggleButtons[0])
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('should show link to login page', () => {
    render(<SignupPage />)
    
    const loginLink = screen.getByRole('link', { name: /войти/i })
    expect(loginLink).toHaveAttribute('href', '/login')
  })
})
