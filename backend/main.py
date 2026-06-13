from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from careers import CAREERS
from scraper import MallaScraper

app = FastAPI(title="Vocatio Scraper API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

scraper = MallaScraper()


@app.get("/api/careers")
def list_careers():
    return {
        "total": len(CAREERS),
        "careers": {
            k: {"name": v["name"], "faculty": v["faculty"]}
            for k, v in CAREERS.items()
        },
    }


@app.get("/api/careers/{career_id}")
def get_career(career_id: str):
    if career_id not in CAREERS:
        raise HTTPException(status_code=404, detail=f"Career '{career_id}' not found")
    return CAREERS[career_id]


@app.get("/api/scrape/{career_id}")
def scrape_career(career_id: str):
    if career_id not in CAREERS:
        raise HTTPException(status_code=404, detail=f"Career '{career_id}' not found")

    career = CAREERS[career_id]
    result = scraper.scrape(career["url"])

    if not result:
        raise HTTPException(
            status_code=502,
            detail=f"Failed to scrape malla from UTP for '{career['name']}'",
        )

    return {
        "id": career_id,
        "faculty": career["faculty"],
        "url": career["url"],
        **result,
    }


@app.get("/api/scrape-all")
def scrape_all():
    results = {}
    for career_id, career in CAREERS.items():
        result = scraper.scrape(career["url"])
        if result:
            results[career_id] = {
                "faculty": career["faculty"],
                "url": career["url"],
                **result,
            }
        else:
            results[career_id] = {"error": "scrape failed", "url": career["url"]}
    return {"total": len(CAREERS), "results": results}


@app.get("/api/health")
def health():
    return {"status": "ok"}
