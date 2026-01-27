import React, { useState } from 'react'
import { ProjectCreateFormData } from '../../types'
import { INITIAL_FORM_DATA } from './constants'
import { Step1BasicInfo } from './steps/Step1BasicInfo'
import { Step2TalentReq } from './steps/Step2TalentReq'
import { Step3AIConfig } from './steps/Step3AIConfig'
import { Step4Flow } from './steps/Step4Flow'
import { Step5Milestones } from './steps/Step5Milestones'
import { Step6Settlement } from './steps/Step6Settlement'
import { Step7CrossRegion } from './steps/Step7CrossRegion'
import { Step8Preview } from './steps/Step8Preview'
import { ChevronRight } from 'lucide-react'

const STEPS = [
  { id: 1, title: '基本信息', desc: '項目核心要素' },
  { id: 2, title: '人才需求', desc: '技能與等級' },
  { id: 3, title: 'AI 配置', desc: '角色與權限' },
  { id: 4, title: '流程開發', desc: '模式與工具' },
  { id: 5, title: '里程碑', desc: '規劃與交付' },
  { id: 6, title: '資金結算', desc: '支付與託管' },
  { id: 7, title: '協作規則', desc: '時區與權限' },
  { id: 8, title: '預覽發布', desc: '確認與提交' },
]

export const ProjectCreatePage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<ProjectCreateFormData>(INITIAL_FORM_DATA)

  const updateFormData = (updates: Partial<ProjectCreateFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
      window.scrollTo(0, 0)
    }
  }

  const renderStep = () => {
    const props = {
      formData,
      updateFormData,
      onNext: nextStep,
      onPrev: prevStep,
    }

    switch (currentStep) {
      case 1:
        return <Step1BasicInfo {...props} />
      case 2:
        return <Step2TalentReq {...props} />
      case 3:
        return <Step3AIConfig {...props} />
      case 4:
        return <Step4Flow {...props} />
      case 5:
        return <Step5Milestones {...props} />
      case 6:
        return <Step6Settlement {...props} />
      case 7:
        return <Step7CrossRegion {...props} />
      case 8:
        return <Step8Preview {...props} />
      default:
        return null
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 pb-20'>
      {/* Header / Stepper */}
      <div className='bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='py-4'>
            <h1 className='text-2xl font-bold text-gray-900 mb-6'>發布新項目</h1>

            {/* Progress Bar */}
            <div className='relative'>
              <div className='overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100'>
                <div
                  style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
                  className='shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500 ease-out'
                />
              </div>

              {/* Steps Text - Hidden on mobile, shown on md+ */}
              <div className='hidden md:flex justify-between text-xs text-gray-500'>
                {STEPS.map((step) => (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center ${
                      step.id === currentStep
                        ? 'text-blue-600 font-bold'
                        : step.id < currentStep
                          ? 'text-green-600'
                          : ''
                    }`}>
                    <span className='mb-1'>Step {step.id}</span>
                    <span>{step.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>{renderStep()}</main>
    </div>
  )
}

export default ProjectCreatePage
