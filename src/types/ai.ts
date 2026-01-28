export type AIRole = 'user' | 'assistant' | 'system'
export type AIMessageType = 'text' | 'action_card' | 'suggestion_chips'

export interface AIActionData {
  type: 'autofill_form' | 'navigate' | 'highlight_risk' | 'create_milestone'
  payload: any
  label?: string // Button label
}

export interface AIChatMessage {
  id: string
  role: AIRole
  content: string
  type: AIMessageType
  timestamp: string // ISO string
  metadata?: {
    action?: AIActionData
    chips?: string[] // Quick reply suggestions
    relatedField?: string // For form highlighting
  }
}

export type PageContextType = 'global' | 'project_create' | 'project_detail' | 'bid_list' | 'contractor_dashboard'

export interface PageContextData {
  type: PageContextType
  data?: any // Generic payload: { projectId, budget, userRole, etc. }
}
