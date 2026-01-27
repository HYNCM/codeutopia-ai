import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Project, Bid } from '../types'
import { mockProjects } from '../data/mockData'

interface ProjectContextType {
  projects: Project[]
  addProject: (project: Project) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  submitBid: (projectId: string, bid: Bid) => void
  acceptBid: (projectId: string, bidId: string) => void
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

  const acceptBid = (projectId: string, bidId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p
        return {
          ...p,
          status: 'in_progress',
          bids: (p.bids || []).map((b) =>
            b.id === bidId ? { ...b, status: 'accepted' } : b.status === 'pending' ? { ...b, status: 'rejected' } : b,
          ),
        }
      }),
    )
  }

  return (
    <ProjectContext.Provider value={{ projects, addProject, updateProject, submitBid, acceptBid }}>
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
