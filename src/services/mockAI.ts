import { AIChatMessage, PageContextData } from '../types/ai';

// Simulated delay for "thinking"
const THINKING_DELAY = 800; // ms
const TYPING_SPEED = 30; // ms per char

interface MockResponse {
  content: string;
  chips?: string[];
  action?: {
    type: 'autofill_form' | 'navigate' | 'highlight_risk' | 'create_milestone';
    payload: any;
    label: string;
  };
}

// The "Script" - Knowledge Base
// In a real app, this would be RAG (Retrieval-Augmented Generation)
const KNOWLEDGE_BASE: Record<string, MockResponse[]> = {
  // Global / General
  'default': [
    { content: "Can you be more specific? I can help with project management, risk assessment, or contract drafting.", chips: ["Risk Analysis", "Draft Contract"] },
    { content: "I'm Cortex, your AI assistant. How can I help optimizing your workflow today?" }
  ],
  'hello': [
    { content: "Hello! Ready to help you build the future of work.", chips: ["Create Project", "Check Status"] }
  ],
  
  // Project Creation Context
  'project_create_requirements': [
    { 
      content: "根据您的输入，我已生成结构化需求文档。点击下方按钮可自动填充表单：\n\n**项目名称**: NextGen 出行平台\n**核心功能**: GPS追踪、支付集成、匹配算法\n**预算范围**: $50,000 - $80,000", 
      chips: ["调整预算", "更换技术栈"],
      action: {
        type: 'autofill_form',
        label: '✨ 自动填充表单',
        payload: {
          title: "NextGen 智能出行平台",
          description: "## 项目概述\n构建类似 Uber 的现代出行平台。\n\n## 核心功能\n- 🗺️ 实时 GPS 追踪与路径优化\n- 💳 多渠道支付 (Stripe/PayPal/Apple Pay)\n- 🤖 智能司乘匹配算法\n- ⭐ 双向评价系统\n- 📊 数据分析仪表盘\n\n## 技术选型\n- **移动端**: React Native + Expo\n- **后端**: Node.js + NestJS\n- **数据库**: PostgreSQL + Redis\n- **地图**: Google Maps API",
          category: "mobile_app",
          budget_min: 50000,
          budget_max: 80000,
          skills: ["React Native", "Node.js", "PostgreSQL", "Google Maps API", "Redis"]
        }
      }
    }
  ],
  'project_create_budget': [
    { content: "For a full-scale ride-sharing app with real-time features, a budget of $5k is too low. Market average is between $40k - $100k for MVP. I suggest creating a 'Prototype' phase first if budget is tight.", chips: ["Adjust to $50k", "Keep $5k (Risky)"] }
  ],

  // Project Detail Context
  'project_detail_risk': [
    { 
      content: "正在分析项目里程碑... \\n\\n⚠️ **风险预警**: 检测到以下问题：\\n\\n1. **里程碑延期风险** - 当前进度落后于计划\\n2. **交付物缺失** - 尚未提交代码审查\\n\\n建议立即联系承包商确认状态。",
      chips: ["发送催促消息", "延长截止日期"],
      action: {
        type: 'highlight_risk',
        label: '🔍 定位风险里程碑',
        payload: { milestoneId: 'ms-1' }
      }
    }
  ],
  
  // Bid Analysis
  'bid_analysis': [
    {
      content: "已分析所有竞标方案：\\n\\n| 候选人 | 评分 | 报价 | 风险 |\\n|--------|------|------|------|\\n| **开发者A** | ⭐5.0 | $12,000 | 低 |\\n| **开发者B** | ⭐4.8 | $9,000 | 低 |\\n| **开发者C** | ⭐3.2 | $3,000 | ⚠️高 |\\n\\n**推荐**: 开发者B 性价比最优，历史项目完成率 98%。",
      chips: ["接受 开发者B", "查看详细履历"]
    }
  ]
};

export class MockAIService {
  
  static async generateResponse(
    userMessage: string, 
    context: PageContextData
  ): Promise<AIChatMessage> {
    
    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, THINKING_DELAY));

    let response: MockResponse;
    const lowerMsg = userMessage.toLowerCase();

    // 1. Context-Specific Matching
    if (context.type === 'project_create') {
      if (lowerMsg.includes('uber') || lowerMsg.includes('taxi') || lowerMsg.includes('description') || lowerMsg.includes('requirement')) {
        response = KNOWLEDGE_BASE['project_create_requirements'][0];
      } else if (lowerMsg.includes('budget') || lowerMsg.includes('cost') || lowerMsg.includes('money')) {
        response = KNOWLEDGE_BASE['project_create_budget'][0];
      } else {
        response = { content: "I can help you draft the project description or estimate the budget. Try asking 'Help me write requirements for a ride app'." };
      }
    } 
    else if (context.type === 'project_detail') {
      if (lowerMsg.includes('risk') || lowerMsg.includes('status')) {
        response = KNOWLEDGE_BASE['project_detail_risk'][0];
      } else if (lowerMsg.includes('bid') || lowerMsg.includes('candidate')) {
         response = KNOWLEDGE_BASE['bid_analysis'][0];
      } else {
        response = { content: `I'm monitoring project "${context.data?.title || 'Current Project'}". Ask me about risks, budget, or milestones.` };
      }
    }
    // 2. Global Keywords
    else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
      response = KNOWLEDGE_BASE['hello'][0];
    } else {
      // Default fallback
      response = KNOWLEDGE_BASE['default'][0];
    }

    return {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: response.content,
      type: response.action ? 'action_card' : 'text',
      timestamp: new Date().toISOString(),
      metadata: {
         action: response.action,
         chips: response.chips
      }
    };
  }

  // Future: Real streaming implementation
  // static async *streamResponse(...) {}
}
