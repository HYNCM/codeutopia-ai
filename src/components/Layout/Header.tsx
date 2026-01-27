import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Menu,
  X,
  Bell,
  Search,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Briefcase,
  LayoutDashboard,
  Users,
  CreditCard,
  MessageSquare,
  FileText,
  BarChart3,
  Sparkles,
} from 'lucide-react';

const clientNavItems = [
  { icon: LayoutDashboard, label: '工作台', path: '/dashboard' },
  { icon: Briefcase, label: '項目', path: '/projects' },
  { icon: Users, label: '人才庫', path: '/talent' },
  { icon: MessageSquare, label: '消息', path: '/messages', badge: 3 },
  { icon: CreditCard, label: '財務', path: '/transactions' },
  { icon: FileText, label: '合同', path: '/contracts' },
  { icon: BarChart3, label: '報告', path: '/reports' },
];

const developerNavItems = [
  { icon: LayoutDashboard, label: '工作台', path: '/dashboard' },
  { icon: Briefcase, label: '項目廣場', path: '/projects' },
  { icon: FileText, label: '我的項目', path: '/my-projects' },
  { icon: MessageSquare, label: '消息', path: '/messages', badge: 5 },
  { icon: CreditCard, label: '收益', path: '/earnings' },
  { icon: User, label: '檔案', path: '/profile' },
  { icon: BarChart3, label: '分析', path: '/analytics' },
];

export function Header() {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const navItems = user?.role === 'developer' ? developerNavItems : clientNavItems;
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              CodeUtopia.ai
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-purple-50 text-purple-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索項目、人才..."
                  className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">通知</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <NotificationItem
                      title="新投標通知"
                      message="有3位開發者對您的項目提交了投標"
                      time="2小時前"
                      unread
                    />
                    <NotificationItem
                      title="里程碑已通過"
                      message="您的項目第一階段已通過審核"
                      time="1天前"
                      unread
                    />
                    <NotificationItem
                      title="款項已發放"
                      message="第二筆款項 NT$30,000 已發放"
                      time="3天前"
                    />
                  </div>
                  <Link
                    to="/notifications"
                    className="block px-4 py-2 text-center text-sm text-purple-600 hover:bg-gray-50"
                  >
                    查看全部通知
                  </Link>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {user?.name}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-medium text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <User className="w-4 h-4" />
                    <span>我的檔案</span>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <Settings className="w-4 h-4" />
                    <span>設置</span>
                  </Link>
                  <hr className="my-2" />
                  <button
                    onClick={() => console.log('Logout')}
                    className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>退出登錄</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium ${
                  isActive(item.path)
                    ? 'bg-purple-50 text-purple-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

function NotificationItem({
  title,
  message,
  time,
  unread = false,
}: {
  title: string;
  message: string;
  time: string;
  unread?: boolean;
}) {
  return (
    <div className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${unread ? 'bg-purple-50/50' : ''}`}>
      <div className="flex items-start space-x-3">
        {unread && (
          <span className="w-2 h-2 mt-2 bg-purple-600 rounded-full flex-shrink-0"></span>
        )}
        <div className={unread ? '' : 'ml-5'}>
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-500 mt-0.5">{message}</p>
          <p className="text-xs text-gray-400 mt-1">{time}</p>
        </div>
      </div>
    </div>
  );
}
