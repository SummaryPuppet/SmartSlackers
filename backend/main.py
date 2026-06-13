from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from careers import CAREERS
from scraper import MallaScraper
from firestore_service import get_all_careers, get_career as fb_get_career, set_career
from community_router import router as community_router

app = FastAPI(title="Vocatio Scraper API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(community_router)

scraper = MallaScraper()


# ── Firestore-backed endpoints (primary) ──────────────────────────

@app.get("/api/v2/careers")
def list_careers_v2():
    """Get all careers from Firestore."""
    try:
        careers = get_all_careers()
        return {
            "total": len(careers),
            "careers": careers,
        }
    except Exception as e:
        # Fallback to static data if Firestore is unavailable
        return {
            "total": len(CAREERS),
            "careers": [
                {"id": k, **v}
                for k, v in CAREERS.items()
            ],
            "source": "fallback",
        }


@app.get("/api/v2/careers/{career_id}")
def get_career_v2(career_id: str):
    """Get a single career from Firestore."""
    try:
        career = fb_get_career(career_id)
        if career is None:
            raise HTTPException(status_code=404, detail=f"Career '{career_id}' not found")
        return career
    except HTTPException:
        raise
    except Exception:
        # Fallback
        if career_id not in CAREERS:
            raise HTTPException(status_code=404, detail=f"Career '{career_id}' not found")
        return {"id": career_id, **CAREERS[career_id]}


@app.put("/api/v2/careers/{career_id}")
def update_career(career_id: str, data: dict):
    """Create or update a career in Firestore."""
    try:
        set_career(career_id, data)
        return {"status": "ok", "id": career_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Legacy endpoints (backward compatible) ─────────────────────────

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
