import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BarChart3, Users, Heart, MessageSquare, Target, Settings, User } from 'lucide-react';

interface SidebarProps {
  onMenuItemClick?: (itemName: string) => void;
  activeMenuItem?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  onMenuItemClick, 
  activeMenuItem
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleItemClick = (itemName: string) => {
    onMenuItemClick?.(itemName);
  };

  // 定义菜单项
  const menuItems = [
    { name: 'Dashboard', icon: BarChart3 },
    { name: 'Inspiration Accounts', icon: Users },
    { name: 'Auto Engagement', icon: Heart },
    { name: 'Get Post/Thread', icon: MessageSquare },
    { name: 'Marketing Strategy', icon: Target },
    { name: 'Config', icon: Settings },
    { name: 'Profile', icon: User },
  ];

  return (
    <div className={`bg-white border-r border-gray-200 h-full transition-all duration-300 ${
      isExpanded ? 'w-64' : 'w-16'
    }`}>
      <div className={`p-4 ${isExpanded ? 'px-6' : 'px-4'}`}>
        {isExpanded ? (
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo.png" 
                alt="X Pilot Logo" 
                className="w-8 h-8 object-contain"
              />
              <h1 className="text-2xl font-bold text-blue-600">X Pilot</h1>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg transition-colors hover:bg-gray-100"
              aria-label="Collapse menu"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <img 
              src="/logo.png" 
              alt="X Pilot Logo" 
              className="w-8 h-8 object-contain"
            />
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg transition-colors hover:bg-gray-100"
              aria-label="Expand menu"
            >
              <Menu size={20} />
            </button>
          </div>
        )}
      </div>
      
      <nav className="px-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleItemClick(item.name)}
            className={`w-full flex items-center px-3 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors mb-1 ${
              isExpanded ? 'justify-start' : 'justify-center'
            } ${activeMenuItem === item.name ? 'bg-[#4792E6]/10 text-[#4792E6] border border-[#4792E6]/20' : ''}`}
            title={!isExpanded ? item.name : undefined}
          >
            <item.icon size={20} className={`${isExpanded ? "mr-3" : ""} ${activeMenuItem === item.name ? 'text-[#4792E6]' : ''}`} />
            {isExpanded && (
              <span className="font-medium">{item.name}</span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;