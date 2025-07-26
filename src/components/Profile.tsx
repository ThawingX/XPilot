import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, MapPin, Link, Twitter, Star, Crown, Settings, Edit3, Check, X, Camera, Shield, Bell, CreditCard, Users, Activity, TrendingUp, Award, Zap, Target, MessageSquare, Heart, BarChart3, Clock, Gift, Sparkles } from 'lucide-react';

interface ProfileProps {
  onClose?: () => void;
  initialSection?: string;
}

const Profile: React.FC<ProfileProps> = ({ onClose, initialSection = 'overview' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState(initialSection);
  const [animatedStats, setAnimatedStats] = useState({
    totalReplies: 0,
    engagementRate: 0,
    accountsManaged: 0,
    monthlyGrowth: 0
  });
  
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

  const stats = {
    totalReplies: 1247,
    engagementRate: 8.5,
    accountsManaged: 3,
    monthlyGrowth: 12.3
  };

  // Number animation effect
  useEffect(() => {
    const duration = 2000; // 2 second animation
    const steps = 60; // 60 frames
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setAnimatedStats({
        totalReplies: Math.floor(stats.totalReplies * easeOutQuart),
        engagementRate: Number((stats.engagementRate * easeOutQuart).toFixed(1)),
        accountsManaged: Math.floor(stats.accountsManaged * easeOutQuart),
        monthlyGrowth: Number((stats.monthlyGrowth * easeOutQuart).toFixed(1))
      });
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedStats(stats);
      }
    }, stepDuration);
    
    return () => clearInterval(timer);
  }, []);

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

  const recentActivity = [
    { id: 1, type: 'reply', content: 'Auto-replied to @techcrunch', time: '2 minutes ago', icon: MessageSquare },
    { id: 2, type: 'engagement', content: 'Gained 15 new followers', time: '1 hour ago', icon: Users },
    { id: 3, type: 'achievement', content: 'Reached 1000 replies milestone!', time: '3 hours ago', icon: Award },
    { id: 4, type: 'analytics', content: 'Weekly report generated', time: '1 day ago', icon: BarChart3 }
  ];

  const achievements = [
    { id: 1, title: 'First Reply', description: 'Sent your first auto-reply', icon: MessageSquare, unlocked: true },
    { id: 2, title: 'Engagement Master', description: 'Achieved 5%+ engagement rate', icon: Heart, unlocked: true },
    { id: 3, title: 'Growth Hacker', description: '10%+ monthly growth', icon: TrendingUp, unlocked: true },
    { id: 4, title: 'Social Butterfly', description: 'Manage 5+ accounts', icon: Users, unlocked: false },
    { id: 5, title: 'Reply Champion', description: 'Send 5000+ replies', icon: Zap, unlocked: false },
    { id: 6, title: 'Influence Builder', description: 'Reach 50K followers', icon: Crown, unlocked: false }
  ];

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'activity', label: 'History Activity', icon: Clock },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Profile Info */}
      <div className="bg-gradient-to-r from-[#4792E6] to-blue-600 rounded-lg p-6 text-white transform hover:scale-[1.02] transition-transform duration-300">
        <div className="flex items-start space-x-4">
          <div className="relative group">
            <img
              src={profileData.avatar}
              alt={profileData.name}
              className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover group-hover:scale-110 transition-transform duration-300"
            />
            {isEditing && (
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white text-[#4792E6] rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors">
                <Camera size={14} />
              </button>
            )}
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
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
                  <Crown className="w-5 h-5 text-yellow-400 animate-pulse" />
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

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#4792E6]/10 p-4 rounded-lg hover:bg-[#4792E6]/20 transition-colors duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-[#4792E6] group-hover:scale-110 transition-transform duration-300">
                {animatedStats.totalReplies.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Replies</div>
            </div>
            <MessageSquare className="w-8 h-8 text-[#4792E6] group-hover:rotate-12 transition-transform duration-300" />
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg hover:bg-green-100 transition-colors duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600 group-hover:scale-110 transition-transform duration-300">
                {animatedStats.engagementRate}%
              </div>
              <div className="text-sm text-gray-600">Engagement Rate</div>
            </div>
            <Heart className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg hover:bg-purple-100 transition-colors duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600 group-hover:scale-110 transition-transform duration-300">
                {animatedStats.accountsManaged}
              </div>
              <div className="text-sm text-gray-600">Accounts Managed</div>
            </div>
            <Users className="w-8 h-8 text-purple-600 group-hover:rotate-12 transition-transform duration-300" />
          </div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg hover:bg-orange-100 transition-colors duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-orange-600 group-hover:scale-110 transition-transform duration-300">
                +{animatedStats.monthlyGrowth}%
              </div>
              <div className="text-sm text-gray-600">Monthly Growth</div>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600 group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-[#4792E6]" />
          Detailed Statistics
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#4792E6]/10 p-4 rounded-lg">
            <div className="text-2xl font-bold text-[#4792E6] mb-2">{animatedStats.totalReplies.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mb-3">Total Replies</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-[#4792E6] h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-2">{animatedStats.engagementRate}%</div>
            <div className="text-sm text-gray-600 mb-3">Engagement Rate</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-2">{animatedStats.accountsManaged}</div>
            <div className="text-sm text-gray-600 mb-3">Accounts Managed</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 mb-2">+{animatedStats.monthlyGrowth}%</div>
            <div className="text-sm text-gray-600 mb-3">Monthly Growth</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: '90%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Crown className="w-5 h-5 text-[#4792E6]" />
            <h3 className="text-lg font-semibold text-gray-900">Subscription</h3>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium animate-pulse">
            Active
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-bold text-gray-900">{subscriptionPlan.name}</div>
            <p className="text-gray-600">{subscriptionPlan.price}</p>
          </div>
          <button className="px-4 py-2 bg-[#4792E6] text-white rounded-lg hover:bg-[#4792E6]/90 transition-colors transform hover:scale-105 duration-200">
            Manage
          </button>
        </div>
      </div>
    </div>
  );



  const renderAchievements = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-4 rounded-lg border-2 transition-all duration-300 ${
              achievement.unlocked
                ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 hover:shadow-lg'
                : 'bg-gray-50 border-gray-200 opacity-60'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full ${
                achievement.unlocked ? 'bg-yellow-100' : 'bg-gray-200'
              }`}>
                <achievement.icon className={`w-6 h-6 ${
                  achievement.unlocked ? 'text-yellow-600' : 'text-gray-400'
                }`} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </div>
              {achievement.unlocked && (
                <div className="flex items-center space-x-1 text-yellow-600">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">Unlocked!</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderActivity = () => (
    <div className="space-y-4">
      {recentActivity.map((activity) => (
        <div
          key={activity.id}
          className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300"
        >
          <div className="p-2 bg-[#4792E6]/10 rounded-full">
            <activity.icon className="w-5 h-5 text-[#4792E6]" />
          </div>
          <div className="flex-1">
            <p className="text-gray-900">{activity.content}</p>
            <p className="text-sm text-gray-500">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
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
            <Gift className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">Referrals</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return renderOverview();
      case 'activity': return renderActivity();
      case 'settings': return renderSettings();
      default: return renderOverview();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-lg border border-gray-200 shadow-sm relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-white/50 backdrop-blur-sm bg-white/30 relative z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center space-x-2 px-3 py-2 text-[#4792E6] hover:bg-white/50 rounded-lg transition-colors backdrop-blur-sm"
            >
              <Edit3 size={16} />
              <span className="text-sm font-medium">Edit</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:bg-white/50 rounded-lg transition-colors backdrop-blur-sm"
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

        {/* Navigation Menu */}
        <div className="flex space-x-1 mt-4 bg-white/40 backdrop-blur-sm rounded-lg p-1 border border-white/50">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeSection === item.id
                  ? 'bg-white text-[#4792E6] shadow-sm transform scale-105 backdrop-blur-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <item.icon size={16} />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto flex-1 p-6 relative z-10">
        {renderContent()}
      </div>
    </div>
  );
};

export default Profile;