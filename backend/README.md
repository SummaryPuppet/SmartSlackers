# Backend - Vocatio Scraper API

API con FastAPI para scrapeo de mallas curriculares de la UTP.

## Inicio rápido

### Linux / macOS

```bash
chmod +x start.sh
./start.sh
```

### Windows (CMD)

```bat
start.bat
```

### Windows (PowerShell)

```powershell
.\start.ps1
```

> Los scripts crean el `venv` si no existe, instalan las dependencias y ejecutan el servidor en `http://localhost:8000`.

## Arranque manual

```bash
python3 -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Endpoints

| Método | Ruta                | Descripción                          |
| ------ | ------------------- | ------------------------------------ |
| GET    | `/api/health`       | Health check                         |
| GET    | `/api/careers`      | Lista de carreras disponibles        |
| GET    | `/api/careers/{id}` | Detalle de una carrera               |
| GET    | `/api/scrape/{id}`  | Scrapea la malla de una carrera      |
| GET    | `/api/scrape-all`   | Scrapea todas las carreras           |

## Dependencias

- Python 3.10+
- FastAPI
- Uvicorn
- Requests
- BeautifulSoup4
- lxml
