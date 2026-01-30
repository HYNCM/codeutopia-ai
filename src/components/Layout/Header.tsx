import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { NotificationDropdown } from './NotificationDropdown'
import { Search, User, LogOut, Settings, ChevronDown, Sparkles, Plus, HelpCircle, Sun, Moon } from 'lucide-react'

export function Header() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  return (
    <header className='bg-[var(--bg-card)] border-b border-[var(--border-color)] sticky top-0 z-50 transition-colors duration-150'>
      <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <Link to='/' className='flex items-center space-x-2 cursor-pointer'>
            <div className='w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20'>
              <Sparkles className='w-6 h-6 text-white' />
            </div>
            <span className='text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent'>
              CodeUtopia.ai
            </span>
          </Link>

          {/* Center: Search Bar */}
          <div className='hidden md:flex flex-1 max-w-xl mx-8'>
            <div className='relative w-full'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]' />
              <input
                type='text'
                placeholder='搜索項目、人才、文檔...'
                className='w-full pl-10 pr-4 py-2.5 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:bg-[var(--bg-card-hover)] transition-all duration-200'
              />
              <kbd className='absolute right-3 top-1/2 transform -translate-y-1/2 hidden sm:inline-flex px-2 py-0.5 text-xs font-medium text-[var(--text-muted)] bg-[var(--bg-card-hover)] border border-[var(--border-subtle)] rounded'>
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Right Side: Actions */}
          <div className='flex items-center space-x-2'>
            {/* Quick Action Button */}
            <Link
              to='/post-project'
              className='hidden sm:inline-flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg shadow-green-500/20 cursor-pointer'>
              <Plus className='w-4 h-4' />
              <span>發布項目</span>
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className='p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] rounded-xl transition-all duration-200 cursor-pointer'
              title={theme === 'dark' ? '切換到淺色模式' : '切換到深色模式'}>
              {theme === 'dark' ? <Sun className='w-5 h-5' /> : <Moon className='w-5 h-5' />}
            </button>

            {/* Help */}
            <button className='p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] rounded-xl transition-all duration-200 cursor-pointer'>
              <HelpCircle className='w-5 h-5' />
            </button>

            {/* Notifications */}
            <NotificationDropdown />

            {/* User Menu */}
            <div className='relative'>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className='flex items-center space-x-2 p-1.5 rounded-xl hover:bg-[var(--bg-card-hover)] transition-all duration-200 cursor-pointer'>
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className='w-8 h-8 rounded-full ring-2 ring-[var(--border-subtle)]'
                />
                <span className='hidden lg:block text-sm font-medium text-[var(--text-secondary)]'>{user?.name}</span>
                <ChevronDown className='w-4 h-4 text-[var(--text-muted)]' />
              </button>
              {userMenuOpen && (
                <>
                  <div className='fixed inset-0 z-40' onClick={() => setUserMenuOpen(false)} />
                  <div className='absolute right-0 mt-2 w-56 bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border-color)] rounded-xl shadow-xl py-2 z-50'>
                    <div className='px-4 py-3 border-b border-[var(--border-color)]'>
                      <p className='font-medium text-[var(--text-primary)]'>{user?.name}</p>
                      <p className='text-sm text-[var(--text-muted)]'>{user?.email}</p>
                      <span className='inline-block mt-2 px-2 py-0.5 text-xs font-medium bg-purple-500/20 text-[var(--accent-purple)] border border-purple-500/30 rounded-full'>
                        {user?.role === 'developer' ? '開發者' : '客戶'}
                      </span>
                    </div>
                    <Link
                      to='/profile'
                      onClick={() => setUserMenuOpen(false)}
                      className='flex items-center space-x-2 px-4 py-2.5 text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer'>
                      <User className='w-4 h-4' />
                      <span>我的檔案</span>
                    </Link>
                    <Link
                      to='/settings'
                      onClick={() => setUserMenuOpen(false)}
                      className='flex items-center space-x-2 px-4 py-2.5 text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer'>
                      <Settings className='w-4 h-4' />
                      <span>設置</span>
                    </Link>
                    <hr className='my-2 border-[var(--border-color)]' />
                    <button
                      onClick={() => console.log('Logout')}
                      className='flex items-center space-x-2 px-4 py-2.5 text-red-500 hover:bg-red-500/10 w-full transition-colors cursor-pointer'>
                      <LogOut className='w-4 h-4' />
                      <span>退出登錄</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
