import { useAuth } from '../contexts/AuthContext';
import { mockProjects, mockTransactions, statusLabels, categoryLabels } from '../data/mockData';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Activity,
} from 'lucide-react';

export function ClientDashboard() {
  const { user } = useAuth();

  const stats = {
    totalProjects: mockProjects.length,
    activeProjects: mockProjects.filter((p) => p.status === 'in_progress').length,
    totalSpent: 320000,
    completionRate: 92,
  };

  const recentProjects = mockProjects.slice(0, 3);
  const recentTransactions = mockTransactions.slice(0, 4);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: 'bg-blue-100 text-blue-700',
      in_progress: 'bg-yellow-100 text-yellow-700',
      review: 'bg-purple-100 text-purple-700',
      completed: 'bg-green-100 text-green-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">歡迎回來，{user?.name}！</h1>
            <p className="text-purple-100">
              您的{stats.activeProjects}個項目正在進行中，總預算已托管 NT${(stats.totalSpent / 10000).toFixed(0)},000
            </p>
          </div>
          <div className="bg-white/20 p-3 rounded-xl">
            <Sparkles className="w-8 h-8" />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-purple-200" />
              <span className="text-purple-200 text-sm">項目總數</span>
            </div>
            <p className="text-2xl font-bold mt-1">{stats.totalProjects}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-yellow-200" />
              <span className="text-purple-200 text-sm">進行中</span>
            </div>
            <p className="text-2xl font-bold mt-1">{stats.activeProjects}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-200" />
              <span className="text-purple-200 text-sm">總投入</span>
            </div>
            <p className="text-2xl font-bold mt-1">NT${(stats.totalSpent / 10000).toFixed(0)}K</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-200" />
              <span className="text-purple-200 text-sm">完成率</span>
            </div>
            <p className="text-2xl font-bold mt-1">{stats.completionRate}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">最近的項目</h2>
            <Link
              to="/projects"
              className="flex items-center space-x-1 text-sm text-purple-600 hover:text-purple-700"
            >
              <span>查看全部</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentProjects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="block p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{project.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {categoryLabels[project.category]}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      project.status
                    )}`}
                  >
                    {statusLabels[project.status]?.text}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      預算: NT$ {(project.budget.min / 1000).toFixed(0)}K - NT$
                      {(project.budget.max / 1000).toFixed(0)}K
                    </span>
                    <span className="text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{project.duration}</span>
                      </span>
                    </span>
                  </div>
                  <span className="text-sm text-purple-600 font-medium">
                    {project.bids.length} 個投標
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>進度</span>
                    <span>
                      {project.milestones.filter((m) => m.status === 'approved').length}/
                      {project.milestones.length} 里程碑
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${
                          (project.milestones.filter((m) => m.status === 'approved').length /
                            project.milestones.length) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* AI Insights */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">AI 洞察</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">項目效率提升</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    AI分析顯示您的項目平均提前2天完成
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">推薦人才</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    有3位符合您項目需求的優質開發者
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">成本優化建議</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    使用AI代碼審查可節省約15%測試成本
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">最近交易</h3>
              <Link
                to="/transactions"
                className="text-sm text-purple-600 hover:text-purple-700"
              >
                查看全部
              </Link>
            </div>
            <div className="space-y-3">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        tx.type === 'income'
                          ? 'bg-green-100 text-green-600'
                          : tx.type === 'withdrawal'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {tx.type === 'income' ? (
                        <DollarSign className="w-4 h-4" />
                      ) : (
                        <ArrowRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {tx.description}
                      </p>
                      <p className="text-xs text-gray-500">{tx.projectTitle}</p>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      tx.type === 'income' ? 'text-green-600' : 'text-gray-900'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'} NT$
                    {(tx.amount / 1000).toFixed(0)}K
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">快速操作</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/projects/new"
                className="flex flex-col items-center p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors"
              >
                <Briefcase className="w-6 h-6 text-purple-600 mb-2" />
                <span className="text-sm font-medium text-purple-700">發布項目</span>
              </Link>
              <Link
                to="/talent"
                className="flex flex-col items-center p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <Users className="w-6 h-6 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-blue-700">尋找人才</span>
              </Link>
              <Link
                to="/messages"
                className="flex flex-col items-center p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors"
              >
                <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                <span className="text-sm font-medium text-green-700">驗收任務</span>
              </Link>
              <Link
                to="/reports"
                className="flex flex-col items-center p-4 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors"
              >
                <AlertCircle className="w-6 h-6 text-orange-600 mb-2" />
                <span className="text-sm font-medium text-orange-700">查看報告</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
