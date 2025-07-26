import React, { useState } from 'react';
import { MessageSquare, Repeat2, Search, Activity, Star } from 'lucide-react';

interface ConfigProps {
  onItemClick: (item: ConfigItem) => void;
}

type TabType = 'reply' | 'repost';

export interface ConfigItem {
  id: number;
  type: 'reply' | 'repost';
  title: string;
  content: string;
  time: string;
  status: 'pending' | 'completed' | 'draft';
  priority: 'high' | 'medium' | 'low';
  targetAccount?: string;
}

const mockConfigItems: ConfigItem[] = [
  {
    id: 1,
    type: 'reply',
    title: '回复产品反馈',
    content: '感谢您的宝贵建议！我们正在积极改进产品功能，您提到的问题将在下个版本中得到解决。',
    time: '2小时前',
    status: 'pending',
    priority: 'high',
    targetAccount: '@user123'
  },
  {
    id: 2,
    type: 'reply',
    title: '客户咨询回复',
    content: '您好！关于定价问题，我们提供多种套餐选择，建议您查看我们的官网或联系客服获取详细信息。',
    time: '4小时前',
    status: 'draft',
    priority: 'medium',
    targetAccount: '@customer456'
  },
  {
    id: 3,
    type: 'repost',
    title: '行业洞察转发',
    content: '转发：AI技术的发展正在重塑各个行业，我们需要拥抱变化，持续学习和创新。',
    time: '1天前',
    status: 'completed',
    priority: 'medium',
    targetAccount: '@industry_expert'
  },
  {
    id: 4,
    type: 'repost',
    title: '合作伙伴内容',
    content: '转发：很高兴与优秀的团队合作，共同推动技术创新和产品发展。',
    time: '2天前',
    status: 'pending',
    priority: 'low',
    targetAccount: '@partner_company'
  }
];

const Config: React.FC<ConfigProps> = ({ onItemClick }) => {
  const [activeTab, setActiveTab] = useState<TabType>('reply');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = mockConfigItems.filter(item => {
    const matchesTab = item.type === activeTab;
    const matchesSearch = searchQuery.trim() === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.targetAccount && item.targetAccount.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesTab && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '待处理';
      case 'completed':
        return '已完成';
      case 'draft':
        return '草稿';
      default:
        return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return '高';
      case 'medium':
        return '中';
      case 'low':
        return '低';
      default:
        return priority;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">配置管理</h2>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-4">
          <button
            onClick={() => setActiveTab('reply')}
            className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'reply'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageSquare size={16} className={activeTab === 'reply' ? 'text-[#4792E6]' : ''} />
            <span className="hidden sm:inline">Reply</span>
          </button>
          <button
            onClick={() => setActiveTab('repost')}
            className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'repost'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Repeat2 size={16} className={activeTab === 'repost' ? 'text-[#4792E6]' : ''} />
            <span className="hidden sm:inline">Repost</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索配置项..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4792E6] focus:border-transparent"
          />
        </div>

        {/* Items Count */}
        <div className="flex items-center space-x-2">
          <Activity size={20} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-600">
            {filteredItems.length} 项配置
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="overflow-y-auto flex-1 p-6 space-y-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              {activeTab === 'reply' ? (
                <MessageSquare size={48} className="mx-auto" />
              ) : (
                <Repeat2 size={48} className="mx-auto" />
              )}
            </div>
            <p className="text-gray-500">
              {searchQuery.trim() 
                ? '没有找到匹配的配置项' 
                : `暂无${activeTab === 'reply' ? '回复' : '转发'}配置`
              }
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div 
              key={item.id}
              onClick={() => onItemClick(item)}
              className="p-4 border border-gray-200 rounded-lg hover:border-[#4792E6] hover:shadow-md transition-all cursor-pointer bg-white"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {item.type === 'reply' ? (
                    <MessageSquare size={16} className="text-[#4792E6] flex-shrink-0" />
                  ) : (
                    <Repeat2 size={16} className="text-[#4792E6] flex-shrink-0" />
                  )}
                  <h3 className="font-medium text-gray-900 text-sm">{item.title}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                    {getPriorityText(item.priority)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {getStatusText(item.status)}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.content}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{item.targetAccount}</span>
                <span>{item.time}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Config;