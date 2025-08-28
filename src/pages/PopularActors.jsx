import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPopularActors } from '../services/movieApi';
import './PopularActors.css';

function PopularActors() {
  const navigate = useNavigate();
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchActors = async () => {
      try {
        setLoading(true);
        const data = await getPopularActors(currentPage);
        setActors(data);
        setTotalPages(Math.min(500, 20)); // Limit to reasonable number of pages
        setError(null);
      } catch (err) {
        setError('Failed to load actors');
        console.error('Error fetching actors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActors();
  }, [currentPage]);

  const handleActorClick = (actorId) => {
    navigate(`/actor/${actorId}`);
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
      <div className="popular-actors">
        <div className="container">
          <div className="loading">Loading actors...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="popular-actors">
        <div className="container">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="popular-actors">
      <div className="container">
        <div className="page-header">
          <button className="back-button" onClick={handleBackClick}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
          <h1 className="page-title">Popular Actors</h1>
        </div>

        <div className="actors-grid">
          {actors.map((actor) => (
            <div 
              key={actor.id} 
              className="actor-card"
              onClick={() => handleActorClick(actor.id)}
            >
              <div className="actor-image">
                {actor.profile_path ? (
                  <img 
                    src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
                    alt={actor.name}
                    loading="lazy"
                  />
                ) : (
                  <div className="no-image">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
              <div className="actor-info">
                <h3 className="actor-name">{actor.name}</h3>
                <p className="actor-popularity">Popularity: {actor.popularity.toFixed(1)}</p>
                {actor.known_for && actor.known_for.length > 0 && (
                  <p className="known-for">
                    Known for: {actor.known_for.slice(0, 2).map(movie => movie.title || movie.name).join(', ')}
                  </p>
                )}
              </div>
            </div>
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

export default PopularActors;