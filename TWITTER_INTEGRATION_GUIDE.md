# Twitter (X) API 集成指南

## 概述

本项目实现了完整的 Twitter (X) API 集成，支持用户绑定 Twitter 账户并通过 API 进行后续登录和基本操作。

## 已完成功能

### 1. 数据库架构 (Supabase)
- **user_social_connections**: 存储用户社交媒体连接信息
- **Row Level Security (RLS)**: 确保数据安全
- **自动更新触发器**: 维护数据一致性

### 2. 前端集成
- **TwitterService**: 完整的 Twitter API 服务类
- **TwitterCallback**: OAuth 回调处理组件
- **Profile 组件**: 集成 Twitter 连接管理
- **React Router**: 支持回调路由

### 3. 环境配置
- **.env.example**: 环境变量模板
- **package.json**: 添加 react-router-dom 依赖

## 设置步骤

### 1. Supabase 配置

执行 `supabase-setup.sql` 中的 SQL 语句来创建必要的数据库表：

```sql
-- 创建用户社交媒体连接表
CREATE TABLE user_social_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  platform_user_id VARCHAR(255) NOT NULL,
  platform_username VARCHAR(255),
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, platform)
);

-- 启用 RLS
ALTER TABLE user_social_connections ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略
CREATE POLICY "Users can view own connections" ON user_social_connections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own connections" ON user_social_connections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own connections" ON user_social_connections
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own connections" ON user_social_connections
  FOR DELETE USING (auth.uid() = user_id);

-- 创建更新触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_social_connections_updated_at
  BEFORE UPDATE ON user_social_connections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2. Twitter 开发者账户设置

1. 访问 [Twitter Developer Portal](https://developer.twitter.com/)
2. 创建新应用或使用现有应用
3. 在应用设置中配置：
   - **Callback URL**: `http://localhost:5176/auth/twitter/callback`
   - **Website URL**: `http://localhost:5176`
   - **权限**: 读取和写入
4. 获取以下凭据：
   - Client ID
   - Client Secret

### 3. 环境变量配置

创建 `.env` 文件并配置以下变量：

```env
# Supabase 配置
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Twitter API 配置
VITE_TWITTER_CLIENT_ID=your_twitter_client_id
VITE_TWITTER_CLIENT_SECRET=your_twitter_client_secret
VITE_TWITTER_REDIRECT_URI=http://localhost:5176/auth/twitter/callback
```

### 4. 安装和启动

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 使用流程

### 用户连接 Twitter 账户

1. 用户在 Profile 页面点击"连接 Twitter 账户"
2. 系统生成 OAuth 2.0 授权 URL
3. 用户被重定向到 Twitter 授权页面
4. 用户授权后，Twitter 重定向回应用
5. 应用处理回调，交换访问令牌
6. 连接信息存储到数据库
7. 用户返回 Profile 页面，显示连接状态

### 断开连接

1. 用户点击"断开连接"按钮
2. 系统从数据库删除连接记录
3. 更新 UI 状态

## 数据库表结构

### user_social_connections

| 字段 | 类型 | 描述 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID | 用户 ID (外键) |
| platform | VARCHAR(50) | 平台名称 (twitter) |
| platform_user_id | VARCHAR(255) | Twitter 用户 ID |
| platform_username | VARCHAR(255) | Twitter 用户名 |
| access_token | TEXT | 访问令牌 |
| refresh_token | TEXT | 刷新令牌 |
| token_expires_at | TIMESTAMP | 令牌过期时间 |
| connected_at | TIMESTAMP | 连接时间 |
| updated_at | TIMESTAMP | 更新时间 |

## 安全特性

- **OAuth 2.0 PKCE**: 使用 PKCE 流程增强安全性
- **Row Level Security**: Supabase RLS 确保数据隔离
- **令牌加密存储**: 敏感信息安全存储
- **HTTPS 重定向**: 生产环境强制 HTTPS

## UI/UX 特性

- **实时状态更新**: 连接状态实时反映
- **错误处理**: 友好的错误提示
- **加载状态**: 连接过程中的加载指示器
- **响应式设计**: 适配各种屏幕尺寸

## 开发者工具

### TwitterService API

```typescript
// 获取授权 URL
const authUrl = await twitterService.getAuthUrl();

// 处理回调
const connection = await twitterService.handleCallback(code, state);

// 获取用户连接
const connection = await twitterService.getUserConnection();

// 断开连接
await twitterService.disconnectTwitter();

// 进行 API 调用
const response = await twitterService.apiCall('/2/users/me');
```

## 生产部署注意事项

1. **环境变量**: 确保所有生产环境变量正确配置
2. **HTTPS**: 生产环境必须使用 HTTPS
3. **回调 URL**: 更新 Twitter 应用的回调 URL 为生产域名
4. **错误监控**: 建议集成错误监控服务
5. **日志记录**: 实现适当的日志记录机制

## 重要说明

- 本集成专注于账户绑定和基本 API 访问
- 不包含推文数据库管理功能
- 支持 OAuth 2.0 PKCE 流程
- 所有敏感数据都经过加密存储
- 遵循 Twitter API 使用条款和限制

## 故障排除

### 常见问题

1. **回调 URL 不匹配**: 确保 Twitter 应用配置的回调 URL 与代码中的一致
2. **环境变量未设置**: 检查 `.env` 文件是否正确配置
3. **Supabase 连接问题**: 验证 Supabase URL 和密钥
4. **权限问题**: 确保 Twitter 应用有适当的权限设置

### 调试技巧

- 检查浏览器控制台的错误信息
- 验证网络请求和响应
- 确认数据库表和 RLS 策略正确设置
- 测试 Twitter API 凭据的有效性

---

如有问题，请查看代码注释或联系开发团队。