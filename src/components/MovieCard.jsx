export default function MovieCard({ movie, onClick }) {
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://placehold.co/300x450?text=No+Poster&font=roboto";

  const year = movie.release_date ? movie.release_date.slice(0, 4) : "—";

  return (
    <div key={movie.id} className="col-6 col-md-3">
      <div
        role="button"
        onClick={() => {
          e.currentTarget.blur();
          onClick?.(movie.id);
        }}
        className="text-decoration-none text-reset"
      >
        <div className="card h-100 bg-body-tertiary border border-light-subtle shadow-sm rounded-3 overflow-hidden">
          <img src={poster} alt={movie.title} className="img-fluid rounded" />
          <div className="card-body p-3">
            <h6 className="card-title mb-1 text-truncate">{movie.title}</h6>
            <p className="text-secondary small mb-0">{year}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
