import React, { useState, useEffect } from 'react'
import { Search, Star } from 'lucide-react'
import { REGIONS } from '../../../services/mockData'
import { talentService } from '../../../services/talentService'

export const TalentsTab: React.FC = () => {
  const [talents, setTalents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTalents = async () => {
      try {
        const data = await talentService.getRecommendedTalents()
        setTalents(data)
      } catch (error) {
        console.error('Failed to load talents:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadTalents()
  }, [])

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-[var(--text-primary)]'>人才庫</h1>
          <p className='text-[var(--text-muted)] mt-1'>搜索和篩選全球優質開發者與設計師</p>
        </div>
      </div>

      {/* 人才篩選 */}
      <div className='bg-[var(--bg-card)] rounded-2xl p-4 shadow-sm border border-[var(--border-color)] transition-colors duration-150'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <div className='relative'>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]' />
            <input
              type='text'
              placeholder='搜索人才...'
              className='w-full pl-12 pr-4 py-2.5 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-purple-500'
            />
          </div>
          <select className='py-2.5 px-4 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-secondary)]'>
            <option>全部技能</option>
            <option>React</option>
            <option>Node.js</option>
            <option>AI/ML</option>
            <option>UI/UX</option>
          </select>
          <select className='py-2.5 px-4 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-secondary)]'>
            <option>全部區域</option>
            {REGIONS.map((r) => (
              <option key={r.id}>{r.name}</option>
            ))}
          </select>
          <select className='py-2.5 px-4 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-secondary)]'>
            <option>全部價格</option>
            <option>$0-50/h</option>
            <option>$50-100/h</option>
            <option>$100+/h</option>
          </select>
        </div>
      </div>

      {/* 人才卡片網格 */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {isLoading ? (
          <div className='col-span-3 text-center py-8 text-gray-500'>加載中...</div>
        ) : (
          talents.map((talent) => (
            <div
              key={talent.id}
              className='bg-[var(--bg-card)] rounded-2xl p-6 shadow-sm border border-[var(--border-color)] hover:shadow-md transition-all'>
              <div className='flex items-start space-x-4'>
                <img
                  src={talent.avatar}
                  alt={talent.name}
                  className='w-14 h-14 rounded-full border-2 border-[var(--bg-card)] shadow-sm'
                />
                <div className='flex-1'>
                  <h3 className='font-bold text-[var(--text-primary)]'>{talent.name}</h3>
                  <p className='text-sm text-[var(--text-muted)]'>{talent.role}</p>
                  <div className='flex items-center space-x-1 mt-1'>
                    <Star className='w-3.5 h-3.5 text-yellow-400 fill-current' />
                    <span className='text-sm font-medium text-[var(--text-primary)]'>{talent.rating}</span>
                    <span className='text-xs text-[var(--text-muted)]'>({talent.completedProjects})</span>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='text-lg font-bold text-purple-600'>${talent.hourlyRate}</div>
                  <div className='text-xs text-[var(--text-muted)]'>/小時</div>
                </div>
              </div>

              <div className='mt-4 flex flex-wrap gap-2'>
                {talent.skills.map((skill) => (
                  <span
                    key={skill}
                    className='px-2.5 py-1 bg-[var(--bg-input)] text-[var(--text-secondary)] rounded-lg text-xs font-medium'>
                    {skill}
                  </span>
                ))}
              </div>

              <div className='mt-6 flex space-x-3'>
                <button className='flex-1 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all'>
                  邀請面試
                </button>
                <button className='px-4 py-2 border border-[var(--border-subtle)] text-[var(--text-secondary)] rounded-xl hover:bg-[var(--bg-card-hover)] transition-colors'>
                  詳情
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
