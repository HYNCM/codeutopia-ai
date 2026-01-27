import React from 'react'
import { StepProps } from '../types'
import { DevelopmentTestType, ProjectVisibility } from '../../../types'
import { GitBranch, Smartphone, Cloud, Monitor, Settings, Globe, Lock, Users } from 'lucide-react'

export const Step4Flow: React.FC<StepProps> = ({ formData, updateFormData, onNext, onPrev }) => {
  const { projectFlow } = formData

  const updateFlow = (updates: Partial<typeof projectFlow>) => {
    updateFormData({
      projectFlow: {
        ...projectFlow,
        ...updates,
      },
    })
  }

  const toggleTool = (tool: string) => {
    const currentTools = projectFlow.collaborationTools || []
    const newTools = currentTools.includes(tool) ? currentTools.filter((t) => t !== tool) : [...currentTools, tool]
    updateFlow({ collaborationTools: newTools })
  }

  const devOptions: { type: DevelopmentTestType; icon: any; title: string; desc: string }[] = [
    {
      type: 'cloud',
      icon: Cloud,
      title: '雲側開發測試',
      desc: '標準 Web/SaaS 項目，使用雲端環境進行開發與部署',
    },
    {
      type: 'device',
      icon: Smartphone,
      title: '端側開發 (模擬器)',
      desc: '移動端/IoT 應用，主要依賴模擬器進行測試',
    },
    {
      type: 'device_real',
      icon: Monitor,
      title: '端側 + 真機部署',
      desc: '需特定硬件環境 (CodeBox) 進行真機測試與驗收',
    },
  ]

  const visibilityOptions: { type: ProjectVisibility; icon: any; title: string; desc: string }[] = [
    {
      type: 'public',
      icon: Globe,
      title: '公開項目',
      desc: '所有開發者可見，適用於尋求廣泛人才',
    },
    {
      type: 'private',
      icon: Lock,
      title: '私密項目',
      desc: '僅受邀者可見，適用於機密性較高的項目',
    },
    {
      type: 'invite_only',
      icon: Users,
      title: '僅限邀請 (人才庫)',
      desc: '僅對特定人才庫成員可見',
    },
  ]

  const tools = ['Slack', 'Jira', 'Trello', 'GitHub', 'GitLab', 'Figma', 'Notion', 'Teams']

  return (
    <div className='space-y-6 animate-in fade-in slide-in-from-right-4 duration-500'>
      <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-8'>
        <div>
          <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
            <span className='bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm'>
              4
            </span>
            開發與流程配置
          </h3>

          <label className='block text-sm font-medium text-gray-700 mb-3'>開發測試模式</label>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {devOptions.map((opt) => (
              <button
                key={opt.type}
                onClick={() => updateFlow({ developmentType: opt.type })}
                className={`p-4 border rounded-xl text-left transition-all ${
                  projectFlow.developmentType === opt.type
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}>
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                    projectFlow.developmentType === opt.type ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                  <opt.icon className='w-6 h-6' />
                </div>
                <h4
                  className={`font-medium mb-1 ${
                    projectFlow.developmentType === opt.type ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                  {opt.title}
                </h4>
                <p className='text-xs text-gray-500 leading-relaxed'>{opt.desc}</p>
              </button>
            ))}
          </div>

          {(projectFlow.developmentType === 'device' || projectFlow.developmentType === 'device_real') && (
            <div className='mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200'>
              <h4 className='text-sm font-medium text-gray-900 mb-3 flex items-center'>
                <Settings className='w-4 h-4 mr-2' />
                CodeBox / 硬件環境配置
              </h4>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-xs font-medium text-gray-700 mb-1'>設備型號</label>
                  <input
                    type='text'
                    value={projectFlow.codeBoxConfig?.deviceModel || ''}
                    onChange={(e) =>
                      updateFlow({
                        codeBoxConfig: {
                          ...projectFlow.codeBoxConfig!,
                          deviceModel: e.target.value,
                        },
                      })
                    }
                    placeholder='例如: iPhone 14 Pro, Raspberry Pi 4'
                    className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg'
                  />
                </div>
                <div>
                  <label className='block text-xs font-medium text-gray-700 mb-1'>系統版本</label>
                  <input
                    type='text'
                    value={projectFlow.codeBoxConfig?.systemVersion || ''}
                    onChange={(e) =>
                      updateFlow({
                        codeBoxConfig: {
                          ...projectFlow.codeBoxConfig!,
                          systemVersion: e.target.value,
                        },
                      })
                    }
                    placeholder='例如: iOS 16.0, Ubuntu 22.04'
                    className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg'
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-3'>協作工具集成</label>
          <div className='flex flex-wrap gap-2'>
            {tools.map((tool) => (
              <button
                key={tool}
                onClick={() => toggleTool(tool)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  projectFlow.collaborationTools.includes(tool)
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}>
                {tool}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-3'>項目可見性</label>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {visibilityOptions.map((opt) => (
              <button
                key={opt.type}
                onClick={() => updateFlow({ visibility: opt.type })}
                className={`flex items-center p-3 border rounded-lg transition-all ${
                  projectFlow.visibility === opt.type
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                    projectFlow.visibility === opt.type ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                  <opt.icon className='w-4 h-4' />
                </div>
                <div className='text-left'>
                  <h4
                    className={`text-sm font-medium ${
                      projectFlow.visibility === opt.type ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                    {opt.title}
                  </h4>
                  <p className='text-xs text-gray-500 mt-0.5'>{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
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
          下一步：里程碑與支付
        </button>
      </div>
    </div>
  )
}
