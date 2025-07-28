import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const TwitterAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = React.useState<string>('');

  useEffect(() => {
    handleAuthCallback();
  }, []);

  const handleAuthCallback = async () => {
    try {
      console.log('TwitterAuthCallback: 开始处理回调...');
      
      // 检查URL参数中是否有错误信息
      const errorParam = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      
      if (errorParam) {
        console.error('Twitter OAuth 回调错误:', errorParam, errorDescription);
        throw new Error(`Twitter 返回错误: ${errorDescription || errorParam}`);
      }
      
      // 处理 Supabase Auth 回调
      const { data, error } = await supabase.auth.getSession();
      
      console.log('Supabase 会话状态:', data.session ? '已获取会话' : '无会话', error ? `错误: ${error.message}` : '无错误');
      
      if (error) {
        throw new Error(`认证失败: ${error.message}`);
      }

      if (data.session) {
        // 检查是否有 provider_token (Twitter token)
        const twitterToken = data.session.provider_token;
        
        console.log('Twitter token 状态:', twitterToken ? '已获取' : '未获取');
        
        if (twitterToken) {
          setStatus('success');
          setMessage('Twitter 账户连接成功！正在跳转...');
          
          // 延迟跳转，让用户看到成功消息
          setTimeout(() => {
            navigate('/profile', { replace: true });
          }, 2000);
        } else {
          throw new Error('未能获取 Twitter token，请确保您已授权应用访问您的Twitter账户');
        }
      } else {
        throw new Error('未能建立用户会话，请确保您已登录');
      }
    } catch (error) {
      console.error('Twitter 认证回调错误:', error);
      setStatus('error');
      setMessage(error instanceof Error ? error.message : '认证过程中发生未知错误');
      
      // 错误情况下也跳转回主页，但延长时间让用户看到错误信息
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="mx-auto h-16 w-16 text-blue-500 animate-spin mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              正在处理 Twitter 认证...
            </h2>
            <p className="text-gray-600">
              请稍候，我们正在安全地连接您的 Twitter 账户
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              连接成功！
            </h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                您的 Twitter 账户已成功连接，现在可以使用 Twitter API 功能了。
              </p>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="mx-auto h-16 w-16 text-red-500 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              连接失败
            </h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">
                请检查您的网络连接和 Twitter 应用配置，然后重试。
              </p>
            </div>
            <button
              onClick={() => navigate('/', { replace: true })}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              返回首页
            </button>
          </>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            通过 Supabase Auth 安全认证
          </p>
        </div>
      </div>
    </div>
  );
};

export default TwitterAuthCallback;