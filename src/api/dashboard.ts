// Mock API endpoint for dashboard data
export const mockDashboardData = {
  "stats": {
    "total_replies": 1247,
    "total_replies_change": "+12% this week",
    "engagement_rate": 87.3,
    "engagement_rate_change": "+2.3% this month"
  },

  "recent_activities": [
    {
      "id": 1,
      "title": "Auto-replied to @techinfluencer",
      "time_ago": "2 minutes ago",
      "type": "auto_engagement"
    },
    {
      "id": 2,
      "title": "Added new inspiration account",
      "time_ago": "15 minutes ago",
      "type": "inspiration_accounts"
    },
    {
      "id": 3,
      "title": "Engagement queue processed",
      "time_ago": "1 hour ago",
      "type": "auto_engagement"
    },
    {
      "id": 4,
      "title": "New post scheduled",
      "time_ago": "2 hours ago",
      "type": "posts_topics"
    },
    {
      "id": 5,
      "title": "Marketing strategy updated",
      "time_ago": "3 hours ago",
      "type": "marketing_strategy"
    }
  ],
  "system_status": {
    "auto_engagement_active": true,
    "reply_queue_processing": true,
    "all_accounts_connected": true
  },
  "growth_metrics": {
    "status": "Coming Soon!",
    "description": "Feature in development"
  },
  "all_systems_active": true
};

// Simulate API delay
export const getDashboardData = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockDashboardData;
};