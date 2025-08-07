import React, { useState } from 'react';
import PlanningCard from '../components/PlanningCard';
import ExecutionStatusCard from '../components/ExecutionStatusCard';

const PlanDemo: React.FC = () => {
  const [currentView, setCurrentView] = useState<'planning' | 'execution'>('planning');

  // 示例计划步骤数据
  const planningSteps = [
    {
      id: '1',
      stepNumber: 1,
      title: '市场调研分析',
      description: '深入分析目标市场，了解用户需求和竞争对手情况。',
      estimatedTime: '2天',
      priority: 'high' as const
    },
    {
      id: '2',
      stepNumber: 2,
      title: '内容策略制定',
      description: '制定详细的内容创作策略，包括内容类型和发布频率。',
      estimatedTime: '1天',
      priority: 'high' as const
    },
    {
      id: '3',
      stepNumber: 3,
      title: '执行与优化',
      description: '执行营销策略并根据数据反馈进行优化调整。',
      estimatedTime: '3天',
      priority: 'medium' as const
    }
  ];

  // 示例执行状态数据
  const executionSteps = [
    {
      id: '1',
      stepNumber: 1,
      title: '市场调研分析',
      description: '深入分析目标市场，了解用户需求和竞争对手情况。',
      status: 'completed' as const,
      startTime: '2024-01-15 09:00',
      endTime: '2024-01-17 18:00',
      duration: '2天9小时'
    },
    {
      id: '2',
      stepNumber: 2,
      title: '内容策略制定',
      description: '制定详细的内容创作策略，包括内容类型和发布频率。',
      status: 'in-progress' as const,
      startTime: '2024-01-18 10:00',
      duration: '进行中'
    },
    {
      id: '3',
      stepNumber: 3,
      title: '执行与优化',
      description: '执行营销策略并根据数据反馈进行优化调整。',
      status: 'pending' as const
    }
  ];

  const handleExecutePlan = () => {
    setCurrentView('execution');
  };

  const handleBackToPlanning = () => {
    setCurrentView('planning');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">计划管理演示</h1>
          <p className="text-gray-600">展示制定计划卡片和执行状态卡片的功能</p>
        </div>

        {/* View Toggle */}
        <div className="mb-6">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
            <button
              onClick={() => setCurrentView('planning')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                currentView === 'planning'
                  ? 'bg-[#4792E6] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              制定计划
            </button>
            <button
              onClick={() => setCurrentView('execution')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                currentView === 'execution'
                  ? 'bg-[#4792E6] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              执行状态
            </button>
          </div>
        </div>

        {/* Card Display */}
        {currentView === 'planning' ? (
          <PlanningCard
            title="社交媒体营销推广计划"
            description="通过系统化的社交媒体营销策略，提升品牌知名度和用户参与度，实现业务增长目标。"
            steps={planningSteps}
            createdAt="2024-01-15"
            estimatedDuration="6天"
            onExecutePlan={handleExecutePlan}
          />
        ) : (
          <div className="space-y-4">
            <button
              onClick={handleBackToPlanning}
              className="inline-flex items-center text-sm text-[#4792E6] hover:text-[#3a7bc8] transition-colors"
            >
              ← 返回计划制定
            </button>
            <ExecutionStatusCard
              title="社交媒体营销推广计划"
              description="通过系统化的社交媒体营销策略，提升品牌知名度和用户参与度，实现业务增长目标。"
              steps={executionSteps}
              overallStatus="running"
              startTime="2024-01-15 09:00"
              progress={67}
            />
          </div>
        )}

        {/* Additional Examples */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">其他示例</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Simple Planning Example */}
            <PlanningCard
              title="产品发布准备"
              description="为新产品发布做好全面准备工作"
              steps={[
                {
                  id: 'p1',
                  stepNumber: 1,
                  title: '产品测试',
                  description: '完成最终产品测试和质量检查',
                  estimatedTime: '3天',
                  priority: 'high'
                },
                {
                  id: 'p2',
                  stepNumber: 2,
                  title: '营销材料制作',
                  description: '制作产品宣传材料和营销内容',
                  estimatedTime: '2天',
                  priority: 'medium'
                },
                {
                  id: 'p3',
                  stepNumber: 3,
                  title: '发布活动策划',
                  description: '策划产品发布活动和推广方案',
                  estimatedTime: '1天',
                  priority: 'medium'
                }
              ]}
              createdAt="2024-01-20"
              estimatedDuration="6天"
              onExecutePlan={() => console.log('执行产品发布计划')}
            />

            {/* Execution Status Example */}
            <ExecutionStatusCard
              title="客户服务优化项目"
              description="提升客户服务质量和响应效率"
              steps={[
                {
                  id: 'e1',
                  stepNumber: 1,
                  title: '现状分析',
                  description: '分析当前客户服务现状和问题',
                  status: 'completed',
                  startTime: '2024-01-10 09:00',
                  endTime: '2024-01-12 17:00',
                  duration: '2天8小时'
                },
                {
                  id: 'e2',
                  stepNumber: 2,
                  title: '流程优化',
                  description: '优化客户服务流程和标准',
                  status: 'blocked',
                  startTime: '2024-01-13 10:00',
                  errorMessage: '等待管理层审批新的服务流程标准'
                },
                {
                  id: 'e3',
                  stepNumber: 3,
                  title: '团队培训',
                  description: '对客服团队进行新流程培训',
                  status: 'pending'
                }
              ]}
              overallStatus="paused"
              startTime="2024-01-10 09:00"
              progress={33}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDemo;