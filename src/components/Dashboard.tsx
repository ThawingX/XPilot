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
  PenTool,
  Star,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { dashboardService, DashboardData } from '../lib/dashboardService';

// Loading Card Component
const LoadingCard: React.FC = () => (
  <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-white/50">
    <div className="flex items-center justify-center h-20">
      <Loader className="w-6 h-6 animate-spin text-blue-500" />
    </div>
  </div>
);

// Error Card Component
const ErrorCard: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
  <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-white/50">
    <div className="flex flex-col items-center justify-center h-20 text-center">
      <AlertCircle className="w-6 h-6 text-red-500 mb-2" />
      <p className="text-red-600 text-sm mb-2">{message}</p>
      <button 
        onClick={onRetry}
        className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
      >
        Retry
      </button>
    </div>
  </div>
);

interface DashboardProps {
  onNavigate?: (section: string, profileSection?: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animatedStats, setAnimatedStats] = useState({
    totalReplies: 0,
    engagementRate: 0
  });
  
  // 获取Dashboard数据
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await dashboardService.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
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

  // 组件加载时获取Dashboard数据
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Number animation effect
  useEffect(() => {
    if (!dashboardData) return;
    
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setAnimatedStats({
        totalReplies: Math.floor((dashboardData?.stats?.total_replies || 0) * easeOutQuart),
      engagementRate: Number(((dashboardData?.stats?.engagement_rate || 0) * easeOutQuart).toFixed(1))
      });
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedStats({
          totalReplies: dashboardData?.stats?.total_replies || 0,
      engagementRate: dashboardData?.stats?.engagement_rate || 0
        });
      }
    }, stepDuration);
    
    return () => clearInterval(timer);
  }, [dashboardData]);



  // 前端配置的快捷操作
  const quickActions = [
    {
      id: 1,
      title: "Inspiration Accounts",
      description: "Manage and discover new accounts",
      icon: "users",
      color: "blue",
      url: "/inspiration-accounts",
      disabled: false
    },
    {
      id: 2,
      title: "Auto Engagement",
      description: "Configure automated interactions",
      icon: "heart",
      color: "green",
      url: "/auto-engagement",
      disabled: false
    },
    {
      id: 3,
      title: "Get Post/Thread",
      description: "Create and schedule content (Coming Soon)",
      icon: "message-square",
      color: "purple",
      url: "/posts-topics",
      disabled: true
    },
    {
      id: 4,
      title: "Marketing Strategy",
      description: "Plan your content calendar (Coming Soon)",
      icon: "target",
      color: "orange",
      url: "/content-strategy",
      disabled: true
    }
  ];

  // 根据URL映射到section
  const getNavigationSection = (url: string) => {
    const urlMap: { [key: string]: string } = {
      '/inspiration-accounts': 'Inspiration Accounts',
      '/auto-engagement': 'Auto Engagement',
      '/posts-topics': 'Posts & Topics',
      '/content-strategy': 'Content Strategy'
    };
    return urlMap[url] || 'Dashboard';
  };

  const handleQuickActionClick = (section: string) => {
    onNavigate?.(section);
  };

  // Loading component for individual sections
  const LoadingCard = ({ className = "" }: { className?: string }) => (
    <div className={`bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 p-6 ${className}`}>
      <div className="flex items-center justify-center h-20">
        <Loader className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    </div>
  );

  // Error component for individual sections
  const ErrorCard = ({ message, onRetry, className = "" }: { message: string; onRetry: () => void; className?: string }) => (
    <div className={`bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 p-6 ${className}`}>
      <div className="flex flex-col items-center justify-center h-20 text-center">
        <AlertCircle className="w-6 h-6 text-red-500 mb-2" />
        <p className="text-red-600 text-sm mb-2">{message}</p>
        <button 
          onClick={onRetry}
          className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );

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
            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
              dashboardData?.all_systems_active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                dashboardData?.all_systems_active ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span>{dashboardData?.all_systems_active ? 'All Systems Active' : 'System Issues'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto flex-1 p-6 relative z-10 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          {loading || error ? (
            <>
              {error ? (
                <ErrorCard message="Failed to load metrics" onRetry={fetchDashboardData} />
              ) : (
                <LoadingCard />
              )}
              {error ? (
                <ErrorCard message="Failed to load metrics" onRetry={fetchDashboardData} />
              ) : (
                <LoadingCard />
              )}
            </>
          ) : dashboardData ? (
            <>
              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-white/50 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-600 group-hover:scale-110 transition-transform duration-300">
                      {animatedStats.totalReplies.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Total Replies</div>
                    <div className="flex items-center mt-2 text-xs text-green-600">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      {dashboardData?.stats?.total_replies_change || 0}
                    </div>
                  </div>
                  <MessageSquare className="w-8 h-8 text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-white/50 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-600 group-hover:scale-110 transition-transform duration-300">
                      {animatedStats.engagementRate}%
                    </div>
                    <div className="text-sm text-gray-600">Engagement Rate</div>
                    <div className="flex items-center mt-2 text-xs text-green-600">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      {dashboardData?.stats?.engagement_rate_change || 0}
                    </div>
                  </div>
                  <Heart className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Inspiration Accounts Overview */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Crosshair className="w-5 h-5 mr-2 text-blue-500" />
              Inspiration Accounts Overview
            </h3>
            <button 
              onClick={() => onNavigate?.('Inspiration Accounts')}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center transition-colors"
            >
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">Quick access to manage inspiration accounts</p>
            <button 
              onClick={() => onNavigate?.('Inspiration Accounts')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Manage Accounts
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Rocket className="w-5 h-5 mr-2 text-blue-500" />
              Quick Actions
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const IconComponent = dashboardService.getIconComponent(action.icon);
              const colorClasses = dashboardService.getColorClasses(action.color);
              const isDisabled = action.disabled;
              
              return (
                <button
                  key={action.id}
                  onClick={() => !isDisabled && onNavigate?.(getNavigationSection(action.url))}
                  disabled={isDisabled}
                  className={`p-4 rounded-lg border transition-all duration-200 text-left group ${
                    isDisabled 
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white/50 hover:bg-white/80'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg transition-transform duration-200 ${
                      isDisabled 
                        ? 'bg-gray-200' 
                        : `${colorClasses.bg} group-hover:scale-110`
                    }`}>
                      <IconComponent className={`w-5 h-5 ${
                        isDisabled 
                          ? 'text-gray-400' 
                          : colorClasses.icon
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium text-sm mb-1 transition-colors ${
                        isDisabled 
                          ? 'text-gray-500' 
                          : 'text-gray-900 group-hover:text-blue-600'
                      }`}>
                        {action.title}
                      </h4>
                      <p className={`text-xs line-clamp-2 ${
                        isDisabled 
                          ? 'text-gray-400' 
                          : 'text-gray-500'
                      }`}>
                        {action.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-500" />
              Recent Activity
            </h3>
            {!loading && !error && (
              <button 
                onClick={() => onNavigate?.('Profile', 'activity')}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center transition-colors"
              >
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <AlertCircle className="w-6 h-6 text-red-500 mb-2" />
              <p className="text-red-600 text-sm mb-2">Failed to load recent activity</p>
              <button 
                onClick={fetchDashboardData}
                className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : dashboardData ? (
            <div className="space-y-3">
               {dashboardData?.recent_activities?.map((activity) => {
                 const activityStyle = dashboardService.getActivityStyle(activity.type);
                 const IconComponent = activityStyle.icon;
                 const colorClasses = dashboardService.getColorClasses(activityStyle.color);
                 
                 return (
                   <div
                     key={activity.id}
                     className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/50 transition-colors cursor-pointer group"
                   >
                     <div className={`p-2 rounded-full group-hover:scale-110 transition-transform duration-200 ${colorClasses.bg}`}>
                       <IconComponent className={`w-4 h-4 ${colorClasses.text}`} />
                     </div>
                     <div className="flex-1">
                       <p className="text-gray-900 text-sm font-medium">{activity.title}</p>
                       <p className="text-xs text-gray-500">{activity.time_ago}</p>
                     </div>
                     <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                   </div>
                 );
                })}
             </div>
          ) : null}
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-2 gap-4">
          {loading || error ? (
            <>
              {error ? (
                <ErrorCard message="Failed to load growth metrics" onRetry={fetchDashboardData} />
              ) : (
                <LoadingCard />
              )}
              {error ? (
                <ErrorCard message="Failed to load system status" onRetry={fetchDashboardData} />
              ) : (
                <LoadingCard />
              )}
            </>
          ) : dashboardData ? (
            <>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                  Growth Metrics
                </h4>
                <div className="flex items-center justify-center h-20">
                   <div className="text-center">
                     <div className="text-xl font-bold text-gray-600 mb-1">{dashboardData?.growth_metrics?.status || 'N/A'}</div>
                <div className="text-sm text-gray-500">{dashboardData?.growth_metrics?.description || 'No data available'}</div>
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
                     <div className={`w-2 h-2 rounded-full ${
                       dashboardData?.system_status?.auto_engagement_active ? 'bg-green-500' : 'bg-red-500'
                     }`}></div>
                     <span className="text-sm text-gray-700">Auto Engagement {dashboardData?.system_status?.auto_engagement_active ? 'Active' : 'Inactive'}</span>
                   </div>
                   <div className="flex items-center space-x-2">
                     <div className={`w-2 h-2 rounded-full ${
                       dashboardData?.system_status?.reply_queue_processing ? 'bg-green-500' : 'bg-red-500'
                     }`}></div>
                     <span className="text-sm text-gray-700">Reply Queue {dashboardData?.system_status?.reply_queue_processing ? 'Processing' : 'Stopped'}</span>
                   </div>
                   <div className="flex items-center space-x-2">
                     <div className={`w-2 h-2 rounded-full ${
                       dashboardData?.system_status?.all_accounts_connected ? 'bg-green-500' : 'bg-red-500'
                     }`}></div>
                     <span className="text-sm text-gray-700">All Accounts {dashboardData?.system_status?.all_accounts_connected ? 'Connected' : 'Disconnected'}</span>
                   </div>
                 </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;