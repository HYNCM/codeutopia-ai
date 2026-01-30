import React, { useState, useEffect } from 'react'
import { DollarSign, Download, TrendingUp } from 'lucide-react'
import { financeService } from '../../../services/financeService'
import { useAuth } from '../../../contexts/AuthContext'

export const EarningsTab: React.FC = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (!user) return
      try {
        const [statsData, txData] = await Promise.all([
          financeService.getContractorStats(user.id),
          financeService.getTransactions(),
        ])
        setStats(statsData)
        setTransactions(txData)
      } catch (error) {
        console.error('Failed to load earnings data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [user])

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-[var(--text-primary)]'>財務與收入</h1>
          <p className='text-[var(--text-muted)] mt-1'>查看收益報表與交易記錄</p>
        </div>
        <button className='flex items-center space-x-2 px-4 py-2 border border-[var(--border-subtle)] rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'>
          <Download className='w-4 h-4' />
          <span>導出報表</span>
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-green-500/20'>
          <div className='flex items-center space-x-2 mb-4 opacity-90'>
            <DollarSign className='w-5 h-5' />
            <span className='font-medium'>總收入</span>
          </div>
          <div className='text-3xl font-bold'>${stats?.totalEarnings?.toLocaleString() || 0}</div>
          <div className='mt-4 flex items-center text-sm opacity-90 bg-white/10 w-fit px-2 py-1 rounded-lg'>
            <TrendingUp className='w-4 h-4 mr-1' />
            <span>比上月 {stats?.earningsGrowth || '+0%'}</span>
          </div>
        </div>

        <div className='bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border-color)] shadow-sm'>
          <div className='text-[var(--text-muted)] mb-2'>本月收入</div>
          <div className='text-2xl font-bold text-[var(--text-primary)]'>
            ${stats?.thisMonthEarnings?.toLocaleString() || 0}
          </div>
        </div>

        <div className='bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border-color)] shadow-sm'>
          <div className='text-[var(--text-muted)] mb-2'>待結算</div>
          <div className='text-2xl font-bold text-orange-500'>${stats?.pendingPayments?.toLocaleString() || 0}</div>
        </div>
      </div>

      <div className='bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border-color)] overflow-hidden'>
        <div className='px-6 py-4 border-b border-[var(--border-color)]'>
          <h3 className='font-bold text-[var(--text-primary)]'>交易記錄</h3>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-[var(--bg-card-hover)] text-xs uppercase text-[var(--text-muted)]'>
              <tr>
                <th className='px-6 py-3 text-left'>日期</th>
                <th className='px-6 py-3 text-left'>項目與摘要</th>
                <th className='px-6 py-3 text-left'>類型</th>
                <th className='px-6 py-3 text-left'>狀態</th>
                <th className='px-6 py-3 text-right'>金額</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-[var(--border-subtle)]'>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className='p-8 text-center text-gray-500'>
                    加載中...
                  </td>
                </tr>
              ) : (
                transactions.map((tx, idx) => (
                  <tr key={idx} className='hover:bg-[var(--bg-card-hover)]'>
                    <td className='px-6 py-4 text-sm text-[var(--text-secondary)]'>{tx.date}</td>
                    <td className='px-6 py-4'>
                      <div className='text-sm text-[var(--text-primary)] font-medium'>{tx.project}</div>
                      <div className='text-xs text-[var(--text-muted)]'>{tx.milestone}</div>
                    </td>
                    <td className='px-6 py-4 text-sm text-[var(--text-secondary)]'>里程碑付款</td>
                    <td className='px-6 py-4'>
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          tx.status === '已完成' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                        }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-right text-sm font-bold text-[var(--text-primary)]'>{tx.amount}</td>
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
