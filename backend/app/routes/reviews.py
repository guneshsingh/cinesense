from fastapi import APIRouter, HTTPException
from app.services.tmdb import fetch_reviews

router = APIRouter()


@router.get("/reviews")
def get_reviews(title: str, year: str | None = None):
    data = fetch_reviews(title, year)
    if data is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    return data