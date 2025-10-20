import React from "react";
import MovieCard from "../components/MovieCard";

const movies = [
  { title: "Movie One", year: 2024, genre: "Action" },
  { title: "Movie Two", year: 2023, genre: "Drama" },
  { title: "Movie Three", year: 2022, genre: "Sci-Fi" },
];

function Home() {
  return (
    <div className="container py-4">
      <div className="row g-3 justify-content-center">
        {movies.map((movie, index) => (
          <div key={index} className="col-6 col-md-4 col-lg-3">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
