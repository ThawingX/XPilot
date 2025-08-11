import { Card } from '../types';
import { Crosshair, PenTool, Users, Calendar, User, Settings, LayoutDashboard, Send, Brain, BarChart3, Heart, MessageSquare, Target } from 'lucide-react';

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

// Marketing Strategy data
export interface MarketingStrategy {
  id: string;
  type: 'content' | 'operation' | 'engagement' | 'growth' | 'analytics';
  title: string;
  description: string;
  status: 'active' | 'draft' | 'completed';
  priority: 'high' | 'medium' | 'low';
  createdDate: string;
  lastUpdated: string;
  metrics?: {
    reach?: number;
    engagement?: number;
    conversion?: number;
  };
}

export interface ContentScheduleItem {
  id: string;
  day: string;
  timeSlot: string;
  activity: 'post' | 'engagement' | 'analysis' | 'planning';
  content: string;
  platform: string[];
  status: 'scheduled' | 'completed' | 'pending';
}

export const mockMarketingStrategies: MarketingStrategy[] = [
  {
    id: 'ms1',
    type: 'content',
    title: 'Content Strategy - Q1 2024',
    description: 'Focus on educational content that showcases our expertise while building trust with potential customers. Emphasize case studies and behind-the-scenes content.',
    status: 'active',
    priority: 'high',
    createdDate: '2024-01-01',
    lastUpdated: '2024-01-15',
    metrics: {
      reach: 125000,
      engagement: 8.5,
      conversion: 3.2
    }
  },
  {
    id: 'ms2',
    type: 'engagement',
    title: 'Engagement Strategy - Community Building',
    description: 'Enhance brand influence through active interaction and community engagement. Focus on interactions with industry KOLs and potential customers.',
    status: 'active',
    priority: 'high',
    createdDate: '2024-01-05',
    lastUpdated: '2024-01-20',
    metrics: {
      reach: 89000,
      engagement: 12.3,
      conversion: 5.1
    }
  },
  {
    id: 'ms3',
    type: 'operation',
    title: 'Operation Strategy - Automation Process',
    description: 'Optimize content publishing workflow, implement automated replies and interactions. Improve operational efficiency and response speed.',
    status: 'draft',
    priority: 'medium',
    createdDate: '2024-01-10',
    lastUpdated: '2024-01-22',
    metrics: {
      reach: 45000,
      engagement: 6.8,
      conversion: 2.9
    }
  },
  {
    id: 'ms4',
    type: 'growth',
    title: 'Growth Strategy - User Acquisition',
    description: 'Expand user base through multi-channel marketing and partnerships. Focus on high-value user segments.',
    status: 'active',
    priority: 'high',
    createdDate: '2024-01-12',
    lastUpdated: '2024-01-25',
    metrics: {
      reach: 156000,
      engagement: 9.7,
      conversion: 4.3
    }
  },
  {
    id: 'ms5',
    type: 'analytics',
    title: 'Analytics Strategy - Data Intelligence',
    description: 'Establish comprehensive data tracking and analysis system to optimize marketing ROI and user conversion paths.',
    status: 'draft',
    priority: 'medium',
    createdDate: '2024-01-15',
    lastUpdated: '2024-01-28',
    metrics: {
      reach: 32000,
      engagement: 5.4,
      conversion: 2.1
    }
  }
];

export const mockContentSchedule: ContentScheduleItem[] = [
  // Monday
  {
    id: 'cs1',
    day: 'Monday',
    timeSlot: '09:00',
    activity: 'post',
    content: 'Publish tech tutorial: How to optimize social media marketing with AI',
    platform: ['Twitter', 'LinkedIn'],
    status: 'scheduled'
  },
  {
    id: 'cs2',
    day: 'Monday',
    timeSlot: '14:00',
    activity: 'engagement',
    content: 'Reply to user comments, participate in industry discussions',
    platform: ['Twitter', 'LinkedIn'],
    status: 'scheduled'
  },
  {
    id: 'cs3',
    day: 'Monday',
    timeSlot: '18:00',
    activity: 'post',
    content: 'Share customer success stories',
    platform: ['Twitter'],
    status: 'scheduled'
  },
  // Tuesday
  {
    id: 'cs4',
    day: 'Tuesday',
    timeSlot: '10:00',
    activity: 'post',
    content: 'Publish product updates and new feature introductions',
    platform: ['Twitter', 'LinkedIn'],
    status: 'scheduled'
  },
  {
    id: 'cs5',
    day: 'Tuesday',
    timeSlot: '15:00',
    activity: 'engagement',
    content: 'Interact with KOLs, build partnerships',
    platform: ['Twitter'],
    status: 'scheduled'
  },
  {
    id: 'cs6',
    day: 'Tuesday',
    timeSlot: '19:00',
    activity: 'analysis',
    content: 'Analyze yesterday\'s content performance, adjust strategy',
    platform: ['Dashboard'],
    status: 'pending'
  },
  // Wednesday
  {
    id: 'cs7',
    day: 'Wednesday',
    timeSlot: '09:30',
    activity: 'post',
    content: 'Publish industry insights and trend analysis',
    platform: ['LinkedIn'],
    status: 'scheduled'
  },
  {
    id: 'cs8',
    day: 'Wednesday',
    timeSlot: '13:00',
    activity: 'engagement',
    content: 'Participate in Twitter Space discussions',
    platform: ['Twitter'],
    status: 'scheduled'
  },
  {
    id: 'cs9',
    day: 'Wednesday',
    timeSlot: '17:00',
    activity: 'post',
    content: 'Share behind-the-scenes team stories',
    platform: ['Twitter', 'LinkedIn'],
    status: 'scheduled'
  },
  // Thursday
  {
    id: 'cs10',
    day: 'Thursday',
    timeSlot: '11:00',
    activity: 'post',
    content: 'Publish user-generated content and feedback',
    platform: ['Twitter'],
    status: 'scheduled'
  },
  {
    id: 'cs11',
    day: 'Thursday',
    timeSlot: '16:00',
    activity: 'engagement',
    content: 'Reply to DMs, handle customer inquiries',
    platform: ['Twitter', 'LinkedIn'],
    status: 'scheduled'
  },
  {
    id: 'cs12',
    day: 'Thursday',
    timeSlot: '20:00',
    activity: 'planning',
    content: 'Plan next week\'s content calendar',
    platform: ['Dashboard'],
    status: 'pending'
  },
  // Friday
  {
    id: 'cs13',
    day: 'Friday',
    timeSlot: '10:30',
    activity: 'post',
    content: 'Publish weekly summary and next week preview',
    platform: ['Twitter', 'LinkedIn'],
    status: 'scheduled'
  },
  {
    id: 'cs14',
    day: 'Friday',
    timeSlot: '14:30',
    activity: 'engagement',
    content: 'Thank active users this week, build community relationships',
    platform: ['Twitter'],
    status: 'scheduled'
  },
  {
    id: 'cs15',
    day: 'Friday',
    timeSlot: '18:30',
    activity: 'analysis',
    content: 'Weekly data analysis and report generation',
    platform: ['Dashboard'],
    status: 'pending'
  },
  // Weekend
  {
    id: 'cs16',
    day: 'Saturday',
    timeSlot: '12:00',
    activity: 'post',
    content: 'Share casual content, add human touch',
    platform: ['Twitter'],
    status: 'scheduled'
  },
  {
    id: 'cs17',
    day: 'Sunday',
    timeSlot: '15:00',
    activity: 'planning',
    content: 'Prepare next week\'s content materials and creative ideas',
    platform: ['Dashboard'],
    status: 'pending'
  }
];

// Menu items mock data
export const mockMenuItems = [
  { name: 'Dashboard', icon: BarChart3 },
  { name: 'Inspiration Accounts', icon: Users },
  { name: 'Auto Engagement', icon: Heart },
  { name: 'Get Post/Thread', icon: MessageSquare },
  { name: 'Marketing Strategy', icon: Target },
  { name: 'Config', icon: Settings },
  { name: 'Profile', icon: User },
];