from fastapi import APIRouter, UploadFile, File, Depends
from app.models.object_detection import FashionObjectDetector
from app.schemas.object_detection import ObjectDetectionResponse, DetectedObject
from PIL import Image
import io
from app.utils.credits import check_and_decrement_credit

router = APIRouter()

@router.post("/", response_model=ObjectDetectionResponse)
async def detect_fashion_objects(
    image: UploadFile = File(...),
    user_id: str = Depends(check_and_decrement_credit)
):
    contents = await image.read()
    pil_image = Image.open(io.BytesIO(contents)).convert("RGB")
    detected = FashionObjectDetector.get_instance().detect(pil_image)
    return ObjectDetectionResponse(
        detected_objects=[DetectedObject(**obj) for obj in detected]
    ) 