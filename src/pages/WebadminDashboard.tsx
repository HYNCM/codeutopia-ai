import React, { useState } from 'react'
import {
  Users,
  Briefcase,
  DollarSign,
  Shield,
  Activity,
  Brain,
  Globe,
  Settings,
  ShieldAlert,
  Server,
  Lock,
  MoreHorizontal,
  Gavel,
  Bell,
} from 'lucide-react'
import { AIAssistantPanel } from '../components/AIAssistantPanel'

interface WebadminDashboardProps {
  currentRole?: string
}

export default function WebadminDashboard({ currentRole }: WebadminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'projects' | 'disputes' | 'system'>('overview')

  return (
    <div className='max-w-[1600px] mx-auto space-y-8 animate-fade-in pb-12'>
      {/* 1. System Health Banner */}
      <div className='relative overflow-hidden group rounded-3xl'>
        <div className='absolute inset-0 bg-gradient-to-r from-red-600 via-purple-700 to-indigo-900 opacity-90 group-hover:opacity-100 transition-opacity duration-500' />
        <div className='absolute inset-0 bg-[url("https://www.transparenttextures.com/patterns/carbon-fibre.png")] opacity-20' />

        <div className='relative z-10 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8'>
          <div className='space-y-4 text-center md:text-left'>
            <div className='inline-flex items-center space-x-2 px-3 py-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10'>
              <Shield className='w-4 h-4 text-red-400' />
              <span className='text-xs font-semibold text-gray-300 uppercase tracking-wider'>
                Global Governance • 系統核心監控
              </span>
            </div>
            <h1 className='text-3xl sm:text-4xl font-extrabold text-white'>
              系統運行狀態：<span className='text-green-400'>優良 (99.9%)</span>
            </h1>
            <p className='text-gray-300 text-lg max-w-2xl'>
              全平台目前運行穩定。AI 防火牆已攔截 <span className='font-bold text-white'>1,245</span> 次異常請求。
              全球節點延遲低於 <span className='font-bold text-white'>45ms</span>。
            </p>
            <div className='flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2'>
              <button className='px-6 py-3 bg-white text-slate-900 rounded-2xl font-bold hover:bg-gray-100 hover:scale-105 transition-all shadow-xl shadow-black/20 flex items-center space-x-2'>
                <Server className='w-5 h-5' />
                <span>查看伺服器負載</span>
              </button>
              <button className='px-6 py-3 bg-white/5 border border-white/10 text-white rounded-2xl font-bold hover:bg-white/10 backdrop-blur-sm transition-all flex items-center space-x-2'>
                <ShieldAlert className='w-5 h-5 text-red-400' />
                <span>安全審計日誌</span>
              </button>
            </div>
          </div>

          <div className='hidden lg:flex items-center space-x-8'>
            <div className='text-center'>
              <div className='text-3xl font-black text-white'>$ 1.5M</div>
              <div className='text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1'>本月營運流水</div>
            </div>
            <div className='w-px h-12 bg-white/10' />
            <div className='text-center'>
              <div className='text-3xl font-black text-white'>124K</div>
              <div className='text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1'>活躍併發數</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Platform Command Metrics */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {[
          { label: '平台用戶', value: '18.5K', change: '+2.4%', icon: Users, color: 'blue' },
          { label: '正在運行項目', value: '4,285', change: '負載正常', icon: Briefcase, color: 'emerald' },
          { label: '待裁定爭議', value: '12', change: '需人工介入', icon: Gavel, color: 'orange' },
          { label: 'AI 平均負載', value: '62%', change: '資源充足', icon: Brain, color: 'purple' },
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

      {/* 3. Governance Tabs */}
      <div className='grid grid-cols-12 gap-8'>
        <div className='col-span-12 lg:col-span-9 space-y-8'>
          <div className='flex items-center justify-between bg-[var(--bg-card)] p-2 rounded-2xl border border-[var(--border-color)] shadow-sm overflow-x-auto'>
            <div className='flex space-x-1 min-w-max'>
              {[
                { id: 'overview', name: '控制面板', icon: Activity },
                { id: 'users', name: '用戶治理', icon: Users },
                { id: 'projects', name: '全球項目', icon: Globe },
                { id: 'disputes', name: '爭議裁定', icon: Gavel },
                { id: 'system', name: '系統規則', icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-red-600 text-white shadow-lg shadow-red-500/30'
                      : 'text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]'
                  }`}>
                  <tab.icon className='w-4 h-4' />
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className='animate-slide-up space-y-8'>
            {/* Global Activity Map Placeholder / List */}
            <div className='bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] p-8'>
              <div className='flex items-center justify-between mb-8'>
                <h2 className='text-xl font-bold text-[var(--text-primary)]'>全平台異常事件監控</h2>
                <button className='text-sm text-red-600 font-bold'>清除所有警告</button>
              </div>
              <div className='space-y-4'>
                {[
                  {
                    type: 'login',
                    title: '異常登錄活動',
                    location: 'Japan, Tokyo',
                    severity: 'medium',
                    time: '12 min ago',
                  },
                  {
                    type: 'transaction',
                    title: '大額異常轉賬限制',
                    location: 'Singapore',
                    severity: 'high',
                    time: '1 hour ago',
                  },
                  {
                    type: 'system',
                    title: 'AI 服務響應延遲',
                    location: 'Internal Server',
                    severity: 'low',
                    time: '3 hours ago',
                  },
                ].map((e, i) => (
                  <div
                    key={i}
                    className='p-5 border border-[var(--border-subtle)] rounded-2xl flex items-center justify-between group hover:bg-[var(--bg-card-hover)] transition-all'>
                    <div className='flex items-center space-x-4'>
                      <div
                        className={`w-2 h-2 rounded-full ${e.severity === 'high' ? 'bg-red-500 animate-pulse' : e.severity === 'medium' ? 'bg-orange-500' : 'bg-blue-500'}`}
                      />
                      <div>
                        <div className='font-bold text-[var(--text-primary)]'>{e.title}</div>
                        <div className='text-[10px] text-[var(--text-muted)] font-bold uppercase'>
                          {e.location} • {e.time}
                        </div>
                      </div>
                    </div>
                    <button className='p-2 hover:bg-[var(--bg-card)] rounded-xl transition-all'>
                      <MoreHorizontal className='w-5 h-5 text-[var(--text-muted)]' />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Performance */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div className='bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] p-8'>
                <h2 className='text-lg font-bold text-[var(--text-primary)] mb-6'>合規性審計審查</h2>
                <div className='space-y-6'>
                  <div>
                    <div className='flex justify-between text-xs font-bold mb-2'>
                      <span className='text-[var(--text-muted)]'>KYC 完成率</span>
                      <span className='text-emerald-500'>98.2%</span>
                    </div>
                    <div className='h-1.5 bg-[var(--bg-input)] rounded-full'>
                      <div className='h-full bg-emerald-500 rounded-full w-[98.2%]' />
                    </div>
                  </div>
                  <div>
                    <div className='flex justify-between text-xs font-bold mb-2'>
                      <span className='text-[var(--text-muted)]'>隱私權合規</span>
                      <span className='text-blue-500'>100%</span>
                    </div>
                    <div className='h-1.5 bg-[var(--bg-input)] rounded-full'>
                      <div className='h-full bg-blue-500 rounded-full w-[100%]' />
                    </div>
                  </div>
                </div>
              </div>

              <div className='bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] p-8'>
                <h2 className='text-lg font-bold text-[var(--text-primary)] mb-6'>爭議仲裁效率</h2>
                <div className='flex items-center justify-between p-4 bg-[var(--bg-input)] rounded-2xl'>
                  <div className='text-center'>
                    <div className='text-2xl font-black text-purple-600'>2.4h</div>
                    <div className='text-[10px] text-[var(--text-muted)] font-bold uppercase mt-1'>平均處理時間</div>
                  </div>
                  <div className='w-px h-8 bg-[var(--border-color)]' />
                  <div className='text-center'>
                    <div className='text-2xl font-black text-emerald-600'>96%</div>
                    <div className='text-[10px] text-[var(--text-muted)] font-bold uppercase mt-1'>調解成功率</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='col-span-12 lg:col-span-3 space-y-8'>
          <AIAssistantPanel currentRole='webadmin' onTaskComplete={() => {}} />

          <div className='bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] p-6'>
            <h2 className='text-lg font-bold text-[var(--text-primary)] mb-6'>常用設置項目</h2>
            <div className='space-y-2'>
              {[
                { name: '支付網關配置', icon: Lock },
                { name: 'AI 算力分配清單', icon: Brain },
                { name: '全球費率標準', icon: DollarSign },
                { name: '系統關鍵公告', icon: Bell },
              ].map((s, i) => (
                <button
                  key={i}
                  className='w-full p-4 flex items-center space-x-3 bg-[var(--bg-input)] hover:bg-[var(--bg-card-hover)] rounded-2xl transition-all border border-transparent hover:border-[var(--border-subtle)]'>
                  <s.icon className='w-5 h-5 text-purple-400' />
                  <span className='text-sm font-bold text-[var(--text-primary)]'>{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className='p-8 bg-gradient-to-br from-red-900 to-black rounded-3xl text-white relative overflow-hidden'>
            <div className='absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2' />
            <h3 className='text-lg font-bold mb-4 flex items-center space-x-2'>
              <ShieldAlert className='w-5 h-5 text-red-500' />
              <span>關鍵系統告警</span>
            </h3>
            <p className='text-sm text-red-200 mb-6'>
              請注意，歐盟區節點目前正受到大規模 DDoS 攻擊，負載均衡器已自動啟動防護機制。
            </p>
            <button className='w-full py-3 bg-white text-red-900 rounded-2xl font-bold hover:bg-gray-100 transition-all'>
              查看防禦報告
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
