import uuid
import json
from fastapi import APIRouter, HTTPException
from app.models.schemas import ParseRequest, ParseResponse, Node, Edge
from app.services.llm import call_llm, extract_json

router = APIRouter()

PARSE_SYSTEM = """你是一个知识图谱构建专家。用户输入一段文本，你需要从中提取核心概念（nodes）和它们之间的关系（edges）。

严格按照以下JSON格式返回，不要包含任何其他内容：
{
  "nodes": [
    {"label": "概念名称", "description": "简短描述（一句话）", "type": "concept"}
  ],
  "edges": [
    {"source_label": "概念A", "target_label": "概念B", "relation": "关系描述"}
  ]
}

要求：
- 提取5-15个核心概念
- 概念要具体、有意义，避免过于宽泛
- 关系描述要简洁（2-5个字）
- 确保所有边的source和target都在nodes中存在
- 返回纯JSON，不要markdown代码块"""


@router.post("/parse", response_model=ParseResponse)
async def parse_text(req: ParseRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    prompt = f"请分析以下文本，提取知识图谱：\n\n{req.text}"

    try:
        raw = await call_llm(prompt, PARSE_SYSTEM)
        data = extract_json(raw)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM parsing failed: {str(e)}")

    # Build label -> id map
    label_to_id: dict[str, str] = {}
    nodes: list[Node] = []

    for n in data.get("nodes", []):
        nid = str(uuid.uuid4())[:8]
        label_to_id[n["label"]] = nid
        nodes.append(
            Node(
                id=nid,
                label=n.get("label", "Unknown"),
                description=n.get("description", ""),
                type=n.get("type", "concept"),
            )
        )

    edges: list[Edge] = []
    for e in data.get("edges", []):
        src = label_to_id.get(e.get("source_label", ""))
        tgt = label_to_id.get(e.get("target_label", ""))
        if src and tgt:
            edges.append(
                Edge(
                    id=str(uuid.uuid4())[:8],
                    source=src,
                    target=tgt,
                    relation=e.get("relation", "相关"),
                    weight=0.5,
                )
            )

    return ParseResponse(nodes=nodes, edges=edges)
