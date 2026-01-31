import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles,
  Mail,
  Lock,
  User,
  Building,
  Briefcase,
  Code2,
  Shield,
  Globe,
  ChevronRight,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Languages,
  MapPin,
  Users,
  Zap,
  Award,
  TrendingUp,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { TEST_ACCOUNTS } from '../services/mockData'

// 多语言支持 (13 languages)
const TRANSLATIONS = {
  zh: {
    login: '登录',
    register: '注册',
    email: '邮箱地址',
    password: '密码',
    forgot: '忘记密码？',
    rememberMe: '7天内自动登录',
    or: '或使用第三方登录',
  },
  en: {
    login: 'Login',
    register: 'Sign Up',
    email: 'Email',
    password: 'Password',
    forgot: 'Forgot password?',
    rememberMe: 'Remember me for 7 days',
    or: 'or continue with',
  },
  tw: {
    login: '登入',
    register: '註冊',
    email: '郵箱地址',
    password: '密碼',
    forgot: '忘記密碼？',
    rememberMe: '7天內自動登入',
    or: '或使用第三方登入',
  },
  hk: {
    login: '登入',
    register: '註冊',
    email: '郵箱地址',
    password: '密碼',
    forgot: '忘記密碼？',
    rememberMe: '7天內自動登入',
    or: '或使用第三方登入',
  },
  ja: {
    login: 'ログイン',
    register: '新規登録',
    email: 'メールアドレス',
    password: 'パスワード',
    forgot: 'パスワードを忘れた？',
    rememberMe: '7日間ログインを維持',
    or: 'または',
  },
  ko: {
    login: '로그인',
    register: '회원가입',
    email: '이메일',
    password: '비밀번호',
    forgot: '비밀번호 찾기',
    rememberMe: '7일간 로그인 유지',
    or: '또는',
  },
  de: {
    login: 'Anmelden',
    register: 'Registrieren',
    email: 'E-Mail',
    password: 'Passwort',
    forgot: 'Passwort vergessen?',
    rememberMe: '7 Tage angemeldet bleiben',
    or: 'oder',
  },
  fr: {
    login: 'Connexion',
    register: "S'inscrire",
    email: 'E-mail',
    password: 'Mot de passe',
    forgot: 'Mot de passe oublié ?',
    rememberMe: 'Rester connecté 7 jours',
    or: 'ou',
  },
  es: {
    login: 'Iniciar sesión',
    register: 'Registrarse',
    email: 'Correo',
    password: 'Contraseña',
    forgot: '¿Olvidó su contraseña?',
    rememberMe: 'Recordarme 7 días',
    or: 'o',
  },
  pt: {
    login: 'Entrar',
    register: 'Registrar',
    email: 'E-mail',
    password: 'Senha',
    forgot: 'Esqueceu a senha?',
    rememberMe: 'Lembrar por 7 dias',
    or: 'ou',
  },
  ar: {
    login: 'تسجيل الدخول',
    register: 'التسجيل',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    forgot: 'نسيت كلمة المرور؟',
    rememberMe: 'تذكرني لمدة 7 أيام',
    or: 'أو',
  },
  hi: {
    login: 'लॉग इन करें',
    register: 'साइन अप करें',
    email: 'ईमेल',
    password: 'पासवर्ड',
    forgot: 'पासवर्ड भूल गए?',
    rememberMe: '7 दिनों के लिए याद रखें',
    or: 'या',
  },
  id: {
    login: 'Masuk',
    register: 'Daftar',
    email: 'Email',
    password: 'Kata sandi',
    forgot: 'Lupa kata sandi?',
    rememberMe: 'Ingat saya 7 hari',
    or: 'atau',
  },
}

// 14个区域定义
const REGIONS = [
  {
    id: 'APAC',
    name: '亞太區',
    name_en: 'Asia Pacific',
    countries: ['中國', '日本', '韓國', '印度', '東南亞', '澳洲'],
  },
  {
    id: 'EMEA',
    name: '歐洲中東非洲',
    name_en: 'Europe, Middle East & Africa',
    countries: ['西歐', '東歐', '中東', '非洲'],
  },
  { id: 'AMERS', name: '美洲區', name_en: 'Americas', countries: ['北美', '南美', '加勒比'] },
  { id: 'CHINA', name: '中國區', name_en: 'China', countries: ['中國大陸', '香港', '澳門', '台灣'] },
  { id: 'NA', name: '北美區', name_en: 'North America', countries: ['美國', '加拿大'] },
  { id: 'EU', name: '歐洲區', name_en: 'Europe', countries: ['德國', '法國', '英國', '其他歐洲國家'] },
  { id: 'JP', name: '日本區', name_en: 'Japan', countries: ['日本'] },
  { id: 'IN', name: '印度區', name_en: 'India', countries: ['印度', '孟加拉', '斯里蘭卡'] },
  {
    id: 'SEA',
    name: '東南亞區',
    name_en: 'Southeast Asia',
    countries: ['新加坡', '馬來西亞', '泰國', '越南', '印尼', '菲賓'],
  },
  {
    id: 'LATAM',
    name: '拉丁美洲區',
    name_en: 'Latin America',
    countries: ['巴西', '墨西哥', '阿根廷', '哥倫比亞', '智利'],
  },
  { id: 'ME', name: '中東區', name_en: 'Middle East', countries: ['阿聯酋', '沙特阿拉伯', '以色列', '土耳其'] },
  { id: 'OC', name: '大洋洲區', name_en: 'Oceania', countries: ['澳洲', '新西蘭', '太平洋島國'] },
  { id: 'AF', name: '非洲區', name_en: 'Africa', countries: ['南非', '尼日利亞', '埃及', '肯尼亞'] },
  { id: 'SA', name: '南亞區', name_en: 'South Asia', countries: ['巴基斯坦', '孟加拉', '斯里蘭卡', '尼泊爾'] },
]

// 角色类型
type LoginUserRole = 'project_initiator' | 'contractor' | 'webadmin' | 'regional_manager'

// 角色定义 - 简化的专业设计
const ROLES: {
  id: LoginUserRole
  name: string
  name_en: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  description: string
}[] = [
  {
    id: 'project_initiator',
    name: '项目主理人',
    name_en: 'Initiator',
    icon: Briefcase,
    description: '发布项目、对接人才',
  },
  {
    id: 'contractor',
    name: '接案者',
    name_en: 'Contractor',
    icon: Code2,
    description: '承接任务、交付成果',
  },
  {
    id: 'webadmin',
    name: '全局管理员',
    name_en: 'Admin',
    icon: Shield,
    description: '平台监控与管理',
  },
  {
    id: 'regional_manager',
    name: '区域主理人',
    name_en: 'Regional',
    icon: Globe,
    description: '区域生态管控',
  },
]

// OAuth 提供商配置 - 使用官方品牌色
const OAUTH_PROVIDERS = [
  { id: 'google', name: 'Google', bgColor: 'bg-white', textColor: 'text-gray-700', hoverBg: 'hover:bg-gray-100' },
  { id: 'linkedin', name: 'LinkedIn', bgColor: 'bg-[#0A66C2]', textColor: 'text-white', hoverBg: 'hover:bg-[#004182]' },
  { id: 'github', name: 'GitHub', bgColor: 'bg-slate-700', textColor: 'text-white', hoverBg: 'hover:bg-slate-600' },
  { id: 'apple', name: 'Apple', bgColor: 'bg-white', textColor: 'text-black', hoverBg: 'hover:bg-gray-100' },
]

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<LoginUserRole | null>(null)
  const [registerStep, setRegisterStep] = useState(1)
  const [language, setLanguage] = useState('zh')
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.zh

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')

    if (!email.trim()) {
      setLoginError('请输入邮箱地址')
      return
    }
    if (!password.trim()) {
      setLoginError('请输入密码')
      return
    }

    setIsLoggingIn(true)
    try {
      const success = await login(email, password)

      if (success) {
        const account = TEST_ACCOUNTS.find((a) => a.email.toLowerCase() === email.toLowerCase())
        const role = account?.role || 'project_initiator'
        navigate(
          `/dashboard/${role === 'project_initiator' ? 'initiator' : role === 'regional_manager' ? 'regional' : role}`,
        )
      } else {
        setLoginError('邮箱或密码错误')
      }
    } catch (error) {
      setLoginError('登录失败，请稍后重试')
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleQuickLogin = (account: (typeof TEST_ACCOUNTS)[0]) => {
    setEmail(account.email)
    setPassword(account.password)
    setSelectedRole(account.role as LoginUserRole)
    setLoginError('')
  }

  // SVG Icons for OAuth
  const GoogleIcon = () => (
    <svg className='w-5 h-5' viewBox='0 0 24 24'>
      <path
        fill='#4285F4'
        d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
      />
      <path
        fill='#34A853'
        d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
      />
      <path
        fill='#FBBC05'
        d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
      />
      <path
        fill='#EA4335'
        d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
      />
    </svg>
  )

  const LinkedInIcon = () => (
    <svg className='w-5 h-5' fill='#ffffff' viewBox='0 0 24 24'>
      <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
    </svg>
  )

  const GitHubIcon = () => (
    <svg className='w-5 h-5' fill='#ffffff' viewBox='0 0 24 24'>
      <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
    </svg>
  )

  const AppleIcon = () => (
    <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
      <path d='M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z' />
    </svg>
  )

  const oauthIcons: Record<string, React.FC> = {
    google: GoogleIcon,
    linkedin: LinkedInIcon,
    github: GitHubIcon,
    apple: AppleIcon,
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex'>
      {/* Language Selector - 简化设计 */}
      <div className='fixed top-4 right-4 z-50'>
        <button
          onClick={() => setShowLangMenu(!showLangMenu)}
          className='flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white/80 text-sm hover:bg-white/20 transition-all duration-200 cursor-pointer'>
          <Languages className='w-4 h-4' />
          <span className='font-medium'>{language.toUpperCase()}</span>
        </button>
        {showLangMenu && (
          <div className='absolute right-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-xl rounded-xl p-2 shadow-2xl border border-white/10'>
            <div className='grid grid-cols-3 gap-1'>
              {Object.keys(TRANSLATIONS).map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setLanguage(lang)
                    setShowLangMenu(false)
                  }}
                  className={`py-2 px-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                    language === lang ? 'bg-blue-600 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}>
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Left Side - 简洁品牌展示 */}
      <div className='hidden lg:flex lg:w-1/2 relative overflow-hidden'>
        {/* 优雅渐变背景 */}
        <div className='absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-purple-600/20' />
        <div className='absolute inset-0'>
          <div className='absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px]' />
          <div className='absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-indigo-500/15 rounded-full blur-[100px]' />
        </div>

        <div className='relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white w-full'>
          {/* Logo */}
          <div className='flex items-center gap-3 mb-12'>
            <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25'>
              <Sparkles className='w-7 h-7 text-white' />
            </div>
            <span className='text-2xl font-bold tracking-tight'>CodeUtopia.ai</span>
          </div>

          {/* 核心价值主张 */}
          <h1 className='text-4xl xl:text-5xl font-bold mb-4 leading-tight tracking-tight'>Global Design House</h1>
          <h2 className='text-2xl xl:text-3xl font-semibold mb-6 text-blue-300'>全球设计开发供应池</h2>

          <p className='text-lg text-white/70 mb-10 leading-relaxed max-w-lg'>
            結合 AI 智能任務分解、多模型代碼生成、自動化測試驗證，為企業提供可預測、高質量的軟件交付服務。
          </p>

          {/* 信任指标 - 简洁卡片 */}
          <div className='grid grid-cols-2 gap-4 mb-10'>
            {[
              { icon: Users, value: '50,000+', label: '全球开发者' },
              { icon: Award, value: '12,000+', label: '已完成项目' },
              { icon: Globe, value: '14', label: '覆盖区域' },
              { icon: TrendingUp, value: '98.5%', label: '客户满意度' },
            ].map((stat, idx) => (
              <div
                key={idx}
                className='flex items-center gap-3 p-3 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10'>
                <div className='w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center'>
                  <stat.icon className='w-5 h-5 text-blue-400' />
                </div>
                <div>
                  <div className='text-xl font-bold text-white'>{stat.value}</div>
                  <div className='text-sm text-white/50'>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 价值亮点 */}
          <div className='space-y-3'>
            {[
              { icon: Zap, text: 'AI 协助角色：产品经理、UX设计师、前后端工程师' },
              { icon: Shield, text: '人类主导：核心决策由人类掌控，AI仅提供辅助' },
            ].map((point, idx) => (
              <div key={idx} className='flex items-center gap-3 text-white/60'>
                <point.icon className='w-4 h-4 text-blue-400 flex-shrink-0' />
                <span className='text-sm'>{point.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - 登录表单 */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-8'>
        <div className='w-full max-w-[420px]'>
          {/* Mobile Logo */}
          <div className='lg:hidden flex items-center justify-center gap-3 mb-8'>
            <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center'>
              <Sparkles className='w-6 h-6 text-white' />
            </div>
            <span className='text-xl font-bold text-white'>CodeUtopia.ai</span>
          </div>

          {/* 登录卡片 - Glassmorphism */}
          <div className='bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-6 lg:p-8 shadow-2xl'>
            {/* Tab Switcher */}
            <div className='flex bg-slate-800/50 rounded-xl p-1 mb-6'>
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-white/60 hover:text-white'
                }`}>
                {t.login}
              </button>
              <button
                onClick={() => {
                  setActiveTab('register')
                  setRegisterStep(1)
                  setSelectedRole(null)
                }}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'register'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-white/60 hover:text-white'
                }`}>
                {t.register}
              </button>
            </div>

            {/* Login Form */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className='space-y-5'>
                {/* 快速登录 - 简洁2x2网格 */}
                <div>
                  <label className='block text-sm text-white/90 mb-3 font-medium'>快速登录（测试账号）</label>
                  <div className='grid grid-cols-2 gap-2'>
                    {ROLES.map((role) => {
                      const account = TEST_ACCOUNTS.find((a) => a.role === role.id)
                      const isSelected = selectedRole === role.id
                      return (
                        <button
                          key={role.id}
                          type='button'
                          onClick={() => account && handleQuickLogin(account)}
                          className={`group p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? 'border-blue-500 bg-blue-500/10'
                              : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                          }`}>
                          <div className='flex items-center gap-2 mb-1'>
                            <role.icon
                              className={`w-4 h-4 ${isSelected ? 'text-blue-400' : 'text-white/80 group-hover:text-white'}`}
                            />
                            <span
                              className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-white group-hover:text-white'}`}>
                              {role.name}
                            </span>
                          </div>
                          <p className='text-xs text-white/70 pl-6'>{role.description}</p>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Email Input */}
                <div className='relative'>
                  <Mail className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60' />
                  <input
                    type='email'
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setLoginError('')
                    }}
                    placeholder={t.email}
                    className={`w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 ${
                      loginError && !email ? 'border-red-500/50' : 'border-white/10 focus:border-blue-500/50'
                    }`}
                  />
                </div>

                {/* Password Input */}
                <div className='relative'>
                  <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60' />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setLoginError('')
                    }}
                    placeholder={t.password}
                    className={`w-full pl-12 pr-12 py-3.5 bg-slate-800/50 border rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 ${
                      loginError && !password ? 'border-red-500/50' : 'border-white/10 focus:border-blue-500/50'
                    }`}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors cursor-pointer'>
                    {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                  </button>
                </div>

                {/* Remember & Forgot */}
                <div className='flex items-center justify-between'>
                  <label className='flex items-center gap-2 text-white/80 cursor-pointer group'>
                    <input
                      type='checkbox'
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className='w-4 h-4 rounded border-white/20 bg-slate-800 text-blue-500 focus:ring-blue-500/50 cursor-pointer'
                    />
                    <span className='text-sm group-hover:text-white transition-colors'>{t.rememberMe}</span>
                  </label>
                  <a href='#' className='text-sm text-blue-400 hover:text-blue-300 transition-colors'>
                    {t.forgot}
                  </a>
                </div>

                {/* Error Message */}
                {loginError && (
                  <div className='p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center'>
                    {loginError}
                  </div>
                )}

                {/* Login Button */}
                <button
                  type='submit'
                  className='w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all duration-200 shadow-lg shadow-blue-500/25 cursor-pointer'>
                  {t.login}
                </button>

                {/* Divider */}
                <div className='relative my-6'>
                  <div className='absolute inset-0 flex items-center'>
                    <div className='w-full border-t border-white/10' />
                  </div>
                  <div className='relative flex justify-center'>
                    <span className='px-4 bg-transparent text-white/40 text-sm'>{t.or}</span>
                  </div>
                </div>

                {/* OAuth Buttons - 官方品牌设计 */}
                <div className='grid grid-cols-4 gap-3'>
                  {OAUTH_PROVIDERS.map((provider) => {
                    const Icon = oauthIcons[provider.id]
                    return (
                      <button
                        key={provider.id}
                        type='button'
                        className={`py-3 ${provider.bgColor} border border-white/10 rounded-xl ${provider.hoverBg} transition-all duration-200 flex items-center justify-center cursor-pointer shadow-sm`}>
                        <Icon />
                      </button>
                    )
                  })}
                </div>
              </form>
            )}

            {/* Register Form - Step 1: Role Selection */}
            {activeTab === 'register' && registerStep === 1 && (
              <div className='space-y-5'>
                <h2 className='text-lg font-semibold text-white mb-4'>选择您的角色</h2>
                <div className='grid grid-cols-2 gap-3'>
                  {ROLES.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`p-4 rounded-xl border transition-all duration-200 text-left cursor-pointer ${
                        selectedRole === role.id
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                      }`}>
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                          selectedRole === role.id ? 'bg-blue-500/20' : 'bg-white/5'
                        }`}>
                        <role.icon
                          className={`w-5 h-5 ${selectedRole === role.id ? 'text-blue-400' : 'text-white/50'}`}
                        />
                      </div>
                      <div
                        className={`font-medium text-sm ${selectedRole === role.id ? 'text-white' : 'text-white/70'}`}>
                        {role.name}
                      </div>
                      <div className='text-white/40 text-xs mt-1'>{role.description}</div>
                    </button>
                  ))}
                </div>
                {selectedRole && (
                  <button
                    onClick={() => setRegisterStep(2)}
                    className='w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer'>
                    <span>继续</span>
                    <ChevronRight className='w-4 h-4' />
                  </button>
                )}
              </div>
            )}

            {/* Register Form - Step 2: Basic Info */}
            {activeTab === 'register' && registerStep === 2 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setRegisterStep(3)
                }}
                className='space-y-5'>
                <div className='flex gap-4'>
                  <div className='flex-1'>
                    <label className='block text-sm text-white/50 mb-2'>姓名</label>
                    <div className='relative'>
                      <User className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40' />
                      <input
                        type='text'
                        placeholder='您的姓名'
                        className='w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200'
                      />
                    </div>
                  </div>
                  {selectedRole === 'project_initiator' && (
                    <div className='flex-1'>
                      <label className='block text-sm text-white/50 mb-2'>企业名称（可选）</label>
                      <div className='relative'>
                        <Building className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40' />
                        <input
                          type='text'
                          placeholder='公司名称'
                          className='w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200'
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className='block text-sm text-white/50 mb-2'>邮箱地址</label>
                  <div className='relative'>
                    <Mail className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40' />
                    <input
                      type='email'
                      placeholder='your@email.com'
                      className='w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm text-white/50 mb-2'>选择服务区域</label>
                  <div className='grid grid-cols-3 gap-2 max-h-28 overflow-y-auto pr-1'>
                    {REGIONS.slice(0, 9).map((region) => (
                      <button
                        key={region.id}
                        type='button'
                        className='py-2 px-2 bg-slate-800/50 border border-white/10 rounded-lg text-xs text-white/60 hover:border-blue-500/50 hover:text-white transition-all duration-200 cursor-pointer'>
                        {region.name}
                      </button>
                    ))}
                  </div>
                </div>

                <label className='flex items-start gap-3 text-sm text-white/50 cursor-pointer'>
                  <input
                    type='checkbox'
                    className='w-4 h-4 mt-0.5 rounded border-white/20 bg-slate-800 text-blue-500 focus:ring-blue-500/50 cursor-pointer'
                  />
                  <span className='leading-relaxed'>
                    我已阅读并同意
                    <a href='#' className='text-blue-400 hover:text-blue-300 mx-1'>
                      《服务条款》
                    </a>
                    和
                    <a href='#' className='text-blue-400 hover:text-blue-300 mx-1'>
                      《隐私政策》
                    </a>
                  </span>
                </label>

                <button
                  type='submit'
                  className='w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer'>
                  <span>下一步</span>
                  <ArrowRight className='w-4 h-4' />
                </button>
              </form>
            )}

            {/* Register Form - Step 3: Skills/Preferences */}
            {activeTab === 'register' && registerStep === 3 && (
              <form onSubmit={handleLogin} className='space-y-5'>
                {selectedRole === 'contractor' && (
                  <div>
                    <label className='block text-sm text-white/50 mb-3'>技能标签</label>
                    <div className='flex flex-wrap gap-2'>
                      {['React', 'Vue.js', 'Node.js', 'Python', 'TypeScript', 'AI/ML', 'UI/UX', 'DevOps'].map(
                        (skill) => (
                          <button
                            key={skill}
                            type='button'
                            className='px-3 py-1.5 bg-slate-800/50 border border-white/10 rounded-lg text-sm text-white/60 hover:border-blue-500/50 hover:text-white transition-all duration-200 cursor-pointer'>
                            {skill}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                )}

                <div className='flex gap-4 pt-2'>
                  <button
                    type='button'
                    onClick={() => setRegisterStep(2)}
                    className='flex-1 py-3 border border-white/10 text-white/60 rounded-xl font-medium hover:border-white/20 hover:text-white transition-all duration-200 cursor-pointer'>
                    上一步
                  </button>
                  <button
                    type='submit'
                    className='flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all duration-200 cursor-pointer'>
                    完成注册
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className='mt-6 text-center text-sm text-white/40'>
            <p>登录即表示您同意我们的服务条款和隐私政策</p>
            <p className='mt-2'>
              <span className='text-blue-400'>AI协助角色为辅助工具</span>
              <span className='mx-1'>·</span>
              核心决策由人类掌控
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
