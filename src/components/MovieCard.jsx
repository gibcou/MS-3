import { getImageUrl } from '../services/movieApi';
import './MovieCard.css';

const MovieCard = ({ movie, onClick }) => {
  const handleClick = () => {
    onClick(movie.id);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(movie.id);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.getFullYear();
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div 
      className="movie-card"
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${movie.title}`}
    >
      <div className="movie-poster">
        {movie.poster_path ? (
          <img
            src={getImageUrl(movie.poster_path)}
            alt={`${movie.title} poster`}
            className="poster-image"
            loading="lazy"
          />
        ) : (
          <div className="poster-placeholder">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6C2 4.89543 2.89543 4 4 4Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 9L21 21L9 9Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15 9H15.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>No Image</span>
          </div>
        )}
        
        <div className="movie-rating">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
        </div>
      </div>
      
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-year">{formatDate(movie.release_date)}</p>
        <p className="movie-overview">{truncateText(movie.overview)}</p>
      </div>
      
      <div className="movie-card-overlay">
        <div className="overlay-content">
          <h3>{movie.title}</h3>
          <p>Click to view details</p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;