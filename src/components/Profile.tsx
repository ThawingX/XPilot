import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, MapPin, Link, Twitter, Star, Crown, Settings, Edit3, Check, X, Camera, Shield, Bell, CreditCard, Users, Activity, TrendingUp, Award, Zap, Target, MessageSquare, Heart, BarChart3, Clock, Gift, Sparkles, ExternalLink, CheckCircle, AlertCircle, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ProfileProps {
  onClose?: () => void;
  initialSection?: string;
}

const Profile: React.FC<ProfileProps> = ({ onClose, initialSection = 'overview' }) => {
  const { user, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState(initialSection);
  const [isConnectingTwitter, setIsConnectingTwitter] = useState(false);
  const [twitterConnected, setTwitterConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({
    totalReplies: 0,
    engagementRate: 0,
    accountsManaged: 0,
    monthlyGrowth: 0
  });
  
  // Use real user data from auth context
  const [profileData, setProfileData] = useState({
    name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
    username: `@${user?.email?.split('@')[0] || 'user'}`,
    email: user?.email || '',
    bio: 'Building the future of social media automation | XPilot user',
    location: 'San Francisco, CA',
    website: 'https://xpilot.com',
    joinDate: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently',
    avatar: user?.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    provider: user?.user_metadata?.provider || 'email',
    emailConfirmed: !!user?.email_confirmed_at,
    lastSignIn: user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('en-US') : 'Unknown',
    userId: user?.id || ''
  });

  const [tempData, setTempData] = useState(profileData);

  // Update profile data when user changes
  useEffect(() => {
    if (user) {
      const updatedData = {
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        username: `@${user.email?.split('@')[0] || 'user'}`,
        email: user.email || '',
        bio: 'Building the future of social media automation | XPilot user',
        location: 'San Francisco, CA',
        website: 'https://xpilot.com',
        joinDate: new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        avatar: user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        provider: user.user_metadata?.provider || 'email',
        emailConfirmed: !!user.email_confirmed_at,
        lastSignIn: user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('en-US') : 'Unknown',
        userId: user.id || ''
      };
      setProfileData(updatedData);
      setTempData(updatedData);
    }
  }, [user]);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex overflow-hidden relative flex-col h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex flex-1 justify-center items-center">
          <div className="text-center">
            <User className="mx-auto mb-4 w-16 h-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-700">Please Sign In</h3>
            <p className="text-gray-500">You need to be signed in to view your profile.</p>
          </div>
        </div>
      </div>
    );
  }

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

  const handleConnectTwitter = async () => {
    setIsConnectingTwitter(true);
    try {
      // Simulate API call - replace with actual Twitter OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      setTwitterConnected(true);
      // Here you would implement the actual Twitter API connection
      console.log('Connecting to Twitter API...');
    } catch (error) {
      console.error('Failed to connect to Twitter:', error);
    } finally {
      setIsConnectingTwitter(false);
    }
  };

  const handleDisconnectTwitter = () => {
    setTwitterConnected(false);
    // Here you would implement the actual Twitter API disconnection
    console.log('Disconnecting from Twitter API...');
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
    { id: 'connect', label: 'Connect', icon: Twitter },
    { id: 'activity', label: 'Activity History', icon: Clock },
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
              className="object-cover w-20 h-20 rounded-full border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-110"
            />
            {isEditing && (
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white text-[#4792E6] rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors">
                <Camera size={14} />
              </button>
            )}
            <div className="flex absolute -top-1 -right-1 justify-center items-center w-6 h-6 bg-green-500 rounded-full border-2 border-white">
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
                  className="px-3 py-2 w-full text-white rounded-lg border bg-white/20 border-white/30 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="Full name"
                />
                <input
                  type="text"
                  value={tempData.username}
                  onChange={(e) => setTempData({ ...tempData, username: e.target.value })}
                  className="px-3 py-2 w-full text-white rounded-lg border bg-white/20 border-white/30 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="Username"
                />
                <textarea
                  value={tempData.bio}
                  onChange={(e) => setTempData({ ...tempData, bio: e.target.value })}
                  className="px-3 py-2 w-full text-white rounded-lg border resize-none bg-white/20 border-white/30 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                  rows={3}
                  placeholder="Bio"
                />
              </div>
            ) : (
              <>
                <div className="flex items-center mb-2 space-x-2">
                  <h1 className="text-2xl font-bold">{profileData.name}</h1>
                  <Crown className="w-5 h-5 text-yellow-400 animate-pulse" />
                </div>
                <p className="mb-2 text-blue-100">{profileData.username}</p>
                <p className="mb-4 text-sm text-blue-100">{profileData.bio}</p>
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
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold text-[#4792E6] group-hover:scale-110 transition-transform duration-300">
                {animatedStats.totalReplies.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Replies</div>
            </div>
            <MessageSquare className="w-8 h-8 text-[#4792E6] group-hover:rotate-12 transition-transform duration-300" />
          </div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg transition-colors duration-300 hover:bg-green-100 group">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold text-green-600 transition-transform duration-300 group-hover:scale-110">
                {animatedStats.engagementRate}%
              </div>
              <div className="text-sm text-gray-600">Engagement Rate</div>
            </div>
            <Heart className="w-8 h-8 text-green-600 transition-transform duration-300 group-hover:scale-110" />
          </div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg transition-colors duration-300 hover:bg-purple-100 group">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold text-purple-600 transition-transform duration-300 group-hover:scale-110">
                {animatedStats.accountsManaged}
              </div>
              <div className="text-sm text-gray-600">Accounts Managed</div>
            </div>
            <Users className="w-8 h-8 text-purple-600 transition-transform duration-300 group-hover:rotate-12" />
          </div>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg transition-colors duration-300 hover:bg-orange-100 group">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold text-orange-600 transition-transform duration-300 group-hover:scale-110">
                +{animatedStats.monthlyGrowth}%
              </div>
              <div className="text-sm text-gray-600">Monthly Growth</div>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600 transition-transform duration-300 group-hover:scale-110" />
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="p-6 bg-white rounded-lg border border-gray-200 transition-shadow duration-300 hover:shadow-lg">
        <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
          <BarChart3 className="w-5 h-5 mr-2 text-[#4792E6]" />
          Detailed Statistics
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#4792E6]/10 p-4 rounded-lg">
            <div className="text-2xl font-bold text-[#4792E6] mb-2">{animatedStats.totalReplies.toLocaleString()}</div>
            <div className="mb-3 text-sm text-gray-600">Total Replies</div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div className="bg-[#4792E6] h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="mb-2 text-2xl font-bold text-green-600">{animatedStats.engagementRate}%</div>
            <div className="mb-3 text-sm text-gray-600">Engagement Rate</div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-green-500 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="mb-2 text-2xl font-bold text-purple-600">{animatedStats.accountsManaged}</div>
            <div className="mb-3 text-sm text-gray-600">Accounts Managed</div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-purple-500 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="mb-2 text-2xl font-bold text-orange-600">+{animatedStats.monthlyGrowth}%</div>
            <div className="mb-3 text-sm text-gray-600">Monthly Growth</div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-orange-500 rounded-full" style={{ width: '90%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Card */}
      <div className="p-6 bg-white rounded-lg border border-gray-200 transition-shadow duration-300 hover:shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Crown className="w-5 h-5 text-[#4792E6]" />
            <h3 className="text-lg font-semibold text-gray-900">Subscription</h3>
          </div>
          <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full animate-pulse">
            Active
          </span>
        </div>
        <div className="flex justify-between items-center">
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

  const renderConnect = () => (
    <div className="space-y-6">
      {/* Twitter Connection Card */}
      <div className="p-6 bg-white rounded-lg border border-gray-200 transition-shadow duration-300 hover:shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <Twitter className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Twitter Integration</h3>
              <p className="text-sm text-gray-600">Connect your Twitter account to enable automated interactions</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {twitterConnected ? (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Connected</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-gray-500">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Not Connected</span>
              </div>
            )}
          </div>
        </div>

        {twitterConnected ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-green-800">Successfully Connected</h4>
                  <p className="mt-1 text-sm text-green-700">
                    Your Twitter account is connected and ready for automated interactions. 
                    You can now use Twitter API features for engagement automation.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2 space-x-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">Auto Replies</span>
                </div>
                <p className="text-xs text-gray-600">Automatically reply to mentions and DMs</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2 space-x-2">
                  <Heart className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-gray-900">Engagement</span>
                </div>
                <p className="text-xs text-gray-600">Like and retweet relevant content</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2 space-x-2">
                  <BarChart3 className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">Analytics</span>
                </div>
                <p className="text-xs text-gray-600">Track performance and engagement metrics</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2 space-x-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-900">Followers</span>
                </div>
                <p className="text-xs text-gray-600">Manage and grow your follower base</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleDisconnectTwitter}
                className="px-4 py-2 text-red-700 rounded-lg border border-red-300 transition-colors hover:bg-red-50"
              >
                Disconnect
              </button>
              <button className="flex items-center px-4 py-2 space-x-2 text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700">
                <ExternalLink className="w-4 h-4" />
                <span>Manage API Settings</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <Twitter className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800">Connect Your Twitter Account</h4>
                  <p className="mt-1 text-sm text-blue-700">
                    Connect your Twitter account to enable automated replies, engagement tracking, 
                    and advanced social media management features.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h5 className="text-sm font-medium text-gray-900">What you'll get:</h5>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Automated reply generation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Real-time engagement tracking</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Advanced analytics dashboard</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Follower growth insights</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h5 className="text-sm font-medium text-gray-900">Requirements:</h5>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span>Active Twitter account</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span>Twitter API access permissions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span>Account verification may be required</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={handleConnectTwitter}
              disabled={isConnectingTwitter}
              className="flex justify-center items-center px-4 py-3 space-x-2 w-full text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnectingTwitter ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent"></div>
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Twitter className="w-5 h-5" />
                  <span>Connect Twitter Account</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Other Social Platforms (Coming Soon) */}
      <div className="p-6 bg-white rounded-lg border border-gray-200 opacity-60">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Other Platforms</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex items-center p-3 space-x-3 rounded-lg border border-gray-200">
            <div className="p-2 bg-gray-100 rounded-full">
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">LinkedIn</h4>
              <p className="text-xs text-gray-500">Coming Soon</p>
            </div>
          </div>
          <div className="flex items-center p-3 space-x-3 rounded-lg border border-gray-200">
            <div className="p-2 bg-gray-100 rounded-full">
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Instagram</h4>
              <p className="text-xs text-gray-500">Coming Soon</p>
            </div>
          </div>
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
          className="flex items-center p-4 space-x-4 bg-white rounded-lg border border-gray-200 transition-shadow duration-300 hover:shadow-md"
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
      {/* Account Information */}
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
          <User className="w-5 h-5 mr-2 text-[#4792E6]" />
          Account Information
        </h3>
        <div className="space-y-4">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <Mail className="mr-3 w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Email Address</p>
              <p className="text-sm text-gray-600">{profileData.email}</p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <Calendar className="mr-3 w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Member Since</p>
              <p className="text-sm text-gray-600">{profileData.joinDate}</p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <Shield className="mr-3 w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Account Status</p>
              <p className="text-sm text-gray-600">
                {profileData.emailConfirmed ? (
                  <span className="flex items-center text-green-600">
                    <CheckCircle className="mr-1 w-4 h-4" />
                    Verified
                  </span>
                ) : (
                  <span className="flex items-center text-yellow-600">
                    <AlertCircle className="mr-1 w-4 h-4" />
                    Pending Verification
                  </span>
                )}
              </p>
            </div>
          </div>

          {profileData.provider && (
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Settings className="mr-3 w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Sign-in Method</p>
                <p className="text-sm text-gray-600 capitalize">
                  {profileData.provider === 'google' ? 'Google Account' : profileData.provider}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contact Info */}
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
          <Mail className="w-5 h-5 mr-2 text-[#4792E6]" />
          Contact Information
        </h3>
        <div className="space-y-3">
          {isEditing ? (
            <>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  value={tempData.location}
                  onChange={(e) => setTempData({ ...tempData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4792E6] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Website</label>
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
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
          <Settings className="w-5 h-5 mr-2 text-[#4792E6]" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center p-3 space-x-2 rounded-lg border border-gray-200 transition-colors hover:bg-gray-50">
            <Bell className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">Notifications</span>
          </button>
          <button className="flex items-center p-3 space-x-2 rounded-lg border border-gray-200 transition-colors hover:bg-gray-50">
            <Shield className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">Privacy</span>
          </button>
          <button className="flex items-center p-3 space-x-2 rounded-lg border border-gray-200 transition-colors hover:bg-gray-50">
            <CreditCard className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">Billing</span>
          </button>
          <button className="flex items-center p-3 space-x-2 rounded-lg border border-gray-200 transition-colors hover:bg-gray-50">
            <Gift className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">Referrals</span>
          </button>
        </div>
      </div>

      {/* Account Management */}
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
          <Shield className="w-5 h-5 mr-2 text-[#4792E6]" />
          Account Management
        </h3>
        <div className="space-y-3">
          <button
            onClick={handleSignOut}
            disabled={loading}
            className="flex justify-center items-center px-4 py-3 space-x-2 w-full text-red-600 bg-red-50 rounded-lg transition-colors hover:bg-red-100 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">{loading ? 'Signing Out...' : 'Sign Out'}</span>
          </button>
          
          <div className="pt-4 mt-4 border-t border-gray-200">
            <div className="space-y-1 text-xs text-gray-500">
              <p>User ID: {profileData.userId}</p>
              <p>Last Sign In: {profileData.lastSignIn}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return renderOverview();
      case 'connect': return renderConnect();
      case 'activity': return renderActivity();
      case 'settings': return renderSettings();
      default: return renderOverview();
    }
  };

  return (
    <div className="flex overflow-hidden relative flex-col h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-lg border border-gray-200 shadow-sm">
      {/* Animated background elements */}
      <div className="overflow-hidden absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br rounded-full blur-3xl animate-pulse from-blue-400/20 to-purple-400/20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr rounded-full blur-3xl animate-pulse from-indigo-400/20 to-pink-400/20" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r rounded-full blur-3xl animate-pulse transform -translate-x-1/2 -translate-y-1/2 from-cyan-400/10 to-blue-400/10" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Header */}
      <div className="relative z-10 flex-shrink-0 p-6 border-b backdrop-blur-sm border-white/50 bg-white/30">
        <div className="flex justify-between items-center">
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
                className="flex items-center px-3 py-2 space-x-1 text-gray-600 rounded-lg backdrop-blur-sm transition-colors hover:bg-white/50"
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
        <div className="flex p-1 mt-4 space-x-1 rounded-lg border backdrop-blur-sm bg-white/40 border-white/50">
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
      <div className="overflow-y-auto relative z-10 flex-1 p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default Profile;