import React from 'react';
import { MessageSquare, Heart, Repeat2, Bookmark, ExternalLink, Clock, User, Bot, Calendar, Tag, TrendingUp, Star, Users, Eye, MapPin, Link, MessageCircle, Share, BarChart3, Target, Zap, CheckCircle, AlertCircle, ChevronRight, FileText, Lightbulb, TrendingDown, Activity, Twitter, Linkedin, Globe, Sparkles, Copy, Edit3, Trash2, Send } from 'lucide-react';
import { Card, InspirationAccount, Post } from '../types';
import { ConfigItem } from './Config';
import { VerifiedBadge, formatNumber } from '../utils/cardUtils';
import { mockAccountPosts, mockAccountAnalytics } from '../data/mockData';

// Post/Thread types
interface QueueItem {
  id: string;
  type: 'post' | 'thread';
  content: string;
  createdTime: string;
  scheduledTime?: string;
  status: 'draft' | 'scheduled' | 'published';
  platform: 'twitter' | 'linkedin' | 'both';
  threadCount?: number;
  aiGenerated?: boolean;
  tags?: string[];
}

interface ResultsAreaProps {
  selectedCard: Card | null;
  selectedAccount: InspirationAccount | null;
  selectedConfigItem: ConfigItem | null;
  selectedPostId?: string | null;
  selectedPost?: Post | null;
}

const ResultsArea: React.FC<ResultsAreaProps> = ({ selectedCard, selectedAccount, selectedConfigItem, selectedPostId, selectedPost }) => {
  // Mock data for posts and threads
  const mockPosts: QueueItem[] = [
    {
      id: '1',
      type: 'post',
      content: 'Just launched our new AI-powered content generation feature! 🚀 This has been months in the making and we\'re excited to see how it helps creators streamline their workflow. #AI #ContentCreation #ProductLaunch',
      createdTime: '2024-01-15 10:30',
      scheduledTime: '2024-01-15 14:30',
      status: 'scheduled',
      platform: 'twitter',
      aiGenerated: true,
      tags: ['AI', 'ProductLaunch', 'ContentCreation']
    },
    {
      id: '2',
      type: 'post',
      content: 'Building in public: Here\'s what we learned from our first 1000 users... The feedback has been incredible and we\'ve made significant improvements based on your suggestions. Thank you for being part of this journey! 🙏',
      createdTime: '2024-01-14 16:45',
      status: 'draft',
      platform: 'linkedin',
      aiGenerated: true,
      tags: ['BuildingInPublic', 'UserFeedback', 'Growth']
    },
    {
      id: '3',
      type: 'post',
      content: 'The future of social media automation is here. What do you think? 🤔 We believe that AI should enhance human creativity, not replace it. Our tools are designed to help you express your ideas more effectively.',
      createdTime: '2024-01-14 09:15',
      scheduledTime: '2024-01-16 09:00',
      status: 'scheduled',
      platform: 'both',
      aiGenerated: true,
      tags: ['AI', 'Automation', 'Creativity']
    }
  ];

  const mockThreads: QueueItem[] = [
    {
      id: '4',
      type: 'thread',
      content: '1/ How to build a successful SaaS product in 2024: A comprehensive guide 🧵\n\nAfter building multiple products and learning from countless mistakes, here are the key insights that actually matter...',
      createdTime: '2024-01-14 14:20',
      scheduledTime: '2024-01-15 16:00',
      status: 'scheduled',
      platform: 'twitter',
      threadCount: 12,
      aiGenerated: true,
      tags: ['SaaS', 'ProductDevelopment', 'Guide']
    },
    {
      id: '5',
      type: 'thread',
      content: '1/ The psychology behind viral content: What makes people share? 🧠\n\nAfter analyzing thousands of viral posts, we\'ve identified the key psychological triggers that drive engagement...',
      createdTime: '2024-01-13 11:30',
      status: 'draft',
      platform: 'twitter',
      threadCount: 8,
      aiGenerated: true,
      tags: ['Psychology', 'ViralContent', 'Engagement']
    }
  ];

  // Helper functions for post display
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'published': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return <Twitter size={16} className="text-blue-500" />;
      case 'linkedin': return <Linkedin size={16} className="text-blue-600" />;
      case 'both': return <Globe size={16} className="text-gray-600" />;
      default: return <Globe size={16} className="text-gray-600" />;
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleEdit = (postId: string) => {
    console.log('Editing post:', postId);
  };

  const handleDelete = (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      console.log('Deleting post:', postId);
    }
  };

  const handlePublish = (postId: string) => {
    console.log('Publishing post:', postId);
  };

  const renderPostDetails = (post: Post) => {
    return (
      <div className="h-full overflow-y-auto">
        {/* Post Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-start space-x-4">
            <div className="flex justify-center items-center w-16 h-16 bg-white/20 rounded-full">
              <Bot size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold">
                  {post.type === 'thread' ? 'Thread Details' : 'Post Details'}
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(post.status)} bg-white/90`}>
                  {post.status}
                </span>
                {post.aiGenerated && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100/90 text-purple-700 border border-purple-200 flex items-center">
                    <Sparkles size={14} className="mr-1" />
                    AI Generated
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm text-blue-100">
                <div className="flex items-center space-x-2">
                  {getPlatformIcon(post.platform)}
                  <span className="capitalize">{post.platform}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar size={14} />
                  <span>Created: {post.createdTime}</span>
                </div>
                {post.scheduledTime && (
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>Scheduled: {post.scheduledTime}</span>
                  </div>
                )}
                {post.type === 'thread' && (
                  <div className="flex items-center space-x-1">
                    <FileText size={14} />
                    <span>{post.threadCount} tweets</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Post Content */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-blue-500" />
              Content
            </h2>
            <div className="bg-gray-50 rounded-lg p-6 border">
              <p className="text-gray-900 leading-relaxed whitespace-pre-wrap text-base">
                {post.content}
              </p>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-2 text-blue-500" />
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full border border-blue-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-blue-500" />
              Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleCopy(post.content)}
                className="flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Copy size={16} />
                <span>Copy</span>
              </button>
              <button
                onClick={() => handleEdit(post.id)}
                className="flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
              >
                <Edit3 size={16} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
              <button
                onClick={() => handlePublish(post.id)}
                className="flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                <Send size={16} />
                <span>Publish</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
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
  // If a post is selected, show post details
  if (selectedPostId && selectedPost) {
    return (
      <div className="h-full bg-gray-50">
        {renderPostDetails(selectedPost)}
      </div>
    );
  }

  // If no item is selected, show default message
  if (!selectedCard && !selectedAccount && !selectedConfigItem && !selectedPostId) {
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

};

export default ResultsArea;