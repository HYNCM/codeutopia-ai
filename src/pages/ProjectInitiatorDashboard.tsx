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

// 模擬數據
const DASHBOARD_STATS = {
  totalProjects: 12,
  activeProjects: 8,
  pendingApplications: 5,
  connectedTalents: 23,
  aiAssistCalls: 156,
  pendingMilestones: 7,
  totalSpent: 285000,
  completionRate: 94,
}

const RECOMMENDED_TALENTS = [
  {
    id: '1',
    name: '王建國',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wang',
    role: '資深全棧工程師',
    skills: ['React', 'Node.js', 'Python', 'AI/ML'],
    rating: 4.9,
    completedProjects: 28,
    hourlyRate: 85,
    availability: 'available',
    matchScore: 95,
    region: '台灣',
    timezone: 'Asia/Taipei',
  },
  {
    id: '2',
    name: '李美華',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Li',
    role: 'UX 設計師',
    skills: ['Figma', 'UI Design', 'Prototyping', 'User Research'],
    rating: 4.8,
    completedProjects: 34,
    hourlyRate: 75,
    availability: 'busy',
    matchScore: 88,
    region: '新加坡',
    timezone: 'Asia/Singapore',
  },
  {
    id: '3',
    name: '陳志偉',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chen',
    role: '後端架構師',
    skills: ['Go', 'Kubernetes', 'System Design', 'PostgreSQL'],
    rating: 5.0,
    completedProjects: 19,
    hourlyRate: 120,
    availability: 'available',
    matchScore: 92,
    region: '日本',
    timezone: 'Asia/Tokyo',
  },
]

const PENDING_TASKS = [
  {
    id: 't1',
    type: 'application',
    title: '新人才申請 (3)',
    description: '王建國申請參與智能客服項目',
    time: '2小時前',
    priority: 'high',
  },
  {
    id: 't2',
    type: 'milestone',
    title: '里程碑驗收 (1)',
    description: '「代碼開發里程碑」待驗收',
    time: '5小時前',
    priority: 'medium',
  },
  {
    id: 't3',
    type: 'message',
    title: '人才溝通回覆',
    description: '李美華詢問設計需求細節',
    time: '1天前',
    priority: 'low',
  },
  {
    id: 't4',
    type: 'ai',
    title: 'AI 成果審核 (2)',
    description: 'UX設計師AI輸出待確認',
    time: '1天前',
    priority: 'medium',
  },
  {
    id: 't5',
    type: 'payment',
    title: '里程碑結算',
    description: '「需求確認里程碑」待付款',
    time: '2天前',
    priority: 'high',
  },
]

const ACTIVE_PROJECTS = [
  {
    id: 'p1',
    title: '智能客服系統開發',
    status: 'in_progress',
    progress: 65,
    budget: 45000,
    spent: 29250,
    connectedTalents: 4,
    milestones: [
      { id: 'm1', name: '需求確認', status: 'completed', paid: true },
      { id: 'm2', name: '代碼開發', status: 'in_progress', paid: true },
      { id: 'm3', name: '測試驗收', status: 'pending', paid: false },
    ],
    aiAssistants: ['frontend_engineer', 'qa_engineer'],
    lastActivity: '2小時前',
  },
  {
    id: 'p2',
    title: '數據分析平台 UI/UX 優化',
    status: 'in_progress',
    progress: 40,
    budget: 28000,
    spent: 11200,
    connectedTalents: 2,
    milestones: [
      { id: 'm1', name: '設計調研', status: 'completed', paid: true },
      { id: 'm2', name: '原型設計', status: 'in_progress', paid: false },
      { id: 'm3', name: '交付驗收', status: 'pending', paid: false },
    ],
    aiAssistants: ['ux_designer'],
    lastActivity: '5小時前',
  },
]

const REGIONS = [
  { id: 'us', name: '美國', flag: '🇺🇸', currency: 'USD' },
  { id: 'eu', name: '歐洲', flag: '🇪🇺', currency: 'EUR' },
  { id: 'cn', name: '中國大陸', flag: '🇨🇳', currency: 'CNY' },
  { id: 'tw', name: '台灣', flag: '🇹🇼', currency: 'TWD' },
  { id: 'jp', name: '日本', flag: '🇯🇵', currency: 'JPY' },
  { id: 'in', name: '印度', flag: '🇮🇳', currency: 'INR' },
  { id: 'au', name: '澳洲', flag: '🇦🇺', currency: 'AUD' },
  { id: 'sea', name: '東南亞', flag: '🌏', currency: 'USD' },
]

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
    <div className='min-h-screen bg-gray-50'>
      {/* 頂部導航欄 */}
      <header className='bg-white border-b border-gray-200 sticky top-0 z-40'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            {/* Logo */}
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center'>
                <Sparkles className='w-6 h-6 text-white' />
              </div>
              <span className='text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent'>
                CodeUtopia.ai
              </span>
              <span className='ml-3 px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium'>
                項目主理人
              </span>
            </div>

            {/* 導航標籤 */}
            <nav className='hidden md:flex items-center space-x-1'>
              {[
                { id: 'overview', name: '工作台', icon: Layout },
                { id: 'projects', name: '項目管理', icon: Briefcase },
                { id: 'talents', name: '人才庫', icon: Users },
                { id: 'finance', name: '財務結算', icon: DollarSign },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}>
                  <tab.icon className='w-4 h-4' />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>

            {/* 右側功能 */}
            <div className='flex items-center space-x-4'>
              {/* AI 協助快捷入口 */}
              <button
                onClick={() => setShowAIAssistant(!showAIAssistant)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showAIAssistant
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                <Brain className='w-4 h-4' />
                <span>AI 協助</span>
              </button>

              {/* 消息通知 */}
              <button className='relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors'>
                <Bell className='w-5 h-5' />
                <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full' />
              </button>

              {/* 個人中心 */}
              <div className='flex items-center space-x-3'>
                <div className='text-right hidden sm:block'>
                  <div className='text-sm font-medium text-gray-900'>張偉明</div>
                  <div className='text-xs text-gray-500'>創新科技有限公司</div>
                </div>
                <img
                  src='https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang'
                  alt='用戶頭像'
                  className='w-10 h-10 rounded-full border-2 border-gray-200'
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 主內容區域 */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {activeTab === 'overview' && (
          <div className='grid grid-cols-12 gap-6'>
            {/* 左側主內容 */}
            <div className='col-span-12 lg:col-span-8 space-y-6'>
              {/* 快捷入口 */}
              <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
                <div className='flex items-center justify-between mb-4'>
                  <h2 className='text-lg font-semibold text-gray-900'>快捷操作</h2>
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
                      className='relative p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-center group'>
                      <div
                        className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                        <item.icon className='w-5 h-5 text-white' />
                      </div>
                      <span className='text-xs font-medium text-gray-700'>{item.label}</span>
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
              <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
                <div className='flex items-center justify-between mb-4'>
                  <h2 className='text-lg font-semibold text-gray-900'>數據概覽</h2>
                  <select className='py-1.5 px-3 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700'>
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
                    <div key={idx} className='p-4 bg-gray-50 rounded-xl'>
                      <div className='flex items-center justify-between mb-2'>
                        <span className='text-sm text-gray-500'>{stat.label}</span>
                        <div className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center`}>
                          <stat.icon className={`w-4 h-4 ${stat.color}`} />
                        </div>
                      </div>
                      <div className='text-2xl font-bold text-gray-900'>{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 進行中項目 */}
              <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
                <div className='flex items-center justify-between mb-4'>
                  <h2 className='text-lg font-semibold text-gray-900'>進行中項目</h2>
                  <button
                    onClick={() => setActiveTab('projects')}
                    className='flex items-center space-x-1 text-sm text-purple-600 hover:text-purple-700'>
                    <span>查看全部</span>
                    <ChevronRight className='w-4 h-4' />
                  </button>
                </div>
                <div className='space-y-4'>
                  {activeProjectsDisplay.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => navigate(`/projects/${project.id}`)}
                      className='p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer'>
                      <div className='flex items-start justify-between mb-3'>
                        <div>
                          <h3 className='font-medium text-gray-900'>{project.title}</h3>
                          <div className='flex items-center space-x-4 mt-1 text-sm text-gray-500'>
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
                          <span className='px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs'>AI 協作</span>
                        </div>
                      </div>

                      {/* 進度條 */}
                      <div className='mb-3'>
                        <div className='flex items-center justify-between text-sm mb-1'>
                          <span className='text-gray-500'>項目進度</span>
                          <span className='font-medium text-gray-900'>0%</span>
                        </div>
                        <div className='w-full h-2 bg-gray-200 rounded-full overflow-hidden'>
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
                                <div className='w-3 h-3 border-2 border-gray-300 rounded-full' />
                              )}
                              <span className='text-xs text-gray-600 truncate'>{milestone.title}</span>
                            </div>
                            {idx < (project.milestones?.length || 0) - 1 && idx < 2 && (
                              <div className='h-0.5 bg-gray-200 ml-1.5' />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 待辦事項 */}
              <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
                <div className='flex items-center justify-between mb-4'>
                  <h2 className='text-lg font-semibold text-gray-900'>待辦事項</h2>
                  <span className='px-2 py-1 bg-red-100 text-red-700 rounded text-sm'>
                    {PENDING_TASKS.length} 項待處理
                  </span>
                </div>
                <div className='space-y-3'>
                  {PENDING_TASKS.map((task) => (
                    <div
                      key={task.id}
                      className='flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer'>
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
                          <h4 className='font-medium text-gray-900'>{task.title}</h4>
                          {task.priority === 'high' && (
                            <span className='px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-xs'>緊急</span>
                          )}
                        </div>
                        <p className='text-sm text-gray-500'>{task.description}</p>
                      </div>
                      <div className='text-right'>
                        <span className='text-xs text-gray-400'>{task.time}</span>
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
              <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
                <div className='flex items-center justify-between mb-4'>
                  <h2 className='text-lg font-semibold text-gray-900'>推薦人才</h2>
                  <button
                    onClick={() => setActiveTab('talents')}
                    className='text-sm text-purple-600 hover:text-purple-700'>
                    查看全部
                  </button>
                </div>
                <div className='space-y-4'>
                  {RECOMMENDED_TALENTS.map((talent) => (
                    <div
                      key={talent.id}
                      className='p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer'>
                      <div className='flex items-start space-x-3'>
                        <img src={talent.avatar} alt={talent.name} className='w-12 h-12 rounded-full' />
                        <div className='flex-1'>
                          <div className='flex items-center space-x-2'>
                            <h4 className='font-medium text-gray-900'>{talent.name}</h4>
                            {talent.availability === 'available' && (
                              <span className='w-2 h-2 bg-green-500 rounded-full' />
                            )}
                          </div>
                          <p className='text-sm text-gray-500'>{talent.role}</p>
                          <div className='flex flex-wrap gap-1 mt-2'>
                            {talent.skills.slice(0, 3).map((skill) => (
                              <span key={skill} className='px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-xs'>
                                {skill}
                              </span>
                            ))}
                          </div>
                          <div className='flex items-center justify-between mt-2'>
                            <div className='flex items-center space-x-1'>
                              <Star className='w-4 h-4 text-yellow-400 fill-current' />
                              <span className='text-sm font-medium text-gray-900'>{talent.rating}</span>
                              <span className='text-xs text-gray-400'>({talent.completedProjects} 項目)</span>
                            </div>
                            <span className='text-sm font-medium text-purple-600'>${talent.hourlyRate}/h</span>
                          </div>
                        </div>
                      </div>
                      <div className='flex items-center justify-between mt-3 pt-3 border-t border-gray-200'>
                        <span className='text-xs text-gray-400'>匹配度 {talent.matchScore}%</span>
                        <div className='flex space-x-2'>
                          <button className='px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200 transition-colors'>
                            發送邀請
                          </button>
                          <button className='px-3 py-1 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-100 transition-colors'>
                            查看
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 區域分佈 */}
              <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
                <h2 className='text-lg font-semibold text-gray-900 mb-4'>項目區域分佈</h2>
                <div className='grid grid-cols-4 gap-2'>
                  {REGIONS.map((region) => (
                    <div key={region.id} className='text-center p-2 bg-gray-50 rounded-lg'>
                      <div className='text-lg'>{region.flag}</div>
                      <div className='text-xs text-gray-600 truncate'>{region.name}</div>
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
                <h1 className='text-2xl font-bold text-gray-900'>項目管理</h1>
                <p className='text-gray-500 mt-1'>管理所有發起的項目，追蹤進度與里程碑</p>
              </div>
              <Link
                to='/projects/new'
                className='flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg shadow-purple-500/25'>
                <Plus className='w-5 h-5' />
                <span>發布新項目</span>
              </Link>
            </div>

            {/* 項目篩選 */}
            <div className='bg-white rounded-2xl p-4 shadow-sm border border-gray-100'>
              <div className='flex items-center space-x-4'>
                <div className='flex-1 relative'>
                  <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                  <input
                    type='text'
                    placeholder='搜索項目名稱...'
                    className='w-full pl-12 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500'
                  />
                </div>
                <select className='py-2.5 px-4 bg-gray-100 border border-gray-200 rounded-xl text-gray-700'>
                  <option>全部狀態</option>
                  <option>進行中</option>
                  <option>待對接</option>
                  <option>已完成</option>
                  <option>已關閉</option>
                </select>
                <select className='py-2.5 px-4 bg-gray-100 border border-gray-200 rounded-xl text-gray-700'>
                  <option>全部區域</option>
                  {REGIONS.map((r) => (
                    <option key={r.id}>{r.name}</option>
                  ))}
                </select>
                <button className='flex items-center space-x-2 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50'>
                  <Filter className='w-5 h-5' />
                  <span>更多篩選</span>
                </button>
              </div>
            </div>

            {/* 項目列表 */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead className='bg-gray-50 border-b border-gray-100'>
                    <tr>
                      <th className='px-6 py-4 text-left text-sm font-medium text-gray-500'>項目名稱</th>
                      <th className='px-6 py-4 text-left text-sm font-medium text-gray-500'>狀態</th>
                      <th className='px-6 py-4 text-left text-sm font-medium text-gray-500'>進度</th>
                      <th className='px-6 py-4 text-left text-sm font-medium text-gray-500'>預算</th>
                      <th className='px-6 py-4 text-left text-sm font-medium text-gray-500'>人才</th>
                      <th className='px-6 py-4 text-left text-sm font-medium text-gray-500'>AI 輔助</th>
                      <th className='px-6 py-4 text-left text-sm font-medium text-gray-500'>最近活動</th>
                      <th className='px-6 py-4 text-right text-sm font-medium text-gray-500'>操作</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-100'>
                    {myProjects.map((project) => (
                      <tr key={project.id} className='hover:bg-gray-50 transition-colors'>
                        <td className='px-6 py-4'>
                          <div>
                            <div className='font-medium text-gray-900'>{project.title}</div>
                            <div className='text-sm text-gray-500'>#{project.id}</div>
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          <span
                            className={`px-2.5 py-1 rounded-full text-sm font-medium ${
                              project.status === 'in_progress'
                                ? 'bg-blue-100 text-blue-700'
                                : project.status === 'open'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-700'
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
                            <div className='w-24 h-2 bg-gray-200 rounded-full overflow-hidden'>
                              <div
                                className='h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full'
                                style={{ width: `0%` }}
                              />
                            </div>
                            <span className='text-sm text-gray-600'>0%</span>
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          <div className='font-medium text-gray-900'>
                            {project.budget.currency} {project.budget.max.toLocaleString()}
                          </div>
                          <div className='text-sm text-gray-500'>預算範圍</div>
                        </td>
                        <td className='px-6 py-4'>
                          <div className='flex items-center space-x-1'>
                            <Users className='w-4 h-4 text-gray-400' />
                            <span className='text-gray-900'>{project.bids?.length || 0}</span>
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          <div className='flex space-x-1'>
                            <span className='px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs'>AI</span>
                          </div>
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-500'>
                          {new Date(project.updatedAt).toLocaleDateString()}
                        </td>
                        <td className='px-6 py-4 text-right'>
                          <Link
                            to={`/projects/${project.id}`}
                            className='inline-flex items-center space-x-1 px-3 py-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors'>
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
                <h1 className='text-2xl font-bold text-gray-900'>人才庫</h1>
                <p className='text-gray-500 mt-1'>搜索和篩選全球優質開發者與設計師</p>
              </div>
            </div>

            {/* 人才篩選 */}
            <div className='bg-white rounded-2xl p-4 shadow-sm border border-gray-100'>
              <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                <div className='relative'>
                  <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                  <input
                    type='text'
                    placeholder='搜索人才...'
                    className='w-full pl-12 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500'
                  />
                </div>
                <select className='py-2.5 px-4 bg-gray-100 border border-gray-200 rounded-xl text-gray-700'>
                  <option>全部技能</option>
                  <option>React</option>
                  <option>Node.js</option>
                  <option>AI/ML</option>
                  <option>UI/UX</option>
                </select>
                <select className='py-2.5 px-4 bg-gray-100 border border-gray-200 rounded-xl text-gray-700'>
                  <option>全部區域</option>
                  {REGIONS.map((r) => (
                    <option key={r.id}>{r.name}</option>
                  ))}
                </select>
                <select className='py-2.5 px-4 bg-gray-100 border border-gray-200 rounded-xl text-gray-700'>
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
                  className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
                  <div className='flex items-start space-x-4'>
                    <img src={talent.avatar} alt={talent.name} className='w-16 h-16 rounded-full' />
                    <div className='flex-1'>
                      <div className='flex items-center space-x-2'>
                        <h3 className='font-semibold text-gray-900'>{talent.name}</h3>
                        {talent.availability === 'available' && (
                          <span className='px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs'>可接單</span>
                        )}
                      </div>
                      <p className='text-sm text-gray-500'>{talent.role}</p>
                      <div className='flex items-center space-x-2 mt-2'>
                        <div className='flex items-center'>
                          <Star className='w-4 h-4 text-yellow-400 fill-current' />
                          <span className='text-sm font-medium text-gray-900 ml-1'>{talent.rating}</span>
                        </div>
                        <span className='text-sm text-gray-400'>|</span>
                        <span className='text-sm text-gray-500'>{talent.completedProjects} 項目</span>
                      </div>
                    </div>
                  </div>
                  <div className='mt-4'>
                    <div className='flex flex-wrap gap-2'>
                      {talent.skills.map((skill) => (
                        <span key={skill} className='px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm'>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className='flex items-center justify-between mt-4 pt-4 border-t border-gray-100'>
                    <div className='text-lg font-semibold text-gray-900'>${talent.hourlyRate}/h</div>
                    <div className='flex space-x-2'>
                      <button className='px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors'>
                        發送邀請
                      </button>
                      <button className='px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors'>
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
              <h1 className='text-2xl font-bold text-gray-900'>財務結算</h1>
              <p className='text-gray-500 mt-1'>管理項目支出、里程碑付款與發票</p>
            </div>

            {/* 財務摘要卡片 */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              {[
                { label: '本月支出', value: '$45,000', change: '+12.5%', positive: true, color: 'blue' },
                { label: '待結算金額', value: '$12,500', change: '3 筆', positive: false, color: 'orange' },
                { label: '已結算金額', value: '$232,500', change: '本月', positive: true, color: 'green' },
                { label: '爭議中金額', value: '$0', change: '無', positive: true, color: 'gray' },
              ].map((stat, idx) => (
                <div key={idx} className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
                  <div className='text-sm text-gray-500 mb-1'>{stat.label}</div>
                  <div className='text-2xl font-bold text-gray-900'>{stat.value}</div>
                  <div className={`text-sm mt-2 ${stat.positive ? 'text-green-600' : 'text-gray-400'}`}>
                    {stat.change}
                  </div>
                </div>
              ))}
            </div>

            {/* 結算記錄表格 */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
              <div className='px-6 py-4 border-b border-gray-100'>
                <h2 className='font-semibold text-gray-900'>結算記錄</h2>
              </div>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>項目</th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>里程碑</th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>金額</th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>狀態</th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>日期</th>
                      <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>操作</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-100'>
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
                      <tr key={idx} className='hover:bg-gray-50'>
                        <td className='px-6 py-4 text-sm text-gray-900'>{row.project}</td>
                        <td className='px-6 py-4 text-sm text-gray-600'>{row.milestone}</td>
                        <td className='px-6 py-4 text-sm font-medium text-gray-900'>{row.amount}</td>
                        <td className='px-6 py-4'>
                          <span className='px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium'>
                            {row.status}
                          </span>
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-500'>{row.date}</td>
                        <td className='px-6 py-4 text-right'>
                          <button className='text-purple-600 hover:text-purple-700 text-sm'>下載發票</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
