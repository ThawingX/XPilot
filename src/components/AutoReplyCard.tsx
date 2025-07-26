import React, { useState } from 'react';
import { Heart, Repeat2, MessageSquare, X, Send, Edit3, Check, Eye } from 'lucide-react';
import { Card } from '../types';
import ConfirmModal from './ConfirmModal';

interface AutoReplyCardProps {
  card: Card;
  isSelected?: boolean;
  onClick?: (card: Card) => void;
}

const AutoReplyCard: React.FC<AutoReplyCardProps> = ({ card, isSelected = false, onClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedReply, setEditedReply] = useState(card.suggestedReply || '');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const handleReject = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Reject reply for card:', card.id);
  };

  const handleEditToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEditing) {
      // Save the edited reply
      console.log('Saving edited reply:', editedReply);
    }
    setIsEditing(!isEditing);
  };

  const handlePostReply = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirmModal(true);
  };

  const handleConfirmPost = async () => {
    setIsPosting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Post reply for card:', card.id, 'with content:', editedReply);
      setShowConfirmModal(false);
    } catch (error) {
      console.error('Failed to post reply:', error);
    } finally {
      setIsPosting(false);
    }
  };

  const formatNumber = (num: number | undefined): string => {
    if (!num) return '0';
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm transition-all duration-200 cursor-pointer ${
        isSelected 
          ? 'border-2 border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200' 
          : 'border border-gray-200 hover:shadow-md'
      }`}
      onClick={() => onClick?.(card)}
    >
      {/* Original Tweet */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <img
              src={card.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(card.author || 'User')}&background=6366f1&color=fff&size=40`}
              alt={card.author || 'User'}
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(card.author || 'User')}&background=6366f1&color=fff&size=40`;
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-semibold text-gray-900">{card.author || 'Unknown User'}</span>
              <span className="text-gray-500 text-sm">{card.handle || '@unknown'}</span>
              <span className="text-gray-400 text-sm">·</span>
              <span className="text-gray-500 text-sm">{card.time}</span>
            </div>
            <p className="text-gray-900 whitespace-pre-line mb-3">
              {card.content}
            </p>
            
            {/* Stats Row */}
            <div className="flex items-center space-x-6 text-gray-500">
              <div className="flex items-center space-x-1 hover:text-blue-500 cursor-pointer transition-colors">
                <MessageSquare size={16} />
                <span className="text-sm">{formatNumber(card.replies)}</span>
              </div>
              <div className="flex items-center space-x-1 hover:text-green-500 cursor-pointer transition-colors">
                <Repeat2 size={16} />
                <span className="text-sm">{formatNumber(card.retweets)}</span>
              </div>
              <div className="flex items-center space-x-1 hover:text-red-500 cursor-pointer transition-colors">
                <Heart size={16} />
                <span className="text-sm">{formatNumber(card.likes)}</span>
              </div>
              <div className="flex items-center space-x-1 hover:text-blue-500 cursor-pointer transition-colors">
                <Eye size={16} />
                <span className="text-sm">{formatNumber(card.views)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Reply Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700 uppercase tracking-wide">
              SUGGESTED REPLY
            </span>
          </div>
          <button
            onClick={handleEditToggle}
            className="flex items-center space-x-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            {isEditing ? <Check size={14} /> : <Edit3 size={14} />}
            <span>{isEditing ? 'Save' : 'Edit'}</span>
          </button>
        </div>
        
        <div className={`rounded-lg p-3 mb-4 transition-all duration-200 ${
          isEditing 
            ? 'bg-white border-2 border-[#4792E6] shadow-sm ring-2 ring-[#4792E6]/20' 
            : 'bg-gray-50'
        }`}>
          {isEditing ? (
            <textarea
              value={editedReply}
              onChange={(e) => setEditedReply(e.target.value)}
              className="w-full text-sm text-gray-900 bg-transparent border-none resize-none focus:outline-none leading-relaxed min-h-[120px]"
              rows={5}
              placeholder="Enter your reply..."
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          ) : (
            <p className="text-gray-900 text-sm leading-relaxed whitespace-pre-line">
              {editedReply || card.suggestedReply || 'No suggested reply available'}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleReject}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            <X size={16} />
            <span className="font-medium">Reject</span>
          </button>
          <button
            onClick={handlePostReply}
            disabled={!editedReply.trim()}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
            <span className="font-medium">Post reply</span>
          </button>
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmPost}
        title="Confirm Reply"
        message={`Are you sure you want to post this reply? This action cannot be undone.`}
        confirmText="Post Reply"
        cancelText="Cancel"
        type="success"
        loading={isPosting}
      />
    </div>
  );
};

export default AutoReplyCard;