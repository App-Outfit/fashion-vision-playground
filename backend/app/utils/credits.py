import os
import requests
from jose import jwt
from fastapi import HTTPException, Header, Depends
from dotenv import load_dotenv

dotenv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '.env'))
load_dotenv(dotenv_path=dotenv_path)

SUPABASE_JWT_SECRET = os.environ.get("SUPABASE_JWT_SECRET")
SUPABASE_API_URL = os.environ.get("SUPABASE_API_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

def get_user_id_from_token(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token manquant")
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SUPABASE_JWT_SECRET, algorithms=["HS256"], audience="authenticated")
        return payload["sub"]  # user_id
    except Exception as e:
        raise HTTPException(status_code=401, detail="Token invalide")


def check_and_decrement_credit(user_id: str = Depends(get_user_id_from_token)):
    headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json"
    }
    # 1. Récupérer le crédit
    r = requests.get(
        f"{SUPABASE_API_URL}/profiles?user_id=eq.{user_id}",
        headers=headers
    )
    if not r.ok or not r.json():
        raise HTTPException(status_code=403, detail="Utilisateur inconnu")
    credits = r.json()[0]["credits"]
    if credits <= 0:
        raise HTTPException(status_code=402, detail="Plus de crédits")
    # 2. Décrémenter le crédit
    r2 = requests.patch(
        f"{SUPABASE_API_URL}/profiles?user_id=eq.{user_id}",
        headers=headers,
        json={"credits": credits - 1}
    )
    if not r2.ok:
        raise HTTPException(status_code=500, detail="Erreur crédit")
    return user_id 