import React, { useState } from 'react';
import {
  Briefcase, CheckCircle, Clock, AlertTriangle, DollarSign, Users,
  Calendar, FileText, MessageSquare, ChevronRight, ArrowRight,
  Play, Pause, MoreVertical, Plus, Edit, Trash2, Eye, Send,
  Star, TrendingUp, MapPin, Globe, Zap, Search, Filter,
  X, Download, Upload, RefreshCw, ExternalLink
} from 'lucide-react';
import { AIAssistantPanel } from '../components/AIAssistantPanel';

// Types
interface Milestone {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'disputed';
  progress: number;
  startDate: string;
  dueDate: string;
  budget: number;
  currency: string;
  assignedTo: string[];
  deliverables: Deliverable[];
  aiTasks: AITask[];
  comments: Comment[];
}

interface Deliverable {
  id: string;
  name: string;
  status: 'pending' | 'submitted' | 'approved' | 'rejected' | 'in_progress';
  fileUrl?: string;
  submittedAt?: string;
  approvedAt?: string;
}

interface AITask {
  id: string;
  aiRole: string;
  task: string;
  status: 'pending' | 'in_progress' | 'completed';
  result?: string;
  createdAt: string;
  completedAt?: string;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  attachments?: string[];
}

interface Project {
  id: string;
  title: string;
  description: string;
  status: 'planning' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  category: string;
  region: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  currency: string;
  spentBudget: number;
  progress: number;
  initiator: string;
  contractor: string;
  milestones: Milestone[];
  aiCollaboration: boolean;
  tags: string[];
}

const ProjectManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'milestones' | 'details' | 'payments'>('projects');
  const [selectedProject, setSelectedProject] = useState<string | null>('PRJ001');
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Sample project data
  const projects: Project[] = [
    {
      id: 'PRJ001',
      title: '跨境电商平台开发',
      description: '开发一个支持多语言、多币种的跨境电商平台，包含用户系统、商品管理、订单处理、支付集成等功能。',
      status: 'in_progress',
      category: 'Web应用开发',
      region: 'APAC',
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      totalBudget: 85000,
      currency: 'USD',
      spentBudget: 42500,
      progress: 65,
      initiator: 'ABC Corporation',
      contractor: 'TechFreelancer Team',
      aiCollaboration: true,
      tags: ['React', 'Node.js', 'Stripe', 'AI辅助'],
      milestones: [
        {
          id: 'MS001',
          title: '需求分析与原型设计',
          description: '完成详细需求文档和交互原型设计',
          status: 'completed',
          progress: 100,
          startDate: '2024-01-01',
          dueDate: '2024-01-31',
          budget: 12000,
          currency: 'USD',
          assignedTo: ['产品经理', 'UX设计师'],
          deliverables: [
            { id: 'D001', name: 'PRD文档', status: 'approved', approvedAt: '2024-01-25' },
            { id: 'D002', name: '交互原型', status: 'approved', approvedAt: '2024-01-28' },
          ],
          aiTasks: [
            { id: 'AIT001', aiRole: 'Product Manager AI', task: '生成产品需求文档', status: 'completed', result: 'PRD文档已生成', createdAt: '2024-01-05', completedAt: '2024-01-10' },
            { id: 'AIT002', aiRole: 'UX Designer AI', task: '设计用户界面原型', status: 'completed', result: '原型设计完成', createdAt: '2024-01-12', completedAt: '2024-01-20' },
          ],
          comments: [
            { id: 'C001', author: '项目主理人', content: '需求文档审核通过，开始开发阶段', createdAt: '2024-01-26' },
          ],
        },
        {
          id: 'MS002',
          title: '前端开发',
          description: '完成响应式前端界面开发，支持多语言切换',
          status: 'in_progress',
          progress: 75,
          startDate: '2024-02-01',
          dueDate: '2024-03-31',
          budget: 25000,
          currency: 'USD',
          assignedTo: ['前端工程师'],
          deliverables: [
            { id: 'D003', name: '用户界面', status: 'submitted', submittedAt: '2024-03-15' },
            { id: 'D004', name: '多语言支持', status: 'pending' },
          ],
          aiTasks: [
            { id: 'AIT003', aiRole: 'Frontend Engineer AI', task: '生成React组件代码', status: 'in_progress', createdAt: '2024-02-15' },
          ],
          comments: [],
        },
        {
          id: 'MS003',
          title: '后端开发',
          description: '完成API开发、数据库设计、支付集成',
          status: 'pending',
          progress: 20,
          startDate: '2024-03-01',
          dueDate: '2024-05-15',
          budget: 30000,
          currency: 'USD',
          assignedTo: ['后端工程师'],
          deliverables: [
            { id: 'D005', name: 'RESTful API', status: 'pending' },
            { id: 'D006', name: '支付集成', status: 'pending' },
          ],
          aiTasks: [
            { id: 'AIT004', aiRole: 'Backend Engineer AI', task: '设计数据库架构', status: 'pending', createdAt: '2024-03-01' },
          ],
          comments: [],
        },
        {
          id: 'MS004',
          title: '测试与上线',
          description: '完成功能测试、性能测试，并部署上线',
          status: 'pending',
          progress: 0,
          startDate: '2024-05-16',
          dueDate: '2024-06-30',
          budget: 18000,
          currency: 'USD',
          assignedTo: ['QA工程师', 'DevOps'],
          deliverables: [
            { id: 'D007', name: '测试报告', status: 'pending' },
            { id: 'D008', name: '上线部署', status: 'pending' },
          ],
          aiTasks: [],
          comments: [],
        },
      ],
    },
    {
      id: 'PRJ002',
      title: 'AI驱动的智能客服系统',
      description: '基于大语言模型的智能客服系统，支持多轮对话和上下文理解',
      status: 'in_progress',
      category: 'AI应用开发',
      region: 'GLOBAL',
      startDate: '2024-01-15',
      endDate: '2024-07-31',
      totalBudget: 120000,
      currency: 'USD',
      spentBudget: 36000,
      progress: 35,
      initiator: 'TechStart Inc',
      contractor: 'AI Solutions Team',
      aiCollaboration: true,
      tags: ['AI/ML', 'Python', 'LLM', 'NLP'],
      milestones: [
        {
          id: 'MS005',
          title: '需求分析与技术选型',
          description: '确定技术方案和模型选择',
          status: 'completed',
          progress: 100,
          startDate: '2024-01-15',
          dueDate: '2024-02-15',
          budget: 15000,
          currency: 'USD',
          assignedTo: ['技术负责人', 'AI工程师'],
          deliverables: [
            { id: 'D009', name: '技术方案', status: 'approved', approvedAt: '2024-02-10' },
          ],
          aiTasks: [],
          comments: [],
        },
        {
          id: 'MS006',
          title: '模型训练与优化',
          description: '训练对话模型并进行性能优化',
          status: 'in_progress',
          progress: 45,
          startDate: '2024-02-16',
          dueDate: '2024-05-31',
          budget: 55000,
          currency: 'USD',
          assignedTo: ['AI工程师', '数据科学家'],
          deliverables: [
            { id: 'D010', name: '训练模型', status: 'in_progress' },
            { id: 'D011', name: '性能优化', status: 'pending' },
          ],
          aiTasks: [],
          comments: [],
        },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'planning': 'bg-gray-100 text-gray-700',
      'in_progress': 'bg-blue-100 text-blue-700',
      'review': 'bg-yellow-100 text-yellow-700',
      'completed': 'bg-green-100 text-green-700',
      'cancelled': 'bg-red-100 text-red-700',
      'pending': 'bg-gray-100 text-gray-700',
      'disputed': 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getMilestoneStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Play className="w-5 h-5 text-blue-500" />;
      case 'review':
        return <Eye className="w-5 h-5 text-yellow-500" />;
      case 'disputed':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getProject = (id: string) => projects.find(p => p.id === id);
  const getMilestone = (project: Project, milestoneId: string) =>
    project.milestones.find(m => m.id === milestoneId);

  const selectedProjectData = selectedProject ? getProject(selectedProject) : null;
  const selectedMilestoneData = selectedProjectData && selectedMilestone
    ? getMilestone(selectedProjectData, selectedMilestone)
    : null;

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-md border-b border-purple-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CodeUtopia.ai</h1>
                <p className="text-xs text-purple-300">Project Management</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-1 bg-slate-700/50 rounded-lg p-1">
                {[
                  { id: 'projects', label: '项目列表' },
                  { id: 'milestones', label: '里程碑管理' },
                  { id: 'details', label: '项目详情' },
                  { id: 'payments', label: '付款结算' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* AI Assistant Toggle */}
              <button
                onClick={() => setShowAIPanel(!showAIPanel)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  showAIPanel
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-slate-700/50 text-gray-300 hover:text-white'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">AI 助手</span>
              </button>

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <MessageSquare className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </button>

              {/* User */}
              <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium">
                PM
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: '进行中项目', value: 12, icon: Briefcase, color: 'from-blue-500 to-cyan-500' },
                { label: '已完成里程碑', value: 45, icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
                { label: '待审核交付物', value: 8, icon: FileText, color: 'from-yellow-500 to-orange-500' },
                { label: 'AI任务完成率', value: '94%', icon: Zap, color: 'from-purple-500 to-pink-500' },
              ].map((stat, index) => (
                <div key={index} className="bg-slate-800/50 rounded-xl p-5 border border-purple-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Search and Filters */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-purple-500/20">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="搜索项目..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-700/50 border border-purple-500/30 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-slate-700/50 text-white rounded-lg px-4 py-2 border border-purple-500/30 focus:outline-none focus:border-purple-500"
                >
                  <option value="all">所有状态</option>
                  <option value="planning">规划中</option>
                  <option value="in_progress">进行中</option>
                  <option value="review">审核中</option>
                  <option value="completed">已完成</option>
                </select>
                <button className="bg-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-600 transition-colors flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  新建项目
                </button>
              </div>
            </div>

            {/* Project List */}
            <div className="space-y-4">
              {filteredProjects.map(project => (
                <div
                  key={project.id}
                  onClick={() => {
                    setSelectedProject(project.id);
                    setActiveTab('details');
                  }}
                  className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                          {project.aiCollaboration && (
                            <span className="flex items-center text-xs text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded">
                              <Zap className="w-3 h-3 mr-1" />
                              AI协同
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {project.tags.map(tag => (
                            <span key={tag} className="text-xs px-2 py-1 bg-slate-700/50 text-gray-300 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {project.initiator}
                          </span>
                          <span className="flex items-center">
                            <Globe className="w-4 h-4 mr-1" />
                            {project.region}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {project.startDate} - {project.endDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                        {project.status === 'in_progress' ? '进行中' :
                         project.status === 'completed' ? '已完成' :
                         project.status === 'planning' ? '规划中' : project.status}
                      </span>
                      <div className="mt-3 text-2xl font-bold text-white">{project.progress}%</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Budget Info */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span className="text-white font-medium">${project.spentBudget.toLocaleString()}</span>
                        <span className="text-gray-400"> / ${project.totalBudget.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        {project.milestones.filter(m => m.status === 'completed').length} / {project.milestones.length} 里程碑
                      </div>
                    </div>
                    <button className="text-purple-400 hover:text-purple-300 flex items-center text-sm">
                      查看详情 <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Milestones Tab */}
        {activeTab === 'milestones' && selectedProjectData && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">{selectedProjectData.title}</h2>
                <p className="text-gray-400 text-sm">里程碑管理</p>
              </div>
              <button className="bg-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-600 transition-colors flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                添加里程碑
              </button>
            </div>

            {/* Milestone Timeline */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-700" />

                {/* Milestones */}
                <div className="space-y-6">
                  {selectedProjectData.milestones.map((milestone, index) => (
                    <div
                      key={milestone.id}
                      className={`relative pl-14 ${selectedMilestone === milestone.id ? 'opacity-100' : 'opacity-70 hover:opacity-100'} transition-opacity`}
                    >
                      {/* Timeline Dot */}
                      <div className={`absolute left-3 w-6 h-6 rounded-full flex items-center justify-center ${
                        milestone.status === 'completed' ? 'bg-green-500' :
                        milestone.status === 'in_progress' ? 'bg-blue-500' :
                        milestone.status === 'review' ? 'bg-yellow-500' : 'bg-slate-600'
                      }`}>
                        {getMilestoneStatusIcon(milestone.status)}
                      </div>

                      {/* Content */}
                      <div
                        onClick={() => setSelectedMilestone(milestone.id)}
                        className="bg-slate-700/30 rounded-lg p-4 cursor-pointer hover:bg-slate-700/50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-white">{milestone.title}</h4>
                            <p className="text-sm text-gray-400">{milestone.description}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(milestone.status)}`}>
                            {milestone.status === 'completed' ? '已完成' :
                             milestone.status === 'in_progress' ? '进行中' :
                             milestone.status === 'review' ? '审核中' : '待开始'}
                          </span>
                        </div>

                        {/* Progress */}
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">进度</span>
                            <span className="text-white">{milestone.progress}%</span>
                          </div>
                          <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                milestone.status === 'completed' ? 'bg-green-500' :
                                milestone.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-500'
                              }`}
                              style={{ width: `${milestone.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-400">
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {milestone.dueDate}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="w-3 h-3 mr-1" />
                            ${milestone.budget.toLocaleString()}
                          </span>
                          <span className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {milestone.assignedTo.join(', ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Details Tab */}
        {activeTab === 'details' && selectedProjectData && (
          <div className="space-y-6">
            {/* Project Header */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-7 h-7 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedProjectData.title}</h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span className="flex items-center">
                        <Globe className="w-4 h-4 mr-1" />
                        {selectedProjectData.region}
                      </span>
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {selectedProjectData.initiator}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {selectedProjectData.startDate} - {selectedProjectData.endDate}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`text-sm px-3 py-1 rounded-full ${getStatusColor(selectedProjectData.status)}`}>
                  {selectedProjectData.status === 'in_progress' ? '进行中' : selectedProjectData.status}
                </span>
              </div>

              {/* Progress & Budget */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">整体进度</span>
                    <span className="text-white font-medium">{selectedProjectData.progress}%</span>
                  </div>
                  <div className="h-3 bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      style={{ width: `${selectedProjectData.progress}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">预算使用</span>
                    <span className="text-white font-medium">
                      ${selectedProjectData.spentBudget.toLocaleString()} / ${selectedProjectData.totalBudget.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-3 bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(selectedProjectData.spentBudget / selectedProjectData.totalBudget) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-around">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {selectedProjectData.milestones.filter(m => m.status === 'completed').length}
                    </div>
                    <div className="text-xs text-gray-400">已完成里程碑</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{selectedProjectData.milestones.length}</div>
                    <div className="text-xs text-gray-400">总里程碑</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{selectedProjectData.progress}%</div>
                    <div className="text-xs text-gray-400">完成率</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Milestones Detail */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-lg font-semibold text-white mb-6">里程碑详情</h3>
              <div className="space-y-4">
                {selectedProjectData.milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      selectedMilestone === milestone.id
                        ? 'bg-purple-500/10 border-purple-500/40'
                        : 'bg-slate-700/30 border-transparent hover:bg-slate-700/50'
                    }`}
                    onClick={() => setSelectedMilestone(milestone.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getMilestoneStatusIcon(milestone.status)}
                        <h4 className="font-medium text-white">{milestone.title}</h4>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-400">
                          ${milestone.budget.toLocaleString()}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(milestone.status)}`}>
                          {milestone.status === 'completed' ? '已完成' :
                           milestone.status === 'in_progress' ? '进行中' :
                           milestone.status === 'review' ? '审核中' : '待开始'}
                        </span>
                      </div>
                    </div>

                    {/* Deliverables */}
                    <div className="ml-8">
                      <div className="text-xs text-gray-400 mb-2">交付物</div>
                      <div className="flex flex-wrap gap-2">
                        {milestone.deliverables.map(del => (
                          <span
                            key={del.id}
                            className={`text-xs px-2 py-1 rounded ${
                              del.status === 'approved' ? 'bg-green-100 text-green-700' :
                              del.status === 'submitted' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {del.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* AI Tasks */}
                    {milestone.aiTasks.length > 0 && (
                      <div className="ml-8 mt-3">
                        <div className="text-xs text-gray-400 mb-2">AI任务</div>
                        <div className="flex flex-wrap gap-2">
                          {milestone.aiTasks.map(task => (
                            <span
                              key={task.id}
                              className={`text-xs px-2 py-1 rounded flex items-center ${
                                task.status === 'completed' ? 'bg-purple-100 text-purple-700' :
                                task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}
                            >
                              <Zap className="w-3 h-3 mr-1" />
                              {task.aiRole}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Milestone Detail */}
            {selectedMilestoneData && (
              <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">{selectedMilestoneData.title}</h3>
                  <button
                    onClick={() => setSelectedMilestone(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Description */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">描述</h4>
                    <p className="text-white">{selectedMilestoneData.description}</p>
                  </div>

                  {/* Schedule */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">时间安排</h4>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center text-white">
                        <Calendar className="w-4 h-4 mr-1 text-purple-400" />
                        开始: {selectedMilestoneData.startDate}
                      </span>
                      <span className="flex items-center text-white">
                        <Calendar className="w-4 h-4 mr-1 text-pink-400" />
                        截止: {selectedMilestoneData.dueDate}
                      </span>
                    </div>
                  </div>

                  {/* Budget */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">预算</h4>
                    <div className="flex items-center text-white">
                      <DollarSign className="w-5 h-5 text-green-400 mr-1" />
                      <span className="text-2xl font-bold">{selectedMilestoneData.budget.toLocaleString()}</span>
                      <span className="text-gray-400 ml-2">{selectedMilestoneData.currency}</span>
                    </div>
                  </div>

                  {/* Assigned Team */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">执行团队</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMilestoneData.assignedTo.map(member => (
                        <span key={member} className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded">
                          {member}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Deliverables */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-400 mb-3">交付物</h4>
                  <div className="space-y-2">
                    {selectedMilestoneData.deliverables.map(del => (
                      <div key={del.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-white">{del.name}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(del.status)}`}>
                          {del.status === 'approved' ? '已通过' :
                           del.status === 'submitted' ? '已提交' : '待提交'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Tasks */}
                {selectedMilestoneData.aiTasks.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-400 mb-3">AI辅助任务</h4>
                    <div className="space-y-2">
                      {selectedMilestoneData.aiTasks.map(task => (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Zap className="w-4 h-4 text-purple-400" />
                            <div>
                              <span className="text-white">{task.aiRole}</span>
                              <p className="text-xs text-gray-400">{task.task}</p>
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                            {task.status === 'completed' ? '已完成' :
                             task.status === 'in_progress' ? '进行中' : '待开始'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-6 flex items-center space-x-4">
                  <button className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center">
                    <Edit className="w-4 h-4 mr-2" />
                    编辑里程碑
                  </button>
                  <button
                    onClick={() => setShowAIPanel(true)}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    调用AI助手
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: '待结算金额', value: '$12,500', color: 'bg-yellow-500' },
                { label: '已结算金额', value: '$89,000', color: 'bg-green-500' },
                { label: '争议金额', value: '$3,200', color: 'bg-red-500' },
              ].map((stat, index) => (
                <div key={index} className="bg-slate-800/50 rounded-xl p-5 border border-purple-500/20">
                  <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Payment Records */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-lg font-semibold text-white mb-6">付款记录</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 text-sm border-b border-slate-700">
                      <th className="pb-3 font-medium">项目</th>
                      <th className="pb-3 font-medium">里程碑</th>
                      <th className="pb-3 font-medium">金额</th>
                      <th className="pb-3 font-medium">状态</th>
                      <th className="pb-3 font-medium">日期</th>
                      <th className="pb-3 font-medium">操作</th>
                    </tr>
                  </thead>
                  <tbody className="text-white text-sm">
                    {[
                      { project: '跨境电商平台开发', milestone: '需求分析与原型设计', amount: '$12,000', status: '已结算', date: '2024-01-30' },
                      { project: '跨境电商平台开发', milestone: '前端开发', amount: '$8,500', status: '待审核', date: '2024-03-20' },
                      { project: 'AI智能客服系统', milestone: '需求分析与技术选型', amount: '$15,000', status: '已结算', date: '2024-02-20' },
                    ].map((payment, index) => (
                      <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="py-4 font-medium">{payment.project}</td>
                        <td className="py-4 text-gray-400">{payment.milestone}</td>
                        <td className="py-4 text-green-400 font-medium">{payment.amount}</td>
                        <td className="py-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            payment.status === '已结算' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="py-4 text-gray-400">{payment.date}</td>
                        <td className="py-4">
                          <button className="text-purple-400 hover:text-purple-300 text-xs">
                            查看详情
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* AI Assistant Panel */}
      {showAIPanel && (
        <AIAssistantPanel
          projectId={selectedProject || undefined}
          milestoneId={selectedMilestone || undefined}
          currentRole="project_initiator"
          onTaskComplete={(role, result) => {
            console.log('AI task completed:', role, result);
          }}
          codeBoxCompatible={false}
        />
      )}
    </div>
  );
};

export default ProjectManagementPage;
