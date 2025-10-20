import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  return (
    <div className="card h-100 bg-body-tertiary border border-light-subtle shadow-sm rounded-3">
      <img
        src="https://via.placeholder.com/300x450?text=Poster"
        className="w-100 poster"
        alt={movie.title}
      />
      <div className="card-body p-2">
        <h6 className="card-title text-truncate mb-1">{movie.title}</h6>
        <p className="text-muted small mb-0">
          {movie.year} · {movie.genre}
        </p>
      </div>
    </div>
  );
}
