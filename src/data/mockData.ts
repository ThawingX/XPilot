import { Card, InspirationAccount } from '../types';
import { Target, PenTool, Users, Calendar, User, Settings } from 'lucide-react';

// Mock posts for account profiles
export const mockAccountPosts = {
  1: [ // Elon Musk posts
    {
      id: 101,
      content: "Mars is looking more achievable every day. SpaceX Starship is the key to making life multiplanetary. 🚀",
      time: "2 hours ago",
      stats: { comments: 1200, retweets: 3400, likes: 15600, views: 89000, bookmarks: 890 }
    },
    {
      id: 102,
      content: "Tesla's Full Self-Driving beta is improving rapidly. The neural networks are learning at an incredible pace.",
      time: "6 hours ago",
      stats: { comments: 890, retweets: 2100, likes: 12300, views: 67000, bookmarks: 560 }
    },
    {
      id: 103,
      content: "X (formerly Twitter) will become the everything app. Payments, messaging, social media - all in one place.",
      time: "1 day ago",
      stats: { comments: 2300, retweets: 5600, likes: 23400, views: 156000, bookmarks: 1200 }
    }
  ],
  2: [ // Naval posts
    {
      id: 201,
      content: "Wealth is not about money. Wealth is having assets that earn while you sleep.",
      time: "4 hours ago",
      stats: { comments: 340, retweets: 890, likes: 4500, views: 23000, bookmarks: 670 }
    },
    {
      id: 202,
      content: "The most important skill for entrepreneurs: learning how to learn quickly.",
      time: "1 day ago",
      stats: { comments: 180, retweets: 450, likes: 2800, views: 15000, bookmarks: 420 }
    }
  ],
  3: [ // Paul Graham posts
    {
      id: 301,
      content: "The best startups are often solving problems the founders have themselves.",
      time: "3 hours ago",
      stats: { comments: 120, retweets: 340, likes: 1800, views: 12000, bookmarks: 290 }
    },
    {
      id: 302,
      content: "Writing is thinking. If you can't write clearly, you probably don't understand the problem.",
      time: "8 hours ago",
      stats: { comments: 89, retweets: 230, likes: 1200, views: 8900, bookmarks: 180 }
    }
  ]
};

// Account analytics data
export const mockAccountAnalytics = {
  1: { // Elon Musk
    influence: 98,
    engagement: 12.5,
    reach: "150M+",
    avgLikes: "45K",
    topCategories: ["Technology", "Space", "Automotive"],
    audienceAge: "25-44",
    audienceGender: "65% Male, 35% Female"
  },
  2: { // Naval
    influence: 92,
    engagement: 8.7,
    reach: "2.1M+",
    avgLikes: "4.2K",
    topCategories: ["Business", "Philosophy", "Investing"],
    audienceAge: "28-45",
    audienceGender: "70% Male, 30% Female"
  },
  3: { // Paul Graham
    influence: 89,
    engagement: 6.8,
    reach: "1.8M+",
    avgLikes: "2.8K",
    topCategories: ["Startups", "Programming", "Essays"],
    audienceAge: "25-40",
    audienceGender: "75% Male, 25% Female"
  }
};

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
  { name: 'Config', icon: Settings },
  { name: 'Profile', icon: User },
];