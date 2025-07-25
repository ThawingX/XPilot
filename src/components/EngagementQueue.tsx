import React, { useState } from 'react';
import { Activity, Star, Search, Users } from 'lucide-react';
import { mockCards, mockInspirationAccounts, mockSearchAccounts } from '../data/mockData';
import { InspirationAccount } from '../types';
import CardItem from './CardItem';
import InspirationAccountCard from './InspirationAccountCard';

interface EngagementQueueProps {
  showInspirationAccounts?: boolean;
}

type TabType = 'starred' | 'outreach';

const EngagementQueue: React.FC<EngagementQueueProps> = ({ showInspirationAccounts = false }) => {
  const [inspirationAccounts, setInspirationAccounts] = useState<InspirationAccount[]>(mockInspirationAccounts);
  const [activeTab, setActiveTab] = useState<TabType>('starred');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<InspirationAccount[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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
    if (activeTab === 'starred') {
      return inspirationAccounts.filter(account => account.starred);
    } else {
      // outreach 标签页显示搜索结果或所有未星标的账号
      if (searchQuery.trim()) {
        return searchResults;
      } else {
        return [...inspirationAccounts.filter(account => !account.starred), ...mockSearchAccounts];
      }
    }
  };

  const displayAccounts = getDisplayAccounts();
  const totalItems = showInspirationAccounts ? displayAccounts.length : mockCards.length;
  const title = showInspirationAccounts ? 'Inspiration Accounts' : 'Activity Queue';

  if (!showInspirationAccounts) {
    // 原有的 Activity Queue 显示逻辑
    return (
      <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex-shrink-0 p-6 border-b border-gray-200">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">{title}</h2>
          <div className="flex items-center space-x-2">
            <Activity size={20} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-600">
              {totalItems} items
            </span>
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1 p-6 space-y-4">
          {mockCards.map((card) => (
            <CardItem key={card.id} card={card} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">{title}</h2>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-4">
          <button
            onClick={() => setActiveTab('starred')}
            className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'starred'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Star size={16} className={activeTab === 'starred' ? 'text-yellow-500' : ''} />
            <span>Starred</span>
          </button>
          <button
            onClick={() => setActiveTab('outreach')}
            className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'outreach'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users size={16} />
            <span>Outreach</span>
          </button>
        </div>

        {/* Search Bar - Only show in outreach tab */}
        {activeTab === 'outreach' && (
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="搜索账号..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {isSearching && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
        )}

        {/* Items Count */}
        <div className="flex items-center space-x-2">
          <Activity size={20} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-600">
            {totalItems} items
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="overflow-y-auto flex-1 p-6 space-y-4">
        {displayAccounts.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              {activeTab === 'starred' ? (
                <Star size={48} className="mx-auto" />
              ) : (
                <Users size={48} className="mx-auto" />
              )}
            </div>
            <p className="text-gray-500">
              {activeTab === 'starred' 
                ? '还没有收藏的账号' 
                : searchQuery.trim() 
                  ? '没有找到匹配的账号' 
                  : '开始搜索账号'
              }
            </p>
          </div>
        ) : (
          displayAccounts.map((account) => (
            <InspirationAccountCard 
              key={account.id} 
              account={account} 
              onToggleTarget={handleToggleTarget}
              onToggleStar={handleToggleStar}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default EngagementQueue;