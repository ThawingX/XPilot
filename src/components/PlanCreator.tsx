import React, { useState } from 'react';
import { 
  Search, 
  BarChart3, 
  FileText, 
  Clock, 
  Play,
  ChevronRight,
  Globe,
  TrendingUp,
  Target,
  Users,
  MessageSquare,
  Share2
} from 'lucide-react';

export interface PlanType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  estimatedTime: string;
  steps: string[];
}

interface PlanCreatorProps {
  onCreatePlan: (planType: string, query: string) => void;
  isCreating?: boolean;
}

const PlanCreator: React.FC<PlanCreatorProps> = ({ onCreatePlan, isCreating = false }) => {
  const [selectedPlanType, setSelectedPlanType] = useState<string>('');
  const [query, setQuery] = useState<string>('');

  // 计划类型定义
  const planTypes: PlanType[] = [
    {
      id: 'research',
      name: '研究网站',
      description: '深入分析目标网站的内容、结构和竞争优势，为后续策略制定提供数据支撑',
      icon: <Search className="w-5 h-5" />,
      color: 'bg-blue-500',
      estimatedTime: '5-10分钟',
      steps: [
        '网站结构分析',
        '内容质量评估', 
        'SEO优化检查',
        '用户体验评价',
        '竞争对手对比'
      ]
    },
    {
      id: 'analysis',
      name: '分析结果',
      description: '对收集的数据进行深度分析，识别关键趋势和机会点',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'bg-green-500',
      estimatedTime: '3-8分钟',
      steps: [
        '数据清洗整理',
        '趋势识别分析',
        '关键指标提取',
        '机会点识别',
        '风险评估'
      ]
    },
    {
      id: 'report',
      name: '生成报告',
      description: '基于分析结果生成专业的研究报告和行动建议',
      icon: <FileText className="w-5 h-5" />,
      color: 'bg-purple-500',
      estimatedTime: '8-15分钟',
      steps: [
        '报告框架搭建',
        '数据可视化',
        '关键发现总结',
        '行动建议制定',
        '报告格式优化'
      ]
    },
    {
      id: 'strategy',
      name: '策略制定',
      description: '制定全面的营销策略和执行计划',
      icon: <Target className="w-5 h-5" />,
      color: 'bg-orange-500',
      estimatedTime: '10-20分钟',
      steps: [
        '目标受众分析',
        '渠道策略规划',
        '内容策略制定',
        '时间节点安排',
        '效果评估体系'
      ]
    },
    {
      id: 'content',
      name: '内容创作',
      description: '创建高质量的营销内容和素材',
      icon: <MessageSquare className="w-5 h-5" />,
      color: 'bg-pink-500',
      estimatedTime: '15-30分钟',
      steps: [
        '内容主题确定',
        '创意概念设计',
        '文案撰写',
        '视觉素材制作',
        '内容优化调整'
      ]
    },
    {
      id: 'engagement',
      name: '互动营销',
      description: '设计用户互动和社交媒体营销方案',
      icon: <Users className="w-5 h-5" />,
      color: 'bg-indigo-500',
      estimatedTime: '12-25分钟',
      steps: [
        '互动形式设计',
        '用户参与机制',
        '社交媒体策略',
        'KOL合作规划',
        '效果跟踪体系'
      ]
    }
  ];

  const handleStartResearch = () => {
    if (selectedPlanType && query.trim()) {
      onCreatePlan(selectedPlanType, query.trim());
    }
  };

  const selectedPlan = planTypes.find(plan => plan.id === selectedPlanType);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* 头部 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">制定执行计划</h2>
        <p className="text-gray-600">选择计划类型并输入您的研究目标，AI将为您制定详细的执行方案</p>
      </div>

      <div className="p-6">
        {/* 计划类型选择 */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">选择计划类型</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {planTypes.map((planType) => (
              <div
                key={planType.id}
                onClick={() => setSelectedPlanType(planType.id)}
                className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedPlanType === planType.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg text-white ${planType.color}`}>
                    {planType.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 mb-1">{planType.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{planType.description}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{planType.estimatedTime}</span>
                    </div>
                  </div>
                </div>
                
                {selectedPlanType === planType.id && (
                  <div className="absolute top-2 right-2">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 选中计划的详细信息 */}
        {selectedPlan && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className={`p-2 rounded-lg text-white ${selectedPlan.color}`}>
                {selectedPlan.icon}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{selectedPlan.name}</h4>
                <p className="text-sm text-gray-600">预计用时: {selectedPlan.estimatedTime}</p>
              </div>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">执行步骤预览:</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selectedPlan.steps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 查询输入 */}
        <div className="mb-6">
          <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
            研究目标或关键词
          </label>
          <div className="relative">
            <input
              id="query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                selectedPlan?.id === 'research' ? '请输入要研究的网站URL或关键词...' :
                selectedPlan?.id === 'analysis' ? '请输入要分析的数据或主题...' :
                selectedPlan?.id === 'report' ? '请输入报告主题或要求...' :
                selectedPlan?.id === 'strategy' ? '请输入策略目标或产品信息...' :
                selectedPlan?.id === 'content' ? '请输入内容主题或创作要求...' :
                selectedPlan?.id === 'engagement' ? '请输入互动目标或活动主题...' :
                '请输入您的具体需求...'
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            提供详细的描述将帮助AI制定更精准的执行计划
          </p>
        </div>

        {/* 开始按钮 */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {selectedPlan && query.trim() && (
              <span>准备就绪，点击开始制定 {selectedPlan.name} 计划</span>
            )}
          </div>
          
          <button
            onClick={handleStartResearch}
            disabled={!selectedPlanType || !query.trim() || isCreating}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            {isCreating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>制定中...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>开始研究</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanCreator;