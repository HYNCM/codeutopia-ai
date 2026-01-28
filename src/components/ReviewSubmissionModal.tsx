import React, { useState } from 'react'
import { CheckCircle, XCircle, AlertTriangle, FileText, ExternalLink, Download } from 'lucide-react'
import { MilestoneSubmission } from '../types'
import { useProjects } from '../contexts/ProjectContext'
import { useWallet } from '../contexts/WalletContext'

interface ReviewSubmissionModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  milestoneId: string
  milestoneTitle: string
  milestoneAmount: number // New prop
  contractorId: string // New prop
  submission: MilestoneSubmission
}

export function ReviewSubmissionModal({
  isOpen,
  onClose,
  projectId,
  milestoneId,
  milestoneTitle,
  milestoneAmount,
  contractorId,
  submission,
}: ReviewSubmissionModalProps) {
  const { reviewMilestone } = useProjects()
  const { escrowRelease } = useWallet()

  const [decision, setDecision] = useState<'approve' | 'reject' | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (!decision) return
    if (decision === 'reject' && !rejectionReason.trim()) return

    setIsSubmitting(true)

    try {
      // 1. If approving, release funds first
      if (decision === 'approve') {
        await escrowRelease(projectId, milestoneId, milestoneAmount, contractorId)
      }

      // 2. Update Milestone Status
      reviewMilestone(projectId, milestoneId, {
        status: decision === 'approve' ? 'approved' : 'rejected',
        rejectionReason: decision === 'reject' ? rejectionReason : undefined,
      })
      
      if (decision === 'approve') {
        alert(`审核通过！已向承包商释放资金 $${milestoneAmount.toLocaleString()}`)
      }
      
      onClose()
      setDecision(null)
      setRejectionReason('')
    } catch (error) {
      console.error('Failed to review milestone:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      alert(`操作失败: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
      <div className='bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl animate-in fade-in zoom-in-95 duration-200'>
        <div className='flex items-center justify-between p-6 border-b border-gray-100'>
          <div>
            <h2 className='text-xl font-bold text-gray-900'>審核交付物</h2>
            <p className='text-sm text-gray-500 mt-1'>里程碑: {milestoneTitle}</p>
          </div>
          <button
            onClick={onClose}
            className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors'>
            <XCircle className='w-5 h-5' />
          </button>
        </div>

        <div className='p-6 space-y-6'>
          {/* Submission Content */}
          <div className='bg-slate-50 border border-slate-100 rounded-xl p-5'>
            <h3 className='text-sm font-semibold text-gray-700 mb-3 flex items-center'>
              <FileText className='w-4 h-4 mr-2 text-blue-500' />
              交付說明
            </h3>
            <p className='text-gray-600 whitespace-pre-wrap text-sm leading-relaxed'>{submission.note}</p>

            {submission.attachments && submission.attachments.length > 0 && (
              <div className='mt-4 pt-4 border-t border-slate-200/60'>
                <h4 className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2'>附件/鏈接</h4>
                <div className='space-y-2'>
                  {submission.attachments.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.startsWith('http') ? link : `https://${link}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center p-2 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors group'>
                      <ExternalLink className='w-4 h-4 text-gray-400 group-hover:text-blue-500 mr-2' />
                      <span className='text-sm truncate flex-1'>{link}</span>
                      <Download className='w-4 h-4 text-gray-300 group-hover:text-blue-400' />
                    </a>
                  ))}
                </div>
              </div>
            )}
            <div className='mt-3 text-right'>
              <span className='text-xs text-gray-400'>
                提交時間: {new Date(submission.submittedAt).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Decision UI */}
          <div className='space-y-4'>
            <h3 className='text-sm font-medium text-gray-900'>審核決定</h3>
            <div className='grid grid-cols-2 gap-4'>
              <button
                onClick={() => setDecision('approve')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                  decision === 'approve'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-slate-200 hover:border-green-200 hover:bg-green-50/50 text-gray-600'
                }`}>
                <CheckCircle className={`w-8 h-8 mb-2 ${decision === 'approve' ? 'text-green-500' : 'text-gray-300'}`} />
                <span className='font-bold'>通過並放款 ({'$' + milestoneAmount.toLocaleString()})</span>
                <span className='text-xs text-center mt-1 opacity-75'>
                  資金將從託管賬戶釋放給承包商
                </span>
              </button>

              <button
                onClick={() => setDecision('reject')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                  decision === 'reject'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-slate-200 hover:border-red-200 hover:bg-red-50/50 text-gray-600'
                }`}>
                <XCircle className={`w-8 h-8 mb-2 ${decision === 'reject' ? 'text-red-500' : 'text-gray-300'}`} />
                <span className='font-bold'>駁回修改</span>
                <span className='text-xs text-center mt-1 opacity-75'>
                  里程碑狀態將重置為"進行中"
                </span>
              </button>
            </div>

            {decision === 'reject' && (
              <div className='animate-in fade-in slide-in-from-top-2 duration-200'>
                <label className='text-sm font-medium text-gray-700 mb-1 block'>駁回原因 / 修改意見</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder='請詳細說明需要修改的地方...'
                  className='w-full p-3 border border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none min-h-[100px] text-sm'
                />
                <p className='text-xs text-red-500 mt-1 flex items-center'>
                  <AlertTriangle className='w-3 h-3 mr-1' />
                  必填項
                </p>
              </div>
            )}
          </div>

          <div className='flex justify-end pt-4 border-t border-gray-100'>
            <button
              onClick={onClose}
              className='px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors mr-3'>
              取消
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !decision || (decision === 'reject' && !rejectionReason.trim())}
              className='px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25'>
              {isSubmitting ? '處理中...' : '確認決定'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
