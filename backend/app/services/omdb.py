import os
import requests
from dotenv import load_dotenv

load_dotenv()

OMDB_URL = "https://www.omdbapi.com/"


def fetch_movie(title: str):
    api_key = os.getenv("OMDB_API_KEY")
    resp = requests.get(
        OMDB_URL,
        params={"apikey": api_key, "t": title},
        timeout=10,
    )
    resp.raise_for_status()
    data = resp.json()

    if data.get("Response") == "False":
        return None

    ratings = {r["Source"]: r["Value"] for r in data.get("Ratings", [])}

    return {
        "title": data.get("Title"),
        "year": data.get("Year"),
        "genre": data.get("Genre"),
        "plot": data.get("Plot"),
        "poster": data.get("Poster"),
        "ratings": {
            "imdb": ratings.get("Internet Movie Database"),
            "rotten_tomatoes": ratings.get("Rotten Tomatoes"),
            "metacritic": ratings.get("Metacritic"),
        },
    }
    if data.get("Response") == "False":
        # fallback: fuzzy search, then fetch the first match by IMDb ID
        search = requests.get(
            OMDB_URL,
            params={"apikey": api_key, "s": title},
            timeout=10,
        ).json()
        hits = search.get("Search") or []
        if not hits:
            return None
        resp = requests.get(
            OMDB_URL,
            params={"apikey": api_key, "i": hits[0]["imdbID"]},
            timeout=10,
        )
        data = resp.json()
        if data.get("Response") == "False":
            return None