import React from 'react';
import { MessageSquare, Heart, Repeat2, Clock, User, TrendingUp, Target, CheckCircle } from 'lucide-react';

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

interface EngagementQueueProps {
  onCardSelect: (card: Card) => void;
  selectedCardId?: number;
}

const EngagementQueue: React.FC<EngagementQueueProps> = ({ onCardSelect, selectedCardId }) => {
  const mockData: Card[] = [
    {
      id: 1,
      type: 'post',
      title: 'Building in Public Discussion',
      content: 'Building in public is both liberating and terrifying. You get real-time feedback, but also real-time judgment. The key is finding the balance between transparency and vulnerability.',
      author: {
        name: 'Sarah Chen',
        handle: '@sarahbuilds',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        verified: true
      },
      time: '2 hours ago',
      stats: {
        comments: 24,
        retweets: 12,
        likes: 89,
        views: 1200,
        bookmarks: 15
      }
    },
    {
      id: 2,
      type: 'tweet',
      title: 'Product Launch Tweet',
      content: '🚀 Just shipped our biggest update yet! New AI-powered insights, improved dashboard, and 3x faster performance. What feature should we build next?',
      author: {
        name: 'Alex Rodriguez',
        handle: '@alexbuilds',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        verified: false
      },
      time: '4 hours ago',
      stats: {
        comments: 45,
        retweets: 67,
        likes: 234,
        views: 5600,
        bookmarks: 32
      }
    },
    {
      id: 3,
      type: 'strategy',
      title: 'Q4 Content Strategy',
      content: 'Focus on educational content that showcases our expertise while building trust with potential customers. Emphasize case studies and behind-the-scenes content.',
      time: '1 day ago',
      metadata: {
        category: 'Content Marketing',
        priority: 'High',
        deadline: '2024-01-15'
      }
    },
    {
      id: 4,
      type: 'action',
      title: 'Respond to Customer Feedback',
      content: 'Address the recent feedback about onboarding complexity. Create a response strategy and implement improvements.',
      time: '3 hours ago',
      metadata: {
        priority: 'Medium',
        assignee: 'Product Team',
        status: 'In Progress'
      }
    },
    {
      id: 5,
      type: 'post',
      title: 'Industry Insights',
      content: 'The future of SaaS isn\'t just about features—it\'s about creating experiences that feel intuitive and human. We\'re seeing a shift towards more personalized, context-aware applications.',
      author: {
        name: 'Maya Patel',
        handle: '@mayatech',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        verified: true
      },
      time: '6 hours ago',
      stats: {
        comments: 18,
        retweets: 34,
        likes: 156,
        views: 2800,
        bookmarks: 28
      }
    }
  ];

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'post':
        return <MessageSquare size={16} className="text-blue-600" />;
      case 'tweet':
        return <MessageSquare size={16} className="text-sky-600" />;
      case 'strategy':
        return <TrendingUp size={16} className="text-purple-600" />;
      case 'action':
        return <Target size={16} className="text-orange-600" />;
      default:
        return <MessageSquare size={16} className="text-gray-600" />;
    }
  };

  const getCardBorderColor = (type: string) => {
    switch (type) {
      case 'post':
        return 'border-l-blue-500';
      case 'tweet':
        return 'border-l-sky-500';
      case 'strategy':
        return 'border-l-purple-500';
      case 'action':
        return 'border-l-orange-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return (
    <div className="flex flex-col w-96 bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="mb-2 text-xl font-semibold text-gray-900">Engagement Queue</h2>
        <p className="text-sm text-gray-600">
          {mockData.length} items requiring attention
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
          {mockData.map((card) => (
            <div
              key={card.id}
              onClick={() => onCardSelect(card)}
              className={`p-4 rounded-lg border-l-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                getCardBorderColor(card.type)
              } ${
                selectedCardId === card.id 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-white border-gray-200'
              }`}
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  {getCardIcon(card.type)}
                  <span className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                    {card.type}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{card.time}</span>
              </div>

              {/* Card Content */}
              <h3 className="mb-2 font-medium text-gray-900 line-clamp-1">
                {card.title}
              </h3>
              <p className="mb-3 text-sm text-gray-600 line-clamp-2">
                {card.content}
              </p>

              {/* Author Info (for posts/tweets) */}
              {card.author && (
                <div className="flex items-center mb-2 space-x-2">
                  <img
                    src={card.author.avatar}
                    alt={card.author.name}
                    className="object-cover w-6 h-6 rounded-full"
                  />
                  <span className="text-xs text-gray-600">{card.author.name}</span>
                  {card.author.verified && (
                    <div className="flex justify-center items-center w-3 h-3 bg-blue-500 rounded-full">
                      <span className="text-xs text-white">✓</span>
                    </div>
                  )}
                </div>
              )}

              {/* Stats (for posts/tweets) */}
              {card.stats && (
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <MessageSquare size={12} />
                    <span>{card.stats.comments}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart size={12} />
                    <span>{card.stats.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Repeat2 size={12} />
                    <span>{card.stats.retweets}</span>
                  </div>
                </div>
              )}

              {/* Metadata (for strategies/actions) */}
              {card.metadata && (
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    card.metadata.priority === 'High' 
                      ? 'bg-red-100 text-red-700' 
                      : card.metadata.priority === 'Medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {card.metadata.priority}
                  </span>
                  {card.metadata.status && (
                    <div className="flex items-center space-x-1">
                      <CheckCircle size={12} className="text-green-500" />
                      <span className="text-xs text-gray-600">{card.metadata.status}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EngagementQueue;