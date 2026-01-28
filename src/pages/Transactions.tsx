import { useState } from 'react'
import { useWallet } from '../contexts/WalletContext'
import { DollarSign, ArrowUpRight, ArrowDownLeft, Wallet, Lock, Unlock, Briefcase } from 'lucide-react'

export function TransactionsPage() {
  const { transactions, balance, addFunds, withdrawFunds } = useWallet()
  const [activeTab, setActiveTab] = useState<'all' | 'deposit' | 'withdrawal' | 'escrow'>('all')

  // Calculations based on REAL transactions from Context
  const totalIncome = transactions.filter((t) => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter((t) => t.type === 'withdrawal' || t.type === 'escrow_lock')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const filteredTransactions = transactions.filter((t) => {
    if (activeTab === 'all') return true
    if (activeTab === 'escrow') return t.type === 'escrow_lock' || t.type === 'escrow_release'
    return t.type === activeTab
  })

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className='w-5 h-5 text-green-500' />
      case 'withdrawal':
        return <ArrowUpRight className='w-5 h-5 text-gray-500' />
      case 'escrow_lock':
        return <Lock className='w-5 h-5 text-orange-500' />
      case 'escrow_release':
        return <Unlock className='w-5 h-5 text-blue-500' />
      default:
        return <DollarSign className='w-5 h-5 text-gray-500' />
    }
  }

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'deposit':
        return '充值 / 收入'
      case 'withdrawal':
        return '提現'
      case 'escrow_lock':
        return '項目資金託管'
      case 'escrow_release':
        return '項目資金釋放'
      default:
        return '交易'
    }
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>財務中心</h1>
          <p className='text-gray-500 mt-1'>管理您的收入、支出和提現</p>
        </div>
        <div className='flex space-x-3'>
          <button
            onClick={() => addFunds(10000)}
            className='px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'>
            + 模擬充值 $10k
          </button>
          <button
            onClick={() => withdrawFunds(1000)}
            className='flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'>
            <Wallet className='w-5 h-5' />
            <span>申請提現</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
          <div className='flex items-center justify-between mb-4'>
            <div className='p-3 bg-purple-50 rounded-xl'>
              <Wallet className='w-6 h-6 text-purple-600' />
            </div>
            <span className='text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full'>可用餘額</span>
          </div>
          <p className='text-sm text-gray-500'>當前餘額</p>
          <h3 className='text-3xl font-bold text-gray-900 mt-1'>${balance.toLocaleString()}</h3>
        </div>

        <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
          <div className='flex items-center justify-between mb-4'>
            <div className='p-3 bg-green-50 rounded-xl'>
              <ArrowDownLeft className='w-6 h-6 text-green-600' />
            </div>
            <span className='text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full'>本月</span>
          </div>
          <p className='text-sm text-gray-500'>總收入 / 充值</p>
          <h3 className='text-3xl font-bold text-gray-900 mt-1'>${totalIncome.toLocaleString()}</h3>
        </div>

        <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
          <div className='flex items-center justify-between mb-4'>
            <div className='p-3 bg-orange-50 rounded-xl'>
              <Lock className='w-6 h-6 text-orange-600' />
            </div>
          </div>
          <p className='text-sm text-gray-500'>總支出 / 凍結</p>
          <h3 className='text-3xl font-bold text-gray-900 mt-1'>${totalExpense.toLocaleString()}</h3>
        </div>
      </div>

      {/* Transactions List */}
      <div className='bg-white rounded-2xl shadow-sm border border-gray-100'>
        <div className='p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <h2 className='text-lg font-bold text-gray-900'>交易明細</h2>
          <div className='flex items-center space-x-2 bg-gray-100 p-1 rounded-lg'>
            {['all', 'deposit', 'withdrawal', 'escrow'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}>
                {tab === 'all' ? '全部' : tab === 'deposit' ? '收入' : tab === 'withdrawal' ? '支出' : '託管'}
              </button>
            ))}
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                  交易類型
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                  描述 / 項目
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                  金額
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                  狀態
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                  時間
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className='px-6 py-12 text-center text-gray-500'>
                    暫無交易記錄
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className='hover:bg-gray-50 transition-colors'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div
                          className={`p-2 rounded-lg mr-3 ${
                            transaction.type === 'deposit'
                              ? 'bg-green-50'
                              : transaction.type === 'escrow_lock'
                                ? 'bg-orange-50'
                                : 'bg-gray-100'
                          }`}>
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <span className='font-medium text-gray-900'>{getTransactionLabel(transaction.type)}</span>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='text-sm font-medium text-gray-900'>{transaction.description}</div>
                      {transaction.projectTitle && (
                        <div className='text-xs text-gray-500 flex items-center mt-1'>
                          <Briefcase className='w-3 h-3 mr-1' />
                          {transaction.projectTitle}
                        </div>
                      )}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`text-sm font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                        {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                        success
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {new Date(transaction.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
