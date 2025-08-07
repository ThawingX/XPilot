import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// 定义执行计划状态结构，类似CopilotKit的AgentState
export interface ExecutionPlanState {
  planId: string;
  status: 'idle' | 'planning' | 'executing' | 'completed' | 'failed' | 'paused';
  currentStep?: string;
  progress: number;
  totalSteps: number;
  completedSteps: number;
  realTimeUpdates: StepUpdate[];
  error?: string;
  startTime?: Date;
  endTime?: Date;
}

export interface StepUpdate {
  stepId: string;
  stepName: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  progress: number;
  message?: string;
  timestamp: Date;
  duration?: number;
}

interface ExecutionPlanStateContextType {
  state: ExecutionPlanState | null;
  updateState: (updates: Partial<ExecutionPlanState>) => void;
  startExecution: (planId: string, steps: string[]) => Promise<void>;
  pauseExecution: () => void;
  resumeExecution: () => void;
  resetExecution: () => void;
  emitStepUpdate: (stepUpdate: StepUpdate) => void;
}

const ExecutionPlanStateContext = createContext<ExecutionPlanStateContextType | undefined>(undefined);

export const ExecutionPlanStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ExecutionPlanState | null>(null);

  const updateState = useCallback((updates: Partial<ExecutionPlanState>) => {
    setState(prevState => prevState ? { ...prevState, ...updates } : null);
  }, []);

  const emitStepUpdate = useCallback((stepUpdate: StepUpdate) => {
    setState(prevState => {
      if (!prevState) return null;
      
      const updatedSteps = [...prevState.realTimeUpdates];
      const existingIndex = updatedSteps.findIndex(step => step.stepId === stepUpdate.stepId);
      
      if (existingIndex >= 0) {
        updatedSteps[existingIndex] = stepUpdate;
      } else {
        updatedSteps.push(stepUpdate);
      }

      const completedSteps = updatedSteps.filter(step => step.status === 'completed').length;
      const progress = prevState.totalSteps > 0 ? (completedSteps / prevState.totalSteps) * 100 : 0;

      return {
        ...prevState,
        realTimeUpdates: updatedSteps,
        completedSteps,
        progress,
        currentStep: stepUpdate.stepName
      };
    });
  }, []);

  // 模拟执行过程，类似CopilotKit示例中的异步状态更新
  const simulateExecution = useCallback(async (steps: string[]) => {
    if (!state) return;

    // 初始化所有步骤为pending状态
    const initialSteps: StepUpdate[] = steps.map((stepName, index) => ({
      stepId: `step-${index}`,
      stepName,
      status: 'pending' as const,
      progress: 0,
      timestamp: new Date()
    }));

    setState(prevState => prevState ? {
      ...prevState,
      status: 'executing',
      realTimeUpdates: initialSteps,
      startTime: new Date()
    } : null);

    // 模拟每个步骤的执行过程
    for (let i = 0; i < steps.length; i++) {
      const stepId = `step-${i}`;
      const stepName = steps[i];

      // 开始执行步骤
      emitStepUpdate({
        stepId,
        stepName,
        status: 'executing',
        progress: 0,
        message: `正在执行: ${stepName}`,
        timestamp: new Date()
      });

      // 模拟步骤执行进度
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        emitStepUpdate({
          stepId,
          stepName,
          status: 'executing',
          progress,
          message: progress === 100 ? `完成: ${stepName}` : `正在执行: ${stepName} (${progress}%)`,
          timestamp: new Date()
        });
      }

      // 完成步骤
      emitStepUpdate({
        stepId,
        stepName,
        status: 'completed',
        progress: 100,
        message: `✅ ${stepName} 已完成`,
        timestamp: new Date(),
        duration: 1500 // 模拟执行时长
      });
    }

    // 完成整个执行计划
    setState(prevState => prevState ? {
      ...prevState,
      status: 'completed',
      progress: 100,
      endTime: new Date()
    } : null);
  }, [state, emitStepUpdate]);

  const startExecution = useCallback(async (planId: string, steps: string[]) => {
    const newState: ExecutionPlanState = {
      planId,
      status: 'planning',
      progress: 0,
      totalSteps: steps.length,
      completedSteps: 0,
      realTimeUpdates: [],
      startTime: new Date()
    };

    setState(newState);

    // 短暂延迟后开始执行
    setTimeout(() => {
      simulateExecution(steps);
    }, 1000);
  }, [simulateExecution]);

  const pauseExecution = useCallback(() => {
    updateState({ status: 'paused' });
  }, [updateState]);

  const resumeExecution = useCallback(() => {
    updateState({ status: 'executing' });
  }, [updateState]);

  const resetExecution = useCallback(() => {
    setState(null);
  }, []);

  const contextValue: ExecutionPlanStateContextType = {
    state,
    updateState,
    startExecution,
    pauseExecution,
    resumeExecution,
    resetExecution,
    emitStepUpdate
  };

  return (
    <ExecutionPlanStateContext.Provider value={contextValue}>
      {children}
    </ExecutionPlanStateContext.Provider>
  );
};

// 自定义Hook，类似CopilotKit的useCoAgent
export const useExecutionPlanState = () => {
  const context = useContext(ExecutionPlanStateContext);
  if (context === undefined) {
    throw new Error('useExecutionPlanState must be used within an ExecutionPlanStateProvider');
  }
  return context;
};

// 状态渲染Hook，类似CopilotKit的useCoAgentStateRender
export const useExecutionPlanStateRender = (
  render: (state: ExecutionPlanState) => React.ReactNode
) => {
  const { state } = useExecutionPlanState();
  
  if (!state) return null;
  
  return render(state);
};