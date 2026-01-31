import React, { useState } from 'react'
import {
  Globe,
  Users,
  Briefcase,
  BarChart3,
  TrendingUp,
  DollarSign,
  MapPin,
  ChevronRight,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Brain,
  Filter,
  MoreHorizontal,
  Target,
} from 'lucide-react'
import { AIAssistantPanel } from '../components/AIAssistantPanel'
import { REGIONS } from '../services/mockData'

interface RegionalManagerDashboardProps {
  currentRole?: string
}

const RegionalManagerDashboard: React.FC<RegionalManagerDashboardProps> = ({ currentRole }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'users' | 'reports' | 'disputes'>('overview')
  const [selectedRegion, setSelectedRegion] = useState<string>('APAC')

  return (
    <div className='max-w-[1600px] mx-auto space-y-8 animate-fade-in pb-12'>
      {/* 1. Management Banner */}
      <div className='relative overflow-hidden group rounded-3xl'>
        <div className='absolute inset-0 bg-gradient-to-r from-slate-900 via-purple-900 to-indigo-950 opacity-90 group-hover:opacity-100 transition-opacity duration-500' />
        <div className='absolute inset-0 bg-[url("https://www.transparenttextures.com/patterns/carbon-fibre.png")] opacity-20' />

        <div className='relative z-10 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8'>
          <div className='space-y-4 text-center md:text-left'>
            <div className='inline-flex items-center space-x-2 px-3 py-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10'>
              <Globe className='w-4 h-4 text-purple-400' />
              <span className='text-xs font-semibold text-gray-300 uppercase tracking-wider'>
                Global Governance • 區域營運中心
              </span>
            </div>
            <h1 className='text-3xl sm:text-4xl font-extrabold text-white'>
              區域概覽：
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400'>
                2024 第一季度
              </span>
            </h1>
            <p className='text-gray-300 text-lg max-w-2xl'>
              目前全球區域運行的 <span className='font-bold text-white'>1,245</span> 個項目進度正常。 AI
              智能風險預警已標記 <span className='font-bold text-red-400'>3</span> 個潛在爭議項目。
            </p>
            <div className='flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2'>
              <button className='px-6 py-3 bg-white text-slate-900 rounded-2xl font-bold hover:bg-gray-100 hover:scale-105 transition-all shadow-xl shadow-black/20 flex items-center space-x-2'>
                <BarChart3 className='w-5 h-5' />
                <span>生成全球季度報告</span>
              </button>
              <div className='flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-3 rounded-2xl backdrop-blur-sm'>
                <MapPin className='w-4 h-4 text-purple-400' />
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className='bg-transparent text-white text-sm font-bold focus:outline-none cursor-pointer'>
                  {REGIONS.map((r) => (
                    <option key={r.id} value={r.id} className='bg-slate-900'>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className='hidden lg:grid grid-cols-2 gap-4'>
            <div className='p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md'>
              <div className='text-[10px] text-gray-400 font-bold uppercase mb-1'>平台總GMV</div>
              <div className='text-2xl font-black text-white'>$ 12.8M</div>
              <div className='flex items-center text-green-400 text-[10px] font-bold mt-2'>
                <TrendingUp className='w-3 h-3 mr-1' /> +18.4%
              </div>
            </div>
            <div className='p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md'>
              <div className='text-[10px] text-gray-400 font-bold uppercase mb-1'>活躍主理人</div>
              <div className='text-2xl font-black text-white'>2,450</div>
              <div className='flex items-center text-purple-400 text-[10px] font-bold mt-2'>
                <Users className='w-3 h-3 mr-1' /> 全球分佈
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Global Strategy Metrics */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {[
          { label: '新註冊用戶', value: '1.2K', change: '+240 較昨日', icon: Users, color: 'blue' },
          { label: '項目完成率', value: '94.2%', change: '進度優良', icon: CheckCircle, color: 'emerald' },
          { label: '爭議案件', value: '8', change: '3 件處理中', icon: AlertTriangle, color: 'orange' },
          { label: 'AI 調度效率', value: '+42%', change: '資源優化', icon: Brain, color: 'purple' },
        ].map((stat, idx) => (
          <div
            key={idx}
            className='bg-[var(--bg-card)] rounded-3xl p-6 border border-[var(--border-color)] hover:shadow-2xl transition-all group'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform'>
                <stat.icon className='w-6 h-6 text-[var(--text-primary)]' />
              </div>
              <span
                className={`text-[10px] font-bold ${stat.color === 'orange' ? 'text-orange-500' : 'text-blue-500'} bg-gray-50 dark:bg-gray-900/50 px-2 py-1 rounded-full`}>
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

      {/* 3. Operational Content */}
      <div className='grid grid-cols-12 gap-8'>
        <div className='col-span-12 lg:col-span-8 space-y-8'>
          <div className='flex items-center justify-between bg-[var(--bg-card)] p-2 rounded-2xl border border-[var(--border-color)] shadow-sm'>
            <div className='flex space-x-1'>
              {[
                { id: 'overview', name: '營運概覽', icon: BarChart3 },
                { id: 'projects', name: '項目審查', icon: Briefcase },
                { id: 'users', name: '治理中心', icon: Target },
                { id: 'disputes', name: '爭議仲裁', icon: AlertTriangle },
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

          <div className='space-y-8 animate-slide-up'>
            {/* Regional Project Distribution */}
            <div className='bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] p-8'>
              <div className='flex items-center justify-between mb-8'>
                <h2 className='text-xl font-bold text-[var(--text-primary)]'>區域性能清單</h2>
                <button className='text-sm text-purple-600 font-bold'>查看數據詳情</button>
              </div>
              <div className='space-y-4'>
                {REGIONS.map((r, i) => (
                  <div
                    key={r.id}
                    className='p-4 bg-[var(--bg-input)] rounded-2xl flex items-center justify-between group hover:bg-[var(--bg-card-hover)] transition-all cursor-pointer'>
                    <div className='flex items-center space-x-4'>
                      <span className='text-2xl'>{r.flag}</span>
                      <div>
                        <div className='font-bold text-[var(--text-primary)]'>{r.name}</div>
                        <div className='text-[10px] text-[var(--text-muted)] font-bold uppercase'>
                          活躍係數: 0.{85 - i * 5}
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center space-x-12'>
                      <div className='hidden sm:block text-right'>
                        <div className='text-sm font-bold text-[var(--text-primary)]'>
                          $ {(5.2 - i * 0.8).toFixed(1)}M
                        </div>
                        <div className='text-[10px] text-[var(--text-muted)] font-bold uppercase'>當前份額</div>
                      </div>
                      <div className='w-24 h-1.5 bg-[var(--bg-card)] rounded-full overflow-hidden'>
                        <div className='h-full bg-purple-500 rounded-full' style={{ width: `${80 - i * 10}%` }} />
                      </div>
                      <ChevronRight className='w-5 h-5 text-[var(--text-muted)] group-hover:translate-x-1 transition-all' />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Escalated Issues */}
            <div className='bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] p-8'>
              <div className='flex items-center justify-between mb-8'>
                <h2 className='text-xl font-bold text-[var(--text-primary)]'>急需處理的爭議</h2>
                <span className='px-3 py-1 bg-red-500/10 text-red-500 text-[10px] font-bold rounded-full'>
                  緊急處理
                </span>
              </div>
              <div className='space-y-4'>
                {[
                  {
                    id: 'D-203',
                    title: '智能客服第一階段代碼交付爭議',
                    client: 'A-Tech',
                    freelancer: 'John D.',
                    amount: '$4,500',
                  },
                  {
                    id: 'D-204',
                    title: '原型圖版權歸屬問題',
                    client: 'CreativeCo',
                    freelancer: 'Sarah L.',
                    amount: '$2,200',
                  },
                ].map((d) => (
                  <div
                    key={d.id}
                    className='p-6 border border-[var(--border-subtle)] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                    <div className='space-y-1'>
                      <div className='text-xs font-bold text-red-500'>案件 #{d.id}</div>
                      <h4 className='font-bold text-[var(--text-primary)]'>{d.title}</h4>
                      <div className='text-xs text-[var(--text-muted)]'>
                        {d.client} vs {d.freelancer}
                      </div>
                    </div>
                    <div className='flex items-center space-x-4'>
                      <div className='text-right'>
                        <div className='text-sm font-bold text-[var(--text-primary)]'>{d.amount}</div>
                        <div className='text-[10px] text-[var(--text-muted)] font-bold uppercase'>扣押金額</div>
                      </div>
                      <button className='px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-black rounded-xl text-xs font-bold'>
                        介入調解
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className='col-span-12 lg:col-span-4 space-y-8'>
          {/* AI Helper Panel */}
          <AIAssistantPanel currentRole='regional_manager' onTaskComplete={() => {}} />

          {/* Regional Risk Radar */}
          <div className='bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] p-6'>
            <h2 className='text-lg font-bold text-[var(--text-primary)] mb-6 flex items-center justify-between'>
              <span>區域風險監控</span>
              <AlertTriangle className='w-5 h-5 text-orange-500' />
            </h2>
            <div className='space-y-4'>
              {[
                { name: '支付合規性', score: 98, color: 'emerald' },
                { name: '人才飽和度', score: 72, color: 'blue' },
                { name: '交付風險率', score: 12, color: 'red' },
                { name: 'AI 對接準確度', score: 85, color: 'purple' },
              ].map((r, i) => (
                <div key={i}>
                  <div className='flex justify-between text-[10px] font-bold uppercase mb-1.5'>
                    <span className='text-[var(--text-muted)]'>{r.name}</span>
                    <span className={`text-${r.color}-500`}>{r.score}%</span>
                  </div>
                  <div className='h-1.5 bg-[var(--bg-input)] rounded-full overflow-hidden'>
                    <div className={`h-full bg-${r.color}-500 rounded-full`} style={{ width: `${r.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Efficiency Report */}
          <div className='bg-gradient-to-br from-purple-900 to-indigo-950 rounded-3xl p-8 text-white relative overflow-hidden'>
            <div className='absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2' />
            <h3 className='text-lg font-bold mb-4 flex items-center space-x-2'>
              <TrendingUp className='w-5 h-5 text-purple-400' />
              <span>營運效能分析</span>
            </h3>
            <p className='text-sm text-purple-200 mb-6'>
              本月 AI 自動調度已為區域節省了約 1,250 小時的管理工時。人才重疊率降低了 15%。
            </p>
            <div className='flex items-end justify-between'>
              <div className='text-3xl font-black'>+24%</div>
              <div className='text-[10px] text-purple-300 font-bold uppercase pb-1'>較上一季度</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegionalManagerDashboard
