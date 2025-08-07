import React from 'react';
import { Clock, CheckCircle, AlertCircle, Loader2, Play, Pause } from 'lucide-react';
import { useExecutionPlanState, ExecutionPlanState, StepUpdate } from '../contexts/ExecutionPlanStateContext';

interface ExecutionPlanStateRendererProps {
  className?: string;
  showInChat?: boolean;
}

const ExecutionPlanStateRenderer: React.FC<ExecutionPlanStateRendererProps> = ({ 
  className = '', 
  showInChat = false 
}) => {
  const { state } = useExecutionPlanState();

  if (!state) return null;

  const getStatusIcon = (status: ExecutionPlanState['status']) => {
    switch (status) {
      case 'planning':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'executing':
        return <Play className="w-4 h-4 text-green-500" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: ExecutionPlanState['status']) => {
    switch (status) {
      case 'planning':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'executing':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'paused':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStepStatusIcon = (stepStatus: StepUpdate['status']) => {
    switch (stepStatus) {
      case 'pending':
        return '⏳';
      case 'executing':
        return '🔄';
      case 'completed':
        return '✅';
      case 'failed':
        return '❌';
      default:
        return '⏳';
    }
  };

  const formatDuration = (startTime?: Date, endTime?: Date) => {
    if (!startTime) return '';
    const end = endTime || new Date();
    const duration = Math.floor((end.getTime() - startTime.getTime()) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (showInChat) {
    // 聊天内显示模式，类似CopilotKit的useCoAgentStateRender
    return (
      <div className={`p-3 rounded-lg border bg-white shadow-sm ${className}`}>
        <div className="flex items-center gap-2 mb-2">
          {getStatusIcon(state.status)}
          <span className="font-medium text-sm">执行计划状态</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(state.status)}`}>
            {state.status === 'planning' && '规划中'}
            {state.status === 'executing' && '执行中'}
            {state.status === 'paused' && '已暂停'}
            {state.status === 'completed' && '已完成'}
            {state.status === 'failed' && '执行失败'}
          </span>
        </div>
        
        {state.progress > 0 && (
          <div className="mb-2">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>进度: {state.completedSteps}/{state.totalSteps}</span>
              <span>{Math.round(state.progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${state.progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="space-y-1">
          {state.realTimeUpdates.map((step, index) => (
            <div key={step.stepId} className="flex items-center gap-2 text-sm">
              <span className="text-lg">{getStepStatusIcon(step.status)}</span>
              <span className={`flex-1 ${step.status === 'completed' ? 'text-gray-600' : 'text-gray-800'}`}>
                {step.stepName}
                {step.status === 'executing' && step.progress < 100 && (
                  <span className="text-blue-600 ml-1">({step.progress}%)</span>
                )}
              </span>
              {step.status === 'executing' && (
                <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
              )}
            </div>
          ))}
        </div>

        {state.startTime && (
          <div className="mt-2 text-xs text-gray-500">
            执行时长: {formatDuration(state.startTime, state.endTime)}
          </div>
        )}
      </div>
    );
  }

  // 独立显示模式，类似CopilotKit的useCoAgent
  return (
    <div className={`bg-white rounded-lg border shadow-sm ${className}`}>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(state.status)}
            <h3 className="font-semibold text-gray-800">执行计划实时状态</h3>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(state.status)}`}>
            {state.status === 'planning' && '规划中'}
            {state.status === 'executing' && '执行中'}
            {state.status === 'paused' && '已暂停'}
            {state.status === 'completed' && '已完成'}
            {state.status === 'failed' && '执行失败'}
          </span>
        </div>
        
        {state.progress > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>总体进度: {state.completedSteps}/{state.totalSteps} 步骤</span>
              <span>{Math.round(state.progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${state.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <h4 className="font-medium text-gray-700 mb-3">步骤详情</h4>
        <div className="space-y-3">
          {state.realTimeUpdates.map((step, index) => (
            <div key={step.stepId} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
              <div className="flex-shrink-0 mt-0.5">
                <span className="text-xl">{getStepStatusIcon(step.status)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-medium text-gray-800 truncate">{step.stepName}</h5>
                  {step.status === 'executing' && (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500 flex-shrink-0" />
                  )}
                </div>
                {step.message && (
                  <p className="text-sm text-gray-600 mb-2">{step.message}</p>
                )}
                {step.status === 'executing' && step.progress < 100 && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${step.progress}%` }}
                    />
                  </div>
                )}
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{step.timestamp.toLocaleTimeString()}</span>
                  {step.duration && (
                    <span>耗时: {(step.duration / 1000).toFixed(1)}s</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {state.startTime && (
          <div className="mt-4 pt-3 border-t text-sm text-gray-600">
            <div className="flex justify-between">
              <span>开始时间: {state.startTime.toLocaleString()}</span>
              <span>执行时长: {formatDuration(state.startTime, state.endTime)}</span>
            </div>
            {state.endTime && (
              <div className="mt-1">
                结束时间: {state.endTime.toLocaleString()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutionPlanStateRenderer;