from pydantic import BaseModel
from typing import List

class MultiLabelResult(BaseModel):
    label: str
    score: float

class MultiLabelResponse(BaseModel):
    results: List[MultiLabelResult]
