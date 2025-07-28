# Utilise une image Python légère
FROM python:3.10-slim

# Pour éviter les prompts interactifs
ENV DEBIAN_FRONTEND=noninteractive

# Installe les dépendances système nécessaires à torch, faiss, pillow, etc.
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        git \
        libgl1 \
        libglib2.0-0 \
        && rm -rf /var/lib/apt/lists/*

# Crée le dossier de l'app
WORKDIR /app

# Copie les fichiers de dépendances
COPY requirements.txt .

# Installe les dépendances Python
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copie tout le code backend (y compris les gros fichiers nécessaires)
COPY app/ ./app/

# Expose le port utilisé par uvicorn
EXPOSE 8000

# Commande de lancement
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]