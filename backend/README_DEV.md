# Documentation API Backend – Fashion Vision

## Introduction

L’API backend est construite avec FastAPI et expose plusieurs endpoints pour la recherche cross-modale, la classification multi-label, la segmentation d’image et la détection d’objets. Toutes les routes principales sont préfixées par `/api/v1/`.

---

## Endpoints

### 1. Recherche Cross-Modale

- **URL** : `/api/v1/search/`
- **Méthode** : `POST`
- **Entrée** (multipart/form-data) :
  - `image` (UploadFile, optionnel) : Image à rechercher.
  - `text` (str, optionnel) : Texte à rechercher.
  - `alpha` (float, optionnel, défaut=0.5) : Pondération entre image et texte.
  - `top_k` (int, optionnel, défaut=6) : Nombre de résultats à retourner.
  - `user_id` (str, dépendance, géré automatiquement).
- **Sortie** (`SearchResponse`) :
  ```json
  {
    "results": [
      {
        "label": "string",
        "image_path": "string",
        "score": 0.0
      }
    ]
  }
  ```

---

### 2. Classification Multi-Label

- **URL** : `/api/v1/classify/`
- **Méthode** : `POST`
- **Entrée** (multipart/form-data) :
  - `image` (UploadFile, requis) : Image à classifier.
  - `labels` (str, requis) : Labels séparés par des virgules.
  - `user_id` (str, dépendance, géré automatiquement).
- **Sortie** (`MultiLabelResponse`) :
  ```json
  {
    "results": [
      {
        "label": "string",
        "score": 0.0
      }
    ]
  }
  ```

---

### 3. Segmentation d’Image

- **URL** : `/api/v1/segment/`
- **Méthode** : `POST`
- **Entrée** (multipart/form-data) :
  - `image` (UploadFile, requis) : Image à segmenter.
  - `user_id` (str, dépendance, géré automatiquement).
- **Sortie** (`SegmentationResponse`) :
  ```json
  {
    "detected_labels_atr": ["string"],
    "detected_labels_lip": ["string"],
    "mask_color_atr_base64": "string (base64 PNG)",
    "mask_color_lip_base64": "string (base64 PNG)",
    "color_map_atr": {"label": "hex_color"},
    "color_map_lip": {"label": "hex_color"}
  }
  ```

---

### 4. Détection d’Objets

- **URL** : `/api/v1/detect/`
- **Méthode** : `POST`
- **Entrée** (multipart/form-data) :
  - `image` (UploadFile, requis) : Image à analyser.
  - `user_id` (str, dépendance, géré automatiquement).
- **Sortie** (`ObjectDetectionResponse`) :
  ```json
  {
    "detected_objects": [
      {
        "label": "string",
        "score": 0.0,
        "box": [0.0, 0.0, 0.0, 0.0]
      }
    ]
  }
  ```

---

## Modèles de Données (Schemas)

- **SearchResponse** : Liste de résultats de recherche cross-modale.
- **MultiLabelResponse** : Liste de labels prédits avec score.
- **SegmentationResponse** : Labels détectés, masques de segmentation (base64), et color maps.
- **ObjectDetectionResponse** : Liste d’objets détectés avec label, score et bounding box.

---

## Authentification & Crédits

Chaque endpoint dépend d’un système de crédits utilisateur (`check_and_decrement_credit`). Le paramètre `user_id` est injecté automatiquement via la dépendance FastAPI.

---

## Statique

- Les fichiers statiques (images, etc.) sont servis via `/static/`.

---

## Exemple de requête (curl)

```bash
curl -X POST "http://localhost:8000/api/v1/detect/" \
  -F "image=@/chemin/vers/image.jpg"
```

---

## Organisation du code

- Endpoints : `backend/app/api/`
- Modèles : `backend/app/schemas/`
- Logique métier : `backend/app/models/`
- Utilitaires : `backend/app/utils/`

---

Ce document peut être copié dans un README ou partagé avec tout développeur devant intégrer ou maintenir l’API backend.  
Si tu veux un format OpenAPI/Swagger ou un exemple pour chaque endpoint, fais-le moi savoir ! 