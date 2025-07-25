import React from 'react';
import { InspirationAccount } from '../types';
import { CheckCircle, Users, Heart, Star } from 'lucide-react';

interface InspirationAccountCardProps {
  account: InspirationAccount;
  onToggleTarget: (id: number, isTargeted: boolean) => void;
  onToggleStar: (id: number, starred: boolean) => void;
  onShowToast?: (message: string, type: 'success' | 'error' | 'info') => void;
  onClick?: (account: InspirationAccount) => void;
}

const InspirationAccountCard: React.FC<InspirationAccountCardProps> = ({ 
  account, 
  onToggleTarget, 
  onToggleStar, 
  onShowToast,
  onClick 
}) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // 根据粉丝量确定账号类型
  const getAccountType = (followers: number): { type: string; color: string } => {
    if (followers >= 50000000) {
      return { type: 'Large', color: 'bg-red-100 text-red-800' };
    } else if (followers >= 5000000) {
      return { type: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { type: 'Small', color: 'bg-green-100 text-green-800' };
    }
  };

  const accountType = getAccountType(account.followers);

  // 截取描述文字，避免过长
  const truncatedBio = account.bio.length > 80 ? account.bio.substring(0, 80) + '...' : account.bio;

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (account.starred) {
      // 取消星标需要确认
      if (window.confirm('确定要取消收藏该账号吗？')) {
        onToggleStar(account.id, false);
        if (onShowToast) {
          onShowToast('已取消收藏该账号', 'info');
        }
      }
    } else {
      // 添加星标直接执行
      onToggleStar(account.id, true);
      if (onShowToast) {
        onShowToast('已收藏该账号', 'success');
      }
    }
  };

  const handleTargetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleTarget(account.id, !account.isTargeted);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(account);
    }
  };

  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Type Badge - 移到顶部 */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${accountType.color}`}>
          {accountType.type}
        </span>
        <div className="flex items-center space-x-2">
          {/* Star Button */}
          <button
            onClick={handleStarClick}
            className={`p-1 rounded-full transition-colors ${
              account.starred 
                ? 'text-yellow-500 hover:text-yellow-600' 
                : 'text-gray-400 hover:text-yellow-500'
            }`}
            aria-label={account.starred ? '取消收藏' : '收藏账号'}
          >
            <Star 
              size={16} 
              className={account.starred ? 'fill-yellow-500' : ''} 
            />
          </button>
          
          {/* Toggle Switch */}
          <label className="relative inline-flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={account.isTargeted}
              onChange={handleTargetClick}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500" style={{"--tw-ring-color": "rgba(71, 146, 230, 0.3)"} as React.CSSProperties}></div>
          </label>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center space-x-3 mb-3">
        <img
          src={account.avatar}
          alt={account.name}
          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1">
            <h3 className="font-semibold text-gray-900 text-sm truncate">
              {account.name}
            </h3>
            {account.verified && (
              <CheckCircle size={14} className="text-blue-500 flex-shrink-0" />
            )}
          </div>
          <p className="text-gray-600 text-xs truncate">{account.handle}</p>
        </div>
      </div>

      {/* Bio - 缩短文字 */}
      <p className="text-gray-700 text-sm mb-3 leading-relaxed">
        {truncatedBio}
      </p>

      {/* Stats */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <Users size={14} className="text-gray-500" />
          <span className="text-xs text-gray-600">
            {formatNumber(account.followers)}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Heart size={14} className="text-gray-500" />
          <span className="text-xs text-gray-600">
            {formatNumber(account.likes)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InspirationAccountCard;