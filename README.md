# Fashion Vision Playground

A modern web interface to demo advanced Computer Vision APIs for the fashion industry.

## Context

This project is designed for Shopify-like platforms and fashion brands to easily test and experience powerful AI APIs for catalog enrichment, smart search, recommendation, and visual analysis.

## Features

- **Cross-modal Search API**: Find similar products using an image, text, or both. Supports smart balancing between visual and textual queries.
- **Precise Image Segmentation API**: Both ATR and LIP segmentation masks, with color-coded results and detected parts.
- **Custom Multi-label Classification API**: Tag images with your own list of categories, styles, or colors.
- **Real-world Use Cases**: E-commerce search, catalog enrichment, virtual try-on, and more.
- **Ready-to-use Code Examples**: Copy-paste integration snippets for each API.
- **Modern, minimal UI**: Responsive, clean, and business-oriented.

## Project Structure

### Frontend (`src/`)
- `components/` : All UI and demo components (cross-modal, segmentation, classification)
- `pages/` : Main page, Auth, NotFound
- `integrations/supabase/` : Supabase integration
- `assets/` : Images, visuals

### Backend (`backend/app/`)
- `main.py` : FastAPI entrypoint
- `api/` : API endpoints (cross_modal, multi_label, segmentation)
- `models/` : Model wrappers/loaders (FashionCLIP, SCHP)
- `schemas/` : Pydantic schemas
- `data/` : Embeddings, indexes, checkpoints, datasets (see below)
- `utils/` : Utility functions

## Large Files & .gitignore

**Do NOT push the following to git:**
- `backend/app/data/checkpoints/` (model weights, >500MB)
- `backend/app/data/dataset_wearit/` (datasets, can be several GB)
- `backend/app/data/embeddings.npy`, `faiss_index.index`, `metadonnees.json` (large data files)
- `backend/app/data/SCHP/__pycache__/`, `networks/__pycache__/`, `utils/__pycache__/` (Python cache)

**Add these to your `.gitignore` if not already present.**

## Getting Started

**Requirements:** Node.js >= 18, npm, Python >= 3.8, pip

```bash
git clone <repo_url>
cd fashion-vision-playground
npm install
npm run dev
# For backend
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

## Authentication

- Access requires authentication (Supabase-based).
- Users are redirected to `/auth` if not logged in.

## Available APIs

### 1. Cross-modal Search (`POST /api/v1/search`)
- Find similar images from a dataset using an image, text, or both.
- Adjustable image/text balance.
- Use cases: smart e-commerce search, visual recommendations, product variants.

### 2. Image Segmentation (`POST /api/v1/segment`)
- Returns both ATR and LIP segmentation masks (color PNG, base64).
- Detected parts for each mask, with color legend.
- Use cases: virtual try-on, background removal, product extraction.

### 3. Multi-label Classification (`POST /api/v1/classify`)
- Classify an image with a custom list of labels (categories, styles, colors).
- Use cases: catalog enrichment, style analysis, filter-based search.

## Code Examples

Ready-to-use JavaScript fetch examples are available in the interface for each API.

## Use Cases

- **E-commerce**: Visual search, recommendations, virtual try-on.
- **Catalog Management**: Automated tagging, metadata enrichment, duplicate detection.
- **AR/VR Try-on**: Morphology segmentation, clothing adaptation, realistic rendering.

## Design

- Minimal, modern SaaS-inspired UI (Tailwind CSS, shadcn/ui).
- Responsive and accessible.

## Contributing

Pull requests are welcome. Please document your changes clearly.
