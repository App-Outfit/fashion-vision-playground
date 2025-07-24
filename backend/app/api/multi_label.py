from fastapi import APIRouter, UploadFile, File, Form
from typing import List
from app.models.fashion_clip import FashionClipSingleton
from app.schemas.multi_label import MultiLabelResponse

router = APIRouter()

@router.post("/", response_model=MultiLabelResponse)
async def multi_label_classification(
    image: UploadFile = File(...),
    labels: str = Form(...)
):
    # labels is a comma-separated string
    label_list = [l.strip() for l in labels.split(",") if l.strip()]
    # TODO: Implement logic in FashionClipSingleton
    results = FashionClipSingleton.get_instance().multi_label(image, label_list)
    return {"results": results}
