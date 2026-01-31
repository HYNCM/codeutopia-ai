import React, { useState } from 'react'
import {
  LayoutDashboard,
  Search,
  Briefcase,
  Wallet,
  MessageSquare,
  Sparkles,
  Zap,
  TrendingUp,
  ChevronRight,
  Clock,
  CheckCircle,
  Globe,
  Brain,
  Star,
  DollarSign,
  ArrowRight,
  MoreHorizontal,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useMessages } from '../contexts/MessageContext'
import { ContractorOverview } from './Contractor/components/ContractorOverview'
import { MarketplaceTab } from './Contractor/components/MarketplaceTab'
import { MyProjectsTab } from './Contractor/components/MyProjectsTab'
import { EarningsTab } from './Contractor/components/EarningsTab'
import { MessagesTab } from './Contractor/components/MessagesTab'
import { AIAssistantPanel } from '../components/AIAssistantPanel'

interface ContractorDashboardProps {
  currentRole?: string
}

const ContractorDashboard: React.FC<ContractorDashboardProps> = ({ currentRole }) => {
  const { user } = useAuth()
  const { unreadTotal } = useMessages()
  const [activeTab, setActiveTab] = useState<'overview' | 'marketplace' | 'projects' | 'earnings' | 'messages'>(
    'overview',
  )
  const [showAIAssistant, setShowAIAssistant] = useState(false)

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
    <div className='max-w-[1600px] mx-auto space-y-8 animate-fade-in pb-12'>
      {/* 1. Career Banner */}
      <div className='relative overflow-hidden group rounded-3xl'>
        <div className='absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 opacity-90 group-hover:opacity-100 transition-opacity duration-500' />
        <div className='absolute inset-0 bg-[url("https://www.transparenttextures.com/patterns/carbon-fibre.png")] opacity-10' />

        <div className='relative z-10 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8'>
          <div className='space-y-4 text-center md:text-left'>
            <div className='inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20'>
              <Globe className='w-4 h-4 text-cyan-300' />
              <span className='text-xs font-semibold text-white uppercase tracking-wider'>
                Global Tech Talent • 自由職業工作台
              </span>
            </div>
            <h1 className='text-3xl sm:text-4xl font-extrabold text-white'>
              你好，{user?.name || '開發者'} <span className='animate-bounce inline-block'>🚀</span>
            </h1>
            <p className='text-blue-100 text-lg max-w-2xl'>
              您的當前匹配度排名在全平台的{' '}
              <span className='font-bold text-white underline decoration-cyan-400'>前 5%</span>。AI 已為您精選了{' '}
              <span className='font-bold text-white'>8</span> 個高薪項目。
            </p>
            <div className='flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2'>
              <button
                onClick={() => setActiveTab('marketplace')}
                className='px-6 py-3 bg-white text-blue-600 rounded-2xl font-bold hover:bg-blue-50 hover:scale-105 transition-all shadow-xl shadow-black/10 flex items-center space-x-2'>
                <Search className='w-5 h-5' />
                <span>尋找下一個機會</span>
              </button>
              <button
                onClick={() => setShowAIAssistant(!showAIAssistant)}
                className='px-6 py-3 bg-blue-500/30 text-white rounded-2xl font-bold hover:bg-blue-500/40 border border-white/20 backdrop-blur-sm transition-all flex items-center space-x-2'>
                <Brain className='w-5 h-5' />
                <span>AI 履歷優化</span>
              </button>
            </div>
          </div>

          <div className='hidden lg:flex items-center space-x-6'>
            <div className='relative text-center'>
              <div className='inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-white/30 bg-white/10 backdrop-blur-xl mb-3'>
                <span className='text-3xl font-bold text-white'>$</span>
              </div>
              <div className='text-xs font-bold text-cyan-100 uppercase tracking-widest'>本月收入預估</div>
              <div className='text-2xl font-black text-white'>$ 12,500</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {[
          { label: '正在進行', value: '4', change: '2 個即將交付', icon: Briefcase, color: 'blue' },
          { label: '本月收益', value: 'NT$ 42K', change: '+12%', icon: Wallet, color: 'emerald' },
          { label: '累計評分', value: '4.9', change: '96% 滿意度', icon: Star, color: 'amber' },
          { label: '新消息', value: unreadTotal || '0', change: '及時回覆', icon: MessageSquare, color: 'purple' },
        ].map((stat, idx) => (
          <div
            key={idx}
            className='bg-[var(--bg-card)] rounded-3xl p-6 border border-[var(--border-color)] hover:shadow-2xl transition-all group'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform'>
                <stat.icon className='w-6 h-6 text-[var(--text-primary)]' />
              </div>
              <span className='text-[10px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full'>
                {stat.change}
              </span>
            </div>
            <div className='space-y-1'>
              <div className='text-3xl font-extrabold text-[var(--text-primary)]'>{stat.value}</div>
              <div className='text-sm text-[var(--text-muted)] font-medium'>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Content Tabs */}
      <div className='grid grid-cols-12 gap-8'>
        <div className='col-span-12 lg:col-span-8 space-y-8'>
          <div className='flex items-center justify-between bg-[var(--bg-card)] p-2 rounded-2xl border border-[var(--border-color)]'>
            <div className='flex space-x-1'>
              {[
                { id: 'overview', name: '工作桌', icon: LayoutDashboard },
                { id: 'marketplace', name: '找項目', icon: Search },
                { id: 'projects', name: '我的項目', icon: Briefcase },
                { id: 'earnings', name: '錢包', icon: Wallet },
                { id: 'messages', name: '聊天', icon: MessageSquare },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                      : 'text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]'
                  }`}>
                  <tab.icon className='w-4 h-4' />
                  <span className='hidden sm:inline'>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className='animate-slide-up'>{renderContent()}</div>
        </div>

        <div className='col-span-12 lg:col-span-4 space-y-8'>
          {/* AI Panel */}
          <AIAssistantPanel currentRole='contractor' onTaskComplete={() => {}} />

          {/* Productivity Tracker */}
          <div className='bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] p-6'>
            <h2 className='text-lg font-bold text-[var(--text-primary)] mb-6 flex items-center justify-between'>
              <span>工作效率分析</span>
              <Zap className='w-5 h-5 text-yellow-500' />
            </h2>
            <div className='space-y-6'>
              <div>
                <div className='flex justify-between text-xs font-bold mb-2'>
                  <span className='text-[var(--text-muted)]'>本週代碼提交</span>
                  <span className='text-[var(--text-primary)]'>42 Commits</span>
                </div>
                <div className='h-2 bg-[var(--bg-input)] rounded-full'>
                  <div className='h-full bg-blue-500 rounded-full w-[75%]' />
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div className='p-4 bg-[var(--bg-input)] rounded-2xl text-center border border-[var(--border-subtle)]'>
                  <div className='text-[10px] text-[var(--text-muted)] font-bold uppercase'>平均工作時長</div>
                  <div className='text-xl font-bold'>6.2h</div>
                </div>
                <div className='p-4 bg-[var(--bg-input)] rounded-2xl text-center border border-[var(--border-subtle)]'>
                  <div className='text-[10px] text-[var(--text-muted)] font-bold uppercase'>里程碑按時率</div>
                  <div className='text-xl font-bold'>100%</div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Marketplace Insight */}
          <div className='bg-gradient-to-br from-indigo-900 to-black rounded-3xl p-8 text-white'>
            <div className='flex items-center space-x-2 text-cyan-400 font-bold text-sm mb-4'>
              <Sparkles className='w-4 h-4' />
              <span>市場趨勢預測</span>
            </div>
            <h3 className='text-xl font-bold mb-4'>React Native 開發者需求上漲</h3>
            <p className='text-sm text-indigo-200 mb-6'>
              根據 AI 分析，您所在的區域對移動端跨平台開發者的需求本月增加了 25%。建議更新您的技能標籤。
            </p>
            <button className='w-full py-3 bg-cyan-500 text-white rounded-2xl font-bold hover:bg-cyan-600 transition-all'>
              更新技能檔案
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContractorDashboard
