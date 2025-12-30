import { useState } from "react";
import "./App.css";

const API_KEY = "5275d55";

function App() {
  const [movieName, setMovieName] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchMovie = async () => {
    if (!movieName.trim()) return;

    setLoading(true);
    setError("");
    setMovies([]);

    try {
      const response = await fetch(
        `https://www.omdbapi.com/?s=${movieName}&apikey=${API_KEY}`
      );
      const data = await response.json();

      if (data.Response === "False") {
        setError("Movie not found ❌");
      } else {
        setMovies(data.Search);
      }
    } catch {
      setError("Something went wrong");
    }

    setLoading(false);
  };

  const openDetails = async (id) => {
    const response = await fetch(
      `https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`
    );
    const data = await response.json();
    setSelectedMovie(data);
  };

  return (
    <div className="app">
      <h1>🎬 Movie Search App</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search movies..."
          value={movieName}
          onChange={(e) => setMovieName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchMovie()}
        />
        <button onClick={searchMovie}>Search</button>
      </div>

      {error && <p className="error">{error}</p>}

      {/* Skeleton Loader */}
      {loading && (
        <div className="movie-list">
          {[...Array(5)].map((_, i) => (
            <div className="skeleton-card" key={i}></div>
          ))}
        </div>
      )}

      {/* Movie Cards */}
      <div className="movie-list">
        {movies.map((movie) => (
          <div
            className="movie-card"
            key={movie.imdbID}
            onClick={() => openDetails(movie.imdbID)}
          >
            <img
              src={
                movie.Poster !== "N/A"
                  ? movie.Poster
                  : "https://via.placeholder.com/220x300"
              }
              alt={movie.Title}
            />
            <h3>{movie.Title}</h3>
            <p>{movie.Year}</p>
            <span className="badge">IMDb</span>
          </div>
        ))}
      </div>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <div className="modal-overlay" onClick={() => setSelectedMovie(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <img src={selectedMovie.Poster} alt={selectedMovie.Title} />
            <div className="modal-info">
              <h2>{selectedMovie.Title}</h2>
              <p><b>Year:</b> {selectedMovie.Year}</p>
              <p><b>Genre:</b> {selectedMovie.Genre}</p>
              <p><b>IMDb:</b> ⭐ {selectedMovie.imdbRating}</p>
              <p><b>Plot:</b> {selectedMovie.Plot}</p>
              <button onClick={() => setSelectedMovie(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
