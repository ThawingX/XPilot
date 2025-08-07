# 计划管理功能实现说明

## 功能概述

计划管理功能分为两个主要模式：
1. **制定计划模式** - 用户创建和制定新的执行计划
2. **执行计划模式** - 查看、执行和管理已制定的计划

## 已实现的组件

### 1. PlanManager 主组件
- 位置：`src/components/PlanManager.tsx`
- 功能：整合制定和执行两种模式的核心组件
- 特性：
  - 模式切换（制定计划 ↔ 执行计划）
  - 计划生命周期管理
  - 状态同步和更新

### 2. PlanCreator 组件
- 位置：`src/components/PlanCreator.tsx`
- 功能：计划创建界面
- 支持的计划类型：
  - 研究网站 (research_website)
  - 分析结果 (analyze_results)
  - 生成报告 (generate_report)
  - 竞品分析 (competitor_analysis)
  - 市场调研 (market_research)
  - 用户反馈分析 (user_feedback)

### 3. ExecutionPlanCard 组件
- 位置：`src/components/ExecutionPlanCard.tsx`
- 功能：计划展示和操作界面
- 支持两种模式显示：
  - 制定模式：显示制定进度和状态
  - 执行模式：显示执行进度和控制按钮

## 后端集成接口

### 创建计划接口
```typescript
// 发送到后端的数据结构
{
  planType: string,        // 计划类型
  query: string,          // 用户查询内容
  userId?: string,        // 用户ID
  timestamp: string       // 创建时间戳
}

// API端点：POST /api/plans
```

### 执行计划接口
```typescript
// API端点：POST /api/plans/{planId}/execute
// 返回执行状态和进度信息
```

### 其他管理接口
- 暂停计划：`POST /api/plans/{planId}/pause`
- 恢复计划：`POST /api/plans/{planId}/resume`
- 删除计划：`DELETE /api/plans/{planId}`
- 编辑计划：`PATCH /api/plans/{planId}`
- 获取状态：`GET /api/plans/{planId}/status`

## 状态管理

### 计划状态类型
- `pending` - 待处理
- `executing` - 执行中
- `completed` - 已完成
- `failed` - 执行失败

### 步骤状态类型
- `pending` - 待执行
- `executing` - 执行中
- `completed` - 已完成
- `failed` - 执行失败

## 实时状态更新

建议使用以下方式获取实时状态更新：

### 1. WebSocket 连接（推荐）
```javascript
const ws = new WebSocket(`ws://api/plans/${planId}/status`);
ws.onmessage = (event) => {
  const statusUpdate = JSON.parse(event.data);
  // 更新UI状态
};
```

### 2. 轮询方式
```javascript
const pollStatus = async (planId) => {
  const response = await fetch(`/api/plans/${planId}/status`);
  const status = await response.json();
  // 更新UI状态
};

setInterval(() => pollStatus(planId), 2000); // 每2秒轮询一次
```

## 导航集成

已将计划管理功能集成到应用主导航：
- 侧边栏菜单项：`Plan Manager`
- 图标：Brain (大脑图标)
- 路由处理：在 `App.tsx` 中完成

## 文件结构

```
src/
├── components/
│   ├── PlanManager.tsx          # 主管理组件
│   ├── PlanCreator.tsx          # 计划创建组件
│   └── ExecutionPlanCard.tsx    # 计划卡片组件
├── api/
│   └── planApi.ts               # API接口定义
├── types/
│   └── ExecutionPlan.ts         # 类型定义
└── data/
    └── mockData.ts              # 模拟数据（已更新菜单项）
```

## 使用方式

1. 用户点击侧边栏的"Plan Manager"进入计划管理页面
2. 默认进入"制定计划"模式，用户可以：
   - 选择计划类型
   - 输入查询内容
   - 点击"开始研究"创建计划
3. 计划创建后自动切换到"执行计划"模式
4. 在执行模式下，用户可以：
   - 查看计划详情和步骤
   - 执行、暂停、恢复计划
   - 编辑或删除计划

## 注意事项

1. 当前实现使用模拟数据，实际部署时需要：
   - 取消注释API调用代码
   - 配置正确的API端点
   - 实现WebSocket或轮询机制

2. 错误处理：
   - 所有API调用都包含错误处理
   - 失败状态会正确显示在UI中

3. 用户体验：
   - 加载状态指示器
   - 实时进度更新
   - 响应式设计支持

## 后续扩展建议

1. 添加计划模板功能
2. 支持计划分享和协作
3. 添加计划执行历史记录
4. 实现计划结果导出功能
5. 添加计划执行统计和分析