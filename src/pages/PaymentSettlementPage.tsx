import React, { useState } from 'react'
import {
  DollarSign,
  CreditCard,
  Building2,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Briefcase,
  Users,
  Globe,
  Calendar,
  Search,
  Filter,
  MoreVertical,
  Download,
  Upload,
  RefreshCw,
  ChevronRight,
  X,
  Send,
  Shield,
  Zap,
  TrendingUp,
  History,
  PieChart,
  BarChart3,
  ArrowLeftRight,
  ExternalLink,
} from 'lucide-react'

// Types
interface PaymentRecord {
  id: string
  projectId: string
  projectTitle: string
  milestoneId: string
  milestoneTitle: string
  amount: number
  currency: string
  type: 'milestone_release' | 'milestone_escrow' | 'refund' | 'bonus' | 'penalty'
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'disputed'
  fromRole: 'project_initiator' | 'platform' | 'contractor'
  toRole: 'contractor' | 'project_initiator' | 'platform'
  createdAt: string
  completedAt?: string
  description: string
  exchangeRate?: number
  finalAmount?: number
}

interface EscrowAccount {
  id: string
  projectId: string
  projectTitle: string
  totalAmount: number
  currency: string
  releasedAmount: number
  pendingAmount: number
  status: 'active' | 'completed' | 'disputed' | 'released'
  createdAt: string
  milestones: EscrowMilestone[]
}

interface EscrowMilestone {
  milestoneId: string
  title: string
  amount: number
  status: 'pending' | 'locked' | 'released' | 'refunded'
}

interface CurrencyRate {
  code: string
  symbol: string
  name: string
  rateToUSD: number
}

const PaymentSettlementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'escrow' | 'currency' | 'disputes'>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterCurrency, setFilterCurrency] = useState<string>('all')
  const [showNewPayment, setShowNewPayment] = useState(false)

  // Currency rates (simplified)
  const currencyRates: CurrencyRate[] = [
    { code: 'USD', symbol: '$', name: '美元', rateToUSD: 1 },
    { code: 'EUR', symbol: '€', name: '欧元', rateToUSD: 0.92 },
    { code: 'CNY', symbol: '¥', name: '人民币', rateToUSD: 7.24 },
    { code: 'GBP', symbol: '£', name: '英镑', rateToUSD: 0.79 },
    { code: 'JPY', symbol: '¥', name: '日元', rateToUSD: 149.5 },
    { code: 'AUD', symbol: 'A$', name: '澳大利亚元', rateToUSD: 1.53 },
    { code: 'CAD', symbol: 'C$', name: '加拿大元', rateToUSD: 1.36 },
  ]

  // Sample payment records
  const paymentRecords: PaymentRecord[] = [
    {
      id: 'PAY001',
      projectId: 'PRJ001',
      projectTitle: '跨境电商平台开发',
      milestoneId: 'MS001',
      milestoneTitle: '需求分析与原型设计',
      amount: 12000,
      currency: 'USD',
      type: 'milestone_release',
      status: 'completed',
      fromRole: 'platform',
      toRole: 'contractor',
      createdAt: '2024-01-30T10:00:00Z',
      completedAt: '2024-01-30T10:05:00Z',
      description: '里程碑验收通过，释放托管款项',
    },
    {
      id: 'PAY002',
      projectId: 'PRJ001',
      projectTitle: '跨境电商平台开发',
      milestoneId: 'MS002',
      milestoneTitle: '前端开发',
      amount: 25000,
      currency: 'USD',
      type: 'milestone_escrow',
      status: 'completed',
      fromRole: 'project_initiator',
      toRole: 'platform',
      createdAt: '2024-02-01T09:00:00Z',
      completedAt: '2024-02-01T09:02:00Z',
      description: '款项已托管，等待里程碑完成',
    },
    {
      id: 'PAY003',
      projectId: 'PRJ002',
      projectTitle: 'AI智能客服系统',
      milestoneId: 'MS005',
      milestoneTitle: '需求分析与技术选型',
      amount: 15000,
      currency: 'USD',
      type: 'milestone_release',
      status: 'completed',
      fromRole: 'platform',
      toRole: 'contractor',
      createdAt: '2024-02-15T14:30:00Z',
      completedAt: '2024-02-15T14:35:00Z',
      description: '里程碑验收通过，释放托管款项',
    },
    {
      id: 'PAY004',
      projectId: 'PRJ003',
      projectTitle: '移动应用UI设计',
      milestoneId: 'MS008',
      milestoneTitle: 'UI设计',
      amount: 8000,
      currency: 'EUR',
      type: 'milestone_escrow',
      status: 'pending',
      fromRole: 'project_initiator',
      toRole: 'platform',
      createdAt: '2024-03-01T11:00:00Z',
      description: '款项托管中',
      exchangeRate: 0.92,
      finalAmount: 7360,
    },
    {
      id: 'PAY005',
      projectId: 'PRJ001',
      projectTitle: '跨境电商平台开发',
      milestoneId: 'MS001',
      milestoneTitle: '需求分析与原型设计',
      amount: 500,
      currency: 'USD',
      type: 'bonus',
      status: 'completed',
      fromRole: 'project_initiator',
      toRole: 'contractor',
      createdAt: '2024-01-28T16:00:00Z',
      completedAt: '2024-01-28T16:02:00Z',
      description: '提前完成里程碑奖励',
    },
  ]

  // Sample escrow accounts
  const escrowAccounts: EscrowAccount[] = [
    {
      id: 'ESC001',
      projectId: 'PRJ001',
      projectTitle: '跨境电商平台开发',
      totalAmount: 85000,
      currency: 'USD',
      releasedAmount: 12500,
      pendingAmount: 72500,
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      milestones: [
        { milestoneId: 'MS001', title: '需求分析与原型设计', amount: 12000, status: 'released' },
        { milestoneId: 'MS002', title: '前端开发', amount: 25000, status: 'locked' },
        { milestoneId: 'MS003', title: '后端开发', amount: 30000, status: 'locked' },
        { milestoneId: 'MS004', title: '测试与上线', amount: 18000, status: 'locked' },
      ],
    },
    {
      id: 'ESC002',
      projectId: 'PRJ002',
      projectTitle: 'AI智能客服系统',
      totalAmount: 120000,
      currency: 'USD',
      releasedAmount: 15000,
      pendingAmount: 105000,
      status: 'active',
      createdAt: '2024-01-15T00:00:00Z',
      milestones: [
        { milestoneId: 'MS005', title: '需求分析与技术选型', amount: 15000, status: 'released' },
        { milestoneId: 'MS006', title: '模型训练与优化', amount: 55000, status: 'locked' },
        { milestoneId: 'MS007', title: '系统集成与测试', amount: 30000, status: 'locked' },
        { milestoneId: 'MS008', title: '部署与交付', amount: 20000, status: 'locked' },
      ],
    },
  ]

  // Stats
  const stats = {
    totalReceived: 275000,
    totalSpent: 189000,
    pendingPayments: 43000,
    escrowBalance: 177500,
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'text-yellow-600 bg-yellow-100',
      processing: 'text-blue-600 bg-blue-100',
      completed: 'text-green-600 bg-green-100',
      failed: 'text-red-600 bg-red-100',
      disputed: 'text-orange-600 bg-orange-100',
      active: 'text-green-600 bg-green-100',
      released: 'text-blue-600 bg-blue-100',
      refunded: 'text-gray-600 bg-gray-100',
      locked: 'text-purple-600 bg-purple-100',
    }
    return colors[status] || 'text-gray-600 bg-gray-100'
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      milestone_release: 'text-green-600 bg-green-100',
      milestone_escrow: 'text-blue-600 bg-blue-100',
      refund: 'text-orange-600 bg-orange-100',
      bonus: 'text-purple-600 bg-purple-100',
      penalty: 'text-red-600 bg-red-100',
    }
    return colors[type] || 'text-gray-600 bg-gray-100'
  }

  const formatCurrency = (amount: number, currency: string) => {
    const rate = currencyRates.find((r) => r.code === currency)
    const symbol = rate?.symbol || currency
    return `${symbol}${amount.toLocaleString()}`
  }

  const filteredPayments = paymentRecords.filter((record) => {
    const matchesSearch =
      record.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.milestoneTitle.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || record.type === filterType
    const matchesCurrency = filterCurrency === 'all' || record.currency === filterCurrency
    return matchesSearch && matchesType && matchesCurrency
  })

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'>
      {/* Header */}
      <header className='bg-slate-800/80 backdrop-blur-md border-b border-purple-500/30 sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            {/* Logo */}
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center'>
                <DollarSign className='w-6 h-6 text-white' />
              </div>
              <div>
                <h1 className='text-xl font-bold text-white'>CodeUtopia.ai</h1>
                <p className='text-xs text-purple-300'>Payment & Settlement</p>
              </div>
            </div>

            {/* Navigation */}
            <div className='flex items-center space-x-4'>
              <nav className='hidden md:flex space-x-1 bg-slate-700/50 rounded-lg p-1'>
                {[
                  { id: 'overview', label: '总览', icon: PieChart },
                  { id: 'payments', label: '付款记录', icon: History },
                  { id: 'escrow', label: '托管账户', icon: Shield },
                  { id: 'currency', label: '货币兑换', icon: ArrowLeftRight },
                  { id: 'disputes', label: '争议处理', icon: AlertTriangle },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                      activeTab === tab.id ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
                    }`}>
                    <tab.icon className='w-4 h-4 mr-2' />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Actions */}
            <div className='flex items-center space-x-4'>
              <button className='relative p-2 text-gray-400 hover:text-white transition-colors'>
                <FileText className='w-5 h-5' />
                <span className='absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center'>
                  2
                </span>
              </button>
              <button className='bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-green-600 hover:to-emerald-600 transition-colors flex items-center'>
                <Wallet className='w-4 h-4 mr-2' />
                充值余额
              </button>
              <div className='w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-medium'>
                PS
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className='space-y-6'>
            {/* Stats */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              {[
                {
                  label: '总收入',
                  value: formatCurrency(stats.totalReceived, 'USD'),
                  change: '+12.5%',
                  icon: ArrowUpRight,
                  color: 'from-green-500 to-emerald-500',
                },
                {
                  label: '总支出',
                  value: formatCurrency(stats.totalSpent, 'USD'),
                  change: '+8.3%',
                  icon: ArrowDownRight,
                  color: 'from-red-500 to-orange-500',
                },
                {
                  label: '待付款',
                  value: formatCurrency(stats.pendingPayments, 'USD'),
                  change: '-5.2%',
                  icon: Clock,
                  color: 'from-yellow-500 to-orange-500',
                },
                {
                  label: '托管余额',
                  value: formatCurrency(stats.escrowBalance, 'USD'),
                  change: '+15.8%',
                  icon: Shield,
                  color: 'from-purple-500 to-pink-500',
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className='bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-purple-500/20'>
                  <div className='flex items-center justify-between mb-3'>
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <stat.icon className='w-5 h-5 text-white' />
                    </div>
                    <span className='text-green-400 text-sm flex items-center'>
                      <TrendingUp className='w-3 h-3 mr-1' />
                      {stat.change}
                    </span>
                  </div>
                  <div className='text-2xl font-bold text-white'>{stat.value}</div>
                  <div className='text-gray-400 text-sm'>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {/* Recent Transactions */}
              <div className='bg-slate-800/50 rounded-xl p-6 border border-purple-500/20'>
                <div className='flex justify-between items-center mb-6'>
                  <h3 className='text-lg font-semibold text-white'>最近交易</h3>
                  <button className='text-purple-400 hover:text-purple-300 text-sm flex items-center'>
                    查看全部 <ChevronRight className='w-4 h-4 ml-1' />
                  </button>
                </div>
                <div className='space-y-4'>
                  {paymentRecords.slice(0, 5).map((payment) => (
                    <div key={payment.id} className='flex items-center justify-between p-3 bg-slate-700/30 rounded-lg'>
                      <div className='flex items-center space-x-3'>
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            payment.type === 'milestone_release'
                              ? 'bg-green-500/20'
                              : payment.type === 'milestone_escrow'
                                ? 'bg-blue-500/20'
                                : 'bg-purple-500/20'
                          }`}>
                          {payment.type === 'milestone_release' ? (
                            <ArrowUpRight className='w-5 h-5 text-green-400' />
                          ) : payment.type === 'milestone_escrow' ? (
                            <Shield className='w-5 h-5 text-blue-400' />
                          ) : (
                            <Zap className='w-5 h-5 text-purple-400' />
                          )}
                        </div>
                        <div>
                          <div className='text-white font-medium'>{payment.milestoneTitle}</div>
                          <div className='text-xs text-gray-400'>{payment.createdAt.split('T')[0]}</div>
                        </div>
                      </div>
                      <div className='text-right'>
                        <div
                          className={`font-medium ${
                            payment.type === 'milestone_release' || payment.type === 'bonus'
                              ? 'text-green-400'
                              : payment.type === 'refund'
                                ? 'text-orange-400'
                                : 'text-white'
                          }`}>
                          {payment.type === 'milestone_release' || payment.type === 'bonus' ? '+' : '-'}
                          {formatCurrency(payment.amount, payment.currency)}
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(payment.status)}`}>
                          {payment.status === 'completed' ? '已完成' : payment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Currency Distribution */}
              <div className='bg-slate-800/50 rounded-xl p-6 border border-purple-500/20'>
                <div className='flex justify-between items-center mb-6'>
                  <h3 className='text-lg font-semibold text-white'>货币分布</h3>
                  <button className='text-purple-400 hover:text-purple-300 text-sm flex items-center'>
                    详细报表 <ChevronRight className='w-4 h-4 ml-1' />
                  </button>
                </div>
                <div className='space-y-4'>
                  {[
                    { currency: 'USD', amount: 156000, percentage: 56, color: 'bg-green-500' },
                    { currency: 'EUR', amount: 45000, percentage: 16, color: 'bg-blue-500' },
                    { currency: 'CNY', amount: 52000, percentage: 19, color: 'bg-red-500' },
                    { currency: 'GBP', amount: 24000, percentage: 9, color: 'bg-purple-500' },
                  ].map((item, index) => (
                    <div key={item.currency}>
                      <div className='flex justify-between text-sm mb-2'>
                        <span className='text-gray-400'>{item.currency}</span>
                        <span className='text-white font-medium'>{formatCurrency(item.amount, 'USD')}</span>
                      </div>
                      <div className='h-2 bg-slate-700 rounded-full overflow-hidden'>
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Escrow Overview */}
            <div className='bg-slate-800/50 rounded-xl p-6 border border-purple-500/20'>
              <div className='flex justify-between items-center mb-6'>
                <h3 className='text-lg font-semibold text-white'>托管账户概览</h3>
                <button className='text-purple-400 hover:text-purple-300 text-sm flex items-center'>
                  管理账户 <ChevronRight className='w-4 h-4 ml-1' />
                </button>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {escrowAccounts.map((account) => (
                  <div key={account.id} className='p-4 bg-slate-700/30 rounded-lg'>
                    <div className='flex items-center justify-between mb-3'>
                      <h4 className='font-medium text-white'>{account.projectTitle}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(account.status)}`}>
                        {account.status === 'active' ? '活跃' : account.status}
                      </span>
                    </div>
                    <div className='flex items-center justify-between mb-3'>
                      <span className='text-gray-400 text-sm'>总托管金额</span>
                      <span className='text-white font-medium'>
                        {formatCurrency(account.totalAmount, account.currency)}
                      </span>
                    </div>
                    <div className='flex items-center justify-between mb-3'>
                      <span className='text-gray-400 text-sm'>已释放</span>
                      <span className='text-green-400 font-medium'>
                        {formatCurrency(account.releasedAmount, account.currency)}
                      </span>
                    </div>
                    <div className='h-2 bg-slate-600 rounded-full overflow-hidden'>
                      <div
                        className='h-full bg-green-500 rounded-full'
                        style={{ width: `${(account.releasedAmount / account.totalAmount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className='space-y-6'>
            {/* Search and Filters */}
            <div className='bg-slate-800/50 rounded-xl p-4 border border-purple-500/20'>
              <div className='flex flex-wrap gap-4'>
                <div className='flex-1 min-w-64'>
                  <div className='relative'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                    <input
                      type='text'
                      placeholder='搜索项目、里程碑...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-full bg-slate-700/50 border border-purple-500/30 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500'
                    />
                  </div>
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className='bg-slate-700/50 text-white rounded-lg px-4 py-2 border border-purple-500/30 focus:outline-none focus:border-purple-500'>
                  <option value='all'>所有类型</option>
                  <option value='milestone_release'>里程碑释放</option>
                  <option value='milestone_escrow'>托管收款</option>
                  <option value='bonus'>奖励</option>
                  <option value='refund'>退款</option>
                </select>
                <select
                  value={filterCurrency}
                  onChange={(e) => setFilterCurrency(e.target.value)}
                  className='bg-slate-700/50 text-white rounded-lg px-4 py-2 border border-purple-500/30 focus:outline-none focus:border-purple-500'>
                  <option value='all'>所有货币</option>
                  {currencyRates.map((rate) => (
                    <option key={rate.code} value={rate.code}>
                      {rate.code} - {rate.name}
                    </option>
                  ))}
                </select>
                <button className='bg-slate-700/50 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-700 transition-colors flex items-center'>
                  <Download className='w-4 h-4 mr-2' />
                  导出
                </button>
              </div>
            </div>

            {/* Payment List */}
            <div className='bg-slate-800/50 rounded-xl p-6 border border-purple-500/20'>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='text-left text-gray-400 text-sm border-b border-slate-700'>
                      <th className='pb-3 font-medium'>交易ID</th>
                      <th className='pb-3 font-medium'>项目 / 里程碑</th>
                      <th className='pb-3 font-medium'>类型</th>
                      <th className='pb-3 font-medium'>金额</th>
                      <th className='pb-3 font-medium'>状态</th>
                      <th className='pb-3 font-medium'>时间</th>
                      <th className='pb-3 font-medium'>操作</th>
                    </tr>
                  </thead>
                  <tbody className='text-white text-sm'>
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className='border-b border-slate-700/50 hover:bg-slate-700/30'>
                        <td className='py-4 font-mono text-gray-400'>{payment.id}</td>
                        <td className='py-4'>
                          <div className='font-medium'>{payment.projectTitle}</div>
                          <div className='text-gray-400 text-xs'>{payment.milestoneTitle}</div>
                        </td>
                        <td className='py-4'>
                          <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(payment.type)}`}>
                            {payment.type === 'milestone_release'
                              ? '释放'
                              : payment.type === 'milestone_escrow'
                                ? '托管'
                                : payment.type === 'bonus'
                                  ? '奖励'
                                  : '退款'}
                          </span>
                        </td>
                        <td className='py-4'>
                          <div
                            className={`font-medium ${
                              payment.type === 'milestone_release' || payment.type === 'bonus'
                                ? 'text-green-400'
                                : payment.type === 'refund'
                                  ? 'text-orange-400'
                                  : 'text-white'
                            }`}>
                            {payment.type === 'milestone_release' || payment.type === 'bonus' ? '+' : '-'}
                            {formatCurrency(payment.amount, payment.currency)}
                          </div>
                          {payment.exchangeRate && (
                            <div className='text-xs text-gray-400'>
                              汇率: 1 USD = {payment.exchangeRate} {payment.currency}
                            </div>
                          )}
                        </td>
                        <td className='py-4'>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(payment.status)}`}>
                            {payment.status === 'completed'
                              ? '已完成'
                              : payment.status === 'pending'
                                ? '待处理'
                                : payment.status === 'processing'
                                  ? '处理中'
                                  : payment.status}
                          </span>
                        </td>
                        <td className='py-4 text-gray-400'>{payment.createdAt.split('T')[0]}</td>
                        <td className='py-4'>
                          <button className='text-purple-400 hover:text-purple-300 text-xs'>查看详情</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Escrow Tab */}
        {activeTab === 'escrow' && (
          <div className='space-y-6'>
            <div className='flex justify-between items-center'>
              <div>
                <h2 className='text-xl font-bold text-white mb-1'>托管账户管理</h2>
                <p className='text-gray-400 text-sm'>安全托管，验收释放</p>
              </div>
              <button
                onClick={() => setShowNewPayment(true)}
                className='bg-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-600 transition-colors flex items-center'>
                <Shield className='w-4 h-4 mr-2' />
                新建托管
              </button>
            </div>

            {/* Escrow Cards */}
            <div className='space-y-4'>
              {escrowAccounts.map((account) => (
                <div key={account.id} className='bg-slate-800/50 rounded-xl p-6 border border-purple-500/20'>
                  <div className='flex items-start justify-between mb-6'>
                    <div className='flex items-start space-x-4'>
                      <div className='w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center'>
                        <Shield className='w-6 h-6 text-purple-400' />
                      </div>
                      <div>
                        <h3 className='text-lg font-semibold text-white'>{account.projectTitle}</h3>
                        <p className='text-gray-400 text-sm'>ID: {account.projectId}</p>
                      </div>
                    </div>
                    <span className={`text-sm px-3 py-1 rounded-full ${getStatusColor(account.status)}`}>
                      {account.status === 'active' ? '活跃中' : account.status}
                    </span>
                  </div>

                  {/* Account Stats */}
                  <div className='grid grid-cols-3 gap-4 mb-6'>
                    <div className='bg-slate-700/30 rounded-lg p-4 text-center'>
                      <div className='text-2xl font-bold text-white'>
                        {formatCurrency(account.totalAmount, account.currency)}
                      </div>
                      <div className='text-gray-400 text-sm'>总托管金额</div>
                    </div>
                    <div className='bg-green-500/10 rounded-lg p-4 text-center'>
                      <div className='text-2xl font-bold text-green-400'>
                        {formatCurrency(account.releasedAmount, account.currency)}
                      </div>
                      <div className='text-gray-400 text-sm'>已释放</div>
                    </div>
                    <div className='bg-blue-500/10 rounded-lg p-4 text-center'>
                      <div className='text-2xl font-bold text-blue-400'>
                        {formatCurrency(account.pendingAmount, account.currency)}
                      </div>
                      <div className='text-gray-400 text-sm'>待释放</div>
                    </div>
                  </div>

                  {/* Milestones */}
                  <div>
                    <h4 className='text-sm font-medium text-gray-400 mb-3'>里程碑释放进度</h4>
                    <div className='space-y-2'>
                      {account.milestones.map((milestone) => (
                        <div
                          key={milestone.milestoneId}
                          className='flex items-center justify-between p-3 bg-slate-700/30 rounded-lg'>
                          <div className='flex items-center space-x-3'>
                            {milestone.status === 'released' ? (
                              <CheckCircle className='w-5 h-5 text-green-400' />
                            ) : milestone.status === 'locked' ? (
                              <Shield className='w-5 h-5 text-blue-400' />
                            ) : (
                              <Clock className='w-5 h-5 text-gray-400' />
                            )}
                            <span className='text-white'>{milestone.title}</span>
                          </div>
                          <div className='flex items-center space-x-4'>
                            <span className='text-gray-400'>{formatCurrency(milestone.amount, account.currency)}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(milestone.status)}`}>
                              {milestone.status === 'released'
                                ? '已释放'
                                : milestone.status === 'locked'
                                  ? '已锁定'
                                  : '待处理'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Currency Tab */}
        {activeTab === 'currency' && (
          <div className='space-y-6'>
            <div className='bg-slate-800/50 rounded-xl p-6 border border-purple-500/20'>
              <h3 className='text-lg font-semibold text-white mb-6'>实时汇率</h3>
              <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4'>
                {currencyRates.map((rate) => (
                  <div key={rate.code} className='bg-slate-700/30 rounded-lg p-4 text-center'>
                    <div className='text-lg font-bold text-white'>{rate.code}</div>
                    <div className='text-xs text-gray-400 mb-2'>{rate.name}</div>
                    <div className='text-xl font-bold text-purple-400'>
                      {rate.symbol}
                      {(1 / rate.rateToUSD).toFixed(4)}
                    </div>
                    <div className='text-xs text-gray-500'>vs USD</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Currency Converter */}
            <div className='bg-slate-800/50 rounded-xl p-6 border border-purple-500/20'>
              <h3 className='text-lg font-semibold text-white mb-6'>货币兑换计算器</h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div>
                  <label className='text-sm text-gray-400 mb-2 block'>源货币</label>
                  <select className='w-full bg-slate-700/50 text-white rounded-lg px-4 py-3 border border-purple-500/30 focus:outline-none focus:border-purple-500'>
                    {currencyRates.map((rate) => (
                      <option key={rate.code} value={rate.code}>
                        {rate.code} - {rate.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='text-sm text-gray-400 mb-2 block'>目标货币</label>
                  <select className='w-full bg-slate-700/50 text-white rounded-lg px-4 py-3 border border-purple-500/30 focus:outline-none focus:border-purple-500'>
                    {currencyRates.map((rate) => (
                      <option key={rate.code} value={rate.code}>
                        {rate.code} - {rate.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='text-sm text-gray-400 mb-2 block'>金额</label>
                  <input
                    type='number'
                    placeholder='输入金额'
                    className='w-full bg-slate-700/50 text-white rounded-lg px-4 py-3 border border-purple-500/30 focus:outline-none focus:border-purple-500'
                  />
                </div>
              </div>
              <div className='mt-6 p-4 bg-purple-500/10 rounded-lg text-center'>
                <div className='text-gray-400 text-sm mb-2'>兑换结果</div>
                <div className='text-3xl font-bold text-white'>€0.00</div>
                <div className='text-xs text-gray-500 mt-2'>实时汇率仅供参考，实际以交易时为准</div>
              </div>
            </div>

            {/* Multi-Currency Support Info */}
            <div className='bg-slate-800/50 rounded-xl p-6 border border-purple-500/20'>
              <h3 className='text-lg font-semibold text-white mb-4'>多币种结算优势</h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {[
                  { icon: Globe, title: '全球覆盖', desc: '支持7种主要货币，覆盖全球主要市场' },
                  { icon: Shield, title: '安全合规', desc: '符合各国金融监管要求，保障资金安全' },
                  { icon: Clock, title: '实时结算', desc: '快速结算，缩短资金周转周期' },
                ].map((item, index) => (
                  <div key={index} className='p-4 bg-slate-700/30 rounded-lg'>
                    <div className='w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3'>
                      <item.icon className='w-5 h-5 text-purple-400' />
                    </div>
                    <h4 className='font-medium text-white mb-1'>{item.title}</h4>
                    <p className='text-sm text-gray-400'>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Disputes Tab */}
        {activeTab === 'disputes' && (
          <div className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {[
                { label: '待处理争议', value: 3, color: 'bg-yellow-500' },
                { label: '处理中', value: 5, color: 'bg-blue-500' },
                { label: '已解决', value: 28, color: 'bg-green-500' },
              ].map((stat, index) => (
                <div key={index} className='bg-slate-800/50 rounded-xl p-5 border border-purple-500/20'>
                  <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                    <AlertTriangle className='w-5 h-5 text-white' />
                  </div>
                  <div className='text-2xl font-bold text-white'>{stat.value}</div>
                  <div className='text-gray-400 text-sm'>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Dispute List */}
            <div className='bg-slate-800/50 rounded-xl p-6 border border-purple-500/20'>
              <h3 className='text-lg font-semibold text-white mb-6'>付款争议</h3>
              <div className='space-y-4'>
                {[
                  {
                    id: 'DSP001',
                    project: '跨境电商平台开发',
                    milestone: '前端开发',
                    amount: '$8,500',
                    status: '待处理',
                    reason: '交付物未达标准',
                  },
                  {
                    id: 'DSP002',
                    project: 'AI智能客服系统',
                    milestone: '模型训练',
                    amount: '$12,000',
                    status: '处理中',
                    reason: '进度延期争议',
                  },
                ].map((dispute, index) => (
                  <div key={dispute.id} className='p-4 bg-slate-700/30 rounded-lg'>
                    <div className='flex items-center justify-between mb-3'>
                      <div className='flex items-center space-x-3'>
                        <AlertTriangle className='w-5 h-5 text-yellow-400' />
                        <span className='font-medium text-white'>{dispute.project}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(dispute.status)}`}>
                        {dispute.status === '待处理' ? '待处理' : '处理中'}
                      </span>
                    </div>
                    <div className='flex items-center justify-between text-sm text-gray-400'>
                      <span>{dispute.milestone}</span>
                      <span className='text-white font-medium'>{dispute.amount}</span>
                    </div>
                    <div className='mt-3 pt-3 border-t border-slate-600 flex justify-between items-center'>
                      <span className='text-xs text-gray-500'>争议ID: {dispute.id}</span>
                      <button className='text-purple-400 hover:text-purple-300 text-sm'>处理争议</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className='bg-slate-800/50 border-t border-purple-500/20 mt-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center space-x-2'>
              <Shield className='w-5 h-5 text-green-400' />
              <span className='text-gray-400 text-sm'>资金托管 · 安全保障 · 快速结算</span>
            </div>
            <div className='flex items-center space-x-4 text-sm text-gray-400'>
              <span>支持 7 种货币</span>
              <span>•</span>
              <span>实时汇率</span>
              <span>•</span>
              <span>0 手续费</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PaymentSettlementPage
