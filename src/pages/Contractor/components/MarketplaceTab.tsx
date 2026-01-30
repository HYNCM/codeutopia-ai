import React, { useState, useEffect } from 'react'
import { Search, Filter, Globe, DollarSign, Clock } from 'lucide-react'
import { projectService } from '../../../services/projectService'
import { Project } from '../../../types'

export const MarketplaceTab: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await projectService.getOpenProjects()
        setProjects(data)
      } catch (error) {
        console.error('Failed to load open projects:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadProjects()
  }, [])

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-[var(--text-primary)]'>尋找工作</h1>
          <p className='text-[var(--text-muted)] mt-1'>瀏覽全球最新的外包機會，找到最適合你的項目</p>
        </div>
      </div>

      {/* 搜索與篩選 */}
      <div className='bg-[var(--bg-card)] rounded-2xl p-4 shadow-sm border border-[var(--border-color)]'>
        <div className='flex items-center space-x-4'>
          <div className='flex-1 relative'>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]' />
            <input
              type='text'
              placeholder='搜索關鍵詞、技能或項目名稱...'
              className='w-full pl-12 pr-4 py-2.5 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500'
            />
          </div>
          <button className='flex items-center space-x-2 px-4 py-2.5 border border-[var(--border-subtle)] rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'>
            <Filter className='w-5 h-5' />
            <span>篩選</span>
          </button>
        </div>
      </div>

      {/* 項目列表 */}
      <div className='space-y-4'>
        {isLoading ? (
          <div className='text-center py-12 text-gray-500'>加載中...</div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className='bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border-color)] hover:shadow-md transition-all cursor-pointer group'>
              <div className='flex justify-between items-start'>
                <div>
                  <div className='flex items-center space-x-3 mb-2'>
                    <h3 className='text-lg font-bold text-[var(--text-primary)] group-hover:text-blue-600 transition-colors'>
                      {project.title}
                    </h3>
                    <span className='px-2 py-0.5 bg-blue-100 text-blue-600 rounded text-xs font-medium'>
                      {project.category}
                    </span>
                    <span className='text-xs text-[var(--text-muted)]'>
                      {new Date(project.createdAt).toLocaleDateString()} 發布
                    </span>
                  </div>
                  <p className='text-[var(--text-secondary)] line-clamp-2 mb-4 max-w-3xl'>{project.description}</p>

                  <div className='flex flex-wrap gap-2 mb-4'>
                    {project.skills.map((skill) => (
                      <span
                        key={skill}
                        className='px-2.5 py-1 bg-[var(--bg-input)] text-[var(--text-muted)] rounded-lg text-xs'>
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className='flex items-center space-x-6 text-sm text-[var(--text-muted)]'>
                    <div className='flex items-center space-x-1.5'>
                      <Globe className='w-4 h-4' />
                      <span>{project.visibility === 'public' ? '公開項目' : '邀請制'}</span>
                    </div>
                    <div className='flex items-center space-x-1.5'>
                      <DollarSign className='w-4 h-4' />
                      <span>
                        預算: {project.budget.currency} {project.budget.min.toLocaleString()} -{' '}
                        {project.budget.max.toLocaleString()}
                      </span>
                    </div>
                    <div className='flex items-center space-x-1.5'>
                      <Clock className='w-4 h-4' />
                      <span>工期: {project.duration}</span>
                    </div>
                  </div>
                </div>

                <div className='flex flex-col items-end space-y-3'>
                  <div className='text-right'>
                    <div className='font-bold text-[var(--text-primary)]'>
                      {project.budget.currency} {project.budget.max.toLocaleString()}
                    </div>
                    <div className='text-xs text-[var(--text-muted)]'>最高預算</div>
                  </div>
                  <button className='px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20'>
                    立即投標
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
        {!isLoading && projects.length === 0 && (
          <div className='text-center py-12 text-gray-500'>暫無符合條件的項目</div>
        )}
      </div>
    </div>
  )
}
