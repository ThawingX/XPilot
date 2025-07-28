import React, { useState, useEffect } from 'react';
import { Database, AlertTriangle, CheckCircle, RefreshCw, Play } from 'lucide-react';
import { checkDatabaseStatus, createDatabaseTables, DatabaseStatus } from '../lib/databaseUtils';

const DatabaseStatusCheck: React.FC = () => {
  const [status, setStatus] = useState<DatabaseStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const dbStatus = await checkDatabaseStatus();
      setStatus(dbStatus);
    } catch (error) {
      console.error('检查数据库状态失败:', error);
      setStatus({
        isConnected: false,
        tablesExist: { user_social_connections: false },
        error: '检查数据库状态失败'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTables = async () => {
    setCreating(true);
    try {
      const result = await createDatabaseTables();
      if (result.success) {
        // 重新检查状态
        await checkStatus();
      } else {
        setStatus(prev => prev ? { ...prev, error: result.error } : null);
      }
    } catch (error) {
      console.error('创建数据库表失败:', error);
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">检查数据库状态...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center text-red-600">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            <p>无法检查数据库状态</p>
          </div>
        </div>
      </div>
    );
  }

  const allTablesExist = status.tablesExist.user_social_connections;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Database className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-900">数据库状态检查</h2>
        </div>

        {/* 连接状态 */}
        <div className={`p-4 rounded-lg mb-6 ${
          status.isConnected ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center space-x-2">
            {status.isConnected ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600" />
            )}
            <span className={`font-medium ${status.isConnected ? 'text-green-800' : 'text-red-800'}`}>
              {status.isConnected ? 'Supabase 数据库连接正常' : 'Supabase 数据库连接失败'}
            </span>
          </div>
          {status.error && (
            <p className={`text-sm mt-1 ${status.isConnected ? 'text-green-700' : 'text-red-700'}`}>
              {status.error}
            </p>
          )}
        </div>

        {/* 表状态 */}
        {status.isConnected && (
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900">数据库表状态</h3>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">user_social_connections</span>
                <div className={`flex items-center space-x-2 ${
                  status.tablesExist.user_social_connections ? 'text-green-600' : 'text-red-600'
                }`}>
                  {status.tablesExist.user_social_connections ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {status.tablesExist.user_social_connections ? '已创建' : '未创建'}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                存储用户社交媒体连接信息的核心表，包含Twitter授权令牌和用户信息
              </p>
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex items-center space-x-4">
          <button
            onClick={checkStatus}
            disabled={loading}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>重新检查</span>
          </button>

          {status.isConnected && !allTablesExist && (
            <button
              onClick={handleCreateTables}
              disabled={creating}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <Play className={`w-4 h-4 ${creating ? 'animate-spin' : ''}`} />
              <span>{creating ? '创建中...' : '创建数据库表'}</span>
            </button>
          )}
        </div>

        {/* 说明信息 */}
        {status.isConnected && !allTablesExist && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">需要创建数据库表</h4>
            <p className="text-sm text-yellow-800 mb-3">
              Twitter连接功能需要 <code className="bg-white px-1 rounded">user_social_connections</code> 表来存储用户的授权令牌和连接信息。
            </p>
            <p className="text-sm text-yellow-800">
              点击"创建数据库表"按钮将自动执行 <code className="bg-white px-1 rounded">supabase-setup.sql</code> 脚本中的表结构创建语句。
            </p>
          </div>
        )}

        {allTablesExist && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">数据库配置完成</h4>
            <p className="text-sm text-green-800">
              所有必需的数据库表都已创建，Twitter连接功能可以正常使用。
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseStatusCheck;