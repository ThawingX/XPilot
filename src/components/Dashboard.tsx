import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Heart, 
  BarChart3, 
  Zap, 
  Target,
  ArrowUpRight,
  Calendar,
  Activity,
  Eye,
  ChevronRight,
  Rocket,
  Crosshair,
  PenTool
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DashboardProps {
  onNavigate?: (section: string, profileSection?: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [animatedStats, setAnimatedStats] = useState({
    totalReplies: 0,
    engagementTotal: 0,
    accountsManaged: 0,
    monthlyGrowth: 0,
    avgResponseTime: 0
  });

  const stats = {
    totalReplies: 1247,
    engagementTotal: 8.5,
    accountsManaged: 3,
    monthlyGrowth: 12.3,
    avgResponseTime: 2.4
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  // Number animation effect
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setAnimatedStats({
        totalReplies: Math.floor(stats.totalReplies * easeOutQuart),
        engagementTotal: Number((stats.engagementTotal * easeOutQuart).toFixed(1)),
        accountsManaged: Math.floor(stats.accountsManaged * easeOutQuart),
        monthlyGrowth: Number((stats.monthlyGrowth * easeOutQuart).toFixed(1)),
        avgResponseTime: Number((stats.avgResponseTime * easeOutQuart).toFixed(1))
      });
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedStats(stats);
      }
    }, stepDuration);
    
    return () => clearInterval(timer);
  }, []);

  const recentActivity = [
    { 
      id: 1, 
      type: 'reply', 
      content: 'Auto-replied to @techcrunch about AI trends', 
      time: '2 minutes ago', 
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      section: 'Get Post/Thread'
    },
    { 
      id: 2, 
      type: 'follow', 
      content: 'Added @elonmusk to inspiration accounts', 
      time: '1 hour ago', 
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      section: 'Inspiration Accounts'
    },
    { 
      id: 3, 
      type: 'analytics', 
      content: 'Weekly engagement report generated', 
      time: '1 day ago', 
      icon: BarChart3,
      color: 'text-[#4792E6]',
        bgColor: 'bg-blue-50',
      section: 'Profile'
    },
    { 
      id: 4, 
      type: 'strategy', 
      content: 'New content strategy template created', 
      time: '2 days ago', 
      icon: Target,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      section: 'Content Strategy'
    },
    { 
      id: 5, 
      type: 'engagement', 
      content: 'Auto-engagement queue processed 50 interactions', 
      time: '3 days ago', 
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      section: 'Auto Engagement'
    }
  ];

  const quickActions = [
    { 
      title: 'Inspiration Accounts', 
      description: 'Manage target accounts for inspiration', 
      icon: Crosshair, 
      color: 'bg-gradient-to-br from-[#4792E6] to-[#3b82f6]',
      section: 'Inspiration Accounts'
    },
    { 
      title: 'Auto Engagement', 
      description: 'Configure automated interactions', 
      icon: Users, 
      color: 'bg-gradient-to-br from-[#4792E6]/80 to-[#6366f1]',
      section: 'Auto Engagement'
    },
    { 
      title: 'Get Post/Thread', 
      description: 'Manage and review post queue', 
      icon: PenTool, 
      color: 'bg-gradient-to-br from-[#4792E6]/70 to-[#8b5cf6]',
      section: 'Get Post/Thread'
    },
    { 
      title: 'Content Strategy', 
      description: 'Plan your content calendar', 
      icon: Calendar, 
      color: 'bg-gradient-to-br from-[#4792E6]/60 to-[#06b6d4]',
      section: 'Content Strategy'
    }
  ];

  const handleQuickActionClick = (section: string) => {
    onNavigate?.(section);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-lg border border-gray-200 shadow-sm relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-r from-cyan-400/5 to-blue-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-white/50 backdrop-blur-sm bg-white/30 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Rocket className="w-7 h-7 mr-3 text-blue-600" />
              Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Welcome back, {getUserDisplayName()}! Click the Quick Actions below to quickly use features.</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>All Systems Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto flex-1 p-6 relative z-10 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-white/50 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600 group-hover:scale-110 transition-transform duration-300">
                  {animatedStats.totalReplies.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Replies</div>
                <div className="flex items-center mt-2 text-xs text-green-600">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +12% this week
                </div>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-white/50 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600 group-hover:scale-110 transition-transform duration-300">
                  {animatedStats.engagementTotal}%
                </div>
                <div className="text-sm text-gray-600">Engagement Total</div>
                <div className="flex items-center mt-2 text-xs text-green-600">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +2.3% this month
                </div>
              </div>
              <Heart className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-500" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickActionClick(action.section)}
                className={`group p-5 rounded-xl ${action.color} hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-white relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 text-left">
                  <action.icon className="w-7 h-7 mb-3" />
                  <h4 className="font-semibold text-base mb-1">{action.title}</h4>
                  <p className="text-sm opacity-90 leading-relaxed">{action.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-500" />
              Recent Activity
            </h3>
            <button 
              onClick={() => onNavigate?.('Profile', 'activity')}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center transition-colors"
            >
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                onClick={() => onNavigate?.(activity.section)}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/50 transition-colors cursor-pointer group"
              >
                <div className={`p-2 ${activity.bgColor} rounded-full group-hover:scale-110 transition-transform duration-200`}>
                  <activity.icon className={`w-4 h-4 ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 text-sm font-medium">{activity.content}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 p-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              Growth Metrics
            </h4>
            <div className="flex items-center justify-center h-20">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-600 mb-1">Coming Soon!</div>
                <div className="text-sm text-gray-500">Feature in development</div>
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 p-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-500" />
              System Status
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Auto Engagement Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Reply Queue Processing</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">All Accounts Connected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;