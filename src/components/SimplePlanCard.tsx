import React from 'react';
import { CheckCircle, X } from 'lucide-react';
import { useCopilotAction } from '@copilotkit/react-core';

interface SimplePlanCardProps {
  steps: string[];
  onExecute?: () => void;
  onCancel?: () => void;
  className?: string;
}

const SimplePlanCard: React.FC<SimplePlanCardProps> = ({
  steps,
  onExecute,
  onCancel,
  className = ''
}) => {
  // 使用 CopilotKit 的 interrupt 功能处理执行计划
  useCopilotAction({
    name: 'executePlan',
    description: 'Execute the plan by sending APPROVE code',
    handler: async () => {
      // 发送 interrupt 消息给后端
      return { code: 'APPROVE' };
    }
  });

  // 使用 CopilotKit 的 interrupt 功能处理取消计划
  useCopilotAction({
    name: 'cancelPlan',
    description: 'Cancel the plan by sending CANCEL code',
    handler: async () => {
      // 发送 interrupt 消息给后端
      return { code: 'CANCEL' };
    }
  });

  const handleExecute = () => {
    onExecute?.();
  };

  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center mb-4 space-x-2">
          <CheckCircle size={20} className="text-[#4792E6]" />
          <h3 className="text-xl font-semibold text-gray-900">Your Plan</h3>
        </div>
      </div>

      {/* Steps */}
      <div className="p-6">
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 border border-gray-100"
            >
              <div className="w-6 h-6 rounded-full bg-[#4792E6] text-white text-sm font-medium flex items-center justify-center flex-shrink-0 mt-0.5">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{step}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 bg-gray-50 border-t border-gray-100">
        <div className="flex justify-end items-center space-x-3">
          <button
            onClick={handleCancel}
            className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <X size={16} />
            <span>取消计划</span>
          </button>
          <button
            onClick={handleExecute}
            disabled={steps.length === 0}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-[#4792E6] text-white font-medium rounded-lg hover:bg-[#3a7bc8] focus:outline-none focus:ring-2 focus:ring-[#4792E6] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle size={16} />
            <span>执行计划</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimplePlanCard;