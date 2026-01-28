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
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 z-40 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}>
      <div className='flex flex-col h-full py-4'>
        {/* Logo Area */}
        {!isCollapsed && (
          <div className='px-4 mb-4'>
            <div className='flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg'>
              <Sparkles className='w-5 h-5 text-purple-600' />
              <span className='text-sm font-medium text-purple-700'>AI 助手</span>
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
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }>
              <item.icon className='w-5 h-5 flex-shrink-0' />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className='border-t border-gray-200 pt-4 px-2'>
          {!isCollapsed && (
            <div className='px-3 py-2 mb-2'>
              <div className='bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-4 text-white'>
                <p className='text-sm font-medium mb-1'>升級企業版</p>
                <p className='text-xs opacity-80 mb-3'>解鎖更多AI功能和優先匹配</p>
                <button className='w-full py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors'>
                  立即升級
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
