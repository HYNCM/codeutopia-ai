import { Project } from '../types'
import { mockProjects } from '../data/mockData'
import { DASHBOARD_STATS, PENDING_TASKS, ACTIVE_PROJECTS_MOCK } from './mockData'
import { api } from '../lib/api'

export const projectService = {
  getProjects: async (filter?: { status?: string; category?: string }): Promise<Project[]> => {
    try {
      // Try real API first
      const queryParams = new URLSearchParams()
      if (filter?.status) queryParams.append('status', filter.status)
      if (filter?.category) queryParams.append('category', filter.category)
      const query = queryParams.toString()
      const endpoint = `/api/projects${query ? `?${query}` : ''}`
      return await api.get<Project[]>(endpoint)
    } catch (error) {
      console.warn('API fetch failed, using mock data:', error)
      // Fallback to mock data
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockProjects)
        }, 300)
      })
    }
  },

  getProject: async (id: string): Promise<Project | null> => {
    try {
      return await api.get<Project>(`/api/projects/${id}`)
    } catch (error) {
      console.warn('API fetch failed, using mock data:', error)
      const project = mockProjects.find((p) => p.id === id)
      return project || null
    }
  },

  getProjectStats: async (): Promise<any> => {
    // Stats endpoint not yet implemented in backend, use mock
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats = {
          active: ACTIVE_PROJECTS_MOCK.filter((p) => p.status === 'in_progress').length,
          total: ACTIVE_PROJECTS_MOCK.length,
          ...DASHBOARD_STATS,
        }
        resolve(stats)
      }, 200)
    })
  },

  getPendingTasks: async (): Promise<any[]> => {
    // Tasks endpoint not yet implemented in backend, use mock
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(PENDING_TASKS)
      }, 200)
    })
  },

  getOpenProjects: async (): Promise<Project[]> => {
    try {
      return await api.get<Project[]>('/api/projects?status=open')
    } catch (error) {
      console.warn('API fetch failed, using mock data:', error)
      return mockProjects.filter((p) => p.status === 'open')
    }
  },

  getMyProjects: async (userId: string): Promise<Project[]> => {
    try {
      return await api.get<Project[]>(`/api/projects?clientId=${userId}`)
    } catch (error) {
      console.warn('API fetch failed, using mock data:', error)
      const targetId = userId || 'd1'
      return mockProjects.filter(
        (p) =>
          p.bids.some((b) => b.developerId === targetId && b.status === 'accepted') ||
          p.milestones.some((m) => m.submission?.workerId === targetId),
      )
    }
  },

  createProject: async (data: Partial<Project>): Promise<Project> => {
    try {
      return await api.post<Project>('/api/projects', data)
    } catch (error) {
      console.warn('API call failed:', error)
      throw error
    }
  },

  updateProject: async (id: string, updates: Partial<Project>): Promise<Project> => {
    try {
      return await api.patch<Project>(`/api/projects/${id}`, updates)
    } catch (error) {
      console.warn('API call failed:', error)
      throw error
    }
  },
}
