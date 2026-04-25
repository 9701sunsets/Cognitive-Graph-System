from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import parse, associate, graph

app = FastAPI(title="Cognitive Graph API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(parse.router, prefix="/api")
app.include_router(associate.router, prefix="/api")
app.include_router(graph.router, prefix="/api")

@app.get("/")
def root():
    return {"status": "Cognitive Graph API running"}
