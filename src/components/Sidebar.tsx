import React, { useState } from 'react';
import { Home, Eye, MessageCircle, FileText, Lightbulb, Settings, User } from 'lucide-react';

interface SidebarProps {
  onMenuItemClick?: (itemName: string) => void;
  activeMenuItem?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  onMenuItemClick, 
  activeMenuItem
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleItemClick = (itemName: string, disabled: boolean) => {
    if (disabled) return;
    onMenuItemClick?.(itemName);
  };

  // 定义菜单项
  const menuItems = [
    { name: 'Dashboard', icon: Home, disabled: false },
    { name: 'Inspiration Accounts', icon: Eye, disabled: false },
    { name: 'Auto Engagement', icon: MessageCircle, disabled: false },
    { name: 'Get Post/Thread', icon: FileText, disabled: true },
    { name: 'Marketing Strategy', icon: Lightbulb, disabled: true },
    { name: 'Config', icon: Settings, disabled: false },
    { name: 'Profile', icon: User, disabled: false },
  ];

  return (
    <div className={`bg-white border-r border-gray-200 h-full transition-all duration-300 ${
      isExpanded ? 'w-64' : 'w-16'
    }`}>
      <div className={`p-4 ${isExpanded ? 'px-6' : 'px-4'}`}>
        <div className="flex items-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg transition-colors hover:bg-gray-100"
            aria-label={isExpanded ? "Collapse menu" : "Expand menu"}
          >
            <img 
              src="/xpilot-logo-fill-white.jpg" 
              alt="X Pilot Logo" 
              className="object-contain w-5 h-5"
            />
          </button>
        </div>
      </div>
      
      <nav className="px-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleItemClick(item.name, item.disabled)}
            disabled={item.disabled}
            className={`w-full flex items-center px-3 py-3 rounded-lg transition-colors mb-1 ${
              isExpanded ? 'justify-start' : 'justify-center'
            } ${
              item.disabled 
                ? 'text-gray-400 cursor-not-allowed opacity-50'
                : activeMenuItem === item.name 
                ? 'bg-[#4792E6]/10 text-[#4792E6] border border-[#4792E6]/20'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            title={!isExpanded ? item.name : undefined}
          >
            <item.icon size={20} className={`${isExpanded ? "mr-3" : ""} ${
              item.disabled 
                ? 'text-gray-400'
                : activeMenuItem === item.name ? 'text-[#4792E6]' : ''
            }`} />
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