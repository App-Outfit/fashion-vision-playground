from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from app.api import cross_modal, multi_label, segmentation, object_detection
    
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

app.include_router(cross_modal.router, prefix="/api/v1/search", tags=["Cross-modal Search"])
app.include_router(multi_label.router, prefix="/api/v1/classify", tags=["Multi-label Classification"])
app.include_router(segmentation.router, prefix="/api/v1/segment", tags=["Segmentation"])
app.include_router(object_detection.router, prefix="/api/v1/detect", tags=["Object Detection"])
