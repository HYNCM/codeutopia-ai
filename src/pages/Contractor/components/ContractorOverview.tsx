import React, { useState, useEffect } from 'react'
import { DollarSign, Briefcase, Clock, TrendingUp, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { financeService } from '../../../services/financeService'
import { projectService } from '../../../services/projectService'
import { useAuth } from '../../../contexts/AuthContext'

export const ContractorOverview: React.FC = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [activeProjects, setActiveProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (!user) return
      try {
        const [statsData, projectsData] = await Promise.all([
          financeService.getContractorStats(user.id),
          projectService.getMyProjects(user.id),
        ])
        setStats(statsData)
        setActiveProjects(projectsData)
      } catch (error) {
        console.error('Failed to load contractor data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [user])

  if (isLoading) {
    return <div className='p-8 text-center text-gray-500'>加載中...</div>
  }

  return (
    <div className='space-y-6'>
      {/* 歡迎 Banner */}
      <div className='relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white'>
        <div className='relative z-10'>
          <h1 className='text-3xl font-bold mb-2'>歡迎回來, {user?.name} 👋</h1>
          <p className='text-blue-100 max-w-xl'>
            您目前有 {stats?.activeProjects || 0} 個進行中的項目，本月收入已達 $
            {stats?.thisMonthEarnings?.toLocaleString()}。 查看最新發布的項目，尋找下一個機會。
          </p>
          <div className='mt-6 flex space-x-4'>
            <button className='px-5 py-2.5 bg-white text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors'>
              尋找工作
            </button>
            <button className='px-5 py-2.5 bg-blue-700/50 text-white rounded-xl font-medium hover:bg-blue-700/70 transition-colors backdrop-blur-sm'>
              查看報表
            </button>
          </div>
        </div>
        <div className='absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2' />
        <div className='absolute right-20 bottom-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl translate-y-1/2' />
      </div>

      {/* 核心指標 */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {[
          {
            label: '總收入',
            value: `$${stats?.totalEarnings?.toLocaleString()}`,
            change: stats?.earningsGrowth || '+0%',
            icon: DollarSign,
            color: 'text-green-500',
            bg: 'bg-green-100 dark:bg-green-500/10',
          },
          {
            label: '待結算',
            value: `$${stats?.pendingPayments?.toLocaleString()}`,
            change: '2 筆款項',
            icon: Clock,
            color: 'text-orange-500',
            bg: 'bg-orange-100 dark:bg-orange-500/10',
          },
          {
            label: '進行中項目',
            value: stats?.activeProjects || 0,
            change: '進度正常',
            icon: Briefcase,
            color: 'text-blue-500',
            bg: 'bg-blue-100 dark:bg-blue-500/10',
          },
          {
            label: '已完成項目',
            value: stats?.completedProjects || 0,
            change: '好評率 98%',
            icon: CheckCircle,
            color: 'text-purple-500',
            bg: 'bg-purple-100 dark:bg-purple-500/10',
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className='bg-[var(--bg-card)] rounded-xl p-5 border border-[var(--border-color)] transition-all hover:shadow-md cursor-pointer group'>
            <div className='flex justify-between items-start mb-4'>
              <div className={`p-3 rounded-lg ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className='w-6 h-6' />
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.change.includes('+')
                    ? 'bg-green-100 text-green-600'
                    : 'bg-[var(--bg-input)] text-[var(--text-muted)]'
                }`}>
                {stat.change}
              </span>
            </div>
            <div className='text-2xl font-bold text-[var(--text-primary)] mb-1'>{stat.value}</div>
            <div className='text-sm text-[var(--text-muted)]'>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 最近項目 */}
      <div className='bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border-color)]'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-lg font-bold text-[var(--text-primary)]'>進行中的項目</h2>
          <Link to='/projects' className='text-sm text-blue-600 hover:text-blue-700 flex items-center'>
            全部項目 <ChevronRight className='w-4 h-4 ml-1' />
          </Link>
        </div>
        <div className='space-y-4'>
          {activeProjects.slice(0, 3).map((project) => (
            <div
              key={project.id}
              className='flex items-center justify-between p-4 bg-[var(--bg-card-hover)] rounded-xl group hover:bg-[var(--bg-input)] transition-colors'>
              <div className='flex items-center space-x-4'>
                <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold'>
                  {project.title.substring(0, 1)}
                </div>
                <div>
                  <h3 className='font-medium text-[var(--text-primary)] group-hover:text-blue-600 transition-colors'>
                    {project.title}
                  </h3>
                  <div className='flex items-center text-sm text-[var(--text-muted)] space-x-2'>
                    <span>{project.clientName}</span>
                    <span>•</span>
                    <span>{project.status === 'in_progress' ? '進行中' : project.status}</span>
                  </div>
                </div>
              </div>
              <div className='text-right'>
                <div className='text-sm font-medium text-[var(--text-primary)]'>里程碑 2/4</div>
                <div className='w-24 h-1.5 bg-[var(--border-color)] rounded-full mt-2 overflow-hidden'>
                  <div className='h-full bg-blue-500 rounded-full' style={{ width: '50%' }} />
                </div>
              </div>
            </div>
          ))}
          {activeProjects.length === 0 && (
            <div className='text-center py-8 text-[var(--text-muted)]'>目前沒有進行中的項目</div>
          )}
        </div>
      </div>
    </div>
  )
}

function CheckCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'>
      <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14' />
      <polyline points='22 4 12 14.01 9 11.01' />
    </svg>
  )
}
