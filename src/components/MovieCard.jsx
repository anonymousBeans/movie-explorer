export default function MovieCard({ movie, onClick }) {
  const posterSrc = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://placehold.co/342x513?text=No+Poster";

  return (
    <div
      role="button"
      onClick={() => onClick?.(movie.id)}
      className="card movie-card"
      loading="lazy"
    >
      <div className="poster-wrap">
        <img src={posterSrc} alt={movie.title} className="poster" />
      </div>
      <div className="card-body p-3">
        <h6 className="card-title mb-1">{movie.title}</h6>
        <p className="text-secondary small mb-0">
          {movie.release_date?.slice(0, 4) ?? "—"}
        </p>
      </div>
    </div>
  );
}
