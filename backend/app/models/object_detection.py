from PIL import Image
from transformers import AutoImageProcessor, AutoModelForObjectDetection
import torch
from typing import List, Dict, Union

MODEL_ID = "yainage90/fashion-object-detection"

class FashionObjectDetector:
    _instance = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def __init__(self):
        self.processor = AutoImageProcessor.from_pretrained(MODEL_ID)
        self.model = AutoModelForObjectDetection.from_pretrained(MODEL_ID)
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)

    def detect(self, image: Union[str, Image.Image], threshold: float = 0.3) -> List[Dict]:
        if isinstance(image, str):
            image = Image.open(image).convert("RGB")
        else:
            image = image.convert("RGB")
        inputs = self.processor(images=[image], return_tensors="pt").to(self.device)
        with torch.no_grad():
            outputs = self.model(**inputs)
        target_sizes = torch.tensor([[image.size[1], image.size[0]]]).to(self.device)
        results = self.processor.post_process_object_detection(outputs, threshold=threshold, target_sizes=target_sizes)[0]
        detected = []
        for score, label, box in zip(results["scores"], results["labels"], results["boxes"]):
            detected.append({
                "label": self.model.config.id2label[label.item()],
                "score": float(score.item()),
                "box": [float(round(i, 2)) for i in box.tolist()]
            })
        return detected 