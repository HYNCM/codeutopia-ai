import React, { useState, useRef, useEffect } from 'react'
import { Bell, Check, CheckCheck, Trash2, X, ExternalLink } from 'lucide-react'
import { useNotifications, AppNotification, NotificationType } from '../../contexts/NotificationContext'
import { Link } from 'react-router-dom'

const TYPE_ICONS: Record<NotificationType, { icon: string; color: string }> = {
  bid: { icon: '💰', color: 'bg-green-100 text-green-600' },
  milestone: { icon: '🎯', color: 'bg-blue-100 text-blue-600' },
  message: { icon: '💬', color: 'bg-purple-100 text-purple-600' },
  payment: { icon: '💳', color: 'bg-emerald-100 text-emerald-600' },
  review: { icon: '⭐', color: 'bg-yellow-100 text-yellow-600' },
  system: { icon: '🔔', color: 'bg-gray-100 text-gray-600' },
  project: { icon: '📁', color: 'bg-indigo-100 text-indigo-600' },
  escrow: { icon: '🔒', color: 'bg-orange-100 text-orange-600' },
}

const PRIORITY_STYLES: Record<string, string> = {
  urgent: 'border-l-4 border-red-500',
  high: 'border-l-4 border-orange-500',
  normal: '',
  low: 'opacity-80',
}

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotifications()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return '剛剛'
    if (diffMins < 60) return `${diffMins} 分鐘前`
    if (diffHours < 24) return `${diffHours} 小時前`
    if (diffDays < 7) return `${diffDays} 天前`
    return date.toLocaleDateString()
  }

  const renderNotificationItem = (notification: AppNotification) => {
    const typeConfig = TYPE_ICONS[notification.type] || TYPE_ICONS.system
    const priorityStyle = PRIORITY_STYLES[notification.priority || 'normal']

    return (
      <div
        key={notification.id}
        className={`p-3 hover:bg-gray-50 transition-colors ${priorityStyle} ${
          !notification.read ? 'bg-blue-50/50' : ''
        }`}>
        <div className='flex items-start space-x-3'>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${typeConfig.color}`}>
            {typeConfig.icon}
          </div>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center justify-between'>
              <p className={`text-sm font-medium text-gray-900 truncate ${!notification.read ? 'font-semibold' : ''}`}>
                {notification.title}
              </p>
              <div className='flex items-center space-x-1 ml-2 flex-shrink-0'>
                {!notification.read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      markAsRead(notification.id)
                    }}
                    className='p-1 text-gray-400 hover:text-blue-500 rounded transition-colors'
                    title='標記已讀'>
                    <Check className='w-3.5 h-3.5' />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeNotification(notification.id)
                  }}
                  className='p-1 text-gray-400 hover:text-red-500 rounded transition-colors'
                  title='刪除'>
                  <X className='w-3.5 h-3.5' />
                </button>
              </div>
            </div>
            <p className='text-xs text-gray-500 mt-0.5 line-clamp-2'>{notification.message}</p>
            <div className='flex items-center justify-between mt-1.5'>
              <span className='text-xs text-gray-400'>{formatTime(notification.timestamp)}</span>
              {notification.link && (
                <Link
                  to={notification.link}
                  onClick={() => {
                    markAsRead(notification.id)
                    setIsOpen(false)
                  }}
                  className='text-xs text-purple-600 hover:text-purple-700 flex items-center'>
                  查看詳情
                  <ExternalLink className='w-3 h-3 ml-1' />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='relative' ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors'>
        <Bell className='w-5 h-5' />
        {unreadCount > 0 && (
          <span className='absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse'>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className='absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200'>
          {/* Header */}
          <div className='p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50'>
            <h3 className='font-semibold text-gray-900'>通知中心</h3>
            <div className='flex items-center space-x-2'>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className='text-xs text-purple-600 hover:text-purple-700 flex items-center px-2 py-1 rounded hover:bg-purple-100 transition-colors'>
                  <CheckCheck className='w-3.5 h-3.5 mr-1' />
                  全部已讀
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className='text-xs text-gray-500 hover:text-red-500 flex items-center px-2 py-1 rounded hover:bg-red-50 transition-colors'>
                  <Trash2 className='w-3.5 h-3.5 mr-1' />
                  清空
                </button>
              )}
            </div>
          </div>

          {/* Notification List */}
          <div className='max-h-96 overflow-y-auto divide-y divide-gray-100'>
            {notifications.length === 0 ? (
              <div className='p-8 text-center'>
                <Bell className='w-12 h-12 text-gray-300 mx-auto mb-3' />
                <p className='text-sm text-gray-500'>暫無通知</p>
              </div>
            ) : (
              notifications.slice(0, 10).map(renderNotificationItem)
            )}
          </div>

          {/* Footer */}
          {notifications.length > 10 && (
            <div className='p-3 border-t border-gray-100 bg-gray-50'>
              <Link
                to='/notifications'
                onClick={() => setIsOpen(false)}
                className='block text-center text-sm text-purple-600 hover:text-purple-700 font-medium'>
                查看全部 {notifications.length} 條通知
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
