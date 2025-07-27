# XPilot - Google登录集成

## 🚀 功能特性

### ✅ 已完成的Google登录功能
- 🔐 **Google OAuth 2.0 登录**
- 🎨 **现代化登录界面**
- 🔄 **自动会话管理**
- ⚡ **快速登录体验**
- 🛡️ **安全认证流程**
- 📱 **响应式设计**

## 🔧 快速开始

### 1. 环境配置
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，填入你的Supabase配置
VITE_SUPABASE_URL=你的_supabase_项目_url
VITE_SUPABASE_ANON_KEY=你的_supabase_匿名_密钥
```

### 2. 安装依赖
```bash
npm install
```

### 3. 启动开发服务器
```bash
npm run dev
```

## 🎯 Google登录配置

### Supabase 配置
1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 导航到 **Authentication > Providers**
4. 启用 **Google** 提供商
5. 填入 Google OAuth 客户端 ID 和密钥

### Google Cloud Console 配置
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建或选择项目
3. 启用 **Google+ API**
4. 创建 **OAuth 2.0 客户端 ID**
5. 添加授权重定向 URI：
   ```
   https://你的项目id.supabase.co/auth/v1/callback
   ```

## 🎨 组件使用

### GoogleLoginButton 组件
```tsx
import GoogleLoginButton from './components/GoogleLoginButton'

<GoogleLoginButton
  onSuccess={() => console.log('登录成功')}
  onError={(error) => console.error('登录失败:', error)}
  disabled={false}
/>
```

### 认证上下文
```tsx
import { useAuth } from './contexts/AuthContext'

const { user, signInWithGoogle, signOut, loading } = useAuth()

// 检查登录状态
if (user) {
  console.log('用户已登录:', user.email)
}
```

## 📁 项目结构

```
src/
├── components/
│   ├── Login.tsx              # 主登录组件
│   ├── GoogleLoginButton.tsx  # Google登录按钮
│   ├── AuthCallback.tsx       # OAuth回调处理
│   └── GoogleLoginTest.tsx    # 登录功能测试
├── contexts/
│   └── AuthContext.tsx        # 认证上下文
└── lib/
    └── supabase.ts            # Supabase客户端配置
```

## 🔒 安全特性

- ✅ **OAuth 2.0 标准认证**
- ✅ **JWT 令牌管理**
- ✅ **自动会话刷新**
- ✅ **安全的重定向处理**
- ✅ **错误处理和验证**

## 🎨 UI 特性

- 🎯 **现代化设计**
- 🔄 **加载状态指示**
- ⚠️ **错误提示**
- ✅ **成功反馈**
- 📱 **移动端适配**
- 🌙 **深色模式支持**

## 🐛 故障排除

### 常见问题

1. **环境变量未配置**
   ```bash
   # 检查 .env 文件是否存在且配置正确
   cat .env
   ```

2. **Google OAuth 配置错误**
   - 检查重定向 URI 是否正确
   - 确认客户端 ID 和密钥是否匹配

3. **Supabase 配置问题**
   - 验证项目 URL 和 API 密钥
   - 检查 Google 提供商是否已启用

### 调试技巧
```tsx
// 在浏览器控制台查看认证状态
console.log('用户:', user)
console.log('会话:', session)
console.log('加载状态:', loading)
```

## 📚 相关文档

- [Supabase Auth 文档](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 文档](https://developers.google.com/identity/protocols/oauth2)
- [React Context API](https://react.dev/reference/react/useContext)

## 🎉 开始使用

配置完成后，你的应用将支持：
- 🔐 **一键Google登录**
- 👤 **用户信息管理**
- 🔄 **自动登录状态保持**
- 📱 **跨设备同步**

立即体验现代化的Google登录功能！