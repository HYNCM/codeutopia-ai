import React from 'react'
import { StepProps } from '../types'
import { AI_ROLES_CONFIG, AIRoleType, AIRoleConfig } from '../../../types'
import { Brain, CheckCircle, ChevronDown, ChevronUp, Bot, Sparkles } from 'lucide-react'

export const Step3AIConfig: React.FC<StepProps> = ({ formData, updateFormData, onNext, onPrev }) => {
  const { aiConfig } = formData
  const [expandedRole, setExpandedRole] = React.useState<string | null>(null)

  const toggleAIEnabled = (enabled: boolean) => {
    updateFormData({
      aiConfig: {
        ...aiConfig,
        enabled,
      },
    })
  }

  const toggleRole = (roleId: AIRoleType) => {
    const currentRoles = [...aiConfig.roles]
    const existingIndex = currentRoles.findIndex((r) => r.roleId === roleId)

    if (existingIndex >= 0) {
      // Remove role
      currentRoles.splice(existingIndex, 1)
    } else {
      // Add role with default config
      const roleDef = AI_ROLES_CONFIG.find((r) => r.id === roleId)
      if (roleDef) {
        currentRoles.push({
          roleId,
          enabled: true,
          scope: roleDef.description,
          deliverables: roleDef.capabilities.slice(0, 2),
          milestoneIds: [],
          reviewBy: 'contractor',
          reviewDeadlineHours: 24,
        })
      }
    }

    updateFormData({
      aiConfig: {
        ...aiConfig,
        roles: currentRoles,
      },
    })
  }

  const updateRoleConfig = (roleId: AIRoleType, field: keyof AIRoleConfig, value: any) => {
    const currentRoles = [...aiConfig.roles]
    const roleIndex = currentRoles.findIndex((r) => r.roleId === roleId)

    if (roleIndex >= 0) {
      currentRoles[roleIndex] = {
        ...currentRoles[roleIndex],
        [field]: value,
      }

      updateFormData({
        aiConfig: {
          ...aiConfig,
          roles: currentRoles,
        },
      })
    }
  }

  const isRoleSelected = (roleId: AIRoleType) => aiConfig.roles.some((r) => r.roleId === roleId)
  const getRoleConfig = (roleId: AIRoleType) => aiConfig.roles.find((r) => r.roleId === roleId)

  return (
    <div className='space-y-6 animate-in fade-in slide-in-from-right-4 duration-500'>
      <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between'>
          <div className='flex items-center'>
            <span className='bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm'>
              3
            </span>
            AI 協助角色配置
          </div>
          <div className='flex items-center space-x-2'>
            <span className={`text-sm ${aiConfig.enabled ? 'text-gray-900' : 'text-gray-500'}`}>
              {aiConfig.enabled ? '已啟用 AI 協助' : '未啟用 AI 協助'}
            </span>
            <button
              onClick={() => toggleAIEnabled(!aiConfig.enabled)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                aiConfig.enabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}>
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  aiConfig.enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </h3>

        {aiConfig.enabled && (
          <div className='space-y-6'>
            <div className='bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start space-x-3'>
              <Bot className='w-5 h-5 text-blue-600 mt-0.5' />
              <div>
                <h4 className='text-sm font-medium text-blue-900'>AI 協同工作模式</h4>
                <p className='text-sm text-blue-700 mt-1'>
                  AI 角色將作為人類團隊的"數字助手"，負責生成基礎代碼、文檔草稿、測試用例等輔助性工作。 所有 AI
                  產出均需經過人類工程師審核後才能作為正式交付物。
                </p>
              </div>
            </div>

            <div className='grid grid-cols-1 gap-4'>
              {AI_ROLES_CONFIG.map((roleDef) => {
                const isSelected = isRoleSelected(roleDef.id)
                const config = getRoleConfig(roleDef.id)
                const isExpanded = expandedRole === roleDef.id

                return (
                  <div
                    key={roleDef.id}
                    className={`border rounded-xl transition-all ${
                      isSelected ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200 hover:border-blue-200'
                    }`}>
                    <div className='p-4 flex items-center justify-between'>
                      <div className='flex items-center space-x-4'>
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isSelected
                              ? `bg-${roleDef.color}-100 text-${roleDef.color}-600`
                              : 'bg-gray-100 text-gray-400'
                          }`}>
                          <Brain className='w-6 h-6' />
                        </div>
                        <div>
                          <h4 className='font-medium text-gray-900'>{roleDef.name}</h4>
                          <p className='text-sm text-gray-500'>{roleDef.description}</p>
                        </div>
                      </div>
                      <div className='flex items-center space-x-3'>
                        <button
                          onClick={() => toggleRole(roleDef.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isSelected
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}>
                          {isSelected ? '已選擇' : '選擇此角色'}
                        </button>
                        {isSelected && (
                          <button
                            onClick={() => setExpandedRole(isExpanded ? null : roleDef.id)}
                            className='p-2 text-gray-400 hover:text-gray-600'>
                            {isExpanded ? <ChevronUp className='w-5 h-5' /> : <ChevronDown className='w-5 h-5' />}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Expanded Config */}
                    {isSelected && isExpanded && config && (
                      <div className='px-4 pb-4 pt-0 border-t border-blue-100 mt-2'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 pt-4'>
                          <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>輔助範圍配置</label>
                            <textarea
                              value={config.scope}
                              onChange={(e) => updateRoleConfig(roleDef.id, 'scope', e.target.value)}
                              rows={3}
                              className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                            />
                            <div className='mt-2 flex flex-wrap gap-2'>
                              {roleDef.capabilities.map((cap) => (
                                <span
                                  key={cap}
                                  className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
                                  <Sparkles className='w-3 h-3 mr-1 text-yellow-500' />
                                  {cap}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className='space-y-4'>
                            <div>
                              <label className='block text-sm font-medium text-gray-700 mb-2'>成果審核方</label>
                              <div className='flex space-x-4'>
                                <label className='flex items-center space-x-2'>
                                  <input
                                    type='radio'
                                    checked={config.reviewBy === 'contractor'}
                                    onChange={() => updateRoleConfig(roleDef.id, 'reviewBy', 'contractor')}
                                    className='text-blue-600 focus:ring-blue-500'
                                  />
                                  <span className='text-sm text-gray-700'>由接案者審核 (推薦)</span>
                                </label>
                                <label className='flex items-center space-x-2'>
                                  <input
                                    type='radio'
                                    checked={config.reviewBy === 'initiator'}
                                    onChange={() => updateRoleConfig(roleDef.id, 'reviewBy', 'initiator')}
                                    className='text-blue-600 focus:ring-blue-500'
                                  />
                                  <span className='text-sm text-gray-700'>由主理人審核</span>
                                </label>
                              </div>
                            </div>

                            <div>
                              <label className='block text-sm font-medium text-gray-700 mb-2'>審核時效限制</label>
                              <select
                                value={config.reviewDeadlineHours}
                                onChange={(e) =>
                                  updateRoleConfig(roleDef.id, 'reviewDeadlineHours', Number(e.target.value))
                                }
                                className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg'>
                                <option value={12}>12 小時內</option>
                                <option value={24}>24 小時內</option>
                                <option value={48}>48 小時內</option>
                                <option value={72}>72 小時內</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {!aiConfig.enabled && (
          <div className='text-center py-8 text-gray-500'>
            <Bot className='w-12 h-12 mx-auto mb-3 text-gray-300' />
            <p>已關閉 AI 協助功能，項目將完全依賴人類團隊交付。</p>
            <button
              onClick={() => toggleAIEnabled(true)}
              className='mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium'>
              開啟以提升交付效率
            </button>
          </div>
        )}
      </div>

      <div className='flex justify-between'>
        <button
          onClick={onPrev}
          className='px-6 py-2.5 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors'>
          上一步
        </button>
        <button
          onClick={onNext}
          className='px-6 py-2.5 rounded-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg transition-all'>
          下一步：項目流程
        </button>
      </div>
    </div>
  )
}
