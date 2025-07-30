# CoPilotKit 使用指南

## 概述

CoPilotKit 是一个强大的 AI 助手框架，用于构建智能对话界面和 AI 驱动的应用程序。本项目已集成 CoPilotKit 来实现 Vibe X Operation 对话功能。

## 安装的包

```bash
npm install @copilotkit/react-core @copilotkit/react-ui @copilotkit/react-textarea
```

## 核心组件

### 1. CopilotKit Provider

```tsx
import { CopilotKit } from '@copilotkit/react-core';

<CopilotKit runtimeUrl="/api/copilotkit">
  {/* 你的应用组件 */}
</CopilotKit>
```

### 2. CopilotTextarea

```tsx
import { CopilotTextarea } from '@copilotkit/react-textarea';

<CopilotTextarea
  className="your-styles"
  placeholder="输入消息..."
  value={value}
  onChange={onChange}
/>
```

## 项目中的实现

### AI Assistant 组件

在 `src/components/AIAssistant.tsx` 中，我们实现了：

1. **能力选择器**: 用户可以通过 `@` 符号选择特定能力
   - `@reply` - 智能回复功能
   - `@post` - 内容发布功能
   - `@thread` - 话题串联功能
   - `@strategy` - 营销策略功能

2. **流式响应**: 支持实时流式 AI 响应
3. **CoPilotKit 集成**: 使用 CoPilotKit 框架包装整个组件

### API 集成

组件连接到 `/api/chat` 接口，支持：
- 流式响应 (Server-Sent Events)
- 对话历史管理
- 错误处理
- 用户身份验证

## 使用方法

### 基本聊天
用户可以直接输入消息进行普通的 AI 对话。

### 能力选择
1. 输入 `@` 符号
2. 从弹出的能力选择器中选择所需功能
3. 系统会自动插入对应的能力标识符

### 流式响应
AI 响应会实时流式显示，包含：
- 打字动画效果
- 实时内容更新
- 完成状态指示

## 后端集成

后端使用 Langraph 框架与 CoPilotKit 对接：

```python
# 示例后端集成代码
from langraph import Graph
from copilotkit import CopilotKitSDK

# 创建 Langraph 工作流
workflow = Graph()

# 集成 CoPilotKit
copilot = CopilotKitSDK(
    runtime_url="/api/copilotkit",
    workflow=workflow
)
```

## 自定义配置

### 样式定制
所有组件都使用 Tailwind CSS 进行样式设计，可以轻松自定义：

```tsx
className="bg-white border-l border-gray-200 h-full transition-all duration-300"
```

### 功能扩展
要添加新的能力，只需在 `capabilities` 数组中添加新项：

```tsx
const capabilities: Capability[] = [
  // 现有能力...
  {
    id: 'new-capability',
    name: 'new',
    description: '新功能描述',
    icon: YourIcon,
    color: 'text-blue-500'
  }
];
```

## 最佳实践

1. **错误处理**: 始终包含适当的错误处理和用户反馈
2. **性能优化**: 使用 React.memo 和 useCallback 优化性能
3. **可访问性**: 确保所有交互元素都有适当的 ARIA 标签
4. **响应式设计**: 使用 Tailwind 的响应式类确保移动端兼容性

## 故障排除

### 常见问题

1. **CoPilotKit 连接失败**
   - 检查 `runtimeUrl` 配置
   - 确认后端 API 正常运行

2. **流式响应不工作**
   - 验证 Server-Sent Events 格式
   - 检查网络连接和 CORS 设置

3. **能力选择器不显示**
   - 确认 `@` 符号检测逻辑
   - 检查 DOM 事件监听器

## 更多资源

- [CoPilotKit 官方文档](https://docs.copilotkit.ai/)
- [Langraph 文档](https://langchain-ai.github.io/langgraph/)
- [React 最佳实践](https://react.dev/learn)