import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Filter, Users, ChevronRight } from 'lucide-react'
import { Project } from '../../../types'
import { REGIONS } from '../../../services/mockData'

interface ProjectsTabProps {
  projects: Project[]
}

export const ProjectsTab: React.FC<ProjectsTabProps> = ({ projects }) => {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-[var(--text-primary)]'>項目管理</h1>
          <p className='text-[var(--text-muted)] mt-1'>管理所有發起的項目，追蹤進度與里程碑</p>
        </div>
        <Link
          to='/projects/new'
          className='flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg shadow-purple-500/25'>
          <Plus className='w-5 h-5' />
          <span>發布新項目</span>
        </Link>
      </div>

      {/* 項目篩選 */}
      <div className='bg-[var(--bg-card)] rounded-2xl p-4 shadow-sm border border-[var(--border-color)] transition-colors duration-150'>
        <div className='flex items-center space-x-4'>
          <div className='flex-1 relative'>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]' />
            <input
              type='text'
              placeholder='搜索項目名稱...'
              className='w-full pl-12 pr-4 py-2.5 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-purple-500'
            />
          </div>
          <select className='py-2.5 px-4 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-secondary)]'>
            <option>全部狀態</option>
            <option>進行中</option>
            <option>待對接</option>
            <option>已完成</option>
            <option>已關閉</option>
          </select>
          <select className='py-2.5 px-4 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-secondary)]'>
            <option>全部區域</option>
            {REGIONS.map((r) => (
              <option key={r.id}>{r.name}</option>
            ))}
          </select>
          <button className='flex items-center space-x-2 px-4 py-2.5 border border-[var(--border-subtle)] rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'>
            <Filter className='w-5 h-5' />
            <span>更多篩選</span>
          </button>
        </div>
      </div>

      {/* 項目列表 */}
      <div className='bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border-color)] overflow-hidden transition-colors duration-150'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-[var(--bg-card-hover)] border-b border-[var(--border-color)]'>
              <tr>
                <th className='px-6 py-4 text-left text-sm font-medium text-[var(--text-muted)]'>項目名稱</th>
                <th className='px-6 py-4 text-left text-sm font-medium text-[var(--text-muted)]'>狀態</th>
                <th className='px-6 py-4 text-left text-sm font-medium text-[var(--text-muted)]'>進度</th>
                <th className='px-6 py-4 text-left text-sm font-medium text-[var(--text-muted)]'>預算</th>
                <th className='px-6 py-4 text-left text-sm font-medium text-[var(--text-muted)]'>人才</th>
                <th className='px-6 py-4 text-left text-sm font-medium text-[var(--text-muted)]'>AI 輔助</th>
                <th className='px-6 py-4 text-left text-sm font-medium text-[var(--text-muted)]'>最近活動</th>
                <th className='px-6 py-4 text-right text-sm font-medium text-[var(--text-muted)]'>操作</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-[var(--border-subtle)]'>
              {projects.map((project) => (
                <tr key={project.id} className='hover:bg-[var(--bg-card-hover)] transition-colors'>
                  <td className='px-6 py-4'>
                    <div>
                      <div className='font-medium text-[var(--text-primary)]'>{project.title}</div>
                      <div className='text-sm text-[var(--text-muted)]'>#{project.id}</div>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <span
                      className={`px-2.5 py-1 rounded-full text-sm font-medium ${
                        project.status === 'in_progress'
                          ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
                          : project.status === 'open'
                            ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400'
                            : 'bg-[var(--bg-input)] text-[var(--text-muted)]'
                      }`}>
                      {project.status === 'in_progress'
                        ? '進行中'
                        : project.status === 'open'
                          ? '公開'
                          : project.status}
                    </span>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center space-x-2'>
                      <div className='w-24 h-2 bg-[var(--bg-input)] rounded-full overflow-hidden'>
                        <div
                          className='h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full'
                          style={{ width: `0%` }}
                        />
                      </div>
                      <span className='text-sm text-[var(--text-muted)]'>0%</span>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='font-medium text-[var(--text-primary)]'>
                      {project.budget.currency} {project.budget.max.toLocaleString()}
                    </div>
                    <div className='text-sm text-[var(--text-muted)]'>預算範圍</div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center space-x-1'>
                      <Users className='w-4 h-4 text-[var(--text-muted)]' />
                      <span className='text-[var(--text-primary)]'>{project.bids?.length || 0}</span>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex space-x-1'>
                      <span className='px-2 py-0.5 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded text-xs'>
                        AI
                      </span>
                    </div>
                  </td>
                  <td className='px-6 py-4 text-sm text-[var(--text-muted)]'>
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </td>
                  <td className='px-6 py-4 text-right'>
                    <Link
                      to={`/projects/${project.id}`}
                      className='inline-flex items-center space-x-1 px-3 py-1.5 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 rounded-lg transition-colors'>
                      <span>查看</span>
                      <ChevronRight className='w-4 h-4' />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
