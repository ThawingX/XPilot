import React, { useState, useEffect } from 'react';
import { Settings, MessageSquare, Repeat2, Clock } from 'lucide-react';

interface ConfigProps {
  onItemClick?: (item: ConfigItem) => void;
  selectedItemId?: string;
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
  // New fields
  prompt?: string; // Prompt for generating replies
  style?: 'funny' | 'professional' | 'casual' | 'formal' | 'friendly' | 'encouraging' | 'energetic' | 'analytical'; // Reply style
  enabled?: boolean; // Whether this reply card capability is enabled
}
const mockConfigItems: ConfigItem[] = [
  {
    id: 1,
    type: 'reply',
    title: 'Tech Product Review Replies',
    content: 'Generate professional and insightful replies to tech product content',
    time: '2024-01-15 14:30',
    prompt: 'As a tech enthusiast, generate professional and insightful replies to tech product content. Include technical analysis, user experience sharing, or product comparisons. Maintain an objective and neutral tone while providing valuable information.',
    style: 'professional',
    enabled: true
  },
  {
    id: 2,
    type: 'repost',
    title: 'Lifestyle Content Sharing',
    content: 'Automatically repost trending tech topics',
    time: '2024-01-15 10:15',
    prompt: 'Identify and repost high-quality lifestyle content including health, food, travel, and fashion topics. Add personal insights or related experience sharing to make content more personalized.',
    style: 'casual',
    enabled: false
  },
  {
    id: 3,
    type: 'reply',
    title: 'Business Insight Responses',
    content: 'Reply to lifestyle, health, and food content',
    time: '2024-01-14 16:45',
    prompt: 'Provide deep business insights and analysis for business, entrepreneurship, and investment content. Replies should demonstrate business thinking including market analysis, business model discussions, and industry trend predictions.',
    style: 'friendly',
    enabled: true
  },
  {
    id: 4,
    type: 'reply',
    title: 'Educational Content Engagement',
    content: 'Participate in business, investment, and entrepreneurship discussions',
    time: '2024-01-14 09:20',
    prompt: 'Reply to educational, learning, and knowledge-sharing content. Responses should be inspiring, supplementing knowledge points, sharing learning methods, or raising thought-provoking questions.',
    style: 'professional',
    enabled: true
  },
  {
    id: 5,
    type: 'reply',
    title: 'Entertainment Content Replies',
    content: 'Reply to education, learning methods, and skill improvement content',
    time: '2024-01-13 20:10',
    prompt: 'Reply to entertainment, film, music, and gaming content. Maintain a light and cheerful tone, share personal preferences, recommend related content, or initiate interesting discussions.',
    style: 'encouraging',
    enabled: false
  },
  {
    id: 6,
    type: 'reply',
    title: 'Sports Event Sharing',
    content: 'Reply to movies, music, games, literature and other entertainment content',
    time: '2024-01-13 15:30',
    prompt: 'Repost exciting sports-related content including game highlights, athlete performances, and sports news. Add personal opinions and emotional expressions to enhance content appeal.',
    style: 'casual',
    enabled: true
  },
  {
    id: 7,
    type: 'reply',
    title: 'News Commentary',
    content: 'Reply to sports events, fitness, and sports-related content',
    time: '2024-01-12 18:45',
    prompt: 'Provide rational and objective commentary on news and current events. Analyze event background, impact, and significance, offer multi-perspective thinking, avoid extreme views, and promote rational discussion.',
    style: 'energetic',
    enabled: true
  },
  {
    id: 8,
    type: 'reply',
    title: 'Arts & Culture Exchange',
    content: 'Rational discussion of current news and social topics',
    time: '2024-01-12 11:20',
    prompt: 'Participate in discussions about art, culture, and literature. Replies should demonstrate cultural literacy, quote relevant works, share artistic insights, or recommend quality cultural content.',
    style: 'analytical',
    enabled: false
  }
];

const Config: React.FC<ConfigProps> = ({ onItemClick, selectedItemId }) => {
  const [activeTab, setActiveTab] = useState<'reply' | 'repost'>('reply');
  const [configItems, setConfigItems] = useState<ConfigItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock API request to fetch config items
  const fetchConfigItems = async () => {
    setLoading(true);
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate fetching configuration data from server
      console.log('Fetching reply card configurations...');
      setConfigItems(mockConfigItems);
    } catch (error) {
      console.error('Failed to fetch config items:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load mock request when component mounts
  useEffect(() => {
    fetchConfigItems();
  }, []);

  // Filter items based on active tab
  const filteredItems = configItems.filter(item => {
    return item.type === activeTab;
  });

  // Toggle enabled status
  const handleToggleEnabled = (id: number, enabled: boolean, e: React.MouseEvent | React.ChangeEvent) => {
    e.stopPropagation();
    setConfigItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, enabled } : item
      )
    );
  };

  // Format reply style for display
  const formatReplyStyle = (style?: string) => {
    if (!style) return 'Default';
    return style.charAt(0).toUpperCase() + style.slice(1);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-sm w-full max-w-md">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Configuration Management</h2>
        
        {/* Tab Navigation - Only Reply and Repost */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-4">
          <button
            onClick={() => setActiveTab('reply')}
            className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'reply'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageSquare size={16} />
            <span>Reply</span>
          </button>
          <button
            onClick={() => setActiveTab('repost')}
            className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'repost'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Repeat2 size={16} />
            <span>Repost</span>
          </button>
        </div>

        {/* Items Count */}
        <div className="flex items-center space-x-2">
          <Settings size={20} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-600">
            {filteredItems.length} configurations
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="overflow-y-auto flex-1 p-6 space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading configuration data...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-8">
            <Settings size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No configuration items</p>
          </div>
        ) : (
          filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onItemClick?.(item)}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedItemId === item.id
                    ? 'border-blue-300 bg-blue-50 shadow-lg ring-2 ring-blue-100'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {/* Reply Style Label and Toggle Switch - Top row */}
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">Reply Style:</span>
                    <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                      {formatReplyStyle(item.style)}
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={(e) => handleToggleEnabled(item.id, e.target.checked, e)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500" style={{"--tw-ring-color": "rgba(71, 146, 230, 0.3)"} as React.CSSProperties}></div>
                  </label>
                </div>

                {/* Title - New line */}
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900 text-base leading-tight">
                    {item.title}
                  </h3>
                </div>

                {/* Icon and Content */}
                <div className="flex items-start space-x-3">
                  {/* Icon */}
                  <div className={`p-2 rounded-lg flex-shrink-0 ${
                    item.type === 'reply' 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'bg-green-50 text-green-600'
                  }`}>
                    {item.type === 'reply' ? (
                      <MessageSquare size={20} />
                    ) : (
                      <Repeat2 size={20} />
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {item.content}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Clock size={12} />
                      <span>{item.time}</span>
                    </div>
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