import React, { useState } from 'react';
import { MessageCircle, Send, Bot, User, Clock, Minimize2, Maximize2 } from 'lucide-react';

const RightSidebar = () => {
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'ai',
      message: 'Hello! I\'m your AI assistant. How can I help you today?',
      timestamp: '2:30 PM'
    },
    {
      id: 2,
      type: 'user',
      message: 'Can you help me analyze the engagement metrics?',
      timestamp: '2:31 PM'
    },
    {
      id: 3,
      type: 'ai',
      message: 'Of course! I can help you analyze your engagement data. Based on your current posts, I see good interaction rates. Would you like me to provide specific insights?',
      timestamp: '2:31 PM'
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const userMessage = {
        id: chatMessages.length + 1,
        type: 'user' as const,
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: chatMessages.length + 2,
          type: 'ai' as const,
          message: 'Thank you for your message. I\'m processing your request and will provide insights shortly.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Session Info */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-900">soshi.io</span>
            <span className="text-xs text-gray-500">- 在主浏览器中构建的，测试</span>
          </div>
          <button className="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition-colors">
            Stop session
          </button>
        </div>
        
        <div className="text-xs text-gray-500 mb-4">
          Started Mar 28, 2025, 1:40 AM
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <div className="text-sm font-medium text-gray-700 mb-1">Search term</div>
          <div className="text-gray-900">tech startup founders building in public</div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Soshi's Computer:</span>
            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              Active
            </span>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Time elapsed</div>
            <div className="text-sm font-medium text-gray-900">1:32</div>
          </div>
        </div>
      </div>

      {/* AI Chat Section */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-200" style={{ background: 'linear-gradient(to right, #f0f7ff, #e6f3ff)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#4792E6' }}>
                <Bot size={16} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Assistant</h3>
                <p className="text-xs text-gray-600">Online</p>
              </div>
            </div>
            <button 
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-white hover:bg-opacity-50 rounded transition-colors"
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        msg.type === 'user' 
                          ? 'bg-gray-200' 
                          : ''
                      }`}
                      style={msg.type === 'ai' ? { backgroundColor: '#4792E6' } : {}}
                    >
                      {msg.type === 'user' ? (
                        <User size={14} className="text-gray-600" />
                      ) : (
                        <Bot size={14} className="text-white" />
                      )}
                    </div>
                    <div 
                      className={`p-3 rounded-lg ${
                        msg.type === 'user'
                          ? 'text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                      style={msg.type === 'user' ? { backgroundColor: '#4792E6' } : {}}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <div className={`flex items-center space-x-1 mt-1 ${
                        msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        <Clock size={10} />
                        <span className="text-xs">{msg.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask AI anything..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#4792E6' } as React.CSSProperties}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  style={{ backgroundColor: '#4792E6' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3a7bd5'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4792E6'}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;