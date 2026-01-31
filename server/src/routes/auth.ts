import { Router, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt, { Secret, SignOptions } from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// JWT configuration with proper typing
const JWT_SECRET: Secret = process.env.JWT_SECRET || 'dev-secret-change-in-production'
const JWT_OPTIONS: SignOptions = {
  expiresIn: 604800, // 7 days in seconds
}

// Mock users for development (matches frontend mockData.ts)
const MOCK_USERS: Record<string, any> = {
  'initiator@codeutopia.ai': {
    id: '1',
    name: '張偉明',
    email: 'initiator@codeutopia.ai',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang',
    role: 'project_initiator',
    company: '創新科技有限公司',
    rating: 4.8,
    completedProjects: 12,
    balance: 45000,
    skills: ['項目管理', '產品設計'],
    verified: true,
    location: '上海',
    timezone: 'Asia/Shanghai',
    bio: '專注於數位轉型的科技企業',
    password: 'demo123',
  },
  'contractor@codeutopia.ai': {
    id: '2',
    name: 'Alex Chen',
    email: 'contractor@codeutopia.ai',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    role: 'contractor',
    rating: 4.9,
    completedProjects: 35,
    balance: 12400,
    skills: ['React', 'Node.js', 'Python', 'AWS'],
    verified: true,
    location: '新加坡',
    timezone: 'Asia/Singapore',
    bio: '全棧開發工程師',
    password: 'demo123',
  },
  'webadmin@codeutopia.ai': {
    id: 'admin1',
    name: 'System Admin',
    email: 'webadmin@codeutopia.ai',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    role: 'webadmin',
    verified: true,
    location: 'Global',
    timezone: 'UTC',
    rating: 0,
    completedProjects: 0,
    balance: 0,
    skills: [],
    bio: 'System Administrator',
    password: 'demo123',
  },
  'regional@codeutopia.ai': {
    id: 'rm1',
    name: 'Sarah Lee',
    email: 'regional@codeutopia.ai',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    role: 'regional_manager',
    location: 'Tokyo',
    timezone: 'Asia/Tokyo',
    verified: true,
    rating: 5.0,
    completedProjects: 0,
    balance: 0,
    skills: ['Regional Management', 'Dispute Resolution'],
    bio: 'Regional Manager for APAC',
    password: 'demo123',
  },
}

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Check mock users first (for demo compatibility)
    const mockUser = MOCK_USERS[email]
    if (mockUser && mockUser.password === password) {
      const token = jwt.sign({ userId: mockUser.id, role: mockUser.role }, JWT_SECRET, JWT_OPTIONS)

      const { password: _, ...userWithoutPassword } = mockUser
      return res.json({
        token,
        user: userWithoutPassword,
      })
    }

    // Check database for real users
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, JWT_OPTIONS)

    const { password: _, ...userWithoutPassword } = user
    res.json({
      token,
      user: {
        ...userWithoutPassword,
        skills: JSON.parse(user.skills || '[]'),
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
})

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name, role = 'contractor' } = req.body

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' })
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(409).json({ error: 'User with this email already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      },
    })

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, JWT_OPTIONS)

    const { password: _, ...userWithoutPassword } = user
    res.status(201).json({
      token,
      user: {
        ...userWithoutPassword,
        skills: [],
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Registration failed' })
  }
})

// GET /api/auth/me - Get current user
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    // Check mock users first
    for (const mockUser of Object.values(MOCK_USERS)) {
      if (mockUser.id === req.userId) {
        const { password: _, ...userWithoutPassword } = mockUser
        return res.json(userWithoutPassword)
      }
    }

    // Check database
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const { password: _, ...userWithoutPassword } = user
    res.json({
      ...userWithoutPassword,
      skills: JSON.parse(user.skills || '[]'),
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Failed to get user' })
  }
})

export default router
