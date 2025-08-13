# 工具选择机制实现文档

## 概述

本文档描述了 X-Pilot 项目中工具选择机制的完整实现，包括前端UI交互、状态管理和后端API集成。

## 核心组件

### 1. 工具选项定义

```typescript
const CAPABILITY_OPTIONS = [
  { id: 'post', label: '@post', description: 'Vibe Generation Post' },
  { id: 'thread', label: '@thread', description: 'Vibe Generation Thread' },
  { id: 'reply', label: '@reply', description: 'Vibe Auto Reply' },
  { id: 'strategy', label: '@strategy', description: 'Vibe Operation Strategy' }
];
```

### 2. 状态管理

```typescript
const [showCapabilitySelector, setShowCapabilitySelector] = useState(false);
const [selectedCapabilityIndex, setSelectedCapabilityIndex] = useState(0);
const [selectedCapability, setSelectedCapability] = useState<typeof CAPABILITY_OPTIONS[0] | null>(null);
const [selectorPosition, setSelectorPosition] = useState({ top: 0, left: 0 });
```

## 工具选择流程

### 1. 触发工具选择器

**方式一：@ 按钮点击**
```typescript
const handleAtButtonClick = () => {
  setShowCapabilitySelector(true);
  setSelectedCapabilityIndex(0);
  setSelectorPosition({ top: -280, left: 0 });
};
```

**方式二：输入 @ 符号**
```typescript
const handleInputChange = (value: string) => {
  const lastAtIndex = value.lastIndexOf('@');
  if (lastAtIndex !== -1) {
    const textAfterAt = value.substring(lastAtIndex + 1);
    if (!textAfterAt.includes(' ') && !textAfterAt.includes('\n')) {
      setShowCapabilitySelector(true);
    }
  }
};
```

### 2. 工具选择

```typescript
const handleCapabilitySelect = (capability: typeof CAPABILITY_OPTIONS[0]) => {
  setSelectedCapability(capability);
  // 清理输入框中的@符号
  const lastAtIndex = inputValue.lastIndexOf('@');
  if (lastAtIndex !== -1) {
    // 移除@符号及其后的文本
    const newValue = inputValue.substring(0, lastAtIndex) + 
                    inputValue.substring(lastAtIndex + 1).replace(/^\S*/, '');
    setInputValue(newValue);
  }
  setShowCapabilitySelector(false);
};
```

### 3. 键盘导航

```typescript
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (showCapabilitySelector) {
    switch (e.key) {
      case 'ArrowUp':
        setSelectedCapabilityIndex(prev => 
          prev > 0 ? prev - 1 : CAPABILITY_OPTIONS.length - 1
        );
        break;
      case 'ArrowDown':
        setSelectedCapabilityIndex(prev => 
          prev < CAPABILITY_OPTIONS.length - 1 ? prev + 1 : 0
        );
        break;
      case 'Enter':
      case 'Tab':
        handleCapabilitySelect(CAPABILITY_OPTIONS[selectedCapabilityIndex]);
        break;
      case 'Escape':
        setShowCapabilitySelector(false);
        break;
    }
  }
};
```

## API 集成

### 1. 工具数组构建

```typescript
const sendMessageToBackend = async (
  message: string, 
  currentRetryCount = 0, 
  assistantMessageId?: string, 
  capability?: typeof CAPABILITY_OPTIONS[0] | null
) => {
  const currentCapability = capability || selectedCapability;
  const tools = currentCapability ? [currentCapability.id] : [];
  
  const requestBody: BackendRequest = {
    state: [],
    tools: tools, // 关键：将选中的工具ID传递给后端
    context: [],
    forwardedProps: {},
    messages: [...],
    runId: `run-${Date.now()}`,
    threadId: threadId
  };
};
```

### 2. 消息发送

```typescript
const handleSubmit = async (message: string) => {
  // 工具信息通过tools数组传递，不需要添加到消息内容中
  await sendMessageToBackend(message, 0, undefined, selectedCapability);
  
  // 发送后清除选中的能力
  setSelectedCapability(null);
};
```

## UI 组件

### 1. 工具选择器

```typescript
const renderCapabilitySelector = () => {
  if (!showCapabilitySelector) return null;

  return (
    <div className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-xl py-2 min-w-[280px]">
      <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
        Select Capability
      </div>
      {CAPABILITY_OPTIONS.map((option, index) => (
        <button
          key={option.id}
          onClick={() => handleCapabilitySelect(option)}
          className={`flex items-center justify-between px-4 py-3 w-full text-left ${
            index === selectedCapabilityIndex
              ? 'bg-blue-50 border-l-2 border-[#4792E6]'
              : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center space-x-3">
            <span className="font-medium text-[#4792E6]">{option.label}</span>
            <span className="text-sm text-gray-600">{option.description}</span>
          </div>
        </button>
      ))}
    </div>
  );
};
```

### 2. 选中工具显示

```typescript
const renderSelectedCapability = () => {
  if (!selectedCapability) return null;

  return (
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
  );
};
```

## 调试功能

系统包含详细的调试日志：

```typescript
console.log('工具选择机制 - 当前选中的能力:', currentCapability);
console.log('工具选择机制 - 发送到后端的tools数组:', tools);
console.log('Input change - value:', JSON.stringify(value));
console.log('Text after @:', JSON.stringify(textAfterAt));
```

## 使用方法

1. **点击 @ 按钮**：直接打开工具选择器
2. **输入 @ 符号**：在输入框中输入@会自动显示选择器
3. **键盘导航**：使用上下箭头键选择，Enter或Tab确认，Esc取消
4. **鼠标选择**：直接点击选项进行选择
5. **移除选择**：点击选中工具标签右侧的×按钮

## 技术特性

- ✅ 响应式UI设计
- ✅ 键盘导航支持
- ✅ 自动位置计算
- ✅ 点击外部区域关闭
- ✅ 实时输入过滤
- ✅ 工具状态持久化
- ✅ 错误处理和重试机制
- ✅ 调试日志支持

## 后端集成

工具选择信息通过 `/api/agent` 端点的 `tools` 数组字段传递：

```json
{
  "state": [],
  "tools": ["reply"], // 选中的工具ID
  "context": [],
  "forwardedProps": {},
  "messages": [...],
  "runId": "run-1234567890",
  "threadId": "thread-abcdef"
}
```

当没有选择工具时，`tools` 数组为空 `[]`。