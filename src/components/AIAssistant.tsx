import React, { useState, useRef, useEffect } from 'react';
import { Send, Zap, ChevronLeft, ChevronRight, Square, Loader2, AlertCircle, Wifi, WifiOff, Maximize2, Minimize2, Plus, Copy, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import PlanningCard from './PlanningCard';
import ExecutionStatusCard from './ExecutionStatusCard';
import PlanGenerationCard from './PlanGenerationCard';
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

const AIAssistant: React.FC<AIAssistantProps> = ({ onExpandedChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Notify parent component when expanded state changes
  useEffect(() => {
    onExpandedChange?.(isExpanded);
  }, [isExpanded, onExpandedChange]);
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
  const [shouldStopRetry, setShouldStopRetry] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<PlanData | null>(null);
  const [planGenerationBuffer, setPlanGenerationBuffer] = useState<string>('');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 生成唯一ID
  const generateId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // 获取认证头
  const getAuthHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('用户未登录');
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`
    };
  };

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
    // 清除计划相关状态
    setCurrentPlan(null);
    setPlanGenerationBuffer('');
    // 重新生成threadId，确保新对话有独立的会话ID
    setThreadId(`thread-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    
    
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
  const sendMessageToBackend = async (message: string, currentRetryCount = 0, assistantMessageId?: string, capability?: typeof CAPABILITY_OPTIONS[0] | null): Promise<boolean> => {
    setError(null);
    setRetryCount(currentRetryCount);
    
    // 在开始新的消息发送时重置停止重试标志
    if (currentRetryCount === 0) {
      setShouldStopRetry(false);
    }

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
      // 获取认证头
      const headers = await getAuthHeaders();

      // 构建符合后端要求的请求体
      // 根据选中的能力构建tools数组
      const currentCapability = capability || selectedCapability;
      const tools = currentCapability ? [{
        name: currentCapability.id,
        description: '',
        parameters: null
      }] : [];
      

      
      const requestBody: BackendRequest = {
        state: [],
        tools: tools,
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



      const apiBaseUrl = apiConfigService.getApiBaseUrl();
      const response = await fetch(`${apiBaseUrl}/api/agent`, {
        method: 'POST',
        headers,
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

              
              // 处理不同类型的数据
              if (data.type === 'RAW' && data.event) {
                // 处理 RAW 事件中的流式内容
                if (data.event.event === 'on_chat_model_stream' && data.event.data?.chunk?.content) {
                  const content = data.event.data.chunk.content;
  
                  assistantContent += content;
                  
                  // 检测计划生成
                  const planDetection = detectPlanGeneration(assistantContent);
                  if (planDetection.isPlanGeneration || planDetection.hasMermaid) {
                    // 更新计划生成缓冲区
                    setPlanGenerationBuffer(prev => prev + content);
                    
                    // 如果还没有当前计划，创建一个
                    if (!currentPlan) {
                      const newPlan: PlanData = {
                        id: generateId(),
                        title: '正在生成计划...',
                        description: '',
                        steps: [],
                        status: 'generating',
                        progress: 0
                      };
                      setCurrentPlan(newPlan);
                    }
                    
                    // 尝试解析当前缓冲区内容
                    try {
                      const parsedPlan = parsePlanGenerationContent(planGenerationBuffer);
                      if (parsedPlan.steps.length > 0 || parsedPlan.mermaidDiagram) {
                        setCurrentPlan(prev => prev ? {
                          ...prev,
                          title: parsedPlan.title || prev.title,
                          description: parsedPlan.description || prev.description,
                          steps: parsedPlan.steps,
                          markdownContent: parsedPlan.markdownContent,
                          mermaidDiagram: parsedPlan.mermaidDiagram,
                          status: 'generating'
                        } : null);
                      }
                    } catch (e) {
                      // 解析失败，继续累积内容
                    }
                  }
                  
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
                  // 流式响应结束，如果有计划正在生成，更新状态为ready
                  if (currentPlan && currentPlan.status === 'generating') {
                    setCurrentPlan(prev => prev ? {
                      ...prev,
                      status: 'ready',
                      title: prev.title === '正在生成计划...' ? '新计划' : prev.title
                    } : null);
                  }
                }
              } 
              // 处理其他事件类型
              else if (data.type === 'STEP_STARTED') {
  
              }
              else if (data.type === 'RUN_STARTED') {
  
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

            }
          }
        }
      }
      
      // 流式响应处理完成，返回成功
        return true;

    } catch (error: any) {

      
      // 检查是否是认证错误
      if (error.message === '用户未登录') {
        const errorMessage: Message = {
          id: generateId(),
          content: '用户未登录，请先登录后再使用AI助手功能',
          role: 'assistant',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsLoading(false);
        setRetryCount(0);
        return false;
      }
      
      // 检查是否需要重试 - 最多重试4次（总共5次尝试）
      if (currentRetryCount < 4) {

        
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
          // 检查是否应该停止重试
          if (!shouldStopRetry) {
            sendMessageToBackend(message, currentRetryCount + 1, currentAssistantMessageId, capability);
          }
        }, 1000 * (currentRetryCount + 1)); // 递增延迟
        return false;
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
      return false;
    } finally {
      setIsLoading(false);
      setRetryCount(0);
    }
    
    return true;
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

    
    const lastAtIndex = value.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      // Get text after the last @
      const textAfterAt = value.substring(lastAtIndex + 1);
      
      // Debug: Check what's after @
      
      
      // Check if there's a space or newline after @, which should close the selector
      if (textAfterAt.includes(' ') || textAfterAt.includes('\n')) {

        setShowCapabilitySelector(false);
      } else {
        // Show selector when @ is present and no space/newline after it
        
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
    if (!message.trim() || isLoading || retryCount > 0) return;
    
    setError(null); // 清除之前的错误
    
    // 保存当前的输入状态，以便在重试失败时恢复
    const currentInputValue = inputValue;
    const currentSelectedCapability = selectedCapability;
    
    try {
      // 检查是否是debug命令
      if (message.trim() === '/debug-plan-make') {
        // 添加用户消息
        const userMessage: Message = {
          id: generateId(),
          content: message,
          role: 'user',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, userMessage]);
        
        // Debug command - no response needed
        
        setInputValue('');
        setSelectedCapability(null);
        return;
      }
      
      if (message.trim() === '/debug-plan-exec') {
        // 添加用户消息
        const userMessage: Message = {
          id: generateId(),
          content: message,
          role: 'user',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, userMessage]);
        
        // Debug command - no response needed
        
        setInputValue('');
        setSelectedCapability(null);
        return;
      }
      
      // 发送消息到后端（工具信息通过tools数组传递，不需要添加到消息内容中）
      const success = await sendMessageToBackend(message, 0, undefined, selectedCapability);
      
      // 只有在消息成功发送时才清空输入框和选中的工具
      if (success) {
        setInputValue('');
        setSelectedCapability(null);
      }
    } catch (error: any) {
      // 如果发送失败且不是重试中，恢复输入状态
      // 重试逻辑在sendMessageToBackend中处理
    }
  };

  // 复制消息内容到聊天窗口
  const handleCopyToChat = (content: string) => {
    setInputValue(content);
    // 聚焦到输入框
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // 自定义消息处理功能 - 替代 CopilotKit 的 action 功能
  const handleMessageAction = async (message: string) => {
    try {
      await sendMessageToBackend(message);
      return `Message sent: ${message}`;
    } catch (error) {

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
    if (isLoading || retryCount > 0) {
      setShouldStopRetry(true); // 设置停止重试标志
      stopResponse();
      setRetryCount(0); // 重置重试计数
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
      if (isLoading || retryCount > 0) {
        handleStopResponse();
      } else {
        handleSubmit(inputValue);
      }
    }
  };

  // 渲染发送按钮 - 基于加载状态和重试状态
  const renderSendButton = () => {
    // 在加载中或重试中时显示停止按钮
    if (isLoading || retryCount > 0) {
      return (
        <button
          onClick={handleStopResponse}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-md bg-red-500 hover:bg-red-600 text-white transition-all duration-200 shadow-sm hover:shadow-md"
          title="Stop"
        >
          <Square size={14} />
          <span className="text-xs font-medium">Stop</span>
        </button>
      );
    }

    return (
      <button
        onClick={() => handleSubmit(inputValue)}
        disabled={!inputValue.trim()}
        className="flex items-center space-x-1 px-3 py-1.5 rounded-md bg-[#4792E6] hover:bg-[#3a7bc8] disabled:bg-gray-300 disabled:cursor-not-allowed text-white transition-all duration-200 shadow-sm hover:shadow-md disabled:shadow-none"
        title="Send"
      >
        <Send size={14} />
        <span className="text-xs font-medium">Send</span>
      </button>
    );
  };

  // 渲染重试状态（已合并到消息气泡中，此函数保留为空）
  const renderRetryStatus = () => {
    return null;
  };

  // 计划操作处理函数
  const handlePlanConfirm = (planId: string) => {
    if (currentPlan && currentPlan.id === planId) {
      setCurrentPlan(prev => prev ? {
        ...prev,
        status: 'confirmed'
      } : null);
      
      // 可以在这里添加确认计划的API调用
      console.log('Plan confirmed:', planId);
    }
  };

  const handlePlanExecute = (planId: string) => {
    if (currentPlan && currentPlan.id === planId) {
      setCurrentPlan(prev => prev ? {
        ...prev,
        status: 'executing',
        progress: 0
      } : null);
      
      // 可以在这里添加执行计划的API调用
      console.log('Plan execution started:', planId);
      
      // 模拟执行进度（实际应该从后端获取）
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 10;
        setCurrentPlan(prev => prev ? {
          ...prev,
          progress
        } : null);
        
        if (progress >= 100) {
          clearInterval(progressInterval);
          setCurrentPlan(prev => prev ? {
            ...prev,
            status: 'completed'
          } : null);
        }
      }, 500);
    }
  };

  const handlePlanCancel = (planId: string) => {
    if (currentPlan && currentPlan.id === planId) {
      setCurrentPlan(null);
      setPlanGenerationBuffer('');
      console.log('Plan cancelled:', planId);
    }
  };

  const handlePlanEdit = (planId: string, updatedPlan: Partial<PlanData>) => {
    if (currentPlan && currentPlan.id === planId) {
      setCurrentPlan(prev => prev ? {
        ...prev,
        ...updatedPlan
      } : null);
      console.log('Plan edited:', planId, updatedPlan);
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
            className={`flex items-center justify-between px-4 py-3 w-full text-left transition-all duration-150 ${
              index === selectedCapabilityIndex
                ? 'bg-blue-50 border-l-2 border-[#4792E6]'
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className={`font-medium ${
                index === selectedCapabilityIndex ? 'text-[#4792E6]' : 'text-[#4792E6]'
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

  // 检测计划生成消息的函数
  const detectPlanGeneration = (content: string) => {
    // 检测计划生成的特殊标记
    const planGenerationMarkers = [
      'PLAN_START', 'PLAN_GENERATION_START', '开始制定计划',
      'PLAN_STEP', 'PLAN_ITEM', '计划步骤',
      'PLAN_END', 'PLAN_GENERATION_END', '计划制定完成',
      'MERMAID_START', 'DIAGRAM_START', '流程图开始',
      'MERMAID_END', 'DIAGRAM_END', '流程图结束'
    ];
    
    const hasGenerationMarker = planGenerationMarkers.some(marker => 
      content.includes(marker)
    );
    
    // 检测是否包含Mermaid图表语法
    const hasMermaidSyntax = /```mermaid[\s\S]*?```/.test(content) || 
                            /graph|flowchart|sequenceDiagram|classDiagram/.test(content);
    
    return {
      isPlanGeneration: hasGenerationMarker,
      hasMermaid: hasMermaidSyntax,
      content
    };
  };

  // 解析计划生成内容
  const parsePlanGenerationContent = (content: string) => {
    const lines = content.split('\n');
    const steps: PlanStep[] = [];
    let title = '新计划';
    let description = '';
    let mermaidDiagram = '';
    let stepCounter = 1;
    
    // 提取标题
    const titleMatch = content.match(/(?:计划标题|标题|title)[:：]\s*(.+)/i);
    if (titleMatch) {
      title = titleMatch[1].trim();
    }
    
    // 提取描述
    const descMatch = content.match(/(?:计划描述|描述|description)[:：]\s*(.+)/i);
    if (descMatch) {
      description = descMatch[1].trim();
    }
    
    // 提取Mermaid图表
    const mermaidMatch = content.match(/```mermaid([\s\S]*?)```/);
    if (mermaidMatch) {
      mermaidDiagram = mermaidMatch[1].trim();
    }
    
    // 解析步骤
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // 匹配步骤格式
      const stepMatch = trimmedLine.match(/^(?:步骤|Step)\s*(\d+)[:：]\s*(.+)/) ||
                       trimmedLine.match(/^(\d+)[\.\.]\s*(.+)/) ||
                       trimmedLine.match(/^[-*+]\s*(.+)/);
      
      if (stepMatch) {
        const stepTitle = stepMatch[2] || stepMatch[1];
        const priorityMatch = stepTitle.match(/\[(高|中|低|high|medium|low)\]/);
        const timeMatch = stepTitle.match(/\((\d+[小时天周月]?)\)/);
        
        steps.push({
          id: `step-${stepCounter}`,
          stepNumber: stepCounter,
          title: stepTitle.replace(/\[(高|中|低|high|medium|low)\]/, '').replace(/\(\d+[小时天周月]?\)/, '').trim(),
          description: stepTitle,
          priority: priorityMatch ? 
            (priorityMatch[1] === '高' || priorityMatch[1] === 'high' ? 'high' :
             priorityMatch[1] === '中' || priorityMatch[1] === 'medium' ? 'medium' : 'low') : 'medium',
          estimatedTime: timeMatch ? timeMatch[1] : undefined,
          status: 'pending'
        });
        stepCounter++;
      }
    }
    
    return {
      title,
      description,
      steps,
      mermaidDiagram: mermaidDiagram || undefined,
      markdownContent: content
    };
  };

  // 检测计划内容的函数
  const detectPlanContent = (content: string) => {
    // 检测计划关键词和结构
    const planKeywords = [
      '计划', '规划', '方案', '策略', 'plan', 'strategy', 'roadmap',
      '步骤', 'steps', '阶段', 'phase', '任务', 'task', 'todo',
      '目标', 'goal', 'objective', '时间表', 'timeline', 'schedule'
    ];
    
    const executionKeywords = [
      '执行', '实施', '落地', 'execution', 'implementation', 'deploy',
      '进度', 'progress', '状态', 'status', '完成', 'complete',
      '开始', 'start', '结束', 'end', '截止', 'deadline'
    ];
    
    const hasListStructure = /^\s*[-*+]\s+.+$/m.test(content) || /^\s*\d+\.\s+.+$/m.test(content);
    const hasTableStructure = /\|.*\|/.test(content);
    const hasPlanKeywords = planKeywords.some(keyword => 
      content.toLowerCase().includes(keyword.toLowerCase())
    );
    const hasExecutionKeywords = executionKeywords.some(keyword => 
      content.toLowerCase().includes(keyword.toLowerCase())
    );
    
    // 判断是否为计划内容
    if ((hasPlanKeywords || hasExecutionKeywords) && (hasListStructure || hasTableStructure)) {
      return {
        isPlan: true,
        isExecution: hasExecutionKeywords && (content.includes('进度') || content.includes('状态') || content.includes('完成')),
        content
      };
    }
    
    return { isPlan: false, isExecution: false, content };
  };

  // 解析计划内容为结构化数据
  const parsePlanContent = (content: string, isExecution: boolean = false) => {
    const lines = content.split('\n').filter(line => line.trim());
    const title = lines.find(line => line.startsWith('#'))?.replace(/^#+\s*/, '') || '计划';
    
    // 提取描述（第一个非标题段落）
    const descriptionLine = lines.find(line => 
      !line.startsWith('#') && 
      !line.startsWith('-') && 
      !line.startsWith('*') && 
      !line.startsWith('+') && 
      !/^\d+\./.test(line) &&
      !line.includes('|') &&
      line.trim().length > 10
    );
    
    // 提取步骤/任务
    const steps = [];
    let stepId = 1;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // 匹配列表项
      const listMatch = trimmedLine.match(/^[-*+]\s+(.+)$/);
      const numberedMatch = trimmedLine.match(/^\d+\.\s+(.+)$/);
      
      if (listMatch || numberedMatch) {
        const stepText = (listMatch || numberedMatch)[1];
        
        // 检测状态（用于执行计划）
        let status = 'pending';
        if (isExecution) {
          if (stepText.includes('✓') || stepText.includes('完成') || stepText.includes('已完成')) {
            status = 'completed';
          } else if (stepText.includes('进行中') || stepText.includes('正在') || stepText.includes('🔄')) {
            status = 'in-progress';
          } else if (stepText.includes('阻塞') || stepText.includes('暂停') || stepText.includes('❌')) {
            status = 'blocked';
          }
        }
        
        // 提取时间信息
        const dateMatch = stepText.match(/(\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}|\d{1,2}月\d{1,2}日)/);
        const timeInfo = dateMatch ? dateMatch[0] : undefined;
        
        steps.push({
          id: `step-${stepId++}`,
          title: stepText.replace(/[✓🔄❌]/g, '').trim(),
          status: status,
          startDate: timeInfo,
          description: stepText.length > 50 ? stepText.substring(0, 50) + '...' : undefined
        });
      }
    }
    
    // 如果没有找到步骤，尝试从表格中提取
    if (steps.length === 0 && content.includes('|')) {
      const tableRows = lines.filter(line => line.includes('|') && !line.includes('---'));
      for (let i = 1; i < tableRows.length; i++) { // 跳过表头
        const cells = tableRows[i].split('|').map(cell => cell.trim()).filter(cell => cell);
        if (cells.length >= 2) {
          steps.push({
            id: `step-${stepId++}`,
            title: cells[0] || `任务 ${stepId - 1}`,
            description: cells[1],
            status: isExecution ? (cells[2]?.includes('完成') ? 'completed' : 'pending') : 'pending'
          });
        }
      }
    }
    
    return {
      title,
      description: descriptionLine,
      steps,
      status: isExecution ? 'active' : 'draft',
      progress: isExecution ? Math.round((steps.filter(s => s.status === 'completed').length / Math.max(steps.length, 1)) * 100) : 0,
      metrics: isExecution ? {
        totalTasks: steps.length,
        completedTasks: steps.filter(s => s.status === 'completed').length,
        inProgressTasks: steps.filter(s => s.status === 'in-progress').length,
        blockedTasks: steps.filter(s => s.status === 'blocked').length
      } : undefined
    };
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
      
      // 注释掉计划内容检测逻辑，不再自动显示计划卡片
      // const planDetection = detectPlanContent(content);
      // 
      // if (planDetection.isPlan) {
      //   const planData = parsePlanContent(content, planDetection.isExecution);
      //   
      //   if (planDetection.isExecution) {
      //     return (
      //       <ExecutionStatusCard
      //         title={planData.title}
      //         description={planData.description}
      //         steps={planData.steps}
      //         status={planData.status}
      //         progress={planData.progress}
      //         startTime={new Date().toISOString()}
      //         endTime={planData.status === 'completed' ? new Date().toISOString() : undefined}
      //       />
      //     );
      //   } else {
      //     return (
      //       <PlanningCard
      //         title={planData.title}
      //         description={planData.description}
      //         steps={planData.steps}
      //         createdAt={new Date().toISOString()}
      //         estimatedDuration="预计完成时间"
      //         onExecutePlan={() => {
      //       
      //           // 这里可以添加执行计划的逻辑
      //         }}
      //       />
      //     );
      //   }
      // }
      
      return (
        <div className="max-w-none text-black prose prose-sm">
          <ReactMarkdown
            components={{
            // 自定义代码块样式
            code: ({ node, inline, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || '');
              return !inline ? (
                <pre className="overflow-x-auto p-3 bg-gray-100 rounded-md">
                  <code className={`text-black ${className}`} {...props}>
                    {children}
                  </code>
                </pre>
              ) : (
                <code className="bg-gray-100 px-1 py-0.5 rounded text-sm text-black" {...props}>
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
                className="text-blue-600 underline hover:text-blue-800"
              >
                {children}
              </a>
            ),
            // 自定义列表样式
            ul: ({ children }) => (
              <ul className="my-2 space-y-1 list-disc list-inside text-black">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="my-2 space-y-1 list-decimal list-inside text-black">
                {children}
              </ol>
            ),
            // 自定义标题样式
            h1: ({ children }) => (
              <h1 className="mt-4 mb-2 text-lg font-bold text-black">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="mt-3 mb-2 text-base font-semibold text-black">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="mt-2 mb-1 text-sm font-medium text-black">
                {children}
              </h3>
            ),
            // 自定义段落样式
            p: ({ children }) => (
              <p className="mb-2 leading-relaxed text-black">
                {children}
              </p>
            ),
            // 自定义引用样式
            blockquote: ({ children }) => (
              <blockquote className="pl-4 my-2 italic text-gray-700 border-l-4 border-gray-400">
                {children}
              </blockquote>
            ),
            // 自定义表格样式
            table: ({ children }) => (
              <div className="overflow-x-auto my-2">
                <table className="min-w-full rounded-md border border-gray-300">
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className="px-3 py-2 font-medium text-left text-black bg-gray-100 border border-gray-300">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-3 py-2 text-black border border-gray-300">
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
                <h2 className="text-lg font-semibold text-gray-800">X-Pilot</h2>
              </div>
              {/* 新增聊天按钮 */}
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
            {messages.length === 0 ? (
              /* Empty State - Centered Input */
              <div className="flex flex-col flex-1 justify-center items-center p-8">
                {/* Welcome Section */}
                <div className="mb-8 max-w-md text-center">
                  <div className="mb-4">
                    <Zap size={48} className="mx-auto mb-4 text-[#4792E6]" />
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
                          className={`w-full resize-none border-0 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4792E6] focus:bg-white text-sm transition-all duration-200 ${
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
                          className="p-1.5 text-gray-500 hover:text-[#4792E6] hover:bg-blue-50 rounded-md transition-colors duration-200"
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
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4 group`}
                      >
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
                          
                          {/* 消息内容区域 */}
                          <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                            {/* 昵称 */}
                            <div className="mb-1 text-xs text-gray-500">
                              {message.role === 'user' ? 'You' : 'X Pilot'}
                            </div>
                            
                            {/* 消息气泡 */}
                            <div
                              className={`p-3 rounded-lg ${
                                message.role === 'user'
                                  ? 'bg-[#4792E6] text-white rounded-tr-sm'
                                  : 'bg-white text-black border border-gray-200 rounded-tl-sm'
                              }`}
                            >
                              {renderMessageContent(message.content, message.role)}
                            </div>
                            
                            {/* 用户消息的复制按钮 - 放在消息气泡下方 */}
                            {message.role === 'user' && (
                              <button
                                onClick={() => handleCopyToChat(message.content)}
                                className="mt-1 p-1.5 rounded-md bg-gray-100 text-gray-700 border border-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-200 hover:text-gray-900"
                                title="复制到聊天窗口"
                              >
                                <Copy size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Plan Generation Card */}
                  {currentPlan && (
                    <div className="flex justify-start mb-4">
                      <div className="max-w-[80%]">
                        <PlanGenerationCard
                          plan={currentPlan}
                          onConfirm={handlePlanConfirm}
                          onExecute={handlePlanExecute}
                          onCancel={handlePlanCancel}
                          onEdit={handlePlanEdit}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* 独立的加载动画气泡 */}
                  {isLoading && (
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
                          {/* 昵称 */}
                          <div className="mb-1 text-xs text-gray-500">
                            X-Pilot
                          </div>
                          
                          {/* 加载气泡 */}
                          <div className="p-3 text-black bg-white rounded-lg rounded-tl-sm border border-gray-200">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
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
                          className={`w-full resize-none border-0 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4792E6] focus:bg-white text-sm transition-all duration-200 ${
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
                          className="p-1.5 text-gray-500 hover:text-[#4792E6] hover:bg-blue-50 rounded-md transition-colors duration-200"
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