import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  LayoutDashboard,
  Briefcase,
  Users,
  MessageSquare,
  CreditCard,
  FileText,
  BarChart3,
  Sparkles,
  Zap,
} from 'lucide-react'

const clientMenuItems = [
  { icon: LayoutDashboard, label: '工作台', path: '/dashboard' },
  { icon: Briefcase, label: '項目管理', path: '/projects' },
  { icon: Users, label: '人才庫', path: '/talent' },
  { icon: MessageSquare, label: '消息中心', path: '/messages' },
  { icon: CreditCard, label: '財務中心', path: '/transactions' },
  { icon: FileText, label: '合同管理', path: '/contracts' },
  { icon: BarChart3, label: '數據報告', path: '/reports' },
]

const developerMenuItems = [
  { icon: LayoutDashboard, label: '工作台', path: '/dashboard' },
  { icon: Briefcase, label: '項目廣場', path: '/projects' },
  { icon: FileText, label: '我的項目', path: '/my-projects' },
  { icon: MessageSquare, label: '消息中心', path: '/messages' },
  { icon: CreditCard, label: '收益中心', path: '/earnings' },
  { icon: BarChart3, label: '數據分析', path: '/analytics' },
]

interface SidebarProps {
  isCollapsed?: boolean
}

export function Sidebar({ isCollapsed = false }: SidebarProps) {
  const { user } = useAuth()
  const menuItems = user?.role === 'developer' ? developerMenuItems : clientMenuItems

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-[var(--bg-card)] border-r border-[var(--border-color)] transition-all duration-300 z-40 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}>
      <div className='flex flex-col h-full py-4'>
        {/* AI Assistant Quick Access */}
        {!isCollapsed && (
          <div className='px-3 mb-4'>
            <div className='flex items-center space-x-2 px-3 py-2.5 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/20 rounded-xl cursor-pointer hover:from-purple-600/30 hover:to-blue-600/30 transition-all duration-200'>
              <div className='w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center'>
                <Sparkles className='w-4 h-4 text-white' />
              </div>
              <div className='flex-1'>
                <span className='text-sm font-medium text-[var(--text-primary)]'>Cortex AI</span>
                <p className='text-xs text-[var(--text-muted)]'>智能助手</p>
              </div>
              <span className='w-2 h-2 bg-green-400 rounded-full animate-pulse' />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className='flex-1 px-2 space-y-1 overflow-y-auto'>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-purple-600/20 text-[var(--accent-purple)] border border-purple-500/20'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]'
                }`
              }>
              <item.icon className='w-5 h-5 flex-shrink-0' />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section - Upgrade Card */}
        <div className='border-t border-[var(--border-color)] pt-4 px-2'>
          {!isCollapsed && (
            <div className='px-2 py-2'>
              <div className='relative overflow-hidden bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-4'>
                {/* Glassmorphism overlay */}
                <div className='absolute inset-0 bg-white/5 backdrop-blur-sm' />
                <div className='relative z-10'>
                  <div className='flex items-center space-x-2 mb-2'>
                    <Zap className='w-4 h-4 text-yellow-300' />
                    <p className='text-sm font-semibold text-white'>升級企業版</p>
                  </div>
                  <p className='text-xs text-purple-100 mb-3'>解鎖更多AI功能和優先匹配</p>
                  <button className='w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium text-white transition-all duration-200 cursor-pointer'>
                    立即升級
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
