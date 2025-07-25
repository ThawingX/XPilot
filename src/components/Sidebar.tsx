import React from 'react';
import { 
  Home, 
  MessageSquare, 
  Users, 
  BarChart3, 
  Settings, 
  Calendar,
  FileText,
  Search,
  Bell
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: Home, label: 'Home', active: true },
    { icon: Search, label: 'Search' },
    { icon: Bell, label: 'Notifications' },
    { icon: MessageSquare, label: 'Messages' },
    { icon: Users, label: 'Team' },
    { icon: BarChart3, label: 'Analytics' },
    { icon: Calendar, label: 'Calendar' },
    { icon: FileText, label: 'Projects' },
    { icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 space-y-6">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
        <span className="text-white font-bold text-lg">S</span>
      </div>
      
      <nav className="flex flex-col space-y-4">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`p-3 rounded-xl transition-all duration-200 hover:bg-gray-100 group ${
              item.active 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <item.icon 
              size={20} 
              className={`${
                item.active ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
              }`} 
            />
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;