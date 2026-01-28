import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { AIChatMessage, PageContextData, AIRole } from '../types/ai';
import { MockAIService } from '../services/mockAI';

interface AIContextType {
  isOpen: boolean;
  toggleOpen: () => void;
  messages: AIChatMessage[];
  sendMessage: (text: string) => Promise<void>;
  isThinking: boolean;
  activeContext: PageContextData;
  setContext: (context: PageContextData) => void;
  clearHistory: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [activeContext, setActiveContext] = useState<PageContextData>({ type: 'global' });

  // Initial Greeting when context changes or panel opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Simulate initial greeting based on context
      const greetingId = crypto.randomUUID();
      let greetingText = "我是 Cortex，您的智能助手。有什么可以帮您的吗？";
      
      if (activeContext.type === 'project_create') {
        greetingText = "准备发布新项目？我可以帮您把模糊的想法转化为专业的需求文档。试试输入：“我想做一个像 Airbnb 的应用”。";
      } else if (activeContext.type === 'project_detail') {
        greetingText = `我已加载项目上下文。我可以帮您分析竞标方案，或者检查里程碑风险。`;
      }

      setMessages([{
        id: greetingId,
        role: 'assistant',
        content: greetingText,
        type: 'text',
        timestamp: new Date().toISOString()
      }]);
    }
  }, [isOpen, activeContext.type, messages.length]);

  const toggleOpen = () => setIsOpen(prev => !prev);

  const setContext = useCallback((context: PageContextData) => {
    // Only update if typing matches to prevent loop
    setActiveContext(prev => {
        if (prev.type === context.type && JSON.stringify(prev.data) === JSON.stringify(context.data)) {
            return prev;
        }
        return context;
    });
  }, []);

  const clearHistory = () => setMessages([]);

  const sendMessage = async (text: string) => {
    // 1. Add User Message
    const userMsg: AIChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      type: 'text',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    try {
      // 2. Call Service
      const aiResponse = await MockAIService.generateResponse(text, activeContext);
      
      // 3. Add AI Response
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
       console.error("AI Error", error);
       setMessages(prev => [...prev, {
         id: crypto.randomUUID(),
         role: 'system',
         content: "Connection to Cortex Core failed. Please try again.",
         type: 'text',
         timestamp: new Date().toISOString()
       }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <AIContext.Provider value={{
      isOpen,
      toggleOpen,
      messages,
      sendMessage,
      isThinking,
      activeContext,
      setContext,
      clearHistory
    }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};
