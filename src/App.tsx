import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import EngagementQueue from './components/EngagementQueue';
import PostThreadQueue from './components/PostThreadQueue';
import ResultsArea from './components/ResultsArea';
import Config, { ConfigItem } from './components/Config';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard';
import { Card, InspirationAccount, Post } from './types/index';
import AIAssistant from './components/AIAssistant';

function App() {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<InspirationAccount | null>(null);
  const [selectedConfigItem, setSelectedConfigItem] = useState<ConfigItem | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [activeMenuItem, setActiveMenuItem] = useState<string>('Dashboard');
  const [profileInitialSection, setProfileInitialSection] = useState<string>('overview');

  const handleMenuItemClick = (itemName: string) => {
    setActiveMenuItem(itemName);
    // Clear other selection states
    setSelectedCard(null);
    setSelectedAccount(null);
    setSelectedConfigItem(null);
    setSelectedPostId(null);
    setSelectedPost(null);
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
  };

  const handleAccountClick = (account: InspirationAccount) => {
    setSelectedAccount(account);
    setSelectedCard(null);
    setSelectedConfigItem(null);
    setSelectedPostId(null);
    setSelectedPost(null);
  };

  const handleConfigItemClick = (item: ConfigItem) => {
    setSelectedConfigItem(item);
    setSelectedCard(null);
    setSelectedAccount(null);
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
  const showConfig = activeMenuItem === 'Config';
  const showProfile = activeMenuItem === 'Profile';

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <Sidebar 
        onMenuItemClick={handleMenuItemClick} 
        activeMenuItem={activeMenuItem}
      />
      
      {/* Main Content Area */}
      <div className="flex overflow-hidden flex-1">
        {/* Activity Queue / Config / Profile / Dashboard */}
        <div className={`${
          showDashboard ? 'w-full' : 
          showProfile ? 'w-2/3' : 
          'w-1/3'
        } min-w-0`}>
          {showDashboard ? (
            <Dashboard onNavigate={handleDashboardNavigate} />
          ) : showProfile ? (
            <Profile initialSection={profileInitialSection} />
          ) : showConfig ? (
            <Config 
              onItemClick={handleConfigItemClick} 
              selectedItemId={selectedConfigItem?.id?.toString()}
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
        
        {/* Results Area - only show when not Dashboard and not Profile without selection */}
        {!showDashboard && (
          <div className={`${showProfile ? 'w-1/3' : 'flex-1'} min-w-0`}>
            {showProfile ? (
              // Profile placeholder content
              <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 rounded-lg border border-gray-200 shadow-sm relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl animate-pulse"></div>
                  <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>
                
                {/* Content */}
                <div className="flex-1 flex items-center justify-center relative z-10">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-bounce"></div>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Profile Overview</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                      Manage your profile settings and view your social media analytics from the left panel.
                    </p>
                    <div className="mt-6 flex justify-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <ResultsArea 
              selectedCard={selectedCard} 
              selectedAccount={selectedAccount} 
              selectedConfigItem={selectedConfigItem}
              selectedPostId={selectedPostId}
              selectedPost={selectedPost}
            />
            )}
          </div>
        )}
      </div>
      
      {/* Vibe X Operation - Right Sidebar */}
      <AIAssistant />
    </div>
  );
}

export default App;