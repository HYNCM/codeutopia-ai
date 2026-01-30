import React, { useState, useEffect } from 'react'
import {
  Sparkles,
  Plus,
  Search,
  Users,
  Clock,
  DollarSign,
  FileText,
  Brain,
  Target,
  BarChart3,
  TrendingUp,
  Layout,
  Briefcase,
  ChevronRight,
  MessageSquare,
  Globe,
  CheckCircle,
  Star,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AIAssistantPanel } from '../../../components/AIAssistantPanel'
import { Project } from '../../../types'
import { projectService } from '../../../services/projectService'
import { talentService } from '../../../services/talentService'
import { REGIONS } from '../../../services/mockData'

interface OverviewTabProps {
  setActiveTab: (tab: 'overview' | 'projects' | 'talents' | 'finance') => void
  setShowAIAssistant: (show: boolean) => void
  showAIAssistant: boolean
  activeProjectsDisplay: Project[]
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  setActiveTab,
  setShowAIAssistant,
  showAIAssistant,
  activeProjectsDisplay,
}) => {
  const navigate = useNavigate()
  const [stats, setStats] = useState<any>(null)
  const [pendingTasks, setPendingTasks] = useState<any[]>([])
  const [recommendedTalents, setRecommendedTalents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsData, tasksData, talentsData] = await Promise.all([
          projectService.getProjectStats(),
          projectService.getPendingTasks(),
          talentService.getRecommendedTalents(),
        ])
        setStats(statsData)
        setPendingTasks(tasksData)
        setRecommendedTalents(talentsData)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadDashboardData()
  }, [])

  if (isLoading) {
    return <div className='p-8 text-center text-gray-500'>加載中...</div>
  }

  return (
    <div className='grid grid-cols-12 gap-6'>
      {/* 左側主內容 */}
      <div className='col-span-12 lg:col-span-8 space-y-6'>
        {/* 快捷入口 */}
        <div className='bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border-color)] transition-colors duration-150'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg font-semibold text-[var(--text-primary)]'>快捷操作</h2>
          </div>
          <div className='grid grid-cols-4 md:grid-cols-7 gap-3'>
            {[
              { icon: Plus, label: '發布項目', color: 'bg-blue-500', path: '/post-project' },
              { icon: Search, label: '搜索人才', color: 'bg-green-500', action: () => setActiveTab('talents') },
              { icon: Users, label: '推薦人才', color: 'bg-purple-500', action: () => setActiveTab('talents') },
              { icon: FileText, label: '待處理申請', color: 'bg-orange-500', badge: 3 },
              { icon: Brain, label: 'AI 配置', color: 'bg-pink-500', action: () => setShowAIAssistant(true) },
              { icon: Target, label: '里程碑管理', color: 'bg-cyan-500', action: () => setActiveTab('projects') },
              {
                icon: DollarSign,
                label: '費用結算',
                color: 'bg-emerald-500',
                action: () => setActiveTab('finance'),
              },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (item.path) {
                    navigate(item.path)
                  } else if (item.action) {
                    item.action()
                  }
                }}
                className='relative p-4 bg-[var(--bg-card-hover)] hover:bg-[var(--bg-input)] rounded-xl transition-all duration-200 text-center group cursor-pointer'>
                <div
                  className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform shadow-lg`}>
                  <item.icon className='w-5 h-5 text-white' />
                </div>
                <span className='text-xs font-medium text-[var(--text-secondary)]'>{item.label}</span>
                {item.badge && (
                  <span className='absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center'>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 數據概覽 */}
        <div className='bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border-color)] transition-colors duration-150'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg font-semibold text-[var(--text-primary)]'>數據概覽</h2>
            <select className='py-1.5 px-3 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-muted)] cursor-pointer'>
              <option>近30天</option>
              <option>近90天</option>
              <option>近1年</option>
            </select>
          </div>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {[
              {
                label: '進行中項目',
                value: stats?.activeProjects || 0,
                icon: Briefcase,
                color: 'text-blue-600',
                bg: 'bg-blue-100',
              },
              {
                label: '對接人才數',
                value: stats?.connectedTalents || 0,
                icon: Users,
                color: 'text-green-600',
                bg: 'bg-green-100',
              },
              {
                label: 'AI 調用次數',
                value: stats?.aiAssistCalls || 0,
                icon: Brain,
                color: 'text-purple-600',
                bg: 'bg-purple-100',
              },
              {
                label: '總支出',
                value: `$${((stats?.totalSpent || 0) / 1000).toFixed(0)}K`,
                icon: DollarSign,
                color: 'text-orange-600',
                bg: 'bg-orange-100',
              },
            ].map((stat, idx) => (
              <div key={idx} className='p-4 bg-[var(--bg-card-hover)] rounded-xl border border-[var(--border-color)]'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-sm text-[var(--text-muted)]'>{stat.label}</span>
                  <div className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
                <div className='text-2xl font-bold text-[var(--text-primary)]'>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 進行中項目 */}
        <div className='bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border-color)] transition-colors duration-150'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg font-semibold text-[var(--text-primary)]'>進行中項目</h2>
            <button
              onClick={() => setActiveTab('projects')}
              className='flex items-center space-x-1 text-sm text-purple-500 hover:text-purple-400 cursor-pointer'>
              <span>查看全部</span>
              <ChevronRight className='w-4 h-4' />
            </button>
          </div>
          <div className='space-y-4'>
            {activeProjectsDisplay.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}`)}
                className='p-4 bg-[var(--bg-card-hover)] rounded-xl hover:bg-[var(--bg-input)] transition-colors cursor-pointer'>
                <div className='flex items-start justify-between mb-3'>
                  <div>
                    <h3 className='font-medium text-[var(--text-primary)]'>{project.title}</h3>
                    <div className='flex items-center space-x-4 mt-1 text-sm text-[var(--text-muted)]'>
                      <span className='flex items-center space-x-1'>
                        <Globe className='w-4 h-4' />
                        <span>Global</span>
                      </span>
                      <span className='flex items-center space-x-1'>
                        <Users className='w-4 h-4' />
                        <span>{project.bids?.length || 0} 競標</span>
                      </span>
                      <span className='flex items-center space-x-1'>
                        <Clock className='w-4 h-4' />
                        <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                      </span>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <span className='px-2 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded text-xs'>
                      AI 協作
                    </span>
                  </div>
                </div>

                {/* 進度條 */}
                <div className='mb-3'>
                  <div className='flex items-center justify-between text-sm mb-1'>
                    <span className='text-[var(--text-muted)]'>項目進度</span>
                    <span className='font-medium text-[var(--text-primary)]'>0%</span>
                  </div>
                  <div className='w-full h-2 bg-[var(--bg-input)] rounded-full overflow-hidden'>
                    <div
                      className='h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all'
                      style={{ width: `0%` }}
                    />
                  </div>
                </div>

                {/* 里程碑進度 */}
                <div className='flex items-center space-x-2'>
                  {project.milestones?.slice(0, 3).map((milestone, idx) => (
                    <div key={milestone.id} className='flex-1'>
                      <div className='flex items-center space-x-1 mb-1'>
                        {['approved', 'paid'].includes(milestone.status) ? (
                          <CheckCircle className='w-3 h-3 text-green-500' />
                        ) : milestone.status === 'in_progress' ? (
                          <div className='w-3 h-3 bg-blue-500 rounded-full animate-pulse' />
                        ) : (
                          <div className='w-3 h-3 border-2 border-[var(--border-color)] rounded-full' />
                        )}
                        <span className='text-xs text-[var(--text-muted)] truncate'>{milestone.title}</span>
                      </div>
                      {idx < (project.milestones?.length || 0) - 1 && idx < 2 && (
                        <div className='h-0.5 bg-[var(--border-subtle)] ml-1.5' />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 待辦事項 */}
        <div className='bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border-color)] transition-colors duration-150'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg font-semibold text-[var(--text-primary)]'>待辦事項</h2>
            <span className='px-2 py-1 bg-red-500/20 text-red-400 rounded text-sm'>{pendingTasks.length} 項待處理</span>
          </div>
          <div className='space-y-3'>
            {pendingTasks.map((task) => (
              <div
                key={task.id}
                className='flex items-center space-x-4 p-3 hover:bg-[var(--bg-card-hover)] rounded-xl transition-colors cursor-pointer'>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    task.type === 'application'
                      ? 'bg-blue-100'
                      : task.type === 'milestone'
                        ? 'bg-green-100'
                        : task.type === 'message'
                          ? 'bg-orange-100'
                          : task.type === 'ai'
                            ? 'bg-purple-100'
                            : 'bg-emerald-100'
                  }`}>
                  {task.type === 'application' ? (
                    <Users className='w-5 h-5 text-blue-600' />
                  ) : task.type === 'milestone' ? (
                    <Target className='w-5 h-5 text-green-600' />
                  ) : task.type === 'message' ? (
                    <MessageSquare className='w-5 h-5 text-orange-600' />
                  ) : task.type === 'ai' ? (
                    <Brain className='w-5 h-5 text-purple-600' />
                  ) : (
                    <DollarSign className='w-5 h-5 text-emerald-600' />
                  )}
                </div>
                <div className='flex-1'>
                  <div className='flex items-center space-x-2'>
                    <h4 className='font-medium text-[var(--text-primary)]'>{task.title}</h4>
                    {task.priority === 'high' && (
                      <span className='px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded text-xs'>緊急</span>
                    )}
                  </div>
                  <p className='text-sm text-[var(--text-muted)]'>{task.description}</p>
                </div>
                <div className='text-right'>
                  <span className='text-xs text-[var(--text-muted)]'>{task.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 右側側邊欄 */}
      <div className='col-span-12 lg:col-span-4 space-y-6'>
        {/* AI 協助面板 */}
        {showAIAssistant && (
          <div className='lg:sticky lg:top-24'>
            <AIAssistantPanel
              currentRole='project_initiator'
              onTaskComplete={(role, result) => console.log('AI Task Complete:', role, result)}
            />
          </div>
        )}

        {/* 推薦人才 */}
        <div className='bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border-color)] transition-colors duration-150'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg font-semibold text-[var(--text-primary)]'>推薦人才</h2>
            <button
              onClick={() => setActiveTab('talents')}
              className='text-sm text-purple-500 hover:text-purple-400 cursor-pointer'>
              查看全部
            </button>
          </div>
          <div className='space-y-4'>
            {recommendedTalents.map((talent) => (
              <div
                key={talent.id}
                className='p-3 bg-[var(--bg-card-hover)] rounded-xl hover:bg-[var(--bg-input)] transition-colors cursor-pointer'>
                <div className='flex items-start space-x-3'>
                  <img src={talent.avatar} alt={talent.name} className='w-12 h-12 rounded-full' />
                  <div className='flex-1'>
                    <div className='flex items-center space-x-2'>
                      <h4 className='font-medium text-[var(--text-primary)]'>{talent.name}</h4>
                      {talent.availability === 'available' && <span className='w-2 h-2 bg-green-500 rounded-full' />}
                    </div>
                    <p className='text-sm text-[var(--text-muted)]'>{talent.role}</p>
                    <div className='flex flex-wrap gap-1 mt-2'>
                      {talent.skills.slice(0, 3).map((skill: string) => (
                        <span
                          key={skill}
                          className='px-2 py-0.5 bg-[var(--bg-input)] text-[var(--text-muted)] rounded text-xs'>
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className='flex items-center justify-between mt-2'>
                      <div className='flex items-center space-x-1'>
                        <Star className='w-4 h-4 text-yellow-400 fill-current' />
                        <span className='text-sm font-medium text-[var(--text-primary)]'>{talent.rating}</span>
                        <span className='text-xs text-[var(--text-muted)]'>({talent.completedProjects} 項目)</span>
                      </div>
                      <span className='text-sm font-medium text-purple-500'>${talent.hourlyRate}/h</span>
                    </div>
                  </div>
                </div>
                <div className='flex items-center justify-between mt-3 pt-3 border-t border-[var(--border-color)]'>
                  <span className='text-xs text-[var(--text-muted)]'>匹配度 {talent.matchScore}%</span>
                  <div className='flex space-x-2'>
                    <button className='px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm hover:bg-purple-500/30 transition-colors cursor-pointer'>
                      發送邀請
                    </button>
                    <button className='px-3 py-1 border border-[var(--border-subtle)] text-[var(--text-secondary)] rounded-lg text-sm hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer'>
                      查看
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 區域分佈 */}
        <div className='bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border-color)] transition-colors duration-150'>
          <h2 className='text-lg font-semibold text-[var(--text-primary)] mb-4'>項目區域分佈</h2>
          <div className='grid grid-cols-4 gap-2'>
            {REGIONS.map((region) => (
              <div key={region.id} className='text-center p-2 bg-[var(--bg-card-hover)] rounded-lg'>
                <div className='text-lg'>{region.flag}</div>
                <div className='text-xs text-[var(--text-muted)] truncate'>{region.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 快速統計 */}
        <div className='bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6 text-white'>
          <h3 className='font-semibold mb-4'>本月概覽</h3>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='text-purple-200'>新增項目</span>
              <span className='font-semibold'>3 個</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-purple-200'>支出金額</span>
              <span className='font-semibold'>$45,000</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-purple-200'>完成里程碑</span>
              <span className='font-semibold'>7 個</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-purple-200'>項目完成率</span>
              <span className='font-semibold'>94%</span>
            </div>
          </div>
          <div className='mt-4 pt-4 border-t border-white/20'>
            <div className='flex items-center justify-between text-sm'>
              <span className='text-purple-200'>較上月</span>
              <span className='flex items-center text-green-300'>
                <TrendingUp className='w-4 h-4 mr-1' />
                +12.5%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
