import React from 'react';
import { CheckCircle, X } from 'lucide-react';
import { useLangGraphInterrupt } from '@copilotkit/react-core';

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
  console.log('SimplePlanCard rendered with steps:', steps);
  
  // 使用 useLangGraphInterrupt 处理 check_steps interrupt
  const interruptResult = useLangGraphInterrupt({
    enabled: (event) => {
      console.log('SimplePlanCard interrupt enabled called with event:', event);
      const isCheckSteps = event?.type === 'check_steps';
      console.log('Is check_steps event:', isCheckSteps);
      return isCheckSteps;
    },
    render: ({ event, resolve }) => {
      console.log('SimplePlanCard render event:', event);
      const planSteps = event?.content || [];
      
      return (
        <div className={`bg-white rounded-lg border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md ${className}`}>
          {/* Header */}
          <div className="p-6 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#4792E6] flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Your Plan (Interrupt)</h2>
            </div>
          </div>

          {/* Steps */}
          <div className="px-6">
            <div className="space-y-3">
              {planSteps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-start p-3 space-x-3 bg-gray-50 rounded-lg border border-gray-100 transition-all duration-200 hover:bg-gray-100"
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
                onClick={() => resolve({ code: 'CANCEL' })}
                className="inline-flex items-center px-4 py-2 space-x-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
              <button
                onClick={() => resolve({ code: 'APPROVE' })}
                disabled={planSteps.length === 0}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-[#4792E6] text-white font-medium rounded-lg hover:bg-[#3a7bc8] focus:outline-none focus:ring-2 focus:ring-[#4792E6] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle size={16} />
                <span>Execute</span>
              </button>
            </div>
          </div>
        </div>
      );
    }
  });

  // 如果有interrupt正在处理，返回interrupt的渲染结果
  if (interruptResult) {
    return interruptResult;
  }

  // 否则使用props渲染常规UI
  if (!steps || steps.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md ${className}`}>
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-[#4792E6] flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Your Plan</h2>
        </div>
      </div>

      {/* Steps */}
      <div className="px-6">
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex items-start p-3 space-x-3 bg-gray-50 rounded-lg border border-gray-100 transition-all duration-200 hover:bg-gray-100"
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
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 space-x-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <X size={16} />
            <span>Cancel</span>
          </button>
          <button
            onClick={onExecute}
            disabled={steps.length === 0}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-[#4792E6] text-white font-medium rounded-lg hover:bg-[#3a7bc8] focus:outline-none focus:ring-2 focus:ring-[#4792E6] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle size={16} />
            <span>Execute</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimplePlanCard;