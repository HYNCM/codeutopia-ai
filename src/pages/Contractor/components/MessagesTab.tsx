import React, { useState, useEffect } from 'react'
import { Search, Send, FileText, MoreVertical, Phone, Video } from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import { useMessages } from '../../../contexts/MessageContext'
import { mockClients, mockDevelopers } from '../../../data/mockData'
import { Message, User, Conversation } from '../../../types'

// Extended conversation type for UI (includes messages and otherUser)
interface UIConversation extends Conversation {
  otherUser: User
  messages: Message[]
}

export const MessagesTab: React.FC = () => {
  const { user } = useAuth()
  const { conversations, isLoading, sendMessage, markAsRead, setActiveConversation } = useMessages()
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [inputText, setInputText] = useState('')
  const [localMessages, setLocalMessages] = useState<{ [key: string]: Message[] }>({})

  // Set initial selection when conversations load
  useEffect(() => {
    if (conversations.length > 0 && !selectedUserId) {
      setSelectedUserId(conversations[0].id)
    }
  }, [conversations, selectedUserId])

  // Mark as read and set active conversation when selecting
  useEffect(() => {
    if (selectedUserId) {
      setActiveConversation(selectedUserId)
      markAsRead(selectedUserId)
    }
  }, [selectedUserId, setActiveConversation, markAsRead])

  const getUserDetails = (id: string): User => {
    return (
      mockClients.find((u) => u.id === id) ||
      mockDevelopers.find((u) => u.id === id) ||
      ({
        id,
        name: 'Unknown User',
        avatar: `https://ui-avatars.com/api/?name=${id}`,
        role: 'client',
      } as User)
    )
  }

  // Get messages for a conversation (augmented from context)
  const getConversationMessages = (convId: string): Message[] => {
    // The context stores messages embedded in conversations (via groupMessages)
    // We access them via the augmented property
    const conv = conversations.find((c) => c.id === convId) as unknown as UIConversation
    const contextMessages = conv?.messages || []
    const local = localMessages[convId] || []
    return [...contextMessages, ...local]
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || !selectedUserId || !user) return

    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      senderId: user.id,
      receiverId: selectedUserId,
      content: inputText,
      timestamp: new Date().toISOString(),
      read: false,
    }

    // Optimistic update
    setLocalMessages((prev) => ({
      ...prev,
      [selectedUserId]: [...(prev[selectedUserId] || []), tempMessage],
    }))
    setInputText('')

    try {
      await sendMessage(selectedUserId, inputText)
    } catch (error) {
      console.error('Failed to send message:', error)
      // Rollback on error
      setLocalMessages((prev) => ({
        ...prev,
        [selectedUserId]: (prev[selectedUserId] || []).filter((m) => m.id !== tempMessage.id),
      }))
    }
  }

  const activeConversation = conversations.find((c) => c.id === selectedUserId)
  const activeUser = selectedUserId ? getUserDetails(selectedUserId) : null
  const activeMessages = selectedUserId ? getConversationMessages(selectedUserId) : []

  return (
    <div className='h-[calc(100vh-8rem)] bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border-color)] overflow-hidden flex'>
      {/* Sidebar List */}
      <div className='w-80 border-r border-[var(--border-color)] flex flex-col'>
        <div className='p-4 border-b border-[var(--border-color)]'>
          <h2 className='text-lg font-bold text-[var(--text-primary)] mb-4'>消息中心</h2>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
            <input
              type='text'
              placeholder='搜索對話...'
              className='w-full pl-10 pr-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-primary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
            />
          </div>
        </div>

        <div className='flex-1 overflow-y-auto'>
          {isLoading ? (
            <div className='p-8 text-center text-gray-500'>加載中...</div>
          ) : conversations.length === 0 ? (
            <div className='p-8 text-center text-gray-500'>暫無消息</div>
          ) : (
            conversations.map((conv) => {
              const otherUser = getUserDetails(conv.id)
              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedUserId(conv.id)}
                  className={`w-full p-4 flex items-start space-x-3 hover:bg-[var(--bg-card-hover)] transition-colors border-b border-[var(--border-subtle)] ${
                    selectedUserId === conv.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}>
                  <div className='relative'>
                    <img src={otherUser.avatar} alt={otherUser.name} className='w-12 h-12 rounded-full object-cover' />
                    {conv.unreadCount > 0 && (
                      <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-gray-800'>
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className='flex-1 min-w-0 text-left'>
                    <div className='flex justify-between items-baseline mb-1'>
                      <h3 className='font-medium text-[var(--text-primary)] truncate'>{otherUser.name}</h3>
                      <span className='text-xs text-[var(--text-muted)]'>
                        {conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <p className='text-sm text-[var(--text-muted)] truncate'>{conv.lastMessage}</p>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className='flex-1 flex flex-col bg-[var(--bg-primary)]'>
        {selectedUserId && activeUser ? (
          <>
            <div className='p-4 bg-[var(--bg-card)] border-b border-[var(--border-color)] flex justify-between items-center'>
              <div className='flex items-center space-x-3'>
                <img src={activeUser.avatar} alt={activeUser.name} className='w-10 h-10 rounded-full' />
                <div>
                  <h3 className='font-bold text-[var(--text-primary)]'>{activeUser.name}</h3>
                  <p className='text-xs text-[var(--text-muted)]'>{activeUser.role === 'client' ? '客戶' : '開發者'}</p>
                </div>
              </div>
              <div className='flex items-center space-x-2'>
                <button className='p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-full hover:bg-[var(--bg-card-hover)]'>
                  <Phone className='w-5 h-5' />
                </button>
                <button className='p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-full hover:bg-[var(--bg-card-hover)]'>
                  <Video className='w-5 h-5' />
                </button>
                <button className='p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-full hover:bg-[var(--bg-card-hover)]'>
                  <MoreVertical className='w-5 h-5' />
                </button>
              </div>
            </div>

            <div className='flex-1 overflow-y-auto p-6 space-y-6'>
              {activeMessages.map((msg) => {
                const isMe = msg.senderId === user?.id
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[70%] rounded-2xl px-5 py-3 ${
                        isMe
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-tl-none'
                      }`}>
                      <p className='text-sm leading-relaxed'>{msg.content}</p>
                      <div className={`text-xs mt-1 text-right ${isMe ? 'text-blue-100' : 'text-[var(--text-muted)]'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className='p-4 bg-[var(--bg-card)] border-t border-[var(--border-color)]'>
              <form onSubmit={handleSendMessage} className='flex gap-2'>
                <button
                  type='button'
                  className='p-2 text-[var(--text-muted)] hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors'>
                  <FileText className='w-6 h-6' />
                </button>
                <input
                  type='text'
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder='輸入訊息...'
                  className='flex-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-2 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                />
                <button
                  type='submit'
                  disabled={!inputText.trim()}
                  className='p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm'>
                  <Send className='w-5 h-5' />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className='flex-1 flex flex-col items-center justify-center text-[var(--text-muted)]'>
            <div className='w-16 h-16 bg-[var(--bg-card)] rounded-full flex items-center justify-center mb-4 border border-[var(--border-color)]'>
              <Send className='w-8 h-8 text-gray-400' />
            </div>
            <p className='text-lg font-medium'>選擇一個對話開始聊天</p>
          </div>
        )}
      </div>
    </div>
  )
}
