import React, { memo } from "react";
import MovieCard from "./MovieCard";

function CategoryRail({ items = [], onClick, title, children }) {
  if (!items || items.length === 0) return null;

  const heading = title ?? children;

  return (
    <>
      <h3 className="display-6 mb-3 text-start">{heading}</h3>
      <div className="scroll-row">
        {items.map((m) => (
          <div key={m.id} className="scroll-item">
            <MovieCard movie={m} onClick={onClick} />
          </div>
        ))}
      </div>
    </>
  );
}

export default memo(CategoryRail);
