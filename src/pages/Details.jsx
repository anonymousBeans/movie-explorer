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
          <div className="row g-4 align-items-start">
            <div className="col-12 col-md-8">
              <h3>Description</h3>
              <p>{movie.Plot}</p>
              <p>{movie.Runtime}</p>
              <p>{movie.Genre}</p>
              <p>{movie.Rated}</p>
              <p>{movie.Director}</p>
              <p>{movie.Actors}</p>
              <p>ImdbRating: {movie.imdbRating}</p>
            </div>
            <div className="col-12 col-md-4">
              <img
                src={movie.Poster}
                alt={movie.Title}
                className="w-100 poster"
              ></img>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
