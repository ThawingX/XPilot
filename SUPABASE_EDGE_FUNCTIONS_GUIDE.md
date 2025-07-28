# Supabase Edge Functions 部署指南

## 概述

为了解决 Twitter API 的 CORS 问题，我们创建了三个 Supabase Edge Functions 作为代理：

1. `twitter-api-proxy` - 代理标准的 Twitter API v2 调用
2. `twitter-token-exchange` - 处理 OAuth 授权码交换访问令牌
3. `twitter-refresh-token` - 处理访问令牌刷新

## 部署步骤

### 1. 安装 Supabase CLI

```bash
npm install -g supabase
```

### 2. 登录 Supabase

```bash
supabase login
```

### 3. 链接到你的 Supabase 项目

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

### 4. 部署 Edge Functions

```bash
# 部署所有函数
supabase functions deploy

# 或者单独部署每个函数
supabase functions deploy twitter-api-proxy
supabase functions deploy twitter-token-exchange
supabase functions deploy twitter-refresh-token
```

### 5. 验证部署

部署完成后，你可以在 Supabase Dashboard 的 Edge Functions 部分看到这些函数。

## 函数说明

### twitter-api-proxy

- **用途**: 代理所有标准的 Twitter API v2 调用
- **输入**: 
  ```json
  {
    "endpoint": "users/me",
    "method": "GET",
    "body": {},
    "headers": {},
    "accessToken": "your_twitter_access_token"
  }
  ```
- **输出**: Twitter API 的响应数据

### twitter-token-exchange

- **用途**: 将 OAuth 授权码交换为访问令牌
- **输入**:
  ```json
  {
    "code": "oauth_authorization_code",
    "codeVerifier": "pkce_code_verifier",
    "redirectUri": "http://localhost:5173/auth/twitter/callback",
    "clientId": "your_twitter_client_id",
    "clientSecret": "your_twitter_client_secret"
  }
  ```
- **输出**: 包含 access_token 和 refresh_token 的对象

### twitter-refresh-token

- **用途**: 刷新过期的访问令牌
- **输入**:
  ```json
  {
    "refreshToken": "your_refresh_token",
    "clientId": "your_twitter_client_id",
    "clientSecret": "your_twitter_client_secret"
  }
  ```
- **输出**: 新的访问令牌信息

## 安全注意事项

1. **客户端密钥**: 客户端密钥现在安全地存储在服务器端（Edge Functions），不会暴露给前端
2. **CORS**: 所有函数都正确配置了 CORS 头，允许前端调用
3. **错误处理**: 包含详细的错误日志和用户友好的错误消息

## 故障排除

### 常见问题

1. **函数部署失败**: 确保你已经正确链接到 Supabase 项目
2. **权限错误**: 确保你的 Supabase 账户有部署 Edge Functions 的权限
3. **函数调用失败**: 检查 Supabase Dashboard 中的函数日志

### 调试

你可以在 Supabase Dashboard 的 Edge Functions 部分查看函数日志：

1. 进入 Supabase Dashboard
2. 选择你的项目
3. 导航到 Edge Functions
4. 点击相应的函数查看日志

## 本地开发

如果你想在本地测试这些函数：

```bash
# 启动本地 Supabase 环境
supabase start

# 在本地提供函数服务
supabase functions serve

# 测试函数
curl -X POST 'http://localhost:54321/functions/v1/twitter-api-proxy' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"endpoint": "users/me", "accessToken": "your_token"}'
```