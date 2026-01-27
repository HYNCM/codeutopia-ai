import { useState } from 'react';
import { mockMessages, mockDevelopers, mockProjects } from '../data/mockData';
import { Send, Search, MoreVertical, Phone, Video, Info } from 'lucide-react';

export function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(mockDevelopers[0]);
  const [message, setMessage] = useState('');

  const conversations = [
    {
      id: 1,
      user: mockDevelopers[0],
      lastMessage: '我已經完成了第二階段的開發工作...',
      time: '14:30',
      unread: 2,
      project: '智能客服對話系統',
    },
    {
      id: 2,
      user: mockDevelopers[1],
      lastMessage: '設計稿已經更新，請查收',
      time: '昨天',
      unread: 0,
      project: '健康管理App UI設計',
    },
    {
      id: 3,
      user: mockDevelopers[2],
      lastMessage: '關於API文檔的問題...',
      time: '週三',
      unread: 0,
      project: '企業內部管理系統',
    },
  ];

  const messages = [
    {
      id: 1,
      senderId: 'd1',
      content: '您好！我已經完成了第二階段的開發工作，測試報告已上傳。請您審核後給予反饋。',
      time: '14:30',
      isMe: false,
    },
    {
      id: 2,
      senderId: 'c1',
      content: '收到，我會在今天內完成審核。另外第三階段的需求文檔有新更新，請查收。',
      time: '15:00',
      isMe: true,
    },
    {
      id: 3,
      senderId: 'd1',
      content: '好的，謝謝！我會盡快查看並開始第三階段的開發。',
      time: '15:05',
      isMe: false,
    },
    {
      id: 4,
      senderId: 'c1',
      content: '對了，關於性能優化的部分，請記得使用AI代碼審查工具，可以提升代碼質量。',
      time: '15:10',
      isMe: true,
    },
    {
      id: 5,
      senderId: 'd1',
      content: '了解，會在代碼提交時一併進行AI審查。有任何問題我會及時溝通。',
      time: '15:15',
      isMe: false,
    },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Conversations List */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">消息</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索消息..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => {
                setSelectedConversation(conv.user);
              }}
              className={`w-full p-4 flex items-start space-x-3 hover:bg-gray-50 transition-colors ${
                selectedConversation.id === conv.user.id ? 'bg-purple-50' : ''
              }`}
            >
              <div className="relative">
                <img
                  src={conv.user.avatar}
                  alt={conv.user.name}
                  className="w-10 h-10 rounded-full"
                />
                {conv.unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {conv.unread}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900 truncate">{conv.user.name}</p>
                  <span className="text-xs text-gray-500">{conv.time}</span>
                </div>
                <p className="text-sm text-purple-600 truncate">{conv.project}</p>
                <p className="text-sm text-gray-500 truncate mt-0.5">{conv.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={selectedConversation.avatar}
              alt={selectedConversation.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium text-gray-900">{selectedConversation.name}</p>
              <p className="text-sm text-gray-500">
                {selectedConversation.skills.slice(0, 3).join(' • ')}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
              <Info className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] ${
                  msg.isMe ? 'order-2' : ''
                }`}
              >
                <div
                  className={`p-3 rounded-2xl ${
                    msg.isMe
                      ? 'bg-purple-600 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-900 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
                <p
                  className={`text-xs text-gray-500 mt-1 ${
                    msg.isMe ? 'text-right' : ''
                  }`}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="輸入消息..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
