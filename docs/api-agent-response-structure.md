# /api/agent 接口返回值结构文档

## 接口概述
- **接口路径**: `/api/agent`
- **请求方法**: POST
- **响应类型**: Server-Sent Events (SSE) 流式响应
- **内容类型**: text/plain (SSE格式)

## 请求结构 (BackendRequest)
```typescript
interface BackendRequest {
  state: any[];                    // 状态数组
  tools: any[];                    // 工具数组，通过@符号选择的工具放在这里
  context: any[];                  // 上下文数组
  forwardedProps: Record<string, any>; // 转发属性
  messages: Array<{               // 消息历史
    content: string;
    role: string;
    id: string;
  }>;
  runId: string;                  // 运行ID
  threadId: string;               // 线程ID
}
```

## 工具选择机制
- 前端通过 `@` 符号可以选择对应的工具
- 可选工具类型:
  - `@post` - Vibe Generation Post
  - `@thread` - Vibe Generation Thread  
  - `@reply` - Vibe Auto Reply
  - `@strategy` - Vibe Operation Strategy
- 选择的工具会作为字符串数组放入请求参数的 `tools` 字段中
- 如果没有选择任何工具（页面上没有显示任何工具），`tools` 传参为空数组

## 流式响应结构

### SSE 数据格式
每个数据块都以 `data: ` 开头，后跟 JSON 格式的数据：
```
data: {JSON_DATA}
```

### 响应数据类型

#### 1. RAW 类型事件
```typescript
{
  type: "RAW",
  event: {
    event: string,        // 事件类型
    data: any            // 事件数据
  }
}
```

**主要 RAW 事件类型:**

##### on_chat_model_stream
流式内容输出事件
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

##### on_chat_model_end
聊天模型流结束事件
```typescript
{
  type: "RAW",
  event: {
    event: "on_chat_model_end",
    data: any            // 结束时的数据
  }
}
```

#### 2. STEP_STARTED 类型
步骤开始事件
```typescript
{
  type: "STEP_STARTED",
  stepName: string       // 步骤名称
}
```

#### 3. RUN_STARTED 类型
运行开始事件
```typescript
{
  type: "RUN_STARTED",
  threadId: string,      // 线程ID
  runId: string         // 运行ID
}
```

#### 4. 直接内容类型（向后兼容）
```typescript
{
  content: string        // 直接的文本内容
}
```

## 前端处理逻辑

### 流式响应处理
1. 使用 `fetch` API 发送 POST 请求
2. 获取响应的 `ReadableStream`
3. 使用 `TextDecoder` 解码数据块
4. 按行分割数据，查找以 `data: ` 开头的行
5. 解析 JSON 数据并根据类型进行处理

### 内容累积
- 所有流式内容会累积到 `assistantContent` 变量中
- 第一次收到内容时创建助手消息
- 后续内容更新现有助手消息

### 错误处理
- 支持最多5次重试机制
- 网络错误时显示重试状态
- 认证错误时显示登录提示
- 解析错误时在控制台输出警告

## 调试信息

### 控制台日志
- `Parsed stream data:` - 解析后的流数据
- `Streaming content:` - 流式内容片段
- `Chat model stream ended` - 聊天模型流结束
- `Step started:` - 步骤开始信息
- `Run started:` - 运行开始信息

### 常见响应示例

#### 正常流式响应
```
data: {"type":"RUN_STARTED","threadId":"thread_123","runId":"run_456"}
data: {"type":"STEP_STARTED","stepName":"processing"}
data: {"type":"RAW","event":{"event":"on_chat_model_stream","data":{"chunk":{"content":"Hello"}}}}
data: {"type":"RAW","event":{"event":"on_chat_model_stream","data":{"chunk":{"content":" world"}}}}
data: {"type":"RAW","event":{"event":"on_chat_model_end","data":{}}}
```

#### 错误响应
- HTTP 状态码非 200 时抛出错误
- 无法读取响应流时抛出错误
- JSON 解析失败时输出警告但不中断处理

## 注意事项
1. 接口需要有效的认证 token
2. 响应是流式的，需要逐步处理
3. 工具选择通过 `@` 符号触发，但实际传参是工具名称数组
4. 支持重试机制，但有最大重试次数限制
5. 所有流式内容最终会合并成完整的助手回复