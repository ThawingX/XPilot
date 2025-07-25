import React from 'react';
import { MessageSquare, Heart, Repeat2, Bookmark, ExternalLink, Clock, User, Bot, Calendar, Tag, TrendingUp } from 'lucide-react';

interface Card {
  id: number;
  type: 'post' | 'tweet' | 'strategy' | 'action';
  title: string;
  content: string;
  author?: {
    name: string;
    handle: string;
    avatar: string;
    verified?: boolean;
  };
  time: string;
  stats?: {
    comments: number;
    retweets: number;
    likes: number;
    views: number;
    bookmarks: number;
  };
  metadata?: any;
}

interface ResultsAreaProps {
  selectedCard: Card | null;
}

const ResultsArea: React.FC<ResultsAreaProps> = ({ selectedCard }) => {
  if (!selectedCard) {
    return (
      <div className="flex flex-1 justify-center items-center bg-white">
        <div className="text-center">
          <div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 bg-gray-100 rounded-full">
            <MessageSquare size={24} className="text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">Select an item to view details</h3>
          <p className="text-gray-500">Choose a post, tweet, strategy, or action from the queue to see detailed information and interactions.</p>
        </div>
      </div>
    );
  }

  const renderPostDetails = () => (
    <div className="space-y-6">
      {/* Post Header */}
      <div className="flex items-start space-x-3">
        <img
          src={selectedCard.author!.avatar}
          alt={selectedCard.author!.name}
          className="object-cover w-12 h-12 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900">{selectedCard.author!.name}</h3>
            {selectedCard.author!.verified && (
              <div className="flex justify-center items-center w-5 h-5 bg-blue-500 rounded-full">
                <span className="text-xs text-white">✓</span>
              </div>
            )}
            <span className="text-gray-500">{selectedCard.author!.handle}</span>
          </div>
          <div className="flex items-center mt-1 space-x-2">
            <span className="text-sm text-gray-500">{selectedCard.time}</span>
            <ExternalLink size={14} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="leading-relaxed text-gray-900">{selectedCard.content}</p>
      </div>

      {/* Post Stats */}
      {selectedCard.stats && (
        <div className="flex items-center py-3 space-x-6 border-gray-200 border-y">
          <div className="flex items-center space-x-2 text-gray-600">
            <MessageSquare size={18} />
            <span>{selectedCard.stats.comments} Comments</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Repeat2 size={18} />
            <span>{selectedCard.stats.retweets} Retweets</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Heart size={18} />
            <span>{selectedCard.stats.likes} Likes</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <span>{selectedCard.stats.views} Views</span>
          </div>
        </div>
      )}

      {/* Suggested Reply */}
      {selectedCard.id === 1 && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center mb-3 space-x-2">
            <Bot size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-900">AI SUGGESTED REPLY</span>
          </div>
          <p className="mb-4 text-gray-700">
            So true. The biggest paradox of building in public is that the transparency meant to liberate us often becomes another source of pressure. At Soshi we remind ourselves daily that progress isn't linear - and that's perfectly fine.
          </p>
          <div className="flex space-x-3">
            <button className="flex-1 px-4 py-2 text-red-600 rounded-lg border border-red-200 transition-colors hover:bg-red-50">
              Reject
            </button>
            <button className="flex-1 px-4 py-2 text-white bg-green-600 rounded-lg transition-colors hover:bg-green-700">
              Post Reply
            </button>
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Recent Comments</h4>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex p-3 space-x-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">User {i}</span>
                  <span className="text-xs text-gray-500">2h ago</span>
                </div>
                <p className="mt-1 text-sm text-gray-700">This is a sample comment on the post...</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStrategyDetails = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="flex justify-center items-center w-12 h-12 bg-purple-100 rounded-lg">
          <TrendingUp size={24} className="text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{selectedCard.title}</h2>
          <p className="text-gray-500">{selectedCard.time}</p>
        </div>
      </div>

      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
        <p className="text-gray-700">{selectedCard.content}</p>
      </div>

      {selectedCard.metadata && (
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center mb-2 space-x-2">
              <Tag size={16} className="text-gray-600" />
              <span className="font-medium text-gray-900">Category</span>
            </div>
            <p className="text-gray-700">{selectedCard.metadata.category}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center mb-2 space-x-2">
              <Calendar size={16} className="text-gray-600" />
              <span className="font-medium text-gray-900">Priority</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-sm font-medium ${
              selectedCard.metadata.priority === 'High' 
                ? 'bg-red-100 text-red-700' 
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {selectedCard.metadata.priority}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Implementation Steps</h4>
        <div className="space-y-2">
          {['Identify target audience segments', 'Create content calendar', 'Develop key messaging', 'Monitor engagement metrics'].map((step, i) => (
            <div key={i} className="flex items-center p-3 space-x-3 bg-gray-50 rounded-lg">
              <div className="flex justify-center items-center w-6 h-6 bg-purple-100 rounded-full">
                <span className="text-sm font-medium text-purple-600">{i + 1}</span>
              </div>
              <span className="text-gray-700">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderActionDetails = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="flex justify-center items-center w-12 h-12 bg-orange-100 rounded-lg">
          <Clock size={24} className="text-orange-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{selectedCard.title}</h2>
          <p className="text-gray-500">{selectedCard.time}</p>
        </div>
      </div>

      <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
        <p className="text-gray-700">{selectedCard.content}</p>
      </div>

      {selectedCard.metadata && (
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center mb-2 space-x-2">
              <User size={16} className="text-gray-600" />
              <span className="font-medium text-gray-900">Assignee</span>
            </div>
            <p className="text-gray-700">{selectedCard.metadata.assignee}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center mb-2 space-x-2">
              <Calendar size={16} className="text-gray-600" />
              <span className="font-medium text-gray-900">Status</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-sm font-medium ${
              selectedCard.metadata.status === 'In Progress' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-green-100 text-green-700'
            }`}>
              {selectedCard.metadata.status}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Action Items</h4>
        <div className="space-y-2">
          {['Review customer feedback', 'Identify pain points', 'Create improvement plan', 'Implement changes'].map((action, i) => (
            <div key={i} className="flex items-center p-3 space-x-3 bg-gray-50 rounded-lg">
              <div className="flex justify-center items-center w-6 h-6 bg-orange-100 rounded-full">
                <span className="text-sm font-medium text-orange-600">{i + 1}</span>
              </div>
              <span className="text-gray-700">{action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (selectedCard.type) {
      case 'post':
      case 'tweet':
        return renderPostDetails();
      case 'strategy':
        return renderStrategyDetails();
      case 'action':
        return renderActionDetails();
      default:
        return renderPostDetails();
    }
  };

  return (
    <div className="overflow-y-auto flex-1 bg-white">
      <div className="p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default ResultsArea;