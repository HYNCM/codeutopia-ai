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
import { useProjects } from '../contexts/ProjectContext'
import { useAuth } from '../contexts/AuthContext'
import { Project as GlobalProject, Milestone as GlobalMilestone, Bid } from '../types'

// UI-Specific Types (Extended from Global Types for View)
interface ViewMilestone {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'submitted' | 'approved' | 'rejected' | 'disputed'
  progress: number
  startDate: string
  dueDate: string
  budget: number
  currency: string
  assignedTo: string[]
  deliverables: ViewDeliverable[]
  aiTasks: ViewAITask[]
  comments: ViewComment[]
  submission?: any // Simplify for view
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

  const [submitModalOpen, setSubmitModalOpen] = useState(false)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [activeMilestoneForSubmit, setActiveMilestoneForSubmit] = useState<{ id: string; title: string } | null>(null)
  const [activeMilestoneForReview, setActiveMilestoneForReview] = useState<{
    id: string
    title: string
    submission: any
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
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'>
      {/* Header */}
      <header className='bg-slate-800/80 backdrop-blur-md border-b border-purple-500/30 sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            {/* Logo & Back */}
            <div className='flex items-center space-x-3'>
              <button
                onClick={() => navigate('/dashboard/initiator')}
                className='text-gray-400 hover:text-white transition-colors'>
                <ArrowRight className='w-5 h-5 rotate-180' />
              </button>
              <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center'>
                <Briefcase className='w-6 h-6 text-white' />
              </div>
              <div>
                <h1 className='text-xl font-bold text-white'>CodeUtopia.ai</h1>
                <p className='text-xs text-purple-300'>Project Management</p>
              </div>
            </div>

            {/* Navigation */}
            <div className='flex items-center space-x-4'>
              <nav className='hidden md:flex space-x-1 bg-slate-700/50 rounded-lg p-1'>
                {[
                  { id: 'details', label: '项目详情/列表' },
                  { id: 'bids', label: '竞标管理', badge: viewProject?.bidsCount > 0 ? viewProject.bidsCount : null },
                  { id: 'milestones', label: '里程碑管理' },
                  { id: 'payments', label: '付款结算' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
                    }`}>
                    {tab.label}
                    {tab.badge && (
                      <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full'>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Actions */}
            <div className='flex items-center space-x-4'>
              {/* AI Assistant Toggle */}
              <button
                onClick={() => setShowAIPanel(!showAIPanel)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  showAIPanel
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-slate-700/50 text-gray-300 hover:text-white'
                }`}>
                <Zap className='w-4 h-4' />
                <span className='hidden sm:inline'>AI 助手</span>
              </button>

              <div className='w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium'>
                {viewProject.initiator.substring(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Project Header Info */}
        <div className='mb-8 bg-slate-800/50 rounded-xl p-6 border border-purple-500/20'>
          <div className='flex items-start justify-between mb-6'>
            <div className='flex items-start space-x-4'>
              <div className='w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center'>
                <Briefcase className='w-7 h-7 text-purple-400' />
              </div>
              <div>
                <h2 className='text-2xl font-bold text-white mb-2'>{viewProject.title}</h2>
                <div className='flex items-center space-x-4 text-sm text-gray-400'>
                  <span className='flex items-center'>
                    <Globe className='w-4 h-4 mr-1' />
                    {viewProject.region}
                  </span>
                  <span className='flex items-center'>
                    <Users className='w-4 h-4 mr-1' />
                    {viewProject.initiator}
                  </span>
                  <span className='flex items-center'>
                    <Calendar className='w-4 h-4 mr-1' />
                    {viewProject.startDate}
                  </span>
                </div>
              </div>
            </div>
            <span className={`text-sm px-3 py-1 rounded-full ${getStatusColor(viewProject.status)}`}>
              {viewProject.status}
            </span>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div>
              <div className='flex justify-between text-sm mb-2'>
                <span className='text-gray-400'>整体进度</span>
                <span className='text-white font-medium'>{viewProject.progress}%</span>
              </div>
              <div className='h-3 bg-slate-600 rounded-full overflow-hidden'>
                <div
                  className='h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full'
                  style={{ width: `${viewProject.progress}%` }}
                />
              </div>
            </div>
            <div>
              <div className='flex justify-between text-sm mb-2'>
                <span className='text-gray-400'>预算使用</span>
                <span className='text-white font-medium'>
                  ${viewProject.spentBudget.toLocaleString()} / ${viewProject.totalBudget.toLocaleString()}
                </span>
              </div>
              <div className='h-3 bg-slate-600 rounded-full overflow-hidden'>
                <div
                  className='h-full bg-green-500 rounded-full'
                  style={{ width: `${(viewProject.spentBudget / viewProject.totalBudget) * 100}%` }}
                />
              </div>
            </div>
            <div className='flex items-center justify-around'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-white'>{viewProject.milestones.length}</div>
                <div className='text-xs text-gray-400'>总里程碑</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-white'>{viewProject.bidsCount}</div>
                <div className='text-xs text-gray-400'>竞标数</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'details' && (
          <div className='space-y-6'>
            <div className='bg-slate-800/50 rounded-xl p-6 border border-purple-500/20'>
              <h3 className='text-lg font-semibold text-white mb-4'>项目描述</h3>
              <p className='text-gray-300 whitespace-pre-line'>{viewProject.description}</p>

              <h3 className='text-lg font-semibold text-white mt-6 mb-4'>所需技能</h3>
              <div className='flex flex-wrap gap-2'>
                {viewProject.tags.map((tag) => (
                  <span key={tag} className='px-3 py-1 bg-slate-700 rounded-full text-sm text-gray-300'>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bids' && (
          <div className='space-y-6'>
            <div className='flex justify-between items-center'>
              <h3 className='text-xl font-bold text-white'>收到的竞标 ({viewProject.bids?.length || 0})</h3>
            </div>

            <div className='space-y-4'>
              {viewProject.bids?.map((bid) => (
                <div
                  key={bid.id}
                  className='bg-slate-800/50 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-colors'>
                  <div className='flex flex-col lg:flex-row justify-between gap-6'>
                    {/* Bidder Info */}
                    <div className='flex items-start space-x-4'>
                      <img src={bid.developerAvatar} alt={bid.developerName} className='w-12 h-12 rounded-full' />
                      <div>
                        <h4 className='text-lg font-semibold text-white flex items-center'>
                          {bid.developerName}
                          <span className='ml-2 flex items-center text-xs text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full'>
                            <Star className='w-3 h-3 mr-1 fill-current' />
                            {bid.developerRating}
                          </span>
                        </h4>
                        <p className='text-sm text-gray-400 mt-1'>
                          提交于 {new Date(bid.createdAt).toLocaleDateString()}
                        </p>

                        <div className='mt-4 p-4 bg-slate-900/50 rounded-lg'>
                          <p className='text-gray-300 text-sm whitespace-pre-line'>{bid.proposal}</p>
                        </div>
                      </div>
                    </div>

                    {/* Terms & Actions */}
                    <div className='flex flex-col gap-4 min-w-[240px]'>
                      <div className='grid grid-cols-2 gap-4'>
                        <div className='bg-slate-700/30 p-3 rounded-lg text-center'>
                          <p className='text-xs text-gray-400 mb-1'>报价金额</p>
                          <p className='text-lg font-bold text-green-400'>
                            {viewProject.currency} {bid.proposedPrice.toLocaleString()}
                          </p>
                        </div>
                        <div className='bg-slate-700/30 p-3 rounded-lg text-center'>
                          <p className='text-xs text-gray-400 mb-1'>预计工期</p>
                          <p className='text-lg font-bold text-blue-400'>{bid.deliveryDays} 天</p>
                        </div>
                      </div>

                      {/* AI Analysis of Bid */}
                      <div className='flex items-center justify-between px-3 py-2 bg-purple-500/10 rounded-lg border border-purple-500/20'>
                        <div className='flex items-center space-x-2'>
                          <Zap className='w-4 h-4 text-purple-400' />
                          <span className='text-xs font-medium text-purple-300'>AI 竞争力评分</span>
                        </div>
                        <span className='text-sm font-bold text-purple-400'>92/100</span>
                      </div>

                      <div className='flex gap-2 mt-2'>
                        {bid.status === 'pending' && (
                          <>
                            <button
                              onClick={() => {
                                if (window.confirm('确认接受此竞标方案？这将启动项目并拒绝其他竞标。')) {
                                  acceptBid(viewProject.id, bid.id)
                                  // Optionally navigate or show success
                                }
                              }}
                              className='flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center'>
                              <ThumbsUp className='w-4 h-4 mr-1.5' />
                              接受方案
                            </button>
                            <button className='px-3 py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg transition-colors'>
                              <ThumbsDown className='w-4 h-4' />
                            </button>
                          </>
                        )}
                        {bid.status === 'accepted' && (
                          <div className='flex-1 py-2 bg-green-500/20 text-green-400 text-center rounded-lg text-sm font-medium border border-green-500/30'>
                            已接受此方案
                          </div>
                        )}
                        {bid.status === 'rejected' && (
                          <div className='flex-1 py-2 bg-red-500/20 text-red-400 text-center rounded-lg text-sm font-medium border border-red-500/30'>
                            已拒绝
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {(!viewProject.bids || viewProject.bids.length === 0) && (
                <div className='text-center py-12 bg-slate-800/30 rounded-xl border border-dashed border-gray-700'>
                  <Users className='w-12 h-12 text-gray-600 mx-auto mb-4' />
                  <p className='text-gray-400 text-lg'>暂无竞标</p>
                  <p className='text-gray-500 text-sm mt-1'>当有开发者提交方案时将显示在这里</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'milestones' && (
          <div className='space-y-6'>
            <div className='flex justify-between items-center'>
              <h3 className='text-xl font-bold text-white'>里程碑详情 ({viewProject.milestones.length})</h3>
            </div>

            {/* Timeline */}
            <div className='bg-slate-800/50 rounded-xl p-6 border border-purple-500/20'>
              <div className='space-y-6'>
                {viewProject.milestones.map((milestone) => (
                  <div key={milestone.id} className='relative pl-6 border-l-2 border-slate-700'>
                    <div className='absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-600 border-2 border-slate-900'></div>

                    <div
                      className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                        selectedMilestone === milestone.id
                          ? 'bg-purple-500/10 border-purple-500/40'
                          : 'bg-slate-700/30 border-transparent hover:bg-slate-700/50'
                      }`}
                      onClick={() => setSelectedMilestone(milestone.id === selectedMilestone ? null : milestone.id)}>
                      <div className='flex justify-between items-start mb-2'>
                        <div>
                          <h4 className='font-medium text-white'>{milestone.title}</h4>
                          <p className='text-sm text-gray-400 mt-1'>{milestone.description}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(milestone.status)}`}>
                          {milestone.status}
                        </span>
                      </div>

                      <div className='flex items-center space-x-4 text-sm text-gray-400 mt-3'>
                        <span className='flex items-center'>
                          <Calendar className='w-3 h-3 mr-1' />
                          {milestone.dueDate}
                        </span>
                        <span className='flex items-center'>
                          <DollarSign className='w-3 h-3 mr-1' />
                          {milestone.currency} {milestone.budget.toLocaleString()}
                        </span>
                      </div>

                      {/* Deliverables Preview */}
                      {selectedMilestone === milestone.id && (
                        <div className='mt-4 pt-4 border-t border-gray-600/30'>
                          <h5 className='text-sm font-medium text-gray-300 mb-2'>交付物清单:</h5>
                          <ul className='space-y-1'>
                            {milestone.deliverables.map((d) => (
                              <li key={d.id} className='flex items-center text-sm text-gray-400'>
                                <FileText className='w-3 h-3 mr-2' />
                                {d.name}
                              </li>
                            ))}
                          </ul>

                          {isContractor && ['pending', 'in_progress', 'rejected'].includes(milestone.status) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveMilestoneForSubmit({ id: milestone.id, title: milestone.title })
                                setSubmitModalOpen(true)
                              }}
                              className='mt-4 w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center'>
                              <Upload className='w-4 h-4 mr-2' />
                              提交交付物
                            </button>
                          )}

                          {milestone.status === 'submitted' && (
                            <div className='mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg'>
                              <div className='flex justify-between items-start'>
                                <p className='text-sm text-blue-300 font-medium flex items-center'>
                                  <Clock className='w-4 h-4 mr-2' />
                                  已提交，等待審核
                                </p>
                                {isOwner && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      if (milestone.submission) {
                                        setActiveMilestoneForReview({
                                          id: milestone.id,
                                          title: milestone.title,
                                          submission: milestone.submission,
                                        })
                                        setReviewModalOpen(true)
                                      }
                                    }}
                                    className='px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors'>
                                    審核交付
                                  </button>
                                )}
                              </div>
                              {milestone.submission && (
                                <p className='text-xs text-gray-400 mt-1 pl-6'>
                                  提交於 {new Date(milestone.submission.submittedAt).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          )}

                          {milestone.status === 'in_progress' && milestone.submission?.status === 'rejected' && (
                            <div className='mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg'>
                              <p className='text-sm text-red-300 font-medium flex items-center mb-1'>
                                <AlertTriangle className='w-4 h-4 mr-2' />
                                上次提交已駁回
                              </p>
                              <p className='text-xs text-red-200/70 pl-6'>{milestone.submission.rejectionReason}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className='bg-slate-800/50 rounded-xl p-8 border border-purple-500/20 text-center text-gray-400'>
            资金结算功能开发中...
          </div>
        )}
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
          submission={activeMilestoneForReview.submission}
        />
      )}
    </div>
  )
}

export default ProjectManagementPage
