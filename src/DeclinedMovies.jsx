import React from "react";

const DeclinedMovies = ({ declinedMovies, setDeclinedMovies }) => {
  const undoDecline = (id) => {
    const updatedDeclinedMovies = declinedMovies.filter((movieId) => movieId !== id);
    setDeclinedMovies(updatedDeclinedMovies);
    // Save the updated list back to localStorage
    localStorage.setItem("declinedMovies", JSON.stringify(updatedDeclinedMovies));
  };

  return (
    <div>
      <h1>Declined Movies</h1>
      {declinedMovies.length === 0 ? (
        <p>No movies have been declined yet.</p>
      ) : (
        <ul>
          {declinedMovies.map((movieId) => (
            <li key={movieId}>
              Movie ID: {movieId}
              <button onClick={() => undoDecline(movieId)} className="btn btn-success ms-2">
                Undo Decline
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DeclinedMovies;
