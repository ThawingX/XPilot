import React, { useState } from 'react';
import ExecutionPlanCard from '../components/ExecutionPlanCard';
import { ExecutionPlan } from '../types/executionPlan';
import { ExecutionPlanStateProvider } from '../contexts/ExecutionPlanStateContext';

// 测试数据
const mockExecutionPlan: ExecutionPlan = {
  id: 'plan-test-001',
  title: '创建React组件',
  description: '根据用户需求创建一个新的React组件，包括样式和功能实现',
  steps: [
    {
      id: 'step-1',
      title: '分析需求',
      description: '分析用户提供的组件需求和设计要求',
      type: 'analysis',
      parameters: {
        requirements: '创建一个可复用的按钮组件',
        designSpecs: '支持多种尺寸和颜色主题'
      },
      status: 'completed',
      result: '需求分析完成，确定组件接口和属性'
    },
    {
      id: 'step-2',
      title: '创建组件文件',
      description: '创建React组件文件和相关的TypeScript类型定义',
      type: 'file_creation',
      parameters: {
        fileName: 'Button.tsx',
        location: 'src/components/'
      },
      status: 'executing'
    },
    {
      id: 'step-3',
      title: '实现组件逻辑',
      description: '编写组件的核心逻辑和事件处理',
      type: 'code_implementation',
      parameters: {
        features: ['onClick处理', '尺寸变体', '颜色主题', '禁用状态']
      },
      status: 'pending'
    },
    {
      id: 'step-4',
      title: '添加样式',
      description: '使用Tailwind CSS添加组件样式',
      type: 'styling',
      parameters: {
        framework: 'Tailwind CSS',
        responsive: true
      },
      status: 'pending'
    },
    {
      id: 'step-5',
      title: '测试组件',
      description: '创建测试用例并验证组件功能',
      type: 'testing',
      parameters: {
        testTypes: ['单元测试', '集成测试', '视觉测试']
      },
      status: 'pending'
    }
  ],
  status: 'executing',
  createdAt: new Date().toISOString(),
  estimatedDuration: '30分钟'
};

export const ExecutionPlanTest: React.FC = () => {
  const [plan, setPlan] = useState<ExecutionPlan>(mockExecutionPlan);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleEdit = (updatedPlan: ExecutionPlan) => {
    console.log('Plan edited:', updatedPlan);
    setPlan(updatedPlan);
  };

  const handleExecute = async (planId: string) => {
    console.log('Executing plan:', planId);
    setIsExecuting(true);
    
    // 模拟执行过程
    setTimeout(() => {
      setIsExecuting(false);
      setPlan(prev => ({
        ...prev,
        status: 'completed'
      }));
    }, 3000);
  };

  return (
    <ExecutionPlanStateProvider>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">执行计划测试页面</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">执行计划卡片预览</h2>
            
            <ExecutionPlanCard
              plan={plan}
              isExecuting={isExecuting}
              onEdit={handleEdit}
              onExecute={handleExecute}
            />
          </div>
          
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">当前计划数据</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(plan, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </ExecutionPlanStateProvider>
  );
};

export default ExecutionPlanTest;