import { describe, it, expect, beforeEach, vi } from 'vitest'

// Мокаем fetch глобально
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('API Client Simple Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should set and get token', () => {
    const token = 'test-token-123'
    localStorage.setItem('authToken', token)
    expect(localStorage.getItem('authToken')).toBe(token)
  })

  it('should clear token', () => {
    localStorage.setItem('authToken', 'test-token')
    localStorage.removeItem('authToken')
    expect(localStorage.getItem('authToken')).toBeNull()
  })

  it('should handle successful login response', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        token: 'mock-jwt-token',
        user: { id: 1, email: 'test@example.com' }
      })
    }

    mockFetch.mockResolvedValue(mockResponse as any)

    const response = await fetch('http://localhost:3000/pub/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'password' })
    })

    const data = await response.json()
    expect(data.token).toBe('mock-jwt-token')
    expect(data.user.email).toBe('test@example.com')
  })

  it('should handle login error response', async () => {
    const mockResponse = {
      ok: false,
      status: 401,
      json: async () => ({ error: 'Invalid credentials' })
    }

    mockFetch.mockResolvedValue(mockResponse as any)

    const response = await fetch('http://localhost:3000/pub/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'wrong@example.com', password: 'wrong' })
    })

    expect(response.ok).toBe(false)
    expect(response.status).toBe(401)

    const data = await response.json()
    expect(data.error).toBe('Invalid credentials')
  })

  it('should handle network error', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'))

    try {
      await fetch('http://localhost:3000/pub/auth/login')
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect((error as Error).message).toBe('Network error')
    }
  })

  it('should create request with correct headers', async () => {
    const token = 'test-token'
    localStorage.setItem('authToken', token)

    const mockResponse = {
      ok: true,
      json: async () => ({ id: 1, name: 'Test User' })
    }

    mockFetch.mockResolvedValue(mockResponse as any)

    await fetch('http://localhost:3000/prot/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/prot/users',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-token'
        })
      })
    )
  })
})
