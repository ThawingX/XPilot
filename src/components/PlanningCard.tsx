import React from 'react';
import { Play, Calendar, Clock, Target, CheckCircle2 } from 'lucide-react';

interface PlanStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  estimatedTime?: string;
  priority?: 'high' | 'medium' | 'low';
}

interface PlanningCardProps {
  title: string;
  description?: string;
  steps: PlanStep[];
  createdAt?: string;
  estimatedDuration?: string;
  onExecutePlan?: () => void;
  className?: string;
}

const PlanningCard: React.FC<PlanningCardProps> = ({
  title,
  description,
  steps,
  createdAt,
  estimatedDuration,
  onExecutePlan,
  className = ''
}) => {
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
            {description && (
              <p className="text-sm text-gray-600 mb-4">{description}</p>
            )}
            
            {/* Meta Information */}
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              {createdAt && (
                <div className="flex items-center space-x-1">
                  <Calendar size={12} />
                  <span>创建于 {createdAt}</span>
                </div>
              )}
              {estimatedDuration && (
                <div className="flex items-center space-x-1">
                  <Clock size={12} />
                  <span>预计耗时 {estimatedDuration}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Target size={12} />
                <span>{steps.length} 个步骤</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="p-6">
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="relative flex items-start space-x-4 p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all duration-200"
            >
              {/* Timeline Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-8 top-16 w-0.5 h-8 bg-gray-300"></div>
              )}
              
              {/* Step Number */}
              <div className="flex-shrink-0 w-8 h-8 bg-[#4792E6] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                {step.stepNumber}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-base font-medium text-gray-900 mb-2">
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {step.description}
                    </p>
                    
                    {/* Step Meta */}
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      {step.estimatedTime && (
                        <div className="flex items-center space-x-1">
                          <Clock size={10} />
                          <span>{step.estimatedTime}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Priority Badge */}
                  {step.priority && (
                    <div className="flex items-center space-x-2 ml-3">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(step.priority)}`}>
                        {step.priority === 'high' ? '高优先级' : 
                         step.priority === 'medium' ? '中优先级' : '低优先级'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {steps.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle2 size={24} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">暂无计划步骤</p>
          </div>
        )}
      </div>

      {/* Execute Button */}
      <div className="p-6 border-t border-gray-100 bg-gray-50">
        <button
          onClick={onExecutePlan}
          disabled={steps.length === 0}
          className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3 bg-[#4792E6] text-white font-medium rounded-lg hover:bg-[#3a7bc8] focus:outline-none focus:ring-2 focus:ring-[#4792E6] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#4792E6]"
        >
          <Play size={18} />
          <span>执行计划</span>
        </button>
      </div>
    </div>
  );
};

export default PlanningCard;