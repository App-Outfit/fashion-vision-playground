import os
import json
import numpy as np
from PIL import Image
from transformers import CLIPProcessor, CLIPModel, pipeline
import faiss
import torch
from fastapi import UploadFile

class FashionClipSingleton:
    _instance = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def __init__(self):
        # --- Load model and processor ---
        self.model_name = "patrickjohncyh/fashion-clip"
        self.processor = CLIPProcessor.from_pretrained(self.model_name)
        self.model = CLIPModel.from_pretrained(self.model_name)
        self.model.eval()
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)

        # --- Load embeddings, index, metadata ---
        data_dir = os.path.join(os.path.dirname(__file__), "../data")
        self.embeddings = np.load(os.path.join(data_dir, "embeddings.npy"))
        self.index = faiss.read_index(os.path.join(data_dir, "faiss_index.index"))
        with open(os.path.join(data_dir, "metadonnees.json"), "r") as f:
            self.metadonnees = json.load(f)

        # --- Zero-shot pipeline for multi-label ---
        self.zero_shot_pipe = pipeline("zero-shot-image-classification", model=self.model_name, device=0 if torch.cuda.is_available() else -1)

    def _encode_image(self, image: Image.Image):
        inputs = self.processor(images=image, return_tensors="pt").to(self.device)
        with torch.no_grad():
            features = self.model.get_image_features(**inputs)
            features = features / features.norm(p=2, dim=-1, keepdim=True)
        return features

    def _encode_text(self, text: str):
        inputs = self.processor(text=[text], return_tensors="pt").to(self.device)
        with torch.no_grad():
            features = self.model.get_text_features(**inputs)
            features = features / features.norm(p=2, dim=-1, keepdim=True)
        return features

    def search(self, image: UploadFile = None, text: str = None, alpha: float = 0.5, top_k: int = 6):
        # Dispatch to the right search method
        if image and text:
            return self.search_combined(image, text, alpha, top_k)
        elif image and not text:
            return self.search_by_image(image, top_k)
        elif text and not image:
            return self.search_by_text(text, top_k)
        else:
            return []

    def search_by_text(self, text: str, top_k: int = 6):
        text_features = self._encode_text(text)
        vec = text_features[0].cpu().numpy().astype("float32").reshape(1, -1)
        D, I = self.index.search(vec, top_k)
        results = []
        for idx, score in zip(I[0], D[0]):
            item = self.metadonnees[idx]
            results.append({
                "label": item["label"],
                "image_path": item["path"],
                "score": float(score)
            })
        return results

    def search_by_image(self, image: UploadFile, top_k: int = 6):
        img = Image.open(image.file).convert("RGB")
        image_features = self._encode_image(img)
        vec = image_features[0].cpu().numpy().astype("float32").reshape(1, -1)
        D, I = self.index.search(vec, top_k)
        results = []
        for idx, score in zip(I[0], D[0]):
            item = self.metadonnees[idx]
            results.append({
                "label": item["label"],
                "image_path": item["path"],
                "score": float(score)
            })
        return results

    def search_combined(self, image: UploadFile, text: str, alpha: float = 0.5, top_k: int = 6):
        img = Image.open(image.file).convert("RGB")
        image_features = self._encode_image(img)
        text_features = self._encode_text(text)
        combined = alpha * text_features + (1 - alpha) * image_features
        combined = combined / combined.norm(p=2, dim=-1, keepdim=True)
        vec = combined[0].cpu().numpy().astype("float32").reshape(1, -1)
        D, I = self.index.search(vec, top_k)
        results = []
        for idx, score in zip(I[0], D[0]):
            item = self.metadonnees[idx]
            results.append({
                "label": item["label"],
                "image_path": item["path"],
                "score": float(score)
            })
        return results

    def multi_label(self, image: UploadFile, label_list):
        img = Image.open(image.file).convert("RGB")
        results = self.zero_shot_pipe(img, candidate_labels=label_list)
        # Format: [{"label": ..., "score": ...}, ...]
        return [{"label": r["label"], "score": float(r["score"])} for r in results]
