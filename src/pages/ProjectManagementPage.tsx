import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Briefcase,
  CheckCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  ChevronRight,
  ArrowRight,
  Play,
  Pause,
  MoreVertical,
  Plus,
  Edit,
  Trash2,
  Eye,
  Send,
  Star,
  TrendingUp,
  MapPin,
  Globe,
  Zap,
  Search,
  Filter,
  X,
  Download,
  Upload,
  RefreshCw,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react'
import { AIAssistantPanel } from '../components/AIAssistantPanel'
import { SubmitDeliverableModal } from '../components/SubmitDeliverableModal'
import { ReviewSubmissionModal } from '../components/ReviewSubmissionModal'
import { BidList } from '../components/Project/BidList'
import { MilestoneList } from '../components/Project/MilestoneList'
import { useProjects } from '../contexts/ProjectContext'
import { useAuth } from '../contexts/AuthContext'
import { useWallet } from '../contexts/WalletContext'
import { useAI } from '../contexts/AIContext'
import { Project as GlobalProject, Milestone as GlobalMilestone, Bid, MilestoneSubmission } from '../types'

// UI-Specific Types (Extended from Global Types for View)
interface ViewMilestone {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'submitted' | 'approved' | 'rejected' | 'disputed' | 'paid'
  progress: number
  startDate: string
  dueDate: string
  budget: number
  currency: string
  assignedTo: string[]
  deliverables: ViewDeliverable[]
  aiTasks: ViewAITask[]
  comments: ViewComment[]
  submission?: MilestoneSubmission
}

interface ViewDeliverable {
  id: string
  name: string
  status: 'pending' | 'submitted' | 'approved' | 'rejected' | 'in_progress'
  fileUrl?: string
  submittedAt?: string
  approvedAt?: string
}

interface ViewAITask {
  id: string
  aiRole: string
  task: string
  status: 'pending' | 'in_progress' | 'completed'
  result?: string
  createdAt: string
  completedAt?: string
}

interface ViewComment {
  id: string
  author: string
  content: string
  createdAt: string
  attachments?: string[]
}

interface ViewProject {
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
  initiatorId: string // Added for permission check
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
  const { projects, acceptBid } = useProjects()
  const { escrowLock } = useWallet()
  const { setContext } = useAI()

  const [submitModalOpen, setSubmitModalOpen] = useState(false)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [activeMilestoneForSubmit, setActiveMilestoneForSubmit] = useState<{ id: string; title: string } | null>(null)
  const [activeMilestoneForReview, setActiveMilestoneForReview] = useState<{
    id: string
    title: string
    amount: number
    submission: MilestoneSubmission | null
  } | null>(null)

  const [activeTab, setActiveTab] = useState<'projects' | 'bids' | 'milestones' | 'details' | 'payments'>(
    (window.location.hash.replace('#', '') as any) || 'details',
  )

  useEffect(() => {
    if (window.location.hash) {
      const tab = window.location.hash.replace('#', '')
      if (['details', 'bids', 'milestones', 'payments'].includes(tab)) {
        setActiveTab(tab as any)
      }
    }
  }, [])
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null)
  const [showAIPanel, setShowAIPanel] = useState(false)

  // Find the global project
  const globalProject = projects.find((p) => p.id === id)

  // Inject AI Context: Let Cortex know we're viewing project details
  useEffect(() => {
    if (globalProject) {
      setContext({
        type: 'project_detail',
        data: {
          projectId: globalProject.id,
          projectTitle: globalProject.title,
          status: globalProject.status,
          budget: globalProject.budget,
          bidsCount: globalProject.bids?.length || 0,
          milestonesCount: globalProject.milestones.length,
          activeTab,
        }
      })
    }
  }, [globalProject, activeTab, setContext])

  // Listen for AI Action events (e.g., highlight_risk, navigate)
  useEffect(() => {
    const handleAIAction = (event: CustomEvent) => {
      const { type, payload } = event.detail;
      
      if (type === 'highlight_risk' && payload?.milestoneId) {
        // Switch to milestones tab and select the risky milestone
        setActiveTab('milestones');
        setSelectedMilestone(payload.milestoneId);
        
        // Scroll to milestone after tab switch
        setTimeout(() => {
          const element = document.getElementById(`milestone-${payload.milestoneId}`);
          element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element?.classList.add('ring-2', 'ring-red-500', 'ring-offset-2');
          setTimeout(() => element?.classList.remove('ring-2', 'ring-red-500', 'ring-offset-2'), 3000);
        }, 100);
      } else if (type === 'navigate' && payload?.tab) {
        setActiveTab(payload.tab);
      }
    };

    window.addEventListener('ai_action', handleAIAction as EventListener);
    return () => window.removeEventListener('ai_action', handleAIAction as EventListener);
  }, []);

  // Adapter: Convert GlobalProject to ViewProject
  const viewProject: ViewProject | null = useMemo(() => {
    if (!globalProject) return null

    // Calculate progress based on milestones
    const completedMilestones = globalProject.milestones.filter(
      (m) => m.status === 'approved' || m.status === 'paid',
    ).length
    const totalMilestones = globalProject.milestones.length
    const calcProgress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0

    // Calculate spent budget
    const spent = globalProject.milestones
      .filter((m) => ['paid', 'approved'].includes(m.status))
      .reduce((acc, m) => acc + m.amount, 0)

    return {
      id: globalProject.id,
      title: globalProject.title,
      description: globalProject.description,
      status:
        globalProject.status === 'open'
          ? 'planning'
          : globalProject.status === 'in_progress'
            ? 'in_progress'
            : globalProject.status === 'completed'
              ? 'completed'
              : 'planning',
      category: globalProject.category,
      region: 'Global', // Default as it's not on project root
      startDate: new Date(globalProject.createdAt).toLocaleDateString(),
      endDate: 'TBD', // simplified
      totalBudget: globalProject.budget.max,
      currency: globalProject.budget.currency,
      spentBudget: spent,
      progress: calcProgress,
      initiator: globalProject.clientName,
      initiatorId: globalProject.clientId,
      contractor: globalProject.bids?.find((b) => b.status === 'accepted')?.developerName || 'Pending Assignment',
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
        assignedTo: ['Dev Team'], // Mock
        submission: m.submission,
        // Convert string[] deliverables to objects
        deliverables: m.humanDeliverables?.length
          ? m.humanDeliverables.map((d) => ({
              id: d.id,
              name: d.name,
              status: 'pending' as const,
            }))
          : m.deliverables.map((d, i) => ({
              id: `${m.id}_d_${i}`,
              name: d,
              status: 'pending' as const,
            })),
        aiTasks:
          m.aiDeliverables?.map((d) => ({
            id: d.id,
            aiRole: 'AI Agent',
            task: d.name,
            status: 'pending' as const,
            createdAt: new Date().toISOString(),
          })) || [],
        comments: [], // Mock
      })),
    }
  }, [globalProject])

  useEffect(() => {
    if (!globalProject && id) {
      // If project not found in context, maybe go back to dashboard
      // console.warn('Project not found')
    }
  }, [globalProject, id])

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planning: 'bg-gray-100 text-gray-700',
      in_progress: 'bg-blue-100 text-blue-700',
      review: 'bg-yellow-100 text-yellow-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      pending: 'bg-gray-100 text-gray-700',
      disputed: 'bg-red-100 text-red-700',
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const getMilestoneStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className='w-5 h-5 text-green-500' />
      case 'in_progress':
        return <Play className='w-5 h-5 text-blue-500' />
      case 'review':
        return <Eye className='w-5 h-5 text-yellow-500' />
      case 'disputed':
        return <AlertTriangle className='w-5 h-5 text-red-500' />
      default:
        return <Clock className='w-5 h-5 text-gray-400' />
    }
  }

  if (!viewProject) {
    return (
      <div className='min-h-screen bg-slate-900 flex items-center justify-center text-white'>
        <div className='text-center'>
          <h2 className='text-xl font-bold mb-2'>Project Not Found</h2>
          <button onClick={() => navigate('/dashboard/initiator')} className='text-purple-400 underline'>
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const isContractor = useMemo(() => {
    if (!viewProject || !viewProject.bids || !user) return false
    const acceptedBid = viewProject.bids.find((b) => b.status === 'accepted')
    return acceptedBid?.developerId === user.id
  }, [viewProject, user])

  const isOwner = useMemo(() => {
    if (!viewProject || !user) return false
    return viewProject.initiatorId === user.id
  }, [viewProject, user])

  const selectedMilestoneData = selectedMilestone
    ? viewProject.milestones.find((m) => m.id === selectedMilestone)
    : null

  return (
    <div className='pb-10'>
      {/* Back Button & Header */}
      <div className='flex justify-between items-center mb-6'>
        <button
          onClick={() => navigate('/projects')}
          className='flex items-center text-gray-500 hover:text-gray-900 transition-colors'>
          <ArrowRight className='w-5 h-5 mr-2 rotate-180' />
          返回项目列表
        </button>
        <div className='flex space-x-3'>
           <button 
             onClick={() => setShowAIPanel(!showAIPanel)}
             className={`p-2 rounded-lg transition-colors flex items-center space-x-2 ${
               showAIPanel ? 'bg-purple-100 text-purple-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
             }`}>
             <Zap className={showAIPanel ? 'fill-current' : ''} size={20}/>
             <span className="text-sm font-medium">AI 助手</span>
           </button>
           <button className='p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100'>
             <MoreVertical className="w-5 h-5"/>
           </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <main className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Left Column: Project Info */}
        <div className='lg:col-span-1 space-y-6'>
          {/* Project Card */}
          <div className='bg-white rounded-xl p-6 border border-gray-200 shadow-sm'>
            <div className='flex justify-between items-start mb-4'>
              <div className='p-3 bg-purple-50 rounded-xl'>
                <Briefcase className='w-8 h-8 text-purple-600' />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${getStatusColor(viewProject.status)}`}>
                {viewProject.status}
              </span>
            </div>
            
            <h1 className='text-xl font-bold text-gray-900 mb-2 leading-tight'>{viewProject.title}</h1>
            <div className='flex items-center text-gray-500 text-sm mb-6'>
              <MapPin className='w-4 h-4 mr-1' />
              {viewProject.region}
            </div>

            <div className='space-y-4'>
              <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                <div className='flex items-center text-gray-600'>
                   <DollarSign className='w-4 h-4 mr-2' />
                   <span className='text-sm'>预算</span>
                </div>
                <span className='font-bold text-gray-900'>{viewProject.currency} {viewProject.totalBudget.toLocaleString()}</span>
              </div>
              
              <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                <div className='flex items-center text-gray-600'>
                   <Calendar className='w-4 h-4 mr-2' />
                   <span className='text-sm'>开始时间</span>
                </div>
                <span className='font-medium text-gray-900'>{viewProject.startDate}</span>
              </div>
            </div>

            {/* AI Analysis Badges */}
            {viewProject.aiCollaboration && (
              <div className='mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100'>
                <div className='flex items-center text-purple-700 font-medium mb-2'>
                  <Zap className='w-4 h-4 mr-2' />
                  AI 协作开启
                </div>
                <p className='text-xs text-purple-600/80 leading-relaxed'>
                  AI 助手正在监控里程碑交付质量与风险。
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Content */}
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

          {/* Progress Overview (Visible on Milestones Tab) */}
          {activeTab === 'milestones' && (
             <div className='grid grid-cols-2 gap-4'>
                <div className='bg-white p-5 rounded-xl border border-gray-200 shadow-sm'>
                  <div className='flex justify-between mb-2'>
                    <span className='text-sm text-gray-500'>总体进度</span>
                    <span className='font-bold text-gray-900'>{viewProject.progress}%</span>
                  </div>
                  <div className='h-2 bg-gray-100 rounded-full overflow-hidden'>
                    <div className='h-full bg-purple-600 rounded-full' style={{ width: `${viewProject.progress}%` }}></div>
                   </div>
                </div>
                <div className='bg-white p-5 rounded-xl border border-gray-200 shadow-sm'>
                  <div className='flex justify-between mb-2'>
                    <span className='text-sm text-gray-500'>预算消耗</span>
                    <span className='font-bold text-gray-900'>${viewProject.spentBudget.toLocaleString()}</span>
                  </div>
                  <div className='h-2 bg-gray-100 rounded-full overflow-hidden'>
                    <div className='h-full bg-green-500 rounded-full' style={{ width: `${(viewProject.spentBudget / viewProject.totalBudget) * 100}%` }}></div>
                   </div>
                </div>
             </div>
          )}

        {/* Tab Content */}
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

        {activeTab === 'bids' && (
          <BidList
            bids={viewProject.bids}
            currency={viewProject.currency}
            onAccept={async (bid) => {
              if (window.confirm(`确认接受此方案？系统将从您的余额中扣除/冻结项目资金 $${bid.proposedPrice.toLocaleString()}。`)) {
                try {
                  await escrowLock(viewProject.id, bid.proposedPrice, viewProject.title)
                  acceptBid(viewProject.id, bid.id, bid.proposedPrice)
                  alert('资金托管成功，项目正式启动！')
                } catch (error) {
                  const errorMessage = error instanceof Error ? error.message : '资金不足，请充值'
                  alert(`操作失败: ${errorMessage}`)
                }
              }
            }}
          />
        )}

        {activeTab === 'milestones' && (
          <MilestoneList
            milestones={viewProject.milestones}
            isOwner={isOwner}
            isContractor={isContractor}
            selectedMilestoneId={selectedMilestone}
            onSelectMilestone={setSelectedMilestone}
            onOpenSubmit={(m) => {
              setActiveMilestoneForSubmit({ id: m.id, title: m.title })
              setSubmitModalOpen(true)
            }}
            onOpenReview={(m) => {
              setActiveMilestoneForReview({
                id: m.id,
                title: m.title,
                amount: m.amount,
                submission: m.submission,
              })
              setReviewModalOpen(true)
            }}
          />
        )}

        {activeTab === 'payments' && (
          <div className='bg-white rounded-xl p-12 border border-gray-200 text-center'>
            <div className='w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4'>
              <DollarSign className='w-8 h-8 text-gray-400' />
            </div>
            <h3 className='text-lg font-medium text-gray-900 mb-1'>资金结算</h3>
            <p className='text-gray-500'>此处将显示项目的资金流向与结算记录。</p>
          </div>
        )}
      </div>
      </main>

      {/* AI Assistant Panel */}
      {showAIPanel && (
        <AIAssistantPanel
          projectId={viewProject.id}
          milestoneId={selectedMilestone || undefined}
          currentRole='project_initiator'
          onTaskComplete={(role, result) => {
            console.log('AI task completed:', role, result)
          }}
          codeBoxCompatible={false}
        />
      )}

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
          milestoneAmount={activeMilestoneForReview.amount} // Pass Amount
          contractorId={viewProject.bids?.find((b) => b.status === 'accepted')?.developerId || ''} // Pass Contractor ID
          submission={activeMilestoneForReview.submission}
        />
      )}
    </div>
  )
}

export default ProjectManagementPage
