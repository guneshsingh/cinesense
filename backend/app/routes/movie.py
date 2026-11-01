from fastapi import APIRouter, HTTPException
from app.services.omdb import fetch_movie

router = APIRouter()


@router.get("/movie")
def get_movie(title: str):
    movie = fetch_movie(title)
    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie