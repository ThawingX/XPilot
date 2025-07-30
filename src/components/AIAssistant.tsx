import React, { useState, useRef, useEffect } from 'react';
import { Send, Zap, ChevronLeft, ChevronRight, Square, Loader2 } from 'lucide-react';
import { CopilotKit } from '@copilotkit/react-core';
import { CopilotTextarea } from '@copilotkit/react-textarea';
import { useCopilotAction, useCopilotReadable, useCopilotChat } from '@copilotkit/react-core';
import { TextMessage, MessageRole } from '@copilotkit/runtime-client-gql';

// 移除旧的接口定义，使用 CopilotKit 的类型

const AIAssistant: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 使用 CopilotKit 的 useCopilotChat hook
  const { 
    visibleMessages, 
    appendMessage, 
    isLoading,
    stop 
  } = useCopilotChat();

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
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // 处理点击外部区域
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 处理消息发送 - 使用 CopilotKit 驱动
  const handleCopilotSubmit = async (message: string) => {
    if (!message.trim() || isLoading) return;
    
    // 使用 CopilotKit 的 appendMessage 发送消息
    appendMessage(
      new TextMessage({
        content: message,
        role: MessageRole.User,
      })
    );
    
    setInputValue('');
  };

  // 停止响应 - 使用 CopilotKit 驱动
  const handleStopResponse = () => {
    if (isLoading) {
      stop();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
                      {/* Input Area */}
                      <CopilotTextarea
                        disableBranding={true}
                        className={`w-full resize-none border-0 bg-gray-50 rounded-lg px-4 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white text-sm transition-all duration-200 ${
                          isFocused ? 'min-h-[80px] max-h-[160px]' : 'min-h-[60px] max-h-[120px]'
                        }`}
                        placeholder="Enter your operation..."
                        value={inputValue}
                        onValueChange={setInputValue}
                        onFocus={handleContainerFocus}
                        onKeyDown={handleKeyDown}
                        rows={isFocused ? 3 : 2}
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
                      
                      {/* Action Bar */}
                      <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-100">
                        <button
                          className="p-1.5 text-gray-500 hover:text-purple-500 hover:bg-purple-50 rounded-md transition-colors duration-200"
                          title="选择能力"
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
                          <div className="flex items-center space-x-1 mt-2">
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
                </div>
                
                {/* Bottom Input Area */}
                <div className="flex-shrink-0 p-4">
                  <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md">
                    <div className="p-4">
                      {/* Input Area */}
                      <CopilotTextarea
                        disableBranding={true}
                        className={`w-full resize-none border-0 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white text-sm transition-all duration-200 ${
                          isFocused ? 'min-h-[60px] max-h-[160px]' : 'min-h-[40px] max-h-[120px]'
                        }`}
                        placeholder="You chat with X Pilot"
                        value={inputValue}
                        onValueChange={setInputValue}
                        onFocus={handleContainerFocus}
                        onKeyDown={handleKeyDown}
                        rows={isFocused ? 2 : 1}
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
                      
                      {/* Action Bar */}
                      <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-100">
                        <button
                          className="p-1.5 text-gray-500 hover:text-purple-500 hover:bg-purple-50 rounded-md transition-colors duration-200"
                          title="选择能力"
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