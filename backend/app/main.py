from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.movie import router as movie_router

app = FastAPI(title="CineSense API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(movie_router)


@app.get("/")
def root():
    return {"status": "ok"}