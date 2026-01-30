import React from 'react'
import { Briefcase, MapPin, DollarSign, Calendar, Zap } from 'lucide-react'
import { ViewProject } from '../../ProjectManagementPage'

interface ProjectInfoSidebarProps {
  project: ViewProject
}

export const ProjectInfoSidebar: React.FC<ProjectInfoSidebarProps> = ({ project }) => {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planning: 'bg-gray-100 text-gray-700',
      in_progress: 'bg-blue-100 text-blue-700',
      review: 'bg-yellow-100 text-yellow-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className='space-y-6'>
      {/* Project Card */}
      <div className='bg-white rounded-xl p-6 border border-gray-200 shadow-sm'>
        <div className='flex justify-between items-start mb-4'>
          <div className='p-3 bg-purple-50 rounded-xl'>
            <Briefcase className='w-8 h-8 text-purple-600' />
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${getStatusColor(
              project.status,
            )}`}>
            {project.status === 'in_progress' ? '进行中' : project.status}
          </span>
        </div>

        <h1 className='text-xl font-bold text-gray-900 mb-2 leading-tight'>{project.title}</h1>
        <div className='flex items-center text-gray-500 text-sm mb-6'>
          <MapPin className='w-4 h-4 mr-1' />
          {project.region}
        </div>

        <div className='space-y-4'>
          <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
            <div className='flex items-center text-gray-600'>
              <DollarSign className='w-4 h-4 mr-2' />
              <span className='text-sm'>预算</span>
            </div>
            <span className='font-bold text-gray-900'>
              {project.currency} {project.totalBudget.toLocaleString()}
            </span>
          </div>

          <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
            <div className='flex items-center text-gray-600'>
              <Calendar className='w-4 h-4 mr-2' />
              <span className='text-sm'>开始时间</span>
            </div>
            <span className='font-medium text-gray-900'>{project.startDate}</span>
          </div>
        </div>

        {/* AI Analysis Badges */}
        {project.aiCollaboration && (
          <div className='mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100'>
            <div className='flex items-center text-purple-700 font-medium mb-2'>
              <Zap className='w-4 h-4 mr-2' />
              AI 协作开启
            </div>
            <p className='text-xs text-purple-600/80 leading-relaxed'>AI 助手正在监控里程碑交付质量与风险。</p>
          </div>
        )}
      </div>
    </div>
  )
}
