import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { twitterService } from '../lib/twitterService';

interface ConfigItemProps {
  label: string;
  value: string;
  isConfigured: boolean;
  description: string;
}

const ConfigItem: React.FC<ConfigItemProps> = ({ label, value, isConfigured, description }) => (
  <div className="border border-gray-200 rounded-lg p-4">
    <div className="flex items-center justify-between mb-2">
      <span className="font-medium text-gray-900">{label}</span>
      <div className={`flex items-center space-x-2 ${isConfigured ? 'text-green-600' : 'text-red-600'}`}>
        {isConfigured ? (
          <CheckCircle className="w-4 h-4" />
        ) : (
          <AlertTriangle className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">
          {isConfigured ? '已配置' : '未配置'}
        </span>
      </div>
    </div>
    <p className="text-sm text-gray-600 mb-2">{description}</p>
    <div className="bg-gray-50 p-2 rounded text-xs font-mono text-gray-700">
      {isConfigured ? '●●●●●●●●●●●●●●●●' : value || '未设置'}
    </div>
  </div>
);

const TwitterConfigStatus: React.FC = () => {
  const [configStatus, setConfigStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const checkConfiguration = () => {
    setLoading(true);
    try {
      const status = twitterService.getConfigStatus();
      setConfigStatus(status);
    } catch (error) {
      console.error('检查配置状态失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConfiguration();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">检查配置状态...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!configStatus) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center text-red-600">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            <p>无法检查配置状态</p>
          </div>
        </div>
      </div>
    );
  }

  const allConfigured = configStatus.clientId && configStatus.clientSecret;
  const appUrl = import.meta.env.VITE_APP_URL || 'http://localhost:5177';

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <AlertTriangle className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-900">Twitter API 配置状态</h2>
        </div>

        <div className={`p-4 rounded-lg mb-6 ${
          allConfigured ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center space-x-2">
            {allConfigured ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600" />
            )}
            <span className={`font-medium ${allConfigured ? 'text-green-800' : 'text-red-800'}`}>
              {allConfigured ? 'Twitter API 配置完成' : 'Twitter API 配置不完整'}
            </span>
          </div>
          <p className={`text-sm mt-1 ${allConfigured ? 'text-green-700' : 'text-red-700'}`}>
            {allConfigured 
              ? '所有必需的配置项都已正确设置，可以正常使用Twitter连接功能。'
              : '请完成以下配置项的设置才能使用Twitter连接功能。'
            }
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <ConfigItem
            label="VITE_TWITTER_CLIENT_ID"
            value={import.meta.env.VITE_TWITTER_CLIENT_ID}
            isConfigured={configStatus.clientId}
            description="Twitter OAuth 2.0 客户端 ID，从 Twitter Developer Portal 获取"
          />
          
          <ConfigItem
            label="VITE_TWITTER_CLIENT_SECRET"
            value={import.meta.env.VITE_TWITTER_CLIENT_SECRET}
            isConfigured={configStatus.clientSecret}
            description="Twitter OAuth 2.0 客户端密钥，从 Twitter Developer Portal 获取"
          />
          
          <ConfigItem
            label="VITE_TWITTER_BEARER_TOKEN"
            value={import.meta.env.VITE_TWITTER_BEARER_TOKEN}
            isConfigured={configStatus.bearerToken}
            description="Twitter Bearer Token（可选），用于某些 API 调用"
          />

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900">回调 URL</span>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-sm text-gray-600 mb-2">
              在 Twitter Developer Portal 中配置的回调 URL
            </p>
            <div className="bg-gray-50 p-2 rounded text-xs font-mono text-gray-700">
              {configStatus.redirectUri}
            </div>
          </div>
        </div>

        {!allConfigured && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-900 mb-3">配置步骤</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>访问 <a 
                href="https://developer.twitter.com/en/portal/dashboard" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 underline"
              >
                <span>Twitter Developer Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a></li>
              <li>创建一个新的应用或使用现有应用</li>
              <li>在应用设置中获取 Client ID、Client Secret 和 Bearer Token</li>
              <li>在 OAuth 2.0 设置中添加回调 URL: <code className="bg-white px-1 rounded">{appUrl}/auth/twitter/callback</code></li>
              <li>将获取的密钥添加到项目根目录的 <code className="bg-white px-1 rounded">.env</code> 文件中</li>
              <li>重启开发服务器使环境变量生效</li>
            </ol>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={checkConfiguration}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>重新检查配置</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwitterConfigStatus;