import { Card } from '../types';
import { supabase } from './supabase';
import { apiConfigService } from './apiConfigService';

// 互动队列API响应类型
interface EngagementItem {
  id: string;
  type: 'reply' | 'repost';
  original_tweet: {
    id: string;
    content: string;
    author: {
      username: string;
      display_name: string;
      profile_image_url: string;
    };
    created_at: string;
    metrics: {
      reply_count: number;
      retweet_count: number;
      like_count: number;
      view_count: number;
    };
  };
  suggested_content: string;
  status: 'pending' | 'posted' | 'rejected';
  created_at: string;
  updated_at: string;
}

interface EngagementsListResponse {
  data: EngagementItem[];
  pagination: {
    page_num: number;
    page_size: number;
    total_count: number;
    total_pages: number;
  };
}

interface PostReplyRequest {
  reply_id: string;
  content: string;
}

interface PostReplyResponse {
  success: boolean;
  message: string;
  tweet_id: string;
  posted_at: string;
}

interface RejectReplyRequest {
  reply_id: string;
}

interface RejectReplyResponse {
  success: boolean;
  message: string;
  rejected_at: string;
}

class EngagementService {
  private get baseUrl(): string {
    return apiConfigService.getApiBaseUrl();
  }
  
  constructor() {
    // baseUrl 现在通过 getter 动态获取
  }
  
  // 获取认证头
  private async getAuthHeaders(): Promise<Record<string, string>> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('用户未登录');
    }

    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    };
  }

  // 获取互动队列列表
  async getEngagements(params?: {
    type?: 'reply' | 'repost';
    page_num?: number;
    page_size?: number;
  }): Promise<EngagementsListResponse> {
    try {
      const headers = await this.getAuthHeaders();
      
      const searchParams = new URLSearchParams();
      
      if (params?.type) {
        searchParams.append('type', params.type);
      }
      if (params?.page_num) {
        searchParams.append('page_num', params.page_num.toString());
      }
      if (params?.page_size) {
        searchParams.append('page_size', params.page_size.toString());
      }

      const url = `${this.baseUrl}/api/engagements${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch engagements: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('获取互动队列失败:', error);
      throw error;
    }
  }

  // 发布回复
  async postReply(request: PostReplyRequest): Promise<PostReplyResponse> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${this.baseUrl}/api/engagements/reply`, {
        method: 'POST',
        headers,
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Failed to post reply: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('发布回复失败:', error);
      throw error;
    }
  }

  // 拒绝回复
  async rejectReply(request: RejectReplyRequest): Promise<RejectReplyResponse> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${this.baseUrl}/api/engagements/reply`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Failed to reject reply: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('拒绝回复失败:', error);
      throw error;
    }
  }

  // 将API响应转换为Card类型
  transformToCard(item: EngagementItem): Card {
    return {
      id: item.id,
      type: 'tweet',
      content: item.original_tweet.content,
      author: item.original_tweet.author.display_name,
      handle: `@${item.original_tweet.author.username}`,
      avatar: item.original_tweet.author.profile_image_url,
      time: this.formatTime(item.original_tweet.created_at),
      likes: item.original_tweet.metrics.like_count,
      retweets: item.original_tweet.metrics.retweet_count,
      replies: item.original_tweet.metrics.reply_count,
      views: item.original_tweet.metrics.view_count,
      stats: {
        comments: item.original_tweet.metrics.reply_count,
        retweets: item.original_tweet.metrics.retweet_count,
        likes: item.original_tweet.metrics.like_count,
        views: item.original_tweet.metrics.view_count,
        bookmarks: 0 // API中没有提供bookmarks数据
      },
      suggestedReply: item.suggested_content,
      replyActions: {
        reject: true,
        postReply: true
      }
    };
  }

  // 格式化时间显示
  private formatTime(isoString: string): string {
    const date = new Date(isoString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  }
}

export const engagementService = new EngagementService();