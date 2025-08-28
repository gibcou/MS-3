import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMoviesByProductionCompany } from '../services/movieApi';
import MovieCard from '../components/MovieCard';
import './ProductionCompanyMovies.css';

function ProductionCompanyMovies() {
  const { companyId, companyName } = useParams();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('popularity');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await getMoviesByProductionCompany(companyId, companyName, currentPage);
        
        let sortedMovies = [...data.results];
        if (sortBy === 'title') {
          sortedMovies.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy === 'release_date') {
          sortedMovies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
        } else if (sortBy === 'vote_average') {
          sortedMovies.sort((a, b) => b.vote_average - a.vote_average);
        }
        
        setMovies(sortedMovies);
        setTotalPages(Math.min(data.total_pages, 500)); // TMDB limits to 500 pages
        setError(null);
      } catch (err) {
        setError('Failed to load movies');
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [companyId, companyName, currentPage, sortBy]);

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (currentPage > 1) {
      pages.push(
        <button key="prev" onClick={() => handlePageChange(currentPage - 1)} className="pagination-btn">
          ← Previous
        </button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages) {
      pages.push(
        <button key="next" onClick={() => handlePageChange(currentPage + 1)} className="pagination-btn">
          Next →
        </button>
      );
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="production-company-movies">
        <div className="container">
          <div className="loading">Loading movies...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="production-company-movies">
        <div className="container">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="production-company-movies">
      <div className="container">
        <div className="page-header">
          <button className="back-button" onClick={handleBackClick}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
          <h1 className="page-title">{decodeURIComponent(companyName)} Movies</h1>
        </div>

        <div className="controls">
          <div className="sort-controls">
            <label htmlFor="sort-select">Sort by:</label>
            <select 
              id="sort-select"
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="popularity">Popularity</option>
              <option value="title">Title (A-Z)</option>
              <option value="release_date">Release Date (Newest)</option>
              <option value="vote_average">Rating (Highest)</option>
            </select>
          </div>
        </div>

        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onClick={handleMovieClick}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            {renderPagination()}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductionCompanyMovies;