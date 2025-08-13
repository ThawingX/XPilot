import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

// Twitter连接信息接口
export interface TwitterConnection {
  id?: string;
  user_id?: string;
  platform_user_id: string;
  platform_username: string;
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_at?: string;
  scope?: string;
  connected_at?: string;
  is_active?: boolean;
}

// Twitter用户信息接口
export interface TwitterUser {
  id: string;
  username: string;
  name: string;
  profile_image_url?: string;
  verified?: boolean;
  public_metrics?: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
  };
}

class TwitterService {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly bearerToken: string;
  private readonly appUrl: string;
  private readonly redirectUri: string;

  constructor() {
    this.clientId = import.meta.env.VITE_TWITTER_CLIENT_ID || '';
    this.clientSecret = import.meta.env.VITE_TWITTER_CLIENT_SECRET || '';
    this.bearerToken = import.meta.env.VITE_TWITTER_BEARER_TOKEN || '';
    this.appUrl = import.meta.env.VITE_APP_URL || 'http://localhost:5177';
    this.redirectUri = `${this.appUrl}/auth/twitter/direct/callback`;

    if (!this.clientId || !this.clientSecret) {
      console.warn('Twitter API credentials not configured');
    }
  }

  // 检查Twitter API配置是否完整
  isConfigured(): boolean {
    return !!(
      this.clientId && 
      this.clientSecret && 
      this.clientId !== 'your_twitter_client_id' &&
      this.clientSecret !== 'your_twitter_client_secret'
    );
  }

  // 获取配置状态（用于调试）
  getConfigStatus() {
    return {
      hasClientId: !!this.clientId,
      hasClientSecret: !!this.clientSecret,
      redirectUri: this.redirectUri,
      clientIdLength: this.clientId?.length || 0,
      clientSecretLength: this.clientSecret?.length || 0,
      environment: {
        VITE_TWITTER_CLIENT_ID: !!import.meta.env.VITE_TWITTER_CLIENT_ID,
        VITE_TWITTER_CLIENT_SECRET: !!import.meta.env.VITE_TWITTER_CLIENT_SECRET,
        VITE_APP_URL: import.meta.env.VITE_APP_URL
      }
    };
  }

  // 生成随机字符串
  private generateRandomString(length: number): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
  }

  // 生成PKCE代码挑战
  private async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  // 获取Twitter OAuth授权URL
  async getAuthUrl(): Promise<string> {
    try {
      // 检查配置是否完整
      if (!this.isConfigured()) {
        throw new Error('Twitter API 配置不完整。请在 .env 文件中配置正确的 VITE_TWITTER_CLIENT_ID 和 VITE_TWITTER_CLIENT_SECRET');
      }

      // 生成state和code_verifier
      const state = this.generateRandomString(32);
      const codeVerifier = this.generateRandomString(128);
      const codeChallenge = await this.generateCodeChallenge(codeVerifier);

      // 将state和code_verifier存储到localStorage
      localStorage.setItem('twitter_oauth_state', state);
      localStorage.setItem('twitter_code_verifier', codeVerifier);

      // 构建授权URL
      const params = new URLSearchParams({
        response_type: 'code',
        client_id: this.clientId,
        redirect_uri: this.redirectUri,
        scope: 'tweet.read tweet.write users.read offline.access',
        state: state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256'
      });

      return `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
    } catch (error) {
      console.error('生成Twitter授权URL失败:', error);
      throw error;
    }
  }
  
  // 处理OAuth回调
  async handleCallback(code: string, state: string): Promise<{ success: boolean; data?: TwitterConnection; error?: string }> {
    try {
      // 验证state
      const storedState = localStorage.getItem('twitter_oauth_state');

      if (!storedState) {
        console.error('localStorage中未找到存储的state参数');
        throw new Error('OAuth state not found. Please restart the authorization process.');
      }

      if (storedState !== state) {
        console.error('State参数不匹配:', {
          expected: storedState,
          received: state
        });
        throw new Error('Invalid state parameter. Please restart the authorization process.');
      }

      // 获取code_verifier
      const codeVerifier = localStorage.getItem('twitter_code_verifier');

      if (!codeVerifier) {
        console.error('localStorage中未找到code_verifier');
        throw new Error('Code verifier not found. Please restart the authorization process.');
      }

      // 清理localStorage
      localStorage.removeItem('twitter_oauth_state');
      localStorage.removeItem('twitter_code_verifier');

      // 交换访问令牌
      const tokenResponse = await this.exchangeCodeForTokens(code, codeVerifier);
      
      // 获取用户信息
      const userInfo = await this.getUserInfo(tokenResponse.access_token);

      // 保存连接信息到数据库
      const connection = await this.saveConnection(tokenResponse, userInfo);

      return { success: true, data: connection };
    } catch (error) {
      console.error('处理Twitter回调失败:', error);
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      return { success: false, error: errorMessage };
    }
  }

  // 交换访问令牌 - 使用代理避免CORS问题
  private async exchangeCodeForTokens(code: string, codeVerifier: string): Promise<any> {
    try {
      // 使用 Supabase Edge Function 作为代理
      const { data, error } = await supabase.functions.invoke('twitter-token-exchange', {
        body: {
          code,
          code_verifier: codeVerifier,
          redirect_uri: this.redirectUri
        }
      });

      if (error) {
        console.error('Token exchange failed:', error);
        throw new Error(`Token exchange failed: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      throw error;
    }
  }

  // 获取用户信息 - 使用代理避免CORS问题
  private async getUserInfo(accessToken: string): Promise<TwitterUser> {
    // 使用 Supabase Edge Function 作为代理
    const { data, error } = await supabase.functions.invoke('twitter-api-proxy', {
      body: {
        endpoint: 'users/me?user.fields=id,username,name,profile_image_url,verified,public_metrics',
        method: 'GET',
        accessToken
      }
    });

    if (error) {
      console.error('获取用户信息失败:', error);
      throw new Error(`Failed to fetch user info: ${error.message}`);
    }

    return data.data;
  }

  // 保存连接信息到数据库
  private async saveConnection(tokenData: any, userInfo: TwitterUser): Promise<TwitterConnection> {
    // 获取当前认证用户
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('用户未登录，无法保存 Twitter 连接');
    }

    // 先停用现有的Twitter连接
    await supabase
      .from('user_social_connections')
      .update({ is_active: false })
      .eq('user_id', user.id)
      .eq('platform', 'twitter');

    // 插入新的连接记录
    const { data, error } = await supabase
      .from('user_social_connections')
      .insert({
        user_id: user.id,
        platform: 'twitter',
        platform_user_id: userInfo.id,
        platform_username: userInfo.username,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        token_type: tokenData.token_type || 'Bearer',
        expires_at: tokenData.expires_in ? 
          new Date(Date.now() + tokenData.expires_in * 1000).toISOString() : null,
        scope: tokenData.scope
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save connection: ${error.message}`);
    }

    return data;
  }
  
  // 获取用户的Twitter连接
  async getUserConnection(): Promise<TwitterConnection | null> {
    try {
      console.log('开始获取Twitter连接状态...');
      
      // 先尝试获取当前session
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      
      console.log('当前会话状态:', { 
        hasSession: !!currentSession, 
        sessionError: sessionError?.message || null,
        sessionToken: currentSession?.access_token ? 'exists' : 'missing'
      });
      
      if (sessionError) {
        console.log('获取会话错误:', sessionError);
        return null;
      }
      
      if (!currentSession) {
        console.log('当前会话不存在，返回null');
        return null;
      }
      
      // 获取用户信息
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      console.log('用户认证结果:', { 
        hasUser: !!user, 
        userError: userError?.message || null,
        userId: user?.id || null
      });
      
      if (userError || !user) {
        console.log('用户认证失败:', userError);
        return null;
      }

      console.log('开始调用edge function: check-twitter-connection');
      // 调用edge function检查Twitter连接
      const { data, error } = await supabase.functions.invoke('check-twitter-connection', {
        headers: {
          Authorization: `Bearer ${currentSession.access_token}`,
        },
      });

      console.log('Edge function调用结果:', { data, error });

      if (error) {
        console.error('获取Twitter连接失败:', error);
        return null;
      }

      // 处理edge function的响应结构
      if (data && data.is_twitter_connected && data.connection_details) {
        return data.connection_details as TwitterConnection;
      }

      return null;
    } catch (error) {
      console.error('获取Twitter连接失败:', error);
      return null;
    }
  }
  
  // 断开Twitter连接
  async disconnectTwitter(): Promise<{ success: boolean; error?: string }> {
    try {
      // 获取当前认证用户和session
      const { data: { user, session }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user || !session) {
        return { success: false, error: '用户未登录' };
      }

      // 调用edge function断开Twitter连接
      const { data, error } = await supabase.functions.invoke('disconnect-twitter-connection', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('断开Twitter连接失败:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('断开Twitter连接失败:', error);
      return { success: false, error: error instanceof Error ? error.message : '未知错误' };
    }
  }
  
  // 基本的Twitter API调用方法 - 使用代理避免CORS问题
  async makeTwitterApiCall(endpoint: string, options: RequestInit = {}): Promise<any> {
    const connection = await this.getUserConnection();
    if (!connection) {
      throw new Error('Twitter not connected');
    }

    // 使用 Supabase Edge Function 作为代理
    const { data, error } = await supabase.functions.invoke('twitter-api-proxy', {
      body: {
        endpoint,
        method: options.method || 'GET',
        body: options.body ? JSON.parse(options.body as string) : undefined,
        headers: options.headers,
        accessToken: connection.access_token
      }
    });

    if (error) {
      console.error('Twitter API 代理调用失败:', error);
      throw new Error(`Twitter API call failed: ${error.message}`);
    }

    return data;
  }

  // 获取当前用户信息
  async getCurrentUser(): Promise<TwitterUser | null> {
    try {
      const data = await this.makeTwitterApiCall('users/me?user.fields=id,username,name,profile_image_url,verified,public_metrics');
      return data.data;
    } catch (error) {
      console.error('获取Twitter用户信息失败:', error);
      return null;
    }
  }

  // 检查连接状态
  async isConnected(): Promise<boolean> {
    const connection = await this.getUserConnection();
    return connection !== null && connection.is_active;
  }

  // 获取当前认证用户
  async getCurrentAppUser(): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.getUser();
    return error ? null : user;
  }

  // 启动Twitter OAuth流程
  async startTwitterAuth(): Promise<void> {
    try {
      const authUrl = await this.getAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('启动Twitter认证失败:', error);
      throw error;
    }
  }

  // 发送推文
  async postTweet(text: string): Promise<any> {
    try {
      const result = await this.makeTwitterApiCall('tweets', {
        method: 'POST',
        body: JSON.stringify({ text })
      });
      return result;
    } catch (error) {
      console.error('发送推文失败:', error);
      throw error;
    }
  }

  // 刷新Twitter token - 使用代理避免CORS问题
  async refreshTwitterToken(): Promise<string | null> {
    try {
      const connection = await this.getUserConnection();
      if (!connection || !connection.refresh_token) {
        throw new Error('No refresh token available');
      }

      // 使用 Supabase Edge Function 作为代理
      const { data, error } = await supabase.functions.invoke('twitter-refresh-token', {
        body: {
          refreshToken: connection.refresh_token,
          clientId: this.clientId,
          clientSecret: this.clientSecret
        }
      });

      if (error) {
        console.error('刷新Twitter token失败:', error);
        throw new Error(`Failed to refresh token: ${error.message}`);
      }

      const tokenData = data;
      
      // 更新数据库中的token
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('用户未登录');
      }

      await supabase
        .from('user_social_connections')
        .update({
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token || connection.refresh_token,
          expires_at: tokenData.expires_in ? 
            new Date(Date.now() + tokenData.expires_in * 1000).toISOString() : null
        })
        .eq('user_id', user.id)
        .eq('platform', 'twitter')
        .eq('is_active', true);

      return tokenData.access_token;
    } catch (error) {
      console.error('刷新Twitter token失败:', error);
      throw error;
    }
  }
  
}

// 导出单例实例
export const twitterService = new TwitterService();