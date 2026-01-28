import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { mockDevelopers } from '../data/mockData'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  Star,
  Briefcase,
  Award,
  Edit,
  Camera,
  CheckCircle,
  Settings,
  ExternalLink,
  Heart,
  MessageSquare,
} from 'lucide-react'

export function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const developer = mockDevelopers[0] // Demo data

  const stats = [
    { label: '完成項目', value: developer.completedProjects, icon: Briefcase },
    { label: '評分', value: developer.rating, icon: Star },
    { label: '總收益', value: `NT$${(developer.balance / 1000).toFixed(0)}K`, icon: Award },
    { label: '成功率', value: '98%', icon: CheckCircle },
  ]

  return (
    <div className='space-y-6'>
      {/* Profile Header */}
      <div className='bg-white rounded-xl border border-gray-200 p-6'>
        <div className='flex flex-col md:flex-row gap-6'>
          {/* Avatar */}
          <div className='relative'>
            <img src={developer.avatar} alt={developer.name} className='w-32 h-32 rounded-2xl' />
            <button className='absolute bottom-0 right-0 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors'>
              <Camera className='w-4 h-4' />
            </button>
          </div>

          {/* Basic Info */}
          <div className='flex-1'>
            <div className='flex items-start justify-between'>
              <div>
                <div className='flex items-center space-x-2'>
                  <h1 className='text-2xl font-bold text-gray-900'>{developer.name}</h1>
                  {developer.verified && <CheckCircle className='w-5 h-5 text-green-500' />}
                </div>
                <p className='text-gray-500 mt-1'>{developer.bio}</p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className='flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'>
                <Edit className='w-4 h-4' />
                <span>編輯檔案</span>
              </button>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-4 gap-4 mt-6'>
              {stats.map((stat, idx) => (
                <div key={idx} className='text-center p-4 bg-gray-50 rounded-xl'>
                  <div className='flex items-center justify-center space-x-1 text-gray-500 mb-1'>
                    <stat.icon className='w-4 h-4' />
                  </div>
                  <p className='text-xl font-bold text-gray-900'>{stat.value}</p>
                  <p className='text-xs text-gray-500'>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <div className='flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-100'>
              <div className='flex items-center space-x-2 text-sm text-gray-600'>
                <Mail className='w-4 h-4 text-gray-400' />
                <span>{developer.email}</span>
              </div>
              <div className='flex items-center space-x-2 text-sm text-gray-600'>
                <MapPin className='w-4 h-4 text-gray-400' />
                <span>{developer.location}</span>
              </div>
              <div className='flex items-center space-x-2 text-sm text-gray-600'>
                <Clock className='w-4 h-4 text-gray-400' />
                <span>響應時間 2小時內</span>
              </div>
              <div className='flex items-center space-x-2 text-sm text-gray-600'>
                <User className='w-4 h-4 text-gray-400' />
                <span>註冊於 {developer.memberSince}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Main Content */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Skills */}
          <div className='bg-white rounded-xl border border-gray-200 p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-lg font-semibold text-gray-900'>技能</h2>
              <button className='text-sm text-purple-600 hover:text-purple-700'>編輯</button>
            </div>
            <div className='flex flex-wrap gap-2'>
              {developer.skills.map((skill) => (
                <span
                  key={skill}
                  className='px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-full text-sm font-medium'>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Portfolio */}
          <div className='bg-white rounded-xl border border-gray-200 p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-lg font-semibold text-gray-900'>作品集</h2>
              <button className='text-sm text-purple-600 hover:text-purple-700'>添加項目</button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {developer.portfolio?.map((item) => (
                <div
                  key={item.id}
                  className='group border border-gray-200 rounded-xl overflow-hidden hover:border-purple-200 transition-colors'>
                  <div className='aspect-video relative overflow-hidden'>
                    <img
                      src={item.image}
                      alt={item.title}
                      className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                    />
                    <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                      <button className='flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg text-sm'>
                        <ExternalLink className='w-4 h-4' />
                        <span>查看詳情</span>
                      </button>
                    </div>
                  </div>
                  <div className='p-4'>
                    <h3 className='font-medium text-gray-900'>{item.title}</h3>
                    <p className='text-sm text-gray-500 mt-1'>{item.description}</p>
                    <div className='flex flex-wrap gap-2 mt-2'>
                      {item.technologies.map((tech) => (
                        <span key={tech} className='px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs'>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className='bg-white rounded-xl border border-gray-200 p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-lg font-semibold text-gray-900'>認證</h2>
              <button className='text-sm text-purple-600 hover:text-purple-700'>添加認證</button>
            </div>

            <div className='space-y-3'>
              {developer.certifications?.map((cert, idx) => (
                <div
                  key={idx}
                  className='flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg'>
                  <div className='w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center'>
                    <Award className='w-5 h-5 text-yellow-600' />
                  </div>
                  <div className='flex-1'>
                    <p className='font-medium text-gray-900'>{cert}</p>
                    <p className='text-sm text-gray-500'>已驗證</p>
                  </div>
                  <CheckCircle className='w-5 h-5 text-green-500' />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Hourly Rate */}
          <div className='bg-white rounded-xl border border-gray-200 p-6'>
            <h3 className='text-sm font-medium text-gray-500 mb-2'>時薪</h3>
            <p className='text-3xl font-bold text-gray-900'>NT$ {developer.hourlyRate}</p>
            <p className='text-sm text-gray-500 mt-1'>平台服務費已包含</p>
          </div>

          {/* Availability */}
          <div className='bg-white rounded-xl border border-gray-200 p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='font-medium text-gray-900'>可用性</h3>
              <span className='px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium'>可接單</span>
            </div>
            <p className='text-sm text-gray-600'>每週可工作 40 小時，響應時間 2 小時內</p>
          </div>

          {/* Languages */}
          <div className='bg-white rounded-xl border border-gray-200 p-6'>
            <h3 className='font-medium text-gray-900 mb-3'>語言</h3>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>中文</span>
                <span className='text-sm font-medium text-gray-900'>母語</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>英文</span>
                <span className='text-sm font-medium text-gray-900'>專業</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className='bg-white rounded-xl border border-gray-200 p-6'>
            <h3 className='font-medium text-gray-900 mb-4'>快速操作</h3>
            <div className='space-y-2'>
              <button className='w-full flex items-center space-x-3 p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors'>
                <Heart className='w-5 h-5' />
                <span>收藏我的檔案</span>
              </button>
              <button className='w-full flex items-center space-x-3 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors'>
                <MessageSquare className='w-5 h-5' />
                <span>分享我的檔案</span>
              </button>
            </div>
          </div>

          {/* Profile Strength */}
          <div className='bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100'>
            <h3 className='font-medium text-gray-900 mb-3'>檔案完整度</h3>
            <div className='relative pt-4'>
              <div className='h-3 bg-gray-200 rounded-full overflow-hidden'>
                <div
                  className='h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full'
                  style={{ width: '85%' }}
                />
              </div>
            </div>
            <div className='flex justify-between text-xs text-gray-500 mt-2'>
              <span>85% 完成</span>
              <span>距離完美只差一步</span>
            </div>
            <p className='text-sm text-gray-600 mt-3'>建議：添加更多作品集項目可提升曝光率</p>
          </div>
        </div>
      </div>
    </div>
  )
}
