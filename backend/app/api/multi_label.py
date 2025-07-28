from fastapi import APIRouter, UploadFile, File, Form, Depends
from typing import List
from app.models.fashion_clip import FashionClipSingleton
from app.schemas.multi_label import MultiLabelResponse
from app.utils.credits import check_and_decrement_credit

router = APIRouter()

@router.post("/", response_model=MultiLabelResponse)
async def multi_label_classification(
    image: UploadFile = File(...),
    labels: str = Form(...),
    user_id: str = Depends(check_and_decrement_credit)
):
    # labels is a comma-separated string
    label_list = [l.strip() for l in labels.split(",") if l.strip()]
    # TODO: Implement logic in FashionClipSingleton
    results = FashionClipSingleton.get_instance().multi_label(image, label_list)
    return {"results": results}
