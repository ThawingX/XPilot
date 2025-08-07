import React, { useState, useEffect } from 'react';
import PlanCreator from './PlanCreator';
import ExecutionPlanCard from './ExecutionPlanCard';
import { ExecutionPlan, ExecutionStep } from '../types/ExecutionPlan';

interface PlanManagerProps {
  onCreatePlan?: (type: string, query: string) => Promise<void>;
  onExecutePlan?: (planId: string) => Promise<void>;
  onEditPlan?: (planId: string, updates: Partial<ExecutionPlan>) => Promise<void>;
  onPausePlan?: (planId: string) => Promise<void>;
  onResumePlan?: (planId: string) => Promise<void>;
  onDeletePlan?: (planId: string) => Promise<void>;
}

export const PlanManager: React.FC<PlanManagerProps> = ({
  onCreatePlan,
  onExecutePlan,
  onEditPlan,
  onPausePlan,
  onResumePlan,
  onDeletePlan
}) => {
  const [currentMode, setCurrentMode] = useState<'create' | 'execute'>('create');
  const [isCreating, setIsCreating] = useState(false);
  const [executionPlans, setExecutionPlans] = useState<ExecutionPlan[]>([]);
  const [createdPlan, setCreatedPlan] = useState<ExecutionPlan | null>(null);

  // 处理计划创建
  const handleCreatePlan = async (type: string, query: string) => {
    setIsCreating(true);
    try {
      // 创建初始计划对象
      const newPlan: ExecutionPlan = {
        id: `plan-${Date.now()}`,
        title: `${getPlanTypeTitle(type)}计划`,
        description: `基于查询"${query}"的${getPlanTypeTitle(type)}计划`,
        status: 'executing', // 创建后立即开始制定
        steps: generatePlanSteps(type),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setCreatedPlan(newPlan);
      setCurrentMode('execute');
      
      // 调用后端API创建计划
      if (onCreatePlan) {
        await onCreatePlan(type, query);
        
        // 这里应该从后端获取实际的计划数据
        // 目前使用模拟数据，实际应该替换为：
        // const planResponse = await fetch('/api/plans', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ planType: type, query: query })
        // });
        // const planData = await planResponse.json();
        
        // 模拟制定过程 - 实际应该通过WebSocket或轮询获取状态更新
        setTimeout(() => {
          const completedPlan = {
            ...newPlan,
            status: 'completed' as const,
            steps: newPlan.steps.map(step => ({
              ...step,
              status: 'completed' as const
            }))
          };
          setCreatedPlan(completedPlan);
          setExecutionPlans(prev => [...prev, completedPlan]);
        }, 3000);
      }
      
    } catch (error) {
      console.error('创建计划失败:', error);
      // 处理错误状态
      if (createdPlan) {
        setCreatedPlan({
          ...createdPlan,
          status: 'failed'
        });
      }
    } finally {
      setIsCreating(false);
    }
  };

  // 处理计划执行
  const handleExecutePlan = async (planId: string) => {
    try {
      // 更新计划状态为执行中
      setExecutionPlans(prev => 
        prev.map(plan => 
          plan.id === planId 
            ? { ...plan, status: 'executing' }
            : plan
        )
      );
      
      if (createdPlan && createdPlan.id === planId) {
        setCreatedPlan({ ...createdPlan, status: 'executing' });
      }
      
      // 调用后端API执行计划
      if (onExecutePlan) {
        await onExecutePlan(planId);
        
        // 实际应该通过WebSocket或轮询获取执行状态更新
        // 这里使用模拟数据演示状态变化
        // const executeResponse = await fetch(`/api/plans/${planId}/execute`, {
        //   method: 'POST'
        // });
        // const executeData = await executeResponse.json();
        
        // 模拟执行过程中的状态更新
        setTimeout(() => {
          setExecutionPlans(prev => 
            prev.map(plan => 
              plan.id === planId 
                ? { 
                    ...plan, 
                    status: 'completed',
                    steps: plan.steps.map(step => ({
                      ...step,
                      status: 'completed'
                    }))
                  }
                : plan
            )
          );
          
          if (createdPlan && createdPlan.id === planId) {
            setCreatedPlan({ 
              ...createdPlan, 
              status: 'completed',
              steps: createdPlan.steps.map(step => ({
                ...step,
                status: 'completed'
              }))
            });
          }
        }, 5000); // 模拟5秒执行时间
      }
      
    } catch (error) {
      console.error('执行计划失败:', error);
      
      // 更新计划状态为失败
      setExecutionPlans(prev => 
        prev.map(plan => 
          plan.id === planId 
            ? { ...plan, status: 'failed' }
            : plan
        )
      );
      
      if (createdPlan && createdPlan.id === planId) {
        setCreatedPlan({ ...createdPlan, status: 'failed' });
      }
    }
  };

  // 处理计划编辑
  const handleEditPlan = async (planId: string, updates: Partial<ExecutionPlan>) => {
    try {
      if (onEditPlan) {
        await onEditPlan(planId, updates);
      }
      
      setExecutionPlans(prev => 
        prev.map(plan => 
          plan.id === planId 
            ? { ...plan, ...updates, updatedAt: new Date() }
            : plan
        )
      );
      
      if (createdPlan && createdPlan.id === planId) {
        setCreatedPlan({ ...createdPlan, ...updates, updatedAt: new Date() });
      }
      
    } catch (error) {
      console.error('编辑计划失败:', error);
    }
  };

  // 获取计划类型标题
  const getPlanTypeTitle = (type: string): string => {
    const typeMap: Record<string, string> = {
      'research_website': '研究网站',
      'analyze_results': '分析结果',
      'generate_report': '生成报告',
      'competitor_analysis': '竞品分析',
      'market_research': '市场调研',
      'user_feedback': '用户反馈分析'
    };
    return typeMap[type] || '未知类型';
  };

  // 生成计划步骤
  const generatePlanSteps = (type: string): ExecutionStep[] => {
    const baseSteps: Record<string, ExecutionStep[]> = {
      'research_website': [
        {
          id: 'step-1',
          title: '网站结构分析',
          description: '分析网站的整体架构和页面结构',
          type: 'analysis',
          status: 'pending',
          estimatedDuration: '2分钟'
        },
        {
          id: 'step-2',
          title: '内容提取',
          description: '提取网站的关键内容和信息',
          type: 'extraction',
          status: 'pending',
          estimatedDuration: '3分钟'
        },
        {
          id: 'step-3',
          title: '数据整理',
          description: '整理和归类提取的数据',
          type: 'processing',
          status: 'pending',
          estimatedDuration: '2分钟'
        }
      ],
      'analyze_results': [
        {
          id: 'step-1',
          title: '数据预处理',
          description: '清理和预处理原始数据',
          type: 'preprocessing',
          status: 'pending',
          estimatedDuration: '1分钟'
        },
        {
          id: 'step-2',
          title: '统计分析',
          description: '进行统计分析和计算',
          type: 'analysis',
          status: 'pending',
          estimatedDuration: '3分钟'
        },
        {
          id: 'step-3',
          title: '结果解释',
          description: '解释分析结果和发现',
          type: 'interpretation',
          status: 'pending',
          estimatedDuration: '2分钟'
        }
      ],
      'generate_report': [
        {
          id: 'step-1',
          title: '报告结构设计',
          description: '设计报告的整体结构和章节',
          type: 'design',
          status: 'pending',
          estimatedDuration: '1分钟'
        },
        {
          id: 'step-2',
          title: '内容生成',
          description: '生成报告的具体内容',
          type: 'generation',
          status: 'pending',
          estimatedDuration: '4分钟'
        },
        {
          id: 'step-3',
          title: '格式化和优化',
          description: '格式化报告并进行优化',
          type: 'formatting',
          status: 'pending',
          estimatedDuration: '2分钟'
        }
      ]
    };

    return baseSteps[type] || [];
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 模式切换 */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setCurrentMode('create')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentMode === 'create'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            制定计划
          </button>
          <button
            onClick={() => setCurrentMode('execute')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentMode === 'execute'
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            执行计划
          </button>
        </div>
      </div>

      {/* 内容区域 */}
      {currentMode === 'create' ? (
        <div className="space-y-6">
          <PlanCreator
            onCreatePlan={handleCreatePlan}
            isCreating={isCreating}
          />
          
          {/* 显示正在制定的计划 */}
          {createdPlan && createdPlan.status === 'executing' && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">正在制定计划</h3>
              <ExecutionPlanCard
                plan={createdPlan}
                mode="create"
                onExecute={handleExecutePlan}
                onEdit={handleEditPlan}
                onPause={onPausePlan}
                onResume={onResumePlan}
                onDelete={onDeletePlan}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">执行计划</h2>
          
          {/* 显示已制定完成的计划 */}
          {createdPlan && createdPlan.status === 'completed' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">最新制定的计划</h3>
              <ExecutionPlanCard
                plan={createdPlan}
                mode="execute"
                onExecute={handleExecutePlan}
                onEdit={handleEditPlan}
                onPause={onPausePlan}
                onResume={onResumePlan}
                onDelete={onDeletePlan}
              />
            </div>
          )}
          
          {/* 显示所有执行计划 */}
          {executionPlans.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">历史计划</h3>
              <div className="space-y-4">
                {executionPlans.map((plan) => (
                  <ExecutionPlanCard
                    key={plan.id}
                    plan={plan}
                    mode="execute"
                    onExecute={handleExecutePlan}
                    onEdit={handleEditPlan}
                    onPause={onPausePlan}
                    onResume={onResumePlan}
                    onDelete={onDeletePlan}
                  />
                ))}
              </div>
            </div>
          )}
          
          {executionPlans.length === 0 && !createdPlan && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-2">暂无执行计划</div>
              <button
                onClick={() => setCurrentMode('create')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                去制定一个计划
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlanManager;