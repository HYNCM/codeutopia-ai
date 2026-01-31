import { describe, it, expect, vi, beforeEach } from 'vitest'
import { api, getToken, setToken, removeToken, API_BASE_URL } from '../../lib/api'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('API Module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('Token Management', () => {
    it('should store and retrieve token', () => {
      expect(getToken()).toBeNull()

      setToken('test-token-123')
      expect(getToken()).toBe('test-token-123')
    })

    it('should remove token', () => {
      setToken('test-token-123')
      expect(getToken()).toBe('test-token-123')

      removeToken()
      expect(getToken()).toBeNull()
    })
  })

  describe('API Methods', () => {
    it('should make GET request with correct headers', async () => {
      setToken('my-jwt-token')
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: 'test' }),
      })

      const result = await api.get('/api/test')

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/api/test`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer my-jwt-token',
          }),
        }),
      )
      expect(result).toEqual({ data: 'test' })
    })

    it('should make POST request with body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: 1 }),
      })

      const result = await api.post('/api/users', { name: 'John' })

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/api/users`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'John' }),
        }),
      )
      expect(result).toEqual({ id: 1 })
    })

    it('should throw error on failed request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'Unauthorized' }),
      })

      await expect(api.get('/api/protected')).rejects.toThrow('Unauthorized')
    })
  })
})
