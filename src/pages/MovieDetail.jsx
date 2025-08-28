import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, getImageUrl, getImdbUrl } from '../services/movieApi';
import { useUser } from '../contexts/UserContext';
import Login from '../components/Login';
import './MovieDetail.css';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn, addToFavorites, removeFromFavorites, isFavorite, login, logout } = useUser();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMovieDetails();
  }, [id]);

  const loadMovieDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const movieData = await getMovieDetails(id);
      setMovie(movieData);
    } catch (err) {
      console.error('Error loading movie details:', err);
      setError('Failed to load movie details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = () => {
    if (!isLoggedIn) {
      // Show login modal or redirect to login
      const shouldLogin = window.confirm('You need to be logged in to add favorites. Would you like to log in now?');
      if (shouldLogin) {
        // You can implement a login modal here or redirect to login page
        // For now, we'll just show an alert
        alert('Please log in to add movies to your favorites.');
      }
      return;
    }

    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average
      });
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'Unknown';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return 'Unknown';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="movie-detail-loading">
        <div className="spinner"></div>
        <p>Loading movie details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-detail-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')} className="back-button">
          Back to Home
        </button>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-detail-error">
        <h2>Movie Not Found</h2>
        <p>The movie you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/')} className="back-button">
          Back to Home
        </button>
      </div>
    );
  }

  const imdbUrl = getImdbUrl(movie.external_ids?.imdb_id);
  const backdropUrl = movie.backdrop_path ? getImageUrl(movie.backdrop_path) : null;
  const posterUrl = movie.poster_path ? getImageUrl(movie.poster_path) : null;

  return (
    <div className="movie-detail">
      {backdropUrl && (
        <div className="movie-backdrop">
          <img src={backdropUrl} alt={`${movie.title} backdrop`} />
          <div className="backdrop-overlay"></div>
        </div>
      )}

      <div className="movie-content">
        <div className="container">
          <button onClick={handleBackClick} className="back-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            Back
          </button>
          
          <div className="movie-header">
            <div className="movie-poster-large">
              {posterUrl ? (
                <img src={posterUrl} alt={`${movie.title} poster`} />
              ) : (
                <div className="poster-placeholder-large">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                  </svg>
                  <span>No Image Available</span>
                </div>
              )}
            </div>

            <div className="movie-info-main">
              <div className="title-section">
                <h1 className="movie-title-large">{movie.title}</h1>
                {movie.original_title && movie.original_title !== movie.title && (
                  <p className="original-title">({movie.original_title})</p>
                )}
                {movie.tagline && <p className="movie-tagline">"{movie.tagline}"</p>}
              </div>
              
              <div className="movie-meta">
                <div className="meta-item">
                  <div className="meta-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                    </svg>
                  </div>
                  <div className="meta-content">
                    <span className="meta-label">Release Date</span>
                    <span className="meta-value">{formatDate(movie.release_date)}</span>
                  </div>
                </div>
                {movie.spoken_languages && movie.spoken_languages.length > 0 && (
                  <div className="meta-item">
                    <div className="meta-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.01-4.65.51-6.81l-.02-.03L12.87 4l-1.41-1.41L8.54 5.51l-.02-.03c-1.74 1.94-2.01 4.65-.51 6.81l.02.03-2.54 2.51 1.41 1.41 2.54-2.51.02.03c1.74-1.94 2.01-4.65.51-6.81l-.02-.03L12.87 15.07z"/>
                      </svg>
                    </div>
                    <div className="meta-content">
                      <span className="meta-label">Language</span>
                      <span className="meta-value">{movie.spoken_languages[0].english_name}</span>
                    </div>
                  </div>
                )}
              </div>

              {movie.genres && movie.genres.length > 0 && (
                <div className="movie-genres">
                  {movie.genres.map((genre) => (
                    <span key={genre.id} className="genre-tag">
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="movie-actions">
                <button
                  onClick={handleFavoriteToggle}
                  className={`favorite-button ${isFavorite(movie.id) ? 'favorited' : ''}`}
                  title={isFavorite(movie.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d={isFavorite(movie.id) 
                      ? "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      : "M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"
                    }
                    />
                  </svg>
                  {isFavorite(movie.id) ? 'Favorited' : 'Add to Favorites'}
                </button>
                {imdbUrl && (
                  <a
                    href={imdbUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="imdb-button"
                    title="View on IMDb"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" />
                    </svg>
                    View on IMDb
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Movie Statistics Highlights */}
          <div className="movie-highlights">
            <div className="container">
              <div className="highlights-grid">
                <div className="highlight-card">
                  <div className="highlight-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  </div>
                  <div className="highlight-content">
                    <span className="highlight-value">{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                    <span className="highlight-label">Rating</span>
                  </div>
                </div>
                <div className="highlight-card">
                  <div className="highlight-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L20.29,9.12L22,10.83V6H16Z"/>
                    </svg>
                  </div>
                  <div className="highlight-content">
                    <span className="highlight-value">{movie.vote_count ? (movie.vote_count / 1000).toFixed(1) + 'K' : 'N/A'}</span>
                    <span className="highlight-label">Votes</span>
                  </div>
                </div>
                <div className="highlight-card">
                  <div className="highlight-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
                    </svg>
                  </div>
                  <div className="highlight-content">
                    <span className="highlight-value">{formatRuntime(movie.runtime)}</span>
                    <span className="highlight-label">Duration</span>
                  </div>
                </div>
                {movie.budget > 0 && (
                  <div className="highlight-card">
                    <div className="highlight-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/>
                      </svg>
                    </div>
                    <div className="highlight-content">
                      <span className="highlight-value">${(movie.budget / 1000000).toFixed(0)}M</span>
                      <span className="highlight-label">Budget</span>
                    </div>
                  </div>
                )}
                {movie.revenue > 0 && (
                  <div className="highlight-card">
                    <div className="highlight-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/>
                      </svg>
                    </div>
                    <div className="highlight-content">
                      <span className="highlight-value">${(movie.revenue / 1000000).toFixed(0)}M</span>
                      <span className="highlight-label">Box Office</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="movie-details">
            {movie.overview && (
              <div className="detail-section overview-section">
                <h2>Plot Summary</h2>
                <p className="movie-overview-full">
                  {movie.overview}
                </p>
              </div>
            )}

            {movie.credits?.cast && movie.credits.cast.length > 0 && (
              <div className="detail-section cast-section">
                <h2>Full Cast ({movie.credits.cast.length})</h2>
                <div className="cast-scroll-container">
                  <div className="cast-grid">
                    {movie.credits.cast.map((actor) => (
                      <div key={actor.id} className="cast-member" onClick={() => navigate(`/actor/${actor.id}`)}>
                        <div className="cast-photo">
                          {actor.profile_path ? (
                            <img src={getImageUrl(actor.profile_path)} alt={actor.name} />
                          ) : (
                            <div className="cast-photo-placeholder">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="cast-info">
                          <p className="cast-name">{actor.name}</p>
                          <p className="cast-character">{actor.character}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {movie.production_companies && movie.production_companies.length > 0 && (
              <div className="detail-section production-companies-section">
                <h2>Production Companies</h2>
                <div className="production-companies-grid">
                  {movie.production_companies.map((company) => (
                    <div key={company.id} className="production-company-card" onClick={() => navigate(`/production-company/${company.id}/${encodeURIComponent(company.name)}`)}>
                      <div className="company-logo">
                        {company.logo_path ? (
                          <img src={getImageUrl(company.logo_path)} alt={company.name} />
                        ) : (
                          <div className="company-logo-placeholder">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12,7L17,12H14V16H10V12H7L12,7M19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21Z"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="company-info">
                        <h4 className="company-name">{company.name}</h4>
                        {company.origin_country && (
                          <span className="company-country">{company.origin_country}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}


          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;