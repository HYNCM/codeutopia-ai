import { AIChatMessage, PageContextData } from '../types/ai'
import { AIUserRole } from '../contexts/AIContext'

// Simulated delay for "thinking"
const THINKING_DELAY = 600 // ms

interface MockResponse {
  content: string
  chips?: string[]
  action?: {
    type: 'autofill_form' | 'navigate' | 'highlight_risk' | 'create_milestone'
    payload: any
    label: string
  }
}

// The "Script" - Knowledge Base organized by context and keywords
const KNOWLEDGE_BASE: Record<string, MockResponse[]> = {
  // ============================================
  // GLOBAL / GENERAL RESPONSES
  // ============================================
  default: [
    {
      content:
        '我可以帮您完成以下任务：\n\n• 📝 项目需求梳理与发布\n• 👥 开发者筛选与评估\n• 📊 里程碑管理与风险预警\n• 💰 托管资金与结算\n\n请描述您想做什么，我会尽力帮助您！',
      chips: ['发布新项目', '如何选择开发者?', '什么是 Escrow?'],
    },
  ],

  hello: [
    {
      content: '您好！很高兴为您服务。今天我能帮您做什么？',
      chips: ['发布项目', '查看状态', '帮助'],
    },
  ],

  help: [
    {
      content:
        '以下是我可以帮助您的主要功能：\n\n**项目管理**\n• 需求描述优化\n• 预算评估\n• 技术栈建议\n\n**开发者管理**\n• 竞标方案分析\n• 资质评估\n• 历史记录查询\n\n**资金管理**\n• Escrow 托管说明\n• 里程碑付款\n• 争议处理',
      chips: ['详细了解 Escrow', '如何发布项目?'],
    },
  ],

  // ============================================
  // PLATFORM EXPLANATIONS
  // ============================================
  escrow: [
    {
      content:
        '**什么是 Escrow (资金托管)?**\n\nEscrow 是一种安全的支付保护机制：\n\n1. 💼 **项目启动时** - 客户将项目资金存入平台托管账户\n2. 🔒 **开发期间** - 资金由平台安全保管，双方都无法单独提取\n3. ✅ **验收通过后** - 客户确认里程碑完成，资金自动释放给开发者\n4. ⚖️ **争议保护** - 如有争议，平台介入仲裁\n\n这确保了双方的权益：客户不用担心付款后开发者跑路，开发者也不用担心完成工作后收不到钱。',
      chips: ['如何充值?', '如何提现?', '争议如何处理?'],
    },
  ],

  流程: [
    {
      content:
        '**CodeUtopia 项目流程**\n\n```\n发布项目 → 接收竞标 → 选择开发者 → 托管资金 → 开发交付 → 验收付款\n```\n\n**详细步骤：**\n\n1. **发布项目** - 描述需求、设定预算、定义里程碑\n2. **接收竞标** - 开发者提交方案和报价\n3. **选择开发者** - 比较方案，选择最合适的\n4. **托管资金** - 将项目资金存入 Escrow\n5. **开发交付** - 按里程碑分阶段完成\n6. **验收付款** - 确认质量后释放资金',
      chips: ['如何发布项目?', '如何选择开发者?'],
    },
  ],

  // ============================================
  // PROJECT CREATION CONTEXT
  // ============================================
  project_create_requirements: [
    {
      content:
        '根据您的描述，我已生成结构化需求文档。点击下方按钮可自动填充表单：\n\n**项目名称**: NextGen 出行平台\n**核心功能**: GPS追踪、支付集成、匹配算法\n**预算范围**: $50,000 - $80,000\n**技术栈**: React Native + Node.js + PostgreSQL',
      chips: ['调整预算', '更换技术栈', '添加更多功能'],
      action: {
        type: 'autofill_form',
        label: '✨ 自动填充表单',
        payload: {
          title: 'NextGen 智能出行平台',
          description:
            '## 项目概述\n构建类似 Uber 的现代出行平台。\n\n## 核心功能\n- 🗺️ 实时 GPS 追踪与路径优化\n- 💳 多渠道支付 (Stripe/PayPal/Apple Pay)\n- 🤖 智能司乘匹配算法\n- ⭐ 双向评价系统\n- 📊 数据分析仪表盘\n\n## 技术选型\n- **移动端**: React Native + Expo\n- **后端**: Node.js + NestJS\n- **数据库**: PostgreSQL + Redis\n- **地图**: Google Maps API',
          category: 'mobile_app',
          budget_min: 50000,
          budget_max: 80000,
          skills: ['React Native', 'Node.js', 'PostgreSQL', 'Google Maps API', 'Redis'],
        },
      },
    },
  ],

  project_create_budget: [
    {
      content:
        '**预算评估建议**\n\n基于您的项目需求，这是市场参考价格：\n\n| 项目类型 | MVP 版本 | 完整版本 |\n|---------|---------|----------|\n| 简单应用 | $5k-15k | $20k-40k |\n| 中等复杂度 | $15k-40k | $50k-100k |\n| 复杂平台 | $40k-100k | $100k-300k |\n\n您描述的项目属于**中等复杂度**，建议预算范围：$40,000 - $80,000\n\n💡 **提示**: 可以先做 MVP 版本验证市场，再迭代完善。',
      chips: ['按 MVP 预算设置', '查看完整版预算', '如何控制成本?'],
    },
  ],

  project_create_tech: [
    {
      content:
        '**技术栈推荐**\n\n根据您的项目类型和预算，推荐以下技术方案：\n\n**移动应用**\n• 跨平台: React Native / Flutter\n• 原生: Swift (iOS) + Kotlin (Android)\n\n**Web 应用**\n• 前端: React + Next.js / Vue + Nuxt\n• 后端: Node.js / Python / Go\n\n**数据库**\n• 关系型: PostgreSQL / MySQL\n• NoSQL: MongoDB / Redis\n\n选择技术栈时要考虑：团队技能、项目规模、后期维护成本。',
      chips: ['选择 React Native', '选择 Flutter', '需要更多建议'],
    },
  ],

  // ============================================
  // PROJECT DETAIL CONTEXT
  // ============================================
  project_detail_risk: [
    {
      content:
        '**风险分析报告** 🔍\n\n正在扫描项目数据...\n\n⚠️ **检测到以下风险：**\n\n1. **里程碑延期风险** (高)\n   - 2 个里程碑接近截止日期\n   - 最近交付物提交率下降\n\n2. **沟通空白期** (中)\n   - 最后一次消息交互 3 天前\n   - 建议主动联系承包商\n\n3. **预算超支风险** (低)\n   - 当前消耗 65%，进度 60%\n   - 总体可控\n\n📌 **建议**: 安排一次同步会议，确认当前进度和交付计划。',
      chips: ['发送催促消息', '延长截止日期', '安排会议'],
      action: {
        type: 'highlight_risk',
        label: '🔍 定位风险里程碑',
        payload: { milestoneId: 'ms-1' },
      },
    },
  ],

  project_detail_status: [
    {
      content:
        '**项目状态摘要** 📊\n\n• **总体进度**: 60%\n• **已完成里程碑**: 3/5\n• **预算消耗**: $12,000 / $20,000\n• **剩余时间**: 15 天\n\n**近期动态**:\n- ✅ 里程碑 3 "后端 API" 已通过验收\n- 🔄 里程碑 4 "前端集成" 进行中\n- ⏳ 里程碑 5 "测试部署" 待开始\n\n承包商最近表现良好，代码质量评分 4.8/5.0',
      chips: ['查看详细里程碑', '联系承包商', '查看代码提交'],
    },
  ],

  // ============================================
  // BID ANALYSIS
  // ============================================
  bid_analysis: [
    {
      content:
        '**竞标方案分析** 📋\n\n已分析当前所有竞标，综合评估如下：\n\n| 候选人 | 评分 | 报价 | 工期 | 风险 |\n|--------|------|------|------|------|\n| **开发者A** | ⭐5.0 | $12,000 | 30天 | 低 |\n| **开发者B** | ⭐4.8 | $9,000 | 35天 | 低 |\n| **开发者C** | ⭐3.2 | $3,000 | 20天 | ⚠️高 |\n\n**推荐**: 开发者B\n• 性价比最优\n• 历史项目完成率 98%\n• 技术栈匹配度高\n\n**注意**: 开发者C 价格虽低，但评分较低且无类似项目经验。',
      chips: ['接受开发者B', '查看开发者A详情', '与开发者沟通'],
    },
  ],

  // ============================================
  // DEVELOPER-SPECIFIC RESPONSES
  // ============================================
  developer_bid_draft: [
    {
      content:
        '**竞标方案草稿** ✍️\n\n基于项目需求和您的技能，我为您生成了竞标方案：\n\n---\n\n**尊敬的项目方：**\n\n我已详细阅读项目需求，对此项目非常感兴趣。以下是我的方案：\n\n**技术方案**\n• 采用 React Native 实现跨平台\n• Node.js + PostgreSQL 后端\n• AWS 云服务部署\n\n**交付计划**\n• 第一周：架构设计 & 原型\n• 第二周：核心功能开发\n• 第三周：集成测试\n• 第四周：部署上线\n\n**报价**: $8,500\n**工期**: 30 天\n\n期待与您合作！\n\n---\n\n这份方案突出了您的技术能力和合理的交付计划。需要修改吗？',
      chips: ['修改报价', '调整工期', '添加案例'],
    },
  ],

  developer_deliverable: [
    {
      content:
        '**交付物提交指南** 📦\n\n提交里程碑交付物的步骤：\n\n1. **准备材料**\n   - 源代码 (Git 仓库链接)\n   - 部署说明文档\n   - 测试报告\n   - 演示视频 (如适用)\n\n2. **提交方式**\n   - 点击"提交交付物"按钮\n   - 上传或填写相关链接\n   - 添加说明备注\n\n3. **等待审核**\n   - 客户有 7 天审核期\n   - 审核通过后资金自动释放\n   - 如有修改意见会收到通知\n\n💡 **提示**: 提供详细的演示可以加快审核速度！',
      chips: ['开始提交', '查看审核状态', '联系客户'],
    },
  ],

  // ============================================
  // CLIENT-SPECIFIC RESPONSES
  // ============================================
  client_select_developer: [
    {
      content:
        '**如何选择合适的开发者？** 🎯\n\n评估开发者时，建议从以下维度考虑：\n\n**1. 专业能力** (权重 40%)\n• 技术栈匹配度\n• 相关项目经验\n• 代码质量评分\n\n**2. 信誉记录** (权重 30%)\n• 历史评分\n• 项目完成率\n• 争议解决记录\n\n**3. 沟通效率** (权重 20%)\n• 响应速度\n• 方案详细程度\n• 问题理解能力\n\n**4. 价格合理性** (权重 10%)\n• 不要只选最便宜的\n• 关注性价比\n\n需要我帮您分析当前的竞标方案吗？',
      chips: ['分析竞标方案', '查看开发者档案', '设置筛选条件'],
    },
  ],

  client_milestone: [
    {
      content:
        '**里程碑设置建议** 🏁\n\n合理的里程碑设置可以降低风险、提高协作效率：\n\n**推荐结构**\n\n| 阶段 | 占比 | 交付物 |\n|------|------|--------|\n| 需求确认 | 10% | PRD文档 |\n| 设计阶段 | 15% | UI/UX设计稿 |\n| 开发阶段 | 50% | 可运行代码 |\n| 测试阶段 | 15% | 测试报告 |\n| 部署上线 | 10% | 生产环境 |\n\n**最佳实践**\n• 每个里程碑周期 1-2 周\n• 明确定义验收标准\n• 每个阶段有可验证的交付物\n• 保留 10% 作为最终验收金',
      chips: ['应用推荐结构', '自定义里程碑', '查看案例'],
    },
  ],
}

// Keyword matching patterns
const KEYWORD_PATTERNS: Array<{ pattern: RegExp; key: string }> = [
  // Greetings
  { pattern: /^(hello|hi|你好|您好|嗨)/i, key: 'hello' },
  { pattern: /(help|帮助|怎么用)/i, key: 'help' },

  // Platform concepts
  { pattern: /(escrow|托管|资金安全)/i, key: 'escrow' },
  { pattern: /(流程|步骤|怎么做)/i, key: '流程' },

  // Project creation
  { pattern: /(uber|taxi|打车|出行|滴滴)/i, key: 'project_create_requirements' },
  { pattern: /(airbnb|民宿|租房|住宿)/i, key: 'project_create_requirements' },
  { pattern: /(预算|budget|cost|多少钱|价格)/i, key: 'project_create_budget' },
  { pattern: /(技术栈|tech|框架|用什么开发)/i, key: 'project_create_tech' },

  // Project detail
  { pattern: /(risk|风险|延期|问题)/i, key: 'project_detail_risk' },
  { pattern: /(status|状态|进度|情况)/i, key: 'project_detail_status' },

  // Bids
  { pattern: /(bid|竞标|方案|对比|分析|candidate|候选)/i, key: 'bid_analysis' },

  // Developer specific
  { pattern: /(起草|draft|写竞标|proposal)/i, key: 'developer_bid_draft' },
  { pattern: /(交付|deliverable|提交|上传)/i, key: 'developer_deliverable' },

  // Client specific
  { pattern: /(选择开发者|how to choose|怎么选)/i, key: 'client_select_developer' },
  { pattern: /(里程碑|milestone|阶段)/i, key: 'client_milestone' },
]

export class MockAIService {
  static async generateResponse(
    userMessage: string,
    context: PageContextData,
    userRole: AIUserRole = 'client',
  ): Promise<AIChatMessage> {
    // Simulate thinking delay
    await new Promise((resolve) => setTimeout(resolve, THINKING_DELAY))

    let response: MockResponse
    const lowerMsg = userMessage.toLowerCase()

    // 1. Try keyword pattern matching first
    for (const { pattern, key } of KEYWORD_PATTERNS) {
      if (pattern.test(lowerMsg)) {
        const responses = KNOWLEDGE_BASE[key]
        if (responses && responses.length > 0) {
          response = responses[Math.floor(Math.random() * responses.length)]
          return this.formatResponse(response)
        }
      }
    }

    // 2. Context-Specific Matching
    if (context.type === 'project_create') {
      if (lowerMsg.includes('description') || lowerMsg.includes('requirement') || lowerMsg.includes('需求')) {
        response = KNOWLEDGE_BASE['project_create_requirements'][0]
      } else {
        response = {
          content: '我可以帮您完善项目需求。试着告诉我您想做什么类型的应用，例如："我想做一个像淘宝的电商平台"。',
          chips: ['优化需求描述', '预估预算', '推荐技术栈'],
        }
      }
    } else if (context.type === 'project_detail') {
      response = {
        content: `我正在监控项目 "${context.data?.projectTitle || '当前项目'}"。您可以问我关于风险、进度、竞标或里程碑的问题。`,
        chips: ['检查风险', '查看进度', '分析竞标'],
      }
    } else if (context.type === 'bid_list') {
      response = KNOWLEDGE_BASE['bid_analysis'][0]
    } else {
      // 3. Role-specific fallback
      if (userRole === 'developer') {
        response = {
          content:
            '作为开发者，我可以帮您：\n\n• 发现优质项目\n• 起草竞标方案\n• 管理交付进度\n\n请问需要哪方面的帮助？',
          chips: ['浏览项目', '写竞标方案', '提交交付物'],
        }
      } else {
        // Default fallback
        response = KNOWLEDGE_BASE['default'][0]
      }
    }

    return this.formatResponse(response)
  }

  private static formatResponse(response: MockResponse): AIChatMessage {
    return {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: response.content,
      type: response.action ? 'action_card' : 'text',
      timestamp: new Date().toISOString(),
      metadata: {
        action: response.action,
        chips: response.chips,
      },
    }
  }
}
