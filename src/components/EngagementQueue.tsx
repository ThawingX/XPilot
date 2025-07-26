import React, { useState, useEffect } from 'react';
import { Activity, MessageSquare, Repeat2, Search, Users } from 'lucide-react';
import { mockCards, mockInspirationAccounts, mockSearchAccounts, mockAutoReplyData } from '../data/mockData';
import { InspirationAccount, Card } from '../types';
import CardItem from './CardItem';
import AutoReplyCard from './AutoReplyCard';
import InspirationAccountCard from './InspirationAccountCard';
import Toast from './Toast';

interface EngagementQueueProps {
  showInspirationAccounts?: boolean;
  onCardClick?: (card: Card) => void;
  onAccountClick?: (account: InspirationAccount) => void;
  selectedCardId?: string;
  selectedAccountId?: number;
}

type TabType = 'autoReply' | 'autoRepost';

const EngagementQueue: React.FC<EngagementQueueProps> = ({ 
  showInspirationAccounts = false, 
  onCardClick,
  onAccountClick,
  selectedCardId,
  selectedAccountId
}) => {
  const [inspirationAccounts, setInspirationAccounts] = useState<InspirationAccount[]>(mockInspirationAccounts);
  const [activeTab, setActiveTab] = useState<TabType>('autoReply');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<InspirationAccount[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [autoReplyData, setAutoReplyData] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    message: '',
    type: 'success' as 'success' | 'error' | 'info',
    isVisible: false
  });

  // Fetch autoReply data
  const fetchAutoReplyData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setAutoReplyData(mockAutoReplyData);
    } catch (error) {
      console.error('Failed to fetch autoReply data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Set up polling for autoReply data every 3 seconds
  useEffect(() => {
    if (activeTab === 'autoReply') {
      fetchAutoReplyData();
      const interval = setInterval(fetchAutoReplyData, 3000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({
      message,
      type,
      isVisible: true
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleToggleTarget = (id: number, isTargeted: boolean) => {
    setInspirationAccounts(prev => 
      prev.map(account => 
        account.id === id ? { ...account, isTargeted } : account
      )
    );
  };

  const handleToggleStar = (id: number, starred: boolean) => {
    // 更新主列表中的账号
    setInspirationAccounts(prev => 
      prev.map(account => 
        account.id === id ? { ...account, starred } : account
      )
    );

    // 如果是从搜索结果中添加星标，也要更新搜索结果
    setSearchResults(prev => 
      prev.map(account => 
        account.id === id ? { ...account, starred } : account
      )
    );

    // 如果取消星标且当前在 starred 标签页，需要从列表中移除
    if (!starred && activeTab === 'starred') {
      // 这里不需要额外处理，因为下面的过滤逻辑会自动处理
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setIsSearching(true);
      // 模拟搜索延迟
      setTimeout(() => {
        const results = mockSearchAccounts.filter(account => 
          account.name.toLowerCase().includes(query.toLowerCase()) ||
          account.handle.toLowerCase().includes(query.toLowerCase()) ||
          account.bio.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(results);
        setIsSearching(false);
      }, 300);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  // 获取当前显示的账号列表
  const getDisplayAccounts = () => {
    if (activeTab === 'autoReply') {
      return [];
    } else {
      // autoRepost 标签页显示搜索结果或所有未星标的账号
      if (searchQuery.trim()) {
        return searchResults;
      } else {
        return [...inspirationAccounts.filter(account => !account.starred), ...mockSearchAccounts];
      }
    }
  };

  const displayAccounts = getDisplayAccounts();
  const totalItems = showInspirationAccounts ? displayAccounts.length : autoReplyData.length;
  const title = showInspirationAccounts ? 'Inspiration Accounts' : 'Engagement Queue';

  if (showInspirationAccounts) {
    // Inspiration Accounts 显示逻辑
    return (
      <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-gray-200">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">{title}</h2>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search accounts..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {isSearching && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>

          {/* Items Count */}
          <div className="flex items-center space-x-2">
            <Users size={20} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-600">
              {inspirationAccounts.length} accounts
            </span>
          </div>
        </div>
        
        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-4">
          {inspirationAccounts.length === 0 ? (
            <div className="text-center py-8">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No inspiration accounts available</p>
            </div>
          ) : (
            inspirationAccounts.map((account) => (
              <InspirationAccountCard 
                key={account.id} 
                account={account} 
                onToggleTarget={handleToggleTarget}
                onToggleStar={handleToggleStar}
                onShowToast={showToast}
                onClick={onAccountClick}
                isSelected={selectedAccountId === account.id}
              />
            ))
          )}
        </div>

        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />
      </div>
    );
  }

  // Engagement 显示逻辑 (原 Activity Queue)
  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">{title}</h2>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-4">
          <button
            onClick={() => setActiveTab('autoReply')}
            className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'autoReply'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageSquare size={16} />
            <span className="hidden sm:inline">autoReply</span>
          </button>
          <button
            onClick={() => setActiveTab('autoRepost')}
            className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'autoRepost'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Repeat2 size={16} />
            <span className="hidden sm:inline">autoRepost</span>
          </button>
        </div>

        {/* Items Count */}
        <div className="flex items-center space-x-2">
          <Activity size={20} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-600">
            {activeTab === 'autoReply' ? autoReplyData.length : 0} items
          </span>
          {loading && activeTab === 'autoReply' && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="overflow-y-auto flex-1 p-6 space-y-4">
        {activeTab === 'autoReply' ? (
          autoReplyData.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No autoReply data available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {autoReplyData.map((card) => (
                <AutoReplyCard
                  key={card.id}
                  card={card}
                  isSelected={selectedCardId === card.id}
                  onClick={() => onCardClick?.(card)}
                />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-8">
            <Repeat2 size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">autoRepost feature coming soon</p>
          </div>
        )}
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default EngagementQueue;