import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMoviesByGenre } from '../services/movieApi';
import MovieCard from '../components/MovieCard';
import './GenreMovies.css';

const GenreMovies = () => {
  const { genreId, genreName } = useParams();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('popularity.desc');

  useEffect(() => {
    loadGenreMovies();
  }, [genreId, currentPage, sortBy]);

  const loadGenreMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMoviesByGenre(genreId, decodeURIComponent(genreName), currentPage);
      setMovies(data.results || []);
      setTotalPages(data.total_pages || 1);
    } catch (err) {
      setError('Failed to load movies for this genre');
      console.error('Error loading genre movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  if (loading) {
    return (
      <div className="genre-movies-loading">
        <div className="spinner"></div>
        <p>Loading {decodeURIComponent(genreName)} movies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="genre-movies-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="back-button">
          Go Back
        </button>
      </div>
    );
  }

  const decodedGenreName = decodeURIComponent(genreName);

  return (
    <div className="genre-movies">
      <div className="container">
        {/* Header */}
        <div className="genre-header">
          <button onClick={() => navigate(-1)} className="back-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            Back
          </button>
          
          <div className="genre-info">
            <h1 className="genre-title">{decodedGenreName} Movies</h1>
            <p className="genre-subtitle">
              Showing {movies.length} of {totalPages * 20} movies
            </p>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="controls-section">
          <div className="sort-controls">
            <label htmlFor="sort-select">Sort by:</label>
            <select 
              id="sort-select"
              value={sortBy} 
              onChange={(e) => handleSortChange(e.target.value)}
              className="sort-select"
            >
              <option value="popularity.desc">Most Popular</option>
              <option value="release_date.desc">Newest First</option>
              <option value="release_date.asc">Oldest First</option>
              <option value="vote_average.desc">Highest Rated</option>
              <option value="title.asc">Title A-Z</option>
              <option value="title.desc">Title Z-A</option>
            </select>
          </div>
        </div>

        {/* Movies Grid */}
        {movies.length > 0 ? (
          <>
            <div className="movies-grid">
              {movies.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  onClick={handleMovieClick}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                  </svg>
                  Previous
                </button>
                
                <div className="pagination-info">
                  <span className="page-numbers">
                    {Math.max(1, currentPage - 2) !== 1 && (
                      <>
                        <button onClick={() => handlePageChange(1)} className="page-btn">1</button>
                        {Math.max(1, currentPage - 2) > 2 && <span className="ellipsis">...</span>}
                      </>
                    )}
                    
                    {Array.from(
                      { length: Math.min(5, totalPages) },
                      (_, i) => Math.max(1, currentPage - 2) + i
                    )
                      .filter(page => page <= totalPages)
                      .map(page => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`page-btn ${page === currentPage ? 'active' : ''}`}
                        >
                          {page}
                        </button>
                      ))
                    }
                    
                    {Math.min(totalPages, currentPage + 2) !== totalPages && totalPages > 5 && (
                      <>
                        {Math.min(totalPages, currentPage + 2) < totalPages - 1 && <span className="ellipsis">...</span>}
                        <button onClick={() => handlePageChange(totalPages)} className="page-btn">{totalPages}</button>
                      </>
                    )}
                  </span>
                  
                  <span className="page-info">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
                
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Next
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                  </svg>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="no-movies">
            <p>No movies found for the {decodedGenreName} genre.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenreMovies;