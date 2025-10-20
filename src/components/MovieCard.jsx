import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movie/${movie.imdbID}`}>
      {/* Poster + Titel etc. */}
      {movie.Title}
    </Link>
  );
}
