export const financeService = {
  getFinancialStats: async (): Promise<any[]> => {
    return [
      { label: '本月支出', value: '$45,000', change: '+12.5%', positive: true, color: 'blue' },
      { label: '待結算金額', value: '$12,500', change: '3 筆', positive: false, color: 'orange' },
      { label: '已結算金額', value: '$232,500', change: '本月', positive: true, color: 'green' },
      { label: '爭議中金額', value: '$0', change: '無', positive: true, color: 'gray' },
    ]
  },

  getTransactions: async (): Promise<any[]> => {
    return [
      {
        project: '智能客服系統開發',
        milestone: '代碼開發里程碑',
        amount: '$15,000',
        status: '已完成',
        date: '2024-01-15',
      },
      {
        project: '數據分析平台 UI/UX 優化',
        milestone: '設計調研里程碑',
        amount: '$5,600',
        status: '已完成',
        date: '2024-01-10',
      },
      {
        project: '智能客服系統開發',
        milestone: '需求確認里程碑',
        amount: '$9,000',
        status: '已完成',
        date: '2024-01-05',
      },
      {
        project: '電商平台重構',
        milestone: '預付款',
        amount: '$5,000',
        status: '處理中',
        date: '2024-01-20',
      },
    ]
  },

  getContractorStats: async (userId: string): Promise<any> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalEarnings: 28500,
          pendingPayments: 5000,
          activeProjects: 3,
          completedProjects: 12,
          thisMonthEarnings: 8500,
          earningsGrowth: '+12%',
        })
      }, 300)
    })
  },
}
