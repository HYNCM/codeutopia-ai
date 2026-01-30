import React, { useState, useEffect } from 'react'
import { Briefcase, CheckCircle, Clock } from 'lucide-react'
import { projectService } from '../../../services/projectService'
import { useAuth } from '../../../contexts/AuthContext'
import { Project } from '../../../types'
import { Link } from 'react-router-dom'

export const MyProjectsTab: React.FC = () => {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProjects = async () => {
      if (!user) return
      try {
        const data = await projectService.getMyProjects(user.id)
        setProjects(data)
      } catch (error) {
        console.error('Failed to load my projects:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadProjects()
  }, [user])

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-[var(--text-primary)]'>我的項目</h1>
          <p className='text-[var(--text-muted)] mt-1'>管理正在進行和已完成的項目</p>
        </div>
      </div>

      <div className='bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border-color)] overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-[var(--bg-card-hover)] border-b border-[var(--border-color)]'>
              <tr>
                <th className='px-6 py-4 text-left text-sm font-medium text-[var(--text-muted)]'>項目名稱</th>
                <th className='px-6 py-4 text-left text-sm font-medium text-[var(--text-muted)]'>客戶</th>
                <th className='px-6 py-4 text-left text-sm font-medium text-[var(--text-muted)]'>狀態</th>
                <th className='px-6 py-4 text-left text-sm font-medium text-[var(--text-muted)]'>當前里程碑</th>
                <th className='px-6 py-4 text-left text-sm font-medium text-[var(--text-muted)]'>金額</th>
                <th className='px-6 py-4 text-right text-sm font-medium text-[var(--text-muted)]'>操作</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-[var(--border-subtle)]'>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className='p-8 text-center text-gray-500'>
                    加載中...
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className='hover:bg-[var(--bg-card-hover)] transition-colors'>
                    <td className='px-6 py-4'>
                      <div className='font-medium text-[var(--text-primary)]'>{project.title}</div>
                      <div className='text-xs text-[var(--text-muted)]'>ID: {project.id}</div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center space-x-2'>
                        <img src={project.clientAvatar} alt={project.clientName} className='w-6 h-6 rounded-full' />
                        <span className='text-sm text-[var(--text-primary)]'>{project.clientName}</span>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          project.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-600'
                            : project.status === 'completed'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-600'
                        }`}>
                        {project.status === 'in_progress'
                          ? '進行中'
                          : project.status === 'completed'
                            ? '已完成'
                            : project.status}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='text-sm text-[var(--text-primary)]'>
                        {project.milestones.find((m) => m.status === 'in_progress')?.title || '無進行中里程碑'}
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='font-medium text-[var(--text-primary)]'>
                        {project.budget.currency} {project.budget.max.toLocaleString()}
                      </div>
                    </td>
                    <td className='px-6 py-4 text-right'>
                      <Link
                        to={`/projects/${project.id}`}
                        className='text-blue-600 hover:text-blue-700 text-sm font-medium'>
                        進入工作台
                      </Link>
                    </td>
                  </tr>
                ))
              )}
              {!isLoading && projects.length === 0 && (
                <tr>
                  <td colSpan={6} className='p-8 text-center text-gray-500'>
                    暫無項目
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
