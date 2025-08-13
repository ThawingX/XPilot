# Supabase Edge Functions for Twitter Integration

本目录包含用于Twitter OAuth 2.0集成的Supabase Edge Functions。

## 函数列表

### 1. twitter-token-exchange
- **用途**: 将OAuth授权码交换为访问令牌
- **端点**: `/functions/v1/twitter-token-exchange`
- **方法**: POST
- **参数**:
  ```json
  {
    "code": "OAuth授权码",
    "code_verifier": "PKCE验证码",
    "redirect_uri": "重定向URI"
  }
  ```

### 2. twitter-api-proxy
- **用途**: 代理Twitter API调用，保护API密钥
- **端点**: `/functions/v1/twitter-api-proxy`
- **方法**: POST
- **参数**:
  ```json
  {
    "endpoint": "/users/me",
    "method": "GET",
    "access_token": "用户访问令牌",
    "params": { "user.fields": "id,name,username,profile_image_url" }
  }
  ```

### 3. twitter-refresh-token
- **用途**: 刷新过期的访问令牌
- **端点**: `/functions/v1/twitter-refresh-token`
- **方法**: POST
- **参数**:
  ```json
  {
    "refresh_token": "刷新令牌"
  }
  ```

## 环境变量配置

在Supabase项目中需要设置以下环境变量：

```bash
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
```

## 部署命令

```bash
# 部署所有函数
supabase functions deploy

# 部署单个函数
supabase functions deploy twitter-token-exchange
supabase functions deploy twitter-api-proxy
supabase functions deploy twitter-refresh-token
```

## 本地开发

```bash
# 启动本地开发服务器
supabase functions serve

# 测试特定函数
supabase functions serve twitter-token-exchange --debug
```

## 安全注意事项

1. **CORS配置**: 每个函数都内联了CORS头配置，无需额外的共享文件
2. **环境变量**: Twitter API密钥通过环境变量安全存储
3. **错误处理**: 包含完整的错误处理和日志记录
4. **PKCE验证**: token-exchange函数实现了PKCE安全验证

## 与前端集成

这些Edge Functions与前端的`twitterService.ts`配合使用：

- `exchangeCodeForTokens()` → `twitter-token-exchange`
- `getUserInfo()` → `twitter-api-proxy`
- `refreshToken()` → `twitter-refresh-token`