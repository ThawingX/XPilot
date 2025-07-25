import { Card, InspirationAccount } from '../types';
import { Target, PenTool, Users, Calendar, User } from 'lucide-react';

// 对标账号mock数据
export const mockInspirationAccounts: InspirationAccount[] = [
  {
    id: 1,
    name: 'Elon Musk',
    handle: '@elonmusk',
    bio: 'CEO of Tesla, SpaceX, and X. Building the future of sustainable transport and space exploration.',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    followers: 150000000,
    likes: 45000000,
    isTargeted: true,
    starred: true,
    verified: true
  },
  {
    id: 2,
    name: 'Naval Ravikant',
    handle: '@naval',
    bio: 'Entrepreneur, investor, and philosopher. Sharing insights on wealth, happiness, and decision-making.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    followers: 2100000,
    likes: 890000,
    isTargeted: false,
    starred: false,
    verified: true
  },
  {
    id: 3,
    name: 'Paul Graham',
    handle: '@paulg',
    bio: 'Co-founder of Y Combinator. Essays on startups, programming, and life.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    followers: 1800000,
    likes: 650000,
    isTargeted: true,
    starred: true,
    verified: true
  }
];

// 搜索用的额外账号数据
export const mockSearchAccounts: InspirationAccount[] = [
  {
    id: 4,
    name: 'Tim Cook',
    handle: '@tim_cook',
    bio: 'CEO of Apple. Passionate about technology, privacy, and human rights.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    followers: 13500000,
    likes: 2100000,
    isTargeted: false,
    starred: false,
    verified: true
  },
  {
    id: 5,
    name: 'Reid Hoffman',
    handle: '@reidhoffman',
    bio: 'Co-founder of LinkedIn. Partner at Greylock. Entrepreneur and investor.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    followers: 3200000,
    likes: 1200000,
    isTargeted: false,
    starred: false,
    verified: true
  },
  {
    id: 6,
    name: 'Satya Nadella',
    handle: '@satyanadella',
    bio: 'CEO of Microsoft. Empowering every person and organization on the planet to achieve more.',
    avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150',
    followers: 2800000,
    likes: 950000,
    isTargeted: false,
    starred: false,
    verified: true
  },
  {
    id: 7,
    name: 'Marc Benioff',
    handle: '@benioff',
    bio: 'Chairman & CEO of Salesforce. Philanthropist and advocate for equality.',
    avatar: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=150',
    followers: 1900000,
    likes: 780000,
    isTargeted: false,
    starred: false,
    verified: true
  },
  {
    id: 8,
    name: 'Jensen Huang',
    handle: '@jensenhuang',
    bio: 'CEO of NVIDIA. Accelerating AI and computing for the world.',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150',
    followers: 1200000,
    likes: 520000,
    isTargeted: false,
    starred: false,
    verified: true
  },
  {
    id: 9,
    name: 'Susan Wojcicki',
    handle: '@susanwojcicki',
    bio: 'Former CEO of YouTube. Advocate for creators and digital innovation.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    followers: 890000,
    likes: 340000,
    isTargeted: false,
    starred: false,
    verified: true
  },
  {
    id: 10,
    name: 'Brian Chesky',
    handle: '@bchesky',
    bio: 'Co-founder and CEO of Airbnb. Creating a world where anyone can belong anywhere.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    followers: 750000,
    likes: 290000,
    isTargeted: false,
    starred: false,
    verified: true
  }
];

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
  { name: 'Inspiration Accounts', icon: Target },
  { name: 'Tweet Generation', icon: PenTool },
  { name: 'Engagement', icon: Users },
  { name: 'Content Strategy', icon: Calendar },
  { name: 'Profile', icon: User },
];