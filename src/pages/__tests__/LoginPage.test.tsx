import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../test/utils'
import userEvent from '@testing-library/user-event'
import LoginPage from '../LoginPage'

// Мокаем useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Мокаем useAuth
const mockLogin = vi.fn()
const mockUseAuth = {
  user: null,
  isLoading: false,
  login: mockLogin,
  logout: vi.fn(),
  isAuthenticated: false,
}

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth,
}))

// Мокаем useToast
const mockToast = vi.fn()
vi.mock('../../hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}))

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render login form', () => {
    render(<LoginPage />)
    
    expect(screen.getByText('Вход в систему')).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/пароль/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /войти/i })).toBeInTheDocument()
  })

  it('should show both user and employee tabs', () => {
    render(<LoginPage />)
    
    expect(screen.getByRole('tab', { name: /пользователь/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /сотрудник/i })).toBeInTheDocument()
  })

  it('should switch between user and employee tabs', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    // По умолчанию должна быть выбрана вкладка пользователя
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    
    // Переключаемся на вкладку сотрудника
    await user.click(screen.getByRole('tab', { name: /сотрудник/i }))
    
    expect(screen.getByLabelText(/email сотрудника/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /войти как сотрудник/i })).toBeInTheDocument()
  })

  it('should handle successful login', async () => {
    const user = userEvent.setup()
    mockLogin.mockResolvedValueOnce({})
    
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/пароль/i)
    const loginButton = screen.getByRole('button', { name: /войти/i })
    
    await user.type(emailInput, 'ivan@example.com')
    await user.type(passwordInput, 'password')
    await user.click(loginButton)
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'ivan@example.com',
        password: 'password'
      })
    })
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('should handle login error', async () => {
    const user = userEvent.setup()
    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'))
    
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/пароль/i)
    const loginButton = screen.getByRole('button', { name: /войти/i })
    
    await user.type(emailInput, 'invalid@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(loginButton)
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Ошибка входа",
        description: "Invalid credentials",
        variant: "destructive",
      })
    })
  })

  it('should show loading state during login', async () => {
    const user = userEvent.setup()
    let resolveLogin: () => void
    const loginPromise = new Promise<void>((resolve) => {
      resolveLogin = resolve
    })
    mockLogin.mockReturnValueOnce(loginPromise)
    
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/пароль/i)
    const loginButton = screen.getByRole('button', { name: /войти/i })
    
    await user.type(emailInput, 'ivan@example.com')
    await user.type(passwordInput, 'password')
    await user.click(loginButton)
    
    // Проверяем, что кнопка показывает состояние загрузки
    expect(screen.getByText(/вход\.\.\./i)).toBeInTheDocument()
    expect(loginButton).toBeDisabled()
    
    // Завершаем логин
    resolveLogin!()
    await waitFor(() => {
      expect(screen.queryByText(/вход\.\.\./i)).not.toBeInTheDocument()
    })
  })

  it('should toggle password visibility', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    const passwordInput = screen.getByLabelText(/пароль/i)
    const toggleButton = screen.getByRole('button', { name: '' }) // Кнопка переключения видимости
    
    // По умолчанию пароль скрыт
    expect(passwordInput).toHaveAttribute('type', 'password')
    
    // Нажимаем на кнопку переключения
    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')
    
    // Нажимаем еще раз
    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('should show link to signup page', () => {
    render(<LoginPage />)
    
    const signupLink = screen.getByRole('link', { name: /зарегистрироваться/i })
    expect(signupLink).toHaveAttribute('href', '/signup')
  })

  it('should require email and password', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    const loginButton = screen.getByRole('button', { name: /войти/i })
    
    // Пытаемся войти без заполнения полей
    await user.click(loginButton)
    
    // Поля должны быть помечены как обязательные
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/пароль/i)
    
    expect(emailInput).toBeRequired()
    expect(passwordInput).toBeRequired()
  })
})
