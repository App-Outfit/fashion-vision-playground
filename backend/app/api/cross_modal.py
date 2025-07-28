from fastapi import APIRouter, UploadFile, File, Form, Depends
from app.models.fashion_clip import FashionClipSingleton
from app.schemas.cross_modal import SearchResponse
from app.utils.credits import check_and_decrement_credit

router = APIRouter()

@router.post("/", response_model=SearchResponse)
async def cross_modal_search(
    image: UploadFile = File(None),
    text: str = Form(None),
    alpha: float = Form(0.5),
    top_k: int = Form(6),
    user_id: str = Depends(check_and_decrement_credit)
):
    # TODO: Implement logic in FashionClipSingleton
    results = FashionClipSingleton.get_instance().search(image, text, alpha, top_k)
    return {"results": results}
