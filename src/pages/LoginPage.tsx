import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles, Mail, Lock, User, Building, Briefcase, Code2,
  Shield, Globe, ChevronRight, ArrowRight, Check, Eye, EyeOff,
  Smartphone, Globe2, Languages, MapPin
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// 多语言支持 (13 languages)
const TRANSLATIONS = {
  zh: { login: '登录', register: '注册', email: '邮箱地址', password: '密码', forgot: '忘记密码？' },
  en: { login: 'Login', register: 'Sign Up', email: 'Email', password: 'Password', forgot: 'Forgot password?' },
  tw: { login: '登入', register: '註冊', email: '郵箱地址', password: '密碼', forgot: '忘記密碼？' },
  hk: { login: '登入', register: '註冊', email: '郵箱地址', password: '密碼', forgot: '忘記密碼？' },
  ja: { login: 'ログイン', register: '新規登録', email: 'メールアドレス', password: 'パスワード', forgot: 'パスワードを忘れた？' },
  ko: { login: '로그인', register: '회원가입', email: '이메일', password: '비밀번호', forgot: '비밀번호 찾기' },
  de: { login: 'Anmelden', register: 'Registrieren', email: 'E-Mail', password: 'Passwort', forgot: 'Passwort vergessen?' },
  fr: { login: 'Connexion', register: 'S\'inscrire', email: 'E-mail', password: 'Mot de passe', forgot: 'Mot de passe oublié ?' },
  es: { login: 'Iniciar sesión', register: 'Registrarse', email: 'Correo', password: 'Contraseña', forgot: '¿Olvidó su contraseña?' },
  pt: { login: 'Entrar', register: 'Registrar', email: 'E-mail', password: 'Senha', forgot: 'Esqueceu a senha?' },
  ar: { login: 'تسجيل الدخول', register: 'التسجيل', email: 'البريد الإلكتروني', password: 'كلمة المرور', forgot: 'نسيت كلمة المرور؟' },
  hi: { login: 'लॉग इन करें', register: 'साइन अप करें', email: 'ईमेल', password: 'पासवर्ड', forgot: 'पासवर्ड भूल गए?' },
  id: { login: 'Masuk', register: 'Daftar', email: 'Email', password: 'Kata sandi', forgot: 'Lupa kata sandi?' }
};

// 14个区域定义
const REGIONS = [
  { id: 'APAC', name: '亞太區', name_en: 'Asia Pacific', flag: '🌏', countries: ['中國', '日本', '韓國', '印度', '東南亞', '澳洲'] },
  { id: 'EMEA', name: '歐洲中東非洲', name_en: 'Europe, Middle East & Africa', flag: '🌍', countries: ['西歐', '東歐', '中東', '非洲'] },
  { id: 'AMERS', name: '美洲區', name_en: 'Americas', flag: '🌎', countries: ['北美', '南美', '加勒比'] },
  { id: 'CHINA', name: '中國區', name_en: 'China', flag: '🇨🇳', countries: ['中國大陸', '香港', '澳門', '台灣'] },
  { id: 'NA', name: '北美區', name_en: 'North America', flag: '🇺🇸', countries: ['美國', '加拿大'] },
  { id: 'EU', name: '歐洲區', name_en: 'Europe', flag: '🇪🇺', countries: ['德國', '法國', '英國', '其他歐洲國家'] },
  { id: 'JP', name: '日本區', name_en: 'Japan', flag: '🇯🇵', countries: ['日本'] },
  { id: 'IN', name: '印度區', name_en: 'India', flag: '🇮🇳', countries: ['印度', '孟加拉', '斯里蘭卡'] },
  { id: 'SEA', name: '東南亞區', name_en: 'Southeast Asia', flag: '🌴', countries: ['新加坡', '馬來西亞', '泰國', '越南', '印尼', '菲賓'] },
  { id: 'LATAM', name: '拉丁美洲區', name_en: 'Latin America', flag: '💃', countries: ['巴西', '墨西哥', '阿根廷', '哥倫比亞', '智利'] },
  { id: 'ME', name: '中東區', name_en: 'Middle East', flag: '☀️', countries: ['阿聯酋', '沙特阿拉伯', '以色列', '土耳其'] },
  { id: 'OC', name: '大洋洲區', name_en: 'Oceania', flag: '🦘', countries: ['澳洲', '新西蘭', '太平洋島國'] },
  { id: 'AF', name: '非洲區', name_en: 'Africa', flag: '🦁', countries: ['南非', '尼日利亞', '埃及', '肯尼亞'] },
  { id: 'SA', name: '南亞區', name_en: 'South Asia', flag: '🏔️', countries: ['巴基斯坦', '孟加拉', '斯里蘭卡', '尼泊爾'] }
];

// 角色类型
type LoginUserRole = 'project_initiator' | 'contractor' | 'webadmin' | 'regional_manager';

// 角色定义
const ROLES: { id: LoginUserRole; name: string; name_en: string; icon: React.ComponentType<any>; description: string; description_en: string; color: string }[] = [
  {
    id: 'project_initiator',
    name: '项目主理人',
    name_en: 'Project Initiator',
    icon: Briefcase,
    description: '发布项目、对接人才、推进协作、核心决策',
    description_en: 'Launch projects, connect talent, facilitate collaboration, make key decisions',
    color: 'bg-blue-500',
  },
  {
    id: 'contractor',
    name: '接案者',
    name_en: 'Contractor',
    icon: Code2,
    description: '申请加入项目、承接任务交付、调度AI协助角色',
    description_en: 'Apply to join projects, deliver tasks, coordinate AI assistance roles',
    color: 'bg-green-500',
  },
  {
    id: 'webadmin',
    name: '全局管理员',
    name_en: 'Web Administrator',
    icon: Shield,
    description: '全量数据监控、规则配置、权限管理、最终裁定',
    description_en: 'Full data monitoring, rule configuration, permission management, final decisions',
    color: 'bg-red-500',
  },
  {
    id: 'regional_manager',
    name: '区域主理人',
    name_en: 'Regional Manager',
    icon: Globe,
    description: '区域内生态管控、AI协助调度备案、争议初步处理',
    description_en: 'Regional ecosystem control, AI scheduling records, dispute handling',
    color: 'bg-purple-500',
  },
];

// 测试账号（仅4个人类角色）
const TEST_ACCOUNTS = [
  { email: 'initiator@codeutopia.ai', password: 'demo123', role: 'project_initiator', roleName: '项目主理人', region: 'CHINA' },
  { email: 'contractor@codeutopia.ai', password: 'demo123', role: 'contractor', roleName: '接案者', region: 'APAC' },
  { email: 'webadmin@codeutopia.ai', password: 'demo123', role: 'webadmin', roleName: '全局管理员', region: 'GLOBAL' },
  { email: 'regional@codeutopia.ai', password: 'demo123', role: 'regional_manager', roleName: '区域主理人', region: 'APAC' },
];

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<LoginUserRole | null>(null);
  const [registerStep, setRegisterStep] = useState(1);
  const [language, setLanguage] = useState('zh');
  const [showTestAccounts, setShowTestAccounts] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.zh;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole) {
      login(selectedRole as any);
      navigate(`/dashboard/${selectedRole === 'project_initiator' ? 'initiator' : selectedRole === 'regional_manager' ? 'regional' : selectedRole}`);
    } else {
      login('client');
      navigate('/dashboard');
    }
  };

  const handleTestLogin = (account: typeof TEST_ACCOUNTS[0]) => {
    setSelectedRole(account.role as any);
    login(account.role as any);
    navigate(`/dashboard/${account.role === 'project_initiator' ? 'initiator' : account.role === 'regional_manager' ? 'regional' : account.role}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Language Selector */}
      <div className="fixed top-4 right-4 z-50">
        <div className="relative">
          <button
            onClick={() => setShowTestAccounts(!showTestAccounts)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800/80 backdrop-blur-sm rounded-xl text-white text-sm hover:bg-gray-700 transition-colors"
          >
            <Languages className="w-4 h-4" />
            <span>{language.toUpperCase()}</span>
          </button>
          {showTestAccounts && (
            <div className="absolute right-0 mt-2 w-80 bg-gray-800/95 backdrop-blur-xl rounded-xl p-4 shadow-2xl border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold">🌍 多语言 / Languages</h3>
                <button
                  onClick={() => setShowTestAccounts(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {Object.keys(TRANSLATIONS).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => { setLanguage(lang); setShowTestAccounts(false); }}
                    className={`py-1 px-2 rounded-lg text-xs font-medium transition-colors ${
                      language === lang
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
              <div className="border-t border-gray-700 pt-4">
                <h4 className="text-white font-semibold mb-3 flex items-center">
                  <Check className="w-4 h-4 text-green-400 mr-2" />
                  🧪 测试账号 / Test Accounts
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {TEST_ACCOUNTS.map((account, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleTestLogin(account)}
                      className="w-full p-2 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors text-left"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white text-sm font-medium">{account.email}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${account.role === 'webadmin' ? 'bg-red-500/20 text-red-400' : account.role === 'regional_manager' ? 'bg-purple-500/20 text-purple-400' : account.role === 'project_initiator' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                          {account.roleName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-400 text-xs">{REGIONS.find(r => r.id === account.region)?.name || account.region}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Left Side - Brand & Value Proposition */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-white">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold">CodeUtopia.ai</span>
          </div>

          {/* Value Proposition */}
          <h1 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight">
            Global Design House<br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              全球设计开发供应池
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            結合 AI 智能任務分解、多模型代碼生成、自動化測試驗證，<br />
            為企業提供可預測、高質量的軟件交付服務。
          </p>

          {/* Value Points */}
          <div className="space-y-4">
            {[
              '🤖 AI 协助角色：产品经理、UX设计师、前后端工程师、测试工程师',
              '🌍 14 区域覆盖：美、欧、印、日、东南亚等全球市场',
              '💰 透明结算：15%基础佣金 + 实际AI使用成本',
              '🛡️ 人类主导：核心决策由人类掌控，AI仅提供辅助',
            ].map((point, idx) => (
              <div key={idx} className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">{point}</span>
              </div>
            ))}
          </div>

          {/* Region Stats */}
          <div className="grid grid-cols-4 gap-4 mt-12 pt-8 border-t border-gray-700/50">
            {[
              { value: '50,000+', label: '全球开发者和设计师' },
              { value: '12,000+', label: '已完成项目' },
              { value: '14', label: '覆盖区域' },
              { value: '98.5%', label: '客户满意度' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login/Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">CodeUtopia.ai</span>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-gray-800/50 rounded-xl p-1 mb-6">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'login'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t.login}
            </button>
            <button
              onClick={() => { setActiveTab('register'); setRegisterStep(1); setSelectedRole(null); }}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'register'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t.register}
            </button>
          </div>

          {/* Role Selection (Register Only) */}
          {activeTab === 'register' && registerStep === 1 && (
            <div className="bg-gray-800/30 rounded-2xl p-6 mb-6">
              <h2 className="text-lg font-semibold text-white mb-4">选择您的角色</h2>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-4 rounded-xl border transition-all text-left ${
                      selectedRole === role.id
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-gray-700 hover:border-gray-600 bg-gray-800/30'
                    }`}
                  >
                    <div className={`w-10 h-10 ${role.color} rounded-lg flex items-center justify-center mb-3`}>
                      <role.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-white font-medium text-sm">{role.name}</div>
                    <div className="text-gray-400 text-xs mt-1">{role.description}</div>
                  </button>
                ))}
              </div>
              {selectedRole && (
                <button
                  onClick={() => setRegisterStep(2)}
                  className="w-full mt-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center space-x-2"
                >
                  <span>继续</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Quick Role Login (Demo) */}
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-3">快速登录（测试账号）</label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`p-2 rounded-lg border text-sm transition-all flex items-center space-x-2 ${
                        selectedRole === role.id
                          ? 'border-purple-500 bg-purple-500/20 text-white'
                          : 'border-gray-700 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      <role.icon className="w-4 h-4" />
                      <span>{role.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder={t.email}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t.password}
                  className="w-full pl-12 pr-12 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 text-gray-400">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500" />
                  <span>7天内自动登录</span>
                </label>
                <a href="#" className="text-purple-400 hover:text-purple-300">{t.forgot}</a>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg shadow-purple-500/25"
              >
                {t.login}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-gray-400">或使用第三方登录</span>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { icon: 'G', name: 'Google', color: 'bg-red-500' },
                  { icon: 'in', name: 'LinkedIn', color: 'bg-blue-500' },
                  { icon: 'GH', name: 'GitHub', color: 'bg-gray-700' },
                  { icon: 'A', name: 'Apple', color: 'bg-white' },
                ].map((social, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="py-3 bg-gray-800/50 border border-gray-700 rounded-xl hover:bg-gray-700 transition-colors flex items-center justify-center"
                  >
                    <span className={`w-5 h-5 rounded-full ${social.color} flex items-center justify-center text-xs font-bold ${
                      social.icon === 'A' ? 'text-black' : 'text-white'
                    }`}>
                      {social.icon === 'G' ? 'G' : social.icon === 'in' ? 'in' : social.icon === 'GH' ? 'GH' : 'A'}
                    </span>
                  </button>
                ))}
              </div>
            </form>
          )}

          {/* Register Form (Step 2) */}
          {activeTab === 'register' && registerStep === 2 && (
            <form onSubmit={(e) => { e.preventDefault(); setRegisterStep(3); }} className="space-y-5">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm text-gray-400 mb-2">姓名</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="您的姓名"
                      className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
                {selectedRole === 'project_initiator' && (
                  <div className="flex-1">
                    <label className="block text-sm text-gray-400 mb-2">企业名称（可选）</label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="公司名称"
                        className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">邮箱地址</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">选择服务区域</label>
                <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                  {REGIONS.map((region) => (
                    <button
                      key={region.id}
                      type="button"
                      className="py-1.5 px-2 bg-gray-800/50 border border-gray-700 rounded-lg text-xs text-gray-300 hover:border-purple-500 hover:text-white transition-colors"
                    >
                      {region.flag} {region.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-start space-x-3 text-sm text-gray-400">
                  <input type="checkbox" className="w-4 h-4 mt-0.5 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500" />
                  <span>
                    我已阅读并同意
                    <a href="#" className="text-purple-400 hover:text-purple-300">《服务条款》</a>
                    和
                    <a href="#" className="text-purple-400 hover:text-purple-300">《隐私政策》</a>
                    ，明确AI角色为辅助工具，核心决策由人类掌控
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center space-x-2"
              >
                <span>下一步</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Register Form (Step 3) */}
          {activeTab === 'register' && registerStep === 3 && (
            <form onSubmit={handleLogin} className="space-y-5">
              {selectedRole === 'contractor' && (
                <>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">技能标签</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'React', 'Vue.js', 'Node.js', 'Python', 'TypeScript',
                        'AI/ML', 'UI/UX', 'DevOps', '区块链', '硬件开发'
                      ].map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-300 hover:border-purple-500 hover:text-white transition-colors"
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="pt-4 flex space-x-4">
                <button
                  type="button"
                  onClick={() => setRegisterStep(2)}
                  className="flex-1 py-3 border border-gray-700 text-gray-400 rounded-xl font-medium hover:border-gray-600 hover:text-white transition-colors"
                >
                  上一步
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg shadow-purple-500/25"
                >
                  完成注册
                </button>
              </div>
            </form>
          )}

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-400">
            <p>登录即表示您同意我们的服务条款和隐私政策</p>
            <p className="mt-2">
              <span className="text-purple-400">AI协助角色为辅助工具</span>，核心决策由人类掌控
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
