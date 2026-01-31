import { useState } from 'react'
import { mockDevelopers, SKILLS } from '../data/mockData'
import { Link } from 'react-router-dom'
import {
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  Award,
  Briefcase,
  Heart,
  MessageSquare,
  ChevronDown,
  Sparkles,
} from 'lucide-react'

interface TalentPoolPageProps {
  isEmbedded?: boolean
}

export function TalentPoolPage({ isEmbedded = false }: TalentPoolPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState('all')
  const [ratingFilter, setRatingFilter] = useState('all')

  const filteredDevelopers = mockDevelopers.filter((dev) => {
    const matchesSearch =
      dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesSkills = selectedSkills.length === 0 || selectedSkills.some((s) => dev.skills.includes(s))
    const matchesPrice =
      priceRange === 'all' ||
      (priceRange === 'low' && dev.hourlyRate! < 60) ||
      (priceRange === 'medium' && dev.hourlyRate! >= 60 && dev.hourlyRate! < 80) ||
      (priceRange === 'high' && dev.hourlyRate! >= 80)
    const matchesRating =
      ratingFilter === 'all' ||
      (ratingFilter === 'high' && dev.rating >= 4.8) ||
      (ratingFilter === 'top' && dev.rating >= 4.9)

    return matchesSearch && matchesSkills && matchesPrice && matchesRating
  })

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  return (
    <div className='space-y-6'>
      {/* Header - Only show if not embedded */}
      {!isEmbedded && (
        <div>
          <h1 className='text-2xl font-bold text-[var(--text-primary)]'>人才庫</h1>
          <p className='text-[var(--text-muted)] mt-1'>探索來自全球的優質開發者和設計師</p>
        </div>
      )}

      {/* AI Recommendation Banner */}
      <div className='bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-xl p-4'>
        <div className='flex items-center space-x-3'>
          <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
            <Sparkles className='w-5 h-5 text-blue-600' />
          </div>
          <div className='flex-1'>
            <p className='font-medium text-gray-900'>AI 智能匹配人才</p>
            <p className='text-sm text-gray-600'>根據您的項目需求，推薦了 5 位高度匹配的優質開發者</p>
          </div>
          <Link
            to='/ai-recommendations'
            className='px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors'>
            查看推薦
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className='bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-4'>
        <div className='flex flex-col lg:flex-row gap-4'>
          {/* Search */}
          <div className='flex-1 relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
            <input
              type='text'
              placeholder='搜索開發者姓名或技能...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-10 pr-4 py-2.5 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)]'
            />
          </div>

          {/* Filter Buttons */}
          <div className='flex flex-wrap items-center gap-3'>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className='px-4 py-2.5 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500'>
              <option value='all'>時薪不限</option>
              <option value='low'>NT$ 60 以下</option>
              <option value='medium'>NT$ 60-80</option>
              <option value='high'>NT$ 80 以上</option>
            </select>

            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className='px-4 py-2.5 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500'>
              <option value='all'>評分不限</option>
              <option value='high'>4.8 以上</option>
              <option value='top'>4.9 以上</option>
            </select>

            <button className='flex items-center space-x-2 px-4 py-2.5 border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] transition-colors'>
              <Filter className='w-4 h-4' />
              <span>更多篩選</span>
            </button>
          </div>
        </div>

        {/* Skill Tags */}
        <div className='mt-4 pt-4 border-t border-[var(--border-subtle)]'>
          <div className='flex items-center space-x-2 mb-2'>
            <span className='text-sm text-gray-500'>熱門技能：</span>
          </div>
          <div className='flex flex-wrap gap-2'>
            {SKILLS.slice(0, 15).map((skill) => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  selectedSkills.includes(skill)
                    ? 'bg-purple-600 text-white'
                    : 'bg-[var(--bg-input)] text-[var(--text-secondary)] hover:bg-purple-100 hover:text-purple-600 dark:hover:bg-purple-900/30 dark:hover:text-purple-400'
                }`}>
                {skill}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className='flex items-center justify-between'>
        <p className='text-sm text-[var(--text-muted)]'>
          找到 <span className='font-medium text-[var(--text-primary)]'>{filteredDevelopers.length}</span>{' '}
          位符合條件的開發者
        </p>
        <div className='flex items-center space-x-2'>
          <span className='text-sm text-[var(--text-muted)]'>排序：</span>
          <select className='px-3 py-1.5 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500'>
            <option>相關度</option>
            <option>評分高到低</option>
            <option>時薪低到高</option>
            <option>時薪高到低</option>
          </select>
        </div>
      </div>

      {/* Developer Cards */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        {filteredDevelopers.map((developer) => (
          <DeveloperCard key={developer.id} developer={developer} />
        ))}
      </div>

      {filteredDevelopers.length === 0 && (
        <div className='text-center py-12 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)]'>
          <Briefcase className='w-12 h-12 text-[var(--text-muted)] mx-auto mb-4' />
          <h3 className='text-lg font-medium text-[var(--text-primary)]'>沒有找到匹配的開發者</h3>
          <p className='text-[var(--text-muted)] mt-1'>嘗試調整搜索條件或技能標籤</p>
        </div>
      )}
    </div>
  )
}

function DeveloperCard({ developer }: { developer: (typeof mockDevelopers)[0] }) {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <div className='bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-6 hover:border-purple-200 hover:shadow-lg transition-all duration-300'>
      <div className='flex items-start justify-between mb-4'>
        <div className='flex items-start space-x-4'>
          <img src={developer.avatar} alt={developer.name} className='w-14 h-14 rounded-xl' />
          <div>
            <div className='flex items-center space-x-2'>
              <h3 className='font-semibold text-[var(--text-primary)]'>{developer.name}</h3>
              {developer.verified && <CheckCircle className='w-4 h-4 text-green-500' />}
            </div>
            <p className='text-sm text-[var(--text-muted)] mt-0.5'>{developer.bio}</p>
            <div className='flex items-center space-x-3 mt-2 text-sm text-[var(--text-muted)]'>
              <span className='flex items-center space-x-1'>
                <MapPin className='w-3.5 h-3.5' />
                <span>{developer.location}</span>
              </span>
              <span className='flex items-center space-x-1'>
                <Clock className='w-3.5 h-3.5' />
                <span>響應時間 2小時內</span>
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className={`p-2 rounded-lg transition-colors ${
            isFavorite ? 'bg-red-50 text-red-500' : 'text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)]'
          }`}>
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-4 gap-4 mb-4'>
        <div className='text-center p-3 bg-[var(--bg-input)] rounded-lg'>
          <div className='flex items-center justify-center space-x-1'>
            <Star className='w-4 h-4 text-yellow-400 fill-yellow-400' />
            <span className='font-bold text-[var(--text-primary)]'>{developer.rating}</span>
          </div>
          <p className='text-xs text-[var(--text-muted)] mt-1'>評分</p>
        </div>
        <div className='text-center p-3 bg-[var(--bg-input)] rounded-lg'>
          <p className='font-bold text-[var(--text-primary)]'>{developer.completedProjects}</p>
          <p className='text-xs text-[var(--text-muted)] mt-1'>完成項目</p>
        </div>
        <div className='text-center p-3 bg-[var(--bg-input)] rounded-lg'>
          <p className='font-bold text-[var(--text-primary)]'>{developer.skills.length}</p>
          <p className='text-xs text-[var(--text-muted)] mt-1'>技能</p>
        </div>
        <div className='text-center p-3 bg-[var(--bg-input)] rounded-lg'>
          <p className='font-bold text-[var(--text-primary)]'>98%</p>
          <p className='text-xs text-[var(--text-muted)] mt-1'>成功率</p>
        </div>
      </div>

      {/* Skills */}
      <div className='flex flex-wrap gap-2 mb-4'>
        {developer.skills.map((skill) => (
          <span key={skill} className='px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium'>
            {skill}
          </span>
        ))}
      </div>

      {/* Portfolio Preview */}
      {developer.portfolio && developer.portfolio.length > 0 && (
        <div className='mb-4'>
          <p className='text-xs text-[var(--text-muted)] mb-2'>作品集</p>
          <div className='flex space-x-2'>
            {developer.portfolio.slice(0, 3).map((item) => (
              <div key={item.id} className='w-20 h-20 rounded-lg overflow-hidden'>
                <img src={item.image} alt={item.title} className='w-full h-full object-cover' />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {developer.certifications && developer.certifications.length > 0 && (
        <div className='flex items-center space-x-2 mb-4'>
          <Award className='w-4 h-4 text-yellow-500' />
          <span className='text-xs text-[var(--text-muted)]'>{developer.certifications[0]}</span>
        </div>
      )}

      {/* Price and Actions */}
      <div className='flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]'>
        <div>
          <p className='text-lg font-bold text-[var(--text-primary)]'>NT$ {developer.hourlyRate}/小時</p>
          <p className='text-xs text-[var(--text-muted)]'>平台服務費已包含</p>
        </div>
        <div className='flex items-center space-x-2'>
          <Link
            to={`/messages/new?developer=${developer.id}`}
            className='flex items-center space-x-1 px-4 py-2 border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] transition-colors'>
            <MessageSquare className='w-4 h-4' />
            <span>聯繫</span>
          </Link>
          <Link
            to={`/profile/${developer.id}`}
            className='flex items-center space-x-1 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors'>
            <span>查看檔案</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
