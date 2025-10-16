import { describe, it, expect } from 'vitest'

describe('Working Tests', () => {
  it('should pass basic math test', () => {
    expect(1 + 1).toBe(2)
    expect(2 * 3).toBe(6)
    expect(10 - 5).toBe(5)
  })

  it('should test string operations', () => {
    const message = 'Hello, World!'
    expect(message).toContain('Hello')
    expect(message.length).toBeGreaterThan(0)
    expect(message.toUpperCase()).toBe('HELLO, WORLD!')
  })

  it('should test array operations', () => {
    const numbers = [1, 2, 3, 4, 5]
    expect(numbers).toHaveLength(5)
    expect(numbers).toContain(3)
    expect(numbers[0]).toBe(1)
    expect(numbers.filter(n => n > 3)).toEqual([4, 5])
  })

  it('should test object operations', () => {
    const user = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      active: true
    }
    
    expect(user).toHaveProperty('id')
    expect(user).toHaveProperty('name', 'Test User')
    expect(user.email).toBe('test@example.com')
    expect(user.active).toBe(true)
  })

  it('should test async operations', async () => {
    const promise = Promise.resolve('async result')
    const result = await promise
    expect(result).toBe('async result')
  })

  it('should test localStorage operations', () => {
    const key = 'test-key'
    const value = 'test-value'
    
    localStorage.setItem(key, value)
    expect(localStorage.getItem(key)).toBe(value)
    
    localStorage.removeItem(key)
    expect(localStorage.getItem(key)).toBeNull()
  })

  it('should test error handling', () => {
    const throwError = () => {
      throw new Error('Test error')
    }
    
    expect(throwError).toThrow('Test error')
    expect(throwError).toThrow(Error)
  })

  it('should test conditional logic', () => {
    const isEven = (n: number) => n % 2 === 0
    
    expect(isEven(2)).toBe(true)
    expect(isEven(3)).toBe(false)
    expect(isEven(0)).toBe(true)
  })

  it('should test date operations', () => {
    const date = new Date('2024-01-01')
    expect(date.getFullYear()).toBe(2024)
    expect(date.getMonth()).toBe(0) // January is 0
    expect(date.getDate()).toBe(1)
  })

  it('should test JSON operations', () => {
    const obj = { name: 'Test', value: 42 }
    const jsonString = JSON.stringify(obj)
    const parsed = JSON.parse(jsonString)
    
    expect(jsonString).toContain('Test')
    expect(parsed).toEqual(obj)
  })
})
