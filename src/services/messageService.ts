import { Message } from '../types'
import { mockMessages } from '../data/mockData'

// Simulated in-memory storage for new messages
let messages = [...mockMessages]

export const messageService = {
  getMessages: async (userId: string): Promise<Message[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userMessages = messages
          .filter((m) => m.senderId === userId || m.receiverId === userId)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        resolve(userMessages)
      }, 400)
    })
  },

  getUnreadCount: async (userId: string): Promise<number> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const count = messages.filter((m) => m.receiverId === userId && !m.read).length
        resolve(count)
      }, 300)
    })
  },

  markAsRead: async (messageId: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        messages = messages.map((m) => (m.id === messageId ? { ...m, read: true } : m))
        resolve()
      }, 200)
    })
  },

  sendMessage: async (messageData: Omit<Message, 'id' | 'timestamp' | 'read'>): Promise<Message> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newMessage: Message = {
          ...messageData,
          id: `msg_${Date.now()}`,
          timestamp: new Date().toISOString(),
          read: false,
        }
        messages = [newMessage, ...messages]
        resolve(newMessage)
      }, 500)
    })
  },
}
