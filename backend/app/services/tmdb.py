import os
import requests
from dotenv import load_dotenv

load_dotenv()

BASE = "https://api.themoviedb.org/3"


def _get(path: str, **params):
    key = os.getenv("TMDB_API_KEY")
    if not key:
        raise RuntimeError("TMDB_API_KEY not found. Check backend/.env")
    params["api_key"] = key
    resp = requests.get(f"{BASE}{path}", params=params, timeout=10)
    resp.raise_for_status()
    return resp.json()


def fetch_reviews(title: str, year: str | None = None):
    params = {"query": title}
    if year:
        params["year"] = year[:4]

    results = _get("/search/movie", **params).get("results", [])
    if not results:
        return None

    movie = results[0]
    reviews = _get(f"/movie/{movie['id']}/reviews").get("results", [])

    return {
        "tmdb_id": movie["id"],
        "tmdb_rating": round(movie.get("vote_average", 0), 1),
        "reviews": [
            {
                "author": r.get("author"),
                "rating": (r.get("author_details") or {}).get("rating"),
                "content": r.get("content"),
            }
            for r in reviews
        ],
    }