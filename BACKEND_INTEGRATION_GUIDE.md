# 后端集成指南 - @reply工具计划制定功能

## 概述

本指南说明如何在后端实现@reply工具的计划制定功能。当用户选择@reply工具并发送消息时，后端应该检测到这个标识符并返回相应的执行计划。

## 前端现状

前端已经完成以下功能：
1. ✅ 能力选择器包含@reply选项
2. ✅ 消息发送时会添加@reply标识符到消息前面
3. ✅ 流式响应处理中有execution_plan检测逻辑
4. ✅ ExecutionPlanCard组件用于显示和执行计划

## 后端需要实现的功能

### 1. 消息解析和检测

后端需要检测传入消息是否包含@reply标识符：

```python
def detect_capability(message_content: str) -> str | None:
    """检测消息中的能力标识符"""
    if message_content.startswith('@reply'):
        return 'reply'
    elif message_content.startswith('@post'):
        return 'post'
    elif message_content.startswith('@thread'):
        return 'thread'
    elif message_content.startswith('@strategy'):
        return 'strategy'
    return None
```

### 2. 执行计划生成

当检测到@reply时，生成相应的执行计划：

```python
def generate_reply_plan(user_message: str) -> dict:
    """为@reply工具生成执行计划"""
    plan_id = f"reply-plan-{int(time.time())}"
    
    return {
        "id": plan_id,
        "title": "自动回复执行计划",
        "description": "基于您的需求制定的智能回复策略",
        "steps": [
            {
                "id": "step-1",
                "title": "内容分析",
                "description": "分析目标社交媒体内容的语调、主题和情感",
                "type": "analysis",
                "parameters": {
                    "target_content": user_message.replace('@reply', '').strip(),
                    "analysis_depth": "deep"
                },
                "status": "pending",
                "estimatedDuration": "30秒"
            },
            {
                "id": "step-2", 
                "title": "回复策略制定",
                "description": "根据分析结果制定合适的回复策略",
                "type": "strategy",
                "parameters": {
                    "tone": "professional",
                    "engagement_level": "high"
                },
                "status": "pending",
                "estimatedDuration": "45秒"
            },
            {
                "id": "step-3",
                "title": "生成回复内容", 
                "description": "基于策略生成具体的回复文本",
                "type": "reply",
                "parameters": {
                    "max_length": 280,
                    "include_hashtags": True
                },
                "status": "pending",
                "estimatedDuration": "60秒"
            },
            {
                "id": "step-4",
                "title": "发布回复",
                "description": "将生成的回复发布到指定的社交媒体平台",
                "type": "engagement", 
                "parameters": {
                    "platform": "twitter",
                    "auto_publish": False
                },
                "status": "pending",
                "estimatedDuration": "15秒"
            }
        ],
        "status": "pending",
        "createdAt": datetime.now().isoformat(),
        "estimatedTotalDuration": "2分30秒"
    }
```

### 3. 流式响应格式

后端应该按以下顺序返回流式响应：

#### 第一步：返回正常的聊天响应
```json
data: {"type":"RAW","event":{"event":"on_chat_model_stream","data":{"chunk":{"content":"我将为您制定一个自动回复计划，请稍等..."}}}}
```

#### 第二步：返回执行计划
```json
data: {"type":"execution_plan","plan":{"id":"reply-plan-xxx","title":"自动回复执行计划","steps":[...]}}
```

### 4. 完整的响应流程

```python
async def handle_agent_request(request_data: dict):
    """处理代理请求"""
    messages = request_data.get('messages', [])
    latest_message = messages[-1]['content'] if messages else ""
    
    # 检测能力标识符
    capability = detect_capability(latest_message)
    
    # 先返回正常的聊天响应
    yield create_chat_response("我将为您制定一个执行计划，请稍等...")
    
    # 如果检测到@reply，生成并返回执行计划
    if capability == 'reply':
        plan = generate_reply_plan(latest_message)
        yield create_execution_plan_response(plan)
    
    # 继续正常的聊天流程...
    yield create_chat_response("计划已生成，您可以点击执行按钮开始执行。")

def create_chat_response(content: str) -> str:
    """创建聊天响应"""
    return f'data: {{"type":"RAW","event":{{"event":"on_chat_model_stream","data":{{"chunk":{{"content":"{content}"}}}}}}}}\n\n'

def create_execution_plan_response(plan: dict) -> str:
    """创建执行计划响应"""
    return f'data: {{"type":"execution_plan","plan":{json.dumps(plan)}}}\n\n'
```

### 5. 执行计划API端点

还需要实现执行计划的相关API：

```python
@app.post("/api/execute-plan")
async def execute_plan(request: ExecutePlanRequest):
    """执行计划API"""
    plan_id = request.plan_id
    
    # 获取计划详情
    plan = get_plan_by_id(plan_id)
    
    # 执行计划步骤
    for step in plan['steps']:
        # 更新步骤状态为执行中
        yield f'data: {{"type":"step_update","planId":"{plan_id}","stepId":"{step["id"]}","status":"executing"}}\n\n'
        
        # 执行具体步骤
        result = await execute_step(step)
        
        # 更新步骤状态为完成
        yield f'data: {{"type":"step_update","planId":"{plan_id}","stepId":"{step["id"]}","status":"completed","result":{json.dumps(result)}}}\n\n'
    
    # 计划执行完成
    yield f'data: {{"type":"plan_completed","planId":"{plan_id}"}}\n\n'

@app.put("/api/plan/{plan_id}")
async def update_plan(plan_id: str, request: UpdatePlanRequest):
    """更新计划API"""
    # 更新计划逻辑
    pass
```

## 测试验证

### 1. 前端测试步骤
1. 点击@按钮或输入@符号
2. 选择@reply选项
3. 输入测试消息并发送
4. 验证是否显示执行计划卡片

### 2. 后端测试要点
1. 确认能正确检测@reply标识符
2. 验证返回的execution_plan格式正确
3. 测试执行计划API的流式响应
4. 确认步骤状态更新正常

## 注意事项

1. **响应顺序**：必须先返回聊天响应，再返回执行计划
2. **数据格式**：严格按照前端期望的JSON格式返回
3. **错误处理**：添加适当的错误处理和日志记录
4. **性能优化**：考虑计划生成的性能，避免阻塞
5. **安全性**：验证用户权限和输入内容

## 扩展功能

未来可以考虑为其他工具（@post、@thread、@strategy）也实现类似的计划制定功能。