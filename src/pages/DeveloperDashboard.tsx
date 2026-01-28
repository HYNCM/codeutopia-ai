import { useAuth } from '../contexts/AuthContext'
import { mockProjects, mockDevelopers, mockTransactions } from '../data/mockData'
import { Link } from 'react-router-dom'
import {
  Briefcase,
  DollarSign,
  Star,
  Clock,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Target,
  Zap,
  Award,
  Users,
  ChevronRight,
} from 'lucide-react'

export function DeveloperDashboard() {
  const { user } = useAuth()
  const developer = mockDevelopers[0] // Demo developer

  const stats = {
    totalEarnings: 125000,
    pendingPayments: 45000,
    activeProjects: 2,
    completedProjects: 45,
    averageRating: 4.9,
    successRate: 98,
  }

  const availableProjects = mockProjects.filter((p) => p.status === 'open').slice(0, 3)
  const recentEarnings = mockTransactions.filter((t) => t.type === 'income').slice(0, 4)

  const skillProgress = [
    { name: 'React', level: 92, color: 'bg-blue-500' },
    { name: 'TypeScript', level: 88, color: 'bg-blue-600' },
    { name: 'Node.js', level: 85, color: 'bg-green-500' },
    { name: 'AWS', level: 78, color: 'bg-orange-500' },
  ]

  return (
    <div className='space-y-6'>
      {/* Welcome Header */}
      <div className='bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white'>
        <div className='flex justify-between items-start'>
          <div className='flex items-center space-x-4'>
            <img
              src={developer.avatar}
              alt={developer.name}
              className='w-16 h-16 rounded-xl border-2 border-white/30'
            />
            <div>
              <h1 className='text-2xl font-bold'>歡迎回來，{developer.name}！</h1>
              <p className='text-blue-100 mt-1'>{developer.skills.join(' • ')}</p>
              <div className='flex items-center space-x-4 mt-2'>
                <span className='flex items-center space-x-1 text-sm'>
                  <Star className='w-4 h-4 text-yellow-300 fill-yellow-300' />
                  <span>{developer.rating} 評分</span>
                </span>
                <span className='flex items-center space-x-1 text-sm'>
                  <Briefcase className='w-4 h-4' />
                  <span>{developer.completedProjects} 個完成項目</span>
                </span>
              </div>
            </div>
          </div>
          <div className='bg-white/20 p-3 rounded-xl'>
            <Target className='w-8 h-8' />
          </div>
        </div>

        {/* Stats Row */}
        <div className='grid grid-cols-4 gap-4 mt-6'>
          <div className='bg-white/10 rounded-xl p-4'>
            <div className='flex items-center space-x-2'>
              <DollarSign className='w-5 h-5 text-blue-200' />
              <span className='text-blue-200 text-sm'>總收益</span>
            </div>
            <p className='text-2xl font-bold mt-1'>NT${(stats.totalEarnings / 1000).toFixed(0)}K</p>
          </div>
          <div className='bg-white/10 rounded-xl p-4'>
            <div className='flex items-center space-x-2'>
              <Clock className='w-5 h-5 text-yellow-200' />
              <span className='text-blue-200 text-sm'>待收款</span>
            </div>
            <p className='text-2xl font-bold mt-1'>NT${(stats.pendingPayments / 1000).toFixed(0)}K</p>
          </div>
          <div className='bg-white/10 rounded-xl p-4'>
            <div className='flex items-center space-x-2'>
              <Briefcase className='w-5 h-5 text-green-200' />
              <span className='text-blue-200 text-sm'>進行中</span>
            </div>
            <p className='text-2xl font-bold mt-1'>{stats.activeProjects}</p>
          </div>
          <div className='bg-white/10 rounded-xl p-4'>
            <div className='flex items-center space-x-2'>
              <TrendingUp className='w-5 h-5 text-purple-200' />
              <span className='text-blue-200 text-sm'>成功率</span>
            </div>
            <p className='text-2xl font-bold mt-1'>{stats.successRate}%</p>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Main Content */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Available Projects */}
          <div className='bg-white rounded-xl border border-gray-200 p-6'>
            <div className='flex items-center justify-between mb-6'>
              <div className='flex items-center space-x-2'>
                <Briefcase className='w-5 h-5 text-purple-600' />
                <h2 className='text-lg font-semibold text-gray-900'>推薦項目</h2>
              </div>
              <Link
                to='/projects'
                className='flex items-center space-x-1 text-sm text-purple-600 hover:text-purple-700'>
                <span>查看全部</span>
                <ArrowRight className='w-4 h-4' />
              </Link>
            </div>

            <div className='space-y-4'>
              {availableProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className='block p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-sm transition-all'>
                  <div className='flex items-start justify-between mb-3'>
                    <div>
                      <h3 className='font-medium text-gray-900'>{project.title}</h3>
                      <p className='text-sm text-gray-500 mt-1 line-clamp-2'>{project.description.slice(0, 100)}...</p>
                    </div>
                    <div className='text-right'>
                      <p className='text-lg font-bold text-purple-600'>NT$ {(project.budget.max / 1000).toFixed(0)}K</p>
                      <p className='text-xs text-gray-500'>{project.duration}</p>
                    </div>
                  </div>

                  <div className='flex flex-wrap gap-2 mt-3'>
                    {project.skills.slice(0, 4).map((skill) => (
                      <span key={skill} className='px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs'>
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className='flex items-center justify-between mt-3 pt-3 border-t border-gray-50'>
                    <div className='flex items-center space-x-2'>
                      <img src={project.clientAvatar} alt={project.clientName} className='w-6 h-6 rounded-full' />
                      <span className='text-sm text-gray-500'>{project.clientName}</span>
                    </div>
                    <span className='flex items-center space-x-1 text-sm text-purple-600'>
                      <Zap className='w-4 h-4' />
                      <span>AI匹配度 95%</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Skill Progress */}
          <div className='bg-white rounded-xl border border-gray-200 p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-semibold text-gray-900'>技能分析</h2>
              <Link to='/profile' className='text-sm text-purple-600 hover:text-purple-700'>
                更新檔案
              </Link>
            </div>

            <div className='grid grid-cols-2 gap-6'>
              <div className='space-y-4'>
                {skillProgress.map((skill) => (
                  <div key={skill.name}>
                    <div className='flex items-center justify-between mb-1'>
                      <span className='text-sm font-medium text-gray-700'>{skill.name}</span>
                      <span className='text-sm text-gray-500'>{skill.level}%</span>
                    </div>
                    <div className='w-full bg-gray-100 rounded-full h-2'>
                      <div
                        className={`${skill.color} h-2 rounded-full transition-all`}
                        style={{ width: `${skill.level}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className='bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4'>
                <div className='flex items-center space-x-2 mb-3'>
                  <Sparkles className='w-5 h-5 text-purple-600' />
                  <h3 className='font-medium text-gray-900'>AI 建議</h3>
                </div>
                <ul className='space-y-2 text-sm text-gray-600'>
                  <li className='flex items-start space-x-2'>
                    <ChevronRight className='w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0' />
                    <span>建議加強 Docker 技能，可獲得更多DevOps項目機會</span>
                  </li>
                  <li className='flex items-start space-x-2'>
                    <ChevronRight className='w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0' />
                    <span>您的 TypeScript 技能已達到大師級水準！</span>
                  </li>
                  <li className='flex items-start space-x-2'>
                    <ChevronRight className='w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0' />
                    <span>本周有5個高薪React項目，符合您的技能樹</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className='space-y-6'>
          {/* Earnings Summary */}
          <div className='bg-white rounded-xl border border-gray-200 p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='font-semibold text-gray-900'>收益概覽</h3>
              <Link to='/earnings' className='text-sm text-purple-600 hover:text-purple-700'>
                詳細
              </Link>
            </div>

            <div className='space-y-4'>
              {recentEarnings.map((tx) => (
                <div
                  key={tx.id}
                  className='flex items-center justify-between py-2 border-b border-gray-50 last:border-0'>
                  <div>
                    <p className='text-sm font-medium text-gray-900'>{tx.projectTitle}</p>
                    <p className='text-xs text-gray-500'>{tx.description}</p>
                  </div>
                  <span className='text-sm font-bold text-green-600'>+NT$ {(tx.amount / 1000).toFixed(0)}K</span>
                </div>
              ))}
            </div>

            <button className='w-full mt-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all'>
              申請提現
            </button>
          </div>

          {/* Achievements */}
          <div className='bg-white rounded-xl border border-gray-200 p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='font-semibold text-gray-900'>成就徽章</h3>
              <Link to='/achievements' className='text-sm text-purple-600 hover:text-purple-700'>
                查看全部
              </Link>
            </div>

            <div className='grid grid-cols-3 gap-3'>
              <div className='flex flex-col items-center p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl'>
                <Award className='w-8 h-8 text-yellow-500 mb-1' />
                <span className='text-xs font-medium text-gray-700'>金牌開發者</span>
              </div>
              <div className='flex flex-col items-center p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl'>
                <Zap className='w-8 h-8 text-blue-500 mb-1' />
                <span className='text-xs font-medium text-gray-700'>閃電交付</span>
              </div>
              <div className='flex flex-col items-center p-3 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl'>
                <Star className='w-8 h-8 text-green-500 mb-1' />
                <span className='text-xs font-medium text-gray-700'>5星評價</span>
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className='bg-white rounded-xl border border-gray-200 p-6'>
            <h3 className='font-semibold text-gray-900 mb-4'>即將到期</h3>
            <div className='space-y-3'>
              <div className='flex items-center space-x-3 p-3 bg-red-50 rounded-lg'>
                <Clock className='w-5 h-5 text-red-500' />
                <div className='flex-1'>
                  <p className='text-sm font-medium text-gray-900'>智能客服系統</p>
                  <p className='text-xs text-red-600'>還有 3 天 - 第二階段</p>
                </div>
              </div>
              <div className='flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg'>
                <Clock className='w-5 h-5 text-yellow-500' />
                <div className='flex-1'>
                  <p className='text-sm font-medium text-gray-900'>管理系統後端</p>
                  <p className='text-xs text-yellow-600'>還有 7 天 - 核心功能</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Match Score */}
          <div className='bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white'>
            <div className='flex items-center space-x-2 mb-4'>
              <Sparkles className='w-5 h-5' />
              <h3 className='font-semibold'>您的AI匹配分數</h3>
            </div>
            <div className='flex items-center justify-center mb-4'>
              <div className='text-5xl font-bold'>96</div>
              <span className='text-2xl ml-1'>分</span>
            </div>
            <p className='text-sm text-purple-100 text-center'>
              本周有 8 個項目與您的技能高度匹配，預計收益 NT$120,000+
            </p>
            <Link
              to='/projects'
              className='block mt-4 py-2 bg-white/20 rounded-lg text-center text-sm font-medium hover:bg-white/30 transition-colors'>
              立即查看
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
