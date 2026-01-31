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
  MessageSquare,
  ChevronRight,
  BarChart3,
  CheckCircle,
  Globe,
  TrendingUp,
  Briefcase,
  Target,
  Zap,
  Brain,
  Layout,
  Target as TargetIcon,
  CreditCard,
  MoreHorizontal,
  ArrowRight,
  TrendingDown,
  Filter,
  Star,
} from 'lucide-react'
import { AIAssistantPanel } from '../components/AIAssistantPanel'
import { useProjects } from '../contexts/ProjectContext'
import { useAuth } from '../contexts/AuthContext'
import { REGIONS, RECOMMENDED_TALENTS } from '../services/mockData'
import { ProjectsPage } from './Projects'
import { TalentPoolPage } from './TalentPool'

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
  const activeProjectsDisplay = projects.filter((p) => ['open', 'in_progress'].includes(p.status))

  return (
    <div className='max-w-[1600px] mx-auto space-y-8 animate-fade-in pb-12'>
      {/* 1. Welcome Banner */}
      {/* 1. Welcome Banner & 2. Key Metrics - Only on Overview */}
      {activeTab === 'overview' && (
        <>
          <div className='relative overflow-hidden group rounded-3xl'>
            <div className='absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 opacity-90 group-hover:opacity-100 transition-opacity duration-500' />
            <div className='absolute inset-0 bg-[url("https://www.transparenttextures.com/patterns/carbon-fibre.png")] opacity-10' />

            <div className='relative z-10 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8'>
              <div className='space-y-4 text-center md:text-left'>
                <div className='inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20'>
                  <Sparkles className='w-4 h-4 text-yellow-300' />
                  <span className='text-xs font-semibold text-white uppercase tracking-wider'>
                    Global Design House • {currentRole === 'project_initiator' ? '項目主理人' : '工作台'}
                  </span>
                </div>
                <h1 className='text-3xl sm:text-4xl font-extrabold text-white'>
                  歡迎回來，{user?.name || '張偉明'} <span className='animate-bounce inline-block'>👋</span>
                </h1>
                <p className='text-indigo-100 text-lg max-w-2xl'>
                  您目前有{' '}
                  <span className='font-bold text-white underline decoration-yellow-400'>
                    {activeProjectsDisplay.length}
                  </span>{' '}
                  個活躍項目正在進行中。
                </p>
                <div className='flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2'>
                  <button
                    onClick={() => navigate('/post-project')}
                    className='px-6 py-3 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 hover:scale-105 transition-all shadow-xl shadow-black/10 flex items-center space-x-2'>
                    <Plus className='w-5 h-5' />
                    <span>發布新項目</span>
                  </button>
                  <button
                    onClick={() => setShowAIAssistant(!showAIAssistant)}
                    className='px-6 py-3 bg-indigo-500/30 text-white rounded-2xl font-bold hover:bg-indigo-500/40 border border-white/20 backdrop-blur-sm transition-all flex items-center space-x-2'>
                    <Brain className='w-5 h-5' />
                    <span>AI 輔助分發</span>
                  </button>
                </div>
              </div>

              <div className='hidden lg:flex items-center space-x-6'>
                <div className='relative'>
                  <div className='absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur opacity-40 animate-pulse' />
                  <img
                    src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang'}
                    alt='Avatar'
                    className='relative w-32 h-32 rounded-full border-4 border-white shadow-2xl'
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {[
              {
                label: '項目總數',
                value: projects.length,
                change: '+2 本月',
                icon: Briefcase,
                color: 'blue',
                trend: 'up',
              },
              {
                label: '活躍進程',
                value: activeProjectsDisplay.length,
                change: '進度正常',
                icon: Zap,
                color: 'amber',
                trend: 'stable',
              },
              {
                label: '本月總支付',
                value: 'NT$ 32K',
                change: '+15.2%',
                icon: DollarSign,
                color: 'emerald',
                trend: 'up',
              },
              { label: '平均滿意度', value: '98%', change: '高標', icon: CheckCircle, color: 'purple', trend: 'up' },
            ].map((stat, idx) => (
              <div
                key={idx}
                className='bg-[var(--bg-card)] rounded-3xl p-6 border border-[var(--border-color)] hover:shadow-2xl hover:shadow-purple-500/5 transition-all duration-300 group'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
                    <stat.icon className='w-6 h-6 text-[var(--text-primary)]' />
                  </div>
                  <div
                    className={`flex items-center space-x-1 text-xs font-bold ${stat.trend === 'up' ? 'text-green-500' : 'text-blue-500'} bg-gray-50 dark:bg-gray-800/50 px-2 py-1 rounded-full`}>
                    {stat.trend === 'up' && <TrendingUp className='w-3 h-3' />}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div className='space-y-1'>
                  <div className='text-3xl font-extrabold text-[var(--text-primary)]'>{stat.value}</div>
                  <div className='text-sm text-[var(--text-muted)] font-medium uppercase tracking-wider'>
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 3. Main Area */}
      <div className='grid grid-cols-12 gap-8'>
        <div className='col-span-12 lg:col-span-8 space-y-8'>
          {/* Tabs */}
          <div className='flex items-center justify-between bg-[var(--bg-card)] p-2 rounded-2xl border border-[var(--border-color)]'>
            <div className='flex space-x-1'>
              {[
                { id: 'overview', name: '全景概覽', icon: Layout },
                { id: 'projects', name: '項目清單', icon: Target },
                { id: 'talents', name: '人才庫', icon: Users },
                { id: 'finance', name: '財務概況', icon: CreditCard },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                      : 'text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]'
                  }`}>
                  <tab.icon className='w-4 h-4' />
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'overview' && (
            <div className='space-y-8 animate-slide-up'>
              {/* Project Cards */}
              <div className='bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] overflow-hidden'>
                <div className='p-6 border-b border-[var(--border-color)] flex items-center justify-between'>
                  <h2 className='text-xl font-bold text-[var(--text-primary)]'>活躍項目狀態</h2>
                  <button className='text-sm text-purple-600 font-bold'>查看全部</button>
                </div>
                <div className='divide-y divide-[var(--border-subtle)]'>
                  {activeProjectsDisplay.slice(0, 3).map((project) => (
                    <div
                      key={project.id}
                      className='p-6 hover:bg-[var(--bg-card-hover)] transition-colors group cursor-pointer'
                      onClick={() => navigate(`/projects/${project.id}`)}>
                      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                        <div className='space-y-1'>
                          <h3 className='font-bold text-lg text-[var(--text-primary)]'>{project.title}</h3>
                          <div className='flex items-center space-x-4 text-xs text-[var(--text-muted)]'>
                            <span className='flex items-center space-x-1'>
                              <Clock className='w-3 h-3' />
                              <span>更新於 {new Date(project.updatedAt).toLocaleDateString()}</span>
                            </span>
                          </div>
                        </div>
                        <ChevronRight className='w-5 h-5 text-[var(--text-muted)] group-hover:text-purple-600 group-hover:translate-x-1 transition-all' />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Secondary Grid */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] p-6'>
                  <h2 className='text-lg font-bold text-[var(--text-primary)] mb-4'>今日待辦</h2>
                  <div className='space-y-4'>
                    {[
                      { title: '審核 "智能合約" 里程碑', color: 'blue' },
                      { title: '託管 "前端重構" 資金', color: 'green' },
                      { title: '回覆開發者提問', color: 'purple' },
                    ].map((t, i) => (
                      <div key={i} className='flex items-center space-x-3 p-3 bg-[var(--bg-input)] rounded-2xl'>
                        <div className={`w-2 h-2 rounded-full bg-${t.color}-500`} />
                        <span className='text-sm font-medium text-[var(--text-primary)]'>{t.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] p-6'>
                  <h2 className='text-lg font-bold text-[var(--text-primary)] mb-4'>AI 人才推薦</h2>
                  <div className='flex -space-x-3 mb-4'>
                    {RECOMMENDED_TALENTS.slice(0, 3).map((t) => (
                      <img
                        key={t.id}
                        src={t.avatar}
                        className='w-10 h-10 rounded-full border-2 border-[var(--bg-card)]'
                      />
                    ))}
                    <div className='w-10 h-10 bg-purple-600 text-white rounded-full border-2 border-[var(--bg-card)] flex items-center justify-center text-[10px] font-bold'>
                      +5
                    </div>
                  </div>
                  <p className='text-sm text-[var(--text-muted)] mb-4'>
                    基於您的項目需求，AI 發現了 3 位極高匹配度的開發者。
                  </p>
                  <button className='w-full py-2 bg-purple-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-500/20'>
                    查看匹配
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className='animate-fade-in'>
              <ProjectsPage isEmbedded={true} />
            </div>
          )}

          {activeTab === 'talents' && (
            <div className='animate-fade-in'>
              <TalentPoolPage isEmbedded={true} />
            </div>
          )}
        </div>

        <div className='col-span-12 lg:col-span-4 space-y-8'>
          {/* AI Panel */}
          {showAIAssistant && <AIAssistantPanel currentRole='project_initiator' onTaskComplete={() => {}} />}

          {/* Regional Health */}
          <div className='bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] p-6'>
            <h2 className='text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center justify-between'>
              <span>全球供應動態</span>
              <Globe className='w-5 h-5 text-blue-500' />
            </h2>
            <div className='space-y-4'>
              {REGIONS.slice(0, 3).map((r) => (
                <div key={r.id} className='flex items-center justify-between p-3 bg-[var(--bg-input)] rounded-2xl'>
                  <div className='flex items-center space-x-2'>
                    <span>{r.flag}</span>
                    <span className='text-xs font-bold text-[var(--text-primary)]'>{r.name}</span>
                  </div>
                  <span className='text-[10px] font-bold text-green-500'>1.2K 人才</span>
                </div>
              ))}
            </div>
          </div>

          <div className='bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 text-white'>
            <h3 className='text-lg font-bold mb-4 flex items-center space-x-2'>
              <BarChart3 className='w-5 h-5 text-purple-400' />
              <span>收益預測</span>
            </h3>
            <div className='space-y-4'>
              <div className='flex justify-between text-xs text-gray-400 font-bold'>
                <span>預算執行率</span>
                <span>85%</span>
              </div>
              <div className='h-2 bg-white/10 rounded-full'>
                <div className='h-full bg-purple-500 rounded-full w-[85%]' />
              </div>
            </div>
            <button className='w-full mt-8 py-3 bg-white text-black rounded-2xl text-sm font-bold'>查看詳情報告</button>
          </div>
        </div>
      </div>
    </div>
  )
}
