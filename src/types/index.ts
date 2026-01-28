export type UserRole =
  | 'client'
  | 'developer'
  | 'admin'
  | 'project_initiator'
  | 'contractor'
  | 'webadmin'
  | 'regional_manager'

export type ProjectStatus = 'draft' | 'open' | 'in_progress' | 'review' | 'completed' | 'disputed' | 'cancelled'

export type MilestoneStatus = 'pending' | 'in_progress' | 'submitted' | 'approved' | 'rejected' | 'completed' | 'paid'

export type BidStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn'

export type ProjectCategory = 'web_dev' | 'mobile_dev' | 'ui_ux' | 'backend' | 'devops' | 'ai_ml' | 'writing' | 'other'

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: UserRole
  company?: string
  rating: number
  completedProjects: number
  balance: number
  skills: string[]
  verified: boolean
  memberSince: string
  location: string
  timezone: string
  bio?: string
  hourlyRate?: number
  portfolio?: PortfolioItem[]
  certifications?: string[]
}

export interface PortfolioItem {
  id: string
  title: string
  description: string
  image: string
  link?: string
  technologies: string[]
}

export interface Project {
  id: string
  title: string
  description: string
  category: ProjectCategory
  subcategory: string
  clientId: string
  clientName: string
  clientAvatar: string
  status: ProjectStatus
  budget: {
    min: number
    max: number
    currency: string
  }
  duration: string
  skills: string[]
  milestones: Milestone[]
  bids: Bid[]
  createdAt: string
  updatedAt: string
  aiAnalysis?: AIAnalysis
  attachments?: string[]
  visibility: 'public' | 'private' | 'invite_only'

  // Financials
  escrowBalance: number // Amount locked in project escrow
  totalPaid: number // Total amount released to contractor
}

export interface MilestoneSubmission {
  id: string
  milestoneId: string
  workerId?: string // Optional for now
  submittedAt: string
  note: string
  attachments: string[] // Links or file paths
  status: 'pending' | 'approved' | 'rejected'
  rejectionReason?: string
}

export interface Milestone {
  id: string
  title: string
  description: string
  amount: number
  dueDate: string
  status: MilestoneStatus

  // Legacy support
  deliverables: string[]

  // Enhanced data structure from Wizard Step 5 (optional for backward compatibility)
  humanDeliverables?: DeliverableConfig[]
  aiDeliverables?: DeliverableConfig[]
  acceptanceCriteria?: string[]

  // Execution Phase Data
  submission?: MilestoneSubmission

  order: number
  approvedAt?: string
  paidAt?: string
}

export interface Bid {
  id: string
  projectId: string
  developerId: string
  developerName: string
  developerAvatar: string
  developerRating: number
  proposedPrice: number
  deliveryDays: number
  proposal: string
  status: BidStatus
  createdAt: string
}

export interface AIAnalysis {
  taskCount: number
  estimatedDays: number
  recommendedBudget: {
    min: number
    max: number
  }
  riskPoints: string[]
  suggestedTechStack: string[]
  complexity: 'low' | 'medium' | 'high' | 'very_high'
  marketRate: number
}

export interface Message {
  id: string
  conversationId?: string // Group messages by conversation (optional for backward compatibility)
  senderId: string
  receiverId: string
  content: string
  timestamp: string
  read: boolean
  attachments?: string[]
  messageType?: 'text' | 'system' | 'file' | 'milestone_update' // Optional for backward compatibility
}

export interface Conversation {
  id: string
  participants: string[] // User IDs
  projectId?: string // Optional link to project
  projectTitle?: string
  lastMessage?: string
  lastMessageTime?: string
  unreadCount: number
  createdAt: string
}

export interface Notification {
  id: string
  type: 'bid' | 'milestone' | 'message' | 'payment' | 'review' | 'system'
  title: string
  message: string
  timestamp: string
  read: boolean
  link?: string
}

export interface Payment {
  id: string
  projectId: string
  milestoneId?: string
  amount: number
  currency: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
  type: 'deposit' | 'milestone' | 'refund' | 'withdrawal'
  createdAt: string
  completedAt?: string
  stripePaymentId?: string
}

export interface Transaction {
  id: string
  userId?: string // Owner of this transaction record (optional for backward compatibility)
  relatedProjectId?: string
  relatedMilestoneId?: string
  type: 'deposit' | 'withdrawal' | 'escrow_lock' | 'escrow_release' | 'service_fee' | 'income'
  amount: number
  currency: string
  description: string
  projectTitle?: string
  status?: 'pending' | 'completed' | 'failed' // Optional for backward compatibility
  createdAt: string
}

export interface DeveloperFilter {
  skills?: string[]
  minRate?: number
  maxRate?: number
  rating?: number
  availability?: boolean
  location?: string
}

export interface ProjectStats {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  totalSpent: number
  averageBudget: number
  completionRate: number
}

export interface DeveloperStats {
  totalEarnings: number
  pendingPayments: number
  activeProjects: number
  completedProjects: number
  averageRating: number
  responseRate: number
}

export const PROJECT_CATEGORIES = [
  {
    value: 'web_dev',
    label: 'Web開發',
    icon: 'Globe',
    subcategories: ['前端開發', '後端開發', '全棧開發', 'CMS開發', '電子商務'],
  },
  {
    value: 'mobile_dev',
    label: '移動應用開發',
    icon: 'Smartphone',
    subcategories: ['iOS開發', 'Android開發', 'React Native', 'Flutter', '小程序開發'],
  },
  {
    value: 'ui_ux',
    label: 'UI/UX設計',
    icon: 'Palette',
    subcategories: ['網頁設計', '移動端設計', '產品設計', '品牌設計', '原型設計'],
  },
  {
    value: 'backend',
    label: '後端開發',
    icon: 'Server',
    subcategories: ['API開發', '數據庫設計', '系統架構', '微服務', '雲服務'],
  },
  {
    value: 'devops',
    label: 'DevOps',
    icon: 'Settings',
    subcategories: ['CI/CD', '容器化', '雲部署', '監控運維', '自動化測試'],
  },
  {
    value: 'ai_ml',
    label: 'AI/機器學習',
    icon: 'Brain',
    subcategories: ['機器學習', '深度學習', '自然語言處理', '電腦視覺', 'AI集成'],
  },
  {
    value: 'writing',
    label: '文案撰寫',
    icon: 'FileText',
    subcategories: ['技術文檔', '內容創作', '翻譯', 'SEO文案', '產品說明'],
  },
  { value: 'other', label: '其他', icon: 'MoreHorizontal', subcategories: [] },
]

export const SKILLS = [
  'React',
  'Vue.js',
  'Angular',
  'TypeScript',
  'Node.js',
  'Python',
  'Java',
  'Go',
  'Rust',
  'Swift',
  'Kotlin',
  'Docker',
  'Kubernetes',
  'AWS',
  'GCP',
  'PostgreSQL',
  'MongoDB',
  'Redis',
  'GraphQL',
  'REST API',
  'UI/UX',
  'Figma',
  'TensorFlow',
  'PyTorch',
  'NLP',
  'Computer Vision',
  'DevOps',
  'CI/CD',
  '區塊鏈',
  '小程序',
  '電子商務系統',
  'CRM系統',
  'ERP系統',
]

// ============================================
// 项目发布流程相关类型定义
// ============================================

// 开发测试类型
export type DevelopmentTestType =
  | 'cloud' // 云侧开发测试
  | 'device' // 端侧开发测试（无真机）
  | 'device_real' // 端侧+真机部署测试

// 预算类型（对齐Upwork）
export type BudgetType = 'fixed' | 'hourly' | 'monthly'

// 人才等级
export type TalentLevel = 'junior' | 'mid' | 'senior' | 'expert'

// AI协助角色类型
export type AIRoleType = 'product_manager' | 'ux_designer' | 'frontend_engineer' | 'backend_engineer' | 'qa_engineer'

// 项目可见性
export type ProjectVisibility = 'public' | 'private' | 'invite_only'

// 支付渠道
export type PaymentChannel = 'paypal' | 'stripe' | 'alipay' | 'bank_transfer'

// 货币类型
export type CurrencyType = 'USD' | 'EUR' | 'CNY' | 'JPY' | 'GBP' | 'HKD' | 'TWD'

// AI角色配置
export interface AIRoleConfig {
  roleId: AIRoleType
  enabled: boolean
  scope: string // 辅助范围描述
  deliverables: string[] // 期望交付物
  milestoneIds: string[] // 关联里程碑
  reviewBy: 'initiator' | 'contractor' // 审核方
  reviewDeadlineHours: number // 审核时效
}

// 人才需求配置
export interface TalentRequirement {
  skills: string[]
  level: TalentLevel
  regionPreference: string[]
  count: number
  minRate?: number
  maxRate?: number
  requireCase: boolean // 是否需要过往案例
  requireTest: boolean // 是否需要技能测试
  workMode: 'remote' | 'hybrid' | 'onsite'
}

// 项目阶段
export interface ProjectPhase {
  id: string
  name: string
  description: string
  order: number
  estimatedDays: number
  humanDeliverables: string[]
  aiDeliverables: string[]
}

// 里程碑完整定义
export interface MilestoneConfig {
  id: string
  title: string
  description: string
  order: number

  // 时间节点
  plannedStartDate: string
  plannedEndDate: string
  dependsOn?: string[] // 依赖的里程碑ID

  // 费用相关
  budgetAmount: number
  budgetPercentage: number
  depositRequired: boolean
  depositPercentage: number

  // 交付物定义
  humanDeliverables: DeliverableConfig[]
  aiDeliverables: DeliverableConfig[]

  // 验收标准
  acceptanceCriteria: string[]
  reviewMethod: 'manual' | 'auto_with_manual'
  reviewDeadlineHours: number
}

// 交付物配置
export interface DeliverableConfig {
  id: string
  name: string
  description: string
  type: 'document' | 'code' | 'design' | 'test_report' | 'other'
  required: boolean
  templateUrl?: string
}

// 结算规则配置
export interface SettlementConfig {
  paymentChannel: PaymentChannel
  currency: CurrencyType
  escrowEnabled: boolean // 是否启用资金托管
  lateFeePercentage: number // 逾期违约金比例（每日）
  lateFeeMaxPercentage: number // 逾期违约金上限
  invoiceRequired: boolean
  invoiceType?: 'electronic' | 'paper'
}

// 跨区域协作规则
export interface CrossRegionConfig {
  targetRegions: string[]
  primaryTimezone: string
  languagePreferences: string[]
  meetingFrequency: 'daily' | 'weekly' | 'biweekly' | 'monthly'
  responseTimeHours: number
  documentPermissions: 'all' | 'by_region' | 'by_role'
  disputeHandling: 'regional_first' | 'direct_webadmin'
}

// CodeBox硬件配置（端侧项目）
export interface CodeBoxConfig {
  deviceModel: string
  systemVersion: string
  hardwareParams: Record<string, string>
  testEnvironment: 'simulator' | 'real_device'
  deploymentTarget?: string
}

// 项目发布表单完整数据
export interface ProjectCreateFormData {
  // Step 1: 基本信息
  basicInfo: {
    title: string
    category: string
    subcategory: string
    description: string
    attachments: string[]
    region: string
    duration: 'short' | 'long' | 'flexible'
    budgetType: BudgetType
    budgetMin: number
    budgetMax: number
    currency: CurrencyType
  }

  // Step 2: 人才需求
  talentRequirement: TalentRequirement

  // Step 3: AI协助配置
  aiConfig: {
    enabled: boolean
    roles: AIRoleConfig[]
  }

  // Step 4: 项目流程
  projectFlow: {
    phases: ProjectPhase[]
    developmentType: DevelopmentTestType
    codeBoxConfig?: CodeBoxConfig
    collaborationTools: string[]
    visibility: ProjectVisibility
  }

  // Step 5: 里程碑规划
  milestones: MilestoneConfig[]

  // Step 6: 结算配置
  settlement: SettlementConfig

  // Step 7: 跨区域协作（可选）
  crossRegion?: CrossRegionConfig
}

// 项目审核状态
export type ProjectReviewStatus =
  | 'draft'
  | 'pending_review'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'revision_required'

// 全球区域定义
export const GLOBAL_REGIONS = [
  { id: 'APAC', name: '亞太區', name_en: 'Asia Pacific', flag: '🌏' },
  { id: 'EMEA', name: '歐洲中東非洲', name_en: 'EMEA', flag: '🌍' },
  { id: 'AMERS', name: '美洲區', name_en: 'Americas', flag: '🌎' },
  { id: 'CHINA', name: '中國區', name_en: 'China', flag: '🇨🇳' },
  { id: 'NA', name: '北美區', name_en: 'North America', flag: '🇺🇸' },
  { id: 'EU', name: '歐洲區', name_en: 'Europe', flag: '🇪🇺' },
  { id: 'JP', name: '日本區', name_en: 'Japan', flag: '🇯🇵' },
  { id: 'SEA', name: '東南亞區', name_en: 'Southeast Asia', flag: '🌴' },
  { id: 'GLOBAL', name: '全球', name_en: 'Global', flag: '🌐' },
]

// AI角色定义
export const AI_ROLES_CONFIG = [
  {
    id: 'product_manager' as AIRoleType,
    name: '產品經理 AI',
    name_en: 'Product Manager AI',
    description: '需求梳理、原型規劃、優先級建議',
    capabilities: ['需求文檔生成', '產品規劃初稿', '優先級排序建議', '用戶故事編寫'],
    color: 'blue',
  },
  {
    id: 'ux_designer' as AIRoleType,
    name: 'UX 設計師 AI',
    name_en: 'UX Designer AI',
    description: '原型設計、交互邏輯、視覺建議',
    capabilities: ['原型設計稿', '交互邏輯示意圖', 'UI 風格建議', '可用性優化'],
    color: 'purple',
  },
  {
    id: 'frontend_engineer' as AIRoleType,
    name: '前端工程師 AI',
    name_en: 'Frontend Engineer AI',
    description: '代碼生成、組件開發、樣式優化',
    capabilities: ['代碼框架生成', '組件開發', '樣式編寫', '響應式適配'],
    color: 'green',
  },
  {
    id: 'backend_engineer' as AIRoleType,
    name: '後端工程師 AI',
    name_en: 'Backend Engineer AI',
    description: 'API 開發、數據庫設計、架構規劃',
    capabilities: ['API 接口開發', '數據庫設計', '業務邏輯實現', '性能優化建議'],
    color: 'orange',
  },
  {
    id: 'qa_engineer' as AIRoleType,
    name: '測試工程師 AI',
    name_en: 'QA Engineer AI',
    description: '測試用例生成、自動化測試、質量報告',
    capabilities: ['測試用例生成', '自動化測試腳本', 'Bug 報告', '質量評估報告'],
    color: 'red',
  },
]

// 支付渠道配置
export const PAYMENT_CHANNELS = [
  { id: 'paypal' as PaymentChannel, name: 'PayPal', regions: ['GLOBAL', 'NA', 'EU', 'APAC'] },
  { id: 'stripe' as PaymentChannel, name: 'Stripe', regions: ['GLOBAL', 'NA', 'EU', 'JP'] },
  { id: 'alipay' as PaymentChannel, name: '支付寶', regions: ['CHINA', 'APAC', 'SEA'] },
  { id: 'bank_transfer' as PaymentChannel, name: '銀行轉賬', regions: ['GLOBAL'] },
]

// 货币配置
export const CURRENCIES = [
  { code: 'USD' as CurrencyType, name: '美元', symbol: '$' },
  { code: 'EUR' as CurrencyType, name: '歐元', symbol: '€' },
  { code: 'CNY' as CurrencyType, name: '人民幣', symbol: '¥' },
  { code: 'JPY' as CurrencyType, name: '日元', symbol: '¥' },
  { code: 'GBP' as CurrencyType, name: '英鎊', symbol: '£' },
  { code: 'HKD' as CurrencyType, name: '港幣', symbol: 'HK$' },
  { code: 'TWD' as CurrencyType, name: '新台幣', symbol: 'NT$' },
]
