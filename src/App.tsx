import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import EngagementQueue from './components/EngagementQueue';
import ResultsArea from './components/ResultsArea';
import RightSidebar from './components/RightSidebar';
import { Card, InspirationAccount } from './types/index';

function App() {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<InspirationAccount | null>(null);
  const [activeMenuItem, setActiveMenuItem] = useState<string>('');

  const handleMenuItemClick = (itemName: string) => {
    setActiveMenuItem(itemName);
  };

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
    setSelectedAccount(null); // Clear account selection when card is selected
  };

  const handleAccountClick = (account: InspirationAccount) => {
    setSelectedAccount(account);
    setSelectedCard(null); // Clear card selection when account is selected
  };

  const showInspirationAccounts = activeMenuItem === 'Inspiration Accounts';

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <Sidebar onMenuItemClick={handleMenuItemClick} />
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Activity Queue - 1/4 of main content when showing inspiration accounts, 1/5 otherwise */}
        <div className={`${showInspirationAccounts ? 'w-1/4' : 'w-1/5'} min-w-0`}>
          <EngagementQueue 
            showInspirationAccounts={showInspirationAccounts} 
            onCardClick={handleCardClick}
            onAccountClick={handleAccountClick}
          />
        </div>
        
        {/* Results Area - remaining space */}
        <div className="flex-1 min-w-0">
          <ResultsArea 
            selectedCard={selectedCard} 
            selectedAccount={selectedAccount}
          />
        </div>
      </div>
      
      {/* Right Sidebar */}
      <RightSidebar />
    </div>
  );
}

export default App;