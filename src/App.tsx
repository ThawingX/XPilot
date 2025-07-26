import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import EngagementQueue from './components/EngagementQueue';
import ResultsArea from './components/ResultsArea';
import Config, { ConfigItem } from './components/Config';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard';
import { Card, InspirationAccount } from './types/index';
import AIAssistant from './components/AIAssistant';

function App() {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<InspirationAccount | null>(null);
  const [selectedConfigItem, setSelectedConfigItem] = useState<ConfigItem | null>(null);
  const [activeMenuItem, setActiveMenuItem] = useState<string>('Dashboard');

  const handleMenuItemClick = (itemName: string) => {
    setActiveMenuItem(itemName);
    // Clear other selection states
    setSelectedCard(null);
    setSelectedAccount(null);
    setSelectedConfigItem(null);
  };

  const handleDashboardNavigate = (section: string) => {
    setActiveMenuItem(section);
    setSelectedCard(null);
    setSelectedAccount(null);
    setSelectedConfigItem(null);
  };

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
    setSelectedAccount(null);
    setSelectedConfigItem(null);
  };

  const handleAccountClick = (account: InspirationAccount) => {
    setSelectedAccount(account);
    setSelectedCard(null);
    setSelectedConfigItem(null);
  };

  const handleConfigItemClick = (item: ConfigItem) => {
    setSelectedConfigItem(item);
    setSelectedCard(null);
    setSelectedAccount(null);
  };

  const showDashboard = activeMenuItem === 'Dashboard';
  const showInspirationAccounts = activeMenuItem === 'Inspiration Accounts';
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
        {/* Activity Queue / Config / Profile / Dashboard - increased width to fit content */}
        <div className={`${showDashboard ? 'w-1/3' : showInspirationAccounts ? 'w-1/3' : showConfig ? 'w-1/3' : showProfile ? 'w-1/3' : 'w-2/5'} min-w-0`}>
          {showDashboard ? (
            <Dashboard onNavigate={handleDashboardNavigate} />
          ) : showProfile ? (
            <Profile />
          ) : showConfig ? (
            <Config 
              onItemClick={handleConfigItemClick} 
              selectedItemId={selectedConfigItem?.id?.toString()}
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
        
        {/* Results Area - remaining space */}
        <div className="flex-1 min-w-0">
          <ResultsArea 
            selectedCard={selectedCard} 
            selectedAccount={selectedAccount}
            selectedConfigItem={selectedConfigItem}
          />
        </div>
      </div>
      
      {/* Vibe X Operation - Right Sidebar */}
      <AIAssistant />
    </div>
  );
}

export default App;