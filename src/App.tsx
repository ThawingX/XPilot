import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import EngagementQueue from './components/EngagementQueue';
import ResultsArea from './components/ResultsArea';
import RightSidebar from './components/RightSidebar';
import { Card } from './types/index';

function App() {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [activeMenuItem, setActiveMenuItem] = useState<string>('');

  const handleMenuItemClick = (itemName: string) => {
    setActiveMenuItem(itemName);
  };

  const showInspirationAccounts = activeMenuItem === 'Inspiration Accounts';

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <Sidebar onMenuItemClick={handleMenuItemClick} />
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Activity Queue - 1/5 of main content */}
        <div className="w-1/5 min-w-0">
          <EngagementQueue showInspirationAccounts={showInspirationAccounts} />
        </div>
        
        {/* Results Area - 4/5 of main content */}
        <div className="flex-1 min-w-0">
          <ResultsArea selectedCard={selectedCard} />
        </div>
      </div>
      
      {/* Right Sidebar */}
      <RightSidebar />
    </div>
  );
}

export default App;