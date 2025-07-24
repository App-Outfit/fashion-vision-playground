# Fashion Vision API Backend

This backend provides scalable, production-ready REST APIs for cross-modal search, multi-label classification, and segmentation using FashionCLIP and SCHP models.

## Features
- Cross-modal image/text search (FashionCLIP + FAISS)
- Multi-label image classification (FashionCLIP zero-shot)
- Precise segmentation (SCHP)
- Modular, extensible FastAPI architecture

## Project Structure
```
backend/
  app/
    main.py                # FastAPI entrypoint
    api/                   # API endpoints
    models/                # Model wrappers/loaders
    utils/                 # Utility functions
    schemas/               # Pydantic schemas
    data/                  # Embeddings, indexes, checkpoints
  requirements.txt         # Python dependencies
  README.md                # This file
```

## Setup
1. Install dependencies:
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```
2. Place your model weights, embeddings, and indexes in `app/data/`.
3. Run the API:
   ```bash
   uvicorn app.main:app --reload
   ```
4. Access the docs at [http://localhost:8000/docs](http://localhost:8000/docs)

## Endpoints
- `POST /api/v1/search`      — Cross-modal search (image/text)
- `POST /api/v1/classify`    — Multi-label classification
- `POST /api/v1/segment`     — Image segmentation

## Notes
- All models and data are loaded once at startup for performance.
- Extend or add endpoints in `app/api/` as needed.
