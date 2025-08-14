import { supabase } from './supabase';
import { InspirationAccount } from '../types';

// 对标账号接口定义
export interface InspirationAccountResponse {
  id: string;
  twitter_user_id: string;
  username: string;
  display_name: string;
  description?: string;
  profile_image_url?: string;
  followers_count: number;
  following_count: number;
  tweet_count: number;
  like_count: number;
  verified: boolean;
  is_starred: boolean;
  is_target: boolean;
  created_at: string;
  updated_at: string;
}

// 对标账号列表响应接口
export interface InspirationAccountsListResponse {
  data: InspirationAccountResponse[];
  pagination: {
    page_num: number;
    page_size: number;
    total_count: number;
    total_pages: number;
  };
}

// 错误响应接口
export interface ErrorResponse {
  detail: string;
}

class InspirationAccountService {
  private baseUrl: string;

  constructor() {
    // 使用环境变量或默认的生产地址
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://pilotapi.producthot.top';
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

  // 获取对标账号列表
  async getInspirationAccounts(params?: {
    type?: 'starred' | 'outreach';
    q?: string;
    page_num?: number;
    page_size?: number;
  }): Promise<InspirationAccountsListResponse> {
    try {
      const headers = await this.getAuthHeaders();
      
      // 构建查询参数
      const searchParams = new URLSearchParams();
      if (params?.type) searchParams.append('type', params.type);
      if (params?.q) searchParams.append('q', params.q);
      if (params?.page_num) searchParams.append('page_num', params.page_num.toString());
      if (params?.page_size) searchParams.append('page_size', params.page_size.toString());

      const url = `${this.baseUrl}/api/inspiration-accounts${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {

      throw error;
    }
  }

  // 批量设置账号为对标账号
  async setAccountAsTarget(accountId: string, isTarget: boolean): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${this.baseUrl}/api/inspiration-accounts/batch-target`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          account_ids: [parseInt(accountId)],
          action: isTarget ? 'add' : 'remove'
        })
      });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        throw new Error(errorData.detail || `设置对标账号失败: ${response.status}`);
      }
    } catch (error) {

      throw error;
    }
  }

  // 批量收藏/取消收藏账号
  async toggleStarAccount(accountId: string, isStarred: boolean): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${this.baseUrl}/api/inspiration-accounts/batch-star`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          account_ids: [parseInt(accountId)],
          action: isStarred ? 'add' : 'remove'
        })
      });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        throw new Error(errorData.detail || `收藏账号失败: ${response.status}`);
      }
    } catch (error) {

      throw error;
    }
  }

  // 批量设置多个账号为对标账号
  async batchSetAccountsAsTarget(accountIds: number[], action: 'add' | 'remove'): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${this.baseUrl}/api/inspiration-accounts/batch-target`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          account_ids: accountIds,
          action
        })
      });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        throw new Error(errorData.detail || `批量设置对标账号失败: ${response.status}`);
      }
    } catch (error) {

      throw error;
    }
  }

  // 批量收藏/取消收藏多个账号
  async batchToggleStarAccounts(accountIds: number[], action: 'add' | 'remove'): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${this.baseUrl}/api/inspiration-accounts/batch-star`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          account_ids: accountIds,
          action
        })
      });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        throw new Error(errorData.detail || `批量收藏账号失败: ${response.status}`);
      }
    } catch (error) {

      throw error;
    }
  }

  // 将API响应转换为前端使用的InspirationAccount格式
  transformToInspirationAccount(apiAccount: InspirationAccountResponse): InspirationAccount {
    return {
      id: parseInt(apiAccount.id),
      name: apiAccount.display_name,
      handle: `@${apiAccount.username}`,
      bio: apiAccount.description || '',
      avatar: apiAccount.profile_image_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      followers: apiAccount.followers_count,
      likes: 0, // API doesn't provide likes count, using default
      isTargeted: apiAccount.is_target,
      starred: apiAccount.is_starred,
      verified: apiAccount.verified || false
    };
  }
}

// 导出单例实例
export const inspirationAccountService = new InspirationAccountService();