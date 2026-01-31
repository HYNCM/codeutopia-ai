import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware, AuthRequest, requireRole } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// Mock projects for development (minimal set)
const MOCK_PROJECTS = [
  {
    id: 'p1',
    title: '智能客服系統開發',
    description: '開發一個基於AI的智能客服系統，支持多語言、自動回覆和人工轉接',
    category: 'ai_ml',
    subcategory: 'NLP',
    status: 'in_progress',
    budgetMin: 40000,
    budgetMax: 50000,
    currency: 'USD',
    duration: '3 months',
    skills: ['Python', 'NLP', 'React', 'Node.js'],
    visibility: 'public',
    escrowBalance: 20000,
    totalPaid: 10000,
    clientId: '1',
    clientName: '張偉明',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    milestones: [
      { id: 'm1', title: '需求確認', status: 'approved', amount: 5000 },
      { id: 'm2', title: '代碼開發', status: 'in_progress', amount: 25000 },
      { id: 'm3', title: '測試驗收', status: 'pending', amount: 10000 },
    ],
    bids: [],
  },
  {
    id: 'p2',
    title: '數據分析平台 UI/UX 優化',
    description: '優化現有數據分析平台的用戶界面和用戶體驗',
    category: 'ui_ux',
    subcategory: '網頁設計',
    status: 'open',
    budgetMin: 25000,
    budgetMax: 30000,
    currency: 'USD',
    duration: '2 months',
    skills: ['Figma', 'UI Design', 'User Research'],
    visibility: 'public',
    escrowBalance: 0,
    totalPaid: 0,
    clientId: '1',
    clientName: '張偉明',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang',
    createdAt: '2024-01-18T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z',
    milestones: [],
    bids: [],
  },
]

// GET /api/projects - List all projects
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, category, clientId } = req.query

    // Return mock projects for now
    let projects = [...MOCK_PROJECTS]

    if (status) {
      projects = projects.filter((p) => p.status === status)
    }
    if (category) {
      projects = projects.filter((p) => p.category === category)
    }
    if (clientId) {
      projects = projects.filter((p) => p.clientId === clientId)
    }

    res.json(projects)
  } catch (error) {
    console.error('Get projects error:', error)
    res.status(500).json({ error: 'Failed to get projects' })
  }
})

// GET /api/projects/:id - Get single project
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    // Check mock projects
    const mockProject = MOCK_PROJECTS.find((p) => p.id === id)
    if (mockProject) {
      return res.json(mockProject)
    }

    // Check database
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rating: true,
          },
        },
        milestones: {
          orderBy: { order: 'asc' },
        },
        bids: {
          include: {
            developer: {
              select: {
                id: true,
                name: true,
                avatar: true,
                rating: true,
              },
            },
          },
        },
      },
    })

    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }

    res.json({
      ...project,
      skills: JSON.parse(project.skills || '[]'),
      clientName: project.client.name,
      clientAvatar: project.client.avatar,
    })
  } catch (error) {
    console.error('Get project error:', error)
    res.status(500).json({ error: 'Failed to get project' })
  }
})

// POST /api/projects - Create new project
router.post(
  '/',
  authMiddleware,
  requireRole('project_initiator', 'webadmin'),
  async (req: AuthRequest, res: Response) => {
    try {
      const {
        title,
        description,
        category,
        subcategory,
        budgetMin,
        budgetMax,
        currency = 'USD',
        duration,
        skills = [],
        visibility = 'public',
        milestones = [],
      } = req.body

      if (!title || !description || !category || !budgetMin || !budgetMax) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const project = await prisma.project.create({
        data: {
          title,
          description,
          category,
          subcategory,
          budgetMin,
          budgetMax,
          currency,
          duration,
          skills: JSON.stringify(skills),
          visibility,
          clientId: req.userId!,
          milestones: {
            create: milestones.map((m: any, index: number) => ({
              title: m.title,
              description: m.description || '',
              amount: m.amount || 0,
              dueDate: m.dueDate ? new Date(m.dueDate) : null,
              order: index,
              deliverables: JSON.stringify(m.deliverables || []),
              acceptanceCriteria: JSON.stringify(m.acceptanceCriteria || []),
            })),
          },
        },
        include: {
          milestones: true,
          client: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      })

      res.status(201).json({
        ...project,
        skills,
        clientName: project.client.name,
        clientAvatar: project.client.avatar,
      })
    } catch (error) {
      console.error('Create project error:', error)
      res.status(500).json({ error: 'Failed to create project' })
    }
  },
)

// PATCH /api/projects/:id - Update project
router.patch('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const updates = req.body

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(updates.title && { title: updates.title }),
        ...(updates.description && { description: updates.description }),
        ...(updates.status && { status: updates.status }),
        ...(updates.skills && { skills: JSON.stringify(updates.skills) }),
      },
    })

    res.json({
      ...project,
      skills: JSON.parse(project.skills || '[]'),
    })
  } catch (error) {
    console.error('Update project error:', error)
    res.status(500).json({ error: 'Failed to update project' })
  }
})

export default router
