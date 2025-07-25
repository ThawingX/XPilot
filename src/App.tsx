import React from 'react';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import EngagementQueue from './components/EngagementQueue';
import ResultsArea from './components/ResultsArea';
import RightSidebar from './components/RightSidebar';
import { Card } from './types';

function App() {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const handleCardSelect = (card: Card) => {
    setSelectedCard(card);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <EngagementQueue onCardSelect={handleCardSelect} selectedCardId={selectedCard?.id} />
      <ResultsArea selectedCard={selectedCard} />
      <RightSidebar />
    </div>
  );
}

export default App;