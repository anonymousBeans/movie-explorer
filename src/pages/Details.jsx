import { useParams, Link } from "react-router-dom";

export default function Details() {
  const { imdbID } = useParams();
  return (
    <div>
      <Link to="/">← Zurück</Link>
      <h2>Details für: {imdbID}</h2>
    </div>
  );
}
