import React, { useState, useEffect } from 'react';
import { Settings, X, Globe, Database, Key, Info, ToggleLeft, ToggleRight, Copy, Check, RefreshCw } from 'lucide-react';
import { apiConfigService } from '../lib/apiConfigService';

interface EnvironmentInfo {
  NODE_ENV: string;
  VITE_APP_URL: string;
  VITE_API_BASE_URL: string;
  VITE_SUPABASE_URL: string;
  VITE_TWITTER_CLIENT_ID: string;
  [key: string]: string;
}

interface DevDebugPanelProps {
  className?: string;
}

const DevDebugPanel: React.FC<DevDebugPanelProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'api' | 'env' | 'config'>('api');
  const [useLocalAPI, setUseLocalAPI] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [environmentInfo, setEnvironmentInfo] = useState<EnvironmentInfo>({} as EnvironmentInfo);
  const [currentApiUrl, setCurrentApiUrl] = useState('');

  // 只在开发环境显示
  const isDevelopment = import.meta.env.DEV;

  useEffect(() => {
    if (!isDevelopment) return;

    // 获取环境变量信息
    const envInfo: EnvironmentInfo = {
      NODE_ENV: import.meta.env.MODE,
      VITE_APP_URL: import.meta.env.VITE_APP_URL || 'Not set',
      VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'Not set',
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || 'Not set',
      VITE_TWITTER_CLIENT_ID: import.meta.env.VITE_TWITTER_CLIENT_ID || 'Not set',
      VITE_TWITTER_CLIENT_SECRET: import.meta.env.VITE_TWITTER_CLIENT_SECRET ? '***hidden***' : 'Not set',
      VITE_TWITTER_BEARER_TOKEN: import.meta.env.VITE_TWITTER_BEARER_TOKEN ? '***hidden***' : 'Not set',
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? '***hidden***' : 'Not set',
    };
    setEnvironmentInfo(envInfo);

    // 检查当前API配置
    const apiUrl = apiConfigService.getApiBaseUrl();
    setCurrentApiUrl(apiUrl);
    setUseLocalAPI(apiConfigService.isUsingLocalApi());
    
    // 监听API配置变更
    const handleApiUrlChange = (newUrl: string) => {
      setCurrentApiUrl(newUrl);
      setUseLocalAPI(apiConfigService.isUsingLocalApi());
    };
    
    apiConfigService.addListener(handleApiUrlChange);
    
    return () => {
      apiConfigService.removeListener(handleApiUrlChange);
    };
  }, [isDevelopment]);

  // 复制到剪贴板
  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // 切换API地址
  const toggleAPIUrl = () => {
    const newUseLocal = apiConfigService.toggleApiEnvironment();

    
    // 显示切换成功提示
    const message = newUseLocal ? '已切换到本地开发环境' : '已切换到生产环境';
    
    // 可以添加toast通知
    if (window.confirm(`${message}\n\n新的API地址: ${apiConfigService.getApiBaseUrl()}\n\n是否刷新页面以应用更改？`)) {
      window.location.reload();
    }
  };
  
  // 重置API配置
  const resetApiConfig = () => {
    if (window.confirm('确定要重置API配置到默认设置吗？')) {
      apiConfigService.resetToDefault();
      if (window.confirm('配置已重置，是否刷新页面以应用更改？')) {
        window.location.reload();
      }
    }
  };

  // 获取系统信息
  const getSystemInfo = () => {
    return {
      'User Agent': navigator.userAgent,
      'Platform': navigator.platform,
      'Language': navigator.language,
      'Online': navigator.onLine ? 'Yes' : 'No',
      'Cookies Enabled': navigator.cookieEnabled ? 'Yes' : 'No',
      'Screen Resolution': `${screen.width}x${screen.height}`,
      'Viewport Size': `${window.innerWidth}x${window.innerHeight}`,
      'Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
      'Local Time': new Date().toLocaleString(),
    };
  };

  // 如果不是开发环境，不渲染组件
  if (!isDevelopment) {
    return null;
  }

  return (
    <>
      {/* 悬浮按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 left-4 z-50 p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 ${className}`}
        title="开发调试面板"
      >
        <Settings className="w-5 h-5" />
      </button>

      {/* 调试面板弹窗 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* 头部 */}
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <div className="flex items-center space-x-3">
                <Settings className="w-6 h-6" />
                <div>
                  <h2 className="text-xl font-bold">开发调试面板</h2>
                  <p className="text-blue-100 text-sm">Development Debug Panel</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 标签页导航 */}
            <div className="flex border-b border-gray-200">
              {[
                { key: 'api', label: 'API 配置', icon: Globe },
                { key: 'env', label: '环境变量', icon: Key },
                { key: 'config', label: '系统信息', icon: Info },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === key
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* 内容区域 */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {/* API 配置标签页 */}
              {activeTab === 'api' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-blue-600" />
                      API 服务器配置
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                        <div>
                          <h4 className="font-medium text-gray-900">使用本地 API 服务器</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            当前: {currentApiUrl}
                          </p>
                        </div>
                        <button
                          onClick={toggleAPIUrl}
                          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                        >
                          {useLocalAPI ? (
                            <ToggleRight className="w-6 h-6" />
                          ) : (
                            <ToggleLeft className="w-6 h-6" />
                          )}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(apiConfigService.getAvailableEnvironments()).map(([key, env]) => (
                          <div key={key} className={`p-4 bg-white rounded-lg border-2 transition-colors ${
                            env.active ? 'border-green-500 bg-green-50' : 'border-gray-200'
                          }`}>
                            <h4 className="font-medium text-gray-900 mb-2">{env.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">{env.url}</p>
                            <p className="text-xs text-gray-500 mb-3">{env.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${env.active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span className="text-xs text-gray-500">{env.active ? '当前使用' : '未使用'}</span>
                              </div>
                              {env.active && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                  活跃
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <button
                          onClick={resetApiConfig}
                          className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span>重置配置</span>
                        </button>
                        
                        <div className="text-xs text-gray-500">
                          配置保存在本地存储中
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-start space-x-3">
                      <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800">注意事项</h4>
                        <div className="text-sm text-yellow-700 mt-1 space-y-1">
                          <p>• API 地址切换后建议刷新页面以确保所有请求使用新地址</p>
                          <p>• 配置会自动保存到本地存储，下次打开时会记住您的选择</p>
                          <p>• 在生产环境中，此面板将自动隐藏且API地址不可更改</p>
                          <p>• 切换到生产环境前请确保网络连接正常</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 环境变量标签页 */}
              {activeTab === 'env' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Key className="w-5 h-5 mr-2 text-green-600" />
                      环境变量配置
                    </h3>
                    
                    <div className="grid gap-3">
                      {Object.entries(environmentInfo).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-3 bg-white rounded-lg border hover:border-gray-300 transition-colors">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm">{key}</h4>
                            <p className="text-sm text-gray-600 truncate mt-1">{value}</p>
                          </div>
                          <button
                            onClick={() => copyToClipboard(value, key)}
                            className="ml-3 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            title="复制值"
                          >
                            {copiedKey === key ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 系统信息标签页 */}
              {activeTab === 'config' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Database className="w-5 h-5 mr-2 text-purple-600" />
                      系统信息
                    </h3>
                    
                    <div className="grid gap-3">
                      {Object.entries(getSystemInfo()).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-3 bg-white rounded-lg border hover:border-gray-300 transition-colors">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm">{key}</h4>
                            <p className="text-sm text-gray-600 truncate mt-1">{value}</p>
                          </div>
                          <button
                            onClick={() => copyToClipboard(value.toString(), key)}
                            className="ml-3 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            title="复制值"
                          >
                            {copiedKey === key ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800">开发信息</h4>
                        <div className="text-sm text-blue-700 mt-2 space-y-1">
                          <p>• 构建模式: {import.meta.env.MODE}</p>
                          <p>• 开发环境: {import.meta.env.DEV ? '是' : '否'}</p>
                          <p>• 生产环境: {import.meta.env.PROD ? '是' : '否'}</p>
                          <p>• 构建时间: {new Date().toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 底部 */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  此面板仅在开发环境中显示
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DevDebugPanel;