import React from 'react'
import { ArrowRight, Briefcase, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ViewProject } from '../../ProjectManagementPage'

interface ProjectHeaderProps {
  project: ViewProject
  showAIPanel: boolean
  setShowAIPanel: (show: boolean) => void
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project, showAIPanel, setShowAIPanel }) => {
  const navigate = useNavigate()

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
    <div className='flex justify-between items-center mb-6'>
      <button
        onClick={() => navigate('/projects')}
        className='flex items-center text-gray-500 hover:text-gray-900 transition-colors'>
        <ArrowRight className='w-5 h-5 mr-2 rotate-180' />
        返回项目列表
      </button>
      <div className='flex space-x-3'>
        <button
          onClick={() => setShowAIPanel(!showAIPanel)}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 font-medium border ${
            showAIPanel
              ? 'bg-purple-100 text-purple-700 border-purple-200'
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
          }`}>
          <Zap className={`w-4 h-4 ${showAIPanel ? 'fill-current' : ''}`} />
          <span>AI 助手</span>
        </button>
      </div>
    </div>
  )
}
