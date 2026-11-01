from fastapi import FastAPI
from app.routes.movie import router as movie_router

app = FastAPI(title="CineSense API")
app.include_router(movie_router)


@app.get("/")
def root():
    return {"status": "ok"}