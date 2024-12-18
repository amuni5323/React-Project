import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DeclinedMovies from "./DeclinedMovies";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [showFullDescription, setShowFullDescription] = useState({});
  const [declinedMovies, setDeclinedMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [sortBy, setSortBy] = useState("title");
  const [showConfirmDecline, setShowConfirmDecline] = useState(false);
  const [movieToDecline, setMovieToDecline] = useState(null);

  const API_KEY = "6d0c3c51d69892c62a89b04192c07ace";

  const fetchMovies = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${page}`
      );
      setMovies(response.data.results);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(currentPage);
  }, [currentPage]);

  const toggleDescription = (id) => {
    setShowFullDescription((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const declineMovie = (id) => {
    setMovieToDecline(id); 
    setShowConfirmDecline(true); 
  };
  
  const confirmDecline = () => {
   
    setDeclinedMovies((prev) => [...prev, movieToDecline]);
    setShowConfirmDecline(false);
    setMovieToDecline(null); 
  };
  
  const cancelDecline = () => {
    setShowConfirmDecline(false);
    setMovieToDecline(null); 
  };
  

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((movieId) => movieId !== id) 
        : [...prev, id] 
    );
  };

  const toggleWatched = (id) => {
    setWatchedMovies((prev) =>
      prev.includes(id)
        ? prev.filter((movieId) => movieId !== id)
        : [...prev, id] 
    );
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
  };

  const handleRatingChange = (e) => {
    setSelectedRating(e.target.value);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const filteredMovies = movies
    .filter((movie) => !declinedMovies.includes(movie.id))
    .filter((movie) => movie.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((movie) => {
      return selectedGenre ? movie.genre_ids.includes(parseInt(selectedGenre)) : true;
    })
    .filter((movie) => {
      return selectedRating ? movie.vote_average >= selectedRating : true;
    });

  const sortedMovies = filteredMovies.sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "release_date":
        return new Date(b.release_date) - new Date(a.release_date);
      case "rating":
        return b.vote_average - a.vote_average;
      default:
        return 0;
    }
  });

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const [clickCount, setClickCount] = useState({}); 

  const handleImageClick = (id, tmdbUrl, youtubeUrl) => {
    setClickCount((prev) => {
      const newClickCount = { ...prev, [id]: (prev[id] || 0) + 1 };
      newClickCount[id] === 1
        ? window.open(tmdbUrl, "_blank")
        : newClickCount[id] === 2
        ? (window.open(youtubeUrl, "_blank"), (newClickCount[id] = 0))
        : null;
      return newClickCount;
    });
  };
  return (
    <Router>
      <div className={`container-fluid ${darkMode ? "bg-dark text-white" : "bg-light"}`} style={{ minHeight: "100vh", padding: "20px" }}>
        <h1 className="my-4">Popular Movies</h1>
        <button className="btn btn-secondary mb-4" onClick={toggleDarkMode}>
          Toggle Dark Mode
        </button>

        
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={handleSearch}
            className="form-control w-100 w-md-50 d-inline-block"
          />
          <button onClick={() => setSearchTerm("")} className="btn btn-secondary ms-2">
            Clear Search
          </button>
        </div>

        
        <div className="mb-4">
          <label className="me-2">
            Genre:
            <select onChange={handleGenreChange} className="form-select ms-2">
              <option value="">All</option>
              <option value="28">Action</option>
              <option value="12">Adventure</option>
              <option value="16">Animation</option>
            </select>
          </label>

          <label className="me-2">
            Rating:
            <select onChange={handleRatingChange} className="form-select ms-2">
              <option value="0">All</option>
              <option value="7">7+</option>
              <option value="8">8+</option>
            </select>
          </label>

          <label>
            Sort By:
            <select onChange={handleSortChange} value={sortBy} className="form-select ms-2">
              <option value="title">Title</option>
              <option value="release_date">Release Date</option>
              <option value="rating">Rating</option>
            </select>
          </label>
        </div>
        <div className="mb-4 d-flex justify-content-end">
  <Link to="/declined" className="btn btn-danger">
    Declined Movies ({declinedMovies.length})
  </Link>
</div>

       
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="row row-cols-1  row-cols-md-5 g-4">
            {sortedMovies.map((movie) => (
              <div key={movie.id} className="col">
                <div className="card h-50 position-relative">
                 
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="card-img-top"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleImageClick(movie.id, `https://www.themoviedb.org/movie/${movie.id}`, `https://www.youtube.com/results?search_query=${movie.title}`)} 
                  />
                  <div className="card-body ">
                    <h5 className="card-title">{movie.title}</h5>
                    <p className="card-text">
                      {showFullDescription[movie.id] ? movie.overview : `${movie.overview.slice(0, 100)}...`} 
                    </p>
                    <button onClick={() => toggleDescription(movie.id)} className="btn btn-secondary me-2 mt-2">
                      {showFullDescription[movie.id] ? "Less" : "More"} 
                    </button>
                    <button onClick={() => declineMovie(movie.id)} className="btn btn-danger me-2 mt-2">
                      Decline
                    </button>
                    {showConfirmDecline && movieToDecline === movie.id && (
    <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center text-white" style={{ zIndex: 2 }}>
        <div className="text-center bg-dark p-4 rounded">
            <h4>Are you sure you want to decline this movie?</h4>
            <button onClick={confirmDecline} className="btn btn-danger me-2">Yes</button>
            <button onClick={cancelDecline} className="btn btn-secondary">No</button>
        </div>
    </div>
)}


 <button
                      onClick={() => toggleFavorite(movie.id)}
                      className={`btn ${favorites.includes(movie.id) ? "btn-warning" : "btn-outline-warning"} me-2 mt-2`}
                    >
                      {favorites.includes(movie.id) ? "Unfavorite" : "Favorite"}
                    </button>
                    <button
                      onClick={() => toggleWatched(movie.id)}
                      className={ `btn ${watchedMovies.includes(movie.id) ? "btn-success"  : "btn-outline-success"} mt-2`}
                    >
                      {watchedMovies.includes(movie.id) ? "Undo Watched" : "Watched"}
                    </button>
                  </div>

                 
                  <div
                    className={`position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center text-white ${favorites.includes(movie.id) || watchedMovies.includes(movie.id) ? "" : "d-none"}`}
                    style={{ zIndex: 1 }}
                  >
                    <div className="text-center">
                      {favorites.includes(movie.id) && <div>Favorited</div>}
                      {watchedMovies.includes(movie.id) && <div>Watched</div>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

       
        <div className="d-flex justify-content-between my-4">
          <button className="btn btn-secondary" onClick={goToPreviousPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button className="btn btn-secondary" onClick={goToNextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>


        <Routes>
        <Route
  path="/declined"
  element={<DeclinedMovies declinedMovies={declinedMovies} setDeclinedMovies={setDeclinedMovies} />}
/>

        </Routes>
      </div>
    </Router>
  );
};

export default App;
