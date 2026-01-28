import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { Message, Conversation } from '../types'
import { useAuth } from './AuthContext'

interface MessageContextType {
  conversations: Conversation[]
  messages: Message[]
  activeConversationId: string | null
  unreadTotal: number
  setActiveConversation: (id: string | null) => void
  sendMessage: (conversationId: string, content: string, attachments?: string[]) => void
  markAsRead: (conversationId: string) => void
  getConversationMessages: (conversationId: string) => Message[]
  startConversation: (participantId: string, projectId?: string, projectTitle?: string) => string
  getOrCreateConversation: (participantId: string, projectId?: string, projectTitle?: string) => string
}

const MessageContext = createContext<MessageContextType | undefined>(undefined)

const STORAGE_KEY_MESSAGES = 'codeutopia_messages'
const STORAGE_KEY_CONVERSATIONS = 'codeutopia_conversations'

// Initial mock conversations for demo
const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    participants: ['initiator-1', 'd1'],
    projectId: 'p1',
    projectTitle: '智能客服對話系統',
    lastMessage: '我已經完成了第二階段的開發工作...',
    lastMessageTime: new Date().toISOString(),
    unreadCount: 2,
    createdAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 'conv-2',
    participants: ['initiator-1', 'd2'],
    projectId: 'p2',
    projectTitle: '健康管理App UI設計',
    lastMessage: '設計稿已經更新，請查收',
    lastMessageTime: new Date(Date.now() - 86400000).toISOString(),
    unreadCount: 0,
    createdAt: '2026-01-15T10:00:00Z',
  },
]

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'd1',
    receiverId: 'initiator-1',
    content: '您好！我已經完成了第二階段的開發工作，測試報告已上傳。請您審核後給予反饋。',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: true,
    messageType: 'text',
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: 'initiator-1',
    receiverId: 'd1',
    content: '收到，我會在今天內完成審核。另外第三階段的需求文檔有新更新，請查收。',
    timestamp: new Date(Date.now() - 5400000).toISOString(),
    read: true,
    messageType: 'text',
  },
  {
    id: 'msg-3',
    conversationId: 'conv-1',
    senderId: 'd1',
    receiverId: 'initiator-1',
    content: '好的，謝謝！我會盡快查看並開始第三階段的開發。',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false,
    messageType: 'text',
  },
  {
    id: 'msg-4',
    conversationId: 'conv-1',
    senderId: 'd1',
    receiverId: 'initiator-1',
    content: '我已經完成了第二階段的開發工作，請您審核。',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    read: false,
    messageType: 'text',
  },
  {
    id: 'msg-5',
    conversationId: 'conv-2',
    senderId: 'd2',
    receiverId: 'initiator-1',
    content: '設計稿已經更新，請查收',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    read: true,
    messageType: 'text',
  },
]

export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth()

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CONVERSATIONS)
      return stored ? JSON.parse(stored) : INITIAL_CONVERSATIONS
    } catch {
      return INITIAL_CONVERSATIONS
    }
  })

  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_MESSAGES)
      return stored ? JSON.parse(stored) : INITIAL_MESSAGES
    } catch {
      return INITIAL_MESSAGES
    }
  })

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CONVERSATIONS, JSON.stringify(conversations))
  }, [conversations])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages))
  }, [messages])

  // Calculate unread total for current user
  const unreadTotal = conversations
    .filter((c) => c.participants.includes(user?.id || ''))
    .reduce((sum, c) => sum + c.unreadCount, 0)

  const setActiveConversation = useCallback((id: string | null) => {
    setActiveConversationId(id)
    if (id) {
      // Mark messages as read when opening conversation
      setMessages((prev) =>
        prev.map((m) =>
          m.conversationId === id && m.receiverId === user?.id ? { ...m, read: true } : m
        )
      )
      // Reset unread count
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
      )
    }
  }, [user?.id])

  const sendMessage = useCallback(
    (conversationId: string, content: string, attachments?: string[]) => {
      if (!user) return

      const conversation = conversations.find((c) => c.id === conversationId)
      if (!conversation) return

      const receiverId = conversation.participants.find((p) => p !== user.id) || ''

      const newMessage: Message = {
        id: crypto.randomUUID(),
        conversationId,
        senderId: user.id,
        receiverId,
        content,
        timestamp: new Date().toISOString(),
        read: false,
        attachments,
        messageType: 'text',
      }

      setMessages((prev) => [...prev, newMessage])

      // Update conversation's last message
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                lastMessage: content,
                lastMessageTime: newMessage.timestamp,
                unreadCount: c.unreadCount + (receiverId !== user.id ? 0 : 1),
              }
            : c
        )
      )
    },
    [user, conversations]
  )

  const markAsRead = useCallback(
    (conversationId: string) => {
      if (!user) return
      setMessages((prev) =>
        prev.map((m) =>
          m.conversationId === conversationId && m.receiverId === user.id
            ? { ...m, read: true }
            : m
        )
      )
      setConversations((prev) =>
        prev.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c))
      )
    },
    [user]
  )

  const getConversationMessages = useCallback(
    (conversationId: string) => {
      return messages
        .filter((m) => m.conversationId === conversationId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    },
    [messages]
  )

  const startConversation = useCallback(
    (participantId: string, projectId?: string, projectTitle?: string) => {
      if (!user) return ''

      const newConversation: Conversation = {
        id: crypto.randomUUID(),
        participants: [user.id, participantId],
        projectId,
        projectTitle,
        unreadCount: 0,
        createdAt: new Date().toISOString(),
      }

      setConversations((prev) => [newConversation, ...prev])
      return newConversation.id
    },
    [user]
  )

  const getOrCreateConversation = useCallback(
    (participantId: string, projectId?: string, projectTitle?: string) => {
      if (!user) return ''

      // Check if conversation already exists
      const existing = conversations.find(
        (c) =>
          c.participants.includes(user.id) &&
          c.participants.includes(participantId) &&
          (projectId ? c.projectId === projectId : true)
      )

      if (existing) return existing.id

      return startConversation(participantId, projectId, projectTitle)
    },
    [user, conversations, startConversation]
  )

  return (
    <MessageContext.Provider
      value={{
        conversations,
        messages,
        activeConversationId,
        unreadTotal,
        setActiveConversation,
        sendMessage,
        markAsRead,
        getConversationMessages,
        startConversation,
        getOrCreateConversation,
      }}>
      {children}
    </MessageContext.Provider>
  )
}

export const useMessages = () => {
  const context = useContext(MessageContext)
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider')
  }
  return context
}
