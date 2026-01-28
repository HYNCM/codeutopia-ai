import { useState } from 'react'
import {
  Sparkles,
  Users,
  Briefcase,
  DollarSign,
  Shield,
  Settings,
  Bell,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Brain,
  Target,
  MessageSquare,
  FileText,
  Search,
  Filter,
  MoreHorizontal,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  PieChart,
  Zap,
  Eye,
  Edit,
  Trash2,
  Lock,
  Unlock,
  UserPlus,
  UserMinus,
  MessageCircle,
  Gavel,
} from 'lucide-react'

// 模擬數據
const ADMIN_STATS = {
  totalUsers: 2847,
  totalProjects: 856,
  totalRevenue: 1285000,
  activeDisputes: 12,
  userGrowth: 15.2,
  projectGrowth: 8.7,
  revenueGrowth: 22.3,
  disputeResolution: 94,
}

const RECENT_ACTIVITIES = [
  { type: 'user', title: '新用戶註冊', description: '王建國註冊成為接案者', time: '5分鐘前', icon: Users },
  { type: 'project', title: '新項目發布', description: '智能客服系統開發', time: '15分鐘前', icon: Briefcase },
  { type: 'payment', title: '里程碑結算', description: '代碼開發里程碑 $15,000', time: '1小時前', icon: DollarSign },
  { type: 'dispute', title: '爭議處理', description: '項目 #456 爭議已解決', time: '2小時前', icon: MessageCircle },
  { type: 'ai', title: 'AI 調用統計', description: '今日 AI 協助調用 1,247 次', time: '3小時前', icon: Brain },
]

const PENDING_REVIEWS = [
  {
    id: 'p1',
    type: 'project',
    title: '企業內部管理系統開發',
    submitter: '創新科技有限公司',
    submittedAt: '2024-01-18',
    status: 'pending',
    priority: 'high',
  },
  {
    id: 'p2',
    type: 'user',
    title: '接案者資質認證',
    submitter: '李美華',
    submittedAt: '2024-01-18',
    status: 'pending',
    priority: 'medium',
  },
  {
    id: 'p3',
    type: 'project',
    title: 'AI 驅動數據分析平台',
    submitter: '數據智慧有限公司',
    submittedAt: '2024-01-17',
    status: 'pending',
    priority: 'low',
  },
]

const DISPUTES = [
  {
    id: 'd1',
    project: '智能客服系統開發',
    type: '里程碑驗收爭議',
    status: '初步處理中',
    initiator: '接案者',
    amount: '$3,000',
    createdAt: '2024-01-16',
  },
  {
    id: 'd2',
    project: '電商平台前端開發',
    type: '交付質量爭議',
    status: '待裁定',
    initiator: '項目主理人',
    amount: '$5,500',
    createdAt: '2024-01-15',
  },
]

const REGION_DATA = [
  { id: 'tw', name: '台灣', users: 856, projects: 245, revenue: 320000, growth: 12.5 },
  { id: 'sg', name: '新加坡', users: 523, projects: 178, revenue: 280000, growth: 18.2 },
  { id: 'jp', name: '日本', users: 412, projects: 156, revenue: 245000, growth: 8.7 },
  { id: 'hk', name: '香港', users: 298, projects: 89, revenue: 156000, growth: 15.3 },
  { id: 'my', name: '馬來西亞', users: 234, projects: 67, revenue: 89000, growth: 22.1 },
  { id: 'au', name: '澳洲', users: 189, projects: 54, revenue: 98000, growth: 9.8 },
]

const AI_STATS = {
  totalCalls: 45678,
  callsToday: 2345,
  avgSatisfaction: 4.6,
  successRate: 96.8,
  roleDistribution: [
    { role: '前端工程師 AI', percentage: 32 },
    { role: '後端工程師 AI', percentage: 28 },
    { role: 'UX 設計師 AI', percentage: 18 },
    { role: '測試工程師 AI', percentage: 15 },
    { role: '產品經理 AI', percentage: 7 },
  ],
}

interface WebadminDashboardProps {
  currentRole?: string
}

export default function WebadminDashboard({ currentRole }: WebadminDashboardProps = {}) {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'projects' | 'disputes' | 'settings'>('overview')

  return (
    <div className='min-h-screen bg-gray-900 text-white'>
      {/* 頂部導航欄 */}
      <header className='bg-gray-800 border-b border-gray-700 sticky top-0 z-40'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            {/* Logo */}
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center'>
                <Sparkles className='w-6 h-6 text-white' />
              </div>
              <div>
                <span className='text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent'>
                  CodeUtopia.ai
                </span>
                <div className='text-xs text-gray-400'>管理後台</div>
              </div>
            </div>

            {/* 導航標籤 */}
            <nav className='hidden md:flex items-center space-x-1'>
              {[
                { id: 'overview', name: '數據概覽', icon: BarChart3 },
                { id: 'users', name: '用戶管理', icon: Users },
                { id: 'projects', name: '項目審核', icon: Briefcase },
                { id: 'disputes', name: '爭議處理', icon: Gavel },
                { id: 'settings', name: '規則配置', icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}>
                  <tab.icon className='w-4 h-4' />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>

            {/* 右側功能 */}
            <div className='flex items-center space-x-4'>
              {/* 系統通知 */}
              <button className='relative p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors'>
                <Bell className='w-5 h-5' />
                <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full' />
              </button>

              {/* 管理員信息 */}
              <div className='flex items-center space-x-3'>
                <div className='text-right hidden sm:block'>
                  <div className='text-sm font-medium text-white'>系統管理員</div>
                  <div className='text-xs text-gray-400'>超級管理員</div>
                </div>
                <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center'>
                  <Shield className='w-5 h-5 text-white' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 主內容區域 */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {activeTab === 'overview' && (
          <div className='space-y-6'>
            {/* 數據概覽卡片 */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              {[
                {
                  label: '總用戶數',
                  value: ADMIN_STATS.totalUsers.toLocaleString(),
                  change: `+${ADMIN_STATS.userGrowth}%`,
                  positive: true,
                  icon: Users,
                  color: 'blue',
                },
                {
                  label: '總項目數',
                  value: ADMIN_STATS.totalProjects.toLocaleString(),
                  change: `+${ADMIN_STATS.projectGrowth}%`,
                  positive: true,
                  icon: Briefcase,
                  color: 'green',
                },
                {
                  label: '總營收',
                  value: `$${(ADMIN_STATS.totalRevenue / 1000000).toFixed(2)}M`,
                  change: `+${ADMIN_STATS.revenueGrowth}%`,
                  positive: true,
                  icon: DollarSign,
                  color: 'purple',
                },
                {
                  label: '待處理爭議',
                  value: ADMIN_STATS.activeDisputes.toString(),
                  change: '需處理',
                  positive: false,
                  icon: AlertTriangle,
                  color: 'amber',
                },
              ].map((stat, idx) => (
                <div key={idx} className='bg-gray-800 rounded-2xl p-6 border border-gray-700'>
                  <div className='flex items-center justify-between mb-4'>
                    <span className='text-sm text-gray-400'>{stat.label}</span>
                    <div className={`w-10 h-10 bg-${stat.color}-500/20 rounded-xl flex items-center justify-center`}>
                      <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                    </div>
                  </div>
                  <div className='text-2xl font-bold text-white mb-2'>{stat.value}</div>
                  <div className={`flex items-center text-sm ${stat.positive ? 'text-green-400' : 'text-amber-400'}`}>
                    {stat.positive ? <ArrowUpRight className='w-4 h-4 mr-1' /> : <Clock className='w-4 h-4 mr-1' />}
                    <span>{stat.change}</span>
                    <span className='text-gray-500 ml-1'>較上月</span>
                  </div>
                </div>
              ))}
            </div>

            <div className='grid grid-cols-12 gap-6'>
              {/* 左側：區域數據與 AI 統計 */}
              <div className='col-span-12 lg:col-span-8 space-y-6'>
                {/* 區域數據 */}
                <div className='bg-gray-800 rounded-2xl p-6 border border-gray-700'>
                  <div className='flex items-center justify-between mb-4'>
                    <h2 className='text-lg font-semibold text-white'>區域運營數據</h2>
                    <select className='py-1.5 px-3 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white'>
                      <option>近30天</option>
                      <option>近90天</option>
                      <option>近1年</option>
                    </select>
                  </div>
                  <div className='overflow-x-auto'>
                    <table className='w-full'>
                      <thead>
                        <tr className='text-left text-sm text-gray-400 border-b border-gray-700'>
                          <th className='pb-3 font-medium'>區域</th>
                          <th className='pb-3 font-medium'>用戶數</th>
                          <th className='pb-3 font-medium'>項目數</th>
                          <th className='pb-3 font-medium'>營收</th>
                          <th className='pb-3 font-medium'>增長率</th>
                          <th className='pb-3 font-medium text-right'>操作</th>
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-gray-700'>
                        {REGION_DATA.map((region) => (
                          <tr key={region.id} className='hover:bg-gray-750'>
                            <td className='py-4'>
                              <div className='flex items-center space-x-2'>
                                <span className='text-lg'>
                                  {region.id === 'tw'
                                    ? '🇹🇼'
                                    : region.id === 'sg'
                                      ? '🇸🇬'
                                      : region.id === 'jp'
                                        ? '🇯🇵'
                                        : region.id === 'hk'
                                          ? '🇭🇰'
                                          : region.id === 'my'
                                            ? '🇲🇾'
                                            : '🇦🇺'}
                                </span>
                                <span className='font-medium text-white'>{region.name}</span>
                              </div>
                            </td>
                            <td className='py-4 text-gray-300'>{region.users.toLocaleString()}</td>
                            <td className='py-4 text-gray-300'>{region.projects}</td>
                            <td className='py-4 text-gray-300'>${(region.revenue / 1000).toFixed(0)}K</td>
                            <td className='py-4'>
                              <span className='flex items-center text-green-400'>
                                <ArrowUpRight className='w-4 h-4 mr-1' />
                                {region.growth}%
                              </span>
                            </td>
                            <td className='py-4 text-right'>
                              <button className='text-purple-400 hover:text-purple-300 text-sm'>查看詳情</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* AI 運營數據 */}
                <div className='bg-gray-800 rounded-2xl p-6 border border-gray-700'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center space-x-3'>
                      <div className='w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center'>
                        <Brain className='w-5 h-5 text-purple-400' />
                      </div>
                      <div>
                        <h2 className='text-lg font-semibold text-white'>AI 協助角色運營數據</h2>
                        <p className='text-sm text-gray-400'>監控 AI 角色調用情況與人類滿意度</p>
                      </div>
                    </div>
                  </div>
                  <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
                    {[
                      { label: '總調用次數', value: AI_STATS.totalCalls.toLocaleString(), icon: Zap },
                      { label: '今日調用', value: AI_STATS.callsToday.toLocaleString(), icon: Activity },
                      { label: '平均滿意度', value: `${AI_STATS.avgSatisfaction} ★`, icon: TrendingUp },
                      { label: '成功率', value: `${AI_STATS.successRate}%`, icon: CheckCircle },
                    ].map((stat, idx) => (
                      <div key={idx} className='p-4 bg-gray-700/50 rounded-xl'>
                        <div className='flex items-center justify-between mb-2'>
                          <span className='text-sm text-gray-400'>{stat.label}</span>
                          <stat.icon className='w-4 h-4 text-purple-400' />
                        </div>
                        <div className='text-xl font-bold text-white'>{stat.value}</div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h3 className='text-sm font-medium text-gray-400 mb-3'>AI 角色調用分佈</h3>
                    <div className='space-y-2'>
                      {AI_STATS.roleDistribution.map((item, idx) => (
                        <div key={idx} className='flex items-center space-x-3'>
                          <span className='text-sm text-gray-300 w-32'>{item.role}</span>
                          <div className='flex-1 h-2 bg-gray-700 rounded-full overflow-hidden'>
                            <div
                              className='h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full'
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                          <span className='text-sm text-gray-400 w-12'>{item.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 右側：待審核與最近活動 */}
              <div className='col-span-12 lg:col-span-4 space-y-6'>
                {/* 待審核項目 */}
                <div className='bg-gray-800 rounded-2xl p-6 border border-gray-700'>
                  <div className='flex items-center justify-between mb-4'>
                    <h2 className='text-lg font-semibold text-white'>待審核</h2>
                    <span className='px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-sm'>
                      {PENDING_REVIEWS.length}
                    </span>
                  </div>
                  <div className='space-y-3'>
                    {PENDING_REVIEWS.map((item) => (
                      <div
                        key={item.id}
                        className='p-3 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors cursor-pointer'>
                        <div className='flex items-start justify-between mb-2'>
                          <div className='flex items-center space-x-2'>
                            {item.type === 'project' ? (
                              <Briefcase className='w-4 h-4 text-blue-400' />
                            ) : (
                              <Users className='w-4 h-4 text-green-400' />
                            )}
                            <span className='text-sm font-medium text-white'>{item.title}</span>
                          </div>
                          {item.priority === 'high' && (
                            <span className='px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded text-xs'>緊急</span>
                          )}
                        </div>
                        <div className='flex items-center justify-between text-xs text-gray-400'>
                          <span>{item.submitter}</span>
                          <span>{item.submittedAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className='w-full mt-4 py-2 bg-gray-700 text-gray-300 rounded-xl text-sm hover:bg-gray-600 transition-colors'>
                    查看全部待審核
                  </button>
                </div>

                {/* 最近活動 */}
                <div className='bg-gray-800 rounded-2xl p-6 border border-gray-700'>
                  <div className='flex items-center justify-between mb-4'>
                    <h2 className='text-lg font-semibold text-white'>最近活動</h2>
                  </div>
                  <div className='space-y-4'>
                    {RECENT_ACTIVITIES.map((activity, idx) => (
                      <div key={idx} className='flex items-start space-x-3'>
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            activity.type === 'user'
                              ? 'bg-blue-500/20'
                              : activity.type === 'project'
                                ? 'bg-green-500/20'
                                : activity.type === 'payment'
                                  ? 'bg-purple-500/20'
                                  : activity.type === 'dispute'
                                    ? 'bg-amber-500/20'
                                    : 'bg-pink-500/20'
                          }`}>
                          <activity.icon
                            className={`w-4 h-4 ${
                              activity.type === 'user'
                                ? 'text-blue-400'
                                : activity.type === 'project'
                                  ? 'text-green-400'
                                  : activity.type === 'payment'
                                    ? 'text-purple-400'
                                    : activity.type === 'dispute'
                                      ? 'text-amber-400'
                                      : 'text-pink-400'
                            }`}
                          />
                        </div>
                        <div className='flex-1'>
                          <div className='text-sm font-medium text-white'>{activity.title}</div>
                          <div className='text-xs text-gray-400'>{activity.description}</div>
                        </div>
                        <span className='text-xs text-gray-500'>{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 快捷操作 */}
                <div className='bg-gray-800 rounded-2xl p-6 border border-gray-700'>
                  <h2 className='text-lg font-semibold text-white mb-4'>快捷操作</h2>
                  <div className='grid grid-cols-2 gap-3'>
                    {[
                      { icon: UserPlus, label: '添加管理員', color: 'blue' },
                      { icon: FileText, label: '發佈公告', color: 'green' },
                      { icon: Settings, label: '系統配置', color: 'purple' },
                      { icon: Gavel, label: '爭議裁定', color: 'amber' },
                    ].map((action, idx) => (
                      <button
                        key={idx}
                        className={`p-3 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors text-center`}>
                        <action.icon className={`w-5 h-5 text-${action.color}-400 mx-auto mb-2`} />
                        <span className='text-sm text-gray-300'>{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 用戶管理標籤 */}
        {activeTab === 'users' && (
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <div>
                <h1 className='text-2xl font-bold text-white'>用戶管理</h1>
                <p className='text-gray-400 mt-1'>管理全平台用戶、角色權限與違規處理</p>
              </div>
            </div>

            {/* 搜索和篩選 */}
            <div className='bg-gray-800 rounded-2xl p-4 border border-gray-700'>
              <div className='flex items-center space-x-4'>
                <div className='flex-1 relative'>
                  <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                  <input
                    type='text'
                    placeholder='搜索用戶...'
                    className='w-full pl-12 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500'
                  />
                </div>
                <select className='py-2.5 px-4 bg-gray-700 border border-gray-600 rounded-xl text-white'>
                  <option>全部角色</option>
                  <option>項目主理人</option>
                  <option>接案者</option>
                  <option>區域主理人</option>
                  <option>管理員</option>
                </select>
                <select className='py-2.5 px-4 bg-gray-700 border border-gray-600 rounded-xl text-white'>
                  <option>全部狀態</option>
                  <option>正常</option>
                  <option>已禁用</option>
                  <option>待審核</option>
                </select>
              </div>
            </div>

            {/* 用戶列表 */}
            <div className='bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden'>
              <table className='w-full'>
                <thead className='bg-gray-700/50'>
                  <tr>
                    <th className='px-6 py-4 text-left text-sm font-medium text-gray-400'>用戶</th>
                    <th className='px-6 py-4 text-left text-sm font-medium text-gray-400'>角色</th>
                    <th className='px-6 py-4 text-left text-sm font-medium text-gray-400'>狀態</th>
                    <th className='px-6 py-4 text-left text-sm font-medium text-gray-400'>註冊時間</th>
                    <th className='px-6 py-4 text-left text-sm font-medium text-gray-400'>項目/收益</th>
                    <th className='px-6 py-4 text-right text-sm font-medium text-gray-400'>操作</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-700'>
                  {[
                    {
                      name: '張偉明',
                      role: '項目主理人',
                      company: '創新科技有限公司',
                      status: '正常',
                      joined: '2024-03-15',
                      projects: 12,
                      spent: 285000,
                    },
                    {
                      name: '王建國',
                      role: '接案者',
                      skills: '全棧工程師',
                      status: '正常',
                      joined: '2024-02-20',
                      projects: 28,
                      earned: 158000,
                    },
                    {
                      name: '李美華',
                      role: '接案者',
                      skills: 'UX 設計師',
                      status: '正常',
                      joined: '2024-01-10',
                      projects: 34,
                      earned: 186000,
                    },
                    {
                      name: '陳志偉',
                      role: '區域主理人',
                      region: '日本區',
                      status: '正常',
                      joined: '2023-12-01',
                      projects: 89,
                      revenue: 245000,
                    },
                  ].map((user, idx) => (
                    <tr key={idx} className='hover:bg-gray-700/50'>
                      <td className='px-6 py-4'>
                        <div className='flex items-center space-x-3'>
                          <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-medium'>
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className='font-medium text-white'>{user.name}</div>
                            <div className='text-sm text-gray-400'>{user.company || user.skills || user.region}</div>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            user.role.includes('管理員')
                              ? 'bg-red-500/20 text-red-400'
                              : user.role.includes('主理人')
                                ? 'bg-purple-500/20 text-purple-400'
                                : user.role.includes('項目')
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : 'bg-green-500/20 text-green-400'
                          }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <span className='flex items-center text-sm text-green-400'>
                          <span className='w-2 h-2 bg-green-400 rounded-full mr-2' />
                          正常
                        </span>
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-400'>{user.joined}</td>
                      <td className='px-6 py-4 text-sm text-gray-300'>
                        {user.projects} 項目 / $
                        {(user.spent || user.earned || user.revenue) > 1000
                          ? (user.spent || user.earned || user.revenue) / 1000 + 'K'
                          : user.spent || user.earned || user.revenue}
                      </td>
                      <td className='px-6 py-4 text-right'>
                        <div className='flex items-center justify-end space-x-2'>
                          <button className='p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors'>
                            <Eye className='w-4 h-4' />
                          </button>
                          <button className='p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors'>
                            <Edit className='w-4 h-4' />
                          </button>
                          <button className='p-2 text-gray-400 hover:text-red-400 hover:bg-gray-600 rounded-lg transition-colors'>
                            <Lock className='w-4 h-4' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 項目審核標籤 */}
        {activeTab === 'projects' && (
          <div className='space-y-6'>
            <div>
              <h1 className='text-2xl font-bold text-white'>項目審核</h1>
              <p className='text-gray-400 mt-1'>審核項目發布、監控項目異常、統計區域業績</p>
            </div>

            {/* 待審核項目列表 */}
            <div className='bg-gray-800 rounded-2xl p-6 border border-gray-700'>
              <h2 className='text-lg font-semibold text-white mb-4'>待審核項目</h2>
              <div className='space-y-4'>
                {PENDING_REVIEWS.filter((p) => p.type === 'project').map((project) => (
                  <div key={project.id} className='p-4 bg-gray-700/50 rounded-xl'>
                    <div className='flex items-start justify-between mb-3'>
                      <div>
                        <h3 className='font-medium text-white'>{project.title}</h3>
                        <p className='text-sm text-gray-400'>
                          提交者：{project.submitter} • {project.submittedAt}
                        </p>
                      </div>
                      <div className='flex items-center space-x-2'>
                        {project.priority === 'high' && (
                          <span className='px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs'>緊急</span>
                        )}
                        <span className='px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs'>待審核</span>
                      </div>
                    </div>
                    <div className='flex items-center justify-end space-x-3'>
                      <button className='px-4 py-2 border border-gray-600 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors'>
                        查看詳情
                      </button>
                      <button className='px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors'>
                        駁回
                      </button>
                      <button className='px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors'>
                        通過
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 爭議處理標籤 */}
        {activeTab === 'disputes' && (
          <div className='space-y-6'>
            <div>
              <h1 className='text-2xl font-bold text-white'>爭議處理</h1>
              <p className='text-gray-400 mt-1'>處理用戶爭議、進行調解與最終裁定</p>
            </div>

            {/* 爭議列表 */}
            <div className='bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden'>
              <div className='px-6 py-4 border-b border-gray-700'>
                <div className='flex items-center justify-between'>
                  <h2 className='font-semibold text-white'>待處理爭議</h2>
                  <span className='px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-sm'>{DISPUTES.length} 項</span>
                </div>
              </div>
              <div className='divide-y divide-gray-700'>
                {DISPUTES.map((dispute) => (
                  <div key={dispute.id} className='p-6 hover:bg-gray-700/50 transition-colors'>
                    <div className='flex items-start justify-between mb-3'>
                      <div>
                        <h3 className='font-medium text-white'>{dispute.project}</h3>
                        <p className='text-sm text-gray-400'>
                          {dispute.type} • 發起人：{dispute.initiator}
                        </p>
                      </div>
                      <span className='px-2.5 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium'>
                        {dispute.status}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <div className='text-sm text-gray-400'>
                        涉及金額：<span className='text-white font-medium'>{dispute.amount}</span>
                        <span className='ml-4'>創建時間：{dispute.createdAt}</span>
                      </div>
                      <div className='flex space-x-3'>
                        <button className='px-4 py-2 border border-gray-600 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors'>
                          查看證據
                        </button>
                        <button className='px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg text-sm hover:bg-amber-500/30 transition-colors'>
                          開始調解
                        </button>
                        <button className='px-4 py-2 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600 transition-colors'>
                          最終裁定
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 規則配置標籤 */}
        {activeTab === 'settings' && (
          <div className='space-y-6'>
            <div>
              <h1 className='text-2xl font-bold text-white'>規則配置</h1>
              <p className='text-gray-400 mt-1'>配置平台結算規則、權限設置與 AI 角色參數</p>
            </div>

            {/* 結算規則配置 */}
            <div className='bg-gray-800 rounded-2xl p-6 border border-gray-700'>
              <h2 className='text-lg font-semibold text-white mb-4'>結算規則配置</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm text-gray-400 mb-2'>基礎佣金比例</label>
                  <div className='flex items-center space-x-4'>
                    <div className='flex-1'>
                      <span className='text-sm text-gray-500'>項目主理人</span>
                      <input
                        type='number'
                        defaultValue='10'
                        className='w-full mt-1 py-2 px-3 bg-gray-700 border border-gray-600 rounded-lg text-white'
                      />
                    </div>
                    <div className='flex-1'>
                      <span className='text-sm text-gray-500'>接案者</span>
                      <input
                        type='number'
                        defaultValue='5'
                        className='w-full mt-1 py-2 px-3 bg-gray-700 border border-gray-600 rounded-lg text-white'
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className='block text-sm text-gray-400 mb-2'>逾期支付違約金</label>
                  <div className='flex items-center space-x-4'>
                    <input
                      type='number'
                      defaultValue='0.5'
                      className='flex-1 py-2 px-3 bg-gray-700 border border-gray-600 rounded-lg text-white'
                    />
                    <span className='text-gray-400'>% / 天</span>
                  </div>
                </div>
                <div>
                  <label className='block text-sm text-gray-400 mb-2'>里程碑保證金上限</label>
                  <div className='flex items-center space-x-4'>
                    <input
                      type='number'
                      defaultValue='20'
                      className='flex-1 py-2 px-3 bg-gray-700 border border-gray-600 rounded-lg text-white'
                    />
                    <span className='text-gray-400'>%</span>
                  </div>
                </div>
                <div>
                  <label className='block text-sm text-gray-400 mb-2'>結算時效</label>
                  <input
                    type='number'
                    defaultValue='48'
                    className='flex-1 py-2 px-3 bg-gray-700 border border-gray-600 rounded-lg text-white'
                  />
                  <span className='text-sm text-gray-500 ml-2'>小時內</span>
                </div>
              </div>
              <div className='mt-6 pt-6 border-t border-gray-700 flex justify-end'>
                <button className='px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all'>
                  保存配置
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
