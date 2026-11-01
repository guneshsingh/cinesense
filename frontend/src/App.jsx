import { useState } from "react";
import "./App.css";

const API = "http://127.0.0.1:8000";

export default function App() {
  const [title, setTitle] = useState("");
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function search(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError("");
    setMovie(null);
    setReviews(null);
    try {
      const res = await fetch(`${API}/movie?title=${encodeURIComponent(title)}`);
      if (res.status === 404) throw new Error("Movie not found");
      if (!res.ok) throw new Error("Something went wrong on the server");
      const m = await res.json();
      setMovie(m);

      const r = await fetch(
        `${API}/reviews?title=${encodeURIComponent(m.title)}&year=${encodeURIComponent(m.year)}`
      );
      if (r.ok) setReviews(await r.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <h1>CineSense</h1>
      <form onSubmit={search}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Search a movie, e.g. Inception"
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {movie && (
        <div className="card">
          {movie.poster && movie.poster !== "N/A" && (
            <img src={movie.poster} alt={movie.title} />
          )}
          <div className="info">
            <h2>
              {movie.title} <span>({movie.year})</span>
            </h2>
            <p className="genre">{movie.genre}</p>
            <p>{movie.plot}</p>
            <ul className="ratings">
              <li>IMDb: {movie.ratings.imdb ?? "N/A"}</li>
              <li>Rotten Tomatoes: {movie.ratings.rotten_tomatoes ?? "N/A"}</li>
              <li>Metacritic: {movie.ratings.metacritic ?? "N/A"}</li>
              {reviews && <li>TMDB: {reviews.tmdb_rating}/10</li>}
            </ul>
          </div>
        </div>
      )}

      {reviews && (
        <div className="reviews">
          <h3>Audience reviews ({reviews.reviews.length})</h3>
          {reviews.reviews.length === 0 && (
            <p className="muted">No reviews found on TMDB for this movie.</p>
          )}
          {reviews.reviews.slice(0, 5).map((rv, i) => (
            <div className="review" key={i}>
              <strong>{rv.author}</strong>
              {rv.rating && <span> · {rv.rating}/10</span>}
              <p>
                {rv.content.length > 400
                  ? rv.content.slice(0, 400) + "..."
                  : rv.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}