import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import MovieCard from "../components/MovieCard";

const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;

function Home() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | error | done
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [trending, setTrending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  const navigate = useNavigate();

  const fetchSearch = async (term, p = 1) => {
    const q = term.trim();

    if (!q) {
      setMovies([]);
      setStatus("idle");
      setError(null);
      setTotal(0);
      return;
    }

    if (!TMDB_KEY) {
      setStatus("error");
      setError("Missing VITE_TMDB_KEY");
      return;
    }
    try {
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(
        q
      )}&page=${p}`;

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok || data.success === false) {
        setStatus("error");
        setError(data.status_message || `HTTP ${res.status}`);
        return;
      }

      const results = Array.isArray(data.results) ? data.results : [];

      setMovies((prev) => {
        const combined = p === 1 ? results : [...prev, ...results];
        const seen = new Set();
        return combined.filter((item) => {
          if (seen.has(item.id)) return false;
          seen.add(item.id);
          return true;
        });
      });
      setTotal(Number(data.total_results || 0));
      setStatus("done");
      setError(null);
    } catch (e) {
      setStatus("error");
      setError("Network error");
    }
  };

  const handleSearch = async (term) => {
    setQuery(term);

    if (!term.trim()) {
      setMovies([]);
      setStatus("idle");
      setError(null);
      loadTrending();
      loadUpcoming();
      return;
    }

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

  const loadUpcoming = useCallback(async () => {
    try {
      const url = `https://api.themoviedb.org/3/movie/upcoming?language=de-DE&region=DE&page=1&api_key=${TMDB_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      setUpcoming(data.results);
    } catch (e) {
      console.warn("Upcoming failed");
    }
  }, [TMDB_KEY]);

  const handleClear = () => {
    setQuery("");
    setStatus("idle");
    setMovies([]);
    setTotal(0);
    setError(null);
    loadTrending();
    loadUpcoming();
  };

  useEffect(() => {
    loadTrending();
    loadUpcoming();
  }, [loadTrending, loadUpcoming]);

  const goToDetails = (tmdbId) => {
    navigate(`/tmdb/movie/${tmdbId}`);
  };

  return (
    <div className="container py-4">
      <h1 className="display-5 mb-4 text-center">Movie Explorer</h1>
      <div className="mb-4">
        <SearchBar
          onSearch={handleSearch}
          onClear={handleClear}
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

      {movies.length > 0 ? (
        <>
          <div className="row g-3 justify-content-center">
            {movies.map((m) => (
              <div key={m.id} className="col-6 col-md-4 col-lg-3">
                <MovieCard movie={m} onClick={goToDetails} />
              </div>
            ))}
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
      ) : (
        <>
          {trending.length > 0 && (
            <>
              <h3 className="display-6 mb-3 text-start">Top 20 - Trending</h3>
              <div className="scroll-row">
                {trending.map((m) => (
                  <div key={m.id} className="scroll-item">
                    <MovieCard movie={m} onClick={goToDetails} />
                  </div>
                ))}
              </div>
            </>
          )}
          {upcoming.length > 0 && (
            <>
              <p></p>
              <h3 className="display-6 mb-3 text-start">Upcoming</h3>
              <div className="scroll-row">
                {upcoming.map((m) => (
                  <div key={m.id} className="scroll-item">
                    <MovieCard movie={m} onClick={goToDetails} />
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Home;
