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
  type: 'post' | 'tweet' | 'strategy' | 'action' | 'inspiration';
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