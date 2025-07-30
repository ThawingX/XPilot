import React, { useState, useRef, useEffect } from 'react';
import { Send, Zap, ChevronLeft, ChevronRight, Square, Loader2, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { CopilotKit } from '@copilotkit/react-core';
import { CopilotTextarea } from '@copilotkit/react-textarea';
import { useCopilotAction, useCopilotReadable, useCopilotChat } from '@copilotkit/react-core';
import { TextMessage, MessageRole } from '@copilotkit/runtime-client-gql';

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
  const [isFocused, setIsFocused] = useState(false);
  const [showCapabilitySelector, setShowCapabilitySelector] = useState(false);
  const [selectedCapabilityIndex, setSelectedCapabilityIndex] = useState(0);
  const [selectorPosition, setSelectorPosition] = useState({ top: 0, left: 0 });
  const [atTriggerPosition, setAtTriggerPosition] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedCapability, setSelectedCapability] = useState<typeof CAPABILITY_OPTIONS[0] | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 使用 CopilotKit 的 useCopilotChat hook
  const { 
    visibleMessages, 
    appendMessage, 
    isLoading,
    stop 
  } = useCopilotChat({
    onError: (error: any) => {
      console.error('CopilotKit 错误:', error);
      // 根据错误类型设置相应的错误消息
      if (error.message?.includes('404') || 
          error.message?.includes('network') || 
          error.message?.includes('fetch') ||
          error.status === 404 ||
          error.code === 'NETWORK_ERROR') {
        setError('网络异常，请重试！');
      } else {
        setError('出问题了，请重试！');
      }
    }
  });

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
  const handleCopilotSubmit = async (message: string) => {
    if (!message.trim() || isLoading) return;
    
    setError(null); // 清除之前的错误
    
    try {
      // 如果有选中的能力，将其添加到消息前面
      let finalMessage = message;
      if (selectedCapability) {
        finalMessage = `${selectedCapability.label} ${message}`;
      }
      
      // 使用 CopilotKit 的 appendMessage 发送消息
      appendMessage(
        new TextMessage({
          content: finalMessage,
          role: MessageRole.User,
        })
      );
      
      setInputValue('');
      // 发送后清除选中的能力
      setSelectedCapability(null);
    } catch (error: any) {
      // 处理错误
      if (error.message?.includes('network') || error.message?.includes('fetch')) {
        setError('网络异常，请重试！');
      } else {
        setError('出问题了，请重试！');
      }
      console.error('发送消息失败:', error);
    }
  };

  // 使用 CopilotKit 的 action 功能
  useCopilotAction({
    name: "sendMessage",
    description: "Send a message to the AI assistant",
    parameters: [
      {
        name: "message",
        type: "string",
        description: "The message content to send",
        required: true,
      },
    ],
    handler: async ({ message }) => {
      // 使用 CopilotKit 的 appendMessage 发送消息
      appendMessage(
        new TextMessage({
          content: message,
          role: MessageRole.User,
        })
      );
      return `Message sent: ${message}`;
    },
  });

  // 使用 CopilotKit 的 readable 功能，让 AI 了解当前对话历史
  useCopilotReadable({
    description: "Current conversation history",
    value: visibleMessages.map(msg => ({
      role: msg.role === MessageRole.User ? 'user' : 'assistant',
      content: msg.content,
      timestamp: new Date().toISOString()
    }))
  });

  // 处理容器焦点
  const handleContainerFocus = () => {
    setIsFocused(true);
  };

  // 处理输入框失去焦点
  const handleInputBlur = (e: React.FocusEvent) => {
    // 不立即设置失去焦点，让容器点击事件有机会处理
    // 只有当焦点真正移到容器外部时才失去焦点
  };

  // 停止响应 - 使用 CopilotKit 驱动
  const handleStopResponse = () => {
    if (isLoading) {
      stop();
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
        handleCopilotSubmit(inputValue);
      }
    }
  };

  // 渲染发送按钮 - 基于 CopilotKit 状态
  const renderSendButton = () => {
    if (isLoading) {
      return (
        <button
          onClick={handleStopResponse}
          className="p-1.5 rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors duration-200"
          title="停止响应"
        >
          <Square size={14} />
        </button>
      );
    }

    return (
      <button
        onClick={() => handleCopilotSubmit(inputValue)}
        disabled={!inputValue.trim()}
        className="p-1.5 rounded-md bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white transition-colors duration-200"
        title="发送消息"
      >
        <Send size={14} />
      </button>
    );
  };

  // 渲染选中的能力标签
  const renderSelectedCapability = () => {
    if (!selectedCapability) return null;

    return (
      <div className="mb-3 flex items-center justify-between bg-purple-50 border border-purple-200 rounded-lg px-3 py-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-purple-600">{selectedCapability.label}</span>
          <span className="text-xs text-purple-500">{selectedCapability.description}</span>
        </div>
        <button
          onClick={() => setSelectedCapability(null)}
          className="text-purple-400 hover:text-purple-600 transition-colors"
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
      className={`bg-white border-l border-gray-200 h-screen flex flex-col transition-all duration-300 ${
        isMinimized ? 'w-12' : 
        isFocused ? 'w-[30vw] min-w-[400px] max-w-[600px]' : 'w-[25vw] min-w-[320px] max-w-[500px]'
      }`}
    >
        {/* Header */}
        <div className="flex flex-shrink-0 justify-between items-center p-4 border-b border-gray-200">
          {!isMinimized && (
            <div className="flex items-center space-x-2">
              {/* <Zap size={20} className="text-purple-500" /> */}
              <h2 className="text-lg font-semibold text-gray-800">X Pilot</h2>
            </div>
          )}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 rounded-lg transition-colors hover:bg-gray-100"
            aria-label={isMinimized ? "Expand operation panel" : "Collapse operation panel"}
          >
            {isMinimized ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
        
        {!isMinimized && (
          <>
            {visibleMessages.length === 0 ? (
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
                        <CopilotTextarea
                          ref={textareaRef}
                          disableBranding={true}
                          className={`w-full resize-none border-0 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white text-sm transition-all duration-200 ${
                            isFocused || inputValue.trim() ? 'min-h-[120px] max-h-[320px]' : 'min-h-[80px] max-h-[240px]'
                          }`}
                          placeholder="Enter your operation..."
                          value={inputValue}
                          onValueChange={handleInputChange}
                          onFocus={handleContainerFocus}
                          onBlur={handleInputBlur}
                          onKeyDown={handleKeyDown}
                          rows={isFocused || inputValue.trim() ? 4 : 2}
                          autosuggestionsConfig={{
                            textareaPurpose: "AI assistant for Vibe X Operation",
                            chatApiConfigs: {
                              suggestionsApiConfig: {
                                forwardedParams: {
                                  max_tokens: 20,
                                  stop: [".", "?", "!"],
                                },
                              },
                            },
                          }}
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
                <div className="overflow-y-auto flex-1 p-4 space-y-4 min-h-0">
                  {visibleMessages.map((message, index) => (
                    <div 
                      key={index} 
                      className={`flex ${message.role === MessageRole.User ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === MessageRole.User 
                            ? 'bg-purple-500 text-white' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        {message.role === MessageRole.Assistant && isLoading && index === visibleMessages.length - 1 && (
                          <div className="flex items-center mt-2 space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        )}
                        <span className="block mt-1 text-xs opacity-70">
                          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {/* Error Display in Chat */}
                  {error && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] p-3 rounded-lg bg-red-50 border border-red-200">
                        <div className="flex items-center space-x-2">
                          <AlertCircle size={16} className="flex-shrink-0 text-red-500" />
                          <span className="text-sm text-red-700">{error}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Bottom Input Area */}
                <div className="flex-shrink-0 p-4">
                  <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md">
                    <div className="p-4">
                      {/* Selected Capability Display */}
                      {renderSelectedCapability()}
                      
                      {/* Input Area */}
                      <div className="relative">
                        <CopilotTextarea
                          ref={textareaRef}
                          disableBranding={true}
                          className={`w-full resize-none border-0 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white text-sm transition-all duration-200 ${
                            isFocused || inputValue.trim() ? 'min-h-[120px] max-h-[320px]' : 'min-h-[80px] max-h-[240px]'
                          }`}
                          placeholder="You chat with X Pilot"
                          value={inputValue}
                          onValueChange={handleInputChange}
                          onFocus={handleContainerFocus}
                          onBlur={handleInputBlur}
                          onKeyDown={handleKeyDown}
                          rows={isFocused || inputValue.trim() ? 4 : 2}
                          autosuggestionsConfig={{
                            textareaPurpose: "AI assistant conversation",
                            chatApiConfigs: {
                              suggestionsApiConfig: {
                                forwardedParams: {
                                  max_tokens: 20,
                                  stop: [".", "?", "!"],
                                },
                              },
                            },
                          }}
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