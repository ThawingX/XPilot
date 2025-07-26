import React, { useState } from 'react';
import { 
  MessageSquare, 
  FileText, 
  Activity, 
  Calendar,
  Clock,
  Send,
  X,
  MoreHorizontal,
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  User
} from 'lucide-react';

interface PostThreadQueueProps {
  onPostClick?: (postId: string) => void;
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
  author: {
    name: string;
    username: string;
    avatar?: string;
  };
}

const PostThreadQueue: React.FC<PostThreadQueueProps> = ({ 
  onPostClick, 
  selectedPostId 
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'threads'>('posts');
  const [selectedPost, setSelectedPost] = useState<QueueItem | null>(null);

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
      author: {
        name: 'XPilot Team',
        username: '@xpilot_ai',
        avatar: '🤖'
      }
    },
    {
      id: '2',
      type: 'post',
      content: 'Building in public: Here\'s what we learned from our first 1000 users... The feedback has been incredible and we\'ve made significant improvements based on your suggestions. Thank you for being part of this journey! 🙏',
      createdTime: '2024-01-14 16:45',
      status: 'draft',
      platform: 'linkedin',
      author: {
        name: 'XPilot Team',
        username: '@xpilot_ai',
        avatar: '🤖'
      }
    },
    {
      id: '3',
      type: 'post',
      content: 'The future of social media automation is here. What do you think? 🤔 We believe that AI should enhance human creativity, not replace it. Our tools are designed to help you express your ideas more effectively.',
      createdTime: '2024-01-14 09:15',
      scheduledTime: '2024-01-16 09:00',
      status: 'scheduled',
      platform: 'both',
      author: {
        name: 'XPilot Team',
        username: '@xpilot_ai',
        avatar: '🤖'
      }
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
      author: {
        name: 'XPilot Team',
        username: '@xpilot_ai',
        avatar: '🤖'
      }
    },
    {
      id: '5',
      type: 'thread',
      content: '1/ The psychology behind viral content: What makes people share? 🧠\n\nAfter analyzing thousands of viral posts, we\'ve identified the key psychological triggers that drive engagement...',
      createdTime: '2024-01-13 11:30',
      status: 'draft',
      platform: 'twitter',
      threadCount: 8,
      author: {
        name: 'XPilot Team',
        username: '@xpilot_ai',
        avatar: '🤖'
      }
    }
  ];

  const getDisplayItems = () => {
    return activeTab === 'posts' ? mockPosts : mockThreads;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-700';
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      case 'published': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return '🐦';
      case 'linkedin': return '💼';
      case 'both': return '🌐';
      default: return '📱';
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

  const handlePostClick = (item: QueueItem) => {
    setSelectedPost(item);
    onPostClick?.(item.id);
  };

  const handleDrop = (itemId: string) => {
    console.log('Dropping post:', itemId);
    // Handle drop logic here
  };

  const handlePost = (itemId: string) => {
    console.log('Posting:', itemId);
    // Handle post logic here
  };

  const displayItems = getDisplayItems();

  return (
    <div className="flex h-full bg-white">
      {/* Main Content */}
      <div className={`${selectedPost ? 'w-1/2' : 'w-full'} flex flex-col border-r border-gray-200`}>
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-gray-200">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Get Post/Thread</h2>
          
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
          <div className="flex items-center space-x-2">
            <Activity size={20} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-600">
              {displayItems.length} {activeTab}
            </span>
          </div>
        </div>
        
        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {displayItems.length === 0 ? (
            <div className="text-center py-8">
              {activeTab === 'posts' ? (
                <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
              ) : (
                <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              )}
              <p className="text-gray-500">
                No {activeTab} in queue
              </p>
            </div>
          ) : (
            displayItems.map((item) => (
              <div
                key={item.id}
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                  selectedPostId === item.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
                onClick={() => handlePostClick(item)}
              >
                <div className="p-4">
                  {/* Post Header */}
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                      {item.author.avatar || <User size={20} className="text-gray-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">{item.author.name}</span>
                        <span className="text-gray-500">{item.author.username}</span>
                        <span className="text-gray-500">·</span>
                        <span className="text-gray-500 text-sm">{formatTime(item.createdTime)}</span>
                        <span className="text-lg">{getPlatformIcon(item.platform)}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                        {item.type === 'thread' && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                            {item.threadCount} tweets
                          </span>
                        )}
                        {item.scheduledTime && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Clock size={12} />
                            <span>Scheduled: {item.scheduledTime}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>

                  {/* Post Content */}
                  <div className="ml-13 mb-3">
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {item.content.length > 200 ? `${item.content.substring(0, 200)}...` : item.content}
                    </p>
                  </div>

                  {/* Post Actions */}
                  <div className="ml-13 flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-gray-500">
                      <button className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
                        <MessageCircle size={16} />
                        <span className="text-sm">0</span>
                      </button>
                      <button className="flex items-center space-x-2 hover:text-green-600 transition-colors">
                        <Repeat2 size={16} />
                        <span className="text-sm">0</span>
                      </button>
                      <button className="flex items-center space-x-2 hover:text-red-600 transition-colors">
                        <Heart size={16} />
                        <span className="text-sm">0</span>
                      </button>
                      <button className="hover:text-blue-600 transition-colors">
                        <Share size={16} />
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDrop(item.id);
                        }}
                        className="px-3 py-1 text-sm font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                      >
                        Drop
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePost(item.id);
                        }}
                        className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Post Detail Panel */}
      {selectedPost && (
        <div className="w-1/2 flex flex-col bg-white">
          {/* Detail Header */}
          <div className="flex-shrink-0 p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Post Details</h3>
            <button
              onClick={() => setSelectedPost(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Detail Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-lg mx-auto">
              {/* Post Header */}
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl">
                  {selectedPost.author.avatar || <User size={24} className="text-gray-500" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-900">{selectedPost.author.name}</span>
                    <span className="text-gray-500">{selectedPost.author.username}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-gray-500 text-sm">{selectedPost.createdTime}</span>
                    <span className="text-lg">{getPlatformIcon(selectedPost.platform)}</span>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-gray-900 text-lg leading-relaxed whitespace-pre-wrap">
                  {selectedPost.content}
                </p>
              </div>

              {/* Post Meta */}
              <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPost.status)}`}>
                  {selectedPost.status}
                </span>
                {selectedPost.type === 'thread' && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    {selectedPost.threadCount} tweets
                  </span>
                )}
                {selectedPost.scheduledTime && (
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>Scheduled: {selectedPost.scheduledTime}</span>
                  </div>
                )}
              </div>

              {/* Post Actions */}
              <div className="flex items-center justify-between py-3 border-t border-gray-200">
                <div className="flex items-center space-x-8 text-gray-500">
                  <button className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
                    <MessageCircle size={18} />
                    <span>0</span>
                  </button>
                  <button className="flex items-center space-x-2 hover:text-green-600 transition-colors">
                    <Repeat2 size={18} />
                    <span>0</span>
                  </button>
                  <button className="flex items-center space-x-2 hover:text-red-600 transition-colors">
                    <Heart size={18} />
                    <span>0</span>
                  </button>
                  <button className="hover:text-blue-600 transition-colors">
                    <Share size={18} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => handleDrop(selectedPost.id)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                >
                  Drop
                </button>
                <button
                  onClick={() => handlePost(selectedPost.id)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Post Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostThreadQueue;