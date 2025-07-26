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

// Inspiration accounts mock data
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

// Additional account data for search
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

// Centralized mock data management
export const mockCards: Card[] = [
  {
    id: '1',
    type: 'post',
    title: 'Building in Public Discussion',
    content: 'Building in public is both liberating and terrifying. You get real-time feedback, but also real-time judgment. The key is finding the balance between transparency and vulnerability.',
    author: 'Sarah Chen',
    handle: '@sarahbuilds',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    time: '2 hours ago',
    likes: 89,
    retweets: 12,
    replies: 24,
    views: 1200,
    stats: {
      comments: 24,
      retweets: 12,
      likes: 89,
      views: 1200,
      bookmarks: 15
    },
    suggestedReply: 'Great perspective! Building in public has definitely helped me connect with my audience more authentically. The vulnerability aspect is challenging but ultimately rewarding.'
  },
  {
    id: '2',
    type: 'tweet',
    title: 'Product Launch Tweet',
    content: '🚀 Just shipped our biggest update yet! New AI-powered insights, improved dashboard, and 3x faster performance. What feature should we build next?',
    author: 'Alex Rodriguez',
    handle: '@alexbuilds',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    time: '4 hours ago',
    likes: 234,
    retweets: 67,
    replies: 45,
    views: 5600,
    stats: {
      comments: 45,
      retweets: 67,
      likes: 234,
      views: 5600,
      bookmarks: 32
    },
    suggestedReply: 'Congratulations on the launch! 🎉 The AI-powered insights sound fascinating. I\'d love to see more automation features for content scheduling and analytics.'
  },
  {
    id: '3',
    type: 'strategy',
    title: 'Q4 Content Strategy',
    content: 'Focus on educational content that showcases our expertise while building trust with potential customers. Emphasize case studies and behind-the-scenes content.',
    author: 'Maya Patel',
    handle: '@mayatech',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    time: '1 day ago',
    likes: 156,
    retweets: 34,
    replies: 18,
    views: 2800,
    stats: {
      comments: 18,
      retweets: 34,
      likes: 156,
      views: 2800,
      bookmarks: 28
    },
    metadata: {
      category: 'Content Marketing',
      priority: 'High',
      deadline: '2024-01-15'
    },
    suggestedReply: 'This strategy aligns perfectly with what we\'re seeing work in the market. Case studies especially resonate well with B2B audiences. Have you considered adding video testimonials?'
  }
];

// Mock data specifically for AutoReply
export const mockAutoReplyData: Card[] = [
  {
    id: 'ar1',
    type: 'tweet',
    content: 'The worst part of building in public?\n\nFeeling like you\'re behind...\n...even when no one\'s actually racing you.',
    author: 'Raju Vishwas',
    handle: '@rajuvishwas',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    time: '1:45 PM · Mar 27, 2023',
    likes: 164,
    retweets: 6,
    replies: 8,
    views: 1240,
    stats: {
      comments: 8,
      retweets: 6,
      likes: 164,
      views: 1240,
      bookmarks: 23
    },
    suggestedReply: 'So true. The biggest paradox of building in public is that the transparency meant to liberate often becomes another source of pressure. At XPilot we remind ourselves daily that progress isn\'t linear - and that\'s perfectly fine.'
  },
  {
    id: 'ar2',
    type: 'tweet',
    content: 'Just launched our new AI-powered analytics dashboard! 🚀\n\nReal-time insights, predictive modeling, and automated reporting all in one place.\n\nWhat metrics matter most to your business?',
    author: 'Emma Thompson',
    handle: '@emmabuild',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    time: '3:22 PM · Mar 27, 2023',
    likes: 89,
    retweets: 23,
    replies: 15,
    views: 2100,
    stats: {
      comments: 15,
      retweets: 23,
      likes: 89,
      views: 2100,
      bookmarks: 12
    },
    suggestedReply: 'Congratulations on the launch! 🎉 For our team, customer acquisition cost and lifetime value are the key metrics we track. Does your dashboard support custom metric calculations?'
  },
  {
    id: 'ar3',
    type: 'tweet',
    content: 'Hot take: Most "productivity" tools actually make you less productive.\n\nThey add complexity instead of removing friction.\n\nSimplicity wins every time.',
    author: 'David Kim',
    handle: '@davidkimtech',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    time: '11:15 AM · Mar 27, 2023',
    likes: 342,
    retweets: 78,
    replies: 45,
    views: 5600,
    stats: {
      comments: 45,
      retweets: 78,
      likes: 342,
      views: 5600,
      bookmarks: 67
    },
    suggestedReply: 'Absolutely agree! We\'ve seen this pattern repeatedly. The best tools feel invisible - they solve problems without creating new ones. What\'s your go-to simple productivity setup?'
  }
];

// Chat messages mock data
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

// Menu items mock data
export const mockMenuItems = [
  { name: 'Inspiration Accounts', icon: Target },
  { name: 'Engagement', icon: Users },
  { name: 'Tweet Generation', icon: PenTool },
  { name: 'Content Strategy', icon: Calendar },
  { name: 'Config', icon: Settings },
  { name: 'Profile', icon: User },
];