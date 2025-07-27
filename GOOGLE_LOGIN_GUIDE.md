# Google 登录配置指南

## 🎯 概述
你的项目已经完全集成了Google登录功能！以下是完整的配置步骤。

## ✅ 已完成的功能
- ✅ Supabase客户端配置
- ✅ AuthContext认证上下文
- ✅ Google登录方法实现
- ✅ 登录组件UI
- ✅ 认证状态管理
- ✅ 用户会话处理

## 🔧 配置步骤

### 1. 环境变量配置
复制 `.env.example` 为 `.env` 并填入你的Supabase配置：

```bash
cp .env.example .env
```

在 `.env` 文件中填入：
```
VITE_SUPABASE_URL=你的_supabase_项目_url
VITE_SUPABASE_ANON_KEY=你的_supabase_匿名_密钥
```

### 2. Supabase Dashboard 配置
1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 导航到 **Authentication > Providers**
4. 启用 **Google** 提供商
5. 填入你的 Google OAuth 客户端 ID 和密钥

### 3. Google Cloud Console 配置
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建或选择项目
3. 启用 **Google+ API**
4. 创建 **OAuth 2.0 客户端 ID**
5. 添加授权重定向 URI：
   ```
   https://你的项目id.supabase.co/auth/v1/callback
   ```

### 4. 重定向 URL 配置
在 Supabase Dashboard > Authentication > URL Configuration 中设置：
- **Site URL**: `http://localhost:5174` (开发环境)
- **Redirect URLs**: 
  - `http://localhost:5174` (开发环境)
  - `https://你的域名.com` (生产环境)

## 🚀 使用方法

### 登录流程
1. 用户点击"使用 Google 登录"按钮
2. 重定向到 Google OAuth 页面
3. 用户授权后返回应用
4. 自动获取用户信息并登录

### 代码示例
```typescript
// 在组件中使用
import { useAuth } from '../contexts/AuthContext'

const { user, signInWithGoogle, signOut } = useAuth()

// Google 登录
const handleGoogleLogin = async () => {
  const { error } = await signInWithGoogle()
  if (error) {
    console.error('登录失败:', error.message)
  }
}

// 登出
const handleLogout = async () => {
  await signOut()
}
```

## 🎨 UI 特性
- 🎯 现代化登录界面
- 🔄 加载状态指示
- ⚠️ 错误处理和提示
- ✅ 成功状态反馈
- 📱 响应式设计
- 🌙 深色模式支持

## 🔒 安全特性
- 🛡️ OAuth 2.0 标准
- 🔐 JWT 令牌管理
- 🚫 自动会话过期
- 🔄 令牌刷新机制

## 📱 支持的功能
- ✅ Google 一键登录
- ✅ 邮箱密码登录
- ✅ 用户注册
- ✅ 密码重置
- ✅ 会话管理
- ✅ 自动登录状态保持

## 🐛 故障排除

### 常见问题
1. **Google登录按钮无响应**
   - 检查环境变量是否正确配置
   - 确认Google OAuth客户端ID是否正确

2. **重定向错误**
   - 检查Supabase重定向URL配置
   - 确认Google OAuth重定向URI设置

3. **认证失败**
   - 检查Google Cloud Console项目设置
   - 确认API已启用

### 调试技巧
```typescript
// 在浏览器控制台查看认证状态
console.log('当前用户:', user)
console.log('会话信息:', session)
```

## 🎉 完成！
配置完成后，你的应用将支持：
- 🔐 安全的Google登录
- 👤 用户状态管理
- 🔄 自动会话处理
- 📱 跨设备同步