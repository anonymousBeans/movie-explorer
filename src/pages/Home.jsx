import React from "react";
import { useState } from "react";
import MovieCard from "../components/MovieCard";
import SearchBar from "../components/SearchBar";

const movies = [
  { title: "Movie One", year: 2024, genre: "Action" },
  { title: "Movie Two", year: 2023, genre: "Drama" },
  { title: "Movie Three", year: 2022, genre: "Sci-Fi" },
];

function Home() {
  const [status, setStatus] = useState("idle");

  const handleSearch = async (term) => {
    setStatus("loading");
    //  hier  OMDb-Fetch starten und State updaten
    // ...fetch(...)
    setStatus("idle");
  };

  return (
    <div className="container py-4">
      <h1 className="display-5 mb-4 text-center">Movie Explorer</h1>
      <div className="mb-4">
        <SearchBar onSearch={handleSearch} isLoading={status === "loading"} />
      </div>
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
