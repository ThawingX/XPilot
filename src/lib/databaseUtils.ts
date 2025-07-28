import { supabase } from './supabase';

export interface DatabaseStatus {
  isConnected: boolean;
  tablesExist: {
    user_social_connections: boolean;
  };
  error?: string;
}

export const checkDatabaseStatus = async (): Promise<DatabaseStatus> => {
  try {
    // 检查数据库连接
    const { data: connectionTest, error: connectionError } = await supabase
      .from('user_social_connections')
      .select('count', { count: 'exact', head: true });

    if (connectionError) {
      // 如果表不存在，会返回特定错误
      if (connectionError.code === 'PGRST116' || connectionError.message.includes('does not exist')) {
        return {
          isConnected: true,
          tablesExist: {
            user_social_connections: false
          },
          error: '数据库表 user_social_connections 不存在，需要运行 SQL 脚本创建表'
        };
      }
      
      return {
        isConnected: false,
        tablesExist: {
          user_social_connections: false
        },
        error: `数据库连接失败: ${connectionError.message}`
      };
    }

    return {
      isConnected: true,
      tablesExist: {
        user_social_connections: true
      }
    };
  } catch (error) {
    return {
      isConnected: false,
      tablesExist: {
        user_social_connections: false
      },
      error: `检查数据库状态失败: ${error instanceof Error ? error.message : '未知错误'}`
    };
  }
};

export const createDatabaseTables = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    // 读取 SQL 脚本内容
    const sqlScript = `
-- 1. 用户社交媒体连接表（核心表）
CREATE TABLE IF NOT EXISTS user_social_connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    platform VARCHAR(50) NOT NULL,
    platform_user_id VARCHAR(255) NOT NULL,
    platform_username VARCHAR(255) NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    token_type VARCHAR(50) DEFAULT 'Bearer',
    expires_at TIMESTAMP WITH TIME ZONE,
    scope TEXT,
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- 启用行级安全 (RLS)
ALTER TABLE user_social_connections ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略
CREATE POLICY IF NOT EXISTS "用户只能查看自己的社交连接" ON user_social_connections
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "用户只能插入自己的社交连接" ON user_social_connections
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "用户只能更新自己的社交连接" ON user_social_connections
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "用户只能删除自己的社交连接" ON user_social_connections
    FOR DELETE USING (auth.uid() = user_id);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为表添加更新时间触发器
DROP TRIGGER IF EXISTS update_user_social_connections_updated_at ON user_social_connections;
CREATE TRIGGER update_user_social_connections_updated_at 
    BEFORE UPDATE ON user_social_connections 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_user_social_connections_user_id ON user_social_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_user_social_connections_platform ON user_social_connections(platform);
CREATE INDEX IF NOT EXISTS idx_user_social_connections_active ON user_social_connections(user_id, platform, is_active);

-- 创建部分唯一索引，确保每个用户每个平台只有一个活跃连接
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_social_connections_unique_active 
    ON user_social_connections(user_id, platform) 
    WHERE is_active = TRUE;
`;

    // 执行 SQL 脚本
    const { error } = await supabase.rpc('exec_sql', { sql: sqlScript });
    
    if (error) {
      return {
        success: false,
        error: `创建数据库表失败: ${error.message}`
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: `创建数据库表失败: ${error instanceof Error ? error.message : '未知错误'}`
    };
  }
};