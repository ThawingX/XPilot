import React from 'react';
import { CheckCircle, Clock, Play, AlertCircle, Calendar, Target, TrendingUp } from 'lucide-react';

interface ExecutionStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked' | 'skipped';
  startTime?: string;
  endTime?: string;
  duration?: string;
  errorMessage?: string;
}

interface ExecutionStatusCardProps {
  title: string;
  description?: string;
  steps: ExecutionStep[];
  overallStatus: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  startTime?: string;
  endTime?: string;
  progress?: number;
  className?: string;
}

const ExecutionStatusCard: React.FC<ExecutionStatusCardProps> = ({
  title,
  description,
  steps,
  overallStatus,
  startTime,
  endTime,
  progress = 0,
  className = ''
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'blocked': return 'bg-red-100 text-red-700 border-red-200';
      case 'skipped': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} className="text-green-600" />;
      case 'in-progress': return <Play size={16} className="text-blue-600" />;
      case 'blocked': return <AlertCircle size={16} className="text-red-600" />;
      case 'skipped': return <Target size={16} className="text-gray-500" />;
      default: return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getOverallStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Play size={14} />;
      case 'completed': return <CheckCircle size={14} />;
      case 'failed': return <AlertCircle size={14} />;
      case 'paused': return <Clock size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'running': return 'Running';
      case 'completed': return 'Completed';
      case 'failed': return 'Failed';
      case 'paused': return 'Paused';
      default: return 'Pending';
    }
  };

  const getStepStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'blocked': return 'Blocked';
      case 'skipped': return 'Skipped';
      default: return 'Pending';
    }
  };

  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const totalSteps = steps.length;

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center mb-2 space-x-2">
              <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
              <span className={`inline-flex items-center px-3 py-1 space-x-1 text-sm font-medium rounded-full border ${getStatusColor(overallStatus)}`}>
                {getOverallStatusIcon(overallStatus)}
                <span>{getStatusText(overallStatus)}</span>
              </span>
            </div>
            {description && (
              <p className="mb-4 text-sm text-gray-600">{description}</p>
            )}
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
                <span>Execution Progress</span>
                <span>{completedSteps}/{totalSteps} steps completed</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full">
                <div 
                  className="bg-[#4792E6] h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="mt-1 text-xs text-right text-gray-500">
                {Math.round(progress)}%
              </div>
            </div>

            {/* Timeline */}
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              {startTime && (
                <div className="flex items-center space-x-1">
                  <Calendar size={12} />
                  <span>Start time {startTime}</span>
                </div>
              )}
              {endTime && (
                <div className="flex items-center space-x-1">
                  <Target size={12} />
                  <span>End time {endTime}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Execution Steps */}
      <div className="p-6">
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="relative"
            >
              {/* Timeline Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-8 top-16 w-0.5 h-8 bg-gray-200"></div>
              )}
              
              <div className={`flex items-start space-x-4 p-4 rounded-lg border transition-all duration-200 ${
                step.status === 'completed' 
                  ? 'bg-green-50 border-green-200' 
                  : step.status === 'in-progress'
                  ? 'bg-blue-50 border-blue-200'
                  : step.status === 'blocked'
                  ? 'bg-red-50 border-red-200'
                  : step.status === 'skipped'
                  ? 'bg-gray-50 border-gray-200'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                {/* Step Number & Status Icon */}
                <div className="flex flex-col flex-shrink-0 items-center space-y-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step.status === 'completed' ? 'bg-green-600 text-white' :
                    step.status === 'in-progress' ? 'bg-blue-600 text-white' :
                    step.status === 'blocked' ? 'bg-red-600 text-white' :
                    step.status === 'skipped' ? 'bg-gray-500 text-white' :
                    'bg-gray-300 text-gray-600'
                  }`}>
                    {step.stepNumber}
                  </div>
                  {getStepStatusIcon(step.status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="mb-2 text-base font-medium text-gray-900">
                        {step.title}
                      </h4>
                      <p className="mb-3 text-sm text-gray-600">
                        {step.description}
                      </p>
                      
                      {/* Error Message */}
                      {step.errorMessage && step.status === 'blocked' && (
                        <div className="p-2 mb-3 bg-red-100 rounded-md border border-red-200">
                          <p className="text-xs text-red-700">{step.errorMessage}</p>
                        </div>
                      )}
                      
                      {/* Step Timeline */}
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        {step.startTime && (
                          <div className="flex items-center space-x-1">
                            <Calendar size={10} />
                            <span>Start {step.startTime}</span>
                          </div>
                        )}
                        {step.endTime && (
                          <div className="flex items-center space-x-1">
                            <Target size={10} />
                            <span>End {step.endTime}</span>
                          </div>
                        )}
                        {step.duration && (
                          <div className="flex items-center space-x-1">
                            <Clock size={10} />
                            <span>Duration {step.duration}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="flex items-center ml-3 space-x-2">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStepStatusColor(step.status)}`}>
                        {getStepStatusText(step.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {steps.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            <TrendingUp size={24} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No execution steps</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutionStatusCard;