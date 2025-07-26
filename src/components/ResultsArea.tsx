import React from 'react';
import { MessageSquare, Heart, Repeat2, Bookmark, ExternalLink, Clock, User, Bot, Calendar, Tag, TrendingUp, Star, Users, Eye, MapPin, Link, MessageCircle, Share, BarChart3, Target, Zap, CheckCircle, AlertCircle, ChevronRight, FileText, Lightbulb, TrendingDown, Activity } from 'lucide-react';
import { Card, InspirationAccount } from '../types';
import { ConfigItem } from './Config';
import { VerifiedBadge, formatNumber } from '../utils/cardUtils';
import { mockAccountPosts, mockAccountAnalytics } from '../data/mockData';

interface ResultsAreaProps {
  selectedCard: Card | null;
  selectedAccount: InspirationAccount | null;
  selectedConfigItem: ConfigItem | null;
}

const ResultsArea: React.FC<ResultsAreaProps> = ({ selectedCard, selectedAccount, selectedConfigItem }) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const renderAccountProfile = (account: InspirationAccount) => {
    const accountPosts = mockAccountPosts[account.id] || [];
    const accountAnalytics = mockAccountAnalytics[account.id];

    return (
      <div className="h-full overflow-y-auto">
        {/* Account Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-start space-x-4">
            <img
              src={account.avatar}
              alt={account.name}
              className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-2xl font-bold">{account.name}</h1>
                {account.verified && <VerifiedBadge />}
                {account.starred && <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />}
              </div>
              <p className="text-blue-100 mb-2">@{account.handle}</p>
              <p className="text-sm text-blue-100 mb-4">{account.bio}</p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{formatNumber(account.followers)} followers</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>{formatNumber(account.likes)} likes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Analytics Dashboard */}
          {accountAnalytics && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                Account Analytics
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{accountAnalytics.influence}</div>
                  <div className="text-sm text-gray-600">Influence Score</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{accountAnalytics.engagement}%</div>
                  <div className="text-sm text-gray-600">Engagement Rate</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{formatNumber(accountAnalytics.reach)}</div>
                  <div className="text-sm text-gray-600">Avg Reach</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{formatNumber(accountAnalytics.avgLikes)}</div>
                  <div className="text-sm text-gray-600">Avg Likes</div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Posts */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <MessageSquare className="w-6 h-6 mr-3 text-blue-500" />
                Recent Posts ({accountPosts.length})
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {accountPosts.length > 0 ? (
                accountPosts.map((post) => (
                  <div key={post.id} className="p-8 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-4">
                      <img
                        src={account.avatar}
                        alt={account.name}
                        className="w-12 h-12 rounded-full flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="font-semibold text-gray-900">{account.name}</span>
                          {account.verified && <VerifiedBadge />}
                          <span className="text-gray-500">@{account.handle}</span>
                          <span className="text-gray-500">·</span>
                          <span className="text-gray-500 text-sm">{post.time}</span>
                        </div>
                        <p className="text-gray-900 mb-4 leading-relaxed text-base">{post.content}</p>
                        <div className="flex items-center space-x-8 text-gray-500">
                          <div className="flex items-center space-x-2 hover:text-blue-500 cursor-pointer transition-colors">
                            <MessageSquare className="w-5 h-5" />
                            <span className="text-sm font-medium">{formatNumber(post.stats.comments)}</span>
                          </div>
                          <div className="flex items-center space-x-2 hover:text-green-500 cursor-pointer transition-colors">
                            <Repeat2 className="w-5 h-5" />
                            <span className="text-sm font-medium">{formatNumber(post.stats.retweets)}</span>
                          </div>
                          <div className="flex items-center space-x-2 hover:text-red-500 cursor-pointer transition-colors">
                            <Heart className="w-5 h-5" />
                            <span className="text-sm font-medium">{formatNumber(post.stats.likes)}</span>
                          </div>
                          <div className="flex items-center space-x-2 hover:text-blue-500 cursor-pointer transition-colors">
                            <Eye className="w-5 h-5" />
                            <span className="text-sm font-medium">{formatNumber(post.stats.views || 0)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">No recent posts available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  if (!selectedCard && !selectedAccount && !selectedConfigItem) {
    return (
      <div className="flex flex-1 justify-center items-center bg-white h-full">
        <div className="text-center">
          <div className="flex justify-center items-center mx-auto mb-6 w-20 h-20 bg-blue-50 rounded-full">
            <MessageSquare size={32} className="text-[#4792E6]" />
          </div>
          <h3 className="mb-3 text-xl font-semibold text-gray-900">Select Content to View Details</h3>
          <p className="text-gray-500 text-base">Choose an item from the left to view detailed information</p>
        </div>
      </div>
    );
  }

  // If a config item is selected, show config details
  if (selectedConfigItem) {
    return (
      <div className="h-full bg-gray-50">
        <div className="h-full overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Config Item Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start space-x-4">
                <div className={`flex justify-center items-center w-12 h-12 rounded-lg ${
                  selectedConfigItem.type === 'reply' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  {selectedConfigItem.type === 'reply' ? (
                    <MessageSquare size={24} className="text-[#4792E6]" />
                  ) : (
                    <Repeat2 size={24} className="text-green-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{selectedConfigItem.title}</h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedConfigItem.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedConfigItem.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Target Account: {selectedConfigItem.targetAccount}</span>
                    <span>Created: {selectedConfigItem.time}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reply-specific fields */}
            {selectedConfigItem.type === 'reply' && (
              <>
                {/* Prompt Section */}
                {selectedConfigItem.prompt && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Bot className="w-5 h-5 mr-2 text-blue-500" />
                      Generation Prompt
                    </h2>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-gray-900 leading-relaxed">{selectedConfigItem.prompt}</p>
                    </div>
                  </div>
                )}

                {/* Style Selection - Disabled */}
                {selectedConfigItem.style && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-400 mb-4 flex items-center">
                      <Tag className="w-5 h-5 mr-2 text-gray-400" />
                      Reply Style (Temporarily Disabled)
                    </h2>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-400">Current Style:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedConfigItem.style === 'funny' ? 'bg-gray-100 text-gray-600' :
                          selectedConfigItem.style === 'professional' ? 'bg-gray-100 text-gray-600' :
                          selectedConfigItem.style === 'casual' ? 'bg-gray-100 text-gray-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {selectedConfigItem.style === 'funny' ? 'Humorous' :
                           selectedConfigItem.style === 'professional' ? 'Professional' :
                           selectedConfigItem.style === 'casual' ? 'Casual' : 'Formal'}
                        </span>
                      </div>
                      <select 
                        className="w-full p-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed"
                        defaultValue={selectedConfigItem.style}
                        disabled
                      >
                        <option value="professional">Professional</option>
                        <option value="funny">Humorous</option>
                        <option value="casual">Casual</option>
                        <option value="formal">Formal</option>
                      </select>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Content */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedConfigItem.type === 'reply' ? 'Reply Content' : 'Repost Content'}
              </h2>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-900 leading-relaxed">{selectedConfigItem.content}</p>
              </div>
            </div>



            {/* Statistics (if completed) */}
            {selectedConfigItem.status === 'completed' && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Execution Results</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <div className="text-sm text-gray-600">Interactions</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">89</div>
                    <div className="text-sm text-gray-600">Likes</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">1.2K</div>
                    <div className="text-sm text-gray-600">Views</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">5</div>
                    <div className="text-sm text-gray-600">Reposts</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // If an account is selected, show account profile
  if (selectedAccount) {
    return (
      <div className="h-full bg-gray-50">
        {renderAccountProfile(selectedAccount)}
      </div>
    );
  }

  const renderPostDetails = () => (
    <div className="space-y-6">
      {/* Post Header */}
      <div className="flex items-start space-x-3">
        <img
          src={selectedCard.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedCard.author || 'User')}&background=6366f1&color=fff&size=48`}
          alt={selectedCard.author || 'User'}
          className="object-cover w-12 h-12 rounded-full border border-gray-200"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedCard.author || 'User')}&background=6366f1&color=fff&size=48`;
          }}
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900">{selectedCard.author || 'Unknown User'}</h3>
            <span className="text-gray-500">{selectedCard.handle || '@unknown'}</span>
          </div>
          <div className="flex items-center mt-1 space-x-2">
            <span className="text-sm text-gray-500">{selectedCard.time}</span>
            <ExternalLink size={14} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="leading-relaxed text-gray-900 whitespace-pre-line">{selectedCard.content}</p>
      </div>

      {/* Post Stats */}
      {selectedCard.stats && (
        <div className="flex items-center py-3 space-x-6 border-gray-200 border-y">
          <div className="flex items-center space-x-2 text-gray-600">
            <MessageSquare size={18} />
            <span>{formatNumber(selectedCard.stats.comments)} Comments</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Repeat2 size={18} />
            <span>{formatNumber(selectedCard.stats.retweets)} Retweets</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Heart size={18} />
            <span>{formatNumber(selectedCard.stats.likes)} Likes</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <span>{formatNumber(selectedCard.stats.views)} Views</span>
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
            So true. The biggest paradox of building in public is that the transparency meant to liberate us often becomes another source of pressure. At XPilot we remind ourselves daily that progress isn't linear - and that's perfectly fine.
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