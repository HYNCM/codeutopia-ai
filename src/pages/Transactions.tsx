import { useState } from 'react';
import { mockPayments, mockTransactions, mockProjects } from '../data/mockData';
import {
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Wallet,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Filter,
  Calendar,
  Sparkles,
} from 'lucide-react';

export function TransactionsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'income' | 'withdrawal'>('all');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');

  const totalIncome = mockTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawal = mockTransactions
    .filter((t) => t.type === 'withdrawal')
    .reduce((sum, t) => sum + t.amount, 0);
  const pendingPayments = mockPayments.filter((p) => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  const filteredTransactions = mockTransactions.filter((t) => {
    if (activeTab === 'income' && t.type !== 'income') return false;
    if (activeTab === 'withdrawal' && t.type !== 'withdrawal') return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">財務中心</h1>
          <p className="text-gray-500 mt-1">管理您的收入、支出和提現</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          <Wallet className="w-5 h-5" />
          <span>申請提現</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <ArrowDownLeft className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
              +12.5%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-4">
            NT$ {(totalIncome / 1000).toFixed(0)}K
          </p>
          <p className="text-sm text-gray-500 mt-1">本月收入</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
              -8.2%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-4">
            NT$ {(totalWithdrawal / 1000).toFixed(0)}K
          </p>
          <p className="text-sm text-gray-500 mt-1">本月支出</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-4">
            NT$ {(pendingPayments / 1000).toFixed(0)}K
          </p>
          <p className="text-sm text-gray-500 mt-1">待收款</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-4">NT$ 45,000</p>
          <p className="text-sm text-gray-500 mt-1">可用餘額</p>
        </div>
      </div>

      {/* Stripe Integration Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Stripe 支付系統</h3>
              <p className="text-purple-100 text-sm mt-0.5">
                安全便捷的全球支付服務，支持多種貨幣和支付方式
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>已認證</span>
            </div>
            <button className="px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors">
              帳戶設置
            </button>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl border border-gray-200">
        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex space-x-8">
            {[
              { id: 'all', label: '全部' },
              { id: 'income', label: '收入' },
              { id: 'withdrawal', label: '提現' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`py-4 border-b-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="week">最近一週</option>
              <option value="month">最近一月</option>
              <option value="quarter">最近一季</option>
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              <span>更多篩選</span>
            </button>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-purple-600 transition-colors">
            <Download className="w-4 h-4" />
            <span>導出記錄</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  交易類型
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  描述
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  項目
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  日期
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  金額
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  狀態
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
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
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {tx.type === 'income' ? '收入' : tx.type === 'withdrawal' ? '提現' : '支出'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{tx.description}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-600">{tx.projectTitle || '-'}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-600">
                      {new Date(tx.createdAt).toLocaleDateString('zh-TW')}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <p
                      className={`text-sm font-bold ${
                        tx.type === 'income' ? 'text-green-600' : 'text-gray-900'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'} NT${(tx.amount / 1000).toFixed(0)}K
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      已完成
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">顯示 1-4 條，共 12 條記錄</p>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>
              上一頁
            </button>
            <button className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              下一頁
            </button>
          </div>
        </div>
      </div>

      {/* Milestone Payments */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">里程碑款項</h2>
        <div className="space-y-4">
          {mockProjects[1].milestones.map((milestone) => {
            const payment = mockPayments.find((p) => p.milestoneId === milestone.id);
            return (
              <div
                key={milestone.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      milestone.status === 'approved'
                        ? 'bg-green-100 text-green-600'
                        : milestone.status === 'in_progress'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {milestone.status === 'approved' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{milestone.title}</p>
                    <p className="text-sm text-gray-500">{milestone.dueDate}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="font-bold text-gray-900">
                    NT$ {(milestone.amount / 1000).toFixed(0)}K
                  </p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      payment?.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : payment?.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {payment?.status === 'completed'
                      ? '已發放'
                      : payment?.status === 'pending'
                      ? '待發放'
                      : '待開始'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
