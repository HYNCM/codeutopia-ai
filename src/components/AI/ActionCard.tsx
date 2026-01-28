import React from 'react'
import { Sparkles, ArrowRight, FileText, AlertTriangle } from 'lucide-react'
import { AIActionData } from '../../types/ai'

interface ActionCardProps {
  action: AIActionData
  onExecute: (action: AIActionData) => void
}

export const ActionCard: React.FC<ActionCardProps> = ({ action, onExecute }) => {
  const getIcon = () => {
    switch (action.type) {
      case 'autofill_form':
        return <FileText className='w-5 h-5 text-indigo-600' />
      case 'highlight_risk':
        return <AlertTriangle className='w-5 h-5 text-orange-600' />
      default:
        return <Sparkles className='w-5 h-5 text-purple-600' />
    }
  }

  const getColor = () => {
    switch (action.type) {
      case 'autofill_form':
        return 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
      case 'highlight_risk':
        return 'bg-orange-50 border-orange-200 hover:bg-orange-100'
      default:
        return 'bg-purple-50 border-purple-200 hover:bg-purple-100'
    }
  }

  return (
    <div
      className={`mt-3 p-4 rounded-xl border transition-all cursor-pointer group ${getColor()}`}
      onClick={() => onExecute(action)}>
      <div className='flex items-start space-x-3'>
        <div className='p-2 bg-white rounded-lg shadow-sm'>{getIcon()}</div>
        <div className='flex-1'>
          <h4 className='text-sm font-semibold text-gray-900 group-hover:text-black mb-1'>
            {action.label || 'Suggested Action'}
          </h4>
          <div className='text-xs text-gray-500 line-clamp-2'>
            {action.type === 'autofill_form' && 'Auto-complete the project form with generated requirements.'}
            {action.type === 'highlight_risk' && 'Jump to the flagged risk item.'}
          </div>
        </div>
        <ArrowRight className='w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform' />
      </div>
    </div>
  )
}
