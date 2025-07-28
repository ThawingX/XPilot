# Twitter UUID 错误修复说明

## 问题描述
之前在 Twitter 回调处理时遇到 UUID 格式错误：
```
Failed to save connection: invalid input syntax for type uuid: "user_1753691605783_446lgk39d"
```

## 问题原因
应用使用了自定义的 `SessionManager` 生成用户 ID，格式为 `user_${timestamp}_${random}`，但数据库表 `user_social_connections` 的 `user_id` 字段期望的是 Supabase 认证系统的 UUID 格式。

## 修复内容

### 1. 移除自定义 SessionManager
- 删除了 `SessionManager` 类及其所有方法
- 移除了自定义用户会话管理逻辑

### 2. 使用 Supabase 认证系统
修改了以下方法使用 `supabase.auth.getUser()` 获取真实的认证用户：

- `saveConnection()` - 保存 Twitter 连接时使用认证用户 ID
- `getUserConnection()` - 获取用户连接时使用认证用户 ID  
- `disconnectTwitter()` - 断开连接时使用认证用户 ID
- `refreshTwitterToken()` - 刷新 token 时使用认证用户 ID
- `getCurrentAppUser()` - 返回 Supabase 认证用户对象

### 3. 更新组件逻辑
- 修改 `TwitterAuthComponent` 检查用户登录状态
- 要求用户先登录应用再连接 Twitter 账户

## 测试步骤

### 1. 确保用户已登录
1. 访问应用：http://localhost:5177/
2. 如果未登录，使用 Google 登录或邮箱注册/登录
3. 确认看到主界面而不是登录页面

### 2. 测试 Twitter 连接
1. 进入 Profile 页面
2. 找到 Twitter 集成部分
3. 点击"连接 Twitter"按钮
4. 完成 Twitter OAuth 授权流程
5. 验证连接成功，不再出现 UUID 错误

### 3. 使用诊断页面测试
1. 访问：http://localhost:5177/twitter/diagnostics
2. 使用 CORS 测试功能验证代理函数正常工作
3. 检查所有测试项目是否通过

## 技术细节

### 数据库表结构
```sql
CREATE TABLE user_social_connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    -- 其他字段...
);
```

### 认证用户获取
```typescript
const { data: { user }, error: userError } = await supabase.auth.getUser();
if (userError || !user) {
    throw new Error('用户未登录，无法保存 Twitter 连接');
}
```

## 注意事项

1. **必须先登录**：用户必须先通过 Supabase 认证系统登录，才能连接 Twitter 账户
2. **UUID 兼容性**：现在所有用户 ID 都是标准的 UUID 格式，与数据库表结构完全兼容
3. **安全性提升**：使用官方认证系统比自定义会话管理更安全可靠

## 验证修复成功

如果修复成功，您应该能够：
- ✅ 正常完成 Twitter OAuth 流程
- ✅ 成功保存 Twitter 连接到数据库
- ✅ 不再看到 UUID 格式错误
- ✅ 能够使用 Twitter API 功能（发推文、获取用户信息等）

如果仍有问题，请检查：
1. 用户是否已正确登录 Supabase 认证系统
2. 数据库表结构是否正确
3. Supabase Edge Functions 是否正常部署