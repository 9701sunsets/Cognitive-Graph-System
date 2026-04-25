from fastapi import APIRouter, HTTPException
from app.models.schemas import SaveGraphRequest, Graph
from app.services import storage

router = APIRouter()


@router.post("/graph/save")
async def save_graph(req: SaveGraphRequest):
    graph = Graph(nodes=req.nodes, edges=req.edges)
    ok = storage.save_graph(req.name or "default", graph)
    if not ok:
        raise HTTPException(status_code=500, detail="Failed to save graph")
    return {"status": "saved", "name": req.name}


@router.get("/graph/load")
async def load_graph(name: str = "default"):
    graph = storage.load_graph(name)
    return graph


@router.get("/graph/list")
async def list_graphs():
    return {"graphs": storage.list_graphs()}
