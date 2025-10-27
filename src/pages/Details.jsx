import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { tmdbUrl } from "../lib/tmdb";

const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;

export default function Details() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState(null);

  const showDetails = async () => {
    if (!id) return;
    setStatus("loading");
    setError(null);

    const ac = new AbortController();

    (async () => {
      try {
        const url = tmdbUrl(
          "/movie/" + id,
          { language: "en-US", region: "us" },
          TMDB_KEY
        );

        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok || data.success === false) {
          setStatus("error");
          setError(data.status_message || `HTTP ${res.status}`);
          return;
        }

        setMovie(data);
        setStatus("done");
        setError(null);
      } catch (e) {
        setStatus("error");
        setError("Network error");
      }
    })();

    return () => ac.abort();
  };

  useEffect(() => {
    if (!id) return;
    setStatus("loading");
    setError(null);
    showDetails(id);
  }, [id]);

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
            {movie.title}{" "}
            <span className="text-secondary">
              ({movie.release_date?.slice(0, 4) || "—"})
            </span>
          </h2>
          <div className="mb-2">
            {movie.genres?.map((g) => (
              <span key={g.id} className="badge bg-secondary me-1">
                {g.name}
              </span>
            ))}
          </div>

          <div className="row g-4 align-items-start flex-column-reverse flex-md-row">
            <div className="col-12 col-md-8">
              <h3>Description</h3>
              <p>{movie.overview}</p>
              <div className="mt-4">
                <h5 className="text-light mb-3">Details</h5>
                <p className="mb-1">
                  <strong>Runtime:</strong> {movie.runtime}min
                </p>
                <p className="mb-1">
                  <strong>Director:</strong>{" "}
                  {movie.credits?.crew?.find((c) => c.job === "Director")
                    ?.name || "—"}
                </p>
                <p className="mb-1">
                  <strong>Actors:</strong>{" "}
                  {movie.credits?.cast
                    ?.slice(0, 5)
                    .map((a) => a.name)
                    .join(", ")}
                </p>
                <p className="mb-0">
                  <strong>TMDB Rating:</strong> ⭐{" "}
                  {movie.vote_average?.toFixed?.(1) ?? "—"}
                </p>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://placehold.co/300x450?text=No+Poster&font=roboto"
                }
                alt={movie.title}
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
