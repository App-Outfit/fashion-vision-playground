from fastapi import APIRouter, UploadFile, File, Form
from app.models.fashion_clip import FashionClipSingleton
from app.schemas.cross_modal import SearchResponse

router = APIRouter()

@router.post("/", response_model=SearchResponse)
async def cross_modal_search(
    image: UploadFile = File(None),
    text: str = Form(None),
    alpha: float = Form(0.5),
    top_k: int = Form(6)
):
    # TODO: Implement logic in FashionClipSingleton
    results = FashionClipSingleton.get_instance().search(image, text, alpha, top_k)
    return {"results": results}
