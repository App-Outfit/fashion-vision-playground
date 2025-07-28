from pydantic import BaseModel
from typing import List

class DetectedObject(BaseModel):
    label: str
    score: float
    box: List[float]  # [x1, y1, x2, y2]

class ObjectDetectionResponse(BaseModel):
    detected_objects: List[DetectedObject] 