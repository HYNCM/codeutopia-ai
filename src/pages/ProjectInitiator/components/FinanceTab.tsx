import React, { useState, useEffect } from 'react'
import { DollarSign, TrendingUp } from 'lucide-react'
import { financeService } from '../../../services/financeService'

export const FinanceTab: React.FC = () => {
  const [stats, setStats] = useState<any[]>([])
  const [records, setRecords] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadFinanceData = async () => {
      try {
        const [statsData, recordsData] = await Promise.all([
          financeService.getFinancialStats(),
          financeService.getTransactions()
        ])
        setStats(statsData)
        setRecords(recordsData)
      } catch (error) {
        console.error('Failed to load finance data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadFinanceData()
  }, [])

    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-[var(--text-primary)]'>財務結算</h1>
        <p className='text-[var(--text-muted)] mt-1'>管理項目支出、里程碑付款與發票</p>
      </div>

      {/* 財務摘要卡片 */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className='bg-[var(--bg-card)] rounded-2xl p-6 shadow-sm border border-[var(--border-color)] transition-colors duration-150'>
            <div className='text-sm text-[var(--text-muted)] mb-1'>{stat.label}</div>
            <div className='text-2xl font-bold text-[var(--text-primary)]'>{stat.value}</div>
            <div
              className={`text-sm mt-2 ${stat.positive ? 'text-green-600 dark:text-green-400' : 'text-[var(--text-muted)]'}`}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* 結算記錄表格 */}
      <div className='bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border-color)] overflow-hidden transition-colors duration-150'>
        <div className='px-6 py-4 border-b border-[var(--border-color)]'>
          <h2 className='font-semibold text-[var(--text-primary)]'>結算記錄</h2>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-[var(--bg-card-hover)]'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase'>項目</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase'>里程碑</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase'>金額</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase'>狀態</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase'>日期</th>
                <th className='px-6 py-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase'>操作</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-[var(--border-subtle)]'>
              {records.map((row, idx) => (
                <tr key={idx} className='hover:bg-[var(--bg-card-hover)]'>
                  <td className='px-6 py-4 text-sm text-[var(--text-primary)]'>{row.project}</td>
                  <td className='px-6 py-4 text-sm text-[var(--text-muted)]'>{row.milestone}</td>
                  <td className='px-6 py-4 text-sm font-medium text-[var(--text-primary)]'>{row.amount}</td>
                  <td className='px-6 py-4'>
                    <span className='px-2 py-1 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-full text-xs font-medium'>
                      {row.status}
                    </span>
                  </td>
                  <td className='px-6 py-4 text-sm text-[var(--text-muted)]'>{row.date}</td>
                  <td className='px-6 py-4 text-right'>
                    <button className='text-purple-600 dark:text-purple-400 hover:text-purple-700 text-sm'>
                      下載發票
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
