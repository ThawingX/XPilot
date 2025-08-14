# AI Chat 响应格式与前端渲染文档

本文档详细描述了 X-Pilot AI Chat 系统中所有可能的响应格式及其对应的前端渲染方式。

## 目录

1. [基础消息格式](#基础消息格式)
2. [流式响应格式](#流式响应格式)
3. [特殊响应类型](#特殊响应类型)
4. [错误处理格式](#错误处理格式)
5. [计划生成格式](#计划生成格式)
6. [工具选择格式](#工具选择格式)
7. [前端渲染组件](#前端渲染组件)
8. [调试命令格式](#调试命令格式)

## 基础消息格式

### Message 接口定义

```typescript
interface Message {
  id: string;                    // 消息唯一标识
  content: string;               // 消息内容
  role: 'user' | 'assistant';    // 消息角色
  timestamp?: string;            // 时间戳
  planData?: PlanData;           // 计划数据（可选）
}
```

### 前端渲染方式

#### 用户消息气泡
- **位置**: 右对齐
- **样式**: 蓝色背景 (`bg-[#4792E6]`)
- **头像**: 用户头像圆形图标
- **内容**: 纯文本显示

#### 助手消息气泡
- **位置**: 左对齐
- **样式**: 白色背景，灰色边框
- **头像**: X-Pilot 渐变头像 (`bg-gradient-to-br from-purple-500 to-blue-600`)
- **内容**: 支持 Markdown 渲染（使用 `ReactMarkdown`）

## 流式响应格式

### 后端请求结构

```typescript
interface BackendRequest {
  state: any[];                  // 状态数组
  tools: any[];                  // 工具数组
  context: any[];                // 上下文数组
  forwardedProps: Record<string, any>; // 转发属性
  messages: Array<{              // 消息历史
    content: string;
    role: string;
    id: string;
  }>;
  runId: string;                 // 运行ID
  threadId: string;              // 线程ID
}
```

### SSE 流式响应类型

#### 1. RUN_STARTED 类型

```typescript
{
  type: "RUN_STARTED",
  threadId: string,      // 线程ID
  runId: string         // 运行ID
}
```

**前端处理**: 记录运行开始信息，控制台输出调试日志

#### 2. STEP_STARTED 类型

```typescript
{
  type: "STEP_STARTED",
  stepName: string       // 步骤名称
}
```

**前端处理**: 记录步骤开始信息，控制台输出调试日志

#### 3. RAW 事件类型

```typescript
{
  type: "RAW",
  event: {
    event: string,        // 事件类型
    data: any            // 事件数据
  }
}
```

##### 3.1 on_chat_model_stream 事件

```typescript
{
  type: "RAW",
  event: {
    event: "on_chat_model_stream",
    data: {
      chunk: {
        content: string    // 流式输出的文本内容片段
      }
    }
  }
}
```

**前端渲染**:
- 累积内容到 `assistantContent` 变量
- 首次收到内容时创建助手消息气泡
- 后续内容实时更新现有消息气泡
- 检测计划生成内容并更新计划生成缓冲区

##### 3.2 on_chat_model_end 事件

```typescript
{
  type: "RAW",
  event: {
    event: "on_chat_model_end",
    data: any            // 结束时的数据
  }
}
```

**前端处理**:
- 标记流式响应结束
- 如果有计划正在生成，更新状态为 `ready`
- 控制台输出 "Chat model stream ended"

#### 4. 直接内容类型（向后兼容）

```typescript
{
  content: string        // 直接的文本内容
}
```

**前端处理**: 与 `on_chat_model_stream` 相同的处理逻辑

## 特殊响应类型

### 状态消息

#### 网络重试消息

**格式**: `"网络重试中 (${retryCount}/5)..."`

**前端渲染**:
```jsx
<div className="flex justify-center mb-4">
  <div className="flex items-center p-3 space-x-2 max-w-md bg-blue-50 rounded-lg border border-blue-200">
    <div className="flex items-center space-x-1">
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
    <span className="text-sm font-medium text-blue-700">{content}</span>
  </div>
</div>
```

#### 网络异常消息

**格式**: `"网络异常，请重试！"`

**前端渲染**:
```jsx
<div className="flex justify-center mb-4">
  <div className="flex items-center p-3 space-x-2 max-w-md bg-red-50 rounded-lg border border-red-200">
    <AlertCircle size={16} className="flex-shrink-0 text-red-500" />
    <span className="text-sm font-medium text-red-700">{content}</span>
  </div>
</div>
```

### 加载状态

**前端渲染**:
```jsx
<div className="flex justify-start mb-4">
  <div className="flex items-start space-x-3 max-w-[80%]">
    {/* AI头像 */}
    <div className="flex-shrink-0">
      <div className="flex justify-center items-center w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full">
        <span className="text-xs font-bold text-white">XP</span>
      </div>
    </div>
    
    {/* 加载内容区域 */}
    <div className="flex flex-col items-start">
      <div className="mb-1 text-xs text-gray-500">X-Pilot</div>
      <div className="flex items-center p-4 space-x-3 bg-gray-50 rounded-2xl border border-gray-200">
        <Loader2 size={16} className="animate-spin text-[#4792E6]" />
        <span className="text-sm text-gray-600">正在思考...</span>
      </div>
    </div>
  </div>
</div>
```

## 错误处理格式

### 认证错误

**触发条件**: `error.message === '用户未登录'`

**消息格式**:
```typescript
{
  id: string,
  content: "用户未登录，请先登录后再使用AI助手功能",
  role: "assistant",
  timestamp: string
}
```

**前端渲染**: 标准助手消息气泡，红色文本提示

### HTTP 错误

**触发条件**: `response.status !== 200`

**错误格式**: `HTTP error! status: ${response.status}`

**前端处理**: 触发重试机制或显示网络异常消息

### 流读取错误

**触发条件**: 无法获取 `response.body.getReader()`

**错误格式**: `"无法读取响应流"`

**前端处理**: 显示网络异常消息

### JSON 解析错误

**前端处理**: 控制台输出警告，但不中断流式处理

```javascript
console.warn('Failed to parse stream data:', line, e);
```

## 计划生成格式

### PlanData 接口定义

```typescript
interface PlanData {
  id: string;
  title: string;
  description?: string;
  steps: PlanStep[];
  markdownContent?: string;
  mermaidDiagram?: string;
  status: 'generating' | 'ready' | 'confirmed' | 'executing' | 'completed';
  progress?: number;
}

interface PlanStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  estimatedTime?: string;
  priority?: 'high' | 'medium' | 'low';
  status?: 'pending' | 'in-progress' | 'completed' | 'blocked';
}
```

### 计划状态流转

1. **generating**: 正在生成计划
2. **ready**: 计划生成完成，等待用户确认
3. **confirmed**: 用户已确认计划
4. **executing**: 计划执行中
5. **completed**: 计划执行完成

### 前端渲染组件

#### PlanGenerationCard

**使用场景**: 计划生成和管理

**主要功能**:
- 显示计划标题、描述和步骤
- 支持 Markdown 内容渲染
- 支持 Mermaid 图表显示
- 提供确认、执行、取消操作按钮
- 显示执行进度条

**状态样式**:
- `generating`: 蓝色背景，旋转加载图标
- `ready`: 绿色背景，确认图标
- `confirmed`: 紫色背景，目标图标
- `executing`: 橙色背景，播放图标
- `completed`: 灰色背景，完成图标

#### PlanningCard

**使用场景**: 静态计划展示

**主要功能**:
- 展示计划概览信息
- 显示步骤列表和优先级
- 提供执行计划按钮

#### ExecutionStatusCard

**使用场景**: 计划执行状态监控

**主要功能**:
- 显示整体执行状态和进度
- 展示各步骤执行状态
- 显示开始时间、结束时间、持续时间
- 错误信息展示

## 工具选择格式

### 工具选项定义

```typescript
const CAPABILITY_OPTIONS = [
  { id: 'post', label: '@post', description: 'Vibe Generation Post' },
  { id: 'thread', label: '@thread', description: 'Vibe Generation Thread' },
  { id: 'reply', label: '@reply', description: 'Vibe Auto Reply' },
  { id: 'strategy', label: '@strategy', description: 'Vibe Operation Strategy' }
];
```

### 前端渲染

#### 工具选择器下拉菜单

```jsx
<div className="absolute bottom-full left-0 mb-2 w-80 bg-white rounded-lg border border-gray-200 shadow-lg z-50">
  <div className="p-2">
    {CAPABILITY_OPTIONS.map((option, index) => (
      <div
        key={option.id}
        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
          index === selectedCapabilityIndex 
            ? 'bg-[#4792E6] text-white' 
            : 'hover:bg-gray-50'
        }`}
        onClick={() => handleCapabilitySelect(option)}
      >
        <div className="flex items-center space-x-3">
          <span className="font-medium">{option.label}</span>
          <span className="text-sm opacity-75">{option.description}</span>
        </div>
      </div>
    ))}
  </div>
</div>
```

#### 选中工具显示

```jsx
<div className="flex justify-between items-center px-3 py-2 mb-3 bg-blue-50 rounded-lg border border-blue-200">
  <div className="flex items-center space-x-2">
    <span className="text-sm font-medium text-[#4792E6]">{selectedCapability.label}</span>
    <span className="text-xs text-[#4792E6]">{selectedCapability.description}</span>
  </div>
  <button
    onClick={() => setSelectedCapability(null)}
    className="text-[#4792E6] transition-colors hover:text-[#3a7bc8]"
  >
    ×
  </button>
</div>
```

### 工具传递格式

**后端请求中的工具数组**:
```typescript
const tools = currentCapability ? [currentCapability.id] : [];

const requestBody: BackendRequest = {
  // ...
  tools: tools, // ['post'] 或 ['thread'] 等
  // ...
};
```

## 前端渲染组件

### 核心渲染函数

#### renderMessageContent

**功能**: 渲染消息内容，支持 Markdown

**特殊处理**:
- 过滤状态消息（网络异常、重试消息）
- 支持 ReactMarkdown 渲染
- 计划内容检测（已注释）

#### renderStatusMessage

**功能**: 渲染状态消息（网络重试、错误）

**样式区分**:
- 重试消息: 蓝色背景，动画加载点
- 错误消息: 红色背景，警告图标

### 消息气泡结构

```jsx
<div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4 group`}>
  <div className={`flex ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'} items-start space-x-3 max-w-[80%]`}>
    {/* 头像 */}
    <div className="flex-shrink-0">
      {message.role === 'user' ? (
        <div className="w-8 h-8 rounded-full bg-[#4792E6] flex items-center justify-center">
          <User size={16} className="text-white" />
        </div>
      ) : (
        <div className="flex justify-center items-center w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full">
          <span className="text-xs font-bold text-white">XP</span>
        </div>
      )}
    </div>
    
    {/* 消息内容 */}
    <div className="flex flex-col items-start">
      <div className="mb-1 text-xs text-gray-500">
        {message.role === 'user' ? '你' : 'X-Pilot'}
      </div>
      
      <div className={`px-4 py-3 rounded-2xl max-w-full ${
        message.role === 'user' 
          ? 'bg-[#4792E6] text-white' 
          : 'bg-white border border-gray-200 text-gray-800'
      }`}>
        {renderMessageContent(message.content, message.role)}
      </div>
      
      {/* 复制按钮 */}
      <button
        onClick={() => handleCopyToChat(message.content)}
        className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded hover:bg-gray-100"
        title="复制到输入框"
      >
        <Copy size={14} className="text-gray-400" />
      </button>
    </div>
  </div>
</div>
```

## 调试命令格式

### 支持的调试命令

#### /debug-plan-make

**功能**: 触发计划生成调试模式

**前端处理**:
- 添加用户消息到聊天记录
- 不发送到后端
- 清空输入框和工具选择

#### /debug-plan-exec

**功能**: 触发计划执行调试模式

**前端处理**:
- 添加用户消息到聊天记录
- 不发送到后端
- 清空输入框和工具选择

### 调试日志格式

**控制台输出**:
```javascript
console.log('Parsed stream data:', data);
console.log('Streaming content:', content);
console.log('Chat model stream ended');
console.log('Step started:', stepName);
console.log('Run started:', { threadId, runId });
console.log('工具选择机制 - 当前选中的能力:', currentCapability);
console.log('工具选择机制 - 发送到后端的tools数组:', tools);
```

## 重试机制

### 重试逻辑

- **最大重试次数**: 5次（包含首次请求）
- **重试条件**: 网络错误、HTTP错误、流读取错误
- **重试间隔**: 立即重试
- **重试状态显示**: `"网络重试中 (${retryCount}/5)..."`

### 重试状态管理

```typescript
const [retryCount, setRetryCount] = useState(0);
const [shouldStopRetry, setShouldStopRetry] = useState(false);

// 重试逻辑
if (currentRetryCount < 4 && !shouldStopRetry) {
  setRetryCount(currentRetryCount + 1);
  // 延迟重试
  setTimeout(() => {
    sendMessageToBackend(message, currentRetryCount + 1, currentAssistantMessageId);
  }, 1000);
}
```

## 环境配置

### API 端点配置

```typescript
// 动态获取API基础URL
const apiBaseUrl = apiConfigService.getApiBaseUrl();

// 请求端点
const endpoint = `${apiBaseUrl}/api/agent`;
```

### 认证配置

```typescript
// 获取认证token
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;

// 请求头配置
const headers = {
  'Content-Type': 'application/json',
  ...(token && { 'Authorization': `Bearer ${token}` })
};
```

## 性能优化

### 流式处理优化

- 使用 `TextDecoder` 进行高效的字节流解码
- 按行分割数据，避免不完整的JSON解析
- 累积式内容更新，减少DOM操作频率

### 状态管理优化

- 使用 `useCallback` 优化事件处理函数
- 合理使用 `useEffect` 管理副作用
- 避免不必要的组件重渲染

### UI 渲染优化

- 虚拟滚动（如需要处理大量消息）
- 懒加载计划卡片组件
- 防抖输入处理

## 总结

X-Pilot AI Chat 系统支持多种响应格式和渲染方式：

1. **基础消息**: 用户和助手的文本对话
2. **流式响应**: 实时的内容流式传输
3. **状态消息**: 网络重试、错误提示等状态信息
4. **计划生成**: 复杂的计划创建和执行流程
5. **工具选择**: 多种AI能力的选择和使用
6. **错误处理**: 完善的错误捕获和用户提示
7. **调试功能**: 开发调试命令支持

所有响应格式都有对应的前端渲染组件和样式，确保用户体验的一致性和可用性。系统还包含完善的重试机制、认证处理和性能优化措施。