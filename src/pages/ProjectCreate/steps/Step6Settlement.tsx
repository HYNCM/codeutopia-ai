import React from 'react'
import { StepProps } from '../types'
import { PAYMENT_CHANNELS, PaymentChannel } from '../../../types'
import { CreditCard, DollarSign, Shield, AlertTriangle, FileText } from 'lucide-react'

export const Step6Settlement: React.FC<StepProps> = ({ formData, updateFormData, onNext, onPrev }) => {
  const { settlement, basicInfo } = formData

  const updateSettlement = (updates: Partial<typeof settlement>) => {
    updateFormData({
      settlement: {
        ...settlement,
        ...updates,
      },
    })
  }

  return (
    <div className='space-y-6 animate-in fade-in slide-in-from-right-4 duration-500'>
      <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-8'>
        <div>
          <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
            <span className='bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm'>
              6
            </span>
            支付與結算配置
          </h3>

          <label className='block text-sm font-medium text-gray-700 mb-3'>支付渠道</label>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {PAYMENT_CHANNELS.map((channel) => (
              <button
                key={channel.id}
                onClick={() => updateSettlement({ paymentChannel: channel.id as PaymentChannel })}
                className={`flex items-center p-4 border rounded-xl transition-all ${
                  settlement.paymentChannel === channel.id
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                    settlement.paymentChannel === channel.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                  <CreditCard className='w-5 h-5' />
                </div>
                <div className='text-left'>
                  <div className='font-medium text-gray-900'>{channel.name}</div>
                  <div className='text-xs text-gray-500 mt-0.5'>支持區域: {channel.regions.join(', ')}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='space-y-4'>
            <div>
              <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                <Shield className='w-4 h-4 mr-2 text-green-600' />
                資金託管 (Escrow)
              </label>
              <label className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={settlement.escrowEnabled}
                  onChange={(e) => updateSettlement({ escrowEnabled: e.target.checked })}
                  className='w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300'
                />
                <span className='text-sm text-gray-700'>啟用平台資金託管服務 (推薦)</span>
              </label>
              <p className='text-xs text-gray-500 mt-2 px-1'>
                啟用託管可保障雙方權益，資金將在每個里程碑驗收通過後自動釋放。
              </p>
            </div>

            <div>
              <label className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                <FileText className='w-4 h-4 mr-2 text-gray-600' />
                發票要求
              </label>
              <div className='flex space-x-4'>
                <label className='flex items-center space-x-2'>
                  <input
                    type='radio'
                    checked={settlement.invoiceRequired}
                    onChange={() => updateSettlement({ invoiceRequired: true })}
                    className='text-blue-600 focus:ring-blue-500'
                  />
                  <span className='text-sm text-gray-700'>需要發票</span>
                </label>
                <label className='flex items-center space-x-2'>
                  <input
                    type='radio'
                    checked={!settlement.invoiceRequired}
                    onChange={() => updateSettlement({ invoiceRequired: false })}
                    className='text-blue-600 focus:ring-blue-500'
                  />
                  <span className='text-sm text-gray-700'>不需要</span>
                </label>
              </div>

              {settlement.invoiceRequired && (
                <select
                  value={settlement.invoiceType}
                  onChange={(e) => updateSettlement({ invoiceType: e.target.value as any })}
                  className='mt-2 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg'>
                  <option value='electronic'>電子發票 (PDF)</option>
                  <option value='paper'>紙質發票 (郵寄)</option>
                </select>
              )}
            </div>
          </div>

          <div className='space-y-4'>
            <div className='bg-orange-50 p-4 rounded-lg border border-orange-100'>
              <label className='flex items-center text-sm font-medium text-orange-900 mb-3'>
                <AlertTriangle className='w-4 h-4 mr-2' />
                違約責任配置
              </label>

              <div className='space-y-3'>
                <div>
                  <div className='flex justify-between text-xs text-orange-800 mb-1'>
                    <span>逾期違約金 (每日比例)</span>
                    <span>{settlement.lateFeePercentage}%</span>
                  </div>
                  <input
                    type='range'
                    min='0'
                    max='5'
                    step='0.1'
                    value={settlement.lateFeePercentage}
                    onChange={(e) => updateSettlement({ lateFeePercentage: Number(e.target.value) })}
                    className='w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer'
                  />
                </div>

                <div>
                  <div className='flex justify-between text-xs text-orange-800 mb-1'>
                    <span>違約金上限 (總額比例)</span>
                    <span>{settlement.lateFeeMaxPercentage}%</span>
                  </div>
                  <input
                    type='range'
                    min='0'
                    max='50'
                    step='1'
                    value={settlement.lateFeeMaxPercentage}
                    onChange={(e) => updateSettlement({ lateFeeMaxPercentage: Number(e.target.value) })}
                    className='w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer'
                  />
                </div>
              </div>
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
          className='px-6 py-2.5 rounded-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg transition-all'>
          下一步：預覽與發布
        </button>
      </div>
    </div>
  )
}
