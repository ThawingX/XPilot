import { Card } from '../types';
import { Settings, PenTool, Users, Calendar, User } from 'lucide-react';

// Mock数据集中管理
export const mockCards: Card[] = [
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

// 聊天消息mock数据
export const mockChatMessages = [
  {
    id: 1,
    text: 'Hello! I\'m your AI assistant. How can I help you today?',
    sender: 'ai' as const,
    timestamp: '2:30 PM'
  },
  {
    id: 2,
    text: 'Can you help me analyze the engagement metrics?',
    sender: 'user' as const,
    timestamp: '2:31 PM'
  },
  {
    id: 3,
    text: 'Of course! I can help you analyze your engagement data. Based on your current posts, I see good interaction rates. Would you like me to provide specific insights?',
    sender: 'ai' as const,
    timestamp: '2:31 PM'
  }
];

// 菜单项mock数据
export const mockMenuItems = [
  { name: 'Configuration', icon: Settings },
  { name: 'Tweet Generation', icon: PenTool },
  { name: 'Engagement', icon: Users },
  { name: 'Content Strategy', icon: Calendar },
  { name: 'Profile', icon: User },
];