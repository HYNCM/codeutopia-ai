import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Project, Bid } from '../types'
import { mockProjects } from '../data/mockData'

interface ProjectContextType {
  projects: Project[]
  addProject: (project: Project) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  submitBid: (projectId: string, bid: Bid) => void
  acceptBid: (projectId: string, bidId: string, amount?: number) => void
  submitMilestone: (projectId: string, milestoneId: string, data: { note: string; attachments: string[] }) => void
  reviewMilestone: (
    projectId: string,
    milestoneId: string,
    data: { status: 'approved' | 'rejected'; rejectionReason?: string },
  ) => void
}

const STORAGE_KEY = 'codeutopia_projects'

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from localStorage if available, otherwise use mockProjects
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : mockProjects
    } catch (error) {
      console.error('Failed to load projects from localStorage:', error)
      return mockProjects
    }
  })

  // Persist projects to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
    } catch (error) {
      console.error('Failed to save projects to localStorage:', error)
    }
  }, [projects])

  const addProject = (project: Project) => {
    setProjects((prev) => [project, ...prev])
  }

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }

  const submitBid = (projectId: string, bid: Bid) => {
    setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, bids: [...(p.bids || []), bid] } : p)))
  }

  const acceptBid = (projectId: string, bidId: string, amount?: number) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p
        return {
          ...p,
          status: 'in_progress',
          escrowBalance: (p.escrowBalance || 0) + (amount || 0), // Update escrow balance
          bids: (p.bids || []).map((b) =>
            b.id === bidId ? { ...b, status: 'accepted' } : b.status === 'pending' ? { ...b, status: 'rejected' } : b,
          ),
        }
      }),
    )
  }

  const submitMilestone = (projectId: string, milestoneId: string, data: { note: string; attachments: string[] }) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p
        return {
          ...p,
          milestones: p.milestones.map((m) => {
            if (m.id !== milestoneId) return m
            return {
              ...m,
              status: 'submitted',
              submission: {
                id: `sub_${Date.now()}`,
                milestoneId: m.id,
                submittedAt: new Date().toISOString(),
                note: data.note,
                attachments: data.attachments,
                status: 'pending',
              },
            }
          }),
        }
      }),
    )
  }

  const reviewMilestone = (
    projectId: string,
    milestoneId: string,
    data: { status: 'approved' | 'rejected'; rejectionReason?: string },
  ) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p
        return {
          ...p,
          milestones: p.milestones.map((m) => {
            if (m.id !== milestoneId) return m

            // If rejected, reset status to 'in_progress', otherwise 'approved'
            const newStatus = data.status === 'rejected' ? 'in_progress' : 'approved'

            return {
              ...m,
              status: newStatus,
              approvedAt: data.status === 'approved' ? new Date().toISOString() : undefined,
              submission: m.submission
                ? {
                    ...m.submission,
                    status: data.status,
                    rejectionReason: data.rejectionReason,
                  }
                : undefined,
            }
          }),
        }
      }),
    )
  }

  return (
    <ProjectContext.Provider
      value={{ projects, addProject, updateProject, submitBid, acceptBid, submitMilestone, reviewMilestone }}>
      {children}
    </ProjectContext.Provider>
  )
}

export const useProjects = () => {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider')
  }
  return context
}
