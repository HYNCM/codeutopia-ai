import React, { useState } from 'react'
import { useProjects } from '../contexts/ProjectContext'
import { X, FileText, Link as LinkIcon, AlertCircle } from 'lucide-react'

interface SubmitDeliverableModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  milestoneId: string
  milestoneTitle: string
}

export function SubmitDeliverableModal({
  isOpen,
  onClose,
  projectId,
  milestoneId,
  milestoneTitle,
}: SubmitDeliverableModalProps) {
  const { submitMilestone } = useProjects()

  const [note, setNote] = useState('')
  const [linksText, setLinksText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!note.trim()) return

    setIsSubmitting(true)

    try {
      // Parse links simple way (split by newline)
      const attachments = linksText
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)

      submitMilestone(projectId, milestoneId, {
        note,
        attachments,
      })
      
      onClose()
      setNote('')
      setLinksText('')
    } catch (error) {
      console.error('Failed to submit milestone:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
      <div className='bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl animate-in fade-in zoom-in-95 duration-200'>
        <div className='flex items-center justify-between p-6 border-b border-gray-100'>
          <div>
            <h2 className='text-xl font-bold text-gray-900'>提交里程碑交付物</h2>
            <p className='text-sm text-gray-500 mt-1'>里程碑: {milestoneTitle}</p>
          </div>
          <button
            onClick={onClose}
            className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors'>
            <X className='w-5 h-5' />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
          <div className='bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start space-x-3'>
            <AlertCircle className='w-5 h-5 text-blue-600 shrink-0 mt-0.5' />
            <div className='text-sm text-blue-800'>
              <p className='font-medium mb-1'>提交說明</p>
              <p>
                請確保您已完成該里程碑要求的所有交付內容。建議附上詳細的說明文檔或演示視頻鏈接，以便項目發起人快速審核。
              </p>
            </div>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-700'>交付說明</label>
            <div className='relative'>
              <FileText className='absolute left-3 top-3 w-5 h-5 text-gray-400' />
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder='請描述本次交付的主要內容、完成情況及注意事項...'
                className='w-full pl-10 pr-4 py-3 min-h-[120px] border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-y'
                required
              />
            </div>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-700'>相關鏈接 / 附件地址</label>
            <div className='relative'>
              <LinkIcon className='absolute left-3 top-3 w-5 h-5 text-gray-400' />
              <textarea
                value={linksText}
                onChange={(e) => setLinksText(e.target.value)}
                placeholder={`GitHub Repo Link\nDemo URL\nGoogle Drive Link`}
                className='w-full pl-10 pr-4 py-3 min-h-[100px] border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-y font-mono text-sm'
              />
            </div>
            <p className='text-xs text-gray-500'>每行輸入一個鏈接</p>
          </div>

          <div className='flex justify-end pt-4 border-t border-gray-100'>
            <button
              type='button'
              onClick={onClose}
              className='px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors mr-3'>
              取消
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg shadow-purple-500/25'>
              {isSubmitting ? '提交中...' : '確認提交'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
