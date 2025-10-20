import { useState, useEffect, useRef } from "react";

function SearchBar(
  onSearch,
  defaultValue = "",
  placeholder = "Search for a movie…",
  isLoading = false,
  autoFocus = true
) {
  const [q, setQ] = useState(defaultValue);
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) inputRef.current.focus();
  }, [autoFocus]);

  const submit = (e) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    onSearch?.(term);
  };

  return (
    <form onSubmit={submit} className="d-flex justify-content-center gap-2">
      <input
        ref={inputRef}
        type="search"
        className="form-control w-50"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        aria-label="Filmsuche"
      />
      <button type="submit" className="btn btn-primary" disabled={isLoading}>
        {isLoading ? "Searching…" : "Search"}
      </button>
    </form>
  );
}

export default SearchBar;
