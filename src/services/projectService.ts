import { Project } from '../types'
import { mockProjects } from '../data/mockData'
import { DASHBOARD_STATS, PENDING_TASKS, ACTIVE_PROJECTS_MOCK } from './mockData'

export const projectService = {
  getProjects: async (filter?: any): Promise<Project[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return rich mock data
        resolve(mockProjects)
      }, 500)
    })
  },

  getProjectStats: async (): Promise<any> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats = {
          active: ACTIVE_PROJECTS_MOCK.filter((p) => p.status === 'in_progress').length,
          total: ACTIVE_PROJECTS_MOCK.length,
          ...DASHBOARD_STATS,
        }
        resolve(stats)
      }, 400)
    })
  },

  getPendingTasks: async (): Promise<any[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(PENDING_TASKS)
      }, 300)
    })
  },

  getOpenProjects: async (filter?: any): Promise<Project[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return open projects from mock data
        const openProjects = mockProjects.filter((p) => p.status === 'open')
        resolve(openProjects)
      }, 400)
    })
  },

  getMyProjects: async (userId: string): Promise<Project[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return projects where the user has an accepted bid or is assigned
        // For mock purposes, we'll return a subset or specific projects
        // Using 'd1' as the default mock contractor ID if not provided
        const targetId = userId || 'd1'
        const myProjects = mockProjects.filter(
          (p) =>
            p.bids.some((b) => b.developerId === targetId && b.status === 'accepted') ||
            p.milestones.some((m) => m.submission?.workerId === targetId),
        )
        resolve(myProjects)
      }, 400)
    })
  },
}
