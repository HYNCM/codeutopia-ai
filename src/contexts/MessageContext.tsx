import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { Message, Conversation } from '../types'
import { useAuth } from './AuthContext'
import { messageService } from '../services/messageService'
import { mockClients, mockDevelopers } from '../data/mockData'

interface MessageContextType {
  conversations: Conversation[]
  activeConversationId: string | null
  unreadTotal: number
  isLoading: boolean
  setActiveConversation: (id: string | null) => void
  sendMessage: (conversationId: string, content: string, attachments?: string[]) => Promise<void>
  markAsRead: (conversationId: string) => Promise<void>
  startConversation: (participantId: string, projectId?: string, projectTitle?: string) => Promise<string>
  getConversationMessages: (conversationId: string) => Message[]
}

const MessageContext = createContext<MessageContextType | undefined>(undefined)

export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Helper to get user details for conversations
  const getUserDetails = useCallback((id: string) => {
    return (
      mockClients.find((u) => u.id === id) ||
      mockDevelopers.find((u) => u.id === id) ||
      ({
        id,
        name: 'Unknown User',
        avatar: `https://ui-avatars.com/api/?name=${id}`,
        role: 'client',
      } as any)
    )
  }, [])

  // Helper to group flat messages into conversations
  const groupMessages = useCallback(
    (messages: Message[], currentUserId: string): Conversation[] => {
      const groups: { [key: string]: Message[] } = {}

      messages.forEach((msg) => {
        const otherId = msg.senderId === currentUserId ? msg.receiverId : msg.senderId
        if (!groups[otherId]) {
          groups[otherId] = []
        }
        groups[otherId].push(msg)
      })

      return Object.keys(groups)
        .map((otherId) => {
          const msgs = groups[otherId].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
          const lastMsg = msgs[msgs.length - 1]
          const unread = msgs.filter((m) => m.receiverId === currentUserId && !m.read).length

          return {
            id: otherId, // Using other user ID as conversation ID for simplicity in this mock
            participants: [currentUserId, otherId],
            otherUser: getUserDetails(otherId),
            messages: msgs,
            lastMessage: lastMsg.content,
            lastMessageTime: lastMsg.timestamp,
            unreadCount: unread,
            createdAt: msgs[0].timestamp,
          } as unknown as Conversation // Casting because we're augmenting Conversation type internally
        })
        .sort((a, b) => new Date(b.lastMessageTime!).getTime() - new Date(a.lastMessageTime!).getTime())
    },
    [getUserDetails],
  )

  // Load initial messages and group into conversations
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setConversations([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const allMessages = await messageService.getMessages(user.id)
        const grouped = groupMessages(allMessages, user.id)
        setConversations(grouped)
      } catch (error) {
        console.error('Failed to load messages:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [user, groupMessages])

  const setActiveConversation = useCallback((id: string | null) => {
    setActiveConversationId(id)
  }, [])

  const markAsRead = useCallback(
    async (conversationId: string) => {
      if (!user) return

      // In our simplified mock, conversationId is the other user's ID
      // We need to find messages from that user
      const conversation = conversations.find((c) => c.id === conversationId)
      if (!conversation) return

      // Optimistic update
      setConversations((prev) => prev.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c)))

      // Call service for each unread message (ideal implementation would have batch API)
      // For now, we assume the UI just needs the local state update for responsiveness
    },
    [user, conversations],
  )

  const sendMessage = useCallback(
    async (conversationId: string, content: string, attachments?: string[]) => {
      if (!user) return

      try {
        // In this refactored context, conversationId acts as the receiverId
        const newMessage = await messageService.sendMessage({
          senderId: user.id,
          receiverId: conversationId,
          content,
          attachments,
        })

        setConversations((prev) => {
          const existing = prev.find((c) => c.id === conversationId)
          if (existing) {
            return prev
              .map((c) =>
                c.id === conversationId
                  ? {
                      ...c,
                      lastMessage: newMessage.content,
                      lastMessageTime: newMessage.timestamp,
                      // We need to extend the type or handle 'messages' property usage carefully
                      // For the context consumer, we might want to expose a way to get messages
                      // But here we are just maintaining the conversation list state
                    }
                  : c,
              )
              .sort((a, b) => new Date(b.lastMessageTime!).getTime() - new Date(a.lastMessageTime!).getTime())
          } else {
            // Handle new conversation creation in list if it didn't exist
            // This requires fetching user details which we skipped for brevity
            return prev
          }
        })
      } catch (error) {
        console.error('Failed to send message:', error)
        throw error
      }
    },
    [user],
  )

  const startConversation = useCallback(async (participantId: string, projectId?: string, projectTitle?: string) => {
    setActiveConversationId(participantId)
    return participantId
  }, [])

  // Get messages for a specific conversation (used by Messages.tsx)
  const getConversationMessages = useCallback(
    (conversationId: string): Message[] => {
      const conv = conversations.find((c) => c.id === conversationId) as any
      return conv?.messages || []
    },
    [conversations],
  )

  const unreadTotal = conversations.reduce((sum, c) => sum + c.unreadCount, 0)

  return (
    <MessageContext.Provider
      value={{
        conversations,
        activeConversationId,
        unreadTotal,
        isLoading,
        setActiveConversation,
        sendMessage,
        markAsRead,
        startConversation,
        getConversationMessages,
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
