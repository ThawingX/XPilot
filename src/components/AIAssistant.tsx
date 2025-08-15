import React, { useState, useRef, useEffect } from 'react';
import { Send, Zap, ChevronLeft, ChevronRight, Square, Loader2, AlertCircle, Wifi, WifiOff, Maximize2, Minimize2, Plus, Copy, User, MessageSquare, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useCopilotChat, useCopilotAction } from '@copilotkit/react-core';
import { TextMessage, MessageRole } from '@copilotkit/runtime-client-gql';
import PlanGenerationCard from './PlanGenerationCard';
import SimplePlanCard from './SimplePlanCard';
import ExecutionStepsCard from './ExecutionStepsCard';
import { supabase } from '../lib/supabase';
import { apiConfigService } from '../lib/apiConfigService';



// 定义消息类型
interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp?: string;
  planData?: PlanData;
}

// 定义计划数据类型
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

interface AIAssistantProps {
  onExpandedChange?: (expanded: boolean) => void;
}

// Capability selector options
const CAPABILITY_OPTIONS = [
  { id: 'post', label: '@post', description: 'Vibe Generation Post', disabled: true },
  { id: 'thread', label: '@thread', description: 'Vibe Generation Thread', disabled: true },
  { id: 'strategy', label: '@strategy', description: 'Vibe Operation Strategy', disabled: true },
  { id: 'reply', label: '@reply', description: 'Vibe Auto Reply', disabled: false }
];

const AIAssistant: React.FC<AIAssistantProps> = ({ onExpandedChange }) => {
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
  const [currentPlan, setCurrentPlan] = useState<PlanData | null>(null);
  const [planGenerationBuffer, setPlanGenerationBuffer] = useState<string>('');
  const [simplePlan, setSimplePlan] = useState<{ steps: string[] } | null>(null);
  const [executionSteps, setExecutionSteps] = useState<Array<{
    step: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    description: string;
    details?: string;
  }> | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 使用 CopilotKit 的标准聊天功能
   const {
     visibleMessagesDeprecatedGqlMessage: copilotMessages,
     appendMessage,
     isLoading: isCopilotLoading,
     stopGeneration,
     reset: resetChat,
   } = useCopilotChat();

  const isLoading = isCopilotLoading;

  // Convert CopilotKit messages to our Message format
  const messages: Message[] = (copilotMessages || []).map((msg, index) => ({
    id: msg.id || `msg-${index}`,
    role: msg.role === MessageRole.User ? MessageRole.User : MessageRole.Assistant,
    content: msg.content || '',
    timestamp: new Date().toISOString(),
  }));

  // 定义 CopilotKit Actions
  useCopilotAction({
    name: 'show_plan_steps',
    description: 'Show a plan with steps to the user for approval',
    parameters: [
      {
        name: 'steps',
        type: 'string[]',
        description: 'Array of plan steps to show to the user',
        required: true
      }
    ],
    handler: async ({ steps }) => {
      console.log('Showing plan steps:', steps);
      // 触发 check_steps interrupt
      return new Promise((resolve) => {
        // 这里应该触发 interrupt，但 CopilotKit 的 interrupt 机制需要特殊处理
        // 暂时使用 state 来显示计划
        setSimplePlan({ steps });
        setCurrentPlan(null);
        setPlanGenerationBuffer('');
        resolve('Plan steps displayed to user');
      });
    }
  });

  useCopilotAction({
    name: 'show_execution_steps',
    description: 'Show execution steps to the user',
    parameters: [
      {
        name: 'steps',
        type: 'object[]',
        description: 'Array of execution steps with status and description',
        required: true
      }
    ],
    handler: async ({ steps }) => {
      console.log('Showing execution steps:', steps);
      setExecutionSteps(steps);
      setSimplePlan(null);
      setCurrentPlan(null);
      setPlanGenerationBuffer('');
      return 'Execution steps displayed to user';
    }
  });

  useCopilotAction({
    name: 'generate_post_content',
    description: 'Generate social media post content',
    parameters: [
      {
        name: 'topic',
        type: 'string',
        description: 'Topic for the post',
        required: true
      },
      {
        name: 'platform',
        type: 'string',
        description: 'Target platform (twitter, linkedin, etc.)',
        required: false
      }
    ],
    handler: async ({ topic, platform = 'twitter' }) => {
      console.log('Generating post content for:', topic, platform);
      // 这里可以调用后端API生成内容
      return `Generated post content for ${topic} on ${platform}`;
    }
  });

  useCopilotAction({
    name: 'generate_thread_content',
    description: 'Generate social media thread content',
    parameters: [
      {
        name: 'topic',
        type: 'string',
        description: 'Topic for the thread',
        required: true
      },
      {
        name: 'thread_length',
        type: 'number',
        description: 'Number of posts in the thread',
        required: false
      }
    ],
    handler: async ({ topic, thread_length = 5 }) => {
      console.log('Generating thread content for:', topic, thread_length);
      return `Generated thread content for ${topic} with ${thread_length} posts`;
    }
  });

  useCopilotAction({
    name: 'create_marketing_strategy',
    description: 'Create a marketing strategy plan',
    parameters: [
      {
        name: 'goals',
        type: 'string[]',
        description: 'Marketing goals',
        required: true
      },
      {
        name: 'target_audience',
        type: 'string',
        description: 'Target audience description',
        required: true
      }
    ],
    handler: async ({ goals, target_audience }) => {
      console.log('Creating marketing strategy:', goals, target_audience);
      return `Created marketing strategy for ${target_audience} with goals: ${goals.join(', ')}`;
    }
  });

  useCopilotAction({
    name: 'generate_auto_reply',
    description: 'Generate automatic reply content',
    parameters: [
      {
        name: 'original_message',
        type: 'string',
        description: 'Original message to reply to',
        required: true
      },
      {
        name: 'tone',
        type: 'string',
        description: 'Tone of the reply (professional, casual, friendly)',
        required: false
      }
    ],
    handler: async ({ original_message, tone = 'professional' }) => {
      console.log('Generating auto reply for:', original_message, tone);
      return `Generated ${tone} reply to: ${original_message}`;
    }
  });

  // Notify parent component when expanded state changes
  useEffect(() => {
    onExpandedChange?.(isExpanded);
  }, [isExpanded, onExpandedChange]);

  // 生成唯一ID
  const generateId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // 获取认证头 - 保留用于其他可能的API调用
  const getAuthHeaders = async () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    // 获取当前用户会话
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }
    
    return headers;
  };

  // 新增聊天窗口功能
  const handleNewChat = () => {
    resetChat();
    setError(null);
    setInputValue('');
    setSelectedCapability(null);
    setCurrentPlan(null);
    setPlanGenerationBuffer('');
    setSimplePlan(null);
    setExecutionSteps(null);
  };

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 监听消息变化，自动滚动到底部
  useEffect(() => {
    if (messages && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // Handle @ button click
  const handleAtButtonClick = () => {
    // 直接显示选择器，不在输入框中添加@符号
    setShowCapabilitySelector(true);
    // 找到第一个未禁用的选项
    const firstEnabledIndex = CAPABILITY_OPTIONS.findIndex(option => !option.disabled);
    setSelectedCapabilityIndex(firstEnabledIndex !== -1 ? firstEnabledIndex : 0);
    setSelectorPosition({ top: -280, left: 0 });

    // Focus the textarea
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 0);
  };

  // Handle container focus
  const handleContainerFocus = () => {
    setIsFocused(true);
  };

  // Handle input blur
  const handleInputBlur = (e: React.FocusEvent) => {
    // 不立即设置失去焦点，让容器点击事件有机会处理
    // 只有当焦点真正移到容器外部时才失去焦点
  };

  // Handle input value changes and detect @ symbol
  const handleInputChange = (value: string) => {
    setInputValue(value);

    const lastAtIndex = value.lastIndexOf('@');

    if (lastAtIndex !== -1) {
      const textAfterAt = value.substring(lastAtIndex + 1);

      if (textAfterAt.includes(' ') || textAfterAt.includes('\n')) {
        setShowCapabilitySelector(false);
      } else {
        setShowCapabilitySelector(true);
        const firstEnabledIndex = CAPABILITY_OPTIONS.findIndex(option => !option.disabled);
        setSelectedCapabilityIndex(firstEnabledIndex !== -1 ? firstEnabledIndex : 0);
        setAtTriggerPosition(lastAtIndex);

        setSelectorPosition({ top: -280, left: 0 });

        if (textAfterAt.length > 0) {
          const filteredOptions = CAPABILITY_OPTIONS.filter(option =>
            option.label.toLowerCase().includes(textAfterAt.toLowerCase())
          );
          if (filteredOptions.length === 0) {
            setShowCapabilitySelector(false);
          }
        }
      }
    } else {
      setShowCapabilitySelector(false);
    }
  };

  // 渲染选中的能力标签
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
            disabled={option.disabled}
            className={`flex items-center justify-between px-4 py-3 w-full text-left transition-all duration-150 ${option.disabled
                ? 'opacity-50 cursor-not-allowed bg-gray-50'
                : index === selectedCapabilityIndex
                  ? 'bg-blue-50 border-l-2 border-[#4792E6]'
                  : 'hover:bg-gray-50'
              }`}
          >
            <div className="flex items-center space-x-3">
              <span className={`font-medium ${option.disabled
                  ? 'text-gray-400'
                  : index === selectedCapabilityIndex ? 'text-[#4792E6]' : 'text-[#4792E6]'
                }`}>
                {option.label}
              </span>
              <span className={`text-sm ${option.disabled ? 'text-gray-400' : 'text-gray-600'
                }`}>{option.description}</span>
            </div>
            {index === selectedCapabilityIndex && !option.disabled && (
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

  // Handle capability selection
  const handleCapabilitySelect = (capability: typeof CAPABILITY_OPTIONS[0]) => {
    if (capability.disabled) {
      return;
    }

    setSelectedCapability(capability);

    const lastAtIndex = inputValue.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const beforeAt = inputValue.substring(0, lastAtIndex);
      const afterAt = inputValue.substring(lastAtIndex + 1);

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

  // 处理消息发送 - 完全使用CopilotKit框架
  const handleSubmit = async (message: string) => {
    if (!message.trim() || isLoading) return;

    setError(null);

    try {
      // 构建消息内容，包含选中的能力信息
      let messageContent = message;
      if (selectedCapability) {
        messageContent = `[Using ${selectedCapability.label} capability] ${message}`;
      }

      // 只清空选中的能力，保留输入框内容
      setSelectedCapability(null);
      
      // 清空输入框
      setInputValue('');
      
      // 使用 CopilotKit 的 appendMessage 来发送用户消息并触发AI响应
      await appendMessage(new TextMessage({
        content: messageContent,
        role: 'user'
      }));

    } catch (error: any) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    }
  };

  // 复制消息内容到聊天窗口
  const handleCopyToChat = (content: string) => {
    setInputValue(content);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showCapabilitySelector) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const enabledOptions = CAPABILITY_OPTIONS.filter(option => !option.disabled);
        const currentIndex = enabledOptions.findIndex(option =>
          CAPABILITY_OPTIONS.indexOf(option) === selectedCapabilityIndex
        );
        const nextIndex = (currentIndex + 1) % enabledOptions.length;
        setSelectedCapabilityIndex(CAPABILITY_OPTIONS.indexOf(enabledOptions[nextIndex]));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const enabledOptions = CAPABILITY_OPTIONS.filter(option => !option.disabled);
        const currentIndex = enabledOptions.findIndex(option =>
          CAPABILITY_OPTIONS.indexOf(option) === selectedCapabilityIndex
        );
        const prevIndex = currentIndex === 0 ? enabledOptions.length - 1 : currentIndex - 1;
        setSelectedCapabilityIndex(CAPABILITY_OPTIONS.indexOf(enabledOptions[prevIndex]));
      } else if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const selectedOption = CAPABILITY_OPTIONS[selectedCapabilityIndex];
        if (selectedOption && !selectedOption.disabled) {
          handleCapabilitySelect(selectedOption);
        }
      } else if (e.key === 'Escape') {
        setShowCapabilitySelector(false);
      }
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(inputValue);
    }
  };

  // 计算动态宽度
  const calculateWidth = () => {
    if (isMinimized) return 'w-12';
    if (isExpanded) return 'w-[55vw] min-w-[600px] max-w-[800px]';
    if (isFocused) return 'w-[30vw] min-w-[400px] max-w-[600px]';
    return 'w-[25vw] min-w-[320px] max-w-[500px]';
  };

  return (
    <div
      ref={containerRef}
      onClick={handleContainerFocus}
      className={`flex flex-col h-screen bg-white border-l border-gray-200 transition-all duration-500 ease-in-out ${calculateWidth()}`}
    >
      {/* Header */}
      <div className="flex flex-shrink-0 justify-between items-center p-4 border-b border-gray-200">
        {!isMinimized && (
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold text-gray-800">X-Pilot</h2>
            </div>
            <button
              onClick={handleNewChat}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#4792E6] hover:bg-[#3a7bc8] text-white transition-all duration-200 shadow-sm hover:shadow-md text-sm"
              title="New chat"
            >
              <Plus size={14} />
              <span className="font-medium">New chat</span>
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
          {/* Main Content */}
          {!messages || messages.length === 0 ? (
            /* Empty State - Centered Input */
            <div className="flex flex-col flex-1 justify-center items-center p-8">
              <div className="mb-8 max-w-md text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#4792E6] to-[#3a7bc8] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="mb-2 text-2xl font-bold text-gray-800">Welcome to X-Pilot AI</h2>
                  <p className="text-gray-600">Start a conversation to get help with your social media strategy</p>
                </div>
              </div>

              {/* Centered Input Card */}
              <div className="w-full max-w-2xl">
                <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md" ref={containerRef}>
                  <div className="p-4">

                    {/* Selected Capability Display */}
                    {renderSelectedCapability()}

                    {/* Input Area */}
                    <div className="relative">
                      <textarea
                        ref={textareaRef}
                        className={`w-full resize-none border-0 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4792E6] focus:bg-white text-sm transition-all duration-200 ${isFocused || inputValue.trim() ? 'min-h-[120px] max-h-[320px]' : 'min-h-[80px] max-h-[240px]'
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
                        className="p-1.5 text-gray-500 hover:text-[#4792E6] hover:bg-blue-50 rounded-md transition-colors duration-200"
                        title="Select Capability"
                      >
                        <span className="text-sm font-medium">@</span>
                      </button>
                      {isLoading ? (
                        <button
                          onClick={() => {
                            // 停止 CopilotKit 的响应
                            stopGeneration();
                            
                            // 找到最后一条用户消息并恢复到输入框
                            const lastUserMessage = messages
                              .slice()
                              .reverse()
                              .find(msg => msg.role === 'user');
                            
                            if (lastUserMessage && lastUserMessage.content) {
                              setInputValue(lastUserMessage.content);
                            }
                            
                            // 清除消息历史
                            resetChat();
                            
                            // 清理所有相关状态
                            setError(null);
                            setCurrentPlan(null);
                            setPlanGenerationBuffer('');
                            setSimplePlan(null);
                            setExecutionSteps(null);
                            
                            console.log('All operations stopped, messages cleared, and last user input restored');
                          }}
                          className="flex items-center space-x-1 px-3 py-1.5 rounded-md bg-red-500 hover:bg-red-600 text-white transition-all duration-200 shadow-sm hover:shadow-md"
                          title="Stop All Operations"
                        >
                          <Square size={14} />
                          <span className="text-xs font-medium">Stop</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSubmit(inputValue)}
                          disabled={!inputValue.trim()}
                          className="flex items-center space-x-1 px-3 py-1.5 rounded-md bg-[#4792E6] hover:bg-[#3a7bc8] disabled:bg-gray-300 disabled:cursor-not-allowed text-white transition-all duration-200 shadow-sm hover:shadow-md disabled:shadow-none"
                          title="Send"
                        >
                          <Send size={14} />
                          <span className="text-xs font-medium">Send</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Chat Mode - Messages + Bottom Input */
            <>
              {/* Messages */}
              <div className="overflow-y-auto flex-1 p-4 space-y-4 min-h-0">
                {messages?.map((message) => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg ${message.role === 'user'
                        ? 'bg-[#4792E6] text-white'
                        : 'bg-gray-100 text-gray-900'
                      }`}>
                      <div className="flex items-start space-x-2">
                        {message.role === 'assistant' && (
                          <Zap className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        )}
                        {message.role === 'user' && (
                          <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <ReactMarkdown className="max-w-none text-sm prose prose-sm">
                            {message.content}
                          </ReactMarkdown>
                          {message.role === 'assistant' && (
                            <button
                              onClick={() => handleCopyToChat(message.content)}
                              className="p-1 mt-2 rounded transition-colors hover:bg-gray-200"
                              title="Copy to input"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
                }

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="p-3 text-gray-900 bg-gray-100 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex justify-center">
                    <div className="flex items-center p-3 space-x-2 text-red-700 bg-red-100 rounded-lg">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{error}</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Plan Cards */}
              {currentPlan && (
                <div className="p-4 border-t border-gray-200">
                  <PlanGenerationCard
                    plan={currentPlan}
                    onCopyToChat={handleCopyToChat}
                  />
                </div>
              )}

              {simplePlan && (
                <div className="p-4 border-t border-gray-200">
                  <SimplePlanCard
                    steps={simplePlan.steps}
                    onExecute={() => {
                      console.log('Plan executed');
                      setSimplePlan(null);
                    }}
                    onCancel={() => {
                      console.log('Plan cancelled');
                      setSimplePlan(null);
                    }}
                  />
                </div>
              )}

              {executionSteps && (
                <div className="p-4 border-t border-gray-200">
                  <ExecutionStepsCard
                    steps={executionSteps}
                    onCopyToChat={handleCopyToChat}
                  />
                </div>
              )}

              {/* Bottom Input Area */}
              <div className="flex-shrink-0 p-4">
                <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md" ref={containerRef}>
                  <div className="p-4">

                    {/* Selected Capability Display */}
                    {renderSelectedCapability()}

                    {/* Input Area */}
                    <div className="relative">
                      <textarea
                        ref={textareaRef}
                        className={`w-full resize-none border-0 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4792E6] focus:bg-white text-sm transition-all duration-200 ${isFocused || inputValue.trim() ? 'min-h-[120px] max-h-[320px]' : 'min-h-[80px] max-h-[240px]'
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
                        className="p-1.5 text-gray-500 hover:text-[#4792E6] hover:bg-blue-50 rounded-md transition-colors duration-200"
                        title="Select Capability"
                      >
                        <span className="text-sm font-medium">@</span>
                      </button>
                      {isLoading ? (
                        <button
                          onClick={stopGeneration}
                          className="flex items-center space-x-1 px-3 py-1.5 rounded-md bg-red-500 hover:bg-red-600 text-white transition-all duration-200 shadow-sm hover:shadow-md"
                          title="Stop"
                        >
                          <Square size={14} />
                          <span className="text-xs font-medium">Stop</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSubmit(inputValue)}
                          disabled={!inputValue.trim()}
                          className="flex items-center space-x-1 px-3 py-1.5 rounded-md bg-[#4792E6] hover:bg-[#3a7bc8] disabled:bg-gray-300 disabled:cursor-not-allowed text-white transition-all duration-200 shadow-sm hover:shadow-md disabled:shadow-none"
                          title="Send"
                        >
                          <Send size={14} />
                          <span className="text-xs font-medium">Send</span>
                        </button>
                      )}
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