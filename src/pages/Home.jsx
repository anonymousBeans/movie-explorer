import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import SearchBar from "../components/SearchBar";

const KEY = import.meta.env.VITE_OMDB_KEY;

function Home() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | error | done
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchSearch = async (term, p = 1) => {
    if (!KEY) {
      setStatus("error");
      setError("Missing VITE_OMDB_KEY");
      return;
    }
    try {
      const url = `https://www.omdbapi.com/?apikey=${KEY}&s=${encodeURIComponent(
        term
      )}&page=${p}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.Response === "True") {
        setMovies((prev) => {
          const combined = p === 1 ? data.Search : [...prev, ...data.Search];
          const seen = new Set();
          const deduped = [];
          for (const item of combined) {
            if (!seen.has(item.imdbID)) {
              seen.add(item.imdbID);
              deduped.push(item);
            }
          }
          return deduped;
        });
        setTotal(Number(data.totalResults || 0));
        setStatus("done");
        setError(null);
      } else {
        if (p === 1) setMovies([]);
        setTotal(0);
        setStatus("error");
        setError(data.Error || "No results");
      }
    } catch (e) {
      setStatus("error");
      setError("Network error");
    }
  };

  const handleSearch = async (term) => {
    setQuery(term);
    setPage(1);
    setStatus("loading");
    setError(null);
    await fetchSearch(term, 1);
  };

  const loadMore = async () => {
    const next = page + 1;
    setPage(next);
    setStatus("loading");
    await fetchSearch(query, next);
  };

  const canLoadMore =
    movies.length > 0 && movies.length < total && status !== "loading";

  return (
    <div className="container py-4">
      <h1 className="display-5 mb-4 text-center">Movie Explorer</h1>
      <div className="mb-4">
        <SearchBar
          onSearch={handleSearch}
          defaultValue={query}
          isLoading={status === "loading"}
          placeholder="Search movies…"
        />
      </div>
      {status === "idle" && (
        <p className="text-center text-secondary">
          Type something and search for movies.
        </p>
      )}
      {status === "loading" && <p className="text-center">Loading…</p>}
      {status === "error" && (
        <p className="text-center text-warning">
          {error || "Something went wrong."}
        </p>
      )}

      {movies.length > 0 && (
        <>
          <div className="row g-3 justify-content-center">
            {movies.map((m) => {
              const poster =
                m.Poster && m.Poster !== "N/A"
                  ? m.Poster
                  : "https://via.placeholder.com/300x450?text=No+Poster";
              return (
                <div key={m.imdbID} className="col-6 col-md-4 col-lg-3">
                  <Link
                    to={`/movie/${m.imdbID}`}
                    className="text-decoration-none text-reset"
                  >
                    <div className="card h-100 bg-body-tertiary border border-light-subtle shadow-sm rounded-3 overflow-hidden">
                      <img
                        src={poster}
                        alt={m.Title}
                        className="w-100 poster"
                      />
                      <div className="card-body p-3">
                        <h6 className="card-title mb-1 text-truncate">
                          {m.Title}
                        </h6>
                        <p className="text-secondary small mb-0">
                          {m.Year} · {m.Type}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="d-flex justify-content-center mt-4">
            {canLoadMore && (
              <button
                className="btn btn-outline-primary"
                onClick={loadMore}
                disabled={status === "loading"}
              >
                Mehr laden
              </button>
            )}
          </div>

          <p className="text-center text-secondary mt-3 small">
            Show {movies.length} out of {total} results
          </p>
        </>
      )}
    </div>
  );
}

export default Home;
