import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Twitter, CheckCircle, XCircle, Loader, ArrowRight } from 'lucide-react';
import { twitterService } from '../lib/twitterService';

export const TwitterDirectCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('正在验证授权信息...');
  const [countdown, setCountdown] = useState<number>(3);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          throw new Error(`Twitter授权被拒绝: ${error}`);
        }

        if (!code || !state) {
          throw new Error('授权参数不完整，请重新尝试连接');
        }

        // 检查localStorage中是否有必要的OAuth数据
        const storedState = localStorage.getItem('twitter_oauth_state');
        const storedCodeVerifier = localStorage.getItem('twitter_code_verifier');
        
        if (!storedState || !storedCodeVerifier) {
          throw new Error('OAuth会话已过期，请重新开始授权流程');
        }

        setMessage('正在验证授权信息...');
        await new Promise(resolve => setTimeout(resolve, 500)); // 短暂延迟提升用户体验

        setMessage('正在获取访问令牌...');
        await new Promise(resolve => setTimeout(resolve, 300));

        // 处理OAuth回调
        const result = await twitterService.handleCallback(code, state);

        if (result.success) {
          setMessage('正在获取用户信息...');
          await new Promise(resolve => setTimeout(resolve, 300));
          
          setStatus('success');
          setMessage('Twitter账户授权成功！');
          
          // 开始倒计时跳转
          const timer = setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) {
                clearInterval(timer);
                // 跳转到主应用，并通过 URL 参数指示显示 Profile 页面
                navigate('/?section=profile&tab=twitter-auth');
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
          
          return () => clearInterval(timer);
        } else {
          throw new Error(result.error || '连接失败，请重试');
        }
      } catch (error) {
        console.error('Twitter回调处理失败:', error);
        setStatus('error');
        const errorMessage = error instanceof Error ? error.message : '未知错误';
        
        // 提供更友好的错误信息
        if (errorMessage.includes('用户未登录')) {
          setMessage('请先登录应用，然后再连接Twitter账户');
        } else if (errorMessage.includes('OAuth state not found') || errorMessage.includes('OAuth会话已过期')) {
          setMessage('授权会话已过期，请重新开始连接流程');
        } else if (errorMessage.includes('Invalid state parameter')) {
          setMessage('授权验证失败，请重新开始连接流程');
        } else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('network')) {
          setMessage('网络连接失败，请检查网络后重试');
        } else if (errorMessage.includes('invalid input syntax for type uuid')) {
          setMessage('用户身份验证失败，请重新登录应用');
        } else {
          setMessage(errorMessage);
        }
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="flex justify-center items-center px-4 py-12 min-h-screen bg-gray-50 sm:px-6 lg:px-8">
      <div className="space-y-8 w-full max-w-md">
        <div className="text-center">
          <Twitter className="mx-auto w-12 h-12 text-blue-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Twitter 授权处理
          </h2>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            {status === 'loading' && (
              <div className="space-y-4">
                <Loader className="mx-auto w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-gray-600">{message}</p>
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-4">
                <CheckCircle className="mx-auto w-12 h-12 text-green-500" />
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-green-600">{message}</p>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <span>{countdown} 秒后自动跳转到个人资料页面</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${((3 - countdown) / 3) * 100}%` }}
                  ></div>
                </div>
                <button
                  onClick={() => navigate('/?section=profile&tab=twitter-auth')}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md border border-transparent hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  立即跳转
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <XCircle className="mx-auto w-12 h-12 text-red-500" />
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-red-600">授权失败</p>
                  <p className="text-sm text-gray-600">{message}</p>
                </div>
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md border border-transparent hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    重新尝试
                  </button>
                  <button
                    onClick={() => navigate('/?section=profile&tab=twitter-auth')}
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-transparent hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    返回个人资料
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwitterDirectCallback;