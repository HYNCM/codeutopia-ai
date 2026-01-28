import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import type { Notification } from '../types'
import { useAuth } from './AuthContext'

// Extended notification type for internal use
export type NotificationType = 'bid' | 'milestone' | 'message' | 'payment' | 'review' | 'system' | 'project' | 'escrow'

export interface AppNotification extends Omit<Notification, 'type'> {
  type: NotificationType
  userId?: string // Target user
  projectId?: string
  milestoneId?: string
  actionRequired?: boolean
  priority?: 'low' | 'normal' | 'high' | 'urgent'
}

interface NotificationContextType {
  notifications: AppNotification[]
  unreadCount: number
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
  getNotificationsByType: (type: NotificationType) => AppNotification[]
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

const STORAGE_KEY = 'codeutopia_notifications'

// Initial mock notifications
const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'milestone',
    title: '里程碑已通過',
    message: '您的項目「智能客服對話系統開發」第一階段里程碑已通過審核',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false,
    link: '/projects/prj2',
    projectId: 'prj2',
    priority: 'high',
  },
  {
    id: 'notif-2',
    type: 'bid',
    title: '收到新報價',
    message: '王小明 對您的項目「電商平台前端重構」提交了報價',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: false,
    link: '/projects/prj1#bids',
    projectId: 'prj1',
    actionRequired: true,
    priority: 'normal',
  },
  {
    id: 'notif-3',
    type: 'payment',
    title: '款項已釋放',
    message: '里程碑款項 NT$30,000 已成功釋放至承包商帳戶',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    read: true,
    link: '/transactions',
    priority: 'normal',
  },
  {
    id: 'notif-4',
    type: 'message',
    title: '新消息',
    message: '李美華 發送了一條新消息',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    read: true,
    link: '/messages',
    priority: 'low',
  },
  {
    id: 'notif-5',
    type: 'system',
    title: '系統公告',
    message: 'CodeUtopia.ai 平台將於本週末進行維護升級',
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    read: true,
    priority: 'low',
  },
]

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth()

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : INITIAL_NOTIFICATIONS
    } catch {
      return INITIAL_NOTIFICATIONS
    }
  })

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
  }, [notifications])

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !n.read).length

  const addNotification = useCallback(
    (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
      const newNotification: AppNotification = {
        ...notification,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        read: false,
        priority: notification.priority || 'normal',
      }

      setNotifications((prev) => [newNotification, ...prev])

      // Optional: Browser notification if permission granted
      if (Notification.permission === 'granted') {
        new Notification(newNotification.title, {
          body: newNotification.message,
          icon: '/favicon.ico',
        })
      }
    },
    []
  )

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  const getNotificationsByType = useCallback(
    (type: NotificationType) => {
      return notifications.filter((n) => n.type === type)
    },
    [notifications]
  )

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
        getNotificationsByType,
      }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

// Helper hook to request notification permission
export const useNotificationPermission = () => {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  )

  const requestPermission = useCallback(async () => {
    if (typeof Notification === 'undefined') return 'denied'

    const result = await Notification.requestPermission()
    setPermission(result)
    return result
  }, [])

  return { permission, requestPermission }
}
