const DeclinedMovies = ({ declinedMovies, setDeclinedMovies }) => {
    const handleUndoDecline = (movieId) => {
      setDeclinedMovies(declinedMovies.filter((id) => id !== movieId)); 
    };
  
    return (
      <div className="container">
        <h1>Declined Movies</h1>
        <ul className="list-group">
          {declinedMovies.length === 0 ? (
            <p>No movies have been declined.</p>
          ) : (
            declinedMovies.map((movieId) => (
              <li key={movieId} className="list-group-item">
                Movie ID: {movieId}
                <button onClick={() => handleUndoDecline(movieId)} className="btn btn-warning ms-2">
                  Undo Decline
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    );
  };
  
  export default DeclinedMovies;
  