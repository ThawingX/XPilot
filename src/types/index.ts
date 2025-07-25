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

export interface Card {
  id: number;
  type: 'post' | 'tweet' | 'strategy' | 'action';
  title: string;
  content: string;
  author?: Author;
  time: string;
  stats?: Stats;
  metadata?: Metadata;
}

export type CardType = Card['type'];
export type Priority = Metadata['priority'];