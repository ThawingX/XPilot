import React from 'react';
import { Activity } from 'lucide-react';
import { mockCards } from '../data/mockData';
import CardItem from './CardItem';

const EngagementQueue: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Activity Queue</h2>
          <div className="flex items-center space-x-2">
            <Activity size={20} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-600">
              {mockCards.length} items
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-4 overflow-y-auto max-h-96">
        {mockCards.map((card) => (
          <CardItem key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
};

export default EngagementQueue;