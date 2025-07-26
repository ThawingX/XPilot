import React, { useState } from 'react';
import { 
  MessageSquare, 
  FileText, 
  Clock, 
  Calendar, 
  Activity, 
  Send, 
  Trash2, 
  Bot, 
  Sparkles, 
  Globe, 
  Twitter, 
  Linkedin,
  Copy,
  Edit3,
  X,
  ArrowLeft,
  Plus,
  PenTool
} from 'lucide-react';

interface PostThreadQueueProps {
  onPostClick?: (post: QueueItem) => void;
  selectedPostId?: string;
}

interface QueueItem {
  id: string;
  type: 'post' | 'thread';
  content: string;
  createdTime: string;
  scheduledTime?: string;
  status: 'draft' | 'scheduled' | 'published';
  platform: 'twitter' | 'linkedin' | 'both';
  threadCount?: number;
  aiGenerated: boolean;
  tags?: string[];
}

const PostThreadQueue: React.FC<PostThreadQueueProps> = ({ 
  onPostClick, 
  selectedPostId 
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'threads'>('posts');

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

  const getDisplayItems = () => {
    return activeTab === 'posts' ? mockPosts : mockThreads;
  };

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

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    return date.toLocaleDateString();
  };

  const handleCardClick = (item: QueueItem) => {
    onPostClick?.(item);
  };

  const handleDelete = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this post?')) {
      console.log('Deleting post:', itemId);
      // Handle delete logic here
    }
  };

  const handlePublish = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Publishing post:', itemId);
    // Handle publish logic here
  };

  const handleEdit = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Editing post:', itemId);
    // Handle edit logic here
  };

  const handleCopy = (content: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(content);
    // Could show a toast notification here
  };

  const handleCreateNew = () => {
    console.log('Creating new post/thread');
    // Handle create new post/thread logic here
  };

  const displayItems = getDisplayItems();

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <PenTool className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Get Post/Threads</h2>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-4">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'posts'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageSquare size={16} />
            <span className="hidden sm:inline">Posts</span>
          </button>
          <button
            onClick={() => setActiveTab('threads')}
            className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'threads'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText size={16} />
            <span className="hidden sm:inline">Threads</span>
          </button>
        </div>

        {/* Items Count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity size={20} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-600">
              {displayItems.length} {activeTab}
            </span>
          </div>
          <button
            onClick={handleCreateNew}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
          >
            <Plus size={16} />
            <span>New {activeTab.slice(0, -1)}</span>
          </button>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="overflow-y-auto flex-1 p-6">
        {/* Posts List View */}
        <div className="space-y-4">
          {displayItems.length === 0 ? (
            <div className="text-center py-12">
              {activeTab === 'posts' ? (
                <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
              ) : (
                <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              )}
              <p className="text-gray-500 text-lg">
                No {activeTab} in queue
              </p>
            </div>
          ) : (
            displayItems.map((item) => (
              <div
                key={item.id}
                className={`border rounded-lg p-4 transition-all duration-200 cursor-pointer hover:shadow-md bg-white hover:border-gray-300 ${
                  selectedPostId === item.id ? 'border-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => handleCardClick(item)}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    {item.aiGenerated && (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200 flex items-center">
                        <Sparkles size={12} className="mr-1" />
                        AI Generated
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {getPlatformIcon(item.platform)}
                    <span className="text-xs text-gray-500">{formatTime(item.createdTime)}</span>
                  </div>
                </div>

                {/* Content Preview */}
                <div className="mb-3">
                  <p className="text-gray-900 text-sm leading-relaxed">
                    {item.content.length > 120 ? `${item.content.substring(0, 120)}...` : item.content}
                  </p>
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {item.type === 'thread' && (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                        {item.threadCount} tweets
                      </span>
                    )}
                    {item.scheduledTime && (
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock size={12} />
                        <span>{new Date(item.scheduledTime).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => handleCopy(item.content, e)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Copy content"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete post"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {item.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        +{item.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PostThreadQueue;