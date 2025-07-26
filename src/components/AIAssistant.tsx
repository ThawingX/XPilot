import React, { useState } from 'react';
import { Send, ChevronRight, ChevronLeft, Zap } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const AIAssistant: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Welcome to Vibe X Operation! I am your intelligent operation assistant, ready to help you with various operations and analysis.',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: 'I am analyzing your request and executing the corresponding operation, please wait...',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className={`bg-white border-l border-gray-200 h-full transition-all duration-300 ${
      isMinimized ? 'w-12' : 'w-80'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isMinimized && (
          <div className="flex items-center space-x-2">
            <Zap size={20} className="text-purple-500" />
            <h2 className="text-lg font-semibold text-gray-800">Vibe X Operation</h2>
          </div>
        )}
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={isMinimized ? "Expand operation panel" : "Collapse operation panel"}
        >
          {isMinimized ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      
      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: 'calc(100vh - 140px)' }}>
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] p-3 rounded-lg ${
                    message.isUser 
                      ? 'bg-purple-500 text-white rounded-br-none' 
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="block text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-end space-x-2">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your operation request..."
                className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm min-h-[40px] max-h-[120px]"
                rows={1}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className={`p-2 rounded-lg ${
                  inputValue.trim() 
                    ? 'bg-purple-500 text-white hover:bg-purple-600' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                } transition-colors`}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AIAssistant;