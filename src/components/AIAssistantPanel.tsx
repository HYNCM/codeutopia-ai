import { useState } from 'react'
import {
  Sparkles,
  Brain,
  Palette,
  Code2,
  Server,
  Shield,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Copy,
  RefreshCw,
  Settings,
  ChevronDown,
  ChevronUp,
  FileText,
  Layout,
  TestTube,
  Sparkle,
} from 'lucide-react'

// AI 角色类型定義
export type AIRoleType = 'product_manager' | 'ux_designer' | 'frontend_engineer' | 'backend_engineer' | 'qa_engineer'

// AI 角色配置
interface AIRoleConfig {
  id: AIRoleType
  name: string
  nameZh: string
  icon: typeof Brain
  description: string
  color: string
  bgColor: string
  capabilities: string[]
}

// AI 角色配置數據
const AI_ROLES: AIRoleConfig[] = [
  {
    id: 'product_manager',
    name: 'Product Manager AI',
    nameZh: '產品經理 AI',
    icon: Brain,
    description: '需求梳理、原型規劃、優先級建議',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    capabilities: ['需求文檔生成', '產品規劃初稿', '優先級排序建議', '用戶故事編寫'],
  },
  {
    id: 'ux_designer',
    name: 'UX Designer AI',
    nameZh: 'UX 設計師 AI',
    icon: Palette,
    description: '原型設計、交互邏輯、視覺建議',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    capabilities: ['原型設計稿', '交互邏輯示意圖', 'UI 風格建議', '可用性優化'],
  },
  {
    id: 'frontend_engineer',
    name: 'Frontend Engineer AI',
    nameZh: '前端工程師 AI',
    icon: Code2,
    description: '代碼生成、組件開發、樣式優化',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    capabilities: ['代碼框架生成', '組件開發', '樣式編寫', '響應式適配'],
  },
  {
    id: 'backend_engineer',
    name: 'Backend Engineer AI',
    nameZh: '後端工程師 AI',
    icon: Server,
    description: 'API 開發、數據庫設計、架構規劃',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    capabilities: ['API 接口開發', '數據庫設計', '業務邏輯實現', '性能優化建議'],
  },
  {
    id: 'qa_engineer',
    name: 'QA Engineer AI',
    nameZh: '測試工程師 AI',
    icon: TestTube,
    description: '測試用例生成、自動化測試、質量報告',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    capabilities: ['測試用例生成', '自動化測試腳本', 'Bug 報告', '質量評估報告'],
  },
]

// 任務狀態
interface TaskStatus {
  id: string
  role: AIRoleType
  task: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  result?: string
  createdAt: Date
}

// AI 協助面板屬性
interface AIAssistantPanelProps {
  projectId?: string
  milestoneId?: string
  currentRole: 'project_initiator' | 'contractor' | 'regional_manager' | 'webadmin'
  onTaskComplete?: (role: AIRoleType, result: any) => void
  codeBoxCompatible?: boolean // 是否兼容 CodeBox 硬件開發
}

// 里程碑選項
const MILESTONE_OPTIONS = [
  { id: 'm1', name: '第一里程碑：需求確認' },
  { id: 'm2', name: '第二里程碑：設計階段' },
  { id: 'm3', name: '第三里程碑：開發實現' },
  { id: 'm4', name: '第四里程碑：測試驗收' },
  { id: 'm5', name: '第五里程碑：交付上線' },
]

export function AIAssistantPanel({
  projectId,
  milestoneId,
  currentRole,
  onTaskComplete,
  codeBoxCompatible = false,
}: AIAssistantPanelProps) {
  const [selectedRole, setSelectedRole] = useState<AIRoleType | null>(null)
  const [taskInput, setTaskInput] = useState('')
  const [selectedMilestone, setSelectedMilestone] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [taskHistory, setTaskHistory] = useState<TaskStatus[]>([])
  const [resultExpanded, setResultExpanded] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)

  // 處理 AI 任務提交
  const handleSubmitTask = async () => {
    if (!selectedRole || !taskInput.trim()) return

    const taskId = `task_${Date.now()}`
    const newTask: TaskStatus = {
      id: taskId,
      role: selectedRole,
      task: taskInput,
      status: 'processing',
      progress: 0,
      createdAt: new Date(),
    }

    setTaskHistory((prev) => [newTask, ...prev])
    setIsProcessing(true)
    setTaskInput('')

    // 模擬 AI 處理過程
    const roleConfig = AI_ROLES.find((r) => r.id === selectedRole)!

    // 模擬處理進度
    let progress = 0
    const progressInterval = setInterval(() => {
      progress += Math.random() * 30
      if (progress >= 100) {
        progress = 100
        clearInterval(progressInterval)

        // 生成模擬結果
        const mockResult = generateMockResult(selectedRole, taskInput, codeBoxCompatible)

        setTaskHistory((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, status: 'completed', progress: 100, result: mockResult } : t)),
        )

        setIsProcessing(false)
        onTaskComplete?.(selectedRole, mockResult)
      } else {
        setTaskHistory((prev) => prev.map((t) => (t.id === taskId ? { ...t, progress: Math.floor(progress) } : t)))
      }
    }, 500)
  }

  // 生成模擬結果
  const generateMockResult = (role: AIRoleType, task: string, codeBox: boolean): string => {
    const roleData = AI_ROLES.find((r) => r.id === role)!

    const results: Record<AIRoleType, string> = {
      product_manager: `## 需求分析報告

### 任務：${task}

### 1. 需求摘要
根據您的描述，我們整理出以下核心需求：
- 功能需求：完成系統核心模塊開發
- 非功能需求：性能優化、安全加固

### 2. 優先級排序
1. P0 - 核心功能開發（必須交付）
2. P1 - 輔助功能完善（建議交付）
3. P2 - 優化體驗（可選交付）

### 3. 里程碑建議
- M1：需求確認與設計（3天）
- M2：核心開發（10天）
- M3：測試與優化（4天）

### 4. 風險提示
- API 依賴第三方服務，需預留接口測試時間
- 建議預留緩衝期應對需求變更${codeBox ? '\n- 端側開發需考慮 CodeBox 硬件兼容性' : ''}`,

      ux_designer: `## UX 設計方案

### 任務：${task}

### 1. 設計規範
- 設計風格：現代簡約、扁平化設計
- 主色調：品牌紫色系 (#8B5CF6)
- 響應式：支持 PC / 平板 / 手機三端適配${codeBox ? '\n- 端側界面需適配 CodeBox 屏幕尺寸' : ''}

### 2. 頁面結構
- 首頁：品牌展示 + 功能入口
- 工作台：項目列表 + 快捷操作
- 項目詳情：進度追蹤 + 交付物管理

### 3. 交互設計
- 頁面加載：骨架屏過渡
- 操作反饋：Toast 提示
- 數據加載：分頁 + 下拉刷新`,

      frontend_engineer: `## 前端代碼框架

\`\`\`typescript
// 任務：${task}

// 1. 項目結構
src/
├── components/     # 通用組件
├── pages/          # 頁面組件
├── hooks/          # 自定義 Hooks
├── utils/          # 工具函數
├── api/            # API 接口
└── styles/         # 樣式文件

// 2. 技術棧
- React 18 + TypeScript
- TailwindCSS 樣式
- React Router 路由管理
- Zustand 狀態管理${codeBox ? '\n\n// 3. CodeBox 適配\n- 端側組件需使用 @codebox/react 適配包\n- 屏幕渲染組件：CodeBoxScreen\n- 硬件按鍵事件監聽：useHardwareInput' : ''}

// 3. 核心組件示例
\`\`\`tsx
import { useState } from 'react';

export function ProjectCard({ project }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card">
      <h3>{project.title}</h3>
      <p>{project.description}</p>
    </div>
  );
}
\`\`\``,

      backend_engineer: `## 後端架構設計

### 任務：${task}

### 1. 技術架構
\`\`\`mermaid
graph TD
    A[客戶端] --> B[API Gateway]
    B --> C[用戶服務]
    B --> D[項目服務]
    B --> E[AI 服務]
    C --> F[(MySQL)]
    D --> G[(Redis)]
    E --> H[AI Model]
\`\`\`

### 2. API 接口設計

#### 創建項目
\`\`\`http
POST /api/projects
Content-Type: application/json

{
  "title": "項目名稱",
  "description": "項目描述",
  "milestones": [...]
}
\`\`\`

### 3. 數據庫設計

\`\`\`sql
CREATE TABLE projects (
  id BIGINT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  status VARCHAR(50) DEFAULT 'open',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
\`\`\`${codeBox ? '\n\n### 4. CodeBox 硬件接口\n- 設備註冊接口：/api/codebox/register\n- 參數同步接口：/api/codebox/sync\n- 狀態監控接口：/api/codebox/status' : ''}`,

      qa_engineer: `## 測試方案

### 任務：${task}

### 1. 測試用例

| 編號 | 測試場景 | 預期結果 | 優先級 |
|------|----------|----------|--------|
| TC001 | 用戶登錄成功 | 跳轉至工作台 | P0 |
| TC002 | 項目創建 | 項目列表更新 | P0 |
| TC003 | AI 任務提交 | 任務狀態更新 | P1 |

### 2. 自動化測試腳本

\`\`\`typescript
describe('Project Management', () => {
  it('should create a new project', async () => {
    const project = await createProject({
      title: 'Test Project',
      description: 'Test Description',
    });

    expect(project.id).toBeDefined();
    expect(project.status).toBe('open');
  });
});
\`\`\`

### 3. 測試環境配置
- 前端測試：Jest + React Testing Library
- 端到端測試：Playwright${codeBox ? '\n- 真機測試：CodeBox 設備集群' : ''}

### 4. 質量評估標準
- 代碼覆蓋率 ≥ 80%
- 測試通過率 ≥ 95%
- 無 Critical 級別 Bug`,
    }

    return results[role]
  }

  // 複製結果到剪貼板
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  // 下載結果
  const downloadResult = (taskId: string, result: string) => {
    const blob = new Blob([result], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ai_result_${taskId}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className='bg-gray-800/50 rounded-2xl border border-gray-700/50 overflow-hidden'>
      {/* 面板標題 */}
      <div className='px-6 py-4 border-b border-gray-700/50 flex items-center justify-between'>
        <div className='flex items-center space-x-3'>
          <div className='w-10 h-10 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center'>
            <Sparkles className='w-5 h-5 text-purple-400' />
          </div>
          <div>
            <h3 className='text-white font-semibold'>AI 協助角色</h3>
            <p className='text-sm text-gray-400'>
              {currentRole === 'project_initiator' ? '調用 AI 輔助項目管理' : '調用 AI 輔助任務交付'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className='p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors'>
          <Settings className='w-5 h-5' />
        </button>
      </div>

      {/* 設置區域 */}
      {showSettings && (
        <div className='px-6 py-4 bg-gray-900/50 border-b border-gray-700/50'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm text-gray-400 mb-2'>輸出語言</label>
              <select className='w-full py-2 px-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm'>
                <option>跟隨界面語言</option>
                <option>English</option>
                <option>繁體中文</option>
                <option>日本語</option>
              </select>
            </div>
            <div>
              <label className='block text-sm text-gray-400 mb-2'>輸出格式</label>
              <select className='w-full py-2 px-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm'>
                <option>Markdown</option>
                <option>JSON</option>
                <option>純文本</option>
              </select>
            </div>
            {codeBoxCompatible && (
              <div className='col-span-2'>
                <label className='flex items-center space-x-3'>
                  <input
                    type='checkbox'
                    defaultChecked
                    className='w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500'
                  />
                  <span className='text-sm text-gray-300'>CodeBox 硬件開發模式（自動適配端側參數）</span>
                </label>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI 角色選擇 */}
      <div className='px-6 py-4 border-b border-gray-700/50'>
        <label className='block text-sm text-gray-400 mb-3'>選擇 AI 協助角色</label>
        <div className='grid grid-cols-5 gap-2'>
          {AI_ROLES.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`p-3 rounded-xl border transition-all text-center ${
                selectedRole === role.id
                  ? `border-${role.color.replace('text-', '')} bg-${role.bgColor}`
                  : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
              }`}>
              <div className={`w-8 h-8 ${role.bgColor} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                <role.icon className={`w-4 h-4 ${role.color}`} />
              </div>
              <div className={`text-xs font-medium ${selectedRole === role.id ? role.color : 'text-gray-400'}`}>
                {role.nameZh}
              </div>
            </button>
          ))}
        </div>

        {/* 選中角色說明 */}
        {selectedRole && (
          <div className='mt-4 p-4 bg-gray-900/50 rounded-xl'>
            {(() => {
              const role = AI_ROLES.find((r) => r.id === selectedRole)
              if (!role) return null
              return (
                <div className='flex items-start space-x-3'>
                  <div
                    className={`w-10 h-10 ${role.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <role.icon className={`w-5 h-5 ${role.color}`} />
                  </div>
                  <div className='flex-1'>
                    <h4 className='text-white font-medium'>{role.nameZh}</h4>
                    <p className='text-sm text-gray-400 mt-1'>{role.description}</p>
                    <div className='flex flex-wrap gap-2 mt-2'>
                      {role.capabilities.map((cap) => (
                        <span key={cap} className='px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-300'>
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </div>

      {/* 任務輸入區域 */}
      <div className='px-6 py-4 border-b border-gray-700/50'>
        <label className='block text-sm text-gray-400 mb-3'>描述您的需求</label>
        <div className='space-y-3'>
          <textarea
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder={`例如：${selectedRole ? `請${AI_ROLES.find((r) => r.id === selectedRole)!.nameZh}幫我${AI_ROLES.find((r) => r.id === selectedRole)!.capabilities[0]}` : '請描述您的需求...'}`}
            className='w-full h-24 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none'
          />
          <div className='flex items-center justify-between'>
            <select
              value={selectedMilestone}
              onChange={(e) => setSelectedMilestone(e.target.value)}
              className='py-2 px-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm'>
              <option value=''>關聯里程碑（可選）</option>
              {MILESTONE_OPTIONS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleSubmitTask}
              disabled={!selectedRole || !taskInput.trim() || isProcessing}
              className={`flex items-center space-x-2 px-6 py-2 rounded-xl font-medium transition-all ${
                !selectedRole || !taskInput.trim() || isProcessing
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/25'
              }`}>
              {isProcessing ? (
                <>
                  <RefreshCw className='w-4 h-4 animate-spin' />
                  <span>處理中...</span>
                </>
              ) : (
                <>
                  <Send className='w-4 h-4' />
                  <span>提交任務</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 任務歷史 */}
      {taskHistory.length > 0 && (
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between mb-4'>
            <h4 className='text-white font-medium'>任務歷史</h4>
            <span className='text-sm text-gray-400'>{taskHistory.length} 個任務</span>
          </div>
          <div className='space-y-3'>
            {taskHistory.map((task) => (
              <div key={task.id} className='bg-gray-900/50 rounded-xl overflow-hidden border border-gray-700/50'>
                {/* 任務頭部 */}
                <button
                  onClick={() => setResultExpanded(resultExpanded === task.id ? null : task.id)}
                  className='w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800/50 transition-colors'>
                  <div className='flex items-center space-x-3'>
                    <div
                      className={`w-8 h-8 ${AI_ROLES.find((r) => r.id === task.role)!.bgColor} rounded-lg flex items-center justify-center`}>
                      {task.status === 'processing' ? (
                        <RefreshCw
                          className={`w-4 h-4 ${AI_ROLES.find((r) => r.id === task.role)!.color} animate-spin`}
                        />
                      ) : task.status === 'completed' ? (
                        <CheckCircle className={`w-4 h-4 ${AI_ROLES.find((r) => r.id === task.role)!.color}`} />
                      ) : (
                        <AlertCircle className='w-4 h-4 text-red-400' />
                      )}
                    </div>
                    <div className='text-left'>
                      <div className='text-white font-medium text-sm'>
                        {AI_ROLES.find((r) => r.id === task.role)!.nameZh}
                      </div>
                      <div className='text-gray-400 text-xs truncate max-w-xs'>{task.task}</div>
                    </div>
                  </div>
                  <div className='flex items-center space-x-3'>
                    {task.status === 'processing' && (
                      <div className='w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden'>
                        <div
                          className='h-full bg-purple-500 transition-all duration-300'
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    )}
                    {task.status === 'completed' && <span className='text-xs text-green-400'>已完成</span>}
                    {resultExpanded === task.id ? (
                      <ChevronUp className='w-4 h-4 text-gray-400' />
                    ) : (
                      <ChevronDown className='w-4 h-4 text-gray-400' />
                    )}
                  </div>
                </button>

                {/* 任務結果 */}
                {resultExpanded === task.id && task.result && (
                  <div className='border-t border-gray-700/50'>
                    <div className='p-4'>
                      <div className='prose prose-invert prose-sm max-w-none'>
                        <pre className='bg-gray-900 rounded-lg p-4 text-gray-300 text-xs overflow-x-auto whitespace-pre-wrap font-mono'>
                          {task.result}
                        </pre>
                      </div>
                      <div className='flex items-center justify-end space-x-3 mt-4 pt-3 border-t border-gray-700/50'>
                        <button
                          onClick={() => copyToClipboard(task.result!)}
                          className='flex items-center space-x-1 px-3 py-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors text-sm'>
                          <Copy className='w-4 h-4' />
                          <span>複製</span>
                        </button>
                        <button
                          onClick={() => downloadResult(task.id, task.result!)}
                          className='flex items-center space-x-1 px-3 py-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors text-sm'>
                          <Download className='w-4 h-4' />
                          <span>下載</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 底部提示 */}
      <div className='px-6 py-4 bg-gray-900/30 border-t border-gray-700/50'>
        <div className='flex items-center space-x-2 text-xs text-gray-400'>
          <Sparkle className='w-4 h-4 text-purple-400' />
          <span>AI 協助角色僅提供輔助能力，核心決策由人類掌控</span>
        </div>
      </div>
    </div>
  )
}
