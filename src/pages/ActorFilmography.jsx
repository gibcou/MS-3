import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMoviesByActor, getImageUrl } from '../services/movieApi';
import MovieCard from '../components/MovieCard';
import './ActorFilmography.css';

const ActorFilmography = () => {
  const { actorId } = useParams();
  const navigate = useNavigate();
  const [actorData, setActorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('popularity'); // popularity, release_date, title

  useEffect(() => {
    loadActorFilmography();
  }, [actorId]);

  const loadActorFilmography = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMoviesByActor(actorId);
      setActorData(data);
    } catch (err) {
      setError('Failed to load actor filmography');
      console.error('Error loading actor filmography:', err);
    } finally {
      setLoading(false);
    }
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

  const getSortedMovies = () => {
    if (!actorData?.movies) return [];
    
    const movies = [...actorData.movies];
    
    switch (sortBy) {
      case 'release_date':
        return movies.sort((a, b) => {
          const dateA = new Date(a.release_date || '1900-01-01');
          const dateB = new Date(b.release_date || '1900-01-01');
          return dateB - dateA; // Most recent first
        });
      case 'title':
        return movies.sort((a, b) => a.title.localeCompare(b.title));
      case 'popularity':
      default:
        return movies.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  if (loading) {
    return (
      <div className="actor-filmography-loading">
        <div className="spinner"></div>
        <p>Loading actor filmography...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="actor-filmography-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="back-button">
          Go Back
        </button>
      </div>
    );
  }

  if (!actorData) {
    return (
      <div className="actor-filmography-error">
        <h2>Actor Not Found</h2>
        <p>The actor you're looking for doesn't exist.</p>
        <button onClick={() => navigate(-1)} className="back-button">
          Go Back
        </button>
      </div>
    );
  }

  const { actor, movies } = actorData;
  const sortedMovies = getSortedMovies();
  const profileUrl = actor.profile_path ? getImageUrl(actor.profile_path) : null;

  return (
    <div className="actor-filmography">
      <div className="container">
        {/* Actor Header */}
        <div className="actor-header">
          <button onClick={() => navigate(-1)} className="back-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            Back
          </button>
          
          <div className="actor-info">
            <div className="actor-photo">
              {profileUrl ? (
                <img src={profileUrl} alt={actor.name} />
              ) : (
                <div className="actor-photo-placeholder">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              )}
            </div>
            
            <div className="actor-details">
              <h1 className="actor-name">{actor.name}</h1>
              {actor.birthday && (
                <p className="actor-birthday">
                  <strong>Born:</strong> {formatDate(actor.birthday)}
                  {actor.place_of_birth && ` in ${actor.place_of_birth}`}
                </p>
              )}
              {actor.biography && (
                <p className="actor-biography">
                  {actor.biography.length > 300 
                    ? `${actor.biography.substring(0, 300)}...` 
                    : actor.biography
                  }
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Movies Section */}
        <div className="movies-section">
          <div className="section-header">
            <h2>Filmography ({movies.length} movies)</h2>
            <div className="sort-controls">
              <label htmlFor="sort-select">Sort by:</label>
              <select 
                id="sort-select"
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="popularity">Popularity</option>
                <option value="release_date">Release Date</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
          
          {sortedMovies.length > 0 ? (
            <div className="movies-grid">
              {sortedMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onClick={handleMovieClick} />
              ))}
            </div>
          ) : (
            <div className="no-movies">
              <p>No movies found for this actor.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActorFilmography;