import React from 'react';
import { Card } from '../types';
import { mockCards } from '../data/mockData';
import CardItem from './CardItem';

interface EngagementQueueProps {
  onCardSelect: (card: Card) => void;
  selectedCardId?: number;
}

const EngagementQueue: React.FC<EngagementQueueProps> = ({ onCardSelect, selectedCardId }) => {
  return (
    <div className="flex flex-col w-96 bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="mb-2 text-xl font-semibold text-gray-900">Engagement Queue</h2>
        <p className="text-sm text-gray-600">
          {mockCards.length} items requiring attention
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex p-1 space-x-1 bg-gray-100 rounded-lg">
          <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-900 bg-white rounded-md shadow-sm">
            All
          </button>
          <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
            Posts
          </button>
          <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
            Actions
          </button>
        </div>
      </div>

      {/* Queue Items */}
      <div className="overflow-y-auto flex-1">
        <div className="p-4 space-y-1">
          {mockCards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              isSelected={selectedCardId === card.id}
              onClick={onCardSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EngagementQueue;