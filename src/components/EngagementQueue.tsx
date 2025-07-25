import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { mockCards, mockInspirationAccounts } from '../data/mockData';
import { InspirationAccount } from '../types';
import CardItem from './CardItem';
import InspirationAccountCard from './InspirationAccountCard';

interface EngagementQueueProps {
  showInspirationAccounts?: boolean;
}

const EngagementQueue: React.FC<EngagementQueueProps> = ({ showInspirationAccounts = false }) => {
  const [inspirationAccounts, setInspirationAccounts] = useState<InspirationAccount[]>(mockInspirationAccounts);

  const handleToggleTarget = (id: number, isTargeted: boolean) => {
    setInspirationAccounts(prev => 
      prev.map(account => 
        account.id === id ? { ...account, isTargeted } : account
      )
    );
  };

  const totalItems = showInspirationAccounts ? inspirationAccounts.length : mockCards.length;
  const title = showInspirationAccounts ? 'Inspiration Accounts' : 'Activity Queue';

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
        {showInspirationAccounts ? (
          inspirationAccounts.map((account) => (
            <InspirationAccountCard 
              key={account.id} 
              account={account} 
              onToggleTarget={handleToggleTarget}
            />
          ))
        ) : (
          mockCards.map((card) => (
            <CardItem key={card.id} card={card} />
          ))
        )}
      </div>
    </div>
  );
};

export default EngagementQueue;