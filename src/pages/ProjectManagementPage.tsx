import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FileText, DollarSign, Users, CheckCircle } from 'lucide-react'
import { AIAssistantPanel } from '../components/AIAssistantPanel'
import { SubmitDeliverableModal } from '../components/SubmitDeliverableModal'
import { ReviewSubmissionModal } from '../components/ReviewSubmissionModal'
import { SubmitBidModal } from '../components/Project/SubmitBidModal'
import { BidList } from '../components/Project/BidList'
import { MilestoneList } from '../components/Project/MilestoneList'
import { ProjectHeader } from './Project/components/ProjectHeader'
import { ProjectInfoSidebar } from './Project/components/ProjectInfoSidebar'
import { useProjects } from '../contexts/ProjectContext'
import { useAuth } from '../contexts/AuthContext'
import { useWallet } from '../contexts/WalletContext'
import { useAI } from '../contexts/AIContext'
import { Bid, MilestoneSubmission } from '../types'

// ... (retain View Interface definitions to keep independent or import if shared)
// For simplicity, we redefine them here implicitly or cleaner if we move them to types/viewTypes.ts later.
// For now, we reuse the local interfaces from the previous file content but cleaned up.

// Re-defining interface locally for self-containment as requested by "Rewrite entire file"
// Ideally these should be in a shared type file.
export interface ViewMilestone {
  id: string
  title: string
  description: string
  status:
    | 'pending'
    | 'in_progress'
    | 'review'
    | 'completed'
    | 'submitted'
    | 'approved'
    | 'rejected'
    | 'disputed'
    | 'paid'
  progress: number
  startDate: string
  dueDate: string
  budget: number
  currency: string
  assignedTo: string[]
  deliverables: { id: string; name: string }[]
  submission?: MilestoneSubmission
}

export interface ViewProject {
  id: string
  title: string
  description: string
  status: 'planning' | 'in_progress' | 'review' | 'completed' | 'cancelled'
  category: string
  region: string
  startDate: string
  endDate: string
  totalBudget: number
  currency: string
  spentBudget: number
  progress: number
  initiator: string
  initiatorId: string
  contractor: string
  milestones: ViewMilestone[]
  aiCollaboration: boolean
  tags: string[]
  bidsCount: number
  bids?: Bid[]
}

const ProjectManagementPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { projects, acceptBid, submitBid } = useProjects() // Added submitBid
  const { escrowLock } = useWallet()
  const { setContext } = useAI()

  // State
  const [activeTab, setActiveTab] = useState<'details' | 'milestones' | 'bids' | 'payments'>('details')
  const [showAIPanel, setShowAIPanel] = useState(false)

  // Modals
  const [submitModalOpen, setSubmitModalOpen] = useState(false) // For Milestones
  const [reviewModalOpen, setReviewModalOpen] = useState(false) // For Milestones
  const [bidModalOpen, setBidModalOpen] = useState(false) // For Bids

  const [activeMilestoneForSubmit, setActiveMilestoneForSubmit] = useState<{ id: string; title: string } | null>(null)
  const [activeMilestoneForReview, setActiveMilestoneForReview] = useState<{
    id: string
    title: string
    amount: number
    submission: MilestoneSubmission | null
  } | null>(null)

  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null)

  // Load Tab from Hash
  useEffect(() => {
    if (window.location.hash) {
      const tab = window.location.hash.replace('#', '')
      if (['details', 'bids', 'milestones', 'payments'].includes(tab)) {
        setActiveTab(tab as any)
      }
    }
  }, [])

  // Find global project
  const globalProject = projects.find((p) => p.id === id)

  // AI Context Injection
  useEffect(() => {
    if (globalProject) {
      setContext({
        type: 'project_detail',
        data: {
          projectId: globalProject.id,
          projectTitle: globalProject.title,
          status: globalProject.status,
          bidsCount: globalProject.bids?.length || 0,
        },
      })
    }
  }, [globalProject, setContext])

  // View Adapter
  const viewProject: ViewProject | null = useMemo(() => {
    if (!globalProject) return null

    const completedMilestones = globalProject.milestones.filter(
      (m) => m.status === 'approved' || m.status === 'paid',
    ).length
    const calcProgress =
      globalProject.milestones.length > 0
        ? Math.round((completedMilestones / globalProject.milestones.length) * 100)
        : 0

    const spent = globalProject.milestones
      .filter((m) => ['paid', 'approved'].includes(m.status))
      .reduce((acc, m) => acc + m.amount, 0)

    return {
      id: globalProject.id,
      title: globalProject.title,
      description: globalProject.description,
      status: globalProject.status === 'open' ? 'planning' : (globalProject.status as any),
      category: globalProject.category,
      region: 'Global',
      startDate: new Date(globalProject.createdAt).toLocaleDateString(),
      endDate: 'TBD',
      totalBudget: globalProject.budget.max,
      currency: globalProject.budget.currency,
      spentBudget: spent,
      progress: calcProgress,
      initiator: globalProject.clientName,
      initiatorId: globalProject.clientId,
      contractor: globalProject.bids?.find((b) => b.status === 'accepted')?.developerName || 'Pending',
      aiCollaboration: !!globalProject.aiAnalysis,
      tags: globalProject.skills,
      bidsCount: globalProject.bids?.length || 0,
      bids: globalProject.bids,
      milestones: globalProject.milestones.map((m, idx) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        status: m.status === 'paid' ? 'completed' : (m.status as any),
        progress: m.status === 'paid' || m.status === 'approved' ? 100 : 0,
        startDate: 'TBD',
        dueDate: m.dueDate,
        budget: m.amount,
        currency: globalProject.budget.currency,
        assignedTo: ['Dev Team'],
        submission: m.submission,
        deliverables:
          m.humanDeliverables?.map((d) => ({ id: d.id, name: d.name })) ||
          m.deliverables.map((d, i) => ({ id: `${m.id}_d_${i}`, name: d })),
      })),
    }
  }, [globalProject])

  // Role Checks
  const isContractor = useMemo(() => {
    /* 
       Ideally, we check if the user is THE assigned contractor.
       But for bidding, we also need to know if they represent A contractor (any user who is not the owner).
       Let's simplify: 
       - isOwner: true if user.id == initiatorId
       - isAssignedContractor: true if user.id == acceptedBid.developerId
       - canBid: true if !isOwner && !isAssignedContractor && project.status == 'planning' (open)
    */
    if (!viewProject || !user) return false
    const acceptedBid = viewProject.bids?.find((b) => b.status === 'accepted')
    return acceptedBid?.developerId === user.id
  }, [viewProject, user])

  // Check if current user has already bid
  const hasUserBid = useMemo(() => {
    if (!viewProject || !user || !viewProject.bids) return false
    return viewProject.bids.some((b) => b.developerId === user.id)
  }, [viewProject, user])

  const isOwner = useMemo(() => {
    if (!viewProject || !user) return false
    return viewProject.initiatorId === user.id
  }, [viewProject, user])

  // Handlers
  const handleBidSubmit = (data: { amount: number; days: number; proposal: string }) => {
    if (!user || !viewProject) return
    const newBid: Bid = {
      id: `bid_${Date.now()}`,
      projectId: viewProject.id,
      developerId: user.id,
      developerName: user.name,
      developerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.name,
      developerRating: 4.8, // Mock
      proposedPrice: data.amount,
      deliveryDays: data.days,
      proposal: data.proposal,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    submitBid(viewProject.id, newBid)
    alert('报价已提交！等待项目方审核。')
  }

  if (!viewProject) {
    return <div className='p-10 text-center'>Project Not Found</div>
  }

  return (
    <div className='pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6'>
      <ProjectHeader project={viewProject} showAIPanel={showAIPanel} setShowAIPanel={setShowAIPanel} />

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Left Sidebar */}
        <div className='lg:col-span-1'>
          <ProjectInfoSidebar project={viewProject} />

          {/* Action Button for Contractor (Submit Bid) */}
          {!isOwner && !hasUserBid && viewProject.status === 'planning' && (
            <div className='mt-6'>
              <button
                onClick={() => setBidModalOpen(true)}
                className='w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center space-x-2'>
                <DollarSign className='w-5 h-5' />
                <span>立即报价</span>
              </button>
              <p className='text-xs text-center text-gray-500 mt-2'>已有 {viewProject.bidsCount} 人参与竞标</p>
            </div>
          )}

          {/* Status for Contractor (Bid Submitted) */}
          {!isOwner && hasUserBid && viewProject.status === 'planning' && (
            <div className='mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-center'>
              <p className='text-yellow-800 font-medium'>已提交报价</p>
              <p className='text-xs text-yellow-600/80 mt-1'>请耐心等待项目方审核</p>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Tabs */}
          <div className='flex space-x-1 border-b border-gray-200'>
            {[
              { id: 'details', label: '详情', icon: FileText },
              { id: 'milestones', label: '里程碑', icon: CheckCircle },
              { id: 'bids', label: '竞标', icon: Users },
              { id: 'payments', label: '资金', icon: DollarSign },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any)
                  window.location.hash = tab.id
                }}
                className={`flex items-center px-6 py-3 border-b-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}>
                <tab.icon className='w-4 h-4 mr-2' />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className='bg-white rounded-xl p-6 border border-gray-200 shadow-sm'>
              <h3 className='text-lg font-bold text-gray-900 mb-4'>项目描述</h3>
              <p className='text-gray-600 whitespace-pre-line leading-relaxed'>{viewProject.description}</p>
              <h3 className='text-lg font-bold text-gray-900 mt-8 mb-4'>技能需求</h3>
              <div className='flex flex-wrap gap-2'>
                {viewProject.tags.map((tag) => (
                  <span key={tag} className='px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600'>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Milestones Tab */}
          {activeTab === 'milestones' && (
            <MilestoneList
              milestones={viewProject.milestones}
              isOwner={isOwner}
              isContractor={!isOwner} /* Allowing any viewer to see, but actions restricted inside list */
              selectedMilestoneId={selectedMilestone}
              onSelectMilestone={setSelectedMilestone}
              onOpenSubmit={(m) => {
                // Determine if user can submit (must be assigned contractor)
                if (isContractor) {
                  setActiveMilestoneForSubmit({ id: m.id, title: m.title })
                  setSubmitModalOpen(true)
                } else {
                  alert('您不是该项目的获选开发者，无法提交交付物。')
                }
              }}
              onOpenReview={(m) => {
                setActiveMilestoneForReview({
                  id: m.id,
                  title: m.title,
                  amount: m.amount,
                  submission: m.submission!,
                })
                setReviewModalOpen(true)
              }}
            />
          )}

          {/* Bids Tab */}
          {activeTab === 'bids' && (
            <BidList
              bids={viewProject.bids}
              currency={viewProject.currency}
              onAccept={async (bid) => {
                if (!isOwner) return
                if (window.confirm(`确认接受 ${bid.developerName} 的方案？`)) {
                  try {
                    await escrowLock(viewProject.id, bid.proposedPrice, viewProject.title)
                    acceptBid(viewProject.id, bid.id, bid.proposedPrice)
                    alert('方案已接受，项目启动！')
                  } catch (err: any) {
                    alert('操作失败: ' + err.message)
                  }
                }
              }}
            />
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className='bg-white rounded-xl p-12 border border-gray-200 text-center text-gray-500'>
              资金结算功能开发中
            </div>
          )}
        </div>
      </div>

      {/* Modals & Panels */}
      {showAIPanel && (
        <AIAssistantPanel
          projectId={viewProject.id}
          currentRole={isOwner ? 'project_initiator' : 'contractor'}
          onTaskComplete={() => {}}
          codeBoxCompatible={false}
        />
      )}

      <SubmitBidModal
        isOpen={bidModalOpen}
        onClose={() => setBidModalOpen(false)}
        onSubmit={handleBidSubmit}
        currency={viewProject.currency}
        budgetMax={viewProject.totalBudget}
      />

      {activeMilestoneForSubmit && (
        <SubmitDeliverableModal
          isOpen={submitModalOpen}
          onClose={() => setSubmitModalOpen(false)}
          projectId={viewProject.id}
          milestoneId={activeMilestoneForSubmit.id}
          milestoneTitle={activeMilestoneForSubmit.title}
        />
      )}

      {activeMilestoneForReview && (
        <ReviewSubmissionModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          projectId={viewProject.id}
          milestoneId={activeMilestoneForReview.id}
          milestoneTitle={activeMilestoneForReview.title}
          milestoneAmount={activeMilestoneForReview.amount}
          contractorId={viewProject.bids?.find((b) => b.status === 'accepted')?.developerId || ''}
          submission={activeMilestoneForReview.submission} // Non-null assertion safe here as check is in handler
        />
      )}
    </div>
  )
}

export default ProjectManagementPage
