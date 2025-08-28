import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../services/movieApi';
import './ActorCard.css';

const ActorCard = ({ actor, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(actor);
    } else {
      navigate(`/actor/${actor.id}`);
    }
  };

  const getKnownForText = () => {
    if (actor.known_for && actor.known_for.length > 0) {
      return actor.known_for
        .slice(0, 3)
        .map(item => item.title || item.name)
        .join(', ');
    }
    return 'Actor';
  };

  return (
    <div className="actor-card" onClick={handleClick}>
      <div className="actor-poster">
        {actor.profile_path ? (
          <img
            className="poster-image"
            src={getImageUrl(actor.profile_path)}
            alt={actor.name}
            loading="lazy"
          />
        ) : (
          <div className="poster-placeholder">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <span>No Photo</span>
          </div>
        )}
        
        {actor.popularity && (
          <div className="actor-popularity">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <span>{actor.popularity.toFixed(1)}</span>
          </div>
        )}
      </div>
      
      <div className="actor-info">
        <h3 className="actor-name">{actor.name}</h3>
        <p className="actor-department">{actor.known_for_department || 'Acting'}</p>
        <p className="actor-known-for">{getKnownForText()}</p>
      </div>
      
      <div className="actor-card-overlay">
        <div className="overlay-content">
          <h3>{actor.name}</h3>
          <p>Click to view filmography</p>
        </div>
      </div>
    </div>
  );
};

export default ActorCard;