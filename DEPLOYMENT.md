# 部署配置说明

## 问题解决方案

已修复Google登录在生产环境中重定向URL不正确的问题。

### 修改内容

1. **更新了 `.env` 文件**：
   - 将 `VITE_APP_URL` 从 `http://localhost:5173` 更改为 `https://x-pilot.vercel.app`

2. **修改了 `src/contexts/AuthContext.tsx`**：
   - Google登录的 `redirectTo` 现在使用环境变量 `VITE_APP_URL`
   - 如果环境变量不存在，则回退到 `window.location.origin`

3. **修改了 `src/lib/twitterAuth.ts`**：
   - Twitter登录的 `redirectTo` 也使用相同的环境变量配置

### Vercel 部署配置

在 Vercel Dashboard 中设置以下环境变量：

```
VITE_SUPABASE_URL=https://amugncveoxslbbxpyiar.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtdWduY3Zlb3hzbGJieHB5aWFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Mjk2MDgsImV4cCI6MjA2ODMwNTYwOH0.OWj4yXXkhg2nCDmmCxuCDsnd0iY2osvJbzcJvoO5sho
VITE_TWITTER_CLIENT_ID=Sl9ZTUZGSEhZQWZLdmdBb2FLcDY6MTpjaQ
VITE_TWITTER_CLIENT_SECRET=kTaHkWY1u39f3etLvv-jrlSjx91B2hAqhBajNLKgnuECbu6vWg
VITE_TWITTER_BEARER_TOKEN=AAAAAAAAAAAAAAAAAAAAAA0T3QEAAAAAyZ%2FCtNPXWc12T4I3Cl%2Fu9jWKq2c%3DaAaMFEcMVz2PvULxxLHU8s8mPZFV9VCV9tKFBGCvhGaHg0cAFy
VITE_APP_URL=https://x-pilot.vercel.app
```

### Google OAuth 配置

确保在 Google Cloud Console 中：

1. 在 OAuth 2.0 客户端 ID 的"已授权的重定向 URI"中添加：
   - `https://amugncveoxslbbxpyiar.supabase.co/auth/v1/callback`
   - `https://x-pilot.vercel.app/`

2. 在"已授权的 JavaScript 来源"中添加：
   - `https://x-pilot.vercel.app`

### Supabase 配置

在 Supabase Dashboard > Authentication > URL Configuration 中：

1. 设置 Site URL: `https://x-pilot.vercel.app`
2. 在 Redirect URLs 中添加: `https://x-pilot.vercel.app/**`

### 本地开发

为了保持本地开发的便利性，请将 `.env` 文件中的 `VITE_APP_URL` 改回本地地址：

```
VITE_APP_URL=http://localhost:5173
```

或者创建 `.env.local` 文件用于本地开发：

```
VITE_APP_URL=http://localhost:5173
```

### 验证修复

部署后，Google登录应该会正确重定向到 `https://x-pilot.vercel.app/` 而不是 `localhost:3000`。