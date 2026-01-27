import { useState } from 'react';
import {
  Users,
  Briefcase,
  DollarSign,
  Star,
  TrendingUp,
  TrendingDown,
  Activity,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  ArrowUpRight,
  Shield,
  Settings,
  Bell,
} from 'lucide-react';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = {
    totalUsers: 1250,
    totalProjects: 328,
    totalRevenue: 2450000,
    avgRating: 4.7,
    userGrowth: 12.5,
    projectGrowth: 8.3,
    revenueGrowth: 15.2,
    disputeRate: 2.1,
  };

  const recentActivities = [
    {
      id: 1,
      type: 'user_register',
      message: '新開發者註冊：王小明',
      time: '5分鐘前',
      status: 'pending',
    },
    {
      id: 2,
      type: 'project_created',
      message: '新項目發布：電商平台前端重構',
      time: '15分鐘前',
      status: 'success',
    },
    {
      id: 3,
      type: 'milestone_completed',
      message: '里程碑已完成：智能客服系統 - 第一階段',
      time: '1小時前',
      status: 'success',
    },
    {
      id: 4,
      type: 'dispute',
      message: '收到 dispute 投訴：項目 #PRJ-2024-089',
      time: '2小時前',
      status: 'warning',
    },
    {
      id: 5,
      type: 'payment',
      message: '完成支付：NT$ 30,000 發放至開發者',
      time: '3小時前',
      status: 'success',
    },
  ];

  const topDevelopers = [
    { name: '王小明', projects: 45, rating: 4.9, earnings: 125000 },
    { name: '李美華', projects: 32, rating: 4.8, earnings: 98000 },
    { name: '陳志強', projects: 28, rating: 4.7, earnings: 115000 },
    { name: '林雅婷', projects: 19, rating: 4.6, earnings: 76000 },
  ];

  const tabs = [
    { id: 'overview', label: '概覽' },
    { id: 'users', label: '用戶管理' },
    { id: 'projects', label: '項目管理' },
    { id: 'finance', label: '財務' },
    { id: 'disputes', label: '糾紛' },
    { id: 'settings', label: '設置' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">管理後台</h1>
          <p className="text-gray-500 mt-1">平台運營數據和系統管理</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="flex items-center text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              {stats.userGrowth}%
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-4">
            {(stats.totalUsers / 1000).toFixed(1)}K
          </p>
          <p className="text-sm text-gray-500 mt-1">註冊用戶</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-purple-600" />
            </div>
            <span className="flex items-center text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              {stats.projectGrowth}%
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-4">{stats.totalProjects}</p>
          <p className="text-sm text-gray-500 mt-1">項目總數</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <span className="flex items-center text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              {stats.revenueGrowth}%
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-4">
            NT$ {(stats.totalRevenue / 10000).toFixed(0)}K
          </p>
          <p className="text-sm text-gray-500 mt-1">總收入</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-4">{stats.avgRating}</p>
          <p className="text-sm text-gray-500 mt-1">平均評分</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart Area */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">收入趨勢</h2>
              <div className="flex items-center space-x-2">
                <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm">
                  <option>最近7天</option>
                  <option>最近30天</option>
                  <option>最近90天</option>
                </select>
              </div>
            </div>

            {/* Chart Placeholder */}
            <div className="h-64 flex items-end justify-between space-x-2">
              {[65, 45, 78, 52, 89, 72, 95].map((height, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center space-y-2">
                  <div
                    className="w-full bg-gradient-to-t from-purple-600 to-blue-500 rounded-t-lg transition-all hover:from-purple-700 hover:to-blue-600"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-gray-500">
                    {['一', '二', '三', '四', '五', '六', '日'][idx]}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                <span className="text-sm text-gray-600">本月收入</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">上月收入</span>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">最近活動</h2>
              <button className="text-sm text-purple-600 hover:text-purple-700">
                查看全部
              </button>
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      activity.status === 'success'
                        ? 'bg-green-100 text-green-600'
                        : activity.status === 'warning'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {activity.status === 'success' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : activity.status === 'warning' ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Top Developers Section */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">TOP 開發者</h2>
            <button className="text-sm text-purple-600 hover:text-purple-700">
              查看排行
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">排名</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">開發者</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">完成項目</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">評分</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">總收益</th>
                </tr>
              </thead>
              <tbody>
                {topDevelopers.map((dev, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          idx === 0
                            ? 'bg-yellow-100 text-yellow-700'
                            : idx === 1
                            ? 'bg-gray-100 text-gray-600'
                            : idx === 2
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-gray-50 text-gray-500'
                        }`}
                      >
                        {idx + 1}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {dev.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900">{dev.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{dev.projects}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-gray-600">{dev.rating}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-gray-900">
                      NT$ {(dev.earnings / 1000).toFixed(0)}K
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Platform Health */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">平台健康度</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">98.5%</p>
            <p className="text-sm text-gray-600 mt-1">系統正常運行</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">安全評分</h3>
            </div>
            <p className="text-3xl font-bold text-purple-600">A+</p>
            <p className="text-sm text-gray-600 mt-1">無重大安全事件</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900">用戶滿意度</h3>
            </div>
            <p className="text-3xl font-bold text-yellow-600">92%</p>
            <p className="text-sm text-gray-600 mt-1">正面反饋比例</p>
          </div>
        </div>
      )}

      {/* Users Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">用戶管理</h2>
            <div className="flex items-center space-x-3">
              <input
                type="text"
                placeholder="搜索用戶..."
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                導出
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">用戶</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">角色</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">註冊時間</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">狀態</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: '張偉明', role: '客戶', time: '2024-03-15', status: 'active' },
                  { name: '王小明', role: '開發者', time: '2023-01-10', status: 'active' },
                  { name: '李美華', role: '開發者', time: '2023-03-22', status: 'active' },
                ].map((user, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                          {user.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{user.role}</td>
                    <td className="py-3 px-4 text-gray-600">{user.time}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-sm text-purple-600 hover:text-purple-700">查看</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Projects Management */}
      {activeTab === 'projects' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">項目管理</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: '電商平台前端重構', status: 'open', budget: '80K-150K', bids: 5 },
              { title: '智能客服對話系統', status: 'in_progress', budget: '200K-350K', bids: 3 },
              { title: '健康管理App UI設計', status: 'open', budget: '50K-80K', bids: 8 },
            ].map((project, idx) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-xl hover:border-purple-200 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{project.title}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'open'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {project.status === 'open' ? '招募中' : '進行中'}
                  </span>
                </div>
                <p className="text-sm text-gray-500">預算: NT$ {project.budget}</p>
                <p className="text-sm text-gray-500">投標數: {project.bids}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Finance Section */}
      {activeTab === 'finance' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">財務概覽</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500">本月收入</p>
              <p className="text-2xl font-bold text-gray-900">NT$ 245K</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500">本月支出</p>
              <p className="text-2xl font-bold text-gray-900">NT$ 198K</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500">平台收益</p>
              <p className="text-2xl font-bold text-purple-600">NT$ 36.75K</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500">待結算</p>
              <p className="text-2xl font-bold text-yellow-600">NT$ 28.5K</p>
            </div>
          </div>
        </div>
      )}

      {/* Disputes Section */}
      {activeTab === 'disputes' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">糾紛管理</h2>
          <div className="space-y-4">
            {[
              { project: 'PRJ-2024-089', issue: '交付質量爭議', status: 'pending', date: '2026-01-20' },
              { project: 'PRJ-2024-085', issue: '付款延遲', status: 'resolved', date: '2026-01-18' },
            ].map((dispute, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">{dispute.project}</p>
                  <p className="text-sm text-gray-500">{dispute.issue}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">{dispute.date}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      dispute.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {dispute.status === 'pending' ? '待處理' : '已解決'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Section */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">系統設置</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">平台服務費比例</p>
                <p className="text-sm text-gray-500">當前設置: 15%</p>
              </div>
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                修改
              </button>
            </div>
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">AI 服務成本比例</p>
                <p className="text-sm text-gray-500">當前設置: 20%</p>
              </div>
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                修改
              </button>
            </div>
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">新用戶驗證</p>
                <p className="text-sm text-gray-500">開啟郵件驗證</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
