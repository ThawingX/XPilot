import React, { useState } from 'react';
import { User, Mail, Calendar, MapPin, Link, Twitter, Star, Crown, Settings, Edit3, Check, X, Camera, Shield, Bell, CreditCard, Users, Activity, TrendingUp, Award } from 'lucide-react';

interface ProfileProps {
  onClose?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Alex Chen',
    username: '@alexchen_dev',
    email: 'alex.chen@xpilot.com',
    bio: 'Senior Product Manager at XPilot | Building the future of social media automation | Coffee enthusiast ☕',
    location: 'San Francisco, CA',
    website: 'https://alexchen.dev',
    joinDate: 'March 2023',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  });

  const [tempData, setTempData] = useState(profileData);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData(profileData);
  };

  const handleSave = () => {
    setProfileData(tempData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  const subscriptionPlan = {
    name: 'Pro Plan',
    price: '$29/month',
    features: ['Unlimited AI replies', 'Advanced analytics', 'Priority support', 'Custom templates'],
    nextBilling: 'April 15, 2024',
    status: 'active'
  };

  const stats = {
    totalReplies: 1247,
    engagementRate: 8.5,
    accountsManaged: 3,
    monthlyGrowth: 12.3
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center space-x-2 px-3 py-2 text-[#4792E6] hover:bg-[#4792E6]/10 rounded-lg transition-colors"
            >
              <Edit3 size={16} />
              <span className="text-sm font-medium">Edit</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={16} />
                <span className="text-sm">Cancel</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-1 px-3 py-2 bg-[#4792E6] text-white rounded-lg hover:bg-[#4792E6]/90 transition-colors"
              >
                <Check size={16} />
                <span className="text-sm">Save</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto flex-1 p-6 space-y-6">
        {/* Profile Info */}
        <div className="bg-gradient-to-r from-[#4792E6] to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <img
                src={profileData.avatar}
                alt={profileData.name}
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
              />
              {isEditing && (
                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white text-[#4792E6] rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors">
                  <Camera size={14} />
                </button>
              )}
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={tempData.name}
                    onChange={(e) => setTempData({ ...tempData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="Full name"
                  />
                  <input
                    type="text"
                    value={tempData.username}
                    onChange={(e) => setTempData({ ...tempData, username: e.target.value })}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="Username"
                  />
                  <textarea
                    value={tempData.bio}
                    onChange={(e) => setTempData({ ...tempData, bio: e.target.value })}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
                    rows={3}
                    placeholder="Bio"
                  />
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-2 mb-2">
                    <h1 className="text-2xl font-bold">{profileData.name}</h1>
                    <Crown className="w-5 h-5 text-yellow-400" />
                  </div>
                  <p className="text-blue-100 mb-2">{profileData.username}</p>
                  <p className="text-sm text-blue-100 mb-4">{profileData.bio}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{profileData.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {profileData.joinDate}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Mail className="w-5 h-5 mr-2 text-[#4792E6]" />
            Contact Information
          </h3>
          <div className="space-y-3">
            {isEditing ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={tempData.email}
                    onChange={(e) => setTempData({ ...tempData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4792E6] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={tempData.location}
                    onChange={(e) => setTempData({ ...tempData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4792E6] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    value={tempData.website}
                    onChange={(e) => setTempData({ ...tempData, website: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4792E6] focus:border-transparent"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{profileData.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{profileData.location}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Link className="w-4 h-4 text-gray-400" />
                  <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-[#4792E6] hover:underline">
                    {profileData.website}
                  </a>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Subscription Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Crown className="w-5 h-5 mr-2 text-[#4792E6]" />
            Subscription
          </h3>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-gray-900">{subscriptionPlan.name}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  subscriptionPlan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {subscriptionPlan.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-gray-600">{subscriptionPlan.price}</p>
            </div>
            <button className="px-4 py-2 bg-[#4792E6] text-white rounded-lg hover:bg-[#4792E6]/90 transition-colors">
              Manage
            </button>
          </div>
          <div className="space-y-2 mb-4">
            {subscriptionPlan.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
          <div className="text-sm text-gray-600">
            Next billing: {subscriptionPlan.nextBilling}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-[#4792E6]" />
            Your Stats
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#4792E6]/10 p-4 rounded-lg">
              <div className="text-2xl font-bold text-[#4792E6]">{stats.totalReplies.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Replies</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.engagementRate}%</div>
              <div className="text-sm text-gray-600">Engagement Rate</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.accountsManaged}</div>
              <div className="text-sm text-gray-600">Accounts Managed</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">+{stats.monthlyGrowth}%</div>
              <div className="text-sm text-gray-600">Monthly Growth</div>
            </div>
          </div>
        </div>

        {/* Connected Accounts */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Twitter className="w-5 h-5 mr-2 text-[#4792E6]" />
            Connected Accounts
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Twitter className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">@alexchen_dev</div>
                  <div className="text-sm text-gray-600">Primary account</div>
                </div>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Twitter className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">@xpilot_official</div>
                  <div className="text-sm text-gray-600">Business account</div>
                </div>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Connected
              </span>
            </div>
            <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#4792E6] hover:text-[#4792E6] transition-colors">
              + Connect Another Account
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-[#4792E6]" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Bell className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">Notifications</span>
            </button>
            <button className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Shield className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">Privacy</span>
            </button>
            <button className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <CreditCard className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">Billing</span>
            </button>
            <button className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Award className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">Achievements</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;