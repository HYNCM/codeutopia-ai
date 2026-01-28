import { useState } from 'react'
import { categoryLabels, PROJECT_CATEGORIES, SKILLS } from '../data/mockData'
import { Link } from 'react-router-dom'
import { useProjects } from '../contexts/ProjectContext'
import { useAuth } from '../contexts/AuthContext'
import { Project, User, Bid } from '../types'
import { BidModal } from '../components/BidModal'
import {
  Search,
  Filter,
  Clock,
  DollarSign,
  Users,
  Star,
  ChevronDown,
  Sparkles,
  MapPin,
  Calendar,
  ArrowUpDown,
  Briefcase,
} from 'lucide-react'

export function ProjectsPage() {
  const { projects } = useProjects()
  const { user } = useAuth()

  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [budgetRange, setBudgetRange] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  // Bid Modal State
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isBidModalOpen, setIsBidModalOpen] = useState(false)

  const filteredProjects = projects.filter((project) => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesBudget =
      budgetRange === 'all' ||
      (budgetRange === 'low' && project.budget.max < 50000) ||
      (budgetRange === 'medium' && project.budget.max >= 50000 && project.budget.max < 100000) ||
      (budgetRange === 'high' && project.budget.max >= 100000)

    return matchesCategory && matchesSearch && matchesBudget
  })

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'budget':
        return b.budget.max - a.budget.max
      case 'deadline':
        return a.duration.localeCompare(b.duration)
      default:
        return 0
    }
  })

  const handleBidClick = (project: Project) => {
    if (!user) {
      alert('請先登入')
      return
    }
    if (user.role !== 'contractor' && user.role !== 'developer') {
      alert('僅開發者/承包商可進行投標')
      return
    }
    setSelectedProject(project)
    setIsBidModalOpen(true)
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>項目廣場</h1>
          <p className='text-gray-500 mt-1'>探索來自全球的優質外包項目機會</p>
        </div>
        <Link
          to='/projects/new'
          className='inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all'>
          <Briefcase className='w-5 h-5' />
          <span>發布項目</span>
        </Link>
      </div>

      {/* AI Recommendation Banner */}
      <div className='bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-xl p-4'>
        <div className='flex items-center space-x-3'>
          <div className='w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center'>
            <Sparkles className='w-5 h-5 text-purple-600' />
          </div>
          <div className='flex-1'>
            <p className='font-medium text-gray-900'>AI 智能推薦</p>
            <p className='text-sm text-gray-600'>
              根據您的技能和歷史項目，有 {filteredProjects.length > 5 ? 5 : filteredProjects.length}{' '}
              個高匹配項目推薦給您
            </p>
          </div>
          <Link
            to='/recommended'
            className='px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors'>
            查看推薦
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className='bg-white rounded-xl border border-gray-200 p-4'>
        <div className='flex flex-col lg:flex-row gap-4'>
          {/* Search */}
          <div className='flex-1 relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
            <input
              type='text'
              placeholder='搜索項目名稱、描述或技能...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
            />
          </div>

          {/* Filter Buttons */}
          <div className='flex flex-wrap items-center gap-3'>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className='px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500'>
              <option value='all'>全部分類</option>
              {PROJECT_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>

            <select
              value={budgetRange}
              onChange={(e) => setBudgetRange(e.target.value)}
              className='px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500'>
              <option value='all'>預算不限</option>
              <option value='low'>預算 5萬以下</option>
              <option value='medium'>預算 5-10萬</option>
              <option value='high'>預算 10萬以上</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className='px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500'>
              <option value='newest'>最新發布</option>
              <option value='budget'>預算從高到低</option>
              <option value='deadline'>交付時間</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2.5 border rounded-lg text-sm transition-colors ${
                showFilters
                  ? 'bg-purple-50 border-purple-200 text-purple-600'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}>
              <Filter className='w-4 h-4' />
              <span>更多篩選</span>
            </button>
          </div>
        </div>

        {/* Additional Filters */}
        {showFilters && (
          <div className='mt-4 pt-4 border-t border-gray-100'>
            <div className='flex flex-wrap gap-2'>
              {SKILLS.slice(0, 12).map((skill) => (
                <button
                  key={skill}
                  className='px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-purple-100 hover:text-purple-600 transition-colors'>
                  {skill}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Projects List */}
      <div className='grid gap-4'>
        {sortedProjects.map((project) => (
          <ProjectCard key={project.id} project={project} onBid={() => handleBidClick(project)} currentUser={user} />
        ))}
      </div>

      {sortedProjects.length === 0 && (
        <div className='text-center py-12 bg-white rounded-xl border border-gray-200'>
          <Briefcase className='w-12 h-12 text-gray-300 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-gray-900'>沒有找到匹配的項目</h3>
          <p className='text-gray-500 mt-1'>嘗試調整搜索條件或預算範圍</p>
        </div>
      )}

      {selectedProject && (
        <BidModal isOpen={isBidModalOpen} onClose={() => setIsBidModalOpen(false)} project={selectedProject} />
      )}
    </div>
  )
}

function ProjectCard({ project, onBid, currentUser }: { project: Project; onBid: () => void; currentUser: User | null }) {
  const aiMatch = Math.floor(Math.random() * 20) + 80 // Demo AI match score

  const hasBidded = project.bids && currentUser && project.bids.some((b: Bid) => b.developerId === currentUser.id)
  const isOwner = currentUser && project.clientId === currentUser.id
  const canBid =
    currentUser && (currentUser.role === 'contractor' || currentUser.role === 'developer') && !hasBidded && !isOwner

  return (
    <div className='bg-white rounded-xl border border-gray-200 p-6 hover:border-purple-200 hover:shadow-md transition-all'>
      <div className='flex flex-col lg:flex-row lg:items-start gap-4'>
        {/* Left: Content */}
        <div className='flex-1'>
          <div className='flex items-start justify-between mb-3'>
            <div>
              <div className='flex items-center space-x-2 mb-1'>
                <span className='px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium'>
                  {categoryLabels[project.category] || project.category}
                </span>
                {project.aiAnalysis && (
                  <span className='flex items-center space-x-1 px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium'>
                    <Sparkles className='w-3 h-3' />
                    <span>AI分析</span>
                  </span>
                )}
              </div>
              <Link
                to={`/projects/${project.id}`}
                className='text-lg font-semibold text-gray-900 hover:text-purple-600 transition-colors'>
                {project.title}
              </Link>
            </div>
            <div className='text-right'>
              <p className='text-xl font-bold text-gray-900'>
                NT$ {(project.budget.min / 1000).toFixed(0)}K - NT$
                {(project.budget.max / 1000).toFixed(0)}K
              </p>
              <p className='text-sm text-gray-500'>{project.budget.currency}</p>
            </div>
          </div>

          <p className='text-gray-600 text-sm line-clamp-2 mb-4'>{project.description}</p>

          <div className='flex flex-wrap gap-2 mb-4'>
            {project.skills.map((skill) => (
              <span key={skill} className='px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs'>
                {skill}
              </span>
            ))}
          </div>

          <div className='flex items-center justify-between pt-4 border-t border-gray-100'>
            <div className='flex items-center space-x-4'>
              <div className='flex items-center space-x-1 text-sm text-gray-500'>
                <Clock className='w-4 h-4' />
                <span>{project.duration}</span>
              </div>
              <div className='flex items-center space-x-1 text-sm text-gray-500'>
                <Calendar className='w-4 h-4' />
                <span>發布於 {new Date(project.createdAt).toLocaleDateString('zh-TW')}</span>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <div className='flex items-center space-x-1 text-sm text-gray-500'>
                <Users className='w-4 h-4' />
                <span>{(project.bids || []).length} 個投標</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Sidebar Info */}
        <div className='lg:w-64 flex flex-col gap-3'>
          {/* Client Info */}
          <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
            <img src={project.clientAvatar} alt={project.clientName} className='w-10 h-10 rounded-full' />
            <div>
              <p className='text-sm font-medium text-gray-900'>{project.clientName}</p>
              <div className='flex items-center space-x-1 text-xs text-gray-500'>
                <Star className='w-3 h-3 text-yellow-400 fill-yellow-400' />
                <span>4.8</span>
                <MapPin className='w-3 h-3 ml-1' />
                <span>台北</span>
              </div>
            </div>
          </div>

          {/* AI Match Score */}
          <div className='flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg'>
            <div className='flex items-center space-x-2'>
              <Sparkles className='w-5 h-5 text-purple-600' />
              <span className='text-sm font-medium text-gray-700'>AI 匹配度</span>
            </div>
            <span className='text-lg font-bold text-purple-600'>{aiMatch}%</span>
          </div>

          {/* Budget per Milestone */}
          <div className='p-3 bg-gray-50 rounded-lg'>
            <p className='text-xs text-gray-500 mb-1'>里程碑預算分配</p>
            <div className='space-y-2'>
              {project.milestones.slice(0, 3).map((milestone, idx) => (
                <div key={milestone.id} className='flex items-center justify-between text-sm'>
                  <span className='text-gray-600 truncate max-w-[120px]'>
                    {idx + 1}. {milestone.title}
                  </span>
                  <span className='font-medium text-gray-900'>NT${(milestone.amount / 1000).toFixed(0)}K</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className='space-y-2'>
            {canBid ? (
              <button
                onClick={onBid}
                className='w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-sm'>
                立即投標
              </button>
            ) : hasBidded ? (
              <div className='w-full py-2.5 bg-green-50 text-green-700 font-medium rounded-lg text-center border border-green-200'>
                已投標
              </div>
            ) : (
              <Link
                to={`/projects/${project.id}`}
                className='block w-full py-2.5 bg-gray-100 text-gray-700 text-center rounded-lg font-medium hover:bg-gray-200 transition-all'>
                查看詳情
              </Link>
            )}
            <button className='w-full py-2.5 border border-purple-200 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors'>
              收藏項目
            </button>
          </div>
        </div>
      </div>

      {/* AI Analysis Preview */}
      {project.aiAnalysis && (
        <div className='mt-4 pt-4 border-t border-gray-100'>
          <div className='flex items-center space-x-2 mb-2'>
            <Sparkles className='w-4 h-4 text-purple-600' />
            <span className='text-sm font-medium text-purple-600'>AI 分析摘要</span>
          </div>
          <div className='grid grid-cols-4 gap-4'>
            <div className='text-center p-3 bg-purple-50 rounded-lg'>
              <p className='text-2xl font-bold text-purple-600'>{project.aiAnalysis.taskCount}</p>
              <p className='text-xs text-gray-600'>任務數量</p>
            </div>
            <div className='text-center p-3 bg-blue-50 rounded-lg'>
              <p className='text-2xl font-bold text-blue-600'>{project.aiAnalysis.estimatedDays}</p>
              <p className='text-xs text-gray-600'>預估天數</p>
            </div>
            <div className='text-center p-3 bg-green-50 rounded-lg'>
              <p className='text-2xl font-bold text-green-600'>
                NT$ {(project.aiAnalysis.recommendedBudget.min / 1000).toFixed(0)}K
              </p>
              <p className='text-xs text-gray-600'>建議最低預算</p>
            </div>
            <div className='text-center p-3 bg-yellow-50 rounded-lg'>
              <p className='text-2xl font-bold text-yellow-600 capitalize'>{project.aiAnalysis.complexity}</p>
              <p className='text-xs text-gray-600'>複雜度</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
