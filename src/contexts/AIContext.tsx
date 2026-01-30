import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react'
import { AIChatMessage, PageContextData } from '../types/ai'
import { MockAIService } from '../services/mockAI'
import { useAuth } from './AuthContext'
import { simulateStreaming } from '../hooks/useTypewriter'

// User role type for AI context
export type AIUserRole = 'client' | 'developer' | 'admin' | 'guest'

interface AIContextType {
  isOpen: boolean
  toggleOpen: () => void
  messages: AIChatMessage[]
  sendMessage: (text: string) => Promise<void>
  isThinking: boolean
  isStreaming: boolean
  activeContext: PageContextData
  userRole: AIUserRole
  setContext: (context: PageContextData) => void
  clearHistory: () => void
  quickActions: string[]
}

const AIContext = createContext<AIContextType | undefined>(undefined)

// Role-based Quick Actions
const QUICK_ACTIONS: Record<AIUserRole, Record<string, string[]>> = {
  client: {
    global: ['发布新项目', '查看我的项目', '如何选择开发者?'],
    project_create: ['帮我优化需求描述', '预估项目预算', '推荐技术栈'],
    project_detail: ['分析竞标方案', '检查里程碑风险', '生成合同草案'],
    bid_list: ['对比这些竞标', '哪个性价比最高?'],
  },
  developer: {
    global: ['浏览项目广场', '我的进行中项目', '如何提高中标率?'],
    project_create: ['查看项目要求', '评估工作量'],
    project_detail: ['帮我起草竞标方案', '分析项目难点', '如何提交交付物?'],
    bid_list: ['我的竞标历史'],
  },
  admin: {
    global: ['系统概览', '待审核项目', '用户统计'],
    project_detail: ['审核项目', '查看交易记录'],
  },
  guest: {
    global: ['什么是 CodeUtopia?', '如何注册?', '平台收费标准?'],
  },
}

// Role-based Greetings
const GREETINGS: Record<AIUserRole, Record<string, string>> = {
  client: {
    global: '您好！我是 Cortex，您的智能项目助手。我可以帮您发布项目、筛选开发者、管理里程碑。有什么可以帮您的？',
    project_create:
      '准备发布新项目？我可以帮您把模糊的想法转化为专业的需求文档。试试描述您想做什么，比如："我想做一个像 Airbnb 的应用"。',
    project_detail: '我已加载项目上下文。我可以帮您分析竞标方案、评估开发者资质，或者检查里程碑风险。',
    bid_list: '我看到有多个竞标方案，需要我帮您对比分析吗？我可以从价格、工期、开发者评分等维度给出建议。',
  },
  developer: {
    global: '您好！我是 Cortex，您的开发助手。我可以帮您发现优质项目、撰写竞标方案、管理交付物。今天想做什么？',
    project_create: '这是一个新项目的需求，我可以帮您分析技术难点和预估工作量。',
    project_detail: '我已加载项目详情。需要我帮您起草竞标方案吗？我会根据您的技能和项目需求生成专业的提案。',
    bid_list: '这是当前的竞标列表。需要我分析竞争对手的方案吗？',
  },
  admin: {
    global: '管理员您好，Cortex 待命中。我可以帮您查看系统状态、审核项目或生成报表。',
    project_detail: '我已加载项目详情，可以帮您进行合规审核或查看交易记录。',
  },
  guest: {
    global: '欢迎来到 CodeUtopia！我是 Cortex，您的智能向导。我可以帮您了解平台功能、注册流程和收费标准。',
  },
}

export const AIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<AIChatMessage[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [activeContext, setActiveContext] = useState<PageContextData>({ type: 'global' })

  // Derive user role from auth context
  const userRole: AIUserRole = user?.role === 'developer' ? 'developer' : user ? 'client' : 'guest'

  // Get quick actions based on role and context
  const quickActions =
    QUICK_ACTIONS[userRole]?.[activeContext.type] || QUICK_ACTIONS[userRole]?.global || QUICK_ACTIONS.guest.global

  // Ref to track if greeting has been shown for current context
  const greetingShownRef = useRef<string>('')

  // Initial Greeting when panel opens (role + context aware)
  useEffect(() => {
    const contextKey = `${userRole}-${activeContext.type}`

    if (isOpen && messages.length === 0 && greetingShownRef.current !== contextKey) {
      greetingShownRef.current = contextKey

      // Get greeting based on role and context
      const roleGreetings = GREETINGS[userRole] || GREETINGS.guest
      const greetingText = roleGreetings[activeContext.type] || roleGreetings.global

      const greetingMsg: AIChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '', // Start empty for streaming effect
        type: 'text',
        timestamp: new Date().toISOString(),
        metadata: {
          chips: quickActions.slice(0, 3), // Show first 3 quick actions
        },
      }

      setMessages([greetingMsg])
      setIsStreaming(true)

      // Simulate streaming for greeting
      simulateStreaming(greetingText, (_, accumulated) => {
        setMessages((prev) => {
          if (prev.length === 0) return prev
          const updated = [...prev]
          updated[0] = { ...updated[0], content: accumulated }
          return updated
        })
      }).then(() => {
        setIsStreaming(false)
      })
    }
  }, [isOpen, messages.length, activeContext.type, userRole, quickActions])

  const toggleOpen = () => setIsOpen((prev) => !prev)

  const setContext = useCallback((context: PageContextData) => {
    setActiveContext((prev) => {
      if (prev.type === context.type && JSON.stringify(prev.data) === JSON.stringify(context.data)) {
        return prev
      }
      return context
    })
  }, [])

  const clearHistory = () => {
    setMessages([])
    greetingShownRef.current = '' // Reset so greeting shows again
  }

  const sendMessage = async (text: string) => {
    // 1. Add User Message
    const userMsg: AIChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      type: 'text',
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMsg])
    setIsThinking(true)

    try {
      // 2. Call Service with user role
      const aiResponse = await MockAIService.generateResponse(text, activeContext, userRole)

      // 3. Create placeholder message for streaming
      const streamingMsg: AIChatMessage = {
        ...aiResponse,
        content: '', // Start empty
      }
      setMessages((prev) => [...prev, streamingMsg])
      setIsThinking(false)
      setIsStreaming(true)

      // 4. Stream the response
      await simulateStreaming(aiResponse.content, (_, accumulated) => {
        setMessages((prev) => {
          const updated = [...prev]
          const lastIdx = updated.length - 1
          if (updated[lastIdx]?.id === streamingMsg.id) {
            updated[lastIdx] = { ...updated[lastIdx], content: accumulated }
          }
          return updated
        })
      })

      setIsStreaming(false)
    } catch (error) {
      console.error('AI Error', error)
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'system',
          content: 'Connection to Cortex Core failed. Please try again.',
          type: 'text',
          timestamp: new Date().toISOString(),
        },
      ])
      setIsThinking(false)
      setIsStreaming(false)
    }
  }

  return (
    <AIContext.Provider
      value={{
        isOpen,
        toggleOpen,
        messages,
        sendMessage,
        isThinking,
        isStreaming,
        activeContext,
        userRole,
        setContext,
        clearHistory,
        quickActions,
      }}>
      {children}
    </AIContext.Provider>
  )
}

export const useAI = () => {
  const context = useContext(AIContext)
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider')
  }
  return context
}
