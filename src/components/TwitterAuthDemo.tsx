import React, { useState, useEffect } from 'react';
import { Twitter, LogIn, LogOut, User, MessageCircle, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { twitterAuth } from '../lib/twitterAuth';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface TwitterUser {
  id: string;
  username: string;
  name: string;
  profile_image_url?: string;
}

interface TwitterAuthStatus {
  isConnected: boolean;
  user: TwitterUser | null;
  token: string | null;
  error: string | null;
}

export const TwitterAuthDemo: React.FC = () => {
  const { user } = useAuth();
  const [authStatus, setAuthStatus] = useState<TwitterAuthStatus>({
    isConnected: false,
    user: null,
    token: null,
    error: null
  });
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    checkTwitterConnection();
  }, [user]);

  const checkTwitterConnection = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data: session } = await supabase.auth.getSession();
      
      if (session.session?.provider_token) {
        // 有 Twitter token，尝试获取用户信息
        const twitterUser = await twitterAuth.getCurrentTwitterUser();
        setAuthStatus({
          isConnected: true,
          user: twitterUser,
          token: session.session.provider_token,
          error: null
        });
      } else {
        setAuthStatus({
          isConnected: false,
          user: null,
          token: null,
          error: null
        });
      }
    } catch (error) {
      console.error('检查 Twitter 连接状态失败:', error);
      setAuthStatus({
        isConnected: false,
        user: null,
        token: null,
        error: error instanceof Error ? error.message : '未知错误'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setTestResult(null);
      
      const { data, error } = await twitterAuth.signInWithTwitter();
      
      if (error) {
        setAuthStatus(prev => ({
          ...prev,
          error: `登录失败: ${error.message}`
        }));
      } else {
        // OAuth 流程已启动，用户将被重定向到 Twitter
        console.log('Twitter OAuth 流程已启动');
      }
    } catch (error) {
      console.error('Twitter 登录错误:', error);
      setAuthStatus(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '登录过程中发生未知错误'
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setAuthStatus({
        isConnected: false,
        user: null,
        token: null,
        error: null
      });
      setTestResult(null);
    } catch (error) {
      console.error('Twitter 登出错误:', error);
      setAuthStatus(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '登出过程中发生错误'
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshToken = async () => {
    try {
      setLoading(true);
      const newToken = await twitterAuth.refreshTwitterToken();
      if (newToken) {
        await checkTwitterConnection();
        setTestResult('Token 刷新成功');
      }
    } catch (error) {
      console.error('刷新 token 失败:', error);
      setAuthStatus(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '刷新 token 失败'
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleTestTweet = async () => {
    try {
      setLoading(true);
      setTestResult(null);
      
      const result = await twitterAuth.postTweet('测试推文 - 通过 Supabase Auth 发送 🚀 #SupabaseAuth #TwitterAPI');
      setTestResult(`推文发送成功！推文 ID: ${result.id}`);
    } catch (error) {
      console.error('发送测试推文失败:', error);
      setTestResult(`发送推文失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <p className="text-yellow-800">请先登录系统以使用 Twitter 集成功能</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Twitter className="w-8 h-8 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-900">Twitter 集成 (Supabase Auth)</h2>
        </div>

        {/* 连接状态 */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            {authStatus.isConnected ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
            <span className={`font-medium ${authStatus.isConnected ? 'text-green-700' : 'text-red-700'}`}>
              {authStatus.isConnected ? '已连接' : '未连接'}
            </span>
          </div>

          {authStatus.user && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                {authStatus.user.profile_image_url && (
                  <img 
                    src={authStatus.user.profile_image_url} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium text-green-900">{authStatus.user.name}</p>
                  <p className="text-sm text-green-700">@{authStatus.user.username}</p>
                </div>
              </div>
            </div>
          )}

          {authStatus.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{authStatus.error}</p>
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="space-y-4">
          {!authStatus.isConnected ? (
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <LogIn className="w-5 h-5" />
              )}
              <span>{loading ? '连接中...' : '连接 Twitter 账户'}</span>
            </button>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleRefreshToken}
                disabled={loading}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>刷新 Token</span>
              </button>

              <button
                onClick={handleTestTweet}
                disabled={loading}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>发送测试推文</span>
              </button>

              <button
                onClick={handleSignOut}
                disabled={loading}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors md:col-span-2"
              >
                <LogOut className="w-4 h-4" />
                <span>断开连接</span>
              </button>
            </div>
          )}
        </div>

        {/* 测试结果 */}
        {testResult && (
          <div className="mt-6">
            <div className={`border rounded-lg p-4 ${
              testResult.includes('成功') 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <p className={`text-sm ${
                testResult.includes('成功') ? 'text-green-800' : 'text-red-800'
              }`}>
                {testResult}
              </p>
            </div>
          </div>
        )}

        {/* Token 信息 */}
        {authStatus.token && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Token 信息</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-xs text-gray-600 font-mono break-all">
                {authStatus.token.substring(0, 50)}...
              </p>
            </div>
          </div>
        )}

        {/* 说明信息 */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-3">功能说明</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• 使用 Supabase Auth 的 Twitter OAuth 集成</li>
            <li>• 自动获取和管理 Twitter API tokens</li>
            <li>• 支持 token 刷新和验证</li>
            <li>• 提供基本的 Twitter API 操作（发推文、获取用户信息）</li>
            <li>• 安全的会话管理和错误处理</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TwitterAuthDemo;