import React, { useState } from 'react'
import { LayoutDashboard, Briefcase, Search, MessageSquare, Wallet, Settings, Bell, LogOut, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { ContractorOverview } from './Contractor/components/ContractorOverview'
import { MarketplaceTab } from './Contractor/components/MarketplaceTab'
import { MyProjectsTab } from './Contractor/components/MyProjectsTab'
import { EarningsTab } from './Contractor/components/EarningsTab'
import { MessagesTab } from './Contractor/components/MessagesTab'
import { Link } from 'react-router-dom'

import { useMessages } from '../contexts/MessageContext'

interface ContractorDashboardProps {
  currentRole?: string
}

const ContractorDashboard: React.FC<ContractorDashboardProps> = ({ currentRole }) => {
  const { user, logout } = useAuth()
  const { unreadTotal } = useMessages()
  const [activeTab, setActiveTab] = useState('overview')

  const MENU_ITEMS = [
    { id: 'overview', label: '總覽', icon: LayoutDashboard },
    { id: 'marketplace', label: '工作機會', icon: Search },
    { id: 'projects', label: '我的項目', icon: Briefcase },
    { id: 'earnings', label: '財務收益', icon: Wallet },
    { id: 'messages', label: '消息中心', icon: MessageSquare, badge: unreadTotal > 0 ? unreadTotal : undefined },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ContractorOverview />
      case 'marketplace':
        return <MarketplaceTab />
      case 'projects':
        return <MyProjectsTab />
      case 'earnings':
        return <EarningsTab />
      case 'messages':
        return <MessagesTab />
      default:
        return <ContractorOverview />
    }
  }

  return (
    <div className='flex h-[calc(100vh-4rem)] overflow-hidden bg-[var(--bg-primary)]'>
      {/* 側邊導航 */}
      <div className='w-64 bg-[var(--bg-card)] border-r border-[var(--border-color)] flex flex-col'>
        <div className='p-6'>
          <div className='flex items-center space-x-3 mb-8'>
            <div className='w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30'>
              C
            </div>
            <div>
              <h1 className='font-bold text-lg text-[var(--text-primary)]'>CodeUtopia</h1>
              <p className='text-xs text-[var(--text-muted)]'>Contractor Workspace</p>
            </div>
          </div>

          <nav className='space-y-2'>
            {MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${
                  activeTab === item.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium shadow-sm'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'
                }`}>
                <div className='flex items-center space-x-3'>
                  <item.icon
                    className={`w-5 h-5 ${
                      activeTab === item.id
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className='bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm'>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className='mt-auto p-6 border-t border-[var(--border-color)]'>
          <button className='w-full flex items-center space-x-3 p-3 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] transition-colors'>
            <Settings className='w-5 h-5 text-[var(--text-muted)]' />
            <span>設置</span>
          </button>
          <button className='w-full flex items-center space-x-3 p-3 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] transition-colors'>
            <User className='w-5 h-5 text-[var(--text-muted)]' />
            <span>個人資料</span>
          </button>
        </div>
      </div>

      {/* 主內容區域 */}
      <div className='flex-1 overflow-auto bg-gray-50 dark:bg-gray-900'>
        <div className='max-w-7xl mx-auto p-8'>{renderContent()}</div>
      </div>
    </div>
  )
}

export default ContractorDashboard
