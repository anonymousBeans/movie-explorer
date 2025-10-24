import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";

const OMDB_KEY = import.meta.env.VITE_OMDB_KEY;
const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;

function Home() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | error | done
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [trending, setTrending] = useState([]);

  const navigate = useNavigate();

  const fetchSearch = async (term, p = 1) => {
    if (!OMDB_KEY) {
      setStatus("error");
      setError("Missing VITE_OMDB_KEY");
      return;
    }
    try {
      const url = `https://www.omdbapi.com/?apikey=${OMDB_KEY}&s=${encodeURIComponent(
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

  const loadTrending = useCallback(async () => {
    try {
      const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      setTrending(data.results);
    } catch (e) {
      console.warn("Trending failed");
    }
  }, [TMDB_KEY]);

  useEffect(() => {
    loadTrending();
  }, [loadTrending]);

  const goToOmdbDetails = async (tmdbId) => {
    try {
      const url = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_KEY}&append_to_response=external_ids`;
      const res = await fetch(url);
      const data = await res.json();
      const imdbId = data?.external_ids?.imdb_id;

      if (imdbId) {
        navigate(`/movie/${imdbId}`);
      } else {
        alert("Keine IMDb-ID für diesen Film gefunden 😕");
      }
    } catch (e) {
      console.error(e);
      alert("Fehler beim Laden der Details");
    }
  };

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

      {trending.length > 0 && (
        <>
          <h3 className="display-6 mb-3 text-start">Top 20 - Trending</h3>
          <div className="row g-3 justify-content-center">
            {trending.map((t) => {
              const poster = t.poster_path
                ? `https://image.tmdb.org/t/p/w500${t.poster_path}`
                : "https://via.placeholder.com/300x450?text=No+Poster";
              const year = t.release_date ? t.release_date.slice(0, 4) : "—";
              return (
                <div key={t.id} className="col-6 col-md-3">
                  <div
                    role="button"
                    onClick={() => goToOmdbDetails(t.id)}
                    className="text-decoration-none text-reset"
                  >
                    <div className="card h-100 bg-body-tertiary border border-light-subtle shadow-sm rounded-3 overflow-hidden">
                      <img
                        src={poster}
                        alt={t.title}
                        className="img-fluid rounded"
                      />
                      <div className="card-body p-3">
                        <h6 className="card-title mb-1 text-truncate">
                          {t.title}
                        </h6>
                        <p className="text-secondary small mb-0">{year}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
