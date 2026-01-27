import React, { useState } from 'react';
import {
  Globe, Users, Briefcase, BarChart3, Settings, Bell, Search,
  TrendingUp, DollarSign, Clock, MapPin, Star, ChevronRight,
  PieChart, Calendar, MessageSquare, FileText, CheckCircle,
  AlertTriangle, RefreshCw, ArrowUpRight, ArrowDownRight, Building2
} from 'lucide-react';
import { AIAssistantPanel } from '../components/AIAssistantPanel';

// Role types
type UserRole = 'project_initiator' | 'contractor' | 'webadmin' | 'regional_manager' | 'ai_assistant' | 'ai_customer_service';

interface RegionalData {
  regionId: string;
  regionName: string;
  regionNameEn: string;
  countryCount: number;
  activeUsers: number;
  activeProjects: number;
  revenue: number;
  growth: number;
}

interface RegionalManagerDashboardProps {
  currentRole?: 'regional_manager';
}

const RegionalManagerDashboard: React.FC<RegionalManagerDashboardProps> = ({ currentRole }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'users' | 'reports' | 'disputes' | 'ai_config'>('overview');
  const [selectedRegion, setSelectedRegion] = useState<string>('APAC');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAIPanel, setShowAIPanel] = useState(false);

  // Regional data
  const regions: RegionalData[] = [
    { regionId: 'APAC', regionName: '亚太区', regionNameEn: 'Asia Pacific', countryCount: 15, activeUsers: 12450, activeProjects: 892, revenue: 2450000, growth: 12.5 },
    { regionId: 'EMEA', regionName: '欧洲中东非洲', regionNameEn: 'Europe, Middle East & Africa', countryCount: 52, activeUsers: 8920, activeProjects: 654, revenue: 3280000, growth: 8.3 },
    { regionId: 'AMERS', regionName: '美洲区', regionNameEn: 'Americas', countryCount: 35, activeUsers: 15680, activeProjects: 1245, revenue: 4560000, growth: 15.2 },
    { regionId: 'CHINA', regionName: '大中华区', regionNameEn: 'Greater China', countryCount: 4, activeUsers: 28900, activeProjects: 2156, revenue: 8920000, growth: 18.7 },
  ];

  // Pending tasks for regional manager
  const pendingTasks = [
    { id: 1, type: 'approval', title: '审查新注册企业用户', region: 'APAC', priority: 'high', time: '2小时前' },
    { id: 2, type: 'dispute', title: '处理项目争议 #2024001', region: 'AMERS', priority: 'high', time: '4小时前' },
    { id: 3, type: 'report', title: '审核月度区域运营报告', region: 'EMEA', priority: 'medium', time: '1天前' },
    { id: 4, type: 'approval', title: '批准AI调度请求', region: 'CHINA', priority: 'low', time: '2天前' },
  ];

  // AI assistance scheduling requests
  const aiSchedulingRequests = [
    { id: 1, projectId: 'PRJ001', requestType: 'additional_ai', aiRole: 'UX Designer AI', reason: '原型设计需要多轮迭代', status: 'pending', requestedAt: '2024-01-15 10:30' },
    { id: 2, projectId: 'PRJ002', requestType: 'specialist', aiRole: 'Backend Engineer AI', reason: '需要微服务架构指导', status: 'approved', requestedAt: '2024-01-15 09:15' },
    { id: 3, projectId: 'PRJ003', requestType: 'extended', aiRole: 'Product Manager AI', reason: '需求变更需要重新规划', status: 'pending', requestedAt: '2024-01-14 16:45' },
  ];

  // Regional disputes
  const regionalDisputes = [
    { id: 'DISP001', projectName: '跨境电商平台开发', initiator: 'ABC Corp', contractor: 'TechFreelancer', amount: 45000, status: 'preliminary', region: 'APAC' },
    { id: 'DISP002', projectName: '移动应用UI设计', initiator: 'StartupXYZ', contractor: 'DesignPro', amount: 12000, status: 'escalated', region: 'AMERS' },
    { id: 'DISP003', projectName: '数据分析系统', initiator: 'DataCorp', contractor: 'AnalystExpert', amount: 28000, status: 'preliminary', region: 'CHINA' },
  ];

  // Statistics calculation
  const totalUsers = regions.reduce((sum, r) => sum + r.activeUsers, 0);
  const totalProjects = regions.reduce((sum, r) => sum + r.activeProjects, 0);
  const totalRevenue = regions.reduce((sum, r) => sum + r.revenue, 0);
  const avgGrowth = regions.reduce((sum, r) => sum + r.growth, 0) / regions.length;

  const getRegionColor = (regionId: string) => {
    const colors: Record<string, string> = {
      'APAC': 'bg-blue-500',
      'EMEA': 'bg-purple-500',
      'AMERS': 'bg-green-500',
      'CHINA': 'bg-red-500',
    };
    return colors[regionId] || 'bg-gray-500';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'high': 'text-red-500 bg-red-100',
      'medium': 'text-yellow-600 bg-yellow-100',
      'low': 'text-green-600 bg-green-100',
    };
    return colors[priority] || 'text-gray-600 bg-gray-100';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'text-yellow-600 bg-yellow-100',
      'approved': 'text-green-600 bg-green-100',
      'escalated': 'text-red-600 bg-red-100',
      'preliminary': 'text-blue-600 bg-blue-100',
      'resolved': 'text-gray-600 bg-gray-100',
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-md border-b border-purple-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CodeUtopia.ai</h1>
                <p className="text-xs text-purple-300">Regional Manager Dashboard</p>
              </div>
            </div>

            {/* Region Selector */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-slate-700/50 rounded-lg px-4 py-2">
                <MapPin className="w-4 h-4 text-purple-400" />
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
                >
                  {regions.map(region => (
                    <option key={region.regionId} value={region.regionId} className="bg-slate-700">
                      {region.regionName} ({region.regionNameEn})
                    </option>
                  ))}
                </select>
              </div>

              {/* Search */}
              <div className="relative hidden lg:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索用户、项目、报告..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 bg-slate-700/50 border border-purple-500/30 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {pendingTasks.length}
                </span>
              </button>

              {/* AI Assistant Toggle */}
              <button
                onClick={() => setShowAIPanel(!showAIPanel)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  showAIPanel
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-slate-700/50 text-gray-300 hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">AI 助手</span>
              </button>

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium">
                  RM
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-white">区域主理人</p>
                  <p className="text-xs text-gray-400">全球运营中心</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-slate-800/50 rounded-xl p-1 mb-6 overflow-x-auto">
          {[
            { id: 'overview', label: '总览', icon: BarChart3 },
            { id: 'projects', label: '项目管理', icon: Briefcase },
            { id: 'users', label: '用户管理', icon: Users },
            { id: 'reports', label: '运营报告', icon: FileText },
            { id: 'disputes', label: '争议处理', icon: AlertTriangle },
            { id: 'ai_config', label: 'AI调度', icon: Settings },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-6 border border-purple-500/30">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    欢迎回来，区域主理人 👋
                  </h2>
                  <p className="text-gray-300 mb-4">
                    当前管理区域: <span className="text-purple-400 font-medium">{regions.find(r => r.regionId === selectedRegion)?.regionName}</span>
                    <span className="text-gray-500 ml-2">({regions.find(r => r.regionId === selectedRegion)?.countryCount} 个国家/地区)</span>
                  </p>
                  <div className="flex space-x-4">
                    <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      生成区域报告
                    </button>
                    <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      查看待办事项
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">{new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}</div>
                  <div className="text-gray-400 text-sm">{new Date().toLocaleDateString('zh-CN', { weekday: 'long' })}</div>
                </div>
              </div>
            </div>

            {/* Platform Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: '总活跃用户', value: totalUsers.toLocaleString(), change: '+12.5%', icon: Users, color: 'from-blue-500 to-cyan-500' },
                { label: '活跃项目', value: totalProjects.toLocaleString(), change: '+8.3%', icon: Briefcase, color: 'from-purple-500 to-pink-500' },
                { label: '区域收入', value: `$${(totalRevenue / 1000000).toFixed(1)}M`, change: '+15.2%', icon: DollarSign, color: 'from-green-500 to-emerald-500' },
                { label: '平均增长率', value: `${avgGrowth.toFixed(1)}%`, change: '+2.3%', icon: TrendingUp, color: 'from-orange-500 to-red-500' },
              ].map((stat, index) => (
                <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-purple-500/20 hover:border-purple-500/40 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-green-400 text-sm font-medium flex items-center">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      {stat.change}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Regional Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Regional Performance */}
              <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">区域运营数据</h3>
                  <button className="text-purple-400 hover:text-purple-300 text-sm flex items-center">
                    查看详情 <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
                <div className="space-y-4">
                  {regions.map(region => (
                    <div
                      key={region.regionId}
                      className={`p-4 rounded-lg transition-all cursor-pointer ${
                        selectedRegion === region.regionId
                          ? 'bg-purple-500/20 border border-purple-500/40'
                          : 'bg-slate-700/30 hover:bg-slate-700/50'
                      }`}
                      onClick={() => setSelectedRegion(region.regionId)}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${getRegionColor(region.regionId)}`} />
                          <div>
                            <div className="font-medium text-white">{region.regionName}</div>
                            <div className="text-xs text-gray-400">{region.regionNameEn}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-gray-400">{region.activeUsers.toLocaleString()} 用户</span>
                          <span className="text-gray-400">{region.activeProjects} 项目</span>
                          <span className={`flex items-center ${region.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {region.growth > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {Math.abs(region.growth)}%
                          </span>
                        </div>
                      </div>
                      {/* Progress Bar */}
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${getRegionColor(region.regionId)}`}
                          style={{ width: `${(region.revenue / 10000000) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Tasks */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">待办事项</h3>
                  <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full">
                    {pendingTasks.length} 待处理
                  </span>
                </div>
                <div className="space-y-3">
                  {pendingTasks.map(task => (
                    <div key={task.id} className="p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority === 'high' ? '紧急' : task.priority === 'medium' ? '中等' : '普通'}
                        </span>
                        <span className="text-xs text-gray-500">{task.time}</span>
                      </div>
                      <div className="text-white text-sm font-medium mb-1">{task.title}</div>
                      <div className="text-xs text-gray-400">区域: {task.region}</div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 text-sm text-purple-400 hover:text-purple-300 border border-dashed border-purple-500/30 rounded-lg hover:border-purple-500/50 transition-colors">
                  查看全部待办
                </button>
              </div>
            </div>

            {/* AI Operations & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Scheduling Requests */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">AI 调度请求</h3>
                  <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded-full">
                    {aiSchedulingRequests.filter(r => r.status === 'pending').length} 待批准
                  </span>
                </div>
                <div className="space-y-3">
                  {aiSchedulingRequests.slice(0, 3).map(request => (
                    <div key={request.id} className="p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <Settings className="w-4 h-4 text-purple-400" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{request.aiRole}</div>
                            <div className="text-xs text-gray-400">项目 #{request.projectId}</div>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(request.status)}`}>
                          {request.status === 'pending' ? '待批准' : request.status === 'approved' ? '已批准' : '已升级'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mb-2">{request.reason}</div>
                      {request.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button className="flex-1 py-1.5 bg-green-500/20 text-green-400 text-xs rounded-lg hover:bg-green-500/30 transition-colors">
                            批准
                          </button>
                          <button className="flex-1 py-1.5 bg-red-500/20 text-red-400 text-xs rounded-lg hover:bg-red-500/30 transition-colors">
                            拒绝
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-lg font-semibold text-white mb-6">快捷操作</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: FileText, label: '生成报告', color: 'bg-blue-500' },
                    { icon: Users, label: '用户审核', color: 'bg-green-500' },
                    { icon: Briefcase, label: '项目审查', color: 'bg-purple-500' },
                    { icon: AlertTriangle, label: '争议处理', color: 'bg-orange-500' },
                    { icon: Settings, label: 'AI配置', color: 'bg-pink-500' },
                    { icon: Calendar, label: '排程管理', color: 'bg-cyan-500' },
                  ].map((action, index) => (
                    <button
                      key={index}
                      className="p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all group text-left"
                    >
                      <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-sm font-medium text-white">{action.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">区域项目管理</h2>
              <div className="flex space-x-3">
                <select className="bg-slate-700/50 text-white rounded-lg px-4 py-2 text-sm border border-purple-500/30">
                  <option value="">所有区域</option>
                  {regions.map(r => (
                    <option key={r.regionId} value={r.regionId}>{r.regionName}</option>
                  ))}
                </select>
                <button className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors">
                  导出报告
                </button>
              </div>
            </div>

            {/* Project Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: '进行中', value: 156, color: 'bg-blue-500' },
                { label: '待审核', value: 23, color: 'bg-yellow-500' },
                { label: '已完成', value: 892, color: 'bg-green-500' },
                { label: '有问题', value: 8, color: 'bg-red-500' },
              ].map((stat, index) => (
                <div key={index} className="bg-slate-800/50 rounded-xl p-5 border border-purple-500/20">
                  <div className={`w-3 h-3 ${stat.color} rounded-full mb-3`} />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Project List */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 text-sm border-b border-slate-700">
                    <th className="pb-3 font-medium">项目名称</th>
                    <th className="pb-3 font-medium">发起方</th>
                    <th className="pb-3 font-medium">承接方</th>
                    <th className="pb-3 font-medium">区域</th>
                    <th className="pb-3 font-medium">进度</th>
                    <th className="pb-3 font-medium">状态</th>
                    <th className="pb-3 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody className="text-white text-sm">
                  {[
                    { name: '跨境电商平台开发', initiator: 'ABC Corp', contractor: 'TechFreelancer', region: 'APAC', progress: 75, status: '进行中' },
                    { name: '移动应用UI设计', initiator: 'StartupXYZ', contractor: 'DesignPro', region: 'AMERS', progress: 45, status: '进行中' },
                    { name: '数据分析系统', initiator: 'DataCorp', contractor: 'AnalystExpert', region: 'CHINA', progress: 90, status: '进行中' },
                    { name: 'AI聊天机器人', initiator: 'TechStart', contractor: 'DevMaster', region: 'EMEA', progress: 100, status: '已完成' },
                    { name: '区块链钱包', initiator: 'CryptoFin', contractor: 'BlockDev', region: 'APAC', progress: 30, status: '待审核' },
                  ].map((project, index) => (
                    <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="py-4 font-medium">{project.name}</td>
                      <td className="py-4 text-gray-400">{project.initiator}</td>
                      <td className="py-4 text-gray-400">{project.contractor}</td>
                      <td className="py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${getRegionColor(project.region)} text-white`}>
                          {project.region}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-24 h-2 bg-slate-700 rounded-full">
                            <div
                              className="h-full bg-purple-500 rounded-full"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <span className="text-gray-400">{project.progress}%</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          project.status === '已完成' ? 'bg-green-100 text-green-700' :
                          project.status === '待审核' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <button className="text-purple-400 hover:text-purple-300 text-xs">
                          查看详情
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">用户管理</h2>
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="搜索用户..."
                  className="bg-slate-700/50 text-white rounded-lg px-4 py-2 text-sm border border-purple-500/30 w-64"
                />
                <button className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors">
                  导出用户列表
                </button>
              </div>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { label: '项目主理人', value: 4523, icon: Briefcase },
                { label: '接案者', value: 12890, icon: Users },
                { label: '区域主理人', value: 156, icon: Globe },
                { label: '全局管理员', value: 23, icon: Settings },
                { label: 'AI 助手', value: 5, icon: Star },
              ].map((stat, index) => (
                <div key={index} className="bg-slate-800/50 rounded-xl p-5 border border-purple-500/20">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.value.toLocaleString()}</div>
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* User List */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 text-sm border-b border-slate-700">
                    <th className="pb-3 font-medium">用户</th>
                    <th className="pb-3 font-medium">角色</th>
                    <th className="pb-3 font-medium">区域</th>
                    <th className="pb-3 font-medium">注册时间</th>
                    <th className="pb-3 font-medium">活跃度</th>
                    <th className="pb-3 font-medium">状态</th>
                    <th className="pb-3 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody className="text-white text-sm">
                  {[
                    { name: '张明', role: '项目主理人', region: '大中华区', time: '2024-01-10', activity: 92, status: '活跃' },
                    { name: 'John Smith', role: '接案者', region: '美洲区', time: '2024-01-08', activity: 85, status: '活跃' },
                    { name: '李娜', role: '区域主理人', region: '亚太区', time: '2024-01-05', activity: 95, status: '活跃' },
                    { name: '王芳', role: '项目主理人', region: '大中华区', time: '2024-01-03', activity: 45, status: '不活跃' },
                    { name: 'Mike Johnson', role: '接案者', region: '欧洲中东非洲', time: '2024-01-01', activity: 78, status: '活跃' },
                  ].map((user, index) => (
                    <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {user.name.charAt(0)}
                          </div>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-gray-400">{user.role}</td>
                      <td className="py-4 text-gray-400">{user.region}</td>
                      <td className="py-4 text-gray-400">{user.time}</td>
                      <td className="py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-2 bg-slate-700 rounded-full">
                            <div
                              className={`h-full rounded-full ${user.activity > 70 ? 'bg-green-500' : 'bg-yellow-500'}`}
                              style={{ width: `${user.activity}%` }}
                            />
                          </div>
                          <span className="text-gray-400">{user.activity}%</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          user.status === '活跃' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <button className="text-purple-400 hover:text-purple-300 text-xs">
                          查看详情
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">运营报告</h2>
              <div className="flex space-x-3">
                <select className="bg-slate-700/50 text-white rounded-lg px-4 py-2 text-sm border border-purple-500/30">
                  <option value="monthly">月度报告</option>
                  <option value="quarterly">季度报告</option>
                  <option value="yearly">年度报告</option>
                </select>
                <button className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors">
                  生成报告
                </button>
              </div>
            </div>

            {/* Report Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: '2024年1月区域运营报告', region: '亚太区', date: '2024-01-15', status: '已生成' },
                { title: '2024年1月区域运营报告', region: '美洲区', date: '2024-01-15', status: '已生成' },
                { title: '2023年第四季度报告', region: '大中华区', date: '2024-01-01', status: '已生成' },
                { title: '2023年第四季度报告', region: '欧洲中东非洲', date: '2024-01-01', status: '已生成' },
                { title: '年度总结报告', region: '全球', date: '2023-12-31', status: '已生成' },
                { title: 'AI调度使用报告', region: '全球', date: '2023-12-31', status: '已生成' },
              ].map((report, index) => (
                <div key={index} className="bg-slate-800/50 rounded-xl p-5 border border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="text-xs text-gray-400">{report.date}</span>
                  </div>
                  <h3 className="font-medium text-white mb-2">{report.title}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">区域: {report.region}</span>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      {report.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disputes Tab */}
        {activeTab === 'disputes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">争议处理</h2>
              <div className="flex space-x-3">
                <select className="bg-slate-700/50 text-white rounded-lg px-4 py-2 text-sm border border-purple-500/30">
                  <option value="">所有状态</option>
                  <option value="preliminary">初步处理</option>
                  <option value="escalated">已升级</option>
                  <option value="resolved">已解决</option>
                </select>
              </div>
            </div>

            {/* Dispute Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: '待处理', value: 5, color: 'bg-yellow-500' },
                { label: '初步处理中', value: 12, color: 'bg-blue-500' },
                { label: '升级至全局', value: 3, color: 'bg-red-500' },
                { label: '已解决', value: 156, color: 'bg-green-500' },
              ].map((stat, index) => (
                <div key={index} className="bg-slate-800/50 rounded-xl p-5 border border-purple-500/20">
                  <div className={`w-3 h-3 ${stat.color} rounded-full mb-3`} />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Dispute List */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 text-sm border-b border-slate-700">
                    <th className="pb-3 font-medium">争议ID</th>
                    <th className="pb-3 font-medium">项目名称</th>
                    <th className="pb-3 font-medium">涉及方</th>
                    <th className="pb-3 font-medium">金额</th>
                    <th className="pb-3 font-medium">区域</th>
                    <th className="pb-3 font-medium">状态</th>
                    <th className="pb-3 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody className="text-white text-sm">
                  {regionalDisputes.map((dispute) => (
                    <tr key={dispute.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="py-4 font-medium">{dispute.id}</td>
                      <td className="py-4 text-gray-400">{dispute.projectName}</td>
                      <td className="py-4 text-gray-400">
                        <div className="text-xs">
                          <div>发起方: {dispute.initiator}</div>
                          <div>承接方: {dispute.contractor}</div>
                        </div>
                      </td>
                      <td className="py-4 text-gray-400">${dispute.amount.toLocaleString()}</td>
                      <td className="py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${getRegionColor(dispute.region)} text-white`}>
                          {dispute.region}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(dispute.status)}`}>
                          {dispute.status === 'preliminary' ? '初步处理' : dispute.status === 'escalated' ? '已升级' : '已解决'}
                        </span>
                      </td>
                      <td className="py-4">
                        <button className="text-purple-400 hover:text-purple-300 text-xs">
                          处理争议
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* AI Config Tab */}
        {activeTab === 'ai_config' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">AI 调度配置</h2>
              <button className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors">
                添加调度规则
              </button>
            </div>

            {/* AI Role Usage Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { role: 'Product Manager AI', usage: 2345, rate: '78%' },
                { role: 'UX Designer AI', usage: 1876, rate: '82%' },
                { role: 'Frontend Engineer AI', usage: 3456, rate: '91%' },
                { role: 'Backend Engineer AI', usage: 2234, rate: '85%' },
                { role: 'QA Engineer AI', usage: 1567, rate: '74%' },
              ].map((stat, index) => (
                <div key={index} className="bg-slate-800/50 rounded-xl p-5 border border-purple-500/20">
                  <div className="text-sm font-medium text-white mb-3">{stat.role}</div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-2xl font-bold text-white">{stat.usage.toLocaleString()}</div>
                      <div className="text-gray-400 text-xs">使用次数</div>
                    </div>
                    <div className="text-green-400 text-sm">{stat.rate} 满意度</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Scheduling Rules */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-lg font-semibold text-white mb-6">调度规则配置</h3>
              <div className="space-y-4">
                {[
                  { name: '默认AI调度策略', description: '根据项目类型自动分配最适合的AI角色', status: 'active' },
                  { name: '高峰时段调度', description: '在用户活跃高峰期限制AI响应频率', status: 'active' },
                  { name: '新项目优先', description: '新项目可获得额外的AI辅助时间', status: 'active' },
                  { name: '复杂项目增强', description: '里程碑数超过5个时自动启用多AI协同', status: 'inactive' },
                ].map((rule, index) => (
                  <div key={index} className="p-4 bg-slate-700/30 rounded-lg flex justify-between items-center">
                    <div>
                      <div className="font-medium text-white mb-1">{rule.name}</div>
                      <div className="text-sm text-gray-400">{rule.description}</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        rule.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {rule.status === 'active' ? '启用' : '禁用'}
                      </span>
                      <button className="text-gray-400 hover:text-white">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* AI Assistant Panel */}
      {showAIPanel && (
        <AIAssistantPanel
          currentRole="regional_manager"
          onTaskComplete={(role, result) => {
            console.log('AI task completed:', role, result);
          }}
        />
      )}
    </div>
  );
};

export default RegionalManagerDashboard;
