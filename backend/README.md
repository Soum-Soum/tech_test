# Situations API

## Installation

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Sous Windows, activez l'environnement avec `.venv\Scripts\activate`.

## Lancement

```bash
uvicorn app.main:app --reload --port 12345
```

## Swagger

La documentation interactive est disponible sur http://localhost:12345/docs.

## Base

La base SQLite est créée automatiquement au démarrage, avec un jeu de données initial.
