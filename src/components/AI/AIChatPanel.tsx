import React, { useRef, useEffect, useState } from 'react'
import { useAI } from '../../contexts/AIContext'
import { X, Send, Sparkles, User, Bot, Trash2 } from 'lucide-react'
import { ActionCard } from './ActionCard'
import { AIActionData } from '../../types/ai'

export const AIChatPanel: React.FC = () => {
  const { isOpen, toggleOpen, messages, sendMessage, isThinking, clearHistory } = useAI()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [messages, isOpen])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim() || isThinking) return

    const text = input
    setInput('')
    await sendMessage(text)
  }

  const handleAction = (action: AIActionData) => {
    // Dispatch custom event that specific pages can listen to
    // This is a loose coupling pattern for the MVP
    const event = new CustomEvent('ai_action', { detail: action })
    window.dispatchEvent(event)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className='fixed inset-0 bg-black/20 backdrop-blur-sm z-[90]' onClick={toggleOpen} />

      {/* Panel */}
      <div className='fixed right-0 top-0 h-full w-[400px] bg-white shadow-2xl z-[100] flex flex-col border-l border-gray-200 transform transition-transform duration-300 ease-out'>
        {/* Header */}
        <div className='flex justify-between items-center p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white'>
          <div className='flex items-center space-x-2 text-purple-700'>
            <Sparkles className='w-5 h-5 fill-current' />
            <span className='font-bold'>Cortex AI</span>
            <span className='text-xs px-2 py-0.5 bg-purple-100 rounded-full font-medium'>BETA</span>
          </div>
          <div className='flex items-center space-x-2'>
            <button
              onClick={clearHistory}
              className='p-2 text-gray-400 hover:text-red-500 transition-colors'
              title='Clear History'>
              <Trash2 className='w-4 h-4' />
            </button>
            <button onClick={toggleOpen} className='p-2 text-gray-400 hover:text-gray-600 transition-colors'>
              <X className='w-5 h-5' />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className='flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50/50'>
          {messages.length === 0 && (
            <div className='flex flex-col items-center justify-center h-full text-gray-400 space-y-4'>
              <div className='w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center'>
                <Bot className='w-8 h-8 text-purple-300' />
              </div>
              <p text-sm>Start a conversation...</p>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'} space-x-3`}>
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                    msg.role === 'user' ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-500 to-indigo-600'
                  }`}>
                  {msg.role === 'user' ? (
                    <User className='w-4 h-4 text-white' />
                  ) : (
                    <Sparkles className='w-4 h-4 text-white' />
                  )}
                </div>

                {/* Bubble */}
                <div className={`space-y-2 text-sm`}>
                  <div
                    className={`p-3 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-gray-900 text-white rounded-tr-sm'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'
                    }`}>
                    <p className='whitespace-pre-line leading-relaxed pb-1'>{msg.content}</p>
                  </div>

                  {/* AI Action Cards */}
                  {msg.role === 'assistant' && msg.metadata?.action && (
                    <ActionCard action={msg.metadata.action} onExecute={handleAction} />
                  )}

                  {/* Suggestion Chips */}
                  {msg.role === 'assistant' && msg.metadata?.chips && (
                    <div className='flex flex-wrap gap-2 animate-fade-in-up'>
                      {msg.metadata.chips.map((chip) => (
                        <button
                          key={chip}
                          onClick={() => sendMessage(chip)}
                          className='px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-100 hover:bg-purple-100 hover:border-purple-200 transition-colors'>
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className='text-[10px] text-gray-400 pl-1 block'>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className='flex justify-start'>
              <div className='flex space-x-3'>
                <div className='w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center'>
                  <Sparkles className='w-4 h-4 text-white' />
                </div>
                <div className='bg-gray-200/50 p-4 rounded-2xl rounded-tl-sm flex items-center space-x-1'>
                  <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '0ms' }} />
                  <div
                    className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                    style={{ animationDelay: '150ms' }}
                  />
                  <div
                    className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                    style={{ animationDelay: '300ms' }}
                  />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className='p-4 bg-white border-t border-gray-200'>
          <form onSubmit={handleSubmit} className='relative'>
            <input
              ref={inputRef}
              type='text'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Ask Cortex for help...'
              className='w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm'
            />
            <button
              type='submit'
              disabled={!input.trim() || isThinking}
              className='absolute right-2 top-2 p-1.5 bg-gray-900 text-white rounded-lg hover:bg-black disabled:opacity-30 disabled:hover:bg-gray-900 transition-colors'>
              <Send className='w-4 h-4' />
            </button>
          </form>
          <p className='text-[10px] text-center text-gray-400 mt-2'>
            AI can make mistakes. Please verify important information.
          </p>
        </div>
      </div>
    </>
  )
}
