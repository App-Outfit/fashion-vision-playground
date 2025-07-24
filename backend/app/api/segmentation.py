from fastapi import APIRouter, UploadFile, File
from app.models.schp import SCHPSingleton
from app.schemas.segmentation import SegmentationResponse

router = APIRouter()

@router.post("/", response_model=SegmentationResponse)
async def segment_image(
    image: UploadFile = File(...)
):
    # TODO: Implement logic in SCHPSingleton
    result = SCHPSingleton.get_instance().segment(image)
    return result
