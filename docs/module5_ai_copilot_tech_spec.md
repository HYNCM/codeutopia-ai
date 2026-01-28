# Module 5: AI Copilot "Cortex" - 技术规格书 (Tech Spec)

> **版本**: v1.0
> **状态**: Approved
> **作者**: System Architect (AI Agent)
> **参考 PRD**: module5_ai_copilot_prd.md
> **日期**: 2026-01-28

---

## 1. 架构概览 (Architecture Overview)

为了实现 PRD 中的“上下文感知”与“全局交互”，我们将采用 **Headless AI Service** 架构。AI 的核心逻辑（状态管理、消息流自）与 UI 展示分离。

### 1.1 核心组件图

```mermaid
graph TD
    A[App Layout] --> B[AIContext Provider]
    B --> C[AI Floating Panel (UI)]
    B --> D[Pages (Client/Developer)]
    
    subgraph "AI Core (Frontend)"
        E[useAIChat Hook] --> F[Mock LLM Service]
        F --> G[Scenario Matcher]
    end
    
    D -.-> |Inject Page Context| E
```

---

## 2. 数据流与状态管理 (Data Flow)

### 2.1 新增 `AIContext`
我们将创建一个全局 Context `src/contexts/AIContext.tsx`，负责管理：
1.  **Visibility**: 面板打开/关闭状态。
2.  **Messages**: 当前会话的消息列表 `Message[]`。
3.  **ActiveContext**: 当前页面注入的业务上下文（如：Project ID, User Role）。
4.  **IsTyping**: AI 是否正在生成的标志位。

### 2.2 上下文注入机制 (Context Injection)
为了让 AI 知道用户在看什么，我们需要一种**被动感知**机制。
*   **方案**: 使用 `useEffect` 在页面组件挂载时，调用 `setAIContext`。
*   **示例**:
    ```typescript
    // In ProjectManagementPage.tsx
    useEffect(() => {
      setPageContext({
        type: 'project_detail',
        data: { projectId: id, budget: project.budget }
      })
    }, [id, project])
    ```

---

## 3. 接口定义 (Interface Definitions)

### 3.1 消息对象
```typescript
interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  type: 'text' | 'action_card' | 'suggestion_chips';
  timestamp: string;
  // Payload for UI components (e.g., specific actions)
  metadata?: {
    actionType?: 'autofill_form' | 'navigate';
    actionData?: any;
    chips?: string[]; // Quick reply suggestions
  };
}
```

### 3.2 Mock 智能引擎 (The "Brain")
为了保证 MVP 的绝对稳定性，不依赖外部 API Key，我们将实现一个 `MockLLMService`。

*   **匹配逻辑**: 
    1.  **Regex Keywords**: 匹配关键词 (e.g., "budget", "create", "risk").
    2.  **Page Context**: 结合当前页面类型 (e.g., if page='project_create' and keyword='help' -> return PRD template).
    3.  **Fallback**: 通用回复。

*   **流式模拟**:
    *   实现 `simulateStreaming(text: string, onChunk: (char) => void)` 函数，模拟 30-50ms 的打字机延迟。

---

## 4. 目录结构变更 (Directory Structure)

```text
src/
  components/
    AI/                  <-- NEW
      AIChatPanel.tsx    (The main drawer)
      ChatMessage.tsx    (Individual bubble)
      ActionCard.tsx     (Interactive components)
      TypingIndicator.tsx
  contexts/
    AIContext.tsx        <-- NEW
  hooks/
    useAI.tsx            (Consumer hook)
    useTypewriter.ts     (Streaming effect)
  services/
    mockAI.ts            (The "Brain" logic)
```

---

## 5. 开发计划 (Implementation Plan)

### Phase 1: 基础设施 (P2 - 突击组)
1.  创建 `mockAI.ts` 服务，定义基础问答库。
2.  创建 `AIContext.tsx` 搭建全局状态。
3.  实现 `useTypewriter` 钩子。

### Phase 2: UI 实现 (P2 - 突击组)
1.  开发 `AIChatPanel.tsx` 侧边栏 UI。
2.  集成 markdown 渲染库 (或简单的 regex formatter)。
3.  将 Panel 挂载到 `App.tsx` 的 Layout 中。

### Phase 3: 业务集成 (P2 - 突击组)
1.  在 `ProjectCreatePage` 注入上下文 -> 测试“辅助发标”。
2.  在 `ProjectManagementPage` 注入上下文 -> 测试“项目分析”。

---

## 6. 安全与风险 (Risk)

*   **Mock 数据显得太假**: 需预置约 20-30 条高质量的预设对话，覆盖演示流程的 80%。
*   **状态冲突**: 确保切换页面时，如果用户未手动清除，对话历史应保留（或提供选项清除）。**决策**: MVP 切换页面时自动清空 Context 但保留 History 直到手动关闭。

---

> **批准人**: Commander
> **执行**: 转交给 **Full-stack Dev** (Code Generation)
