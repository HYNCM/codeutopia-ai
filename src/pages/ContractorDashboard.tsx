import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  MessageSquare,
  Users,
  Zap,
  CheckCircle,
  Clock,
  DollarSign,
  Brain,
  Github,
  Slack,
  CreditCard,
  Cloud,
  Smartphone,
  Monitor,
  Cpu,
  Play,
  Send,
  Settings,
  Bell,
  ChevronRight,
  ArrowRight,
  BarChart3,
  AlertCircle,
  Globe,
  Calendar,
  TrendingUp,
  Target,
  Filter,
  Star,
  Award,
  MapPin,
  Wifi,
  Edit,
  ExternalLink,
  RefreshCw,
  Terminal,
  Database,
  Server,
  Container,
  TestTube,
  Box,
} from 'lucide-react';

// 模擬數據
const CONTRACTOR_STATS = {
  activeProjects: 3,
  completedTasks: 47,
  pendingMilestones: 2,
  totalEarnings: 158000,
  rating: 4.8,
};

const TEAM_MEMBERS = [
  { id: 'pm', name: 'PM', role: '產品經理', status: 'online', avatar: 'PM' },
  { id: 'ux', name: 'UX', role: '設計師', status: 'online', avatar: 'UX' },
  { id: 'fe', name: 'FE', role: '前端工程師', status: 'online', avatar: 'FE' },
  { id: 'be', name: 'BE', role: '後端工程師', status: 'online', avatar: 'BE' },
  { id: 'qa', name: 'QA', role: '測試工程師', status: 'online', avatar: 'QA' },
];

const CHANNELS = [
  { id: 'general', name: '# general', unread: false },
  { id: 'development', name: '# development', unread: true },
  { id: 'testing', name: '# testing', unread: false },
  { id: 'deployments', name: '# deployments', unread: false },
];

const TOOLS = [
  { icon: Slack, name: 'Slack', status: 'connected', color: 'text-purple-500' },
  { icon: Github, name: 'GitHub', status: 'synced', color: 'text-gray-800' },
  { icon: CreditCard, name: 'Stripe', status: 'configured', color: 'text-blue-600' },
  { icon: Cloud, name: 'AWS', status: 'ready', color: 'text-orange-500' },
];

const TASKS = [
  {
    id: 1,
    title: '用戶登入 API',
    description: 'JWT 認證、OAuth2 整合、密碼加密',
    status: 'completed',
    assignee: 'AI',
    progress: 100,
  },
  {
    id: 2,
    title: '資料庫 Schema',
    description: '用戶、訂單、產品資料表設計',
    status: 'completed',
    assignee: 'AI',
    progress: 100,
  },
  {
    id: 3,
    title: '前端儀表板',
    description: 'React 儀表板組件與響應式設計',
    status: 'review',
    assignee: 'AI',
    progress: 100,
  },
  {
    id: 4,
    title: 'API 單元測試',
    description: 'Jest 測試框架、覆蓋率 85%+',
    status: 'testing',
    assignee: 'AI',
    progress: 75,
  },
  {
    id: 5,
    title: '部署配置',
    description: 'Docker、K8s、CI/CD 流水線',
    status: 'pending',
    assignee: 'AI',
    progress: 20,
  },
];

const DEPLOYMENT_PIPELINE = [
  { stage: 'Research', icon: BarChart3, status: 'completed', label: 'AI 完成市場分析' },
  { stage: 'Design', icon: Sparkles, status: 'completed', label: 'UI/UX 設計稿' },
  { stage: 'Development', icon: Code2, status: 'in_progress', label: '代碼生成中' },
  { stage: 'Testing', icon: TestTube, status: 'pending', label: '自動化測試' },
  { stage: 'Deploy', icon: Rocket, status: 'pending', label: '真機部署' },
];

// 開發模式選項
const DEV_MODES = [
  { id: 'cloud', name: '全雲端', icon: Cloud, description: '☁️ 雲側開發測試驗證' },
  { id: 'local', name: '本地優先', icon: Monitor, description: '🖥️ 端側開發測試驗證' },
  { id: 'hybrid', name: '完整部署', icon: Smartphone, description: '📱 端側 + 真機部署測試' },
];

interface ContractorDashboardProps {
  currentRole?: string;
}

export default function ContractorDashboard({ currentRole }: ContractorDashboardProps = {}) {
  const [activeTab, setActiveTab] = useState<'workbench' | 'projects' | 'earnings'>('workbench');
  const [selectedChannel, setSelectedChannel] = useState('development');
  const [selectedDevMode, setSelectedDevMode] = useState('cloud');
  const [showAIChat, setShowAIChat] = useState(true);

  // 計算總體進度
  const totalProgress = Math.round(
    TASKS.reduce((acc, task) => acc + task.progress, 0) / TASKS.length
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* 頂部導航欄 */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                CodeUtopia.ai
              </span>
              <span className="ml-3 px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs font-medium border border-green-500/30">
                接案者
              </span>
            </div>

            {/* 多幣種顯示 */}
            <div className="hidden lg:flex items-center space-x-4 text-sm">
              {[
                { pair: 'USD/CNY', rate: '7.24', change: '+0.12%' },
                { pair: 'USD/TWD', rate: '31.20', change: '+0.05%' },
                { pair: 'USD/HKD', rate: '7.82', change: '-0.02%' },
                { pair: 'USD/EUR', rate: '0.92', change: '+0.08%' },
              ].map((currency) => (
                <div key={currency.pair} className="flex items-center space-x-2 px-3 py-1 bg-gray-700/50 rounded-lg">
                  <span className="text-gray-400">{currency.pair}</span>
                  <span className="font-medium">{currency.rate}</span>
                  <span className="text-green-400 text-xs">{currency.change}</span>
                </div>
              ))}
            </div>

            {/* 右側功能 */}
            <div className="flex items-center space-x-4">
              {/* AI 助手開關 */}
              <button
                onClick={() => setShowAIChat(!showAIChat)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  showAIChat
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Brain className="w-4 h-4" />
                <span>AI 助手</span>
              </button>

              {/* 消息通知 */}
              <button className="relative p-2 text-gray-400 hover:bg-gray-700 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* 個人中心 */}
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium text-white">王建國</div>
                  <div className="text-xs text-gray-400">資深全棧工程師</div>
                </div>
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Wang"
                  alt="用戶頭像"
                  className="w-10 h-10 rounded-full border-2 border-gray-600"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* 左側邊欄 - 頻道 */}
        <aside className="w-64 bg-gray-800/30 border-r border-gray-700 min-h-[calc(100vh-4rem)] hidden md:block">
          <div className="p-4">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              專案頻道
            </div>
            <div className="space-y-1">
              {CHANNELS.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedChannel === channel.id
                      ? 'bg-purple-600/20 text-purple-400'
                      : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>{channel.name}</span>
                  </span>
                  {channel.unread && (
                    <span className="w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* 虛擬團隊 */}
            <div className="mt-8">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                團隊成員
              </div>
              <div className="space-y-2">
                {TEAM_MEMBERS.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-700/30"
                  >
                    <div className="relative">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-xs font-bold">
                        {member.avatar}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-gray-800 rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{member.name}</div>
                      <div className="text-xs text-gray-400 truncate">{member.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 工具整合 */}
            <div className="mt-8">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                整合服務
              </div>
              <div className="grid grid-cols-2 gap-2">
                {TOOLS.map((tool) => (
                  <div
                    key={tool.name}
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-700/30 rounded-lg"
                  >
                    <tool.icon className={`w-5 h-5 ${tool.color}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white truncate">{tool.name}</div>
                      <div className="text-xs text-green-400 capitalize">{tool.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 開發模式 */}
            <div className="mt-8">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                開發模式
              </div>
              <div className="space-y-2">
                {DEV_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedDevMode(mode.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedDevMode === mode.id
                        ? 'bg-purple-600/20 border border-purple-500/30'
                        : 'bg-gray-700/30 hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <mode.icon className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-medium text-white">{mode.name}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1 ml-6">{mode.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* 主內容區域 */}
        <main className="flex-1 p-6">
          {/* 項目統計 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: '進行中項目', value: CONTRACTOR_STATS.activeProjects, icon: BarChart3, color: 'blue' },
              { label: '已完成任務', value: CONTRACTOR_STATS.completedTasks, icon: CheckCircle, color: 'green' },
              { label: '待驗收里程碑', value: CONTRACTOR_STATS.pendingMilestones, icon: Target, color: 'amber' },
              { label: '總收益', value: `$${(CONTRACTOR_STATS.totalEarnings / 1000).toFixed(0)}K`, icon: DollarSign, color: 'purple' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">{stat.label}</span>
                  <div className={`w-8 h-8 bg-${stat.color}-500/20 rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`w-4 h-4 text-${stat.color}-400`} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* 左側主內容 - AI 助手對話 */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              {/* AI 助手對話區 */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">CodeUtopia AI</h2>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-green-400">線上 - 準備就緒</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center space-x-2">
                      <Play className="w-4 h-4" />
                      <span>發布任務</span>
                    </button>
                    <button className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg text-sm hover:bg-gray-700 transition-colors flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>審核任務</span>
                    </button>
                  </div>
                </div>

                {/* AI 消息 */}
                <div className="p-6 space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 bg-gray-700/50 rounded-2xl p-4">
                      <p className="text-white mb-4">
                        👋 您好！我是 CodeUtopia AI 助手。基於您的需求，我已自動完成以下工作：
                      </p>
                      <div className="space-y-2">
                        {[
                          { text: '需求分析 - 已解析用戶故事並生成任務清單', done: true },
                          { text: '架構設計 - 已產生系統架構圖與 API 設計', done: true },
                          { text: '代碼生成 - 已生成 React 前端與 Node.js 後端框架', done: true },
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            {item.done ? (
                              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                            ) : (
                              <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                            )}
                            <span className="text-gray-300">{item.text}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-600">
                        <p className="text-amber-400 text-sm font-medium mb-2">💡 建議您審核以下重點：</p>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                          <span>• 用戶認證系統 (OAuth2 + JWT)</span>
                          <span>• RESTful API 設計</span>
                          <span>• 資料庫 Schema 設計</span>
                          <span>• 自動化測試用例</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 快捷操作 */}
                  <div className="flex flex-wrap gap-3 ml-14">
                    {[
                      { icon: BarChart3, label: '查看任務清單', color: 'blue' },
                      { icon: Code2, label: '審核代碼', color: 'purple' },
                      { icon: TestTube, label: '執行測試', color: 'green' },
                      { icon: Rocket, label: '部署預覽', color: 'orange' },
                    ].map((action, idx) => (
                      <button
                        key={idx}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors"
                      >
                        <action.icon className={`w-4 h-4 text-${action.color}-400`} />
                        <span>{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 任務進度 */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">任務進度</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">AI 完成</span>
                    <span className="text-2xl font-bold text-white">{totalProgress}%</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {TASKS.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 bg-gray-700/30 rounded-xl border border-gray-700"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          {task.status === 'completed' ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : task.status === 'review' ? (
                            <AlertCircle className="w-5 h-5 text-amber-400" />
                          ) : task.status === 'testing' ? (
                            <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Clock className="w-5 h-5 text-gray-400" />
                          )}
                          <div>
                            <h4 className="font-medium text-white">{task.title}</h4>
                            <p className="text-sm text-gray-400">{task.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            task.assignee === 'AI'
                              ? 'bg-purple-500/20 text-purple-400'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {task.assignee === 'AI' ? '🤖 AI' : '👤 您'}
                          </span>
                          <span className={`text-sm font-medium ${
                            task.status === 'completed' ? 'text-green-400' :
                            task.status === 'review' ? 'text-amber-400' :
                            task.status === 'testing' ? 'text-blue-400' : 'text-gray-400'
                          }`}>
                            {task.status === 'completed' ? '已完成 100%' :
                             task.status === 'review' ? '待您確認' :
                             task.status === 'testing' ? '測試中' : '排程中'}
                          </span>
                        </div>
                      </div>
                      {/* 進度條 */}
                      <div className="ml-8">
                        <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              task.status === 'completed' ? 'bg-green-500' :
                              task.status === 'review' ? 'bg-amber-500' :
                              task.status === 'testing' ? 'bg-blue-500' : 'bg-gray-500'
                            }`}
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 右側側邊欄 */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {/* 部署流水線 */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">🚀 部署流水線</h3>
                <div className="space-y-3">
                  {DEPLOYMENT_PIPELINE.map((stage, idx) => (
                    <div key={stage.stage} className="flex items-center">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        stage.status === 'completed' ? 'bg-green-500/20' :
                        stage.status === 'in_progress' ? 'bg-blue-500/20' : 'bg-gray-700/50'
                      }`}>
                        {stage.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : stage.status === 'in_progress' ? (
                          <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <stage.icon className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1 ml-3">
                        <div className="text-sm font-medium text-white">{stage.stage}</div>
                        <div className="text-xs text-gray-400">{stage.label}</div>
                      </div>
                      {idx < DEPLOYMENT_PIPELINE.length - 1 && (
                        <div className={`w-0.5 h-8 ml-4 ${
                          stage.status === 'completed' ? 'bg-green-500' : 'bg-gray-700'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>

                {/* 總體進度 */}
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">完成進度</span>
                    <span className="font-semibold text-white">{totalProgress}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                      style={{ width: `${totalProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>{TASKS.filter(t => t.status === 'completed').length} 完成</span>
                    <span>{TASKS.length} 總任務</span>
                  </div>
                </div>
              </div>

              {/* 項目統計卡片 */}
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6">
                <h3 className="font-semibold mb-4 text-white">當前項目進度</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-200">Research</span>
                    <span className="text-white">✓</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-200">Design</span>
                    <span className="text-white">✓</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-200">Development</span>
                    <span className="text-white flex items-center">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse mr-2" />
                      ●
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-200">Testing</span>
                    <span className="text-white">○</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-200">Deploy</span>
                    <span className="text-white">○</span>
                  </div>
                </div>
              </div>

              {/* 開發環境狀態 */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">💻 開發環境</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Terminal className="w-5 h-5 text-green-400" />
                      <span className="text-sm text-white">雲端 IDE</span>
                    </div>
                    <span className="text-xs text-green-400">運行中</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Database className="w-5 h-5 text-blue-400" />
                      <span className="text-sm text-white">測試資料庫</span>
                    </div>
                    <span className="text-xs text-green-400">已連接</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Container className="w-5 h-5 text-purple-400" />
                      <span className="text-sm text-white">Docker 容器</span>
                    </div>
                    <span className="text-xs text-amber-400">構建中</span>
                  </div>
                </div>
              </div>

              {/* 三層架構 */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">🧠 三層智能架構</h3>
                <div className="space-y-4">
                  {/* Brain Layer */}
                  <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Brain className="w-5 h-5 text-purple-400" />
                        <span className="text-sm font-medium text-purple-400">Brain Layer</span>
                      </div>
                      <span className="text-xs text-green-400 flex items-center space-x-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span>已驗證</span>
                      </span>
                    </div>
                    <div className="text-xs text-gray-300 mb-2">智能規劃與決策層 - 6大AI智能體</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <span>📋</span>
                        <span>產品經理智能體</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <span>🏗️</span>
                        <span>架構師智能體</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <span>👨‍💼</span>
                        <span>團隊主管智能體</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <span>🎯</span>
                        <span>QA主管智能體</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <span>💻</span>
                        <span>前端工程師智能體</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <span>⚙️</span>
                        <span>後端工程師智能體</span>
                      </div>
                    </div>
                  </div>

                  {/* Hands Layer */}
                  <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Monitor className="w-5 h-5 text-blue-400" />
                        <span className="text-sm font-medium text-blue-400">Hands Layer</span>
                      </div>
                      <span className="text-xs text-green-400 flex items-center space-x-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span>已驗證</span>
                      </span>
                    </div>
                    <div className="text-xs text-gray-300 mb-2">智能執行層 - 三種開發模式</div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex flex-col items-center text-xs text-gray-400">
                        <Cloud className="w-4 h-4 mb-1" />
                        <span>純雲開發</span>
                      </div>
                      <div className="flex flex-col items-center text-xs text-gray-400">
                        <RefreshCw className="w-4 h-4 mb-1" />
                        <span>混合開發</span>
                      </div>
                      <div className="flex flex-col items-center text-xs text-gray-400">
                        <Smartphone className="w-4 h-4 mb-1" />
                        <span>真機開發</span>
                      </div>
                    </div>
                  </div>

                  {/* Eyes Layer */}
                  <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-sm font-medium text-green-400">Eyes Layer</span>
                      </div>
                      <span className="text-xs text-green-400 flex items-center space-x-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span>已驗證</span>
                      </span>
                    </div>
                    <div className="text-xs text-gray-300 mb-2">智能驗證與優化層</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <span>📊</span>
                        <span>代碼質量驗證</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <span>🧪</span>
                        <span>功能測試驗證</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <span>📱</span>
                        <span>兼容性驗證</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <span>⚡</span>
                        <span>智能優化</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 快捷操作 */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">⚡ 快捷操作</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Code2, label: '打開 IDE', action: () => {} },
                    { icon: Terminal, label: '終端', action: () => {} },
                    { icon: Database, label: '資料庫', action: () => {} },
                    { icon: Cloud, label: '雲端資源', action: () => {} },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      className="p-3 bg-gray-700/30 hover:bg-gray-700 rounded-xl transition-colors text-center"
                    >
                      <item.icon className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                      <span className="text-sm text-gray-300">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Rocket(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
    </svg>
  );
}

function Code2(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m18 16 4-4-4-4"></path>
      <path d="m6 8-4 4 4 4"></path>
      <line x1="2" y1="2" x2="22" y2="22"></line>
    </svg>
  );
}
