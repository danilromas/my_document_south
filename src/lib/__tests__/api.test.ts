import { describe, it, expect, beforeEach, vi } from 'vitest'
import { apiClient } from '../api'

describe('API Client', () => {
  beforeEach(() => {
    // Очищаем localStorage перед каждым тестом
    localStorage.clear()
    apiClient.clearToken()
  })

  describe('Token Management', () => {
    it('should set and get token', () => {
      const token = 'test-token-123'
      apiClient.setToken(token)
      expect(localStorage.getItem('authToken')).toBe(token)
    })

    it('should clear token', () => {
      apiClient.setToken('test-token')
      apiClient.clearToken()
      expect(localStorage.getItem('authToken')).toBeNull()
    })
  })

  describe('User Authentication', () => {
    it('should login user successfully', async () => {
      const loginData = {
        email: 'ivan@example.com',
        password: 'password'
      }

      const result = await apiClient.login(loginData)
      
      expect(result.token).toBe('mock-jwt-token')
      expect(result.user).toBeDefined()
      expect(result.user.email).toBe('ivan@example.com')
    })

    it('should throw error for invalid credentials', async () => {
      const loginData = {
        email: 'invalid@example.com',
        password: 'wrongpassword'
      }

      await expect(apiClient.login(loginData)).rejects.toThrow('Invalid credentials')
    })

    it('should register user successfully', async () => {
      const userData = {
        name: 'Тест',
        last_name: 'Пользователь',
        email: 'test@example.com',
        password: 'password123'
      }

      await expect(apiClient.userSignup(userData)).resolves.not.toThrow()
    })

    it('should register employee successfully', async () => {
      const employeeData = {
        name: 'Тест',
        last_name: 'Сотрудник',
        email: 'employee@company.com',
        password: 'password123',
        role_id: 1
      }

      await expect(apiClient.employeeSignup(employeeData)).resolves.not.toThrow()
    })
  })

  describe('User Management', () => {
    it('should get users list', async () => {
      const users = await apiClient.getUsers()
      expect(Array.isArray(users)).toBe(true)
      expect(users.length).toBeGreaterThan(0)
      expect(users[0]).toHaveProperty('id')
      expect(users[0]).toHaveProperty('email')
    })

    it('should get user by id', async () => {
      const user = await apiClient.getUser(1)
      expect(user).toBeDefined()
      expect(user.id).toBe(1)
      expect(user.email).toBe('ivan@example.com')
    })

    it('should throw error for non-existent user', async () => {
      await expect(apiClient.getUser(999)).rejects.toThrow('User not found')
    })
  })

  describe('Employee Management', () => {
    it('should get employees list', async () => {
      const employees = await apiClient.getEmployees()
      expect(Array.isArray(employees)).toBe(true)
      expect(employees.length).toBeGreaterThan(0)
      expect(employees[0]).toHaveProperty('id')
      expect(employees[0]).toHaveProperty('email')
    })

    it('should get employee by id', async () => {
      const employee = await apiClient.getEmployee(1)
      expect(employee).toBeDefined()
      expect(employee.id).toBe(1)
      expect(employee.email).toBe('alexey@company.com')
    })
  })

  describe('Services Management', () => {
    it('should get services list', async () => {
      const services = await apiClient.getServices()
      expect(Array.isArray(services)).toBe(true)
      expect(services.length).toBeGreaterThan(0)
      expect(services[0]).toHaveProperty('id')
      expect(services[0]).toHaveProperty('name')
    })

    it('should get service by id', async () => {
      const service = await apiClient.getService(1)
      expect(service).toBeDefined()
      expect(service.id).toBe(1)
      expect(service.name).toBe('Регистрация ИП')
    })
  })

  describe('Request Management', () => {
    it('should get requests list', async () => {
      const requests = await apiClient.getRequests()
      expect(Array.isArray(requests)).toBe(true)
      expect(requests.length).toBeGreaterThan(0)
      expect(requests[0]).toHaveProperty('id')
      expect(requests[0]).toHaveProperty('status')
    })

    it('should get requests with filters', async () => {
      const requests = await apiClient.getRequests({ owner_id: 1 })
      expect(Array.isArray(requests)).toBe(true)
      expect(requests.every(req => req.owner_id === 1)).toBe(true)
    })

    it('should get request by id', async () => {
      const request = await apiClient.getRequest(1)
      expect(request).toBeDefined()
      expect(request.id).toBe(1)
    })

    it('should create request successfully', async () => {
      const requestData = {
        service_id: 1,
        desired_at: '2024-12-31T23:59:59Z'
      }

      const request = await apiClient.createRequest(requestData)
      expect(request).toBeDefined()
      expect(request.service_id).toBe(1)
    })

    it('should update request status', async () => {
      const updatedRequest = await apiClient.updateRequestStatus(1, 1)
      expect(updatedRequest).toBeDefined()
      expect(updatedRequest.status).toBe(1)
    })

    it('should assign employee to request', async () => {
      const updatedRequest = await apiClient.assignEmployee(1, 1)
      expect(updatedRequest).toBeDefined()
      expect(updatedRequest.employee_id).toBe(1)
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      // Мокаем fetch для возврата ошибки
      const originalFetch = global.fetch
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      await expect(apiClient.getUsers()).rejects.toThrow('Network error')

      global.fetch = originalFetch
    })

    it('should handle HTTP error responses', async () => {
      // Мокаем fetch для возврата HTTP ошибки
      const originalFetch = global.fetch
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Internal server error' })
      })

      await expect(apiClient.getUsers()).rejects.toThrow('Internal server error')

      global.fetch = originalFetch
    })
  })
})
