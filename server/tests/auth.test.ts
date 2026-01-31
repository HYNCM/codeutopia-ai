import request from 'supertest'
import express from 'express'
import cors from 'cors'

// Create a minimal test app
const app = express()
app.use(cors())
app.use(express.json())

// Mock auth route for testing
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  // Mock successful login for test user
  if (email === 'test@example.com' && password === 'password123') {
    return res.json({
      token: 'mock-jwt-token',
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'contractor',
      },
    })
  }

  return res.status(401).json({ error: 'Invalid email or password' })
})

describe('Auth API', () => {
  describe('POST /api/auth/login', () => {
    it('should return 400 if email is missing', async () => {
      const response = await request(app).post('/api/auth/login').send({ password: 'password123' })

      expect(response.status).toBe(400)
      expect(response.body.error).toBe('Email and password are required')
    })

    it('should return 400 if password is missing', async () => {
      const response = await request(app).post('/api/auth/login').send({ email: 'test@example.com' })

      expect(response.status).toBe(400)
      expect(response.body.error).toBe('Email and password are required')
    })

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'wrong@example.com', password: 'wrongpass' })

      expect(response.status).toBe(401)
      expect(response.body.error).toBe('Invalid email or password')
    })

    it('should return token and user for valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' })

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('token')
      expect(response.body).toHaveProperty('user')
      expect(response.body.user.email).toBe('test@example.com')
    })
  })
})
