import React from 'react';
import { Home, Search, Bell, Mail, Bookmark, User, Settings, MoreHorizontal } from 'lucide-react';
import { mockMenuItems } from '../data/mockData';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600">XPilot</h1>
      </div>
      
      <nav className="px-4">
        {mockMenuItems.map((item) => (
          <a
            key={item.name}
            href="#"
            className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <item.icon size={24} className="mr-4" />
            <span className="font-medium">{item.name}</span>
          </a>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;