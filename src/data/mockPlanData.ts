import { ExecutionPlan, ExecutionStep } from '../types/ExecutionPlan';

// Mock计划数据 - 用于制定计划的debug命令
export const mockPlanData: ExecutionPlan[] = [
  {
    id: 'plan-debug-001',
    title: '社交媒体回复计划',
    description: '智能分析社交媒体帖子并生成个性化回复内容，提升品牌互动效果',
    status: 'pending',
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-20T10:30:00Z',
    estimatedDuration: '15分钟',
    progress: 0,
    steps: [
      {
        id: 'step-001',
        title: '找合适类型的帖子',
        description: '根据品牌定位和目标受众，筛选出适合回复的社交媒体帖子',
        type: 'analysis',
        status: 'pending',
        estimatedDuration: '5分钟',
        parameters: {
          platforms: ['微博', '小红书', '抖音', 'Instagram'],
          keywords: ['科技', 'SaaS', '效率工具', '企业管理'],
          postTypes: ['产品咨询', '使用体验', '功能建议', '行业讨论'],
          timeRange: '最近24小时',
          minEngagement: 100
        }
      },
      {
        id: 'step-002',
        title: '确定要回复的帖子数',
        description: '基于团队资源和互动策略，确定本次回复的帖子数量',
        type: 'strategy',
        status: 'pending',
        estimatedDuration: '3分钟',
        parameters: {
          teamCapacity: 5,
          responseTime: '2小时内',
          priorityLevel: ['高优先级', '中优先级', '低优先级'],
          maxReplies: 20,
          qualityThreshold: 0.8
        }
      },
      {
        id: 'step-003',
        title: '生成回复内容',
        description: '为筛选出的帖子生成个性化、专业且有价值的回复内容',
        type: 'generation',
        status: 'pending',
        estimatedDuration: '7分钟',
        parameters: {
          toneStyle: '专业友好',
          maxLength: 200,
          includeEmoji: true,
          brandVoice: '专业、有帮助、不推销',
          callToAction: false,
          personalization: true
        }
      }
    ]
  },
  {
    id: 'plan-debug-002',
    title: '企业微博回复计划',
    description: '针对企业微博账号的用户评论和提及进行分析和回复',
    status: 'pending',
    createdAt: '2024-01-20T14:15:00Z',
    updatedAt: '2024-01-20T14:15:00Z',
    estimatedDuration: '18分钟',
    progress: 0,
    steps: [
      {
        id: 'step-101',
        title: '找合适类型的帖子',
        description: '筛选企业微博账号中需要回复的评论和@提及',
        type: 'analysis',
        status: 'pending',
        estimatedDuration: '6分钟',
        parameters: {
          platform: '微博',
          accountType: '企业账号',
          contentCategories: ['产品反馈', '服务咨询', '投诉建议', '正面评价'],
          timeRange: '最近48小时',
          sentimentFilter: ['正面', '中性', '负面']
        }
      },
      {
        id: 'step-102',
        title: '确定要回复的帖子数',
        description: '根据紧急程度和重要性确定需要回复的微博数量',
        type: 'strategy',
        status: 'pending',
        estimatedDuration: '4分钟',
        parameters: {
          customerServiceCapacity: 3,
          priorityRules: {
            '负面评价': '高优先级',
            '产品咨询': '中优先级',
            '一般评论': '低优先级'
          },
          maxDailyReplies: 30,
          responseDeadline: '12小时内'
        }
      },
      {
        id: 'step-103',
        title: '生成回复内容',
        description: '为筛选的微博评论生成专业、得体的回复内容',
        type: 'generation',
        status: 'pending',
        estimatedDuration: '8分钟',
        parameters: {
          replyStyle: '企业官方',
          includeHashtags: true,
          maxCharacters: 140,
          problemSolvingApproach: '同理心+解决方案',
          includeContactInfo: true,
          followUpStrategy: '邀请私信进一步沟通'
        }
      }
    ]
  },
  {
    id: 'plan-debug-003',
    title: '小红书种草回复计划',
    description: '针对小红书平台的种草笔记进行精准回复，提升品牌曝光和用户互动',
    status: 'pending',
    createdAt: '2024-01-20T16:20:00Z',
    updatedAt: '2024-01-20T16:20:00Z',
    estimatedDuration: '12分钟',
    progress: 0,
    steps: [
      {
        id: 'step-201',
        title: '找合适类型的帖子',
        description: '筛选小红书平台上与品牌相关的种草笔记和用户讨论',
        type: 'analysis',
        status: 'pending',
        estimatedDuration: '4分钟',
        parameters: {
          platform: '小红书',
          contentTypes: ['种草笔记', '产品测评', '使用心得', '购买咨询'],
          targetTags: ['#效率工具', '#办公软件', '#SaaS', '#企业管理'],
          influencerLevel: ['素人', 'KOC', 'KOL'],
          engagementThreshold: 50
        }
      },
      {
        id: 'step-202',
        title: '确定要回复的帖子数',
        description: '基于内容质量和传播潜力确定回复的笔记数量',
        type: 'strategy',
        status: 'pending',
        estimatedDuration: '3分钟',
        parameters: {
          contentQualityScore: 0.7,
          viralPotential: ['高', '中', '低'],
          brandMentionType: ['正面提及', '中性提及', '询问推荐'],
          dailyReplyLimit: 15,
          focusStrategy: '质量优于数量'
        }
      },
      {
        id: 'step-203',
        title: '生成回复内容',
        description: '为筛选的小红书笔记生成自然、有价值的回复内容',
        type: 'generation',
        status: 'pending',
        estimatedDuration: '5分钟',
        parameters: {
          replyTone: '亲切自然',
          includeEmojis: true,
          maxLength: 100,
          valueAddition: '提供实用建议',
          avoidHardSelling: true,
          encourageInteraction: '引导进一步讨论'
        }
      }
    ]
  }
];

// Mock执行计划数据 - 用于执行计划的debug命令
export const mockExecutionPlanData: ExecutionPlan[] = [
  {
    id: 'exec-plan-001',
    title: '社交媒体回复计划',
    description: '智能分析社交媒体帖子并生成个性化回复内容，提升品牌互动效果',
    status: 'executing',
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-20T10:35:00Z',
    estimatedDuration: '15分钟',
    actualDuration: '12分钟',
    progress: 67,
    steps: [
      {
        id: 'step-001',
        title: '找合适类型的帖子',
        description: '根据品牌定位和目标受众，筛选出适合回复的社交媒体帖子',
        type: 'analysis',
        status: 'completed',
        estimatedDuration: '5分钟',
        actualDuration: '4分钟',
        parameters: {
          platforms: ['微博', '小红书', '抖音', 'Instagram'],
          keywords: ['科技', 'SaaS', '效率工具', '企业管理'],
          postTypes: ['产品咨询', '使用体验', '功能建议', '行业讨论'],
          timeRange: '最近24小时',
          minEngagement: 100
        },
        result: {
          totalPostsFound: 156,
          filteredPosts: 23,
          platformDistribution: {
            '微博': 8,
            '小红书': 7,
            '抖音': 5,
            'Instagram': 3
          },
          sentimentAnalysis: {
            '正面': 15,
            '中性': 6,
            '负面': 2
          },
          topKeywords: ['效率提升', '团队协作', '数据分析', '移动办公']
        }
      },
      {
        id: 'step-002',
        title: '确定要回复的帖子数',
        description: '基于团队资源和互动策略，确定本次回复的帖子数量',
        type: 'strategy',
        status: 'executing',
        estimatedDuration: '3分钟',
        parameters: {
          teamCapacity: 5,
          responseTime: '2小时内',
          priorityLevel: ['高优先级', '中优先级', '低优先级'],
          maxReplies: 20,
          qualityThreshold: 0.8
        }
      },
      {
        id: 'step-003',
        title: '生成回复内容',
        description: '为筛选出的帖子生成个性化、专业且有价值的回复内容',
        type: 'generation',
        status: 'pending',
        estimatedDuration: '7分钟',
        parameters: {
          toneStyle: '专业友好',
          maxLength: 200,
          includeEmoji: true,
          brandVoice: '专业、有帮助、不推销',
          callToAction: false,
          personalization: true
        }
      }
    ]
  },
  {
    id: 'exec-plan-002',
    title: '企业微博回复计划',
    description: '针对企业微博账号的用户评论和提及进行分析和回复',
    status: 'completed',
    createdAt: '2024-01-20T14:15:00Z',
    updatedAt: '2024-01-20T14:33:00Z',
    estimatedDuration: '18分钟',
    actualDuration: '18分钟',
    progress: 100,
    steps: [
      {
        id: 'step-101',
        title: '找合适类型的帖子',
        description: '筛选企业微博账号中需要回复的评论和@提及',
        type: 'analysis',
        status: 'completed',
        estimatedDuration: '6分钟',
        actualDuration: '5分钟',
        parameters: {
          platform: '微博',
          accountType: '企业账号',
          contentCategories: ['产品反馈', '服务咨询', '投诉建议', '正面评价'],
          timeRange: '最近48小时',
          sentimentFilter: ['正面', '中性', '负面']
        },
        result: {
          totalMentions: 89,
          categorizedPosts: {
            '产品反馈': 34,
            '服务咨询': 28,
            '投诉建议': 12,
            '正面评价': 15
          },
          urgentReplies: 8,
          averageResponseTime: '3.2小时'
        }
      },
      {
        id: 'step-102',
        title: '确定要回复的帖子数',
        description: '根据紧急程度和重要性确定需要回复的微博数量',
        type: 'strategy',
        status: 'completed',
        estimatedDuration: '4分钟',
        actualDuration: '4分钟',
        parameters: {
          customerServiceCapacity: 3,
          priorityRules: {
            '负面评价': '高优先级',
            '产品咨询': '中优先级',
            '一般评论': '低优先级'
          },
          maxDailyReplies: 30,
          responseDeadline: '12小时内'
        },
        result: {
          selectedForReply: 25,
          priorityDistribution: {
            '高优先级': 8,
            '中优先级': 12,
            '低优先级': 5
          },
          estimatedWorkload: '2.5小时'
        }
      },
      {
        id: 'step-103',
        title: '生成回复内容',
        description: '为筛选的微博评论生成专业、得体的回复内容',
        type: 'generation',
        status: 'completed',
        estimatedDuration: '8分钟',
        actualDuration: '9分钟',
        parameters: {
          replyStyle: '企业官方',
          includeHashtags: true,
          maxCharacters: 140,
          problemSolvingApproach: '同理心+解决方案',
          includeContactInfo: true,
          followUpStrategy: '邀请私信进一步沟通'
        },
        result: {
          generatedReplies: 25,
          averageLength: 98,
          satisfactionScore: 0.92,
          templatesCreated: 8,
          personalizedReplies: 17
        }
      }
    ]
  }
];

// Debug命令处理函数 - 制定计划
export const handleDebugPlanCommand = (): { content: string; executionPlan: ExecutionPlan } => {
  // 随机返回一个mock计划数据（pending状态）
  const randomIndex = Math.floor(Math.random() * mockPlanData.length);
  const selectedPlan = mockPlanData[randomIndex];
  
  // 创建一个新的计划实例，避免修改原始数据
  const debugPlan: ExecutionPlan = {
    ...selectedPlan,
    id: `debug-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return {
    content: `已为您生成调试计划数据：${debugPlan.title}`,
    executionPlan: debugPlan
  };
};

// Debug命令处理函数 - 执行计划
export const handleDebugPlanExecCommand = (): { content: string; executionPlan: ExecutionPlan } => {
  // 随机返回一个mock执行计划数据（executing或completed状态）
  const randomIndex = Math.floor(Math.random() * mockExecutionPlanData.length);
  const selectedPlan = mockExecutionPlanData[randomIndex];
  
  // 创建一个新的计划实例，避免修改原始数据
  const debugPlan: ExecutionPlan = {
    ...selectedPlan,
    id: `debug-exec-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return {
    content: `已为您生成执行计划调试数据：${debugPlan.title}（状态：${debugPlan.status === 'executing' ? '执行中' : '已完成'}）`,
    executionPlan: debugPlan
  };
};

// 获取所有mock计划数据
export const getAllMockPlans = (): ExecutionPlan[] => {
  return mockPlanData.map(plan => ({
    ...plan,
    id: `mock-${plan.id}-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
};

// 根据状态筛选计划
export const getMockPlansByStatus = (status: ExecutionPlan['status']): ExecutionPlan[] => {
  return mockPlanData.filter(plan => plan.status === status);
};

// 模拟计划执行过程
export const simulatePlanExecution = (plan: ExecutionPlan, onUpdate: (updatedPlan: ExecutionPlan) => void) => {
  let currentStepIndex = 0;
  const steps = [...plan.steps];
  
  const executeNextStep = () => {
    if (currentStepIndex >= steps.length) {
      // 所有步骤完成
      onUpdate({
        ...plan,
        status: 'completed',
        progress: 100,
        actualDuration: plan.estimatedDuration,
        updatedAt: new Date().toISOString(),
        steps: steps.map(step => ({ ...step, status: 'completed' }))
      });
      return;
    }
    
    const currentStep = steps[currentStepIndex];
    
    // 更新当前步骤为执行中
    steps[currentStepIndex] = { ...currentStep, status: 'executing' };
    const progress = Math.round(((currentStepIndex + 0.5) / steps.length) * 100);
    
    onUpdate({
      ...plan,
      status: 'executing',
      progress,
      updatedAt: new Date().toISOString(),
      steps: [...steps]
    });
    
    // 模拟步骤执行时间
    const executionTime = parseInt(currentStep.estimatedDuration?.replace(/[^\d]/g, '') || '3') * 1000;
    
    setTimeout(() => {
      // 步骤完成
      steps[currentStepIndex] = { 
        ...currentStep, 
        status: 'completed',
        actualDuration: currentStep.estimatedDuration
      };
      
      currentStepIndex++;
      executeNextStep();
    }, executionTime);
  };
  
  // 开始执行
  setTimeout(executeNextStep, 1000);
};