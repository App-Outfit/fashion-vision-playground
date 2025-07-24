import os
import numpy as np
from PIL import Image
import torch
import base64
from fastapi import UploadFile, HTTPException
from PIL import UnidentifiedImageError
import sys
from ..data.SCHP import SCHP

# Hardcoded color mapping for all labels (HEX)
LABEL_COLORS = {
    "Background": "#222222",
    "Hat": "#FFB300",
    "Hair": "#803E75",
    "Glove": "#FF6800",
    "Sunglasses": "#A6BDD7",
    "Upper-clothes": "#C10020",
    "Dress": "#CEA262",
    "Coat": "#817066",
    "Socks": "#007D34",
    "Pants": "#F6768E",
    "Jumpsuits": "#00538A",
    "Scarf": "#FF7A5C",
    "Skirt": "#53377A",
    "Face": "#FF8E00",
    "Left-arm": "#B32851",
    "Right-arm": "#F4C800",
    "Left-leg": "#7F180D",
    "Right-leg": "#93AA00",
    "Left-shoe": "#593315",
    "Right-shoe": "#F13A13",
    "Belt": "#232C16",
    "Bag": "#B0B0B0"
}

ATR_MAPPING = {
    0: 'Background', 1: 'Hat', 2: 'Hair', 3: 'Sunglasses',
    4: 'Upper-clothes', 5: 'Skirt', 6: 'Pants', 7: 'Dress',
    8: 'Belt', 9: 'Left-shoe', 10: 'Right-shoe', 11: 'Face',
    12: 'Left-leg', 13: 'Right-leg', 14: 'Left-arm', 15: 'Right-arm',
    16: 'Bag', 17: 'Scarf'
}
LIP_MAPPING = {
    0: 'Background', 1: 'Hat', 2: 'Hair', 3: 'Glove',
    4: 'Sunglasses', 5: 'Upper-clothes', 6: 'Dress', 7: 'Coat',
    8: 'Socks', 9: 'Pants', 10: 'Jumpsuits', 11: 'Scarf',
    12: 'Skirt', 13: 'Face', 14: 'Left-arm', 15: 'Right-arm',
    16: 'Left-leg', 17: 'Right-leg', 18: 'Left-shoe', 19: 'Right-shoe'
}

LABEL_PRIORITY = {
    "Background": 0,
    "Left-arm": 1, "Right-arm": 1, "Left-leg": 1, "Right-leg": 1,
    "Left-shoe": 1, "Right-shoe": 1, "Socks": 1,
    "Upper-clothes": 2, "Coat": 2, "Dress": 2, "Pants": 2, "Skirt": 2, "Jumpsuits": 2, "Face": 2, 
    "Belt": 3, "Scarf": 3, "Glove": 3, "Hat": 3, "Sunglasses": 3, "Bag": 3,
    "Hair": 4
}

class SCHPSingleton:
    _instance = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def __init__(self):
        DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
        data_dir = os.path.join(os.path.dirname(__file__), "../data")
        ckpt_dir = os.path.join(data_dir, "checkpoints")
        self.schp_atr = SCHP(ckpt_path=os.path.join(ckpt_dir, "exp-schp-201908301523-atr.pth"), device=DEVICE)
        self.schp_lip = SCHP(ckpt_path=os.path.join(ckpt_dir, "exp-schp-201908261155-lip.pth"), device=DEVICE)
        self.device = DEVICE

    def segment(self, image: UploadFile):
        try:
            img = Image.open(image.file).convert("RGB")
        except UnidentifiedImageError:
            raise HTTPException(status_code=400, detail="Le fichier uploadé n'est pas une image valide ou est corrompu.")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Erreur lors de l'ouverture de l'image : {str(e)}")
        atr_mask = np.array(self.schp_atr([img]))
        lip_mask = np.array(self.schp_lip([img]))

        atr_labels = sorted(np.unique(atr_mask))
        lip_labels = sorted(np.unique(lip_mask))
        atr_detected = [ATR_MAPPING[i] for i in atr_labels if i in ATR_MAPPING]
        lip_detected = [LIP_MAPPING[i] for i in lip_labels if i in LIP_MAPPING]

        # Générer masques colorés ATR et LIP
        color_mask_atr_img, color_map_atr = self.generate_color_mask_simple(atr_mask, ATR_MAPPING)
        color_mask_lip_img, color_map_lip = self.generate_color_mask_simple(lip_mask, LIP_MAPPING)
        import io
        buf_atr = io.BytesIO()
        color_mask_atr_img.save(buf_atr, format='PNG')
        mask_color_atr_base64 = base64.b64encode(buf_atr.getvalue()).decode('utf-8')
        buf_lip = io.BytesIO()
        color_mask_lip_img.save(buf_lip, format='PNG')
        mask_color_lip_base64 = base64.b64encode(buf_lip.getvalue()).decode('utf-8')

        return {
            "detected_labels_atr": atr_detected,
            "detected_labels_lip": lip_detected,
            "mask_color_atr_base64": mask_color_atr_base64,
            "mask_color_lip_base64": mask_color_lip_base64,
            "color_map_atr": color_map_atr,
            "color_map_lip": color_map_lip
        }

    def generate_color_mask_simple(self, mask, mapping):
        h, w = mask.shape
        color_mask = np.zeros((h, w, 3), dtype=np.uint8)
        color_map = {}
        unique_indices = np.unique(mask)
        for idx in unique_indices:
            label = mapping.get(idx, None)
            if label:
                hex_color = LABEL_COLORS.get(label, "#CCCCCC")
                color = tuple(int(hex_color.lstrip('#')[i:i+2], 16) for i in (0, 2, 4))
                color_mask[mask == idx] = color
                color_map[label] = hex_color
        color_mask_img = Image.fromarray(color_mask).convert('RGB')
        return color_mask_img, color_map
