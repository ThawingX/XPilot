// 计划管理相关的API接口定义
// 这个文件定义了与后端交互的API接口

export interface CreatePlanRequest {
  planType: string;
  query: string;
  userId?: string;
}

export interface CreatePlanResponse {
  id: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  message: string;
}

export interface ExecutePlanRequest {
  planId: string;
}

export interface ExecutePlanResponse {
  status: 'executing' | 'completed' | 'failed';
  message: string;
  progress?: number;
}

export interface PlanStatusResponse {
  id: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  progress: number;
  steps: Array<{
    id: string;
    title: string;
    status: 'pending' | 'executing' | 'completed' | 'failed';
    progress?: number;
  }>;
  result?: any;
  error?: string;
}

// API基础URL配置
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

// 创建计划
export const createPlan = async (request: CreatePlanRequest): Promise<CreatePlanResponse> => {
  const response = await fetch(`${API_BASE_URL}/plans`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`创建计划失败: ${response.statusText}`);
  }

  return response.json();
};

// 执行计划
export const executePlan = async (request: ExecutePlanRequest): Promise<ExecutePlanResponse> => {
  const response = await fetch(`${API_BASE_URL}/plans/${request.planId}/execute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`执行计划失败: ${response.statusText}`);
  }

  return response.json();
};

// 获取计划状态
export const getPlanStatus = async (planId: string): Promise<PlanStatusResponse> => {
  const response = await fetch(`${API_BASE_URL}/plans/${planId}/status`);

  if (!response.ok) {
    throw new Error(`获取计划状态失败: ${response.statusText}`);
  }

  return response.json();
};

// 暂停计划
export const pausePlan = async (planId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/plans/${planId}/pause`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`暂停计划失败: ${response.statusText}`);
  }
};

// 恢复计划
export const resumePlan = async (planId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/plans/${planId}/resume`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`恢复计划失败: ${response.statusText}`);
  }
};

// 删除计划
export const deletePlan = async (planId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/plans/${planId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`删除计划失败: ${response.statusText}`);
  }
};

// 获取计划列表
export const getPlans = async (): Promise<PlanStatusResponse[]> => {
  const response = await fetch(`${API_BASE_URL}/plans`);

  if (!response.ok) {
    throw new Error(`获取计划列表失败: ${response.statusText}`);
  }

  return response.json();
};