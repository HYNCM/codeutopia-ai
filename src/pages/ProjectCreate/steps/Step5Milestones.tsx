import React from 'react'
import { StepProps } from '../types'
import { MilestoneConfig, DeliverableConfig } from '../../../types'
import {
  Calendar,
  DollarSign,
  FileText,
  CheckSquare,
  Trash,
  Plus,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Flag,
} from 'lucide-react'

export const Step5Milestones: React.FC<StepProps> = ({ formData, updateFormData, onNext, onPrev }) => {
  const { milestones, basicInfo } = formData
  const [expandedId, setExpandedId] = React.useState<string | null>(milestones[0]?.id || null)

  const totalBudget = basicInfo.budgetMax // Use max budget as the reference for calculation
  const allocatedBudget = milestones.reduce((sum, m) => sum + m.budgetAmount, 0)
  const remainingBudget = totalBudget - allocatedBudget
  const allocatedPercent = milestones.reduce((sum, m) => sum + m.budgetPercentage, 0)

  const addMilestone = () => {
    const newId = `m${milestones.length + 1}`
    const newMilestone: MilestoneConfig = {
      id: newId,
      title: `里程碑 ${milestones.length + 1}`,
      description: '',
      order: milestones.length + 1,
      plannedStartDate: '',
      plannedEndDate: '',
      budgetAmount: 0,
      budgetPercentage: 0,
      depositRequired: true,
      depositPercentage: 30,
      humanDeliverables: [],
      aiDeliverables: [],
      acceptanceCriteria: [],
      reviewMethod: 'manual',
      reviewDeadlineHours: 24,
    }

    updateFormData({
      milestones: [...milestones, newMilestone],
    })
    setExpandedId(newId)
  }

  const removeMilestone = (id: string) => {
    updateFormData({
      milestones: milestones.filter((m) => m.id !== id),
    })
  }

  const updateMilestone = (id: string, updates: Partial<MilestoneConfig>) => {
    updateFormData({
      milestones: milestones.map((m) => {
        if (m.id !== id) return m

        // Auto-calculate amount if percent changes, or vice-versa
        let newValues = { ...updates }

        if (typeof updates.budgetPercentage === 'number' && totalBudget > 0) {
          newValues.budgetAmount = Math.round((totalBudget * updates.budgetPercentage) / 100)
        } else if (typeof updates.budgetAmount === 'number' && totalBudget > 0) {
          newValues.budgetPercentage = Number(((updates.budgetAmount / totalBudget) * 100).toFixed(1))
        }

        return { ...m, ...newValues }
      }),
    })
  }

  const addDeliverable = (milestoneId: string, type: 'human' | 'ai') => {
    const milestone = milestones.find((m) => m.id === milestoneId)
    if (!milestone) return

    const newDeliverable: DeliverableConfig = {
      id: `d-${Date.now()}`,
      name: '',
      description: '',
      type: 'document',
      required: true,
    }

    const updates =
      type === 'human'
        ? { humanDeliverables: [...milestone.humanDeliverables, newDeliverable] }
        : { aiDeliverables: [...milestone.aiDeliverables, newDeliverable] }

    updateMilestone(milestoneId, updates)
  }

  const updateDeliverable = (milestoneId: string, type: 'human' | 'ai', delId: string, val: string) => {
    const milestone = milestones.find((m) => m.id === milestoneId)
    if (!milestone) return

    const listKey = type === 'human' ? 'humanDeliverables' : 'aiDeliverables'
    const list = milestone[listKey]
    const newList = list.map((d) => (d.id === delId ? { ...d, name: val } : d))

    updateMilestone(milestoneId, { [listKey]: newList })
  }

  const removeDeliverable = (milestoneId: string, type: 'human' | 'ai', delId: string) => {
    const milestone = milestones.find((m) => m.id === milestoneId)
    if (!milestone) return

    const listKey = type === 'human' ? 'humanDeliverables' : 'aiDeliverables'
    const list = milestone[listKey]
    const newList = list.filter((d) => d.id !== delId)

    updateMilestone(milestoneId, { [listKey]: newList })
  }

  const [error, setError] = React.useState<string | null>(null)

  const handleNext = () => {
    setError(null)

    // 1. Check for empty milestones
    if (milestones.length === 0) {
      setError('請至少添加一個里程碑。')
      return
    }

    // 2. Check for missing data
    const invalidMilestoneIndex = milestones.findIndex((m) => !m.title || !m.plannedStartDate || !m.plannedEndDate)
    if (invalidMilestoneIndex !== -1) {
      setError(`里程碑 #${invalidMilestoneIndex + 1} 缺少標題或日期信息。`)
      setExpandedId(milestones[invalidMilestoneIndex].id)
      return
    }

    // 3. Check budget percentage (allow small rounding error)
    if (Math.abs(allocatedPercent - 100) > 0.5) {
      setError(`預算分配總和必須為 100% (目前: ${allocatedPercent}%)。`)
      return
    }

    onNext()
  }

  return (
    <div className='space-y-6 animate-in fade-in slide-in-from-right-4 duration-500'>
      <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm'>
        <div className='flex justify-between items-center mb-6'>
          <h3 className='text-lg font-semibold text-gray-900 flex items-center'>
            <span className='bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm'>
              5
            </span>
            里程碑規劃與支付
          </h3>
          <div className='text-sm bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 flex items-center space-x-3'>
            <span className='text-gray-500'>
              總預算: {basicInfo.currency} {totalBudget.toLocaleString()}
            </span>
            <span className='text-gray-300'>|</span>
            <span className={`${allocatedPercent > 100 ? 'text-red-600' : 'text-green-600'}`}>
              已分配: {allocatedPercent}% ({basicInfo.currency} {allocatedBudget.toLocaleString()})
            </span>
          </div>
        </div>

        <div className='space-y-4'>
          {milestones.map((milestone, index) => {
            const isExpanded = expandedId === milestone.id

            return (
              <div
                key={milestone.id}
                className={`border rounded-xl transition-all ${
                  isExpanded
                    ? 'border-blue-200 shadow-md ring-1 ring-blue-100'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                {/* Milestone Scroll Header */}
                <div
                  className='p-4 flex items-center justify-between cursor-pointer bg-gray-50/50 rounded-t-xl'
                  onClick={() => setExpandedId(isExpanded ? null : milestone.id)}>
                  <div className='flex items-center space-x-4'>
                    <div className='bg-white border text-gray-500 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shadow-sm'>
                      {index + 1}
                    </div>
                    <div>
                      <h4 className='font-medium text-gray-900 flex items-center'>
                        {milestone.title}
                        {milestone.budgetPercentage > 0 && (
                          <span className='ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full'>
                            {milestone.budgetPercentage}%
                          </span>
                        )}
                      </h4>
                      <div className='text-xs text-gray-500 flex items-center mt-1 space-x-3'>
                        <span className='flex items-center'>
                          <Calendar className='w-3 h-3 mr-1' />
                          {milestone.plannedStartDate || '未設置'} - {milestone.plannedEndDate || '未設置'}
                        </span>
                        <span className='flex items-center'>
                          <DollarSign className='w-3 h-3 mr-1' />
                          {milestone.budgetAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    {milestones.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeMilestone(milestone.id)
                        }}
                        className='p-2 text-gray-400 hover:text-red-500 transition-colors'>
                        <Trash className='w-4 h-4' />
                      </button>
                    )}
                    {isExpanded ? (
                      <ChevronUp className='w-5 h-5 text-gray-400' />
                    ) : (
                      <ChevronDown className='w-5 h-5 text-gray-400' />
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className='p-6 border-t border-gray-100 space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>里程碑標題</label>
                        <input
                          type='text'
                          value={milestone.title}
                          onChange={(e) => updateMilestone(milestone.id, { title: e.target.value })}
                          className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>預算比例 (%)</label>
                        <div className='relative'>
                          <input
                            type='number'
                            min='0'
                            max='100'
                            value={milestone.budgetPercentage}
                            onChange={(e) =>
                              updateMilestone(milestone.id, { budgetPercentage: Number(e.target.value) })
                            }
                            className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg'
                          />
                          <div className='absolute right-3 top-2 text-xs text-gray-400'>
                            = {basicInfo.currency} {milestone.budgetAmount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>描述</label>
                      <textarea
                        value={milestone.description}
                        onChange={(e) => updateMilestone(milestone.id, { description: e.target.value })}
                        rows={2}
                        className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg'
                        placeholder='主要交付目標...'
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      {/* Human Deliverables */}
                      <div className='bg-orange-50 rounded-lg p-4 border border-orange-100'>
                        <h5 className='text-sm font-medium text-orange-900 mb-3 flex items-center justify-between'>
                          <span className='flex items-center'>
                            <FileText className='w-4 h-4 mr-2' /> 人工交付物
                          </span>
                          <button
                            onClick={() => addDeliverable(milestone.id, 'human')}
                            className='text-orange-600 hover:text-orange-700'>
                            <Plus className='w-4 h-4' />
                          </button>
                        </h5>
                        <div className='space-y-2'>
                          {milestone.humanDeliverables.map((d) => (
                            <div key={d.id} className='flex items-center space-x-2'>
                              <input
                                type='text'
                                value={d.name}
                                onChange={(e) => updateDeliverable(milestone.id, 'human', d.id, e.target.value)}
                                className='flex-1 px-2 py-1.5 text-sm border border-orange-200 rounded focus:ring-orange-500 focus:border-orange-500'
                                placeholder='輸入交付物名稱'
                              />
                              <button
                                onClick={() => removeDeliverable(milestone.id, 'human', d.id)}
                                className='text-gray-400 hover:text-red-500'>
                                <Trash className='w-3 h-3' />
                              </button>
                            </div>
                          ))}
                          {milestone.humanDeliverables.length === 0 && (
                            <div className='text-center py-2 text-xs text-orange-400 dashed border border-orange-200 rounded'>
                              暫無交付物
                            </div>
                          )}
                        </div>
                      </div>

                      {/* AI Deliverables */}
                      <div className='bg-blue-50 rounded-lg p-4 border border-blue-100'>
                        <h5 className='text-sm font-medium text-blue-900 mb-3 flex items-center justify-between'>
                          <span className='flex items-center'>
                            <FileText className='w-4 h-4 mr-2' /> AI 輔助產出
                          </span>
                          <button
                            onClick={() => addDeliverable(milestone.id, 'ai')}
                            className='text-blue-600 hover:text-blue-700'>
                            <Plus className='w-4 h-4' />
                          </button>
                        </h5>
                        <div className='space-y-2'>
                          {milestone.aiDeliverables.map((d) => (
                            <div key={d.id} className='flex items-center space-x-2'>
                              <input
                                type='text'
                                value={d.name}
                                onChange={(e) => updateDeliverable(milestone.id, 'ai', d.id, e.target.value)}
                                className='flex-1 px-2 py-1.5 text-sm border border-blue-200 rounded focus:ring-blue-500 focus:border-blue-500'
                                placeholder='AI 產出物名稱'
                              />
                              <button
                                onClick={() => removeDeliverable(milestone.id, 'ai', d.id)}
                                className='text-gray-400 hover:text-red-500'>
                                <Trash className='w-3 h-3' />
                              </button>
                            </div>
                          ))}
                          {milestone.aiDeliverables.length === 0 && (
                            <div className='text-center py-2 text-xs text-blue-400 dashed border border-blue-200 rounded'>
                              系統將自動生成
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          <button
            onClick={addMilestone}
            className='w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center font-medium'>
            <Plus className='w-5 h-5 mr-2' /> 添加里程碑
          </button>
        </div>
      </div>

      {error && (
        <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700'>
          <AlertCircle className='w-5 h-5 mr-2 flex-shrink-0' />
          <span>{error}</span>
        </div>
      )}

      <div className='flex justify-between'>
        <button
          onClick={onPrev}
          className='px-6 py-2.5 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors'>
          上一步
        </button>
        <button
          onClick={handleNext}
          className='px-6 py-2.5 rounded-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg transition-all'>
          下一步：結算與協作
        </button>
      </div>
    </div>
  )
}
