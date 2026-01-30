import { Link } from 'react-router-dom'
import { Home, Search, ArrowLeft, HelpCircle, Sparkles } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center px-4'>
      <div className='max-w-lg w-full text-center'>
        {/* 404 Animation */}
        <div className='relative mb-8'>
          <div className='text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 leading-none select-none'>
            404
          </div>
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='w-24 h-24 bg-purple-500/20 rounded-full animate-ping' />
          </div>
          <div className='absolute inset-0 flex items-center justify-center'>
            <Sparkles className='w-16 h-16 text-purple-400 animate-pulse' />
          </div>
        </div>

        {/* Message */}
        <h1 className='text-3xl font-bold text-white mb-4'>页面未找到</h1>
        <p className='text-gray-400 mb-8 text-lg'>
          抱歉，您访问的页面不存在或已被移除。
          <br />
          请检查 URL 是否正确，或返回首页。
        </p>

        {/* Actions */}
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Link
            to='/'
            className='inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity'>
            <Home className='w-5 h-5' />
            返回首页
          </Link>
          <button
            onClick={() => window.history.back()}
            className='inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors border border-white/20'>
            <ArrowLeft className='w-5 h-5' />
            返回上页
          </button>
        </div>

        {/* Help Links */}
        <div className='mt-12 pt-8 border-t border-white/10'>
          <p className='text-gray-500 text-sm mb-4'>或者尝试以下链接：</p>
          <div className='flex flex-wrap justify-center gap-4'>
            <Link to='/projects' className='text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1'>
              <Search className='w-4 h-4' />
              浏览项目
            </Link>
            <Link to='/post-project' className='text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1'>
              <Sparkles className='w-4 h-4' />
              发布项目
            </Link>
            <Link to='/login' className='text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1'>
              <HelpCircle className='w-4 h-4' />
              登录账号
            </Link>
          </div>
        </div>

        {/* Cortex AI Hint */}
        <div className='mt-8 p-4 bg-white/5 rounded-xl border border-white/10'>
          <p className='text-gray-400 text-sm'>
            💡 <span className='text-purple-400'>提示</span>：点击右下角的 AI 助手按钮，Cortex 可以帮助您导航。
          </p>
        </div>
      </div>
    </div>
  )
}
