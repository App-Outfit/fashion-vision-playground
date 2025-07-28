from fastapi import APIRouter, UploadFile, File, Depends
from app.models.schp import SCHPSingleton
from app.schemas.segmentation import SegmentationResponse
from app.utils.credits import check_and_decrement_credit

router = APIRouter()

@router.post("/", response_model=SegmentationResponse)
async def segment_image(
    image: UploadFile = File(...),
    user_id: str = Depends(check_and_decrement_credit)
):
    # TODO: Implement logic in SCHPSingleton
    result = SCHPSingleton.get_instance().segment(image)
    return result
