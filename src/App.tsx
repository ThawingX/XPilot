import React, { useState, useEffect, createContext, useContext } from 'react';
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
import PlanManager from './components/PlanManager';
import Login from './components/Login';
import TwitterAuthCallback from './pages/TwitterAuthCallback';
import TwitterDirectCallback from './components/TwitterDirectCallback';
import ExecutionPlanTest from './test/ExecutionPlanTest';

import { Card, InspirationAccount, Post } from './types/index';
import { MarketingStrategy as MarketingStrategyType } from './data/mockData';
import AIAssistant from './components/AIAssistant';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Create layout context for AI chat state
const LayoutContext = createContext<{
  isAIChatExpanded: boolean;
  setIsAIChatExpanded: (expanded: boolean) => void;
}>({ isAIChatExpanded: false, setIsAIChatExpanded: () => {} });

export const useLayout = () => useContext(LayoutContext);

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeMenuItem, setActiveMenuItem] = useState<string>('Auto Engagement');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<InspirationAccount | null>(null);
  const [selectedConfigItem, setSelectedConfigItem] = useState<ConfigItem | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<MarketingStrategyType | null>(null);
  const [profileInitialSection, setProfileInitialSection] = useState<string>('overview');
  const [isAIChatExpanded, setIsAIChatExpanded] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate available space for intelligent layout
  const sidebarWidth = 256; // w-64 = 16rem = 256px
  const aiChatWidth = isAIChatExpanded ? Math.min(Math.max(windowWidth * 0.55, 600), 800) : 320; // Expanded: 55vw (min 600px, max 800px), Normal: 320px
  const remainingWidth = windowWidth - sidebarWidth - aiChatWidth;
  const canShowBothPanels = remainingWidth >= 800; // Need at least 800px for both panels

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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-50">
        <div className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full border-4 border-blue-200 animate-spin border-t-[#4792E6]"></div>
          <p className="text-gray-600">正在加载...</p>
        </div>
      </div>
    );
  }

  // 如果用户未登录，显示登录页面
  if (!user) {
    return <Login />;
  }

  // 计划管理相关处理函数
  const handleCreatePlan = async (type: string, query: string) => {
    console.log('创建计划:', { type, query });
    
    // 发送到后端的字段结构
    const createPlanData = {
      planType: type,        // 计划类型：research_website, analyze_results, generate_report 等
      query: query,          // 用户输入的查询内容
      userId: user?.id,      // 用户ID（如果有用户系统）
      timestamp: new Date().toISOString()  // 创建时间戳
    };
    
    try {
      // 实际的API调用示例：
      // const response = await fetch('/api/plans', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${userToken}`
      //   },
      //   body: JSON.stringify(createPlanData)
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('创建计划失败');
      // }
      // 
      // const result = await response.json();
      // console.log('计划创建成功:', result);
      
      console.log('将发送到后端的数据:', createPlanData);
      
    } catch (error) {
      console.error('创建计划失败:', error);
      throw error;
    }
  };

  const handleExecutePlan = async (planId: string) => {
    console.log('执行计划:', planId);
    
    try {
      // 实际的API调用示例：
      // const response = await fetch(`/api/plans/${planId}/execute`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${userToken}`
      //   }
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('执行计划失败');
      // }
      // 
      // const result = await response.json();
      // console.log('计划执行开始:', result);
      
      console.log('执行计划请求:', { planId, timestamp: new Date().toISOString() });
      
    } catch (error) {
      console.error('执行计划失败:', error);
      throw error;
    }
  };

  const handleEditPlan = async (planId: string, updates: any) => {
    console.log('编辑计划:', { planId, updates });
    
    try {
      // 实际的API调用示例：
      // const response = await fetch(`/api/plans/${planId}`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${userToken}`
      //   },
      //   body: JSON.stringify(updates)
      // });
      
      console.log('编辑计划请求:', { planId, updates, timestamp: new Date().toISOString() });
      
    } catch (error) {
      console.error('编辑计划失败:', error);
      throw error;
    }
  };

  const handlePausePlan = async (planId: string) => {
    console.log('暂停计划:', planId);
    
    try {
      // 实际的API调用示例：
      // const response = await fetch(`/api/plans/${planId}/pause`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${userToken}`
      //   }
      // });
      
      console.log('暂停计划请求:', { planId, timestamp: new Date().toISOString() });
      
    } catch (error) {
      console.error('暂停计划失败:', error);
      throw error;
    }
  };

  const handleResumePlan = async (planId: string) => {
    console.log('恢复计划:', planId);
    
    try {
      // 实际的API调用示例：
      // const response = await fetch(`/api/plans/${planId}/resume`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${userToken}`
      //   }
      // });
      
      console.log('恢复计划请求:', { planId, timestamp: new Date().toISOString() });
      
    } catch (error) {
      console.error('恢复计划失败:', error);
      throw error;
    }
  };

  const handleDeletePlan = async (planId: string) => {
    console.log('删除计划:', planId);
    
    try {
      // 实际的API调用示例：
      // const response = await fetch(`/api/plans/${planId}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${userToken}`
      //   }
      // });
      
      console.log('删除计划请求:', { planId, timestamp: new Date().toISOString() });
      
    } catch (error) {
      console.error('删除计划失败:', error);
      throw error;
    }
  };

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
  const showPlanManager = activeMenuItem === 'Plan Manager';
  const showMarketingStrategy = activeMenuItem === 'Marketing Strategy';
  const showConfig = activeMenuItem === 'Config';
  const showProfile = activeMenuItem === 'Profile';

  return (
    <CopilotKit runtimeUrl="https://pilotapi.producthot.top/api/agent">
      <LayoutContext.Provider value={{ isAIChatExpanded, setIsAIChatExpanded }}>
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
              canShowBothPanels ? 'w-1/2' : 'flex-1'
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
              ) : showPlanManager ? (
                <PlanManager
                  onCreatePlan={handleCreatePlan}
                  onExecutePlan={handleExecutePlan}
                  onEditPlan={handleEditPlan}
                  onPausePlan={handlePausePlan}
                  onResumePlan={handleResumePlan}
                  onDeletePlan={handleDeletePlan}
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
            
            {/* Results Area - only show when not Dashboard and not Profile and when there's enough space */}
            {!showDashboard && !showProfile && canShowBothPanels && (
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
          <AIAssistant onExpandedChange={setIsAIChatExpanded} />
        </div>
      </LayoutContext.Provider>
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
          <Route path="/test/execution-plan" element={<ExecutionPlanTest />} />
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;