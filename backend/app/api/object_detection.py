from fastapi import APIRouter, UploadFile, File
from app.models.object_detection import FashionObjectDetector
from app.schemas.object_detection import ObjectDetectionResponse, DetectedObject
from PIL import Image
import io

router = APIRouter()

@router.post("/", response_model=ObjectDetectionResponse)
async def detect_fashion_objects(image: UploadFile = File(...)):
    contents = await image.read()
    pil_image = Image.open(io.BytesIO(contents)).convert("RGB")
    detected = FashionObjectDetector.get_instance().detect(pil_image)
    return ObjectDetectionResponse(
        detected_objects=[DetectedObject(**obj) for obj in detected]
    ) 