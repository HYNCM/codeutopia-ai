export type UserRole = 'client' | 'developer' | 'admin';

export type ProjectStatus =
  | 'draft'
  | 'open'
  | 'in_progress'
  | 'review'
  | 'completed'
  | 'disputed'
  | 'cancelled';

export type MilestoneStatus =
  | 'pending'
  | 'in_progress'
  | 'submitted'
  | 'approved'
  | 'rejected'
  | 'paid';

export type BidStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';

export type ProjectCategory =
  | 'web_dev'
  | 'mobile_dev'
  | 'ui_ux'
  | 'backend'
  | 'devops'
  | 'ai_ml'
  | 'writing'
  | 'other';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  company?: string;
  rating: number;
  completedProjects: number;
  balance: number;
  skills: string[];
  verified: boolean;
  memberSince: string;
  location: string;
  timezone: string;
  bio?: string;
  hourlyRate?: number;
  portfolio?: PortfolioItem[];
  certifications?: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
  technologies: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  subcategory: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  status: ProjectStatus;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  duration: string;
  skills: string[];
  milestones: Milestone[];
  bids: Bid[];
  createdAt: string;
  updatedAt: string;
  aiAnalysis?: AIAnalysis;
  attachments?: string[];
  visibility: 'public' | 'private' | 'invite_only';
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  status: MilestoneStatus;
  deliverables: string[];
  order: number;
  approvedAt?: string;
  paidAt?: string;
}

export interface Bid {
  id: string;
  projectId: string;
  developerId: string;
  developerName: string;
  developerAvatar: string;
  developerRating: number;
  proposedPrice: number;
  deliveryDays: number;
  proposal: string;
  status: BidStatus;
  createdAt: string;
}

export interface AIAnalysis {
  taskCount: number;
  estimatedDays: number;
  recommendedBudget: {
    min: number;
    max: number;
  };
  riskPoints: string[];
  suggestedTechStack: string[];
  complexity: 'low' | 'medium' | 'high' | 'very_high';
  marketRate: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: string[];
}

export interface Notification {
  id: string;
  type: 'bid' | 'milestone' | 'message' | 'payment' | 'review' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface Payment {
  id: string;
  projectId: string;
  milestoneId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  type: 'deposit' | 'milestone' | 'refund' | 'withdrawal';
  createdAt: string;
  completedAt?: string;
  stripePaymentId?: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'withdrawal' | 'refund';
  amount: number;
  currency: string;
  description: string;
  projectTitle?: string;
  createdAt: string;
}

export interface DeveloperFilter {
  skills?: string[];
  minRate?: number;
  maxRate?: number;
  rating?: number;
  availability?: boolean;
  location?: string;
}

export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalSpent: number;
  averageBudget: number;
  completionRate: number;
}

export interface DeveloperStats {
  totalEarnings: number;
  pendingPayments: number;
  activeProjects: number;
  completedProjects: number;
  averageRating: number;
  responseRate: number;
}

export const PROJECT_CATEGORIES = [
  { value: 'web_dev', label: 'Web開發', icon: 'Globe', subcategories: ['前端開發', '後端開發', '全棧開發', 'CMS開發', '電子商務'] },
  { value: 'mobile_dev', label: '移動應用開發', icon: 'Smartphone', subcategories: ['iOS開發', 'Android開發', 'React Native', 'Flutter', '小程序開發'] },
  { value: 'ui_ux', label: 'UI/UX設計', icon: 'Palette', subcategories: ['網頁設計', '移動端設計', '產品設計', '品牌設計', '原型設計'] },
  { value: 'backend', label: '後端開發', icon: 'Server', subcategories: ['API開發', '數據庫設計', '系統架構', '微服務', '雲服務'] },
  { value: 'devops', label: 'DevOps', icon: 'Settings', subcategories: ['CI/CD', '容器化', '雲部署', '監控運維', '自動化測試'] },
  { value: 'ai_ml', label: 'AI/機器學習', icon: 'Brain', subcategories: ['機器學習', '深度學習', '自然語言處理', '電腦視覺', 'AI集成'] },
  { value: 'writing', label: '文案撰寫', icon: 'FileText', subcategories: ['技術文檔', '內容創作', '翻譯', 'SEO文案', '產品說明'] },
  { value: 'other', label: '其他', icon: 'MoreHorizontal', subcategories: [] },
];

export const SKILLS = [
  'React', 'Vue.js', 'Angular', 'TypeScript', 'Node.js', 'Python', 'Java',
  'Go', 'Rust', 'Swift', 'Kotlin', 'Docker', 'Kubernetes', 'AWS', 'GCP',
  'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL', 'REST API', 'UI/UX', 'Figma',
  'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision', 'DevOps', 'CI/CD',
  '區塊鏈', '小程序', '電子商務系統', 'CRM系統', 'ERP系統'
];
