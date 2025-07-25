// 统一的类型定义
export interface Author {
  name: string;
  handle: string;
  avatar: string;
  verified?: boolean;
}

export interface Stats {
  comments: number;
  retweets: number;
  likes: number;
  views: number;
  bookmarks: number;
}

export interface Metadata {
  category?: string;
  priority?: 'High' | 'Medium' | 'Low';
  deadline?: string;
  assignee?: string;
  status?: string;
}

// Account post interface
export interface AccountPost {
  id: number;
  content: string;
  time: string;
  stats: Stats;
}

// Account analytics interface
export interface AccountAnalytics {
  influence: number;
  engagement: number;
  reach: string;
  avgLikes: string;
  topCategories: string[];
  audienceAge: string;
  audienceGender: string;
}

// 对标账号接口
export interface InspirationAccount {
  id: number;
  name: string;
  handle: string;
  bio: string;
  avatar: string;
  followers: number;
  likes: number;
  isTargeted: boolean;
  starred?: boolean;
  verified?: boolean;
}

export interface Card {
  id: number;
  type: 'post' | 'tweet' | 'strategy' | 'action' | 'inspiration' | 'account';
  title: string;
  content: string;
  author?: Author;
  time: string;
  stats?: Stats;
  metadata?: Metadata;
  inspirationAccount?: InspirationAccount;
}

export type CardType = Card['type'];
export type Priority = Metadata['priority'];