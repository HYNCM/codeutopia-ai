import { Link } from 'react-router-dom';
import {
  Sparkles,
  Globe,
  Shield,
  Zap,
  Users,
  DollarSign,
  Code2,
  Brain,
  ChevronRight,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  MessageSquare,
  GitBranch,
  Container,
  BarChart3,
  Target,
  Layers,
  Smartphone,
  Monitor,
  Cpu,
} from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                CodeUtopia.ai
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                平台功能
              </a>
              <a href="#workflow" className="text-gray-600 hover:text-gray-900 transition-colors">
                工作流程
              </a>
              <a href="#devmode" className="text-gray-600 hover:text-gray-900 transition-colors">
                開發模式
              </a>
              <a href="#team" className="text-gray-600 hover:text-gray-900 transition-colors">
                團隊角色
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                定價方案
              </a>
              <Link
                to="/login"
                className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                登錄
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>全球首個智能體協作網路平台</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              讓 AI 成為你的
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                技術聯合創始人
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              告別繁瑣的團隊管理、複雜的工具整合、無休止的代碼審查。
              <br />
              在 CodeUtopia，你可以：
            </p>

            {/* Value Propositions */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-10">
              {[
                { text: '描述想法 → AI組建完美團隊', icon: '👥' },
                { text: '自然語言需求 → 自動生成可運行代碼', icon: '💻' },
                { text: '全球頂尖開發者匹配 → 24/7不間斷開發', icon: '🌍' },
                { text: '從代碼到真機部署 → 全流程自動化驗證', icon: '🚀' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                  <span>{item.icon}</span>
                  <span className="text-gray-700 font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            <p className="text-lg text-gray-500 mb-4">
              你的角色：<span className="font-semibold text-purple-600">創意總監</span>。
              AI 的角色：<span className="font-semibold text-blue-600">執行所有技術細節</span>。
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Link
                to="/login"
                className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg shadow-purple-500/25"
              >
                <span>🚀 開始創建你的第一個智能開發項目</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#features"
                className="flex items-center space-x-2 px-8 py-4 border border-gray-200 rounded-xl font-semibold text-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span>觀看演示</span>
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '50,000+', label: '全球開發者' },
              { value: '12,000+', label: '已完成專案' },
              { value: '14', label: '支援區域' },
              { value: '98.5%', label: '客戶滿意度' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>✨ 一站式企業協作平台</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              整合 Slack + Upwork + ChatGPT + GitHub + 測試部署
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              團隊只需完成最後一哩審核，AI 搞定其餘一切！
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: MessageSquare,
                title: 'Slack 風格協作',
                description: '頻道管理、@提及、表情回覆、檔案分享，讓團隊溝通更順暢。支援與現有 Slack 帳號整合。',
                color: 'bg-purple-100 text-purple-600',
              },
              {
                icon: Users,
                title: 'Upwork 人才庫',
                description: '接入全球 50,000+ 開髮型人才，AI 智能匹配最適合的專案夥伴，支援自由工作者招募與管理。',
                color: 'bg-blue-100 text-blue-600',
              },
              {
                icon: Brain,
                title: 'ChatGPT AI 助手',
                description: 'AI 對話式需求分析、代碼生成、測試案例撰寫、文件編寫，24/7 線上協助開發團隊。',
                color: 'bg-green-100 text-green-600',
              },
              {
                icon: GitBranch,
                title: 'GitHub 深度整合',
                description: '自動同步代碼庫、PR 審查、CI/CD 流水線、Issue 追蹤，開發流程無縫銜接。',
                color: 'bg-gray-100 text-gray-600',
              },
              {
                icon: Shield,
                title: '自動化測試驗證',
                description: 'AI 自動生成測試用例、單元測試、整合測試、E2E 測試，確保交付品質零缺陷。',
                color: 'bg-yellow-100 text-yellow-600',
              },
              {
                icon: Container,
                title: '真機部署測試',
                description: '一鍵部署到雲端環境、自動化 staging、生產環境部署，支援 Docker 與 Kubernetes。',
                color: 'bg-orange-100 text-orange-600',
              },
              {
                icon: BarChart3,
                title: 'Research 平台',
                description: 'AI 驅動的市場研究、競爭分析、技術趨勢追蹤，為產品決策提供數據支撐。',
                color: 'bg-pink-100 text-pink-600',
              },
              {
                icon: DollarSign,
                title: 'Stripe 支付整合',
                description: '全球多幣種支付、自動化發票、專案款項托管、團隊分潤，財務管理一次搞定。',
                color: 'bg-indigo-100 text-indigo-600',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🔄 AI 驅動的完整工作流程
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              從 Research 到部署，AI 處理 85% 繁重工作，團隊專注審核決策
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-8">
            {[
              {
                step: '1',
                icon: '🔬',
                title: 'Research',
                items: ['AI 市場分析', '需求調研', '競品研究'],
              },
              {
                step: '2',
                icon: '🎨',
                title: 'Design',
                items: ['AI 架構設計', 'UI 設計生成', 'API 設計'],
              },
              {
                step: '3',
                icon: '💻',
                title: 'Code',
                items: ['AI 代碼生成', '自動測試', 'Code Review'],
              },
              {
                step: '4',
                icon: '🧪',
                title: 'Test',
                items: ['AI 測試生成', '自動化測試', '效能測試'],
              },
              {
                step: '5',
                icon: '🚀',
                title: 'Deploy',
                items: ['CI/CD 流水線', '真機部署', '監控告警'],
              },
            ].map((item, idx) => (
              <div key={idx} className="relative text-center">
                <div className="text-6xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {item.items.map((subItem, subIdx) => (
                    <p key={subIdx} className="text-gray-600 text-sm mb-1">{subItem}</p>
                  ))}
                </div>
                {idx < 4 && (
                  <div className="hidden md:block absolute top-8 -right-4 text-purple-300">
                    <ChevronRight className="w-8 h-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Development Modes */}
      <section id="devmode" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">💻 靈活開發模式選擇</h2>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto">
              根據專案需求，選擇最適合的開發環境與測試驗證方式
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Monitor,
                title: '全雲端',
                subtitle: '☁️ 雲側開發測試驗證',
                description: '所有開發、測試、驗證均在雲端完成，無需本地環境配置，開瀏覽器即可開始 coding。',
                features: [
                  '雲端 IDE 開發環境',
                  'AI 實時代碼生成與補全',
                  '雲端整合測試環境',
                  '自動生成測試案例',
                  'CI/CD 自動化驗證',
                  '真機部署測試',
                  '即時協作與 Code Review',
                ],
                badge: '雲端即時同步',
              },
              {
                icon: Monitor,
                title: '本地優先',
                subtitle: '🖥️ 端側開發測試驗證',
                description: '在本地 PC 開發，網站主動同步端側，開發完成後推送至雲端進行測試驗證迭代。',
                features: [
                  '支援 VS Code / IntelliJ 等主流 IDE',
                  '網站 ←→ PC 雙向同步',
                  '本地開發環境調試',
                  '推送代碼至雲端 CI/CD',
                  '雲端自動化測試驗證',
                  'AI 輔助 Code Review',
                  '多人協作衝突處理',
                ],
                badge: 'PC ↔️ 雲端 雙向同步',
              },
              {
                icon: Smartphone,
                title: '完整部署',
                subtitle: '📱 端側 + 真機部署測試',
                description: '本地開發結合真機部署，網站與 CodeBox 同步，支援雲端 API 或 IDE 綁定雲端 API。',
                features: [
                  '支援 VS Code / IntelliJ 等主流 IDE',
                  '網站 ←→ CodeBox 同步',
                  '代碼 API (雲端 API / IDE 綁定 API)',
                  '本地開發環境調試',
                  '真機部署測試驗證',
                  '雲端 API 模擬與測試',
                  '效能監控與優化',
                ],
                badge: 'PC ↔️ CodeBox ↔️ 真機 即時同步',
              },
            ].map((mode, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 text-gray-900">
                <div className="flex items-center space-x-3 mb-4">
                  <mode.icon className="w-8 h-8 text-purple-600" />
                  <div>
                    <h3 className="text-xl font-bold">{mode.title}</h3>
                    <p className="text-purple-600 font-medium">{mode.subtitle}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">{mode.description}</p>
                <ul className="space-y-2 mb-6">
                  {mode.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center space-x-2 text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-center font-medium">
                  {mode.badge}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Roles */}
      <section id="team" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">👥 完整團隊協作角色</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              6 大核心角色，AI 輔助完成大部分工作，團隊只需最後審核
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              {
                icon: '📋',
                title: '產品經理',
                description: '需求分析、優先級排序、進度追蹤',
                aiPercent: '80%',
              },
              {
                icon: '🏗️',
                title: '架構師',
                description: '系統設計、技術選型、效能優化',
                aiPercent: '85%',
              },
              {
                icon: '💻',
                title: '代碼工程師',
                description: '功能開發、Code Review、優化維護',
                aiPercent: '90%',
              },
              {
                icon: '🎨',
                title: '設計師',
                description: 'UI/UX 設計、原型製作、設計規範',
                aiPercent: '75%',
              },
              {
                icon: '📊',
                title: '專案經理',
                description: '資源調度、風險管理、客戶溝通',
                aiPercent: '70%',
              },
              {
                icon: '🧪',
                title: '測試工程師',
                description: '測試規劃、缺陷追蹤、品質把關',
                aiPercent: '95%',
              },
            ].map((role, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="text-4xl mb-4">{role.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{role.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{role.description}</p>
                <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                  ✨ AI 輔助 {role.aiPercent}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">🚀 輕鬆起步方案</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              選擇最適合團隊規模的計劃，支援全球多幣種支付
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Startup</h3>
              <p className="text-gray-500 mb-4">適合初創團隊 (5-15 人)</p>
              <p className="text-4xl font-bold text-gray-900 mb-2">$299<span className="text-lg font-normal text-gray-500">/ 月</span></p>
              <ul className="space-y-3 mb-8">
                {[
                  'Slack 風格協作頻道',
                  'AI 助手 (10,000 tokens/月)',
                  'GitHub 整合',
                  '自動化測試',
                  '雲端部署 (5 個環境)',
                  'Email 支援',
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center space-x-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/login"
                className="block w-full py-3 text-center border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                登錄
              </Link>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 shadow-lg text-white relative transform scale-105">
              <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                熱門推薦
              </div>
              <h3 className="text-xl font-semibold mb-2">Business</h3>
              <p className="text-purple-200 mb-4">適合成長企業 (15-50 人)</p>
              <p className="text-4xl font-bold mb-2">$799<span className="text-lg font-normal text-purple-200">/ 月</span></p>
              <ul className="space-y-3 mb-8">
                {[
                  '所有 Startup 功能',
                  'AI 助手 (無限制)',
                  'Upwork 人才庫接入',
                  'Research 平台',
                  '雲端部署 (20 個環境)',
                  '優先技術支援',
                  '專屬客戶經理',
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-yellow-300" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/login"
                className="block w-full py-3 text-center bg-white text-purple-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                立即開始
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Enterprise</h3>
              <p className="text-gray-500 mb-4">適合大型組織 (50+ 人)</p>
              <p className="text-4xl font-bold text-gray-900 mb-2">定制<span className="text-lg font-normal text-gray-500">/ 月</span></p>
              <ul className="space-y-3 mb-8">
                {[
                  '所有 Business 功能',
                  '自定義 AI 模型訓練',
                  '私有化部署選項',
                  'API 整合',
                  '無限部署環境',
                  '7/24 專屬支援',
                  '客製化功能開發',
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center space-x-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/login"
                className="block w-full py-3 text-center border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                聯絡銷售
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            準備好開始你的智能開發項目了嗎？
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            讓 AI 成為你的技術聯合創始人，告別繁瑣的團隊管理
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg shadow-purple-500/25"
            >
              <span>🚀 開始創建</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#features"
              className="flex items-center space-x-2 px-8 py-4 border border-gray-200 rounded-xl font-semibold text-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span>了解更多</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">CodeUtopia.ai</span>
              </div>
              <p className="text-sm">
                AI 驅動的企業級協作開發平台，Slack + Upwork + ChatGPT + GitHub + 測試部署，一站式搞定！
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">平台功能</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Slack 協作</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">人才匹配</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">AI 助手</a></li>
                <li><a href="#devmode" className="hover:text-white transition-colors">開發模式</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">團隊角色</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#team" className="hover:text-white transition-colors">產品經理</a></li>
                <li><a href="#team" className="hover:text-white transition-colors">架構師</a></li>
                <li><a href="#team" className="hover:text-white transition-colors">代碼工程師</a></li>
                <li><a href="#team" className="hover:text-white transition-colors">測試工程師</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">支援中心</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">使用說明</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API 文檔</a></li>
                <li><a href="#" className="hover:text-white transition-colors">聯繫我們</a></li>
                <li><a href="#" className="hover:text-white transition-colors">隱私政策</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm">© 2026 CodeUtopia.ai. All rights reserved. | AI-Driven Enterprise Collaboration Platform</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
