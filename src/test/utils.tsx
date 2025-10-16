import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { TooltipProvider } from '@/components/ui/tooltip'

// Создаем новый QueryClient для каждого теста
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
})

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialAuthState?: {
    user: any
    isAuthenticated: boolean
    isLoading: boolean
  }
  queryClient?: QueryClient
}

const AllTheProviders = ({ 
  children, 
  initialAuthState,
  queryClient 
}: { 
  children: React.ReactNode
  initialAuthState?: CustomRenderOptions['initialAuthState']
  queryClient?: QueryClient
}) => {
  const testQueryClient = queryClient || createTestQueryClient()
  
  // Мокаем AuthContext если нужно
  if (initialAuthState) {
    const mockAuthContext = {
      ...initialAuthState,
      login: vi.fn(),
      logout: vi.fn(),
    }
    
    return (
      <QueryClientProvider client={testQueryClient}>
        <BrowserRouter>
          <TooltipProvider>
            <div data-testid="auth-provider" data-auth-state={JSON.stringify(mockAuthContext)}>
              {children}
            </div>
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    )
  }
  
  return (
    <QueryClientProvider client={testQueryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { initialAuthState, queryClient, ...renderOptions } = options
  
  return render(ui, {
    wrapper: (props) => (
      <AllTheProviders 
        {...props} 
        initialAuthState={initialAuthState}
        queryClient={queryClient}
      />
    ),
    ...renderOptions,
  })
}

export * from '@testing-library/react'
export { customRender as render }

// Хелперы для тестирования
export const mockUser = {
  id: 1,
  name: 'Иван',
  last_name: 'Петров',
  middle_name: 'Иванович',
  email: 'ivan@example.com',
  type: 'user' as const,
  phone: '+7 (999) 123-45-67',
  inn: '123456789012',
  snils: '12345678901',
  tariff_id: 1,
}

export const mockEmployee = {
  id: 1,
  name: 'Алексей',
  last_name: 'Иванов',
  middle_name: 'Петрович',
  email: 'alexey@company.com',
  type: 'employee' as const,
  active: true,
  role_id: 1,
}

export const mockManager = {
  id: 2,
  name: 'Елена',
  last_name: 'Смирнова',
  middle_name: 'Александровна',
  email: 'elena@company.com',
  type: 'manager' as const,
  active: true,
  role_id: 2,
}

export const createMockAuthState = (user: any, isAuthenticated = true) => ({
  user,
  isAuthenticated,
  isLoading: false,
  login: vi.fn(),
  logout: vi.fn(),
})
