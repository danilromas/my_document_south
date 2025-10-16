import { http, HttpResponse } from 'msw'

// Mock данные
const mockUsers = [
  {
    id: 1,
    name: 'Иван',
    last_name: 'Петров',
    middle_name: 'Иванович',
    email: 'ivan@example.com',
    phone: '+7 (999) 123-45-67',
    inn: '123456789012',
    snils: '12345678901',
    tariff_id: 1,
    tariff: {
      id: 1,
      name: 'Бизнес',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: null,
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: null,
  },
]

const mockEmployees = [
  {
    id: 1,
    name: 'Алексей',
    last_name: 'Иванов',
    middle_name: 'Петрович',
    email: 'alexey@company.com',
    password: 'hashedpassword',
    active: true,
    role_id: 1,
    role: {
      id: 1,
      name: 'Менеджер',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: null,
    },
    services: [
      {
        id: 1,
        name: 'Регистрация ИП',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: null,
      },
    ],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: null,
  },
]

const mockServices = [
  {
    id: 1,
    name: 'Регистрация ИП',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: null,
  },
  {
    id: 2,
    name: 'Создание сайта',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: null,
  },
]

const mockRoles = [
  {
    id: 1,
    name: 'Менеджер',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: null,
  },
  {
    id: 2,
    name: 'Сотрудник',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: null,
  },
]

const mockTariffs = [
  {
    id: 1,
    name: 'Бизнес',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: null,
  },
  {
    id: 2,
    name: 'Стандарт',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: null,
  },
]

const mockRequests = [
  {
    id: 1,
    owner_id: 1,
    user: mockUsers[0],
    service_id: 1,
    service: mockServices[0],
    employee_id: 1,
    employee: mockEmployees[0],
    status: 0,
    desired_at: '2024-12-31T23:59:59Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: null,
    closed_at: null,
  },
]

export const handlers = [
  // Аутентификация
  http.post('http://localhost:3000/pub/auth/login', async ({ request }) => {
    const body = await request.json() as { email: string; password: string }
    
    // Простая проверка для тестов
    if (body.email === 'ivan@example.com' && body.password === 'password') {
      return HttpResponse.json({
        token: 'mock-jwt-token',
        user: mockUsers[0],
      })
    }
    
    if (body.email === 'alexey@company.com' && body.password === 'password') {
      return HttpResponse.json({
        token: 'mock-jwt-token',
        user: mockEmployees[0],
      })
    }
    
    return HttpResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  }),

  // Регистрация пользователя
  http.post('http://localhost:3000/pub/users/signup', async ({ request }) => {
    const body = await request.json()
    console.log('User signup:', body)
    return HttpResponse.json(null, { status: 201 })
  }),

  // Регистрация сотрудника
  http.post('http://localhost:3000/pub/employee/signup', async ({ request }) => {
    const body = await request.json()
    console.log('Employee signup:', body)
    return HttpResponse.json(null, { status: 201 })
  }),

  // Получение пользователей
  http.get('http://localhost:3000/prot/users', () => {
    return HttpResponse.json(mockUsers)
  }),

  // Получение пользователя по ID
  http.get('http://localhost:3000/prot/users/:id', ({ params }) => {
    const user = mockUsers.find(u => u.id === Number(params.id))
    if (user) {
      return HttpResponse.json(user)
    }
    return HttpResponse.json(
      { error: 'User not found' },
      { status: 404 }
    )
  }),

  // Получение сотрудников
  http.get('http://localhost:3000/prot/employee', () => {
    return HttpResponse.json(mockEmployees)
  }),

  // Получение сотрудника по ID
  http.get('http://localhost:3000/prot/employee/:id', ({ params }) => {
    const employee = mockEmployees.find(e => e.id === Number(params.id))
    if (employee) {
      return HttpResponse.json(employee)
    }
    return HttpResponse.json(
      { error: 'Employee not found' },
      { status: 404 }
    )
  }),

  // Получение услуг
  http.get('http://localhost:3000/prot/services/', () => {
    return HttpResponse.json(mockServices)
  }),

  // Получение ролей
  http.get('http://localhost:3000/prot/roles', () => {
    return HttpResponse.json(mockRoles)
  }),

  // Получение тарифов
  http.get('http://localhost:3000/prot/tariffs/', () => {
    return HttpResponse.json(mockTariffs)
  }),

  // Получение заявок
  http.get('http://localhost:3000/prot/request', ({ request }) => {
    const url = new URL(request.url)
    const ownerId = url.searchParams.get('owner_id')
    const employeeId = url.searchParams.get('employee_id')
    
    let filteredRequests = mockRequests
    
    if (ownerId) {
      filteredRequests = filteredRequests.filter(r => r.owner_id === Number(ownerId))
    }
    
    if (employeeId) {
      filteredRequests = filteredRequests.filter(r => r.employee_id === Number(employeeId))
    }
    
    return HttpResponse.json(filteredRequests)
  }),

  // Получение заявки по ID
  http.get('http://localhost:3000/prot/request/:id', ({ params }) => {
    const request = mockRequests.find(r => r.id === Number(params.id))
    if (request) {
      return HttpResponse.json(request)
    }
    return HttpResponse.json(
      { error: 'Request not found' },
      { status: 404 }
    )
  }),

  // Создание заявки
  http.post('http://localhost:3000/prot/request', async ({ request }) => {
    const body = await request.json()
    const newRequest = {
      id: mockRequests.length + 1,
      ...body,
      status: 0,
      created_at: new Date().toISOString(),
      updated_at: null,
      closed_at: null,
    }
    mockRequests.push(newRequest)
    return HttpResponse.json(newRequest, { status: 201 })
  }),

  // Обновление статуса заявки
  http.patch('http://localhost:3000/prot/request/:id/status', async ({ params, request }) => {
    const body = await request.json() as { status: number }
    const requestIndex = mockRequests.findIndex(r => r.id === Number(params.id))
    
    if (requestIndex !== -1) {
      mockRequests[requestIndex].status = body.status
      mockRequests[requestIndex].updated_at = new Date().toISOString()
      return HttpResponse.json(mockRequests[requestIndex])
    }
    
    return HttpResponse.json(
      { error: 'Request not found' },
      { status: 404 }
    )
  }),

  // Назначение сотрудника на заявку
  http.patch('http://localhost:3000/prot/request/:id/employee', async ({ params, request }) => {
    const body = await request.json() as { employee_id: number }
    const requestIndex = mockRequests.findIndex(r => r.id === Number(params.id))
    
    if (requestIndex !== -1) {
      const employee = mockEmployees.find(e => e.id === body.employee_id)
      mockRequests[requestIndex].employee_id = body.employee_id
      mockRequests[requestIndex].employee = employee
      mockRequests[requestIndex].updated_at = new Date().toISOString()
      return HttpResponse.json(mockRequests[requestIndex])
    }
    
    return HttpResponse.json(
      { error: 'Request not found' },
      { status: 404 }
    )
  }),
]
