import React, { useState } from 'react'
import { X, DollarSign, Clock, FileText, Send } from 'lucide-react'

interface SubmitBidModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { amount: number; days: number; proposal: string }) => void
  currency: string
  budgetMax: number
}

export const SubmitBidModal: React.FC<SubmitBidModalProps> = ({ isOpen, onClose, onSubmit, currency, budgetMax }) => {
  const [amount, setAmount] = useState<string>('') // Handle empty state
  const [days, setDays] = useState<string>('')
  const [proposal, setProposal] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !days || !proposal) return

    onSubmit({
      amount: Number(amount),
      days: Number(days),
      proposal,
    })
    onClose()
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4'>
      <div className='bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200'>
        <div className='flex items-center justify-between p-6 border-b border-gray-100'>
          <h2 className='text-lg font-bold text-gray-900'>提交报价方案</h2>
          <button onClick={onClose} className='text-gray-400 hover:text-gray-600 transition-colors'>
            <X className='w-5 h-5' />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>报价金额 ({currency})</label>
              <div className='relative'>
                <DollarSign className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                <input
                  type='number'
                  required
                  min='1'
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className='w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all'
                  placeholder='0.00'
                />
              </div>
              <p className='text-xs text-gray-500 mt-1'>最高预算: {budgetMax.toLocaleString()}</p>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>预计工期 (天)</label>
              <div className='relative'>
                <Clock className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                <input
                  type='number'
                  required
                  min='1'
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className='w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all'
                  placeholder='0'
                />
              </div>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>方案说明</label>
            <div className='relative'>
              <textarea
                required
                rows={4}
                value={proposal}
                onChange={(e) => setProposal(e.target.value)}
                className='w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none'
                placeholder='简述您的开发计划、技术栈以及为何您是最佳人选...'
              />
            </div>
          </div>

          <div className='flex gap-3 pt-2'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors'>
              取消
            </button>
            <button
              type='submit'
              className='flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-black transition-colors flex items-center justify-center space-x-2'>
              <Send className='w-4 h-4' />
              <span>提交方案</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
