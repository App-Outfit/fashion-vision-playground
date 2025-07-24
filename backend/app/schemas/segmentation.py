from pydantic import BaseModel
from typing import List, Dict, Optional

class SegmentationResponse(BaseModel):
    detected_labels_atr: List[str]
    detected_labels_lip: List[str]
    mask_color_atr_base64: Optional[str]
    mask_color_lip_base64: Optional[str]
    color_map_atr: Optional[Dict[str, str]]
    color_map_lip: Optional[Dict[str, str]]
