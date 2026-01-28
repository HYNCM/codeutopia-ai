import React from 'react'
import { useNavigate } from 'react-router-dom'
import { StepProps } from '../types'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { useProjects } from '../../../contexts/ProjectContext'
import { useAuth } from '../../../contexts/AuthContext'
import { Project, Milestone } from '../../../types'

export const Step8Preview: React.FC<StepProps> = ({ formData, onPrev }) => {
  const navigate = useNavigate()
  const { addProject } = useProjects()
  const { user } = useAuth()
  const { basicInfo, talentRequirement, aiConfig, projectFlow, milestones, settlement, crossRegion } = formData

  const handleSubmit = () => {
    // Construct new project
    const newProject: Project = {
      id: `prj_${Date.now()}`,
      title: basicInfo.title,
      description: basicInfo.description,
      category: basicInfo.category as any,
      subcategory: basicInfo.subcategory,
      clientId: user?.id || 'unknown_client',
      clientName: user?.name || 'Unknown Client',
      clientAvatar: user?.avatar || '',
      status: 'open',
      budget: {
        min: basicInfo.budgetMin,
        max: basicInfo.budgetMax,
        currency: basicInfo.currency,
      },
      duration: basicInfo.duration,
      skills: talentRequirement.skills,
      milestones: milestones.map((m, idx) => ({
        id: m.id || `m_${Date.now()}_${idx}`,
        title: m.title,
        description: m.description,
        amount: m.budgetAmount,
        dueDate: m.plannedEndDate,
        status: 'pending',
        deliverables: m.humanDeliverables.map((d) => d.name),
        humanDeliverables: m.humanDeliverables,
        aiDeliverables: m.aiDeliverables,
        acceptanceCriteria: m.acceptanceCriteria,
        order: m.order,
      })),
      bids: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      visibility: (projectFlow.visibility as any) || 'public',
      escrowBalance: 0,
      totalPaid: 0,
    }

    addProject(newProject)
    alert('項目已提交發布！')
    navigate('/dashboard/initiator')
  }

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6'>
      <h3 className='text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100'>{title}</h3>
      {children}
    </div>
  )

  const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className='flex justify-between py-2 text-sm'>
      <span className='text-gray-500'>{label}</span>
      <span className='font-medium text-gray-900 text-right'>{value}</span>
    </div>
  )

  return (
    <div className='space-y-6 animate-in fade-in slide-in-from-right-4 duration-500'>
      <div className='bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start space-x-3'>
        <AlertCircle className='w-5 h-5 text-blue-600 mt-0.5' />
        <div>
          <h4 className='text-sm font-medium text-blue-900'>發布前確認</h4>
          <p className='text-sm text-blue-700 mt-1'>
            請仔細核對項目信息。項目發布後，部分關鍵信息（如預算、里程碑交付物）將無法隨意修改，需經雙方同意。
          </p>
        </div>
      </div>

      <Section title='1. 基本信息'>
        <InfoRow label='項目標題' value={basicInfo.title} />
        <InfoRow label='類別' value={`${basicInfo.category} / ${basicInfo.subcategory}`} />
        <InfoRow label='區域' value={basicInfo.region} />
        <InfoRow
          label='預算範圍'
          value={`${basicInfo.currency} ${basicInfo.budgetMin.toLocaleString()} - ${basicInfo.budgetMax.toLocaleString()}`}
        />
      </Section>

      <Section title='2. 人才需求'>
        <InfoRow label='技能需求' value={talentRequirement.skills.join(', ') || '未指定'} />
        <InfoRow label='資深程度' value={talentRequirement.level} />
        <InfoRow label='工作模式' value={talentRequirement.workMode} />
        <InfoRow label='需求人數' value={talentRequirement.count} />
      </Section>

      <Section title='3. AI 協助配置'>
        <InfoRow label='AI 協助狀態' value={aiConfig.enabled ? '已啟用' : '未啟用'} />
        {aiConfig.enabled && (
          <div className='mt-3 pt-3 border-t border-gray-100'>
            <div className='text-sm text-gray-500 mb-2'>已選角色:</div>
            <div className='flex flex-wrap gap-2'>
              {aiConfig.roles.map((r) => (
                <span
                  key={r.roleId}
                  className='px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium border border-blue-100'>
                  {r.roleId}
                </span>
              ))}
            </div>
          </div>
        )}
      </Section>

      <Section title='4. 流程與開發'>
        <InfoRow label='開發模式' value={projectFlow.developmentType} />
        <InfoRow label='可見性' value={projectFlow.visibility} />
        {projectFlow.developmentType.includes('device') && (
          <InfoRow label='硬件設備' value={projectFlow.codeBoxConfig?.deviceModel || '未指定'} />
        )}
      </Section>

      <Section title='5. 里程碑計劃'>
        <div className='space-y-3'>
          {milestones.map((m, idx) => (
            <div key={m.id} className='bg-gray-50 p-3 rounded-lg text-sm border border-gray-100'>
              <div className='flex justify-between font-medium mb-1'>
                <span>
                  {idx + 1}. {m.title}
                </span>
                <span>{m.budgetPercentage}%</span>
              </div>
              <div className='text-gray-500 text-xs truncate'>{m.description}</div>
            </div>
          ))}
          <div className='flex justify-between pt-2 font-medium'>
            <span>總計</span>
            <span>{milestones.reduce((acc, m) => acc + m.budgetPercentage, 0)}%</span>
          </div>
        </div>
      </Section>

      <Section title='6. 結算配置'>
        <InfoRow label='支付渠道' value={settlement.paymentChannel} />
        <InfoRow label='資金託管' value={settlement.escrowEnabled ? '開啟' : '關閉'} />
        <InfoRow label='發票要求' value={settlement.invoiceRequired ? '需要' : '不需要'} />
      </Section>

      {crossRegion && (
        <Section title='7. 跨區域協作'>
          <InfoRow label='目標區域' value={crossRegion.targetRegions.join(', ') || 'Global'} />
          <InfoRow label='主要時區' value={crossRegion.primaryTimezone} />
          <InfoRow label='溝通頻率' value={crossRegion.meetingFrequency} />
        </Section>
      )}

      <div className='flex justify-between'>
        <button
          onClick={onPrev}
          className='px-6 py-2.5 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors'>
          上一步
        </button>
        <button
          onClick={handleSubmit}
          className='px-8 py-2.5 rounded-lg font-medium bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg transition-all flex items-center'>
          <CheckCircle className='w-5 h-5 mr-2' />
          確認並發布項目
        </button>
      </div>
    </div>
  )
}
