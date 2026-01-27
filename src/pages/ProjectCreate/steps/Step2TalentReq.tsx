import React from 'react'
import { StepProps } from '../types'
import { SKILLS, GLOBAL_REGIONS } from '../../../types'
import { Check, Plus, X } from 'lucide-react'

export const Step2TalentReq: React.FC<StepProps> = ({ formData, updateFormData, onNext, onPrev }) => {
  const { talentRequirement } = formData
  const [skillInput, setSkillInput] = React.useState('')

  const handleChange = (field: string, value: any) => {
    updateFormData({
      talentRequirement: {
        ...talentRequirement,
        [field]: value,
      },
    })
  }

  const handleAddSkill = (skill: string) => {
    if (skill && !talentRequirement.skills.includes(skill)) {
      handleChange('skills', [...talentRequirement.skills, skill])
      setSkillInput('')
    }
  }

  const handleRemoveSkill = (skill: string) => {
    handleChange(
      'skills',
      talentRequirement.skills.filter((s) => s !== skill),
    )
  }

  const handleToggleRegion = (regionId: string) => {
    const current = talentRequirement.regionPreference
    if (current.includes(regionId)) {
      handleChange(
        'regionPreference',
        current.filter((r) => r !== regionId),
      )
    } else {
      handleChange('regionPreference', [...current, regionId])
    }
  }

  const isValid = talentRequirement.skills.length > 0

  return (
    <div className='space-y-6 animate-in fade-in slide-in-from-right-4 duration-500'>
      <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
          <span className='bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm'>
            2
          </span>
          人才需求配置
        </h3>

        <div className='space-y-6'>
          {/* Skills Selection */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              所需技能標籤 <span className='text-red-500'>*</span>
            </label>

            {/* Selected Skills */}
            <div className='flex flex-wrap gap-2 mb-3'>
              {talentRequirement.skills.map((skill) => (
                <span
                  key={skill}
                  className='inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm border border-blue-100'>
                  {skill}
                  <button onClick={() => handleRemoveSkill(skill)} className='ml-2 hover:text-blue-900'>
                    <X className='w-3 h-3' />
                  </button>
                </span>
              ))}
            </div>

            {/* Input & Suggestions */}
            <div className='relative'>
              <div className='flex gap-2'>
                <input
                  type='text'
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(skillInput)}
                  placeholder='輸入技能名稱（如 React, Python）'
                  className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                />
                <button
                  onClick={() => handleAddSkill(skillInput)}
                  disabled={!skillInput}
                  className='px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50'>
                  <Plus className='w-5 h-5' />
                </button>
              </div>

              {/* Popular Skills */}
              <div className='mt-3'>
                <p className='text-xs text-gray-500 mb-2'>熱門技能推薦：</p>
                <div className='flex flex-wrap gap-2'>
                  {SKILLS.slice(0, 10).map((skill) => (
                    <button
                      key={skill}
                      onClick={() => handleAddSkill(skill)}
                      disabled={talentRequirement.skills.includes(skill)}
                      className={`text-xs px-2 py-1 rounded border transition-colors ${
                        talentRequirement.skills.includes(skill)
                          ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-default'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                      }`}>
                      + {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Talent Level */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>人才等級要求</label>
              <div className='grid grid-cols-2 gap-3'>
                {[
                  { id: 'junior', label: '初級 (1-3年)' },
                  { id: 'mid', label: '中級 (3-5年)' },
                  { id: 'senior', label: '高級 (5-8年)' },
                  { id: 'expert', label: '專家級 (8年以上)' },
                ].map((level) => (
                  <label
                    key={level.id}
                    className={`flex items-center justify-center px-3 py-2 border rounded-lg cursor-pointer transition-colors ${
                      talentRequirement.level === level.id
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}>
                    <input
                      type='radio'
                      name='level'
                      value={level.id}
                      checked={talentRequirement.level === level.id}
                      onChange={(e) => handleChange('level', e.target.value)}
                      className='sr-only'
                    />
                    <span className='text-sm font-medium'>{level.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Work Mode */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>合作方式</label>
              <div className='grid grid-cols-3 gap-3'>
                {[
                  { id: 'remote', label: '遠程協作' },
                  { id: 'hybrid', label: '混合模式' },
                  { id: 'onsite', label: '駐場開發' },
                ].map((mode) => (
                  <label
                    key={mode.id}
                    className={`flex items-center justify-center px-3 py-2 border rounded-lg cursor-pointer transition-colors ${
                      talentRequirement.workMode === mode.id
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}>
                    <input
                      type='radio'
                      name='workMode'
                      value={mode.id}
                      checked={talentRequirement.workMode === mode.id}
                      onChange={(e) => handleChange('workMode', e.target.value)}
                      className='sr-only'
                    />
                    <span className='text-sm font-medium'>{mode.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Region Preference */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>區域偏好 (可多選)</label>
            <div className='flex flex-wrap gap-3'>
              {GLOBAL_REGIONS.map((region) => (
                <button
                  key={region.id}
                  onClick={() => handleToggleRegion(region.id)}
                  className={`flex items-center px-4 py-2 rounded-lg border text-sm transition-colors ${
                    talentRequirement.regionPreference.includes(region.id)
                      ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-sm'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}>
                  <span className='mr-2'>{region.flag}</span>
                  {region.name}
                  {talentRequirement.regionPreference.includes(region.id) && <Check className='w-3 h-3 ml-2' />}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Requirements */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>其他要求</label>
            <div className='flex space-x-6'>
              <label className='flex items-center space-x-2 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={talentRequirement.requireCase}
                  onChange={(e) => handleChange('requireCase', e.target.checked)}
                  className='rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-gray-300'
                />
                <span className='text-sm text-gray-700'>需要提供過往同類案例</span>
              </label>
              <label className='flex items-center space-x-2 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={talentRequirement.requireTest}
                  onChange={(e) => handleChange('requireTest', e.target.checked)}
                  className='rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-gray-300'
                />
                <span className='text-sm text-gray-700'>需要接受技能測試</span>
              </label>
            </div>
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
          disabled={!isValid}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
            isValid
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}>
          下一步：AI協助配置
        </button>
      </div>
    </div>
  )
}
