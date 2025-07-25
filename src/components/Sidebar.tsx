import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { mockMenuItems } from '../data/mockData';

const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`bg-white border-r border-gray-200 h-full transition-all duration-300 ${
      isExpanded ? 'w-64' : 'w-16'
    }`}>
      <div className={`p-4 ${isExpanded ? 'px-6' : 'px-4'}`}>
        <div className="flex items-center justify-between">
          {isExpanded && (
            <h1 className="text-2xl font-bold text-blue-600">XPilot</h1>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={isExpanded ? "折叠菜单" : "展开菜单"}
          >
            {isExpanded ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      
      <nav className="px-2">
        {mockMenuItems.map((item) => (
          <a
            key={item.name}
            href="#"
            className={`flex items-center px-3 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors mb-1 ${
              isExpanded ? 'justify-start' : 'justify-center'
            }`}
            title={!isExpanded ? item.name : undefined}
          >
            <item.icon size={20} className={isExpanded ? "mr-3" : ""} />
            {isExpanded && (
              <span className="font-medium">{item.name}</span>
            )}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;