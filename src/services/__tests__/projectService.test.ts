import { describe, it, expect, vi, beforeEach } from 'vitest'
import { projectService } from '../projectService'
import { api } from '../../lib/api'

// Mock the api module
vi.mock('../../lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}))

describe('projectService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getProjects', () => {
    it('should fetch projects from API', async () => {
      const mockProjects = [
        { id: 'p1', title: 'Project 1', status: 'open' },
        { id: 'p2', title: 'Project 2', status: 'in_progress' },
      ]
      vi.mocked(api.get).mockResolvedValueOnce(mockProjects)

      const result = await projectService.getProjects()

      expect(api.get).toHaveBeenCalledWith('/api/projects')
      expect(result).toEqual(mockProjects)
    })

    it('should apply status filter', async () => {
      vi.mocked(api.get).mockResolvedValueOnce([])

      await projectService.getProjects({ status: 'open' })

      expect(api.get).toHaveBeenCalledWith('/api/projects?status=open')
    })

    it('should fallback to mock data on API error', async () => {
      vi.mocked(api.get).mockRejectedValueOnce(new Error('Network error'))

      const result = await projectService.getProjects()

      // Should return mock data (array with items)
      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('getProject', () => {
    it('should fetch single project by ID', async () => {
      const mockProject = { id: 'p1', title: 'Project 1' }
      vi.mocked(api.get).mockResolvedValueOnce(mockProject)

      const result = await projectService.getProject('p1')

      expect(api.get).toHaveBeenCalledWith('/api/projects/p1')
      expect(result).toEqual(mockProject)
    })
  })

  describe('createProject', () => {
    it('should create a new project', async () => {
      const newProject = { title: 'New Project', description: 'Test' }
      const createdProject = { id: 'p3', ...newProject }
      vi.mocked(api.post).mockResolvedValueOnce(createdProject)

      const result = await projectService.createProject(newProject)

      expect(api.post).toHaveBeenCalledWith('/api/projects', newProject)
      expect(result).toEqual(createdProject)
    })
  })
})
