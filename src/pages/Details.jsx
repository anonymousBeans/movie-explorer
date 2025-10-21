import { use, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const KEY = import.meta.env.VITE_OMDB_KEY;

export default function Details() {
  const { imdbID } = useParams();

  const [movie, setMovie] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState(null);

  const showDetails = async (id) => {
    try {
      const url = `https://www.omdbapi.com/?apikey=${KEY}&i=${encodeURIComponent(
        id
      )}&plot=full`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.Response === "True") {
        setMovie(data);
        setStatus("done");
        setError(null);
      } else {
        setStatus("error");
        setError("Error displaying the movie");
      }
    } catch (e) {
      setStatus("error");
      setError("Network error");
    }
  };

  useEffect(() => {
    if (!imdbID) return;
    setStatus("Loading..");
    setError(null);
    showDetails(imdbID);
  }, [imdbID]);

  return (
    <div className="container py-4">
      <Link
        to="/"
        className="text-light text-decoration-none position-absolute top-0 start-0 m-3"
      >
        ← back
      </Link>
      {status === "loading" && <p className="text-center">Loading…</p>}
      {status === "error" && (
        <p className="text-center text-warning">{error}</p>
      )}
      {status === "done" && movie && (
        <>
          <h2 className="display-5 mb-4 text-center">
            {movie.Title} <span className="text-secondary">({movie.Year})</span>
          </h2>
          {movie.Genre &&
            movie.Genre.split(", ").map((g) => (
              <span key={g} className="badge bg-secondary me-2 mb-2">
                {g}
              </span>
            ))}

          <div className="row g-4 align-items-start flex-column-reverse flex-md-row">
            <div className="col-12 col-md-8">
              <h3>Description</h3>
              <p>{movie.Plot}</p>
              <div className="mt-4">
                <h5 className="text-light mb-3">Details</h5>
                <p className="mb-1">
                  <strong>Runtime:</strong> {movie.Runtime}
                </p>
                <p className="mb-1">
                  <strong>Genre:</strong> {movie.Genre}
                </p>
                <p className="mb-1">
                  <strong>Rated:</strong> {movie.Rated}
                </p>
                <p className="mb-1">
                  <strong>Director:</strong> {movie.Director}
                </p>
                <p className="mb-1">
                  <strong>Actors:</strong> {movie.Actors}
                </p>
                <p className="mb-0">
                  <strong>IMDb Rating:</strong> ⭐ {movie.imdbRating}
                </p>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <img
                src={
                  movie.Poster !== "N/A"
                    ? movie.Poster
                    : "https://via.placeholder.com/300x450?text=No+Poster"
                }
                alt={movie.Title}
                className="img-fluid rounded shadow-sm"
                style={{ maxHeight: "500px", objectFit: "cover" }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
