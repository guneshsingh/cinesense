import { useState } from "react";
import "./App.css";

const API = "http://127.0.0.1:8000";

export default function App() {
  const [title, setTitle] = useState("");
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function search(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError("");
    setMovie(null);
    try {
      const res = await fetch(`${API}/movie?title=${encodeURIComponent(title)}`);
      if (res.status === 404) throw new Error("Movie not found");
      if (!res.ok) throw new Error("Something went wrong on the server");
      setMovie(await res.json());
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
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}