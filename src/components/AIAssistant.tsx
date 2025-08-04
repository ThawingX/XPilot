import React, { useState, useRef, useEffect } from 'react';
import { Send, Zap, ChevronLeft, ChevronRight, Square, Loader2, AlertCircle, Wifi, WifiOff, Maximize2, Minimize2, Plus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// 定义消息类型
interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp?: string;
}

// 定义后端请求结构
interface BackendRequest {
  state: any[];
  tools: any[];
  context: any[];
  forwardedProps: Record<string, any>;
  messages: Array<{
    content: string;
    role: string;
    id: string;
  }>;
  runId: string;
  threadId: string;
}

// Capability selector options
const CAPABILITY_OPTIONS = [
  { id: 'post', label: '@post', description: 'Vibe Generation Post' },
  { id: 'thread', label: '@thread', description: 'Vibe Generation Thread' },
  { id: 'reply', label: '@reply', description: 'Vibe Auto Reply' },
  { id: 'strategy', label: '@strategy', description: 'Vibe Operation Strategy' }
];

const AIAssistant: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showCapabilitySelector, setShowCapabilitySelector] = useState(false);
  const [selectedCapabilityIndex, setSelectedCapabilityIndex] = useState(0);
  const [selectorPosition, setSelectorPosition] = useState({ top: 0, left: 0 });
  const [atTriggerPosition, setAtTriggerPosition] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedCapability, setSelectedCapability] = useState<typeof CAPABILITY_OPTIONS[0] | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState(() => `thread-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const [retryCount, setRetryCount] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 生成唯一ID
  const generateId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // 新增聊天窗口功能
  const handleNewChat = () => {
    // 清空当前消息
    setMessages([]);
    // 重置加载状态
    setIsLoading(false);
    // 清除错误信息
    setError(null);
    // 重置重试计数
    setRetryCount(0);
    // 清空输入框
    setInputValue('');
    // 清除选中的能力
    setSelectedCapability(null);
    // 重新生成threadId，确保新对话有独立的会话ID
    setThreadId(`thread-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    
    console.log('新建聊天窗口，生成新的threadId');
  };

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 监听消息变化，自动滚动到底部
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // 发送消息到后端（带重试机制）
  const sendMessageToBackend = async (message: string, currentRetryCount = 0, assistantMessageId?: string) => {
    setError(null);
    setRetryCount(currentRetryCount);

    // 将 currentAssistantMessageId 移到函数顶部，确保在 catch 块中也能访问
    let currentAssistantMessageId = assistantMessageId;

    // 只在第一次调用时添加用户消息并设置加载状态
    if (currentRetryCount === 0) {
      setIsLoading(true);
      
      // 添加用户消息到本地状态
      const userMessage: Message = {
        id: generateId(),
        content: message,
        role: 'user',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, userMessage]);
    }

    try {
      // 构建符合后端要求的请求体
      const requestBody: BackendRequest = {
        state: [],
        tools: [],
        context: [],
        forwardedProps: {},
        messages: [
          ...messages.map(msg => ({
            content: msg.content,
            role: msg.role,
            id: msg.id
          })),
          {
            content: message,
            role: 'user',
            id: generateId()
          }
        ],
        runId: `run-${Date.now()}`,
        threadId: threadId
      };

      console.log('发送请求到后端:', requestBody);

      const response = await fetch('https://pilotapi.producthot.top/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 处理流式响应
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法读取响应流');
      }

      // 重试时更新助手消息显示重试状态
      if (currentRetryCount > 0 && currentAssistantMessageId) {
        setMessages(prev => prev.map(msg => 
          msg.id === currentAssistantMessageId 
            ? { ...msg, content: `网络重试中 (${currentRetryCount}/5)...` }
            : msg
        ));
      }

      // 读取流式响应
      const decoder = new TextDecoder();
      let assistantContent = '';
      let assistantMessageCreated = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.trim() && line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              console.log('Parsed stream data:', data);
              
              // 处理不同类型的数据
              if (data.type === 'RAW' && data.event) {
                // 处理 RAW 事件中的流式内容
                if (data.event.event === 'on_chat_model_stream' && data.event.data?.chunk?.content) {
                  const content = data.event.data.chunk.content;
                  console.log('Streaming content:', content);
                  assistantContent += content;
                  
                  // 第一次收到内容时创建助手消息
                  if (!assistantMessageCreated) {
                    const assistantMessage: Message = {
                      id: generateId(),
                      content: assistantContent,
                      role: 'assistant',
                      timestamp: new Date().toISOString()
                    };
                    currentAssistantMessageId = assistantMessage.id;
                    setMessages(prev => [...prev, assistantMessage]);
                    assistantMessageCreated = true;
                  } else {
                    // 更新助手消息内容
                    setMessages(prev => prev.map(msg => 
                      msg.id === currentAssistantMessageId 
                        ? { ...msg, content: assistantContent }
                        : msg
                    ));
                  }
                }
                // 处理其他RAW事件类型（如果需要）
                else if (data.event.event === 'on_chat_model_end') {
                  console.log('Chat model stream ended');
                }
              } 
              // 处理其他事件类型
              else if (data.type === 'STEP_STARTED') {
                console.log('Step started:', data.stepName);
              }
              else if (data.type === 'RUN_STARTED') {
                console.log('Run started:', data.threadId, data.runId);
              }
              // 处理直接的 content 字段（向后兼容）
              else if (data.content) {
                assistantContent += data.content;
                
                // 第一次收到内容时创建助手消息
                if (!assistantMessageCreated) {
                  const assistantMessage: Message = {
                    id: generateId(),
                    content: assistantContent,
                    role: 'assistant',
                    timestamp: new Date().toISOString()
                  };
                  currentAssistantMessageId = assistantMessage.id;
                  setMessages(prev => [...prev, assistantMessage]);
                  assistantMessageCreated = true;
                } else {
                  // 更新助手消息内容
                  setMessages(prev => prev.map(msg => 
                    msg.id === currentAssistantMessageId 
                      ? { ...msg, content: assistantContent }
                      : msg
                  ));
                }
              }
            } catch (e) {
              console.warn('解析流数据失败:', e, '原始数据:', line);
            }
          }
        }
      }

    } catch (error: any) {
      console.error('发送消息失败:', error);
      
      // 检查是否需要重试 - 最多重试4次（总共5次尝试）
      if (currentRetryCount < 4) {
        console.log(`网络错误，正在重试 (${currentRetryCount + 1}/5)...`);
        
        // 更新重试状态
        setRetryCount(currentRetryCount + 1);
        
        // 如果还没有助手消息，创建一个显示重试状态的消息
        if (!currentAssistantMessageId) {
          const assistantMessage: Message = {
            id: generateId(),
            content: `网络重试中 (${currentRetryCount + 1}/5)...`,
            role: 'assistant',
            timestamp: new Date().toISOString()
          };
          currentAssistantMessageId = assistantMessage.id;
          setMessages(prev => [...prev, assistantMessage]);
        } else {
          // 更新助手消息显示重试状态
          setMessages(prev => prev.map(msg => 
            msg.id === currentAssistantMessageId 
              ? { ...msg, content: `网络重试中 (${currentRetryCount + 1}/5)...` }
              : msg
          ));
        }
        
        // 延迟重试，避免频繁请求
        setTimeout(() => {
          sendMessageToBackend(message, currentRetryCount + 1, currentAssistantMessageId);
        }, 1000 * (currentRetryCount + 1)); // 递增延迟
        return;
      }
      
      // 达到5次尝试后仍然失败，更新消息内容为网络异常
      if (!currentAssistantMessageId) {
        // 如果还没有助手消息，创建一个显示网络异常的消息
        const assistantMessage: Message = {
          id: generateId(),
          content: '网络异常，请重试！',
          role: 'assistant',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        setMessages(prev => prev.map(msg => 
          msg.id === currentAssistantMessageId 
            ? { ...msg, content: '网络异常，请重试！' }
            : msg
        ));
      }
    } finally {
      setIsLoading(false);
      setRetryCount(0);
    }
  };

  // 停止响应
  const stopResponse = () => {
    setIsLoading(false);
  };

  // Handle @ button click
  const handleAtButtonClick = () => {
    // 直接显示选择器，不在输入框中添加@符号
    setShowCapabilitySelector(true);
    setSelectedCapabilityIndex(0);
    setSelectorPosition({ top: -280, left: 0 });
    
    // Focus the textarea
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 0);
  };

  // Handle input value changes and detect @ symbol
  const handleInputChange = (value: string) => {
    setInputValue(value);
    
    // Debug: Check the input value
    console.log('Input change - value:', JSON.stringify(value));
    
    const lastAtIndex = value.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      // Get text after the last @
      const textAfterAt = value.substring(lastAtIndex + 1);
      
      // Debug: Check what's after @
      console.log('Text after @:', JSON.stringify(textAfterAt));
      console.log('Has space:', textAfterAt.includes(' '));
      console.log('Has newline:', textAfterAt.includes('\n'));
      
      // Check if there's a space or newline after @, which should close the selector
      if (textAfterAt.includes(' ') || textAfterAt.includes('\n')) {
        console.log('Closing selector due to space/newline');
        setShowCapabilitySelector(false);
      } else {
        // Show selector when @ is present and no space/newline after it
        console.log('Showing selector');
        setShowCapabilitySelector(true);
        setSelectedCapabilityIndex(0);
        setAtTriggerPosition(lastAtIndex);
        
        // Simple positioning - show above input
        setSelectorPosition({ top: -280, left: 0 }); // 调整位置，往上移动更多
        
        // If there's text after @, filter options
        if (textAfterAt.length > 0) {
          const filteredOptions = CAPABILITY_OPTIONS.filter(option =>
            option.label.toLowerCase().includes(textAfterAt.toLowerCase())
          );
          // Only show selector if there are matching options
          if (filteredOptions.length === 0) {
            setShowCapabilitySelector(false);
          }
        }
      }
    } else {
      // No @ symbol found, hide selector
      setShowCapabilitySelector(false);
    }
  };

  // Handle capability selection
  const handleCapabilitySelect = (capability: typeof CAPABILITY_OPTIONS[0]) => {
    // 设置选中的能力，显示在输入框上方
    setSelectedCapability(capability);
    
    // 如果输入框中有@符号，则删除它
    const lastAtIndex = inputValue.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const beforeAt = inputValue.substring(0, lastAtIndex);
      const afterAt = inputValue.substring(lastAtIndex + 1);
      
      // 找到@后面单词的结束位置
      const spaceIndex = afterAt.indexOf(' ');
      const newlineIndex = afterAt.indexOf('\n');
      let endIndex = afterAt.length;
      
      if (spaceIndex !== -1) endIndex = Math.min(endIndex, spaceIndex);
      if (newlineIndex !== -1) endIndex = Math.min(endIndex, newlineIndex);
      
      const afterWord = afterAt.substring(endIndex);
      const newValue = beforeAt + afterWord;
      setInputValue(newValue);
    }
    
    setShowCapabilitySelector(false);
  };

  // 处理点击外部区域关闭选择器
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setShowCapabilitySelector(false);
      }
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 处理消息发送时包含选中的能力
  const handleSubmit = async (message: string) => {
    if (!message.trim() || isLoading) return;
    
    setError(null); // 清除之前的错误
    
    try {
      // 如果有选中的能力，将其添加到消息前面
      let finalMessage = message;
      if (selectedCapability) {
        finalMessage = `${selectedCapability.label} ${message}`;
      }
      
      // 发送消息到后端
      await sendMessageToBackend(finalMessage);
      
      setInputValue('');
      // 发送后清除选中的能力
      setSelectedCapability(null);
    } catch (error: any) {
      console.error('发送消息失败:', error);
    }
  };

  // 自定义消息处理功能 - 替代 CopilotKit 的 action 功能
  const handleMessageAction = async (message: string) => {
    try {
      await sendMessageToBackend(message);
      return `Message sent: ${message}`;
    } catch (error) {
      console.error('Message action failed:', error);
      throw error;
    }
  };

  // 处理容器焦点
  const handleContainerFocus = () => {
    setIsFocused(true);
  };

  // 处理输入框失去焦点
  const handleInputBlur = (e: React.FocusEvent) => {
    // 不立即设置失去焦点，让容器点击事件有机会处理
    // 只有当焦点真正移到容器外部时才失去焦点
  };

  // 停止响应 - 使用自定义实现
  const handleStopResponse = () => {
    if (isLoading) {
      stopResponse();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle capability selector navigation
    if (showCapabilitySelector) {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setSelectedCapabilityIndex(prev => 
            prev > 0 ? prev - 1 : CAPABILITY_OPTIONS.length - 1
          );
          return;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedCapabilityIndex(prev => 
            prev < CAPABILITY_OPTIONS.length - 1 ? prev + 1 : 0
          );
          return;
        case 'Enter':
          e.preventDefault();
          handleCapabilitySelect(CAPABILITY_OPTIONS[selectedCapabilityIndex]);
          return;
        case 'Escape':
          e.preventDefault();
          setShowCapabilitySelector(false);
          return;
        case 'Tab':
          e.preventDefault();
          handleCapabilitySelect(CAPABILITY_OPTIONS[selectedCapabilityIndex]);
          return;
      }
    }

    // Handle normal input
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isLoading) {
        handleStopResponse();
      } else {
        handleSubmit(inputValue);
      }
    }
  };

  // 渲染发送按钮 - 基于 CopilotKit 状态
  const renderSendButton = () => {
    if (isLoading) {
      return (
        <button
          onClick={handleStopResponse}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-md bg-red-500 hover:bg-red-600 text-white transition-all duration-200 shadow-sm hover:shadow-md"
          title="停止响应"
        >
          <Square size={14} />
          <span className="text-xs font-medium">停止</span>
        </button>
      );
    }

    return (
      <button
        onClick={() => handleSubmit(inputValue)}
        disabled={!inputValue.trim()}
        className="flex items-center space-x-1 px-3 py-1.5 rounded-md bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white transition-all duration-200 shadow-sm hover:shadow-md disabled:shadow-none"
        title="发送消息"
      >
        <Send size={14} />
        <span className="text-xs font-medium">发送</span>
      </button>
    );
  };

  // 渲染重试状态（已合并到消息气泡中，此函数保留为空）
  const renderRetryStatus = () => {
    return null;
  };

  // 渲染选中的能力标签
  const renderSelectedCapability = () => {
    if (!selectedCapability) return null;

    return (
      <div className="flex justify-between items-center px-3 py-2 mb-3 bg-purple-50 rounded-lg border border-purple-200">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-purple-600">{selectedCapability.label}</span>
          <span className="text-xs text-purple-500">{selectedCapability.description}</span>
        </div>
        <button
          onClick={() => setSelectedCapability(null)}
          className="text-purple-400 transition-colors hover:text-purple-600"
          title="Remove capability"
        >
          ×
        </button>
      </div>
    );
  };

  // Render capability selector with enhanced UI and keyboard navigation
  const renderCapabilitySelector = () => {
    if (!showCapabilitySelector) return null;

    return (
      <div
        ref={selectorRef}
        className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-xl py-2 min-w-[280px] backdrop-blur-sm"
        style={{
          top: selectorPosition.top,
          left: selectorPosition.left,
          animation: 'fadeInUp 0.15s ease-out'
        }}
      >
        <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
          Select Capability
        </div>
        {CAPABILITY_OPTIONS.map((option, index) => (
          <button
            key={option.id}
            onClick={() => handleCapabilitySelect(option)}
            className={`flex items-center justify-between px-4 py-3 w-full text-left transition-all duration-150 ${
              index === selectedCapabilityIndex
                ? 'bg-purple-50 border-l-2 border-purple-500'
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className={`font-medium ${
                index === selectedCapabilityIndex ? 'text-purple-600' : 'text-purple-500'
              }`}>
                {option.label}
              </span>
              <span className="text-sm text-gray-600">{option.description}</span>
            </div>
            {index === selectedCapabilityIndex && (
              <div className="flex items-center space-x-1 text-xs text-gray-400">
                <span>↵</span>
              </div>
            )}
          </button>
        ))}
        <div className="px-3 py-2 text-xs text-gray-400 border-t border-gray-100">
          ↑↓ Navigate • ↵ Select • Esc Cancel
        </div>
      </div>
    );
  };

  // 渲染消息内容 - 支持 Markdown
  const renderMessageContent = (content: string, role: 'user' | 'assistant') => {
    if (role === 'assistant') {
      // 检查是否是网络异常消息或重试消息，这些不在气泡中显示
      const isNetworkError = content.includes('网络异常');
      const isRetrying = content.includes('网络重试中');
      
      // 如果是状态消息，返回null，这些消息将单独显示
      if (isNetworkError || isRetrying) {
        return null;
      }
      
      return (
        <div className="max-w-none text-white prose prose-sm">
          <ReactMarkdown
            components={{
            // 自定义代码块样式
            code: ({ node, inline, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || '');
              return !inline ? (
                <pre className="overflow-x-auto p-3 bg-purple-800 rounded-md">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              ) : (
                <code className="bg-purple-800 px-1 py-0.5 rounded text-sm" {...props}>
                  {children}
                </code>
              );
            },
            // 自定义链接样式
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-200 underline hover:text-white"
              >
                {children}
              </a>
            ),
            // 自定义列表样式
            ul: ({ children }) => (
              <ul className="my-2 space-y-1 list-disc list-inside">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="my-2 space-y-1 list-decimal list-inside">
                {children}
              </ol>
            ),
            // 自定义标题样式
            h1: ({ children }) => (
              <h1 className="mt-4 mb-2 text-lg font-bold text-white">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="mt-3 mb-2 text-base font-semibold text-white">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="mt-2 mb-1 text-sm font-medium text-white">
                {children}
              </h3>
            ),
            // 自定义段落样式
            p: ({ children }) => (
              <p className="mb-2 leading-relaxed">
                {children}
              </p>
            ),
            // 自定义引用样式
            blockquote: ({ children }) => (
              <blockquote className="pl-4 my-2 italic text-purple-100 border-l-4 border-purple-300">
                {children}
              </blockquote>
            ),
            // 自定义表格样式
            table: ({ children }) => (
              <div className="overflow-x-auto my-2">
                <table className="min-w-full rounded-md border border-purple-400">
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className="px-3 py-2 font-medium text-left bg-purple-800 border border-purple-400">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-3 py-2 border border-purple-400">
                {children}
              </td>
            ),
          }}
          >
            {content}
          </ReactMarkdown>
        </div>
      );
    } else {
      // 用户消息保持原样
      return <div className="text-sm whitespace-pre-wrap">{content}</div>;
    }
  };

  // 渲染状态消息（网络重试和错误）
  const renderStatusMessage = (content: string) => {
    const isNetworkError = content.includes('网络异常');
    const isRetrying = content.includes('网络重试中');
    
    if (isNetworkError) {
      return (
        <div className="flex justify-center mb-4">
          <div className="flex items-center p-3 space-x-2 max-w-md bg-red-50 rounded-lg border border-red-200">
            <AlertCircle size={16} className="flex-shrink-0 text-red-500" />
            <span className="text-sm font-medium text-red-700">{content}</span>
          </div>
        </div>
      );
    }
    
    if (isRetrying) {
      return (
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
      );
    }
    
    return null;
  };

  // 渲染错误信息
  const renderError = () => {
    if (!error) return null;

    return (
      <div className="flex items-center p-3 mb-3 space-x-2 bg-red-50 rounded-lg border border-red-200">
        <AlertCircle size={16} className="flex-shrink-0 text-red-500" />
        <span className="text-sm text-red-700">{error}</span>
        <button
          onClick={() => setError(null)}
          className="ml-auto text-red-500 hover:text-red-700"
        >
          ×
        </button>
      </div>
    );
  };
  
  return (
    <div 
      ref={containerRef}
      onClick={handleContainerFocus}
      className={`bg-white border-l border-gray-200 h-screen flex flex-col transition-all duration-500 ease-in-out ${
        isMinimized ? 'w-12' : 
        isExpanded ? 'w-[55vw] min-w-[600px] max-w-[800px]' :
        isFocused ? 'w-[30vw] min-w-[400px] max-w-[600px]' : 'w-[25vw] min-w-[320px] max-w-[500px]'
      }`}
    >
        {/* Header */}
        <div className="flex flex-shrink-0 justify-between items-center p-4 border-b border-gray-200">
          {!isMinimized && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold text-gray-800">X Pilot</h2>
              </div>
              {/* 新增聊天按钮 */}
              <button
                onClick={handleNewChat}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-600 text-white transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                title="新建聊天"
              >
                <Plus size={14} />
                <span className="font-medium">新建对话</span>
              </button>
            </div>
          )}
          <div className="flex items-center space-x-1">
            {!isMinimized && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-lg transition-colors hover:bg-gray-100"
                aria-label={isExpanded ? "收缩面板" : "展开面板"}
                title={isExpanded ? "收缩面板" : "展开面板"}
              >
                {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
            )}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 rounded-lg transition-colors hover:bg-gray-100"
              aria-label={isMinimized ? "Expand operation panel" : "Collapse operation panel"}
            >
              {isMinimized ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>
        </div>
        
        {!isMinimized && (
          <>
            {messages.length === 0 ? (
              /* Empty State - Centered Input */
              <div className="flex flex-col flex-1 justify-center items-center p-8">
                {/* Welcome Section */}
                <div className="mb-8 max-w-md text-center">
                  <div className="mb-4">
                    <Zap size={48} className="mx-auto mb-4 text-purple-500" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-gray-800">
                    Vibe X Operation
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600">
                    Start your vibe operation here
                  </p>
                </div>

                {/* Centered Input Card */}
                <div className="w-full max-w-lg">
                  <div className="relative bg-white rounded-xl border border-gray-200 shadow-lg transition-all duration-200 hover:shadow-xl">
                    <div className="p-6">
                    {/* Error Display */}
                    {renderError()}
                    
                    {/* Selected Capability Display */}
                    {renderSelectedCapability()}
                      
                      {/* Input Area */}
                      <div className="relative">
                        <textarea
                          ref={textareaRef}
                          className={`w-full resize-none border-0 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white text-sm transition-all duration-200 ${
                            isFocused || inputValue.trim() ? 'min-h-[120px] max-h-[320px]' : 'min-h-[80px] max-h-[240px]'
                          }`}
                          placeholder="Enter your operation..."
                          value={inputValue}
                          onChange={(e) => handleInputChange(e.target.value)}
                          onFocus={handleContainerFocus}
                          onBlur={handleInputBlur}
                          onKeyDown={handleKeyDown}
                          rows={isFocused || inputValue.trim() ? 4 : 2}
                        />
                        {renderCapabilitySelector()}
                      </div>
                      
                      {/* Action Bar */}
                      <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-100">
                        <button
                          onClick={handleAtButtonClick}
                          className="p-1.5 text-gray-500 hover:text-purple-500 hover:bg-purple-50 rounded-md transition-colors duration-200"
                          title="Select Capability"
                        >
                          <span className="text-sm font-medium">@</span>
                        </button>
                        {renderSendButton()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Chat Mode - Messages + Bottom Input */
              <>
                {/* Messages */}
                <div className="overflow-y-auto flex-1 p-4 space-y-2 min-h-0">
                  {messages.map((message, index) => {
                    const isNetworkError = message.content.includes('网络异常');
                    const isRetrying = message.content.includes('网络重试中');
                    
                    // 如果是状态消息，单独显示
                    if (isNetworkError || isRetrying) {
                      return (
                        <div key={message.id}>
                          {renderStatusMessage(message.content)}
                        </div>
                      );
                    }
                    
                    // 正常消息气泡
                    return (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-2`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-[#4792E6] text-white'
                              : 'bg-purple-500 text-white'
                          }`}
                        >
                          {renderMessageContent(message.content, message.role)}
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* 独立的加载动画气泡 */}
                  {isLoading && (
                    <div className="flex justify-start mb-2">
                      <div className="max-w-[80%] p-3 rounded-lg bg-purple-500 text-white">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-200 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-purple-200 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-purple-200 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* 用于自动滚动的锚点 */}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Bottom Input Area */}
                <div className="flex-shrink-0 p-4">
                  <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md">
                    <div className="p-4">
                      
                      {/* Selected Capability Display */}
                      {renderSelectedCapability()}
                      
                      {/* Input Area */}
                      <div className="relative">
                        <textarea
                          ref={textareaRef}
                          className={`w-full resize-none border-0 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white text-sm transition-all duration-200 ${
                            isFocused || inputValue.trim() ? 'min-h-[120px] max-h-[320px]' : 'min-h-[80px] max-h-[240px]'
                          }`}
                          placeholder="You chat with X Pilot"
                          value={inputValue}
                          onChange={(e) => handleInputChange(e.target.value)}
                          onFocus={handleContainerFocus}
                          onBlur={handleInputBlur}
                          onKeyDown={handleKeyDown}
                          rows={isFocused || inputValue.trim() ? 4 : 2}
                        />
                        {renderCapabilitySelector()}
                      </div>
                      
                      {/* Action Bar */}
                      <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-100">
                        <button
                          onClick={handleAtButtonClick}
                          className="p-1.5 text-gray-500 hover:text-purple-500 hover:bg-purple-50 rounded-md transition-colors duration-200"
                          title="Select Capability"
                        >
                          <span className="text-sm font-medium">@</span>
                        </button>
                        {renderSendButton()}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
  );
};

export default AIAssistant;