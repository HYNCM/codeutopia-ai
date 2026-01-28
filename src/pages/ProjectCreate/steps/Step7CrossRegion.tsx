import React from 'react'
import { StepProps } from '../types'
import { GLOBAL_REGIONS } from '../../../types'
import { Globe, Clock, MessageSquare, ShieldAlert, FileText } from 'lucide-react'

export const Step7CrossRegion: React.FC<StepProps> = ({ formData, updateFormData, onNext, onPrev }) => {
  const { crossRegion } = formData
  const isEnabled = !!crossRegion

  // Initialize if not present
  React.useEffect(() => {
    if (!crossRegion && isEnabled) {
      updateFormData({
        crossRegion: {
          targetRegions: [],
          primaryTimezone: 'UTC+0',
          languagePreferences: ['English'],
          meetingFrequency: 'weekly',
          responseTimeHours: 24,
          documentPermissions: 'all',
          disputeHandling: 'regional_first',
        },
      })
    }
  }, [isEnabled, crossRegion, updateFormData])

  const toggleEnabled = (enable: boolean) => {
    if (enable) {
      updateFormData({
        crossRegion: {
          targetRegions: [],
          primaryTimezone: 'UTC+0',
          languagePreferences: ['English'],
          meetingFrequency: 'weekly',
          responseTimeHours: 24,
          documentPermissions: 'all',
          disputeHandling: 'regional_first',
        },
      })
    } else {
      updateFormData({ crossRegion: undefined })
    }
  }

  const updateConfig = (updates: Partial<NonNullable<typeof crossRegion>>) => {
    if (!crossRegion) return
    updateFormData({
      crossRegion: {
        ...crossRegion,
        ...updates,
      },
    })
  }

  return (
    <div className='space-y-6 animate-in fade-in slide-in-from-right-4 duration-500'>
      <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between'>
          <div className='flex items-center'>
            <span className='bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm'>
              7
            </span>
            跨區域協作設置 (可選)
          </div>
          <div className='flex items-center space-x-2'>
            <span className={`text-sm ${isEnabled ? 'text-gray-900' : 'text-gray-500'}`}>
              {isEnabled ? '已啟用' : '未設置'}
            </span>
            <button
              onClick={() => toggleEnabled(!isEnabled)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isEnabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}>
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </h3>

        {isEnabled && crossRegion && (
          <div className='space-y-6 animate-in fade-in'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  <Globe className='w-4 h-4 inline mr-1' />
                  目標協作區域
                </label>
                <div className='flex flex-wrap gap-2'>
                  {GLOBAL_REGIONS.filter((r) => r.id !== 'GLOBAL').map((region) => (
                    <button
                      key={region.id}
                      onClick={() => {
                        const current = crossRegion.targetRegions || []
                        const next = current.includes(region.id)
                          ? current.filter((id) => id !== region.id)
                          : [...current, region.id]
                        updateConfig({ targetRegions: next })
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                        crossRegion.targetRegions?.includes(region.id)
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}>
                      {region.flag} {region.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  <Clock className='w-4 h-4 inline mr-1' />
                  時區與響應
                </label>
                <div className='space-y-3'>
                  <select
                    value={crossRegion.primaryTimezone}
                    onChange={(e) => updateConfig({ primaryTimezone: e.target.value })}
                    className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg'>
                    <option value='UTC+0'>UTC+0 (標準時間)</option>
                    <option value='UTC+8'>UTC+8 (北京/台北/新加坡)</option>
                    <option value='UTC-5'>UTC-5 (美東時間)</option>
                    <option value='UTC-8'>UTC-8 (美西時間)</option>
                    <option value='UTC+1'>UTC+1 (歐洲中部)</option>
                    <option value='UTC+9'>UTC+9 (東京)</option>
                  </select>

                  <div className='flex items-center space-x-3 bg-gray-50 p-3 rounded-lg'>
                    <span className='text-sm text-gray-600'>期望響應時間:</span>
                    <select
                      value={crossRegion.responseTimeHours}
                      onChange={(e) => updateConfig({ responseTimeHours: Number(e.target.value) })}
                      className='bg-transparent border-none text-sm font-medium focus:ring-0 text-blue-600 cursor-pointer'>
                      <option value={4}>4 小時內</option>
                      <option value={8}>8 小時內</option>
                      <option value={12}>12 小時內</option>
                      <option value={24}>24 小時內</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  <MessageSquare className='w-4 h-4 inline mr-1' />
                  溝通頻率
                </label>
                <div className='grid grid-cols-2 gap-2'>
                  {[
                    { v: 'daily', l: '每日例會' },
                    { v: 'weekly', l: '每週例會' },
                    { v: 'biweekly', l: '雙週例會' },
                    { v: 'monthly', l: '月度總結' },
                  ].map((opt) => (
                    <button
                      key={opt.v}
                      onClick={() => updateConfig({ meetingFrequency: opt.v as 'daily' | 'weekly' | 'biweekly' | 'monthly' })}
                      className={`text-sm py-2 rounded-lg border text-center ${
                        crossRegion.meetingFrequency === opt.v
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                          : 'bg-white border-gray-200 text-gray-600'
                      }`}>
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  <ShieldAlert className='w-4 h-4 inline mr-1' />
                  爭議處理機制
                </label>
                <div className='space-y-2'>
                  <label className='flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50'>
                    <input
                      type='radio'
                      checked={crossRegion.disputeHandling === 'regional_first'}
                      onChange={() => updateConfig({ disputeHandling: 'regional_first' })}
                      className='text-blue-600 focus:ring-blue-500'
                    />
                    <div className='ml-3'>
                      <span className='block text-sm font-medium text-gray-900'>區域優先</span>
                      <span className='block text-xs text-gray-500'>先由區域經理介入調解，無效後升級</span>
                    </div>
                  </label>

                  <label className='flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50'>
                    <input
                      type='radio'
                      checked={crossRegion.disputeHandling === 'direct_webadmin'}
                      onChange={() => updateConfig({ disputeHandling: 'direct_webadmin' })}
                      className='text-blue-600 focus:ring-blue-500'
                    />
                    <div className='ml-3'>
                      <span className='block text-sm font-medium text-gray-900'>平台直通</span>
                      <span className='block text-xs text-gray-500'>直接由平台 Webadmin 介入仲裁</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isEnabled && (
          <div className='text-center py-8 text-gray-500'>
            <Globe className='w-12 h-12 mx-auto mb-3 text-gray-300' />
            <p>未啟用跨區域協作配置，將使用默認項目設置。</p>
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
          下一步：發布預覽
        </button>
      </div>
    </div>
  )
}
