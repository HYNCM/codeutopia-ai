import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Sparkles,
  Plus,
  Search,
  Users,
  Clock,
  DollarSign,
  FileText,
  Settings,
  Bell,
  MessageSquare,
  ChevronRight,
  ArrowRight,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Globe,
  Calendar,
  TrendingUp,
  Briefcase,
  Target,
  Zap,
  Brain,
  Layout,
  Code2,
  Server,
  TestTube,
  MoreHorizontal,
  Filter,
  Star,
  Building,
} from 'lucide-react'
import { AIAssistantPanel, AIRoleType } from '../components/AIAssistantPanel'
import { useProjects } from '../contexts/ProjectContext'
import { useAuth } from '../contexts/AuthContext'
import { Project } from '../types'
import { DASHBOARD_STATS, RECOMMENDED_TALENTS, PENDING_TASKS, REGIONS } from '../services/mockData'

interface ProjectInitiatorDashboardProps {
  currentRole?: string
}

export default function ProjectInitiatorDashboard({ currentRole }: ProjectInitiatorDashboardProps = {}) {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'talents' | 'finance'>('overview')
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const navigate = useNavigate()
  const { projects } = useProjects()
  const { user } = useAuth()

  // Filter projects for display
  const myProjects = projects.filter((p) => !user || p.clientId === user.id || true) // Show all for demo if user not matched well, or just show all. Mock data uses 'c1'.
  const activeProjectsDisplay = projects.filter((p) => ['open', 'in_progress'].includes(p.status))

  return (
    <div className='space-y-6'>
      {/* 頁面標題 */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-3'>
          <h1 className='text-2xl font-bold text-[var(--text-primary)]'>工作台</h1>
          <span className='px-2.5 py-1 bg-purple-500/20 text-purple-500 dark:text-purple-400 border border-purple-500/30 rounded-lg text-sm font-medium'>
            項目主理人
          </span>
        </div>
        <div className='flex items-center space-x-3'>
          <button
            onClick={() => setShowAIAssistant(!showAIAssistant)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
              showAIAssistant
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25'
                : 'bg-[var(--bg-card-hover)] text-[var(--text-secondary)] hover:bg-[var(--bg-input)] border border-[var(--border-color)]'
            }`}>
            <Brain className='w-4 h-4' />
            <span>AI 協助</span>
          </button>
        </div>
      </div>

      {/* 上下文標籤導航 */}
      <div className='bg-[var(--bg-card)] rounded-xl p-1 inline-flex space-x-1 border border-[var(--border-color)] transition-colors duration-150'>
        {[
          { id: 'overview', name: '概覽', icon: Layout },
          { id: 'projects', name: '項目', icon: Briefcase },
          { id: 'talents', name: '人才', icon: Users },
          { id: 'finance', name: '財務', icon: DollarSign },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]'
            }`}>
            <tab.icon className='w-4 h-4' />
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* 主內容區域 */}
      <div>
        {activeTab === 'overview' && (
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
                      value: DASHBOARD_STATS.activeProjects,
                      icon: Briefcase,
                      color: 'text-blue-600',
                      bg: 'bg-blue-100',
                    },
                    {
                      label: '對接人才數',
                      value: DASHBOARD_STATS.connectedTalents,
                      icon: Users,
                      color: 'text-green-600',
                      bg: 'bg-green-100',
                    },
                    {
                      label: 'AI 調用次數',
                      value: DASHBOARD_STATS.aiAssistCalls,
                      icon: Brain,
                      color: 'text-purple-600',
                      bg: 'bg-purple-100',
                    },
                    {
                      label: '總支出',
                      value: `$${(DASHBOARD_STATS.totalSpent / 1000).toFixed(0)}K`,
                      icon: DollarSign,
                      color: 'text-orange-600',
                      bg: 'bg-orange-100',
                    },
                  ].map((stat, idx) => (
                    <div
                      key={idx}
                      className='p-4 bg-[var(--bg-card-hover)] rounded-xl border border-[var(--border-color)]'>
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
                  <span className='px-2 py-1 bg-red-500/20 text-red-400 rounded text-sm'>
                    {PENDING_TASKS.length} 項待處理
                  </span>
                </div>
                <div className='space-y-3'>
                  {PENDING_TASKS.map((task) => (
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
                    codeBoxCompatible={false}
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
                  {RECOMMENDED_TALENTS.map((talent) => (
                    <div
                      key={talent.id}
                      className='p-3 bg-[var(--bg-card-hover)] rounded-xl hover:bg-[var(--bg-input)] transition-colors cursor-pointer'>
                      <div className='flex items-start space-x-3'>
                        <img src={talent.avatar} alt={talent.name} className='w-12 h-12 rounded-full' />
                        <div className='flex-1'>
                          <div className='flex items-center space-x-2'>
                            <h4 className='font-medium text-[var(--text-primary)]'>{talent.name}</h4>
                            {talent.availability === 'available' && (
                              <span className='w-2 h-2 bg-green-500 rounded-full' />
                            )}
                          </div>
                          <p className='text-sm text-[var(--text-muted)]'>{talent.role}</p>
                          <div className='flex flex-wrap gap-1 mt-2'>
                            {talent.skills.slice(0, 3).map((skill) => (
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
                              <span className='text-xs text-[var(--text-muted)]'>
                                ({talent.completedProjects} 項目)
                              </span>
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
        )}

        {/* 項目管理標籤 */}
        {activeTab === 'projects' && (
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
                    {myProjects.map((project) => (
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
        )}

        {/* 人才庫標籤 */}
        {activeTab === 'talents' && (
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <div>
                <h1 className='text-2xl font-bold text-[var(--text-primary)]'>人才庫</h1>
                <p className='text-[var(--text-muted)] mt-1'>搜索和篩選全球優質開發者與設計師</p>
              </div>
            </div>

            {/* 人才篩選 */}
            <div className='bg-[var(--bg-card)] rounded-2xl p-4 shadow-sm border border-[var(--border-color)] transition-colors duration-150'>
              <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                <div className='relative'>
                  <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]' />
                  <input
                    type='text'
                    placeholder='搜索人才...'
                    className='w-full pl-12 pr-4 py-2.5 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-purple-500'
                  />
                </div>
                <select className='py-2.5 px-4 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-secondary)]'>
                  <option>全部技能</option>
                  <option>React</option>
                  <option>Node.js</option>
                  <option>AI/ML</option>
                  <option>UI/UX</option>
                </select>
                <select className='py-2.5 px-4 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-secondary)]'>
                  <option>全部區域</option>
                  {REGIONS.map((r) => (
                    <option key={r.id}>{r.name}</option>
                  ))}
                </select>
                <select className='py-2.5 px-4 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-secondary)]'>
                  <option>全部價格</option>
                  <option>$0-50/h</option>
                  <option>$50-100/h</option>
                  <option>$100+/h</option>
                </select>
              </div>
            </div>

            {/* 人才卡片網格 */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {RECOMMENDED_TALENTS.map((talent) => (
                <div
                  key={talent.id}
                  className='bg-[var(--bg-card)] rounded-2xl p-6 shadow-sm border border-[var(--border-color)] hover:shadow-md transition-all'>
                  <div className='flex items-start space-x-4'>
                    <img src={talent.avatar} alt={talent.name} className='w-16 h-16 rounded-full' />
                    <div className='flex-1'>
                      <div className='flex items-center space-x-2'>
                        <h3 className='font-semibold text-[var(--text-primary)]'>{talent.name}</h3>
                        {talent.availability === 'available' && (
                          <span className='px-1.5 py-0.5 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded text-xs'>
                            可接單
                          </span>
                        )}
                      </div>
                      <p className='text-sm text-[var(--text-muted)]'>{talent.role}</p>
                      <div className='flex items-center space-x-2 mt-2'>
                        <div className='flex items-center'>
                          <Star className='w-4 h-4 text-yellow-400 fill-current' />
                          <span className='text-sm font-medium text-[var(--text-primary)] ml-1'>{talent.rating}</span>
                        </div>
                        <span className='text-sm text-[var(--text-muted)]'>|</span>
                        <span className='text-sm text-[var(--text-muted)]'>{talent.completedProjects} 項目</span>
                      </div>
                    </div>
                  </div>
                  <div className='mt-4'>
                    <div className='flex flex-wrap gap-2'>
                      {talent.skills.map((skill) => (
                        <span
                          key={skill}
                          className='px-2 py-1 bg-[var(--bg-input)] text-[var(--text-secondary)] rounded text-sm'>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className='flex items-center justify-between mt-4 pt-4 border-t border-[var(--border-color)]'>
                    <div className='text-lg font-semibold text-[var(--text-primary)]'>${talent.hourlyRate}/h</div>
                    <div className='flex space-x-2'>
                      <button className='px-4 py-2 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-lg text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-500/30 transition-colors'>
                        發送邀請
                      </button>
                      <button className='px-4 py-2 border border-[var(--border-subtle)] text-[var(--text-secondary)] rounded-lg text-sm hover:bg-[var(--bg-card-hover)] transition-colors'>
                        查看詳情
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 財務結算標籤 */}
        {activeTab === 'finance' && (
          <div className='space-y-6'>
            <div>
              <h1 className='text-2xl font-bold text-[var(--text-primary)]'>財務結算</h1>
              <p className='text-[var(--text-muted)] mt-1'>管理項目支出、里程碑付款與發票</p>
            </div>

            {/* 財務摘要卡片 */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              {[
                { label: '本月支出', value: '$45,000', change: '+12.5%', positive: true, color: 'blue' },
                { label: '待結算金額', value: '$12,500', change: '3 筆', positive: false, color: 'orange' },
                { label: '已結算金額', value: '$232,500', change: '本月', positive: true, color: 'green' },
                { label: '爭議中金額', value: '$0', change: '無', positive: true, color: 'gray' },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className='bg-[var(--bg-card)] rounded-2xl p-6 shadow-sm border border-[var(--border-color)] transition-colors duration-150'>
                  <div className='text-sm text-[var(--text-muted)] mb-1'>{stat.label}</div>
                  <div className='text-2xl font-bold text-[var(--text-primary)]'>{stat.value}</div>
                  <div
                    className={`text-sm mt-2 ${stat.positive ? 'text-green-600 dark:text-green-400' : 'text-[var(--text-muted)]'}`}>
                    {stat.change}
                  </div>
                </div>
              ))}
            </div>

            {/* 結算記錄表格 */}
            <div className='bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border-color)] overflow-hidden transition-colors duration-150'>
              <div className='px-6 py-4 border-b border-[var(--border-color)]'>
                <h2 className='font-semibold text-[var(--text-primary)]'>結算記錄</h2>
              </div>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead className='bg-[var(--bg-card-hover)]'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase'>
                        項目
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase'>
                        里程碑
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase'>
                        金額
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase'>
                        狀態
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase'>
                        日期
                      </th>
                      <th className='px-6 py-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase'>
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-[var(--border-subtle)]'>
                    {[
                      {
                        project: '智能客服系統開發',
                        milestone: '代碼開發里程碑',
                        amount: '$15,000',
                        status: '已完成',
                        date: '2024-01-15',
                      },
                      {
                        project: '數據分析平台 UI/UX 優化',
                        milestone: '設計調研里程碑',
                        amount: '$5,600',
                        status: '已完成',
                        date: '2024-01-10',
                      },
                      {
                        project: '智能客服系統開發',
                        milestone: '需求確認里程碑',
                        amount: '$9,000',
                        status: '已完成',
                        date: '2024-01-05',
                      },
                    ].map((row, idx) => (
                      <tr key={idx} className='hover:bg-[var(--bg-card-hover)]'>
                        <td className='px-6 py-4 text-sm text-[var(--text-primary)]'>{row.project}</td>
                        <td className='px-6 py-4 text-sm text-[var(--text-muted)]'>{row.milestone}</td>
                        <td className='px-6 py-4 text-sm font-medium text-[var(--text-primary)]'>{row.amount}</td>
                        <td className='px-6 py-4'>
                          <span className='px-2 py-1 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-full text-xs font-medium'>
                            {row.status}
                          </span>
                        </td>
                        <td className='px-6 py-4 text-sm text-[var(--text-muted)]'>{row.date}</td>
                        <td className='px-6 py-4 text-right'>
                          <button className='text-purple-600 dark:text-purple-400 hover:text-purple-700 text-sm'>
                            下載發票
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
