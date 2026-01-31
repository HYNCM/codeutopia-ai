import { Router, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// GET /api/users/:id - Get user profile
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        company: true,
        rating: true,
        completedProjects: true,
        skills: true,
        verified: true,
        location: true,
        timezone: true,
        bio: true,
        hourlyRate: true,
        createdAt: true,
      },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      ...user,
      skills: JSON.parse(user.skills || '[]'),
      memberSince: user.createdAt.toISOString().split('T')[0],
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Failed to get user' })
  }
})

// PATCH /api/users/:id - Update user profile
router.patch('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    // Users can only update their own profile (unless admin)
    if (req.userId !== id && req.userRole !== 'webadmin') {
      return res.status(403).json({ error: 'Cannot update other user profiles' })
    }

    const { name, bio, location, timezone, skills, hourlyRate } = req.body

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(bio && { bio }),
        ...(location && { location }),
        ...(timezone && { timezone }),
        ...(skills && { skills: JSON.stringify(skills) }),
        ...(hourlyRate !== undefined && { hourlyRate }),
      },
    })

    res.json({
      ...user,
      skills: JSON.parse(user.skills || '[]'),
    })
  } catch (error) {
    console.error('Update user error:', error)
    res.status(500).json({ error: 'Failed to update user' })
  }
})

export default router
