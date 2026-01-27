import React, { useState } from 'react'
import { Project, Bid } from '../types'
import { useAuth } from '../contexts/AuthContext'
import { useProjects } from '../contexts/ProjectContext'
import { X, DollarSign, Clock, Send } from 'lucide-react'

interface BidModalProps {
  isOpen: boolean
  onClose: () => void
  project: Project
}

export function BidModal({ isOpen, onClose, project }: BidModalProps) {
  const { user } = useAuth()
  const { submitBid } = useProjects()

  const [amount, setAmount] = useState<number | ''>('')
  const [days, setDays] = useState<number | ''>('')
  const [proposal, setProposal] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || amount === '' || days === '' || !proposal.trim()) return

    setIsSubmitting(true)

    try {
      const newBid: Bid = {
        id: crypto.randomUUID(),
        projectId: project.id,
        developerId: user.id,
        developerName: user.name,
        developerAvatar: user.avatar,
        developerRating: user.rating,
        proposedPrice: Number(amount),
        deliveryDays: Number(days),
        proposal: proposal,
        status: 'pending',
        createdAt: new Date().toISOString(),
      }

      submitBid(project.id, newBid)
      onClose()
      // Reset form (optional, since it unmounts/closes)
      setAmount('')
      setDays('')
      setProposal('')
    } catch (error) {
      console.error('Failed to submit bid:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
      <div className='bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl animate-in fade-in zoom-in-95 duration-200'>
        <div className='flex items-center justify-between p-6 border-b border-gray-100'>
          <div>
            <h2 className='text-xl font-bold text-gray-900'>提交競標方案</h2>
            <p className='text-sm text-gray-500 mt-1'>項目: {project.title}</p>
          </div>
          <button
            onClick={onClose}
            className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors'>
            <X className='w-5 h-5' />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700'>報價金額 ({project.budget.currency})</label>
              <div className='relative'>
                <DollarSign className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                <input
                  type='number'
                  min='0'
                  step='100'
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder={`預算範圍: ${project.budget.min} - ${project.budget.max}`}
                  className='w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none'
                  required
                />
              </div>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700'>預計工期 (天)</label>
              <div className='relative'>
                <Clock className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                <input
                  type='number'
                  min='1'
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  placeholder='預計完成所需天數'
                  className='w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none'
                  required
                />
              </div>
            </div>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-700'>提案說明</label>
            <textarea
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              placeholder='請描述您的開發計劃、優勢以及為什麼您適合這個項目...'
              className='w-full h-40 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none'
              required
            />
          </div>

          <div className='bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700'>
            <h4 className='font-semibold mb-1'>投標須知</h4>
            <ul className='list-disc list-inside space-y-1 text-blue-600/80'>
              <li>報價應包含所有開發與測試費用</li>
              <li>工期應包含最後的驗收測試時間</li>
              <li>提交後，項目方可能會與您聯繫進行進一步溝通</li>
            </ul>
          </div>

          <div className='flex justify-end pt-4 border-t border-gray-100'>
            <button
              type='button'
              onClick={onClose}
              className='px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-xl transition-colors mr-3'>
              取消
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='flex items-center px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed'>
              <Send className='w-4 h-4 mr-2' />
              {isSubmitting ? '提交中...' : '提交方案'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
