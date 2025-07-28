import warnings
warnings.filterwarnings("ignore", message=".*meta parameter.*")
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import torch

DEVICE = 'cuda' if torch.cuda.is_available() else 'cpu'
print(f"[MAIN] Using device: {DEVICE}")

from app.api import cross_modal, multi_label, segmentation, object_detection
from app.models.fashion_clip import FashionClipSingleton
from app.models.schp import SCHPSingleton
from app.models.object_detection import FashionObjectDetector

# Pré-instanciation des singletons avec le bon device
fashion_clip_singleton = FashionClipSingleton.get_instance(DEVICE)
schp_singleton = SCHPSingleton.get_instance(DEVICE)
object_detection_singleton = FashionObjectDetector.get_instance(DEVICE)

app = FastAPI(title="Fashion Vision API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev, restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files (images, etc.)
static_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "data"))
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Patch les routers pour utiliser les singletons déjà instanciés
from fastapi import Depends, UploadFile, File, Form
from app.schemas.cross_modal import SearchResponse
from app.schemas.multi_label import MultiLabelResponse
from app.schemas.segmentation import SegmentationResponse
from app.schemas.object_detection import ObjectDetectionResponse, DetectedObject
from app.utils.credits import check_and_decrement_credit

@cross_modal.router.post("/", response_model=SearchResponse)
async def cross_modal_search(
    image: UploadFile = File(None),
    text: str = Form(None),
    alpha: float = Form(0.5),
    top_k: int = Form(6),
    user_id: str = Depends(check_and_decrement_credit)
):
    results = fashion_clip_singleton.search(image, text, alpha, top_k)
    return {"results": results}

@multi_label.router.post("/", response_model=MultiLabelResponse)
async def multi_label_classification(
    image: UploadFile = File(...),
    labels: str = Form(...),
    user_id: str = Depends(check_and_decrement_credit)
):
    label_list = [l.strip() for l in labels.split(",") if l.strip()]
    results = fashion_clip_singleton.multi_label(image, label_list)
    return {"results": results}

@segmentation.router.post("/", response_model=SegmentationResponse)
async def segment_image(
    image: UploadFile = File(...),
    user_id: str = Depends(check_and_decrement_credit)
):
    result = schp_singleton.segment(image)
    return result

@object_detection.router.post("/", response_model=ObjectDetectionResponse)
async def detect_fashion_objects(
    image: UploadFile = File(...),
    user_id: str = Depends(check_and_decrement_credit)
):
    import io
    from PIL import Image
    contents = await image.read()
    pil_image = Image.open(io.BytesIO(contents)).convert("RGB")
    detected = object_detection_singleton.detect(pil_image)
    return ObjectDetectionResponse(
        detected_objects=[DetectedObject(**obj) for obj in detected]
    )

app.include_router(cross_modal.router, prefix="/api/v1/search", tags=["Cross-modal Search"])
app.include_router(multi_label.router, prefix="/api/v1/classify", tags=["Multi-label Classification"])
app.include_router(segmentation.router, prefix="/api/v1/segment", tags=["Segmentation"])
app.include_router(object_detection.router, prefix="/api/v1/detect", tags=["Object Detection"])
