import React, { useState } from 'react';
import { 
  Play, 
  Edit3, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Pause,
  Save,
  X,
  AlertCircle,
  Brain,
  Zap,
  Activity
} from 'lucide-react';
import { ExecutionPlan, PlanStep } from '../types/executionPlan';
import { useExecutionPlanState } from '../contexts/ExecutionPlanStateContext';
import ExecutionPlanStateRenderer from './ExecutionPlanStateRenderer';

interface ExecutionPlanCardProps {
  plan: ExecutionPlan;
  onExecute: (planId: string) => void;
  onEdit?: (updatedPlan: ExecutionPlan) => void;
  onUpdate?: (planId: string, updatedPlan: Partial<ExecutionPlan>) => void;
  onPause?: (planId: string) => void;
  isExecuting?: boolean;
  mode?: 'create' | 'execute';
}

const ExecutionPlanCard: React.FC<ExecutionPlanCardProps> = ({
  plan,
  onExecute,
  onEdit,
  onUpdate,
  onPause,
  isExecuting = false,
  mode = 'execute'
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState<ExecutionPlan>(plan);
  const [showRealTimeState, setShowRealTimeState] = useState(false);
  
  // 使用执行计划状态管理
  const { state: executionState, startExecution, pauseExecution, resumeExecution, resetExecution } = useExecutionPlanState();

  // 处理执行开始
  const handleStartExecution = async () => {
    const stepNames = plan.steps.map(step => step.title);
    await startExecution(plan.id, stepNames);
    setShowRealTimeState(true);
    onExecute(plan.id);
  };

  // 处理暂停/恢复
  const handlePauseResume = () => {
    if (executionState?.status === 'executing') {
      pauseExecution();
      onPause?.(plan.id);
    } else if (executionState?.status === 'paused') {
      resumeExecution();
    }
  };

  // 获取状态图标
  const getStatusIcon = (status: PlanStep['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-gray-400" />;
      case 'executing':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  // 获取状态颜色
  const getStatusColor = (status: ExecutionPlan['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'editing':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'executing':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'paused':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // 计算进度
  const calculateProgress = () => {
    if (plan.progress !== undefined) return plan.progress;
    
    const completedSteps = plan.steps.filter(step => step.status === 'completed').length;
    return Math.round((completedSteps / plan.steps.length) * 100);
  };

  // 处理编辑保存
  const handleSaveEdit = () => {
    if (onUpdate) {
      onUpdate(plan.id, editedPlan);
    } else if (onEdit) {
      onEdit(editedPlan);
    }
    setIsEditing(false);
  };

  // 处理编辑取消
  const handleCancelEdit = () => {
    setEditedPlan(plan);
    setIsEditing(false);
  };

  // 处理步骤编辑
  const handleStepEdit = (stepId: string, field: keyof PlanStep, value: any) => {
    setEditedPlan(prev => ({
      ...prev,
      steps: prev.steps.map(step => 
        step.id === stepId ? { ...step, [field]: value } : step
      )
    }));
  };

  const progress = calculateProgress();

  // 根据模式获取不同的标题图标
  const getModeIcon = () => {
    if (mode === 'create') {
      return <Brain className="w-5 h-5 text-blue-500" />;
    }
    return <Zap className="w-5 h-5 text-green-500" />;
  };

  // 根据模式获取不同的标题前缀
  const getModeTitle = () => {
    if (mode === 'create') {
      return '制定计划';
    }
    return '执行计划';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-4 overflow-hidden">
      {/* 计划头部 */}
      <div className={`p-4 border-b border-gray-100 ${mode === 'create' ? 'bg-blue-50' : 'bg-white'}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* 模式标识 */}
            <div className="flex items-center space-x-2 mb-2">
              {getModeIcon()}
              <span className={`text-sm font-medium ${mode === 'create' ? 'text-blue-700' : 'text-green-700'}`}>
                {getModeTitle()}
              </span>
            </div>
            
            {isEditing ? (
              <input
                type="text"
                value={editedPlan.title}
                onChange={(e) => setEditedPlan(prev => ({ ...prev, title: e.target.value }))}
                className="text-lg font-semibold text-gray-900 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none w-full mb-2"
              />
            ) : (
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.title}</h3>
            )}
            
            {isEditing ? (
              <textarea
                value={editedPlan.description}
                onChange={(e) => setEditedPlan(prev => ({ ...prev, description: e.target.value }))}
                className="text-sm text-gray-600 bg-transparent border border-gray-300 rounded p-2 focus:border-blue-500 focus:outline-none w-full resize-none"
                rows={2}
              />
            ) : (
              <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
            )}

            {/* 状态和进度 */}
            <div className="flex items-center space-x-4">
              {/* 只在执行模式或非pending状态时显示状态标识 */}
              {(mode === 'execute' || plan.status !== 'pending') && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(plan.status)}`}>
                  {plan.status === 'pending' && (mode === 'create' ? '待制定' : '待执行')}
                  {plan.status === 'editing' && '编辑中'}
                  {plan.status === 'executing' && (mode === 'create' ? '制定中' : '执行中')}
                  {plan.status === 'completed' && (mode === 'create' ? '制定完成' : '已完成')}
                  {plan.status === 'failed' && (mode === 'create' ? '制定失败' : '执行失败')}
                  {plan.status === 'paused' && '已暂停'}
                </span>
              )}
              
              {plan.status === 'executing' && (
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        mode === 'create' ? 'bg-blue-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{progress}%</span>
                </div>
              )}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center space-x-2 ml-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveEdit}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                  title="保存"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                  title="取消"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                {/* 实时状态显示切换按钮 */}
                {executionState && (
                  <button
                    onClick={() => setShowRealTimeState(!showRealTimeState)}
                    className={`p-2 rounded-md transition-colors ${
                      showRealTimeState 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    title={showRealTimeState ? "隐藏实时状态" : "显示实时状态"}
                  >
                    <Activity className="w-4 h-4" />
                  </button>
                )}
                
                {/* 执行模式下的按钮 */}
                {mode === 'execute' && plan.status === 'pending' && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                      title="编辑计划"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleStartExecution}
                      disabled={isExecuting}
                      className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                      title="开始执行"
                    >
                      {isExecuting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                      <span>开始计划</span>
                    </button>
                  </>
                )}
                
                {(plan.status === 'executing' || executionState?.status === 'executing' || executionState?.status === 'paused') && (
                  <button
                    onClick={handlePauseResume}
                    className={`px-3 py-1.5 text-white rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
                      executionState?.status === 'paused' 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-orange-500 hover:bg-orange-600'
                    }`}
                    title={executionState?.status === 'paused' ? "继续执行" : "暂停执行"}
                  >
                    {executionState?.status === 'paused' ? (
                      <Play className="w-4 h-4" />
                    ) : (
                      <Pause className="w-4 h-4" />
                    )}
                    <span>{executionState?.status === 'paused' ? '继续' : '暂停'}</span>
                  </button>
                )}
              </>
            )}

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
              title={isExpanded ? "收起" : "展开"}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* 步骤列表 */}
      {isExpanded && (
        <div className="p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            {mode === 'create' ? '制定步骤' : '执行步骤'}
          </h4>
          
          {/* 实时状态显示 */}
          {showRealTimeState && executionState && (
            <div className="mb-4">
              <ExecutionPlanStateRenderer mode="standalone" />
            </div>
          )}
          
          <div className="space-y-3">
            {(isEditing ? editedPlan.steps : plan.steps).map((step, index) => (
              <div key={step.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 mt-0.5">
                  {getStatusIcon(step.status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-gray-500">步骤 {index + 1}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        mode === 'create' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {step.type}
                      </span>
                    </div>
                    {step.estimatedDuration && (
                      <span className="text-xs text-gray-500">预计 {step.estimatedDuration}</span>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <div className="mt-2 space-y-2">
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => handleStepEdit(step.id, 'title', e.target.value)}
                        className="text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded px-2 py-1 focus:border-blue-500 focus:outline-none w-full"
                      />
                      <textarea
                        value={step.description}
                        onChange={(e) => handleStepEdit(step.id, 'description', e.target.value)}
                        className="text-sm text-gray-600 bg-white border border-gray-300 rounded px-2 py-1 focus:border-blue-500 focus:outline-none w-full resize-none"
                        rows={2}
                      />
                    </div>
                  ) : (
                    <div className="mt-1">
                      <p className="text-sm font-medium text-gray-900">{step.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                    </div>
                  )}

                  {/* 参数预览 */}
                  {step.parameters && Object.keys(step.parameters).length > 0 && (
                    <div className="mt-2">
                      <details className="text-xs">
                        <summary className="text-gray-500 cursor-pointer hover:text-gray-700">
                          参数详情
                        </summary>
                        <pre className="mt-1 p-2 bg-white rounded border text-gray-600 overflow-x-auto">
                          {JSON.stringify(step.parameters, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}

                  {/* 错误信息 */}
                  {step.error && (
                    <div className="mt-2 flex items-start space-x-2 p-2 bg-red-50 border border-red-200 rounded">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{step.error}</p>
                    </div>
                  )}

                  {/* 执行结果 */}
                  {step.result && step.status === 'completed' && (
                    <div className="mt-2">
                      <details className="text-xs">
                        <summary className="text-green-600 cursor-pointer hover:text-green-700">
                          执行结果
                        </summary>
                        <div className="mt-1 p-2 bg-green-50 border border-green-200 rounded">
                          <pre className="text-green-700 overflow-x-auto">
                            {typeof step.result === 'string' ? step.result : JSON.stringify(step.result, null, 2)}
                          </pre>
                        </div>
                      </details>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 制定计划模式下的底部开始执行按钮 */}
      {mode === 'create' && plan.status === 'pending' && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <button
            onClick={() => onExecute(plan.id)}
            disabled={isExecuting}
            className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-sm hover:shadow-md mt-4"
            title="开始执行"
          >
            {isExecuting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>开始执行</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ExecutionPlanCard;