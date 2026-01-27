import React, { useState } from 'react';
import {
  Globe, Users, Briefcase, Search, Filter, Star, Clock, DollarSign,
  MapPin, Languages, Award, TrendingUp, CheckCircle, ChevronRight,
  Building2, Zap, Heart, MessageSquare, Calendar, FileText,
  ArrowUpRight, ArrowDownRight, ExternalLink, User, Briefcase as WorkIcon
} from 'lucide-react';

// Supply pool talent types
interface TalentProfile {
  id: string;
  name: string;
  avatar: string;
  title: string;
  skills: string[];
  rating: number;
  completedProjects: number;
  hourlyRate: number;
  currency: string;
  region: string;
  languages: string[];
  availability: 'available' | 'busy' | 'unavailable';
  bio: string;
  certifications: string[];
  projectTypes: string[];
  responseTime: string;
  aiCollaborationLevel: 'basic' | 'intermediate' | 'advanced';
}

interface ProjectRequirement {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  budget: number;
  currency: string;
  duration: string;
  region: string;
  urgency: 'low' | 'medium' | 'high';
  postedAt: string;
  aiAssistRequired: boolean;
}

const SupplyPoolPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'talent' | 'projects' | 'matching' | 'collaboration'>('talent');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Sample talent data
  const talents: TalentProfile[] = [
    {
      id: 'T001',
      name: '张明',
      avatar: '',
      title: '高级全栈工程师',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL'],
      rating: 4.9,
      completedProjects: 87,
      hourlyRate: 85,
      currency: 'USD',
      region: 'APAC',
      languages: ['中文', '英语', '日语'],
      availability: 'available',
      bio: '10年全栈开发经验，专注于复杂Web应用和微服务架构。',
      certifications: ['AWS Certified Solutions Architect', 'Google Cloud Professional'],
      projectTypes: ['Web应用', '移动应用', 'API开发'],
      responseTime: '<2小时',
      aiCollaborationLevel: 'advanced',
    },
    {
      id: 'T002',
      name: 'Sarah Johnson',
      avatar: '',
      title: 'UX/UI Design Lead',
      skills: ['Figma', 'UI Design', 'User Research', 'Prototyping', 'Design Systems'],
      rating: 4.8,
      completedProjects: 124,
      hourlyRate: 95,
      currency: 'USD',
      region: 'AMERS',
      languages: ['英语', '西班牙语', '法语'],
      availability: 'available',
      bio: '专注于用户体验设计和产品策略，曾服务多家财富500强企业。',
      certifications: ['Google UX Design Certificate', 'Certified Scrum Master'],
      projectTypes: ['移动应用', 'Web应用', '品牌设计'],
      responseTime: '<4小时',
      aiCollaborationLevel: 'intermediate',
    },
    {
      id: 'T003',
      name: '王芳',
      avatar: '',
      title: 'AI/ML Engineer',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'Computer Vision', 'NLP'],
      rating: 5.0,
      completedProjects: 56,
      hourlyRate: 120,
      currency: 'USD',
      region: 'CHINA',
      languages: ['中文', '英语'],
      availability: 'busy',
      bio: 'AI算法工程师，专注于深度学习和自然语言处理。',
      certifications: ['TensorFlow Developer Certificate', 'AWS ML Specialty'],
      projectTypes: ['AI应用', '数据分析', '机器学习'],
      responseTime: '<6小时',
      aiCollaborationLevel: 'advanced',
    },
    {
      id: 'T004',
      name: 'Ahmed Hassan',
      avatar: '',
      title: 'Backend Systems Architect',
      skills: ['Go', 'Rust', 'Kubernetes', 'Docker', 'Cloud Infrastructure'],
      rating: 4.7,
      completedProjects: 68,
      hourlyRate: 110,
      currency: 'USD',
      region: 'EMEA',
      languages: ['阿拉伯语', '英语', '德语'],
      availability: 'available',
      bio: '系统架构师，专注于高并发分布式系统和云原生开发。',
      certifications: ['CKAD', 'CKA', 'GCP Professional Architect'],
      projectTypes: ['后端系统', '基础设施', 'DevOps'],
      responseTime: '<3小时',
      aiCollaborationLevel: 'advanced',
    },
    {
      id: 'T005',
      name: '李娜',
      avatar: '',
      title: 'Product Manager',
      skills: ['Product Strategy', 'Agile', 'Data Analysis', 'Roadmapping', 'Stakeholder Management'],
      rating: 4.9,
      completedProjects: 92,
      hourlyRate: 75,
      currency: 'USD',
      region: 'APAC',
      languages: ['中文', '英语', '韩语'],
      availability: 'available',
      bio: '资深产品经理，擅长从0到1产品构建和增长策略。',
      certifications: ['PMP', 'Certified Scrum Product Owner'],
      projectTypes: ['产品策略', '项目管理', '增长黑客'],
      responseTime: '<1小时',
      aiCollaborationLevel: 'intermediate',
    },
    {
      id: 'T006',
      name: 'Emma Müller',
      avatar: '',
      title: 'QA Automation Engineer',
      skills: ['Selenium', 'Cypress', 'Playwright', 'API Testing', 'Performance Testing'],
      rating: 4.8,
      completedProjects: 145,
      hourlyRate: 65,
      currency: 'USD',
      region: 'EMEA',
      languages: ['德语', '英语', '法语'],
      availability: 'available',
      bio: '测试自动化专家，帮助团队建立完整的质量保障体系。',
      certifications: ['ISTQB Advanced', 'Selenium WebDriver Certified'],
      projectTypes: ['测试自动化', '质量保证', '性能优化'],
      responseTime: '<2小时',
      aiCollaborationLevel: 'basic',
    },
  ];

  // Sample project requirements
  const projectRequirements: ProjectRequirement[] = [
    {
      id: 'REQ001',
      title: '跨境电商平台前端开发',
      description: '开发一个支持多语言、多币种的跨境电商平台前端，需要与后端API深度集成。',
      requiredSkills: ['React', 'TypeScript', 'GraphQL', 'i18n'],
      budget: 15000,
      currency: 'USD',
      duration: '3个月',
      region: 'APAC',
      urgency: 'high',
      postedAt: '2024-01-15',
      aiAssistRequired: true,
    },
    {
      id: 'REQ002',
      title: 'AI驱动的聊天机器人后端',
      description: '构建一个基于大语言模型的智能客服系统，支持多轮对话和上下文理解。',
      requiredSkills: ['Python', 'LLM Integration', 'FastAPI', 'Redis'],
      budget: 25000,
      currency: 'USD',
      duration: '4个月',
      region: 'GLOBAL',
      urgency: 'medium',
      postedAt: '2024-01-14',
      aiAssistRequired: true,
    },
    {
      id: 'REQ003',
      title: '移动应用UI/UX设计',
      description: '为一款健康科技应用提供完整的用户体验设计和视觉设计。',
      requiredSkills: ['Figma', 'User Research', 'Prototyping', 'Mobile Design'],
      budget: 8000,
      currency: 'USD',
      duration: '6周',
      region: 'AMERS',
      urgency: 'low',
      postedAt: '2024-01-13',
      aiAssistRequired: false,
    },
  ];

  // Regions
  const regions = [
    { id: 'all', name: '全球', nameEn: 'Global', count: talents.length },
    { id: 'APAC', name: '亚太区', nameEn: 'Asia Pacific', count: talents.filter(t => t.region === 'APAC').length },
    { id: 'AMERS', name: '美洲区', nameEn: 'Americas', count: talents.filter(t => t.region === 'AMERS').length },
    { id: 'EMEA', name: '欧洲中东非洲', nameEn: 'Europe, Middle East & Africa', count: talents.filter(t => t.region === 'EMEA').length },
    { id: 'CHINA', name: '大中华区', nameEn: 'Greater China', count: talents.filter(t => t.region === 'CHINA').length },
  ];

  // Skill filters
  const popularSkills = [
    'React', 'Node.js', 'Python', 'TypeScript', 'AI/ML', 'UI/UX',
    'AWS', 'Go', 'Product Management', 'QA Automation'
  ];

  // Currency conversion rates (simplified)
  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    CNY: '¥',
    JPY: '¥',
    GBP: '£',
  };

  const getRegionColor = (region: string) => {
    const colors: Record<string, string> = {
      'APAC': 'bg-blue-500',
      'AMERS': 'bg-green-500',
      'EMEA': 'bg-purple-500',
      'CHINA': 'bg-red-500',
      'GLOBAL': 'bg-gradient-to-r from-purple-500 to-pink-500',
    };
    return colors[region] || 'bg-gray-500';
  };

  const getAvailabilityColor = (status: string) => {
    const colors: Record<string, string> = {
      'available': 'bg-green-100 text-green-700',
      'busy': 'bg-yellow-100 text-yellow-700',
      'unavailable': 'bg-gray-100 text-gray-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getUrgencyColor = (urgency: string) => {
    const colors: Record<string, string> = {
      'high': 'text-red-500 bg-red-100',
      'medium': 'text-yellow-600 bg-yellow-100',
      'low': 'text-green-600 bg-green-100',
    };
    return colors[urgency] || 'text-gray-600 bg-gray-100';
  };

  // Filter talents based on search and filters
  const filteredTalents = talents.filter(talent => {
    const matchesSearch = talent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talent.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRegion = selectedRegion === 'all' || talent.region === selectedRegion;
    const matchesSkills = selectedSkills.length === 0 ||
      selectedSkills.some(s => talent.skills.includes(s));
    const matchesPrice = talent.hourlyRate >= priceRange[0] && talent.hourlyRate <= priceRange[1];
    return matchesSearch && matchesRegion && matchesSkills && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-md border-b border-purple-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CodeUtopia.ai</h1>
                <p className="text-xs text-purple-300">Global Design House Supply Pool</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-1 bg-slate-700/50 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('talent')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'talent' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  人才库
                </button>
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'projects' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  项目需求
                </button>
                <button
                  onClick={() => setActiveTab('matching')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'matching' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  智能匹配
                </button>
                <button
                  onClick={() => setActiveTab('collaboration')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'collaboration' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  协作管理
                </button>
              </nav>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <MessageSquare className="w-5 h-5" />
              </button>
              <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium">
                GD
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Global Design House 供应池</h1>
          <p className="text-gray-400">连接全球顶尖人才，跨区域协作，共创卓越项目</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: '全球人才库', value: '12,450+', icon: Users, color: 'from-blue-500 to-cyan-500' },
            { label: '活跃项目', value: '3,892', icon: Briefcase, color: 'from-purple-500 to-pink-500' },
            { label: '覆盖区域', value: '106', icon: Globe, color: 'from-green-500 to-emerald-500' },
            { label: 'AI协同次数', value: '156,234', icon: Zap, color: 'from-orange-500 to-red-500' },
          ].map((stat, index) => (
            <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-purple-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center text-green-400 text-sm">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12.5%
                </div>
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Talent Pool Tab */}
        {activeTab === 'talent' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
              <div className="flex flex-wrap gap-4 mb-4">
                {/* Search */}
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="搜索人才、技能、项目..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-700/50 border border-purple-500/30 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Region Filter */}
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="bg-slate-700/50 text-white rounded-lg px-4 py-2.5 border border-purple-500/30 focus:outline-none focus:border-purple-500"
                >
                  {regions.map(region => (
                    <option key={region.id} value={region.id}>
                      {region.name} ({region.count})
                    </option>
                  ))}
                </select>

                {/* View Mode */}
                <div className="flex bg-slate-700/50 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    <Filter className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Skill Tags */}
              <div className="flex flex-wrap gap-2">
                {popularSkills.map(skill => (
                  <button
                    key={skill}
                    onClick={() => {
                      if (selectedSkills.includes(skill)) {
                        setSelectedSkills(selectedSkills.filter(s => s !== skill));
                      } else {
                        setSelectedSkills([...selectedSkills, skill]);
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedSkills.includes(skill)
                        ? 'bg-purple-500 text-white'
                        : 'bg-slate-700/50 text-gray-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Talent Grid/List */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredTalents.map(talent => (
                <div
                  key={talent.id}
                  className={`bg-slate-800/50 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all group ${
                    viewMode === 'list' ? 'p-4' : 'p-6'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Avatar */}
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 ${
                      viewMode === 'list' ? 'w-12 h-12 text-lg' : ''
                    }`}>
                      {talent.name.charAt(0)}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Name and Title */}
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                            {talent.name}
                          </h3>
                          <p className="text-sm text-gray-400">{talent.title}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getAvailabilityColor(talent.availability)}`}>
                          {talent.availability === 'available' ? '可接案' : talent.availability === 'busy' ? '忙碌' : '不可用'}
                        </span>
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {talent.skills.slice(0, 4).map(skill => (
                          <span key={skill} className="text-xs px-2 py-0.5 bg-slate-700/50 text-gray-300 rounded">
                            {skill}
                          </span>
                        ))}
                        {talent.skills.length > 4 && (
                          <span className="text-xs px-2 py-0.5 bg-slate-700/50 text-gray-400 rounded">
                            +{talent.skills.length - 4}
                          </span>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center text-yellow-400">
                            <Star className="w-4 h-4 mr-1" fill="currentColor" />
                            {talent.rating}
                          </span>
                          <span className="flex items-center text-gray-400">
                            <Briefcase className="w-4 h-4 mr-1" />
                            {talent.completedProjects} 项目
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${getRegionColor(talent.region)}`} />
                          <span className="text-gray-400">{talent.region}</span>
                        </div>
                      </div>

                      {/* Rate */}
                      <div className="mt-3 pt-3 border-t border-slate-700 flex justify-between items-center">
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 text-green-400" />
                          <span className="text-lg font-bold text-white">{talent.hourlyRate}</span>
                          <span className="text-gray-400 text-sm">/小时</span>
                        </div>
                        <button className="text-purple-400 hover:text-purple-300 text-sm flex items-center">
                          查看详情 <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>

                      {/* AI Collaboration Level */}
                      <div className="mt-3 flex items-center space-x-2">
                        <Zap className={`w-4 h-4 ${
                          talent.aiCollaborationLevel === 'advanced' ? 'text-purple-400' :
                          talent.aiCollaborationLevel === 'intermediate' ? 'text-blue-400' : 'text-gray-400'
                        }`} />
                        <span className="text-xs text-gray-400">
                          AI协同: {
                            talent.aiCollaborationLevel === 'advanced' ? '高级' :
                            talent.aiCollaborationLevel === 'intermediate' ? '中级' : '基础'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            {/* Project List */}
            <div className="space-y-4">
              {projectRequirements.map(project => (
                <div key={project.id} className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">{project.title}</h3>
                        <p className="text-gray-400 text-sm mb-3">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.requiredSkills.map(skill => (
                            <span key={skill} className="text-xs px-2 py-1 bg-slate-700/50 text-gray-300 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end mb-2">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span className="text-xl font-bold text-white">{project.budget.toLocaleString()}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getUrgencyColor(project.urgency)}`}>
                        {project.urgency === 'high' ? '紧急' : project.urgency === 'medium' ? '中等' : '低优先'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                    <div className="flex items-center space-x-6 text-sm text-gray-400">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {project.duration}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {project.region === 'GLOBAL' ? '全球' : regions.find(r => r.id === project.region)?.name}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        发布于 {project.postedAt}
                      </span>
                      {project.aiAssistRequired && (
                        <span className="flex items-center text-purple-400">
                          <Zap className="w-4 h-4 mr-1" />
                          需要AI辅助
                        </span>
                      )}
                    </div>
                    <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      提交申请
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Matching Tab */}
        {activeTab === 'matching' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-8 border border-purple-500/30 text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">AI 智能匹配引擎</h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                基于多维度分析（技能匹配度、工作历史、AI协同能力、时间区域兼容性等）
                为您精准推荐最适合的人才或项目
              </p>
              <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center">
                <Search className="w-5 h-5 mr-2" />
                开始智能匹配
              </button>
            </div>

            {/* Matching Factors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Award, title: '技能匹配度', description: '基于技能标签和项目经验的精准匹配', color: 'from-blue-500 to-cyan-500' },
                { icon: Clock, title: '时间兼容性', description: '跨时区协作的最佳时间窗口计算', color: 'from-purple-500 to-pink-500' },
                { icon: Zap, title: 'AI协同能力', description: '基于历史AI协同数据的效率预测', color: 'from-orange-500 to-red-500' },
              ].map((factor, index) => (
                <div key={index} className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${factor.color} flex items-center justify-center mb-4`}>
                    <factor.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{factor.title}</h3>
                  <p className="text-gray-400 text-sm">{factor.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Collaboration Tab */}
        {activeTab === 'collaboration' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cross-Regional Collaboration */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">跨区域协作</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { from: 'APAC', to: 'AMERS', status: 'active', projects: 23 },
                    { from: 'CHINA', to: 'EMEA', status: 'active', projects: 18 },
                    { from: 'APAC', to: 'CHINA', status: 'active', projects: 45 },
                  ].map((collab, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className={`w-6 h-6 rounded-full ${getRegionColor(collab.from)}`} />
                        <span className="text-gray-400">→</span>
                        <span className={`w-6 h-6 rounded-full ${getRegionColor(collab.to)}`} />
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">{collab.projects} 协作项目</div>
                        <div className="text-xs text-green-400">进行中</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Collaboration Stats */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">AI 协同统计</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">总协同次数</span>
                    <span className="text-white font-medium">156,234</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">平均效率提升</span>
                    <span className="text-green-400 font-medium">+47%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">多AI协同项目</span>
                    <span className="text-white font-medium">2,345</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">跨AI角色协作</span>
                    <span className="text-white font-medium">89%</span>
                  </div>
                </div>
              </div>

              {/* Multi-Currency Support */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">多币种结算支持</h3>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {['USD', 'EUR', 'CNY', 'GBP'].map(currency => (
                    <div key={currency} className="p-3 bg-slate-700/30 rounded-lg text-center">
                      <div className="text-lg font-bold text-white">{currency}</div>
                      <div className="text-xs text-gray-400">支持</div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-400 mt-4">
                  实时汇率转换，智能结算，跨境支付无忧
                </p>
              </div>

              {/* Collaboration Best Practices */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">协作最佳实践</h3>
                </div>
                <div className="space-y-3">
                  {[
                    '明确项目里程碑和交付物',
                    '建立跨时区沟通机制',
                    '善用AI辅助提升效率',
                    '定期同步进度和反馈',
                    '建立清晰的版本管理',
                  ].map((practice, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">{practice}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800/50 border-t border-purple-500/20 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-purple-400" />
              <span className="text-gray-400 text-sm">Global Design House - CodeUtopia.ai</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>覆盖 106 个国家/地区</span>
              <span>•</span>
              <span>支持 13 种语言</span>
              <span>•</span>
              <span>8+ AI 角色协同</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SupplyPoolPage;
