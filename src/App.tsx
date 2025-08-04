import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { CopilotKit } from '@copilotkit/react-core';
import Sidebar from './components/Sidebar';
import EngagementQueue from './components/EngagementQueue';
import PostThreadQueue from './components/PostThreadQueue';
import ResultsArea from './components/ResultsArea';
import Config, { ConfigItem } from './components/Config';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard';
import MarketingStrategy from './components/MarketingStrategy';
import Login from './components/Login';
import TwitterAuthCallback from './pages/TwitterAuthCallback';
import TwitterDirectCallback from './components/TwitterDirectCallback';

import { Card, InspirationAccount, Post } from './types/index';
import { MarketingStrategy as MarketingStrategyType } from './data/mockData';
import AIAssistant from './components/AIAssistant';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<InspirationAccount | null>(null);
  const [selectedConfigItem, setSelectedConfigItem] = useState<ConfigItem | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<MarketingStrategyType | null>(null);
  const [activeMenuItem, setActiveMenuItem] = useState<string>('Dashboard');
  const [profileInitialSection, setProfileInitialSection] = useState<string>('overview');

  // 处理 URL 参数
  useEffect(() => {
    const section = searchParams.get('section');
    const tab = searchParams.get('tab');
    
    if (section === 'profile') {
      setActiveMenuItem('Profile');
      if (tab) {
        setProfileInitialSection(tab);
      }
      // 清除 URL 参数，避免刷新时重复处理
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  // 显示加载状态
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full border-4 border-purple-200 animate-spin border-t-purple-600"></div>
          <p className="text-gray-600">正在加载...</p>
        </div>
      </div>
    );
  }

  // 如果用户未登录，显示登录页面
  if (!user) {
    return <Login />;
  }

  const handleMenuItemClick = (itemName: string) => {
    setActiveMenuItem(itemName);
    // Clear other selection states
    setSelectedCard(null);
    setSelectedAccount(null);
    setSelectedConfigItem(null);
    setSelectedPostId(null);
    setSelectedPost(null);
    setSelectedStrategy(null);
    // Reset profile section when navigating to profile from menu
    if (itemName === 'Profile') {
      setProfileInitialSection('overview');
    }
  };

  const handleDashboardNavigate = (section: string, profileSection?: string) => {
    setActiveMenuItem(section);
    setSelectedCard(null);
    setSelectedAccount(null);
    setSelectedConfigItem(null);
    setSelectedPostId(null);
    setSelectedPost(null);
    setSelectedStrategy(null);
    // Set profile section if navigating to profile
    if (section === 'Profile' && profileSection) {
      setProfileInitialSection(profileSection);
    }
  };

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
    setSelectedAccount(null);
    setSelectedConfigItem(null);
    setSelectedPostId(null);
    setSelectedPost(null);
    setSelectedStrategy(null);
  };

  const handleAccountClick = (account: InspirationAccount) => {
    setSelectedAccount(account);
    setSelectedCard(null);
    setSelectedConfigItem(null);
    setSelectedPostId(null);
    setSelectedPost(null);
    setSelectedStrategy(null);
  };

  const handleConfigItemClick = (item: ConfigItem) => {
    setSelectedConfigItem(item);
    setSelectedCard(null);
    setSelectedAccount(null);
    setSelectedPostId(null);
    setSelectedPost(null);
    setSelectedStrategy(null);
  };

  const handleStrategyClick = (strategy: MarketingStrategyType) => {
    setSelectedStrategy(strategy);
    setSelectedCard(null);
    setSelectedAccount(null);
    setSelectedConfigItem(null);
    setSelectedPostId(null);
    setSelectedPost(null);
  };

  const handlePostClick = (queueItem: any) => {
    // Convert QueueItem to Post format
    const post: Post = {
      id: queueItem.id,
      type: queueItem.type,
      content: queueItem.content,
      createdTime: queueItem.createdTime,
      status: queueItem.status,
      platform: queueItem.platform,
      aiGenerated: queueItem.aiGenerated,
      tags: queueItem.tags || [],
      stats: {
        comments: 0,
        retweets: 0,
        likes: 0,
        views: 0,
        bookmarks: 0
      }
    };
    
    setSelectedPostId(post.id);
    setSelectedPost(post);
    setSelectedCard(null);
    setSelectedAccount(null);
    setSelectedConfigItem(null);
  };

  const showDashboard = activeMenuItem === 'Dashboard';
  const showInspirationAccounts = activeMenuItem === 'Inspiration Accounts';
  const showAutoEngagement = activeMenuItem === 'Auto Engagement';
  const showPostThreadQueue = activeMenuItem === 'Get Post/Thread';
  const showMarketingStrategy = activeMenuItem === 'Marketing Strategy';
  const showConfig = activeMenuItem === 'Config';
  const showProfile = activeMenuItem === 'Profile';

  return (
    <CopilotKit runtimeUrl="https://pilotapi.producthot.top/api/agent">
      <div className="flex overflow-hidden h-screen bg-gray-50">
        {/* Left Sidebar */}
        <Sidebar 
          onMenuItemClick={handleMenuItemClick} 
          activeMenuItem={activeMenuItem}
        />
        
        {/* Main Content Area */}
        <div className="flex overflow-hidden flex-1">
          {/* Activity Queue / Config / Profile / Dashboard / Marketing Strategy */}
          <div className={`${
            showDashboard || showProfile ? 'w-full' : 
            'w-1/2'
          } min-w-0 overflow-hidden`}>
            {showDashboard ? (
              <Dashboard onNavigate={handleDashboardNavigate} />
            ) : showProfile ? (
              <Profile 
                initialSection={profileInitialSection} 
                onNavigate={handleDashboardNavigate}
              />
            ) : showConfig ? (
              <Config 
                onItemClick={handleConfigItemClick} 
                selectedItemId={selectedConfigItem?.id?.toString()}
              />
            ) : showMarketingStrategy ? (
              <MarketingStrategy 
                onStrategyClick={handleStrategyClick}
                selectedStrategyId={selectedStrategy?.id}
              />
            ) : showPostThreadQueue ? (
              <PostThreadQueue 
                onPostClick={handlePostClick}
                selectedPostId={selectedPostId || undefined}
              />
            ) : (
              <EngagementQueue 
                showInspirationAccounts={showInspirationAccounts} 
                onCardClick={handleCardClick}
                onAccountClick={handleAccountClick}
                selectedCardId={selectedCard?.id}
                selectedAccountId={selectedAccount?.id}
              />
            )}
          </div>
          
          {/* Results Area - only show when not Dashboard and not Profile */}
          {!showDashboard && !showProfile && (
            <div className="overflow-hidden flex-1 min-w-0">
              <ResultsArea 
                selectedCard={selectedCard} 
                selectedAccount={selectedAccount} 
                selectedConfigItem={selectedConfigItem}
                selectedPostId={selectedPostId}
                selectedPost={selectedPost}
                selectedStrategy={selectedStrategy}
              />
            </div>
          )}
        </div>
        
        {/* Vibe X Operation - Right Sidebar */}
        <AIAssistant />
      </div>
    </CopilotKit>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth/supabase/twitter/callback" element={<TwitterAuthCallback />} />
          <Route path="/auth/twitter/direct/callback" element={<TwitterDirectCallback />} />
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;