# 🧠 Cognitive Graph — AI 认知图谱系统

> 模拟人脑语义记忆结构的交互式知识图谱，支持AI自动解析、可视化编辑与认知联想生成。

---

##  功能特性

| 功能 | 描述 |
|------|------|
|  文本解析 | 输入任意文本，AI自动提取概念节点和关系 |
|  图谱可视化 | 交互式节点图，支持拖拽、缩放、连线 |
|  手动编辑 | 双击编辑节点，手动新增/删除节点和关系 |
|  认知联想 | 点击节点，AI生成跨领域联想并可一键添加 |
|  本地存储 | 图谱数据保存到本地JSON文件 |

---

##  快速启动

### 方式一：手动启动

#### 1. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env，填入你的API Key
```

#### 2. 启动后端

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # 配置 API Key

# 启动
uvicorn app.main:app --reload --port 8000
```

后端运行在 `http://localhost:8000`
API 文档：`http://localhost:8000/docs`

#### 3. 启动前端

```bash
cd frontend
npm install
npm run dev
```

前端运行在 `http://localhost:3000`

---

### 方式二：Docker Compose

```bash
cp .env.example .env
# 填入 API Key

docker-compose up --build
```

访问 `http://localhost:3000`


---

##  API 文档

### POST `/api/parse`
文本解析为知识图谱

```json
// 请求
{ "text": "神经网络通过反向传播算法训练..." }

// 响应
{
  "nodes": [{"id": "abc1", "label": "神经网络", "description": "...", "type": "concept"}],
  "edges": [{"id": "e1", "source": "abc1", "target": "abc2", "relation": "使用"}]
}
```

### POST `/api/associate`
节点认知联想生成

```json
// 请求
{ "node_id": "abc1", "node_label": "神经网络", "context_nodes": [] }

// 响应
{
  "suggestions": [
    {"label": "人脑神经系统", "relation": "类比于", "type": "analogy"},
    {"label": "图像识别", "relation": "应用于", "type": "application"}
  ]
}
```

### POST `/api/graph/save`
保存图谱到本地

### GET `/api/graph/load?name=default`
加载已保存图谱

---

## UI 交互说明

| 操作 | 效果 |
|------|------|
| 点击节点 | 选中节点，右侧面板显示详情 |
| 拖拽节点 | 移动节点位置 |
| 拖拽节点句柄 | 创建新关系连线 |
| `Delete` 键 | 删除选中节点/边 |
| 右侧 ✎ 按钮 | 编辑节点名称和描述 |
| 右侧 ✦ 按钮 | 生成认知联想 |
| 联想卡片点击 | 将联想节点添加到图谱 |

---

## 配置说明

### LLM Provider 切换

在 `.env` 中设置：

```env
# 使用 Anthropic Claude（默认）
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...

# 使用 OpenAI GPT-4o
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...
```

---

## 🔮 后续扩展计划

- [ ] Neo4j 图数据库集成
- [ ] FAISS 向量检索（语义相似节点）
- [ ] 多人协同编辑（WebSocket）
- [ ] 记忆衰减机制
- [ ] 多 Agent 系统接入
- [ ] 知识自动演化

---

*Built with ❤️ ~ — AI Cognitive Graph System*
