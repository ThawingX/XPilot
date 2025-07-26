import React, { useState } from 'react';
import { MessageSquare, Repeat2, Activity, ToggleLeft, ToggleRight } from 'lucide-react';

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
  // 新增字段
  prompt?: string; // 生成回复的prompt
  style?: 'funny' | 'professional' | 'casual' | 'formal'; // 回复风格
  enabled?: boolean; // 是否启用这个回复卡片能力
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
    targetAccount: '@user123',
    prompt: '请以友好和专业的语气回复用户的产品反馈，表达感谢并承诺改进',
    style: 'professional',
    enabled: true
  },
  {
    id: 2,
    type: 'reply',
    title: '客户咨询回复',
    content: '您好！关于定价问题，我们提供多种套餐选择，建议您查看我们的官网或联系客服获取详细信息。',
    time: '4小时前',
    status: 'draft',
    priority: 'medium',
    targetAccount: '@customer456',
    prompt: '回复客户关于定价的咨询，提供有用的信息和联系方式',
    style: 'formal',
    enabled: true
  },
  {
    id: 3,
    type: 'repost',
    title: '行业洞察转发',
    content: '转发：AI技术的发展正在重塑各个行业，我们需要拥抱变化，持续学习和创新。',
    time: '1天前',
    status: 'completed',
    priority: 'medium',
    targetAccount: '@industry_expert',
    enabled: true
  },
  {
    id: 4,
    type: 'repost',
    title: '合作伙伴内容',
    content: '转发：很高兴与优秀的团队合作，共同推动技术创新和产品发展。',
    time: '2天前',
    status: 'pending',
    priority: 'low',
    targetAccount: '@partner_company',
    enabled: false
  },
  {
    id: 5,
    type: 'reply',
    title: '幽默回复模板',
    content: '哈哈，这个问题问得好！让我想想... 🤔 其实答案很简单，就像我们的产品一样简单易用！',
    time: '6小时前',
    status: 'draft',
    priority: 'low',
    targetAccount: '@funny_user',
    prompt: '用幽默轻松的方式回复用户的问题，保持友好和有趣',
    style: 'funny',
    enabled: true
  }
];

const Config: React.FC<ConfigProps> = ({ onItemClick }) => {
  const [activeTab, setActiveTab] = useState<'reply' | 'repost'>('reply');
  const [configItems, setConfigItems] = useState<ConfigItem[]>(mockConfigItems);

  // Filter items based on active tab
  const filteredItems = configItems.filter(item => item.type === activeTab);

  // Toggle enabled status
  const handleToggleEnabled = (id: number, enabled: boolean, event: React.MouseEvent) => {
    event.stopPropagation(); // 防止触发卡片点击事件
    setConfigItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, enabled } : item
      )
    );
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
              暂无{activeTab === 'reply' ? '回复' : '转发'}配置
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div 
              key={item.id}
              onClick={() => onItemClick(item)}
              className="p-4 border border-gray-200 rounded-lg hover:border-[#4792E6] hover:shadow-md transition-all cursor-pointer bg-white"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {item.type === 'reply' ? (
                    <MessageSquare size={16} className="text-[#4792E6] flex-shrink-0 mt-1" />
                  ) : (
                    <Repeat2 size={16} className="text-[#4792E6] flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.content}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{item.targetAccount}</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>
                
                {/* 开关控件 */}
                <div className="flex-shrink-0 ml-3">
                  <button
                    onClick={(e) => handleToggleEnabled(item.id, !item.enabled, e)}
                    className={`p-1 rounded-full transition-colors ${
                      item.enabled 
                        ? 'text-blue-500 hover:text-blue-600' 
                        : 'text-gray-400 hover:text-gray-500'
                    }`}
                    title={item.enabled ? '点击禁用' : '点击启用'}
                  >
                    {item.enabled ? (
                      <ToggleRight className="w-6 h-6" />
                    ) : (
                      <ToggleLeft className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Config;