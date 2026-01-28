import React from 'react'
import { StepProps } from '../types'
import { PROJECT_CATEGORIES, CURRENCIES, GLOBAL_REGIONS } from '../../../types'
import { Info, HelpCircle } from 'lucide-react'

export const Step1BasicInfo: React.FC<StepProps> = ({ formData, updateFormData, onNext }) => {
  const { basicInfo } = formData

  const handleChange = <K extends keyof typeof basicInfo>(field: K, value: typeof basicInfo[K]) => {
    updateFormData({
      basicInfo: {
        ...basicInfo,
        [field]: value,
      },
    })
  }

  const handleSubcategoryChange = (catValue: string) => {
    const category = PROJECT_CATEGORIES.find((c) => c.value === catValue)
    updateFormData({
      basicInfo: {
        ...basicInfo,
        category: catValue,
        subcategory: category?.subcategories[0] || '',
      },
    })
  }

  const isValid = basicInfo.title && basicInfo.category && basicInfo.description && basicInfo.budgetMax > 0

  return (
    <div className='space-y-6 animate-in fade-in slide-in-from-right-4 duration-500'>
      <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
          <span className='bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm'>
            1
          </span>
          項目基本信息
        </h3>

        <div className='space-y-4'>
          {/* Project Title */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              項目名稱 <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              value={basicInfo.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder='e.g. 跨境電商多語言平台開發'
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>

          {/* Category Selection */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                項目類別 <span className='text-red-500'>*</span>
              </label>
              <select
                value={basicInfo.category}
                onChange={(e) => handleSubcategoryChange(e.target.value)}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'>
                <option value=''>請選擇類別</option>
                {PROJECT_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>子類別</label>
              <select
                value={basicInfo.subcategory}
                onChange={(e) => handleChange('subcategory', e.target.value)}
                disabled={!basicInfo.category}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100'>
                {basicInfo.category ? (
                  PROJECT_CATEGORIES.find((c) => c.value === basicInfo.category)?.subcategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))
                ) : (
                  <option value=''>請先選擇主類別</option>
                )}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              項目描述 <span className='text-red-500'>*</span>
            </label>
            <textarea
              value={basicInfo.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={6}
              placeholder='請詳細描述您的項目需求、目標用戶、核心功能以及期望的成果...'
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
            <p className='text-xs text-gray-500 mt-1 flex items-center'>
              <Info className='w-3 h-3 mr-1' />
              描述越詳細，AI匹配的人才越精準
            </p>
          </div>

          {/* Region & Duration */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>目標區域</label>
              <select
                value={basicInfo.region}
                onChange={(e) => handleChange('region', e.target.value)}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'>
                {GLOBAL_REGIONS.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.flag} {region.name} ({region.name_en})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>項目週期</label>
              <select
                value={basicInfo.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'>
                <option value='short'>短期 (小於1個月)</option>
                <option value='long'>長期 (1-6個月)</option>
                <option value='flexible'>靈活週期 (大於6個月)</option>
              </select>
            </div>
          </div>

          {/* Budget */}
          <div className='p-4 bg-gray-50 rounded-lg border border-gray-200'>
            <h4 className='text-sm font-medium text-gray-900 mb-3 flex items-center'>
              項目預算設置
              <button className='ml-2 text-gray-400 hover:text-gray-600'>
                <HelpCircle className='w-4 h-4' />
              </button>
            </h4>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <label className='block text-xs font-medium text-gray-500 mb-1'>預算類型</label>
                <select
                  value={basicInfo.budgetType}
                  onChange={(e) => handleChange('budgetType', e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'>
                  <option value='fixed'>固定預算</option>
                  <option value='hourly'>按小時計費</option>
                  <option value='monthly'>按月訂閱</option>
                </select>
              </div>
              <div>
                <label className='block text-xs font-medium text-gray-500 mb-1'>貨幣</label>
                <select
                  value={basicInfo.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'>
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-xs font-medium text-gray-500 mb-1'>
                  預算金額{' '}
                  {basicInfo.budgetType === 'fixed'
                    ? '(總價)'
                    : basicInfo.budgetType === 'hourly'
                      ? '(時薪)'
                      : '(月費)'}
                </label>
                <div className='flex items-center space-x-2'>
                  <input
                    type='number'
                    value={basicInfo.budgetMin}
                    onChange={(e) => handleChange('budgetMin', Number(e.target.value))}
                    placeholder='Min'
                    className='w-1/2 px-3 py-2 border border-gray-300 rounded-md text-sm'
                  />
                  <span className='text-gray-400'>-</span>
                  <input
                    type='number'
                    value={basicInfo.budgetMax}
                    onChange={(e) => handleChange('budgetMax', Number(e.target.value))}
                    placeholder='Max'
                    className='w-1/2 px-3 py-2 border border-gray-300 rounded-md text-sm'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='flex justify-end'>
        <button
          onClick={onNext}
          disabled={!isValid}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
            isValid
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}>
          下一步：人才需求
        </button>
      </div>
    </div>
  )
}
