# Module 5: AI Copilot "Cortex" - 产品需求文档 (PRD)

> **版本**: v1.0
> **状态**: Draft
> **作者**: Product Architect (AI Agent)
> **日期**: 2026-01-28

---

## 1. 产品愿景 (Product Vision)

CodeUtopia 的 AI Copilot (代号 **"Cortex"**) 不仅仅是一个简单的聊天机器人。它是连接项目需求、资金流和交付物的**智能结缔组织**。
它作为一个**上下文感知 (Context-Aware)** 的助手，驻留在工作流中，主动帮助用户降低决策成本，提升交易双方的信任度。

**核心价值主张**:
*   **对于客户 (Client)**: "不懂技术也能雇佣对的人。" —— 辅助需求拆解、竞标分析、风险预警。
*   **对于开发者 (Developer)**: "专注于写代码，而不是写文档。" —— 辅助编写标书、自动生成日报、代码解释。

---

## 2. 核心功能范围内 (MVP Scope)

### 2.1 全局智能侧边栏 (Omnipresent Assistant)
*   **入口**: 顶部导航栏右侧 "AI 助手" 按钮，点击滑出侧边面板 (Overlay/Slide-over)。
*   **状态保持**: 切换页面时对话历史不丢失（Session Persistence）。
*   **上下文感知**: AI 知道用户当前在哪个页面、看哪个项目。
    *   *场景*: 在 "项目详情页" 打开 AI，它会自动加载该项目的预算、描述和里程碑信息。

### 2.2 角色化智能建议 (Role-Based Suggestions)
根据当前登录用户身份，提供不同的 `Quick Actions` (快捷指令芯片)。

| 用户角色 | 场景 | 推荐指令示例 | 预期行为 |
| :--- | :--- | :--- | :--- |
| **Client** | 发布项目页 | "帮我优化需求描述" | 读取输入框内容，重写为结构化文档。 |
| **Client** | 竞标列表页 | "分析这三个竞标的优劣" | 对比 Price, Rating, Proposal 内容。 |
| **Developer** | 项目详情页 | "帮我起草竞标方案" | 基于项目描述和自身技能，生成 Proposal。 |
| **User** | 任何页面 | "系统怎么用？" | 充当客服，解释 Escrow/Milestone 机制。 |

### 2.3 结构化输出组件 (Structured UI Components)
AI 不仅输出纯文本，还能输出 UI 组件（Generative UI 雏形）。
*   **Markdown 渲染**: 良好的排版、列表、代码块。
*   **Action Cards**:
    *   "创建里程碑建议卡片" -> 点击 "应用" 按钮直接填入表单。
    *   "风险提示卡片" -> 高亮显示。

---

## 3. 用户体验设计 (UX/UI Design)

### 3.1 布局
*   **位置**: 右侧 350px - 400px 宽度的抽屉。
*   **层级**: `z-index` 最高，覆盖在内容之上，但可通过 Backdrop 点击关闭。
*   **视觉风格**:
    *   背景: 浅色系 (White/Gray-50) 搭配紫色渐变边框，体现 "AI" 科技感。
    *   消息气泡: 这边 (User) 为深色，那边 (AI) 为浅色/品牌色。

### 3.2 交互逻辑
1.  **唤醒**: 点击 Header 上的 ⚡️ 图标。
2.  **问候**: AI 主动根据当前页面上下文发送第一条消息（"你好，我看到你正在查看 [Project Name]，需要我对预算进行评估吗？"）。
3.  **输入**: 支持文本输入 + 预设 Prompt 点击。
4.  **反馈**: 打字机效果 (Streaming Text) + Loading 状态。

---

## 4. 关键业务流程 (User Stories)

### Story 1: 辅助发标 (Assisted Creation)
1.  用户进入 "发布项目" 页面。
2.  用户输入一句模糊需求："我想做一个类似 Uber 的打车软件。"
3.  用户点击 AI 助手："帮我完善需求。"
4.  AI 生成详细的功能列表（乘客端、司机端、后台）和技术栈建议。
5.  用户点击 "复制" 或 "应用"，内容填充到表单中。

### Story 2: 竞标对比 (Bid Analysis)
1.  客户收到 5 个竞标。
2.  客户询问 AI："哪个开发者性价比最高？"
3.  AI 读取 5 个 Bid 对象，分析价格/工期/信誉的比率。
4.  AI 输出："建议考虑开发者 A，虽然价格略高，但评分 5.0 且做过类似项目；开发者 B 价格最低但无历史评价，风险较高。"

---

## 5. 技术依赖与约束 (System Constraints)

*   **LLM 模型**: 
    *   开发阶段 (MVP): 使用 Mock 本地响应或模拟延迟的伪 AI 逻辑，确保演示稳定性。
    *   预留 API 接口: 遵循 OpenAI 格式 (`messages: [{role, content}]`)，以便后续接入真实模型。
*   **上下文注入 (Prompt Engineering)**:
    *   需要一个 `ContextManager` 服务，将前端的 State (Project Object, User Object) 转换为 Prompt 字符串注入给 AI。
*   **隐私**:
    *   注意不要将敏感的 PII (如果有) 发送给 LLM。当前 Mock 阶段无此风险。

---

## 6. 验收标准 (Acceptance Criteria)

1.  [ ] AI 面板能从任意页面唤起。
2.  [ ] AI 能准确说出当前项目的名称和预算（证明上下文注入成功）。
3.  [ ] 针对 Client 和 Contractor 有不同的默认欢迎语。
4.  [ ] 至少实现一个 "Action"：点击 AI 建议，自动填充某个表单字段。

---

> **下一步**: 请 **System Architect** 基于此 PRD 设计技术方案 (Hook 封装、State 管理、Prompt 构造策略)。
