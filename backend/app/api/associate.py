from fastapi import APIRouter, HTTPException
from app.models.schemas import AssociateRequest, AssociateResponse, AssociateSuggestion
from app.services.llm import call_llm, extract_json

router = APIRouter()

ASSOCIATE_SYSTEM = """你是一个认知联想专家，能够基于一个核心概念生成有价值的认知联想。

严格按照以下JSON格式返回，不要包含任何其他内容：
{
  "suggestions": [
    {"label": "联想概念", "relation": "关系描述", "type": "analogy"},
    {"label": "联想概念", "relation": "关系描述", "type": "application"},
    {"label": "联想概念", "relation": "关系描述", "type": "related"}
  ]
}

type枚举值：
- analogy: 类比/隐喻联想
- application: 应用场景
- related: 跨领域关联

要求：
- 生成恰好6个联想（每种type各2个）
- 联想要有创意，跨越不同领域
- 关系描述简洁（2-6个字）
- 返回纯JSON"""


@router.post("/associate", response_model=AssociateResponse)
async def associate_node(req: AssociateRequest):
    context = ""
    if req.context_nodes:
        labels = [n.get("label", "") for n in req.context_nodes[:5]]
        context = f"\n相关概念上下文：{', '.join(labels)}"

    prompt = (
        f"核心概念：{req.node_label}{context}\n\n"
        f"请基于这个概念生成6个认知联想。"
    )

    try:
        raw = await call_llm(prompt, ASSOCIATE_SYSTEM)
        data = extract_json(raw)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Association failed: {str(e)}")

    suggestions = [
        AssociateSuggestion(
            label=s.get("label", ""),
            relation=s.get("relation", "相关"),
            type=s.get("type", "related"),
        )
        for s in data.get("suggestions", [])
        if s.get("label")
    ]

    return AssociateResponse(suggestions=suggestions)
