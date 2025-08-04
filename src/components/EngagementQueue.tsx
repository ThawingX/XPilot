import React, { useState, useEffect } from 'react';
import { Activity, MessageSquare, Repeat2, Search, Users, Star, Target } from 'lucide-react';
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

type TabType = 'autoReply' | 'autoRepost' | 'starred' | 'outreach';

const EngagementQueue: React.FC<EngagementQueueProps> = ({ 
  showInspirationAccounts = false, 
  onCardClick,
  onAccountClick,
  selectedCardId,
  selectedAccountId
}) => {
  const [inspirationAccounts, setInspirationAccounts] = useState<InspirationAccount[]>(mockInspirationAccounts);
  const [activeTab, setActiveTab] = useState<TabType>(showInspirationAccounts ? 'starred' : 'autoReply');
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

  // Reset activeTab when showInspirationAccounts changes
  useEffect(() => {
    setActiveTab(showInspirationAccounts ? 'starred' : 'autoReply');
  }, [showInspirationAccounts]);

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

  const handleRejectReply = (cardId: string) => {
    // Remove the card from autoReplyData
    setAutoReplyData(prev => prev.filter(card => card.id !== cardId));
    showToast('Reply rejected successfully', 'info');
  };

  const handlePostReply = (cardId: string, reply: string) => {
    // Remove the card from autoReplyData after posting
    setAutoReplyData(prev => prev.filter(card => card.id !== cardId));
    showToast('Reply posted successfully', 'success');
  };

  const handleToggleTarget = (id: number, isTargeted: boolean) => {
    setInspirationAccounts(prev => 
      prev.map(account => 
        account.id === id ? { ...account, isTargeted } : account
      )
    );
  };

  const handleToggleStar = (id: number, starred: boolean) => {
    // Update the account in the main list
    setInspirationAccounts(prev => 
      prev.map(account => 
        account.id === id ? { ...account, starred } : account
      )
    );

    // If adding star from search results, also update search results
    setSearchResults(prev => 
      prev.map(account => 
        account.id === id ? { ...account, starred } : account
      )
    );

    // If removing star and currently on starred tab, it will be automatically filtered out
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setIsSearching(true);
      // Simulate search delay
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

  // Get the currently displayed account list
  const getDisplayAccounts = () => {
    if (showInspirationAccounts) {
      if (activeTab === 'starred') {
        // starred tab shows starred accounts
        if (searchQuery.trim()) {
          return searchResults.filter(account => account.starred);
        } else {
          return inspirationAccounts.filter(account => account.starred);
        }
      } else if (activeTab === 'outreach') {
        // outreach tab shows search results or all non-starred accounts
        if (searchQuery.trim()) {
          return searchResults.filter(account => !account.starred);
        } else {
          return [...inspirationAccounts.filter(account => !account.starred), ...mockSearchAccounts];
        }
      }
    }
    return [];
  };

  const displayAccounts = getDisplayAccounts();
  const totalItems = showInspirationAccounts ? displayAccounts.length : autoReplyData.length;
  const title = showInspirationAccounts ? 'Inspiration Accounts' : 'Engagement Queue';

  if (showInspirationAccounts) {
    // Inspiration Accounts display logic
    return (
      <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-sm min-w-[320px]">
        {/* Header */}
        <div className="flex-shrink-0 p-4 sm:p-6 border-b border-gray-200">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">{title}</h2>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-4">
            <button
              onClick={() => setActiveTab('starred')}
              className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'starred'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Star size={16} />
              <span className="hidden sm:inline">Starred</span>
            </button>
            <button
              onClick={() => setActiveTab('outreach')}
              className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'outreach'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Target size={16} />
              <span className="hidden sm:inline">Outreach</span>
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
              {displayAccounts.length} accounts
            </span>
          </div>
        </div>
        
        {/* Content */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-4">
          {displayAccounts.length === 0 ? (
            <div className="text-center py-8">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">
                {activeTab === 'starred' ? 'No starred accounts' : 'No outreach accounts available'}
              </p>
            </div>
          ) : (
            displayAccounts.map((account) => (
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

  // Engagement display logic (formerly Activity Queue)
  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-sm min-w-[400px]">
      {/* Header */}
      <div className="flex-shrink-0 p-4 sm:p-6 border-b border-gray-200">
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
      <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-4">
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
                  onReject={handleRejectReply}
                  onPost={handlePostReply}
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