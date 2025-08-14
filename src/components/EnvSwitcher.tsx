import React, { useState, useEffect } from 'react';
import { Settings, Globe, Server } from 'lucide-react';
import { apiConfigService } from '../lib/apiConfigService';

interface EnvSwitcherProps {
  className?: string;
}

const EnvSwitcher: React.FC<EnvSwitcherProps> = ({ className = '' }) => {
  const [isLocalEnv, setIsLocalEnv] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // 只在开发环境显示
    if (import.meta.env.PROD) return;
    
    setIsLocalEnv(apiConfigService.isUsingLocalApi());
    
    const handleApiChange = () => {
      setIsLocalEnv(apiConfigService.isUsingLocalApi());
    };
    
    apiConfigService.addListener(handleApiChange);
    
    return () => {
      apiConfigService.removeListener(handleApiChange);
    };
  }, []);

  // 生产环境不显示
  if (import.meta.env.PROD) {
    return null;
  }

  const handleToggle = () => {
    const newIsLocal = apiConfigService.toggleApiEnvironment();
    setIsLocalEnv(newIsLocal);
  };

  const environments = apiConfigService.getAvailableEnvironments();

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {isExpanded ? (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[280px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <Settings size={16} />
              开发环境切换
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-gray-600 text-lg leading-none"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-2">
            {Object.entries(environments).map(([key, env]) => (
              <div
                key={key}
                className={`flex items-center justify-between p-3 rounded-md border cursor-pointer transition-all ${
                  env.active 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={handleToggle}
              >
                <div className="flex items-center gap-2">
                  {key === 'local' ? <Server size={16} /> : <Globe size={16} />}
                  <div>
                    <div className="font-medium text-sm">{env.name}</div>
                    <div className="text-xs text-gray-500">{env.description}</div>
                  </div>
                </div>
                {env.active && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              当前API: <span className="font-mono">{apiConfigService.getApiBaseUrl()}</span>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg border transition-all hover:shadow-xl ${
            isLocalEnv 
              ? 'bg-orange-500 text-white border-orange-600 hover:bg-orange-600' 
              : 'bg-green-500 text-white border-green-600 hover:bg-green-600'
          }`}
          title={`当前环境: ${isLocalEnv ? '本地开发' : '生产环境'}`}
        >
          {isLocalEnv ? <Server size={16} /> : <Globe size={16} />}
          <span className="text-sm font-medium">
            {isLocalEnv ? 'DEV' : 'PROD'}
          </span>
        </button>
      )}
    </div>
  );
};

export default EnvSwitcher;