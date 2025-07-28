-- Supabase数据库设置脚本
-- 为Twitter (X) 账户绑定创建必要的数据库表

-- 1. 用户社交媒体连接表（核心表）
CREATE TABLE IF NOT EXISTS user_social_connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    platform VARCHAR(50) NOT NULL, -- 'twitter', 'linkedin', 'instagram' 等
    platform_user_id VARCHAR(255) NOT NULL, -- 平台上的用户ID
    platform_username VARCHAR(255) NOT NULL, -- 平台上的用户名
    access_token TEXT NOT NULL, -- 加密存储的访问令牌
    refresh_token TEXT, -- 刷新令牌（如果支持）
    token_type VARCHAR(50) DEFAULT 'Bearer',
    expires_at TIMESTAMP WITH TIME ZONE, -- 令牌过期时间
    scope TEXT, -- 授权范围
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- 启用行级安全 (RLS)
ALTER TABLE user_social_connections ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略
CREATE POLICY "用户只能查看自己的社交连接" ON user_social_connections
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "用户只能插入自己的社交连接" ON user_social_connections
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户只能更新自己的社交连接" ON user_social_connections
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "用户只能删除自己的社交连接" ON user_social_connections
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

COMMENT ON TABLE user_social_connections IS '用户社交媒体账户连接信息';