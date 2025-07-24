from pydantic import BaseModel
from typing import List, Optional

class SearchResult(BaseModel):
    label: str
    image_path: str
    score: float

class SearchResponse(BaseModel):
    results: List[SearchResult]
