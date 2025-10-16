import { describe, it, expect } from 'vitest'

describe('Simple Tests', () => {
  it('should pass basic test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should test string operations', () => {
    const message = 'Hello, World!'
    expect(message).toContain('Hello')
    expect(message.length).toBeGreaterThan(0)
  })

  it('should test array operations', () => {
    const numbers = [1, 2, 3, 4, 5]
    expect(numbers).toHaveLength(5)
    expect(numbers).toContain(3)
    expect(numbers[0]).toBe(1)
  })

  it('should test object properties', () => {
    const user = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com'
    }
    
    expect(user).toHaveProperty('id')
    expect(user).toHaveProperty('name', 'Test User')
    expect(user.email).toBe('test@example.com')
  })

  it('should test async operations', async () => {
    const promise = Promise.resolve('async result')
    const result = await promise
    expect(result).toBe('async result')
  })
})
