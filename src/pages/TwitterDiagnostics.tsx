import React, { useState } from 'react';
import { Settings, Twitter, Database, CheckCircle, AlertTriangle, Globe } from 'lucide-react';
import TwitterConfigStatus from '../components/TwitterConfigStatus';
import DatabaseStatusCheck from '../components/DatabaseStatusCheck';
import TwitterCorsTest from '../components/TwitterCorsTest';

const TwitterDiagnostics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'config' | 'database' | 'cors'>('config');

  const tabs = [
    {
      id: 'config' as const,
      label: 'API 配置',
      icon: Settings,
      description: '检查 Twitter API 配置状态'
    },
    {
      id: 'database' as const,
      label: '数据库状态',
      icon: Database,
      description: '检查数据库表和连接状态'
    },
    {
      id: 'cors' as const,
      label: 'CORS 测试',
      icon: Globe,
      description: '测试 Twitter API 代理和 CORS 修复'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Twitter className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-900">Twitter 连接诊断</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            检查和解决 Twitter (X) 连接问题。此工具将帮助您诊断 API 配置、数据库状态等常见问题。
          </p>
        </div>

        {/* 问题概述 */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-900 mb-1">当前问题</h3>
              <p className="text-sm text-red-800 mb-2">
                点击 "Connect X" 按钮时出现 CORS 错误，无法正常连接 Twitter 账户。
              </p>
              <div className="bg-red-100 p-2 rounded text-xs text-red-900 font-mono">
                Access to fetch at 'https://api.twitter.com/2/oauth2/token' from origin 'http://localhost:5173' 
                has been blocked by CORS policy: Response to preflight request doesn't pass access control check: 
                No 'Access-Control-Allow-Origin' header is present on the requested resource.
              </div>
            </div>
          </div>
        </div>

        {/* 常见原因 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <h3 className="font-medium text-blue-900 mb-3">常见原因和解决方案</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex items-start space-x-2">
              <span className="font-medium">1.</span>
              <span>CORS 策略阻止 - 需要部署 Supabase Edge Functions 作为 API 代理</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-medium">2.</span>
              <span>Twitter API 配置不完整 - 检查 .env 文件中的 API 密钥</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-medium">3.</span>
              <span>数据库表未创建 - 需要运行 SQL 脚本创建必要的表结构</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-medium">4.</span>
              <span>回调 URL 配置错误 - 确保 Twitter Developer Portal 中的回调 URL 正确</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-medium">5.</span>
              <span>Supabase 连接问题 - 检查 Supabase 项目配置和权限</span>
            </div>
          </div>
        </div>

        {/* 选项卡导航 */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* 选项卡内容 */}
          <div className="p-6">
            {activeTab === 'config' && (
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Twitter API 配置检查</h3>
                  <p className="text-gray-600">
                    检查 Twitter API 密钥配置是否正确。确保所有必需的环境变量都已设置。
                  </p>
                </div>
                <TwitterConfigStatus />
              </div>
            )}

            {activeTab === 'database' && (
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">数据库状态检查</h3>
                  <p className="text-gray-600">
                    检查 Supabase 数据库连接和必要的表结构是否已创建。
                  </p>
                </div>
                <DatabaseStatusCheck />
              </div>
            )}

            {activeTab === 'cors' && (
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">CORS 问题测试</h3>
                  <p className="text-gray-600">
                    测试 Twitter API 代理功能，验证 CORS 问题是否已解决。运行这些测试前，请确保已部署 Supabase Edge Functions。
                  </p>
                </div>
                <TwitterCorsTest />
              </div>
            )}
          </div>
        </div>

        {/* 帮助信息 */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">需要帮助？</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">文档资源</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• 查看项目根目录的 TWITTER_INTEGRATION_GUIDE.md</li>
                <li>• 参考 SUPABASE_EDGE_FUNCTIONS_GUIDE.md 了解 CORS 修复</li>
                <li>• 参考 .env.example 文件了解配置格式</li>
                <li>• 检查 supabase-setup.sql 了解数据库结构</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">常用链接</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• <a href="https://developer.twitter.com/en/portal/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Twitter Developer Portal</a></li>
                <li>• <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Supabase Dashboard</a></li>
                <li>• <a href="https://docs.supabase.com/guides/auth/social-login/auth-twitter" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Supabase Twitter Auth 文档</a></li>
                <li>• <a href="https://docs.supabase.com/guides/functions" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Supabase Edge Functions 文档</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwitterDiagnostics;