// 执行计划相关的类型定义

export interface PlanStep {
  id: string;
  title: string;
  description: string;
  type: 'post' | 'thread' | 'reply' | 'strategy' | 'analysis' | 'engagement' | 'file_creation' | 'code_implementation' | 'styling' | 'testing';
  parameters: Record<string, any>;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: any;
  estimatedDuration?: string;
  actualDuration?: string;
  error?: string;
}

export interface ExecutionPlan {
  id: string;
  title: string;
  description: string;
  steps: PlanStep[];
  status: 'pending' | 'editing' | 'executing' | 'completed' | 'failed' | 'paused';
  createdAt: string;
  updatedAt?: string;
  estimatedDuration?: string;
  actualDuration?: string;
  progress?: number; // 0-100
}

export interface ExecutionPlanResponse {
  type: 'execution_plan';
  plan: ExecutionPlan;
  message?: string;
}

export interface PlanExecutionRequest {
  planId: string;
  threadId: string;
}

export interface PlanUpdateRequest {
  planId: string;
  plan: Partial<ExecutionPlan>;
}

export interface StepExecutionUpdate {
  planId: string;
  stepId: string;
  status: PlanStep['status'];
  result?: any;
  error?: string;
  progress?: number;
}