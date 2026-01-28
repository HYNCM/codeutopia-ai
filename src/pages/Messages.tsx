import { useState, useRef, useEffect } from 'react'
import { useMessages } from '../contexts/MessageContext'
import { useAuth } from '../contexts/AuthContext'
import { mockDevelopers } from '../data/mockData'
import { Send, Search, MoreVertical, Phone, Video, Info, MessageCircle, User } from 'lucide-react'

export function MessagesPage() {
  const { user } = useAuth()
  const { conversations, activeConversationId, setActiveConversation, sendMessage, getConversationMessages } =
    useMessages()

  const [message, setMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get messages for active conversation
  const activeMessages = activeConversationId ? getConversationMessages(activeConversationId) : []

  // Find active conversation details
  const activeConversation = conversations.find((c) => c.id === activeConversationId)

  // Find the other participant (for display)
  const otherParticipantId = activeConversation?.participants.find((p) => p !== user?.id)
  const otherParticipant = mockDevelopers.find((d) => d.id === otherParticipantId) || {
    id: otherParticipantId || '',
    name: 'Unknown User',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Unknown',
    skills: [],
  }

  // Auto-select first conversation if none selected
  useEffect(() => {
    if (!activeConversationId && conversations.length > 0) {
      setActiveConversation(conversations[0].id)
    }
  }, [activeConversationId, conversations, setActiveConversation])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeMessages])

  const handleSendMessage = () => {
    if (message.trim() && activeConversationId) {
      sendMessage(activeConversationId, message.trim())
      setMessage('')
    }
  }

  // Filter conversations by search query
  const filteredConversations = conversations.filter(
    (conv) =>
      conv.projectTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Format time for display
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffDays === 1) {
      return '昨天'
    } else if (diffDays < 7) {
      return ['週日', '週一', '週二', '週三', '週四', '週五', '週六'][date.getDay()]
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className='h-[calc(100vh-8rem)] flex bg-white rounded-xl border border-gray-200 overflow-hidden'>
      {/* Conversations List */}
      <div className='w-80 border-r border-gray-200 flex flex-col'>
        {/* Header */}
        <div className='p-4 border-b border-gray-100'>
          <h2 className='text-lg font-semibold text-gray-900 mb-3'>消息</h2>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='搜索消息...'
              className='w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500'
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className='flex-1 overflow-y-auto'>
          {filteredConversations.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-full text-gray-400 p-6'>
              <MessageCircle className='w-12 h-12 mb-3 opacity-50' />
              <p className='text-sm text-center'>暂无对话</p>
              <p className='text-xs text-center mt-1'>在项目中发起对话开始沟通</p>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const participantId = conv.participants.find((p) => p !== user?.id)
              const participant = mockDevelopers.find((d) => d.id === participantId) || {
                name: 'Unknown',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Unknown',
              }

              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversation(conv.id)}
                  className={`w-full p-4 flex items-start space-x-3 hover:bg-gray-50 transition-colors ${
                    activeConversationId === conv.id ? 'bg-purple-50 border-l-4 border-purple-500' : ''
                  }`}>
                  <div className='relative flex-shrink-0'>
                    <img src={participant.avatar} alt={participant.name} className='w-10 h-10 rounded-full' />
                    {conv.unreadCount > 0 && (
                      <span className='absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center'>
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className='flex-1 min-w-0 text-left'>
                    <div className='flex items-center justify-between'>
                      <p className='font-medium text-gray-900 truncate'>{participant.name}</p>
                      <span className='text-xs text-gray-500'>
                        {conv.lastMessageTime ? formatTime(conv.lastMessageTime) : ''}
                      </span>
                    </div>
                    {conv.projectTitle && <p className='text-sm text-purple-600 truncate'>{conv.projectTitle}</p>}
                    <p className='text-sm text-gray-500 truncate mt-0.5'>{conv.lastMessage || '暂无消息'}</p>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className='flex-1 flex flex-col'>
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className='p-4 border-b border-gray-100 flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <img src={otherParticipant.avatar} alt={otherParticipant.name} className='w-10 h-10 rounded-full' />
                <div>
                  <p className='font-medium text-gray-900'>{otherParticipant.name}</p>
                  {activeConversation.projectTitle && (
                    <p className='text-sm text-purple-600'>{activeConversation.projectTitle}</p>
                  )}
                </div>
              </div>
              <div className='flex items-center space-x-2'>
                <button className='p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors'>
                  <Phone className='w-5 h-5' />
                </button>
                <button className='p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors'>
                  <Video className='w-5 h-5' />
                </button>
                <button className='p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors'>
                  <Info className='w-5 h-5' />
                </button>
                <button className='p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors'>
                  <MoreVertical className='w-5 h-5' />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className='flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50'>
              {activeMessages.length === 0 ? (
                <div className='flex flex-col items-center justify-center h-full text-gray-400'>
                  <MessageCircle className='w-16 h-16 mb-4 opacity-30' />
                  <p className='text-sm'>开始新的对话</p>
                </div>
              ) : (
                activeMessages.map((msg) => {
                  const isMe = msg.senderId === user?.id
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] ${isMe ? 'order-2' : ''}`}>
                        <div
                          className={`p-3 rounded-2xl ${
                            isMe
                              ? 'bg-purple-600 text-white rounded-br-sm'
                              : 'bg-white text-gray-900 rounded-bl-sm shadow-sm border border-gray-100'
                          }`}>
                          <p className='text-sm leading-relaxed'>{msg.content}</p>
                        </div>
                        <p className={`text-xs text-gray-400 mt-1 ${isMe ? 'text-right' : ''}`}>
                          {formatTime(msg.timestamp)}
                          {isMe && <span className='ml-2'>{msg.read ? '已读' : '已发送'}</span>}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className='p-4 border-t border-gray-100 bg-white'>
              <div className='flex items-center space-x-3'>
                <button className='p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors'>
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13'
                    />
                  </svg>
                </button>
                <input
                  type='text'
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder='輸入消息...'
                  className='flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500'
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className='p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                  <Send className='w-5 h-5' />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className='flex-1 flex flex-col items-center justify-center text-gray-400'>
            <User className='w-20 h-20 mb-4 opacity-30' />
            <p className='text-lg font-medium'>選擇一個對話</p>
            <p className='text-sm mt-1'>從左側列表中選擇或開始新對話</p>
          </div>
        )}
      </div>
    </div>
  )
}
